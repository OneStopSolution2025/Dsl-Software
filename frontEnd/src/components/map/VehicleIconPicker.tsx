import React from 'react';
import { X } from 'lucide-react';
import { mapIcons } from './mapIcons';

interface VehicleIconPickerProps {
  onSelect: (iconUrl: string) => void;
  onClose: () => void;
}

const VehicleIconPicker: React.FC<VehicleIconPickerProps> = ({ onSelect, onClose }) => {
  const handleSelect = (iconUrl: string) => {
    onSelect(iconUrl);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-lg w-full mx-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Select Vehicle/Icon</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
          >
            <X size={20} className="text-gray-600" />
          </button>
        </div>

        {/* Icon Grid */}
        <div className="grid grid-cols-5 gap-3 mb-4">
          {mapIcons.map((icon) => (
            <button
              key={icon.id}
              onClick={() => handleSelect(icon.img)}
              className="flex flex-col items-center p-3 bg-gray-50 rounded-lg hover:bg-blue-50 hover:border-blue-300 border-2 border-transparent transition-all"
              title={icon.label}
            >
              <img
                src={icon.img}
                alt={icon.label}
                className="w-12 h-12 object-contain mb-1"
              />
              <span className="text-xs text-gray-600 text-center">{icon.label}</span>
            </button>
          ))}
        </div>

        {/* Close Button */}
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors font-medium"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default VehicleIconPicker;
