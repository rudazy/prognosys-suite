import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useReadOnlyContract } from "./useReadOnlyContract";

export interface AnalyticsData {
  totalVolume: number;
  activeUsers: number;
  totalMarkets: number;
  dailyVolume: number;
  monthlyActiveUsers: number;
  recentVisitors: number;
}

export const useAnalytics = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalVolume: 0,
    activeUsers: 0,
    totalMarkets: 0,
    dailyVolume: 0,
    monthlyActiveUsers: 0,
    recentVisitors: 0,
  });
  const [loading, setLoading] = useState(true);
  const readOnlyContract = useReadOnlyContract();

  const fetchAnalytics = async () => {
    try {
      setLoading(true);

      // Get total markets from database only
      const { data: marketsData, error: marketsError } = await supabase
        .from("bets")
        .select("id, total_volume, participants")
        .eq("status", "active");

      if (marketsError) throw marketsError;

      const totalMarkets = marketsData?.length || 0;
      
      // Calculate totals from database only
      const totalVolume = marketsData?.reduce((sum, market) => sum + Number(market.total_volume || 0), 0) || 0;
      const totalParticipants = marketsData?.reduce((sum, market) => sum + Number(market.participants || 0), 0) || 0;

      // Get unique active users from user_bets
      const { data: uniqueUsersData } = await supabase
        .from("user_bets")
        .select("user_id")
        .eq("status", "active");

      const activeUsers = new Set(uniqueUsersData?.map(bet => bet.user_id)).size;

      // Get daily volume (last 24 hours)
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      const { data: dailyVolumeData } = await supabase
        .from("user_bets")
        .select("amount")
        .gte("created_at", yesterday.toISOString())
        .eq("status", "active");

      const dailyVolume = dailyVolumeData?.reduce((sum, bet) => sum + Number(bet.amount), 0) || 0;

      // Get monthly active users (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { data: monthlyUsers } = await supabase
        .from("user_bets")
        .select("user_id")
        .gte("created_at", thirtyDaysAgo.toISOString());

      const monthlyActiveUsers = new Set(monthlyUsers?.map(bet => bet.user_id)).size;

      setAnalytics({
        totalVolume,
        activeUsers,
        totalMarkets,
        dailyVolume,
        monthlyActiveUsers,
        recentVisitors: activeUsers, // For now, use activeUsers as proxy
      });
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();

    // Set up real-time subscription for analytics updates
    const subscription = supabase
      .channel("analytics")
      .on("postgres_changes", {
        event: "*",
        schema: "public",
        table: "user_bets",
      }, () => {
        fetchAnalytics();
      })
      .on("postgres_changes", {
        event: "*",
        schema: "public",
        table: "bets",
      }, () => {
        fetchAnalytics();
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { analytics, loading, refetch: fetchAnalytics };
};