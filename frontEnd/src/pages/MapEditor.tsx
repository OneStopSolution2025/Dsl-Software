import React, { useState, useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Stage, Layer, Image as KonvaImage, Transformer } from 'react-konva';
import Konva from 'konva';
import { useLoadScript, GoogleMap } from '@react-google-maps/api';

const LIBRARIES: ('drawing' | 'geometry' | 'localContext' | 'places' | 'visualization')[] = ['places'];
const MAP_CONTAINER_STYLE = { width: '100%', height: '100vh' };
const CENTER = { lat: 3.139, lng: 101.6869 };
const ICONS = [
    { name: 'Car', src: '/src/assets/icons/car.png' },
    { name: 'Bike', src: '/src/assets/icons/bike.png' },
    { name: 'Truck', src: '/src/assets/icons/truck.png' },
    { name: 'Blast', src: '/src/assets/icons/blast.png' },
    { name: 'Trespasser', src: '/src/assets/icons/trespasser.png' },
];

const KonvaOverlay = ({ map, images, setImages, selectedId, selectShape }) => {
    const konvaContainer = useRef(document.createElement('div'));
    const overlayView = useRef<google.maps.OverlayView>();
    const stageRef = useRef<Konva.Stage>(null);
    const trRef = useRef<Konva.Transformer>(null);
    const [isDragging, setIsDragging] = useState(false);

    const getLatLngFromPixel = useCallback((pixel: { x: number; y: number; }) => {
        if (!overlayView.current) return null;
        const projection = overlayView.current.getProjection();
        if (!projection) return null;
        return projection.fromContainerPixelToLatLng(new window.google.maps.Point(pixel.x, pixel.y));
    }, []);

    useEffect(() => {
        const container = konvaContainer.current;
        const handleDragOver = (e: DragEvent) => e.preventDefault();
        const handleDrop = (e: DragEvent) => {
            e.preventDefault();
            const imgSrc = e.dataTransfer?.getData('text/plain');
            if (!imgSrc) return;

            const latLng = getLatLngFromPixel({ x: e.clientX, y: e.clientY });
            if (!latLng) return;

            const newImage = new window.Image();
            newImage.src = imgSrc;
            newImage.onload = () => {
                setImages((prev: any[]) => [...prev, {
                    lat: latLng.lat(),
                    lng: latLng.lng(),
                    id: Date.now().toString(),
                    image: newImage,
                    rotation: 0,
                    scaleX: 1,
                    scaleY: 1,
                }]);
            };
        };

        container.addEventListener('dragover', handleDragOver);
        container.addEventListener('drop', handleDrop);

        const Overlay = class extends window.google.maps.OverlayView {
            onAdd() { this.getPanes()?.overlayMouseTarget.appendChild(container); }
            onRemove() { container.parentElement?.removeChild(container); }
            draw() {
                const projection = this.getProjection();
                if (!projection || !map) return;

                Object.assign(container.style, {
                    left: '0px', top: '0px', position: 'absolute',
                    width: `${map.getDiv().clientWidth}px`,
                    height: `${map.getDiv().clientHeight}px`
                });
                stageRef.current?.batchDraw();
            }
        };

        overlayView.current = new Overlay();
        overlayView.current.setMap(map);

        return () => {
            container.removeEventListener('dragover', handleDragOver);
            container.removeEventListener('drop', handleDrop);
            overlayView.current?.setMap(null);
        };
    }, [map, getLatLngFromPixel, setImages]);

    useEffect(() => {
        const stage = stageRef.current;
        const selectedNode = stage?.findOne('#' + selectedId);
        trRef.current?.nodes(selectedNode ? [selectedNode] : []);
    }, [selectedId]);

    const getPixelFromLatLng = useCallback((latLng: { lat: number; lng: number; }) => {
        if (!overlayView.current) return { x: -1000, y: -1000 };
        const projection = overlayView.current.getProjection();
        const point = projection?.fromLatLngToDivPixel(new window.google.maps.LatLng(latLng.lat, latLng.lng));
        return point || { x: -1000, y: -1000 };
    }, []);

    const handleDragEnd = (e: Konva.KonvaEventObject<DragEvent>) => {
        setIsDragging(false);
        const latLng = getLatLngFromPixel({ x: e.target.x(), y: e.target.y() });
        if (latLng) {
            const id = e.target.id();
            setImages((imgs: any[]) => imgs.map((img) => (img.id === id ? { ...img, lat: latLng.lat(), lng: latLng.lng() } : img)));
        }
    };

    useEffect(() => { map?.setOptions({ draggable: !isDragging }); }, [map, isDragging]);

    return createPortal(
        <Stage ref={stageRef} width={map?.getDiv().clientWidth} height={map?.getDiv().clientHeight} onMouseDown={(e) => e.target === e.target.getStage() && selectShape(null)}>
            <Layer>
                {images.map((image) => {
                    const { x, y } = getPixelFromLatLng({ lat: image.lat, lng: image.lng });
                    return (
                        <KonvaImage
                            key={image.id}
                            id={image.id}
                            image={image.image}
                            x={x}
                            y={y}
                            offsetX={image.image.width / 2}
                            offsetY={image.image.height / 2}
                            rotation={image.rotation}
                            scaleX={image.scaleX}
                            scaleY={image.scaleY}
                            draggable
                            onDragStart={() => setIsDragging(true)}
                            onDragEnd={handleDragEnd}
                            onTransformEnd={(e) => {
                                const node = e.target;
                                const scaleX = node.scaleX();
                                const scaleY = node.scaleY();
                                const rotation = node.rotation();
                                const latLng = getLatLngFromPixel({ x: node.x(), y: node.y() });
                                if (latLng) {
                                    setImages((imgs: any[]) =>
                                        imgs.map((img) =>
                                            img.id === image.id ? { ...img, lat: latLng.lat(), lng: latLng.lng(), scaleX, scaleY, rotation } : img
                                        )
                                    );
                                }
                            }}
                            onClick={() => selectShape(image.id)}
                            onTap={() => selectShape(image.id)}
                        />
                    );
                })}
                <Transformer
                    ref={trRef}
                    rotateEnabled={true}
                    borderDash={[6, 2]}
                    borderStroke="blue"
                    anchorStroke="blue"
                    anchorFill="lightblue"
                    anchorSize={10}
                    rotationSnaps={[0, 90, 180, 270]}
                />
            </Layer>
        </Stage>,
        konvaContainer.current
    );
};

