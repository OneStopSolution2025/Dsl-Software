import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MapMarker } from '@/utils/supabase'; // We can keep this type definition

interface MapState {
  markers: MapMarker[];
}

const initialState: MapState = {
  markers: [],
};

let nextMarkerId = 0;

const mapSlice = createSlice({
  name: 'map',
  initialState,
  reducers: {
    addMarker: {
      reducer: (state, action: PayloadAction<MapMarker>) => {
        state.markers.unshift(action.payload);
      },
      prepare: (markerData: Omit<MapMarker, 'id' | 'created_at'>) => {
        const newId = `temp-id-${nextMarkerId++}`;
        return {
          payload: {
            ...markerData,
            id: newId,
            created_at: new Date().toISOString(),
          },
        };
      },
    },
    updateMarker: (state, action: PayloadAction<Partial<MapMarker> & { id: string }>) => {
      const index = state.markers.findIndex((m) => m.id === action.payload.id);
      if (index !== -1) {
        state.markers[index] = { ...state.markers[index], ...action.payload, updated_at: new Date().toISOString() };
      }
    },
    deleteMarker: (state, action: PayloadAction<string>) => {
      state.markers = state.markers.filter((m) => m.id !== action.payload);
    },
    setMarkers: (state, action: PayloadAction<MapMarker[]>) => {
      state.markers = action.payload;
    },
  },
});

export const { addMarker, updateMarker, deleteMarker, setMarkers } = mapSlice.actions;

export default mapSlice.reducer;
