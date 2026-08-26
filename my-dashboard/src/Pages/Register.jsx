import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Auth.css";

export default function Register() {
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Fade-in on mount
  useEffect(() => {
    requestAnimationFrame(() => setMounted(true));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    console.log("Registering:", formData);
  };

  const goToLogin = () => {
    setLeaving(true);
    setTimeout(() => navigate("/login"), 280);
  };

  return (
    <div className="auth-container">
      <div className={`auth-card ${mounted ? "auth-card--in" : ""} ${leaving ? "auth-card--out" : ""}`}>

        {/* Header */}
        <div className="auth-header">
          <div className="auth-avatar">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#5b6cf9" strokeWidth="2">
              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="8.5" cy="7" r="4"/>
              <line x1="20" y1="8" x2="20" y2="14"/>
              <line x1="23" y1="11" x2="17" y2="11"/>
            </svg>
          </div>
          <h2>Create Account</h2>
          <p>Join us today</p>
        </div>

        {/* Form */}
        <div className="auth-form">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Full Name</label>
              <div className="input-wrapper">
                <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
                <input
                  type="text"
                  name="fullName"
                  placeholder="John Doe"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Email Address</label>
              <div className="input-wrapper">
                <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
                <input
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Password</label>
              <div className="input-wrapper">
                <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <button type="button" className="toggle-password" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            <div className="form-group">
              <label>Confirm Password</label>
              <div className="input-wrapper">
                <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                <input
                  type={showConfirm ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
                <button type="button" className="toggle-password" onClick={() => setShowConfirm(!showConfirm)}>
                  {showConfirm ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            <button type="submit" className="submit-btn">Create Account</button>
          </form>

          <div className="divider"><span>or continue with</span></div>

          <div className="social-buttons">
            <button className="social-btn" title="Google">G</button>
            <button className="social-btn" title="GitHub">GH</button>
            <button className="social-btn" title="Twitter">X</button>
          </div>

          <div className="toggle-section">
            <p>
              Already have an account?{" "}
              <button type="button" className="toggle-link" onClick={goToLogin}>
                Sign In
              </button>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}