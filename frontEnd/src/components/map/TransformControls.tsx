import { RotateCcw, RotateCw, ZoomIn, ZoomOut, FlipHorizontal, FlipVertical, Trash2, Palette } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

interface TransformControlsProps {
  onRotate: (direction: 'cw' | 'ccw') => void;
  onScaleUp: () => void;
  onScaleDown: () => void;
  onFlipHorizontal: () => void;
  onFlipVertical: () => void;
  onDelete: () => void;
  onColorChange?: (color: string) => void;
  currentColor?: string;
  showColorPicker?: boolean;
  position: { x: number; y: number, h: number, w: number };
}

const PRESET_COLORS = [
  '#000000', // Black
  '#3B82F6', // Blue
  '#EF4444', // Red
  '#10B981', // Green
  '#F59E0B', // Amber
  '#8B5CF6', // Purple
  '#EC4899', // Pink
  '#06B6D4', // Cyan
  '#84CC16', // Lime
  '#F97316', // Orange
  '#64748B', // Slate
  '#FFFFFF', // White
];

export default function TransformControls({
  onRotate,
  onScaleUp,
  onScaleDown,
  onFlipHorizontal,
  onFlipVertical,
  onDelete,
  onColorChange,
  currentColor = '#3B82F6',
  showColorPicker = true,
  position,
}: TransformControlsProps) {
  const [showColorPickerDropdown, setShowColorPickerDropdown] = useState(false);
  const colorPickerRef = useRef<HTMLDivElement>(null);

  // Close color picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (colorPickerRef.current && !colorPickerRef.current.contains(event.target as Node)) {
        setShowColorPickerDropdown(false);
      }
    };

    if (showColorPickerDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showColorPickerDropdown]);

  return (
    <div
      className="absolute bg-white shadow-lg rounded-lg p-2 flex gap-1 z-50"
      style={{
        left: `${position.x}px`,
        top: `${position.y }px`,
      }}
    >
      <button
        onClick={() => onRotate('ccw')}
        className="p-2 hover:bg-gray-100 rounded transition-colors"
        title="Rotate Counter-Clockwise"
      >
        <RotateCcw className="w-4 h-4" />
      </button>
      <button
        onClick={() => onRotate('cw')}
        className="p-2 hover:bg-gray-100 rounded transition-colors"
        title="Rotate Clockwise"
      >
        <RotateCw className="w-4 h-4" />
      </button>
      <button
        onClick={onScaleUp}
        className="p-2 hover:bg-gray-100 rounded transition-colors"
        title="Scale Up"
      >
        <ZoomIn className="w-4 h-4" />
      </button>
      <button
        onClick={onScaleDown}
        className="p-2 hover:bg-gray-100 rounded transition-colors"
        title="Scale Down"
      >
        <ZoomOut className="w-4 h-4" />
      </button>
      <button
        onClick={onFlipHorizontal}
        className="p-2 hover:bg-gray-100 rounded transition-colors"
        title="Flip Horizontal"
      >
        <FlipHorizontal className="w-4 h-4" />
      </button>
      <button
        onClick={onFlipVertical}
        className="p-2 hover:bg-gray-100 rounded transition-colors"
        title="Flip Vertical"
      >
        <FlipVertical className="w-4 h-4" />
      </button>
      
      {/* Color Picker Button - only show for colorChangeable icons */}
      {showColorPicker && onColorChange && (
      <div className="relative" ref={colorPickerRef}>
        <button
          onClick={() => setShowColorPickerDropdown(!showColorPickerDropdown)}
          className="p-2 hover:bg-gray-100 rounded transition-colors relative"
          title="Change Color"
        >
          <Palette className="w-4 h-4" />
          <div
            className="absolute bottom-0 right-0 w-2 h-2 rounded-full border border-white"
            style={{ backgroundColor: currentColor }}
          />
        </button>

        {/* Color Picker Dropdown */}
        {showColorPickerDropdown && (
          <div className="absolute top-full mt-2 right-0 bg-white shadow-xl rounded-lg p-3 w-48 z-[60]">
            <p className="text-xs font-medium text-gray-700 mb-2">Select Color</p>
            <div className="grid grid-cols-6 gap-2">
              {PRESET_COLORS.map((color) => (
                <button
                  key={color}
                  onClick={() => {
                    onColorChange?.(color);
                    setShowColorPickerDropdown(false);
                  }}
                  className={`w-6 h-6 rounded-full border-2 hover:scale-110 transition-transform ${
                    currentColor === color ? 'border-primary-500 ring-2 ring-primary-200' : 'border-gray-300'
                  }`}
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
            
            {/* Custom Color Input */}
            <div className="mt-3 pt-3 border-t border-gray-200">
              <label className="text-xs font-medium text-gray-700 block mb-1">Custom</label>
              <input
                type="color"
                value={currentColor}
                onChange={(e) => onColorChange?.(e.target.value)}
                className="w-full h-8 rounded cursor-pointer"
              />
            </div>
          </div>
        )}
      </div>
      )}

      <button
        onClick={onDelete}
        className="p-2 hover:bg-red-100 rounded transition-colors text-red-600"
        title="Delete"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}
