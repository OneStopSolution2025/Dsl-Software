import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface FormState {
  data: any | null;
  images: { [fieldKey: string]: string }; // fieldKey: base64
  isEditing: boolean;
}

const initialState: FormState = {
  data: null,
  images: {},
  isEditing: false,
};

const formSlice = createSlice({
  name: 'form',
  initialState,
  reducers: {
    setFormData: (state, action: PayloadAction<any>) => {
      state.data = action.payload;
    },
    setEditing: (state, action: PayloadAction<boolean>) => {
      state.isEditing = action.payload;
    },
    setImages: (state, action: PayloadAction<{ [fieldKey: string]: string }>) => {
      state.images = action.payload;
    },
    updateImage: (state, action: PayloadAction<{ fieldKey: string; base64: string }>) => {
      state.images[action.payload.fieldKey] = action.payload.base64;
    },
    removeImage: (state, action: PayloadAction<string>) => {
      delete state.images[action.payload];
    },
  },
});

export const { setFormData, setEditing, setImages, updateImage, removeImage } = formSlice.actions;

export default formSlice.reducer;
