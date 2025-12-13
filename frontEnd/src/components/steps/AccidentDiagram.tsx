import React, { useState, useRef, forwardRef, useImperativeHandle } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fabric } from 'fabric';
import html2canvas from 'html2canvas';
import { RootState } from '@/store';
import { updateImage } from '@/store/slices/formSlice';
import { setCanProceed, nextStep } from '@/store/slices/stepperSlice';
import BlankCanvas from '@/components/map/BlankCanvas';
import SceneCanvas from '@/components/map/SceneCanvas';
import { RoadMap2 } from './RoadMap2';
import { exportCanvasToBase64, hasCanvasChanges } from '@/utils/canvasHelpers';
import toast from 'react-hot-toast';

interface AccidentDiagramRef {
  handleNextWithScreenshot: () => Promise<void>;
}

type CanvasView = 'roadmap' | 'blank' | 'scene';

interface PreviewDialogProps {
  screenshots: {
    roadmap?: string;
    blank?: string;
    scene?: string;
  };
  onConfirm: () => void;
  onCancel: () => void;
}

const PreviewDialog: React.FC<PreviewDialogProps> = ({ screenshots, onConfirm, onCancel }) => {
  const imagesToShow = Object.entries(screenshots).filter(([_, img]) => img);
  const hasAnyScreenshot = imagesToShow.length > 0;

  const labels: Record<string, string> = {
    roadmap: 'Road Map',
    blank: 'Blank Canvas',
    scene: 'Scene Canvas',
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Preview Accident Diagrams
          </h2>

          {!hasAnyScreenshot ? (
            <p className="text-gray-600 mb-6">No diagrams captured.</p>
          ) : (
            <div className={`grid grid-cols-1 ${imagesToShow.length === 2 ? 'md:grid-cols-2' : imagesToShow.length === 3 ? 'md:grid-cols-3' : ''} gap-4 mb-6`}>
              {imagesToShow.map(([key, img]) => (
                <div key={key}>
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">{labels[key]}</h3>
                  <img
                    src={img}
                    alt={labels[key]}
                    className="w-full border border-gray-300 rounded"
                  />
                </div>
              ))}
            </div>
          )}

          <div className="flex gap-3 justify-end">
            <button
              onClick={onCancel}
              className="px-6 py-2.5 bg-neutral-100 text-neutral-700 rounded-lg hover:bg-neutral-200 transition-colors font-semibold"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-6 py-2.5 btn-primary rounded-lg font-semibold"
            >
              Confirm & Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const AccidentDiagram = forwardRef<AccidentDiagramRef>((_, ref) => {
  const dispatch = useDispatch();
  const markers = useSelector((state: RootState) => state.markers.markers);
  const formImages = useSelector((state: RootState) => state.form.images);

  const [activeView, setActiveView] = useState<CanvasView>('roadmap');
  const [showPreview, setShowPreview] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [capturedScreenshots, setCapturedScreenshots] = useState<{
    roadmap?: string;
    blank?: string;
    scene?: string;
  }>({});

  const roadMapRef = useRef<any>(null);
  const blankCanvasRef = useRef<fabric.Canvas | null>(null);
  const sceneCanvasRef = useRef<fabric.Canvas | null>(null);

  // Expose handleNextWithScreenshot to parent
  useImperativeHandle(ref, () => ({
    handleNextWithScreenshot: async () => {
      await handleCaptureAndPreview();
    },
  }));

  const handleCaptureAndPreview = async () => {
    try {
      // Check if Road Map has markers
      if (markers.length === 0) {
        // Show alert and switch to Road Map
        if (confirm('Please add icons on the map to proceed.\n\nClick OK to switch to Road Map.')) {
          setActiveView('roadmap');
        }
        return;
      }

      // Switch to Road Map tab before capturing
      setActiveView('roadmap');

      // Show loader overlay
      setIsCapturing(true);

      // Wait for tab switch and UI to update
      await new Promise(resolve => setTimeout(resolve, 500));

      const screenshots: {
        roadmap?: string;
        blank?: string;
        scene?: string;
      } = {};

      // Capture Road Map screenshot using html2canvas
      if (roadMapRef.current) {
        try {
          const mapContainer = roadMapRef.current.getMapContainer?.();
          if (mapContainer) {
            const canvas = await html2canvas(mapContainer, {
              useCORS: true,
              allowTaint: true,
              scale: 1,
              width: mapContainer.offsetWidth,
              height: mapContainer.offsetHeight,
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

            // Convert canvas to base64
            const roadmapBase64 = canvas.toDataURL('image/png', 0.9);
            screenshots.roadmap = roadmapBase64;
            // Save to Redux immediately
            dispatch(updateImage({ fieldKey: 'ROAD_MAP_SCREENSHOT', base64: roadmapBase64 }));
          }
        } catch (error) {
          console.error('Error capturing Road Map:', error);
          // Use existing if capture fails
          if (formImages['ROAD_MAP_SCREENSHOT']) {
            screenshots.roadmap = formImages['ROAD_MAP_SCREENSHOT'];
          }
        }
      }

      // Wait a bit for processing
      await new Promise(resolve => setTimeout(resolve, 500));

      // Capture Blank Canvas if it has changes
      if (blankCanvasRef.current && hasCanvasChanges(blankCanvasRef.current, false)) {
        const blankScreenshot = await exportCanvasToBase64(blankCanvasRef.current);
        screenshots.blank = blankScreenshot;
        // Save to Redux immediately
        dispatch(updateImage({ fieldKey: 'BLANK_CANVAS_SCREENSHOT', base64: blankScreenshot }));
      }

      // Capture Scene Canvas if it has changes
      if (sceneCanvasRef.current && hasCanvasChanges(sceneCanvasRef.current, true)) {
        const sceneScreenshot = await exportCanvasToBase64(sceneCanvasRef.current);
        screenshots.scene = sceneScreenshot;
        // Save to Redux immediately
        dispatch(updateImage({ fieldKey: 'SCENE_CANVAS_SCREENSHOT', base64: sceneScreenshot }));
      }

      // Wait a bit before showing preview
      await new Promise(resolve => setTimeout(resolve, 300));

      // Hide loader and show preview
      setIsCapturing(false);
      setCapturedScreenshots(screenshots);
      setShowPreview(true);
    } catch (error) {
      console.error('Error capturing screenshots:', error);
      setIsCapturing(false);
      toast.error('Failed to capture screenshots');
    }
  };

  const handleConfirmPreview = async () => {
    try {
      // All screenshots are already saved to Redux during capture
      // Close the preview and proceed to next step (AutoFill)
      setShowPreview(false);
      dispatch(setCanProceed(true));
      dispatch(nextStep());
      toast.success('Accident diagrams saved successfully!');
    } catch (error) {
      console.error('Error saving screenshots:', error);
      toast.error('Failed to save screenshots');
    }
  };

  const handleCancelPreview = () => {
    setShowPreview(false);
    setCapturedScreenshots({});
  };

  const buttons: Array<{ id: CanvasView; label: string }> = [
    { id: 'roadmap', label: 'Road Map' },
    { id: 'blank', label: 'Blank Canvas' },
    { id: 'scene', label: 'Scene Canvas' },
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Button Group Navigation */}
      <div className="bg-white border border-neutral-200 rounded-lg shadow-sm p-2 mb-4">
        <div className="inline-flex rounded-lg bg-neutral-100 p-1" role="group">
          {buttons.map((button) => (
            <button
              key={button.id}
              onClick={() => setActiveView(button.id)}
              className={`px-6 py-2.5 text-sm font-semibold rounded-md transition-all ${
                activeView === button.id
                  ? 'bg-primary-500 text-white shadow-md'
                  : 'text-neutral-700 hover:bg-neutral-200'
              }`}
            >
              {button.label}
            </button>
          ))}
        </div>
      </div>

      {/* Canvas Views */}
      <div className="flex-1 overflow-hidden">
        <div className={activeView === 'roadmap' ? 'block h-full' : 'hidden'}>
          <RoadMap2 ref={roadMapRef} />
        </div>
        <div className={activeView === 'blank' ? 'block h-full' : 'hidden'}>
          <BlankCanvas
            onCanvasChange={() => {}}
            canvasRef={blankCanvasRef}
          />
        </div>
        <div className={activeView === 'scene' ? 'block h-full' : 'hidden'}>
          <SceneCanvas
            onCanvasChange={() => {}}
            canvasRef={sceneCanvasRef}
          />
        </div>
      </div>

      {/* Preview Dialog */}
      {showPreview && (
        <PreviewDialog
          screenshots={capturedScreenshots}
          onConfirm={handleConfirmPreview}
          onCancel={handleCancelPreview}
        />
      )}

      {/* Loader Overlay */}
      {isCapturing && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999]">
          <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md mx-4">
            <div className="flex flex-col items-center">
              {/* Spinner */}
              <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mb-4"></div>
              {/* Message */}
              <h3 className="text-lg font-semibold text-neutral-800 mb-2">
                Capturing Screenshots...
              </h3>
              <p className="text-sm text-neutral-600 text-center">
                Please wait while we prepare your accident diagrams
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

export default AccidentDiagram;
