import { MarkerType } from '@/types/map.types';

export const APP_NAME = import.meta.env.VITE_APP_NAME || 'Insurance Claims';
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://test.dfixcells.com';
export const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';
export const MAX_FILE_SIZE = Number(import.meta.env.VITE_MAX_FILE_SIZE) || 5242880; // 5MB
export const MAX_FILES = Number(import.meta.env.VITE_MAX_FILES) || 50;

export const ALLOWED_FILE_TYPES = [
  'application/pdf',
  'image/jpeg',
  'image/jpg',
  'image/png',
];



export const FILE_TYPE_EXTENSIONS: Record<string, string[]> = {
  'application/pdf': ['.pdf'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
};

export const STEPS = [
  { id: 1, name: 'Upload Documents', key: 'upload' },
  { id: 2, name: 'OCR Extraction', key: 'ocr' },
  { id: 3, name: 'Road Map', key: 'roadmap' },
  { id: 4, name: 'AutoFill', key: 'autofill' },
  { id: 5, name: 'Preview', key: 'preview' },
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
    UPLOAD: '/upload-files/',
  },
  PROCESS: {
    AUTOFILL: '/document/process',
  },
  DOWNLOAD: {
    LIST: '/list',
  },
};

export const BATCH_UPLOAD_SIZE = 7; // Upload 7 files at a time

