import React, { useState } from "react";
import axios from "axios";
import "./App.css"; // Ensure the CSS file is imported

function App() {
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5050/register", form);
      setMessage(res.data.message);
    } catch (error) {
      setMessage(error.response?.data.message || "An error occurred.");
    }
  };

  const handleLoginGoogle = () => {
    window.location.href = "http://localhost:5050/auth/google";
  };

  return (
    <div className="app-container">
      {/* Header */}
      <header className="header">
        <img src="/logo.png" alt="NexGen Learning Logo" className="logo" />
        <h1 className="header-title">NexGen Learning</h1>
      </header>

      {/* Main Content */}
      <main className="main">
        <div className="form-container">
          <h2>Welcome to NexGen Learning</h2>
          <p className="subtext">Please register or log in to continue.</p>
          <div className="button-group">
            <button className="button primary" onClick={handleRegister}>
              Register
            </button>
            <button className="button secondary" onClick={handleLoginGoogle}>
              Login with Google
            </button>
          </div>
          {message && <p className="message">{message}</p>}
        </div>
      </main>

      {/* Footer */}
      <footer className="footer">
        <p>© 2024 NexGen Learning. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;