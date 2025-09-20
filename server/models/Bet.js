const mongoose = require('mongoose');

const betSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  category: {
    type: String,
    required: true
  },
  creatorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  resolutionDate: {
    type: Date,
    default: null
  },
  status: {
    type: String,
    enum: ['active', 'resolved', 'cancelled'],
    default: 'active'
  },
  totalVolume: {
    type: Number,
    default: 0
  },
  participants: {
    type: Number,
    default: 0
  },
  yesPrice: {
    type: Number,
    default: 0.5
  },
  noPrice: {
    type: Number,
    default: 0.5
  },
  resolvedOutcome: {
    type: Boolean,
    default: null
  },
  isTrending: {
    type: Boolean,
    default: false
  },
  isLive: {
    type: Boolean,
    default: true
  },
  contractMarketId: {
    type: Number,
    default: null
  },
  contractAddress: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Bet', betSchema);