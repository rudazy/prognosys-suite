import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { useToast } from './use-toast';

interface Bet {
  _id: string;
  title: string;
  description: string;
  category: string;
  creatorId: {
    email: string;
    displayName: string;
  };
  endDate: string;
  resolutionDate?: string;
  status: 'active' | 'resolved' | 'cancelled';
  totalVolume: number;
  participants: number;
  yesPrice: number;
  noPrice: number;
  resolvedOutcome?: boolean;
  isTrending: boolean;
  isLive: boolean;
  contractMarketId?: number;
  contractAddress?: string;
  createdAt: string;
  updatedAt: string;
}

export const useBetsApi = () => {
  const [bets, setBets] = useState<Bet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchBets = async () => {
    try {
      setLoading(true);
      const data = await api.getBets();
      setBets(data);
      setError(null);
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Error",
        description: "Failed to fetch bets",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const placeBet = async (betId: string, position: 'yes' | 'no', amount: string) => {
    try {
      const result = await api.placeBet(betId, position, amount);
      
      toast({
        title: "Bet Placed Successfully!",
        description: result.message,
      });

      // Refresh bets to get updated data
      await fetchBets();
      
      return true;
    } catch (err: any) {
      toast({
        title: "Bet Failed",
        description: err.message || "Failed to place bet",
        variant: "destructive",
      });
      return false;
    }
  };

  const createBet = async (betData: {
    title: string;
    description?: string;
    category: string;
    endDate: string;
  }) => {
    try {
      await api.createBet(betData);
      
      toast({
        title: "Bet Created",
        description: "New bet has been created successfully",
      });

      await fetchBets();
      return true;
    } catch (err: any) {
      toast({
        title: "Creation Failed",
        description: err.message || "Failed to create bet",
        variant: "destructive",
      });
      return false;
    }
  };

  useEffect(() => {
    fetchBets();
  }, []);

  return {
    bets,
    loading,
    error,
    fetchBets,
    placeBet,
    createBet,
  };
};