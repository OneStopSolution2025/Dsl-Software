import { useEffect, useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { setCanProceed } from '@/store/slices/stepperSlice';
import { useMap } from '@/hooks/useMap';
import { captureMapScreenshot, downloadMapImage, getCurrentLocation } from '@/utils/mapHelpers';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { GOOGLE_MAPS_API_KEY, MARKER_TYPES } from '@/utils/constants';
import { MarkerType } from '@/types/map.types';
import { Button } from '@/components/common/Button';
import { Map as MapIcon, Satellite, Trash2, Download, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';

const mapContainerStyle = {
  width: '100%',
  height: '500px',
};

const defaultCenter = {
  lat: 4.2105,  // Kuala Lumpur, Malaysia
  lng: 101.9758,
};

export const RoadMap = () => {
  const dispatch = useDispatch();
  const { markers, mapType, handleAddMarker, handleClearMarkers, handleUpdateMarkerPosition, toggleMapType } = useMap();
  const [center, setCenter] = useState(defaultCenter);
  const [selectedMarkerType, setSelectedMarkerType] = useState<MarkerType | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);

  useEffect(() => {
    // Get user's current location with improved error handling
    const requestLocation = async () => {
      try {
        toast('Requesting location permission to show your current location on the map...', {
          icon: '📍',
          duration: 3000,
        });
        const location = await getCurrentLocation();
        setCenter(location);
        toast.success('Location detected! Map centered on your current location.');
      } catch (error: any) {
        console.warn('Geolocation failed:', error);

        // Provide specific error messages based on error type
        let errorMessage = 'Could not get your location. Using Malaysia as default.';
        if (error.code === 1) {
          errorMessage = 'Location access denied. Please enable location permissions and refresh the page.';
        } else if (error.code === 2) {
          errorMessage = 'Location unavailable. Please check your GPS/network and try again.';
        } else if (error.code === 3) {
          errorMessage = 'Location request timed out. Using Malaysia as default.';
        }

        toast.error(errorMessage);
        // Keep Malaysia as default center
      }
    };

    // Only request location if geolocation is supported
    if (navigator.geolocation) {
      requestLocation();
    } else {
      toast.error('Geolocation not supported by your browser. Using Malaysia as default.');
    }
  }, []);
  useEffect(() => {
    // Enable next button when at least one marker is added
    dispatch(setCanProceed(markers.length > 0));
  }, [markers.length, dispatch]);

  const handleMarkerRelocate = (markerId: string, lat: number, lng: number) => {
    handleUpdateMarkerPosition(markerId, lat, lng);
  };

  const handleMapClick = (e: google.maps.MapMouseEvent) => {
    if (selectedMarkerType && e.latLng) {
      handleAddMarker(selectedMarkerType, e.latLng.lat(), e.latLng.lng());
      setSelectedMarkerType(null);
      toast.success(`${selectedMarkerType} marker added`);
    }
  };
  const handleMarkerDragStart = (e: React.DragEvent<HTMLDivElement>, markerType: MarkerType) => {
    e.dataTransfer.setData('markerType', markerType);
    e.dataTransfer.effectAllowed = 'copy';
  };

  const handleMapDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const markerType = e.dataTransfer.getData('markerType') as MarkerType;

    if (markerType && mapRef.current) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      try {
        // Convert screen coordinates to LatLng using the map's projection
        const latLng = mapRef.current.getProjection()?.fromPointToLatLng(
          new google.maps.Point(x, y)
        );

        if (latLng) {
          handleAddMarker(markerType, latLng.lat(), latLng.lng());
          toast.success(`${markerType} marker placed at ${latLng.lat().toFixed(4)}, ${latLng.lng().toFixed(4)}`);
        }
      } catch (error) {
        console.error('Error placing marker:', error);
        toast.error('Failed to place marker. Please try again.');
      }
    } else {
      toast.error('Map not ready. Please wait for the map to load.');
    }
  };

  const handleMapDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleLocateMe = async () => {
    try {
      toast('Requesting location permission...', { icon: '📍', duration: 2000 });
      const location = await getCurrentLocation();
      setCenter(location);
      toast.success('Location updated! Map centered on your current location.');
    } catch (error: any) {
      console.warn('Manual location request failed:', error);

      let errorMessage = 'Could not get your location. Please check your permissions.';
      if (error.code === 1) {
        errorMessage = 'Location access denied. Please enable location permissions in your browser.';
      } else if (error.code === 2) {
        errorMessage = 'Location unavailable. Please check your GPS/network connection.';
      }

      toast.error(errorMessage);
    }
  };

  const markerIcons: Record<MarkerType, string> = {
    car: '🚗',
    bike: '🏍️',
    blast: '💥',
    trespasser: '🚶',
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold text-neutral-900 mb-2">Road Map</h3>
        <p className="text-neutral-600">
          Mark incident locations on the map by selecting a marker type and clicking on the map
        </p>
      </div>

      {/* Map Controls */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <Button
            variant={mapType === 'roadmap' ? 'primary' : 'secondary'}
            size="sm"
            onClick={toggleMapType}
            className="flex items-center gap-2"
          >
            <MapIcon className="h-4 w-4" />
            Normal
          </Button>
          <Button
            variant={mapType === 'satellite' ? 'primary' : 'secondary'}
            size="sm"
            onClick={toggleMapType}
            className="flex items-center gap-2"
          >
            <Satellite className="h-4 w-4" />
            Satellite
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleLocateMe}
            className="flex items-center gap-2"
            title="Center map on your current location"
          >
            <MapPin className="h-4 w-4" />
            Locate Me
          </Button>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleClearMarkers()}
            disabled={markers.length === 0}
            className="flex items-center gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Clear
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              if (captureMapScreenshot && downloadMapImage) {
                captureMapScreenshot('map-container').then(downloadMapImage).then(() => {
                  toast.success('Map scene downloaded!');
                }).catch(() => {
                  toast.error('Failed to download map scene');
                });
              }
            }}
            disabled={markers.length === 0}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Download Scene
          </Button>
        </div>
      </div>

      {/* Draggable Marker Palette */}
      <div className="p-4 bg-neutral-50 rounded-lg border border-neutral-200">
        <p className="font-medium text-neutral-700 mb-3">Drag markers to map:</p>
        <div className="flex gap-3">
          {MARKER_TYPES.map((type) => (
            <div
              key={type}
              draggable
              onDragStart={(e) => handleMarkerDragStart(e, type)}
              className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-neutral-300 cursor-move hover:bg-neutral-50 transition-colors hover:shadow-md"
              title={`Drag ${type} marker to map`}
            >
              <span className="text-lg">{markerIcons[type]}</span>
              <span className="font-medium text-neutral-700 capitalize">
                {type}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Map */}
      <div
        id="map-container"
        className="rounded-lg overflow-hidden border-2 border-neutral-200"
        onDrop={handleMapDrop}
        onDragOver={handleMapDragOver}
      >
        {GOOGLE_MAPS_API_KEY ? (
          <LoadScript
            googleMapsApiKey={GOOGLE_MAPS_API_KEY}
            loadingElement={<div className="flex items-center justify-center h-[500px] bg-neutral-100"><p className="text-neutral-500">Loading Google Maps...</p></div>}
            onLoad={() => {
              console.log('LoadScript loaded successfully');
            }}
            onError={(error) => console.error('LoadScript failed to load:', error)}
          >
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              center={center}
              zoom={13}
              mapTypeId={mapType}
              onClick={handleMapClick}
              onLoad={(map) => {
                mapRef.current = map;
                console.log('GoogleMap component loaded successfully');
              }}
              options={{
                streetViewControl: false,
                mapTypeControl: false,
              }}
            >
              {markers.map((marker) => (
                <Marker
                  key={marker.id}
                  position={{ lat: marker.lat, lng: marker.lng }}
                  draggable={true}
                  onDragEnd={(e) => {
                    if (e.latLng) {
                      handleMarkerRelocate(marker.id, e.latLng.lat(), e.latLng.lng());
                    }
                  }}
                  label={{
                    text: markerIcons[marker.type],
                    fontSize: '24px',
                    color: '#2563eb',
                    fontWeight: 'bold',
                  }}
                />
              ))}
            </GoogleMap>
          </LoadScript>
        ) : (
          <div className="flex items-center justify-center h-[500px] bg-neutral-100">
            <div className="text-center">
              <p className="text-neutral-500 font-medium mb-2">
                Google Maps API key not configured
              </p>
              <p className="text-sm text-neutral-400 mb-4">
                Current API Key: {GOOGLE_MAPS_API_KEY ? '✅ Set' : '❌ Not Set'}
              </p>
              <p className="text-sm text-neutral-400">
                Please add VITE_GOOGLE_MAPS_API_KEY to your .env file
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Markers List */}
      {markers.length > 0 && (
        <div className="p-4 bg-neutral-50 rounded-lg border border-neutral-200">
          <p className="font-medium text-neutral-700 mb-2">
            Markers Added ({markers.length}):
          </p>
          <div className="flex flex-wrap gap-2">
            {markers.map((marker) => (
              <span
                key={marker.id}
                className="px-3 py-1 bg-white rounded-full text-sm border border-neutral-300"
              >
                {markerIcons[marker.type]} {marker.type} ({marker.lat.toFixed(4)}, {marker.lng.toFixed(4)})
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
