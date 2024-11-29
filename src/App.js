import React, { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [role, setRole] = useState(""); // Student or Parent
  const [isRegister, setIsRegister] = useState(true); // Toggle between Register and Log In
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");

  // Handle input changes
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLoginChange = (e) => {
    setLoginForm({ ...loginForm, [e.target.name]: e.target.value });
  };

  // Handle Registration
  const handleRegister = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setMessage("Passwords do not match!");
      return;
    }
    try {
      const res = await axios.post("http://localhost:5050/register", {
        ...form,
        role,
      });
      setMessage(res.data.message);
    } catch (error) {
      setMessage(error.response?.data.message || "An error occurred.");
    }
  };

  // Handle Login
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5050/login", loginForm);
      setMessage(res.data.message);
    } catch (error) {
      setMessage(error.response?.data.message || "An error occurred.");
    }
  };

  return (
    <div className="app-container">
      {/* Header */}
      <header className="header">
        <img src="/logo.svg" alt="NexGen Learning Logo" className="logo" />
       
      </header>

      {/* Main Content */}
      <main className="main">
        {!role ? (
          <div className="role-selection">
            <h2>Select Your Role</h2>
            <div className="button-group">
              <button
                className="button primary"
                onClick={() => setRole("Student")}
              >
                Student
              </button>
              <button
                className="button secondary"
                onClick={() => setRole("Parent")}
              >
                Parent
              </button>
            </div>
          </div>
        ) : (
          <div className="form-container">
            <h2>{isRegister ? "Register" : "Log In"} as {role}</h2>
            {isRegister ? (
              <form onSubmit={handleRegister} className="form">
                <input
                  name="name"
                  placeholder="Name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="input"
                />
                <input
                  name="email"
                  type="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="input"
                />
                <input
                  name="phone"
                  type="tel"
                  placeholder="Phone Number"
                  value={form.phone}
                  onChange={handleChange}
                  required
                  className="input"
                />
                <input
                  name="password"
                  type="password"
                  placeholder="Password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  className="input"
                />
                <input
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm Password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  required
                  className="input"
                />
                <button type="submit" className="button primary">
                  Register
                </button>
              </form>
            ) : (
              <form onSubmit={handleLogin} className="form">
                <input
                  name="email"
                  type="email"
                  placeholder="Email"
                  value={loginForm.email}
                  onChange={handleLoginChange}
                  required
                  className="input"
                />
                <input
                  name="password"
                  type="password"
                  placeholder="Password"
                  value={loginForm.password}
                  onChange={handleLoginChange}
                  required
                  className="input"
                />
                <button type="submit" className="button primary">
                  Log In
                </button>
              </form>
            )}
            <p className="toggle-link">
              {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
              <button
                className="link-button"
                onClick={() => setIsRegister(!isRegister)}
              >
                {isRegister ? "Log In" : "Register"}
              </button>
            </p>
            <button
              className="button secondary"
              onClick={() => setRole("")}
            >
              Back
            </button>
          </div>
        )}
        {message && <p className="message">{message}</p>}
      </main>

      {/* Footer */}
      <footer className="footer">
        <p>© 2024 NexGen Learning. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;