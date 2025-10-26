const User = require("../models/User");

async function listReporters(req, res) {
  const reporters = await User.find({ role: "reporter" }).select("-password");
  res.json(reporters);
}

async function deleteReporter(req, res) {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "Not found" });
    if (user.role !== "reporter")
      return res.status(400).json({ message: "Not a reporter" });
    await user.deleteOne();
    res.json({ message: "Reporter removed" });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "Error removing reporter" });
  }
}

async function editReporter(req, res) {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ message: "Not found" });
    if (user.role !== "reporter")
      return res.status(400).json({ message: "Not a reporter" });
    Object.assign(user, req.body);
    if (req.body.password) {
      // if password provided, hash it
      const bcrypt = require("bcrypt");
      user.password = await bcrypt.hash(req.body.password, 10);
    }
    await user.save();
    res.json({ id: user._id, name: user.name, email: user.email });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "Error editing reporter" });
  }
}

module.exports = { listReporters, deleteReporter, editReporter };
