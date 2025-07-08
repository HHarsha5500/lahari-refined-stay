
import React from 'react';
import Navigation from '@/components/Navigation';
import HeroSection from '@/components/HeroSection';
import RoomTypes from '@/components/RoomTypes';
import DiningSection from '@/components/DiningSection';
import EventsSection from '@/components/EventsSection';
import ReviewsSection from '@/components/ReviewsSection';
import BookingSection from '@/components/BookingSection';
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
      <BookingSection />
      <Footer />
    </div>
  );
};

export default Index;
