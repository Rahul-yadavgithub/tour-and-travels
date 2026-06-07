const { ClerkExpressRequireAuth } = require('@clerk/clerk-sdk-node');
const Guide = require('../models/Guide');

// Standard Clerk middleware validates the JWT and sets req.auth
const clerkAuth = [
  (req, res, next) => {
    console.log(`[Auth Check] ${req.method} ${req.url}`);
    console.log(`[Auth Check] Secret Key loaded:`, !!process.env.CLERK_SECRET_KEY, process.env.CLERK_SECRET_KEY ? process.env.CLERK_SECRET_KEY.substring(0, 7) + '...' : '');
    const authHeader = req.headers.authorization;
    if (authHeader) {
      console.log(`[Auth Check] Token length:`, authHeader.length);
      // Attempt to decode the JWT payload to see if the issuer matches
      try {
        const token = authHeader.split(' ')[1];
        const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
        console.log(`[Auth Check] Token Issuer (iss):`, payload.iss);
      } catch(e) {
        console.log(`[Auth Check] Could not decode token:`, e.message);
      }
    } else {
      console.log(`[Auth Check] Authorization Header: Missing!`);
    }
    next();
  },
  ClerkExpressRequireAuth(),
  async (req, res, next) => {
    try {
      const clerkUserId = req.auth.claims.sub;
      
      // Auto-create or find the guide
      let guide = await Guide.findOne({ clerkUserId });
      
      if (!guide) {
        // If guide doesn't exist yet, create a basic entry
        guide = await Guide.create({
          clerkUserId,
          // Extract email from claims if available (depends on Clerk token payload)
          email: req.auth.claims?.email_address || ''
        });
      }

      req.guide = guide;
      req.guideId = guide._id;
      next();
    } catch (error) {
      console.error("Clerk Auth Error:", error);
      res.status(500).json({ message: "Internal server error during authentication." });
    }
  }
];

module.exports = clerkAuth;
