
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, Users, Wifi, Car } from 'lucide-react';

const RoomTypes = () => {
  const rooms = [
    {
      id: 1,
      name: 'Single Room',
      image: '/lovable-uploads/4e4742d0-f32b-4031-99ed-01c48bf9a73e.png',
      price: '₹3,500',
      originalPrice: '₹4,200',
      rating: 4.8,
      guests: '1 Guest',
      features: ['Free Wi-Fi', 'AC', 'TV', 'Room Service'],
      description: 'Perfect for solo travelers seeking comfort and convenience.',
    },
    {
      id: 2,
      name: 'Luxury Room',
      image: '/lovable-uploads/440f2aae-df63-4a72-8504-f9f3d70a4a95.png',
      price: '₹6,800',
      originalPrice: '₹8,500',
      rating: 4.9,
      guests: '2 Guests',
      features: ['Free Wi-Fi', 'Premium AC', 'Smart TV', 'Mini Bar', 'Balcony'],
      description: 'Spacious luxury accommodation with premium amenities and city views.',
    },
    {
      id: 3,
      name: 'Executive Suite',
      image: '/lovable-uploads/8864f4e5-1a14-4957-97ce-55d69c203abb.png',
      price: '₹12,000',
      originalPrice: '₹15,000',
      rating: 5.0,
      guests: '4 Guests',
      features: ['Free Wi-Fi', 'Living Area', 'Kitchenette', 'Premium Bath', 'Concierge'],
      description: 'Ultimate luxury suite with separate living area and exclusive services.',
    },
  ];

  return (
    <section id="rooms" className="section-padding bg-gray-50">
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
          {rooms.map((room, index) => (
            <Card 
              key={room.id} 
              className="overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 animate-slide-in"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="relative">
                <img
                  src={room.image}
                  alt={room.name}
                  className="w-full h-64 object-cover"
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1 flex items-center space-x-1">
                  <Star className="w-4 h-4 text-gold-500 fill-current" />
                  <span className="text-sm font-semibold">{room.rating}</span>
                </div>
              </div>

              <CardHeader className="pb-3">
                <CardTitle className="text-xl font-bold text-navy-800">
                  {room.name}
                </CardTitle>
                <p className="text-gray-600 text-sm">{room.description}</p>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Users className="w-4 h-4" />
                    <span className="text-sm">{room.guests}</span>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500 line-through">
                        {room.originalPrice}
                      </span>
                      <span className="text-2xl font-bold text-gold-600">
                        {room.price}
                      </span>
                    </div>
                    <span className="text-sm text-gray-500">per night</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {room.features.map((feature) => (
                    <span
                      key={feature}
                      className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                    >
                      {feature}
                    </span>
                  ))}
                </div>

                <Button className="w-full bg-gold-500 hover:bg-gold-600 text-white font-semibold py-3 rounded-xl">
                  Book This Room
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RoomTypes;
