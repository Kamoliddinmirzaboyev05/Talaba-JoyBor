import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { Application, StudentDashboard } from '../types';
import { sessionStore } from './sessionStore';

// API base URL — production JoyBor Django API
export const API_BASE_URL = 'https://api.joy-bor.uz/api';
export const API_ORIGIN = 'https://api.joy-bor.uz';
export const apiUrl = (path: string) => `${API_BASE_URL}/${path.replace(/^\/+/, '')}`;

/** API ba'zan http media URL qaytaradi */
export function mediaUrl(url?: string | null): string {
  if (!url) return '';
  if (url.startsWith('//')) return `https:${url}`;
  if (url.startsWith('http://api.joy-bor.uz')) return url.replace('http://', 'https://');
  if (url.startsWith('/')) return `${API_ORIGIN}${url}`;
  return url;
}

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const accessToken = sessionStore.getAccess();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    
    // Handle Content-Type based on data type
    if (config.data instanceof FormData) {
      // For FormData, delete Content-Type to let browser set it with boundary
      delete config.headers['Content-Type'];
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

let refreshInFlight: Promise<string | null> | null = null;

function refreshAccessToken(): Promise<string | null> {
  if (refreshInFlight) return refreshInFlight;
  refreshInFlight = (async () => {
    const refreshToken = sessionStore.getRefresh();
    if (!refreshToken) return null;
    const response = await axios.post(apiUrl('/token/refresh/'), { refresh: refreshToken });
    const access = response.data?.access as string | undefined;
    if (!access) return null;
    sessionStore.setAccess(access);
    return access;
  })().finally(() => {
    refreshInFlight = null;
  });
  return refreshInFlight;
}

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
        const access = await refreshAccessToken();
        if (access) {
          originalRequest.headers.Authorization = `Bearer ${access}`;
          return api(originalRequest);
        }
      } catch {
        sessionStore.clear();
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
      sessionStore.clear();
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
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
  phone: string;
  email?: string;
  password: string;
  password2: string;
  role?: string;
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
  user?: Partial<UserProfile> & { role?: string; id?: number };
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
  bio?: string;
  birth_date?: string;
  address?: string;
  telegram?: string;
}

// /profiles/ — talabaning to'liq (o'qish + to'lov) ma'lumoti, /me/dan farqli, faqat o'qish uchun
export interface StudentInfo {
  id?: number;
  name?: string | null;
  phone?: string | null;
  course?: string | null;
  faculty?: string | null;
  group?: string | null;
  province?: string | null;
  district?: string | null;
  address?: string | null;
  dormitory_id?: number | null;
  dormitory_name?: string | null;
  room_name?: string | null;
  is_active?: boolean;
  placement_status?: string | null;
  application_status?: string | null;
}

export interface PaymentSummary {
  total_payments: number;
  approved_payments: number;
  total_amount: number;
  last_payment_date: string | null;
  last_payment_amount: number;
  is_debtor: boolean;
  has_valid_payment: boolean;
}

export interface FullProfile {
  image?: string | null;
  address?: string | null;
  telegram?: string | null;
  student_info: StudentInfo | null;
  payment_summary: PaymentSummary | null;
}

// Shikoyat/taklif (student -> admin | superadmin)
export type ComplaintType = 'complaint' | 'suggestion';
export type ComplaintTargetRole = 'admin' | 'superadmin';
export type ComplaintCategory =
  | 'room'
  | 'food'
  | 'staff'
  | 'noise'
  | 'cleanliness'
  | 'wifi'
  | 'equipment'
  | 'security'
  | 'tariff'
  | 'system'
  | 'other';
export type ComplaintStatus = 'pending' | 'in_progress' | 'resolved' | 'rejected';

