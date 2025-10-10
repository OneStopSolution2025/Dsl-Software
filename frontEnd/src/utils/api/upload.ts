import axios from 'axios';
import { API_ENDPOINTS } from '../constants';
import api from '../axios.config';

export const uploadScreenshotAPI = async (file: File, sessionId: string) => {
  const formData = new FormData();
  formData.append('files', file);
  formData.append('session_id', sessionId);

  // Get token from localStorage for Authorization header
  const token = localStorage.getItem('auth_token');

  try{
    const response = await api.post(API_ENDPOINTS.FILES.UPLOAD, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}`
      },
    });
      return response.data;
  } catch (error) {
    console.error('Error uploading file:', error);
    return null;
  }

  return null;
};

export const updateSessionFromUpload = (data: any) => ({
  type: 'files/updateSessionFromUpload',
  payload: data,
});
