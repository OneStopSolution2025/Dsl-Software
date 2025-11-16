import { MapMarker } from '@/store/slices/markersSlice';
import { AdvancedMarker } from '@vis.gl/react-google-maps';
import { getIconByType } from './enhancedMapIcons';

interface CustomMarkerProps {
  marker: MapMarker;
  isSelected: boolean;
  onClick: (e:any) => void;
  onDragEnd: (lat: number, lng: number) => void;
}


export default function CustomMarker({ marker, isSelected, onClick, onDragEnd }: CustomMarkerProps) {
  const iconData = getIconByType(marker.icon_type);
  const IconComponent = iconData?.component;
  const iconColor = marker.color || iconData?.defaultColor || '#3B82F6';

  const handleDragEnd = (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      onDragEnd(e.latLng.lat(), e.latLng.lng());
    }
  };

  if (!IconComponent) return null;

  return (
    <AdvancedMarker
      position={{ lat: marker.latitude, lng: marker.longitude }}
      draggable
      onClick={onClick}
      onDragEnd={handleDragEnd}
    >
      <div
        className={`relative transition-all ${isSelected ? 'ring-2 ring-primary-500 ring-offset-2 rounded-full' : ''}`}
        style={{
          transform: `scale(${marker.scale}) rotate(${marker.rotation}deg) scaleX(${marker.flip_horizontal ? -1 : 1}) scaleY(${marker.flip_vertical ? -1 : 1})`,
          transition: 'transform 0.2s ease',
          filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
        }}
      >
        <IconComponent color={iconColor} size={36} />
      </div>
    </AdvancedMarker>
  );
}
