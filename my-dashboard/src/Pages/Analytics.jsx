import "../styles/Analytics.css";
import { useState, useEffect } from "react";
import AirportSearch from "../components/Airport/AirportSearch";
import AirportOverview from "../components/Airport/AirportOverview";
import AirportWeather from "../components/Airport/AirportWeather";
import FleetOverview from "../components/Fleet/FleetOverview";
import FleetStats from "../components/Fleet/FleetStats";
import FleetTable from "../components/Fleet/FleetTable";
import DemandIntelligence from "../components/Demand Intelligence/DemandIntelligence";

// ─────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────

const BASE_URL = "https://aeroinsight-dashboard-backend.onrender.com";

const AIRPORT_CODES = [
  // India
  "BOM","DEL","BLR","MAA","CCU","HYD","GOI","PNQ","AMD","JAI",
  "COK","TRV","IXC","PAT","BHO","NAG","IXB","GAU","VNS","IXR",
  "SXR","LKO","IDR","IXE","IXM","VTZ","BDQ","ATQ","JDH","UDR",
  // Middle East
  "DXB","AUH","DOH","KWI","BAH","MCT","RUH","JED","AMM","BEY",
  // Europe
  "LHR","CDG","AMS","FRA","IST","MAD","BCN","FCO","MUC","ZRH",
  "VIE","BRU","ARN","CPH","HEL","OSL","WAW","PRG","BUD","ATH",
  // Asia Pacific
  "SIN","BKK","KUL","CGK","MNL","HKG","ICN","NRT","PVG","PEK",
  "SYD","MEL","AKL","KIX","TPE","SGN","HAN","DAD","CMB","KTM",
  // Americas
  "JFK","LAX","ORD","MIA","SFO","YYZ","GRU","EZE","BOG","LIM",
  // Africa
  "JNB","NBO","CAI","CMN","ADD","LOS","ACC","DAR",
];

// ─────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────

