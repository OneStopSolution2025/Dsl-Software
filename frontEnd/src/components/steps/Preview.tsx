import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { setCanProceed } from '@/store/slices/stepperSlice';
import { setEditing } from '@/store/slices/formSlice';
import { FileText, Download, AlertCircle, Loader2, Edit } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { UploadMore } from '../common/UploadMore';
import { EditForm } from './EditForm';

export const Preview = () => {
  const dispatch = useDispatch();
  const { docxUrl, htmlUrl } = useSelector((state: RootState) => state.files);
  const { isEditing } = useSelector((state: RootState) => state.form);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const documentUrl = htmlUrl || docxUrl;
  const isHtmlDocument = !!htmlUrl;

  useEffect(() => {
    if (documentUrl) {
      dispatch(setCanProceed(true));
      setIsLoading(false);
    }
  }, [documentUrl, dispatch]);

  const handleIframeLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleIframeError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  const getViewerUrl = () => {
    if (!documentUrl) return null;
    return isHtmlDocument ? documentUrl : `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(documentUrl)}`;
  };

  const viewerUrl = getViewerUrl();

  const handleEditClick = () => {
    dispatch(setEditing(true));
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Preview Document</h3>
        <p className="text-gray-600">Review the auto-filled document before proceeding</p>
      </div>

      <div className="bg-white rounded-lg border-2 border-gray-200 shadow-lg overflow-hidden">
        {docxUrl ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <FileText className="h-6 w-6 text-teal-600" />
                <div>
                  <p className="font-semibold text-gray-900">Insurance Claim Report</p>
                  <p className="text-sm text-gray-500">Auto-generated document</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" onClick={handleEditClick}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                <a
                  href={docxUrl}
                  download
                  className="inline-flex items-center gap-2 px-3 py-2 bg-teal-600 text-white text-sm rounded-lg hover:bg-teal-700 transition-colors shadow-md hover:shadow-lg"
                >
                  <Download className="h-4 w-4" />
                  <span>Download</span>
                </a>
              </div>
            </div>

            {!isEditing && (
              <div className="relative">
                {isLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white z-10">
                    <div className="flex items-center gap-3">
                      <Loader2 className="h-6 w-6 text-teal-600 animate-spin" />
                      <span className="text-sm text-gray-600">Loading document...</span>
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
                        href={documentUrl || ''}
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
                    src={viewerUrl || undefined}
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
            )}
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

      {isEditing && <EditForm />}

      {!isEditing && (
        <>
          <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
            <p className="text-sm text-blue-900">
              Please review the auto-filled document and click <strong>Next</strong> to proceed to the road map.
            </p>
          </div>
          <UploadMore />
        </>
      )}
    </div>
  );
};
