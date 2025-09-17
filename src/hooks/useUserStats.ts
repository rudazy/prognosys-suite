import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/auth/AuthProvider';

export interface UserStats {
  totalBets: number;
  winRate: number;
  totalVolume: number;
  currentBalance: number;
  profitLoss: number;
  walletAddress: string;
}

export const useUserStats = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<UserStats>({
    totalBets: 0,
    winRate: 0,
    totalVolume: 0,
    currentBalance: 0,
    profitLoss: 0,
    walletAddress: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setStats({
        totalBets: 0,
        winRate: 0,
        totalVolume: 0,
        currentBalance: 0,
        profitLoss: 0,
        walletAddress: ''
      });
      setLoading(false);
      return;
    }

    fetchUserStats();
  }, [user]);

  const fetchUserStats = async () => {
    if (!user) return;

    try {
      setLoading(true);

      // Get user profile with wallet and balance
      const { data: profile } = await supabase
        .from('profiles')
        .select('wallet_address, balance')
        .eq('user_id', user.id)
        .single();

      // Get user bets for statistics
      const { data: userBets } = await supabase
        .from('user_bets')
        .select('amount, status, potential_payout')
        .eq('user_id', user.id);

      if (userBets) {
        const totalBets = userBets.length;
        const totalAmount = userBets.reduce((sum, bet) => sum + Number(bet.amount), 0);
        
        // Calculate wins (assuming resolved bets have status 'won' or 'lost')
        const wonBets = userBets.filter(bet => bet.status === 'won');
        const winRate = totalBets > 0 ? Math.round((wonBets.length / totalBets) * 100) : 0;
        
        // Calculate total payouts from won bets
        const totalPayouts = wonBets.reduce((sum, bet) => sum + Number(bet.potential_payout || 0), 0);
        const profitLoss = totalPayouts - totalAmount;

        setStats({
          totalBets,
          winRate,
          totalVolume: totalAmount,
          currentBalance: Number(profile?.balance || 0),
          profitLoss,
          walletAddress: profile?.wallet_address || ''
        });
      } else {
        setStats({
          totalBets: 0,
          winRate: 0,
          totalVolume: 0,
          currentBalance: Number(profile?.balance || 0),
          profitLoss: 0,
          walletAddress: profile?.wallet_address || ''
        });
      }
    } catch (error) {
      console.error('Error fetching user stats:', error);
    } finally {
      setLoading(false);
    }
  };

  return { stats, loading, refetch: fetchUserStats };
};