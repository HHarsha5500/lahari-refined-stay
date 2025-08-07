-- Fix RLS policies to avoid auth.users table permission issues

-- Fix bookings table policies
DROP POLICY IF EXISTS "Admin can manage all bookings" ON public.bookings;
DROP POLICY IF EXISTS "Admin can view all bookings" ON public.bookings;
DROP POLICY IF EXISTS "Users can update their own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Users can view their own bookings" ON public.bookings;

-- Create correct admin policies for bookings
CREATE POLICY "Admin can manage all bookings" 
ON public.bookings 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.user_id = auth.uid() 
    AND profiles.preferences ->> 'role' = 'admin'
  )
);

-- Create user policies for bookings without auth.users references
CREATE POLICY "Users can create bookings" 
ON public.bookings 
FOR INSERT 
WITH CHECK (user_id = auth.uid() OR user_id IS NULL);

CREATE POLICY "Users can update their own bookings" 
ON public.bookings 
FOR UPDATE 
USING (user_id = auth.uid());

CREATE POLICY "Users can view their own bookings" 
ON public.bookings 
FOR SELECT 
USING (user_id = auth.uid());

-- Fix contact_messages policies again with simpler approach
DROP POLICY IF EXISTS "Admin can manage all contact messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Users can view their own messages" ON public.contact_messages;

CREATE POLICY "Admin can manage all contact messages" 
ON public.contact_messages 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.user_id = auth.uid() 
    AND profiles.preferences ->> 'role' = 'admin'
  )
);

CREATE POLICY "Users can view their own messages" 
ON public.contact_messages 
FOR SELECT 
USING (user_id = auth.uid());