import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "./use-toast";

export const useBlockchainBets = (contractState?: any) => {
  const [isPlacingBet, setIsPlacingBet] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);
  const { toast } = useToast();

  const placeBet = async (betId: string, isYes: boolean, amount: string, userId?: string) => {
    if (!userId) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to place bets",
        variant: "destructive",
      });
      return false;
    }

    setIsPlacingBet(true);
    try {
      const betAmount = parseFloat(amount);
      if (betAmount <= 0) {
        throw new Error("Bet amount must be greater than 0");
      }

      // Check user balance
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("balance")
        .eq("user_id", userId)
        .single();

      if (profileError || !profile) {
        throw new Error("Profile not found");
      }

      if (profile.balance < betAmount) {
        throw new Error("Insufficient balance. Please add funds to your wallet.");
      }

      // Get bet details
      const { data: bet, error: betError } = await supabase
        .from("bets")
        .select("*")
        .eq("id", betId)
        .single();

      if (betError || !bet) {
        throw new Error("Bet not found");
      }

      // Calculate potential payout (simple 1:1 for now)
      const potentialPayout = betAmount * 2;

      // Deduct from user balance and store bet in single transaction
      const { error: transactionError } = await supabase.rpc('place_user_bet' as any, {
        p_user_id: userId,
        p_bet_id: betId,
        p_position: isYes ? "YES" : "NO",
        p_amount: betAmount,
        p_odds: isYes ? bet.yes_price : bet.no_price,
        p_potential_payout: potentialPayout
      });

      if (transactionError) {
        throw new Error(transactionError.message);
      }

      toast({
        title: "Bet Placed Successfully!",
        description: `You bet $${amount} on ${isYes ? 'YES' : 'NO'}`,
      });

      return true;
    } catch (error: any) {
      console.error("Error placing bet:", error);
      toast({
        title: "Bet Failed",
        description: error.message || "Failed to place bet",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsPlacingBet(false);
    }
  };

  const syncMarketWithContract = async (marketId: number) => {
    if (!contractState?.contract) return;

    try {
      const marketData = await contractState.contract.getMarket(marketId);
      const totalVolumeEth = Number(marketData.totalVolume) / 1e18; // Convert wei to ETH
      const yesPoolEth = Number(marketData.yesPool) / 1e18;
      const noPoolEth = Number(marketData.noPool) / 1e18;
      
      // Calculate prices and participants
      const totalPool = yesPoolEth + noPoolEth;
      const yesPrice = totalPool > 0 ? (yesPoolEth / totalPool) : 0.5;
      const noPrice = totalPool > 0 ? (noPoolEth / totalPool) : 0.5;
      const participants = Math.max(1, Math.floor(totalVolumeEth / 0.01)); // Estimate participants based on volume
      
      // Update database with contract data
      const { error } = await supabase
        .from("bets")
        .update({
          total_volume: totalVolumeEth,
          yes_price: yesPrice,
          no_price: noPrice,
          participants: participants
        })
        .eq("contract_market_id", marketId);

      if (error) {
        console.error(`Error syncing market ${marketId}:`, error);
      }
    } catch (error) {
      console.error(`Error fetching market ${marketId} from contract:`, error);
    }
  };

  const claimWinnings = async (betId: string) => {
    if (!contractState?.account) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet first",
        variant: "destructive",
      });
      return;
    }

    setIsClaiming(true);

    try {
      // Get bet details
      const { data: bet, error } = await supabase
        .from("bets")
        .select("*")
        .eq("id", betId)
        .single();

      if (error || !bet) {
        throw new Error("Bet not found");
      }

      const contractMarketId = (bet as any).contract_market_id;
      if (!contractMarketId) {
        throw new Error("This bet is not linked to a smart contract");
      }

      // Check if user has winnings
      const { data: userBets, error: userBetsError } = await supabase
        .from("user_bets")
        .select("*")
        .eq("bet_id", betId)
        .eq("user_id", contractState.account)
        .eq("status", "active");

      if (userBetsError || !userBets?.length) {
        throw new Error("No active bets found for this market");
      }

      // Call relay function to claim winnings (relayer pays gas)
      const response = await fetch('/functions/v1/relay-transaction', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
        },
        body: JSON.stringify({
          contractAddress: bet.contract_address,
          functionName: 'claimWinnings',
          userAddress: contractState.account,
          marketId: contractMarketId,
        }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || "Failed to claim winnings");
      }

      toast({
        title: "Winnings Claimed!",
        description: `Transaction hash: ${result.txHash}`,
      });

      // Update local state
      await syncMarketWithContract(contractMarketId);

    } catch (error: any) {
      console.error("Error claiming winnings:", error);
      toast({
        title: "Claim Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsClaiming(false);
    }
  };

  return {
    placeBet,
    claimWinnings,
    isPlacingBet,
    isClaiming,
    isConnected: contractState?.isConnected || false,
    account: contractState?.account,
    syncMarketWithContract,
  };
};