import AirLineCards from "../components/Network/RouteCards";
import FlightDetails from "../components/Network/RouteDetails";
import "../styles/Analytics.css";
import { useState, useEffect } from "react";


function Analytics() {

  const [stats, setStats] = useState(null);

  fetch("https://aeroinsight-dashboard-backend.onrender.com/analytics/")
        .then((response) => response.json())
        .then((data) => {
            setStats(data);
        })
        .catch((error) => {
            console.log(error);
        });


   const [selectedAirline, setSelectedAirline] = useState(null);
  return (
   <>
   <div className="analytics-dashboard">
  <div className="dashboard-header">
    <div>
      <p className="dashboard-label">AeroInsight</p>
      <h1 className="dashboard-title">Analytics dashboard</h1>
    </div>
    <div className="live-badge">
      <span className="live-dot" />
      Live data
    </div>
  </div>

  {stats && (
    <>
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-card-header">
            <div className="stat-icon stat-icon--accent">
              ✈
            </div>
            <span className="stat-label">Total flights</span>
          </div>
          <p className="stat-value">{stats.total_flights}</p>
          <p className="stat-sub">across all routes</p>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <div className="stat-icon stat-icon--success">
              ✓
            </div>
            <span className="stat-label">On time</span>
          </div>
          <p className="stat-value stat-value--success">{stats.on_time_flights}</p>
          <p className="stat-sub">
            {Math.round((stats.on_time_flights / stats.total_flights) * 100)}% on-time rate
          </p>
        </div>

        <div className="stat-card">
          <div className="stat-card-header">
            <div className="stat-icon stat-icon--warning">
              ⚠
            </div>
            <span className="stat-label">Delayed</span>
          </div>
          <p className="stat-value stat-value--warning">{stats.delayed_flights}</p>
          <p className="stat-sub">
            {Math.round((stats.delayed_flights / stats.total_flights) * 100)}% delay rate
          </p>
        </div>
      </div>

      <div className="performance-bar-card">
        <div className="performance-bar-header">
          <span>On-time performance</span>
          <span>{Math.round((stats.on_time_flights / stats.total_flights) * 100)}%</span>
        </div>
        <div className="performance-track">
          <div
            className="performance-fill"
            style={{ width: `${Math.round((stats.on_time_flights / stats.total_flights) * 100)}%` }}
          />
        </div>
        <div className="performance-bar-footer">
          <span>0%</span>
          <span>100%</span>
        </div>
      </div>
    </>
  )}
</div>
    
   
   <Cards selectedAirline={selectedAirline}
    setSelectedAirline={setSelectedAirline} />

   <RouteDetails selectedAirline={selectedAirline} />
   
   </>
  );
}

export default Analytics;