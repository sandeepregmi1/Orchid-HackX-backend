const Registration = require("../models/Registration");

// @desc    Create new registration
// @route   POST /api/register
// @access  Public (no login needed)

const createRegistration = async (req, res) => {
  try {
    const { email, age, full_name, track, institution } = req.body;

    // 1. Basic validation
    const { github_portfolio } = req.body;
    if (!email || !full_name || !track || !institution || !github_portfolio || github_portfolio.trim() === '') {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields (including GitHub)",
      });
    }

    // 2. Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address",
      });
    }

    // 3. Age validation (18-24)
    if (age < 18 || age > 24) {
      return res.status(400).json({
        success: false,
        message: "Eligibility restricted to ages 18-24",
      });
    }

    // 4. Duplicate Check
    const existingRegistration = await Registration.findOne({ email });
    if (existingRegistration) {
      return res.status(409).json({
        success: false,
        message: "This email is already registered",
      });
    }


    // 5. Save to MongoDB
    const newRegistration = await Registration.create(req.body);

    res.status(201).json({
      success: true,
      message: "Registration successful",
      data: newRegistration,
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: Object.values(error.errors).map(val => val.message).join(', ')
      });
    }

    console.error("Registration Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

module.exports = { createRegistration };