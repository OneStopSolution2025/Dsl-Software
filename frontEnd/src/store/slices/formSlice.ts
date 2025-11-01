import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface FormState {
  data: any | null;
  isEditing: boolean;
}

const initialState: FormState = {
  data: null,
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
  },
});

export const { setFormData, setEditing } = formSlice.actions;

export default formSlice.reducer;
