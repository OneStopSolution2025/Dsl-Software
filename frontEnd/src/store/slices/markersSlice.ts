import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface MapMarker {
  id: string;
  icon_type: string; // The actual icon type used for rendering
  displayName?: string; // Custom display name for the marker
  latitude: number;
  longitude: number;
  scale: number;
  rotation: number;
  flip_horizontal: boolean;
  flip_vertical: boolean;
  color: string; // Hex color code for the icon
  
  // Text callout properties
  text?: string; // The actual text content (max 500 chars)
  fontSize?: number; // Font size (12-48px)
  fontWeight?: 'normal' | 'bold' | 'semibold';
  backgroundColor?: string; // Background color for the callout box
  borderColor?: string; // Border color
  calloutStyle?: 'speech-bubble' | 'rectangular' | 'cloud'; // Visual style
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
    clearMarkers: (state) => {
      state.markers = [];
    },
  },
});

export const { addMarker, updateMarker, deleteMarker, setMarkers, clearMarkers } = markerSlice.actions;
export default markerSlice.reducer;
