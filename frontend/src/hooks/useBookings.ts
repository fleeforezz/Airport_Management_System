import { useState, useEffect, useMemo, useCallback } from 'react';
import { Booking } from '../types';
import { bookingApi } from '../services/api';
import { useAuth } from '../context/AuthContext';

const LOCAL_BOOKINGS_KEY = 'aeroflight_local_bookings';

export const getLocalBookingsFromStorage = (): Booking[] => {
  try {
    const raw = localStorage.getItem(LOCAL_BOOKINGS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const saveLocalBookingsToStorage = (bookings: Booking[]) => {
  try {
    localStorage.setItem(LOCAL_BOOKINGS_KEY, JSON.stringify(bookings));
  } catch {
    // LocalStorage quota or access error handling
  }
};

export function useBookings() {
  const { user } = useAuth();
  const [allBookings, setAllBookings] = useState<Booking[]>(() => {
    return getLocalBookingsFromStorage();
  });
  const [isLoading, setIsLoading] = useState(false);

  const fetchBookings = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await bookingApi.getAll();
      if (res.success && res.data) {
        setAllBookings(res.data);
      }
    } catch {
      // Keep existing local bookings if API has transient failure
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  // Synchronize across components via custom event
  useEffect(() => {
    const handleBookingsUpdate = () => {
      const local = getLocalBookingsFromStorage();
      setAllBookings((prev) => {
        const merged = [...local];
        for (const b of prev) {
          if (!merged.some((m) => m.id === b.id || m.bookingCode === b.bookingCode)) {
            merged.push(b);
          }
        }
        return merged;
      });
    };

    window.addEventListener('aeroflight_bookings_updated', handleBookingsUpdate);
    window.addEventListener('storage', handleBookingsUpdate);
    return () => {
      window.removeEventListener('aeroflight_bookings_updated', handleBookingsUpdate);
      window.removeEventListener('storage', handleBookingsUpdate);
    };
  }, []);

  // Filter bookings for the logged-in user (or all if admin/operator)
  const bookings = useMemo(() => {
    if (!user) return [];
    if (user.role === 'ADMIN' || user.role === 'TOUR_OPERATOR') {
      return allBookings;
    }
    const cleanEmail = (user.email || '').toLowerCase().trim();
    const cleanName = (user.name || '').toLowerCase().trim();
    const matches = allBookings.filter(b => 
      (b.customerEmail && b.customerEmail.toLowerCase().trim() === cleanEmail) ||
      (b.customerName && cleanName && b.customerName.toLowerCase().trim().includes(cleanName))
    );
    return matches;
  }, [allBookings, user]);

  const getBookingById = (id: string): Booking | undefined => {
    return allBookings.find((b) => b.id === id || b.bookingCode === id);
  };

  const createBooking = async (newBookingData: Omit<Booking, 'id' | 'createdAt'>): Promise<Booking> => {
    let created: Booking;
    try {
      const res = await bookingApi.create(newBookingData);
      if (res.success && res.data) {
        created = res.data;
      } else {
        throw new Error('API create failed');
      }
    } catch {
      created = {
        ...newBookingData,
        id: `BK-${Math.floor(1000 + Math.random() * 9000)}`,
        createdAt: new Date().toISOString(),
      };
    }

    setAllBookings((prev) => [created, ...prev]);
    const local = getLocalBookingsFromStorage();
    saveLocalBookingsToStorage([created, ...local]);
    window.dispatchEvent(new CustomEvent('aeroflight_bookings_updated'));
    return created;
  };

  const cancelBooking = async (id: string, reason?: string, refundAmount?: number) => {
    const nowIso = new Date().toISOString();
    setAllBookings((prev) =>
      prev.map((b) =>
        b.id === id || b.bookingCode === id
          ? {
              ...b,
              status: 'CANCELLED' as const,
              cancellationReason: reason || 'Customer requested cancellation',
              cancellationDate: nowIso,
              refundAmount: refundAmount !== undefined ? refundAmount : b.refundAmount,
            }
          : b
      )
    );
    const local = getLocalBookingsFromStorage().map((b) =>
      b.id === id || b.bookingCode === id
        ? {
            ...b,
            status: 'CANCELLED' as const,
            cancellationReason: reason || 'Customer requested cancellation',
            cancellationDate: nowIso,
            refundAmount: refundAmount !== undefined ? refundAmount : b.refundAmount,
          }
        : b
    );
    saveLocalBookingsToStorage(local);
    window.dispatchEvent(new CustomEvent('aeroflight_bookings_updated'));

    try {
      await bookingApi.cancel(id, reason);
    } catch {
      // Local fallback
    }
  };

  const updateBookingStatus = async (id: string, status: Booking['status']) => {
    setAllBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status } : b))
    );
    const local = getLocalBookingsFromStorage().map((b) =>
      b.id === id ? { ...b, status } : b
    );
    saveLocalBookingsToStorage(local);
    window.dispatchEvent(new CustomEvent('aeroflight_bookings_updated'));

    try {
      await bookingApi.updateStatus(id, status);
    } catch {
      // Local fallback
    }
  };

  return {
    bookings,
    allBookings,
    isLoading,
    getBookingById,
    createBooking,
    cancelBooking,
    updateBookingStatus,
    refreshBookings: fetchBookings,
  };
}

export default useBookings;
