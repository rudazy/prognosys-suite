import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Users, Coins } from "lucide-react";
import { CountdownTimer } from "@/components/CountdownTimer";
import { useBlockchainBets } from "@/hooks/useBlockchainBets";
import { useContract } from "@/hooks/useContract";
import { useReadOnlyContract } from "@/hooks/useReadOnlyContract";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/components/auth/AuthProvider";

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
  contractMarketId,
}: MarketCardProps) => {
  const { user } = useAuth();
  const { contractState } = useContract();
  const { placeBet, claimWinnings, isPlacingBet, isClaiming } = useBlockchainBets(contractState);
  const readOnlyContract = useReadOnlyContract();
  const [betAmount, setBetAmount] = useState("10");
  const [showBetting, setShowBetting] = useState(false);

  // Live data from contract (read-only)
  const [liveVolume, setLiveVolume] = useState<number | null>(null);
  const [liveParticipants, setLiveParticipants] = useState<number | null>(null);
  const [liveYesPrice, setLiveYesPrice] = useState<number | null>(null);
  const [liveNoPrice, setLiveNoPrice] = useState<number | null>(null);

  // Normalize price for display: if value <= 1 treat as ratio and convert to percentage
  const formatPrice = (value: number | null | undefined) => {
    const n = Number(value ?? 0);
    const pct = n <= 1 ? n * 100 : n;
    return Math.round(pct);
  };

  useEffect(() => {
    if (typeof contractMarketId !== "number") return;
    let isMounted = true;
    
    const fetchLiveData = async () => {
      try {
        let marketData = null;
        
        // Try connected contract first
        if (contractState?.contract && typeof contractState.contract.getMarket === 'function') {
          try {
            marketData = await contractState.contract.getMarket(contractMarketId);
          } catch (e) {
            console.warn("Connected contract failed, trying read-only:", e);
          }
        }
        
        // Fallback to read-only contract
        if (!marketData) {
          marketData = await readOnlyContract.getMarket(contractMarketId);
        }
        
        if (marketData && isMounted) {
          setLiveVolume(marketData.totalVolume);
          setLiveYesPrice(marketData.yesPrice);
          setLiveNoPrice(marketData.noPrice);
          setLiveParticipants(marketData.participants);
        }
      } catch (e) {
        console.warn("Failed to fetch live market data", e);
      }
    };
    
    fetchLiveData();
    return () => {
      isMounted = false;
    };
  }, [contractState?.contract, contractMarketId, readOnlyContract]);
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
            <span className="font-medium">${((liveVolume ?? totalVolume) || 0).toFixed(2)}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">{liveParticipants ?? participants}</span>
          </div>
        </div>

        {/* Prediction Odds */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-lg bg-success/10 border border-success/20">
            <div className="text-xs text-muted-foreground mb-1">YES</div>
            <div className="text-lg font-bold text-success">{formatPrice(liveYesPrice ?? yesPrice)}¢</div>
          </div>
          <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
            <div className="text-xs text-muted-foreground mb-1">NO</div>
            <div className="text-lg font-bold text-destructive">{formatPrice(liveNoPrice ?? noPrice)}¢</div>
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
          </div>
        ) : !showBetting ? (
          <div className="grid grid-cols-2 gap-3 w-full">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowBetting(true)}
            >
              Place Bet
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => claimWinnings(id)}
              disabled={isClaiming}
            >
              {isClaiming ? "Claiming..." : "Claim"}
            </Button>
          </div>
        ) : (
          <div className="space-y-3 w-full">
            <div>
              <Label htmlFor="betAmount" className="text-xs">Bet Amount (USD)</Label>
              <Input
                id="betAmount"
                type="number"
                step="1"
                min="1"
                value={betAmount}
                onChange={(e) => setBetAmount(e.target.value)}
                placeholder="10"
                className="h-8"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Button 
                variant="success" 
                size="sm"
                onClick={() => placeBet(id, true, betAmount, user?.id)}
                disabled={isPlacingBet}
              >
                {isPlacingBet ? "..." : `YES ${formatPrice(liveYesPrice ?? yesPrice)}¢`}
              </Button>
              <Button 
                variant="destructive" 
                size="sm"
                onClick={() => placeBet(id, false, betAmount, user?.id)}
                disabled={isPlacingBet}
              >
                {isPlacingBet ? "..." : `NO ${formatPrice(liveNoPrice ?? noPrice)}¢`}
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