import { useState, useEffect, useRef } from "react";
import "./NetworkPlanner.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faRightLeft,
  faRotate,
  faTriangleExclamation,
  faChartLine,
  faPlane,
  faRoute,
  faGaugeHigh,
  faLocationDot,
  faSignal,
  faCircleCheck,
  faArrowTrendUp,
  faArrowTrendDown,
  faMinus,
} from "@fortawesome/free-solid-svg-icons";

import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup,
  Polyline,
  useMap,
} from "react-leaflet";

import "leaflet/dist/leaflet.css";

import RouteCards from "./RouteCards";

// ─────────────────────────────────────────────
// Configuration
// ─────────────────────────────────────────────

const BASE_URL = "https://aeroinsight-dashboard-backend.onrender.com";

const AIRCRAFT_TYPES = ["A320", "A321neo", "B737 MAX", "B777", "ATR 72"];

const SEASONS = [
  "Winter (Nov–Feb)",
  "Summer (Mar–Jun)",
  "Monsoon (Jul–Oct)",
];

const FLIGHTS_PER_DAY = ["1", "2", "3", "4", "5", "6+"];

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

const ROUTE_OPPORTUNITIES = [
  {
    origin: "BOM", destination: "DEL",
    demand: "HIGH", demandClass: "high",
    loadFactor: 91, signal: "Strong", signalClass: "strong",
    trend: "up", yoy: "+4.2%",
  },
  {
    origin: "BOM", destination: "CCU",
    demand: "HIGH", demandClass: "high",
    loadFactor: 87, signal: "Strong", signalClass: "strong",
    trend: "up", yoy: "+2.8%",
  },
  {
    origin: "DEL", destination: "BLR",
    demand: "MEDIUM", demandClass: "medium",
    loadFactor: 89, signal: "Monitor", signalClass: "watch",
    trend: "flat", yoy: "+0.3%",
  },
  {
    origin: "HYD", destination: "BOM",
    demand: "HIGH", demandClass: "high",
    loadFactor: 84, signal: "Growing", signalClass: "growing",
    trend: "up", yoy: "+6.1%",
  },
  {
    origin: "BLR", destination: "MAA",
    demand: "MEDIUM", demandClass: "medium",
    loadFactor: 76, signal: "Evaluate", signalClass: "neutral",
    trend: "down", yoy: "-1.2%",
  },
];

// ─────────────────────────────────────────────
// Live Clock
// ─────────────────────────────────────────────

function LiveClock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <span className="live-clock">
      {time.toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
        timeZone: "Asia/Kolkata",
      })}{" "}
      IST
    </span>
  );
}

// ─────────────────────────────────────────────
// Map helper
// ─────────────────────────────────────────────

function MapController({ selectedAirport }) {
  const map = useMap();

  useEffect(() => {
    if (!selectedAirport) return;
    map.flyTo([selectedAirport.latitude, selectedAirport.longitude], 6, {
      duration: 1.2,
    });
  }, [selectedAirport, map]);

  return null;
}

// ─────────────────────────────────────────────
// Trend icon helper
// ─────────────────────────────────────────────

function TrendIcon({ direction }) {
  const icon =
    direction === "up"
      ? faArrowTrendUp
      : direction === "down"
      ? faArrowTrendDown
      : faMinus;
  return (
    <FontAwesomeIcon
      icon={icon}
      className={`trend-icon trend-${direction}`}
    />
  );
}

// ─────────────────────────────────────────────
// Load Factor Bar
// ─────────────────────────────────────────────

function LoadFactorBar({ value }) {
  const color =
    value >= 88 ? "var(--amber)" : value >= 80 ? "var(--blue)" : "var(--green)";
  return (
    <div className="lf-bar-wrap" title={`${value}% load factor`}>
      <div className="lf-bar-track">
        <div
          className="lf-bar-fill"
          style={{ width: `${value}%`, background: color }}
        />
      </div>
      <span className="lf-bar-label">{value}%</span>
    </div>
  );
}

// ─────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────

