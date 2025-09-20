const express = require('express');
const Bet = require('../models/Bet');
const UserBet = require('../models/UserBet');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all bets
router.get('/', async (req, res) => {
  try {
    const bets = await Bet.find()
      .populate('creatorId', 'email displayName')
      .sort({ createdAt: -1 });
    
    res.json(bets);
  } catch (error) {
    console.error('Get bets error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get bet by ID
router.get('/:id', async (req, res) => {
  try {
    const bet = await Bet.findById(req.params.id)
      .populate('creatorId', 'email displayName');
    
    if (!bet) {
      return res.status(404).json({ error: 'Bet not found' });
    }
    
    res.json(bet);
  } catch (error) {
    console.error('Get bet error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create new bet (admin only)
router.post('/', auth, async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const { title, description, category, endDate } = req.body;

    const bet = new Bet({
      title,
      description,
      category,
      creatorId: req.user._id,
      endDate: new Date(endDate)
    });

    await bet.save();
    await bet.populate('creatorId', 'email displayName');
    
    res.status(201).json(bet);
  } catch (error) {
    console.error('Create bet error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Place a bet
router.post('/:id/place', auth, async (req, res) => {
  try {
    const { position, amount } = req.body;
    const betId = req.params.id;

    // Validate input
    if (!position || !amount || !['yes', 'no'].includes(position)) {
      return res.status(400).json({ error: 'Invalid bet data' });
    }

    const betAmount = parseFloat(amount);
    if (betAmount <= 0) {
      return res.status(400).json({ error: 'Bet amount must be greater than 0' });
    }

    // Convert ETH to legacy USD scale for balance comparison
    const betAmountInLegacyScale = betAmount * 1000;

    // Check user balance
    const user = await User.findById(req.user._id);
    if (user.balance < betAmountInLegacyScale) {
      return res.status(400).json({ error: 'Insufficient balance. Please add funds to your wallet.' });
    }

    // Get bet details
    const bet = await Bet.findById(betId);
    if (!bet) {
      return res.status(404).json({ error: 'Bet not found' });
    }

    if (bet.status !== 'active') {
      return res.status(400).json({ error: 'Bet is not active' });
    }

    // Calculate potential payout (simple 1:1 for now)
    const potentialPayout = betAmount * 2 * 1000; // Convert to legacy scale

    // Start transaction-like operations
    try {
      // Deduct from user balance
      await User.findByIdAndUpdate(req.user._id, {
        $inc: { balance: -betAmountInLegacyScale }
      });

      // Create user bet record
      const userBet = new UserBet({
        userId: req.user._id,
        betId: betId,
        position: position,
        amount: betAmountInLegacyScale,
        odds: position === 'yes' ? bet.yesPrice : bet.noPrice,
        potentialPayout: potentialPayout
      });

      await userBet.save();

      // Update bet statistics
      const participantCount = await UserBet.distinct('userId', { betId: betId });
      await Bet.findByIdAndUpdate(betId, {
        $inc: { totalVolume: betAmountInLegacyScale },
        participants: participantCount.length
      });

      res.json({ 
        success: true, 
        message: `You bet ${amount} ETH on ${position.toUpperCase()}`,
        userBet: userBet
      });

    } catch (dbError) {
      // Rollback user balance if bet creation failed
      await User.findByIdAndUpdate(req.user._id, {
        $inc: { balance: betAmountInLegacyScale }
      });
      throw dbError;
    }

  } catch (error) {
    console.error('Place bet error:', error);
    res.status(500).json({ error: error.message || 'Server error' });
  }
});

// Get user's bets
router.get('/:id/user-bets', auth, async (req, res) => {
  try {
    const betId = req.params.id;
    const userBets = await UserBet.find({ 
      betId: betId, 
      userId: req.user._id 
    }).populate('betId', 'title');
    
    res.json(userBets);
  } catch (error) {
    console.error('Get user bets error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;