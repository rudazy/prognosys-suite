import { useState } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import MarketCard from "@/components/markets/MarketCard";
import { Search, Filter, TrendingUp } from "lucide-react";

const Markets = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = ["All", "Sports", "Politics", "Crypto", "Entertainment", "Technology", "Economy"];

  // Sample markets data
  const markets = [
    {
      id: "1",
      title: "Will Bitcoin reach $100,000 by end of 2024?",
      description: "Predict whether Bitcoin will hit the $100k milestone before December 31, 2024.",
      category: "Crypto",
      endDate: "Dec 31, 2024",
      totalVolume: 125000,
      participants: 2431,
      yesPrice: 72,
      noPrice: 28,
      trending: true
    },
    {
      id: "2", 
      title: "Will AI replace 50% of customer service jobs by 2026?",
      description: "Predict the impact of AI on customer service employment in the next two years.",
      category: "Technology",
      endDate: "Jan 1, 2026",
      totalVolume: 89000,
      participants: 1205,
      yesPrice: 61,
      noPrice: 39,
      live: true
    },
    {
      id: "3",
      title: "Who will win the 2024 NBA Championship?",
      description: "Predict which team will take home the championship trophy this season.",
      category: "Sports", 
      endDate: "Jun 30, 2024",
      totalVolume: 234000,
      participants: 5672,
      yesPrice: 45,
      noPrice: 55
    },
    {
      id: "4",
      title: "Will Donald Trump win the 2024 Presidential Election?",
      description: "Predict the outcome of the 2024 US Presidential Election.",
      category: "Politics",
      endDate: "Nov 5, 2024",
      totalVolume: 567000,
      participants: 12453,
      yesPrice: 52,
      noPrice: 48,
      trending: true
    },
    {
      id: "5",
      title: "Will Ethereum reach $5,000 in 2024?",
      description: "Predict whether ETH will hit $5,000 before year end.",
      category: "Crypto",
      endDate: "Dec 31, 2024",
      totalVolume: 178000,
      participants: 3421,
      yesPrice: 38,
      noPrice: 62
    },
    {
      id: "6",
      title: "Will Netflix gain 50M+ subscribers in 2024?",
      description: "Predict Netflix's subscriber growth for the year.",
      category: "Entertainment",
      endDate: "Dec 31, 2024",
      totalVolume: 95000,
      participants: 1876,
      yesPrice: 71,
      noPrice: 29
    }
  ];

  const filteredMarkets = markets.filter(market => {
    const matchesCategory = selectedCategory === "All" || market.category === selectedCategory;
    const matchesSearch = market.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         market.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Page Header */}
        <section className="bg-gradient-to-r from-primary/5 to-accent/5 py-16">
          <div className="container">
            <div className="max-w-3xl">
              <div className="flex items-center space-x-2 mb-4">
                <TrendingUp className="h-6 w-6 text-primary" />
                <Badge variant="trending">Live Markets</Badge>
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold mb-6">
                Prediction Markets
              </h1>
              <p className="text-xl text-muted-foreground">
                Explore and bet on the future across sports, politics, crypto, and more. 
                Make informed predictions backed by real money.
              </p>
            </div>
          </div>
        </section>

        {/* Filters & Search */}
        <section className="py-8 border-b">
          <div className="container">
            <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 h-4 w-4 text-muted-foreground transform -translate-y-1/2" />
                <Input
                  placeholder="Search markets..."
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
                    onClick={() => setSelectedCategory(category)}
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
          <div className="container">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold">
                  {selectedCategory === "All" ? "All Markets" : `${selectedCategory} Markets`}
                </h2>
                <p className="text-muted-foreground">
                  {filteredMarkets.length} markets found
                </p>
              </div>
              
              <div className="text-sm text-muted-foreground">
                Platform fee: 5-10% on winning bets
              </div>
            </div>

            {filteredMarkets.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMarkets.map((market) => (
                  <MarketCard key={market.id} {...market} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="text-muted-foreground text-lg mb-4">
                  No markets found matching your criteria
                </div>
                <Button variant="outline" onClick={() => {setSelectedCategory("All"); setSearchQuery("");}}>
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