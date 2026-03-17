export enum CarStatus {
  AVAILABLE = 'available',
  RENTED = 'rented',
  MAINTENANCE = 'maintenance'
}

export enum BookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed'
}

export interface Car {
  id: string;
  make: string;
  model: string;
  year: number;
  category: string;
  pricePerDay: number;
  transmission: string;
  fuelType: string;
  seats: number;
  imageUrl: string;
  status: CarStatus;
  description: string;
  features: string[];
}

export interface Booking {
  id: string;
  carId: string;
  userId: string;
  userEmail?: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  status: BookingStatus;
  createdAt: string;
}

export interface UserProfile {
  uid: string;
  email: string;
  username: string;
  displayName: string;
  photoURL?: string;
  role: 'user' | 'admin';
  phoneNumber?: string;
  bio?: string;
}
