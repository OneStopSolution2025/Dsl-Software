import React, { useState } from 'react';
import { X } from 'lucide-react';

interface FontSelectorProps {
  fontSize: number;
  fontFamily: string;
  onFontChange: (fontSize: number, fontFamily: string) => void;
  onClose: () => void;
}

const FontSelector: React.FC<FontSelectorProps> = ({
  fontSize,
  fontFamily,
  onFontChange,
  onClose,
}) => {
  const [localFontSize, setLocalFontSize] = useState(fontSize);
  const [localFontFamily, setLocalFontFamily] = useState(fontFamily);

  const fontFamilies = [
    'Arial',
    'Times New Roman',
    'Courier New',
    'Georgia',
    'Verdana',
    'Helvetica',
    'Comic Sans MS',
    'Impact',
  ];

  const handleApply = () => {
    onFontChange(localFontSize, localFontFamily);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Text Settings</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
          >
            <X size={20} className="text-gray-600" />
          </button>
        </div>

        {/* Font Family Selector */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Font Family
          </label>
          <select
            value={localFontFamily}
            onChange={(e) => setLocalFontFamily(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {fontFamilies.map((font) => (
              <option key={font} value={font} style={{ fontFamily: font }}>
                {font}
              </option>
            ))}
          </select>
        </div>

        {/* Font Size Slider */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Font Size: {localFontSize}px
          </label>
          <input
            type="range"
            min="12"
            max="72"
            step="2"
            value={localFontSize}
            onChange={(e) => setLocalFontSize(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>12px</span>
            <span>72px</span>
          </div>
        </div>

        {/* Preview */}
        <div className="mb-6 p-4 bg-gray-50 rounded border border-gray-200">
          <p className="text-sm font-medium text-gray-700 mb-2">Preview</p>
          <p
            style={{
              fontFamily: localFontFamily,
              fontSize: `${localFontSize}px`,
            }}
          >
            Sample Text
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleApply}
            className="flex-1 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors font-medium"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};

export default FontSelector;
