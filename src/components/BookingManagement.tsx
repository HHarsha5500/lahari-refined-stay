import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, MapPin, Users, Phone, Mail, Clock, Filter, Download } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Booking {
  id: string;
  check_in_date: string;
  check_out_date: string;
  num_guests: number;
  total_amount: number;
  booking_status: string;
  payment_status: string;
  guest_name: string;
  guest_email: string;
  guest_phone?: string;
  special_requests?: string;
  created_at: string;
  rooms: {
    name: string;
    description: string;
  };
}

const BookingManagement = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [paymentFilter, setPaymentFilter] = useState<string>('all');
  const { toast } = useToast();

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    filterBookings();
  }, [bookings, statusFilter, paymentFilter]);

  const fetchBookings = async () => {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          rooms (
            name,
            description
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setBookings(data || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch bookings.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const filterBookings = () => {
    let filtered = [...bookings];
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(booking => booking.booking_status === statusFilter);
    }
    
    if (paymentFilter !== 'all') {
      filtered = filtered.filter(booking => booking.payment_status === paymentFilter);
    }
    
    setFilteredBookings(filtered);
  };

  const updateBookingStatus = async (bookingId: string, newStatus: 'pending' | 'confirmed' | 'cancelled' | 'checked_in' | 'checked_out') => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ booking_status: newStatus })
        .eq('id', bookingId);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Booking status updated successfully.',
      });

      fetchBookings();
    } catch (error) {
      console.error('Error updating booking status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update booking status.',
        variant: 'destructive',
      });
    }
  };

  const exportBookings = () => {
    const csvData = filteredBookings.map(booking => ({
      'Booking ID': booking.id,
      'Guest Name': booking.guest_name,
      'Guest Email': booking.guest_email,
      'Room': booking.rooms.name,
      'Check In': booking.check_in_date,
      'Check Out': booking.check_out_date,
      'Guests': booking.num_guests,
      'Amount': booking.total_amount,
      'Booking Status': booking.booking_status,
      'Payment Status': booking.payment_status,
      'Created': booking.created_at
    }));

    const csv = [
      Object.keys(csvData[0]).join(','),
      ...csvData.map(row => Object.values(row).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bookings-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'cancelled':
        return 'destructive';
      case 'checked_in':
        return 'default';
      case 'checked_out':
        return 'secondary';
      default:
        return 'secondary';
    }
  };

  const getPaymentStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'paid':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'failed':
        return 'destructive';
      case 'refunded':
        return 'secondary';
      default:
        return 'secondary';
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading bookings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold">Booking Management</h2>
        <div className="flex flex-wrap gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="checked_in">Checked In</SelectItem>
              <SelectItem value="checked_out">Checked Out</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={paymentFilter} onValueChange={setPaymentFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by payment" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Payments</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
              <SelectItem value="refunded">Refunded</SelectItem>
            </SelectContent>
          </Select>
          
          <Button onClick={exportBookings} variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          
          <Button onClick={fetchBookings} variant="outline" size="sm">
            Refresh
          </Button>
        </div>
      </div>

      <div className="text-sm text-muted-foreground mb-4">
        Showing {filteredBookings.length} of {bookings.length} bookings
      </div>

      {filteredBookings.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">No bookings found.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((booking) => (
            <Card key={booking.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">{booking.rooms.name}</CardTitle>
                    <p className="text-muted-foreground mt-1">{booking.rooms.description}</p>
                  </div>
                  <div className="flex gap-2 flex-col">
                    <Badge variant={getStatusBadgeVariant(booking.booking_status)}>
                      {booking.booking_status}
                    </Badge>
                    <Badge variant={getPaymentStatusBadgeVariant(booking.payment_status)}>
                      {booking.payment_status}
                    </Badge>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Check-in</p>
                      <p className="font-medium">{new Date(booking.check_in_date).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Check-out</p>
                      <p className="font-medium">{new Date(booking.check_out_date).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Guests</p>
                      <p className="font-medium">{booking.num_guests}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Guest</p>
                      <p className="font-medium">{booking.guest_name}</p>
                      <p className="text-sm text-muted-foreground">{booking.guest_email}</p>
                    </div>
                  </div>

                  {booking.guest_phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Phone</p>
                        <p className="font-medium">{booking.guest_phone}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Booked</p>
                      <p className="font-medium">{new Date(booking.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>

                {booking.special_requests && (
                  <div className="border-t pt-4">
                    <p className="text-sm text-muted-foreground mb-1">Special Requests:</p>
                    <p className="text-sm">{booking.special_requests}</p>
                  </div>
                )}

                <div className="border-t pt-4 flex justify-between items-center">
                  <div>
                    <p className="text-lg font-semibold">Total: ₹{booking.total_amount}</p>
                    <p className="text-sm text-muted-foreground">Booking ID: {booking.id.slice(0, 8)}...</p>
                  </div>
                  
                  <div className="flex gap-2">
                    {booking.booking_status === 'confirmed' && (
                      <Button
                        onClick={() => updateBookingStatus(booking.id, 'checked_in')}
                        size="sm"
                        variant="default"
                      >
                        Check In
                      </Button>
                    )}
                    
                    {booking.booking_status === 'checked_in' && (
                      <Button
                        onClick={() => updateBookingStatus(booking.id, 'checked_out')}
                        size="sm"
                        variant="secondary"
                      >
                        Check Out
                      </Button>
                    )}
                    
                    {['pending', 'confirmed'].includes(booking.booking_status) && (
                      <Button
                        onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                        size="sm"
                        variant="destructive"
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookingManagement;