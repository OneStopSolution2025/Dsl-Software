// Global declaration for Google Maps API
declare global {
  var google: {
    maps: {
      Map: {
        new (mapDiv: HTMLElement, opts?: google.maps.MapOptions): google.maps.Map;
      };
      Marker: {
        new (opts?: google.maps.MarkerOptions): google.maps.Marker;
      };
      LatLng: {
        new (lat: number, lng: number): google.maps.LatLng;
      };
      Point: {
        new (x: number, y: number): google.maps.Point;
      };
      Size: {
        new (width: number, height: number): google.maps.Size;
      };
      SymbolPath: {
        CIRCLE: number;
      };
    };
  };
}

export {};
