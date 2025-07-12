
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';

const HeroSection = () => {
  return (
    <section id="home" className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/lovable-uploads/c13863d9-65c8-4dac-a7d3-fd023eeaaa29.png"
          alt="Hotel Lahari International Exterior"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 hero-gradient"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
        <div className="animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight animate-float">
            Hotel Lahari
            <span className="block text-gold-400">International</span>
          </h1>
          
          <p className="text-xl md:text-2xl mb-4 font-light animate-slide-in">
            A Premium Stay in the Heart of the City
          </p>
          
          <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '0.3s' }}>
            Where elegance meets comfort. Experience luxury redefined with our world-class amenities, 
            exceptional service, and sophisticated accommodations.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-scale-in" style={{ animationDelay: '0.5s' }}>
            <Button 
              size="lg" 
              onClick={() => {
                const roomsSection = document.getElementById('rooms');
                roomsSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
              className="bg-gold-500 hover:bg-gold-600 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              Book Now
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => {
                const roomsSection = document.getElementById('rooms');
                roomsSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
              className="border-white text-white hover:bg-white hover:text-navy-800 px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-300 transform hover:scale-105"
            >
              Explore Rooms
            </Button>
          </div>
          
          <p className="text-sm mt-6 opacity-75 animate-fade-in" style={{ animationDelay: '0.7s' }}>
            Reserve your stay in 2 minutes
          </p>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <ChevronDown className="w-8 h-8 text-white opacity-75" />
      </div>
    </section>
  );
};

export default HeroSection;
