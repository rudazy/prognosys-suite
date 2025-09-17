import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useContract } from "@/hooks/useContract";
import { Wallet, Link as LinkIcon, Settings } from "lucide-react";

interface ContractSetupProps {
  onContractConnected?: () => void;
}

const ContractSetup = ({ onContractConnected }: ContractSetupProps) => {
  const { toast } = useToast();
  const { contractState, initializeContract, disconnectContract } = useContract();
  
  const [formData, setFormData] = useState({
    address: "0x7E37DC5d484f62C059580BD36c06F40238aA562e",
    abi: JSON.stringify([{"inputs":[{"internalType":"uint256","name":"_marketId","type":"uint256"}],"name":"cancelMarket","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"OwnableInvalidOwner","type":"error"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"OwnableUnauthorizedAccount","type":"error"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"marketId","type":"uint256"},{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"bool","name":"isYes","type":"bool"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"newOdds","type":"uint256"}],"name":"BetPlaced","type":"event"},{"inputs":[{"internalType":"uint256","name":"_marketId","type":"uint256"}],"name":"claimWinnings","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"_title","type":"string"},{"internalType":"string","name":"_description","type":"string"},{"internalType":"string","name":"_category","type":"string"},{"internalType":"uint256","name":"_durationHours","type":"uint256"}],"name":"createMarket","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"FeesWithdrawn","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"marketId","type":"uint256"}],"name":"MarketCancelled","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"marketId","type":"uint256"},{"indexed":false,"internalType":"string","name":"title","type":"string"},{"indexed":true,"internalType":"address","name":"creator","type":"address"},{"indexed":false,"internalType":"uint256","name":"resolutionDate","type":"uint256"}],"name":"MarketCreated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"marketId","type":"uint256"},{"indexed":false,"internalType":"bool","name":"outcome","type":"bool"},{"indexed":false,"internalType":"uint256","name":"totalPayout","type":"uint256"}],"name":"MarketResolved","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"inputs":[],"name":"pause","outputs":[],"stateMutability":"nonpayable","type":"function"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"account","type":"address"}],"name":"Paused","type":"event"},{"inputs":[{"internalType":"uint256","name":"_marketId","type":"uint256"},{"internalType":"bool","name":"_isYes","type":"bool"}],"name":"placeBet","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_marketId","type":"uint256"},{"internalType":"bool","name":"_outcome","type":"bool"}],"name":"resolveMarket","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"unpause","outputs":[],"stateMutability":"nonpayable","type":"function"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"account","type":"address"}],"name":"Unpaused","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"marketId","type":"uint256"},{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"WinningsClaimed","type":"event"},{"inputs":[],"name":"withdrawFees","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_marketId","type":"uint256"},{"internalType":"bool","name":"_isYes","type":"bool"}],"name":"calculateOdds","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getActiveMarketsCount","outputs":[{"internalType":"uint256","name":"count","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_marketId","type":"uint256"}],"name":"getMarket","outputs":[{"internalType":"string","name":"title","type":"string"},{"internalType":"string","name":"description","type":"string"},{"internalType":"string","name":"category","type":"string"},{"internalType":"uint256","name":"resolutionDate","type":"uint256"},{"internalType":"uint256","name":"yesPool","type":"uint256"},{"internalType":"uint256","name":"noPool","type":"uint256"},{"internalType":"uint256","name":"totalVolume","type":"uint256"},{"internalType":"bool","name":"isResolved","type":"bool"},{"internalType":"bool","name":"outcome","type":"bool"},{"internalType":"bool","name":"isCancelled","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_user","type":"address"}],"name":"getUserMarkets","outputs":[{"internalType":"uint256[]","name":"","type":"uint256[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_marketId","type":"uint256"},{"internalType":"address","name":"_user","type":"address"}],"name":"getUserPosition","outputs":[{"internalType":"uint256","name":"yesAmount","type":"uint256"},{"internalType":"uint256","name":"noAmount","type":"uint256"},{"internalType":"bool","name":"hasClaimed","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_marketId","type":"uint256"}],"name":"isMarketActive","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"marketCounter","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"markets","outputs":[{"internalType":"string","name":"title","type":"string"},{"internalType":"string","name":"description","type":"string"},{"internalType":"string","name":"category","type":"string"},{"internalType":"uint256","name":"resolutionDate","type":"uint256"},{"internalType":"uint256","name":"createdAt","type":"uint256"},{"internalType":"uint256","name":"yesPool","type":"uint256"},{"internalType":"uint256","name":"noPool","type":"uint256"},{"internalType":"uint256","name":"totalVolume","type":"uint256"},{"internalType":"bool","name":"isResolved","type":"bool"},{"internalType":"bool","name":"outcome","type":"bool"},{"internalType":"bool","name":"isCancelled","type":"bool"},{"internalType":"address","name":"creator","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"MAX_BET_AMOUNT","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"MIN_BET_AMOUNT","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"paused","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"PLATFORM_FEE","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalPlatformFees","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"}],"name":"userMarkets","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"}], null, 2),
    network: "fluent-testnet" as "fluent-testnet" | "fluent-mainnet"
  });

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.address || !formData.abi) {
      toast({
        title: "Error",
        description: "Please provide both contract address and ABI",
        variant: "destructive",
      });
      return;
    }

    try {
      const abi = JSON.parse(formData.abi);
      
      const success = await initializeContract({
        address: formData.address,
        abi,
        network: formData.network,
      });

      if (success) {
        toast({
          title: "Success",
          description: "Smart contract connected successfully!",
        });
        onContractConnected?.();
      }
    } catch (error) {
      console.error("Contract connection error:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to connect to contract",
        variant: "destructive",
      });
    }
  };

  const handleDisconnect = () => {
    disconnectContract();
    toast({
      title: "Disconnected",
      description: "Smart contract disconnected",
    });
  };

  if (contractState.isConnected) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LinkIcon className="h-5 w-5 text-success" />
            Contract Connected
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Contract Address</Label>
            <div className="p-3 bg-muted rounded-md font-mono text-sm">
              {contractState.contract?.address}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Connected Account</Label>
            <div className="p-3 bg-muted rounded-md font-mono text-sm">
              {contractState.account}
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={handleDisconnect}>
              Disconnect Contract
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Smart Contract Setup
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleConnect} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="address">Contract Address</Label>
            <Input
              id="address"
              placeholder="0x..."
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="abi">Contract ABI (JSON)</Label>
            <Textarea
              id="abi"
              placeholder="Paste your contract ABI here..."
              value={formData.abi}
              onChange={(e) => setFormData({ ...formData, abi: e.target.value })}
              rows={6}
              className="font-mono text-sm"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="network">Network</Label>
            <Select 
              value={formData.network} 
              onValueChange={(value: "fluent-testnet" | "fluent-mainnet") => 
                setFormData({ ...formData, network: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fluent-testnet">Fluent Testnet</SelectItem>
                <SelectItem value="fluent-mainnet">Fluent Mainnet</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            disabled={contractState.isLoading}
          >
            <Wallet className="h-4 w-4 mr-2" />
            {contractState.isLoading ? "Connecting..." : "Connect Contract"}
          </Button>

          {contractState.error && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
              <p className="text-sm text-destructive">{contractState.error}</p>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
};

export default ContractSetup;