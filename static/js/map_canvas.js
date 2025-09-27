// static/js/map_canvas.js
let map;
let overlay;
let markers = []; // {id, type, icon, lat, lng, element}

function initMap() {
  // Default center (you can geocode server-side and pass coords)
  const defaultCenter = { lat: 13.0827, lng: 80.2707 }; // Chennai example

  map = new google.maps.Map(document.getElementById('map'), {
    center: defaultCenter,
    zoom: 14,
    disableDefaultUI: false,
  });

  // Create overlay view to convert latlng <-> pixel coords
  overlay = new google.maps.OverlayView();
  overlay.onAdd = function() {};
  overlay.draw = function() {};
  overlay.onRemove = function() {};
  overlay.setMap(map);

  setupDragAndDrop();
  setupButtons();
}

function setupDragAndDrop() {
  const iconItems = document.querySelectorAll('.icon-item');
  iconItems.forEach(item => {
    item.addEventListener('dragstart', (ev) => {
      ev.dataTransfer.setData('text/plain', JSON.stringify({
        type: item.dataset.type,
        icon: item.dataset.icon || item.innerText.trim().split(' ')[0]
      }));
    });
  });

  // Map container: allow drop
  const mapDiv = document.getElementById('map');
  mapDiv.addEventListener('dragover', (ev) => ev.preventDefault());
  mapDiv.addEventListener('drop', (ev) => {
    ev.preventDefault();
    const data = JSON.parse(ev.dataTransfer.getData('text/plain'));
    const rect = mapDiv.getBoundingClientRect();
    const x = ev.clientX - rect.left; // pixel coordinates inside map div
    const y = ev.clientY - rect.top;

    // convert pixel to LatLng using overlay projection
    const point = new google.maps.Point(x, y);
    const latLng = overlay.getProjection().fromContainerPixelToLatLng(point);

    addMarker(data.type, data.icon, latLng.lat(), latLng.lng());
  });

  // Also allow click to place currently selected icon (optional)
  document.getElementById('icon-list').addEventListener('click', (e) => {
    const tgt = e.target.closest('.icon-item');
    if(!tgt) return;
    // set one-time click-to-place mode
    const data = { type: tgt.dataset.type, icon: tgt.dataset.icon || tgt.innerText.trim().split(' ')[0] };
    const listener = map.addListener('click', (mEvent) => {
      addMarker(data.type, data.icon, mEvent.latLng.lat(), mEvent.latLng.lng());
      google.maps.event.removeListener(listener);
    });
  });
}

function addMarker(type, iconChar, lat, lng) {
  const id = 'm'+Date.now();
  // create HTML element
  const el = document.createElement('div');
  el.className = 'map-marker';
  el.dataset.id = id;
  el.innerText = iconChar;
  el.title = type;
  // compute screen position
  positionElementOverLatLng(el, lat, lng);

  // allow dragging of the marker (pointer events)
  el.style.pointerEvents = 'auto';
  let isDragging = false;
  let offset = {x:0,y:0};

  // mousedown to start drag
  el.addEventListener('mousedown', (ev) => {
    isDragging = true;
    offset.x = ev.offsetX;
    offset.y = ev.offsetY;
    el.style.cursor = 'grabbing';
  });
  document.addEventListener('mousemove', (ev) => {
    if(!isDragging) return;
    // move element visually (absolute position)
    const rect = document.getElementById('map').getBoundingClientRect();
    const x = ev.clientX - rect.left - offset.x;
    const y = ev.clientY - rect.top - offset.y;
    el.style.left = (x + offset.x) + 'px';
    el.style.top = (y + offset.y) + 'px';
  });
  document.addEventListener('mouseup', (ev) => {
    if(!isDragging) return;
    isDragging = false;
    el.style.cursor = 'pointer';
    // convert new pixel pos to latlng and update marker object
    const rect = document.getElementById('map').getBoundingClientRect();
    const x = parseFloat(el.style.left) + el.offsetWidth/2;
    const y = parseFloat(el.style.top) + el.offsetHeight;
    const point = new google.maps.Point(x, y);
    const latLng = overlay.getProjection().fromContainerPixelToLatLng(point);
    const m = markers.find(m => m.id === id);
    if(m) {
      m.lat = latLng.lat();
      m.lng = latLng.lng();
    }
  });

  // right click to remove
  el.addEventListener('contextmenu', (ev) => {
    ev.preventDefault();
    removeMarker(id);
  });

  document.getElementById('marker-overlay').appendChild(el);

  const markerObj = { id, type, icon: iconChar, lat, lng, element: el };
  markers.push(markerObj);

  // keep overlay in sync on map events
  google.maps.event.addListenerOnce(map, 'idle', () => updateOverlayPositions());
  google.maps.event.addListener(map, 'zoom_changed', updateOverlayPositions);
  google.maps.event.addListener(map, 'center_changed', updateOverlayPositions);
  google.maps.event.addListener(map, 'bounds_changed', updateOverlayPositions);
}

function removeMarker(id) {
  const idx = markers.findIndex(m => m.id === id);
  if(idx >= 0) {
    const m = markers[idx];
    if(m.element && m.element.parentNode) m.element.parentNode.removeChild(m.element);
    markers.splice(idx,1);
  }
}

function updateOverlayPositions() {
  markers.forEach(m => {
    positionElementOverLatLng(m.element, m.lat, m.lng);
  });
}

function positionElementOverLatLng(el, lat, lng) {
  // must have projection available
  const projection = overlay.getProjection();
  if(!projection) {
    // queue for later
    setTimeout(()=>positionElementOverLatLng(el, lat, lng), 50);
    return;
  }
  const latLng = new google.maps.LatLng(lat, lng);
  const point = projection.fromLatLngToContainerPixel(latLng);
  el.style.left = point.x + 'px';
  el.style.top = point.y + 'px';
}

function setupButtons() {
  document.getElementById('clearMapBtn').addEventListener('click', () => {
    // remove DOM elements and marker data
    markers.forEach(m => { if(m.element) m.element.remove(); });
    markers = [];
  });

  document.getElementById('downloadSceneBtn').addEventListener('click', async () => {
    // take screenshot of map container (map canvas + overlay)
    const mapDiv = document.querySelector('.map-container');
    // temporarily set pointer-events to auto on overlay so html2canvas captures markers
    document.getElementById('marker-overlay').style.pointerEvents = 'auto';
    const canvas = await html2canvas(mapDiv, {useCORS:true, allowTaint:true, logging:false});
    document.getElementById('marker-overlay').style.pointerEvents = 'none';
    const link = document.createElement('a');
    link.download = 'accident_scene.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  });

  document.getElementById('exportMarkersBtn').addEventListener('click', () => {
    const data = markers.map(m => ({id:m.id, type:m.type, icon:m.icon, lat:m.lat, lng:m.lng}));
    const blob = new Blob([JSON.stringify(data, null, 2)], {type: 'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'markers.json'; a.click();
    URL.revokeObjectURL(url);
  });
}

// Initialize map when page ready
window.addEventListener('load', () => {
  initMap();
  // Ensure overlay projection ready after idle
  google.maps.event.addListenerOnce(window, 'load', () => {});
});
