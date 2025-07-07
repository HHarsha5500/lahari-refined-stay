import React from 'react';
import { Phone, MapPin, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
const Footer = () => {
  return <footer className="bg-navy-800 text-white">
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Hotel Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-6 px-0 mx-[13px]">
              
              <div>
                <h3 className="text-xl font-bold">Hotel Lahari International</h3>
                <p className="text-gold-400">Extent Your Happiness</p>
              </div>
            </div>
            
            <p className="text-gray-300 mb-6 max-w-md px-0 font-normal mx-[13px]">
              Experience luxury and comfort at Hotel Lahari International. Where elegance meets exceptional service for an unforgettable stay.
            </p>
          </div>

          {/* Contact Information */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-gold-400 mt-1 flex-shrink-0" />
                <p className="text-gray-300">
                  Dubbak - Kanteshwar Rd, beside Royaloak, Nizamabad, Telangana 503001
                </p>
              </div>
              
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-gold-400" />
                <div className="text-gray-300">
                  <p>+919888648886</p>
                  <p>08462-243366</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-gold-400" />
                <p className="text-gray-300">info@laharihotel.com</p>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <div className="space-y-2">
              <Link to="/#home" className="block text-gray-300 hover:text-gold-400 transition-colors">
                Home
              </Link>
              <Link to="/#rooms" className="block text-gray-300 hover:text-gold-400 transition-colors">
                Rooms
              </Link>
              <Link to="/#dining" className="block text-gray-300 hover:text-gold-400 transition-colors">
                Dining
              </Link>
              <Link to="/#events" className="block text-gray-300 hover:text-gold-400 transition-colors">
                Events
              </Link>
              <Link to="/privacy-policy" className="block text-gray-300 hover:text-gold-400 transition-colors">
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              © 2024 Hotel Lahari International. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <Link to="/privacy-policy" className="text-gray-400 hover:text-gold-400 text-sm transition-colors">
                Privacy Policy
              </Link>
              <Link to="/privacy-policy" className="text-gray-400 hover:text-gold-400 text-sm transition-colors">
                Terms of Use
              </Link>
              <Link to="/privacy-policy" className="text-gray-400 hover:text-gold-400 text-sm transition-colors">
                Booking Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>;
};
export default Footer;