-- Fix function search path issues by updating existing functions
CREATE OR REPLACE FUNCTION public.generate_wallet_address(user_uuid uuid)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Generate deterministic wallet address from user UUID
  RETURN '0x' || encode(decode(replace(user_uuid::text, '-', ''), 'hex'), 'hex');
END;
$$;