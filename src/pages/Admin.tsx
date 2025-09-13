import { useState, useEffect } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Calendar, Clock, Settings, TrendingUp, Users } from "lucide-react";

interface Bet {
  id: string;
  title: string;
  description: string;
  category: string;
  end_date: string;
  status: string;
  total_volume: number;
  participants: number;
  yes_price: number;
  no_price: number;
  is_trending: boolean;
  is_live: boolean;
  resolved_outcome?: boolean;
}

const Admin = () => {
  const { user, isAdmin, loading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [bets, setBets] = useState<Bet[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    end_date: "",
    hours: "24",
    minutes: "0"
  });

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      navigate("/auth");
      return;
    }
    
    if (isAdmin) {
      fetchBets();
    }
  }, [user, isAdmin, loading, navigate]);

  const fetchBets = async () => {
    try {
      const { data, error } = await supabase
        .from("bets")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setBets(data || []);
    } catch (error) {
      console.error("Error fetching bets:", error);
      toast({
        title: "Error",
        description: "Failed to fetch bets",
        variant: "destructive",
      });
    }
  };

  const handleCreateBet = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;

    try {
      // Calculate end date from hours and minutes
      const now = new Date();
      const totalMinutes = parseInt(formData.hours) * 60 + parseInt(formData.minutes);
      const endDate = new Date(now.getTime() + totalMinutes * 60000);

      const { error } = await supabase.from("bets").insert({
        title: formData.title,
        description: formData.description,
        category: formData.category,
        creator_id: user.id,
        end_date: endDate.toISOString(),
        status: "active",
        is_live: true,
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Bet created successfully!",
      });

      setFormData({
        title: "",
        description: "",
        category: "",
        end_date: "",
        hours: "24",
        minutes: "0"
      });

      fetchBets();
    } catch (error) {
      console.error("Error creating bet:", error);
      toast({
        title: "Error",
        description: "Failed to create bet",
        variant: "destructive",
      });
    }
  };

  const handleResolveBet = async (betId: string, outcome: boolean) => {
    try {
      const { error } = await supabase
        .from("bets")
        .update({
          status: "resolved",
          resolved_outcome: outcome,
          resolution_date: new Date().toISOString(),
        })
        .eq("id", betId);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Bet resolved as ${outcome ? "YES" : "NO"}`,
      });

      fetchBets();
    } catch (error) {
      console.error("Error resolving bet:", error);
      toast({
        title: "Error",
        description: "Failed to resolve bet",
        variant: "destructive",
      });
    }
  };

  const toggleBetStatus = async (betId: string, currentStatus: string) => {
    const newStatus = currentStatus === "active" ? "ended" : "active";
    
    try {
      const { error } = await supabase
        .from("bets")
        .update({ status: newStatus })
        .eq("id", betId);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Bet ${newStatus === "active" ? "activated" : "paused"}`,
      });

      fetchBets();
    } catch (error) {
      console.error("Error updating bet status:", error);
      toast({
        title: "Error",
        description: "Failed to update bet status",
        variant: "destructive",
      });
    }
  };

  const getRemainingTime = (endDate: string) => {
    const now = new Date();
    const end = new Date(endDate);
    const diff = end.getTime() - now.getTime();
    
    if (diff <= 0) return "Expired";
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m`;
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!user || !isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 flex items-center gap-2">
            <Settings className="h-8 w-8" />
            Admin Dashboard
          </h1>

          <Tabs defaultValue="create" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="create">Create Bet</TabsTrigger>
              <TabsTrigger value="manage">Manage Bets</TabsTrigger>
            </TabsList>

            <TabsContent value="create">
              <Card>
                <CardHeader>
                  <CardTitle>Create New Bet</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleCreateBet} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Title</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        rows={3}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Select onValueChange={(value) => setFormData({ ...formData, category: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sports">Sports</SelectItem>
                          <SelectItem value="politics">Politics</SelectItem>
                          <SelectItem value="crypto">Crypto</SelectItem>
                          <SelectItem value="entertainment">Entertainment</SelectItem>
                          <SelectItem value="technology">Technology</SelectItem>
                          <SelectItem value="finance">Finance</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="hours">Duration (Hours)</Label>
                        <Input
                          id="hours"
                          type="number"
                          min="0"
                          max="168"
                          value={formData.hours}
                          onChange={(e) => setFormData({ ...formData, hours: e.target.value })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="minutes">Additional Minutes</Label>
                        <Input
                          id="minutes"
                          type="number"
                          min="0"
                          max="59"
                          value={formData.minutes}
                          onChange={(e) => setFormData({ ...formData, minutes: e.target.value })}
                        />
                      </div>
                    </div>

                    <Button type="submit" className="w-full">
                      Create Bet
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="manage">
              <div className="space-y-4">
                {bets.map((bet) => (
                  <Card key={bet.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-lg">{bet.title}</h3>
                            <Badge variant={bet.status === "active" ? "default" : bet.status === "resolved" ? "secondary" : "destructive"}>
                              {bet.status}
                            </Badge>
                            {bet.is_trending && (
                              <Badge variant="outline">
                                <TrendingUp className="h-3 w-3 mr-1" />
                                Trending
                              </Badge>
                            )}
                          </div>
                          
                          <p className="text-muted-foreground mb-3">{bet.description}</p>
                          
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {bet.category}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {getRemainingTime(bet.end_date)}
                            </span>
                            <span className="flex items-center gap-1">
                              <Users className="h-4 w-4" />
                              {bet.participants} participants
                            </span>
                          </div>

                          <div className="mt-3 flex items-center gap-2">
                            <span className="text-sm">YES: ${bet.yes_price.toFixed(2)}</span>
                            <span className="text-sm">NO: ${bet.no_price.toFixed(2)}</span>
                            <span className="text-sm">Volume: ${bet.total_volume}</span>
                          </div>
                        </div>

                        <div className="flex flex-col gap-2 ml-4">
                          {bet.status === "active" && (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => toggleBetStatus(bet.id, bet.status)}
                              >
                                Pause Bet
                              </Button>
                              <Button
                                size="sm"
                                variant="success"
                                onClick={() => handleResolveBet(bet.id, true)}
                              >
                                Resolve YES
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleResolveBet(bet.id, false)}
                              >
                                Resolve NO
                              </Button>
                            </>
                          )}
                          
                          {bet.status === "ended" && (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => toggleBetStatus(bet.id, bet.status)}
                              >
                                Resume Bet
                              </Button>
                              <Button
                                size="sm"
                                variant="success"
                                onClick={() => handleResolveBet(bet.id, true)}
                              >
                                Resolve YES
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleResolveBet(bet.id, false)}
                              >
                                Resolve NO
                              </Button>
                            </>
                          )}

                          {bet.status === "resolved" && (
                            <Badge variant={bet.resolved_outcome ? "success" : "destructive"}>
                              Resolved: {bet.resolved_outcome ? "YES" : "NO"}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {bets.length === 0 && (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <p className="text-muted-foreground">No bets created yet. Create your first bet!</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Admin;