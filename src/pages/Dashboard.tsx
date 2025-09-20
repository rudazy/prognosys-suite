import { useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/components/auth/AuthProvider";
import { useUserStats } from "@/hooks/useUserStats";
import { useUserBets } from "@/hooks/useUserBets";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { 
  User, 
  Wallet, 
  TrendingUp, 
  History, 
  Settings,
  DollarSign,
  Target,
  Award,
  Activity,
  Copy,
  ExternalLink
} from "lucide-react";

const Dashboard = () => {
  const { user } = useAuth();
  const { stats: userStats, loading: statsLoading } = useUserStats();
  const { activeBets, betHistory, loading: betsLoading } = useUserBets();
  const { toast } = useToast();
  
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [addFundsOpen, setAddFundsOpen] = useState(false);
  const [depositAmount, setDepositAmount] = useState('');

  const copyWalletAddress = () => {
    if (userStats.walletAddress) {
      navigator.clipboard.writeText(userStats.walletAddress);
      toast({
        title: "Address Copied",
        description: "Wallet address copied to clipboard",
      });
    }
  };

  const handleAddFunds = async () => {
    if (!depositAmount || !user) return;
    
    try {
      const amount = parseFloat(depositAmount);
      if (amount <= 0) return;

      // Update user balance in database
      const { error } = await supabase
        .from('profiles')
        .update({ balance: userStats.currentBalance + amount })
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: "Funds Added",
        description: `${amount} ETH added to your wallet`,
      });
      
      setDepositAmount('');
      setAddFundsOpen(false);
      // Refresh stats would happen automatically via real-time or manual refetch
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add funds",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Dashboard Header */}
        <section className="bg-gradient-to-r from-primary/5 to-accent/5 py-16">
          <div className="container">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
              <div>
                <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
                <p className="text-muted-foreground">
                  Track your predictions and manage your portfolio
                </p>
              </div>
              
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setSettingsOpen(true)}>
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Button>
                <Button onClick={() => setAddFundsOpen(true)}>
                  <Wallet className="h-4 w-4 mr-2" />
                  Add Funds
                </Button>
              </div>
            </div>
          </div>
        </section>

        <div className="container py-8">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Bets</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {statsLoading ? "..." : userStats.totalBets}
                </div>
                <p className="text-xs text-muted-foreground">
                  Active and completed
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Win Rate</CardTitle>
                <Award className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-success">
                  {statsLoading ? "..." : `${userStats.winRate}%`}
                </div>
                <p className="text-xs text-muted-foreground">
                  {userStats.winRate > 50 ? "Above average" : "Below average"}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Volume</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {statsLoading ? "..." : `${userStats.totalVolume.toFixed(4)} ETH`}
                </div>
                <p className="text-xs text-muted-foreground">
                  All-time betting volume
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Balance</CardTitle>
                <Wallet className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {statsLoading ? "..." : `${userStats.currentBalance.toFixed(4)} ETH`}
                </div>
                <p className="text-xs text-muted-foreground">
                  Available to bet
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">P&L</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${userStats.profitLoss >= 0 ? 'text-success' : 'text-destructive'}`}>
                  {statsLoading ? "..." : `${userStats.profitLoss >= 0 ? '+' : ''}${Math.abs(userStats.profitLoss).toFixed(4)} ETH`}
                </div>
                <p className="text-xs text-muted-foreground">
                  All-time profit/loss
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Tabs defaultValue="active" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="active">Active Bets</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
              <TabsTrigger value="profile">Profile</TabsTrigger>
            </TabsList>

            <TabsContent value="active" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Active Predictions</CardTitle>
                </CardHeader>
                <CardContent>
                  {betsLoading ? (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">Loading...</p>
                    </div>
                  ) : activeBets.length > 0 ? (
                    <div className="space-y-4">
                      {activeBets.map((bet) => (
                        <div key={bet.id} className="p-4 border rounded-lg">
                          <div className="flex justify-between items-start mb-3">
                            <h4 className="font-medium leading-tight">{bet.bet?.title || 'Unknown Market'}</h4>
                            <Badge variant={bet.position === "YES" ? "default" : "secondary"}>
                              {bet.position}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <span className="text-muted-foreground">Amount:</span>
                              <div className="font-medium">{bet.amount} ETH</div>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Odds:</span>
                              <div className="font-medium">{bet.odds}%</div>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Potential Payout:</span>
                              <div className="font-medium text-success">{bet.potential_payout} ETH</div>
                            </div>
                            <div className="flex justify-end">
                              <Button variant="outline" size="sm">View Details</Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No active bets</p>
                      <Button variant="outline" className="mt-4">
                        Explore Markets
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="history" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  {betsLoading ? (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">Loading...</p>
                    </div>
                  ) : betHistory.length > 0 ? (
                    <div className="space-y-4">
                      {betHistory.map((bet) => (
                        <div key={bet.id} className="flex justify-between items-center p-4 border rounded-lg">
                          <div className="flex-1">
                            <h4 className="font-medium">{bet.bet?.title || 'Unknown Market'}</h4>
                            <p className="text-sm text-muted-foreground">
                              {bet.position} position - {bet.amount} ETH
                            </p>
                          </div>
                          <div className="text-right">
                            <Badge variant={bet.status === "won" ? "default" : bet.status === "lost" ? "destructive" : "secondary"}>
                              {bet.status}
                            </Badge>
                            <div className="text-sm text-muted-foreground mt-1">
                              {new Date(bet.created_at).toLocaleDateString()}
                            </div>
                            {bet.status === "won" && (
                              <div className="text-sm font-medium text-success">
                                +{bet.potential_payout} ETH
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <History className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">No betting history</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="profile" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                      <User className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium">Prediction Trader</h3>
                      <p className="text-muted-foreground">Member since January 2024</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-sm font-medium">Wallet Address</label>
                      <div className="mt-1 p-3 bg-muted rounded-md font-mono text-sm flex items-center justify-between">
                        <span className="truncate mr-2">
                          {statsLoading ? "Loading..." : userStats.walletAddress || "Not generated"}
                        </span>
                        {userStats.walletAddress && (
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={copyWalletAddress}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => window.open(`https://testnet.fluentscan.xyz/address/${userStats.walletAddress}`, '_blank')}
                            >
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium">Network</label>
                      <div className="mt-1 p-3 bg-muted rounded-md text-sm">
                        Fluent Testnet
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-4">
                    <Button variant="outline">Edit Profile</Button>
                    <Button variant="outline">Security Settings</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        {/* Modals */}
        <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Settings</DialogTitle>
              <DialogDescription>Manage your account preferences.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="displayName">Display name</Label>
                <Input id="displayName" placeholder="Your name" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setSettingsOpen(false)}>Close</Button>
              <Button onClick={() => setSettingsOpen(false)}>Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={addFundsOpen} onOpenChange={setAddFundsOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Funds</DialogTitle>
              <DialogDescription>Deposit to your trading balance.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="walletAddress">Your Wallet Address</Label>
                <div className="mt-1 p-3 bg-muted rounded-md font-mono text-sm flex items-center justify-between">
                  <span className="truncate mr-2">
                    {statsLoading ? "Loading..." : userStats.walletAddress || "Not generated"}
                  </span>
                  {userStats.walletAddress && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={copyWalletAddress}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Send ETH or tokens to this address on Fluent Testnet
                </p>
              </div>
              <div>
                <Label htmlFor="amount">Simulate Deposit Amount (ETH)</Label>
                <Input 
                  id="amount" 
                  type="number" 
                  min="0" 
                  placeholder="100" 
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  This simulates adding funds to your account balance
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setAddFundsOpen(false)}>Cancel</Button>
              <Button onClick={handleAddFunds} disabled={!depositAmount}>Add Funds</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;