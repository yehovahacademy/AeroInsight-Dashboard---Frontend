import { useEffect, useState } from "react";
import "./DemandForecast.css";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://aeroinsight-dashboard-backend.onrender.com";

function DemandForecast({ origin, destination }) {
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!origin || !destination || origin === destination) {
      setForecast(null);
      return;
    }

    const fetchForecast = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `${API_URL}/demand-forecast/demand/forecast/${origin}/${destination}`
        );

        if (!response.ok) {
          throw new Error(
            `Demand Forecast API returned ${response.status}`
          );
        }

        const data = await response.json();

        console.log("DEMAND FORECAST API DATA:", data);

        setForecast(data);
      } catch (error) {
        console.error(
          "Failed to fetch demand forecast:",
          error
        );

        setForecast(null);
        setError(
          error.message || "Failed to load demand forecast."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchForecast();
  }, [origin, destination]);

  if (!origin || !destination) {
    return (
      <section className="demand-forecast">
        <div className="section-header">
          <div>
            <span className="section-eyebrow">
              Network Intelligence
            </span>

            <h2>Demand Forecast</h2>

            <p>
              Select an origin and destination to view
              the demand forecast.
            </p>
          </div>
        </div>
      </section>
    );
  }

  if (loading) {
    return (
      <section className="demand-forecast">
        <div className="section-header">
          <div>
            <span className="section-eyebrow">
              Network Intelligence
            </span>

            <h2>Demand Forecast</h2>

            <p>
              Loading demand forecast for{" "}
              <strong>
                {origin} → {destination}
              </strong>
              ...
            </p>
          </div>
        </div>

        <div className="forecast-loading">
          Loading forecast data...
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="demand-forecast">
        <div className="section-header">
          <div>
            <span className="section-eyebrow">
              Network Intelligence
            </span>

            <h2>Demand Forecast</h2>
          </div>
        </div>

        <div className="forecast-error">
          <strong>Unable to load demand forecast</strong>

          <span>{error}</span>
        </div>
      </section>
    );
  }

  if (!forecast) {
    return null;
  }

  const {
    route,
    forecast_horizon_days,
    average_demand_score,
    demand_level,
    average_load_factor,
    trend,
    peak_day,
    recommendation,
    forecast: dailyForecast = [],
  } = forecast;

  return (
    <section className="demand-forecast">
      <div className="section-header">
        <div>
          <span className="section-eyebrow">
            Network Intelligence
          </span>

          <h2>Demand Forecast</h2>

          <p>
            Short-term demand outlook for{" "}
            <strong>{route}</strong>.
          </p>
        </div>

        <div className="forecast-route">
          {origin} → {destination}
        </div>
      </div>

      {/* Summary Metrics */}
      <div className="forecast-summary">
        <div className="forecast-metric">
          <span className="metric-label">
            Average Demand
          </span>

          <strong className="metric-value">
            {Number(average_demand_score).toFixed(2)}
          </strong>

          <span className="metric-subtext">
            Demand score
          </span>
        </div>

        <div className="forecast-metric">
          <span className="metric-label">
            Demand Level
          </span>

          <strong
            className={`metric-value demand-${String(
              demand_level
            ).toLowerCase()}`}
          >
            {demand_level}
          </strong>

          <span className="metric-subtext">
            Current forecast
          </span>
        </div>

        <div className="forecast-metric">
          <span className="metric-label">
            Average Load Factor
          </span>

          <strong className="metric-value">
            {Number(average_load_factor).toFixed(2)}%
          </strong>

          <span className="metric-subtext">
            Estimated
          </span>
        </div>

        <div className="forecast-metric">
          <span className="metric-label">
            Trend
          </span>

          <strong
            className={`metric-value trend-${String(
              trend
            ).toLowerCase()}`}
          >
            {trend}
          </strong>

          <span className="metric-subtext">
            Forecast direction
          </span>
        </div>

        <div className="forecast-metric">
          <span className="metric-label">
            Forecast Horizon
          </span>

          <strong className="metric-value">
            {forecast_horizon_days}
          </strong>

          <span className="metric-subtext">
            Days
          </span>
        </div>
      </div>

      {/* Peak Day */}
      {peak_day && (
        <div className="peak-day-card">
          <div className="peak-day-content">
            <span className="section-eyebrow">
              Peak Demand Day
            </span>

            <h3>
              {peak_day.day}
            </h3>

            <p>{peak_day.date}</p>
          </div>

          <div className="peak-day-metrics">
            <div>
              <span>Demand Score</span>

              <strong>
                {peak_day.demand_score}
              </strong>
            </div>

            <div>
              <span>Demand Level</span>

              <strong>
                {peak_day.demand_level}
              </strong>
            </div>

            <div>
              <span>Estimated Load Factor</span>

              <strong>
                {Number(
                  peak_day.estimated_load_factor
                ).toFixed(2)}
                %
              </strong>
            </div>
          </div>
        </div>
      )}

      {/* Daily Forecast */}
      <div className="forecast-table-card">
        <div className="forecast-table-header">
          <div>
            <span className="section-eyebrow">
              Daily Outlook
            </span>

            <h3>
              {forecast_horizon_days}-Day Demand Forecast
            </h3>
          </div>
        </div>

        <div className="forecast-table-wrapper">
          <table className="forecast-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Day</th>
                <th>Demand Score</th>
                <th>Demand Level</th>
                <th>Estimated Load Factor</th>
              </tr>
            </thead>

            <tbody>
              {dailyForecast.map((day) => (
                <tr key={day.date}>
                  <td>{day.date}</td>

                  <td>{day.day}</td>

                  <td>
                    <strong>
                      {day.demand_score}
                    </strong>
                  </td>

                  <td>
                    <span
                      className={`demand-badge demand-badge--${String(
                        day.demand_level
                      ).toLowerCase()}`}
                    >
                      {day.demand_level}
                    </span>
                  </td>

                  <td>
                    {Number(
                      day.estimated_load_factor
                    ).toFixed(2)}
                    %
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recommendation */}
      {recommendation && (
        <div className="forecast-recommendation">
          <span className="recommendation-label">
            Network Planning Recommendation
          </span>

          <p>{recommendation}</p>
        </div>
      )}
    </section>
  );
}

export default DemandForecast;