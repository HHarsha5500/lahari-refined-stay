-- Fix RLS policies for contact_messages table to allow admin access

-- Drop existing policies
DROP POLICY IF EXISTS "Admin can manage all contact messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Users can view their own messages" ON public.contact_messages;

-- Recreate admin policy with proper permissions
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

-- Fix user policy to avoid auth.users reference issues
CREATE POLICY "Users can view their own messages" 
ON public.contact_messages 
FOR SELECT 
USING (
  user_id = auth.uid() OR 
  (user_id IS NULL AND email = (
    SELECT raw_user_meta_data ->> 'email' 
    FROM auth.users 
    WHERE id = auth.uid()
  ))
);