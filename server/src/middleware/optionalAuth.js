const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Optional auth middleware: if a valid Bearer token is provided, attach req.user.
// If no token or token invalid, continue without error (useful for endpoints
// that permit unauthenticated access in some cases, e.g. first-user signup).
async function optionalAuth(req, res, next) {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;
  if (!token) return next();

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.id).select("-password");
    if (user) req.user = user;
  } catch (err) {
    // ignore invalid token and proceed as unauthenticated
  }

  return next();
}

module.exports = optionalAuth;
