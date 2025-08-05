import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Star, Users, Eye } from 'lucide-react';
import { BookingForm } from './BookingForm';
import { RoomAvailabilityCalendar } from './RoomAvailabilityCalendar';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
interface Room {
  id: string;
  name: string;
  description: string;
  base_price: number;
  max_guests: number;
  image_url?: string;
}
const RoomTypes = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchRooms = async () => {
      const {
        data
      } = await supabase.from('rooms').select('*').eq('is_active', true).order('base_price', {
        ascending: true
      });
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
  return <section id="rooms" className="section-padding bg-gray-50">
      <div className="container-custom">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold text-navy-800 mb-4">
            Luxury Accommodations
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Unwind in comfort. Choose your perfect stay from our collection of elegantly designed rooms and suites.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {rooms.map((room, index) => <Card key={room.id} className="overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 animate-slide-in border-2 hover:border-primary/50" style={{
          animationDelay: `${index * 0.2}s`
        }}>
              <div className="relative">
                <img src={room.image_url || '/lovable-uploads/4e4742d0-f32b-4031-99ed-01c48bf9a73e.png'} alt={room.name} className="w-full h-64 object-cover" />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1 flex items-center space-x-1">
                  <Star className="w-4 h-4 text-gold-500 fill-current" />
                  <span className="text-sm font-semibold">4.8</span>
                </div>
              </div>

              <CardHeader className="pb-3">
                <CardTitle className="text-xl font-bold text-navy-800 flex items-center justify-between">
                  <span>{room.name}</span>
                  <span className="text-primary font-bold">{room.base_price}/night</span>
                </CardTitle>
                <p className="text-gray-600 text-sm">{room.description}</p>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>Up to {room.max_guests} guests</span>
                </div>

                

                <div className="flex gap-2">
                  <Button 
                    onClick={() => navigate(`/room/${room.id}`)} 
                    variant="outline" 
                    className="flex-1"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                  <Button 
                    onClick={() => handleBookRoom(room)} 
                    className="flex-1 bg-gold-500 hover:bg-gold-600 text-white font-semibold rounded-xl"
                  >
                    Book Now
                  </Button>
                </div>
              </CardContent>
            </Card>)}
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Book {selectedRoom?.name}</DialogTitle>
            </DialogHeader>
            {selectedRoom && <BookingForm roomId={selectedRoom.id} roomName={selectedRoom.name} roomPrice={selectedRoom.base_price} maxGuests={selectedRoom.max_guests} onSuccess={() => setIsDialogOpen(false)} />}
          </DialogContent>
        </Dialog>
      </div>
    </section>;
};
export default RoomTypes;