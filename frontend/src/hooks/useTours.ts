import { useState, useMemo, useEffect } from 'react';
import { MOCK_TOURS } from '../utils/mockData';
import { Tour } from '../types';
import { tourApi } from '../services/api';

export function useTours() {
  const [tours, setTours] = useState<Tour[]>(MOCK_TOURS);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDestination, setSelectedDestination] = useState<string>('ALL');

  useEffect(() => {
    let mounted = true;
    const fetchTours = async () => {
      try {
        setIsLoading(true);
        const res = await tourApi.getAll();
        if (mounted && res.success && res.data && res.data.length > 0) {
          setTours(res.data);
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
  }, []);

  const filteredTours = useMemo(() => {
    return tours.filter((tour) => {
      const matchSearch =
        tour.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tour.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tour.destinationName.toLowerCase().includes(searchTerm.toLowerCase());

      const matchDest =
        selectedDestination === 'ALL' || tour.destinationId === selectedDestination;

      return matchSearch && matchDest;
    });
  }, [tours, searchTerm, selectedDestination]);

  const toggleSaveTour = async (tourId: string) => {
    setTours((prev) =>
      prev.map((t) => (t.id === tourId ? { ...t, isSaved: !t.isSaved } : t))
    );
    try {
      await tourApi.toggleSave(tourId);
    } catch {
      // Handled locally
    }
  };

  const getSavedTours = () => {
    return tours.filter((t) => t.isSaved);
  };

  const getTourById = (tourId: string): Tour | undefined => {
    return tours.find((t) => t.id === tourId);
  };

  return {
    tours: filteredTours,
    allTours: tours,
    isLoading,
    searchTerm,
    setSearchTerm,
    selectedDestination,
    setSelectedDestination,
    toggleSaveTour,
    getSavedTours,
    getTourById,
  };
}

export default useTours;
