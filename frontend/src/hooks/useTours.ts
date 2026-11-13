import { useState, useMemo, useEffect, useCallback } from 'react';
import { Tour } from '../types';
import { tourApi } from '../services/api';
import { useAuth } from '../context/AuthContext';

export const getStorageKey = (userEmail?: string) => {
  const cleanEmail = (userEmail || 'default_traveler').toLowerCase().trim();
  return `aeroflight_saved_tours_${cleanEmail}`;
};

export const getSavedTourIdsFromStorage = (userEmail?: string): string[] => {
  try {
    const raw = localStorage.getItem(getStorageKey(userEmail));
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const setSavedTourIdsToStorage = (ids: string[], userEmail?: string) => {
  try {
    localStorage.setItem(getStorageKey(userEmail), JSON.stringify(ids));
    window.dispatchEvent(
      new CustomEvent('aeroflight_saved_tours_updated', {
        detail: { count: ids.length, email: userEmail },
      })
    );
  } catch {
    // LocalStorage quota or access error handling
  }
};

export function useTours() {
  const { user, isAuthenticated } = useAuth();
  
  const [tours, setTours] = useState<Tour[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDestination, setSelectedDestination] = useState<string>('ALL');
  const [selectedDuration, setSelectedDuration] = useState<string>('ALL');
  const [selectedAirline, setSelectedAirline] = useState<string>('ALL');

  // Load tours from API and sync with persistent saved tour IDs
  useEffect(() => {
    let mounted = true;
    const fetchTours = async () => {
      try {
        setIsLoading(true);
        const res = await tourApi.getAll();
        if (mounted && res.success && res.data && res.data.length > 0) {
          const savedIds = getSavedTourIdsFromStorage(user?.email);
          const mapped = res.data.map((t) => ({
            ...t,
            isSaved: savedIds.includes(String(t.id)) || savedIds.includes(t.code),
          }));
          setTours(mapped);
        }
      } catch {
        // Gracefully preserve initial data if backend is offline
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    fetchTours();
    return () => {
      mounted = false;
    };
  }, [user?.email]);

  // Sync saved status whenever user changes (e.g. login/logout) or storage event fires
  useEffect(() => {
    const syncSavedStatus = () => {
      const savedIds = getSavedTourIdsFromStorage(user?.email);
      setTours((prev) =>
        prev.map((t) => ({
          ...t,
          isSaved: savedIds.includes(String(t.id)) || savedIds.includes(t.code),
        }))
      );
    };

    syncSavedStatus();
    window.addEventListener('aeroflight_saved_tours_updated', syncSavedStatus);
    window.addEventListener('storage', syncSavedStatus);
    return () => {
      window.removeEventListener('aeroflight_saved_tours_updated', syncSavedStatus);
      window.removeEventListener('storage', syncSavedStatus);
    };
  }, [user?.email]);

  const filteredTours = useMemo(() => {
    return tours.filter((tour) => {
      const s = searchTerm.toLowerCase().trim();
      const matchSearch =
        !s ||
        tour.title.toLowerCase().includes(s) ||
        tour.code.toLowerCase().includes(s) ||
        tour.destinationName.toLowerCase().includes(s) ||
        (tour.airlineName && tour.airlineName.toLowerCase().includes(s));

      const d = selectedDestination.toLowerCase().trim();
      const matchDest =
        !d ||
        d === 'all' ||
        (tour.destinationId && tour.destinationId.toLowerCase() === d) ||
        (tour.destinationCode && tour.destinationCode.toLowerCase() === d) ||
        tour.destinationName.toLowerCase().includes(d) ||
        tour.code.toLowerCase().includes(d);

      const matchDuration =
        selectedDuration === 'ALL' ||
        (selectedDuration === '7'
          ? tour.durationDays >= 7
          : tour.durationDays.toString() === selectedDuration);

      const a = selectedAirline.toLowerCase().trim();
      const matchAirline =
        !a ||
        a === 'all' ||
        (tour.airlineCode && tour.airlineCode.toLowerCase() === a) ||
        (tour.airlineName && tour.airlineName.toLowerCase().includes(a)) ||
        tour.code.toLowerCase().startsWith(a);

      return matchSearch && matchDest && matchDuration && matchAirline;
    });
  }, [tours, searchTerm, selectedDestination, selectedDuration, selectedAirline]);

  const toggleSaveTour = async (tourId: string) => {
    if (!isAuthenticated || !user) {
      window.location.href = `/auth/login?from=${encodeURIComponent(window.location.pathname)}`;
      return;
    }

    const currentSavedIds = getSavedTourIdsFromStorage(user.email);
    const idStr = String(tourId);
    const isAlreadySaved = currentSavedIds.includes(idStr);

    const nextSavedIds = isAlreadySaved
      ? currentSavedIds.filter((id) => id !== idStr)
      : [...currentSavedIds, idStr];

    setSavedTourIdsToStorage(nextSavedIds, user.email);

    setTours((prev) =>
      prev.map((t) =>
        String(t.id) === idStr || t.code === idStr
          ? { ...t, isSaved: !isAlreadySaved }
          : t
      )
    );

    try {
      await tourApi.toggleSave(tourId);
    } catch {
      // Local persistent storage already updated
    }
  };

  const getSavedTours = useCallback(() => {
    if (!isAuthenticated || !user) return [];
    const savedIds = getSavedTourIdsFromStorage(user.email);
    return tours.filter(
      (t) => t.isSaved || savedIds.includes(String(t.id)) || savedIds.includes(t.code)
    );
  }, [tours, isAuthenticated, user]);

  const getTourById = (tourId: string): Tour | undefined => {
    return tours.find((t) => String(t.id) === String(tourId) || t.code === tourId);
  };

  return {
    tours: filteredTours,
    allTours: tours,
    isLoading,
    searchTerm,
    setSearchTerm,
    selectedDestination,
    setSelectedDestination,
    selectedDuration,
    setSelectedDuration,
    selectedAirline,
    setSelectedAirline,
    toggleSaveTour,
    getSavedTours,
    getTourById,
  };
}

export default useTours;
