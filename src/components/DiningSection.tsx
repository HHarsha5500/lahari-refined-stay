
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, Users, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DiningSection = () => {
  const navigate = useNavigate();
  
  const diningOptions = [
    {
      name: 'Fine Dining Restaurant',
      image: '/lovable-uploads/fd8f7b52-534f-48c9-840e-4220535bd93f.png',
      description: 'Experience culinary excellence with our award-winning restaurant featuring international and local cuisines.',
      timing: '7:00 AM - 11:00 PM',
      capacity: '120 Guests',
      rating: 4.9,
      highlights: ['Live Cooking', 'Premium Ingredients', 'Expert Chefs', 'Wine Pairing']
    },
    {
      name: 'Premium Bar & Lounge',
      image: '/lovable-uploads/9e7edf6b-3424-4c0a-bb7b-e8a4eb347f7b.png',
      description: 'Unwind at our sophisticated bar with premium spirits, crafted cocktails, and relaxing ambiance.',
      timing: '6:00 PM - 2:00 AM',
      capacity: '80 Guests',
      rating: 4.8,
      highlights: ['Craft Cocktails', 'Premium Spirits', 'Live Music', 'City Views']
    }
  ];

  return (
    <section id="dining" className="section-padding bg-white">
      <div className="container-custom">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold text-navy-800 mb-4">
            Exceptional Dining Experience
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Savor the finest flavors in our elegant dining spaces. From international cuisine to premium beverages, 
            every meal is a celebration of taste and sophistication.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {diningOptions.map((option, index) => (
            <div key={index} className={`animate-slide-in ${index % 2 === 1 ? 'lg:order-2' : ''}`}>
              <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300">
                <div className="relative">
                  <img
                    src={option.image}
                    alt={option.name}
                    className="w-full h-80 object-cover"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 flex items-center space-x-1">
                    <Star className="w-4 h-4 text-gold-500 fill-current" />
                    <span className="text-sm font-semibold">{option.rating}</span>
                  </div>
                </div>

                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold text-navy-800 mb-4">
                    {option.name}
                  </h3>
                  
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {option.description}
                  </p>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Clock className="w-5 h-5 text-gold-500" />
                      <div>
                        <p className="text-sm font-medium">Operating Hours</p>
                        <p className="text-sm">{option.timing}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Users className="w-5 h-5 text-gold-500" />
                      <div>
                        <p className="text-sm font-medium">Capacity</p>
                        <p className="text-sm">{option.capacity}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h4 className="font-semibold text-navy-800 mb-3">Highlights</h4>
                    <div className="flex flex-wrap gap-2">
                      {option.highlights.map((highlight) => (
                        <span
                          key={highlight}
                          className="px-3 py-1 bg-gold-100 text-gold-800 text-sm rounded-full font-medium"
                        >
                          {highlight}
                        </span>
                      ))}
                    </div>
                  </div>

                  <Button 
                    onClick={() => navigate('/contact')}
                    className="w-full bg-gold-500 hover:bg-gold-600 text-white font-semibold py-3 rounded-xl"
                  >
                    View Menu & Reserve
                  </Button>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-gold-50 to-navy-50 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-navy-800 mb-4">
              Special Dining Packages
            </h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Enjoy exclusive dining experiences with our curated packages. Perfect for romantic dinners, 
              business meals, and special celebrations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => navigate('/contact')}
                variant="outline" 
                className="border-gold-500 text-gold-600 hover:bg-gold-50"
              >
                Romantic Dinner Package
              </Button>
              <Button 
                onClick={() => navigate('/contact')}
                variant="outline" 
                className="border-navy-500 text-navy-600 hover:bg-navy-50"
              >
                Business Lunch Menu
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DiningSection;
