
import React from 'react';
import Navigation from '@/components/Navigation';
import HeroSection from '@/components/HeroSection';
import RoomTypes from '@/components/RoomTypes';
import DiningSection from '@/components/DiningSection';
import EventsSection from '@/components/EventsSection';
import BookingSection from '@/components/BookingSection';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <HeroSection />
      <RoomTypes />
      <DiningSection />
      <EventsSection />
      <BookingSection />
    </div>
  );
};

export default Index;
