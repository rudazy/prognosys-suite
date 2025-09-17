import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useReadOnlyContract } from "./useReadOnlyContract";

export interface AnalyticsData {
  totalVolume: number;
  activeUsers: number;
  totalMarkets: number;
  totalResolvedMarkets: number;
  allTimeParticipants: number;
  dailyVolume: number;
  recentVisitors: number;
}

export const useAnalytics = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalVolume: 0,
    activeUsers: 0,
    totalMarkets: 0,
    totalResolvedMarkets: 0,
    allTimeParticipants: 0,
    dailyVolume: 0,
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

      // Get resolved markets for the resolved markets count
      const { data: resolvedMarketsData, error: resolvedMarketsError } = await supabase
        .from("bets")
        .select("id")
        .eq("status", "resolved");

      if (resolvedMarketsError) throw resolvedMarketsError;

      const totalMarkets = activeMarketsData?.length || 0;
      const totalResolvedMarkets = resolvedMarketsData?.length || 0;
      
      // Calculate totals from all markets (active + resolved)
      const totalVolume = allMarketsData?.reduce((sum, market) => sum + Number(market.total_volume || 0), 0) || 0;

      // Get unique active users from all user_bets (including resolved markets)
      const { data: allUsersData } = await supabase
        .from("user_bets")
        .select("user_id");

      const activeUsers = new Set(allUsersData?.map(bet => bet.user_id)).size;
      const allTimeParticipants = activeUsers; // Same as activeUsers for all-time participants

      // Get daily volume (last 24 hours)
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      const { data: dailyVolumeData } = await supabase
        .from("user_bets")
        .select("amount")
        .gte("created_at", yesterday.toISOString())
        .eq("status", "active");

      const dailyVolume = dailyVolumeData?.reduce((sum, bet) => sum + Number(bet.amount), 0) || 0;

      setAnalytics({
        totalVolume,
        activeUsers,
        totalMarkets,
        totalResolvedMarkets,
        allTimeParticipants,
        dailyVolume,
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
      .on('presence', { event: 'sync' }, () => {
        // Handle presence updates for realtime user tracking
        fetchAnalytics();
      })
      .subscribe();

    // Track user presence for realtime updates
    const trackPresence = async () => {
      await subscription.track({
        user: 'analytics_viewer',
        online_at: new Date().toISOString(),
      });
    };
    
    trackPresence();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { analytics, loading, refetch: fetchAnalytics };
};