import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/auth.css";

export default function Login() {
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Fade-in on mount
  useEffect(() => {
    requestAnimationFrame(() => setMounted(true));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Logging in...");
  };

  const goToRegister = () => {
    setLeaving(true);
    setTimeout(() => navigate("/register"), 280);
  };

  return (
    <div className="auth-container">
      <div className={`auth-card ${mounted ? "auth-card--in" : ""} ${leaving ? "auth-card--out" : ""}`}>

        {/* Header */}
        <div className="auth-header">
          <div className="auth-avatar">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#5b6cf9" strokeWidth="2">
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
              <polyline points="10 17 15 12 10 7"/>
              <line x1="15" y1="12" x2="3" y2="12"/>
            </svg>
          </div>
          <h2>Welcome Back</h2>
          <p>Sign in to continue</p>
        </div>

        {/* Form */}
        <div className="auth-form">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email Address</label>
              <div className="input-wrapper">
                <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
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
                  placeholder="••••••••"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  required
                />
                <button type="button" className="toggle-password" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            <div className="forgot-link">
              <a href="#">Forgot password?</a>
            </div>

            <button type="submit" className="submit-btn">Sign In</button>
          </form>

          <div className="divider"><span>or continue with</span></div>

          <div className="social-buttons">
            <button className="social-btn" title="Google">G</button>
            <button className="social-btn" title="GitHub">GH</button>
            <button className="social-btn" title="Twitter">X</button>
          </div>

          <div className="toggle-section">
            <p>
              Don't have an account?{" "}
              <button type="button" className="toggle-link" onClick={goToRegister}>
                Sign Up
              </button>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}