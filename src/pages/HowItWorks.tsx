import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { TrendingUp, Wallet, BarChart3, Users, Shield, Zap } from "lucide-react";

const HowItWorks = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-background to-muted/50">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto">
              <Badge variant="secondary" className="mb-4">
                How DeFutures Works
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent mb-6">
                Trade the Future with Confidence
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Learn how to participate in decentralized prediction markets and profit from your knowledge of future events.
              </p>
            </div>
          </div>
        </section>

        {/* Step by Step Process */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple 4-Step Process</h2>
              <p className="text-muted-foreground text-lg">Start trading predictions in minutes</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <Card className="text-center">
                <CardHeader>
                  <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <Wallet className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle>1. Connect Wallet</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Connect your Web3 wallet to access the DeFutures platform on Fluent Testnet.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <TrendingUp className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle>2. Browse Markets</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Explore prediction markets across sports, politics, crypto, and entertainment.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <BarChart3 className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle>3. Make Predictions</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Buy shares in outcomes you believe will happen. Your knowledge becomes your edge.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <Users className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle>4. Earn Rewards</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Win rewards when your predictions are correct. Trade positions anytime before resolution.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* How Prediction Markets Work */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
                Understanding Prediction Markets
              </h2>

              <div className="space-y-12">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div>
                    <h3 className="text-2xl font-bold mb-4">Market Creation</h3>
                    <p className="text-muted-foreground mb-4">
                      Each market represents a future event with multiple possible outcomes. 
                      For example: "Who will win the 2024 US Presidential Election?"
                    </p>
                    <p className="text-muted-foreground">
                      Markets are created with clear resolution criteria and end dates.
                    </p>
                  </div>
                  <Card className="p-6">
                    <h4 className="font-semibold mb-2">Example Market</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      Will Bitcoin reach $100,000 by end of 2024?
                    </p>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Yes</span>
                        <span className="text-primary">65%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>No</span>
                        <span className="text-primary">35%</span>
                      </div>
                    </div>
                  </Card>
                </div>

                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <Card className="p-6 order-2 md:order-1">
                    <h4 className="font-semibold mb-2">Share Prices</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      Prices reflect market sentiment and probability
                    </p>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>"Yes" shares</span>
                        <span className="text-primary">$0.65</span>
                      </div>
                      <div className="flex justify-between">
                        <span>"No" shares</span>
                        <span className="text-primary">$0.35</span>
                      </div>
                      <div className="text-xs text-muted-foreground pt-2">
                        Winning shares pay out $1.00
                      </div>
                    </div>
                  </Card>
                  <div className="order-1 md:order-2">
                    <h3 className="text-2xl font-bold mb-4">Trading Mechanics</h3>
                    <p className="text-muted-foreground mb-4">
                      Share prices represent the market's estimated probability of each outcome. 
                      If you think "Yes" is more likely than 65%, you buy "Yes" shares.
                    </p>
                    <p className="text-muted-foreground">
                      You can trade your position anytime before the market resolves.
                    </p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div>
                    <h3 className="text-2xl font-bold mb-4">Market Resolution</h3>
                    <p className="text-muted-foreground mb-4">
                      When the event concludes, markets are resolved based on objective, 
                      verifiable outcomes from trusted sources.
                    </p>
                    <p className="text-muted-foreground">
                      Winning shares pay out $1.00 each. Losing shares become worthless.
                    </p>
                  </div>
                  <Card className="p-6">
                    <h4 className="font-semibold mb-2">Payout Example</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      You bought 100 "Yes" shares at $0.65 each
                    </p>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Investment</span>
                        <span>$65.00</span>
                      </div>
                      <div className="flex justify-between">
                        <span>If correct</span>
                        <span className="text-success">$100.00</span>
                      </div>
                      <div className="flex justify-between font-semibold">
                        <span>Profit</span>
                        <span className="text-success">$35.00</span>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Platform Benefits */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose DeFutures</h2>
              <p className="text-muted-foreground text-lg">Built for the future of prediction markets</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <Card>
                <CardHeader>
                  <Shield className="h-12 w-12 text-primary mb-4" />
                  <CardTitle>Decentralized & Secure</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Built on Fluent Testnet for transparent, trustless trading. Your funds are secured by smart contracts.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Zap className="h-12 w-12 text-primary mb-4" />
                  <CardTitle>Fast & Low Cost</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Experience lightning-fast transactions with minimal fees on our optimized blockchain infrastructure.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <BarChart3 className="h-12 w-12 text-primary mb-4" />
                  <CardTitle>Advanced Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Track your performance with detailed analytics, market insights, and portfolio management tools.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-primary/10 to-primary-glow/10">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Start Trading?
            </h2>
            <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
              Join thousands of traders who are already profiting from their knowledge on DeFutures.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link to="/markets">Explore Markets</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/dashboard">View Dashboard</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default HowItWorks;