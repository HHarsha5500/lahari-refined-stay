-- Update room prices to rupees (multiplying by approximate conversion rate 83 USD to INR)
UPDATE public.rooms 
SET base_price = base_price * 83
WHERE is_active = true;

-- Update the first room (Single Room)
UPDATE public.rooms 
SET base_price = 4500
WHERE name = 'Single Room';

-- Update the second room (Luxury Room)  
UPDATE public.rooms 
SET base_price = 6500
WHERE name = 'Luxury Room';

-- Update the third room (Executive Suite)
UPDATE public.rooms 
SET base_price = 8500
WHERE name = 'Executive Suite';