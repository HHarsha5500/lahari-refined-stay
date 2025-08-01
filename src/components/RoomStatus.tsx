import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bed, Users, Settings, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Room {
  id: string;
  name: string;
  description: string;
  max_guests: number;
  base_price: number;
  is_active: boolean;
  status: 'available' | 'occupied' | 'maintenance' | 'cleaning';
  current_booking?: {
    id: string;
    guest_name: string;
    check_in_date: string;
    check_out_date: string;
    booking_status: string;
  };
}

const RoomStatus = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchRoomsWithStatus();
  }, []);

  const fetchRoomsWithStatus = async () => {
    try {
      // Fetch all rooms
      const { data: roomsData, error: roomsError } = await supabase
        .from('rooms')
        .select('*')
        .order('name');

      if (roomsError) throw roomsError;

      // Fetch current bookings for each room
      const roomsWithStatus = await Promise.all(
        (roomsData || []).map(async (room) => {
          const { data: currentBooking } = await supabase
            .from('bookings')
            .select('id, guest_name, check_in_date, check_out_date, booking_status')
            .eq('room_id', room.id)
            .in('booking_status', ['confirmed', 'checked_in'])
            .lte('check_in_date', new Date().toISOString().split('T')[0])
            .gte('check_out_date', new Date().toISOString().split('T')[0])
            .single();

          let status: 'available' | 'occupied' | 'maintenance' | 'cleaning' = 'available';
          
          if (!room.is_active) {
            status = 'maintenance';
          } else if (currentBooking) {
            status = currentBooking.booking_status === 'checked_in' ? 'occupied' : 'available';
          }

          return {
            ...room,
            status,
            current_booking: currentBooking
          };
        })
      );

      setRooms(roomsWithStatus);
    } catch (error) {
      console.error('Error fetching room status:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch room status.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleRoomStatus = async (roomId: string, currentlyActive: boolean) => {
    try {
      const { error } = await supabase
        .from('rooms')
        .update({ is_active: !currentlyActive })
        .eq('id', roomId);

      if (error) throw error;

      toast({
        title: 'Success',
        description: `Room ${!currentlyActive ? 'activated' : 'deactivated'} successfully.`,
      });

      fetchRoomsWithStatus();
    } catch (error) {
      console.error('Error updating room status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update room status.',
        variant: 'destructive',
      });
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'available':
        return 'default';
      case 'occupied':
        return 'secondary';
      case 'maintenance':
        return 'destructive';
      case 'cleaning':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'text-green-600';
      case 'occupied':
        return 'text-blue-600';
      case 'maintenance':
        return 'text-red-600';
      case 'cleaning':
        return 'text-yellow-600';
      default:
        return 'text-gray-600';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bed className="h-5 w-5" />
            Room Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="p-4 border rounded-lg">
                <div className="h-4 w-20 bg-muted animate-pulse rounded mb-2"></div>
                <div className="h-3 w-16 bg-muted animate-pulse rounded mb-3"></div>
                <div className="h-8 w-24 bg-muted animate-pulse rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Bed className="h-5 w-5" />
            Room Status
          </CardTitle>
          <Button onClick={fetchRoomsWithStatus} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {rooms.map((room) => (
            <div key={room.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-lg">{room.name}</h3>
                <Badge variant={getStatusBadgeVariant(room.status)} className={getStatusColor(room.status)}>
                  {room.status}
                </Badge>
              </div>
              
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                {room.description}
              </p>
              
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>{room.max_guests} guests</span>
                </div>
                <div>₹{room.base_price}/night</div>
              </div>

              {room.current_booking && (
                <div className="bg-muted p-3 rounded mb-3">
                  <p className="text-sm font-medium">{room.current_booking.guest_name}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(room.current_booking.check_in_date).toLocaleDateString()} - {' '}
                    {new Date(room.current_booking.check_out_date).toLocaleDateString()}
                  </p>
                  <Badge variant="outline" className="mt-1 text-xs">
                    {room.current_booking.booking_status}
                  </Badge>
                </div>
              )}

              <div className="flex gap-2">
                <Button
                  onClick={() => toggleRoomStatus(room.id, room.is_active)}
                  variant={room.is_active ? "destructive" : "default"}
                  size="sm"
                  className="flex-1"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  {room.is_active ? 'Deactivate' : 'Activate'}
                </Button>
              </div>
            </div>
          ))}
        </div>

        {rooms.length === 0 && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No rooms found.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RoomStatus;