import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

interface UserBet {
  _id: string;
  userId: string;
  betId: {
    _id: string;
    title: string;
    description: string;
    category: string;
    endDate: string;
    status: string;
    resolvedOutcome?: boolean;
  };
  position: 'yes' | 'no';
  amount: number;
  odds: number;
  potentialPayout: number;
  status: 'active' | 'won' | 'lost' | 'claimed';
  createdAt: string;
}

export const useUserBetsApi = () => {
  const [userBets, setUserBets] = useState<UserBet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchUserBets = async () => {
    if (!user) {
      setUserBets([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await api.getUserBetsHistory();
      setUserBets(data);
      setError(null);
    } catch (err: any) {
      setError(err.message);
      console.error('Failed to fetch user bets:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserBets();
  }, [user]);

  return {
    userBets,
    loading,
    error,
    refetch: fetchUserBets,
  };
};