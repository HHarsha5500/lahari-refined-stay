
import React, { useState } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { X } from 'lucide-react';

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const galleryImages = [
    {
      src: '/lovable-uploads/9e7edf6b-3424-4c0a-bb7b-e8a4eb347f7b.png',
      alt: 'Hotel Exterior View',
      category: 'Exterior'
    },
    {
      src: '/lovable-uploads/c13863d9-65c8-4dac-a7d3-fd023eeaaa29.png',
      alt: 'Hotel Lobby',
      category: 'Interior'
    },
    {
      src: '/lovable-uploads/440f2aae-df63-4a72-8504-f9f3d70a4a95.png',
      alt: 'Luxury Room',
      category: 'Rooms'
    },
    {
      src: '/lovable-uploads/90e4e1ba-4090-4502-ba8c-0664b36019ae.png',
      alt: 'Hotel Restaurant',
      category: 'Dining'
    },
    {
      src: '/lovable-uploads/fd8f7b52-534f-48c9-840e-4220535bd93f.png',
      alt: 'Conference Hall',
      category: 'Events'
    },
    {
      src: '/lovable-uploads/8864f4e5-1a14-4957-97ce-55d69c203abb.png',
      alt: 'Executive Suite',
      category: 'Suites'
    },
    {
      src: '/lovable-uploads/3583c15e-8dd5-4bb3-8638-19adab420cb8.png',
      alt: 'Hotel Amenities',
      category: 'Amenities'
    },
    {
      src: '/lovable-uploads/4e4742d0-f32b-4031-99ed-01c48bf9a73e.png',
      alt: 'Single Room',
      category: 'Rooms'
    }
  ];

  const categories = ['All', 'Exterior', 'Interior', 'Rooms', 'Suites', 'Dining', 'Events', 'Amenities'];
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredImages = activeCategory === 'All' 
    ? galleryImages 
    : galleryImages.filter(img => img.category === activeCategory);

  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="bg-navy-800 text-white py-20 mt-20">
        <div className="container-custom text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Gallery</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Explore the elegance and luxury of Hotel Lahari International through our photo gallery
          </p>
        </div>
      </section>

      {/* Filter Buttons */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-6 py-3 rounded-full font-medium transition-all ${
                  activeCategory === category
                    ? 'bg-gold-500 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Image Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredImages.map((image, index) => (
              <div
                key={index}
                className="group cursor-pointer overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
                onClick={() => setSelectedImage(image.src)}
              >
                <div className="relative">
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-navy-800/0 group-hover:bg-navy-800/20 transition-all duration-300" />
                  <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="bg-gold-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                      {image.category}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modal for enlarged image */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-4xl max-h-full">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-12 right-0 text-white hover:text-gold-400 transition-colors"
            >
              <X className="w-8 h-8" />
            </button>
            <img
              src={selectedImage}
              alt="Gallery Image"
              className="max-w-full max-h-full object-contain rounded-lg"
            />
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Gallery;
