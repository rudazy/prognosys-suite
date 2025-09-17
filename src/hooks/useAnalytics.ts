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

  const fetchAnalytics = async () => {
    try {
      setLoading(true);

      // Get all markets (active and resolved) for total calculations
      const { data: allMarketsData, error: allMarketsError } = await supabase
        .from("bets")
        .select("id, total_volume, participants, status");

      if (allMarketsError) throw allMarketsError;

      // Get only active markets for the active markets count
      const { data: activeMarketsData, error: activeMarketsError } = await supabase
        .from("bets")
        .select("id")
        .eq("status", "active");

      if (activeMarketsError) throw activeMarketsError;

      const totalMarkets = activeMarketsData?.length || 0;
      
      // Calculate totals from all markets (active + resolved)
      const totalVolume = allMarketsData?.reduce((sum, market) => sum + Number(market.total_volume || 0), 0) || 0;

      // Get unique active users from all user_bets (including resolved markets)
      const { data: allUsersData } = await supabase
        .from("user_bets")
        .select("user_id");

      const activeUsers = new Set(allUsersData?.map(bet => bet.user_id)).size;

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