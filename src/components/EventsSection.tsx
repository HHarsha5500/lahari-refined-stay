
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Users, Calendar, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const EventsSection = () => {
  const navigate = useNavigate();
  
  const eventTypes = [
    {
      id: 'weddings',
      title: 'Weddings',
      description: 'Create magical moments with our elegant wedding venues and comprehensive planning services.',
      image: '/lovable-uploads/90e4e1ba-4090-4502-ba8c-0664b36019ae.png',
      capacity: '300 Guests',
      features: ['Bridal Suite', 'Decoration Service', 'Wedding Coordinator', 'Photography Support', 'Catering Options']
    },
    {
      id: 'corporate',
      title: 'Corporate Events',
      description: 'Professional venues equipped with modern technology for successful business gatherings.',
      image: '/lovable-uploads/3583c15e-8dd5-4bb3-8638-19adab420cb8.png',
      capacity: '200 Guests',
      features: ['AV Equipment', 'High-Speed WiFi', 'Business Center', 'Catering Service', 'Parking Facilities']
    },
    {
      id: 'celebrations',
      title: 'Celebrations',
      description: 'Perfect spaces for birthdays, anniversaries, and all your special milestone celebrations.',
      image: '/lovable-uploads/90e4e1ba-4090-4502-ba8c-0664b36019ae.png',
      capacity: '150 Guests',
      features: ['Flexible Layouts', 'Entertainment Support', 'Custom Decoration', 'Special Menus', 'Event Coordination']
    }
  ];

  return (
    <section id="events" className="section-padding bg-gradient-to-br from-navy-50 to-gold-50">
      <div className="container-custom">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold text-navy-800 mb-4">
            Unforgettable Events & Celebrations
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Host memories that last a lifetime in our sophisticated event spaces. From intimate gatherings 
            to grand celebrations, we make every occasion extraordinary.
          </p>
        </div>

        <Tabs defaultValue="weddings" className="w-full">
          <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto mb-12 bg-white shadow-lg rounded-xl p-1">
            {eventTypes.map((type) => (
              <TabsTrigger 
                key={type.id} 
                value={type.id}
                className="rounded-lg data-[state=active]:bg-gold-500 data-[state=active]:text-white font-semibold"
              >
                {type.title}
              </TabsTrigger>
            ))}
          </TabsList>

          {eventTypes.map((type) => (
            <TabsContent key={type.id} value={type.id} className="animate-fade-in">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="relative order-2 lg:order-2">
                  <img
                    src={type.image}
                    alt={`${type.title} venue`}
                    className="w-full h-96 object-cover rounded-2xl shadow-2xl"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl"></div>
                </div>

                <div className="space-y-6 order-1 lg:order-1">
                  <div>
                    <h3 className="text-3xl font-bold text-navy-800 mb-4">
                      {type.title}
                    </h3>
                    <p className="text-lg text-gray-600 leading-relaxed">
                      {type.description}
                    </p>
                  </div>

                  <div className="flex items-center space-x-6">
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Users className="w-5 h-5 text-gold-500" />
                      <span className="font-medium">Up to {type.capacity}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Star className="w-5 h-5 text-gold-500" />
                      <span className="font-medium">Premium Service</span>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-bold text-navy-800 mb-3">What's Included:</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {type.features.map((feature) => (
                        <div key={feature} className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-gold-500 rounded-full"></div>
                          <span className="text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button 
                      onClick={() => navigate('/contact')}
                      className="bg-gold-500 hover:bg-gold-600 text-white font-semibold px-8 py-3 rounded-xl"
                    >
                      Book an Event
                    </Button>
                    <Button 
                      onClick={() => navigate('/contact')}
                      variant="outline" 
                      className="border-navy-500 text-navy-600 hover:bg-navy-50 font-semibold px-8 py-3 rounded-xl"
                    >
                      Download Brochure
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>

        <div className="mt-16 text-center">
          <Card className="bg-white/80 backdrop-blur-sm border-gold-200 shadow-xl">
            <CardHeader>
              <CardTitle className="text-2xl text-navy-800 flex items-center justify-center space-x-2">
                <Calendar className="w-6 h-6 text-gold-500" />
                <span>Event Planning Services</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                Our experienced event coordinators will help you plan every detail to perfection. 
                From venue selection to catering, decoration, and entertainment - we handle it all.
              </p>
              <Button 
                onClick={() => navigate('/contact')}
                className="bg-navy-800 hover:bg-navy-700 text-white font-semibold px-8 py-3 rounded-xl"
              >
                Schedule a Consultation
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default EventsSection;
