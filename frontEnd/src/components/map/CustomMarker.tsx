import { MapMarker } from '@/store/slices/markersSlice';
import { AdvancedMarker } from '@vis.gl/react-google-maps';
import { Car, Bike, Truck, Bus, Ship, Plane } from 'lucide-react';


interface CustomMarkerProps {
  marker: MapMarker;
  isSelected: boolean;
  onClick: (e:any) => void;
  onDragEnd: (lat: number, lng: number) => void;
}

const iconMap: Record<string, typeof Car> = {
  car: Car,
  bike: Bike,
  truck: Truck,
  bus: Bus,
  ship: Ship,
  plane: Plane,
};

export default function CustomMarker({ marker, isSelected, onClick, onDragEnd }: CustomMarkerProps) {
  const Icon = iconMap[marker.icon_type] || Car;

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
        className={`relative ${isSelected ? 'ring-4 ring-blue-500 ring-opacity-50' : ''}`}
        style={{
          transform: `scale(${marker.scale}) rotate(${marker.rotation}deg) scaleX(${marker.flip_horizontal ? -1 : 1}) scaleY(${marker.flip_vertical ? -1 : 1})`,
          transition: 'transform 0.2s ease',
        }}
      >
        <div className="bg-white rounded-full p-2 shadow-lg">
          <Icon className="w-6 h-6 text-gray-800" />
        </div>
      </div>
    </AdvancedMarker>
  );
}
