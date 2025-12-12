import React, { useState, useRef, forwardRef, useImperativeHandle } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fabric } from 'fabric';
import { RootState } from '@/store';
import { updateImage } from '@/store/slices/formSlice';
import { addServerFile } from '@/store/slices/filesSlice';
import { setCanProceed } from '@/store/slices/stepperSlice';
import BlankCanvas from '@/components/map/BlankCanvas';
import SceneCanvas from '@/components/map/SceneCanvas';
import { RoadMap2 } from './RoadMap2';
import { exportCanvasToBase64, hasCanvasChanges } from '@/utils/canvasHelpers';
import { uploadScreenshotAPI } from '@/utils/api/upload';
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
  const hasAnyScreenshot = screenshots.roadmap || screenshots.blank || screenshots.scene;

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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {screenshots.roadmap && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">Road Map</h3>
                  <img
                    src={screenshots.roadmap}
                    alt="Road Map"
                    className="w-full border border-gray-300 rounded"
                  />
                </div>
              )}
              {screenshots.blank && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">Blank Canvas</h3>
                  <img
                    src={screenshots.blank}
                    alt="Blank Canvas"
                    className="w-full border border-gray-300 rounded"
                  />
                </div>
              )}
              {screenshots.scene && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">Scene Canvas</h3>
                  <img
                    src={screenshots.scene}
                    alt="Scene Canvas"
                    className="w-full border border-gray-300 rounded"
                  />
                </div>
              )}
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

interface EmptyCanvasConfirmationDialogProps {
  onEdit: () => void;
  onContinue: () => void;
}

const EmptyCanvasConfirmationDialog: React.FC<EmptyCanvasConfirmationDialogProps> = ({
  onEdit,
  onContinue,
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-3">
          Empty Canvas Detected
        </h2>
        <p className="text-gray-600 mb-6">
          Both the Blank Canvas and Scene Canvas are empty. Would you like to edit them or
          continue anyway?
        </p>

        <div className="flex gap-3">
          <button
            onClick={onEdit}
            className="flex-1 px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors font-medium"
          >
            Edit Canvas
          </button>
          <button
            onClick={onContinue}
            className="flex-1 px-6 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors font-medium"
          >
            Continue Anyway
          </button>
        </div>
      </div>
    </div>
  );
};

export const AccidentDiagram = forwardRef<AccidentDiagramRef>((_, ref) => {
  const dispatch = useDispatch();
  const { sessionId } = useSelector((state: RootState) => state.files);

  const [activeView, setActiveView] = useState<CanvasView>('roadmap');
  const [showPreview, setShowPreview] = useState(false);
  const [showEmptyConfirmation, setShowEmptyConfirmation] = useState(false);
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
      const screenshots: {
        roadmap?: string;
        blank?: string;
        scene?: string;
      } = {};

      // Capture Road Map screenshot (always capture if markers exist)
      if (roadMapRef.current?.handleNextWithScreenshot) {
        // Road Map component will handle its own screenshot and save
        // We'll just get a reference for preview
        const roadMapScreenshot = await captureRoadMapScreenshot();
        if (roadMapScreenshot) {
          screenshots.roadmap = roadMapScreenshot;
        }
      }

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

      // Check if both Blank and Scene are empty
      if (!screenshots.blank && !screenshots.scene) {
        setShowEmptyConfirmation(true);
        return;
      }

      setCapturedScreenshots(screenshots);
      setShowPreview(true);
    } catch (error) {
      console.error('Error capturing screenshots:', error);
      toast.error('Failed to capture screenshots');
    }
  };

  const captureRoadMapScreenshot = async (): Promise<string | undefined> => {
    // This is a placeholder - the RoadMap2 component handles its own screenshot
    // We return undefined here as RoadMap saves directly
    return undefined;
  };

  const handleConfirmPreview = async () => {
    try {
      // Upload Blank Canvas screenshot to server
      if (capturedScreenshots.blank) {
        const blob = await fetch(capturedScreenshots.blank).then((r) => r.blob());
        const file = new File([blob], 'blank_canvas.png', { type: 'image/png' });
        
        if (sessionId) {
          const response = await uploadScreenshotAPI(file, sessionId);
          if (response.success && response.file) {
            dispatch(addServerFile(response.file));
          }
        }
        
        // Save to Redux with SKETCH_PLAN key (priority over Road Map)
        dispatch(updateImage({ fieldKey: 'SKETCH_PLAN', base64: capturedScreenshots.blank }));
      }

      // Upload Scene Canvas screenshot to server
      if (capturedScreenshots.scene) {
        const blob = await fetch(capturedScreenshots.scene).then((r) => r.blob());
        const file = new File([blob], 'scene_canvas.png', { type: 'image/png' });
        
        if (sessionId) {
          const response = await uploadScreenshotAPI(file, sessionId);
          if (response.success && response.file) {
            dispatch(addServerFile(response.file));
          }
        }
        
        // Save to Redux with SCENE_1 key
        dispatch(updateImage({ fieldKey: 'SCENE_1', base64: capturedScreenshots.scene }));
      }

      // Also trigger Road Map screenshot save
      if (roadMapRef.current?.handleNextWithScreenshot) {
        await roadMapRef.current.handleNextWithScreenshot();
      }

      setShowPreview(false);
      dispatch(setCanProceed(true));
      toast.success('Accident diagrams saved successfully!');
    } catch (error) {
      console.error('Error uploading screenshots:', error);
      toast.error('Failed to upload screenshots');
    }
  };

  const handleCancelPreview = () => {
    setShowPreview(false);
    setCapturedScreenshots({});
  };

  const handleEditCanvas = () => {
    setShowEmptyConfirmation(false);
    setActiveView('blank');
  };

  const handleContinueAnyway = async () => {
    setShowEmptyConfirmation(false);
    
    // Still capture Road Map screenshot if available
    if (roadMapRef.current?.handleNextWithScreenshot) {
      await roadMapRef.current.handleNextWithScreenshot();
    }
    
    dispatch(setCanProceed(true));
    toast.success('Proceeding without canvas diagrams');
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

      {/* Empty Canvas Confirmation Dialog */}
      {showEmptyConfirmation && (
        <EmptyCanvasConfirmationDialog
          onEdit={handleEditCanvas}
          onContinue={handleContinueAnyway}
        />
      )}
    </div>
  );
});

export default AccidentDiagram;
