import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setCanProceed } from '@/store/slices/stepperSlice';
import { useMap } from '@/hooks/useMap';
import { captureMapScreenshot, downloadMapImage, getCurrentLocation } from '@/utils/mapHelpers';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { GOOGLE_MAPS_API_KEY, MARKER_TYPES } from '@/utils/constants';
import { MarkerType } from '@/types/map.types';
import { Button } from '@/components/common/Button';
import { Map as MapIcon, Satellite, Trash2, Download } from 'lucide-react';
import toast from 'react-hot-toast';

const mapContainerStyle = {
  width: '100%',
  height: '500px',
};

const defaultCenter = {
  lat: 40.7128,
  lng: -74.0060,
};

export const RoadMap = () => {
  const dispatch = useDispatch();
  const { markers, mapType, handleAddMarker, handleClearMarkers, toggleMapType } = useMap();
  const [center, setCenter] = useState(defaultCenter);
  const [selectedMarkerType, setSelectedMarkerType] = useState<MarkerType | null>(null);

  useEffect(() => {
    // Get user's current location
    getCurrentLocation()
      .then((location) => {
        setCenter(location);
      })
      .catch(() => {
        toast.error('Could not get your location. Using default location.');
      });
  }, []);

  useEffect(() => {
    // Enable next button when at least one marker is added
    dispatch(setCanProceed(markers.length > 0));
  }, [markers.length, dispatch]);

  const handleMapClick = (e: google.maps.MapMouseEvent) => {
    if (selectedMarkerType && e.latLng) {
      handleAddMarker(selectedMarkerType, e.latLng.lat(), e.latLng.lng());
      setSelectedMarkerType(null);
      toast.success(`${selectedMarkerType} marker added`);
    }
  };

  const handleDownloadScene = async () => {
    try {
      const dataUrl = await captureMapScreenshot('map-container');
      downloadMapImage(dataUrl);
      toast.success('Map scene downloaded!');
    } catch (error) {
      toast.error('Failed to download map scene');
    }
  };

  const handleClear = () => {
    handleClearMarkers();
    toast.success('All markers cleared');
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
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleClear}
            disabled={markers.length === 0}
            className="flex items-center gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Clear
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownloadScene}
            disabled={markers.length === 0}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Download Scene
          </Button>
        </div>
      </div>

      {/* Marker Selection */}
      <div className="flex gap-3 p-4 bg-neutral-50 rounded-lg border border-neutral-200">
        <p className="font-medium text-neutral-700">Select marker:</p>
        {MARKER_TYPES.map((type) => (
          <button
            key={type}
            onClick={() => setSelectedMarkerType(type)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              selectedMarkerType === type
                ? 'bg-primary-500 text-white shadow-lg'
                : 'bg-white text-neutral-700 hover:bg-neutral-100 border border-neutral-300'
            }`}
          >
            <span className="mr-2">{markerIcons[type]}</span>
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>

      {/* Map */}
      <div id="map-container" className="rounded-lg overflow-hidden border-2 border-neutral-200">
        {GOOGLE_MAPS_API_KEY ? (
          <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY}>
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              center={center}
              zoom={13}
              mapTypeId={mapType}
              onClick={handleMapClick}
              options={{
                streetViewControl: false,
                mapTypeControl: false,
              }}
            >
              {markers.map((marker) => (
                <Marker
                  key={marker.id}
                  position={{ lat: marker.lat, lng: marker.lng }}
                  label={{
                    text: markerIcons[marker.type],
                    fontSize: '24px',
                  }}
                  icon={{
                    url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(
                      `<svg xmlns="http://www.w3.org/2000/svg" width="1" height="1"></svg>`
                    ),
                  }}
                />
              ))}
            </GoogleMap>
          </LoadScript>
        ) : (
          <div className="flex items-center justify-center h-[500px] bg-neutral-100">
            <p className="text-neutral-500">
              Google Maps API key not configured. Please add VITE_GOOGLE_MAPS_API_KEY to your .env file.
            </p>
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
