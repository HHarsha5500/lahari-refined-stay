import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Calendar, MapPin, Users, Phone } from 'lucide-react';
import { BookingForm } from './BookingForm';
import { supabase } from '@/integrations/supabase/client';

interface Room {
  id: string;
  name: string;
  description: string;
  base_price: number;
  max_guests: number;
  image_url?: string;
}

const BookingSection = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const fetchRooms = async () => {
      const { data } = await supabase
        .from('rooms')
        .select('*')
        .eq('is_active', true)
        .order('base_price', { ascending: true });
      
      if (data) {
        setRooms(data);
      }
    };

    fetchRooms();
  }, []);

  const handleBookRoom = (room: Room) => {
    setSelectedRoom(room);
    setIsDialogOpen(true);
  };

  return (
    <section className="py-20 bg-background" id="booking">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Book Your Stay</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Experience luxury and comfort at Serenity Hotel. Choose from our available rooms and book instantly.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto mb-12">
          {rooms.map((room) => (
            <Card key={room.id} className="border-2 hover:border-primary/50 transition-colors">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{room.name}</span>
                  <span className="text-primary font-bold">${room.base_price}/night</span>
                </CardTitle>
                <CardDescription>{room.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>Up to {room.max_guests} guests</span>
                </div>
                <Button 
                  onClick={() => handleBookRoom(room)}
                  className="w-full"
                >
                  Book This Room
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Phone className="h-5 w-5 text-primary" />
              Contact Us
            </CardTitle>
            <CardDescription>
              Need assistance? Speak with our reservations team
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <h4 className="font-semibold">Reservations</h4>
                <p className="text-muted-foreground">+1 (555) 123-4567</p>
              </div>
              <div>
                <h4 className="font-semibold">Email</h4>
                <p className="text-muted-foreground">reservations@serenityhotel.com</p>
              </div>
              <div>
                <h4 className="font-semibold">Hours</h4>
                <p className="text-muted-foreground">24/7 Available</p>
              </div>
            </div>
            <Button variant="outline" className="w-full">
              Contact Reservations
            </Button>
          </CardContent>
        </Card>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Book {selectedRoom?.name}</DialogTitle>
            </DialogHeader>
            {selectedRoom && (
              <BookingForm
                roomId={selectedRoom.id}
                roomName={selectedRoom.name}
                roomPrice={selectedRoom.base_price}
                maxGuests={selectedRoom.max_guests}
                onSuccess={() => setIsDialogOpen(false)}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
};

export default BookingSection;