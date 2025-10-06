import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MarkersState, MapMarker } from '@/types/map.types';

const initialState: MarkersState = {
  items: [],
};

const markersSlice = createSlice({
  name: 'markers',
  initialState,
  reducers: {
    addMarker: (state, action: PayloadAction<MapMarker>) => {
      state.items.push(action.payload);
    },
    updateMarkerPosition: (
      state,
      action: PayloadAction<{ id: string; lat: number; lng: number }>
    ) => {
      const marker = state.items.find((m) => m.id === action.payload.id);
      if (marker) {
        marker.lat = action.payload.lat;
        marker.lng = action.payload.lng;
      }
    },
    removeMarker: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((m) => m.id !== action.payload);
    },
    clearMarkers: (state) => {
      state.items = [];
    },
  },
});

export const { addMarker, updateMarkerPosition, removeMarker, clearMarkers } =
  markersSlice.actions;

export default markersSlice.reducer;
