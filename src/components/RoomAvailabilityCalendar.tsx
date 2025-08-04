import React, { useState, useEffect } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { supabase } from '@/integrations/supabase/client';
import { format, addDays, startOfDay, endOfDay } from 'date-fns';
import { CalendarIcon, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface RoomAvailabilityCalendarProps {
  roomId: string;
  onDateSelect?: (checkIn: Date, checkOut: Date) => void;
  compact?: boolean;
}

interface BookedDate {
  check_in_date: string;
  check_out_date: string;
}

export const RoomAvailabilityCalendar: React.FC<RoomAvailabilityCalendarProps> = ({
  roomId,
  onDateSelect,
  compact = false,
}) => {
  const [bookedDates, setBookedDates] = useState<BookedDate[]>([]);
  const [selectedDates, setSelectedDates] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({ from: undefined, to: undefined });
  const [availabilityStatus, setAvailabilityStatus] = useState<{[key: string]: boolean}>({});

  const fetchBookedDates = async () => {
    const { data } = await supabase
      .from('bookings')
      .select('check_in_date, check_out_date')
      .eq('room_id', roomId)
      .in('booking_status', ['confirmed', 'checked_in'])
      .gte('check_out_date', format(new Date(), 'yyyy-MM-dd'));
    
    if (data) {
      setBookedDates(data);
    }
  };

  const checkAvailabilityForDate = async (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const { data } = await supabase.rpc('check_room_availability', {
      room_id_param: roomId,
      check_in_param: dateStr,
      check_out_param: format(addDays(date, 1), 'yyyy-MM-dd'),
    });
    
    setAvailabilityStatus(prev => ({
      ...prev,
      [dateStr]: data === true
    }));
  };

  useEffect(() => {
    fetchBookedDates();

    // Subscribe to real-time booking changes
    const channel = supabase
      .channel('room_availability_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bookings',
          filter: `room_id=eq.${roomId}`
        },
        () => {
          fetchBookedDates();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [roomId]);

  const isDateBooked = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return bookedDates.some(booking => {
      const checkIn = new Date(booking.check_in_date);
      const checkOut = new Date(booking.check_out_date);
      return date >= checkIn && date < checkOut;
    });
  };

  const getAvailabilityIndicator = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const isBooked = isDateBooked(date);
    const isAvailable = availabilityStatus[dateStr];
    
    if (isBooked) {
      return <XCircle className="w-3 h-3 text-destructive" />;
    } else if (isAvailable === true) {
      return <CheckCircle className="w-3 h-3 text-green-500" />;
    }
    return null;
  };

  const handleDateSelect = (range: { from: Date | undefined; to: Date | undefined } | undefined) => {
    if (range) {
      setSelectedDates(range);
      if (range.from && range.to && onDateSelect) {
        onDateSelect(range.from, range.to);
      }
    }
  };

  const getNext30Days = () => {
    const today = new Date();
    const next30Days = [];
    for (let i = 0; i < 30; i++) {
      const date = addDays(today, i);
      const isBooked = isDateBooked(date);
      next30Days.push({
        date,
        isBooked,
        isAvailable: !isBooked
      });
    }
    return next30Days;
  };

  if (compact) {
    const next30Days = getNext30Days();
    const availableDays = next30Days.filter(day => day.isAvailable).length;
    
    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="w-full">
            <CalendarIcon className="w-4 h-4 mr-2" />
            {availableDays}/30 days available
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="range"
            selected={selectedDates}
            onSelect={handleDateSelect}
            disabled={(date) => isDateBooked(date) || date < new Date()}
            initialFocus
            modifiers={{
              booked: (date) => isDateBooked(date),
              available: (date) => !isDateBooked(date) && date >= new Date(),
            }}
            modifiersStyles={{
              booked: { 
                backgroundColor: 'hsl(var(--destructive))',
                color: 'hsl(var(--destructive-foreground))',
                opacity: 0.7 
              },
              available: { 
                backgroundColor: 'hsl(var(--primary))',
                color: 'hsl(var(--primary-foreground))'
              }
            }}
          />
          <div className="p-3 border-t">
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1">
                <CheckCircle className="w-3 h-3 text-green-500" />
                <span>Available</span>
              </div>
              <div className="flex items-center gap-1">
                <XCircle className="w-3 h-3 text-destructive" />
                <span>Booked</span>
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <div className="space-y-4">
      <Calendar
        mode="range"
        selected={selectedDates}
        onSelect={handleDateSelect}
        disabled={(date) => isDateBooked(date) || date < new Date()}
        modifiers={{
          booked: (date) => isDateBooked(date),
          available: (date) => !isDateBooked(date) && date >= new Date(),
        }}
        modifiersStyles={{
          booked: { 
            backgroundColor: 'hsl(var(--destructive))',
            color: 'hsl(var(--destructive-foreground))',
            opacity: 0.7 
          },
          available: { 
            backgroundColor: 'hsl(var(--primary))',
            color: 'hsl(var(--primary-foreground))'
          }
        }}
      />
      <div className="flex items-center gap-4 text-sm">
        <div className="flex items-center gap-1">
          <CheckCircle className="w-4 h-4 text-green-500" />
          <span>Available</span>
        </div>
        <div className="flex items-center gap-1">
          <XCircle className="w-4 h-4 text-destructive" />
          <span>Booked</span>
        </div>
      </div>
    </div>
  );
};