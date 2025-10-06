import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { setFinalDocxUrl } from '@/store/slices/filesSlice';
import { API_ENDPOINTS } from '@/utils/constants';
import { downloadFile } from '@/utils/fileHelpers';
import api from '@/utils/axios.config';
import { Button } from '@/components/common/Button';
import { Download as DownloadIcon, CheckCircle, FileText } from 'lucide-react';
import toast from 'react-hot-toast';

export const Download = () => {
  const dispatch = useDispatch();
  const { sessionId, finalDocxUrl } = useSelector((state: RootState) => state.files);
  const [loading, setLoading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const handleDownload = async () => {
    if (!sessionId) {
      toast.error('Session ID not found');
      return;
    }

    setLoading(true);
    try {
      // Get token from localStorage for Authorization header
      const token = localStorage.getItem('auth_token');

      const response = await api.get(`${API_ENDPOINTS.DOWNLOAD.LIST}/${sessionId}`, {
        params: { session_id: sessionId },
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.data.url) {
        dispatch(setFinalDocxUrl(response.data.url));
        
        // Download the file
        downloadFile(response.data.url, 'insurance-claim-report.docx');
        
        setDownloaded(true);
        toast.success('Document downloaded successfully!');
      }
    } catch (error: any) {
      const message = error.response?.data?.message || 'Download failed. Please try again.';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-8">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-primary-500 to-primary-600 mb-6">
          {downloaded ? (
            <CheckCircle className="h-10 w-10 text-white" />
          ) : (
            <FileText className="h-10 w-10 text-white" />
          )}
        </div>
        <h3 className="text-3xl font-bold text-neutral-900 mb-3">
          {downloaded ? 'Download Complete!' : 'Ready to Download'}
        </h3>
        <p className="text-neutral-600 max-w-md">
          {downloaded
            ? 'Your insurance claim report has been downloaded successfully.'
            : 'All steps completed! Click the button below to download your final document.'}
        </p>
      </div>

      <Button
        variant="primary"
        size="lg"
        onClick={handleDownload}
        loading={loading}
        disabled={downloaded}
        className="flex items-center gap-3 px-8"
      >
        <DownloadIcon className="h-5 w-5" />
        {downloaded ? 'Downloaded' : 'Download Document'}
      </Button>

      {finalDocxUrl && (
        <div className="mt-8 p-4 bg-neutral-50 rounded-lg border border-neutral-200 max-w-xl w-full">
          <p className="text-sm font-medium text-neutral-700 mb-2">Document URL:</p>
          <a
            href={finalDocxUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-primary-500 hover:underline break-all"
          >
            {finalDocxUrl}
          </a>
        </div>
      )}

      {downloaded && (
        <div className="text-center mt-6">
          <p className="text-sm text-neutral-500">
            You can close this window or start a new claim.
          </p>
        </div>
      )}
    </div>
  );
};
