export type MarkerType = 'car' | 'bike' | 'blast' | 'trespasser' | 'truck' | 'roadblock';

export interface MapMarker {
  id: string;
  type: MarkerType;
  lat: number;
  lng: number;
  iconUrl: string;
}

export interface MarkersState {
  items: MapMarker[];
}

export interface MapCenter {
  lat: number;
  lng: number;
}
