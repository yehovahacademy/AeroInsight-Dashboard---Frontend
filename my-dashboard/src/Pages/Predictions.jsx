import NetworkMap from "../components/Maps/NetworkMap";
import DemandIntelligence from "../components/Demand Intelligence/DemandIntelligence";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMap,
  faChartLine,
  faBullseye,
  faSatelliteDish,
  faArrowTrendUp,
  faGlobe,
  faPlane,
  faRoute,
  faBolt,
  faBrain,
  faMagnifyingGlass
} from "@fortawesome/free-solid-svg-icons";

import { useEffect, useState, useRef } from "react";
import "../styles/Predictions.css";

export default function Predictions() {
  const [activeTab, setActiveTab] = useState("network");
  const [isVisible, setIsVisible] = useState(false);

  const pageRef = useRef(null);

  useEffect(() => {
    document.title = "AeroInsight | International Predictions";
  }, []);

  // Entrance animation
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

  // Temporary UI statistics.
  // These should eventually come from the FastAPI backend.
  const stats = [
    {
      icon: faGlobe,
      value: "40",
      label: "International Markets",
      trend: "Analyzed"
    },
    {
      icon: faRoute,
      value: "—",
      label: "High Opportunity Markets",
      trend: "Live data"
    },
    {
      icon: faPlane,
      value: "—",
      label: "Forecast Demand",
      trend: "Live data"
    },
    {
      icon: faArrowTrendUp,
      value: "—",
      label: "Market Growth",
      trend: "Live data"
    }
  ];

  return (
    <div
      className={`predictions-page ${isVisible ? "visible" : ""}`}
      ref={pageRef}
    >

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="predictions-hero">
        <div className="predictions-hero-content">

          <div className="page-badge">
            <FontAwesomeIcon
              icon={faSatelliteDish}
              className="pulse-icon"
            />

            <span>International Network Intelligence</span>
          </div>

          <h1>
            International Network Predictions
          </h1>

          <p>
            Analyze international markets, forecast passenger demand,
            evaluate competition, and identify promising foreign route
            opportunities for future network expansion.
          </p>

        </div>
      </section>


      {/* =====================================================
          INTERNATIONAL MARKET STATS
      ===================================================== */}

      <section className="predictions-stats">

        <div className="stats-grid">

          {stats.map((stat, index) => (

            <div
              className="stat-card"
              key={index}
              style={{
                animationDelay: `${index * 0.1}s`
              }}
            >

              <div className="stat-card-icon">
                <FontAwesomeIcon icon={stat.icon} />
              </div>

              <div className="stat-card-info">

                <div className="stat-card-value">
                  {stat.value}
                </div>

                <div className="stat-card-label">
                  {stat.label}
                </div>

              </div>

              <div className="stat-card-trend">
                <FontAwesomeIcon icon={faArrowTrendUp} />
                {stat.trend}
              </div>

            </div>

          ))}

        </div>

      </section>


      {/* =====================================================
          TAB NAVIGATION
      ===================================================== */}

      <section className="predictions-tabs-section">

        <div className="tabs-container">

          {/* Network */}
          <button
            className={`tab-button ${
              activeTab === "network" ? "active" : ""
            }`}
            onClick={() => setActiveTab("network")}
          >

            <FontAwesomeIcon icon={faMap} />

            <span>
              International Network
            </span>

            <div className="tab-glow" />

          </button>


          {/* Demand */}
          <button
            className={`tab-button ${
              activeTab === "demand" ? "active" : ""
            }`}
            onClick={() => setActiveTab("demand")}
          >

            <FontAwesomeIcon icon={faChartLine} />

            <span>
              Demand Forecast
            </span>

            <div className="tab-glow" />

          </button>


          {/* Opportunities */}
          <button
            className={`tab-button ${
              activeTab === "opportunities" ? "active" : ""
            }`}
            onClick={() => setActiveTab("opportunities")}
          >

            <FontAwesomeIcon icon={faBullseye} />

            <span>
              Route Opportunities
            </span>

            <div className="tab-glow" />

          </button>


          {/* Slider */}

          <div
            className="tab-slider"
            style={{
              transform:
                activeTab === "network"
                  ? "translateX(0%)"
                  : activeTab === "demand"
                  ? "translateX(100%)"
                  : "translateX(200%)"
            }}
          />

        </div>

      </section>


      {/* =====================================================
          CONTENT
      ===================================================== */}

      <section className="predictions-content">


        {/* =================================================
            INTERNATIONAL NETWORK
        ================================================= */}

        <div
          className={`content-panel ${
            activeTab === "network" ? "active" : ""
          }`}
        >

          <div className="panel-header">

            <div className="panel-title-group">

              <div className="panel-icon">
                <FontAwesomeIcon icon={faMap} />
              </div>

              <div>

                <h2>
                  International Network
                </h2>

                <p>
                  Explore international markets and potential
                  foreign route connections.
                </p>

              </div>

            </div>


            <div className="panel-actions">

              <span className="live-indicator">
                <span className="live-dot" />
                Network Data
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


        {/* =================================================
            DEMAND FORECAST
        ================================================= */}

        <div
          className={`content-panel ${
            activeTab === "demand" ? "active" : ""
          }`}
        >

          <div className="panel-header">

            <div className="panel-title-group">

              <div className="panel-icon accent-purple">
                <FontAwesomeIcon icon={faChartLine} />
              </div>

              <div>

                <h2>
                  International Demand Forecast
                </h2>

                <p>
                  Forecast passenger demand and identify
                  international markets with future growth potential.
                </p>

              </div>

            </div>


            <div className="panel-actions">

              <span className="panel-badge">
                Demand Intelligence
              </span>

              <button className="panel-btn">

                <FontAwesomeIcon icon={faBrain} />

                Analyze

              </button>

            </div>

          </div>


          <div className="panel-body glass-panel">

            <DemandIntelligence />

          </div>

        </div>


        {/* =================================================
            ROUTE OPPORTUNITIES
        ================================================= */}

        <div
          className={`content-panel ${
            activeTab === "opportunities" ? "active" : ""
          }`}
        >

          <div className="panel-header">

            <div className="panel-title-group">

              <div className="panel-icon accent-green">
                <FontAwesomeIcon icon={faBullseye} />
              </div>

              <div>

                <h2>
                  International Route Opportunities
                </h2>

                <p>
                  Identify foreign markets with strong demand,
                  capacity gaps, and profitable expansion potential.
                </p>

              </div>

            </div>


            <div className="panel-actions">

              <button className="panel-btn">

                <FontAwesomeIcon icon={faMagnifyingGlass} />

                Analyze Markets

              </button>

            </div>

          </div>


          <div className="panel-body glass-panel">

            {/*

              This section will later consume:

              GET /route-opportunity/

              Example data:

              {
                market_id,
                annual_demand,
                annual_existing_capacity,
                average_load_factor,
                average_fare,
                competition_level,
                capacity_gap,
                estimated_revenue_potential,
                estimated_profit_potential,
                aircraft_suitability_score,
                seasonality_score,
                network_connectivity_score,
                overall_opportunity_score,
                recommendation,
                data_type
              }

            */}

            <div className="opportunity-placeholder">

              <div className="opportunity-placeholder-icon">

                <FontAwesomeIcon icon={faBullseye} />

              </div>

              <h3>
                International Market Opportunities
              </h3>

              <p>
                Route opportunity analysis will appear here.
                Markets will be ranked using demand, competition,
                capacity gap, fare potential, and profitability.
              </p>

              <button className="panel-btn">

                <FontAwesomeIcon icon={faMagnifyingGlass} />

                Analyze Opportunities

              </button>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          INFORMATION SECTION
      ===================================================== */}

      <section className="predictions-info">

        <div className="info-grid">


          {/* Market Analysis */}

          <div className="info-card">

            <div className="info-icon">

              <FontAwesomeIcon icon={faGlobe} />

            </div>

            <h3>
              International Market Analysis
            </h3>

            <p>
              Evaluate foreign markets using historical traffic,
              passenger demand, competition, capacity, and fare data.
            </p>

          </div>


          {/* Demand */}

          <div className="info-card">

            <div className="info-icon accent-cyan">

              <FontAwesomeIcon icon={faBrain} />

            </div>

            <h3>
              Demand Forecasting
            </h3>

            <p>
              Analyze historical patterns and demand trends to
              identify international markets with future growth potential.
            </p>

          </div>


          {/* Opportunity */}

          <div className="info-card">

            <div className="info-icon accent-green">

              <FontAwesomeIcon icon={faArrowTrendUp} />

            </div>

            <h3>
              Route Opportunity
            </h3>

            <p>
              Combine demand, capacity, competition, fares, and
              profitability to identify promising international routes.
            </p>

          </div>

        </div>

      </section>

    </div>
  );
}