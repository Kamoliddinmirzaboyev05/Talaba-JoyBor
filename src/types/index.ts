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
  type: 'dormitory' | 'rental';
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
  university: {
    id: number;
    name: string;
    address: string;
    description: string;
    contact: string;
    logo: string | null;
  };
  admin: {
    id: number;
    username: string;
    role: string;
    email: string;
  };
  name: string;
  address: string;
  description: string;
  images: {
    id: number;
    dormitory: {
      id: number;
      name: string;
    };
    image: string;
  }[];
  month_price: number;
  year_price: number;
  latitude: number;
  longitude: number;
  amenities: {
    id: number;
    name: string;
    is_active: boolean;
    type: string;
  }[];
  total_capacity: number;
  available_capacity: number;
  total_rooms: number;
  distance_to_university: number;
  rules: string[];
  // Add province and district for filtering
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

export interface Application {
  id: number;
  user: {
    id: number;
    username: string;
  };
  dormitory: {
    id: number;
    name: string;
    address?: string;
    description?: string;
    university?: {
      name: string;
    };
    month_price?: number;
    total_capacity?: number;
    available_capacity?: number;
    images?: Array<{
      id: number;
      image: string;
    }>;
  };
  name: string;
  last_name: string;
  middle_name?: string;
  province: {
    id: number;
    name: string;
  };
  district: {
    id: number;
    name: string;
    province: number;
  };
  faculty: string;
  direction?: string;
  course: string;
  group?: string;
  phone: number;
  passport?: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'INTERVIEW' | 'COMPLETED';
  comment: string;
  admin_comment?: string;
  document?: string;
  user_image?: string;
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

export interface APINotificationItem {
  id: number; // user-notification id
  notification: {
    id: number;
    message: string;
    image: string | null;
    image_url: string | null;
    target_type: string; // e.g., all_students
    target_user: number | null;
    created_at: string;
    is_active: boolean;
  };
  is_read: boolean;
  received_at: string;
}

export interface APINotificationLegacy { // keep legacy for compatibility if backend changes
  id: number;
  title?: string;
  message: string;
  type?: string;
  created_at: string;
  is_read: boolean;
  action_url?: string;
}