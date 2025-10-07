import { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addMarker, updateMarkerPosition, clearMarkers, removeMarker } from '@/store/slices/markersSlice';
import { RootState } from '@/store';
import { MapMarker, MarkerType } from '@/types/map.types';
import { generateMarkerId } from '@/utils/mapHelpers';

export const useMap = () => {
  const dispatch = useDispatch();
  const markers = useSelector((state: RootState) => state.markers.items);
  const [mapType, setMapType] = useState<'roadmap' | 'satellite'>('roadmap');

  const handleAddMarker = useCallback(
    (type: MarkerType, lat: number, lng: number) => {
      const newMarker: MapMarker = {
        id: generateMarkerId(),
        type,
        lat,
        lng,
      };
      dispatch(addMarker(newMarker));
    },
    [dispatch]
  );

  const handleUpdateMarkerPosition = useCallback(
    (id: string, lat: number, lng: number) => {
      dispatch(updateMarkerPosition({ id, lat, lng }));
    },
    [dispatch]
  );

  const handleRemoveMarker = useCallback(
    (id: string) => {
      dispatch(removeMarker(id));
    },
    [dispatch]
  );

  const handleClearMarkers = useCallback(() => {
    dispatch(clearMarkers());
  }, [dispatch]);

  const toggleMapType = useCallback(() => {
    setMapType((prev) => (prev === 'roadmap' ? 'satellite' : 'roadmap'));
  }, []);

  return {
    markers,
    mapType,
    handleAddMarker,
    handleUpdateMarkerPosition,
    handleRemoveMarker,
    handleClearMarkers,
    toggleMapType,
  };
};
