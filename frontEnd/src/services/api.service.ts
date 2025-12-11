// ==================== Map Report API ====================
export const mapReportAPI = {
  uploadMapReport: async (sessionId: string, payload: any, templatePath = 'template1.docx') => {
    const response = await api.post(`/map_report/${sessionId}?template_path=${templatePath}`, payload, {
      headers: { 'Content-Type': 'application/json' },
    });
    return response.data;
  },
};
// ==================== Image Mapping API ====================
export const imageMappingAPI = {
  getImageMapping: async (): Promise<string[]> => {
    const response = await api.get<string[]>('/get/image/mapping');
    return response.data;
  },
};
import api from '@/utils/axios.config';
import { API_ENDPOINTS } from '@/utils/constants';
import { LoginResponse, RegisterResponse, User } from '@/types/auth.types';

// ==================== Helper Functions ====================
const getAuthToken = (): string => {
  const token = localStorage.getItem('auth_token');
  if (!token) {
    throw new Error('Authentication token not found.');
  }
  return token;
};

const getAuthHeaders = () => ({
  Authorization: `Bearer ${getAuthToken()}`,
});

// ==================== Authentication APIs ====================
export const authAPI = {
  login: async (username: string, password: string): Promise<LoginResponse> => {
    const formData = new URLSearchParams();
    formData.append('grant_type', 'password');
    formData.append('username', username);
    formData.append('password', password);
    formData.append('scope', '');
    formData.append('client_id', 'string');
    formData.append('client_secret', '********');

    const response = await api.post<LoginResponse>(
      API_ENDPOINTS.AUTH.LOGIN,
      formData,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );
    return response.data;
  },

  register: async (username: string, email: string, password: string): Promise<RegisterResponse> => {
    const response = await api.post<RegisterResponse>(
      API_ENDPOINTS.AUTH.REGISTER,
      { username, email, password }
    );
    return response.data;
  },

  getUserProfile: async (): Promise<User> => {
    const response = await api.get<{ username: string; email: string }>(
      API_ENDPOINTS.USER.ME,
      { headers: getAuthHeaders() }
    );

    return {
      id: response.data.username,
      username: response.data.username,
      email: response.data.email,
    };
  },
};

// ==================== File Upload APIs ====================
export const fileAPI = {
  uploadFiles: async (
    files: File[],
    sessionId: string,
    onUploadProgress?: (progress: number) => void
  ) => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file);
    });

    const response = await api.post(
      `${API_ENDPOINTS.FILES.UPLOAD}?session_id=${sessionId}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          ...getAuthHeaders(),
        },
        onUploadProgress: (progressEvent) => {
          if (onUploadProgress && progressEvent.total) {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            onUploadProgress(progress);
          }
        },
      }
    );

    return response.data;
  },

  uploadScreenshot: async (file: File, sessionId: string) => {
    const formData = new FormData();
    formData.append('files', file);

    try {
      const response = await api.post(
        `${API_ENDPOINTS.FILES.UPLOAD}?session_id=${sessionId}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            ...getAuthHeaders(),
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error('Error uploading screenshot:', error);
      return null;
    }
  },
};

// ==================== Document Processing APIs ====================
export const documentAPI = {
  getTemplateList: async () => {
    const response = await api.get('/template/dropdown', {
      headers: getAuthHeaders(),
    });
    return response.data;
  },

  processDocuments: async (sessionId: string) => {
    const response = await api.get(
      `${API_ENDPOINTS.PROCESS.AUTOFILL}/${sessionId}`,
      {
        params: { template_filename: 'template1.docx' },
        headers: getAuthHeaders(),
        timeout: 180000, // 3 minutes
      }
    );

    return response.data;
  },

  saveEditedForm: async (sessionId: string, formData: any, templatePath?: string) => {
    const defaultTemplate = 'template1.docx';

    const response = await api.post(
      `${API_ENDPOINTS.PROCESS.MAP_REPORT}/${sessionId}?template_path=${templatePath || defaultTemplate}`,
      JSON.stringify(formData),
      {
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json',
        },
        timeout: 120000, // 2 minutes
      }
    );

    return response.data;
  },
};

// ==================== Export All APIs ====================
export const apiService = {
  auth: authAPI,
  file: fileAPI,
  document: documentAPI,
  imageMapping: imageMappingAPI,
  mapReport: mapReportAPI,
};

export default apiService;
