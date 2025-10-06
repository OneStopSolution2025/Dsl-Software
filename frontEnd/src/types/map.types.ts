export type MarkerType = 'car' | 'bike' | 'blast' | 'trespasser';

export interface MapMarker {
  id: string;
  type: MarkerType;
  lat: number;
  lng: number;
}

export interface MarkersState {
  items: MapMarker[];
}

export interface MapCenter {
  lat: number;
  lng: number;
}
