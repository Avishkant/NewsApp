const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
// dotenv is loaded in the entrypoint (index.js). Avoid loading it again here to
// prevent duplicate logs and double-injection behavior.

const connectDB = require("./utils/db");
const authRoutes = require("./routes/authRoutes");
const newsRoutes = require("./routes/newsRoutes");
const ownerRoutes = require("./routes/ownerRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const districtRoutes = require("./routes/districtRoutes");
const contactRoutes = require("./routes/contactRoutes");

const app = express();

// Connect to DB (attempt on startup but don't crash the process)
connectDB().catch((err) => console.error("DB connection error:", err));

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Root health route
app.get("/", (req, res) => res.send("Hello from server"));

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/news", newsRoutes);
app.use("/api/reporters", ownerRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/districts", districtRoutes);
app.use("/api/contact", contactRoutes);

// Error handler (minimal)
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Internal Server Error" });
});

module.exports = app;
