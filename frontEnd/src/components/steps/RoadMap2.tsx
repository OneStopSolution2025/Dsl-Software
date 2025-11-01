import { APIProvider, Map } from '@vis.gl/react-google-maps';
import IconPalette from '../common/IconPalette';
import { MapMarker } from '@/utils/supabase';
import { forwardRef, useCallback, useImperativeHandle, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import MapContainer from '../common/MapContainer';
import CustomMarker from '../common/CustomMarker';
import MarkerList from '../common/MarkerList';
import TransformControls from '../common/TransformControls';
import { RootState } from '@/store';
import { addMarker, updateMarker, deleteMarker } from '@/store/slices/mapSlice';
import { addFiles, setSessionData } from '@/store/slices/filesSlice';
import { nextStep } from '@/store/slices/stepperSlice';
import { generateFileId } from '@/utils/fileHelpers';
import html2canvas from 'html2canvas';
import { uploadScreenshotAPI } from '@/utils/api/upload';
import { ServerFile } from '@/types/file.types';
import { useFileUpload } from '@/hooks/useFileUpload';

const KUALA_LUMPUR_CENTER = { lat: 3.139, lng: 101.6869 };

interface RoadMapRef {
    handleNextWithScreenshot: () => Promise<void>;
}

export const RoadMap2 = forwardRef<RoadMapRef>((_, ref) => {
    const dispatch = useDispatch();
    const markers = useSelector((state: RootState) => state.map.markers);
    const [selectedMarkerId, setSelectedMarkerId] = useState<string | undefined>();
    const [draggingIconType, setDraggingIconType] = useState<string | null>(null);
    const [transformControlPos, setTransformControlPos] = useState<{ x: number; y: number } | null>(null);
    const mapRef = useRef<google.maps.Map | null>(null);
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const [captureError, setCaptureError] = useState<string | null>(null);
    const [isCapturing, setIsCapturing] = useState(false);
    const { sessionId } = useSelector((state: RootState) => state.files);
    const { handleFilesAdded } = useFileUpload();

    const handleDragStart = (iconType: string) => {
        setDraggingIconType(iconType);
    };

    const handleMapReady = useCallback((map: google.maps.Map) => {
        mapRef.current = map;
    }, []);

    const handleMapDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
    };

    const handleMapDrop = (e: React.DragEvent) => {
        e.preventDefault();

        if (!draggingIconType || !mapRef.current) return;

        const mapDiv = e.currentTarget as HTMLElement;
        const rect = mapDiv.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const bounds = mapRef.current.getBounds();
        if (!bounds) return;

        const ne = bounds.getNorthEast();
        const sw = bounds.getSouthWest();

        const lat = sw.lat() + (ne.lat() - sw.lat()) * (1 - y / rect.height);
        const lng = sw.lng() + (ne.lng() - sw.lng()) * (x / rect.width);

        dispatch(addMarker({
            icon_type: draggingIconType,
            latitude: lat,
            longitude: lng,
            scale: 1.0,
            rotation: 0,
            flip_horizontal: false,
            flip_vertical: false,
        }));

        setDraggingIconType(null);
    };

    const handleMapClick = (e: google.maps.MapMouseEvent) => {
        if (draggingIconType && e.latLng) {
            const lat = e.latLng.lat();
            const lng = e.latLng.lng();

            dispatch(addMarker({
                icon_type: draggingIconType,
                latitude: lat,
                longitude: lng,
                scale: 1.0,
                rotation: 0,
                flip_horizontal: false,
                flip_vertical: false,
            }));

            setDraggingIconType(null);
        } else {
            setSelectedMarkerId(undefined);
            setTransformControlPos(null);
        }
    };

    const handleMarkerClick = useCallback((id: string, event?: MouseEvent) => {
        setSelectedMarkerId(id);
        if (event && event.domEvent) {
            let rect = event.domEvent.currentTarget.getBoundingClientRect();
            setTransformControlPos({
                x: event.domEvent.clientX + 10,
                y: event.domEvent.clientY - 50,
                h: rect.height,
                w: rect.width
            });
        }
    }, []);

    const handleMarkerDragEnd = (id: string, lat: number, lng: number) => {
        dispatch(updateMarker({ id, latitude: lat, longitude: lng }));
    };

    const handleUpdateMarker = (id: string, updates: Partial<MapMarker>) => {
        dispatch(updateMarker({ id, ...updates }));
    };

    const handleRotate = () => {
        if (!selectedMarkerId) return;
        const marker = markers.find((m) => m.id === selectedMarkerId);
        if (marker) {
            handleUpdateMarker(selectedMarkerId, { rotation: (marker.rotation + 45) % 360 });
        }
    };

    const handleScaleUp = () => {
        if (!selectedMarkerId) return;
        const marker = markers.find((m) => m.id === selectedMarkerId);
        if (marker && marker.scale < 3) {
            handleUpdateMarker(selectedMarkerId, { scale: marker.scale + 0.2 });
        }
    };

    const handleScaleDown = () => {
        if (!selectedMarkerId) return;
        const marker = markers.find((m) => m.id === selectedMarkerId);
        if (marker && marker.scale > 0.4) {
            handleUpdateMarker(selectedMarkerId, { scale: marker.scale - 0.2 });
        }
    };

    const handleFlipHorizontal = () => {
        if (!selectedMarkerId) return;
        const marker = markers.find((m) => m.id === selectedMarkerId);
        if (marker) {
            handleUpdateMarker(selectedMarkerId, { flip_horizontal: !marker.flip_horizontal });
        }
    };

    const handleFlipVertical = () => {
        if (!selectedMarkerId) return;
        const marker = markers.find((m) => m.id === selectedMarkerId);
        if (marker) {
            handleUpdateMarker(selectedMarkerId, { flip_vertical: !marker.flip_vertical });
        }
    };

    const handleDelete = () => {
        if (!selectedMarkerId) return;
        dispatch(deleteMarker(selectedMarkerId));
        setSelectedMarkerId(undefined);
        setTransformControlPos(null);
    };

    const handleNextWithScreenshot = async () => {
        try {
            // Pass the ref to the capture function
            const screenshotDataUrl = await captureMapScreenshot(mapContainerRef.current);
            const response = await fetch(screenshotDataUrl);
            const blob = await response.blob();
            const screenshotFile = new File([blob], 'map-screenshot.png', { type: 'image/png' });

            dispatch(addFiles([{
                id: generateFileId(),
                name: screenshotFile.name,
                size: screenshotFile.size,
                file: screenshotFile,
                status: 'pending',
                progress: 0,

            }]));
            dispatch(nextStep());
        } catch (error) {
            console.error('Failed to capture map screenshot:', error);
        }
    };

    // Expose the function to the parent component
    useImperativeHandle(ref, () => ({
        handleNextWithScreenshot: async () => {
          if (markers.length === 0) return;
    
          try {
            setIsCapturing(true);
            const screenshotFile = await captureMapScreenshot();
    
            if (screenshotFile) {
    
              if (sessionId) {
                try {
                  // Add screenshot to UploadedFiles
                  handleFilesAdded([screenshotFile]);
    
                  const uploadResponse = await uploadScreenshotAPI(screenshotFile, sessionId);
    
                  const resFiles: ServerFile[] = [];
                  if (uploadResponse) {
                    resFiles.push({
                      id: generateFileId(),
                      name: screenshotFile.name,
                      size: screenshotFile.size,
                      file: screenshotFile,
                      status: 'pending',
                      progress: 0,
                      filename: uploadResponse.filename,
                      gcs_path: uploadResponse.gcs_path,
                      public_url: uploadResponse.public_url
                    });
                  }
    
                  dispatch(
                    setSessionData({
                      sessionId: sessionId || '',
                      userName: uploadResponse.user_name || '',
                      serverFileIds: resFiles,
                      uploadedFiles: []
                    })
                  );
    
                  console.log('Screenshot uploaded successfully, new session:', uploadResponse.session_id);
                } catch (uploadError) {
                  console.error('Screenshot upload failed:', uploadError);
                  setCaptureError('Failed to upload screenshot. Please try again.');
                  return;
                }
              }
    
              // Proceed to next step after successful upload
              setTimeout(() => {
                dispatch({ type: 'stepper/nextStep' });
              }, 500);
            }
          } catch (error) {
            console.error('Error in handleNextWithScreenshot:', error);
            setCaptureError('Failed to process screenshot');
          } finally {
            setIsCapturing(false);
          }
        }
      }));

    const captureMapScreenshot = async (): Promise<File | null> => {
        if (!mapContainerRef.current) {
            setCaptureError('Map not available for screenshot');
            return null;
          }

        try {
              setIsCapturing(true);
              setCaptureError(null);
        
              // Configure html2canvas for better map capture
              const canvas = await html2canvas(mapContainerRef.current, {
                useCORS: true,
                allowTaint: true,
                scale: 2, // Higher resolution
                width: mapContainerRef.current.offsetWidth,
                height: mapContainerRef.current.offsetHeight,
                backgroundColor: '#ffffff',
                logging: false,
                onclone: (clonedDoc) => {
                  // Ensure Google Maps renders properly in the cloned document
                  const clonedMap = clonedDoc.querySelector('.gm-style') as HTMLElement;
                  if (clonedMap) {
                    clonedMap.style.transform = 'none';
                    clonedMap.style.transition = 'none';
                  }
                }
              });
        
              // Convert canvas to blob
              return new Promise((resolve) => {
                canvas.toBlob((blob) => {
                  if (blob) {
                    // Create file with timestamp
                    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
                    const file = new File([blob], `map-screenshot-${timestamp}.png`, {
                      type: 'image/png'
                    });
                    resolve(file);
                  } else {
                    setCaptureError('Failed to create screenshot file');
                    resolve(null);
                  }
                }, 'image/png', 0.9);
              });
            } catch (error) {
              console.error('Error capturing screenshot:', error);
              setCaptureError('Failed to capture screenshot');
              return null;
            } finally {
              setIsCapturing(false);
            }
    }

    return (
        <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
            <div className="h-screen flex flex-col bg-gray-50" >
                <div id="map-screenshot-area" className="flex-1 flex flex-col p-4 overflow-hidden">
                    <IconPalette onDragStart={handleDragStart} />

                    <div
                        className="flex-1 rounded-lg overflow-hidden shadow-lg"
                        style={{ cursor: draggingIconType ? 'crosshair' : 'default' }}
                        onDragOver={handleMapDragOver}
                        onDrop={handleMapDrop}
                        ref={mapContainerRef}
                    >

                        <Map
                            defaultCenter={KUALA_LUMPUR_CENTER}
                            defaultZoom={12}
                            gestureHandling="greedy"
                            disableDefaultUI={false}
                            onClick={handleMapClick}
                            mapId="custom-marker-map"
                        >
                            <MapContainer onMapReady={handleMapReady} />
                            {markers.map((marker) => (
                                <CustomMarker
                                    key={marker.id}
                                    marker={marker}
                                    isSelected={marker.id === selectedMarkerId}
                                    onClick={(e) => handleMarkerClick(marker.id, e)}
                                    onDragEnd={(lat, lng) => handleMarkerDragEnd(marker.id, lat, lng)}
                                />
                            ))}
                        </Map>
                    </div>

                    <MarkerList
                        markers={markers}
                        onMarkerClick={(id) => handleMarkerClick(id)}
                        selectedMarkerId={selectedMarkerId}
                    />
                </div>

                {transformControlPos && selectedMarkerId && (
                    <div className="transform-controls">
                        <TransformControls
                            position={transformControlPos}
                            onRotate={handleRotate}
                            onScaleUp={handleScaleUp}
                            onScaleDown={handleScaleDown}
                            onFlipHorizontal={handleFlipHorizontal}
                            onFlipVertical={handleFlipVertical}
                            onDelete={handleDelete}
                        />
                    </div>
                )}
            </div>
        </APIProvider>
    )
})