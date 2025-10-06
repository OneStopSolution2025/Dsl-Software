import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { setCanProceed } from '@/store/slices/stepperSlice';
import {
  updateFileStatus,
  setSessionData,
  setIsUploading,
  setUploadErrorMessage,
} from '@/store/slices/filesSlice';
import { formatFileSize } from '@/utils/fileHelpers';
import { BATCH_UPLOAD_SIZE, API_ENDPOINTS } from '@/utils/constants';
import api from '@/utils/axios.config';
import { FileText, CheckCircle, Loader2, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export const OCRExtraction = () => {
  const dispatch = useDispatch();
  const { uploadedFiles, isUploading } = useSelector((state: RootState) => state.files);
  const [uploadComplete, setUploadComplete] = useState(false);

  useEffect(() => {
    if (uploadedFiles.length > 0 && !isUploading && !uploadComplete) {
      uploadFilesInBatches();
    }
  }, []);

  const uploadFilesInBatches = async () => {
    dispatch(setIsUploading(true));
    dispatch(setUploadErrorMessage(null));

    try {
      const batches = [];
      for (let i = 0; i < uploadedFiles.length; i += BATCH_UPLOAD_SIZE) {
        batches.push(uploadedFiles.slice(i, i + BATCH_UPLOAD_SIZE));
      }

      for (const batch of batches) {
        await uploadBatch(batch);
      }

      setUploadComplete(true);
      dispatch(setCanProceed(true));
      toast.success('All files uploaded successfully!');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Upload failed. Please try again.';
      dispatch(setUploadErrorMessage(message));
      toast.error(message);
    } finally {
      dispatch(setIsUploading(false));
    }
  };

  const uploadBatch = async (batch: typeof uploadedFiles) => {
    const formData = new FormData();
    batch.forEach((file) => {
      formData.append('files', file.file);
      dispatch(updateFileStatus({ id: file.id, status: 'uploading', progress: 0 }));
    });

    // Get token from localStorage for Authorization header
    const token = localStorage.getItem('auth_token');

    const response = await api.post(API_ENDPOINTS.FILES.UPLOAD, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}`,
      },
      onUploadProgress: (progressEvent) => {
        const progress = progressEvent.total
          ? Math.round((progressEvent.loaded * 100) / progressEvent.total)
          : 0;
        batch.forEach((file) => {
          dispatch(updateFileStatus({ id: file.id, status: 'uploading', progress }));
        });
      },
    });

    // Update session data from the response
    if (response.data.session_id) {
      dispatch(
        setSessionData({
          sessionId: response.data.session_id,
          userName: response.data.user_name || '',
          fileIds: response.data.uploaded_files || [],
        })
      );
    }

    // Mark files as success
    batch.forEach((file) => {
      dispatch(updateFileStatus({ id: file.id, status: 'success', progress: 100 }));
    });

    // Wait a bit before next batch
    await new Promise((resolve) => setTimeout(resolve, 500));
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h3 className="text-xl sm:text-2xl font-bold text-neutral-900 mb-2">OCR Extraction</h3>
        <p className="text-sm sm:text-base text-neutral-600">
          Uploading files to server for processing...
        </p>
      </div>

      {/* Files List with Progress */}
      <div className="space-y-2">
        {uploadedFiles.map((file) => (
          <div
            key={file.id}
            className="flex items-center justify-between p-3 sm:p-4 bg-white rounded-lg border border-neutral-200"
          >
            <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
              <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-primary-500 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-neutral-900 text-sm sm:text-base truncate" title={file.name}>
                  {file.name}
                </p>
                <p className="text-xs sm:text-sm text-neutral-500">
                  {formatFileSize(file.size)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0 ml-2">
              {file.status === 'uploading' && (
                <>
                  <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 text-primary-500 animate-spin" />
                  <span className="text-xs sm:text-sm text-neutral-600">{file.progress}%</span>
                </>
              )}
              {file.status === 'success' && (
                <>
                  <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-accent-green" />
                  <span className="text-xs sm:text-sm text-accent-green">Uploaded</span>
                </>
              )}
              {file.status === 'error' && (
                <>
                  <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-500" />
                  <span className="text-xs sm:text-sm text-red-500">Failed</span>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
