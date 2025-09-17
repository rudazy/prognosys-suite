import { useState, useCallback } from "react";
import { ethers } from "ethers";

export interface ContractConfig {
  address: string;
  abi: any[];
  network: "fluent-testnet" | "fluent-mainnet";
}

export interface ContractState {
  isConnected: boolean;
  contract: any;
  account: string | null;
  isLoading: boolean;
  error: string | null;
  provider: any;
  signer: any;
}

export const useContract = () => {
  const [contractState, setContractState] = useState<ContractState>({
    isConnected: false,
    contract: null,
    account: null,
    isLoading: false,
    error: null,
    provider: null,
    signer: null,
  });

  const [contractConfig, setContractConfig] = useState<ContractConfig | null>(null);

  const initializeContract = useCallback(async (config: ContractConfig) => {
    try {
      setContractState(prev => ({ ...prev, isLoading: true, error: null }));
      
      // Store contract configuration
      setContractConfig(config);
      
      // Initialize Web3 connection
      if (typeof window !== "undefined" && (window as any).ethereum) {
        const { ethereum } = window as any;
        
        // Request account access
        const accounts = await ethereum.request({
          method: "eth_requestAccounts",
        });

        if (accounts.length === 0) {
          throw new Error("No accounts found");
        }

        // Initialize ethers provider and signer
        const provider = new ethers.BrowserProvider(ethereum);
        const signer = await provider.getSigner();
        
        // Create contract instance
        const contract = new ethers.Contract(config.address, config.abi, signer);

        setContractState({
          isConnected: true,
          contract,
          account: accounts[0],
          isLoading: false,
          error: null,
          provider,
          signer,
        });

        console.log("Contract initialized:", config.address);
        return true;
      } else {
        throw new Error("MetaMask not detected. Please install MetaMask.");
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to initialize contract";
      setContractState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
        provider: null,
        signer: null,
      }));
      return false;
    }
  }, []);

  const placeBet = useCallback(async (betId: string, position: "YES" | "NO", amount: number) => {
    if (!contractState.isConnected || !contractState.contract) {
      throw new Error("Contract not connected");
    }

    try {
      setContractState(prev => ({ ...prev, isLoading: true }));

      const isYes = position === "YES";
      const amountWei = ethers.parseEther(amount.toString());
      
      // Call contract placeBet function
      const tx = await contractState.contract.placeBet(betId, isYes, { value: amountWei });
      const receipt = await tx.wait();
      
      setContractState(prev => ({ ...prev, isLoading: false }));
      return { success: true, txHash: receipt.hash };
    } catch (error) {
      setContractState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  }, [contractState.isConnected, contractState.contract]);

  const resolveBet = useCallback(async (betId: string, outcome: boolean) => {
    if (!contractState.isConnected || !contractState.contract) {
      throw new Error("Contract not connected");
    }

    try {
      setContractState(prev => ({ ...prev, isLoading: true }));

      // Call contract resolveMarket function
      const tx = await contractState.contract.resolveMarket(betId, outcome);
      const receipt = await tx.wait();
      
      setContractState(prev => ({ ...prev, isLoading: false }));
      return { success: true, txHash: receipt.hash };
    } catch (error) {
      setContractState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  }, [contractState.isConnected, contractState.contract]);

  const getBetData = useCallback(async (betId: string) => {
    if (!contractState.isConnected || !contractState.contract) {
      throw new Error("Contract not connected");
    }

    try {
      // Call contract getMarket function
      const marketData = await contractState.contract.getMarket(betId);
      const totalVolume = Number(ethers.formatEther(marketData.totalVolume));
      const yesPool = Number(ethers.formatEther(marketData.yesPool));
      const noPool = Number(ethers.formatEther(marketData.noPool));
      
      // Calculate prices based on pools
      const totalPool = yesPool + noPool;
      const yesPrice = totalPool > 0 ? (yesPool / totalPool) * 100 : 50;
      const noPrice = totalPool > 0 ? (noPool / totalPool) * 100 : 50;
      
      return {
        totalVolume,
        yesPrice: Math.round(yesPrice),
        noPrice: Math.round(noPrice),
        participants: Math.floor(totalVolume / 10), // Estimate based on volume
      };
    } catch (error) {
      console.error("Error getting bet data:", error);
      throw error;
    }
  }, [contractState.isConnected, contractState.contract]);

  const createMarket = useCallback(async (title: string, description: string, category: string, durationHours: number) => {
    if (!contractState.isConnected || !contractState.contract) {
      throw new Error("Contract not connected");
    }

    try {
      setContractState(prev => ({ ...prev, isLoading: true }));

      const tx = await contractState.contract.createMarket(title, description, category, durationHours);
      const receipt = await tx.wait();
      
      setContractState(prev => ({ ...prev, isLoading: false }));
      return { success: true, txHash: receipt.hash };
    } catch (error) {
      setContractState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  }, [contractState.isConnected, contractState.contract]);

  const getActiveMarketsCount = useCallback(async () => {
    if (!contractState.isConnected || !contractState.contract) {
      return 0;
    }

    try {
      const count = await contractState.contract.getActiveMarketsCount();
      return Number(count);
    } catch (error) {
      console.error("Error getting active markets count:", error);
      return 0;
    }
  }, [contractState.isConnected, contractState.contract]);

  const disconnectContract = useCallback(() => {
    setContractState({
      isConnected: false,
      contract: null,
      account: null,
      isLoading: false,
      error: null,
      provider: null,
      signer: null,
    });
    setContractConfig(null);
  }, []);

  return {
    contractState,
    contractConfig,
    initializeContract,
    placeBet,
    resolveBet,
    getBetData,
    createMarket,
    getActiveMarketsCount,
    disconnectContract,
  };
};