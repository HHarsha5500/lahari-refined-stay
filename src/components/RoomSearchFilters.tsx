import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { CalendarIcon, Search, Filter, X, Users, IndianRupee } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface SearchFilters {
  checkIn: Date | null;
  checkOut: Date | null;
  guests: number;
  minPrice: number;
  maxPrice: number;
  amenities: string[];
}

interface RoomSearchFiltersProps {
  filters: SearchFilters;
  onFiltersChange: (filters: Partial<SearchFilters>) => void;
  onClearFilters: () => void;
  loading?: boolean;
}

const availableAmenities = [
  'Free Wi-Fi',
  'AC',
  'TV',
  'Room Service',
  'Mini Bar',
  'Parking',
  'Balcony',
  'Premium Bath',
  'Living Area',
  'Kitchenette',
  'Concierge'
];

const RoomSearchFilters = ({ 
  filters, 
  onFiltersChange, 
  onClearFilters, 
  loading = false 
}: RoomSearchFiltersProps) => {
  const handleDateSelect = (date: Date | undefined, type: 'checkIn' | 'checkOut') => {
    if (date) {
      onFiltersChange({ [type]: date });
    }
  };

  const handleAmenityToggle = (amenity: string) => {
    const newAmenities = filters.amenities.includes(amenity)
      ? filters.amenities.filter(a => a !== amenity)
      : [...filters.amenities, amenity];
    onFiltersChange({ amenities: newAmenities });
  };

  const handlePriceChange = (values: number[]) => {
    onFiltersChange({ minPrice: values[0], maxPrice: values[1] });
  };

  const hasActiveFilters = filters.checkIn || filters.checkOut || 
    filters.guests > 1 || filters.minPrice > 0 || filters.maxPrice < 15000 || 
    filters.amenities.length > 0;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5" />
          Search & Filters
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Date Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Check-in Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !filters.checkIn && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {filters.checkIn ? format(filters.checkIn, "PPP") : "Select check-in"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={filters.checkIn || undefined}
                  onSelect={(date) => handleDateSelect(date, 'checkIn')}
                  disabled={(date) => date < new Date()}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label>Check-out Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !filters.checkOut && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {filters.checkOut ? format(filters.checkOut, "PPP") : "Select check-out"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={filters.checkOut || undefined}
                  onSelect={(date) => handleDateSelect(date, 'checkOut')}
                  disabled={(date) => date < new Date() || (filters.checkIn && date <= filters.checkIn)}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Guests Selection */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Number of Guests
          </Label>
          <Select 
            value={filters.guests.toString()} 
            onValueChange={(value) => onFiltersChange({ guests: parseInt(value) })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[1, 2, 3, 4, 5, 6].map(num => (
                <SelectItem key={num} value={num.toString()}>
                  {num} {num === 1 ? 'Guest' : 'Guests'}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Price Range */}
        <div className="space-y-3">
          <Label className="flex items-center gap-2">
            <IndianRupee className="h-4 w-4" />
            Price Range (per night)
          </Label>
          <div className="px-2">
            <Slider
              value={[filters.minPrice, filters.maxPrice]}
              onValueChange={handlePriceChange}
              max={15000}
              min={0}
              step={500}
              className="w-full"
            />
          </div>
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>₹{filters.minPrice}</span>
            <span>₹{filters.maxPrice}</span>
          </div>
        </div>

        {/* Amenities Filter */}
        <div className="space-y-3">
          <Label className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Amenities
          </Label>
          <div className="grid grid-cols-2 gap-2">
            {availableAmenities.map(amenity => (
              <div key={amenity} className="flex items-center space-x-2">
                <Checkbox
                  id={amenity}
                  checked={filters.amenities.includes(amenity)}
                  onCheckedChange={() => handleAmenityToggle(amenity)}
                />
                <Label htmlFor={amenity} className="text-sm cursor-pointer">
                  {amenity}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="space-y-2">
            <Label>Active Filters</Label>
            <div className="flex flex-wrap gap-2">
              {filters.checkIn && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Check-in: {format(filters.checkIn, "MMM dd")}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => onFiltersChange({ checkIn: null })}
                  />
                </Badge>
              )}
              {filters.checkOut && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  Check-out: {format(filters.checkOut, "MMM dd")}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => onFiltersChange({ checkOut: null })}
                  />
                </Badge>
              )}
              {filters.guests > 1 && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  {filters.guests} Guests
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => onFiltersChange({ guests: 1 })}
                  />
                </Badge>
              )}
              {(filters.minPrice > 0 || filters.maxPrice < 15000) && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  ₹{filters.minPrice} - ₹{filters.maxPrice}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => onFiltersChange({ minPrice: 0, maxPrice: 15000 })}
                  />
                </Badge>
              )}
              {filters.amenities.map(amenity => (
                <Badge key={amenity} variant="secondary" className="flex items-center gap-1">
                  {amenity}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => handleAmenityToggle(amenity)}
                  />
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <Button 
            variant="outline" 
            onClick={onClearFilters}
            className="w-full"
            disabled={loading}
          >
            <X className="h-4 w-4 mr-2" />
            Clear All Filters
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default RoomSearchFilters;