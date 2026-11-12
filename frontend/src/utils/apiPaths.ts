/**
 * API Endpoints dictionary
 */
export const API_PATHS = {
  // Auth
  AUTH: {
    LOGIN: '/api/auth/login',
    ZALO: '/api/auth/zalo',
    LOGOUT: '/api/auth/logout',
    ME: '/api/auth/me',
  },

  // Tours & Flights
  TOURS: {
    LIST: '/api/tours',
    DETAIL: (id: string) => `/api/tours/${id}`,
    SAVED: '/api/tours/saved',
    SAVE_TOGGLE: (id: string) => `/api/tours/${id}/save`,
  },

  // Departures & Flight Matrix
  DEPARTURES: {
    LIST: '/api/departures',
    BY_TOUR: (tourId: string) => `/api/tours/${tourId}/departures`,
    DETAIL: (id: string) => `/api/departures/${id}`,
    SEATS: (id: string) => `/api/departures/${id}/seats`,
  },

  // Destinations & Airports
  DESTINATIONS: {
    LIST: '/api/destinations',
    DETAIL: (id: string) => `/api/destinations/${id}`,
  },

  // Bookings
  BOOKINGS: {
    CREATE: '/api/bookings',
    LIST: '/api/bookings',
    MY_BOOKINGS: '/api/bookings/my',
    DETAIL: (id: string) => `/api/bookings/${id}`,
    CANCEL: (id: string) => `/api/bookings/${id}/cancel`,
    VERIFY_COUPON: '/api/coupons/verify',
  },

  // Articles & Airport Information
  ARTICLES: {
    LIST: '/api/articles',
    DETAIL: (slugOrId: string) => `/api/articles/${slugOrId}`,
  },

  // Admin Operations
  ADMIN: {
    DASHBOARD_STATS: '/api/admin/stats',
    BOOKINGS: '/api/admin/bookings',
    UPDATE_BOOKING_STATUS: (id: string) => `/api/admin/bookings/${id}/status`,
    TOURS: '/api/admin/tours',
    DEPARTURES: '/api/admin/departures',
    DESTINATIONS: '/api/admin/destinations',
    ARTICLES: '/api/admin/articles',
    COUPONS: '/api/admin/coupons',
    ACTIVITY_LOGS: '/api/admin/logs',
  },
};

export default API_PATHS;
