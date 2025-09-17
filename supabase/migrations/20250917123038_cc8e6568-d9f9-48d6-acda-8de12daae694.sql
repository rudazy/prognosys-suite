-- Create RPC to fetch participants counts per market
CREATE OR REPLACE FUNCTION public.get_markets_participants(bet_ids uuid[])
RETURNS TABLE (bet_id uuid, participants integer)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT ub.bet_id, COUNT(DISTINCT ub.user_id)::integer AS participants
  FROM public.user_bets ub
  WHERE ub.bet_id = ANY (bet_ids)
  GROUP BY ub.bet_id
$$;

REVOKE ALL ON FUNCTION public.get_markets_participants(uuid[]) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_markets_participants(uuid[]) TO anon, authenticated;