import { fabric } from 'fabric';

export interface UndoRedoState {
  undoStack: string[];
  redoStack: string[];
  maxStackSize: number;
}

/**
 * Initializes a Fabric.js canvas with default settings
 * @param canvasElement - The HTML canvas element
 * @param width - Canvas width
 * @param height - Canvas height
 * @param backgroundColor - Background color (default: white)
 * @returns Initialized Fabric.js canvas instance
 */
export const initializeFabricCanvas = (
  canvasElement: HTMLCanvasElement,
  width: number = 1200,
  height: number = 800,
  backgroundColor: string = '#ffffff'
): fabric.Canvas => {
  const canvas = new fabric.Canvas(canvasElement, {
    width,
    height,
    backgroundColor,
    selection: true,
    preserveObjectStacking: true,
  });

  // Enable touch events for mobile support
  canvas.allowTouchScrolling = true;

  return canvas;
};

/**
 * Creates an undo/redo state manager
 * @param maxStackSize - Maximum number of states to keep (default: 20)
 * @returns UndoRedoState object
 */
export const createUndoRedoState = (maxStackSize: number = 20): UndoRedoState => {
  return {
    undoStack: [],
    redoStack: [],
    maxStackSize,
  };
};

/**
 * Saves the current canvas state to the undo stack
 * @param canvas - The Fabric.js canvas instance
 * @param state - The undo/redo state object
 */
export const saveCanvasState = (canvas: fabric.Canvas, state: UndoRedoState): void => {
  const json = JSON.stringify(canvas.toJSON());
  state.undoStack.push(json);
  
  // Limit stack size
  if (state.undoStack.length > state.maxStackSize) {
    state.undoStack.shift();
  }
  
  // Clear redo stack when new action is performed
  state.redoStack = [];
};

/**
 * Performs undo operation
 * @param canvas - The Fabric.js canvas instance
 * @param state - The undo/redo state object
 */
export const undo = (canvas: fabric.Canvas, state: UndoRedoState): void => {
  if (state.undoStack.length === 0) return;
  
  // Save current state to redo stack
  const currentState = JSON.stringify(canvas.toJSON());
  state.redoStack.push(currentState);
  
  // Restore previous state
  const previousState = state.undoStack.pop();
  if (previousState) {
    canvas.loadFromJSON(previousState, () => {
      canvas.renderAll();
    });
  }
};

/**
 * Performs redo operation
 * @param canvas - The Fabric.js canvas instance
 * @param state - The undo/redo state object
 */
export const redo = (canvas: fabric.Canvas, state: UndoRedoState): void => {
  if (state.redoStack.length === 0) return;
  
  // Save current state to undo stack
  const currentState = JSON.stringify(canvas.toJSON());
  state.undoStack.push(currentState);
  
  // Restore next state
  const nextState = state.redoStack.pop();
  if (nextState) {
    canvas.loadFromJSON(nextState, () => {
      canvas.renderAll();
    });
  }
};

/**
 * Clears all objects from the canvas
 * @param canvas - The Fabric.js canvas instance
 * @param keepBackground - Whether to keep background image (for Scene canvas)
 */
export const clearCanvas = (canvas: fabric.Canvas, keepBackground: boolean = false): void => {
  if (keepBackground) {
    const objects = canvas.getObjects();
    // Remove all objects except the first one (background image)
    objects.slice(1).forEach((obj) => canvas.remove(obj));
  } else {
    canvas.clear();
    canvas.backgroundColor = '#ffffff';
  }
  canvas.renderAll();
};

/**
 * Adds a freehand drawing path to the canvas
 * @param canvas - The Fabric.js canvas instance
 * @param color - Stroke color
 * @param width - Stroke width
 */
export const enableDrawingMode = (
  canvas: fabric.Canvas,
  color: string = '#000000',
  width: number = 2
): void => {
  canvas.isDrawingMode = true;
  if (canvas.freeDrawingBrush) {
    canvas.freeDrawingBrush.color = color;
    canvas.freeDrawingBrush.width = width;
  }
};

/**
 * Disables drawing mode and enables selection mode
 * @param canvas - The Fabric.js canvas instance
 */
