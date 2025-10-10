import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { setCanProceed } from '@/store/slices/stepperSlice';
import { setSessionId } from '@/store/slices/sessionSlice';
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
import { ServerFile } from '@/types/file.types';


export const OCRExtraction = () => {
  const dispatch = useDispatch();
  const { uploadedFiles, isUploading, serverFileIds } = useSelector((state: RootState) => state.files);
  const [uploadComplete, setUploadComplete] = useState(false);
  const { sessionId } = useSelector((state: RootState) => state.session);

  useEffect(() => {
    if (uploadedFiles.length > 0 && !isUploading && !uploadComplete) {
      uploadFilesInBatches();
    }
  }, [isUploading]);

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

    formData.append('session_id', sessionId || '');

    // Get token from localStorage for Authorization header
    const token = localStorage.getItem('auth_token');

    try {
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
        onDownloadProgress: (progressEvent) => {
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
        // const resposeFiles = response.data.uploaded_files.map((file: any, index:number) => [...file, {filename : response.data.uploaded_files[index].filename, gcs_path : response.data.uploaded_files[index].gcs_path, public_url:response.data.uploaded_files[index].public_url}]) || [];
        const resFiles: ServerFile[] = [];
        response.data.uploaded_files.forEach((file: any) => {
          let upldFile = uploadedFiles.find((f) => f.name === file.filename);
          if (upldFile) {
            resFiles.push({
              id: upldFile.id,
              name: upldFile.name,
              size: upldFile.size,
              file,
              status: 'pending',
              progress: 0,
              filename: file.filename,
              gcs_path: file.gcs_path,
              public_url: file.public_url
            });
          }
        });

        let updatedServerFiles = [...serverFileIds, ...resFiles];

        dispatch(
          setSessionData({
            sessionId: sessionId || '',
            userName: response.data.user_name || '',
            serverFileIds: updatedServerFiles,
            uploadedFiles: []
          })
        );

        dispatch(setSessionId(response.data.session_id));
      }

      // Mark files as success
      batch.forEach((file) => {
        dispatch(updateFileStatus({ id: file.id, status: 'success', progress: 100 }));
      });
    } catch (error: any) {
      // Mark all files in batch as error when API fails
      batch.forEach((file) => {
        dispatch(updateFileStatus({ id: file.id, status: 'error', progress: 0 }));
      });
      throw error; // Re-throw to trigger main error handler
    }

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


        {serverFileIds.length > 0 && serverFileIds.map((file) => (
          <div
            key={file.id}
            className="flex items-center justify-between p-2 sm:p-3 bg-white rounded-lg border border-neutral-200"
          >
            <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
              <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-primary-500 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-neutral-900 text-xs sm:text-sm truncate" title={file.name}>
                  {file.name}
                </p>
                <p className="text-[10px] sm:text-xs text-neutral-500 truncate">
                  {formatFileSize(file.size)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0 ml-2">
              <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-accent-green" />
              <span className="text-xs sm:text-sm text-accent-green">Uploaded</span>
            </div>
          </div>
        ))}


        {uploadedFiles.map((file) => (
          <div
            key={file.id}
            className="flex items-center justify-between p-2 sm:p-3 bg-white rounded-lg border border-neutral-200"
          >
            <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
              <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-primary-500 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-neutral-900 text-xs sm:text-sm truncate" title={file.name}>
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
