const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Helper: sign token
function signToken(user) {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
}

// Signup: owner adds reporters. If no users exist, allow creating first owner.
async function signup(req, res) {
  const { name, email, password, role } = req.body;

  // If creating a reporter, require an authenticated owner
  const usersCount = await User.countDocuments();
  if (usersCount > 0) {
    // require owner token for creating users
    if (!req.user || req.user.role !== "owner") {
      return res.status(403).json({ message: "Only owner can create users" });
    }
  }

  try {
    const hashed = await bcrypt.hash(password, 10);
    const userRole = usersCount === 0 ? "owner" : role || "reporter";
    const user = await User.create({
      name,
      email,
      password: hashed,
      role: userRole,
    });
    const token = signToken(user);
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error(err);
    res
      .status(400)
      .json({ message: "Error creating user", error: err.message });
  }
}

async function login(req, res) {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: "Invalid credentials" });
    const token = signToken(user);
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Login error" });
  }
}

async function me(req, res) {
  if (!req.user) return res.status(401).json({ message: "Not authenticated" });
  res.json({ user: req.user });
}

module.exports = { signup, login, me };
