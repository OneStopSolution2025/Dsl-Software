import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CanvasState {
  blankCanvasJSON: string | null;
  sceneCanvasJSON: string | null;
  sceneBackgroundImage: string | null;
  sceneBackgroundFileName: string | null;
}

const initialState: CanvasState = {
  blankCanvasJSON: null,
  sceneCanvasJSON: null,
  sceneBackgroundImage: null,
  sceneBackgroundFileName: null,
};

const canvasSlice = createSlice({
  name: 'canvas',
  initialState,
  reducers: {
    setBlankCanvasJSON: (state, action: PayloadAction<string>) => {
      state.blankCanvasJSON = action.payload;
    },
    setSceneCanvasJSON: (state, action: PayloadAction<string>) => {
      state.sceneCanvasJSON = action.payload;
    },
    setSceneBackground: (
      state,
      action: PayloadAction<{ image: string; fileName: string }>
    ) => {
      state.sceneBackgroundImage = action.payload.image;
      state.sceneBackgroundFileName = action.payload.fileName;
    },
    clearSceneBackground: (state) => {
      state.sceneBackgroundImage = null;
      state.sceneBackgroundFileName = null;
    },
    clearAllCanvasData: (state) => {
      state.blankCanvasJSON = null;
      state.sceneCanvasJSON = null;
      state.sceneBackgroundImage = null;
      state.sceneBackgroundFileName = null;
    },
  },
});

export const {
  setBlankCanvasJSON,
  setSceneCanvasJSON,
  setSceneBackground,
  clearSceneBackground,
  clearAllCanvasData,
} = canvasSlice.actions;

export default canvasSlice.reducer;
