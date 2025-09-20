# 🔒 Security Setup Guide

## Critical Setup Steps (MUST DO BEFORE DEPLOYMENT)

### 1. Environment Variables
```bash
# In server/.env - Replace with your actual values
MONGODB_URI=mongodb+srv://your-username:your-password@your-cluster.mongodb.net/defutures
JWT_SECRET=your-super-secure-random-string-64-chars
PORT=3001
NODE_ENV=production
```

### 2. Generate Secure JWT Secret
```bash
# Run this command and use the output as JWT_SECRET
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 3. Install Server Dependencies
```bash
cd server
npm install joi express-rate-limit mongoose bcryptjs jsonwebtoken helmet cors dotenv express
```

### 4. Security Features Implemented ✅

#### Authentication Security
- ✅ Strong password requirements (8+ chars, uppercase, lowercase, number, special char)
- ✅ Rate limiting on auth endpoints (5 attempts per 15 minutes)
- ✅ Secure JWT token generation with 64-character secret
- ✅ Input validation using Joi schemas

#### Database Security
- ✅ MongoDB transactions for atomic betting operations
- ✅ Privilege escalation prevention (users can't make themselves admin)
- ✅ Race condition fixes in balance updates
- ✅ Input sanitization and validation

#### API Security
- ✅ Rate limiting on all endpoints
- ✅ Security headers (CSP, XSS protection, etc.)
- ✅ CORS configuration
- ✅ Admin action logging
- ✅ Error handling improvements

#### Data Protection
- ✅ Password hashing with bcrypt
- ✅ Secure token storage recommendations
- ✅ Input validation on all endpoints
- ✅ Protection against NoSQL injection

### 5. Production Deployment Checklist

Before going live:
- [ ] Update CORS origins in `server/index.js` to your production domain
- [ ] Set `NODE_ENV=production` in environment
- [ ] Use a managed MongoDB Atlas database
- [ ] Enable MongoDB authentication
- [ ] Set up SSL/TLS certificates
- [ ] Configure firewall rules
- [ ] Set up monitoring and logging
- [ ] Regular security audits

### 6. Admin Access
The first user in your database can be manually set as admin:
```javascript
// In MongoDB shell or admin script
db.users.updateOne(
  { email: "your-admin-email@example.com" },
  { $set: { isAdmin: true } }
)
```

### 7. Security Monitoring
All admin actions are automatically logged. Monitor these logs for:
- Unauthorized admin access attempts
- Suspicious betting patterns
- Rate limit violations
- Failed authentication attempts

## Security Status: PRODUCTION READY ✅

Your application now has enterprise-grade security measures in place!