function NetworkPlanner() {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [aircraft, setAircraft] = useState("");
  const [season, setSeason] = useState("");
  const [flightsDay, setFlightsDay] = useState("");

  const [selectedRoute, setSelectedRoute] = useState(null);
  const [routeData, setRouteData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [airports, setAirports] = useState([]);
  const [airportsLoading, setAirportsLoading] = useState(true);
  const [selectedAirport, setSelectedAirport] = useState(null);

  const analysisRef = useRef(null);

  // ───────────────────────────────────────────
  // Fetch airports
  // ───────────────────────────────────────────

  useEffect(() => {
    let mounted = true;

    Promise.all(
      AIRPORT_CODES.map(async (code) => {
        try {
          const response = await fetch(
            `${BASE_URL}/airports/api/airports/search/${code}`
          );
          if (!response.ok) return null;
          const results = await response.json();
          return results.find((a) => a.iata?.toUpperCase() === code.toUpperCase()) ?? null;
        } catch {
          return null;
        }
      })
    ).then((results) => {
      if (!mounted) return;
      const valid = results.filter(Boolean).sort((a, b) => a.city.localeCompare(b.city));
      setAirports(valid);
      setAirportsLoading(false);
    });

    return () => { mounted = false; };
  }, []);

  // ───────────────────────────────────────────
  // Derived
  // ───────────────────────────────────────────

  const formReady = origin && destination && origin !== destination;

  const originAirport = airports.find((a) => a.iata === origin);
  const destinationAirport = airports.find((a) => a.iata === destination);

  const activeRoute =
    originAirport && destinationAirport
      ? [
          [originAirport.latitude, originAirport.longitude],
          [destinationAirport.latitude, destinationAirport.longitude],
        ]
      : null;

  // ───────────────────────────────────────────
  // Handlers
  // ───────────────────────────────────────────

  const handleSwap = () => {
    setOrigin(destination);
    setDestination(origin);
  };

  const handleAirportClick = (airport) => setSelectedAirport(airport);

  const handlePlanRoute = (org, dst) => {
    setOrigin(org);
    setDestination(dst);
    // Scroll to scenario panel
    document.querySelector(".scenario-panel")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const handleAnalyze = async () => {
    if (!formReady) return;
    setLoading(true);
    setError(null);
    setRouteData(null);

    try {
      const response = await fetch(`${BASE_URL}/api/network/analyze_route`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          origin,
          destination,
          aircraft: aircraft || null,
          season: season || null,
          flights_per_day: flightsDay || null,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(`Server error: ${response.status}`);

      setRouteData(data);
      setSelectedRoute(`${origin}-${destination}`);

      // Scroll to analysis
      setTimeout(() => {
        analysisRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 300);
    } catch (err) {
      console.error("Route analysis failed:", err);
      setError("Unable to analyse this route. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ───────────────────────────────────────────
  // Render
  // ───────────────────────────────────────────

  return (
    <main className="network-planner">

      {/* ═══════════════════════════════════════
          STICKY TOP BAR
      ═══════════════════════════════════════ */}

      <div className="np-topbar">
        <div className="np-topbar-left">
          <span className="topbar-breadcrumb">
            AeroInsight <span className="sep">›</span> Network Intelligence
          </span>
          <span className="topbar-title">Network Planner</span>
        </div>
        <div className="np-topbar-right">
          <div className="topbar-status">
            <span className="status-dot pulse" />
            Live
          </div>
          <LiveClock />
          <button
            className="topbar-refresh"
            onClick={() => window.location.reload()}
            title="Refresh"
          >
            <FontAwesomeIcon icon={faRotate} />
          </button>
        </div>
      </div>

      {/* ═══════════════════════════════════════
          PAGE HERO
      ═══════════════════════════════════════ */}

      <section className="network-hero">
        <div className="hero-text">
          <div className="eyebrow">
            <FontAwesomeIcon icon={faRoute} />
            ROUTE INTELLIGENCE
          </div>
          <h1>Network Planner</h1>
          <p>
            Strategic route analysis, capacity signals, and demand intelligence
            for Akasa Air's network planning team.
          </p>
        </div>

        <div className="hero-context-strip">
          <div className="ctx-item">
            <span>NETWORK</span>
            <strong>India Domestic</strong>
          </div>
          <div className="ctx-divider" />
          <div className="ctx-item">
            <span>HORIZON</span>
            <strong>90 Days</strong>
          </div>
          <div className="ctx-divider" />
          <div className="ctx-item">
            <span>AIRPORTS</span>
            <strong>{airportsLoading ? "—" : airports.length}</strong>
          </div>
          <div className="ctx-divider" />
          <div className="ctx-item">
            <span>DATA</span>
            <strong className="ctx-live">
              <span className="status-dot micro" /> Live
            </strong>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          KPI STRIP
      ═══════════════════════════════════════ */}

      <section className="kpi-strip">
        <div className="kpi-tile">
          <div className="kpi-icon-wrap amber">
            <FontAwesomeIcon icon={faRoute} />
          </div>
          <div className="kpi-body">
            <span className="kpi-label">ACTIVE AIRPORTS</span>
            <strong className="kpi-value">
              {airportsLoading ? <span className="kpi-loading">—</span> : airports.length}
            </strong>
            <span className="kpi-sub">In planning dataset</span>
          </div>
        </div>

        <div className="kpi-tile">
          <div className="kpi-icon-wrap blue">
            <FontAwesomeIcon icon={faGaugeHigh} />
          </div>
          <div className="kpi-body">
            <span className="kpi-label">NETWORK LOAD FACTOR</span>
            <strong className="kpi-value">84.6%</strong>
            <span className="kpi-sub positive">↑ 3.2% vs prior period</span>
          </div>
        </div>

        <div className="kpi-tile">
          <div className="kpi-icon-wrap green">
            <FontAwesomeIcon icon={faPlane} />
          </div>
          <div className="kpi-body">
            <span className="kpi-label">FLEET STATUS</span>
            <strong className="kpi-value">Operational</strong>
            <span className="kpi-sub">Planning environment active</span>
          </div>
        </div>

        <div className="kpi-tile">
          <div className="kpi-icon-wrap amber">
            <FontAwesomeIcon icon={faChartLine} />
          </div>
          <div className="kpi-body">
            <span className="kpi-label">NETWORK HEALTH</span>
            <strong className="kpi-value">Strong</strong>
            <span className="kpi-sub positive">Stable operating conditions</span>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          MAIN WORKSPACE — MAP + INSIGHTS
      ═══════════════════════════════════════ */}

      <section className="network-workspace">

        {/* MAP PANEL */}
        <div className="map-panel">
          <div className="panel-header">
            <div className="panel-header-left">
              <span className="panel-eyebrow">NETWORK VISUALISATION</span>
              <h2>Route Network</h2>
            </div>
            <div className="map-legend">
              <span><i className="legend-dot airport" /> Airport</span>
              <span><i className="legend-line route" /> Active route</span>
            </div>
          </div>

          <div className="map-wrap">
            {/* Route badge — shown when both airports selected */}
            {originAirport && destinationAirport && (
              <div className="map-route-badge">
                <span className="badge-code">{origin}</span>
                <FontAwesomeIcon icon={faArrowRight} className="badge-arrow" />
                <span className="badge-code">{destination}</span>
                <span className="badge-label">
                  {originAirport.city} → {destinationAirport.city}
                </span>
              </div>
            )}

            <MapContainer
              center={[20.5937, 78.9629]}
              zoom={4}
              scrollWheelZoom={true}
              zoomControl={true}
              attributionControl={true}
            >
              <TileLayer
                attribution='&copy; OpenStreetMap contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <MapController selectedAirport={selectedAirport} />

              {airports.map((airport) => (
                <CircleMarker
                  key={airport.iata}
                  center={[airport.latitude, airport.longitude]}
                  radius={
                    airport.iata === origin || airport.iata === destination
                      ? 9
                      : selectedAirport?.iata === airport.iata
                      ? 7
                      : 4
                  }
                  pathOptions={{
                    className:
                      airport.iata === origin || airport.iata === destination
                        ? "airport-marker active"
                        : "airport-marker",
                  }}
                  eventHandlers={{ click: () => handleAirportClick(airport) }}
                >
                  <Popup>
                    <div className="map-popup">
                      <strong>{airport.iata}</strong>
                      <span>{airport.city}</span>
                      <small>{airport.name}</small>
                    </div>
                  </Popup>
                </CircleMarker>
              ))}

              {activeRoute && (
                <Polyline
                  positions={activeRoute}
                  pathOptions={{
                    className: loading ? "route-line route-line--active" : "route-line",
                    weight: 2,
                    dashArray: "10 6",
                  }}
                />
              )}
            </MapContainer>

            {airportsLoading && (
              <div className="map-loading">
                <div className="map-spinner" />
                Loading network…
              </div>
            )}
          </div>
        </div>

        {/* INSIGHTS SIDEBAR */}
        <aside className="insights-panel">
          <div className="panel-header">
            <span className="panel-eyebrow">LIVE INTELLIGENCE</span>
            <h2>Network Signals</h2>
          </div>

          <div className="insight-card warning">
            <div className="insight-icon-wrap">
              <FontAwesomeIcon icon={faTriangleExclamation} />
            </div>
            <div className="insight-body">
              <span className="insight-type">CAPACITY PRESSURE</span>
              <strong className="insight-route">BOM → DEL</strong>
              <p>High utilisation may justify additional frequency on this corridor.</p>
              <div className="insight-stat">
                Load factor <b>91%</b>
              </div>
            </div>
          </div>

          <div className="insight-card opportunity">
            <div className="insight-icon-wrap">
              <FontAwesomeIcon icon={faArrowTrendUp} />
            </div>
            <div className="insight-body">
              <span className="insight-type">GROWTH SIGNAL</span>
              <strong className="insight-route">BOM → CCU</strong>
              <p>Strong demand signal detected. Opportunity score trending upward.</p>
              <div className="insight-stat">
                Opp. score <b>78%</b>
              </div>
            </div>
          </div>

          <div className="insight-card neutral">
            <div className="insight-icon-wrap">
              <FontAwesomeIcon icon={faSignal} />
            </div>
            <div className="insight-body">
              <span className="insight-type">NETWORK COVERAGE</span>
              <strong className="insight-route">{airports.length} airports</strong>
              <p>Current planning dataset available for network scenario modelling.</p>
            </div>
          </div>

          <div className="insight-card info">
            <div className="insight-icon-wrap">
              <FontAwesomeIcon icon={faCircleCheck} />
            </div>
            <div className="insight-body">
              <span className="insight-type">PLANNING STATUS</span>
              <strong className="insight-route">Scenarios Ready</strong>
              <p>Select a route below to begin profitability and demand modelling.</p>
            </div>
          </div>
        </aside>
      </section>

      {/* ═══════════════════════════════════════
          SCENARIO PANEL
      ═══════════════════════════════════════ */}

      <section className="scenario-panel">
        <div className="scenario-header">
          <div>
            <span className="panel-eyebrow">PLANNING SCENARIO</span>
            <h2>Analyse a Route</h2>
            <p>Configure the operating scenario and run route intelligence.</p>
          </div>

          {formReady && (
            <div className="scenario-route-badge">
              <span className="srb-code">{origin}</span>
              <FontAwesomeIcon icon={faArrowRight} className="srb-arrow" />
              <span className="srb-code">{destination}</span>
              {originAirport && destinationAirport && (
                <span className="srb-cities">
                  {originAirport.city} → {destinationAirport.city}
                </span>
              )}
            </div>
          )}
        </div>

        <div className="scenario-form">
          {/* Row 1: Route */}
          <div className="scenario-row route-row">
            <div className="scenario-field">
              <label>ORIGIN</label>
              <select
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                disabled={airportsLoading}
                className={origin ? "has-value" : ""}
              >
                <option value="">
                  {airportsLoading ? "Loading airports…" : "Select origin"}
                </option>
                {airports.map((airport) => (
                  <option
                    key={airport.iata}
                    value={airport.iata}
                    disabled={airport.iata === destination}
                  >
                    {airport.iata} — {airport.city}
                  </option>
                ))}
              </select>
            </div>

            <button
              className="swap-btn"
              onClick={handleSwap}
              disabled={!origin && !destination}
              title="Swap origin and destination"
            >
              <FontAwesomeIcon icon={faRightLeft} />
            </button>

            <div className="scenario-field">
              <label>DESTINATION</label>
              <select
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                disabled={airportsLoading}
                className={destination ? "has-value" : ""}
              >
                <option value="">
                  {airportsLoading ? "Loading airports…" : "Select destination"}
                </option>
                {airports.map((airport) => (
                  <option
                    key={airport.iata}
                    value={airport.iata}
                    disabled={airport.iata === origin}
                  >
                    {airport.iata} — {airport.city}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Row 2: Parameters */}
          <div className="scenario-row params-row">
            <div className="scenario-field">
              <label>AIRCRAFT TYPE</label>
              <select value={aircraft} onChange={(e) => setAircraft(e.target.value)}>
                <option value="">Any aircraft</option>
                {AIRCRAFT_TYPES.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            <div className="scenario-field">
              <label>SEASON</label>
              <select value={season} onChange={(e) => setSeason(e.target.value)}>
                <option value="">Any season</option>
                {SEASONS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div className="scenario-field">
              <label>FREQUENCY</label>
              <select value={flightsDay} onChange={(e) => setFlightsDay(e.target.value)}>
                <option value="">Flights / day</option>
                {FLIGHTS_PER_DAY.map((v) => (
                  <option key={v} value={v}>{v}</option>
                ))}
              </select>
            </div>

            <button
              className="analyze-btn"
              onClick={handleAnalyze}
              disabled={!formReady || loading}
            >
              {loading ? (
                <>
                  <span className="btn-spinner" />
                  Analysing…
                </>
              ) : (
                <>
                  Run Analysis
                  <FontAwesomeIcon icon={faArrowRight} />
                </>
              )}
            </button>
          </div>
        </div>

        {error && (
          <div className="scenario-error">
            <FontAwesomeIcon icon={faTriangleExclamation} />
            {error}
          </div>
        )}
      </section>

      {/* ═══════════════════════════════════════
          ROUTE OPPORTUNITIES TABLE
      ═══════════════════════════════════════ */}

      <section className="opportunities-panel">
        <div className="panel-header">
          <div>
            <span className="panel-eyebrow">COMMERCIAL INTELLIGENCE</span>
            <h2>Route Opportunities</h2>
            <p>Corridors with notable demand signals requiring planner attention.</p>
          </div>
          <div className="opps-count">{ROUTE_OPPORTUNITIES.length} corridors</div>
        </div>

        <div className="opps-table">
          <div className="opps-table-head">
            <span>ROUTE</span>
            <span>DEMAND</span>
            <span>LOAD FACTOR</span>
            <span>YoY</span>
            <span>SIGNAL</span>
            <span />
          </div>

          {ROUTE_OPPORTUNITIES.map((row, i) => (
            <div className="opps-row" key={i}>
              <div className="opp-route">
                <span className="opp-code">{row.origin}</span>
                <FontAwesomeIcon icon={faArrowRight} className="opp-arrow" />
                <span className="opp-code">{row.destination}</span>
              </div>

              <span>
                <span className={`demand-badge ${row.demandClass}`}>{row.demand}</span>
              </span>

              <LoadFactorBar value={row.loadFactor} />

              <span className={`yoy-val ${row.trend}`}>
                <TrendIcon direction={row.trend} /> {row.yoy}
              </span>

              <span>
                <span className={`signal-pill ${row.signalClass}`}>{row.signal}</span>
              </span>

              <button
                className="plan-route-btn"
                onClick={() => handlePlanRoute(row.origin, row.destination)}
              >
                Plan route <FontAwesomeIcon icon={faArrowRight} />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════
          ROUTE ANALYSIS OUTPUT
      ═══════════════════════════════════════ */}

      <section className="route-analysis-panel" ref={analysisRef}>
        <div className="panel-header">
          <div>
            <span className="panel-eyebrow">ROUTE INTELLIGENCE</span>
            <h2>
              {routeData ? `${origin} → ${destination}` : "Route Analysis"}
            </h2>
            <p>
              {routeData
                ? `Scenario analysis for ${originAirport?.city ?? origin} to ${destinationAirport?.city ?? destination}.`
                : "Select an origin and destination above, then run a scenario to view route intelligence."}
            </p>
          </div>

          {routeData && (
            <div className="analysis-complete-badge">
              <FontAwesomeIcon icon={faCircleCheck} /> Analysis complete
            </div>
          )}
        </div>

        {!routeData && !loading && (
          <div className="analysis-empty">
            <div className="analysis-empty-icon">
              <FontAwesomeIcon icon={faChartLine} />
            </div>
            <h3>No analysis yet</h3>
            <p>Configure a route scenario above and run the analysis.</p>
          </div>
        )}

        {loading && (
          <div className="analysis-empty">
            <div className="analysis-spinner-large" />
            <h3>Analysing scenario</h3>
            <p>Computing route intelligence for {origin} → {destination}…</p>
          </div>
        )}

        {routeData && (
          <div className="route-analysis-content">
            <RouteCards
              data={routeData}
              selectedRoute={selectedRoute}
              setSelectedRoute={setSelectedRoute}
            />
          </div>
        )}
      </section>

    </main>
  );
}

export default NetworkPlanner;