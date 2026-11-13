export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  role: 'TRAVELER' | 'TOUR_OPERATOR' | 'ADMIN' | 'USER' | 'DISPATCHER' | 'MANAGER';
  zaloId?: string;
  createdAt: string;
}

export interface Destination {
  id: string;
  code: string; // e.g., 'DAD', 'SGN', 'HAN', 'JFK', 'NRT'
  name: string;
  city: string;
  country: string;
  airportCode: string;
  airportName: string;
  imageUrl: string;
  description: string;
  climate?: string;
  bestTimeToVisit?: string;
  popularToursCount?: number;
}

export interface ItineraryDay {
  dayNumber: number;
  title: string;
  description: string;
  activities: string[];
  meals?: string;
  stay?: string;
}

export interface Tour {
  id: string;
  code: string; // e.g., "VN-DAD-01"
  title: string;
  subtitle: string;
  destinationId?: string;
  destinationCode?: string;
  destinationName: string;
  price: number;
  originalPrice?: number;
  durationDays: number;
  durationNights: number;
  departureCity: string;
  transportType: 'FLIGHT' | 'COMBO_AIR_HOTEL' | 'CHARTER' | 'FLIGHT_EXCLUSIVE';
  airlineCode?: string;
  airlineName?: string;
  featuredImage: string;
  galleryImages: string[];
  highlights: string[];
  itinerary: ItineraryDay[];
  rating: number;
  reviewsCount: number;
  isSaved?: boolean;
  status: 'ACTIVE' | 'DRAFT' | 'SOLD_OUT';
  operatorId?: number;
  baggagePolicy?: string;
  cancellationPolicy?: string;
  inclusions?: string[];
  exclusions?: string[];
}

export interface Departure {
  id: string;
  tourId: string;
  flightNumber: string; // e.g., "VN-124"
  departureAirport: string; // "SGN"
  arrivalAirport: string; // "DAD"
  departureTime: string; // ISO date string
  arrivalTime: string;
  seatsAvailable: number;
  totalSeats: number;
  price: number;
  aircraftModel?: string; // "Airbus A350-900"
  terminal?: string;
  gate?: string;
  status: 'ON_TIME' | 'DELAYED' | 'BOARDING' | 'CANCELLED';
}

export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'PAID' | 'COMPLETED' | 'CANCELLED';

export interface PassengerInfo {
  fullName: string;
  idNumber?: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  passengerType: 'ADULT' | 'CHILD' | 'INFANT';
  selectedSeat?: string;
}

export interface Booking {
  id: string;
  bookingCode: string; // e.g., "BK-2026-8849"
  tourId: string;
  tourTitle: string;
  departureId: string;
  departureTime: string;
  returnTime?: string;
  route: string; // "SGN -> DAD"
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerZalo?: string;
  passengers: PassengerInfo[];
  adultsCount: number;
  childrenCount: number;
  totalPrice: number;
  discountAmount?: number;
  couponCode?: string;
  baggagePackage?: string;
  baggageFee?: number;
  refundAmount?: number;
  cancellationReason?: string;
  cancellationDate?: string;
  paymentMethod: 'ZALO_PAY' | 'BANK_TRANSFER' | 'CREDIT_CARD' | 'AIRPORT_COUNTER';
  status: BookingStatus;
  notes?: string;
  createdAt: string;
}

export interface BookingDraft {
  tourId: string;
  tour?: Tour;
  departureId?: string;
  departure?: Departure;
  adultsCount: number;
  childrenCount: number;
  selectedSeats: string[];
  baggagePackage?: string;
  baggageFee?: number;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  notes?: string;
  couponCode?: string;
  discount: number;
}

export interface Airline {
  id: number;
  code: string;
  name: string;
  country?: string;
  logoUrl?: string;
  isActive: boolean;
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  summary: string;
  content: string;
  coverImage: string;
  author: string;
  authorRole?: string;
  publishedAt: string;
  category: 'AIRPORT_GUIDE' | 'DESTINATION' | 'FLIGHT_TIPS' | 'NEWS';
  readTimeMinutes: number;
  tags: string[];
}

export interface Coupon {
  id: string;
  code: string;
  description: string;
  discountPercent?: number;
  discountAmount?: number;
  minSpend: number;
  maxDiscount?: number;
  validUntil: string;
  usageCount: number;
  isActive: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  total?: number;
}
