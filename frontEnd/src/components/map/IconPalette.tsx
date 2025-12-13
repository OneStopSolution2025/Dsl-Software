import { iconCategories, getIconsByCategory } from './enhancedMapIcons';
import { Accordion } from '../common/Accordion';
import { Map } from 'lucide-react';

interface IconPaletteProps {
  onDragStart: (iconType: string) => void;
  onClick?: (iconType: string) => void;
}

export default function IconPalette({ onDragStart, onClick }: IconPaletteProps) {
  const accordionItems = iconCategories.map((category) => {
    const icons = getIconsByCategory(category);

    return {
      title: (
        <div className="flex items-center justify-between w-full">
          <span className="text-sm font-medium text-gray-800">{category}</span>
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
            {icons.length}
          </span>
        </div>
      ),
      children: (
        <div className="grid grid-cols-2 gap-2">
          {icons.map(({ type, component: IconComponent, label, defaultColor }) => (
              <div key={type}
                draggable
                onDragStart={() => onDragStart(type)}
                onClick={() => onClick?.(type)}
                className="group flex flex-col items-center p-3 border-2 border-gray-200 rounded-xl cursor-pointer 
                  hover:border-primary-400 hover:bg-gradient-to-br hover:from-primary-50 hover:to-white 
                  active:cursor-grabbing active:scale-95 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <div className="w-10 h-10 flex items-center justify-center mb-1 
                  bg-gradient-to-br from-gray-50 to-white rounded-lg 
                  group-hover:from-white group-hover:to-primary-50 transition-all">
                  <IconComponent color={defaultColor} size={32} />
                </div>
                <span className="text-[10px] font-medium text-gray-700 text-center line-clamp-1 
                  group-hover:text-primary-700">
                  {label}
                </span>
              </div>
          ))}
        </div>
      ),
      className: 'border-gray-200 hover:border-primary-300 shadow-sm',
      headerClassName: 'bg-gradient-to-r from-gray-50 to-white hover:from-primary-50 hover:to-white',
      contentClassName: 'bg-gradient-to-b from-white to-gray-50',
    };
  });

  return (
    <div className="bg-gradient-to-b from-white to-gray-50 shadow-lg rounded-lg px-3 pb-3 h-full overflow-auto">
      <h2 className="text-base font-semibold mb-3 text-gray-800 sticky top-0 z-10 bg-white p-2 border-b-2 border-primary-200 flex item-center gap-2">
        <span><Map/> </span> Map Icons
      </h2>
      
      <Accordion
        items={accordionItems}
        defaultOpenIndexes={[0]}
        allowMultiple={false}
        className="space-y-2"
      />
    </div>
  );
}
