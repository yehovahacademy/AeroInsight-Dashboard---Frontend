import { useState, useEffect, useRef } from "react";
import "./NetworkPlanner.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faRightLeft,
  faRoute,
  faPlane,
  faChartBar,
  faLightbulb,
  faCircleNotch,
  faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";

import "leaflet/dist/leaflet.css";

import RouteCards from "./RouteCards";

// ─────────────────────────────────────────────────────────────
// Static configuration
// ─────────────────────────────────────────────────────────────

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

// ─────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────

function NetworkPlanner() {

  // ── State ──────────────────────────────────────────────────

  const [origin, setOrigin]           = useState("");
  const [destination, setDestination] = useState("");
  const [aircraft, setAircraft]       = useState("");
  const [season, setSeason]           = useState("");
  const [flightsDay, setFlightsDay]   = useState("");

  const [selectedRoute, setSelectedRoute] = useState(null);
  const [routeData, setRouteData]         = useState(null);
  const [loading, setLoading]             = useState(false);
  const [error, setError]                 = useState(null);

  const [airports, setAirports]               = useState([]);
  const [airportsLoading, setAirportsLoading] = useState(true);

  const analysisRef = useRef(null);

  // ── Fetch airports ─────────────────────────────────────────

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

  // ── Derived ────────────────────────────────────────────────

  const formReady = origin && destination && origin !== destination;

  const selectedOrigin      = airports.find((a) => a.iata === origin);
  const selectedDestination = airports.find((a) => a.iata === destination);

  const routeCoordinates =
    selectedOrigin && selectedDestination
      ? [
          [selectedOrigin.latitude, selectedOrigin.longitude],
          [selectedDestination.latitude, selectedDestination.longitude],
        ]
      : [];

  // ── Handlers ───────────────────────────────────────────────

  const handleSwap = () => {
    setOrigin(destination);
    setDestination(origin);
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
          aircraft:       aircraft   || null,
          season:         season     || null,
          flights_per_day: flightsDay || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      setRouteData(data);
      setSelectedRoute(`${origin}-${destination}`);

      setTimeout(() => {
        analysisRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 300);

    } catch (err) {
      setError("Unable to analyse this route. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ── Render ─────────────────────────────────────────────────

  return (
    <main className="np-root">

      {/* ══════════════════════════════════════
          HERO
      ══════════════════════════════════════ */}

      <section className="np-hero">
        <div className="np-hero__aurora" aria-hidden="true" />

        <div className="np-hero__content">
          <p className="np-eyebrow">
            <FontAwesomeIcon icon={faRoute} />
            Network Intelligence
          </p>

          <h1 className="np-hero__title">
            Network<br />
            <span className="np-hero__accent">Planner</span>
          </h1>

          <p className="np-hero__sub">
            Evaluate routes, capacity signals, and network opportunities
            before committing to planning decisions.
          </p>
        </div>

        <div className="np-hero__meta">
          <div className="np-meta-item">
            <span>NETWORK</span>
            <strong>India Domestic</strong>
          </div>
          <div className="np-meta-divider" />
          <div className="np-meta-item">
            <span>HORIZON</span>
            <strong>90 Days</strong>
          </div>
          <div className="np-meta-divider" />
          <div className="np-meta-item">
            <span>AIRPORTS</span>
            <strong>{airportsLoading ? "—" : airports.length}</strong>
          </div>
          <div className="np-meta-divider" />
          <div className="np-meta-item">
            <span>DATA STATUS</span>
            <strong className="np-meta-live">
              <span className="np-status-dot" />
              Live
            </strong>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          KPI STRIP
      ══════════════════════════════════════ */}

      <section className="np-kpis">
        <div className="np-kpi">
          <div className="np-kpi__icon">
            <FontAwesomeIcon icon={faRoute} />
          </div>
          <div className="np-kpi__body">
            <span>ACTIVE AIRPORTS</span>
            <strong>{airportsLoading ? "—" : airports.length}</strong>
            <small>In planning dataset</small>
          </div>
        </div>

        <div className="np-kpi">
          <div className="np-kpi__icon">
            <FontAwesomeIcon icon={faPlane} />
          </div>
          <div className="np-kpi__body">
            <span>DAILY FLIGHTS</span>
            <strong>—</strong>
            <small>DGCA data pending</small>
          </div>
        </div>

        <div className="np-kpi">
          <div className="np-kpi__icon">
            <FontAwesomeIcon icon={faChartBar} />
          </div>
          <div className="np-kpi__body">
            <span>LOAD FACTOR</span>
            <strong>—</strong>
            <small>Verified data pending</small>
          </div>
        </div>

        <div className="np-kpi">
          <div className="np-kpi__icon">
            <FontAwesomeIcon icon={faLightbulb} />
          </div>
          <div className="np-kpi__body">
            <span>OPPORTUNITIES</span>
            <strong>—</strong>
            <small>Scenario engine pending</small>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          WORKSPACE — SCENARIO + MAP
      ══════════════════════════════════════ */}

      <section className="np-workspace">

        {/* SCENARIO FORM */}

        <div className="np-scenario">
          <div className="np-panel-header">
            <p className="np-eyebrow">ROUTE SCENARIO</p>
            <h2>Build a network scenario</h2>
            <p className="np-panel-sub">
              Select a route and operating parameters to run route intelligence.
            </p>
          </div>

          <div className="np-form">

            {/* Route row */}
            <div className="np-form__route-row">
              <div className="np-field">
                <label>ORIGIN</label>
                <select
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  disabled={airportsLoading}
                  className={origin ? "np-select--active" : ""}
                >
                  <option value="">
                    {airportsLoading ? "Loading airports…" : "Select origin"}
                  </option>
                  {airports.map((a) => (
                    <option
                      key={a.iata}
                      value={a.iata}
                      disabled={a.iata === destination}
                    >
                      {a.city} ({a.iata})
                    </option>
                  ))}
                </select>
              </div>

              <button
                className="np-swap"
                onClick={handleSwap}
                disabled={!origin && !destination}
                aria-label="Swap airports"
              >
                <FontAwesomeIcon icon={faRightLeft} />
              </button>

              <div className="np-field">
                <label>DESTINATION</label>
                <select
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  disabled={airportsLoading}
                  className={destination ? "np-select--active" : ""}
                >
                  <option value="">
                    {airportsLoading ? "Loading airports…" : "Select destination"}
                  </option>
                  {airports.map((a) => (
                    <option
                      key={a.iata}
                      value={a.iata}
                      disabled={a.iata === origin}
                    >
                      {a.city} ({a.iata})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Route indicator */}
            {formReady && (
              <div className="np-route-indicator">
                <span className="np-route-code">{origin}</span>
                <FontAwesomeIcon icon={faArrowRight} className="np-route-arrow" />
                <span className="np-route-code">{destination}</span>
                {selectedOrigin && selectedDestination && (
                  <span className="np-route-cities">
                    {selectedOrigin.city} → {selectedDestination.city}
                  </span>
                )}
              </div>
            )}

            {/* Parameters row */}
            <div className="np-form__params-row">
              <div className="np-field">
                <label>AIRCRAFT</label>
                <select
                  value={aircraft}
                  onChange={(e) => setAircraft(e.target.value)}
                >
                  <option value="">Any aircraft</option>
                  {AIRCRAFT_TYPES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div className="np-field">
                <label>SEASON</label>
                <select
                  value={season}
                  onChange={(e) => setSeason(e.target.value)}
                >
                  <option value="">Any season</option>
                  {SEASONS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              <div className="np-field">
                <label>FLIGHTS / DAY</label>
                <select
                  value={flightsDay}
                  onChange={(e) => setFlightsDay(e.target.value)}
                >
                  <option value="">Not specified</option>
                  {FLIGHTS_PER_DAY.map((v) => (
                    <option key={v} value={v}>{v}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Analyse */}
            <button
              className="np-analyse-btn"
              onClick={handleAnalyze}
              disabled={!formReady || loading}
            >
              {loading ? (
                <>
                  <FontAwesomeIcon icon={faCircleNotch} spin />
                  Analysing…
                </>
              ) : (
                <>
                  Run Analysis
                  <FontAwesomeIcon icon={faArrowRight} />
                </>
              )}
            </button>

            {error && (
              <div className="np-error">
                <FontAwesomeIcon icon={faTriangleExclamation} />
                {error}
              </div>
            )}
          </div>
        </div>

        {/* MAP */}

        <div className="np-map">
          <div className="np-panel-header np-panel-header--map">
            <div>
              <p className="np-eyebrow">NETWORK VISUALISATION</p>
              <h2>Network Map</h2>
            </div>
            {origin && destination && (
              <div className="np-map-badge">
                <span>{origin}</span>
                <FontAwesomeIcon icon={faArrowRight} />
                <span>{destination}</span>
              </div>
            )}
          </div>

          <div className="np-map__canvas">
            <MapContainer
              center={[20.5937, 78.9629]}
              zoom={4}
              scrollWheelZoom={false}
              style={{ width: "100%", height: "100%" }}
            >
              <TileLayer
                attribution="&copy; OpenStreetMap contributors"
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {selectedOrigin && (
                <Marker position={[selectedOrigin.latitude, selectedOrigin.longitude]}>
                  <Popup>
                    <strong>{selectedOrigin.iata}</strong>
                    <br />
                    {selectedOrigin.city}
                  </Popup>
                </Marker>
              )}

              {selectedDestination && (
                <Marker position={[selectedDestination.latitude, selectedDestination.longitude]}>
                  <Popup>
                    <strong>{selectedDestination.iata}</strong>
                    <br />
                    {selectedDestination.city}
                  </Popup>
                </Marker>
              )}

              {routeCoordinates.length > 0 && (
                <Polyline
                  positions={routeCoordinates}
                  pathOptions={{ color: "#F97316", weight: 2, dashArray: "8 6" }}
                />
              )}
            </MapContainer>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          ROUTE INTELLIGENCE
      ══════════════════════════════════════ */}

      <section className="np-intelligence" ref={analysisRef}>
        <div className="np-panel-header">
          <p className="np-eyebrow">ROUTE INTELLIGENCE</p>
          <h2>
            {routeData
              ? `${origin} → ${destination}`
              : "Route Analysis"}
          </h2>
          <p className="np-panel-sub">
            {routeData
              ? `Demand, profitability and opportunity analysis for ${selectedOrigin?.city ?? origin} to ${selectedDestination?.city ?? destination}.`
              : "Select a route above and run the analysis to see route intelligence."}
          </p>
        </div>

        {!routeData && !loading && !error && (
          <div className="np-empty">
            <div className="np-empty__icon">
              <FontAwesomeIcon icon={faChartBar} />
            </div>
            <strong>No route analysed yet</strong>
            <p>Configure a scenario above to begin.</p>
          </div>
        )}

        {loading && (
          <div className="np-empty">
            <div className="np-empty__spinner">
              <FontAwesomeIcon icon={faCircleNotch} spin />
            </div>
            <strong>Analysing route…</strong>
            <p>Computing intelligence for {origin} → {destination}</p>
          </div>
        )}

        {routeData && (
          <div className="np-analysis-output">
            <RouteCards
              data={routeData}
              selectedRoute={selectedRoute}
              setSelectedRoute={setSelectedRoute}
            />
          </div>
        )}
      </section>

      {/* ══════════════════════════════════════
          WHAT-IF ANALYSIS
      ══════════════════════════════════════ */}

      <section className="np-whatif">
        <div className="np-panel-header">
          <p className="np-eyebrow">SCENARIO PLANNING</p>
          <h2>What-If Analysis</h2>
          <p className="np-panel-sub">
            Test changes to frequency, aircraft and seasonal strategy against the baseline.
          </p>
        </div>

        <div className="np-whatif__grid">
          <div className="np-scenario-card np-scenario-card--baseline">
            <span className="np-scenario-label">BASELINE</span>
            <h3 className="np-scenario-route">
              {origin || "Origin"} → {destination || "Destination"}
            </h3>
            <div className="np-scenario-params">
              <div className="np-scenario-param">
                <span>Aircraft</span>
                <strong>{aircraft || "Any"}</strong>
              </div>
              <div className="np-scenario-param">
                <span>Flights / day</span>
                <strong>{flightsDay || "—"}</strong>
              </div>
              <div className="np-scenario-param">
                <span>Season</span>
                <strong>{season || "Any"}</strong>
              </div>
            </div>
          </div>

          <div className="np-scenario-card np-scenario-card--proposed">
            <span className="np-scenario-label">PROPOSED SCENARIO</span>
            <h3 className="np-scenario-route">Configure scenario</h3>
            <p className="np-scenario-hint">
              Compare a new frequency, aircraft type or seasonal strategy against the baseline.
            </p>
            <button className="np-whatif-btn" disabled>
              Run What-If
              <FontAwesomeIcon icon={faArrowRight} />
            </button>
          </div>
        </div>
      </section>

    </main>
  );
}

export default NetworkPlanner;