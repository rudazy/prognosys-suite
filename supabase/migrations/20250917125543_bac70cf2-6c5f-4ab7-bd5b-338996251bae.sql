-- Add wallet_address column to profiles table
ALTER TABLE public.profiles ADD COLUMN wallet_address text;

-- Add balance column to profiles table  
ALTER TABLE public.profiles ADD COLUMN balance numeric DEFAULT 0;

-- Create function to generate wallet address from user ID
CREATE OR REPLACE FUNCTION public.generate_wallet_address(user_uuid uuid)
RETURNS text
LANGUAGE plpgsql
AS $$
BEGIN
  -- Generate deterministic wallet address from user UUID
  RETURN '0x' || encode(decode(replace(user_uuid::text, '-', ''), 'hex'), 'hex');
END;
$$;

-- Create trigger to auto-generate wallet address on profile creation
CREATE OR REPLACE FUNCTION public.handle_profile_wallet_generation()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  -- Only set wallet_address if it's not already set
  IF NEW.wallet_address IS NULL THEN
    NEW.wallet_address = public.generate_wallet_address(NEW.user_id);
  END IF;
  RETURN NEW;
END;
$$;

-- Create trigger for wallet generation
CREATE TRIGGER trigger_generate_wallet_address
  BEFORE INSERT OR UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_profile_wallet_generation();