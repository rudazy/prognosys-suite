-- Add contract_market_id column to bets table for blockchain integration
ALTER TABLE public.bets 
ADD COLUMN IF NOT EXISTS contract_market_id INTEGER;

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS idx_bets_contract_market_id 
ON public.bets (contract_market_id);