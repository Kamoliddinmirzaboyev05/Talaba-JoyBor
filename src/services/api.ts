import axios, { AxiosInstance, AxiosResponse } from 'axios';

// API base URL
const API_BASE_URL = 'https://joyborv1.pythonanywhere.com';

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const accessToken = sessionStorage.getItem('access') || sessionStorage.getItem('access_token');
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    config.headers['Content-Type'] = 'application/json';
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = sessionStorage.getItem('refresh') || sessionStorage.getItem('refresh_token');
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/token/refresh/`, {
            refresh: refreshToken,
          });

          const { access } = response.data;
          sessionStorage.setItem('access', access);

          // Retry the original request with new token
          originalRequest.headers.Authorization = `Bearer ${access}`;
          return api(originalRequest);
        }
      } catch {
        // Refresh token failed, logout user
        sessionStorage.removeItem('access');
        sessionStorage.removeItem('refresh');
        sessionStorage.removeItem('user');
        window.location.reload();
      }
    }

    return Promise.reject(error);
  }
);

// API response types
export interface RegisterRequest {
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  role: string;
  password: string;
  password2: string;
}

export interface RegisterResponse {
  access: string;
  refresh: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  access: string;
  refresh: string;
}

export interface UserProfile {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  university?: string;
  student_id?: string;
  is_verified?: boolean;
}

// API functions
export const authAPI = {
  // Register user
  register: async (data: RegisterRequest): Promise<RegisterResponse> => {
    const response = await api.post('/api/register/', data);
    return response.data;
  },

  // Login user
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await api.post('/api/token/', data);
    return response.data;
  },

  // Get user profile
  getProfile: async (): Promise<UserProfile> => {
    const response = await api.get('/profile/');
    return response.data;
  },

  // Get student profile from /api/me/ endpoint
  getStudentProfile: async (): Promise<UserProfile> => {
    const response = await api.get('/api/me/');
    return response.data;
  },

  // Update user profile
  updateProfile: async (data: Partial<UserProfile>): Promise<UserProfile> => {
    const response = await api.put('/profile/', data);
    return response.data;
  },

  // Logout (optional - can be handled client-side)
  logout: async (): Promise<void> => {
    try {
      await api.post('/logout/');
    } catch {
      // Even if logout fails, clear local storage
    }
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
  },

  // Get provinces/cities list
  getProvinces: async (): Promise<{ id: number; name: string }[]> => {
    const response = await api.get('/provinces/');
    return response.data;
  },

  // Get districts by province ID
  getDistricts: async (provinceId: number): Promise<{ id: number; name: string; province: number }[]> => {
    const response = await api.get(`/districts/?province=${provinceId}`);
    return response.data;
  },

  // Get dormitories list
  getDormitories: async (): Promise<any[]> => {
    const response = await api.get('/api/dormitories/');
    // API returns paginated response: {count, next, previous, results}
    return response.data.results || response.data;
  },

  // Get apartments list (ijara xonadonlar)
  getApartments: async (): Promise<any[]> => {
    const response = await api.get('/api/apartments/');
    // API returns paginated response: {count, next, previous, results}
    return response.data.results || response.data;
  },

  // Submit application
  submitApplication: async (applicationData: {
    dormitory: number;
    name: string;
    last_name: string;
    middle_name?: string;
    province: number; // province id
    district: number; // district id
    faculty: string;
    direction: string;
    course: string;
    group: string;
    phone: string; // keep as string per API
    passport: string; // AA1234567 format
    comment?: string;
    document?: File | null;
    user_image?: File | null;
    passport_image_first?: File | null;
    passport_image_second?: File | null;
    status?: string;
  }): Promise<any> => {
    try {
      // Create FormData for file uploads
      const formData = new FormData();

      // Required and text fields
      formData.append('dormitory', applicationData.dormitory.toString());
      formData.append('name', applicationData.name);
      formData.append('last_name', applicationData.last_name);
      if (applicationData.middle_name) {
        formData.append('middle_name', applicationData.middle_name);
      }
      formData.append('province', applicationData.province.toString());
      formData.append('district', applicationData.district.toString());
      formData.append('faculty', applicationData.faculty);
      formData.append('direction', applicationData.direction);
      formData.append('course', applicationData.course);
      formData.append('group', applicationData.group);
      formData.append('phone', applicationData.phone);
      formData.append('passport', applicationData.passport);
      if (applicationData.comment) {
        formData.append('comment', applicationData.comment);
      }
      if (applicationData.status) {
        formData.append('status', applicationData.status);
      }

      // Files
      if (applicationData.user_image) {
        formData.append('user_image', applicationData.user_image);
      }
      if (applicationData.document) {
        formData.append('document', applicationData.document);
      }
      if (applicationData.passport_image_first) {
        formData.append('passport_image_first', applicationData.passport_image_first);
      }
      if (applicationData.passport_image_second) {
        formData.append('passport_image_second', applicationData.passport_image_second);
      }

      // Send with multipart/form-data content type
      const response = await axios.post(`${API_BASE_URL}/application/create/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${sessionStorage.getItem('access') || sessionStorage.getItem('access_token')}`
        }
      });

      return response.data;
    } catch (error: any) {
      console.error('API Error Details:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      throw error;
    }
  },

  // Get user applications
  getApplications: async (): Promise<any[]> => {
    try {
      const response = await api.get('/applications/');
      return response.data;
    } catch (error: any) {
      console.error('Applications fetch error:', error);
      throw error;
    }
  },

  // Get universities list
  getUniversities: async (): Promise<{ id: number; name: string }[]> => {
    try {
      const response = await api.get('/universities/');
      return response.data;
    } catch (error: any) {
      console.error('Universities fetch error:', error);
      // Fallback universitetlar ro'yxati
      return [
        { id: 1, name: 'Toshkent Davlat Universiteti' },
        { id: 2, name: 'Samarqand Davlat Universiteti' },
        { id: 3, name: 'Buxoro Davlat Universiteti' },
        { id: 4, name: 'Andijon Davlat Universiteti' },
        { id: 5, name: 'Namangan Davlat Universiteti' },
        { id: 6, name: 'Farg\'ona Davlat Universiteti' },
        { id: 7, name: 'Toshkent Axborot Texnologiyalari Universiteti' },
        { id: 8, name: 'Toshkent Moliya Instituti' },
        { id: 9, name: 'O\'zbekiston Milliy Universiteti' },
        { id: 10, name: 'Toshkent Tibbiyot Akademiyasi' }
      ];
    }
  },

  // Get platform statistics
  getStatistics: async (): Promise<{
    dormitories_count: number;
    apartments_count: number;
    users_count: number;
    applications_count: number;
  }> => {
    try {
      // Real statistikalar: students_count, dormitories_count, apartments_count
      const response = await api.get('/statistics/');
      const data = response.data || {};
      return {
        dormitories_count: Number(data.dormitories_count) || 0,
        apartments_count: Number(data.apartments_count) || 0,
        users_count: Number(data.students_count) || 0,
        applications_count: 0,
      };
    } catch (error: any) {
      console.error('Statistics fetch error:', error);
      // Fallback: eski usul orqali taxminiy qiymatlar
      try {
        const [dormitories, apartments] = await Promise.all([
          api.get('/api/dormitories/'),
          api.get('/api/apartments/')
        ]);
        return {
          dormitories_count: dormitories.data.results?.length || dormitories.data.count || 0,
          apartments_count: apartments.data.results?.length || apartments.data.count || 0,
          users_count: 0,
          applications_count: 0,
        };
      } catch {
        return {
          dormitories_count: 0,
          apartments_count: 0,
          users_count: 0,
          applications_count: 0,
        };
      }
    }
  },

  // Get notifications
  getNotifications: async (): Promise<any[]> => {
    try {
      const response = await api.get('/notifications/my/');
      return response.data;
    } catch (error: any) {
      console.error('Notifications fetch error:', error);
      throw error;
    }
  },

  // Mark notification as read
  markNotificationAsRead: async (notificationId: number): Promise<any> => {
    try {
      const response = await api.post('/notifications/mark-read/', {
        notification_id: notificationId
      });
      return response.data;
    } catch (error: any) {
      console.error('Mark notification as read error:', error);
      throw error;
    }
  },

};

export default api; 