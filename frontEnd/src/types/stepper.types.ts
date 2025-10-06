export type StepNumber = 1 | 2 | 3 | 4 | 5 | 6;

export interface StepperState {
  currentStep: StepNumber;
  completedSteps: number[];
  canProceed: boolean;
}

export interface Step {
  id: number;
  name: string;
  key: string;
}
