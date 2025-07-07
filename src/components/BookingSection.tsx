
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Users, Clock, Check } from 'lucide-react';
import { toast } from 'sonner';

const BookingSection = () => {
  const [formData, setFormData] = useState({
    checkIn: '',
    checkOut: '',
    guests: '',
    roomType: '',
    name: '',
    email: '',
    phone: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const calculateNights = () => {
    if (formData.checkIn && formData.checkOut) {
      const checkIn = new Date(formData.checkIn);
      const checkOut = new Date(formData.checkOut);
      const diffTime = checkOut.getTime() - checkIn.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays > 0 ? diffDays : 0;
    }
    return 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.checkIn || !formData.checkOut || !formData.guests || !formData.roomType || !formData.name || !formData.email) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Check if check-in is not in the past
    const checkInDate = new Date(formData.checkIn);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (checkInDate < today) {
      toast.error('Check-in date cannot be in the past');
      return;
    }

    // Check if check-out is after check-in
    const checkOutDate = new Date(formData.checkOut);
    if (checkOutDate <= checkInDate) {
      toast.error('Check-out date must be after check-in date');
      return;
    }

    toast.success('Booking request submitted successfully! We will contact you shortly.');
    console.log('Booking data:', formData);
  };

  const nights = calculateNights();

  return (
    <section className="section-padding bg-gradient-to-br from-gold-50 to-navy-50">
      <div className="container-custom">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold text-navy-800 mb-4">
            Book Your Perfect Stay
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Reserve your stay in 2 minutes. Experience luxury and comfort at Hotel Lahari International.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-gold-500 to-gold-600 text-white rounded-t-lg">
              <CardTitle className="text-2xl font-bold flex items-center justify-center space-x-2">
                <Calendar className="w-6 h-6" />
                <span>Make a Reservation</span>
              </CardTitle>
            </CardHeader>
            
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Date Selection */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="checkIn" className="text-navy-800 font-semibold">
                      Check-in Date *
                    </Label>
                    <Input
                      id="checkIn"
                      type="date"
                      value={formData.checkIn}
                      onChange={(e) => handleInputChange('checkIn', e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="border-gray-300 focus:border-gold-500 focus:ring-gold-500"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="checkOut" className="text-navy-800 font-semibold">
                      Check-out Date *
                    </Label>
                    <Input
                      id="checkOut"
                      type="date"
                      value={formData.checkOut}
                      onChange={(e) => handleInputChange('checkOut', e.target.value)}
                      min={formData.checkIn || new Date().toISOString().split('T')[0]}
                      className="border-gray-300 focus:border-gold-500 focus:ring-gold-500"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-navy-800 font-semibold">Nights</Label>
                    <div className="flex items-center h-10 px-3 bg-gray-50 border border-gray-300 rounded-md">
                      <Clock className="w-4 h-4 text-gold-500 mr-2" />
                      <span className="font-semibold text-navy-800">
                        {nights} {nights === 1 ? 'Night' : 'Nights'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Room and Guest Selection */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-navy-800 font-semibold">
                      Number of Guests *
                    </Label>
                    <Select value={formData.guests} onValueChange={(value) => handleInputChange('guests', value)}>
                      <SelectTrigger className="border-gray-300 focus:border-gold-500">
                        <SelectValue placeholder="Select guests" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 Guest</SelectItem>
                        <SelectItem value="2">2 Guests</SelectItem>
                        <SelectItem value="3">3 Guests</SelectItem>
                        <SelectItem value="4">4 Guests</SelectItem>
                        <SelectItem value="5+">5+ Guests</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-navy-800 font-semibold">
                      Room Type *
                    </Label>
                    <Select value={formData.roomType} onValueChange={(value) => handleInputChange('roomType', value)}>
                      <SelectTrigger className="border-gray-300 focus:border-gold-500">
                        <SelectValue placeholder="Select room type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="single">Single Room - ₹3,500/night</SelectItem>
                        <SelectItem value="luxury">Luxury Room - ₹6,800/night</SelectItem>
                        <SelectItem value="executive">Executive Suite - ₹12,000/night</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Guest Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-navy-800 border-b border-gray-200 pb-2">
                    Guest Information
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-navy-800 font-semibold">
                        Full Name *
                      </Label>
                      <Input
                        id="name"
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className="border-gray-300 focus:border-gold-500 focus:ring-gold-500"
                        placeholder="Enter your full name"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-navy-800 font-semibold">
                        Email Address *
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="border-gray-300 focus:border-gold-500 focus:ring-gold-500"
                        placeholder="Enter your email"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-navy-800 font-semibold">
                        Phone Number
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        className="border-gray-300 focus:border-gold-500 focus:ring-gold-500"
                        placeholder="Enter your phone number"
                      />
                    </div>
                  </div>
                </div>

                {/* Booking Summary */}
                {nights > 0 && formData.roomType && (
                  <div className="bg-gradient-to-r from-gold-50 to-navy-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-navy-800 mb-4 flex items-center">
                      <Check className="w-5 h-5 text-gold-500 mr-2" />
                      Booking Summary
                    </h3>
                    <div className="space-y-2 text-gray-700">
                      <p>Room: <span className="font-semibold">{formData.roomType.charAt(0).toUpperCase() + formData.roomType.slice(1)} Room</span></p>
                      <p>Duration: <span className="font-semibold">{nights} nights</span></p>
                      <p>Guests: <span className="font-semibold">{formData.guests}</span></p>
                    </div>
                  </div>
                )}

                <Button 
                  type="submit" 
                  className="w-full bg-gold-500 hover:bg-gold-600 text-white font-bold py-4 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Complete Booking Request
                </Button>

                <p className="text-sm text-gray-500 text-center">
                  * Required fields. We'll contact you within 24 hours to confirm your booking.
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default BookingSection;
