require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

const app = express();
const PORT = process.env.PORT || 5050;

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

// Dummy database
const users = [];

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

// Passport configuration for Google OAuth
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
    },
    (accessToken, refreshToken, profile, done) => {
      // Check if user exists or create a new one
      const existingUser = users.find((user) => user.email === profile.emails[0].value);
      if (!existingUser) {
        const newUser = {
          id: users.length + 1,
          name: profile.displayName,
          email: profile.emails[0].value,
        };
        users.push(newUser);
        return done(null, newUser);
      }
      return done(null, existingUser);
    }
  )
);

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

// Google OAuth endpoints
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    const token = jwt.sign({ id: req.user.id, email: req.user.email }, JWT_SECRET, { expiresIn: "1h" });
    res.redirect(`http://localhost:3000?token=${token}`);
  }
);

// Register user manually
app.post("/register", async (req, res) => {
  const { name, email, phone } = req.body;
  if (!name || !email || !phone) {
    return res.status(400).json({ message: "All fields are required." });
  }

  // Check if user already exists
  const existingUser = users.find((user) => user.email === email);
  if (existingUser) {
    return res.status(400).json({ message: "User already exists." });
  }

  const newUser = { id: users.length + 1, name, email, phone };
  users.push(newUser);
  res.status(201).json({ message: "User registered successfully.", user: newUser });
});

// Login manually
app.post("/login", async (req, res) => {
  const { email } = req.body;
  const user = users.find((user) => user.email === email);
  if (!user) {
    return res.status(400).json({ message: "User not found." });
  }

  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: "1h" });
  res.status(200).json({ message: "Login successful.", token });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});