export type UserRole = 'customer' | 'organiser';

export interface CompanyProfile {
  companyName: string;
  description: string;
  experience: number; // in years
  address: string;
  logo: string;
  gallery: string[];
  reviews: Review[];
  rating: number;
}

export interface User {
  id: string;
  name: string;
  emailOrMobile: string;
  role: UserRole;
  avatar?: string;
  password?: string;
  savedServices: string[]; // List of service IDs
  companyProfile?: CompanyProfile; // Set if role is 'organiser'
  mobile?: string;
  email?: string;
  address?: string;
}

export type ServiceCategory = 'organiser' | 'planner' | 'caterer' | 'cameraman';

export interface Review {
  id: string;
  reviewerName: string;
  reviewerAvatar?: string;
  rating: number; // 1-5
  comment: string;
  date: string;
  images?: string[];
}

export interface Service {
  id: string;
  providerId: string; // User ID of the organiser
  providerName: string;
  providerAvatar?: string;
  category: ServiceCategory;
  title: string;
  description: string;
  coverImage: string;
  price: number;
  pricingUnit: string; // e.g., "per event", "per plate", "per day", "package"
  portfolio: string[];
  reviews: Review[];
  rating: number;
  experience: number; // years
  location: string;
  availability: string[]; // e.g., ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
  // Category-specific details
  specs?: {
    decorOptions?: string[]; // Planners
    menuCategories?: string[]; // Caterers
    capacityLimit?: number; // Caterers
    cameraEquipment?: string[]; // Cameraman
    packagesIncluded?: string[]; // Planners / Cameraman
  };
}

export type BookingStatus = 'pending' | 'accepted' | 'rejected' | 'completed';
export type PaymentStatus = 'unpaid' | 'paid' | 'refunded';
export type PaymentMethod = 'upi' | 'card' | 'netbanking' | 'wallet';

export interface Booking {
  id: string;
  serviceId: string;
  serviceTitle: string;
  serviceCategory: ServiceCategory;
  coverImage: string;
  providerId: string;
  providerName: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerMobile: string;
  date: string;
  price: number;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  paymentMethod?: PaymentMethod;
  paymentDetails?: {
    txId: string;
    date: string;
    invoiceNo: string;
  };
  reviewLeft?: boolean;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  date: string;
  type: 'info' | 'booking' | 'payment';
  read: boolean;
}
