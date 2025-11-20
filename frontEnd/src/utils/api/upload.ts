import apiService from '@/services/api.service';

export const uploadScreenshotAPI = async (file: File, sessionId: string) => {
  return await apiService.file.uploadScreenshot(file, sessionId);
};

export const updateSessionFromUpload = (data: any) => ({
  type: 'files/updateSessionFromUpload',
  payload: data,
});
