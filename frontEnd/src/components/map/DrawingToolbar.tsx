import React from 'react';
import {
  Pencil,
  Square,
  Circle,
  ArrowRight,
  Car,
  Type,
  Eraser,
  Undo2,
  Redo2,
  Trash2,
  MousePointer,
} from 'lucide-react';

export type DrawingTool =
  | 'select'
  | 'pen'
  | 'rectangle'
  | 'circle'
  | 'arrow'
  | 'vehicle'
  | 'text'
  | 'eraser';

interface DrawingToolbarProps {
  activeTool: DrawingTool;
  onToolChange: (tool: DrawingTool) => void;
  onUndo: () => void;
  onRedo: () => void;
  onClear: () => void;
  onColorClick: () => void;
  onFontClick?: () => void;
  onVehicleClick?: () => void;
  currentColor: string;
  canUndo: boolean;
  canRedo: boolean;
  showFontSelector?: boolean;
}

const DrawingToolbar: React.FC<DrawingToolbarProps> = ({
  activeTool,
  onToolChange,
  onUndo,
  onRedo,
  onClear,
  onColorClick,
  onFontClick,
  onVehicleClick,
  currentColor,
  canUndo,
  canRedo,
  showFontSelector = false,
}) => {
  const tools: Array<{ id: DrawingTool; icon: React.ReactNode; label: string }> = [
    { id: 'select', icon: <MousePointer size={20} />, label: 'Select' },
    { id: 'pen', icon: <Pencil size={20} />, label: 'Pen' },
    { id: 'rectangle', icon: <Square size={20} />, label: 'Rectangle' },
    { id: 'circle', icon: <Circle size={20} />, label: 'Circle' },
    { id: 'arrow', icon: <ArrowRight size={20} />, label: 'Arrow' },
    { id: 'vehicle', icon: <Car size={20} />, label: 'Vehicle' },
    { id: 'text', icon: <Type size={20} />, label: 'Text' },
    { id: 'eraser', icon: <Eraser size={20} />, label: 'Eraser' },
  ];

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-3 mb-4">
      <div className="flex flex-wrap items-center gap-2">
        {/* Drawing Tools */}
        <div className="flex gap-1 border-r border-gray-200 pr-2">
          {tools.map((tool) => (
            <button
              key={tool.id}
              onClick={() => {
                if (tool.id === 'vehicle' && onVehicleClick) {
                  onVehicleClick();
                } else if (tool.id === 'text' && showFontSelector && onFontClick) {
                  onFontClick();
                } else {
                  onToolChange(tool.id);
                }
              }}
              className={`p-2 rounded transition-colors ${
                activeTool === tool.id
                  ? 'bg-primary-500 text-white shadow-md'
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
              }`}
              title={tool.label}
            >
              {tool.icon}
            </button>
          ))}
        </div>

        {/* Color Picker */}
        <div className="border-r border-gray-200 pr-2">
          <button
            onClick={onColorClick}
            className="p-2 rounded bg-neutral-100 hover:bg-neutral-200 transition-colors flex items-center gap-2"
            title="Choose Color"
          >
            <div
              className="w-6 h-6 rounded border-2 border-gray-300"
              style={{ backgroundColor: currentColor }}
            />
            <span className="text-sm font-medium">Color</span>
          </button>
        </div>

        {/* Undo/Redo */}
        <div className="flex gap-1 border-r border-gray-200 pr-2">
          <button
            onClick={onUndo}
            disabled={!canUndo}
            className={`p-2 rounded transition-colors ${
              canUndo
                ? 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                : 'bg-neutral-50 text-neutral-300 cursor-not-allowed'
            }`}
            title="Undo"
          >
            <Undo2 size={20} />
          </button>
          <button
            onClick={onRedo}
            disabled={!canRedo}
            className={`p-2 rounded transition-colors ${
              canRedo
                ? 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                : 'bg-neutral-50 text-neutral-300 cursor-not-allowed'
            }`}
            title="Redo"
          >
            <Redo2 size={20} />
          </button>
        </div>

        {/* Clear Canvas */}
        <button
          onClick={onClear}
          className="p-2 rounded bg-error-100 text-error-600 hover:bg-error-200 transition-colors"
          title="Clear Canvas"
        >
          <Trash2 size={20} />
        </button>
      </div>
    </div>
  );
};

export default DrawingToolbar;
