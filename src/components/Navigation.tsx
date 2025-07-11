
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X, User, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, signOut } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Home', href: '#home' },
    { name: 'Rooms', href: '#rooms' },
    { name: 'Dining', href: '#dining' },
    { name: 'Events', href: '#events' },
    { name: 'Gallery', href: '/gallery' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
    }`}>
      <div className="container-custom">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link 
            to="/" 
            aria-label="Go to homepage"
            className="flex items-center space-x-3 hover:opacity-80 transition-opacity cursor-pointer"
          >
            <img 
              src="/lovable-uploads/045bfd91-ee7f-44de-a642-f20bb4e9958e.png" 
              alt="Hotel Lahari International" 
              className="h-10 w-auto"
            />
            <div className="hidden sm:block">
              <h2 className={`text-xl font-bold transition-colors ${
                isScrolled ? 'text-navy-800' : 'text-white'
              }`}>
                Hotel Lahari International
              </h2>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => (
              item.href.startsWith('#') ? (
                <a
                  key={item.name}
                  href={item.href}
                  className={`font-medium transition-colors hover:text-gold-500 ${
                    isScrolled ? 'text-navy-700' : 'text-white'
                  }`}
                >
                  {item.name}
                </a>
              ) : (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`font-medium transition-colors hover:text-gold-500 ${
                    isScrolled ? 'text-navy-700' : 'text-white'
                  }`}
                >
                  {item.name}
                </Link>
              )
            ))}
            
            {user ? (
              <div className="flex items-center space-x-4">
                <Link 
                  to="/bookings"
                  className={`font-medium transition-colors hover:text-gold-500 ${
                    isScrolled ? 'text-navy-700' : 'text-white'
                  }`}
                >
                  Bookings
                </Link>
                <span className={`text-sm ${isScrolled ? 'text-navy-700' : 'text-white'}`}>
                  Welcome, {user.email}
                </span>
                <Button 
                  onClick={signOut}
                  variant="outline"
                  size="sm"
                  className="border-gold-500 text-gold-500 hover:bg-gold-500 hover:text-white"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <Link to="/auth">
                <Button className="bg-gold-500 hover:bg-gold-600 text-white px-6">
                  <User className="w-4 h-4 mr-2" />
                  Sign In
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className={`h-6 w-6 ${isScrolled ? 'text-navy-800' : 'text-white'}`} />
            ) : (
              <Menu className={`h-6 w-6 ${isScrolled ? 'text-navy-800' : 'text-white'}`} />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-200">
            <div className="py-4 space-y-4">
              {navItems.map((item) => (
                item.href.startsWith('#') ? (
                  <a
                    key={item.name}
                    href={item.href}
                    className="block px-4 py-2 text-navy-700 hover:text-gold-500 font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.name}
                  </a>
                ) : (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="block px-4 py-2 text-navy-700 hover:text-gold-500 font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                )
              ))}
              <div className="px-4 space-y-2">
                {user ? (
                  <>
                    <Link
                      to="/bookings"
                      className="block px-4 py-2 text-navy-700 hover:text-gold-500 font-medium"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Bookings
                    </Link>
                    <div className="text-sm text-navy-700 mb-2">
                      Welcome, {user.email}
                    </div>
                    <Button 
                      onClick={signOut}
                      variant="outline"
                      className="w-full border-gold-500 text-gold-500 hover:bg-gold-500 hover:text-white"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <Link to="/auth" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button className="w-full bg-gold-500 hover:bg-gold-600 text-white">
                      <User className="w-4 h-4 mr-2" />
                      Sign In
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
