import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { TrendingUp, Shield, Users, Zap, ArrowRight, BarChart3 } from "lucide-react";
import heroImage from "@/assets/hero-professionals.jpg";
import marketImage from "@/assets/market-analytics.jpg";
import MarketCard from "@/components/markets/MarketCard";
import { useBetsApi } from "@/hooks/useBetsApi";
import { useAnalytics } from "@/hooks/useAnalytics";

const HomePage = () => {
  const { bets } = useBetsApi();
  const { analytics } = useAnalytics();

  // Get the first 3 bets for featured section - only show if there are active bets
  const featuredMarkets = bets.slice(0, 3).length > 0 
    ? bets.slice(0, 3).map(bet => ({
        id: bet._id,
        title: bet.title,
        description: bet.description || "",
        category: bet.category,
        endDate: bet.endDate,
        totalVolume: (bet.totalVolume || 0) / 1000, // Convert to ETH for display
        participants: bet.participants || 0,
        yesPrice: bet.yesPrice || 0.5,
        noPrice: bet.noPrice || 0.5,
        trending: bet.isTrending || false,
        live: bet.isLive || false,
        contractMarketId: bet.contractMarketId ?? undefined,
      }))
    : []; // Show empty array instead of sample data

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="container py-24 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <Badge variant="trending" className="w-fit">
                <TrendingUp className="h-3 w-3 mr-1" />
                Now Live with MongoDB Backend
              </Badge>
              
              <div className="space-y-6">
                <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                  The Future of
                  <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"> Prediction Markets</span>
                </h1>
                
                <p className="text-xl text-muted-foreground leading-relaxed">
                  Democratizing predictions for everyone. Bet on sports, politics, crypto, and more with our professional-grade platform built for the modern era.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button variant="hero" size="lg" asChild>
                  <Link to="/markets">
                    Explore Markets
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link to="/how-it-works">Learn How It Works</Link>
                </Button>
              </div>

              <div className="grid grid-cols-4 gap-6 pt-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {analytics.totalVolume.toFixed(1)} ETH
                  </div>
                  <div className="text-sm text-muted-foreground">Total Volume</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {analytics.allTimeParticipants.toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">All-time Participants</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {analytics.totalMarkets}
                  </div>
                  <div className="text-sm text-muted-foreground">Active Markets</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {analytics.totalResolvedMarkets}
                  </div>
                  <div className="text-sm text-muted-foreground">Resolved Markets</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <img 
                src={heroImage} 
                alt="Professional team analyzing prediction markets" 
                className="rounded-2xl shadow-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent rounded-2xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-muted/30">
        <div className="container">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold">Why Choose DeFutures?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Built for professionals who demand the best in prediction market technology.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center space-y-4">
              <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Secure & Trusted</h3>
              <p className="text-muted-foreground">
                Built with MongoDB and JWT authentication for enterprise-grade security.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Lightning Fast</h3>
              <p className="text-muted-foreground">
                Instant trades and real-time market updates for seamless betting.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Community Driven</h3>
              <p className="text-muted-foreground">
                Join thousands of prediction enthusiasts in our growing ecosystem.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="mx-auto w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Professional Analytics</h3>
              <p className="text-muted-foreground">
                Advanced charts and insights to inform your predictions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Markets */}
      <section className="py-24">
        <div className="container">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold">Trending Markets</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover the most popular prediction markets across all categories.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {featuredMarkets.length > 0 ? (
              featuredMarkets.map((market) => (
                <MarketCard key={market.id} {...market} />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <div className="space-y-4">
                  <div className="text-4xl">🎯</div>
                  <h3 className="text-xl font-semibold">No Active Markets</h3>
                  <p className="text-muted-foreground">
                    All current markets have been resolved. New markets will appear here when created.
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="text-center">
            <Button variant="outline" size="lg" asChild>
              <Link to="/markets">
                View All Markets
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-primary to-accent text-primary-foreground">
        <div className="container text-center space-y-8">
          <h2 className="text-3xl lg:text-5xl font-bold">
            Ready to Predict the Future?
          </h2>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            Join DeFutures today and start making informed predictions on the events that matter to you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="secondary" size="lg" asChild>
              <Link to="/auth">Get Started</Link>
            </Button>
            <Button variant="outline" size="lg" className="bg-transparent border-white text-white hover:bg-white hover:text-primary" asChild>
              <Link to="/how-it-works">Learn More</Link>
            </Button>
          </div>
          <p className="text-sm opacity-75">
            Platform fee: 4% on winning bets • Powered by MongoDB
          </p>
        </div>
      </section>
    </div>
  );
};

export default HomePage;