import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { TrendingUp, User, Menu, Shield, LogOut, Wallet } from "lucide-react";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { useAuth } from "@/components/auth/AuthProvider";
import { useContract } from "@/hooks/useContract";
import { useToast } from "@/hooks/use-toast";
import defuturesLogo from "@/assets/defutures-logo.png";
import { CONTRACT_CONFIG } from "@/config/contract";

const Header = () => {
  const { user, isAdmin, signOut } = useAuth();
  const { contractState, initializeContract, disconnectContract } = useContract();
  const { toast } = useToast();
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnectWallet = async () => {
    setIsConnecting(true);
    try {
      await initializeContract(CONTRACT_CONFIG);
      toast({
        title: "Wallet Connected",
        description: "Your MetaMask wallet has been connected successfully.",
      });
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: "Failed to connect wallet. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = () => {
    disconnectContract();
    toast({
      title: "Wallet Disconnected",
      description: "You can now connect a different wallet.",
    });
  };
  
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <img src={defuturesLogo} alt="DeFutures" className="h-8 w-8" />
          <span className="font-bold text-xl text-foreground">DeFutures</span>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link 
            to="/markets" 
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Markets
          </Link>
          <Link 
            to="/how-it-works" 
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            How it Works
          </Link>
          <Link 
            to="/about" 
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            About
          </Link>
          <a 
            href="https://x.com/DeFuturesx" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Twitter
          </a>
        </nav>

        {/* User Actions */}
        <div className="flex items-center space-x-3">
          <ThemeToggle />
          
          {/* Auth-dependent buttons */}
          {user ? (
            <div className="flex items-center gap-2">
              {/* Dashboard Link */}
              <Button variant="ghost" size="sm" asChild>
                <Link to="/dashboard" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline">Dashboard</span>
                </Link>
              </Button>

              {/* Admin Link (only for admins) */}
              {isAdmin && (
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/admin" className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    <span className="hidden sm:inline">Admin</span>
                  </Link>
                </Button>
              )}

              {/* Sign Out Button */}
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={signOut}
                className="flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Sign Out</span>
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              {/* Connect Wallet Button */}
              {contractState.isConnected ? (
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline" className="flex items-center gap-2">
                    <Wallet className="h-4 w-4" />
                    <span className="hidden sm:inline">
                      {contractState.account?.slice(0, 6)}...{contractState.account?.slice(-4)}
                    </span>
                  </Button>
                  <Button size="sm" variant="ghost" onClick={handleDisconnect}>
                    Disconnect
                  </Button>
                </div>
              ) : (
                <Button 
                  size="sm" 
                  onClick={handleConnectWallet}
                  disabled={isConnecting}
                  className="flex items-center gap-2"
                >
                  <Wallet className="h-4 w-4" />
                  <span className="hidden sm:inline">
                    {isConnecting ? "Connecting..." : "Connect Wallet"}
                  </span>
                </Button>
              )}

              {/* Sign In Button */}
              <Button variant="outline" size="sm" asChild>
                <Link to="/auth" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline">Sign In</span>
                </Link>
              </Button>
            </div>
          )}
          
          {/* Mobile menu button */}
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
export { Header };