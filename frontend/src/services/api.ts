import axiosInstance from '../utils/axiosInstance';
import { API_PATHS } from '../utils/apiPaths';
import apiCache from './apiCache';
export { apiCache };
import { 
  Tour, 
  Departure, 
  Destination, 
  Booking, 
  User, 
  Article, 
  Coupon, 
  Airline,
  ApiResponse 
} from '../types';

/**
 * Enterprise API Service connecting Frontend to ASP.NET Core & PostgreSQL Backend
 * Enhanced with Swiss Modernism 2.0 In-Memory Caching & Request Deduplication
 */

export const authApi = {
  login: async (email: string, password: string = 'password'): Promise<ApiResponse<{ token: string; user: User }>> => {
    const res = await axiosInstance.post<ApiResponse<{ token: string; user: User }>>(API_PATHS.AUTH.LOGIN, {
      email,
      password,
    });
    return res.data;
  },

  register: async (data: { username: string; email: string; password: string; fullName: string; phone?: string; role?: string }): Promise<ApiResponse<{ token: string; user: User }>> => {
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
    const cacheKey = `tours:list:${JSON.stringify(params || {})}`;
    return apiCache.fetchWithCache(cacheKey, async () => {
      const res = await axiosInstance.get<ApiResponse<Tour[]>>(API_PATHS.TOURS.LIST, { params });
      return res.data;
    }, 45_000);
  },

  getById: async (id: string): Promise<ApiResponse<Tour>> => {
    return apiCache.fetchWithCache(`tours:detail:${id}`, async () => {
      const res = await axiosInstance.get<ApiResponse<Tour>>(API_PATHS.TOURS.DETAIL(id));
      return res.data;
    }, 60_000);
  },

  getDepartures: async (tourId: string): Promise<ApiResponse<Departure[]>> => {
    return apiCache.fetchWithCache(`tours:departures:${tourId}`, async () => {
      const res = await axiosInstance.get<ApiResponse<Departure[]>>(API_PATHS.DEPARTURES.BY_TOUR(tourId));
      return res.data;
    }, 30_000);
  },

  toggleSave: async (tourId: string): Promise<ApiResponse<boolean>> => {
    const res = await axiosInstance.post<ApiResponse<boolean>>(API_PATHS.TOURS.SAVE_TOGGLE(tourId));
    apiCache.invalidate('tours:');
    return res.data;
  },

  getSaved: async (): Promise<ApiResponse<Tour[]>> => {
    return apiCache.fetchWithCache('tours:saved', async () => {
      const res = await axiosInstance.get<ApiResponse<Tour[]>>(API_PATHS.TOURS.SAVED);
      return res.data;
    }, 15_000);
  },

  create: async (data: Partial<Tour>): Promise<ApiResponse<Tour>> => {
    const res = await axiosInstance.post<ApiResponse<Tour>>(API_PATHS.TOURS.LIST, data);
    apiCache.invalidate('tours:');
    return res.data;
  },

  update: async (id: string | number, data: Partial<Tour>): Promise<ApiResponse<Tour>> => {
    const res = await axiosInstance.put<ApiResponse<Tour>>(`/api/tours/${id}`, data);
    apiCache.invalidate('tours:');
    return res.data;
  },

  delete: async (id: string | number): Promise<ApiResponse<boolean>> => {
    const res = await axiosInstance.delete<ApiResponse<boolean>>(`/api/tours/${id}`);
    apiCache.invalidate('tours:');
    return res.data;
  },
};

export const destinationApi = {
  getAll: async (): Promise<ApiResponse<Destination[]>> => {
    return apiCache.fetchWithCache('destinations:list', async () => {
      const res = await axiosInstance.get<ApiResponse<Destination[]>>(API_PATHS.DESTINATIONS.LIST);
      return res.data;
    }, 120_000);
  },

  getById: async (id: string): Promise<ApiResponse<Destination>> => {
    return apiCache.fetchWithCache(`destinations:detail:${id}`, async () => {
      const res = await axiosInstance.get<ApiResponse<Destination>>(API_PATHS.DESTINATIONS.DETAIL(id));
      return res.data;
    }, 120_000);
  },
};

