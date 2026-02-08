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
  // Direct fields from API
  university: number;  // University ID
  university_name: string;
  admin: number;  // Admin ID
  admin_name: string;
  // Arrays (can be empty)
  images: Array<{ id?: number; image: string } | string>;  // Array of image objects or URLs
  amenities: number[];  // Array of amenity IDs
  amenities_list: Array<{ id?: number; name: string; is_active?: boolean; type?: string }>;  // Array of amenity objects
  // Optional fields for compatibility
  total_capacity?: number;
  available_capacity?: number;
  total_rooms?: number;
  distance_to_university?: number;
  rules?: string[];
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
  actionUrl?: string;
  image?: string;
  priority?: 'low' | 'medium' | 'high';
}