function Analytics() {
  const [airportData, setAirportData] = useState(null);
  const [stats, setStats] = useState(null);
  const [fleet, setFleet] = useState(null);
  const [demandForecast, setDemandForecast] = useState(null);
  const [demandLoading, setDemandLoading] = useState(false);
  const [demandError, setDemandError] = useState(null);
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [airports, setAirports] = useState([]);
  const [airportsLoading, setAirportsLoading] = useState(true);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [routeData, setRouteData] = useState(null);

  // ── Fetch stats ──────────────────────────────────────────
  useEffect(() => {
    fetch(`${BASE_URL}/analytics/`)
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch((err) => console.error(err));
  }, []);

  // ── Fetch fleet ──────────────────────────────────────────
  useEffect(() => {
    fetch(`${BASE_URL}/fleet/fleet/`)
      .then((res) => res.json())
      .then((data) => setFleet(data))
      .catch((err) => console.error(err));
  }, []);

  // ── Fetch demand forecast ────────────────────────────────
  useEffect(() => {
    fetch(`${BASE_URL}/demand-forecast/demand/forecast/DEL/DXB?days=7`)
      .then((res) => res.json())
      .then((data) => setDemandForecast(data))
      .catch((err) => console.error(err));
  }, []);

  // ── Fetch all airports ───────────────────────────────────
  useEffect(() => {
    let mounted = true;

    Promise.all(
      AIRPORT_CODES.map(async (code) => {
        try {
          const res = await fetch(
            `${BASE_URL}/airports/api/airports/search/${code}`
          );
          if (!res.ok) return null;
          const results = await res.json();
          return (
            results.find(
              (a) => a.iata?.toUpperCase() === code.toUpperCase()
            ) ?? null
          );
        } catch {
          return null;
        }
      })
    ).then((results) => {
      if (!mounted) return;
      const valid = results
        .filter(Boolean)
        .sort((a, b) => a.city.localeCompare(b.city));
      setAirports(valid);
      setAirportsLoading(false);
    });

    return () => { mounted = false; };
  }, []);

  // ── Handlers ─────────────────────────────────────────────
  const handleAirportSearch = (iataCode) => {
    fetch(`${BASE_URL}/airports/api/airports/${iataCode}`)
      .then((res) => res.json())
      .then((data) => setAirportData(data))
      .catch((err) => console.error(err));
  };

  // ── Derived values ───────────────────────────────────────
  const onTimeRate = stats ? Math.round((stats.on_time_flights / stats.total_flights) * 100) : 0;
  const delayRate = stats ? Math.round((stats.delayed_flights / stats.total_flights) * 100) : 0;

  // ── Render ───────────────────────────────────────────────
  return (
    <div className="analytics-dashboard">

      {/* ═══════════════════════════════════════════════════
          HEADER SECTION
          ═══════════════════════════════════════════════════ */}
      <header className="dashboard-header">
        <div className="dashboard-header__brand">
          <div className="brand-icon">✈</div>
          <div>
            <span className="brand-label">AeroInsight</span>
            <h1 className="brand-title">Analytics Dashboard</h1>
          </div>
        </div>
        <div className="dashboard-header__status">
          <div className="status-indicator">
            <span className="status-dot"></span>
            <span className="status-text">Live Data</span>
          </div>
          <div className="header-meta">
            <span className="meta-item">
              <span className="meta-label">Updated</span>
              <span className="meta-value">Just now</span>
            </span>
          </div>
        </div>
      </header>

      {/* ═══════════════════════════════════════════════════
          FLIGHT OPERATIONS SECTION
          ═══════════════════════════════════════════════════ */}
      {stats && (
        <section className="dashboard-section">
          <div className="section-header">
            <div className="section-header__left">
              <span className="section-icon">📊</span>
              <div>
                <h2 className="section-title">Flight Operations</h2>
                <p className="section-subtitle">Real-time performance metrics</p>
              </div>
            </div>
            <div className="section-header__right">
              <span className="period-badge">Last 30 days</span>
            </div>
          </div>

          <div className="stats-grid">
            {/* Total Flights Card */}
            <div className="stat-card stat-card--total">
              <div className="stat-card__icon">
                <span className="icon-circle icon-circle--orange">✈</span>
              </div>
              <div className="stat-card__content">
                <span className="stat-card__label">Total Flights</span>
                <p className="stat-card__value">{stats.total_flights}</p>
                <span className="stat-card__trend trend-up">↑ 12% from last month</span>
              </div>
            </div>

            {/* On-Time Flights Card */}
            <div className="stat-card stat-card--ontime">
              <div className="stat-card__icon">
                <span className="icon-circle icon-circle--green">✓</span>
              </div>
              <div className="stat-card__content">
                <span className="stat-card__label">On-Time Flights</span>
                <p className="stat-card__value">{stats.on_time_flights}</p>
                <span className="stat-card__trend trend-up">↑ {onTimeRate}% on-time rate</span>
              </div>
            </div>

            {/* Delayed Flights Card */}
            <div className="stat-card stat-card--delayed">
              <div className="stat-card__icon">
                <span className="icon-circle icon-circle--yellow">⚠</span>
              </div>
              <div className="stat-card__content">
                <span className="stat-card__label">Delayed Flights</span>
                <p className="stat-card__value">{stats.delayed_flights}</p>
                <span className="stat-card__trend trend-down">↓ {delayRate}% delay rate</span>
              </div>
            </div>
          </div>

          {/* Performance Charts Row */}
          <div className="charts-row">
            {/* Performance Bar */}
            <div className="chart-card chart-card--bar">
              <div className="chart-card__header">
                <h3 className="chart-card__title">On-Time Performance</h3>
                <span className="chart-card__percentage">{onTimeRate}%</span>
              </div>
              <div className="progress-track">
                <div 
                  className="progress-fill" 
                  style={{ width: `${onTimeRate}%` }}
                ></div>
              </div>
              <div className="progress-labels">
                <span>0%</span>
                <span>Target: 85%</span>
                <span>100%</span>
              </div>
            </div>

            {/* Flight Breakdown */}
            <div className="chart-card chart-card--breakdown">
              <h3 className="chart-card__title">Flight Breakdown</h3>
              <div className="breakdown-bar">
                <div 
                  className="breakdown-segment breakdown-segment--ontime" 
                  style={{ width: `${onTimeRate}%` }}
                >
                  <span className="segment-label">On-Time</span>
                </div>
                <div 
                  className="breakdown-segment breakdown-segment--delayed" 
                  style={{ width: `${delayRate}%` }}
                >
                  <span className="segment-label">Delayed</span>
                </div>
              </div>
              <div className="breakdown-legend">
                <div className="legend-item">
                  <span className="legend-dot legend-dot--green"></span>
                  <span>On-Time ({onTimeRate}%)</span>
                </div>
                <div className="legend-item">
                  <span className="legend-dot legend-dot--yellow"></span>
                  <span>Delayed ({delayRate}%)</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════
          AIRPORT INTELLIGENCE SECTION
          ═══════════════════════════════════════════════════ */}
      <section className="dashboard-section">
        <div className="section-header">
          <div className="section-header__left">
            <span className="section-icon">🏛</span>
            <div>
              <h2 className="section-title">Airport Intelligence</h2>
              <p className="section-subtitle">Search and analyze airport data</p>
            </div>
          </div>
        </div>

        <div className="airport-search-wrapper">
          <AirportSearch onSearch={handleAirportSearch} />
        </div>

        {airportData && (
          <div className="airport-results-grid">
            <AirportOverview airport={airportData} />
            <div className="airport-weather-wrapper">
              <AirportWeather weather={airportData.weather} />
            </div>
          </div>
        )}
      </section>

      {/* ═══════════════════════════════════════════════════
          FLEET COMPOSITION SECTION
          ═══════════════════════════════════════════════════ */}
      <section className="dashboard-section">
        <div className="section-header">
          <div className="section-header__left">
            <span className="section-icon">🛩</span>
            <div>
              <h2 className="section-title">Fleet Composition</h2>
              <p className="section-subtitle">Aircraft inventory and demand analysis</p>
            </div>
          </div>
        </div>

        <FleetOverview />

        {fleet && (
          <div className="fleet-grid">
            <div className="fleet-table-wrapper">
              <FleetTable aircraft={fleet.aircraft} />
            </div>
            <div className="demand-forecast-wrapper">
              <DemandIntelligence demandForecast={demandForecast} />
            </div>
          </div>
        )}
      </section>

    </div>
  );
}

export default Analytics;