const Joi = require('joi');

// Validation schemas
const schemas = {
  register: Joi.object({
    email: Joi.string().email().required().max(255),
    password: Joi.string().min(8).pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])')).required()
      .messages({
        'string.pattern.base': 'Password must contain at least 8 characters with uppercase, lowercase, number and special character'
      }),
    displayName: Joi.string().max(50).optional()
  }),
  
  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  }),
  
  updateProfile: Joi.object({
    displayName: Joi.string().max(50).optional(),
    avatarUrl: Joi.string().uri().max(500).optional()
  }).options({ allowUnknown: false, stripUnknown: true }),
  
  createBet: Joi.object({
    title: Joi.string().min(10).max(200).required(),
    description: Joi.string().max(1000).optional(),
    category: Joi.string().max(50).required(),
    endDate: Joi.date().greater('now').required()
  }),
  
  placeBet: Joi.object({
    position: Joi.string().valid('yes', 'no').required(),
    amount: Joi.number().positive().max(1000).required()
  }),
  
  addFunds: Joi.object({
    amount: Joi.number().positive().max(100).required()
  })
};

// Validation middleware factory
const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body);
    
    if (error) {
      return res.status(400).json({ 
        error: 'Validation error', 
        details: error.details.map(detail => detail.message)
      });
    }
    
    // Replace req.body with validated and sanitized data
    req.body = value;
    next();
  };
};

module.exports = {
  validate,
  schemas
};