export interface Complaint {
  id: number;
  type: ComplaintType;
  type_display?: string;
  target_role: ComplaintTargetRole;
  target_role_display?: string;
  sender_role?: string;
  sender_role_display?: string;
  dormitory?: number | null;
  dormitory_name?: string | null;
  floor?: number | null;
  floor_name?: string | null;
  category?: ComplaintCategory | null;
  category_display?: string | null;
  title: string;
  description: string;
  image?: string | null;
  status: ComplaintStatus;
  status_display?: string;
  admin_response?: string | null;
  responded_by_username?: string | null;
  responded_at?: string | null;
  created_at: string;
  updated_at?: string;
}

// API functions
export const authAPI = {
  // Register user
  register: async (data: RegisterRequest): Promise<RegisterResponse> => {
    const response = await api.post('/register/', data);
    return response.data;
  },

  // Check username availability
  checkUsername: async (username: string): Promise<{ username: string; available: boolean; message: string }> => {
    const response = await api.post('/check-username/', { username });
    return response.data;
  },

  // Google Sign-In / Register
  googleAuth: async (token: string): Promise<LoginResponse> => {
    const response = await api.post('/auth/google/', { token });
    return response.data;
  },

  telegramWebAppAuth: async (initData: string): Promise<LoginResponse> => {
    const response = await api.post('/auth/telegram/webapp/', {
      init_data: initData,
      initData: initData,
    });
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

  // O'qish/to'lov ma'lumotlari (faqat o'qish uchun; tahrirlash /me/ orqali)
  getMyFullProfile: async (): Promise<FullProfile | null> => {
    const response = await api.get('/profiles/');
    const results = response.data?.results;
    return Array.isArray(results) && results.length > 0 ? results[0] : null;
  },

  // Update user profile
  updateProfile: async (data: Partial<UserProfile>): Promise<UserProfile> => {
    const response = await api.put('/me/', data);
    return response.data;
  },

  // Logout — client-side only (API da /logout/ yo'q; JWT blacklist yo'q)
  logout: async (): Promise<void> => {
    sessionStore.clear();
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
    gender: string;
    group?: string;
    phone?: string;  // string formatida (API da string)
    passport?: string;
    pinfl?: string;
    comment?: string;
    user_image?: File | null;
    document?: File | null;
    passport_image_first?: File | null;
    passport_image_second?: File | null;
  }): Promise<unknown> => {
    try {
      // Create FormData for file uploads
      const formData = new FormData();
      
      // API swagger: majburiy formData = gender, name, dormitory
      // user JWT dan bog'lanadi; yuborilsa ham xato bermasligi uchun saqlanadi
      if (applicationData.user) {
        formData.append('user', applicationData.user.toString());
      }
      formData.append('dormitory', applicationData.dormitory.toString());
      formData.append('name', applicationData.name.trim());
      if (applicationData.province) {
        formData.append('province', applicationData.province.toString());
      }
      if (applicationData.district) {
        formData.append('district', applicationData.district.toString());
      }
      if (applicationData.course?.trim()) {
        formData.append('course', applicationData.course.trim());
      }
      
      // 7. gender (string, required)
      formData.append('gender', applicationData.gender.trim());
      
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
      
      // jshshir (API field; UI da pinfl deb yuritiladi)
      if (applicationData.pinfl && applicationData.pinfl.trim()) {
        formData.append('jshshir', applicationData.pinfl.trim());
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
      
      // Send request
      const response = await api.post('/applications/create/', formData, {
        timeout: 30000, // 30 seconds timeout
      });
      
      return response.data;
    } catch (error: unknown) {
      throw error;
    }
  },

  // Get user applications
  getApplications: async (): Promise<Application[]> => {
    try {
      const response = await api.get('/student/application/');
      const payload = response.data;
      if (Array.isArray(payload)) return payload;
      if (payload && Array.isArray(payload.results)) return payload.results;
      if (payload && typeof payload === 'object' && payload.id != null) return [payload];
      return [];
    } catch (error: unknown) {
      const status = (error as { response?: { status?: number } })?.response?.status;
      // Backend ariza yo'qida 404 + "Sizning arizangiz topilmadi" qaytaradi
      if (status === 404) return [];
      throw error;
    }
  },

  // Get student dashboard data
  getStudentDashboard: async (): Promise<StudentDashboard> => {
    try {
      const response = await api.get('/student/dashboard/');
      return response.data;
    } catch (error: unknown) {
      throw error;
    }
  },

  // Get universities list
  getUniversities: async (): Promise<{ id: number; name: string }[]> => {
    const response = await api.get('/universities/');
    const data = response.data;
    if (Array.isArray(data)) return data;
    return data?.results || [];
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
    const response = await api.get('/stats/');
    const data = response.data || {};
    return {
      dormitories_count: Number(data.dormitories?.total) || 0,
      apartments_count: Number(data.apartments?.total) || 0,
      users_count: Number(data.users?.active) || Number(data.users?.total) || 0,
      applications_count: Number(data.applications?.total) || 0,
      universities_count: Number(data.universities?.total) || 0,
      rooms_total: Number(data.rooms?.total) || 0,
      rooms_occupied: Number(data.rooms?.occupied) || 0,
      rooms_free: Number(data.rooms?.free) || 0,
    };
  },

  // Get notifications
  getNotifications: async (): Promise<Notification[]> => {
    try {
      const response = await api.get('/notifications/');
      // DRF typically returns { count, next, previous, results } or just an array
      return response.data.results || response.data || [];
    } catch (error: unknown) {
      return [];
    }
  },

  // Mark notification as read
  markNotificationAsRead: async (notificationId: number): Promise<unknown> => {
    const response = await api.post('/notifications/mark-read/', { id: notificationId });
    return response.data;
  },

  // Mark all notifications as read
  markAllNotificationsAsRead: async (): Promise<unknown> => {
    const response = await api.post('/notifications/mark-all-read/', {});
    return response.data;
  },

  getUnreadCount: async (): Promise<{ count?: number; unread?: number } | number> => {
    const response = await api.get('/notifications/unread-count/');
    return response.data;
  },

  // Student-specific resources
  getStudentPayments: async (): Promise<unknown[]> => {
    const response = await api.get('/student/payments/');
    return response.data?.results || response.data || [];
  },

  getStudentAttendance: async (): Promise<unknown[]> => {
    const response = await api.get('/student/attendance/');
    return response.data?.results || response.data || [];
  },

  getStudentCollections: async (): Promise<unknown[]> => {
    const response = await api.get('/student/collections/');
    return response.data?.results || response.data || [];
  },

  getStudentRoommates: async (): Promise<unknown[]> => {
    const response = await api.get('/student/roommates/');
    return response.data?.results || response.data || [];
  },

  // Shikoyat/taklif: talaba -> admin (yotoqxona) yoki -> superadmin (platforma)
  getMyComplaints: async (params?: {
    search?: string;
    ordering?: string;
    type?: ComplaintType;
    target_role?: ComplaintTargetRole;
    status?: ComplaintStatus;
    category?: ComplaintCategory;
    page?: number;
  }): Promise<Complaint[]> => {
    const response = await api.get('/student/my-complaints/', { params });
    return response.data?.results || response.data || [];
  },

  sendComplaint: async (
    target: ComplaintTargetRole,
    data: {
      type: ComplaintType;
      category?: ComplaintCategory;
      title: string;
      description: string;
      floor?: number;
      image?: File | null;
    }
  ): Promise<Complaint> => {
    const formData = new FormData();
    formData.append('type', data.type);
    if (data.category) formData.append('category', data.category);
    formData.append('title', data.title);
    formData.append('description', data.description);
    if (data.floor != null) formData.append('floor', String(data.floor));
    if (data.image) formData.append('image', data.image);
    const path = target === 'admin' ? '/student/complaints/to-admin/' : '/student/complaints/to-superadmin/';
    const response = await api.post(path, formData);
    return response.data;
  },

  // Single dormitory
  getDormitory: async (id: number | string): Promise<unknown> => {
    const response = await api.get(`/dormitories/${id}/`);
    return response.data;
  },

  getApartment: async (id: number | string): Promise<unknown> => {
    const response = await api.get(`/apartments/${id}/`);
    return response.data;
  },

};

export default api;
