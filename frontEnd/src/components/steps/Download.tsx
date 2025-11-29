import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { setFinalDocxUrl } from '@/store/slices/filesSlice';
import { downloadFile } from '@/utils/fileHelpers';
import { Button } from '@/components/common/Button';
import { Download as DownloadIcon, CheckCircle, FileText } from 'lucide-react';
import toast from 'react-hot-toast';

export const Download = () => {
  const dispatch = useDispatch();
  const { docxUrl } = useSelector((state: RootState) => state.files);
  const [loading, setLoading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const handleDownload = async () => {
    if (!docxUrl) {
      toast.error('Document URL not found. Please complete the previous steps.');
      return;
    }

    setLoading(true);
    try {
      // Use the same URL from Preview step
      dispatch(setFinalDocxUrl(docxUrl));

      // Download the file using the stored URL
      downloadFile(docxUrl, 'insurance-claim-report.docx');

      setDownloaded(true);
      toast.success('Document downloaded successfully!');
    } catch (error: any) {
      const message = error.message || 'Download failed. Please try again.';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-8">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-teal-600 shadow-lg shadow-teal-600/30 mb-6">
          {downloaded ? (
            <CheckCircle className="h-10 w-10 text-white" />
          ) : (
            <FileText className="h-10 w-10 text-white" />
          )}
        </div>
        <h3 className="text-3xl font-bold text-gray-900 mb-3">
          {downloaded ? 'Download Complete!' : 'Ready to Download'}
        </h3>
        <p className="text-gray-600 max-w-md">
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

      {docxUrl && (
        <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200 max-w-xl w-full">
          <p className="text-sm font-medium text-gray-700 mb-2">Document URL:</p>
          <a
            href={docxUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-teal-600 hover:underline break-all"
          >
            {docxUrl}
          </a>
        </div>
      )}

      {downloaded && (
        <div className="text-center mt-6">
          <p className="text-sm text-gray-500">
            You can close this window or start a new claim.
          </p>
        </div>
      )}
    </div>
  );
};
