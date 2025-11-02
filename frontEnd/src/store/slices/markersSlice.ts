import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface MapMarker {
  id: string;
  icon_type: string;
  latitude: number;
  longitude: number;
  scale: number;
  rotation: number;
  flip_horizontal: boolean;
  flip_vertical: boolean;
}

interface MarkersState {
  markers: MapMarker[];
}

const initialState: MarkersState = {
  markers: [],
};

const markerSlice = createSlice({
  name: 'markers',
  initialState,
  reducers: {
    addMarker: (state, action: PayloadAction<MapMarker>) => {
      state.markers.unshift(action.payload);
    },
    updateMarker: (state, action: PayloadAction<{ id: string; updates: Partial<MapMarker> }>) => {
      const marker = state.markers.find((m) => m.id === action.payload.id);
      if (marker) {
        Object.assign(marker, action.payload.updates);
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

export const { addMarker, updateMarker, deleteMarker, setMarkers } = markerSlice.actions;
export default markerSlice.reducer;
