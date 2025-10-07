import { useEffect, useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { setCanProceed } from '@/store/slices/stepperSlice';
import { useMap } from '@/hooks/useMap';
import { captureMapScreenshot, downloadMapImage, getCurrentLocation } from '@/utils/mapHelpers';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { GOOGLE_MAPS_API_KEY, MARKER_TYPES } from '@/utils/constants';
import { MarkerType } from '@/types/map.types';
import { Button } from '@/components/common/Button';
import { Map as MapIcon, Satellite, Trash2, Download, MapPin, X } from 'lucide-react';
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
  const { markers, mapType, handleAddMarker, handleClearMarkers, handleUpdateMarkerPosition, handleRemoveMarker, toggleMapType } = useMap();
  const [center, setCenter] = useState(defaultCenter);
  const [selectedMarkerType, setSelectedMarkerType] = useState<MarkerType | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const locationRequestedRef = useRef(false);

  useEffect(() => {
    // Only request location once when component first mounts
    if (!locationRequestedRef.current) {
      locationRequestedRef.current = true;

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
      toast.success(`${selectedMarkerType} marker added at ${e.latLng.lat().toFixed(4)}, ${e.latLng.lng().toFixed(4)}`);
    }
  };
  const handleLocateMe = async () => {
    try {
      toast('Requesting location permission...', { icon: '📍', duration: 2000 });
      const location = await getCurrentLocation();
      setCenter(location);
      toast.success(`Location updated! Map centered on your current location at ${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}.`);
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

      {/* Marker Placement Section */}
      <div className="p-4 bg-neutral-50 rounded-lg border border-neutral-200">
        <div className="mb-4">
          <h4 className="font-medium text-neutral-700 mb-2">Add Markers to Map</h4>
          <div className="text-sm text-neutral-600 space-y-1">
            <p><strong>How to use:</strong></p>
            <p>1. Click a marker type below (🚗 Car, 🏍️ Bike, 💥 Blast, 🚶 Trespasser)</p>
            <p>2. Click on the map where you want to place it</p>
            <p>3. Marker will appear with coordinates</p>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium text-neutral-600">Select marker type, then click on map:</p>
          <div className="flex gap-2">
            {MARKER_TYPES.map((type) => (
              <button
                key={type}
                onClick={() => setSelectedMarkerType(selectedMarkerType === type ? null : type)}
                className={`flex items-center gap-1 px-3 py-2 rounded-lg border transition-colors ${
                  selectedMarkerType === type
                    ? 'bg-primary-500 text-white border-primary-500'
                    : 'bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-50'
                }`}
                title={`Select ${type} marker, then click on map`}
              >
                <span className="text-lg">{markerIcons[type]}</span>
                <span className="text-sm font-medium capitalize">
                  {type}
                </span>
              </button>
            ))}
          </div>
          {selectedMarkerType && (
            <p className="text-xs text-primary-600 font-medium">
              ✓ Selected: {selectedMarkerType}. Click on map to place marker.
            </p>
          )}
        </div>
      </div>

      {/* Map */}
      <div
        id="map-container"
        className="rounded-lg overflow-hidden border-2 border-neutral-200"
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
                // Force a re-render after map loads to ensure markers appear
                setTimeout(() => {
                  // Trigger a state update to force marker re-render
                  setCenter(prev => ({ ...prev }));
                }, 100);
              }}
              options={{
                streetViewControl: false,
                mapTypeControl: false,
              }}
            >
              {markers.length > 0 && (
                <div style={{ position: 'absolute', top: '10px', right: '10px', background: 'white', padding: '10px', borderRadius: '5px', zIndex: 1000 }}>
                  <p>Markers: {markers.length}</p>
                  {markers.map(marker => (
                    <p key={marker.id}>📍 {marker.type} at {marker.lat.toFixed(4)}, {marker.lng.toFixed(4)}</p>
                  ))}
                </div>
              )}
              {markers.map((marker) => (
                <Marker
                  key={marker.id}
                  position={{ lat: marker.lat, lng: marker.lng }}
                  draggable={true}
                  onDragEnd={(e) => {
                    if (e.latLng) {
                      console.log(`📍 Marker ${marker.id} moved to ${e.latLng.lat()}, ${e.latLng.lng()}`);
                      handleMarkerRelocate(marker.id, e.latLng.lat(), e.latLng.lng());
                    }
                  }}
                  onLoad={() => {
                    console.log(`✅ Marker ${marker.id} (${marker.type}) loaded at ${marker.lat}, ${marker.lng}`);
                  }}
                  onDragStart={() => {
                    console.log(`🔄 Marker ${marker.id} drag started`);
                  }}
                  // Enhanced marker design - screenshot-friendly
                  icon={{
                    url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
                      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
                        <circle cx="16" cy="16" r="14" fill="#10b981" stroke="#ffffff" stroke-width="2"/>
                        <text x="16" y="21" text-anchor="middle" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="#ffffff">
                          ${markerIcons[marker.type]}
                        </text>
                      </svg>
                    `)}`,
                    scaledSize: new google.maps.Size(32, 32),
                    anchor: new google.maps.Point(16, 16),
                  }}
                  label={{
                    text: markerIcons[marker.type],
                    fontSize: '16px',
                    fontWeight: 'bold',
                    color: '#ffffff',
                    fontFamily: 'Arial, sans-serif',
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
              <div
                key={marker.id}
                className="flex items-center gap-2 px-3 py-1 bg-white rounded-full text-sm border border-neutral-300"
              >
                <span>{markerIcons[marker.type]} {marker.type}</span>
                <span className="text-neutral-500">({marker.lat.toFixed(4)}, {marker.lng.toFixed(4)})</span>
                <button
                  onClick={() => handleRemoveMarker(marker.id)}
                  className="ml-1 p-1 hover:bg-red-100 rounded-full transition-colors"
                  title={`Remove ${marker.type} marker`}
                >
                  <X className="h-3 w-3 text-red-500" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
