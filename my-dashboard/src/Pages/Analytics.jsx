import "../styles/Analytics.css";
import { useState, useEffect } from "react";
import AirportSearch from "../components/Airport/AirportSearch";
import AirportOverview from "../components/Airport/AirportOverview";
import AirportWeather from "../components/Airport/AirportWeather";
import FleetOverview from "../components/Fleet/FleetOverview";
import FleetStats from "../components/Fleet/FleetStats";
import FleetTable from "../components/Fleet/FleetTable";

function Analytics() {
    const [airportData, setAirportData] = useState(null);
    const [stats, setStats]             = useState(null);
    const [fleet, setFleet]             = useState(null);
    const[demandForecast, setDemandForecast] = useState(null);
    const[setdemandLoading, setDemandLoading] = useState(false);
    const[demandError, setDemandError] = useState(null);

    useEffect(() => {
        fetch("https://aeroinsight-dashboard-backend.onrender.com/analytics/")
            .then((res) => res.json())
            .then((data) => setStats(data))
            .catch((err) => console.error(err));
    }, []);

    useEffect(() => {
        fetch("https://aeroinsight-dashboard-backend.onrender.com/fleet/fleet/")
            .then((res) => res.json())
            .then((data) => setFleet(data))
            .catch((err) => console.error(err));
    }, []);

    const handleAirportSearch = (iataCode) => {
        fetch(
            `https://aeroinsight-dashboard-backend.onrender.com/airports/api/airports/${iataCode}`
        )
            .then((res) => res.json())
            .then((data) => setAirportData(data))
            .catch((err) => console.error(err));
    };

    useEffect(() => {
        fetch("https://aeroinsight-dashboard-backend.onrender.com/demand-forecast/demand/forecast/DEL/DXB?days=7")
            .then((res) => res.json())
            .then((data) => setDemandForecast(data))
            .catch((err) => console.error(err));
    }, []);

    const onTimeRate  = stats ? Math.round((stats.on_time_flights / stats.total_flights) * 100) : 0;
    const delayRate   = stats ? Math.round((stats.delayed_flights  / stats.total_flights) * 100) : 0;

    return (
        <div className="analytics-dashboard">

            {/* ── Header ── */}
            <header className="dashboard-header">
                <div className="dashboard-header__left">
                    <p className="dashboard-label">AeroInsight</p>
                    <h1 className="dashboard-title">Analytics</h1>
                </div>
                <div className="live-badge">
                    <span className="live-dot" />
                    Live data
                </div>
            </header>

            {/* ── Flight stats ── */}
            {stats && (
                <section className="analytics-section">
                    <p className="section-eyebrow">Flight operations</p>

                    <div className="stats-grid">
                        <div className="stat-card stat-card--total">
                            <div className="stat-card__header">
                                <span className="stat-icon stat-icon--accent">✈</span>
                                <span className="stat-label">Total flights</span>
                            </div>
                            <p className="stat-value">{stats.total_flights}</p>
                            <p className="stat-sub">across all routes</p>
                        </div>

                        <div className="stat-card stat-card--ontime">
                            <div className="stat-card__header">
                                <span className="stat-icon stat-icon--success">✓</span>
                                <span className="stat-label">On time</span>
                            </div>
                            <p className="stat-value stat-value--success">{stats.on_time_flights}</p>
                            <p className="stat-sub">{onTimeRate}% on-time rate</p>
                        </div>

                        <div className="stat-card stat-card--delayed">
                            <div className="stat-card__header">
                                <span className="stat-icon stat-icon--warning">⚠</span>
                                <span className="stat-label">Delayed</span>
                            </div>
                            <p className="stat-value stat-value--warning">{stats.delayed_flights}</p>
                            <p className="stat-sub">{delayRate}% delay rate</p>
                        </div>
                    </div>

                    {/* ── Performance + Breakdown ── */}
                    <div className="section-row">
                        <div className="performance-bar-card">
                            <div className="performance-bar-card__header">
                                <span className="performance-bar-card__label">On-time performance</span>
                                <span className="performance-bar-card__pct">{onTimeRate}%</span>
                            </div>
                            <div className="performance-track">
                                <div className="performance-fill" style={{ width: `${onTimeRate}%` }} />
                            </div>
                            <div className="performance-bar-card__footer">
                                <span>0%</span>
                                <span>50%</span>
                                <span>100%</span>
                            </div>
                        </div>

                        <div className="breakdown-card">
                            <p className="breakdown-card__title">Flight breakdown</p>
                            <div className="seg-bar">
                                <div className="seg-ontime"  style={{ width: `${onTimeRate}%` }} />
                                <div className="seg-delayed" style={{ width: `${delayRate}%` }} />
                            </div>
                            <div className="seg-legend">
                                <div className="legend-item">
                                    <span className="legend-dot legend-dot--ontime" />
                                    On time — {onTimeRate}%
                                </div>
                                <div className="legend-item">
                                    <span className="legend-dot legend-dot--delayed" />
                                    Delayed — {delayRate}%
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* ── Airport intelligence ── */}
            <section className="analytics-section">
                <p className="section-eyebrow">Airport intelligence</p>
                <div className="airport-search-section">
                    <AirportSearch onSearch={handleAirportSearch} />
                </div>

                {airportData && (
                    <div className="airport-results">
                        <AirportOverview airport={airportData} />
                        <div className="airport-details-row">
                            <AirportWeather weather={airportData.weather} />
                        </div>
                    </div>
                )}
            </section>

            {/* ── Fleet ── */}
            <section className="analytics-section">
                <p className="section-eyebrow">Fleet composition</p>
                <FleetOverview />
                {fleet && (
    <div className="fleet-stats-row">
        

        <div className="fleet-table-row">
            <FleetTable aircraft={fleet.aircraft} />
        </div>
    </div>
)}
            </section>

        </div>
    );
}

export default Analytics;