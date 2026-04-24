const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
require("dotenv").config();

const connectDB = require("./src/config/db");

const app = express();

// connect DB
connectDB();

// trust proxy (Render)
app.set("trust proxy", 1);

// security headers
app.use(helmet());

// allowed frontend origins
const allowedOrigins = [
  "https://orchidhackx.vercel.app",
  "https://orchidhackx.oic.edu.np",
  "http://localhost:5173",
];

// CORS setup
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    console.log("Blocked CORS:", origin);
    return callback(null, false);
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));
// parse JSON
app.use(express.json());

// rate limiter (API protection)
app.use(
  "/api/",
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { error: "Too many requests, try later" },
    standardHeaders: true,
    legacyHeaders: false,
  })
);

// sanitize data
app.use((req, res, next) => {
  if (req.body) req.body = mongoSanitize.sanitize(req.body);
  if (req.params) req.params = mongoSanitize.sanitize(req.params);
  next();
});

// test route
app.get("/", (req, res) => {
  res.send("API running...");
});

// routes
app.use("/api/register", require("./src/routes/registrationRoutes"));

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// error handler
app.use((err, req, res, next) => {
  console.error("Server Error:", err.message);

  res.status(err.status || 500).json({
    error: err.message || "Internal Server Error",
  });
});

// start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});