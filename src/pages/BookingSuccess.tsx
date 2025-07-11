import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle, Calendar, MapPin, Users, Mail, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface BookingDetails {
  id: string;
  guest_name: string;
  guest_email: string;
  guest_phone?: string;
  check_in_date: string;
  check_out_date: string;
  num_guests: number;
  total_amount: number;
  booking_status: string;
  payment_status: string;
  special_requests?: string;
  rooms: {
    name: string;
    description: string;
    image_url?: string;
  };
}

const BookingSuccess = () => {
  const [searchParams] = useSearchParams();
  const [booking, setBooking] = useState<BookingDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    const verifyPayment = async () => {
      if (!sessionId) {
        toast({
          title: 'Invalid session',
          description: 'No session ID found in URL.',
          variant: 'destructive',
        });
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase.functions.invoke('verify-booking-payment', {
          body: { session_id: sessionId }
        });

        if (error) {
          throw new Error(error.message);
        }

        setBooking(data.booking);
        
        if (data.payment_status === 'paid') {
          toast({
            title: 'Booking confirmed!',
            description: 'Your payment was successful and booking is confirmed.',
          });
        }
      } catch (error) {
        console.error('Error verifying payment:', error);
        toast({
          title: 'Verification failed',
          description: 'Unable to verify your booking. Please contact support.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [sessionId, toast]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Verifying your booking...</p>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <h1 className="text-2xl font-bold text-destructive mb-4">Booking Not Found</h1>
            <p className="text-muted-foreground mb-6">
              We couldn't find your booking. Please check your email for confirmation details.
            </p>
            <Button asChild>
              <Link to="/">Return Home</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const checkInDate = new Date(booking.check_in_date);
  const checkOutDate = new Date(booking.check_out_date);
  const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="text-center mb-8">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-2">Booking Confirmed!</h1>
          <p className="text-muted-foreground">
            Thank you for your reservation. We've sent a confirmation email to{' '}
            <span className="font-medium">{booking.guest_email}</span>
          </p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Booking Details</span>
              <Badge variant={booking.payment_status === 'paid' ? 'default' : 'secondary'}>
                {booking.payment_status === 'paid' ? 'Paid' : booking.payment_status}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg">{booking.rooms.name}</h3>
              <p className="text-muted-foreground">{booking.rooms.description}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Check-in</p>
                  <p className="font-medium">{checkInDate.toLocaleDateString()}</p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Check-out</p>
                  <p className="font-medium">{checkOutDate.toLocaleDateString()}</p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Guests</p>
                  <p className="font-medium">{booking.num_guests} guest{booking.num_guests > 1 ? 's' : ''}</p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Duration</p>
                  <p className="font-medium">{nights} night{nights > 1 ? 's' : ''}</p>
                </div>
              </div>
            </div>

            <div className="border-t pt-4">
              <h4 className="font-semibold mb-2">Guest Information</h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{booking.guest_name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{booking.guest_email}</span>
                </div>
                {booking.guest_phone && (
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{booking.guest_phone}</span>
                  </div>
                )}
              </div>
            </div>

            {booking.special_requests && (
              <div className="border-t pt-4">
                <h4 className="font-semibold mb-2">Special Requests</h4>
                <p className="text-muted-foreground">{booking.special_requests}</p>
              </div>
            )}

            <div className="border-t pt-4">
              <div className="flex justify-between items-center text-lg font-semibold">
                <span>Total Amount</span>
                <span>₹{booking.total_amount}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center space-y-4">
          <p className="text-sm text-muted-foreground">
            Booking ID: <span className="font-mono">{booking.id}</span>
          </p>
          
          <div className="space-x-4">
            <Button asChild>
              <Link to="/">Return Home</Link>
            </Button>
            
            <Button variant="outline" onClick={() => window.print()}>
              Print Confirmation
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingSuccess;