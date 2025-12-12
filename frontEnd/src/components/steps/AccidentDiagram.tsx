import React, { useState, useRef, forwardRef, useImperativeHandle } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fabric } from 'fabric';
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
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors font-medium"
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

      const screenshots: {
        roadmap?: string;
        blank?: string;
        scene?: string;
      } = {};

      // Capture Road Map screenshot (from form.images if already saved)
      // Road Map component handles its own screenshot and saves to Redux
      // We'll get it from Redux in handleConfirmPreview

      // Capture Blank Canvas if it has changes
      if (blankCanvasRef.current && hasCanvasChanges(blankCanvasRef.current, false)) {
        const blankScreenshot = await exportCanvasToBase64(blankCanvasRef.current);
        screenshots.blank = blankScreenshot;
      }

      // Capture Scene Canvas if it has changes
      if (sceneCanvasRef.current && hasCanvasChanges(sceneCanvasRef.current, true)) {
        const sceneScreenshot = await exportCanvasToBase64(sceneCanvasRef.current);
        screenshots.scene = sceneScreenshot;
      }

      // Get Road Map screenshot from Redux if it exists
      if (formImages['SKETCH_PLAN']) {
        screenshots.roadmap = formImages['SKETCH_PLAN'];
      }

      setCapturedScreenshots(screenshots);
      setShowPreview(true);
    } catch (error) {
      console.error('Error capturing screenshots:', error);
      toast.error('Failed to capture screenshots');
    }
  };

  const handleConfirmPreview = async () => {
    try {
      // Save Blank Canvas screenshot to Redux (only if exists)
      if (capturedScreenshots.blank) {
        dispatch(updateImage({ fieldKey: 'SKETCH_PLAN', base64: capturedScreenshots.blank }));
      }

      // Save Scene Canvas screenshot to Redux (only if exists)
      if (capturedScreenshots.scene) {
        dispatch(updateImage({ fieldKey: 'SCENE_1', base64: capturedScreenshots.scene }));
      }

      // Also trigger Road Map screenshot save if not already done
      if (roadMapRef.current?.handleNextWithScreenshot) {
        await roadMapRef.current.handleNextWithScreenshot();
      }

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
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-2 mb-4">
        <div className="inline-flex rounded-lg bg-gray-100 p-1" role="group">
          {buttons.map((button) => (
            <button
              key={button.id}
              onClick={() => setActiveView(button.id)}
              className={`px-6 py-2 text-sm font-medium rounded-md transition-all ${
                activeView === button.id
                  ? 'bg-blue-500 text-white shadow-sm'
                  : 'text-gray-700 hover:bg-gray-200'
              }`}
            >
              {button.label}
            </button>
          ))}
        </div>
      </div>

      {/* Canvas Views */}
      <div className="flex-1 overflow-hidden">
        {activeView === 'roadmap' && (
          <RoadMap2 ref={roadMapRef} />
        )}
        {activeView === 'blank' && (
          <BlankCanvas
            onCanvasChange={() => {}}
            canvasRef={blankCanvasRef}
          />
        )}
        {activeView === 'scene' && (
          <SceneCanvas
            onCanvasChange={() => {}}
            canvasRef={sceneCanvasRef}
          />
        )}
      </div>

      {/* Preview Dialog */}
      {showPreview && (
        <PreviewDialog
          screenshots={capturedScreenshots}
          onConfirm={handleConfirmPreview}
          onCancel={handleCancelPreview}
        />
      )}
    </div>
  );
});

export default AccidentDiagram;
