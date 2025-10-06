import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { StepperState, StepNumber } from '@/types/stepper.types';

const initialState: StepperState = {
  currentStep: 1,
  completedSteps: [],
  canProceed: false,
};

const stepperSlice = createSlice({
  name: 'stepper',
  initialState,
  reducers: {
    setCurrentStep: (state, action: PayloadAction<StepNumber>) => {
      state.currentStep = action.payload;
    },
    nextStep: (state) => {
      if (state.currentStep < 6) {
        if (!state.completedSteps.includes(state.currentStep)) {
          state.completedSteps.push(state.currentStep);
        }
        state.currentStep = (state.currentStep + 1) as StepNumber;
        state.canProceed = false;
      }
    },
    previousStep: (state) => {
      if (state.currentStep > 1) {
        state.currentStep = (state.currentStep - 1) as StepNumber;
      }
    },
    setCanProceed: (state, action: PayloadAction<boolean>) => {
      state.canProceed = action.payload;
    },
    markStepComplete: (state, action: PayloadAction<number>) => {
      if (!state.completedSteps.includes(action.payload)) {
        state.completedSteps.push(action.payload);
      }
    },
    resetStepper: (state) => {
      state.currentStep = 1;
      state.completedSteps = [];
      state.canProceed = false;
    },
  },
});

export const {
  setCurrentStep,
  nextStep,
  previousStep,
  setCanProceed,
  markStepComplete,
  resetStepper,
} = stepperSlice.actions;

export default stepperSlice.reducer;
