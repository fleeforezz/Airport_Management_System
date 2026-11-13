import React, { createContext, useContext, useState, useEffect } from 'react';
import { BookingDraft, Tour, Departure } from '../types';
import { couponApi } from '../services/api';

interface BookingDraftContextType {
  draft: BookingDraft;
  setTour: (tour: Tour) => void;
  setDeparture: (departure: Departure) => void;
  setGuests: (adults: number, children: number) => void;
  setSelectedSeats: (seats: string[]) => void;
  setBaggagePackage: (pkg: string, fee: number) => void;
  setContactInfo: (contact: {
    name: string;
    email: string;
    phone: string;
    notes?: string;
  }) => void;
  applyCoupon: (code: string) => Promise<{ success: boolean; message: string }>;
  removeCoupon: () => void;
  resetDraft: () => void;
  priceSummary: {
    subtotal: number;
    baggageFee: number;
    discount: number;
    total: number;
  };
}

const INITIAL_DRAFT: BookingDraft = {
  tourId: '',
  tour: undefined,
  departureId: undefined,
  departure: undefined,
  adultsCount: 1,
  childrenCount: 0,
  selectedSeats: [],
  baggagePackage: 'STANDARD',
  baggageFee: 0,
  contactName: '',
  contactEmail: '',
  contactPhone: '',
  notes: '',
  couponCode: undefined,
  discount: 0,
};

const BookingDraftContext = createContext<BookingDraftContextType | undefined>(undefined);

export const BookingDraftProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [draft, setDraft] = useState<BookingDraft>(() => {
    try {
      const stored = localStorage.getItem('booking_draft');
      return stored ? JSON.parse(stored) : INITIAL_DRAFT;
    } catch {
      return INITIAL_DRAFT;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('booking_draft', JSON.stringify(draft));
    } catch (e) {
      console.error('Failed to save draft to localStorage', e);
    }
  }, [draft]);

  const setTour = (tour: Tour) => {
    setDraft((prev) => ({
      ...prev,
      tourId: tour.id,
      tour,
      departureId: undefined,
      departure: undefined,
      selectedSeats: [],
    }));
  };

  const setDeparture = (departure: Departure) => {
    setDraft((prev) => ({
      ...prev,
      departureId: departure.id,
      departure,
    }));
  };

  const setGuests = (adults: number, children: number) => {
    setDraft((prev) => ({
      ...prev,
      adultsCount: Math.max(1, adults),
      childrenCount: Math.max(0, children),
    }));
  };

  const setSelectedSeats = (selectedSeats: string[]) => {
    setDraft((prev) => ({
      ...prev,
      selectedSeats,
    }));
  };

  const setBaggagePackage = (baggagePackage: string, baggageFee: number) => {
    setDraft((prev) => ({
      ...prev,
      baggagePackage,
      baggageFee,
    }));
  };

  const setContactInfo = (contact: {
    name: string;
    email: string;
    phone: string;
    notes?: string;
  }) => {
    setDraft((prev) => ({
      ...prev,
      contactName: contact.name,
      contactEmail: contact.email,
      contactPhone: contact.phone,
      notes: contact.notes,
    }));
  };

  const applyCoupon = async (
    code: string
  ): Promise<{ success: boolean; message: string }> => {
    const trimmed = code.trim().toUpperCase();
    const basePrice = draft.departure?.price || draft.tour?.price || 0;
    const subtotal = basePrice * (draft.adultsCount + draft.childrenCount * 0.75);

    try {
      const res = await couponApi.verify(trimmed, subtotal);
      if (res.success && res.data && res.data.valid) {
        setDraft((prev) => ({
          ...prev,
          couponCode: trimmed,
          discount: res.data.discountAmount,
        }));
        return {
          success: true,
          message: res.data.message || `Coupon ${trimmed} applied!`,
        };
      }
    } catch {
      // Local fallback
    }

    if (trimmed === 'SWISS2026' || trimmed === 'FLYSUMMER' || trimmed === 'AERO10') {
      const discountPercent = trimmed === 'AERO10' ? 0.1 : 0.15;
      const discountVal = Math.round(subtotal * discountPercent);

      setDraft((prev) => ({
        ...prev,
        couponCode: trimmed,
        discount: discountVal,
      }));

      return {
        success: true,
        message: `Promo code ${trimmed} applied successfully (-${discountPercent * 100}%)`,
      };
    }

    return {
      success: false,
      message: 'Invalid promo code or expired voucher',
    };
  };

  const removeCoupon = () => {
    setDraft((prev) => ({
      ...prev,
      couponCode: undefined,
      discount: 0,
    }));
  };

  const resetDraft = () => {
    setDraft(INITIAL_DRAFT);
    localStorage.removeItem('booking_draft');
  };

  // Calculate pricing breakdown
  const basePrice = draft.departure?.price || draft.tour?.price || 0;
  const adultSubtotal = basePrice * draft.adultsCount;
  const childSubtotal = Math.round(basePrice * 0.75 * draft.childrenCount);
  const subtotal = adultSubtotal + childSubtotal;
  const baggageFee = draft.baggageFee || 0;
  const discount = Math.min(draft.discount || 0, subtotal + baggageFee);
  const total = Math.max(0, subtotal + baggageFee - discount);

  return (
    <BookingDraftContext.Provider
      value={{
        draft,
        setTour,
        setDeparture,
        setGuests,
        setSelectedSeats,
        setBaggagePackage,
        setContactInfo,
        applyCoupon,
        removeCoupon,
        resetDraft,
        priceSummary: {
          subtotal,
          baggageFee,
          discount,
          total,
        },
      }}
    >
      {children}
    </BookingDraftContext.Provider>
  );
};

export const useBookingDraft = (): BookingDraftContextType => {
  const context = useContext(BookingDraftContext);
  if (!context) {
    throw new Error('useBookingDraft must be used within a BookingDraftProvider');
  }
  return context;
};

export default BookingDraftContext;
