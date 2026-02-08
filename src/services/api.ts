import axios, { AxiosInstance, AxiosResponse } from 'axios';

// API base URL
const API_BASE_URL = 'https://joyborv1.pythonanywhere.com/api';

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const accessToken = sessionStorage.getItem('access') || sessionStorage.getItem('access_token');
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    
    // Handle Content-Type based on data type
    if (config.data instanceof FormData) {
      // For FormData, delete Content-Type to let browser set it with boundary
      delete config.headers['Content-Type'];
      
      if (import.meta.env.DEV) {
        console.log('📤 FormData request detected, Content-Type removed');
        console.log('Headers:', config.headers);
      }
    } else {
      // For other requests, use application/json
      config.headers['Content-Type'] = 'application/json';
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
    const response = await api.get('/me/');
    return response.data;
  },

  // Update user profile
  updateProfile: async (data: Partial<UserProfile>): Promise<UserProfile> => {
    const response = await api.put('/me/', data);
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
    // API returns { count, next, previous, results }
    return response.data.results || response.data;
  },

  // Get districts by province ID
  getDistricts: async (provinceId: number): Promise<{ id: number; name: string; province: number; province_name?: string }[]> => {
    const response = await api.get(`/districts/?province=${provinceId}`);
    // API returns { count, next, previous, results }
    return response.data.results || response.data;
  },

  // Get dormitories list
  getDormitories: async (): Promise<{ count: number; next: string | null; previous: string | null; results: unknown[] }> => {
    const response = await api.get('/dormitories/');
    // API returns { count, next, previous, results }
    return response.data;
  },

  // Get apartments list
  getApartments: async (): Promise<unknown[]> => {
    const response = await api.get('/apartments/');
    // API returns array or { count, next, previous, results }
    return response.data.results || response.data;
  },



  // Submit application - API rasmiga asoslangan to'liq versiya
  submitApplication: async (applicationData: {
    user: number;
    dormitory: number;
    name: string;
    last_name?: string;
    middle_name?: string;
    province: number;
    district: number;  // district field (API da "district" deb ko'rsatilgan)
    faculty?: string;
    direction?: string;
    course: string;
    group?: string;
    phone?: string;  // string formatida (API da string)
    passport?: string;
    comment?: string;
    user_image?: File | null;
    document?: File | null;
    passport_image_first?: File | null;
    passport_image_second?: File | null;
  }): Promise<unknown> => {
    try {
      // Create FormData for file uploads
      const formData = new FormData();
      
      // MAJBURIY MAYDONLAR (required=true)
      // 1. user (integer, required)
      formData.append('user', applicationData.user.toString());
      
      // 2. dormitory (integer, required)
      formData.append('dormitory', applicationData.dormitory.toString());
      
      // 3. name (string, maxLength: 128, required)
      formData.append('name', applicationData.name.trim());
      
      // 4. province (integer, required)
      formData.append('province', applicationData.province.toString());
      
      // 5. district (integer, required)
      formData.append('district', applicationData.district.toString());
      
      // 6. course (string, required)
      formData.append('course', applicationData.course.trim());
      
      // IXTIYORIY MAYDONLAR (nullable=true)
      // last_name (string, maxLength: 128, nullable)
      if (applicationData.last_name && applicationData.last_name.trim()) {
        formData.append('last_name', applicationData.last_name.trim());
      }
      
      // middle_name (string, maxLength: 128, nullable)
      if (applicationData.middle_name && applicationData.middle_name.trim()) {
        formData.append('middle_name', applicationData.middle_name.trim());
      }
      
      // faculty (string, maxLength: 128, nullable)
      if (applicationData.faculty && applicationData.faculty.trim()) {
        formData.append('faculty', applicationData.faculty.trim());
      }
      
      // direction (string, maxLength: 128, nullable)
      if (applicationData.direction && applicationData.direction.trim()) {
        formData.append('direction', applicationData.direction.trim());
      }
      
      // group (string, maxLength: 128, nullable)
      if (applicationData.group && applicationData.group.trim()) {
        formData.append('group', applicationData.group.trim());
      }
      
      // phone (string, nullable)
      if (applicationData.phone && applicationData.phone.trim()) {
        formData.append('phone', applicationData.phone.trim());
      }
      
      // passport (string, maxLength: 128, nullable)
      if (applicationData.passport && applicationData.passport.trim()) {
        formData.append('passport', applicationData.passport.trim());
      }
      
      // comment (string, nullable)
      if (applicationData.comment && applicationData.comment.trim()) {
        formData.append('comment', applicationData.comment.trim());
      }
      
      // FAYL MAYDONLARI (file, nullable)
      // user_image (file, nullable)
      if (applicationData.user_image && applicationData.user_image instanceof File) {
        formData.append('user_image', applicationData.user_image);
      }
      
      // document (file, nullable)
      if (applicationData.document && applicationData.document instanceof File) {
        formData.append('document', applicationData.document);
      }
      
      // passport_image_first (file, nullable)
      if (applicationData.passport_image_first && applicationData.passport_image_first instanceof File) {
        formData.append('passport_image_first', applicationData.passport_image_first);
      }
      
      // passport_image_second (file, nullable)
      if (applicationData.passport_image_second && applicationData.passport_image_second instanceof File) {
        formData.append('passport_image_second', applicationData.passport_image_second);
      }
      
      // Debug logging
      if (import.meta.env.DEV) {
        console.log('=== ARIZA YUBORISH DEBUG ===');
        console.log('Original data:', applicationData);
        console.log('\n📋 FormData entries:');
        const formDataEntries: Record<string, string> = {};
        for (const [key, value] of formData.entries()) {
          if (value instanceof File) {
            const fileInfo = `File(${value.name}, ${value.size} bytes, ${value.type})`;
            console.log(`  ✓ ${key}: ${fileInfo}`);
            formDataEntries[key] = fileInfo;
          } else {
            console.log(`  ✓ ${key}: ${value}`);
            formDataEntries[key] = String(value);
          }
        }
        console.log('\n📊 FormData summary:', formDataEntries);
        console.log('=== END DEBUG ===\n');
      }
      
      // Send request
      const response = await api.post('/applications/create/', formData, {
        timeout: 30000, // 30 seconds timeout
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      if (import.meta.env.DEV) {
        console.log('✅ Ariza muvaffaqiyatli yuborildi:', response.data);
      }
      
      return response.data;
    } catch (error: unknown) {
      const err = error as { response?: { status?: number; statusText?: string; data?: unknown }; message?: string; config?: { url?: string; method?: string; headers?: unknown } };
      console.error('=== ❌ ARIZA YUBORISH XATOSI ===');
      console.error('Status:', err.response?.status);
      console.error('Status Text:', err.response?.statusText);
      console.error('Error Message:', err.message);
      
      if (err.response?.data) {
        console.error('Server Response:', err.response.data);
        
        // Parse HTML error if present
        if (typeof err.response.data === 'string' && err.response.data.includes('<!doctype html>')) {
          console.error('⚠️ Server returned HTML error page');
          const titleMatch = err.response.data.match(/<title>(.*?)<\/title>/);
          if (titleMatch) {
            console.error('Error Title:', titleMatch[1]);
          }
        }
      }
      
      if (err.config) {
        console.error('Request URL:', err.config.url);
        console.error('Request Method:', err.config.method);
        console.error('Request Headers:', err.config.headers);
      }
      
      console.error('=== END XATO ===\n');
      
      throw error;
    }
  },

  // Get user applications
  getApplications: async (): Promise<unknown[]> => {
    try {
      const response = await api.get('/student/application/');
      return response.data;
    } catch (error: unknown) {
      console.error('Applications fetch error:', error);
      throw error;
    }
  },

  // Get student dashboard data
  getStudentDashboard: async (): Promise<unknown> => {
    try {
      const response = await api.get('/student/dashboard/');
      return response.data;
    } catch (error: unknown) {
      console.error('Student dashboard fetch error:', error);
      throw error;
    }
  },

  // Get universities list
  getUniversities: async (): Promise<{ id: number; name: string }[]> => {
    try {
      const response = await api.get('/universities/');
      return response.data;
    } catch (error: unknown) {
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
    universities_count?: number;
    rooms_total?: number;
    rooms_occupied?: number;
    rooms_free?: number;
  }> => {
    try {
      // Real statistikalar: /api/stats/ endpointidan
      const response = await api.get('/stats/');
      const data = response.data || {};
      
      return {
        dormitories_count: Number(data.dormitories?.total) || 0,
        apartments_count: Number(data.apartments?.total) || 0,
        users_count: Number(data.users?.active) || 0, // users.active ishlatiladi
        applications_count: Number(data.applications?.total) || 0,
        universities_count: Number(data.universities?.total) || 0,
        rooms_total: Number(data.rooms?.total) || 0,
        rooms_occupied: Number(data.rooms?.occupied) || 0,
        rooms_free: Number(data.rooms?.free) || 0,
      };
    } catch (error: unknown) {
      const err = error as { response?: { status?: number } };
      // 401 yoki 404 xatosi uchun console.warn ishlatamiz (bu normal holat)
      if (err.response?.status === 401 || err.response?.status === 404) {
        console.warn('Statistics API not available, using fallback data');
      } else {
        console.warn('Statistics fetch error, using fallback data');
      }
      
      // Fallback: eski usul orqali taxminiy qiymatlar
      try {
        const [dormitories, apartments] = await Promise.all([
          api.get('/dormitories/'),
          api.get('/apartments/')
        ]);
        return {
          dormitories_count: dormitories.data.length || 0,
          apartments_count: apartments.data.length || 0,
          users_count: 5, // Taxminiy qiymat
          applications_count: 1, // Taxminiy qiymat
          universities_count: 1,
        };
      } catch {
        // Eng oxirgi fallback - statik qiymatlar (console.warn ni olib tashlaymiz)
        return {
          dormitories_count: 2,
          apartments_count: 0,
          users_count: 5,
          applications_count: 1,
          universities_count: 1,
        };
      }
    }
  },

  // Get notifications
  getNotifications: async (): Promise<unknown[]> => {
    try {
      const response = await api.get('/notifications/my/');
      return response.data;
    } catch (error: unknown) {
      const err = error as { response?: { status?: number } };
      // If endpoint doesn't exist (404) or other errors, return mock data
      if (err.response?.status === 404) {
        console.warn('Notifications endpoint not available, using mock data');
        // Mock notifications data
        return [
          {
            id: 1,
            title: "Arizangiz qabul qilindi",
            message: "Sizning yotoqxona uchun arizangiz muvaffaqiyatli qabul qilindi va ko'rib chiqilmoqda.",
            is_read: false,
            created_at: new Date().toISOString(),
            type: "application_update"
          },
          {
            id: 2,
            title: "Yangi yotoqxona qo'shildi",
            message: "Toshkent shahrida yangi yotoqxona mavjud. Ko'rib chiqishingiz mumkin.",
            is_read: false,
            created_at: new Date(Date.now() - 3600000).toISOString(), // 1 soat oldin
            type: "new_listing"
          },
          {
            id: 3,
            title: "Profilingizni to'ldiring",
            message: "To'liq profil ko'proq imkoniyatlar beradi. Profilingizni to'ldiring.",
            is_read: true,
            created_at: new Date(Date.now() - 86400000).toISOString(), // 1 kun oldin
            type: "profile_reminder"
          }
        ];
      }
      console.error('Notifications fetch error:', error);
      return []; // Return empty array for other errors
    }
  },

  // Mark notification as read
  markNotificationAsRead: async (notificationId: number): Promise<unknown> => {
    try {
      const response = await api.post('/notifications/mark-read/', {
        notification_id: notificationId
      });
      return response.data;
    } catch (error: unknown) {
      console.error('Mark notification as read error:', error);
      throw error;
    }
  },

};

export default api; 