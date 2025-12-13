import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { useDispatch, useSelector } from 'react-redux';
import { fabric } from 'fabric';
import { Upload, X } from 'lucide-react';
import { RootState } from '@/store';
import { setSceneCanvasJSON, setSceneBackground, clearSceneBackground } from '@/store/slices/canvasSlice';
import DrawingToolbar, { DrawingTool } from './DrawingToolbar';
import ColorPicker from './ColorPicker';
import FontSelector from './FontSelector';
import VehicleIconPicker from './VehicleIconPicker';
import IconPalette from './IconPalette';
import { getIconByType } from './enhancedMapIcons';
import {
  initializeFabricCanvas,
  createUndoRedoState,
  saveCanvasState,
  undo,
  redo,
  clearCanvas,
  enableDrawingMode,
  disableDrawingMode,
  addRectangle,
  addCircle,
  addArrow,
  addText,
  deleteSelectedObjects,
  setBackgroundImage,
  UndoRedoState,
} from '@/utils/fabricHelpers';
import { validateFileSize, fileToBase64 } from '@/utils/canvasHelpers';

interface SceneCanvasProps {
  onCanvasChange?: (hasChanges: boolean) => void;
  canvasRef?: React.MutableRefObject<fabric.Canvas | null>;
}

const SceneCanvas: React.FC<SceneCanvasProps> = ({ onCanvasChange, canvasRef: externalCanvasRef }) => {
  const dispatch = useDispatch();
  const sceneCanvasJSON = useSelector((state: RootState) => state.canvas.sceneCanvasJSON);
  const sceneBackgroundImage = useSelector((state: RootState) => state.canvas.sceneBackgroundImage);
  const sceneBackgroundFileName = useSelector((state: RootState) => state.canvas.sceneBackgroundFileName);
  
  const internalCanvasRef = useRef<fabric.Canvas | null>(null);
  const canvasElementRef = useRef<HTMLCanvasElement | null>(null);
  const undoRedoStateRef = useRef<UndoRedoState>(createUndoRedoState());
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const isLoadingFromRedux = useRef(false);
  
  const [activeTool, setActiveTool] = useState<DrawingTool>('select');
  const [currentColor, setCurrentColor] = useState('#000000');
  const [fontSize, setFontSize] = useState(20);
  const [fontFamily, setFontFamily] = useState('Arial');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showFontSelector, setShowFontSelector] = useState(false);
  const [showVehiclePicker, setShowVehiclePicker] = useState(false);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [hasBackgroundImage, setHasBackgroundImage] = useState(false);
  const [backgroundFileName, setBackgroundFileName] = useState<string>('');

  // Initialize background state from Redux
  useEffect(() => {
    if (sceneBackgroundImage && sceneBackgroundFileName) {
      setHasBackgroundImage(true);
      setBackgroundFileName(sceneBackgroundFileName);
    }
  }, []);

  // Initialize canvas
  useEffect(() => {
    if (!canvasElementRef.current) return;

    const canvas = initializeFabricCanvas(canvasElementRef.current);
    internalCanvasRef.current = canvas;
    
    // Expose canvas to parent component if needed
    if (externalCanvasRef) {
      externalCanvasRef.current = canvas;
    }

    // Load from Redux if available
    if (sceneCanvasJSON) {
      isLoadingFromRedux.current = true;
      canvas.loadFromJSON(sceneCanvasJSON, () => {
        canvas.renderAll();
        isLoadingFromRedux.current = false;
        // Save initial state after loading
        saveCanvasState(canvas, undoRedoStateRef.current);
        updateUndoRedoState();
        notifyCanvasChange();
      });
    } else if (sceneBackgroundImage) {
      // Load background image if exists
      isLoadingFromRedux.current = true;
      setBackgroundImage(canvas, sceneBackgroundImage, () => {
        isLoadingFromRedux.current = false;
        saveCanvasState(canvas, undoRedoStateRef.current);
        updateUndoRedoState();
        notifyCanvasChange();
      });
    } else {
      // Save initial state for new canvas
      saveCanvasState(canvas, undoRedoStateRef.current);
    }

    // Setup event listeners for tracking changes
    const handleObjectAdded = () => {
      if (!isLoadingFromRedux.current) {
        saveCanvasState(canvas, undoRedoStateRef.current);
        updateUndoRedoState();
        notifyCanvasChange();
        saveToRedux();
      }
    };

    const handleObjectModified = () => {
      saveCanvasState(canvas, undoRedoStateRef.current);
      updateUndoRedoState();
      notifyCanvasChange();
      saveToRedux();
    };

    const handleObjectRemoved = () => {
      updateUndoRedoState();
      notifyCanvasChange();
      saveToRedux();
    };

    canvas.on('object:added', handleObjectAdded);
    canvas.on('object:modified', handleObjectModified);
    canvas.on('object:removed', handleObjectRemoved);

    // Enable keyboard shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      // Delete key
      if (e.key === 'Delete' || e.key === 'Backspace') {
        const activeObject = canvas.getActiveObject();
        // Prevent deleting background image (first object)
        if (activeObject && canvas.getObjects()[0] !== activeObject) {
          deleteSelectedObjects(canvas);
        }
      }
      // Undo (Cmd/Ctrl + Z)
      if ((e.metaKey || e.ctrlKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        handleUndo();
      }
      // Redo (Cmd/Ctrl + Shift + Z)
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'z') {
        e.preventDefault();
        handleRedo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      canvas.off('object:added', handleObjectAdded);
      canvas.off('object:modified', handleObjectModified);
      canvas.off('object:removed', handleObjectRemoved);
      window.removeEventListener('keydown', handleKeyDown);
      canvas.dispose();
    };
  }, []);

  const saveToRedux = () => {
    const canvas = internalCanvasRef.current;
    if (canvas && !isLoadingFromRedux.current) {
      const json = JSON.stringify(canvas.toJSON());
      dispatch(setSceneCanvasJSON(json));
    }
  };

  // Handle tool changes
  useEffect(() => {
    const canvas = internalCanvasRef.current;
    if (!canvas) return;

    switch (activeTool) {
      case 'select':
        disableDrawingMode(canvas);
        canvas.selection = true;
        break;
      case 'pen':
        enableDrawingMode(canvas, currentColor, 2);
        canvas.selection = false;
        break;
      case 'eraser':
        enableDrawingMode(canvas, '#ffffff', 10);
        canvas.selection = false;
        break;
      case 'rectangle':
        disableDrawingMode(canvas);
        addRectangle(canvas, 'transparent', currentColor);
        setActiveTool('select');
        break;
      case 'circle':
        disableDrawingMode(canvas);
        addCircle(canvas, 'transparent', currentColor);
        setActiveTool('select');
        break;
      case 'arrow':
        disableDrawingMode(canvas);
        addArrow(canvas, currentColor);
        setActiveTool('select');
        break;
      case 'text':
        // Text tool is handled through FontSelector dialog
        break;
      case 'vehicle':
        // Vehicle tool is handled through VehicleIconPicker dialog
        break;
    }
  }, [activeTool, currentColor]);

  const updateUndoRedoState = () => {
    setCanUndo(undoRedoStateRef.current.undoStack.length > 0);
    setCanRedo(undoRedoStateRef.current.redoStack.length > 0);
  };

  const notifyCanvasChange = () => {
    const canvas = internalCanvasRef.current;
    if (canvas && onCanvasChange) {
      const objects = canvas.getObjects();
      // Has changes if there are objects beyond the background image
      const hasChanges = hasBackgroundImage ? objects.length > 1 : objects.length > 0;
      onCanvasChange(hasChanges);
    }
  };

  const handleUndo = () => {
    const canvas = internalCanvasRef.current;
    if (canvas) {
      undo(canvas, undoRedoStateRef.current);
      updateUndoRedoState();
      notifyCanvasChange();
    }
  };

  const handleRedo = () => {
    const canvas = internalCanvasRef.current;
    if (canvas) {
      redo(canvas, undoRedoStateRef.current);
      updateUndoRedoState();
      notifyCanvasChange();
    }
  };

  const handleClear = () => {
    const canvas = internalCanvasRef.current;
    if (canvas) {
      if (confirm('Are you sure you want to clear all drawings? (Background image will be kept)')) {
        clearCanvas(canvas, hasBackgroundImage);
        saveCanvasState(canvas, undoRedoStateRef.current);
        updateUndoRedoState();
        notifyCanvasChange();
        saveToRedux();
      }
    }
  };

  const handleColorChange = (color: string) => {
    setCurrentColor(color);
    const canvas = internalCanvasRef.current;
    if (canvas && canvas.isDrawingMode && canvas.freeDrawingBrush) {
      canvas.freeDrawingBrush.color = color;
    }
  };

  const handleFontChange = (newFontSize: number, newFontFamily: string) => {
    setFontSize(newFontSize);
    setFontFamily(newFontFamily);
    const canvas = internalCanvasRef.current;
    if (canvas) {
      disableDrawingMode(canvas);
      addText(canvas, 'Text', newFontSize, newFontFamily, currentColor);
      setActiveTool('select');
    }
  };

  const handleVehicleSelect = (iconUrl: string) => {
    const canvas = internalCanvasRef.current;
    if (!canvas) return;

    fabric.Image.fromURL(iconUrl, (img) => {
      img.set({
        left: 100,
        top: 100,
        scaleX: 0.5,
        scaleY: 0.5,
      });
      canvas.add(img);
      canvas.setActiveObject(img);
      canvas.renderAll();
    });
    
    setActiveTool('select');
  };

  const handleIconDragStart = (iconType: string) => {
    const canvas = internalCanvasRef.current;
    if (!canvas) return;

    const iconConfig = getIconByType(iconType);
    if (!iconConfig) return;

    // Create a temporary container to render the icon
    const tempDiv = document.createElement('div');
    tempDiv.style.position = 'absolute';
    tempDiv.style.left = '-9999px';
    document.body.appendChild(tempDiv);

    // Render the icon component
    const root = ReactDOM.createRoot(tempDiv);
    const IconComponent = iconConfig.component;
    
    root.render(<IconComponent color={iconConfig.defaultColor} size={48} />);
    
    // Wait for render and get SVG
    setTimeout(() => {
      const svgElement = tempDiv.querySelector('svg');
      if (svgElement) {
        const svgString = new XMLSerializer().serializeToString(svgElement);
        
        // Use data URL instead of blob URL to avoid cleanup issues
        const svgDataUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgString)}`;

        fabric.Image.fromURL(svgDataUrl, (img) => {
          // Calculate center position
          const centerX = (canvas.width || 800) / 2;
          const centerY = (canvas.height || 600) / 2;
          
          img.set({
            left: centerX,
            top: centerY,
            originX: 'center',
            originY: 'center',
            scaleX: 1.5,
            scaleY: 1.5,
          });
          canvas.add(img);
          canvas.setActiveObject(img);
          canvas.renderAll();
          
          // Cleanup DOM elements
          root.unmount();
          document.body.removeChild(tempDiv);
        });
      } else {
        root.unmount();
        document.body.removeChild(tempDiv);
      }
    }, 100);
    
    setActiveTool('select');
  };  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    // Validate file size (max 5MB)
    const validation = validateFileSize(file, 5);
    if (!validation.valid) {
      alert(validation.error);
      return;
    }

    try {
      const base64 = await fileToBase64(file);
      const canvas = internalCanvasRef.current;
      
      if (canvas) {
        // Clear existing background if any
        if (hasBackgroundImage) {
          const objects = canvas.getObjects();
          if (objects.length > 0) {
            canvas.remove(objects[0]);
          }
        }

        // Set new background image
        setBackgroundImage(canvas, base64, () => {
          setHasBackgroundImage(true);
          setBackgroundFileName(file.name);
          dispatch(setSceneBackground({ image: base64, fileName: file.name }));
          saveCanvasState(canvas, undoRedoStateRef.current);
          updateUndoRedoState();
          notifyCanvasChange();
          saveToRedux();
        });
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image. Please try again.');
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveBackground = () => {
    const canvas = internalCanvasRef.current;
    if (!canvas || !hasBackgroundImage) return;

    if (confirm('Are you sure you want to remove the background image?')) {
      const objects = canvas.getObjects();
      if (objects.length > 0) {
        canvas.remove(objects[0]);
      }
      setHasBackgroundImage(false);
      setBackgroundFileName('');
      dispatch(clearSceneBackground());
      saveCanvasState(canvas, undoRedoStateRef.current);
      updateUndoRedoState();
      notifyCanvasChange();
      saveToRedux();
    }
  };

  return (
    <div className="flex h-full gap-4">
      {/* Left Sidebar - Icon Palette */}
      <div className="w-64 flex-shrink-0 overflow-y-auto bg-white border-r border-gray-200 p-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <span>Icons Palette</span>
        </h3>
        <IconPalette onDragStart={handleIconDragStart} onClick={handleIconDragStart} />
      </div>

      {/* Main Canvas Area */}
      <div className="flex-1 flex flex-col">
        {/* Background Image Upload Section */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-3 mb-3">
        <div className="flex items-center gap-3">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
          
          {!hasBackgroundImage ? (
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 px-4 py-2.5 btn-primary rounded-lg font-semibold"
            >
              <Upload size={18} />
              Upload Background Image
            </button>
          ) : (
            <div className="flex items-center gap-3 flex-1">
              <div className="flex items-center gap-2 flex-1 bg-green-50 border border-green-200 rounded px-3 py-2">
                <span className="text-sm font-medium text-green-700">
                  Background: {backgroundFileName}
                </span>
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2.5 btn-primary rounded-lg font-semibold text-sm"
              >
                Replace
              </button>
              <button
                onClick={handleRemoveBackground}
                className="p-2 bg-error-100 text-error-600 rounded-lg hover:bg-error-200 transition-colors"
                title="Remove Background"
              >
                <X size={18} />
              </button>
            </div>
          )}
          
          <p className="text-xs text-gray-500">Max 5MB</p>
        </div>
      </div>

      {/* Drawing Toolbar */}
      <DrawingToolbar
        activeTool={activeTool}
        onToolChange={setActiveTool}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onClear={handleClear}
        onColorClick={() => setShowColorPicker(true)}
        onFontClick={() => setShowFontSelector(true)}
        onVehicleClick={() => setShowVehiclePicker(true)}
        currentColor={currentColor}
        canUndo={canUndo}
        canRedo={canRedo}
        showFontSelector={true}
      />

      {/* Canvas Container */}
      <div className="flex-1 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center p-4">
        <div className="bg-white shadow-lg">
          <canvas ref={canvasElementRef} />
        </div>
      </div>

      {/* Modals */}
      {showColorPicker && (
        <ColorPicker
          color={currentColor}
          onChange={handleColorChange}
          onClose={() => setShowColorPicker(false)}
        />
      )}
      
      {showFontSelector && (
        <FontSelector
          fontSize={fontSize}
          fontFamily={fontFamily}
          onFontChange={handleFontChange}
          onClose={() => setShowFontSelector(false)}
        />
      )}
      
      {showVehiclePicker && (
        <VehicleIconPicker
          onSelect={handleVehicleSelect}
          onClose={() => setShowVehiclePicker(false)}
        />
      )}
      </div>
    </div>
  );
};

export default SceneCanvas;
