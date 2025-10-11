import { useDropzone } from "react-dropzone";
import { Accordion } from "./Accordion";
import { API_ENDPOINTS, BATCH_UPLOAD_SIZE, FILE_TYPE_EXTENSIONS } from "@/utils/constants";
import clsx from "clsx";
import { AlertCircle, CheckCircle, FileText, Loader2, Upload, X } from "lucide-react";
import { useCallback, useState } from "react";
import { useFileUpload } from "@/hooks/useFileUpload";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { formatFileSize } from "@/utils/fileHelpers";
import { Button } from "./Button";
import { setIsUploading, setSessionData, setUploadErrorMessage, updateFileStatus } from "@/store/slices/filesSlice";
import toast from "react-hot-toast";
import { setCurrentStep } from "@/store/slices/stepperSlice";
import api from "@/utils/axios.config";
import { ServerFile } from "@/types/file.types";

export const UploadMore = () => {
    return (

        <Accordion
            items={[
                { title: 'Upload More Files', children: <UploadContainer /> },
            ]}
        ></Accordion>
    );
};

const UploadContainer = () => {

    const dispatch = useDispatch();
    const { handleFilesAdded, handleFileRemoved, handleClearFiles } = useFileUpload();
    const { uploadedFiles, isUploading, serverFileIds } = useSelector((state: RootState) => state.files);
    const { sessionId } = useSelector((state: RootState) => state.session);
    const [showGenerateCTA, setShowGenerateCTA] = useState(false);

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
            setShowGenerateCTA(true);
            toast.success('All files uploaded successfully!');
        } catch (error: any) {
            const message = error.response?.data?.message || 'Upload failed. Please try again.';
            dispatch(setUploadErrorMessage(message));
            setShowGenerateCTA(false);
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

        formData.append('session_id', sessionId || '')

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
            });

            // Update session data from the response
            if (response.data.session_id) {
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

    const processDocuments = async () => {
        dispatch(setCurrentStep(4))
    };

    return (
        <div className="space-y-6">
            {/* Dropzone */}
            <div
                {...getRootProps()}
                className={clsx(
                    'border-2 border-dashed rounded-xl p-4 sm:p-8 text-center cursor-pointer transition-all duration-200',
                    isDragActive
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-neutral-300 hover:border-primary-400 hover:bg-neutral-50'
                )}
            >
                <input {...getInputProps()} />
                <Upload className="h-4 w-8 sm:h-8 sm:w-12 text-neutral-400 mx-auto mb-3 sm:mb-4" />
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
                        {serverFileIds.map((file, index) => (
                            <div
                                key={index}
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

                        {uploadedFiles.map((file, index) => (
                            <div
                                key={index}
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

                                <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0 ml-2">
                                    {file.status === 'pending' && (
                                        <button
                                            onClick={() => handleFileRemoved(file.id)}
                                            className="p-1.5 sm:p-2 hover:bg-red-50 rounded-full transition-colors group flex-shrink-0 ml-2"
                                        >
                                            <X className="h-4 w-4 sm:h-5 sm:w-5 text-neutral-400 group-hover:text-red-500" />
                                        </button>
                                    )}

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

                    {(!isUploading && uploadedFiles.length > 0) && (
                        <div className="flex justify-end gap-2">
                            <Button variant="secondary" onClick={() => handleClearFiles()}>Clear</Button>
                            <Button variant="primary" onClick={uploadFilesInBatches}>Upload</Button>
                        </div>
                    )}

                    {uploadedFiles.length == 0 && showGenerateCTA && (
                        <div className="flex justify-end gap-2">
                            <Button variant="secondary" onClick={() => handleClearFiles()}>Clear</Button>
                            <Button variant="primary" onClick={processDocuments}>Generate AutoFill</Button>
                        </div>
                    )}
                </div>
            )}

        </div>
    )
}