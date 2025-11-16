import { MapMarker } from '@/store/slices/markersSlice';
import { AdvancedMarker } from '@vis.gl/react-google-maps';
import { mapIcons } from './mapIcons';

interface CustomMarkerProps {
  marker: MapMarker;
  isSelected: boolean;
  onClick: (e:any) => void;
  onDragEnd: (lat: number, lng: number) => void;
}


export default function CustomMarker({ marker, isSelected, onClick, onDragEnd }: CustomMarkerProps) {
  const Icon = mapIcons.filter((icon) => icon.type === marker.icon_type)[0]?.img || mapIcons[2].img;

  const handleDragEnd = (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      onDragEnd(e.latLng.lat(), e.latLng.lng());
    }
  };

  return (
    <AdvancedMarker
      position={{ lat: marker.latitude, lng: marker.longitude }}
      draggable
      onClick={onClick}
      onDragEnd={handleDragEnd}
    >
      <div
        className={`relative ${isSelected ? 'border-2 border-dashed border-blue-500' : ''}`}
        style={{
          transform: `scale(${marker.scale}) rotate(${marker.rotation}deg) scaleX(${marker.flip_horizontal ? -1 : 1}) scaleY(${marker.flip_vertical ? -1 : 1})`,
          transition: 'transform 0.2s ease',
        }}
      >
        <div className="bg-transparent rounded-full p-2 shadow-xs">
          <img src={Icon} className="w-6 h-6 text-gray-800" />
        </div>
      </div>
    </AdvancedMarker>
  );
}
