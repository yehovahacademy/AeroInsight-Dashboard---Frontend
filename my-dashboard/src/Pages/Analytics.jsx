import "../styles/Analytics.css";
import { useState, useEffect } from "react";
import AirportSearch from "../components/Airport/AirportSearch";

function Analytics() {
    const[airportData, setAirportData] = useState(null);
    const [stats, setStats] = useState(null);

    useEffect(() => {
        fetch("https://aeroinsight-dashboard-backend.onrender.com/analytics/")
            .then((res) => res.json())
            .then((data) => setStats(data))
            .catch((err) => console.error(err));
    }, []);

    const handleAirportSearch = (iataCode) => {
        fetch(
    `https://aeroinsight-dashboard-backend.onrender.com/airport-intelligence/analytics/airport/${iataCode}`
)
            .then((res) => res.json())
            .then((data) =>  setAirportData(data))
            .catch((err) => console.error(err));

            
    };



    return (
        <div className="analytics-dashboard">

            {/* ── Header ── */}
            <div className="dashboard-header">
                <div>
                    <p className="dashboard-label">AeroInsight</p>
                    <h1 className="dashboard-title">Analytics</h1>
                </div>
                <div className="live-badge">
                    <span className="live-dot" />
                    Live data
                </div>
            </div>

            {/* ── Stat cards ── */}
            {stats && (
                <>
                    <div className="stats-grid">
                        <div className="stat-card stat-card--total">
                            <div className="stat-card-header">
                                <div className="stat-icon stat-icon--accent">✈</div>
                                <span className="stat-label">Total flights</span>
                            </div>
                            <p className="stat-value">{stats.total_flights}</p>
                            <p className="stat-sub">across all routes</p>
                        </div>

                        <div className="stat-card stat-card--ontime">
                            <div className="stat-card-header">
                                <div className="stat-icon stat-icon--success">✓</div>
                                <span className="stat-label">On time</span>
                            </div>
                            <p className="stat-value stat-value--success">{stats.on_time_flights}</p>
                            <p className="stat-sub">
                                {Math.round((stats.on_time_flights / stats.total_flights) * 100)}% on-time rate
                            </p>
                        </div>

                        <div className="stat-card stat-card--delayed">
                            <div className="stat-card-header">
                                <div className="stat-icon stat-icon--warning">⚠</div>
                                <span className="stat-label">Delayed</span>
                            </div>
                            <p className="stat-value stat-value--warning">{stats.delayed_flights}</p>
                            <p className="stat-sub">
                                {Math.round((stats.delayed_flights / stats.total_flights) * 100)}% delay rate
                            </p>
                        </div>
                    </div>

                    {/* ── Performance + Breakdown row ── */}
                    <div className="section-row">
                        <div className="performance-bar-card">
                            <div className="performance-bar-header">
                                <span>On-time performance</span>
                                <span>{Math.round((stats.on_time_flights / stats.total_flights) * 100)}%</span>
                            </div>
                            <div className="performance-track">
                                <div
                                    className="performance-fill"
                                    style={{
                                        width: `${Math.round((stats.on_time_flights / stats.total_flights) * 100)}%`,
                                    }}
                                />
                            </div>
                            <div className="performance-bar-footer">
                                <span>0%</span>
                                <span>50%</span>
                                <span>100%</span>
                            </div>
                        </div>

                        <div className="breakdown-card">
                            <p className="breakdown-title">Flight breakdown</p>
                            <div className="seg-bar">
                                <div
                                    className="seg-ontime"
                                    style={{
                                        width: `${Math.round((stats.on_time_flights / stats.total_flights) * 100)}%`,
                                    }}
                                />
                                <div
                                    className="seg-delayed"
                                    style={{
                                        width: `${Math.round((stats.delayed_flights / stats.total_flights) * 100)}%`,
                                    }}
                                />
                            </div>
                            <div className="seg-legend">
                                <div className="legend-item">
                                    <span className="legend-dot legend-dot--ontime" />
                                    On time {Math.round((stats.on_time_flights / stats.total_flights) * 100)}%
                                </div>
                                <div className="legend-item">
                                    <span className="legend-dot legend-dot--delayed" />
                                    Delayed {Math.round((stats.delayed_flights / stats.total_flights) * 100)}%
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* ── Airport Search ── */}
            <div className="analytics-divider" />
            <p className="section-heading">Airport intelligence</p>
            <div className="airport-search-section">
                <AirportSearch onSearch={handleAirportSearch} />
            </div>

        </div>
    );
}

export default Analytics;