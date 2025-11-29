import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { FileState, ServerFile, UploadedFile } from '@/types/file.types';

const initialState: FileState = {
  uploadedFiles: [],
  sessionId: null,
  userName: null,
  serverFileIds: [],
  docxUrl: null,
  htmlUrl: null,
  finalDocxUrl: null,
  isUploading: false,
  uploadError: null,
};

const filesSlice = createSlice({
  name: 'files',
  initialState,
  reducers: {
    addFiles: (state, action: PayloadAction<UploadedFile[]>) => {
      state.uploadedFiles.push(...action.payload);
    },
    removeFile: (state, action: PayloadAction<string>) => {
      state.uploadedFiles = state.uploadedFiles.filter(
        (file) => file.id !== action.payload
      );
    },
    updateFileStatus: (
      state,
      action: PayloadAction<{ id: string; status: UploadedFile['status']; progress?: number }>
    ) => {
      const file = state.uploadedFiles.find((f) => f.id === action.payload.id);
      if (file) {
        file.status = action.payload.status;
        if (action.payload.progress !== undefined) {
          file.progress = action.payload.progress;
        }
      }
    },
    setUploadError: (state, action: PayloadAction<{ id: string; error: string }>) => {
      const file = state.uploadedFiles.find((f) => f.id === action.payload.id);
      if (file) {
        file.error = action.payload.error;
        file.status = 'error';
      }
    },
    setSessionData: (
      state,
      action: PayloadAction<{ sessionId: string; userName: string; serverFileIds: ServerFile[], uploadedFiles?:UploadedFile[] }>
    ) => {
      state.sessionId = action.payload.sessionId;
      state.userName = action.payload.userName;
      state.serverFileIds = action.payload.serverFileIds;
      state.uploadedFiles = action.payload.uploadedFiles || [];
    },
    setDocxUrl: (state, action: PayloadAction<string>) => {
      state.docxUrl = action.payload;
    },
    setHtmlUrl: (state, action: PayloadAction<string>) => {
      state.htmlUrl = action.payload;
    },
    setFinalDocxUrl: (state, action: PayloadAction<string>) => {
      state.finalDocxUrl = action.payload;
    },
    setIsUploading: (state, action: PayloadAction<boolean>) => {
      state.isUploading = action.payload;
    },
    setUploadErrorMessage: (state, action: PayloadAction<string | null>) => {
      state.uploadError = action.payload;
    },
    addServerFile: (state, action: PayloadAction<ServerFile>) => {
      state.serverFileIds.push(action.payload);
    },
    clearFiles: (state) => {
      state.uploadedFiles = [];
      state.sessionId = null;
      state.userName = null;
      state.serverFileIds = [];
      state.docxUrl = null;
      state.htmlUrl = null;
      state.finalDocxUrl = null;
      state.isUploading = false;
      state.uploadError = null;
    },
  },
});

export const {
  addFiles,
  removeFile,
  updateFileStatus,
  setUploadError,
  setSessionData,
  setDocxUrl,
  setHtmlUrl,
  setFinalDocxUrl,
  setIsUploading,
  setUploadErrorMessage,
  addServerFile,
  clearFiles,
} = filesSlice.actions;

export default filesSlice.reducer;
