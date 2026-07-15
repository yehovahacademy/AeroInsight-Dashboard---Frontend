import Home from "./Home";
import "../../styles/FlightDetail.css"
import { useState, useEffect } from "react";

function FlightDetail() {
  const[flights, setFlights] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/flights")
      .then((response) => response.json())
      .then((data) => setFlights(data))
      .catch((error) => console.error("Error fetching flights:", error));
  }, []);

  return (
    <>
   <div className="flight-detail-container">
    {flights.map((flight) => (
      <div key={flight.flight_number} className="flight-card">
        <div className="flight-card-header">
          <h2 className="flight-airline">{flight.airline}</h2>
          <span className={`flight-status status-${flight.status?.toLowerCase()}`}>
            {flight.status}
          </span>
        </div>
        <p className="flight-number">{flight.flight_number}</p>
        <p className="flight-route">
          {flight.origin} <span className="route-arrow">→</span> {flight.destination}
        </p>
      </div>
    ))}
  </div>
    </>

  );
}

export default FlightDetail;