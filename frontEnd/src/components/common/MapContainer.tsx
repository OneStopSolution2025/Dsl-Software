import { useMap } from '@vis.gl/react-google-maps';
import { useEffect } from 'react';

interface MapContainerProps {
  onMapReady: (map: google.maps.Map) => void;
}

export default function MapContainer({ onMapReady }: MapContainerProps) {
  const map = useMap();

  useEffect(() => {
    if (map) {
      onMapReady(map);
    }
  }, [map, onMapReady]);

  return null;
}
