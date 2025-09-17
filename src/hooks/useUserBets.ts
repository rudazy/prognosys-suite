import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/components/auth/AuthProvider';

export interface UserBet {
  id: string;
  bet_id: string;
  amount: number;
  position: string;
  odds: number;
  potential_payout: number;
  status: string;
  created_at: string;
  bet?: {
    title: string;
    end_date: string;
    status: string;
  };
}

export const useUserBets = () => {
  const { user } = useAuth();
  const [activeBets, setActiveBets] = useState<UserBet[]>([]);
  const [betHistory, setBetHistory] = useState<UserBet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setActiveBets([]);
      setBetHistory([]);
      setLoading(false);
      return;
    }

    fetchUserBets();
  }, [user]);

  const fetchUserBets = async () => {
    if (!user) return;

    try {
      setLoading(true);

      // Fetch user bets with market information
      const { data: userBets } = await supabase
        .from('user_bets')
        .select(`
          *,
          bet:bets (
            title,
            end_date,
            status
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (userBets) {
        const active = userBets.filter(bet => 
          bet.status === 'active' && bet.bet?.status === 'active'
        );
        const history = userBets.filter(bet => 
          bet.status !== 'active' || bet.bet?.status !== 'active'
        );

        setActiveBets(active as UserBet[]);
        setBetHistory(history as UserBet[]);
      }
    } catch (error) {
      console.error('Error fetching user bets:', error);
    } finally {
      setLoading(false);
    }
  };

  return { activeBets, betHistory, loading, refetch: fetchUserBets };
};