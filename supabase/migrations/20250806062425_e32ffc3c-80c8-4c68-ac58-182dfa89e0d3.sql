-- Create contact_messages table for storing contact form submissions
CREATE TABLE public.contact_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  message_type TEXT DEFAULT 'general',
  status TEXT DEFAULT 'unread',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Admin can view and manage all messages
CREATE POLICY "Admin can manage all contact messages"
ON public.contact_messages
FOR ALL
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE user_id = auth.uid()
    AND preferences ->> 'role' = 'admin'
  )
);

-- Users can create messages (allowing anonymous submissions)
CREATE POLICY "Anyone can create contact messages"
ON public.contact_messages
FOR INSERT
WITH CHECK (true);

-- Users can view their own messages if logged in
CREATE POLICY "Users can view their own messages"
ON public.contact_messages
FOR SELECT
USING (
  user_id = auth.uid() OR
  (user_id IS NULL AND email = (SELECT email FROM auth.users WHERE id = auth.uid()))
);

-- Add trigger for updating timestamps
CREATE TRIGGER update_contact_messages_updated_at
  BEFORE UPDATE ON public.contact_messages
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();