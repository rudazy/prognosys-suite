import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { TrendingUp, Shield, Users, Zap, ArrowRight, BarChart3 } from "lucide-react";
import heroImage from "@/assets/hero-professionals.jpg";
import marketImage from "@/assets/market-analytics.jpg";
import MarketCard from "@/components/markets/MarketCard";
import { useBets } from "@/hooks/useBets";
import { useAnalytics } from "@/hooks/useAnalytics";

const HomePage = () => {
  const { bets } = useBets();
  const { analytics } = useAnalytics();

  // Get the first 3 bets for featured section, or use sample data if none exist
  const featuredMarkets = bets.slice(0, 3).length > 0 
    ? bets.slice(0, 3).map(bet => ({
        id: bet.id,
        title: bet.title,
        description: bet.description || "",
        category: bet.category,
        endDate: bet.end_date,
        totalVolume: bet.total_volume || 0,
        participants: bet.participants || 0,
        yesPrice: bet.yes_price || 50,
        noPrice: bet.no_price || 50,
        trending: bet.is_trending || false,
        live: bet.is_live || false
      }))
    : [
        {
          id: "sample-1",
          title: "Will Bitcoin reach $100,000 by end of 2024?",
          description: "Predict whether Bitcoin will hit the $100k milestone before December 31, 2024.",
          category: "Crypto",
          endDate: "2024-12-31T23:59:59Z",
          totalVolume: 125000,
          participants: 2431,
          yesPrice: 72,
          noPrice: 28,
          trending: true,
          live: false
        },
        {
          id: "sample-2", 
          title: "Will AI replace 50% of customer service jobs by 2026?",
          description: "Predict the impact of AI on customer service employment in the next two years.",
          category: "Technology",
          endDate: "2026-01-01T00:00:00Z",
          totalVolume: 89000,
          participants: 1205,
          yesPrice: 61,
          noPrice: 39,
          trending: false,
          live: true
        },
        {
          id: "sample-3",
          title: "Who will win the 2024 NBA Championship?",
          description: "Predict which team will take home the championship trophy this season.",
          category: "Sports", 
          endDate: "2024-06-30T23:59:59Z",
          totalVolume: 234000,
          participants: 5672,
          yesPrice: 45,
          noPrice: 55,
          trending: false,
          live: false
        }
      ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="container py-24 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <Badge variant="trending" className="w-fit">
                <TrendingUp className="h-3 w-3 mr-1" />
                Now Live on Fluent Testnet
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

              <div className="grid grid-cols-3 gap-6 pt-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    ${analytics.totalVolume > 0 ? analytics.totalVolume.toLocaleString() : '2.1M+'}
                  </div>
                  <div className="text-sm text-muted-foreground">Total Volume</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {analytics.activeUsers > 0 ? analytics.activeUsers.toLocaleString() + '+' : '15K+'}
                  </div>
                  <div className="text-sm text-muted-foreground">Active Users</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {analytics.totalMarkets > 0 ? analytics.totalMarkets.toLocaleString() + '+' : '250+'}
                  </div>
                  <div className="text-sm text-muted-foreground">Markets</div>
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
                Built on Fluent Testnet with enterprise-grade security protocols.
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
            {featuredMarkets.map((market) => (
              <MarketCard key={market.id} {...market} />
            ))}
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
            <Button variant="secondary" size="lg">
              Connect Your Wallet
            </Button>
            <Button variant="outline" size="lg" className="bg-transparent border-white text-white hover:bg-white hover:text-primary">
              <Link to="/how-it-works">Learn More</Link>
            </Button>
          </div>
          <p className="text-sm opacity-75">
            Platform fee: 5-10% on winning bets • Built for Fluent Testnet
          </p>
        </div>
      </section>
    </div>
  );
};

export default HomePage;