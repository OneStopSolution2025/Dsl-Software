import { useState, useCallback, useRef, forwardRef, useImperativeHandle, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { APIProvider, Map, useMapsLibrary } from '@vis.gl/react-google-maps';
import IconPalette from '../../components/map/IconPalette';
import MarkerList from '../../components/map/MarkerList';
import CustomMarker from '../../components/map/CustomMarker';
import TransformControls from '../../components/map/TransformControls';
import MapContainer from '../../components/map/MapContainer';
import { setSessionData } from "@/store/slices/filesSlice";
import { RootState } from '@/store';
import { addMarker, deleteMarker, MapMarker, updateMarker } from '@/store/slices/markersSlice';
import html2canvas from 'html2canvas';
import { uploadScreenshotAPI } from "@/utils/api/upload";
import { useFileUpload } from "@/hooks/useFileUpload";
import { generateFileId } from "@/utils/fileHelpers";
import { ServerFile } from '@/types/file.types';
import { getIconByType, isIconColorChangeable } from '../../components/map/enhancedMapIcons';
import { setCanProceed } from '@/store/slices/stepperSlice';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { Search, MapPin, Navigation, X } from 'lucide-react';
import toast from 'react-hot-toast';

const GOOGLE_MAPS_API_KEY = 'AIzaSyCi1g0u1_0qSZ09q8bkkb-7J5cBhi7iK9s';

interface RoadMapRef {
  handleNextWithScreenshot: () => Promise<void>;
}

// Location Search Component with Places Autocomplete
const LocationSearch = ({ mapRef }: { mapRef: React.RefObject<google.maps.Map | null> }) => {
  const places = useMapsLibrary('places');
  const [searchInput, setSearchInput] = useState<string>('');
  const [predictions, setPredictions] = useState<google.maps.places.AutocompletePrediction[]>([]);
  const [showPredictions, setShowPredictions] = useState(false);
  const [autocompleteService, setAutocompleteService] = useState<google.maps.places.AutocompleteService | null>(null);
  const [placesService, setPlacesService] = useState<google.maps.places.PlacesService | null>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  // Initialize Places services
  useEffect(() => {
    if (!places || !mapRef.current) return;

    setAutocompleteService(new places.AutocompleteService());
    setPlacesService(new places.PlacesService(mapRef.current));
  }, [places, mapRef]);

  // Close predictions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowPredictions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle search input change
  const handleSearchChange = (value: string) => {
    setSearchInput(value);

    if (!value.trim() || !autocompleteService) {
      setPredictions([]);
      setShowPredictions(false);
      return;
    }

    // Get autocomplete predictions
    autocompleteService.getPlacePredictions(
      {
        input: value,
        types: ['geocode', 'establishment'],
      },
      (predictions, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && predictions) {
          setPredictions(predictions);
          setShowPredictions(true);
        } else {
          setPredictions([]);
          setShowPredictions(false);
        }
      }
    );
  };

  // Handle place selection
  const handlePlaceSelect = (placeId: string) => {
    if (!placesService || !mapRef.current) return;

    placesService.getDetails(
      {
        placeId: placeId,
        fields: ['geometry', 'name', 'formatted_address'],
      },
      (place, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && place?.geometry?.location) {
          const location = place.geometry.location;
          mapRef.current?.panTo(location);
          mapRef.current?.setZoom(18);

          setSearchInput(place.name || place.formatted_address || '');
          setShowPredictions(false);
          toast.success(`Location found: ${place.name || place.formatted_address}`);
        } else {
          toast.error('Could not retrieve location details');
        }
      }
    );
  };

  // Clear search
  const handleClearSearch = () => {
    setSearchInput('');
    setPredictions([]);
    setShowPredictions(false);
  };

  return (
    <div ref={searchRef} className="relative flex-1">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
        <Input
          type="text"
          placeholder="Search for a location..."
          value={searchInput}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-10 pr-10 text-sm"
          leftIcon={<Search className='text-neutral-600' />}
        />
        {searchInput && (
          <button
            onClick={handleClearSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Autocomplete Predictions Dropdown */}
      {showPredictions && predictions.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-neutral-200 max-h-60 overflow-y-auto z-20">
          {predictions.map((prediction) => (
            <button
              key={prediction.place_id}
              onClick={() => handlePlaceSelect(prediction.place_id)}
              className="w-full px-4 py-3 text-left hover:bg-neutral-50 border-b border-neutral-100 last:border-b-0 transition-colors"
            >
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-primary-500 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-neutral-900 truncate">
                    {prediction.structured_formatting.main_text}
                  </p>
                  <p className="text-xs text-neutral-500 truncate">
                    {prediction.structured_formatting.secondary_text}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export const RoadMap2 = forwardRef<RoadMapRef>((_, ref) => {
  const dispatch = useDispatch();
  const markers = useSelector((state: RootState) => state.markers.markers);
  const [selectedMarkerId, setSelectedMarkerId] = useState<string | undefined>();
  const [draggingIconType, setDraggingIconType] = useState<string | null>(null);
  const [transformControlPos, setTransformControlPos] = useState<{ x: number; y: number, h: number, w: number } | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const { sessionId } = useSelector((state: RootState) => state.files);
  const { handleFilesAdded } = useFileUpload();
  const mapConRef = useRef<HTMLDivElement | null>(null);

  // Lat/Lng search state
  const [latitude, setLatitude] = useState<string>('');
  const [longitude, setLongitude] = useState<string>('');
  const [latError, setLatError] = useState<string>('');
  const [lngError, setLngError] = useState<string>('');
  const [activeSearchTab, setActiveSearchTab] = useState<'address' | 'coordinates'>('address');

  useEffect(() => {
    dispatch(setCanProceed(markers.length > 0))
  }, [dispatch, markers])

  // Validate latitude (-90 to 90)
  const validateLatitude = (value: string): boolean => {
    if (!value.trim()) {
      setLatError('Latitude is required');
      return false;
    }

    const lat = parseFloat(value);
    if (isNaN(lat)) {
      setLatError('Invalid latitude format');
      return false;
    }

    if (lat < -90 || lat > 90) {
      setLatError('Latitude must be between -90 and 90');
      return false;
    }

    setLatError('');
    return true;
  };

  // Validate longitude (-180 to 180)
  const validateLongitude = (value: string): boolean => {
    if (!value.trim()) {
      setLngError('Longitude is required');
      return false;
    }

    const lng = parseFloat(value);
    if (isNaN(lng)) {
      setLngError('Invalid longitude format');
      return false;
    }

    if (lng < -180 || lng > 180) {
      setLngError('Longitude must be between -180 and 180');
      return false;
    }

    setLngError('');
    return true;
  };

  // Handle search by coordinates
  const handleSearchByCoordinates = () => {
    const isLatValid = validateLatitude(latitude);
    const isLngValid = validateLongitude(longitude);

    if (!isLatValid || !isLngValid) {
      toast.error('Please enter valid coordinates');
      return;
    }

    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);

    if (mapRef.current) {
      // Pan and zoom to the coordinates
      mapRef.current.panTo({ lat, lng });
      mapRef.current.setZoom(18);

      toast.success(`Map focused on coordinates: ${lat.toFixed(4)}, ${lng.toFixed(4)}`);
    } else {
      toast.error('Map not ready. Please try again.');
    }
  };

  // Handle Enter key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearchByCoordinates();
    }
  };

  // Get current location
  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser');
      return;
    }

    toast.loading('Getting your location...');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        if (mapRef.current) {
          mapRef.current.panTo({ lat: latitude, lng: longitude });
          mapRef.current.setZoom(18);
          toast.dismiss();
          toast.success(`Location found: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
        }
      },
      (error) => {
        toast.dismiss();
        let errorMessage = 'Failed to get your location';

        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location permission denied';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information unavailable';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out';
            break;
        }

        toast.error(errorMessage);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  const handleDragStart = (iconType: string) => {
    setDraggingIconType(iconType);
  };

  const handleMapReady = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  const handleMapDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleMapDrop = (e: React.DragEvent) => {
    e.preventDefault();

    if (!draggingIconType || !mapRef.current) return;

    const mapDiv = e.currentTarget as HTMLElement;
    const rect = mapDiv.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const bounds = mapRef.current.getBounds();
    if (!bounds) return;

    const ne = bounds.getNorthEast();
    const sw = bounds.getSouthWest();

    const lat = sw.lat() + (ne.lat() - sw.lat()) * (1 - y / rect.height);
    const lng = sw.lng() + (ne.lng() - sw.lng()) * (x / rect.width);

    const newMarker: MapMarker = {
      id: crypto.randomUUID(),
      icon_type: draggingIconType,
      latitude: lat,
      longitude: lng,
      scale: 1.0,
      rotation: 0,
      flip_horizontal: false,
      flip_vertical: false,
      color: getIconByType(draggingIconType)?.defaultColor || '#3B82F6',
    };

    dispatch(addMarker(newMarker));
    setDraggingIconType(null);
  };

  const handleMapClick = (e: google.maps.MapMouseEvent | any) => {
    if (draggingIconType && e.latLng) {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();

      const newMarker: MapMarker = {
        id: crypto.randomUUID(),
        icon_type: draggingIconType,
        latitude: lat,
        longitude: lng,
        scale: 1.0,
        rotation: 0,
        flip_horizontal: false,
        flip_vertical: false,
        color: getIconByType(draggingIconType)?.defaultColor || '#3B82F6',
      };

      dispatch(addMarker(newMarker));
      setDraggingIconType(null);
    } else {
      setSelectedMarkerId(undefined);
      setTransformControlPos(null);
    }
  };

  const handleMarkerClick = useCallback((id: string, event?: any) => {
    setSelectedMarkerId(id);
    if (event && event.domEvent && mapConRef && mapConRef.current) {
      let rect = event.domEvent.currentTarget.getBoundingClientRect();
      let mapCont = mapConRef.current.getBoundingClientRect();
      setTransformControlPos({
        x: event.domEvent.clientX - mapCont.x,
        y: event.domEvent.clientY - mapCont.y + 32,
        h: rect.height,
        w: rect.width
      });
    }
  }, []);

  const handleMarkerDragEnd = (id: string, lat: number, lng: number) => {
    dispatch(updateMarker({ id, updates: { latitude: lat, longitude: lng } }));
  };

  const updateMarkerAction = (id: string, updates: Partial<MapMarker>) => {
    dispatch(updateMarker({ id, updates }));
  };

  const handleRotate = (e: 'cw' | 'ccw') => {
    if (!selectedMarkerId) return;
    const marker = markers.find((m) => m.id === selectedMarkerId);
    if (marker) {
      let rotation = (marker.rotation + 45) % 360;
      if (e == 'ccw') rotation = (marker.rotation - 45) % 360;
      updateMarkerAction(selectedMarkerId, { rotation });
    }
  };

  const handleScaleUp = () => {
    if (!selectedMarkerId) return;
    const marker = markers.find((m) => m.id === selectedMarkerId);
    if (marker && marker.scale < 3) {
      updateMarkerAction(selectedMarkerId, { scale: marker.scale + 0.2 });
    }
  };

  const handleScaleDown = () => {
    if (!selectedMarkerId) return;
    const marker = markers.find((m) => m.id === selectedMarkerId);
    if (marker && marker.scale > 0.4) {
      updateMarkerAction(selectedMarkerId, { scale: marker.scale - 0.2 });
    }
  };

  const handleFlipHorizontal = () => {
    if (!selectedMarkerId) return;
    const marker = markers.find((m) => m.id === selectedMarkerId);
    if (marker) {
      updateMarkerAction(selectedMarkerId, { flip_horizontal: !marker.flip_horizontal });
    }
  };

  const handleFlipVertical = () => {
    if (!selectedMarkerId) return;
    const marker = markers.find((m) => m.id === selectedMarkerId);
    if (marker) {
      updateMarkerAction(selectedMarkerId, { flip_vertical: !marker.flip_vertical });
    }
  };

  const handleColorChange = (color: string) => {
    if (!selectedMarkerId) return;
    updateMarkerAction(selectedMarkerId, { color });
  };

  const handleDelete = () => {
    if (!selectedMarkerId) return;
    dispatch(deleteMarker(selectedMarkerId));
    setSelectedMarkerId(undefined);
    setTransformControlPos(null);
  };

  const handleMarkerListDelete = (id: string) => {
    dispatch(deleteMarker(id));
    if (selectedMarkerId === id) {
      setSelectedMarkerId(undefined);
      setTransformControlPos(null);
    }
  };

  const handleMarkerUpdate = (id: string, updates: Partial<MapMarker>) => {
    dispatch(updateMarker({ id, updates }));
  };

  useImperativeHandle(ref, () => ({
    handleNextWithScreenshot: async () => {
      setTransformControlPos(null);

      if (markers.length === 0) return;

      try {

        // setIsCapturing(true);
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
              // setCaptureError('Failed to upload screenshot. Please try again.');
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
        // setCaptureError('Failed to process screenshot');
      } finally {
        // setIsCapturing(false);
      }
    }
  }));

  // // --- Capture Map Screenshot ---
  const captureMapScreenshot = async (): Promise<File | null> => {
    if (!mapConRef.current || !mapRef) {
      // setCaptureError('Map not available for screenshot');
      return null;
    }

    try {
      // setIsCapturing(true);
      // setCaptureError(null);

      // Configure html2canvas for better map capture
      const canvas = await html2canvas(mapConRef.current, {
        useCORS: true,
        allowTaint: true,
        scale: 1, // Higher resolution
        width: mapConRef.current.offsetWidth,
        height: mapConRef.current.offsetHeight,
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
            // setCaptureError('Failed to create screenshot file');
            resolve(null);
          }
        }, 'image/png', 0.9);
      });
    } catch (error) {
      console.error('Error capturing screenshot:', error);
      // setCaptureError('Failed to capture screenshot');
      return null;
    } finally {
      // setIsCapturing(false);
    }
  };

  return (
    <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
      <div className="h-full flex flex-col bg-gray-50">

        <div className="h-full grid grid-cols-1 md:grid-cols-12 p-4 gap-4 overflow-hidden">
          
          <div className='bg-white rounded-lg shadow-lg md:col-span-3 h-full overflow-scroll'>
            <IconPalette onDragStart={handleDragStart} />
          </div>

          <div className='h-[80%] col-span-9 flex-1'>

            {/* Enhanced Location Search Bar */}
            <div className="bg-white rounded-lg shadow-lg p-4 mb-6">
              <div className="space-y-3">
                {/* Tab Selector */}
                <div className="flex items-center gap-2 border-b border-neutral-200 pb-2">
                  <button
                    onClick={() => setActiveSearchTab('address')}
                    className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${activeSearchTab === 'address'
                      ? 'bg-primary-500 text-white'
                      : 'text-neutral-600 hover:bg-neutral-100'
                      }`}
                  >
                    <Search className="h-3.5 w-3.5 inline mr-1" />
                    Address Search
                  </button>
                  <button
                    onClick={() => setActiveSearchTab('coordinates')}
                    className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${activeSearchTab === 'coordinates'
                      ? 'bg-primary-500 text-white'
                      : 'text-neutral-600 hover:bg-neutral-100'
                      }`}
                  >
                    <MapPin className="h-3.5 w-3.5 inline mr-1" />
                    Coordinates
                  </button>
                  <Button
                    onClick={handleGetCurrentLocation}
                    size="sm"
                    variant="outline"
                    className="ml-auto"
                  >
                    <Navigation className="h-3.5 w-3.5 mr-1" />
                    My Location
                  </Button>
                </div>

                {/* Address Search Tab */}
                {activeSearchTab === 'address' && (
                  <div className="flex items-center gap-2">
                    <LocationSearch mapRef={mapRef} />
                  </div>
                )}

                {/* Coordinates Search Tab */}
                {activeSearchTab === 'coordinates' && (
                  <div className="flex items-start gap-2">
                    <div className="flex-1 grid grid-cols-2 gap-2">
                      <div>
                        <Input
                          type="text"
                          placeholder="Latitude (-90 to 90)"
                          value={latitude}
                          onChange={(e) => {
                            setLatitude(e.target.value);
                            if (latError) validateLatitude(e.target.value);
                          }}
                          onBlur={() => latitude && validateLatitude(latitude)}
                          onKeyPress={handleKeyPress}
                          className={`text-sm ${latError ? 'border-red-500' : ''}`}
                        />
                        {latError && (
                          <p className="text-xs text-red-500 mt-1">{latError}</p>
                        )}
                      </div>
                      <div>
                        <Input
                          type="text"
                          placeholder="Longitude (-180 to 180)"
                          value={longitude}
                          onChange={(e) => {
                            setLongitude(e.target.value);
                            if (lngError) validateLongitude(e.target.value);
                          }}
                          onBlur={() => longitude && validateLongitude(longitude)}
                          onKeyPress={handleKeyPress}
                          className={`text-sm ${lngError ? 'border-red-500' : ''}`}
                        />
                        {lngError && (
                          <p className="text-xs text-red-500 mt-1">{lngError}</p>
                        )}
                      </div>
                    </div>
                    <Button
                      onClick={handleSearchByCoordinates}
                      size="md"
                      variant="primary"
                      className="flex-shrink-0 mt-0"
                    >
                      <Search className="h-4 w-4 mr-1" />
                      Search
                    </Button>
                  </div>
                )}
              </div>
            </div>

            <div ref={mapConRef}
              className="h-full pb-4 rounded-lg overflow-hidden shadow-lg relative"
              style={{ cursor: draggingIconType ? 'crosshair' : 'default' }}
              onDragOver={handleMapDragOver}
              onDrop={handleMapDrop}
            >


              <Map
                defaultCenter={{ lat: 3.1318355, lng: 101.682301 }}
                defaultZoom={24}
                gestureHandling="greedy"
                disableDefaultUI={false}
                onClick={handleMapClick}
                mapId="custom-marker-map"
                mapTypeId={'satellite'}
                
              >
                <MapContainer onMapReady={handleMapReady} />
                {markers.map((marker) => (
                  <CustomMarker
                    key={marker.id}
                    marker={marker}
                    isSelected={marker.id === selectedMarkerId}
                    onClick={(e: any) => handleMarkerClick(marker.id, e)}
                    onDragEnd={(lat, lng) => handleMarkerDragEnd(marker.id, lat, lng)}
                  />
                ))}
              </Map>

              {transformControlPos && selectedMarkerId && (
                <TransformControls
                  position={transformControlPos}
                  onRotate={handleRotate}
                  onScaleUp={handleScaleUp}
                  onScaleDown={handleScaleDown}
                  onFlipHorizontal={handleFlipHorizontal}
                  onFlipVertical={handleFlipVertical}
                  onColorChange={handleColorChange}
                  currentColor={markers.find(m => m.id === selectedMarkerId)?.color}
                  showColorPicker={isIconColorChangeable(markers.find(m => m.id === selectedMarkerId)?.icon_type || '')}
                  onDelete={handleDelete}
                />
              )}
            </div>

          </div>

        </div>

          <div className='col-span-12'>
            <MarkerList
              markers={markers}
              onMarkerClick={(id) => handleMarkerClick(id)}
              onMarkerDelete={handleMarkerListDelete}
              onMarkerUpdate={handleMarkerUpdate}
              selectedMarkerId={selectedMarkerId}
            />
          </div>
        

      </div>
    </APIProvider>
  );
})