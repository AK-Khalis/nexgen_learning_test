require("dotenv").config(); // Load environment variables
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express(); // Initialize Express app
const PORT = process.env.PORT || 5000; // Use environment PORT or default to 5000

// Middleware
app.use(bodyParser.json()); // Parse incoming JSON requests
app.use(cors()); // Enable Cross-Origin Resource Sharing

// Routes
app.get("/", (req, res) => {
  res.send("Welcome to NexGen Learning Backend!"); // Test endpoint
});

// Example API for user registration
app.post("/api/register", (req, res) => {
  const { role, name, email } = req.body;

  // Validate input
  if (!role || !name || !email) {
    return res.status(400).json({ message: "All fields are required." });
  }

  // Simulate successful registration
  res.status(200).json({ message: `User ${name} registered as ${role}.` });
});

// Error Handling for Undefined Routes
app.use((req, res) => {
  res.status(404).json({ message: "Route not found." });
});

// Start the Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});