import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const bookingSchema = z.object({
  checkInDate: z.date({
    required_error: 'Check-in date is required.',
  }),
  checkOutDate: z.date({
    required_error: 'Check-out date is required.',
  }),
  numGuests: z.string().min(1, 'Number of guests is required'),
  guestName: z.string().min(2, 'Name must be at least 2 characters'),
  guestEmail: z.string().email('Please enter a valid email address'),
  guestPhone: z.string().optional(),
  specialRequests: z.string().optional(),
}).refine((data) => data.checkOutDate > data.checkInDate, {
  message: 'Check-out date must be after check-in date',
  path: ['checkOutDate'],
});

type BookingFormData = z.infer<typeof bookingSchema>;

interface BookingFormProps {
  roomId: string;
  roomName: string;
  roomPrice: number;
  maxGuests: number;
  onSuccess?: () => void;
}

export const BookingForm: React.FC<BookingFormProps> = ({
  roomId,
  roomName,
  roomPrice,
  maxGuests,
  onSuccess
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      checkInDate: undefined,
      checkOutDate: undefined,
      numGuests: '1',
      guestName: '',
      guestEmail: '',
      guestPhone: '',
      specialRequests: '',
    },
  });

  const watchedDates = form.watch(['checkInDate', 'checkOutDate']);
  const calculateTotalPrice = () => {
    const [checkIn, checkOut] = watchedDates;
    if (checkIn && checkOut) {
      const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
      return nights * roomPrice;
    }
    return 0;
  };

  const onSubmit = async (data: BookingFormData) => {
    setIsLoading(true);
    try {
      const { data: response, error } = await supabase.functions.invoke('create-booking-payment', {
        body: {
          roomId,
          checkInDate: format(data.checkInDate, 'yyyy-MM-dd'),
          checkOutDate: format(data.checkOutDate, 'yyyy-MM-dd'),
          numGuests: parseInt(data.numGuests),
          guestName: data.guestName,
          guestEmail: data.guestEmail,
          guestPhone: data.guestPhone,
          specialRequests: data.specialRequests,
        }
      });

      if (error) {
        throw new Error(error.message);
      }

      if (response?.url) {
        // Open Stripe checkout in a new tab
        window.open(response.url, '_blank');
        
        toast({
          title: 'Redirecting to payment',
          description: 'Please complete your booking in the new tab.',
        });
        
        onSuccess?.();
      }
    } catch (error) {
      console.error('Booking error:', error);
      toast({
        title: 'Booking failed',
        description: error instanceof Error ? error.message : 'Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const totalPrice = calculateTotalPrice();
  const nights = watchedDates[0] && watchedDates[1] 
    ? Math.ceil((watchedDates[1].getTime() - watchedDates[0].getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  return (
    <div className="space-y-6">
      <div className="bg-card p-6 rounded-lg border">
        <h3 className="text-xl font-semibold mb-2">{roomName}</h3>
        <p className="text-muted-foreground mb-4">₹{roomPrice} per night</p>
        
        {totalPrice > 0 && (
          <div className="bg-muted p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <span>{nights} night{nights > 1 ? 's' : ''}</span>
              <span>₹{totalPrice}</span>
            </div>
            <div className="flex justify-between items-center font-semibold pt-2 border-t mt-2">
              <span>Total</span>
              <span>₹{totalPrice}</span>
            </div>
          </div>
        )}
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="checkInDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Check-in Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            'w-full pl-3 text-left font-normal',
                            !field.value && 'text-muted-foreground'
                          )}
                        >
                          {field.value ? (
                            format(field.value, 'PPP')
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date()}
                        initialFocus
                        className={cn('p-3 pointer-events-auto')}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="checkOutDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Check-out Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            'w-full pl-3 text-left font-normal',
                            !field.value && 'text-muted-foreground'
                          )}
                        >
                          {field.value ? (
                            format(field.value, 'PPP')
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date <= (form.getValues('checkInDate') || new Date())}
                        initialFocus
                        className={cn('p-3 pointer-events-auto')}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="numGuests"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Number of Guests</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select number of guests" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Array.from({ length: maxGuests }, (_, i) => (
                      <SelectItem key={i + 1} value={(i + 1).toString()}>
                        {i + 1} Guest{i > 0 ? 's' : ''}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="guestName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your full name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="guestEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email Address</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="Enter your email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="guestPhone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number (Optional)</FormLabel>
                <FormControl>
                  <Input type="tel" placeholder="Enter your phone number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="specialRequests"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Special Requests (Optional)</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Any special requests or notes"
                    className="min-h-[100px]"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              `Book Now ${totalPrice > 0 ? `- ₹${totalPrice}` : ''}`
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
};