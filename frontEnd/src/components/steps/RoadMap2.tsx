import { useState, useCallback, useRef, forwardRef, useImperativeHandle, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { APIProvider, Map } from '@vis.gl/react-google-maps';
import IconPalette from '../../components/map/IconPalette';
import MarkerList from '../../components/map/MarkerList';
import CustomMarker from '../../components/map/CustomMarker';
import TransformControls from '../../components/map/TransformControls';
import MapContainer from '../../components/map/MapContainer';
import { setSessionData } from "@/store/slices/filesSlice";
import { RootState } from '@/store';
import { addMarker, deleteMarker, MapMarker, updateMarker } from '@/store/slices/markersSlice';
import html2canvas from 'html2canvas';
import { uploadScreenshotAPI } from "@/utils/api/upload";
import { useFileUpload } from "@/hooks/useFileUpload";
import { generateFileId } from "@/utils/fileHelpers";
import { ServerFile } from '@/types/file.types';
import { setCanProceed } from '@/store/slices/stepperSlice';
import { Input } from '@/components/common/Input';

const GOOGLE_MAPS_API_KEY = 'AIzaSyCi1g0u1_0qSZ09q8bkkb-7J5cBhi7iK9s';

interface RoadMapRef {
  handleNextWithScreenshot: () => Promise<void>;
}


export const RoadMap2 = forwardRef<RoadMapRef>((_, ref) => {
  const dispatch = useDispatch();
  const markers = useSelector((state: RootState) => state.markers.markers);
  const [selectedMarkerId, setSelectedMarkerId] = useState<string | undefined>();
  const [draggingIconType, setDraggingIconType] = useState<string | null>(null);
  const [transformControlPos, setTransformControlPos] = useState<{ x: number; y: number, h: number, w: number } | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const { sessionId } = useSelector((state: RootState) => state.files);
  const { handleFilesAdded } = useFileUpload();
  const mapConRef = useRef<HTMLDivElement | null>(null);

  useEffect(() =>{
      dispatch(setCanProceed(markers.length > 0))
  },[dispatch, markers])

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

    const newMarker: MapMarker = {
      id: crypto.randomUUID(),
      icon_type: draggingIconType,
      latitude: lat,
      longitude: lng,
      scale: 1.0,
      rotation: 0,
      flip_horizontal: false,
      flip_vertical: false,
    };

    dispatch(addMarker(newMarker));
    setDraggingIconType(null);
  };

  const handleMapClick = (e: google.maps.MapMouseEvent | any) => {
    if (draggingIconType && e.latLng) {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();

      const newMarker: MapMarker = {
        id: crypto.randomUUID(),
        icon_type: draggingIconType,
        latitude: lat,
        longitude: lng,
        scale: 1.0,
        rotation: 0,
        flip_horizontal: false,
        flip_vertical: false,
      };

      dispatch(addMarker(newMarker));
      setDraggingIconType(null);
    } else {
      setSelectedMarkerId(undefined);
      setTransformControlPos(null);
    }
  };

  const handleMarkerClick = useCallback((id: string, event?: any) => {
    setSelectedMarkerId(id);
    if (event && event.domEvent && mapConRef && mapConRef.current) {
      let rect = event.domEvent.currentTarget.getBoundingClientRect();
      let mapCont = mapConRef.current.getBoundingClientRect();
      setTransformControlPos({
        x: event.domEvent.clientX - mapCont.x,
        y: event.domEvent.clientY - mapCont.y + 32,
        h: rect.height,
        w: rect.width
      });
    }
  }, []);

  const handleMarkerDragEnd = (id: string, lat: number, lng: number) => {
    dispatch(updateMarker({ id, updates: { latitude: lat, longitude: lng } }));
  };

  const updateMarkerAction = (id: string, updates: Partial<MapMarker>) => {
    dispatch(updateMarker({ id, updates }));
  };

  const handleRotate = (e:'cw'|'ccw') => {
    if (!selectedMarkerId) return;
    const marker = markers.find((m) => m.id === selectedMarkerId);
    if (marker) {
      let rotation = (marker.rotation + 45) % 360;
      if(e == 'ccw') rotation = (marker.rotation - 45) % 360;
      updateMarkerAction(selectedMarkerId, { rotation });
    }
  };

  const handleScaleUp = () => {
    if (!selectedMarkerId) return;
    const marker = markers.find((m) => m.id === selectedMarkerId);
    if (marker && marker.scale < 3) {
      updateMarkerAction(selectedMarkerId, { scale: marker.scale + 0.2 });
    }
  };

  const handleScaleDown = () => {
    if (!selectedMarkerId) return;
    const marker = markers.find((m) => m.id === selectedMarkerId);
    if (marker && marker.scale > 0.4) {
      updateMarkerAction(selectedMarkerId, { scale: marker.scale - 0.2 });
    }
  };

  const handleFlipHorizontal = () => {
    if (!selectedMarkerId) return;
    const marker = markers.find((m) => m.id === selectedMarkerId);
    if (marker) {
      updateMarkerAction(selectedMarkerId, { flip_horizontal: !marker.flip_horizontal });
    }
  };

  const handleFlipVertical = () => {
    if (!selectedMarkerId) return;
    const marker = markers.find((m) => m.id === selectedMarkerId);
    if (marker) {
      updateMarkerAction(selectedMarkerId, { flip_vertical: !marker.flip_vertical });
    }
  };

  const handleDelete = () => {
    if (!selectedMarkerId) return;
    dispatch(deleteMarker(selectedMarkerId));
    setSelectedMarkerId(undefined);
    setTransformControlPos(null);
  };

  const handleMarkerListDelete = (id: string) => {
    dispatch(deleteMarker(id));
    if (selectedMarkerId === id) {
      setSelectedMarkerId(undefined);
      setTransformControlPos(null);
    }
  };

  useImperativeHandle(ref, () => ({
    handleNextWithScreenshot: async () => {
      setTransformControlPos(null);

      if (markers.length === 0) return;

      try {

        // setIsCapturing(true);
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
              // setCaptureError('Failed to upload screenshot. Please try again.');
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
        // setCaptureError('Failed to process screenshot');
      } finally {
        // setIsCapturing(false);
      }
    }
  }));

  // // --- Capture Map Screenshot ---
  const captureMapScreenshot = async (): Promise<File | null> => {
    if (!mapConRef.current || !mapRef) {
      // setCaptureError('Map not available for screenshot');
      return null;
    }

    try {
      // setIsCapturing(true);
      // setCaptureError(null);

      // Configure html2canvas for better map capture
      const canvas = await html2canvas(mapConRef.current, {
        useCORS: true,
        allowTaint: true,
        scale: 1, // Higher resolution
        width: mapConRef.current.offsetWidth,
        height: mapConRef.current.offsetHeight,
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
            // setCaptureError('Failed to create screenshot file');
            resolve(null);
          }
        }, 'image/png', 0.9);
      });
    } catch (error) {
      console.error('Error capturing screenshot:', error);
      // setCaptureError('Failed to capture screenshot');
      return null;
    } finally {
      // setIsCapturing(false);
    }
  };

  return (
    <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
      <div className="h-full flex flex-col bg-gray-50">
        <div className="h-full grid grid-cols-1 md:grid-cols-12 p-4 gap-4 overflow-hidden">
          <div className='md:col-span-2 max-h-[500px] overflow-scroll'>
            <IconPalette onDragStart={handleDragStart} />
          </div>

          <div ref={mapConRef}
            className="col-span-10 flex-1 rounded-lg overflow-hidden shadow-lg relative"
            style={{ cursor: draggingIconType ? 'crosshair' : 'default' }}
            onDragOver={handleMapDragOver}
            onDrop={handleMapDrop}
          >
            <div className="flex items-center gap-2 mb-4 px-4">
              <Input className='w-20' />
              <Input />
            </div>
            <Map
              // defaultCenter={{ lat: 37.7749, lng: -122.4194 }}
              center={{lat: 53.54992, lng: 10.00678}}
              defaultZoom={20}
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
                  onClick={(e: any) => handleMarkerClick(marker.id, e)}
                  onDragEnd={(lat, lng) => handleMarkerDragEnd(marker.id, lat, lng)}
                />
              ))}
            </Map>

            {transformControlPos && selectedMarkerId && (
              <TransformControls
                position={transformControlPos}
                onRotate={handleRotate}
                onScaleUp={handleScaleUp}
                onScaleDown={handleScaleDown}
                onFlipHorizontal={handleFlipHorizontal}
                onFlipVertical={handleFlipVertical}
                onDelete={handleDelete}
              />
            )}
          </div>

          <div className='col-span-12'>
            <MarkerList
              markers={markers}
              onMarkerClick={(id) => handleMarkerClick(id)}
              onMarkerDelete={handleMarkerListDelete}
              selectedMarkerId={selectedMarkerId}
            />
          </div>
        </div>

      </div>
    </APIProvider>
  );
})