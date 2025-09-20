import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const WalletConnect = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return (
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Email Wallet</CardTitle>
          <p className="text-sm text-muted-foreground">
            Sign in to use your email-based wallet for trading
          </p>
        </CardHeader>
        <CardContent>
          <Button onClick={() => navigate("/auth")} className="w-full">
            <Mail className="w-4 h-4 mr-2" />
            Sign In for Email Wallet
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Email Wallet Active</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm text-muted-foreground">Wallet Address:</p>
          <p className="font-mono text-sm break-all">{user.walletAddress}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Balance:</p>
          <p className="text-lg font-semibold">{((user.balance || 0) / 1000).toFixed(3)} ETH</p>
        </div>
        <Button onClick={() => navigate("/dashboard")} variant="outline" className="w-full">
          View Dashboard
        </Button>
      </CardContent>
    </Card>
  );
};