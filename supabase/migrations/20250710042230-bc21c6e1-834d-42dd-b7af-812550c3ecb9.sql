-- Create enum types for booking and payment status
CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'cancelled', 'checked_in', 'checked_out');
CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'failed', 'refunded');

-- Create rooms table
CREATE TABLE public.rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  base_price DECIMAL(10,2) NOT NULL,
  max_guests INTEGER NOT NULL DEFAULT 2,
  amenities JSONB DEFAULT '[]',
  image_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create bookings table
CREATE TABLE public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(user_id) ON DELETE SET NULL,
  room_id UUID REFERENCES public.rooms(id) ON DELETE CASCADE NOT NULL,
  guest_name TEXT NOT NULL,
  guest_email TEXT NOT NULL,
  guest_phone TEXT,
  check_in_date DATE NOT NULL,
  check_out_date DATE NOT NULL,
  num_guests INTEGER NOT NULL DEFAULT 1,
  total_amount DECIMAL(10,2) NOT NULL,
  booking_status booking_status NOT NULL DEFAULT 'pending',
  payment_status payment_status NOT NULL DEFAULT 'pending',
  stripe_session_id TEXT,
  stripe_payment_intent_id TEXT,
  special_requests TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  
  -- Ensure check-out is after check-in
  CONSTRAINT valid_date_range CHECK (check_out_date > check_in_date),
  -- Ensure positive guest count
  CONSTRAINT valid_guest_count CHECK (num_guests > 0),
  -- Ensure positive amount
  CONSTRAINT valid_amount CHECK (total_amount > 0)
);

-- Enable Row Level Security
ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for rooms (public read access for browsing)
CREATE POLICY "Anyone can view active rooms" ON public.rooms
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admin can manage rooms" ON public.rooms
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE user_id = auth.uid() 
      AND (preferences->>'role')::text = 'admin'
    )
  );

-- RLS Policies for bookings
CREATE POLICY "Users can view their own bookings" ON public.bookings
  FOR SELECT USING (
    user_id = auth.uid() OR 
    guest_email = (
      SELECT email FROM auth.users WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can create bookings" ON public.bookings
  FOR INSERT WITH CHECK (
    user_id = auth.uid() OR user_id IS NULL
  );

CREATE POLICY "Users can update their own bookings" ON public.bookings
  FOR UPDATE USING (
    user_id = auth.uid() OR 
    guest_email = (
      SELECT email FROM auth.users WHERE id = auth.uid()
    )
  );

CREATE POLICY "Admin can view all bookings" ON public.bookings
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE user_id = auth.uid() 
      AND (preferences->>'role')::text = 'admin'
    )
  );

CREATE POLICY "Admin can manage all bookings" ON public.bookings
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE user_id = auth.uid() 
      AND (preferences->>'role')::text = 'admin'
    )
  );

-- Create indexes for efficient querying
CREATE INDEX idx_bookings_dates ON public.bookings(check_in_date, check_out_date);
CREATE INDEX idx_bookings_room_id ON public.bookings(room_id);
CREATE INDEX idx_bookings_user_id ON public.bookings(user_id);
CREATE INDEX idx_bookings_status ON public.bookings(booking_status);
CREATE INDEX idx_bookings_payment_status ON public.bookings(payment_status);
CREATE INDEX idx_rooms_active ON public.rooms(is_active);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_rooms_updated_at
  BEFORE UPDATE ON public.rooms
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Function to check room availability
CREATE OR REPLACE FUNCTION public.check_room_availability(
  room_id_param UUID,
  check_in_param DATE,
  check_out_param DATE,
  exclude_booking_id UUID DEFAULT NULL
)
RETURNS BOOLEAN AS $$
BEGIN
  -- Check if room exists and is active
  IF NOT EXISTS (
    SELECT 1 FROM public.rooms 
    WHERE id = room_id_param AND is_active = true
  ) THEN
    RETURN FALSE;
  END IF;
  
  -- Check for conflicting bookings
  IF EXISTS (
    SELECT 1 FROM public.bookings
    WHERE room_id = room_id_param
    AND booking_status IN ('confirmed', 'checked_in')
    AND (
      (check_in_date < check_out_param AND check_out_date > check_in_param)
    )
    AND (exclude_booking_id IS NULL OR id != exclude_booking_id)
  ) THEN
    RETURN FALSE;
  END IF;
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get available rooms for date range
CREATE OR REPLACE FUNCTION public.get_available_rooms(
  check_in_param DATE,
  check_out_param DATE
)
RETURNS TABLE (
  id UUID,
  name TEXT,
  description TEXT,
  base_price DECIMAL,
  max_guests INTEGER,
  amenities JSONB,
  image_url TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT r.id, r.name, r.description, r.base_price, r.max_guests, r.amenities, r.image_url
  FROM public.rooms r
  WHERE r.is_active = true
  AND public.check_room_availability(r.id, check_in_param, check_out_param);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Insert sample room data
INSERT INTO public.rooms (name, description, base_price, max_guests, amenities, image_url) VALUES
('Single Room', 'Perfect for solo travelers seeking comfort and convenience.', 2000.00, 1, '["Free Wi-Fi", "AC", "TV", "Room Service"]', '/lovable-uploads/4e4742d0-f32b-4031-99ed-01c48bf9a73e.png'),
('Luxury Room', 'Spacious luxury accommodation with premium amenities and city views.', 2500.00, 2, '["Free Wi-Fi", "Premium AC", "Smart TV", "Mini Bar", "Balcony"]', '/lovable-uploads/440f2aae-df63-4a72-8504-f9f3d70a4a95.png'),
('Executive Suite', 'Ultimate luxury suite with separate living area and exclusive services.', 3500.00, 4, '["Free Wi-Fi", "Living Area", "Kitchenette", "Premium Bath", "Concierge"]', '/lovable-uploads/8864f4e5-1a14-4957-97ce-55d69c203abb.png');