import { useState, useEffect } from 'react';
import { MOCK_BOOKINGS } from '../utils/mockData';
import { Booking } from '../types';
import { bookingApi } from '../services/api';

export function useBookings() {
  const [bookings, setBookings] = useState<Booking[]>(MOCK_BOOKINGS);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    const fetchBookings = async () => {
      try {
        setIsLoading(true);
        const res = await bookingApi.getAll();
        if (mounted && res.success && res.data && res.data.length > 0) {
          setBookings(res.data);
        }
      } catch {
        // Fall back to initial mock data if API is offline
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    fetchBookings();
    return () => {
      mounted = false;
    };
  }, []);

  const getBookingById = (id: string): Booking | undefined => {
    return bookings.find((b) => b.id === id || b.bookingCode === id);
  };

  const createBooking = async (newBookingData: Omit<Booking, 'id' | 'createdAt'>): Promise<Booking> => {
    try {
      const res = await bookingApi.create(newBookingData);
      if (res.success && res.data) {
        setBookings((prev) => [res.data, ...prev]);
        return res.data;
      }
    } catch {
      // Offline fallback
    }

    const fallbackBooking: Booking = {
      ...newBookingData,
      id: `BK-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString(),
    };
    setBookings((prev) => [fallbackBooking, ...prev]);
    return fallbackBooking;
  };

  const cancelBooking = async (id: string) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: 'CANCELLED' as const } : b))
    );
    try {
      await bookingApi.cancel(id);
    } catch {
      // Local fallback
    }
  };

  const updateBookingStatus = async (id: string, status: Booking['status']) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status } : b))
    );
    try {
      await bookingApi.updateStatus(id, status);
    } catch {
      // Local fallback
    }
  };

  return {
    bookings,
    isLoading,
    getBookingById,
    createBooking,
    cancelBooking,
    updateBookingStatus,
  };
}

export default useBookings;
