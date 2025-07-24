import axios, { AxiosInstance, AxiosResponse } from 'axios';

// API base URL
const API_BASE_URL = 'https://joyboryangi.pythonanywhere.com';

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
    const accessToken = localStorage.getItem('access_token');
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
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
        const refreshToken = localStorage.getItem('refresh_token');
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/token/refresh/`, {
            refresh: refreshToken,
          });

          const { access } = response.data;
          localStorage.setItem('access_token', access);
          
          // Retry the original request with new token
          originalRequest.headers.Authorization = `Bearer ${access}`;
          return api(originalRequest);
        }
      } catch {
        // Refresh token failed, logout user
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
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
  phone: string;
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
    const response = await api.post('/register/', data);
    return response.data;
  },

  // Login user
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await api.post('/token/', data);
    return response.data;
  },

  // Get user profile
  getProfile: async (): Promise<UserProfile> => {
    const response = await api.get('/profile/');
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

  // Submit application
  submitApplication: async (applicationData: {
    user: number;
    dormitory: number;
    room: number;
    status: string;
    comment: string;
    name: string;
    fio: string;
    city: string;
    village: string;
    university: string;
    phone: number;
    passport: number;
  }): Promise<any> => {
    const token = localStorage.getItem('access');
    if (!token) {
      throw new Error('Authentication required');
    }
    
    const response = await api.post('/application/create/', applicationData, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  },


};

export default api; 