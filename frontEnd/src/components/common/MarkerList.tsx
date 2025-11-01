
import { MapMarker } from '@/utils/supabase';
import { MapPin } from 'lucide-react';
import { useEffect } from 'react';
import { setCanProceed } from '@/store/slices/stepperSlice';
import { useDispatch } from 'react-redux';

interface MarkerListProps {
  markers: MapMarker[];
  onMarkerClick: (id: string) => void;
  selectedMarkerId?: string;
}

const iconMap = {
    car : '36738',
    bike: '15130',
    truck: '15196',
    bus: '15158',
    cycle: '15128',
    trespasser: '16952',
    roadblock: 'XzhtWsqJ3bNG',
    blast: '17899',
}


export default function MarkerList({ markers, onMarkerClick, selectedMarkerId }: MarkerListProps) {

    const dispatch = useDispatch();
    
    useEffect(() => {
        if(markers){
            dispatch(setCanProceed(markers.length > 0));
        }
    }, [markers, dispatch])

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
            const Icon = iconMap[marker.icon_type] || iconMap.car;
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
                  {/* <Icon className="w-6 h-6 text-gray-700" /> */}
                    <img src={`https://img.icons8.com/?size=100&id=${Icon}`} width="30" />
                  <div className="flex-1">
                    <div className="font-medium text-gray-800 capitalize">{marker.icon_type}</div>
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
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
