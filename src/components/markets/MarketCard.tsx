import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Users, Coins } from "lucide-react";
import { CountdownTimer } from "@/components/CountdownTimer";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";

interface MarketCardProps {
  id: string;
  title: string;
  description: string;
  category: string;
  endDate: string;
  totalVolume: number;
  participants: number;
  yesPrice: number;
  noPrice: number;
  trending?: boolean;
  live?: boolean;
  contractMarketId?: number;
  onPlaceBet?: (betId: string, isYes: boolean, amount: string) => Promise<boolean>;
}

const MarketCard = ({
  id,
  title,
  description,
  category,
  endDate,
  totalVolume,
  participants,
  yesPrice,
  noPrice,
  trending,
  live,
  onPlaceBet,
}: MarketCardProps) => {
  const { user } = useAuth();
  const [betAmount, setBetAmount] = useState("0.01");
  const [showBetting, setShowBetting] = useState(false);
  const [isPlacingBet, setIsPlacingBet] = useState(false);

  // Normalize price for display: if value <= 1 treat as ratio and convert to percentage
  const formatPrice = (value: number | null | undefined) => {
    const n = Number(value ?? 0);
    const pct = n <= 1 ? n * 100 : n;
    return Math.round(pct);
  };

  const handlePlaceBet = async (isYes: boolean) => {
    if (!onPlaceBet || !user) return;
    
    setIsPlacingBet(true);
    try {
      const success = await onPlaceBet(id, isYes, betAmount);
      if (success) {
        setShowBetting(false);
        setBetAmount("0.01");
      }
    } finally {
      setIsPlacingBet(false);
    }
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-200 hover:scale-[1.02] cursor-pointer">
      <CardHeader className="space-y-3">
        <div className="flex items-start justify-between">
          <Badge variant={live ? "live" : trending ? "trending" : "outline"}>
            {live ? "LIVE" : trending ? "TRENDING" : category}
          </Badge>
          {trending && <TrendingUp className="h-4 w-4 text-primary" />}
        </div>
        
        <CardTitle className="text-lg leading-tight line-clamp-2">
          {title}
        </CardTitle>
        
        <p className="text-sm text-muted-foreground line-clamp-2">
          {description}
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Market Stats */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <Coins className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Volume:</span>
            <span className="font-medium">{(totalVolume || 0).toFixed(4)} ETH</span>
          </div>
          <div className="flex items-center space-x-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">{participants}</span>
          </div>
        </div>

        {/* Prediction Odds */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-lg bg-success/10 border border-success/20">
            <div className="text-xs text-muted-foreground mb-1">YES</div>
            <div className="text-lg font-bold text-success">{formatPrice(yesPrice)}¢</div>
          </div>
          <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
            <div className="text-xs text-muted-foreground mb-1">NO</div>
            <div className="text-lg font-bold text-destructive">{formatPrice(noPrice)}¢</div>
          </div>
        </div>

        {/* End Date */}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span className="capitalize">{category}</span>
          <CountdownTimer endDate={endDate} />
        </div>
      </CardContent>

      <CardFooter className="space-y-3">
        {!user ? (
          <div className="text-center w-full">
            <p className="text-sm text-muted-foreground mb-2">Sign in to place bets</p>
            <Button variant="outline" size="sm" onClick={() => window.location.href = '/auth'}>
              Sign In
            </Button>
          </div>
        ) : !showBetting ? (
          <div className="grid grid-cols-1 gap-3 w-full">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowBetting(true)}
            >
              Place Bet
            </Button>
          </div>
        ) : (
          <div className="space-y-3 w-full">
            <div>
              <Label htmlFor="betAmount" className="text-xs">Bet Amount (ETH)</Label>
              <Input
                id="betAmount"
                type="number"
                step="0.001"
                min="0.001"
                value={betAmount}
                onChange={(e) => setBetAmount(e.target.value)}
                placeholder="0.01"
                className="h-8"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button 
                variant="success" 
                size="sm"
                onClick={() => handlePlaceBet(true)}
                disabled={isPlacingBet}
              >
                {isPlacingBet ? "..." : `YES ${formatPrice(yesPrice)}¢`}
              </Button>
              <Button 
                variant="destructive" 
                size="sm"
                onClick={() => handlePlaceBet(false)}
                disabled={isPlacingBet}
              >
                {isPlacingBet ? "..." : `NO ${formatPrice(noPrice)}¢`}
              </Button>
            </div>
            <Button 
              variant="ghost" 
              size="sm"
              className="w-full"
              onClick={() => setShowBetting(false)}
            >
              Cancel
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default MarketCard;
export { MarketCard };