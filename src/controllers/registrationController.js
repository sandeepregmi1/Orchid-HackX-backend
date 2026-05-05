// /home/sandeep/orchidhackx-2026/backend/src/controllers/registrationController.js
const Registration = require("../models/Registration");

// @desc    Create new registration
// @route   POST /api/register
// @access  Public (no login needed)

const createRegistration = async (req, res) => {
  try {
    const {
      email,
      age,
      full_name,
      track,
      institution,
      github_portfolio,
      linkedin,
      team_members,
    } = req.body;

    // 1. Basic validation (ONLY required fields)
    if (!email || !full_name || !track || !institution) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
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

    // 4. Team Members Validation
    if (team_members && Array.isArray(team_members)) {
      for (const member of team_members) {
        if (!member.name || !member.email || !member.age || !member.phoneNumber) {
          return res.status(400).json({
            success: false,
            message: "Please provide all required fields for team members (name, email, age, phoneNumber)",
          });
        }
        if (member.age < 18 || member.age > 24) {
          return res.status(400).json({
            success: false,
            message: `Team member ${member.name} must be between 18 and 24 years old`,
          });
        }
        if (!emailRegex.test(member.email)) {
          return res.status(400).json({
            success: false,
            message: `Please enter a valid email address for team member ${member.name}`,
          });
        }
      }
    }

    // 5. Duplicate Check
    const existingRegistration = await Registration.findOne({ email });
    if (existingRegistration) {
      return res.status(409).json({
        success: false,
        message: "This email is already registered",
      });
    }

    // 6. Clean payload (safe handling of optional fields)
    const formattedTeamMembers = team_members ? team_members.map(member => ({
      name: member.name,
      github: member.github || null,
      email: member.email,
      age: Number(member.age),
      phoneNumber: member.phoneNumber
    })) : [];

    const payload = {
      ...req.body,
      github_portfolio: github_portfolio || null,
      linkedin: linkedin || null,
      team_members: formattedTeamMembers,
    };

    // 7. Save to MongoDB
    const newRegistration = await Registration.create(payload);

    res.status(201).json({
      success: true,
      message: "Registration successful",
      data: newRegistration,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: Object.values(error.errors)
          .map((val) => val.message)
          .join(", "),
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