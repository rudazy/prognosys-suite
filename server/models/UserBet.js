const mongoose = require('mongoose');

const userBetSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  betId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bet',
    required: true
  },
  position: {
    type: String,
    enum: ['yes', 'no'],
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  odds: {
    type: Number,
    required: true
  },
  potentialPayout: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'won', 'lost', 'claimed'],
    default: 'active'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('UserBet', userBetSchema);