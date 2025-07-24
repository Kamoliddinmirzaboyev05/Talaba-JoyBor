export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  university: string;
  studentId?: string;
  avatar?: string;
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
}

export interface Application {
  id: string;
  user: number;
  dormitory: number;
  room: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'INTERVIEW' | 'COMPLETED';
  comment: string;
  name: string;
  fio: string;
  city: string;
  village: string;
  university: string;
  phone: number;
  passport: number;
  submittedAt?: string;
  updatedAt?: string;
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
  id: string;
  title: string;
  message: string;
  type: 'application' | 'message' | 'system' | 'reminder';
  timestamp: string;
  read: boolean;
  actionUrl?: string;
}