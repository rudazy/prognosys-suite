-- Create function to place bet and deduct balance atomically
CREATE OR REPLACE FUNCTION public.place_user_bet(
  p_user_id UUID,
  p_bet_id UUID,
  p_position TEXT,
  p_amount NUMERIC,
  p_odds NUMERIC,
  p_potential_payout NUMERIC
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Check if user has sufficient balance
  IF (SELECT balance FROM profiles WHERE user_id = p_user_id) < p_amount THEN
    RAISE EXCEPTION 'Insufficient balance';
  END IF;

  -- Deduct from user balance
  UPDATE profiles 
  SET balance = balance - p_amount
  WHERE user_id = p_user_id;

  -- Insert bet record
  INSERT INTO user_bets (
    user_id,
    bet_id,
    position,
    amount,
    odds,
    potential_payout,
    status
  ) VALUES (
    p_user_id,
    p_bet_id,
    p_position,
    p_amount,
    p_odds,
    p_potential_payout,
    'active'
  );

  -- Update bet volume and participants
  UPDATE bets 
  SET 
    total_volume = COALESCE(total_volume, 0) + p_amount,
    participants = (
      SELECT COUNT(DISTINCT user_id) 
      FROM user_bets 
      WHERE bet_id = p_bet_id
    )
  WHERE id = p_bet_id;
END;
$$;