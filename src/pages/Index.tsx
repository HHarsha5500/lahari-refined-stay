
import React from 'react';
import Navigation from '@/components/Navigation';
import HeroSection from '@/components/HeroSection';
import RoomTypes from '@/components/RoomTypes';
import DiningSection from '@/components/DiningSection';
import EventsSection from '@/components/EventsSection';
import ReviewsSection from '@/components/ReviewsSection';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <HeroSection />
      <RoomTypes />
      <DiningSection />
      <EventsSection />
      <ReviewsSection />
      <Footer />
    </div>
  );
};

export default Index;
