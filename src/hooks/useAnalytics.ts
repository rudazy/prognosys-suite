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

      // Get total markets and their contract IDs
      const { data: marketsData, error: marketsError } = await supabase
        .from("bets")
        .select("id, contract_market_id, total_volume")
        .eq("status", "active");

      if (marketsError) throw marketsError;

      let totalVolumeFromBlockchain = 0;
      let totalVolumeFromDB = 0;
      const totalMarkets = marketsData?.length || 0;

      // Calculate total volume from blockchain for markets with contract_market_id
      if (marketsData) {
        for (const market of marketsData) {
          if (market.contract_market_id) {
            try {
              const liveData = await readOnlyContract.getMarket(market.contract_market_id);
              if (liveData) {
                totalVolumeFromBlockchain += liveData.totalVolume;
              }
            } catch (e) {
              // Fallback to database value
              totalVolumeFromDB += Number(market.total_volume || 0);
            }
          } else {
            totalVolumeFromDB += Number(market.total_volume || 0);
          }
        }
      }

      const totalVolume = totalVolumeFromBlockchain + totalVolumeFromDB;

      // Get unique users count from user_bets
      const { data: uniqueUsers } = await supabase
        .from("user_bets")
        .select("user_id");

      const activeUsers = new Set(uniqueUsers?.map(bet => bet.user_id)).size;

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

      // Get additional data from blockchain if available
      let blockchainMarketsCount = 0;
      try {
        blockchainMarketsCount = await readOnlyContract.getActiveMarketsCount();
      } catch (error) {
        console.error("Error fetching blockchain markets count:", error);
      }

      setAnalytics({
        totalVolume,
        activeUsers,
        totalMarkets: Math.max(totalMarkets || 0, blockchainMarketsCount),
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