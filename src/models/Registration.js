const mongoose = require("mongoose");

// Team member sub-schema
const TeamMemberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  github: { type: String }
});

// Main registration schema
const RegistrationSchema = new mongoose.Schema(
  {
    full_name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    age: { type: Number, required: true, min: 18, max: 24 },
    phone_number: { type: String },
    institution: { type: String, required: true },

    role: { type: String, default: "Developer" },
    track: { type: String, required: true },

    github_portfolio: { type: String, required: true },
    linkedin: { type: String },

    team_name: { type: String },
    team_size: { type: Number, required: true },

    experience: { type: String, required: true },

    team_members: [TeamMemberSchema],

    coc_accepted: { type: Boolean, required: true }
  },
  {
    timestamps: true // adds createdAt & updatedAt automatically
  }
);

module.exports = mongoose.model("Registration", RegistrationSchema);