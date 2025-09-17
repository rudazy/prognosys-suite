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
import { CONTRACT_CONFIG } from "@/config/contract";

interface ContractSetupProps {
  onContractConnected?: () => void;
}

const ContractSetup = ({ onContractConnected }: ContractSetupProps) => {
  const { toast } = useToast();
  const { contractState, initializeContract, disconnectContract } = useContract();
  const [formData, setFormData] = useState({
    address: CONTRACT_CONFIG.address,
    abi: JSON.stringify(CONTRACT_CONFIG.abi, null, 2),
    network: CONTRACT_CONFIG.network as "fluent-testnet" | "fluent-mainnet"
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