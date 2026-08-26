import "../styles/Home.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartLine,
  faCloud,
  faChartBar,
  faBuilding,
  faClock,
  faArrowTrendUp,
  faArrowTrendDown,
  faPlane,
  faShieldHalved,
  faSatelliteDish,
  faGlobe,
  faChevronDown
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useRef, useState } from "react";
import airportvideo from "../assets/airportvideo.mp4";
import { useNavigate } from "react-router-dom";

function Home() {
  const [counters, setCounters] = useState({ s1: 0, s2: 0, s3: 0, s4: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const statsRef = useRef(null);
  const heroRef = useRef(null);
  const navigate = useNavigate()

  useEffect(() => {
    document.title = "AeroInsight | Home";
  }, []);

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          animateCounters();
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const animateCounters = () => {
    const targets = { s1: 12500, s2: 98, s3: 450, s4: 250 };
    const duration = 2000;
    const startTime = performance.now();

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);

      setCounters({
        s1: Math.floor(targets.s1 * easeOut),
        s2: Math.floor(targets.s2 * easeOut),
        s3: Math.floor(targets.s3 * easeOut),
        s4: Math.floor(targets.s4 * easeOut),
      });

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  };

  const scrollToFeatures = () => {
    const featuresSection = document.querySelector(".features-section");
    featuresSection?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero" ref={heroRef}>
        <video
          className="background-video"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
        >
          <source src={airportvideo} type="video/mp4" />
        </video>

        <div className="hero-overlay" />
        <div className="hero-gradient" />

        <div className="hero-content">
          <div className="hero-badge">
            <FontAwesomeIcon icon={faSatelliteDish} className="badge-icon" />
            <span>Live Aviation Intelligence</span>
          </div>

          <h1 className="hero-title">
            Welcome to <span className="gradient-text">AeroInsight</span>
          </h1>
          <h2 className="hero-subtitle">Where Aviation Meets Intelligence</h2>
          <p className="hero-description">
            Real-time flight tracking, predictive analytics, and weather intelligence 
            powered by cutting-edge AI for smarter aviation decisions.
          </p>

          <div className="hero-buttons">
            <button className="btn btn-primary" onClick = {() => navigate('/register')}>
              <FontAwesomeIcon icon={faPlane} />
              Get Started
            </button>
            <button className="btn btn-secondary">View Demo</button>
          </div>

          <div className="scroll-indicator" onClick={scrollToFeatures}>
            <span>Explore</span>
            <FontAwesomeIcon icon={faChevronDown} className="bounce" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="section-header">
          <div className="section-label">Platform Capabilities</div>
          <h2 className="section-title">What We Deliver</h2>
          <p className="section-subtitle">
            Comprehensive aviation intelligence tools designed for precision and reliability
          </p>
        </div>

        <div className="features-grid">
          <div className="feature-card card-realtime">
            <div className="card-glow" />
            <div className="card-content">
              <div className="card-icon-wrapper">
                <FontAwesomeIcon icon={faChartLine} />
              </div>
              <h3>Real-Time Analysis</h3>
              <p>
                Live aviation data processed and visualized the moment it lands. 
                Monitor thousands of flights simultaneously with sub-second updates.
              </p>
              <div className="card-footer">
                <span className="card-tag tag-live">
                  <span className="pulse-dot" />
                  Live Data
                </span>
                <FontAwesomeIcon icon={faArrowTrendUp} className="card-arrow" />
              </div>
            </div>
          </div>

          <div className="feature-card card-delays">
            <div className="card-glow" />
            <div className="card-content">
              <div className="card-icon-wrapper">
                <FontAwesomeIcon icon={faPlane} />
              </div>
              <h3>Flight Delays</h3>
              <p>
                Predict and track delay patterns before they impact your operations. 
                ML-powered forecasting with 98% accuracy.
              </p>
              <div className="card-footer">
                <span className="card-tag tag-predictive">Predictive</span>
                <FontAwesomeIcon icon={faArrowTrendUp} className="card-arrow" />
              </div>
            </div>
          </div>

          <div className="feature-card card-weather">
            <div className="card-glow" />
            <div className="card-content">
              <div className="card-icon-wrapper">
                <FontAwesomeIcon icon={faCloud} />
              </div>
              <h3>Weather Forecast</h3>
              <p>
                Hyper-local weather intelligence for safe and efficient flight planning. 
                Real-time METAR and TAF integration.
              </p>
              <div className="card-footer">
                <span className="card-tag tag-safety">
                  <FontAwesomeIcon icon={faShieldHalved} />
                  Safety First
                </span>
                <FontAwesomeIcon icon={faArrowTrendUp} className="card-arrow" />
              </div>
            </div>
          </div>

          <div className="feature-card card-global">
            <div className="card-glow" />
            <div className="card-content">
              <div className="card-icon-wrapper">
                <FontAwesomeIcon icon={faGlobe} />
              </div>
              <h3>Global Coverage</h3>
              <p>
                Track flights across 450+ airports worldwide with unified data streams 
                from ADS-B, MLAT, and satellite sources.
              </p>
              <div className="card-footer">
                <span className="card-tag tag-global">Worldwide</span>
                <FontAwesomeIcon icon={faArrowTrendUp} className="card-arrow" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className={`stats-section ${isVisible ? "visible" : ""}`} ref={statsRef}>
        <div className="stats-header">
          <h2>Trusted by Aviation Professionals</h2>
          <p>Numbers that define our commitment to excellence</p>
        </div>

        <div className="stats-bar">
          <div className="stat-item">
            <div className="stat-icon-wrapper">
              <FontAwesomeIcon icon={faPlane} />
            </div>
            <div className="stat-number">
              <span>{counters.s1.toLocaleString()}</span>+
            </div>
            <div className="stat-label">Flights Tracked Daily</div>
            <div className="stat-delta delta-up">
              <FontAwesomeIcon icon={faArrowTrendUp} />
              <span>Live updates</span>
            </div>
          </div>

          <div className="stat-divider" />

          <div className="stat-item">
            <div className="stat-icon-wrapper">
              <FontAwesomeIcon icon={faChartBar} />
            </div>
            <div className="stat-number">
              <span>{counters.s2}</span>%
            </div>
            <div className="stat-label">Prediction Accuracy</div>
            <div className="stat-delta delta-up">
              <FontAwesomeIcon icon={faArrowTrendUp} />
              <span>This month</span>
            </div>
          </div>

          <div className="stat-divider" />

          <div className="stat-item">
            <div className="stat-icon-wrapper">
              <FontAwesomeIcon icon={faBuilding} />
            </div>
            <div className="stat-number">
              <span>{counters.s3}</span>+
            </div>
            <div className="stat-label">Airports Monitored</div>
            <div className="stat-delta delta-up">
              <FontAwesomeIcon icon={faArrowTrendUp} />
              <span>Worldwide</span>
            </div>
          </div>

          <div className="stat-divider" />

          <div className="stat-item">
            <div className="stat-icon-wrapper">
              <FontAwesomeIcon icon={faClock} />
            </div>
            <div className="stat-number">
              <span>{counters.s4}</span>ms
            </div>
            <div className="stat-label">Avg. Data Latency</div>
            <div className="stat-delta delta-down">
              <FontAwesomeIcon icon={faArrowTrendDown} />
              <span>Near real-time</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to Transform Your Aviation Operations?</h2>
          <p>Join thousands of aviation professionals using AeroInsight</p>
          <div className="cta-buttons">
            <button className="btn btn-primary btn-large">
              <FontAwesomeIcon icon={faPlane} />
              Start Free Trial
            </button>
            <button className="btn btn-outline btn-large">Contact Sales</button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;