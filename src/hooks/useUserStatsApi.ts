import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

interface UserStats {
  totalBets: number;
  totalVolume: number;
  winRate: number;
}

export const useUserStatsApi = () => {
  const [stats, setStats] = useState<UserStats>({
    totalBets: 0,
    totalVolume: 0,
    winRate: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchStats = async () => {
    if (!user) {
      setStats({ totalBets: 0, totalVolume: 0, winRate: 0 });
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await api.getUserStats();
      setStats(data);
      setError(null);
    } catch (err: any) {
      setError(err.message);
      console.error('Failed to fetch user stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [user]);

  return {
    stats,
    loading,
    error,
    refetch: fetchStats,
  };
};