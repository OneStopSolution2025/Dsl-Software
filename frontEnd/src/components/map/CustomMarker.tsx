import { MapMarker } from '@/store/slices/markersSlice';
import { AdvancedMarker } from '@vis.gl/react-google-maps';
import { getIconByType } from './enhancedMapIcons';
import { forwardRef } from 'react';
import TextCallout from './TextCallout';

interface CustomMarkerProps {
  marker: MapMarker;
  isSelected: boolean;
  onClick: (e:any) => void;
  onDragStart?: () => void;
  onDragEnd: (lat: number, lng: number) => void;
  onTextChange?: (text: string) => void;
}

const CustomMarker = forwardRef<HTMLDivElement, CustomMarkerProps>(
  ({ marker, onClick, onDragStart, onDragEnd, onTextChange }, ref) => {
  const iconData = getIconByType(marker.icon_type);
  const IconComponent = iconData?.component;
  const iconColor = marker.color || iconData?.defaultColor || '#3B82F6';

  // Check if this is a text callout marker
  const isTextCallout = marker.icon_type.startsWith('text-callout');
  
  // Determine callout style from icon type
  let calloutStyle: 'speech-bubble' | 'rectangular' | 'cloud' = 'rectangular';
  if (marker.icon_type === 'text-callout-speech') {
    calloutStyle = marker.calloutStyle || 'speech-bubble';
  } else if (marker.icon_type === 'text-callout-cloud') {
    calloutStyle = marker.calloutStyle || 'cloud';
  } else if (marker.icon_type === 'text-callout-rect') {
    calloutStyle = marker.calloutStyle || 'rectangular';
  }

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

  const handleTextChange = (newText: string) => {
    if (onTextChange) {
      onTextChange(newText);
    }
  };

  const handleCalloutClick = (e: any) => {
    // For text callouts, we want single click to select and show controls
    onClick(e);
  };

  if (!IconComponent && !isTextCallout) return null;

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
      >
        {isTextCallout ? (
          <div onClick={handleCalloutClick}>
            <TextCallout
              text={marker.text || ''}
              color={iconColor}
              backgroundColor={marker.backgroundColor || '#FFFFFF'}
              borderColor={marker.borderColor}
              fontSize={marker.fontSize || 16}
              fontWeight={marker.fontWeight || 'normal'}
              calloutStyle={calloutStyle}
              onTextChange={handleTextChange}
            />
          </div>
        ) : IconComponent ? (
          <div style={{
            transform: `scale(${marker.scale}) rotate(${marker.rotation}deg) scaleX(${marker.flip_horizontal ? -1 : 1}) scaleY(${marker.flip_vertical ? -1 : 1})`,
            transition: 'transform 0.2s ease',
            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
          }}
          >
            <IconComponent color={iconColor} size={36} />
          </div>
        ) : null}
      </div>
    </AdvancedMarker>
  );
});

CustomMarker.displayName = 'CustomMarker';

export default CustomMarker;
