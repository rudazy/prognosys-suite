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
import { 
  User, 
  Wallet, 
  TrendingUp, 
  History, 
  Settings,
  DollarSign,
  Target,
  Award,
  Activity
} from "lucide-react";

const Dashboard = () => {
  // Sample user data
  const userStats = {
    totalBets: 45,
    winRate: 68,
    totalVolume: 12500,
    currentBalance: 2350,
    profitLoss: 850
  };

  const [settingsOpen, setSettingsOpen] = useState(false);
  const [addFundsOpen, setAddFundsOpen] = useState(false);

  const activeBets: any[] = [];

  const recentActivity: any[] = [];

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
                <div className="text-2xl font-bold">{userStats.totalBets}</div>
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
                <div className="text-2xl font-bold text-success">{userStats.winRate}%</div>
                <p className="text-xs text-muted-foreground">
                  Above average
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Volume</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${userStats.totalVolume.toLocaleString()}</div>
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
                <div className="text-2xl font-bold">${userStats.currentBalance.toLocaleString()}</div>
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
                  {userStats.profitLoss >= 0 ? '+' : ''}${userStats.profitLoss.toLocaleString()}
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
                  {activeBets.length > 0 ? (
                    <div className="space-y-4">
                      {activeBets.map((bet) => (
                        <div key={bet.id} className="p-4 border rounded-lg">
                          <div className="flex justify-between items-start mb-3">
                            <h4 className="font-medium leading-tight">{bet.market}</h4>
                            <Badge variant={bet.position === "YES" ? "success" : "destructive"}>
                              {bet.position}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <span className="text-muted-foreground">Amount:</span>
                              <div className="font-medium">${bet.amount}</div>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Current Odds:</span>
                              <div className="font-medium">{bet.currentOdds}¢</div>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Potential Payout:</span>
                              <div className="font-medium text-success">${bet.potentialPayout}</div>
                            </div>
                            <div className="flex justify-end">
                              <Button variant="outline" size="sm">Sell Position</Button>
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
                  <div className="space-y-4">
                    {recentActivity.map((activity) => (
                      <div key={activity.id} className="flex justify-between items-center p-4 border rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-medium">{activity.market}</h4>
                          <p className="text-sm text-muted-foreground">{activity.action}</p>
                        </div>
                        <div className="text-right">
                          <Badge variant={activity.result === "won" ? "success" : "destructive"}>
                            {activity.result}
                          </Badge>
                          <div className="text-sm text-muted-foreground mt-1">
                            {activity.date}
                          </div>
                          {activity.payout > 0 && (
                            <div className="text-sm font-medium text-success">
                              +${activity.payout}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
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
                      <div className="mt-1 p-3 bg-muted rounded-md font-mono text-sm">
                        0x742d35Cc...Ab4B2Ed34
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
                <Label htmlFor="amount">Amount (USD)</Label>
                <Input id="amount" type="number" min="0" placeholder="100" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setAddFundsOpen(false)}>Cancel</Button>
              <Button onClick={() => setAddFundsOpen(false)}>Add Funds</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;