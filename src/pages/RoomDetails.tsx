import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { 
  ArrowLeft, 
  Users, 
  Wifi, 
  Car, 
  Tv, 
  Coffee, 
  Bath, 
  AirVent,
  Star,
  Calendar,
  IndianRupee
} from 'lucide-react';
import { BookingForm } from '@/components/BookingForm';
import { RoomAvailabilityCalendar } from '@/components/RoomAvailabilityCalendar';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
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

const amenityIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  'Free Wi-Fi': Wifi,
  'Wifi': Wifi,
  'AC': AirVent,
  'Premium AC': AirVent,
  'TV': Tv,
  'Smart TV': Tv,
  'Room Service': Coffee,
  'Mini Bar': Coffee,
  'Parking': Car,
  'Balcony': Bath,
  'Premium Bath': Bath,
  'Living Area': Bath,
  'Kitchenette': Coffee,
  'Concierge': Coffee,
};

// Mock gallery images for each room type
const roomGalleries: Record<string, string[]> = {
  'Single Room': [
    '/lovable-uploads/4e4742d0-f32b-4031-99ed-01c48bf9a73e.png',
    'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1595576508898-0ad5c879a061?w=800&h=600&fit=crop'
  ],
  'Luxury Room': [
    '/lovable-uploads/440f2aae-df63-4a72-8504-f9f3d70a4a95.png',
    'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=600&fit=crop'
  ],
  'Executive Suite': [
    '/lovable-uploads/8864f4e5-1a14-4957-97ce-55d69c203abb.png',
    'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop'
  ]
};

const RoomDetails = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState<Room | null>(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoom = async () => {
      if (!roomId) return;
      
      const { data, error } = await supabase
        .from('rooms')
        .select('*')
        .eq('id', roomId)
        .eq('is_active', true)
        .single();

      if (data && !error) {
        setRoom(data);
      }
      setLoading(false);
    };

    fetchRoom();
  }, [roomId]);

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Room Not Found</h1>
            <Button onClick={() => navigate('/')}>Back to Home</Button>
          </div>
        </div>
      </div>
    );
  }

  const galleryImages = roomGalleries[room.name] || [room.image_url || '/lovable-uploads/4e4742d0-f32b-4031-99ed-01c48bf9a73e.png'];
  const amenities = Array.isArray(room.amenities) ? room.amenities : [];

  return (
    <div className="min-h-screen">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={() => navigate('/')}
          className="mb-6 flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Rooms
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Image Gallery */}
          <div className="space-y-4">
            <Carousel className="w-full">
              <CarouselContent>
                {galleryImages.map((image, index) => (
                  <CarouselItem key={index}>
                    <AspectRatio ratio={4/3}>
                      <img 
                        src={image} 
                        alt={`${room.name} - Image ${index + 1}`}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </AspectRatio>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
            
            {/* Thumbnail Gallery */}
            <div className="grid grid-cols-4 gap-2">
              {galleryImages.slice(0, 4).map((image, index) => (
                <AspectRatio key={index} ratio={1}>
                  <img 
                    src={image} 
                    alt={`${room.name} thumbnail ${index + 1}`}
                    className="w-full h-full object-cover rounded cursor-pointer hover:opacity-80 transition-opacity"
                  />
                </AspectRatio>
              ))}
            </div>
          </div>

          {/* Room Information */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-4xl font-bold text-navy-800">{room.name}</h1>
                <div className="flex items-center space-x-1">
                  <Star className="w-5 h-5 text-gold-500 fill-current" />
                  <span className="text-lg font-semibold">4.8</span>
                </div>
              </div>
              
              <p className="text-lg text-gray-600 mb-6">{room.description}</p>
              
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  <span className="text-sm">Up to {room.max_guests} guests</span>
                </div>
                <div className="flex items-center gap-2">
                  <IndianRupee className="h-5 w-5 text-primary" />
                  <span className="text-2xl font-bold text-primary">{room.base_price}</span>
                  <span className="text-sm text-gray-500">/night</span>
                </div>
              </div>
            </div>

            {/* Amenities */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Amenities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {amenities.map((amenity, index) => {
                    const IconComponent = amenityIcons[amenity] || Coffee;
                    return (
                      <div key={index} className="flex items-center gap-2">
                        <IconComponent className="h-4 w-4 text-primary" />
                        <span className="text-sm">{amenity}</span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Booking Actions */}
            <div className="space-y-4">
              <Button 
                onClick={() => setIsBookingOpen(true)}
                className="w-full bg-gold-500 hover:bg-gold-600 text-white font-semibold py-3 rounded-xl text-lg"
              >
                Book This Room
              </Button>
              
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => document.getElementById('availability')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <Calendar className="h-4 w-4 mr-2" />
                Check Availability
              </Button>
            </div>
          </div>
        </div>

        {/* Availability Calendar */}
        <div id="availability" className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Room Availability</CardTitle>
            </CardHeader>
            <CardContent>
              <RoomAvailabilityCalendar roomId={room.id} />
            </CardContent>
          </Card>
        </div>

        {/* Additional Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Check-in & Check-out</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <h4 className="font-semibold">Check-in</h4>
                <p className="text-gray-600">After 2:00 PM</p>
              </div>
              <div>
                <h4 className="font-semibold">Check-out</h4>
                <p className="text-gray-600">Before 12:00 PM</p>
              </div>
              <div>
                <h4 className="font-semibold">Cancellation</h4>
                <p className="text-gray-600">Free cancellation up to 24 hours before check-in</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>House Rules</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="secondary">No smoking</Badge>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">No pets</Badge>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary">No parties</Badge>
              </div>
              <p className="text-sm text-gray-600 mt-3">
                Quiet hours: 10:00 PM - 8:00 AM
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Booking Dialog */}
      <Dialog open={isBookingOpen} onOpenChange={setIsBookingOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Book {room.name}</DialogTitle>
          </DialogHeader>
          <BookingForm 
            roomId={room.id}
            roomName={room.name}
            roomPrice={room.base_price}
            maxGuests={room.max_guests}
            onSuccess={() => setIsBookingOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default RoomDetails;