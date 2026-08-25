import NetworkMap from "../components/Maps/NetworkMap";
import DemandIntelligence from "../components/Demand Intelligence/DemandIntelligence";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMap,
  faChartLine,
  faBrain,
  faSatelliteDish,
  faArrowTrendUp,
  faGlobe,
  faPlane,
  faClock,
  faBolt
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState, useRef } from "react";
import "../styles/Predictions.css";

export default function Predictions() {
  const [activeTab, setActiveTab] = useState("network");
  const [isVisible, setIsVisible] = useState(false);
  const pageRef = useRef(null);

  useEffect(() => {
    document.title = "AeroInsight | Predictions & Analytics";
  }, []);

  // Intersection observer for entrance animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.05 }
    );

    if (pageRef.current) {
      observer.observe(pageRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const stats = [
    { icon: faPlane, value: "12,450", label: "Flights Analyzed", trend: "+8.4%" },
    { icon: faBrain, value: "98.2%", label: "Model Accuracy", trend: "+1.2%" },
    { icon: faGlobe, value: "142", label: "Routes Mapped", trend: "+12" },
    { icon: faClock, value: "240ms", label: "Inference Time", trend: "-18%" },
  ];

  return (
    <div className={`predictions-page ${isVisible ? "visible" : ""}`} ref={pageRef}>
      {/* Page Header */}
      <section className="predictions-hero">
        <div className="predictions-hero-content">
          <div className="page-badge">
            <FontAwesomeIcon icon={faSatelliteDish} className="pulse-icon" />
            <span>AI-Powered Analytics</span>
          </div>
          <h1>Predictions & Demand Intelligence</h1>
          <p>
            Real-time network visualization and predictive demand modeling 
            powered by machine learning. Forecast traffic patterns, identify 
            bottlenecks, and optimize operations before they happen.
          </p>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="predictions-stats">
        <div className="stats-grid">
          {stats.map((stat, index) => (
            <div className="stat-card" key={index} style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="stat-card-icon">
                <FontAwesomeIcon icon={stat.icon} />
              </div>
              <div className="stat-card-info">
                <div className="stat-card-value">{stat.value}</div>
                <div className="stat-card-label">{stat.label}</div>
              </div>
              <div className="stat-card-trend">
                <FontAwesomeIcon icon={faArrowTrendUp} />
                {stat.trend}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Tab Navigation */}
      <section className="predictions-tabs-section">
        <div className="tabs-container">
          <button
            className={`tab-button ${activeTab === "network" ? "active" : ""}`}
            onClick={() => setActiveTab("network")}
          >
            <FontAwesomeIcon icon={faMap} />
            <span>Network Map</span>
            <div className="tab-glow" />
          </button>
          <button
            className={`tab-button ${activeTab === "demand" ? "active" : ""}`}
            onClick={() => setActiveTab("demand")}
          >
            <FontAwesomeIcon icon={faChartLine} />
            <span>Demand Intelligence</span>
            <div className="tab-glow" />
          </button>
          <div className="tab-slider" style={{ transform: `translateX(${activeTab === "network" ? "0%" : "100%"})` }} />
        </div>
      </section>

      {/* Content Area */}
      <section className="predictions-content">
        {/* Network Map Section */}
        <div className={`content-panel ${activeTab === "network" ? "active" : ""}`}>
          <div className="panel-header">
            <div className="panel-title-group">
              <div className="panel-icon">
                <FontAwesomeIcon icon={faMap} />
              </div>
              <div>
                <h2>Live Network Map</h2>
                <p>Real-time flight path visualization and route density analysis</p>
              </div>
            </div>
            <div className="panel-actions">
              <span className="live-indicator">
                <span className="live-dot" />
                Live
              </span>
              <button className="panel-btn">
                <FontAwesomeIcon icon={faBolt} />
                Refresh
              </button>
            </div>
          </div>
          <div className="panel-body glass-panel">
            <NetworkMap />
          </div>
        </div>

        {/* Demand Intelligence Section */}
        <div className={`content-panel ${activeTab === "demand" ? "active" : ""}`}>
          <div className="panel-header">
            <div className="panel-title-group">
              <div className="panel-icon accent-purple">
                <FontAwesomeIcon icon={faChartLine} />
              </div>
              <div>
                <h2>Market Demand Intelligence</h2>
                <p>Predictive analytics for passenger demand and route optimization</p>
              </div>
            </div>
            <div className="panel-actions">
              <span className="panel-badge">ML Model v2.4</span>
              <button className="panel-btn">
                <FontAwesomeIcon icon={faBrain} />
                Retrain
              </button>
            </div>
          </div>
          <div className="panel-body glass-panel">
            <DemandIntelligence />
          </div>
        </div>
      </section>

      {/* Info Cards */}
      <section className="predictions-info">
        <div className="info-grid">
          <div className="info-card">
            <div className="info-icon">
              <FontAwesomeIcon icon={faBrain} />
            </div>
            <h3>How It Works</h3>
            <p>
              Our ensemble models combine historical ADS-B data, weather patterns, 
              and seasonal trends to forecast demand with 98.2% accuracy.
            </p>
          </div>
          <div className="info-card">
            <div className="info-icon accent-cyan">
              <FontAwesomeIcon icon={faSatelliteDish} />
            </div>
            <h3>Data Sources</h3>
            <p>
              Real-time feeds from 450+ airports, airline schedules, booking data, 
              and meteorological APIs processed every 30 seconds.
            </p>
          </div>
          <div className="info-card">
            <div className="info-icon accent-green">
              <FontAwesomeIcon icon={faArrowTrendUp} />
            </div>
            <h3>Key Insights</h3>
            <p>
              Identify underperforming routes, predict peak congestion windows, 
              and optimize fleet allocation across your network.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}