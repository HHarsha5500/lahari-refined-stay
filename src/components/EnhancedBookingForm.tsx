import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format, differenceInDays } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { 
  CalendarIcon, 
  Users, 
  IndianRupee, 
  ArrowRight, 
  ArrowLeft,
  Check,
  CreditCard,
  User,
  FileText
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const bookingSchema = z.object({
  checkInDate: z.date({
    required_error: "Check-in date is required",
  }),
  checkOutDate: z.date({
    required_error: "Check-out date is required",
  }),
  numGuests: z.number().min(1, "At least 1 guest is required"),
  guestName: z.string().min(2, "Name must be at least 2 characters"),
  guestEmail: z.string().email("Invalid email address"),
  guestPhone: z.string().optional(),
  specialRequests: z.string().optional(),
  roomPreferences: z.array(z.string()).optional(),
  earlyCheckIn: z.boolean().optional(),
  lateCheckOut: z.boolean().optional(),
});

type BookingFormData = z.infer<typeof bookingSchema>;

interface EnhancedBookingFormProps {
  roomId: string;
  roomName: string;
  roomPrice: number;
  maxGuests: number;
  onSuccess?: () => void;
}

const steps = [
  { id: 1, title: 'Dates & Guests', icon: CalendarIcon },
  { id: 2, title: 'Guest Details', icon: User },
  { id: 3, title: 'Preferences', icon: FileText },
  { id: 4, title: 'Review & Pay', icon: CreditCard },
];

const roomPreferenceOptions = [
  'High floor',
  'Low floor', 
  'City view',
  'Garden view',
  'Quiet room',
  'Near elevator',
  'Away from elevator',
  'Connecting rooms',
  'Non-smoking floor'
];

const EnhancedBookingForm = ({ 
  roomId, 
  roomName, 
  roomPrice, 
  maxGuests, 
  onSuccess 
}: EnhancedBookingFormProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>([]);
  const [earlyCheckIn, setEarlyCheckIn] = useState(false);
  const [lateCheckOut, setLateCheckOut] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const form = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      numGuests: 1,
      guestName: user?.user_metadata?.full_name || '',
      guestEmail: user?.email || '',
      guestPhone: '',
      specialRequests: '',
      roomPreferences: [],
      earlyCheckIn: false,
      lateCheckOut: false,
    },
  });

  const { watch, setValue } = form;
  const watchedValues = watch();

  // Calculate total price
  const calculateTotal = () => {
    if (!watchedValues.checkInDate || !watchedValues.checkOutDate) return 0;
    
    const nights = differenceInDays(watchedValues.checkOutDate, watchedValues.checkInDate);
    let total = roomPrice * nights;
    
    // Add extra charges
    if (earlyCheckIn) total += 1000; // Early check-in fee
    if (lateCheckOut) total += 1500; // Late check-out fee
    
    return total;
  };

  const handleNext = async () => {
    let fieldsToValidate: (keyof BookingFormData)[] = [];
    
    switch (currentStep) {
      case 1:
        fieldsToValidate = ['checkInDate', 'checkOutDate', 'numGuests'];
        break;
      case 2:
        fieldsToValidate = ['guestName', 'guestEmail'];
        break;
      case 3:
        // No validation needed for preferences step
        break;
    }

    if (fieldsToValidate.length > 0) {
      const isValid = await form.trigger(fieldsToValidate);
      if (!isValid) return;
    }

    setCurrentStep(prev => Math.min(prev + 1, 4));
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handlePreferenceToggle = (preference: string) => {
    const newPreferences = selectedPreferences.includes(preference)
      ? selectedPreferences.filter(p => p !== preference)
      : [...selectedPreferences, preference];
    setSelectedPreferences(newPreferences);
    setValue('roomPreferences', newPreferences);
  };

  const onSubmit = async (data: BookingFormData) => {
    setIsSubmitting(true);
    
    try {
      // Check room availability first
      const { data: availabilityData, error: availabilityError } = await supabase.rpc(
        'check_room_availability',
        {
          room_id_param: roomId,
          check_in_param: format(data.checkInDate, 'yyyy-MM-dd'),
          check_out_param: format(data.checkOutDate, 'yyyy-MM-dd'),
        }
      );

      if (availabilityError || !availabilityData) {
        toast({
          title: "Room Unavailable",
          description: "This room is not available for the selected dates.",
          variant: "destructive",
        });
        return;
      }

      const totalAmount = calculateTotal();

      // Create booking record
      const bookingData = {
        user_id: user?.id,
        room_id: roomId,
        check_in_date: format(data.checkInDate, 'yyyy-MM-dd'),
        check_out_date: format(data.checkOutDate, 'yyyy-MM-dd'),
        num_guests: data.numGuests,
        guest_name: data.guestName,
        guest_email: data.guestEmail,
        guest_phone: data.guestPhone,
        total_amount: totalAmount,
        special_requests: [
          data.specialRequests,
          earlyCheckIn ? 'Early check-in requested' : '',
          lateCheckOut ? 'Late check-out requested' : '',
          selectedPreferences.length > 0 ? `Room preferences: ${selectedPreferences.join(', ')}` : ''
        ].filter(Boolean).join('\n'),
        booking_status: 'pending' as const,
        payment_status: 'pending' as const,
      };

      const { data: booking, error: bookingError } = await supabase
        .from('bookings')
        .insert(bookingData)
        .select()
        .single();

      if (bookingError) throw bookingError;

      // Create Stripe payment session
      const { data: paymentData, error: paymentError } = await supabase.functions.invoke(
        'create-booking-payment',
        {
          body: {
            bookingId: booking.id,
            amount: totalAmount,
            roomName: roomName,
            checkIn: format(data.checkInDate, 'yyyy-MM-dd'),
            checkOut: format(data.checkOutDate, 'yyyy-MM-dd'),
          },
        }
      );

      if (paymentError) throw paymentError;

      // Open Stripe checkout in new tab
      if (paymentData?.url) {
        window.open(paymentData.url, '_blank');
        onSuccess?.();
        
        toast({
          title: "Booking Created",
          description: "Please complete payment in the new tab to confirm your booking.",
        });
      }

    } catch (error: any) {
      console.error('Booking error:', error);
      toast({
        title: "Booking Failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Check-in Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !watchedValues.checkInDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {watchedValues.checkInDate ? format(watchedValues.checkInDate, "PPP") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={watchedValues.checkInDate}
                      onSelect={(date) => setValue('checkInDate', date!)}
                      disabled={(date) => date < new Date()}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label>Check-out Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !watchedValues.checkOutDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {watchedValues.checkOutDate ? format(watchedValues.checkOutDate, "PPP") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={watchedValues.checkOutDate}
                      onSelect={(date) => setValue('checkOutDate', date!)}
                      disabled={(date) => 
                        date < new Date() || 
                        (watchedValues.checkInDate && date <= watchedValues.checkInDate)
                      }
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Number of Guests
              </Label>
              <Select 
                value={watchedValues.numGuests?.toString()} 
                onValueChange={(value) => setValue('numGuests', parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: maxGuests }, (_, i) => i + 1).map(num => (
                    <SelectItem key={num} value={num.toString()}>
                      {num} {num === 1 ? 'Guest' : 'Guests'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {watchedValues.checkInDate && watchedValues.checkOutDate && (
              <Card className="bg-muted/50">
                <CardContent className="pt-4">
                  <div className="flex justify-between items-center">
                    <span>Duration:</span>
                    <span className="font-semibold">
                      {differenceInDays(watchedValues.checkOutDate, watchedValues.checkInDate)} nights
                    </span>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="guestName">Full Name *</Label>
              <Input 
                id="guestName"
                {...form.register('guestName')}
                placeholder="Enter your full name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="guestEmail">Email Address *</Label>
              <Input 
                id="guestEmail"
                type="email"
                {...form.register('guestEmail')}
                placeholder="Enter your email"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="guestPhone">Phone Number</Label>
              <Input 
                id="guestPhone"
                type="tel"
                {...form.register('guestPhone')}
                placeholder="Enter your phone number"
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="space-y-3">
              <Label>Room Preferences</Label>
              <div className="grid grid-cols-2 gap-2">
                {roomPreferenceOptions.map(preference => (
                  <div key={preference} className="flex items-center space-x-2">
                    <Checkbox
                      id={preference}
                      checked={selectedPreferences.includes(preference)}
                      onCheckedChange={() => handlePreferenceToggle(preference)}
                    />
                    <Label htmlFor={preference} className="text-sm cursor-pointer">
                      {preference}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <Label>Additional Services</Label>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="earlyCheckIn"
                      checked={earlyCheckIn}
                      onCheckedChange={(checked) => setEarlyCheckIn(checked === true)}
                    />
                    <Label htmlFor="earlyCheckIn" className="cursor-pointer">
                      Early Check-in (before 2:00 PM)
                    </Label>
                  </div>
                  <Badge variant="outline">+₹1,000</Badge>
                </div>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="lateCheckOut"
                      checked={lateCheckOut}
                      onCheckedChange={(checked) => setLateCheckOut(checked === true)}
                    />
                    <Label htmlFor="lateCheckOut" className="cursor-pointer">
                      Late Check-out (after 12:00 PM)
                    </Label>
                  </div>
                  <Badge variant="outline">+₹1,500</Badge>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="specialRequests">Special Requests</Label>
              <Textarea 
                id="specialRequests"
                {...form.register('specialRequests')}
                placeholder="Any special requests or requirements..."
                rows={3}
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Booking Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Room</p>
                    <p className="font-semibold">{roomName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Guest</p>
                    <p className="font-semibold">{watchedValues.guestName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Check-in</p>
                    <p className="font-semibold">
                      {watchedValues.checkInDate ? format(watchedValues.checkInDate, "PPP") : "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Check-out</p>
                    <p className="font-semibold">
                      {watchedValues.checkOutDate ? format(watchedValues.checkOutDate, "PPP") : "-"}
                    </p>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Room Rate ({differenceInDays(watchedValues.checkOutDate || new Date(), watchedValues.checkInDate || new Date())} nights)</span>
                      <span>₹{roomPrice * differenceInDays(watchedValues.checkOutDate || new Date(), watchedValues.checkInDate || new Date())}</span>
                    </div>
                    {earlyCheckIn && (
                      <div className="flex justify-between text-sm">
                        <span>Early Check-in</span>
                        <span>₹1,000</span>
                      </div>
                    )}
                    {lateCheckOut && (
                      <div className="flex justify-between text-sm">
                        <span>Late Check-out</span>
                        <span>₹1,500</span>
                      </div>
                    )}
                    <div className="flex justify-between font-bold text-lg border-t pt-2">
                      <span>Total</span>
                      <span>₹{calculateTotal()}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {selectedPreferences.length > 0 && (
              <Card>
                <CardContent className="pt-4">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Room Preferences:</p>
                    <div className="flex flex-wrap gap-1">
                      {selectedPreferences.map(pref => (
                        <Badge key={pref} variant="secondary">{pref}</Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Progress Steps */}
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div className={cn(
              "flex items-center justify-center w-10 h-10 rounded-full border-2",
              currentStep >= step.id 
                ? "bg-primary border-primary text-primary-foreground" 
                : "border-muted-foreground text-muted-foreground"
            )}>
              {currentStep > step.id ? (
                <Check className="h-5 w-5" />
              ) : (
                <step.icon className="h-5 w-5" />
              )}
            </div>
            <div className="ml-2 hidden sm:block">
              <p className={cn(
                "text-sm font-medium",
                currentStep >= step.id ? "text-primary" : "text-muted-foreground"
              )}>
                {step.title}
              </p>
            </div>
            {index < steps.length - 1 && (
              <div className={cn(
                "w-8 h-0.5 mx-4",
                currentStep > step.id ? "bg-primary" : "bg-muted"
              )} />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>{steps[currentStep - 1]?.title}</CardTitle>
          </CardHeader>
          <CardContent>
            {renderStepContent()}
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>

          {currentStep < 4 ? (
            <Button type="button" onClick={handleNext}>
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button type="submit" disabled={isSubmitting} className="bg-gold-500 hover:bg-gold-600">
              {isSubmitting ? "Processing..." : "Complete Booking"}
              <CreditCard className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};

export default EnhancedBookingForm;