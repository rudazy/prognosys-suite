import { ethers } from "ethers";
import { CONTRACT_CONFIG } from "@/config/contract";

// Read-only contract instance using the public RPC
export const useReadOnlyContract = () => {
  const provider = new ethers.JsonRpcProvider(CONTRACT_CONFIG.rpcUrl);
  const contract = new ethers.Contract(
    CONTRACT_CONFIG.address,
    CONTRACT_CONFIG.abi,
    provider
  );

  return {
    contract,
    provider,
    getMarket: async (marketId: number) => {
      try {
        const marketData = await contract.getMarket(marketId);
        const [
          title,
          description,
          category,
          resolutionDate,
          yesPool,
          noPool,
          totalVolume,
          isResolved,
          outcome,
          isCancelled,
        ] = marketData;

        const totalPool = Number(ethers.formatEther(yesPool)) + Number(ethers.formatEther(noPool));
        const yesPrice = totalPool > 0 ? (Number(ethers.formatEther(yesPool)) / totalPool) * 100 : 50;
        const noPrice = 100 - yesPrice;
        const estimatedParticipants = Math.max(1, Math.floor(totalPool / 0.01)); // Estimate based on volume

        return {
          title,
          description,
          category,
          resolutionDate: Number(resolutionDate),
          yesPool: Number(ethers.formatEther(yesPool)),
          noPool: Number(ethers.formatEther(noPool)),
          totalVolume: Number(ethers.formatEther(totalVolume)),
          isResolved,
          outcome,
          isCancelled,
          yesPrice,
          noPrice,
          participants: estimatedParticipants,
        };
      } catch (error) {
        console.error("Error fetching market data:", error);
        return null;
      }
    },
    getActiveMarketsCount: async () => {
      try {
        const count = await contract.getActiveMarketsCount();
        return Number(count);
      } catch (error) {
        console.error("Error fetching active markets count:", error);
        return 0;
      }
    },
  };
};