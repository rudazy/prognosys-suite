-- Count distinct users who have placed bets (ignores RLS)
CREATE OR REPLACE FUNCTION public.get_active_users_count()
RETURNS integer
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COUNT(DISTINCT user_id)::integer FROM public.user_bets;
$$;

REVOKE ALL ON FUNCTION public.get_active_users_count() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_active_users_count() TO anon, authenticated;