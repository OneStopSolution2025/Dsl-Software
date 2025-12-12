import React, { useState } from 'react';
import { HexColorPicker } from 'react-colorful';
import { X } from 'lucide-react';

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  onClose: () => void;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ color, onChange, onClose }) => {
  const [localColor, setLocalColor] = useState(color);

  const presetColors = [
    '#000000', // Black
    '#FF0000', // Red
    '#00FF00', // Green
    '#0000FF', // Blue
    '#FFFF00', // Yellow
    '#FF00FF', // Magenta
    '#00FFFF', // Cyan
    '#FFA500', // Orange
    '#800080', // Purple
    '#FFC0CB', // Pink
    '#A52A2A', // Brown
    '#808080', // Gray
  ];

  const handleApply = () => {
    onChange(localColor);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm w-full mx-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Choose Color</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
          >
            <X size={20} className="text-gray-600" />
          </button>
        </div>

        {/* Color Picker */}
        <div className="mb-4">
          <HexColorPicker color={localColor} onChange={setLocalColor} />
        </div>

        {/* Preset Colors */}
        <div className="mb-4">
          <p className="text-sm font-medium text-gray-700 mb-2">Preset Colors</p>
          <div className="grid grid-cols-6 gap-2">
            {presetColors.map((presetColor) => (
              <button
                key={presetColor}
                onClick={() => setLocalColor(presetColor)}
                className={`w-10 h-10 rounded border-2 transition-all ${
                  localColor.toUpperCase() === presetColor
                    ? 'border-blue-500 scale-110'
                    : 'border-gray-300 hover:scale-105'
                }`}
                style={{ backgroundColor: presetColor }}
                title={presetColor}
              />
            ))}
          </div>
        </div>

        {/* Current Color Display */}
        <div className="mb-4 flex items-center gap-3">
          <div
            className="w-16 h-16 rounded border-2 border-gray-300"
            style={{ backgroundColor: localColor }}
          />
          <div>
            <p className="text-sm font-medium text-gray-700">Selected Color</p>
            <p className="text-xs font-mono text-gray-600">{localColor.toUpperCase()}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 bg-neutral-100 text-neutral-700 rounded-lg hover:bg-neutral-200 transition-colors font-semibold"
          >
            Cancel
          </button>
          <button
            onClick={handleApply}
            className="flex-1 px-4 py-2.5 btn-primary rounded-lg font-semibold"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};

export default ColorPicker;
