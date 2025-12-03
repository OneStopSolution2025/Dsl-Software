import { useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, resetState } from '@/store';
import { nextStep, previousStep } from '@/store/slices/stepperSlice';
import { clearMarkers } from '@/store/slices/markersSlice';
import { MainLayout } from '@/components/layout/MainLayout';
import { StepIndicator } from '@/components/steps/StepIndicator';
import { Button } from '@/components/common/Button';
import { ArrowLeft, ArrowRight, Home as HomeIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Import step components (we'll create these next)
import { UploadDocuments } from '@/components/steps/UploadDocuments';
import { OCRExtraction } from '@/components/steps/OCRExtraction';
import { AutoFill } from '@/components/steps/AutoFill';
import { Preview } from '@/components/steps/Preview';
import { Download } from '@/components/steps/Download';
import { RoadMap2 } from '@/components/steps/RoadMap2';

export const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentStep, canProceed } = useSelector((state: RootState) => state.stepper);
  const roadMapRef = useRef<{ handleNextWithScreenshot: () => Promise<void> } | null>(null);

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <UploadDocuments />;
      case 2:
        return <OCRExtraction />;
      case 3:
        return <RoadMap2 ref={roadMapRef} />;
      case 4:
        return <AutoFill />;
      case 5:
        return <Preview />;
      case 6:
        return <Download />;
      default:
        return <UploadDocuments />;
    }
  };

  const handleNext = async () => {
    // Special handling for road Map step (step 3) - capture screenshot first
    if (currentStep === 3 && roadMapRef.current?.handleNextWithScreenshot) {
      await roadMapRef.current.handleNextWithScreenshot();
      return;
    }

    dispatch(nextStep());
  };
  const handlePrevious = () => {
    // If going back from step 2 to step 1, clear all markers to start fresh
    if (currentStep === 2) {
      dispatch(clearMarkers());
    }
    dispatch(previousStep());
  };

  const handleHome = () => {
    dispatch(resetState());
    navigate('/report');
  };

  const showBackButton = currentStep > 1 && currentStep < 6;
  const showNextButton = currentStep < 6 && canProceed;
  const showHomeButton = currentStep === 6;

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto">
        {/* Step Indicator */}
        <StepIndicator />


        {/* Step Content */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-4 md:p-8 min-h-[500px]">
          {renderStep()}
        </div>

        {/* Navigation */}
        <div className="flex items-center mt-6">
          {showBackButton && (
            <Button
              variant="secondary"
              onClick={handlePrevious}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          )}
          
          {showNextButton && (
            <Button
              variant="primary"
              onClick={handleNext}
              className="flex items-center gap-2 ml-auto"
            >
              Next
              <ArrowRight className="h-4 w-4" />
            </Button>
          )}
          
          {showHomeButton && (
            <Button
              variant="primary"
              onClick={handleHome}
              className="flex items-center gap-2 ml-auto"
            >
              <HomeIcon className="h-4 w-4" />
              Home
            </Button>
          )}
        </div>
      </div>
    </MainLayout>
  );
};
