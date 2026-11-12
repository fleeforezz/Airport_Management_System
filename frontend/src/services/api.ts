import axiosInstance from '../utils/axiosInstance';
import { API_PATHS } from '../utils/apiPaths';
import { 
  Tour, 
  Departure, 
  Destination, 
  Booking, 
  User, 
  Article, 
  Coupon, 
  ApiResponse 
} from '../types';

/**
 * Enterprise API Service connecting Frontend to ASP.NET Core & PostgreSQL Backend
 */

export const authApi = {
  login: async (email: string, password: string = 'password'): Promise<ApiResponse<{ token: string; user: User }>> => {
    const res = await axiosInstance.post<ApiResponse<{ token: string; user: User }>>(API_PATHS.AUTH.LOGIN, {
      email,
      password,
    });
    return res.data;
  },

  register: async (data: { username: string; email: string; password: string; fullName: string; phone?: string }): Promise<ApiResponse<{ token: string; user: User }>> => {
    const res = await axiosInstance.post<ApiResponse<{ token: string; user: User }>>('/api/auth/register', data);
    return res.data;
  },

  getMe: async (): Promise<ApiResponse<User>> => {
    const res = await axiosInstance.get<ApiResponse<User>>(API_PATHS.AUTH.ME);
    return res.data;
  },
};

export const flightApi = {
  getAll: async (params?: { origin?: string; destination?: string; date?: string }): Promise<ApiResponse<Departure[]>> => {
    const res = await axiosInstance.get<ApiResponse<Departure[]>>(API_PATHS.DEPARTURES.LIST, { params });
    return res.data;
  },

  getById: async (id: string): Promise<ApiResponse<Departure>> => {
    const res = await axiosInstance.get<ApiResponse<Departure>>(API_PATHS.DEPARTURES.DETAIL(id));
    return res.data;
  },

  getSeats: async (flightId: string): Promise<ApiResponse<Array<{ id: string; seatNumber: string; travelClass: string; isExitRow: boolean; isOccupied: boolean; priceModifier: number }>>> => {
    const res = await axiosInstance.get(API_PATHS.DEPARTURES.SEATS(flightId));
    return res.data;
  },

  updateStatus: async (flightId: string, status: Departure['status']): Promise<ApiResponse<boolean>> => {
    const res = await axiosInstance.patch(`/api/departures/${flightId}/status`, { status });
    return res.data;
  },
};

export const tourApi = {
  getAll: async (params?: { search?: string; destinationId?: string }): Promise<ApiResponse<Tour[]>> => {
    const res = await axiosInstance.get<ApiResponse<Tour[]>>(API_PATHS.TOURS.LIST, { params });
    return res.data;
  },

  getById: async (id: string): Promise<ApiResponse<Tour>> => {
    const res = await axiosInstance.get<ApiResponse<Tour>>(API_PATHS.TOURS.DETAIL(id));
    return res.data;
  },

  getDepartures: async (tourId: string): Promise<ApiResponse<Departure[]>> => {
    const res = await axiosInstance.get<ApiResponse<Departure[]>>(API_PATHS.DEPARTURES.BY_TOUR(tourId));
    return res.data;
  },

  toggleSave: async (tourId: string): Promise<ApiResponse<boolean>> => {
    const res = await axiosInstance.post<ApiResponse<boolean>>(API_PATHS.TOURS.SAVE_TOGGLE(tourId));
    return res.data;
  },

  getSaved: async (): Promise<ApiResponse<Tour[]>> => {
    const res = await axiosInstance.get<ApiResponse<Tour[]>>(API_PATHS.TOURS.SAVED);
    return res.data;
  },
};

export const destinationApi = {
  getAll: async (): Promise<ApiResponse<Destination[]>> => {
    const res = await axiosInstance.get<ApiResponse<Destination[]>>(API_PATHS.DESTINATIONS.LIST);
    return res.data;
  },

  getById: async (id: string): Promise<ApiResponse<Destination>> => {
    const res = await axiosInstance.get<ApiResponse<Destination>>(API_PATHS.DESTINATIONS.DETAIL(id));
    return res.data;
  },
};

export const bookingApi = {
  create: async (bookingData: any): Promise<ApiResponse<Booking>> => {
    const res = await axiosInstance.post<ApiResponse<Booking>>(API_PATHS.BOOKINGS.CREATE, bookingData);
    return res.data;
  },

  getAll: async (): Promise<ApiResponse<Booking[]>> => {
    const res = await axiosInstance.get<ApiResponse<Booking[]>>(API_PATHS.BOOKINGS.LIST);
    return res.data;
  },

  getMyBookings: async (): Promise<ApiResponse<Booking[]>> => {
    const res = await axiosInstance.get<ApiResponse<Booking[]>>(API_PATHS.BOOKINGS.MY_BOOKINGS);
    return res.data;
  },

  getByReference: async (referenceOrId: string): Promise<ApiResponse<Booking>> => {
    const res = await axiosInstance.get<ApiResponse<Booking>>(API_PATHS.BOOKINGS.DETAIL(referenceOrId));
    return res.data;
  },

  cancel: async (id: string): Promise<ApiResponse<boolean>> => {
    const res = await axiosInstance.post<ApiResponse<boolean>>(API_PATHS.BOOKINGS.CANCEL(id));
    return res.data;
  },

  updateStatus: async (id: string, status: Booking['status']): Promise<ApiResponse<boolean>> => {
    const res = await axiosInstance.patch<ApiResponse<boolean>>(`/api/bookings/${id}/status`, { status });
    return res.data;
  },
};

export const couponApi = {
  verify: async (code: string, totalAmount: number): Promise<ApiResponse<{ valid: boolean; discountAmount: number; message: string }>> => {
    const res = await axiosInstance.post(API_PATHS.BOOKINGS.VERIFY_COUPON, { code, totalAmount });
    return res.data;
  },

  getAll: async (): Promise<ApiResponse<Coupon[]>> => {
    const res = await axiosInstance.get<ApiResponse<Coupon[]>>('/api/coupons');
    return res.data;
  },
};

export const articleApi = {
  getAll: async (category?: string): Promise<ApiResponse<Article[]>> => {
    const res = await axiosInstance.get<ApiResponse<Article[]>>(API_PATHS.ARTICLES.LIST, { params: { category } });
    return res.data;
  },

  getBySlugOrId: async (slugOrId: string): Promise<ApiResponse<Article>> => {
    const res = await axiosInstance.get<ApiResponse<Article>>(API_PATHS.ARTICLES.DETAIL(slugOrId));
    return res.data;
  },
};

export const adminApi = {
  getStats: async (): Promise<ApiResponse<any>> => {
    const res = await axiosInstance.get<ApiResponse<any>>(API_PATHS.ADMIN.DASHBOARD_STATS);
    return res.data;
  },

  getBookings: async (): Promise<ApiResponse<Booking[]>> => {
    const res = await axiosInstance.get<ApiResponse<Booking[]>>(API_PATHS.ADMIN.BOOKINGS);
    return res.data;
  },

  updateBookingStatus: async (id: string, status: Booking['status']): Promise<ApiResponse<boolean>> => {
    const res = await axiosInstance.patch<ApiResponse<boolean>>(API_PATHS.ADMIN.UPDATE_BOOKING_STATUS(id), { status });
    return res.data;
  },

  getDepartures: async (): Promise<ApiResponse<Departure[]>> => {
    const res = await axiosInstance.get<ApiResponse<Departure[]>>(API_PATHS.ADMIN.DEPARTURES);
    return res.data;
  },
};
