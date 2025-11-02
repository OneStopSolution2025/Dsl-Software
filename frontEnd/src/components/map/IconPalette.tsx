import { Car, Bike, Truck, Bus, Ship, Plane } from 'lucide-react';

interface IconPaletteProps {
  onDragStart: (iconType: string) => void;
}

const iconTypes = [
  { type: 'car', Icon: Car, label: 'Car' },
  { type: 'bike', Icon: Bike, label: 'Bike' },
  { type: 'truck', Icon: Truck, label: 'Truck' },
  { type: 'bus', Icon: Bus, label: 'Bus' },
  { type: 'ship', Icon: Ship, label: 'Ship' },
  { type: 'plane', Icon: Plane, label: 'Plane' },
];

export default function IconPalette({ onDragStart }: IconPaletteProps) {
  return (
    <div className="bg-white shadow-lg rounded-lg p-4 mb-4">
      <h2 className="text-lg font-semibold mb-3 text-gray-800">Vehicle Icons</h2>
      <div className="flex gap-3 flex-wrap">
        {iconTypes.map(({ type, Icon, label }) => (
          <div
            key={type}
            draggable
            onDragStart={() => onDragStart(type)}
            className="flex flex-col items-center p-3 border-2 border-gray-200 rounded-lg cursor-grab hover:border-blue-400 hover:bg-blue-50 active:cursor-grabbing transition-all"
          >
            <Icon className="w-8 h-8 text-gray-700" />
            <span className="text-xs mt-1 text-gray-600">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
