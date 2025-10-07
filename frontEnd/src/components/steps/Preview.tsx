import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { setCanProceed } from '@/store/slices/stepperSlice';
import { FileText, Download, AlertCircle, Loader2 } from 'lucide-react';

export const Preview = () => {
  const dispatch = useDispatch();
  const { docxUrl } = useSelector((state: RootState) => state.files);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // Enable proceed once document is loaded
    if (docxUrl) {
      dispatch(setCanProceed(true));
      setIsLoading(false);
    }
  }, [docxUrl, dispatch]);

  const handleIframeLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleIframeError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  // Generate Google Docs Viewer URL
  const googleDocsUrl = docxUrl
    ? `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(docxUrl)}`
    : null;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold text-neutral-900 mb-2">Preview Document</h3>
        <p className="text-neutral-600">
          Review the auto-filled document before proceeding
        </p>
      </div>

      {/* Document Preview */}
      <div className="bg-white rounded-lg border-2 border-neutral-200 overflow-hidden">
        {docxUrl ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border-b border-neutral-200">
              <div className="flex items-center gap-3">
                <FileText className="h-6 w-6 text-primary-500" />
                <div>
                  <p className="font-semibold text-neutral-900">Insurance Claim Report</p>
                  <p className="text-sm text-neutral-500">Auto-generated document</p>
                </div>
              </div>
              <a
                href={docxUrl}
                download
                className="inline-flex items-center gap-2 px-3 py-2 bg-primary-500 text-white text-sm rounded-lg hover:bg-primary-600 transition-colors"
              >
                <Download className="h-4 w-4" />
                Download
              </a>
            </div>

            {/* Document Viewer */}
            <div className="relative">
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
                  <div className="flex items-center gap-3">
                    <Loader2 className="h-6 w-6 text-primary-500 animate-spin" />
                    <span className="text-sm text-neutral-600">Loading document...</span>
                  </div>
                </div>
              )}

              {hasError ? (
                <div className="flex items-center justify-center p-8 bg-red-50">
                  <div className="text-center">
                    <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                    <p className="text-red-600 font-medium mb-2">Failed to load document</p>
                    <p className="text-sm text-red-500 mb-4">
                      Unable to preview the document. Please download it instead.
                    </p>
                    <a
                      href={docxUrl}
                      download
                      className="inline-flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                    >
                      <Download className="h-4 w-4" />
                      Download Document
                    </a>
                  </div>
                </div>
              ) : (
                <iframe
                  src={googleDocsUrl || undefined}
                  width="100%"
                  height="600"
                  frameBorder="0"
                  title="Document Preview"
                  onLoad={handleIframeLoad}
                  onError={handleIframeError}
                  className="min-h-[600px]"
                />
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-[400px] text-neutral-400">
            <div className="text-center">
              <FileText className="h-16 w-16 mx-auto mb-4 text-neutral-300" />
              <p className="text-lg font-medium mb-2">No document available</p>
              <p className="text-sm">Please complete the previous steps to generate a document.</p>
            </div>
          </div>
        )}
      </div>

      {/* Info Message */}
      <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
        <p className="text-sm text-blue-900">
          Please review the auto-filled document and click <strong>Next</strong> to proceed to the road map.
        </p>
      </div>
    </div>
  );
};
