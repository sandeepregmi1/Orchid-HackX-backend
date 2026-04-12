

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
require("dotenv").config();

const connectDB = require("./src/config/db");

const app = express();

// connect database
connectDB();

// middleware
app.use(helmet());

// set up rate limiter: maximum of 100 requests per 15 minutes
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again in 15 minutes"
});
app.use("/api/", limiter); // applies to API routes

app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173", // update with your production frontend URL if different
  credentials: true
}));
app.use(express.json());
// Express 5.x compatibility for Mongo Sanitize
// (Express 5 makes req.query immutable, so we manually sanitize the necessary objects)
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

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});