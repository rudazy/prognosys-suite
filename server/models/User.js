const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  displayName: {
    type: String,
    default: ''
  },
  avatarUrl: {
    type: String,
    default: ''
  },
  balance: {
    type: Number,
    default: 1000 // Default balance in legacy scale (equivalent to 1 ETH)
  },
  isAdmin: {
    type: Boolean,
    default: false
  },
  walletAddress: {
    type: String,
    default: function() {
      // Generate deterministic wallet address from user ID
      return '0x' + this._id.toString().replace(/[^a-f0-9]/gi, '').substring(0, 40).padEnd(40, '0');
    }
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to check password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);