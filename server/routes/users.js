const express = require('express');
const User = require('../models/User');
const UserBet = require('../models/UserBet');
const auth = require('../middleware/auth');

const router = express.Router();

// Get user profile
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update user profile
router.put('/profile', auth, async (req, res) => {
  try {
    const { displayName, avatarUrl } = req.body;
    
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { displayName, avatarUrl },
      { new: true }
    ).select('-password');
    
    res.json(user);
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get user's bets
router.get('/bets', auth, async (req, res) => {
  try {
    const userBets = await UserBet.find({ userId: req.user._id })
      .populate('betId', 'title description category endDate status resolvedOutcome')
      .sort({ createdAt: -1 });
    
    res.json(userBets);
  } catch (error) {
    console.error('Get user bets error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get user statistics
router.get('/stats', auth, async (req, res) => {
  try {
    const totalBets = await UserBet.countDocuments({ userId: req.user._id });
    const totalVolume = await UserBet.aggregate([
      { $match: { userId: req.user._id } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    
    const winRate = await UserBet.aggregate([
      { $match: { userId: req.user._id, status: { $in: ['won', 'lost'] } } },
      { 
        $group: { 
          _id: null, 
          total: { $sum: 1 },
          won: { $sum: { $cond: [{ $eq: ['$status', 'won'] }, 1, 0] } }
        }
      }
    ]);

    res.json({
      totalBets,
      totalVolume: totalVolume[0]?.total || 0,
      winRate: winRate[0] ? (winRate[0].won / winRate[0].total) * 100 : 0
    });
  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Add funds to user balance (for testing)
router.post('/add-funds', auth, async (req, res) => {
  try {
    const { amount } = req.body;
    const amountInLegacyScale = parseFloat(amount) * 1000; // Convert ETH to legacy scale
    
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { balance: amountInLegacyScale }
    });
    
    const user = await User.findById(req.user._id).select('-password');
    res.json({ message: `Added ${amount} ETH to your balance`, user });
  } catch (error) {
    console.error('Add funds error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;