export const disableDrawingMode = (canvas: fabric.Canvas): void => {
  canvas.isDrawingMode = false;
};

/**
 * Adds a rectangle to the canvas
 * @param canvas - The Fabric.js canvas instance
 * @param color - Fill color
 * @param strokeColor - Stroke color
 */
export const addRectangle = (
  canvas: fabric.Canvas,
  color: string = 'transparent',
  strokeColor: string = '#000000'
): void => {
  const rect = new fabric.Rect({
    left: 100,
    top: 100,
    width: 150,
    height: 100,
    fill: color,
    stroke: strokeColor,
    strokeWidth: 2,
  });
  canvas.add(rect);
  canvas.setActiveObject(rect);
  canvas.renderAll();
};

/**
 * Adds a circle to the canvas
 * @param canvas - The Fabric.js canvas instance
 * @param color - Fill color
 * @param strokeColor - Stroke color
 */
export const addCircle = (
  canvas: fabric.Canvas,
  color: string = 'transparent',
  strokeColor: string = '#000000'
): void => {
  const circle = new fabric.Circle({
    left: 100,
    top: 100,
    radius: 50,
    fill: color,
    stroke: strokeColor,
    strokeWidth: 2,
  });
  canvas.add(circle);
  canvas.setActiveObject(circle);
  canvas.renderAll();
};

/**
 * Adds an arrow to the canvas
 * @param canvas - The Fabric.js canvas instance
 * @param color - Arrow color
 */
export const addArrow = (
  canvas: fabric.Canvas,
  color: string = '#000000'
): void => {
  // Create arrow line
  const line = new fabric.Line([50, 100, 200, 100], {
    stroke: color,
    strokeWidth: 3,
  });

  // Create arrow head (triangle)
  const triangle = new fabric.Triangle({
    left: 200,
    top: 100,
    width: 15,
    height: 20,
    fill: color,
    angle: 90,
    originX: 'center',
    originY: 'center',
  });

  // Group line and triangle together
  const arrow = new fabric.Group([line, triangle], {
    left: 100,
    top: 100,
  });

  canvas.add(arrow);
  canvas.setActiveObject(arrow);
  canvas.renderAll();
};

/**
 * Adds text to the canvas
 * @param canvas - The Fabric.js canvas instance
 * @param text - Text content
 * @param fontSize - Font size
 * @param fontFamily - Font family
 * @param color - Text color
 */
export const addText = (
  canvas: fabric.Canvas,
  text: string = 'Text',
  fontSize: number = 20,
  fontFamily: string = 'Arial',
  color: string = '#000000'
): void => {
  const textObj = new fabric.IText(text, {
    left: 100,
    top: 100,
    fontSize,
    fontFamily,
    fill: color,
  });
  canvas.add(textObj);
  canvas.setActiveObject(textObj);
  canvas.renderAll();
};

/**
 * Deletes the currently selected object(s) from the canvas
 * @param canvas - The Fabric.js canvas instance
 */
export const deleteSelectedObjects = (canvas: fabric.Canvas): void => {
  const activeObjects = canvas.getActiveObjects();
  if (activeObjects.length > 0) {
    activeObjects.forEach((obj) => canvas.remove(obj));
    canvas.discardActiveObject();
    canvas.renderAll();
  }
};

/**
 * Sets the background image of the canvas
 * @param canvas - The Fabric.js canvas instance
 * @param imageUrl - URL or base64 string of the image
 * @param callback - Optional callback after image is set
 */
export const setBackgroundImage = (
  canvas: fabric.Canvas,
  imageUrl: string,
  callback?: () => void
): void => {
  fabric.Image.fromURL(imageUrl, (img) => {
    // Scale image to fit canvas
    const scaleX = canvas.width! / img.width!;
    const scaleY = canvas.height! / img.height!;
    const scale = Math.min(scaleX, scaleY);

    img.set({
      scaleX: scale,
      scaleY: scale,
      selectable: false,
      evented: false,
    });

    // Add as first object (background layer)
    canvas.add(img);
    img.sendToBack();
    canvas.renderAll();

    if (callback) callback();
  });
};
