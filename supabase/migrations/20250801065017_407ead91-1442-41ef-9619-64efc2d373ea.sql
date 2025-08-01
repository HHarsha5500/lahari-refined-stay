-- Create a function to set user as admin (for initial setup)
CREATE OR REPLACE FUNCTION public.set_user_admin(user_email text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  target_user_id uuid;
BEGIN
  -- Get user id from email
  SELECT id INTO target_user_id 
  FROM auth.users 
  WHERE email = user_email;
  
  IF target_user_id IS NULL THEN
    RAISE EXCEPTION 'User with email % not found', user_email;
  END IF;
  
  -- Update or insert profile with admin role
  INSERT INTO public.profiles (user_id, preferences)
  VALUES (target_user_id, '{"role": "admin"}'::jsonb)
  ON CONFLICT (user_id) 
  DO UPDATE SET 
    preferences = jsonb_set(COALESCE(profiles.preferences, '{}'::jsonb), '{role}', '"admin"'::jsonb);
END;
$$;

-- Create a function to check if current user is admin
CREATE OR REPLACE FUNCTION public.is_current_user_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM public.profiles 
    WHERE user_id = auth.uid() 
    AND preferences ->> 'role' = 'admin'
  );
$$;