
import { MapMarker } from '@/store/slices/markersSlice';
import { MapPin, Trash2 } from 'lucide-react';
import { getIconByType } from './enhancedMapIcons';

interface MarkerListProps {
  markers: MapMarker[];
  onMarkerClick: (id: string) => void;
  onMarkerDelete: (id: string) => void;
  selectedMarkerId?: string;
}


export default function MarkerList({ markers, onMarkerClick, onMarkerDelete, selectedMarkerId }: MarkerListProps) {
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
            const IconComponent = iconConfig?.icon;
            
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
                    <div className="font-medium text-gray-800 capitalize flex items-center gap-2">
                      {marker.icon_type}
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
