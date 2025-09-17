import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, TrendingUp } from "lucide-react";
import MarketCard from "@/components/markets/MarketCard";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useBets } from "@/hooks/useBets";
import { WalletConnect } from "@/components/WalletConnect";

const Markets = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const { bets, loading, error } = useBets();

  const categories = [
    "all",
    "sports", 
    "politics",
    "crypto",
    "entertainment",
    "technology",
    "finance"
  ];

  // Filter bets based on category and search query
  const filteredMarkets = bets.filter((bet) => {
    const matchesCategory = selectedCategory === "all" || bet.category === selectedCategory;
    const matchesSearch = 
      bet.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bet.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary/10 to-accent/10 py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <div className="flex items-center justify-center gap-2 mb-4">
                <TrendingUp className="h-6 w-6 text-primary" />
                <Badge variant="outline" className="bg-background/50">Live Markets</Badge>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Prediction Markets
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Explore and bet on the future across sports, politics, crypto, and more. 
                Make informed predictions backed by real money.
              </p>
              
              <div className="max-w-md mx-auto">
                <WalletConnect />
              </div>
            </div>
          </div>
        </section>

        {/* Filters and Search */}
        <section className="py-8 border-b">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 h-4 w-4 text-muted-foreground transform -translate-y-1/2" />
                <Input
                  placeholder="Search predictions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Category Filters */}
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      setSelectedCategory(category);
                      setSearchQuery(""); // Clear search when filtering by category
                    }}
                    className="capitalize"
                  >
                    {category}
                  </Button>
                ))}
              </div>

              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                More Filters
              </Button>
            </div>
          </div>
        </section>

        {/* Markets Grid */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold">
                  {selectedCategory === "all" ? "All Markets" : `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Markets`}
                </h2>
                <p className="text-muted-foreground">
                  {filteredMarkets.length} markets found
                </p>
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-muted-foreground">Loading markets...</div>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-destructive">{error}</div>
              </div>
            ) : filteredMarkets.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMarkets.map((market) => (
                  <MarketCard 
                    key={market.id} 
                    id={market.id}
                    title={market.title}
                    description={market.description || ""}
                    category={market.category}
                    endDate={market.end_date}
                    totalVolume={market.total_volume}
                    participants={market.participants}
                    yesPrice={market.yes_price}
                    noPrice={market.no_price}
                    trending={market.is_trending}
                    live={market.is_live}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="text-muted-foreground text-lg mb-4">
                  No markets found matching your criteria
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSelectedCategory("all"); 
                    setSearchQuery("");
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Markets;