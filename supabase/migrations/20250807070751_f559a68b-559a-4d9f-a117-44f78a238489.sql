-- Fix RLS policies to avoid auth.users table permission issues

-- Drop ALL existing policies for bookings
DROP POLICY IF EXISTS "Users can create bookings" ON public.bookings;

-- Fix contact_messages policies with simpler approach
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