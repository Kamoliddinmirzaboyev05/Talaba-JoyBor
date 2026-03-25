export interface User {
  id: number;
  username?: string;
  first_name?: string;
  last_name?: string;
  name?: string;
  email: string;
  phone: string;
  university?: string;
  student_id?: string;
  studentId?: string;
  avatar?: string;
  image?: string;
  is_verified?: boolean;
  isVerified?: boolean;
  preferences?: {
    maxPrice: number;
    roomType: string;
    location: string;
    amenities: string[];
  };
  savedListings?: string[];
  applications?: Application[];
}

export interface Listing {
  id: string;
  title: string;
  type: 'dormitory';
  price: number;
  location: string;
  university: string;
  images: string[];
  amenities: string[];
  description: string;
  capacity: number;
  available_capacity?: number;
  available: boolean;
  rating: number;
  reviews: number;
  landlord?: {
    name: string;
    phone: string;
    email: string;
    verified: boolean;
    rating: number;
  };
  admin?: {
    name: string;
    phone?: string;
    email?: string;
  };
  features: {
    furnished: boolean;
    wifi: boolean;
    parking: boolean;
    security: boolean;
  };
  rules: string[];
  coordinates: {
    lat: number;
    lng: number;
  };
  room_statistics?: {
    total: {
      rooms: number;
      capacity: number;
      occupied: number;
      free: number;
      occupancy_rate: number;
    };
    male: { free: number };
    female: { free: number };
  };
  // Apartment uchun qo'shimcha maydonlar
  rooms?: number;
  available_rooms?: number;
  room_type?: string;
  gender?: string;
  owner?: string;
  phone_number?: string;
  user_phone_number?: string;
  province?: number;
  created_at?: string;
  is_active?: boolean;
}

export interface Dormitory {
  id: number;
  name: string;
  address: string;
  description: string;
  month_price: number;
  year_price: number;
  latitude: number;
  longitude: number;
  rating: number;
  is_active: boolean;
  distance?: number;
  link?: string;
  phone?: string;
  phone_number?: string;
  phone_numer?: string;
  // Room Statistics from API
  room_statistics?: {
    total: {
      rooms: number;
      capacity: number;
      occupied: number;
      free: number;
      occupancy_rate: number;
    };
    male: {
      rooms: number;
      capacity: number;
      occupied: number;
      free: number;
      occupancy_rate: number;
    };
    female: {
      rooms: number;
      capacity: number;
      occupied: number;
      free: number;
      occupancy_rate: number;
    };
    by_status: {
      available: number;
      partially_occupied: number;
      fully_occupied: number;
    };
  };
  // Direct fields from API
  university: number;  // University ID
  university_name: string;
  admin: number;  // Admin ID
  admin_name: string;
  // Arrays (can be empty)
  images: Array<{ id?: number; image: string } | string>;  // Array of image objects or URLs
  amenities: number[];  // Array of amenity IDs
  amenities_list: Array<{ id?: number; name: string; is_active?: boolean; type?: string }>;  // Array of amenity objects
  // Rules from API
  rules?: Array<{
    id: number;
    rule: string;
    dormitory: number;
  }>;
  // Optional fields for compatibility
  total_capacity?: number;
  available_capacity?: number;
  total_rooms?: number;
  distance_to_university?: number;
  province?: {
    id: number;
    name: string;
  };
  district?: {
    id: number;
    name: string;
    province: number;
  };
}

export interface DormitoryAPIResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Dormitory[];
}

export interface Application {
  id: number;
  user_info?: {
    id: number;
    username: string;
    role?: string;
    email?: string;
  };
  user?: {
    id: number;
    username: string;
    role?: string;
    email?: string;
  };
  dormitory_name?: string;
  province_name?: string;
  district_name?: string;
  dormitory?: {
    id: number;
    name: string;
    address?: string;
    description?: string;
    university?: {
      id?: number;
      name: string;
      address?: string;
      description?: string;
      contact?: string;
      logo?: string | null;
    };
    admin?: {
      id: number;
      username: string;
      role: string;
      email: string;
    };
    month_price?: number;
    year_price?: number;
    latitude?: number;
    longitude?: number;
    amenities?: Array<{
      id: number;
      name: string;
      is_active: boolean;
      type: string;
    }>;
    total_capacity?: number;
    available_capacity?: number;
    total_rooms?: number;
    distance_to_university?: number;
    rules?: string[];
    images?: Array<{
      id: number;
      dormitory?: {
        id: number;
        name: string;
      };
      image: string;
    }>;
  };
  name: string;
  last_name: string;
  middle_name?: string;
  fio?: string;
  city?: string;
  village?: string;
  university?: string;
  province?: {
    id: number;
    name: string;
  } | number;
  district?: {
    id: number;
    name: string;
    province?: number;
  } | number;
  faculty?: string;
  direction?: string;
  course?: string;
  group?: string;
  phone: string | number;
  passport?: string | number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'INTERVIEW' | 'COMPLETED' | 'Pending' | 'Approved' | 'Rejected';
  comment?: string;
  admin_comment?: string;
  document?: string;
  user_image?: string | null;
  passport_image_first?: string;
  passport_image_second?: string;
  created_at: string;
  updated_at?: string;
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: string;
  read: boolean;
  type: 'text' | 'image' | 'document';
}

export interface Conversation {
  id: string;
  participantId: string;
  participantName: string;
  participantAvatar?: string;
  lastMessage: Message;
  unreadCount: number;
  listingId?: string;
  listingTitle?: string;
}

export interface Notification {
  id: number;
  title: string;
  message: string;
  type: 'application' | 'message' | 'system' | 'reminder';
  timestamp: string;
  read: boolean;
  is_read?: boolean;
  actionUrl?: string;
  image?: string;
  priority?: 'low' | 'medium' | 'high';
}

export interface StudentDashboard {
  id: number;
  user_info: {
    id: number;
    username: string;
    role: string;
    email: string;
  };
  dormitory_info: {
    id: number;
    name: string;
    address: string;
    month_price: number;
    year_price: number;
  };
  floor_info: {
    id: number;
    name: string;
    gender: string;
  };
  room_info: {
    id: number;
    name: string;
    capacity: number;
    current_occupancy: number;
    status: string;
  };
  roommates: Array<{
    id: number;
    name: string;
    last_name: string;
    middle_name: string;
    course: string;
    faculty: string;
    phone: string;
    picture: string;
  }>;
  recent_payments: Array<{
    id: number;
    student_info: {
      id: number;
      name: string;
      course: string;
      group: string;
      room_name: string;
      floor_name: string;
    };
    student: number;
    dormitory: number;
    dormitory_name: string;
    amount: number;
    paid_date: string;
    valid_until: string | null;
    method: string;
    status: string;
    comment: string;
  }>;
  application_info: {
    id: number;
    status: string;
    created_at: string;
    admin_comment: string;
    dormitory_name: string;
  };
  province_name: string;
  district_name: string;
  name: string;
  last_name: string;
  middle_name: string;
  faculty: string;
  direction: string;
  passport: string;
  group: string;
  course: string;
  gender: string;
  phone: string;
  picture: string;
  passport_image_first: string;
  passport_image_second: string;
  document: string;
  privilege: boolean;
  privilege_share: number;
  accepted_date: string;
  status: string;
  placement_status: string;
  is_active: boolean;
  user: number;
  province: number;
  district: number;
  dormitory: number;
  floor: number;
  room: number;
}

