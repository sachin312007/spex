export interface FoodItem {
  id: string;
  name: string;
  description: string;
  rating: number;
  reviewCount: number;
  price: number;
  category: 'Pizza' | 'Burger' | 'Biryani' | 'Chinese' | 'North Indian' | 'South Indian' | 'Desserts' | 'Beverages' | 'Snacks' | 'Combo';
  tags: string[];
  prepTime: number; // in mins
  calories: number;
  image: string;
  isBestSeller?: boolean;
  isTrending?: boolean;
  isChefSpecial?: boolean;
  isMostLoved?: boolean;
  isAvailable: boolean;
}

export interface AddOn {
  id: string;
  name: string;
  price: number;
}

export interface CartItem {
  foodId: string;
  quantity: number;
  deliveryNotes?: string;
  savedForLater?: boolean;
  selectedAddOns?: AddOn[];
}

export interface Review {
  id: string;
  foodId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  date: string;
  images?: string[];
  isVerified: boolean;
  likes: number;
}

export interface Coupon {
  code: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderValue: number;
  maxDiscount?: number;
  expiresAt: string;
}

export interface Address {
  id: string;
  type: 'Home' | 'Work' | 'Other';
  addressLine1: string;
  addressLine2?: string;
  city: string;
  zipCode: string;
  isDefault: boolean;
  locality?: string;
  state?: string;
  lat?: number;
  lng?: number;
  landmark?: string;
}

export type OrderStatus = 'Order Placed' | 'Confirmed' | 'Preparing' | 'Cooking' | 'Packed' | 'Out For Delivery' | 'Delivered';

export interface OrderItem {
  foodId: string;
  quantity: number;
  priceAtOrder: number;
  nameAtOrder: string;
  selectedAddOns?: AddOn[];
}

export interface Order {
  id: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  deliveryFee: number;
  tax: number;
  total: number;
  couponApplied?: string;
  status: OrderStatus;
  paymentMethod: string;
  paymentStatus: 'Pending' | 'Paid';
  deliveryAddress: Address;
  deliveryNotes?: string;
  createdAt: string;
  estimatedDeliveryTime: string; // ISO string or human format
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  joinedDate: string;
  loyaltyPoints: number;
  loyaltyTier: 'Silver' | 'Gold' | 'Platinum';
  avatar?: string;
  isAdmin?: boolean;
  role?: 'Admin' | 'User';
}

export interface Reservation {
  id: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  seatingArea: string;
  specialRequests?: string;
  status: 'Confirmed' | 'Cancelled';
  createdAt: string;
}

