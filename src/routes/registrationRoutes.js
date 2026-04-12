const express = require("express");
const router = express.Router();

const { createRegistration } = require("../controllers/registrationController");

// POST /api/register
router.post("/", createRegistration);

module.exports = router;