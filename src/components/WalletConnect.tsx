import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useContract } from "@/hooks/useContract";
import ContractSetup from "@/components/ContractSetup";

export const WalletConnect = () => {
  const { contractState, disconnectContract } = useContract();

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
          <div>
            <p className="text-sm text-muted-foreground">Contract:</p>
            <p className="font-mono text-sm break-all">{contractState.contract?.target}</p>
          </div>
          <Button onClick={disconnectContract} variant="outline" className="w-full">
            Disconnect
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Connect to Blockchain</CardTitle>
      </CardHeader>
      <CardContent>
        <ContractSetup onContractConnected={() => {}} />
      </CardContent>
    </Card>
  );
};