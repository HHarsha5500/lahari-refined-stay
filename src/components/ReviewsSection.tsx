import React, { useState, useEffect } from 'react';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const ReviewsSection = () => {
  const [currentReview, setCurrentReview] = useState(0);

  const reviews = [
    {
      id: 1,
      name: "Sarah Johnson",
      location: "Mumbai, India",
      rating: 5,
      text: "Absolutely stunning hotel! The service was impeccable and the rooms were luxurious. The staff went above and beyond to make our stay memorable.",
      image: "https://images.unsplash.com/photo-1582233479366-6d38bc390a08?w=100&h=100&fit=crop&crop=face"
    },
    {
      id: 2,
      name: "Rajesh Kumar",
      location: "Delhi, India",
      rating: 5,
      text: "Best hotel experience I've ever had! The amenities are world-class and the location is perfect. Highly recommend for business and leisure travelers.",
      image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=face"
    },
    {
      id: 3,
      name: "Ananya Patel",
      location: "Mumbai, India",
      rating: 4,
      text: "Beautiful hotel with excellent dining options. The executive suite was spacious and comfortable. Will definitely stay here again on my next visit.",
      image: "https://images.unsplash.com/photo-1614644147798-f8c0fc9da7f6?w=100&h=100&fit=crop&crop=face"
    },
    {
      id: 4,
      name: "Arjun Singh",
      location: "Jaipur, India",
      rating: 5,
      text: "Outstanding hospitality and attention to detail. The conference facilities were top-notch for our corporate event. Truly a premium experience.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
    },
    {
      id: 5,
      name: "Priya Sharma",
      location: "Bangalore, India",
      rating: 5,
      text: "A perfect blend of luxury and comfort. The spa services were rejuvenating and the room service was prompt. Exceeded all expectations!",
      image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100&h=100&fit=crop&crop=face"
    }
  ];

  const nextReview = () => {
    setCurrentReview((prev) => (prev + 1) % reviews.length);
  };

  const prevReview = () => {
    setCurrentReview((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  useEffect(() => {
    const interval = setInterval(nextReview, 5000);
    return () => clearInterval(interval);
  }, []);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-5 h-5 ${
          i < rating 
            ? 'text-gold-500 fill-gold-500' 
            : 'text-muted-foreground'
        } transition-all duration-300`}
      />
    ));
  };

  return (
    <section className="section-padding bg-gradient-to-br from-background via-muted/20 to-background overflow-hidden">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
            Guest Reviews
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover what our valued guests say about their extraordinary experiences at Hotel Lahari International
          </p>
        </div>

        {/* Main Review Display */}
        <div className="relative max-w-4xl mx-auto mb-12">
          <Card className="bg-card/80 backdrop-blur-sm border-border/50 shadow-2xl animate-scale-in">
            <CardContent className="p-8 md:p-12">
              <div className="flex flex-col md:flex-row items-center gap-8">
                {/* Profile Image */}
                <div className="flex-shrink-0 animate-float">
                  <div className="relative">
                    <img
                      src={reviews[currentReview].image}
                      alt={reviews[currentReview].name}
                      className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-gold-500/20 shadow-lg transition-all duration-500"
                    />
                    <div className="absolute -top-2 -right-2 bg-gold-500 rounded-full p-2 animate-pulse">
                      <Quote className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>

                {/* Review Content */}
                <div className="flex-1 text-center md:text-left">
                  <div className="mb-4 animate-slide-in">
                    <div className="flex justify-center md:justify-start mb-2">
                      {renderStars(reviews[currentReview].rating)}
                    </div>
                    <p className="text-lg md:text-xl text-foreground leading-relaxed italic">
                      "{reviews[currentReview].text}"
                    </p>
                  </div>
                  
                  <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
                    <h4 className="font-bold text-xl text-gold-500 mb-1">
                      {reviews[currentReview].name}
                    </h4>
                    <p className="text-muted-foreground">
                      {reviews[currentReview].location}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Navigation Buttons */}
          <button
            onClick={prevReview}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm border border-border rounded-full p-3 shadow-lg hover:bg-gold-500 hover:text-white transition-all duration-300 transform hover:scale-110 animate-slide-in"
            style={{ animationDelay: '0.3s' }}
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          <button
            onClick={nextReview}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm border border-border rounded-full p-3 shadow-lg hover:bg-gold-500 hover:text-white transition-all duration-300 transform hover:scale-110 animate-slide-in"
            style={{ animationDelay: '0.3s' }}
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* Review Dots Indicator */}
        <div className="flex justify-center space-x-3 mb-12 animate-fade-in" style={{ animationDelay: '0.4s' }}>
          {reviews.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentReview(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 transform hover:scale-125 ${
                index === currentReview
                  ? 'bg-gold-500 shadow-lg'
                  : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
              }`}
            />
          ))}
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto animate-scale-in" style={{ animationDelay: '0.5s' }}>
          <div className="text-center group">
            <div className="text-3xl font-bold text-gold-500 mb-2 group-hover:scale-110 transition-transform duration-300">
              4.9
            </div>
            <div className="text-sm text-muted-foreground">Average Rating</div>
          </div>
          
          <div className="text-center group">
            <div className="text-3xl font-bold text-gold-500 mb-2 group-hover:scale-110 transition-transform duration-300">
              1,200+
            </div>
            <div className="text-sm text-muted-foreground">Happy Guests</div>
          </div>
          
          <div className="text-center group">
            <div className="text-3xl font-bold text-gold-500 mb-2 group-hover:scale-110 transition-transform duration-300">
              98%
            </div>
            <div className="text-sm text-muted-foreground">Satisfaction Rate</div>
          </div>
          
          <div className="text-center group">
            <div className="text-3xl font-bold text-gold-500 mb-2 group-hover:scale-110 transition-transform duration-300">
              5 Star
            </div>
            <div className="text-sm text-muted-foreground">Service Quality</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;