import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { nextStep } from '@/store/slices/stepperSlice';
import { setDocxUrl } from '@/store/slices/filesSlice';
import { API_ENDPOINTS } from '@/utils/constants';
import api from '@/utils/axios.config';
import { Loader2, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export const AutoFill = () => {
  const dispatch = useDispatch();
  const { sessionId } = useSelector((state: RootState) => state.files);
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

      // Get token from localStorage for Authorization header
      const token = localStorage.getItem('auth_token');

      // First, get available template filenames
      const templateResponse = await api.get('/template/dropdown', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      // Use the first available template filename, or fallback to default
      const templateFilename = templateResponse.data?.[0] || 'template_with_placeholders.docx';

      const response = await api.get(
        `${API_ENDPOINTS.PROCESS.AUTOFILL}/${sessionId}`,
        {
          params: {
            template_filename: templateFilename,
          },
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (response.data.report_docx_gcs_uri) {
        dispatch(setDocxUrl(response.data.report_docx_gcs_uri));
        toast.success('Document processed successfully!');

        // Auto-navigate to next step after 1 second
        setTimeout(() => {
          dispatch(nextStep());
        }, 1000);
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Processing failed. Please try again.';
      setError(message);
      toast.error(message);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-6">
      <h3 className="text-2xl font-bold text-neutral-900 text-center">AutoFill</h3>

      {processing && (
        <>
          <div className="relative">
            <Loader2 className="h-24 w-24 text-primary-500 animate-spin" />
          </div>
          <div className="text-center">
            <p className="text-lg font-medium text-neutral-700 mb-2">
              Processing your documents...
            </p>
            <p className="text-sm text-neutral-500">
              This may take a few moments. Please wait.
            </p>
          </div>
        </>
      )}

      {error && (
        <div className="flex flex-col items-center gap-4">
          <AlertCircle className="h-16 w-16 text-red-500" />
          <div className="text-center">
            <p className="text-lg font-medium text-red-600 mb-2">Processing Failed</p>
            <p className="text-sm text-neutral-600">{error}</p>
          </div>
        </div>
      )}

      {!processing && !error && (
        <div className="text-center">
          <p className="text-lg font-medium text-accent-green">
            ✓ Processing complete! Redirecting...
          </p>
        </div>
      )}
    </div>
  );
};
