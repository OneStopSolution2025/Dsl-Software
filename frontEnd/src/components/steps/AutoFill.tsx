import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { setDocxUrl, setHtmlUrl } from '@/store/slices/filesSlice';
import { setFormData } from '@/store/slices/formSlice';
import { nextStep } from '@/store/slices/stepperSlice';
import apiService from '@/services/api.service';
import { Loader2, AlertCircle, RefreshCw, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { Button } from '@/components/common/Button';

export const AutoFill = () => {
  const dispatch = useDispatch();
  const { sessionId } = useSelector((state: RootState) => state.session);
  const [processing, setProcessing] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (sessionId) {
      processDocuments();
    }
  }, [sessionId]);

  const processDocuments = async () => {
    try {
      setProcessing(true);
      setError(null);

      if (!sessionId) {
        throw new Error('Session ID is required');
      }

      const templateList = await apiService.document.getTemplateList();
      const templateFilename = templateList?.[0] || 'template_with_placeholders.docx';

      const response = await apiService.document.processDocuments(sessionId, templateFilename);

      if (response.report_docx_gcs_uri) {
        dispatch(setDocxUrl(response.report_docx_gcs_uri));
        if (response.report_html_gcs_uri) {
          dispatch(setHtmlUrl(response.report_html_gcs_uri));
        }
        if (response.out_json) {
            dispatch(setFormData(response.out_json));
        }
        toast.success('Document processed successfully!');
      } else {
        throw new Error('Processing completed, but no document URL was returned.');
      }
    } catch (err: any) {
      let message = 'An unexpected error occurred. Please try again.';
      if (err.code === 'ECONNABORTED') {
        message = 'The request timed out. Please try again.';
      } else {
        message = err.response?.data?.detail || err.message || 'Processing failed. Please try again.';
      }
      setError(message);
      toast.error(message);
    } finally {
      setProcessing(false);
    }
  };

  const handleRetry = () => {
    processDocuments();
  };

  const handleGoToPreview = () => {
    dispatch(nextStep());
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-6">
      <h3 className="text-2xl font-bold text-gray-900 text-center">AutoFill</h3>

      {processing && (
        <>
          <div className="relative">
            <Loader2 className="h-24 w-24 text-teal-600 animate-spin" />
          </div>
          <div className="text-center">
            <p className="text-lg font-medium text-gray-700 mb-2">
              Processing your documents...
            </p>
            <p className="text-sm text-gray-500">
              This process may take a few moments. Please wait. Until then, don't click back or refresh the browser tab.
            </p>
          </div>
        </>
      )}

      {error && !processing && (
        <div className="flex flex-col items-center gap-4">
          <AlertCircle className="h-16 w-16 text-red-500" />
          <div className="text-center">
            <p className="text-lg font-medium text-red-600 mb-2">Processing Failed</p>
            <p className="text-sm text-gray-600 max-w-md">{error}</p>
          </div>
          <Button onClick={handleRetry} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        </div>
      )}

      {!processing && !error && (
        <div className="flex flex-col items-center gap-4 py-8">
          <CheckCircle className="h-16 w-16 text-emerald-500" />
          <div className="text-center">
            <p className="text-lg font-medium text-gray-800 mb-2">
              Ready for Preview
            </p>
            <p className="text-sm text-gray-600 max-w-sm">
              Your insurance claiming document has been processed and is ready to preview.
            </p>
          </div>
          <Button onClick={handleGoToPreview}>
            Go to Preview
          </Button>
        </div>
      )}
    </div>
  );
};
