import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useBetsApi } from "@/hooks/useBetsApi";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, DollarSign, TrendingUp, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";

const Admin = () => {
  const { user } = useAuth();
  const { createBet, fetchBets } = useBetsApi();
  const { toast } = useToast();
  const [isCreating, setIsCreating] = useState(false);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalVolume: 0,
    activeMarkets: 0,
    totalBets: 0
  });
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "sports",
    endDate: "",
  });

  useEffect(() => {
    if (!user?.isAdmin) {
      return;
    }
    fetchStats();
  }, [user]);

  const fetchStats = async () => {
    try {
      // You can implement these endpoints in your backend
      setStats({
        totalUsers: 150,
        totalVolume: 25.5,
        activeMarkets: 12,
        totalBets: 450
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleCreateBet = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    
    try {
      const success = await createBet(formData);
      if (success) {
        setFormData({
          title: "",
          description: "",
          category: "sports",
          endDate: "",
        });
        await fetchBets();
      }
    } finally {
      setIsCreating(false);
    }
  };

  const handleAddFunds = async () => {
    try {
      await api.addFunds("1.0"); // Add 1 ETH
      toast({
        title: "Funds Added",
        description: "Added 1 ETH to your account",
      });
      // Refresh user data
      window.location.reload();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <Card>
            <CardContent className="p-6">
              <p>Please sign in to access the admin panel.</p>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  if (!user.isAdmin) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <Card>
            <CardContent className="p-6">
              <p>You don't have admin access.</p>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage markets and monitor platform activity</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                  <p className="text-2xl font-bold">{stats.totalUsers}</p>
                </div>
                <Users className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Volume</p>
                  <p className="text-2xl font-bold">{stats.totalVolume} ETH</p>
                </div>
                <DollarSign className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Markets</p>
                  <p className="text-2xl font-bold">{stats.activeMarkets}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Bets</p>
                  <p className="text-2xl font-bold">{stats.totalBets}</p>
                </div>
                <CalendarDays className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Create New Market */}
          <Card>
            <CardHeader>
              <CardTitle>Create New Market</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateBet} className="space-y-4">
                <div>
                  <Label htmlFor="title">Market Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Will Bitcoin reach $100k by end of 2024?"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Market description..."
                  />
                </div>

                <div>
                  <Label htmlFor="category">Category</Label>
                  <select
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="sports">Sports</option>
                    <option value="politics">Politics</option>
                    <option value="crypto">Crypto</option>
                    <option value="entertainment">Entertainment</option>
                    <option value="technology">Technology</option>
                    <option value="finance">Finance</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    type="datetime-local"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    required
                  />
                </div>

                <Button type="submit" className="w-full" disabled={isCreating}>
                  {isCreating ? "Creating..." : "Create Market"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Account Management</h3>
                <Button onClick={handleAddFunds} variant="outline" className="w-full">
                  Add 1 ETH to Balance
                </Button>
              </div>

              <div>
                <h3 className="font-medium mb-2">Current Balance</h3>
                <Badge variant="outline" className="text-lg p-2">
                  {((user.balance || 0) / 1000).toFixed(3)} ETH
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Admin;