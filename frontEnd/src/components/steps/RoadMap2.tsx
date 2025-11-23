import { useState, useCallback, useRef, forwardRef, useImperativeHandle, useEffect, createRef } from 'react';
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
import { Search, MapPin, Navigation, X, RefreshCw, Camera } from 'lucide-react';
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
  const markerRefs = useRef<Record<string, React.RefObject<HTMLDivElement>>>({});
  const [isDragging, setIsDragging] = useState(false);
  const [boxDimensions, setBoxDimensions] = useState<{left: number; top: number; width: number; height: number; rotation: number} | null>(null);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeStartPos, setResizeStartPos] = useState<{x: number; y: number; initialScale: number; handle: string} | null>(null);
  const [isRotating, setIsRotating] = useState(false);
  const [rotateStartPos, setRotateStartPos] = useState<{x: number; y: number; initialRotation: number} | null>(null);
  const [mapTypeId, setMapTypeId] = useState<'satellite' | 'roadmap' | 'hybrid' | 'terrain'>('terrain');

  // Lat/Lng search state
  const [latitude, setLatitude] = useState<string>('');
  const [longitude, setLongitude] = useState<string>('');
  const [latError, setLatError] = useState<string>('');
  const [lngError, setLngError] = useState<string>('');
  const [activeSearchTab, setActiveSearchTab] = useState<'address' | 'coordinates'>('address');

  useEffect(() => {
    dispatch(setCanProceed(markers.length > 0))
  }, [dispatch, markers])

  // Initialize refs for each marker
  useEffect(() => {
    markers.forEach((marker) => {
      if (!markerRefs.current[marker.id]) {
        markerRefs.current[marker.id] = createRef<HTMLDivElement>();
      }
    });

    // Clean up refs for removed markers
    Object.keys(markerRefs.current).forEach((markerId) => {
      if (!markers.find((m) => m.id === markerId)) {
        delete markerRefs.current[markerId];
      }
    });
  }, [markers]);

  // Update box dimensions when selected marker or its transforms change
  useEffect(() => {
    if (!selectedMarkerId || (isDragging && !isResizing && !isRotating)) {
      setBoxDimensions(null);
      return;
    }

    const updateBoxDimensions = () => {
      const markerElement = markerRefs.current[selectedMarkerId]?.current;
      const mapElement = mapConRef.current;
      const marker = markers.find(m => m.id === selectedMarkerId);
      
      if (!markerElement || !mapElement || !marker) {
        setBoxDimensions(null);
        return;
      }

      // Don't show selection box for text callouts
      if (marker.icon_type.startsWith('text-callout')) {
        setBoxDimensions(null);
        return;
      }

      const rect = markerElement.getBoundingClientRect();
      const mapRect = mapElement.getBoundingClientRect();
      
      // Base icon size is 36px + padding (16px each side = 32px)
      const baseSize = 36 + 32;
      
      // Calculate actual dimensions with scale applied
      const scaledWidth = baseSize * marker.scale;
      const scaledHeight = baseSize * marker.scale;
      
      // Calculate center position
      const centerX = rect.left - mapRect.left + (rect.width / 2);
      const centerY = rect.top - mapRect.top + (rect.height / 2);
      
      setBoxDimensions({
        left: centerX - (scaledWidth / 2),
        top: centerY - (scaledHeight / 2),
        width: scaledWidth,
        height: scaledHeight,
        rotation: marker.rotation,
      });
    };

    // Update immediately
    updateBoxDimensions();

    // Update on animation frame for smooth updates during transforms
    const animationFrame = requestAnimationFrame(updateBoxDimensions);

    return () => cancelAnimationFrame(animationFrame);
  }, [selectedMarkerId, markers, isDragging]);

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
    
    // Listen for map type changes
    map.addListener('maptypeid_changed', () => {
      const newMapTypeId = map.getMapTypeId() as 'satellite' | 'roadmap' | 'hybrid' | 'terrain';
      setMapTypeId(newMapTypeId);
    });
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

    const isTextCallout = draggingIconType.startsWith('text-callout');
    
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
      // Initialize text callout properties
      ...(isTextCallout && {
        text: '',
        fontSize: 16,
        fontWeight: 'normal' as const,
        backgroundColor: '#FFFFFF',
        borderColor: undefined,
        calloutStyle: (
          draggingIconType === 'text-callout-speech' ? 'speech-bubble' :
          draggingIconType === 'text-callout-cloud' ? 'cloud' :
          'rectangular'
        ) as 'speech-bubble' | 'rectangular' | 'cloud',
      }),
    };

    dispatch(addMarker(newMarker));
    setDraggingIconType(null);
  };

  const handleMapClick = (e: google.maps.MapMouseEvent | any) => {
    if (draggingIconType && e.latLng) {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();

      const isTextCallout = draggingIconType.startsWith('text-callout');

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
        // Initialize text callout properties
        ...(isTextCallout && {
          text: '',
          fontSize: 16,
          fontWeight: 'normal' as const,
          backgroundColor: '#FFFFFF',
          borderColor: undefined,
          calloutStyle: (
            draggingIconType === 'text-callout-speech' ? 'speech-bubble' :
            draggingIconType === 'text-callout-cloud' ? 'cloud' :
            'rectangular'
          ) as 'speech-bubble' | 'rectangular' | 'cloud',
        }),
      };

      dispatch(addMarker(newMarker));
      setDraggingIconType(null);
    } else if (!isResizing && !isRotating) {
      // Only deselect if not currently resizing or rotating
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

  // Handle resize corner drag
  const handleResizeStart = (e: React.MouseEvent, handle: string) => {
    e.stopPropagation();
    if (!selectedMarkerId) return;
    
    const marker = markers.find((m) => m.id === selectedMarkerId);
    if (!marker) return;

    setIsResizing(true);
    setResizeStartPos({
      x: e.clientX,
      y: e.clientY,
      initialScale: marker.scale,
      handle: handle,
    });
  };

  const handleResizeMove = useCallback((e: MouseEvent) => {
    if (!isResizing || !resizeStartPos || !selectedMarkerId || !boxDimensions) return;

    const marker = markers.find((m) => m.id === selectedMarkerId);
    if (!marker) return;

    const handle = resizeStartPos.handle;
    const deltaX = e.clientX - resizeStartPos.x;
    const deltaY = e.clientY - resizeStartPos.y;
    
    // Calculate center of the box
    const centerX = boxDimensions.left + boxDimensions.width / 2;
    const centerY = boxDimensions.top + boxDimensions.height / 2;
    
    // Get map container for relative positioning
    const mapElement = mapConRef.current;
    if (!mapElement) return;
    const mapRect = mapElement.getBoundingClientRect();
    
    // Current mouse position relative to map
    const currentMouseX = e.clientX - mapRect.left;
    const currentMouseY = e.clientY - mapRect.top;
    
    // Vector from center to current mouse position
    const vectorX = currentMouseX - centerX;
    const vectorY = currentMouseY - centerY;
    
    let scaleDelta = 0;
    
    // Handle edge scaling (X or Y direction only)
    if (handle === 'top' || handle === 'bottom' || handle === 'left' || handle === 'right') {
      // For edge handles, calculate movement perpendicular to the edge
      let movement = 0;
      
      if (handle === 'top') {
        // Top edge: negative Y means outward (scale up)
        movement = -deltaY;
      } else if (handle === 'bottom') {
        // Bottom edge: positive Y means outward (scale up)
        movement = deltaY;
      } else if (handle === 'left') {
        // Left edge: negative X means outward (scale up)
        movement = -deltaX;
      } else if (handle === 'right') {
        // Right edge: positive X means outward (scale up)
        movement = deltaX;
      }
      
      // Scale factor: 50px movement = 0.5 scale change
      scaleDelta = (movement / 50) * 0.5;
    } else {
      // Corner handles: proportional scaling based on distance from center
      const initialDistance = Math.sqrt(
        Math.pow(resizeStartPos.x - mapRect.left - centerX, 2) +
        Math.pow(resizeStartPos.y - mapRect.top - centerY, 2)
      );
      const currentDistance = Math.sqrt(vectorX * vectorX + vectorY * vectorY);
      
      // Calculate scale based on distance ratio
      scaleDelta = ((currentDistance - initialDistance) / 100) * 0.5;
    }
    
    const newScale = Math.max(0.4, Math.min(3, resizeStartPos.initialScale + scaleDelta));
    updateMarkerAction(selectedMarkerId, { scale: newScale });
  }, [isResizing, resizeStartPos, selectedMarkerId, markers, boxDimensions]);

  const handleResizeEnd = useCallback(() => {
    setIsResizing(false);
    setResizeStartPos(null);
  }, []);

  // Add mouse event listeners for resizing
  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleResizeMove);
      document.addEventListener('mouseup', handleResizeEnd);
      return () => {
        document.removeEventListener('mousemove', handleResizeMove);
        document.removeEventListener('mouseup', handleResizeEnd);
      };
    }
  }, [isResizing, handleResizeMove, handleResizeEnd]);

  // Handle rotation
  const handleRotateStart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!selectedMarkerId || !boxDimensions) return;
    
    const marker = markers.find((m) => m.id === selectedMarkerId);
    if (!marker) return;

    setIsRotating(true);
    setRotateStartPos({
      x: e.clientX,
      y: e.clientY,
      initialRotation: marker.rotation,
    });
  };

  const handleRotateMove = useCallback((e: MouseEvent) => {
    if (!isRotating || !rotateStartPos || !selectedMarkerId || !boxDimensions) return;

    const marker = markers.find((m) => m.id === selectedMarkerId);
    if (!marker) return;

    // Get map container for relative positioning
    const mapElement = mapConRef.current;
    if (!mapElement) return;
    const mapRect = mapElement.getBoundingClientRect();

    // Calculate center of the box
    const centerX = boxDimensions.left + boxDimensions.width / 2;
    const centerY = boxDimensions.top + boxDimensions.height / 2;

    // Current mouse position relative to map
    const currentMouseX = e.clientX - mapRect.left;
    const currentMouseY = e.clientY - mapRect.top;

    // Calculate current angle from center to mouse position
    const currentAngle = Math.atan2(
      currentMouseY - centerY,
      currentMouseX - centerX
    ) * (180 / Math.PI);

    // Calculate initial angle from center to start position
    const startMouseX = rotateStartPos.x - mapRect.left;
    const startMouseY = rotateStartPos.y - mapRect.top;
    const startAngle = Math.atan2(
      startMouseY - centerY,
      startMouseX - centerX
    ) * (180 / Math.PI);

    // Calculate the rotation delta (how much the mouse has rotated)
    let angleDelta = currentAngle - startAngle;
    
    // Handle wraparound at 180/-180 boundary
    if (angleDelta > 180) angleDelta -= 360;
    if (angleDelta < -180) angleDelta += 360;

    // Apply delta to initial rotation to maintain continuity
    let newRotation = rotateStartPos.initialRotation + angleDelta;
    
    // Normalize to 0-360 range without losing precision
    newRotation = ((newRotation % 360) + 360) % 360;

    updateMarkerAction(selectedMarkerId, { rotation: newRotation });
  }, [isRotating, rotateStartPos, selectedMarkerId, markers, boxDimensions]);

  const handleRotateEnd = useCallback(() => {
    setIsRotating(false);
    setRotateStartPos(null);
  }, []);

  // Add mouse event listeners for rotation
  useEffect(() => {
    if (isRotating) {
      document.addEventListener('mousemove', handleRotateMove);
      document.addEventListener('mouseup', handleRotateEnd);
      return () => {
        document.removeEventListener('mousemove', handleRotateMove);
        document.removeEventListener('mouseup', handleRotateEnd);
      };
    }
  }, [isRotating, handleRotateMove, handleRotateEnd]);

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

  // Text callout specific handlers
  const handleTextChange = (text: string) => {
    if (!selectedMarkerId) return;
    updateMarkerAction(selectedMarkerId, { text });
  };

  const handleFontSizeChange = (fontSize: number) => {
    if (!selectedMarkerId) return;
    updateMarkerAction(selectedMarkerId, { fontSize });
  };

  const handleFontWeightChange = (fontWeight: 'normal' | 'bold' | 'semibold') => {
    if (!selectedMarkerId) return;
    updateMarkerAction(selectedMarkerId, { fontWeight });
  };

  const handleCalloutStyleChange = (calloutStyle: 'speech-bubble' | 'rectangular' | 'cloud') => {
    if (!selectedMarkerId) return;
    updateMarkerAction(selectedMarkerId, { calloutStyle });
  };

  const handleBackgroundColorChange = (backgroundColor: string) => {
    if (!selectedMarkerId) return;
    updateMarkerAction(selectedMarkerId, { backgroundColor });
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
                  sessionId: sessionId || '', // Keep our existing session ID (don't update from API)
                  userName: uploadResponse.user_name || '',
                  serverFileIds: resFiles,
                  uploadedFiles: []
                })
              );

              console.log('Screenshot uploaded successfully. Using session:', sessionId);
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

  // Download screenshot as PNG
  const handleDownloadScreenshot = async () => {
    try {
      // Deselect any selected marker to hide dashed box and transform controls
      setSelectedMarkerId(undefined);
      setTransformControlPos(null);
      setBoxDimensions(null);
      
      // Wait a brief moment for the UI to update
      await new Promise(resolve => setTimeout(resolve, 100));
      
      toast.loading('Capturing screenshot...');
      const screenshotFile = await captureMapScreenshot();
      
      if (screenshotFile) {
        // Create download link
        const url = URL.createObjectURL(screenshotFile);
        const link = document.createElement('a');
        link.href = url;
        link.download = screenshotFile.name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        toast.dismiss();
        toast.success('Screenshot downloaded successfully!');
      } else {
        toast.dismiss();
        toast.error('Failed to capture screenshot');
      }
    } catch (error) {
      console.error('Error downloading screenshot:', error);
      toast.dismiss();
      toast.error('Failed to download screenshot');
    }
  };

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
                  <Button
                    onClick={handleDownloadScreenshot}
                    size="sm"
                    variant="primary"
                  >
                    <Camera className="h-3.5 w-3.5 mr-1" />
                    Take a Screenshot
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
              className="h-full pb-4 rounded-lg shadow-lg relative"
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
                mapTypeId={mapTypeId}
                
              >
                <MapContainer onMapReady={handleMapReady} />
                {markers.map((marker) => {
                  if (!markerRefs.current[marker.id]) {
                    markerRefs.current[marker.id] = createRef<HTMLDivElement>();
                  }
                  return (
                    <CustomMarker
                      key={marker.id}
                      ref={markerRefs.current[marker.id]}
                      marker={marker}
                      isSelected={marker.id === selectedMarkerId}
                      onClick={(e: any) => handleMarkerClick(marker.id, e)}
                      onDragStart={() => setIsDragging(true)}
                      onDragEnd={(lat, lng) => {
                        setIsDragging(false);
                        handleMarkerDragEnd(marker.id, lat, lng);
                      }}
                      onTextChange={handleTextChange}
                    />
                  );
                })}

                {/* Rectangular box around selected marker - Not for text callouts */}
                {!isDragging && boxDimensions && selectedMarkerId && !markers.find(m => m.id === selectedMarkerId)?.icon_type.startsWith('text-callout') && (
                  <>
                    <div
                      style={{
                        position: 'absolute',
                        left: `${boxDimensions.left}px`,
                        top: `${boxDimensions.top}px`,
                        width: `${boxDimensions.width}px`,
                        height: `${boxDimensions.height}px`,
                        border: '2px dashed red',
                        borderRadius: '4px',
                        pointerEvents: 'none',
                        zIndex: 1000,
                        boxShadow: '0 0 0 2px rgba(59, 130, 246, 0.2)',
                        transition: 'all 0.1s ease',
                        transform: `rotate(${boxDimensions.rotation}deg)`,
                        transformOrigin: 'center center',
                      }}
                    />
                    
                    {/* Resize handles at corners */}
                    {['top-left', 'top-right', 'bottom-left', 'bottom-right'].map((corner) => {
                      const isTopLeft = corner === 'top-left';
                      const isTopRight = corner === 'top-right';
                      const isBottomLeft = corner === 'bottom-left';
                      const isBottomRight = corner === 'bottom-right';
                      
                      // Calculate corner positions considering rotation
                      const centerX = boxDimensions.left + boxDimensions.width / 2;
                      const centerY = boxDimensions.top + boxDimensions.height / 2;
                      const halfWidth = boxDimensions.width / 2;
                      const halfHeight = boxDimensions.height / 2;
                      const angle = (boxDimensions.rotation * Math.PI) / 180;
                      
                      let offsetX = isTopLeft || isBottomLeft ? -halfWidth : halfWidth;
                      let offsetY = isTopLeft || isTopRight ? -halfHeight : halfHeight;
                      
                      const rotatedX = offsetX * Math.cos(angle) - offsetY * Math.sin(angle);
                      const rotatedY = offsetX * Math.sin(angle) + offsetY * Math.cos(angle);
                      
                      // Determine cursor based on corner
                      const cursor = (isTopLeft || isBottomRight) ? 'nwse-resize' : 'nesw-resize';
                      
                      return (
                        <div
                          key={corner}
                          onMouseDown={(e) => handleResizeStart(e, corner)}
                          style={{
                            position: 'absolute',
                            left: `${centerX + rotatedX - 6}px`,
                            top: `${centerY + rotatedY - 6}px`,
                            width: '12px',
                            height: '12px',
                            backgroundColor: '#3B82F6',
                            border: '2px solid white',
                            borderRadius: '50%',
                            cursor: cursor,
                            zIndex: 1001,
                            pointerEvents: 'auto',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                          }}
                        />
                      );
                    })}
                    
                    {/* Edge handles for X and Y direction scaling */}
                    {['top', 'right', 'bottom', 'left'].map((edge) => {
                      const centerX = boxDimensions.left + boxDimensions.width / 2;
                      const centerY = boxDimensions.top + boxDimensions.height / 2;
                      const halfWidth = boxDimensions.width / 2;
                      const halfHeight = boxDimensions.height / 2;
                      const angle = (boxDimensions.rotation * Math.PI) / 180;
                      
                      let offsetX = 0;
                      let offsetY = 0;
                      let cursor = 'ns-resize';
                      
                      if (edge === 'top') {
                        offsetY = -halfHeight;
                        cursor = 'ns-resize';
                      } else if (edge === 'bottom') {
                        offsetY = halfHeight;
                        cursor = 'ns-resize';
                      } else if (edge === 'left') {
                        offsetX = -halfWidth;
                        cursor = 'ew-resize';
                      } else if (edge === 'right') {
                        offsetX = halfWidth;
                        cursor = 'ew-resize';
                      }
                      
                      const rotatedX = offsetX * Math.cos(angle) - offsetY * Math.sin(angle);
                      const rotatedY = offsetX * Math.sin(angle) + offsetY * Math.cos(angle);
                      
                      return (
                        <div
                          key={edge}
                          onMouseDown={(e) => handleResizeStart(e, edge)}
                          style={{
                            position: 'absolute',
                            left: `${centerX + rotatedX - 6}px`,
                            top: `${centerY + rotatedY - 6}px`,
                            width: '12px',
                            height: '12px',
                            backgroundColor: '#10B981',
                            border: '2px solid white',
                            borderRadius: '2px',
                            cursor: cursor,
                            zIndex: 1001,
                            pointerEvents: 'auto',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                          }}
                        />
                      );
                    })}

                    {/* Rotation handle - line and circle at top middle */}
                    {(() => {
                      const centerX = boxDimensions.left + boxDimensions.width / 2;
                      const centerY = boxDimensions.top + boxDimensions.height / 2;
                      const halfHeight = boxDimensions.height / 2;
                      const angle = (boxDimensions.rotation * Math.PI) / 180;
                      
                      // Position 30px above the top edge
                      const lineLength = 30;
                      const offsetX = 0;
                      const offsetY = -halfHeight - lineLength;
                      
                      const rotatedX = offsetX * Math.cos(angle) - offsetY * Math.sin(angle);
                      const rotatedY = offsetX * Math.sin(angle) + offsetY * Math.cos(angle);
                      
                      // Line start position (top edge)
                      const lineStartOffsetY = -halfHeight;
                      const lineStartRotatedX = 0 * Math.cos(angle) - lineStartOffsetY * Math.sin(angle);
                      const lineStartRotatedY = 0 * Math.sin(angle) + lineStartOffsetY * Math.cos(angle);
                      
                      return (
                        <>

                          {/* Rotation handle circle */}
                          <div
                            onMouseDown={handleRotateStart}
                            style={{
                              position: 'absolute',
                              left: `${centerX + rotatedX - 8}px`,
                              top: `${centerY + rotatedY - 8}px`,
                              width: '16px',
                              height: '16px',
                              backgroundColor: '#6366F1',
                              border: '2px solid white',
                              borderRadius: '50%',
                              cursor: 'grab',
                              zIndex: 1002,
                              pointerEvents: 'auto',
                              boxShadow: '0 2px 6px rgba(99, 102, 241, 0.4)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <RefreshCw className="w-2.5 h-2.5 text-white" />
                          </div>
                        </>
                      );
                    })()}
                  </>
                )}
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
                  // Text callout specific props
                  isTextCallout={markers.find(m => m.id === selectedMarkerId)?.icon_type.startsWith('text-callout')}
                  text={markers.find(m => m.id === selectedMarkerId)?.text}
                  fontSize={markers.find(m => m.id === selectedMarkerId)?.fontSize}
                  fontWeight={markers.find(m => m.id === selectedMarkerId)?.fontWeight}
                  calloutStyle={markers.find(m => m.id === selectedMarkerId)?.calloutStyle}
                  backgroundColor={markers.find(m => m.id === selectedMarkerId)?.backgroundColor}
                  onTextChange={handleTextChange}
                  onFontSizeChange={handleFontSizeChange}
                  onFontWeightChange={handleFontWeightChange}
                  onCalloutStyleChange={handleCalloutStyleChange}
                  onBackgroundColorChange={handleBackgroundColorChange}
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