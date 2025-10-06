import { MarkerType } from '@/types/map.types';

export const APP_NAME = import.meta.env.VITE_APP_NAME || 'Insurance Claims';
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
export const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';
export const MAX_FILE_SIZE = Number(import.meta.env.VITE_MAX_FILE_SIZE) || 10485760; // 10MB
export const MAX_FILES = Number(import.meta.env.VITE_MAX_FILES) || 50;

export const ALLOWED_FILE_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/jpg',
  'image/png',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

export const FILE_TYPE_EXTENSIONS: Record<string, string> = {
  'application/pdf': '.pdf',
  'image/jpeg': '.jpg',
  'image/jpg': '.jpg',
  'image/png': '.png',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
};

export const STEPS = [
  { id: 1, name: 'Upload Documents', key: 'upload' },
  { id: 2, name: 'OCR Extraction', key: 'ocr' },
  { id: 3, name: 'AutoFill', key: 'autofill' },
  { id: 4, name: 'Preview', key: 'preview' },
  { id: 5, name: 'Road Map', key: 'roadmap' },
  { id: 6, name: 'Download', key: 'download' },
];

export const MARKER_TYPES: MarkerType[] = ['car', 'bike', 'blast', 'trespasser'];

export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: '/register',
    LOGIN: '/token',
  },
  USER: {
    ME: '/users/me',
  },
  FILES: {
    UPLOAD: '/upload-files/', // Added trailing slash to match backend
  },
  PROCESS: {
    AUTOFILL: '/document/process', // Will be used as /document/process/{session_id}
  },
  DOWNLOAD: {
    LIST: '/list', // Will be used as /list/{session_id}
  },
};

export const BATCH_UPLOAD_SIZE = 5; // Upload 5 files at a time
