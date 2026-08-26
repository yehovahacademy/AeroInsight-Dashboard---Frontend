import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/Auth.css";
import airplane from "../assets/airplane.mp4";

export default function AuthPage() {
  const location = useLocation();
  const navigate = useNavigate();

  // Derive which form is active from the URL
  const [isLogin, setIsLogin] = useState(location.pathname !== "/register");
  const [sliding, setSliding] = useState(false);   // true while animating
  const [slideDir, setSlideDir] = useState("up");  // "up" | "down"

  // Form state
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [formData, setFormData] = useState({
    fullName: "", email: "", password: "", confirmPassword: "",
  });

  // Keep form in sync if user navigates via browser back/forward
  useEffect(() => {
    setIsLogin(location.pathname !== "/register");
  }, [location.pathname]);

  const switchTo = (toLogin) => {
    if (sliding) return;
    setSlideDir(toLogin ? "down" : "up"); // register→login = slide down; login→register = slide up
    setSliding(true);
    setTimeout(() => {
      setIsLogin(toLogin);
      navigate(toLogin ? "/login" : "/register", { replace: true });
      setSliding(false);
    }, 380);
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    console.log("Logging in:", { loginEmail, loginPassword });
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    console.log("Registering:", formData);
  };

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  return (
    <>
    <br></br>
    <div className="auth-page">

      {/* ── Left: Video Panel ─────────────────────────────── */}
      <div className="auth-video-panel">
        <video
          className="auth-video"
          autoPlay
          muted
          loop
          playsInline
        >
          {/* Free stock aviation video from Pexels CDN */}
          <source src={airplane} type="video/mp4"
          />
        </video>

        {/* Dark overlay */}
        <div className="auth-video-overlay" />

        {/* Brand mark */}
        <div className="auth-brand">
          <div className="auth-brand-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.4 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.34 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.37a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 15.92z"/>
            </svg>
          </div>
          <span className="auth-brand-name">AeroInsight</span>
        </div>

        {/* Hero copy */}
        <div className="auth-video-copy">
          <p className="auth-video-eyebrow">Aviation Intelligence Platform</p>
          <h1 className="auth-video-headline">
            {isLogin ? "Good to have\nyou back." : "Your runway\nstarts here."}
          </h1>
          <p className="auth-video-sub">
            {isLogin
              ? "Your routes, predictions, and reports are waiting."
              : "Join thousands of operators making smarter network decisions."}
          </p>
        </div>
      </div>

      {/* ── Right: Form Panel ─────────────────────────────── */}
      <div className="auth-form-panel">

        {/* Sliding viewport — clips the two stacked forms */}
        <div className="auth-forms-viewport">
          <div className={`auth-forms-track ${sliding ? `sliding-${slideDir}` : ""} ${isLogin ? "show-login" : "show-register"}`}>

            {/* Login form */}
            <div className="auth-form-slide">
              <div className="auth-form-inner">
                <div className="auth-form-header">
                  <div className="auth-avatar">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#5b6cf9" strokeWidth="2">
                      <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
                      <polyline points="10 17 15 12 10 7"/>
                      <line x1="15" y1="12" x2="3" y2="12"/>
                    </svg>
                  </div>
                  <h2>Welcome back</h2>
                  <p>Sign in to your AeroInsight account</p>
                </div>

                <form onSubmit={handleLoginSubmit}>
                  <div className="form-group">
                    <label>Email address</label>
                    <div className="input-wrapper">
                      <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                        <polyline points="22,6 12,13 2,6"/>
                      </svg>
                      <input type="email" placeholder="you@airline.com"
                        value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} required />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Password</label>
                    <div className="input-wrapper">
                      <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                      </svg>
                      <input type={showPassword ? "text" : "password"} placeholder="••••••••"
                        value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} required />
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
                  <button className="social-btn" title="Microsoft">M</button>
                </div>

                <div className="toggle-section">
                  <p>No account yet?{" "}
                    <button type="button" className="toggle-link" onClick={() => switchTo(false)}>
                      Create one
                    </button>
                  </p>
                </div>
              </div>
            </div>

            {/* Register form */}
            <div className="auth-form-slide">
              <div className="auth-form-inner">
                <div className="auth-form-header">
                  <div className="auth-avatar">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#5b6cf9" strokeWidth="2">
                      <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                      <circle cx="8.5" cy="7" r="4"/>
                      <line x1="20" y1="8" x2="20" y2="14"/>
                      <line x1="23" y1="11" x2="17" y2="11"/>
                    </svg>
                  </div>
                  <h2>Create account</h2>
                  <p>Start your AeroInsight journey today</p>
                </div>

                <form onSubmit={handleRegisterSubmit}>
                  <div className="form-group">
                    <label>Full name</label>
                    <div className="input-wrapper">
                      <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                        <circle cx="12" cy="7" r="4"/>
                      </svg>
                      <input type="text" name="fullName" placeholder="Joshua Fernandes"
                        value={formData.fullName} onChange={handleChange} required />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Email address</label>
                    <div className="input-wrapper">
                      <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                        <polyline points="22,6 12,13 2,6"/>
                      </svg>
                      <input type="email" name="email" placeholder="you@airline.com"
                        value={formData.email} onChange={handleChange} required />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Password</label>
                    <div className="input-wrapper">
                      <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                      </svg>
                      <input type={showPassword ? "text" : "password"} name="password" placeholder="••••••••"
                        value={formData.password} onChange={handleChange} required />
                      <button type="button" className="toggle-password" onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? "🙈" : "👁️"}
                      </button>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Confirm password</label>
                    <div className="input-wrapper">
                      <svg className="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                      </svg>
                      <input type={showConfirm ? "text" : "password"} name="confirmPassword" placeholder="••••••••"
                        value={formData.confirmPassword} onChange={handleChange} required />
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
                  <button className="social-btn" title="Microsoft">M</button>
                </div>

                <div className="toggle-section">
                  <p>Already have an account?{" "}
                    <button type="button" className="toggle-link" onClick={() => switchTo(true)}>
                      Sign in
                    </button>
                  </p>
                </div>
              </div>
            </div>

          </div>{/* end track */}
        </div>{/* end viewport */}
      </div>{/* end form panel */}
    </div>
    <br></br>
    </>
  );
}