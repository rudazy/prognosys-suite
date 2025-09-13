import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface Bet {
  id: string;
  title: string;
  description: string;
  category: string;
  end_date: string;
  total_volume: number;
  participants: number;
  yes_price: number;
  no_price: number;
  status: string;
  is_trending: boolean;
  is_live: boolean;
  resolved_outcome?: boolean;
  created_at: string;
}

export const useBets = () => {
  const [bets, setBets] = useState<Bet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBets = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("bets")
        .select("*")
        .eq("status", "active")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setBets(data || []);
    } catch (err) {
      console.error("Error fetching bets:", err);
      setError("Failed to fetch bets");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBets();

    // Set up real-time subscription
    const subscription = supabase
      .channel("bets")
      .on("postgres_changes", {
        event: "*",
        schema: "public",
        table: "bets",
      }, () => {
        fetchBets();
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return { bets, loading, error, refetch: fetchBets };
};