const MapEditor = () => {
    const { isLoaded, loadError } = useLoadScript({ googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY, libraries: LIBRARIES });
    const [map, setMap] = useState<google.maps.Map | null>(null);
    const [images, setImages] = useState<any[]>([]);
    const [selectedId, selectShape] = useState<string | null>(null);

    const onLoad = useCallback((mapInstance: google.maps.Map) => setMap(mapInstance), []);
    const onUnmount = useCallback(() => setMap(null), []);

    if (loadError) return <div>Error loading maps. Please ensure you have a valid Google Maps API key.</div>;
    if (!isLoaded) return <div>Loading Maps...</div>;

    return (
        <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
            <div className="flex gap-2 p-4 bg-gray-100" style={{ position: 'absolute', zIndex: 1 }}>
                {ICONS.map((icon, i) => (
                    <img key={i} alt={icon.name} src={icon.src} draggable="true" onDragStart={(e) => e.dataTransfer.setData('text/plain', icon.src)} style={{ width: 50, height: 50, cursor: 'pointer' }} />
                ))}
            </div>
            <GoogleMap
                mapContainerStyle={MAP_CONTAINER_STYLE}
                center={CENTER}
                zoom={12}
                onLoad={onLoad}
                onUnmount={onUnmount}
                options={{ disableDefaultUI: true, zoomControl: true }}
            >
                {map && <KonvaOverlay map={map} images={images} setImages={setImages} selectedId={selectedId} selectShape={selectShape} />}
            </GoogleMap>
        </div>
    );
};

export default MapEditor;
