import { MapMarker } from '@/store/slices/markersSlice';
import { AdvancedMarker } from '@vis.gl/react-google-maps';
import { getIconByType } from './enhancedMapIcons';
import { forwardRef } from 'react';

interface CustomMarkerProps {
  marker: MapMarker;
  isSelected: boolean;
  onClick: (e:any) => void;
  onDragStart?: () => void;
  onDragEnd: (lat: number, lng: number) => void;
}

const CustomMarker = forwardRef<HTMLDivElement, CustomMarkerProps>(
  ({ marker, isSelected, onClick, onDragStart, onDragEnd }, ref) => {
  const iconData = getIconByType(marker.icon_type);
  const IconComponent = iconData?.component;
  const iconColor = marker.color || iconData?.defaultColor || '#3B82F6';

  const handleDragStart = () => {
    if (onDragStart) {
      onDragStart();
    }
  };

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
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div
        ref={ref}
        className={`relative transition-all p-4`}
        // style={{
        //   transform: `scale(${marker.scale}) rotate(${marker.rotation}deg) scaleX(${marker.flip_horizontal ? -1 : 1}) scaleY(${marker.flip_vertical ? -1 : 1})`,
        //   transition: 'transform 0.2s ease',
        //   filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
        // }}
      >
        <div style={{
          transform: `scale(${marker.scale}) rotate(${marker.rotation}deg) scaleX(${marker.flip_horizontal ? -1 : 1}) scaleY(${marker.flip_vertical ? -1 : 1})`,
          transition: 'transform 0.2s ease',
          filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
        }}
        >
          <IconComponent color={iconColor} size={36} />
        </div>
      </div>
    </AdvancedMarker>
  );
});

CustomMarker.displayName = 'CustomMarker';

export default CustomMarker;
