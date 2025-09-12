import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Target, Lightbulb, Globe, Users, Github, Twitter } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-background to-muted/50">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-4xl mx-auto">
              <Badge variant="secondary" className="mb-4">
                About DeFutures
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent mb-6">
                The Future of Prediction Markets
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                DeFutures is a decentralized prediction market platform that harnesses the wisdom of crowds 
                to create more accurate forecasts and profitable trading opportunities.
              </p>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Mission</h2>
                  <p className="text-muted-foreground text-lg mb-6">
                    We believe that prediction markets are the most efficient way to aggregate information 
                    and forecast future events. By democratizing access to these markets, we're creating 
                    a more informed world where everyone can benefit from collective intelligence.
                  </p>
                  <p className="text-muted-foreground text-lg">
                    Built on the Fluent Testnet, DeFutures combines the security and transparency of 
                    blockchain technology with an intuitive user experience that makes prediction markets 
                    accessible to everyone.
                  </p>
                </div>
                <Card className="p-8">
                  <div className="text-center">
                    <Target className="h-16 w-16 text-primary mx-auto mb-4" />
                    <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
                    <p className="text-muted-foreground">
                      To become the world's leading decentralized prediction market platform, 
                      where knowledge meets opportunity and everyone can profit from their insights.
                    </p>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Core Values</h2>
              <p className="text-muted-foreground text-lg">The principles that guide everything we do</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <Card>
                <CardHeader>
                  <Lightbulb className="h-12 w-12 text-primary mb-4" />
                  <CardTitle>Innovation</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    We're constantly pushing the boundaries of what's possible in prediction markets, 
                    leveraging cutting-edge blockchain technology and user experience design.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Globe className="h-12 w-12 text-primary mb-4" />
                  <CardTitle>Transparency</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Built on blockchain technology, every transaction and market resolution is 
                    transparent and verifiable. No hidden fees, no manipulation.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Users className="h-12 w-12 text-primary mb-4" />
                  <CardTitle>Community</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Our platform is built by the community, for the community. We listen to our users 
                    and continuously improve based on feedback and needs.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Technology Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-8">Built on Fluent Testnet</h2>
              <p className="text-muted-foreground text-lg mb-12">
                DeFutures is powered by advanced blockchain technology that ensures security, 
                transparency, and accessibility for all users.
              </p>

              <div className="grid md:grid-cols-2 gap-8">
                <Card className="p-6">
                  <h3 className="text-xl font-bold mb-4">Decentralized Architecture</h3>
                  <p className="text-muted-foreground">
                    Smart contracts handle all market operations, ensuring trustless execution 
                    and eliminating counterparty risk.
                  </p>
                </Card>

                <Card className="p-6">
                  <h3 className="text-xl font-bold mb-4">Open Source</h3>
                  <p className="text-muted-foreground">
                    Our platform is open source, allowing the community to contribute, 
                    audit, and improve the codebase continuously.
                  </p>
                </Card>

                <Card className="p-6">
                  <h3 className="text-xl font-bold mb-4">Scalable & Fast</h3>
                  <p className="text-muted-foreground">
                    Built for high-throughput trading with minimal fees and instant settlement, 
                    providing the best user experience possible.
                  </p>
                </Card>

                <Card className="p-6">
                  <h3 className="text-xl font-bold mb-4">User-Centric Design</h3>
                  <p className="text-muted-foreground">
                    Intuitive interface designed for both crypto natives and newcomers, 
                    making prediction markets accessible to everyone.
                  </p>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Open Source Section */}
        <section className="py-20 bg-gradient-to-r from-primary/5 to-primary-glow/5">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-3xl mx-auto">
              <Github className="h-16 w-16 text-primary mx-auto mb-6" />
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Open Source & Community Driven</h2>
              <p className="text-muted-foreground text-lg mb-8">
                DeFutures is fully open source, built in public, and driven by community contributions. 
                Join us in building the future of prediction markets.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="outline" onClick={() => {
                  alert("To make this project open source: Click the GitHub button in the top-right of your Lovable editor to connect and create a repository.");
                }}>
                  <Github className="h-4 w-4 mr-2" />
                  Setup GitHub
                </Button>
                <Button size="lg" variant="outline" onClick={() => {
                  alert("First connect to GitHub using the button in your Lovable editor, then you can contribute to the project.");
                }}>
                  How to Contribute
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-20">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Get in Touch</h2>
            <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
              Have questions, suggestions, or want to collaborate? We'd love to hear from you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="outline" asChild>
                <a href="https://x.com/DeFuturesx" target="_blank" rel="noopener noreferrer">
                  <Twitter className="h-4 w-4 mr-2" />
                  Follow on Twitter
                </a>
              </Button>
              <Button size="lg" variant="outline">
                <Link to="/markets">Start Trading</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default About;