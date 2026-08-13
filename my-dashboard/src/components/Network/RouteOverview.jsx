import "../../styles/RoutesOverview.css";
import { useState, useEffect } from "react";
import airlineLogos from "../../Utils/airline-logo";

function RouteOverview({ selectedAirline }) {
  const [flights, setFlights] = useState([]);

  useEffect(() => {
    const BASE_URL = "https://aeroinsight-dashboard-backend.onrender.com/flights/";

    const url = selectedAirline
      ? `${BASE_URL}?airline=${encodeURIComponent(selectedAirline)}`
      : BASE_URL;

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => setFlights(data))
      .catch((err) => console.error("Error fetching flights:", err));
  }, [selectedAirline]);

  return (
    <div className="flight-detail-container">
      {flights.map((flight) => (
        <div key={flight.flight_number} className="flight-card">

          {/* Logo + Airline identity row */}
          <div className="flight-card-header">
            <div className="airline-identity">
              <div className="airline-logo-wrapper">
                {flight.airline_logo ? (
                  <img
                    src={airlineLogos[flight.airline_logo]}
                    alt={`${flight.airline} logo`}
                    className="airline-logo"
                  />
                ) : (
                  <div className="airline-logo-placeholder">
                    {flight.airline?.charAt(0)}
                  </div>
                )}
              </div>
              <div className="airline-meta">
                <h2 className="flight-airline">{flight.airline}</h2>
                <p className="flight-number">{flight.flight_number}</p>
              </div>
            </div>
            <span
              className={`flight-status status-${flight.status
                ?.toLowerCase()
                .replace(/\s+/g, "-")}`}
            >
              {flight.status}
            </span>
          </div>

          {/* Route section */}
          <div className="flight-route">
            <div className="route-point">
              <span className="route-code">{flight.origin}</span>
              <span className="route-label">Origin</span>
            </div>
            <div className="route-line">
              <span className="route-dot" />
              <span className="route-dash" />
              <svg className="route-plane" viewBox="0 0 24 24" fill="currentColor">
                <path d="M21 16v-2l-8-5V3.5A1.5 1.5 0 0 0 11.5 2 1.5 1.5 0 0 0 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5z" />
              </svg>
              <span className="route-dash" />
              <span className="route-dot" />
            </div>
            <div className="route-point route-point--right">
              <span className="route-code">{flight.destination}</span>
              <span className="route-label">Destination</span>
            </div>
          </div>

        </div>
      ))}
    </div>
  );
}

export default RouteOverview;