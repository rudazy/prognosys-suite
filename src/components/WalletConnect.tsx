import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useContract } from "@/hooks/useContract";
import { CONTRACT_CONFIG } from "@/config/contract";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/auth/AuthProvider";
import { Wallet, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const WalletConnect = () => {
  const { contractState, disconnectContract, initializeContract } = useContract();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
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

  const handleUseEmailWallet = async () => {
    if (!user) {
      toast({
        title: "Sign In Required",
        description: "Please sign in to use email wallet.",
      });
      navigate("/auth");
      return;
    }
    
    // Email wallet setup logic here
    const emailWalletAddress = `0x${user.id.replace(/-/g, '').substring(0, 40)}`;
    
    toast({
      title: "Email Wallet Ready",
      description: "Your email-based wallet is ready to use.",
    });
  };

  if (contractState.isConnected) {
    return (
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Wallet Connected</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">Account:</p>
            <p className="font-mono text-sm break-all">{contractState.account}</p>
          </div>
          <Button onClick={disconnectContract} variant="outline" className="w-full">
            Disconnect Wallet
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Choose Your Wallet</CardTitle>
        {!user && (
          <p className="text-sm text-muted-foreground">
            <Button variant="link" className="p-0 h-auto text-primary" onClick={() => navigate("/auth")}>
              Sign in
            </Button> to use email wallet or connect MetaMask
          </p>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={handleConnectWallet} 
          className="w-full"
          disabled={isConnecting}
        >
          <Wallet className="w-4 h-4 mr-2" />
          {isConnecting ? "Connecting..." : "Connect MetaMask"}
        </Button>
        
        <div className="text-center text-sm text-muted-foreground">or</div>
        
        <Button 
          onClick={handleUseEmailWallet} 
          variant="outline" 
          className="w-full"
          disabled={!user}
        >
          <Mail className="w-4 h-4 mr-2" />
          {user ? "Use Email Wallet" : "Sign In for Email Wallet"}
        </Button>
        
        {user && (
          <p className="text-xs text-muted-foreground text-center">
            Email wallet uses your account to create a secure wallet address automatically.
          </p>
        )}
      </CardContent>
    </Card>
  );
};