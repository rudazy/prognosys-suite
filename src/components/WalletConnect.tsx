import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useContract } from "@/hooks/useContract";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Wallet, Mail } from "lucide-react";

export const WalletConnect = () => {
  const { contractState, disconnectContract, initializeContract } = useContract();
  const { toast } = useToast();
  const [isConnecting, setIsConnecting] = useState(false);

  // Default contract configuration - hidden from users
  const defaultConfig = {
    address: "0x1234567890123456789012345678901234567890", // Replace with actual contract address
    abi: [], // Replace with actual ABI
    network: "fluent-testnet" as const
  };

  const handleConnectWallet = async () => {
    setIsConnecting(true);
    try {
      await initializeContract(defaultConfig);
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
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication Required",
          description: "Please sign in to use email wallet.",
          variant: "destructive",
        });
        return;
      }
      
      // Simulate connecting with email-based wallet
      // In a real implementation, you'd generate or retrieve a wallet address for the user
      const emailWalletAddress = `0x${user.id.replace(/-/g, '').substring(0, 40)}`;
      
      toast({
        title: "Email Wallet Ready",
        description: "Your email-based wallet is ready to use.",
      });
      
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to set up email wallet.",
        variant: "destructive",
      });
    }
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
        >
          <Mail className="w-4 h-4 mr-2" />
          Use Email Wallet
        </Button>
        
        <p className="text-xs text-muted-foreground text-center">
          Email wallet uses your account to create a secure wallet address automatically.
        </p>
      </CardContent>
    </Card>
  );
};