export const bookingApi = {
  create: async (bookingData: any): Promise<ApiResponse<Booking>> => {
    const res = await axiosInstance.post<ApiResponse<Booking>>(API_PATHS.BOOKINGS.CREATE, bookingData);
    apiCache.invalidate('bookings:');
    return res.data;
  },

  getAll: async (): Promise<ApiResponse<Booking[]>> => {
    return apiCache.fetchWithCache('bookings:all', async () => {
      const res = await axiosInstance.get<ApiResponse<Booking[]>>(API_PATHS.BOOKINGS.LIST);
      return res.data;
    }, 10_000);
  },

  getMyBookings: async (): Promise<ApiResponse<Booking[]>> => {
    return apiCache.fetchWithCache('bookings:my', async () => {
      const res = await axiosInstance.get<ApiResponse<Booking[]>>(API_PATHS.BOOKINGS.MY_BOOKINGS);
      return res.data;
    }, 15_000);
  },

  getByReference: async (referenceOrId: string): Promise<ApiResponse<Booking>> => {
    return apiCache.fetchWithCache(`bookings:detail:${referenceOrId}`, async () => {
      const res = await axiosInstance.get<ApiResponse<Booking>>(API_PATHS.BOOKINGS.DETAIL(referenceOrId));
      return res.data;
    }, 15_000);
  },

  cancel: async (id: string, reason?: string): Promise<ApiResponse<boolean>> => {
    const res = await axiosInstance.post<ApiResponse<boolean>>(API_PATHS.BOOKINGS.CANCEL(id), { reason });
    apiCache.invalidate('bookings:');
    return res.data;
  },

  updateStatus: async (id: string, status: Booking['status']): Promise<ApiResponse<boolean>> => {
    const res = await axiosInstance.patch<ApiResponse<boolean>>(`/api/bookings/${id}/status`, { status });
    apiCache.invalidate('bookings:');
    return res.data;
  },
};

export const airlineApi = {
  getAll: async (): Promise<ApiResponse<Airline[]>> => {
    return apiCache.fetchWithCache('airlines:list', async () => {
      const res = await axiosInstance.get<ApiResponse<Airline[]>>('/api/airlines');
      return res.data;
    }, 120_000);
  },

  getById: async (id: string | number): Promise<ApiResponse<Airline>> => {
    return apiCache.fetchWithCache(`airlines:detail:${id}`, async () => {
      const res = await axiosInstance.get<ApiResponse<Airline>>(`/api/airlines/${id}`);
      return res.data;
    }, 120_000);
  },

  create: async (data: Partial<Airline>): Promise<ApiResponse<Airline>> => {
    const res = await axiosInstance.post<ApiResponse<Airline>>('/api/airlines', data);
    apiCache.invalidate('airlines:');
    return res.data;
  },

  update: async (id: string | number, data: Partial<Airline>): Promise<ApiResponse<Airline>> => {
    const res = await axiosInstance.put<ApiResponse<Airline>>(`/api/airlines/${id}`, data);
    apiCache.invalidate('airlines:');
    return res.data;
  },

  delete: async (id: string | number): Promise<ApiResponse<boolean>> => {
    const res = await axiosInstance.delete<ApiResponse<boolean>>(`/api/airlines/${id}`);
    apiCache.invalidate('airlines:');
    return res.data;
  },
};

export const userApi = {
  getAll: async (): Promise<ApiResponse<User[]>> => {
    const res = await axiosInstance.get<ApiResponse<User[]>>('/api/users');
    return res.data;
  },

  updateRole: async (id: string | number, role: string): Promise<ApiResponse<boolean>> => {
    const res = await axiosInstance.patch<ApiResponse<boolean>>(`/api/users/${id}/role`, { status: role });
    return res.data;
  },

  delete: async (id: string | number): Promise<ApiResponse<boolean>> => {
    const res = await axiosInstance.delete<ApiResponse<boolean>>(`/api/users/${id}`);
    return res.data;
  },

  updateProfile: async (idOrEmail: string | number, data: Partial<User>): Promise<ApiResponse<User>> => {
    const res = await axiosInstance.put<ApiResponse<User>>(`/api/users/${idOrEmail}/profile`, data);
    return res.data;
  },

  updateAvatar: async (idOrEmail: string | number, avatarUrl: string): Promise<ApiResponse<User>> => {
    const res = await axiosInstance.put<ApiResponse<User>>(`/api/users/${idOrEmail}/avatar`, { avatarUrl });
    return res.data;
  },
};

export const couponApi = {
  verify: async (code: string, totalAmount: number): Promise<ApiResponse<{ valid: boolean; discountAmount: number; message: string }>> => {
    const res = await axiosInstance.post(API_PATHS.BOOKINGS.VERIFY_COUPON, { code, totalAmount });
    return res.data;
  },

  getAll: async (): Promise<ApiResponse<Coupon[]>> => {
    return apiCache.fetchWithCache('coupons:list', async () => {
      const res = await axiosInstance.get<ApiResponse<Coupon[]>>('/api/coupons');
      return res.data;
    }, 60_000);
  },
};

export const articleApi = {
  getAll: async (category?: string): Promise<ApiResponse<Article[]>> => {
    const cacheKey = `articles:list:${category || 'all'}`;
    return apiCache.fetchWithCache(cacheKey, async () => {
      const res = await axiosInstance.get<ApiResponse<Article[]>>(API_PATHS.ARTICLES.LIST, { params: { category } });
      return res.data;
    }, 120_000);
  },

  getBySlugOrId: async (slugOrId: string): Promise<ApiResponse<Article>> => {
    return apiCache.fetchWithCache(`articles:detail:${slugOrId}`, async () => {
      const res = await axiosInstance.get<ApiResponse<Article>>(API_PATHS.ARTICLES.DETAIL(slugOrId));
      return res.data;
    }, 120_000);
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
