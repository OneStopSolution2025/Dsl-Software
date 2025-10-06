import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { setCanProceed } from '@/store/slices/stepperSlice';
import { FileText, Info } from 'lucide-react';

export const Preview = () => {
  const dispatch = useDispatch();
  const { docxUrl } = useSelector((state: RootState) => state.files);

  useEffect(() => {
    // Enable proceed once document is loaded
    if (docxUrl) {
      dispatch(setCanProceed(true));
    }
  }, [docxUrl, dispatch]);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold text-neutral-900 mb-2">Preview Document</h3>
        <p className="text-neutral-600">
          Review the auto-filled document before proceeding
        </p>
      </div>

      {/* Document Preview */}
      <div className="bg-white rounded-lg border-2 border-neutral-200 p-8 min-h-[400px]">
        {docxUrl ? (
          <div className="space-y-4">
            <div className="flex items-center gap-3 pb-4 border-b border-neutral-200">
              <FileText className="h-6 w-6 text-primary-500" />
              <div>
                <p className="font-semibold text-neutral-900">Insurance Claim Report</p>
                <p className="text-sm text-neutral-500">Auto-generated document</p>
              </div>
            </div>

            {/* Document Content Preview */}
            <div className="prose max-w-none">
              <h4 className="text-lg font-semibold text-neutral-900 mb-4">
                Document Preview
              </h4>
              <p className="text-neutral-600 mb-4">
                Your document has been successfully generated and is ready for review.
              </p>
              <div className="bg-neutral-50 p-4 rounded-lg">
                <p className="text-sm text-neutral-600">
                  <strong>Document URL:</strong>
                </p>
                <a
                  href={docxUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary-500 hover:underline break-all"
                >
                  {docxUrl}
                </a>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-neutral-400">
            <p>No document available</p>
          </div>
        )}
      </div>

      {/* Info Message */}
      <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <Info className="h-5 w-5 text-blue-500 mt-0.5" />
        <p className="text-sm text-blue-900">
          Please review the auto-filled document and click <strong>Next</strong> to proceed to the road map.
        </p>
      </div>
    </div>
  );
};
