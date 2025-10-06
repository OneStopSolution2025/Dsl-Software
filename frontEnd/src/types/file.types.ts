export interface UploadedFile {
  id: string;
  name: string;
  size: number;
  file: File;
  status: 'pending' | 'uploading' | 'success' | 'error';
  progress: number;
  error?: string;
}

export interface FileState {
  uploadedFiles: UploadedFile[];
  sessionId: string | null;
  userName: string | null;
  serverFileIds: string[];
  docxUrl: string | null;
  finalDocxUrl: string | null;
  isUploading: boolean;
  uploadError: string | null;
}

export interface UploadResponse {
  message: string;
  session_id: string;
  user_name: string;
  uploaded_files: string[];
}

export interface ProcessResponse {
  message: string;
  report_docx_gcs_uri: string;
  status: string;
}

export interface DownloadResponse {
  message: string;
  url: string;
}
