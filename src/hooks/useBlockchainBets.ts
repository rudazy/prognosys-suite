import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "./use-toast";

export const useBlockchainBets = (contractState?: any) => {
  const [isPlacingBet, setIsPlacingBet] = useState(false);
  const { toast } = useToast();

  const placeBet = async (betId: string, isYes: boolean, amountInEther: string) => {
    if (!contractState?.contract || !contractState?.account) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet first",
        variant: "destructive",
      });
      return false;
    }

    setIsPlacingBet(true);
    try {
      // Get bet details
      const { data: bet, error: betError } = await supabase
        .from("bets")
        .select("*")
        .eq("id", betId)
        .single();

      if (betError || !bet) {
        throw new Error("Bet not found");
      }

      const contractMarketId = (bet as any).contract_market_id;
      if (!contractMarketId) {
        throw new Error("This bet is not linked to a smart contract");
      }

      // Convert ether to wei
      const amountInWei = (parseFloat(amountInEther) * 1e18).toString();

      // Place bet on smart contract
      const tx = await contractState.contract.placeBet(
        contractMarketId, 
        isYes, 
        { value: amountInWei }
      );

      toast({
        title: "Transaction Submitted",
        description: "Your bet is being processed...",
      });

      // Wait for transaction confirmation
      const receipt = await tx.wait();

      // Store bet in database
      const { error: insertError } = await supabase.from("user_bets").insert({
        user_id: contractState.account,
        bet_id: betId,
        position: isYes ? "yes" : "no",
        amount: parseFloat(amountInEther),
        odds: isYes ? bet.yes_price : bet.no_price,
        potential_payout: parseFloat(amountInEther) * (isYes ? bet.yes_price : bet.no_price),
        status: "active",
      });

      if (insertError) {
        console.error("Error storing bet in database:", insertError);
      }

      toast({
        title: "Bet Placed Successfully!",
        description: `You bet ${amountInEther} ETH on ${isYes ? 'YES' : 'NO'}`,
      });

      return receipt;
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
      
      // Update database with contract data
      const { error } = await supabase
        .from("bets")
        .update({
          total_volume: marketData.totalVolume?.toString() || "0",
          yes_price: parseFloat(marketData.yesPool?.toString() || "0.5"),
          no_price: parseFloat(marketData.noPool?.toString() || "0.5"),
        })
        .eq("contract_market_id", marketId);

      if (error) {
        console.error(`Error syncing market ${marketId}:`, error);
      }
    } catch (error) {
      console.error(`Error fetching market ${marketId} from contract:`, error);
    }
  };

  return {
    placeBet,
    isPlacingBet,
    isConnected: contractState?.isConnected || false,
    account: contractState?.account,
    syncMarketWithContract,
  };
};