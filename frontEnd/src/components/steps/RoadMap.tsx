import React, { useEffect, useRef, useState, useImperativeHandle, forwardRef } from "react";
import { Download, LocateFixed, MapIcon, Minus, Plus, Satellite, Trash2, X } from "lucide-react";
import { Button } from "../common/Button";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { setCanProceed } from "@/store/slices/stepperSlice";
import html2canvas from 'html2canvas';
import { setSessionData, updateSessionFromUpload } from "@/store/slices/filesSlice";
import { uploadScreenshotAPI } from "@/utils/api/upload";
import { useFileUpload } from "@/hooks/useFileUpload";
import Popup from "../common/Popup";
import { ServerFile } from "@/types/file.types";
import { generateFileId } from "@/utils/fileHelpers";

type MarkerType = 'car' | 'bike' | 'blast' | 'trespasser' | 'truck' | 'roadblock';

interface RoadMapRef {
  handleNextWithScreenshot: () => Promise<void>;
}

export const RoadMap = forwardRef<RoadMapRef>((props, ref) => {
  const dispatch = useDispatch();
  const mapRef = useRef<HTMLDivElement | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [userLocationMarker, setUserLocationMarker] = useState<{ marker: google.maps.Marker; circle: google.maps.Circle } | null>(null);

  const { sessionId } = useSelector((state: RootState) => state.files);
  const { handleFilesAdded } = useFileUpload();

  // Use Redux state for markers
  const markers = useSelector((state: RootState) => state.markers.items);
  const [mapMarkers, setMapMarkers] = useState<Map<string, google.maps.Marker>>(new Map());
  const [isCapturing, setIsCapturing] = useState(false);
  const [captureError, setCaptureError] = useState<string | null>(null);
  const [mapType, setMapType] = useState<'roadmap' | 'satellite'>('roadmap');
  const iconTypeCountRef = useRef<Record<string, number>>({});

  const icons = [
    { name: "Bike", type: 'bike' as MarkerType, icon: '/icons/bike.png' },
    { name: "Car", type: 'car' as MarkerType, icon: '/icons/car.png' },
    { name: "Truck", type: 'truck' as MarkerType, icon: '/icons/truck.png' },
    { name: "Blast", type: 'blast' as MarkerType, icon: '/icons/blast.png' },
    { name: "Roadblock", type: 'roadblock' as MarkerType, icon: '/icons/roadblock.png' },
    { name: "Trespasser", type: 'trespasser' as MarkerType, icon: '/icons/trespasser.png' }
  ];

  // --- Load Google Maps script ---
  useEffect(() => {
    const existingScript = document.getElementById("googleMapsScript");
    if (existingScript) {
      setIsLoaded(true);
      initMap();
      return;
    }

    const script = document.createElement("script");
    script.id = "googleMapsScript";
    script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      setIsLoaded(true);
      initMap();
    };
    script.onerror = () => {
      console.error('Failed to load Google Maps script');
    };
    document.body.appendChild(script);
  }, []);

  useImperativeHandle(ref, () => ({
    handleNextWithScreenshot: async () => {
      if (markers.length === 0) return;

      try {
        setIsCapturing(true);
        const screenshotFile = await captureMapScreenshot();

        if (screenshotFile) {

          if (sessionId) {
            try {
              // Add screenshot to UploadedFiles
              handleFilesAdded([screenshotFile]);

              const uploadResponse = await uploadScreenshotAPI(screenshotFile, sessionId);

              const resFiles: ServerFile[] = [];
              if (uploadResponse) {
                resFiles.push({
                  id: generateFileId(),
                  name: screenshotFile.name,
                  size: screenshotFile.size,
                  file: screenshotFile,
                  status: 'pending',
                  progress: 0,
                  filename: uploadResponse.filename,
                  gcs_path: uploadResponse.gcs_path,
                  public_url: uploadResponse.public_url
                });
              }

              dispatch(
                setSessionData({
                  sessionId: sessionId || '',
                  userName: uploadResponse.user_name || '',
                  serverFileIds: resFiles,
                  uploadedFiles: []
                })
              );

              console.log('Screenshot uploaded successfully, new session:', uploadResponse.session_id);
            } catch (uploadError) {
              console.error('Screenshot upload failed:', uploadError);
              setCaptureError('Failed to upload screenshot. Please try again.');
              return;
            }
          }

          // Proceed to next step after successful upload
          setTimeout(() => {
            dispatch({ type: 'stepper/nextStep' });
          }, 500);
        }
      } catch (error) {
        console.error('Error in handleNextWithScreenshot:', error);
        setCaptureError('Failed to process screenshot');
      } finally {
        setIsCapturing(false);
      }
    }
  }));

  // Sync Redux markers with map when component mounts or markers change
  useEffect(() => {
    if (map && markers.length > 0) {
      // Clear existing map markers
      mapMarkers.forEach(marker => marker.setMap(null));
      setMapMarkers(new Map());

      // Add Redux markers to map
      markers.forEach(markerData => {
        const marker = new google.maps.Marker({
          position: { lat: markerData.lat, lng: markerData.lng },
          map,
          icon: {
            url: markerData.iconUrl,
            scaledSize: new google.maps.Size(40, 40),
          },
          draggable: true,
          title: `${markerData.type} Marker`,
        });

        // Add drag listener
        marker.addListener('dragend', (e: google.maps.MapMouseEvent) => {
          if (e.latLng) {
            dispatch({
              type: 'markers/updateMarkerPosition',
              payload: { id: markerData.id, lat: e.latLng.lat(), lng: e.latLng.lng() }
            });
          }
        });

        setMapMarkers(prev => new Map(prev.set(markerData.id, marker)));
      });
    }
  }, [map, markers, dispatch]);

  // Re-initialize map when component mounts and Google Maps is loaded
  useEffect(() => {
    if (isLoaded && mapRef.current && !map) {
      initMap();
    }
  }, [isLoaded, map]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Clear user location marker
      if (userLocationMarker) {
        userLocationMarker.marker.setMap(null);
        userLocationMarker.circle.setMap(null);
        setUserLocationMarker(null);
      }
      // Clear map markers
      mapMarkers.forEach(marker => marker.setMap(null));
    };
  }, [userLocationMarker, mapMarkers]);

  // --- Initialize Map ---
  const initMap = () => {
    if (!mapRef.current || !window.google) return;

    const mapInstance = new google.maps.Map(mapRef.current, {
      center: { lat: 4.2105, lng: 101.9758 }, // Malaysia default
      zoom: 12,
      disableDefaultUI: true,
      mapTypeId: mapType,
    });
    setMap(mapInstance);
  };

  // --- Capture Map Screenshot ---
  const captureMapScreenshot = async (): Promise<File | null> => {
    if (!mapRef.current || !map) {
      setCaptureError('Map not available for screenshot');
      return null;
    }

    try {
      setIsCapturing(true);
      setCaptureError(null);

      // Configure html2canvas for better map capture
      const canvas = await html2canvas(mapRef.current, {
        useCORS: true,
        allowTaint: true,
        scale: 2, // Higher resolution
        width: mapRef.current.offsetWidth,
        height: mapRef.current.offsetHeight,
        backgroundColor: '#ffffff',
        logging: false,
        onclone: (clonedDoc) => {
          // Ensure Google Maps renders properly in the cloned document
          const clonedMap = clonedDoc.querySelector('.gm-style') as HTMLElement;
          if (clonedMap) {
            clonedMap.style.transform = 'none';
            clonedMap.style.transition = 'none';
          }
        }
      });

      // Convert canvas to blob
      return new Promise((resolve) => {
        canvas.toBlob((blob) => {
          if (blob) {
            // Create file with timestamp
            const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
            const file = new File([blob], `map-screenshot-${timestamp}.png`, {
              type: 'image/png'
            });
            resolve(file);
          } else {
            setCaptureError('Failed to create screenshot file');
            resolve(null);
          }
        }, 'image/png', 0.9);
      });
    } catch (error) {
      console.error('Error capturing screenshot:', error);
      setCaptureError('Failed to capture screenshot');
      return null;
    } finally {
      setIsCapturing(false);
    }
  };

  useEffect(() => {
    dispatch(setCanProceed(markers.length > 0));
  }, [markers, dispatch]);

  // --- Download Scene functionality ---
  const downloadMapScene = async () => {
    if (!map || !mapRef.current) return;

    try {
      // Configure html2canvas for better map capture
      const canvas = await html2canvas(mapRef.current, {
        useCORS: true,
        allowTaint: true,
        scale: 2, // Higher resolution
        width: mapRef.current.offsetWidth,
        height: mapRef.current.offsetHeight,
        backgroundColor: '#ffffff',
        logging: false,
        onclone: (clonedDoc) => {
          // Ensure Google Maps renders properly in the cloned document
          const clonedMap = clonedDoc.querySelector('.gm-style') as HTMLElement;
          if (clonedMap) {
            clonedMap.style.transform = 'none';
            clonedMap.style.transition = 'none';
          }
        }
      });

      // Convert canvas to data URL
      const imageDataUrl = canvas.toDataURL('image/png', 0.9);

      // Store in session storage
      sessionStorage.setItem('mapScreenshot', imageDataUrl);

      // Create download link with timestamp
      const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
      const link = document.createElement('a');
      link.download = `map-scene-${timestamp}.png`;
      link.href = imageDataUrl;

      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      console.log('Map scene downloaded successfully');
    } catch (error) {
      console.error('Error downloading map scene:', error);
      alert('Failed to download map scene. Please try again.');
    }
  };

  // --- Clear all markers (excluding user location) ---
  const handleClearMarkers = () => {
    // Clear all markers from Redux state (map markers cleanup handled by useEffect)
    dispatch({ type: 'markers/clearMarkers', payload: undefined });

    // Reset icon type counts
    iconTypeCountRef.current = {};

    console.log('All markers cleared from map');
  };

  // --- Change map type ---
  const handleMapTypeChange = (newMapType: 'roadmap' | 'satellite') => {
    if (map) {
      map.setMapTypeId(newMapType);
      setMapType(newMapType);
    }
  };

  const createUserLocationMarker = (lat: number, lng: number) => {
    if (!map || !window.google) return null;

    // Remove existing user location marker and circle
    if (userLocationMarker) {
      userLocationMarker.marker.setMap(null);
      userLocationMarker.circle.setMap(null);
    }

    // Create bright cyan colored marker for user location
    const marker = new google.maps.Marker({
      position: { lat, lng },
      map,
      icon: {
        url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" fill="#00BCD4" stroke="#ffffff" stroke-width="3"/>
                <circle cx="12" cy="12" r="5" fill="#ffffff"/>
                <circle cx="12" cy="12" r="2" fill="#00BCD4"/>
              </svg>
            `)}`,
        scaledSize: new google.maps.Size(24, 24),
        anchor: new google.maps.Point(12, 12),
      },
      title: 'Your Location',
      zIndex: 1000,
    });

    // Create radius circle around the location (100 meters radius)
    const locationCircle = new google.maps.Circle({
      strokeColor: '#00BCD4',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#00BCD4',
      fillOpacity: 0.2,
      map: map,
      center: { lat, lng },
      radius: 100, // 100 meters radius
    });

    // Store both marker and circle for cleanup
    setUserLocationMarker({ marker, circle: locationCircle });

    return marker;
  };

  const removeMarker = (markerId: string) => {
    // Remove marker from Redux state (map marker cleanup handled by useEffect)
    dispatch({ type: 'markers/removeMarker', payload: markerId });

    // Decrement the count for this icon type (if it's a numbered marker)
    const markerToRemove = markers.find(m => m.id === markerId);
    if (markerToRemove) {
      const typeMatch = markerToRemove.type.match(/^(.+?)\s*\((\d+)\)$/);
      if (typeMatch) {
        const [, baseName, number] = typeMatch;
        const count = parseInt(number);
        if (count > 1) {
          iconTypeCountRef.current[baseName] = count - 1;
        } else {
          // If it was the last one with a number, remove the count entry
          delete iconTypeCountRef.current[baseName];
        }
      }
    }
  };

  const handleLocateMe = async () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000,
        });
      });
      const newCenter = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };

      if (map) {
        map.setCenter(newCenter);
        map.setZoom(15); // Zoom in closer when locating user
        createUserLocationMarker(newCenter.lat, newCenter.lng);
      }

    } catch (error: any) {
      console.warn('Location request failed:', error);

      let errorMessage = 'Could not get your location. Please check your browser settings.';
      if (error.code === 1) {
        errorMessage = 'Location access denied. Please enable location permissions in your browser and try again.';
      } else if (error.code === 2) {
        errorMessage = 'Location unavailable. Please check your GPS/network connection.';
      } else if (error.code === 3) {
        errorMessage = 'Location request timed out. Please try again.';
      }

      alert(errorMessage);
    }
  };

  // --- Allow dropping icons ---
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!map || !window.google) return;

    const iconUrl = e.dataTransfer.getData("iconUrl");
    const iconName = e.dataTransfer.getData("iconName") || "Custom Marker";
    const latLng = getLatLngFromEvent(e, map);
    if (!latLng) return;

    // Track icon type count and generate display name
    const currentCount = iconTypeCountRef.current[iconName] || 0;
    iconTypeCountRef.current[iconName] = currentCount + 1;

    // Create unique ID for marker
    const markerId = `marker-${Date.now()}`;

    // Add marker to Redux state
    dispatch({
      type: 'markers/addMarker',
      payload: {
        id: markerId,
        type: iconName as MarkerType,
        lat: latLng.lat(),
        lng: latLng.lng(),
        iconUrl: iconUrl
      }
    });
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  // --- Convert screen position to lat/lng ---
  const getLatLngFromEvent = (
    e: React.DragEvent<HTMLDivElement>,
    map: google.maps.Map
  ): google.maps.LatLng | null => {
    if (!window.google) return null;

    const projection = map.getProjection?.();
    const bounds = map.getBounds?.();
    if (!bounds || !projection) return null;

    if (!mapRef.current) return null;
    const rect = mapRef.current.getBoundingClientRect();

    const topRight = projection.fromLatLngToPoint(bounds.getNorthEast());
    const bottomLeft = projection.fromLatLngToPoint(bounds.getSouthWest());

    if (!topRight || !bottomLeft) return null;

    const x = ((e.clientX - rect.left) / rect.width) * (topRight.x - bottomLeft.x) + bottomLeft.x;
    const y = ((e.clientY - rect.top) / rect.height) * (topRight.y - bottomLeft.y) + bottomLeft.y;

    const point = new google.maps.Point(x, y);
    return projection.fromPointToLatLng(point);
  };

  if (!isLoaded) {
    return (
      <div style={{ width: "100%", height: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p>Loading Google Maps...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl text-neutral-900 mb-2">Road Map</h3>
        <p className="text-neutral-600">
          Mark incident locations on the map by selecting a marker type and clicking on the map
        </p>
      </div>

      {/* Map Controls */}
      <div className="flex md:flex-row flex-col md:items-center items-start justify-between gap-4">

        <div className="flex gap-2">

          <Button
            variant={mapType === 'roadmap' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => handleMapTypeChange('roadmap')}
            className="flex items-center gap-2"
          >
            <MapIcon className="h-4 w-4" />
            Normal
          </Button>

          <Button
            variant={mapType === 'satellite' ? 'primary' : 'secondary'}
            size="sm"
            onClick={() => handleMapTypeChange('satellite')}
            className="flex items-center gap-2"
          >
            <Satellite className="h-4 w-4" />
            Satellite
          </Button>


        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleClearMarkers}
            disabled={markers.length === 0}
            className="flex items-center gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Clear
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={downloadMapScene}
            disabled={markers.length === 0}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Download Scene
          </Button>
        </div>
      </div>

      {/* Draggable Icons */}
      <div className="space-y-4">
        <div className="flex flex-col gap-3 p-3  rounded-lg border border-neutral-200">
          <div style={{ marginBottom: 10 }}>
            <h4>Drag an icon onto the map:</h4>
          </div>
          <div className="flex gap-2">
            {icons.map((iconData) => (
              <Popup content={iconData.name} position="bottom">

                <div key={iconData.type} className="text-center border border-neutral-200 p-2 rounded w-14 aspect-square bg-white">
                  <img
                    src={iconData.icon}
                    alt={`${iconData.name} marker`}
                    draggable
                    onDragStart={(e) => {
                      e.dataTransfer.setData("iconUrl", iconData.icon);
                      e.dataTransfer.setData("iconName", iconData.name);
                    }}
                    className="w-8 h-8 cursor-grab active:cursor-grabbing hover:scale-110 transition-transform mx-auto mb-1"
                    style={{
                      filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
                    }}
                  />
                  {/* <span className="text-xs text-neutral-600 capitalize md:block hidden">{iconData.type}</span> */}
                </div>

              </Popup>
            ))}
          </div>
        </div>
      </div>

      {/* Google Map container */}
      <div className="rounded-lg overflow-hidden border-2 border-neutral-200 h-[50vh] relative">
        <div
          ref={mapRef}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          style={{ width: "100%", height: "100%", position: "relative" }}
        />

        <div className="absolute bottom-2 right-2 flex flex-col gap-1">
          <button className="bg-white shadow rounded aspect-square w-10 px-2 text-blue-500"
            onClick={handleLocateMe}>
            <LocateFixed size={'small'} />
          </button>

          <button className="bg-white shadow rounded aspect-square w-10 px-2"
            onClick={() => {
              if (map) {
                const currentZoom = map.getZoom() || 12;
                map.setZoom(currentZoom + 1);
              }
            }}>
            <Plus size={'small'} />
          </button>
          <button className="bg-white shadow rounded aspect-square w-10 px-2"
            onClick={() => {
              if (map) {
                const currentZoom = map.getZoom() || 12;
                map.setZoom(currentZoom - 1);
              }
            }}>
            <Minus size={'small'} />
          </button>
        </div>
      </div>

      {/* Error Display */}
      {captureError && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{captureError}</p>
        </div>
      )}

      {/* Loading State for Screenshot */}
      {isCapturing && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-600">Capturing screenshot...</p>
        </div>
      )}

      {markers.length > 0 && (
        <div className="flex flex-wrap gap-3 p-3 rounded-lg border border-neutral-200">
          {markers.map(mark => (
            <div key={mark.id} className="flex justify-between items-center gap-2 border border-neutral-200 rounded-full p-2 w-fit bg-white">
              <img src={mark.iconUrl} alt={mark.type} width={20} />
              <p className="text-xs text-neutral-600 leading-4">{mark.lat.toFixed(4)}</p>
              <p className="text-xs text-neutral-600 leading-4">{mark.lng.toFixed(4)}</p>

              <button onClick={() => removeMarker(mark.id)} className="text-red-500 text-xs w-4">
                <X size={'small'} />
              </button>
            </div>
          ))}
        </div>
      )}

    </div>
  );
});
