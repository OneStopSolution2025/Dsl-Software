import { useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { setCanProceed } from '@/store/slices/stepperSlice';
import { useFileUpload } from '@/hooks/useFileUpload';
import { formatFileSize } from '@/utils/fileHelpers';
import { Upload, X, FileText, CheckCircle } from 'lucide-react';
import clsx from 'clsx';
import { FILE_TYPE_EXTENSIONS } from '@/utils/constants';

export const UploadDocuments = () => {
  const dispatch = useDispatch();
  const { uploadedFiles, serverFileIds } = useSelector((state: RootState) => state.files);
  const { handleFilesAdded, handleFileRemoved } = useFileUpload();

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      handleFilesAdded(acceptedFiles);
    },
    [handleFilesAdded]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: FILE_TYPE_EXTENSIONS,
  });

  useEffect(() => {
    dispatch(setCanProceed(uploadedFiles.length > 0));
  }, [uploadedFiles.length, dispatch]);

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h3 className="text-xl sm:text-2xl font-bold text-neutral-900 mb-2">Upload Documents</h3>
        <p className="text-sm sm:text-base text-neutral-600">
          Upload your insurance claim documents. Supported formats: PDF, JPG, PNG, DOCX
        </p>
      </div>

      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={clsx(
          'border-2 border-dashed rounded-xl p-8 sm:p-12 text-center cursor-pointer transition-all duration-200',
          isDragActive
            ? 'border-primary-500 bg-primary-50'
            : 'border-neutral-300 hover:border-primary-400 hover:bg-neutral-50'
        )}
      >
        <input {...getInputProps()} />
        <Upload className="h-8 w-8 sm:h-12 sm:w-12 text-neutral-400 mx-auto mb-3 sm:mb-4" />
        <p className="text-base sm:text-lg font-medium text-neutral-700 mb-2">
          {isDragActive ? 'Drop files here' : 'Drag & drop files here'}
        </p>
        <p className="text-sm text-neutral-500">or click to browse</p>
        <p className="text-xs text-neutral-400 mt-3 sm:mt-4">
          Supported: PDF, JPG, PNG • Max size: 10MB per file
        </p>
      </div>

      {/* Uploaded Files List */}
      {(uploadedFiles.length > 0 || serverFileIds.length > 0) && (
        <div className="space-y-3">
          <h4 className="font-semibold text-neutral-900 text-sm sm:text-base">
            Uploaded Files ({uploadedFiles.length + serverFileIds.length})
          </h4>
          <div className="space-y-2">

            {serverFileIds.map((file: any) => (
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
                  <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-accent-green" />
                  <span className="text-xs sm:text-sm text-accent-green">Uploaded</span>
                </div>
              </div>
            ))}


            {uploadedFiles.map((file: any) => (
              <div
                key={file.id}
                className="flex items-center justify-between p-2 sm:p-3 bg-white rounded-lg border border-neutral-200 hover:border-primary-300 transition-colors"
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
                <button
                  onClick={() => handleFileRemoved(file.id)}
                  className="p-1.5 sm:p-2 hover:bg-red-50 rounded-lg transition-colors group flex-shrink-0 ml-2"
                >
                  <X className="h-4 w-4 sm:h-5 sm:w-5 text-neutral-400 group-hover:text-red-500" />
                </button>
              </div>
            ))}

          </div>
        </div>
      )}

      {/* <UploadMore /> */}

    </div>
  );
};
