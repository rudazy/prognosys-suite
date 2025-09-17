import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { ethers } from "https://esm.sh/ethers@6.15.0"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { 
      contractAddress, 
      functionName, 
      params, 
      userAddress,
      marketId 
    } = await req.json()

    // Get secrets from Supabase
    const relayerPrivateKey = Deno.env.get('RELAYER_PRIVATE_KEY')
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

    if (!relayerPrivateKey || !supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing required environment variables')
    }

    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Connect to Ethereum (using a public RPC for demo - in production use Infura/Alchemy)
    const provider = new ethers.JsonRpcProvider('https://eth-sepolia.g.alchemy.com/v2/demo')
    const wallet = new ethers.Wallet(relayerPrivateKey, provider)

    // Basic betting contract ABI
    const contractABI = [
      "function claimWinnings(uint256 marketId) external",
      "function getMarket(uint256 marketId) view returns (tuple(string title, string description, uint256 endTime, bool resolved, bool outcome, uint256 yesPool, uint256 noPool))",
      "function userBets(address user, uint256 marketId) view returns (tuple(uint256 yesAmount, uint256 noAmount))"
    ]

    const contract = new ethers.Contract(contractAddress, contractABI, wallet)

    let txHash = ''

    if (functionName === 'claimWinnings') {
      // Verify user has winnings to claim
      const userBet = await contract.userBets(userAddress, marketId)
      const market = await contract.getMarket(marketId)
      
      if (!market.resolved) {
        throw new Error('Market not yet resolved')
      }

      const hasWinnings = (market.outcome && userBet.yesAmount > 0) || 
                         (!market.outcome && userBet.noAmount > 0)
      
      if (!hasWinnings) {
        throw new Error('No winnings to claim')
      }

      // Execute claim transaction with relayer paying gas
      const tx = await contract.claimWinnings(marketId)
      await tx.wait()
      txHash = tx.hash

      // Update database
      await supabase
        .from('user_bets')
        .update({ status: 'claimed' })
        .eq('user_id', userAddress)
        .eq('bet_id', marketId)

    } else {
      throw new Error('Unsupported function')
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        txHash,
        message: 'Transaction relayed successfully' 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )

  } catch (error) {
    console.error('Relay error:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})