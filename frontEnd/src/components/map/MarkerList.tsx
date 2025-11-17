
import { MapMarker } from '@/store/slices/markersSlice';
import { MapPin, Trash2, Edit2, Check } from 'lucide-react';
import { getIconByType } from './enhancedMapIcons';
import { useState } from 'react';

interface MarkerListProps {
  markers: MapMarker[];
  onMarkerClick: (id: string) => void;
  onMarkerDelete: (id: string) => void;
  onMarkerUpdate: (id: string, updates: Partial<MapMarker>) => void;
  selectedMarkerId?: string;
}


export default function MarkerList({ markers, onMarkerClick, onMarkerDelete, onMarkerUpdate, selectedMarkerId }: MarkerListProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState<string>('');

  const handleEditClick = (marker: MapMarker, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(marker.id);
    setEditName(marker.displayName || marker.icon_type);
  };

  const handleSaveClick = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (editName.trim()) {
      onMarkerUpdate(id, { displayName: editName.trim() });
    }
    setEditingId(null);
    setEditName('');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditName('');
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-4 mt-4">
      <h2 className="text-lg font-semibold mb-3 text-gray-800 flex items-center gap-2">
        <MapPin className="w-5 h-5" />
        Placed Markers ({markers.length})
      </h2>
      {markers.length === 0 ? (
        <p className="text-gray-500 text-sm">No markers placed yet. Drag icons onto the map to get started.</p>
      ) : (
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {markers.map((marker) => {
            const iconConfig = getIconByType(marker.icon_type);
            const IconComponent = iconConfig?.component;
            const isEditing = editingId === marker.id;
            
            return (
              <div
                key={marker.id}
                onClick={() => onMarkerClick(marker.id)}
                className={`p-3 border rounded-lg cursor-pointer transition-all ${
                  selectedMarkerId === marker.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0" style={{ color: marker.color }}>
                    {IconComponent ? <IconComponent size={24} color={marker.color} /> : <MapPin className="w-6 h-6" />}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-gray-800 flex items-center gap-2">
                      {isEditing ? (
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          onClick={(e) => e.stopPropagation()}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              handleSaveClick(marker.id, e as any);
                            } else if (e.key === 'Escape') {
                              handleCancelEdit();
                            }
                          }}
                          className="px-2 py-1 border border-blue-400 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm flex-1"
                          autoFocus
                        />
                      ) : (
                        <span className="capitalize">{marker.displayName || marker.icon_type}</span>
                      )}
                      <span 
                        className="w-4 h-4 rounded-full border border-gray-300"
                        style={{ backgroundColor: marker.color }}
                        title={marker.color}
                      />
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      <span className="font-mono">
                        Lat: {marker.latitude.toFixed(6)}, Lng: {marker.longitude.toFixed(6)}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Scale: {marker.scale.toFixed(2)} | Rotation: {marker.rotation}° |
                      {marker.flip_horizontal && ' H-Flipped'}
                      {marker.flip_vertical && ' V-Flipped'}
                    </div>
                  </div>
                  {isEditing ? (
                    <button
                      onClick={(e) => handleSaveClick(marker.id, e)}
                      className="p-2 text-green-600 hover:bg-green-50 rounded transition-colors"
                      title="Save changes"
                    >
                      <Check className="w-5 h-5" />
                    </button>
                  ) : (
                    <button
                      onClick={(e) => handleEditClick(marker, e)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                      title="Edit marker name"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onMarkerDelete(marker.id);
                    }}
                    className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                    title="Delete marker"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
