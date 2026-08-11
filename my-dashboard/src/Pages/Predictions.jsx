import { useState, useEffect } from "react";
import WeatherForecastCard from "../components/Predictions/WeatherForecastCard";
import AviationRiskCard from "../components/Predictions/AviationRiskCard";
import DelayPredictionCard from "../components/Predictions/DelayPredictionCard";
import AviationAlerts from "../components/Predictions/AviationAlerts";
import VisibilityForecastCard from "../components/Predictions/VisibilityForecastCard";
import OperationsIntelligence from "../components/Predictions/OperationsIntelligence";
import "../styles/Predictions.css";

const AIRPORT_CODE = "BOM";
const API_BASE = "https://aeroinsight-dashboard-backend.onrender.com";

function Predictions() {
  const [predictionData, setPredictionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE}/weather/?airport=${AIRPORT_CODE}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch prediction data.");
        return res.json();
      })
      .then((data) => {
        setPredictionData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching weather data:", err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <div className="predictions-page">

      {/* Page Header */}
      <header className="predictions-header">
        <div className="predictions-header__meta">
          <span className="predictions-header__eyebrow">Airport · {AIRPORT_CODE}</span>
          <h1 className="predictions-header__title">Predictive Intelligence</h1>
          <p className="predictions-header__subtitle">
            Real-time forecasts and operational risk assessment for flight planning.
          </p>
        </div>
        <div className="predictions-header__status">
          <span className={`predictions-status-dot ${loading ? "loading" : error ? "error" : "live"}`} />
          <span className="predictions-status-label">
            {loading ? "Fetching data…" : error ? "Data unavailable" : `Live · ${AIRPORT_CODE}`}
          </span>
        </div>
      </header>

      <div className="predictions-divider" />

      {/* Layout: 2-column outer grid */}
      <main className="predictions-grid">

        {/* LEFT — Weather column */}
        <section className="predictions-col predictions-col--left">
          <div className="predictions-zone__label">Weather</div>
          <WeatherForecastCard weather={predictionData} />
          <VisibilityForecastCard visibility={predictionData?.visibility_forecast} />
        </section>

        {/* RIGHT — Risk stack + Operations */}
        <section className="predictions-col predictions-col--right">

          {/* Risk row: 3 cards side by side */}
          <div className="predictions-risk-row">
            <div className="predictions-zone__label predictions-zone__label--span">Risk & Delays</div>
            <div className="predictions-risk-cards">
              <DelayPredictionCard prediction={predictionData?.delay_prediction} />
              <AviationRiskCard risk={predictionData?.aviation_risk} />
              <AviationAlerts alerts={predictionData?.aviation_alerts} />
            </div>
          </div>

          {/* Operations Intelligence — full width of right column */}
          <div className="predictions-ops-row">
            <div className="predictions-zone__label">Operations</div>
            <OperationsIntelligence />
          </div>

        </section>

      </main>
    </div>
  );
}

export default Predictions;