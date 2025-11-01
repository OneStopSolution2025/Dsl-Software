import { Car, Bike, Truck, Bus, Ship, Plane } from 'lucide-react';

interface IconPaletteProps {
  onDragStart: (iconType: string) => void;
}

const iconTypes = [
    { type: 'car', Icon: '36738', label: 'Car' },
    { type: 'bike', Icon: '15130', label: 'Bike' },
    { type: 'truck', Icon: '15196', label: 'Truck' },
    { type: 'bus', Icon: '15158', label: 'Bus' },
    { type: 'cycle', Icon: '15128', label: 'Cycle' },
    { type: 'trespasser', Icon: '16952', label: 'Trespasser' },
    { type: 'roadblock', Icon: 'XzhtWsqJ3bNG', label: 'Road Block' },
    { type: 'blast', Icon: '17899', label: 'Blast' },
]

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
            {/* <Icon className="w-8 h-8 text-gray-700" /> */}
            <img src={`https://img.icons8.com/?size=100&id=${Icon}`} width="30" />
            <span className="text-xs mt-1 text-gray-600">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
