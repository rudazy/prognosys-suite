import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Calendar, Users, DollarSign } from "lucide-react";

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
  live
}: MarketCardProps) => {
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
            <DollarSign className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">Volume:</span>
            <span className="font-medium">${totalVolume.toLocaleString()}</span>
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
            <div className="text-lg font-bold text-success">{yesPrice}¢</div>
          </div>
          <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
            <div className="text-xs text-muted-foreground mb-1">NO</div>
            <div className="text-lg font-bold text-destructive">{noPrice}¢</div>
          </div>
        </div>

        {/* End Date */}
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>Ends {endDate}</span>
        </div>
      </CardContent>

      <CardFooter className="grid grid-cols-2 gap-3">
        <Button variant="success" size="sm" className="w-full">
          Buy YES
        </Button>
        <Button variant="destructive" size="sm" className="w-full">
          Buy NO
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MarketCard;