-- Create RPC to compute total volume across all user bets (bypasses RLS)
CREATE OR REPLACE FUNCTION public.get_total_volume()
RETURNS numeric
LANGUAGE sql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT COALESCE(SUM(amount), 0) FROM public.user_bets;
$$;