const rateLimit = require('express-rate-limit');

// Rate limiting for authentication endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs for auth
  message: { error: 'Too many authentication attempts, please try again later' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiting for bet placement
const betLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // limit each IP to 10 bet placements per minute
  message: { error: 'Too many bet attempts, please slow down' },
  standardHeaders: true,
  legacyHeaders: false,
});

// General API rate limiting
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: { error: 'Too many requests, please try again later' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Admin action logging middleware
const logAdminAction = (action) => {
  return (req, res, next) => {
    if (req.user && req.user.isAdmin) {
      console.log(`[ADMIN ACTION] ${new Date().toISOString()} - User ${req.user.email} performed: ${action}`, {
        userId: req.user._id,
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        body: action.includes('sensitive') ? '[REDACTED]' : req.body
      });
    }
    next();
  };
};

// Security headers middleware
const securityHeaders = (req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  if (req.secure) {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }
  
  next();
};

module.exports = {
  authLimiter,
  betLimiter,
  generalLimiter,
  logAdminAction,
  securityHeaders
};