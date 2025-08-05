import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Room {
  id: string;
  name: string;
  description: string;
  base_price: number;
  max_guests: number;
  amenities?: any;
  image_url?: string;
}

interface SearchFilters {
  checkIn: Date | null;
  checkOut: Date | null;
  guests: number;
  minPrice: number;
  maxPrice: number;
  amenities: string[];
}

export const useRoomSearch = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [filteredRooms, setFilteredRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    checkIn: null,
    checkOut: null,
    guests: 1,
    minPrice: 0,
    maxPrice: 15000,
    amenities: []
  });

  // Fetch all rooms initially
  useEffect(() => {
    fetchRooms();
  }, []);

  // Apply filters whenever filters or rooms change
  useEffect(() => {
    applyFilters();
  }, [filters, rooms]);

  const fetchRooms = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('rooms')
        .select('*')
        .eq('is_active', true)
        .order('base_price', { ascending: true });

      if (data && !error) {
        setRooms(data);
      }
    } catch (error) {
      console.error('Error fetching rooms:', error);
    } finally {
      setLoading(false);
    }
  };

  const searchAvailableRooms = async (checkIn: Date, checkOut: Date) => {
    if (!checkIn || !checkOut) return;

    setLoading(true);
    try {
      const { data, error } = await supabase.rpc('get_available_rooms', {
        check_in_param: checkIn.toISOString().split('T')[0],
        check_out_param: checkOut.toISOString().split('T')[0]
      });

      if (data && !error) {
        setRooms(data);
      }
    } catch (error) {
      console.error('Error searching available rooms:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...rooms];

    // Guest capacity filter
    filtered = filtered.filter(room => room.max_guests >= filters.guests);

    // Price range filter
    filtered = filtered.filter(room => 
      room.base_price >= filters.minPrice && room.base_price <= filters.maxPrice
    );

    // Amenities filter
    if (filters.amenities.length > 0) {
      filtered = filtered.filter(room => {
        const roomAmenities = Array.isArray(room.amenities) ? room.amenities : [];
        return filters.amenities.every(amenity => 
          roomAmenities.some((roomAmenity: string) => 
            roomAmenity.toLowerCase().includes(amenity.toLowerCase())
          )
        );
      });
    }

    setFilteredRooms(filtered);
  };

  const updateFilters = (newFilters: Partial<SearchFilters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);

    // If dates changed, search for available rooms
    if (newFilters.checkIn || newFilters.checkOut) {
      if (updatedFilters.checkIn && updatedFilters.checkOut) {
        searchAvailableRooms(updatedFilters.checkIn, updatedFilters.checkOut);
      }
    }
  };

  const clearFilters = () => {
    setFilters({
      checkIn: null,
      checkOut: null,
      guests: 1,
      minPrice: 0,
      maxPrice: 15000,
      amenities: []
    });
    fetchRooms(); // Reset to all rooms
  };

  return {
    rooms: filteredRooms,
    loading,
    filters,
    updateFilters,
    clearFilters,
    searchAvailableRooms
  };
};