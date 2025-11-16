import { mapIcons } from './mapIcons';


interface IconPaletteProps {
  onDragStart: (iconType: string) => void;
}


export default function IconPalette({ onDragStart }: IconPaletteProps) {
  return (
    <div className="bg-white shadow-lg rounded-lg p-4 mb-4 h-full overflow-auto">
      <h2 className="text-lg font-semibold mb-3 text-gray-800">Vehicle Icons</h2>
      <div className="flex flex-row md:flex-col gap-3 flex-wrap">
        {mapIcons.map(({ type, img, label }) => (
          <div
            key={type}
            draggable
            onDragStart={() => onDragStart(type)}
            className="flex flex-col items-center p-3 border-2 border-gray-200 rounded-lg cursor-grab hover:border-blue-400 hover:bg-blue-50 active:cursor-grabbing transition-all"
          >
            <img src={img} className="w-8 h-8 text-gray-700" />
            <span className="text-xs mt-1 text-gray-600">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
