import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import {  addFiles, clearFiles, removeFile } from '@/store/slices/filesSlice';
import { validateFile, generateFileId } from '@/utils/fileHelpers';
import { UploadedFile } from '@/types/file.types';
import toast from 'react-hot-toast';

export const useFileUpload = () => {
  const dispatch = useDispatch();

  const handleFilesAdded = useCallback(
    (files: File[]) => {
      const validFiles: UploadedFile[] = [];
      const errors: string[] = [];

      files.forEach((file) => {
        const validation = validateFile(file);
        if (validation.valid) {
          validFiles.push({
            id: generateFileId(),
            name: file.name,
            size: file.size,
            file,
            status: 'pending',
            progress: 0,
          });
        } else {
          errors.push(`${file.name}: ${validation.error}`);
        }
      });

      if (validFiles.length > 0) {
        dispatch(addFiles(validFiles));
        toast.success(`${validFiles.length} file(s) added successfully`);
      }

      if (errors.length > 0) {
        errors.forEach((error) => toast.error(error));
      }

      return validFiles.length;
    },
    [dispatch]
  );

  const handleFileRemoved = useCallback(
    (fileId: string) => {
      dispatch(removeFile(fileId));
      toast.success('File removed');
    },
    [dispatch]
  );

  const handleClearFiles = useCallback(() => {
    dispatch(clearFiles());
    toast.success('Files cleared');
  }, [dispatch]);

  return {
    handleFilesAdded,
    handleFileRemoved,
    handleClearFiles,
  };
};
