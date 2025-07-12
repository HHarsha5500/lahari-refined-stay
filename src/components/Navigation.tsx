
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X, User, LogOut, UserCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
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
              <div className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className={`p-2 ${isScrolled ? 'text-navy-700 hover:text-gold-500' : 'text-white hover:text-gold-400'}`}
                >
                  <Menu className="w-6 h-6" />
                </Button>
                
                {isProfileMenuOpen && (
                  <div className="absolute right-0 top-12 w-64 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50 animate-fade-in">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <div className="flex items-center space-x-3">
                        <UserCircle className="w-8 h-8 text-gold-500" />
                        <div>
                          <p className="text-sm font-semibold text-navy-800">Welcome!</p>
                          <p className="text-xs text-gray-600 truncate">{user.email}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="py-1">
                      <Link
                        to="/profile"
                        className="flex items-center px-4 py-2 text-sm text-navy-700 hover:bg-gray-50 hover:text-gold-500 transition-colors"
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        <User className="w-4 h-4 mr-3" />
                        My Profile
                      </Link>
                      
                      <Link
                        to="/bookings"
                        className="flex items-center px-4 py-2 text-sm text-navy-700 hover:bg-gray-50 hover:text-gold-500 transition-colors"
                        onClick={() => setIsProfileMenuOpen(false)}
                      >
                        <UserCircle className="w-4 h-4 mr-3" />
                        My Bookings
                      </Link>
                      
                      <button
                        onClick={() => {
                          setIsProfileMenuOpen(false);
                          signOut();
                        }}
                        className="flex items-center w-full px-4 py-2 text-sm text-navy-700 hover:bg-gray-50 hover:text-red-500 transition-colors"
                      >
                        <LogOut className="w-4 h-4 mr-3" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
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
