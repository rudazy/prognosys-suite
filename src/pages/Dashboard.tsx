import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, DollarSign, Target, Clock, User, Wallet } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useAuth } from "@/contexts/AuthContext";
import { useUserBetsApi } from "@/hooks/useUserBetsApi";
import { useUserStatsApi } from "@/hooks/useUserStatsApi";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { userBets, loading: betsLoading } = useUserBetsApi();
  const { stats, loading: statsLoading } = useUserStatsApi();

  useEffect(() => {
    if (!user) {
      navigate("/auth");
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  const activeBets = userBets.filter(bet => bet.status === 'active');
  const resolvedBets = userBets.filter(bet => bet.status !== 'active');

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {user.displayName || user.email}</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Balance</p>
                  <p className="text-2xl font-bold">{((user.balance || 0) / 1000).toFixed(3)} ETH</p>
                </div>
                <Wallet className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Bets</p>
                  <p className="text-2xl font-bold">{statsLoading ? '...' : stats.totalBets}</p>
                </div>
                <Target className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Volume</p>
                  <p className="text-2xl font-bold">{statsLoading ? '...' : ((stats.totalVolume || 0) / 1000).toFixed(3)} ETH</p>
                </div>
                <DollarSign className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Win Rate</p>
                  <p className="text-2xl font-bold">{statsLoading ? '...' : Math.round(stats.winRate || 0)}%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* User Profile Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Profile Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Email</p>
                <p className="text-lg">{user.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Display Name</p>
                <p className="text-lg">{user.displayName || 'Not set'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Wallet Address</p>
                <p className="text-sm font-mono break-all">{user.walletAddress}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Account Type</p>
                <Badge variant={user.isAdmin ? "default" : "secondary"}>
                  {user.isAdmin ? "Admin" : "User"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bets Tabs */}
        <Tabs defaultValue="active" className="space-y-6">
          <TabsList>
            <TabsTrigger value="active">Active Bets ({activeBets.length})</TabsTrigger>
            <TabsTrigger value="history">Bet History ({resolvedBets.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="active">
            <Card>
              <CardHeader>
                <CardTitle>Active Bets</CardTitle>
              </CardHeader>
              <CardContent>
                {betsLoading ? (
                  <p className="text-muted-foreground">Loading bets...</p>
                ) : activeBets.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">No active bets</p>
                    <Button onClick={() => navigate("/markets")}>
                      Explore Markets
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {activeBets.map((bet) => (
                      <div key={bet._id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-medium">{bet.betId.title}</h3>
                            <p className="text-sm text-muted-foreground mt-1">
                              {bet.betId.description}
                            </p>
                            <div className="flex items-center gap-4 mt-3">
                              <Badge variant={bet.position === 'yes' ? "success" : "destructive"}>
                                {bet.position.toUpperCase()}
                              </Badge>
                              <span className="text-sm">
                                Bet: {(bet.amount / 1000).toFixed(3)} ETH
                              </span>
                              <span className="text-sm text-muted-foreground">
                                Potential: {(bet.potentialPayout / 1000).toFixed(3)} ETH
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge variant="outline">{bet.betId.category}</Badge>
                            <p className="text-xs text-muted-foreground mt-2">
                              Ends: {new Date(bet.betId.endDate).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Bet History</CardTitle>
              </CardHeader>
              <CardContent>
                {betsLoading ? (
                  <p className="text-muted-foreground">Loading history...</p>
                ) : resolvedBets.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">No bet history</p>
                ) : (
                  <div className="space-y-4">
                    {resolvedBets.map((bet) => (
                      <div key={bet._id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-medium">{bet.betId.title}</h3>
                            <div className="flex items-center gap-4 mt-3">
                              <Badge variant={bet.position === 'yes' ? "success" : "destructive"}>
                                {bet.position.toUpperCase()}
                              </Badge>
                              <Badge variant={bet.status === 'won' ? "success" : "destructive"}>
                                {bet.status.toUpperCase()}
                              </Badge>
                              <span className="text-sm">
                                Bet: {(bet.amount / 1000).toFixed(3)} ETH
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge variant="outline">{bet.betId.category}</Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;