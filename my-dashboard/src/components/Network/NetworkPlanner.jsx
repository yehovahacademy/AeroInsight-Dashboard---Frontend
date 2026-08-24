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
  faFlask,
  faCheckCircle,
  faExclamationCircle,
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

const AIRCRAFT_TYPES = ["A320", "A321neo", "B737 MAX", "B777", "ATR 72"];

const SEASONS = [
  "Winter (Nov–Feb)",
  "Summer (Mar–Jun)",
  "Monsoon (Jul–Oct)",
];

const FLIGHTS_PER_DAY = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];

const BASE_URL = "https://aeroinsight-dashboard-backend.onrender.com";

// ─────────────────────────────────────────────────────────────
// Delta badge helper
// ─────────────────────────────────────────────────────────────

function DeltaBadge({ baseline, proposed, field, prefix = "", suffix = "" }) {
  if (!baseline || !proposed) return null;
  const bVal = baseline[field];
  const pVal = proposed[field];
  if (bVal == null || pVal == null) return null;

  const delta = pVal - bVal;
  if (delta === 0) return <span className="np-delta np-delta--neutral">No change</span>;

  const positive = delta > 0;
  return (
    <span className={`np-delta ${positive ? "np-delta--up" : "np-delta--down"}`}>
      {positive ? "▲" : "▼"} {prefix}{Math.abs(delta).toLocaleString()}{suffix}
    </span>
  );
}

// ─────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────

function NetworkPlanner() {

  // ── Baseline scenario state ────────────────────────────────
  const [origin, setOrigin]           = useState("");
  const [destination, setDestination] = useState("");
  const [aircraft, setAircraft]       = useState("");
  const [season, setSeason]           = useState("");
  const [flightsDay, setFlightsDay]   = useState("");

  const [selectedRoute, setSelectedRoute] = useState(null);
  const [routeData, setRouteData]         = useState(null);
  const [loading, setLoading]             = useState(false);
  const [error, setError]                 = useState(null);

  // ── Airport + Routes state ─────────────────────────────────
  const [airports, setAirports]               = useState([]);
  const [airportsLoading, setAirportsLoading] = useState(true);
  const [routes, setRoutes]                   = useState([]);

  // ── What-If scenario state ─────────────────────────────────
  const [whatIfAircraft, setWhatIfAircraft]     = useState("");
  const [whatIfFlightsDay, setWhatIfFlightsDay] = useState("");
  const [whatIfSeason, setWhatIfSeason]         = useState("");
  const [whatIfResult, setWhatIfResult]         = useState(null);
  const [whatIfLoading, setWhatIfLoading]       = useState(false);
  const [whatIfError, setWhatIfError]           = useState(null);

  // What-If is "configured" when at least one param differs from baseline
  const whatIfConfigured =
    (whatIfAircraft && whatIfAircraft !== aircraft) ||
    (whatIfFlightsDay && whatIfFlightsDay !== flightsDay) ||
    (whatIfSeason && whatIfSeason !== season);

  const analysisRef = useRef(null);
  const whatIfRef   = useRef(null);

  // ── Fetch airports + routes in parallel ───────────────────
  useEffect(() => {
    const airportsReq = fetch(`${BASE_URL}/airports/api/airports/`)
      .then((res) => res.json())
      .then((data) => {
        const list = Array.isArray(data)          ? data
                   : Array.isArray(data.results)  ? data.results
                   : Array.isArray(data.airports) ? data.airports
                   : [];
        setAirports(list);
      });

    const routesReq = fetch(`${BASE_URL}/routes/api/routes/`)
      .then((res) => res.json())
      .then((data) => {
        // backend returns { count, routes: [...] }
        const list = Array.isArray(data)         ? data
                   : Array.isArray(data.routes)  ? data.routes
                   : Array.isArray(data.results) ? data.results
                   : [];
        setRoutes(list);
      });

    Promise.allSettled([airportsReq, routesReq]).finally(() => {
      setAirportsLoading(false);
    });
  }, []);

  // ── Seed What-If fields from baseline when baseline changes ─
  useEffect(() => {
    setWhatIfAircraft(aircraft);
    setWhatIfFlightsDay(flightsDay);
    setWhatIfSeason(season);
    setWhatIfResult(null);
    setWhatIfError(null);
  }, [aircraft, flightsDay, season]);

  // ── Derived — filter dropdowns from routes data ────────────

  // Origins: every unique origin_iata that has at least one route
  const validOriginCodes = [...new Set(routes.map((r) => r.origin_iata))];

  // Destinations: only iata codes reachable from the selected origin
  const validDestinationCodes = origin
    ? routes
        .filter((r) => r.origin_iata === origin)
        .map((r) => r.destination_iata)
    : [...new Set(routes.map((r) => r.destination_iata))];

  // Filter the full airports list down to only valid options
  const originOptions = airports.filter((a) =>
    validOriginCodes.includes(a.iata)
  );

  const destinationOptions = airports.filter((a) =>
    validDestinationCodes.includes(a.iata)
  );

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

  const handleOriginChange = (e) => {
    setOrigin(e.target.value);
    // Clear destination if it's no longer reachable from new origin
    setDestination("");
    setRouteData(null);
    setWhatIfResult(null);
  };

  const handleSwap = () => {
    // Only swap if the reverse route exists
    const reverseExists = routes.some(
      (r) => r.origin_iata === destination && r.destination_iata === origin
    );
    if (reverseExists) {
      setOrigin(destination);
      setDestination(origin);
    } else {
      setOrigin(destination);
      setDestination("");
    }
    setRouteData(null);
    setWhatIfResult(null);
  };

  const handleAnalyze = async () => {
    if (!formReady) return;
    setLoading(true);
    setError(null);
    setRouteData(null);
    setWhatIfResult(null);

    try {
      const res = await fetch(`${BASE_URL}/routes/${origin}/${destination}`);
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const data = await res.json();
      setRouteData(data);

      setTimeout(() => {
        analysisRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    } catch (err) {
      setError(err.message || "Failed to fetch route analysis.");
    } finally {
      setLoading(false);
    }
  };

  const handleWhatIf = async () => {
    if (!formReady || !routeData) return;
    setWhatIfLoading(true);
    setWhatIfError(null);
    setWhatIfResult(null);

    try {
      const res = await fetch(`${BASE_URL}/routes/${origin}/${destination}`);
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const data = await res.json();
      setWhatIfResult(data);

      setTimeout(() => {
        whatIfRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    } catch (err) {
      setWhatIfError(err.message || "Failed to run What-If scenario.");
    } finally {
      setWhatIfLoading(false);
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
            <strong>{airportsLoading ? "—" : validOriginCodes.length}</strong>
          </div>
          <div className="np-meta-divider" />
          <div className="np-meta-item">
            <span>ROUTES</span>
            <strong>{airportsLoading ? "—" : routes.length}</strong>
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
          <div className="np-kpi__icon"><FontAwesomeIcon icon={faRoute} /></div>
          <div className="np-kpi__body">
            <span>ACTIVE ROUTES</span>
            <strong>{airportsLoading ? "—" : routes.length}</strong>
            <small>In planning dataset</small>
          </div>
        </div>
        <div className="np-kpi">
          <div className="np-kpi__icon"><FontAwesomeIcon icon={faPlane} /></div>
          <div className="np-kpi__body">
            <span>DAILY FLIGHTS</span>
            <strong>—</strong>
            <small>DGCA data pending</small>
          </div>
        </div>
        <div className="np-kpi">
          <div className="np-kpi__icon"><FontAwesomeIcon icon={faChartBar} /></div>
          <div className="np-kpi__body">
            <span>LOAD FACTOR</span>
            <strong>—</strong>
            <small>Verified data pending</small>
          </div>
        </div>
        <div className="np-kpi">
          <div className="np-kpi__icon"><FontAwesomeIcon icon={faLightbulb} /></div>
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
                  onChange={handleOriginChange}
                  disabled={airportsLoading}
                  className={origin ? "np-select--active" : ""}
                >
                  <option value="">
                    {airportsLoading ? "Loading airports…" : "Select origin"}
                  </option>
                  {originOptions.map((a) => (
                    <option key={a.iata} value={a.iata}>
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
                  onChange={(e) => {
                    setDestination(e.target.value);
                    setRouteData(null);
                    setWhatIfResult(null);
                  }}
                  disabled={airportsLoading || !origin}
                  className={destination ? "np-select--active" : ""}
                >
                  <option value="">
                    {!origin
                      ? "Select origin first"
                      : airportsLoading
                      ? "Loading airports…"
                      : "Select destination"}
                  </option>
                  {destinationOptions.map((a) => (
                    <option key={a.iata} value={a.iata}>
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
                <select value={aircraft} onChange={(e) => setAircraft(e.target.value)}>
                  <option value="">Any aircraft</option>
                  {AIRCRAFT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="np-field">
                <label>SEASON</label>
                <select value={season} onChange={(e) => setSeason(e.target.value)}>
                  <option value="">Any season</option>
                  {SEASONS.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="np-field">
                <label>FLIGHTS / DAY</label>
                <select value={flightsDay} onChange={(e) => setFlightsDay(e.target.value)}>
                  <option value="">Not specified</option>
                  {FLIGHTS_PER_DAY.map((v) => <option key={v} value={v}>{v}</option>)}
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
                <><FontAwesomeIcon icon={faCircleNotch} spin /> Analysing…</>
              ) : (
                <>Run Analysis <FontAwesomeIcon icon={faArrowRight} /></>
              )}
            </button>

            {error && (
              <div className="np-error">
                <FontAwesomeIcon icon={faTriangleExclamation} /> {error}
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
                  <Popup><strong>{selectedOrigin.iata}</strong><br />{selectedOrigin.city}</Popup>
                </Marker>
              )}
              {selectedDestination && (
                <Marker position={[selectedDestination.latitude, selectedDestination.longitude]}>
                  <Popup><strong>{selectedDestination.iata}</strong><br />{selectedDestination.city}</Popup>
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
            {routeData ? `${origin} → ${destination}` : "Route Analysis"}
          </h2>
          <p className="np-panel-sub">
            {routeData
              ? `Demand, profitability and opportunity analysis for ${selectedOrigin?.city ?? origin} to ${selectedDestination?.city ?? destination}.`
              : "Select a route above and run the analysis to see route intelligence."}
          </p>
        </div>

        {!routeData && !loading && !error && (
          <div className="np-empty">
            <div className="np-empty__icon"><FontAwesomeIcon icon={faChartBar} /></div>
            <strong>No route analysed yet</strong>
            <p>Configure a scenario above to begin.</p>
          </div>
        )}

        {loading && (
          <div className="np-empty">
            <div className="np-empty__spinner"><FontAwesomeIcon icon={faCircleNotch} spin /></div>
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
      <section className="np-whatif" ref={whatIfRef}>
        <div className="np-panel-header">
          <p className="np-eyebrow">SCENARIO PLANNING</p>
          <h2>What-If Analysis</h2>
          <p className="np-panel-sub">
            {routeData
              ? "Adjust parameters below to test a proposed scenario against the baseline."
              : "Run a route analysis first to unlock What-If scenario planning."}
          </p>
        </div>

        <div className="np-whatif__grid">

          {/* ── BASELINE card ─────────────────────────── */}
          <div className="np-scenario-card np-scenario-card--baseline">
            <span className="np-scenario-label">BASELINE</span>
            <h3 className="np-scenario-route">
              {origin && destination
                ? `${origin} → ${destination}`
                : "No baseline yet"}
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

            {routeData && (
              <div className="np-scenario-metrics">
                {routeData.distance_km != null && (
                  <div className="np-scenario-metric">
                    <span>Distance</span>
                    <strong>{routeData.distance_km.toLocaleString()} km</strong>
                  </div>
                )}
                {routeData.region != null && (
                  <div className="np-scenario-metric">
                    <span>Region</span>
                    <strong>{routeData.region}</strong>
                  </div>
                )}
                {routeData.estimated_revenue != null && (
                  <div className="np-scenario-metric">
                    <span>Est. Revenue</span>
                    <strong>₹{routeData.estimated_revenue.toLocaleString()}</strong>
                  </div>
                )}
                {routeData.load_factor != null && (
                  <div className="np-scenario-metric">
                    <span>Load Factor</span>
                    <strong>{routeData.load_factor}%</strong>
                  </div>
                )}
                {routeData.profitability_score != null && (
                  <div className="np-scenario-metric">
                    <span>Profitability Score</span>
                    <strong>{routeData.profitability_score}</strong>
                  </div>
                )}
              </div>
            )}

            {!routeData && (
              <p className="np-scenario-hint">
                Run a route analysis above to populate the baseline.
              </p>
            )}
          </div>

          {/* ── PROPOSED SCENARIO card ────────────────── */}
          <div className={`np-scenario-card np-scenario-card--proposed${!routeData ? " np-scenario-card--locked" : ""}`}>
            <span className="np-scenario-label">PROPOSED SCENARIO</span>
            <h3 className="np-scenario-route">
              {origin && destination
                ? `${origin} → ${destination}`
                : "Configure baseline first"}
            </h3>

            {!routeData ? (
              <p className="np-scenario-hint">
                Run a baseline analysis first to enable scenario comparison.
              </p>
            ) : (
              <>
                <div className="np-whatif__params">
                  <div className="np-field">
                    <label>AIRCRAFT</label>
                    <select
                      value={whatIfAircraft}
                      onChange={(e) => setWhatIfAircraft(e.target.value)}
                    >
                      <option value="">Any aircraft</option>
                      {AIRCRAFT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div className="np-field">
                    <label>SEASON</label>
                    <select
                      value={whatIfSeason}
                      onChange={(e) => setWhatIfSeason(e.target.value)}
                    >
                      <option value="">Any season</option>
                      {SEASONS.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className="np-field">
                    <label>FLIGHTS / DAY</label>
                    <select
                      value={whatIfFlightsDay}
                      onChange={(e) => setWhatIfFlightsDay(e.target.value)}
                    >
                      <option value="">Not specified</option>
                      {FLIGHTS_PER_DAY.map((v) => <option key={v} value={v}>{v}</option>)}
                    </select>
                  </div>
                </div>

                {whatIfConfigured && (
                  <div className="np-whatif__changes">
                    <p className="np-whatif__changes-label">Changes vs baseline:</p>
                    <ul>
                      {whatIfAircraft !== aircraft && (
                        <li>Aircraft: <s>{aircraft || "Any"}</s> → <strong>{whatIfAircraft || "Any"}</strong></li>
                      )}
                      {whatIfSeason !== season && (
                        <li>Season: <s>{season || "Any"}</s> → <strong>{whatIfSeason || "Any"}</strong></li>
                      )}
                      {whatIfFlightsDay !== flightsDay && (
                        <li>Flights/day: <s>{flightsDay || "—"}</s> → <strong>{whatIfFlightsDay || "—"}</strong></li>
                      )}
                    </ul>
                  </div>
                )}

                <button
                  className="np-whatif-btn"
                  onClick={handleWhatIf}
                  disabled={!whatIfConfigured || whatIfLoading}
                >
                  {whatIfLoading ? (
                    <><FontAwesomeIcon icon={faCircleNotch} spin /> Running…</>
                  ) : (
                    <><FontAwesomeIcon icon={faFlask} /> Run What-If <FontAwesomeIcon icon={faArrowRight} /></>
                  )}
                </button>

                {!whatIfConfigured && !whatIfLoading && (
                  <p className="np-scenario-hint" style={{ marginTop: "0.75rem" }}>
                    Change at least one parameter above to enable the comparison.
                  </p>
                )}

                {whatIfError && (
                  <div className="np-error" style={{ marginTop: "0.75rem" }}>
                    <FontAwesomeIcon icon={faTriangleExclamation} /> {whatIfError}
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* ── DELTA RESULTS ─────────────────────────── */}
        {whatIfResult && routeData && (
          <div className="np-whatif__delta">
            <div className="np-panel-header" style={{ marginBottom: "1.5rem" }}>
              <p className="np-eyebrow">SCENARIO COMPARISON</p>
              <h2>Baseline vs Proposed</h2>
              <p className="np-panel-sub">
                How the proposed scenario performs against the baseline for {origin} → {destination}.
              </p>
            </div>

            <div className="np-delta-grid">
              {(routeData.distance_km != null || whatIfResult.distance_km != null) && (
                <div className="np-delta-card">
                  <span className="np-delta-label">Distance</span>
                  <div className="np-delta-values">
                    <div className="np-delta-col">
                      <span>Baseline</span>
                      <strong>{(routeData.distance_km ?? 0).toLocaleString()} km</strong>
                    </div>
                    <div className="np-delta-arrow">→</div>
                    <div className="np-delta-col">
                      <span>Proposed</span>
                      <strong>{(whatIfResult.distance_km ?? 0).toLocaleString()} km</strong>
                    </div>
                  </div>
                  <DeltaBadge baseline={routeData} proposed={whatIfResult} field="distance_km" suffix=" km" />
                </div>
              )}

              {(routeData.estimated_revenue != null || whatIfResult.estimated_revenue != null) && (
                <div className="np-delta-card">
                  <span className="np-delta-label">Est. Revenue</span>
                  <div className="np-delta-values">
                    <div className="np-delta-col">
                      <span>Baseline</span>
                      <strong>₹{(routeData.estimated_revenue ?? 0).toLocaleString()}</strong>
                    </div>
                    <div className="np-delta-arrow">→</div>
                    <div className="np-delta-col">
                      <span>Proposed</span>
                      <strong>₹{(whatIfResult.estimated_revenue ?? 0).toLocaleString()}</strong>
                    </div>
                  </div>
                  <DeltaBadge baseline={routeData} proposed={whatIfResult} field="estimated_revenue" prefix="₹" />
                </div>
              )}

              {(routeData.load_factor != null || whatIfResult.load_factor != null) && (
                <div className="np-delta-card">
                  <span className="np-delta-label">Load Factor</span>
                  <div className="np-delta-values">
                    <div className="np-delta-col">
                      <span>Baseline</span>
                      <strong>{routeData.load_factor ?? "—"}%</strong>
                    </div>
                    <div className="np-delta-arrow">→</div>
                    <div className="np-delta-col">
                      <span>Proposed</span>
                      <strong>{whatIfResult.load_factor ?? "—"}%</strong>
                    </div>
                  </div>
                  <DeltaBadge baseline={routeData} proposed={whatIfResult} field="load_factor" suffix="%" />
                </div>
              )}

              {(routeData.profitability_score != null || whatIfResult.profitability_score != null) && (
                <div className="np-delta-card">
                  <span className="np-delta-label">Profitability Score</span>
                  <div className="np-delta-values">
                    <div className="np-delta-col">
                      <span>Baseline</span>
                      <strong>{routeData.profitability_score ?? "—"}</strong>
                    </div>
                    <div className="np-delta-arrow">→</div>
                    <div className="np-delta-col">
                      <span>Proposed</span>
                      <strong>{whatIfResult.profitability_score ?? "—"}</strong>
                    </div>
                  </div>
                  <DeltaBadge baseline={routeData} proposed={whatIfResult} field="profitability_score" />
                </div>
              )}
            </div>

            <div className="np-whatif__cards-header">
              <FontAwesomeIcon icon={faFlask} />
              <span>Proposed scenario — full intelligence</span>
            </div>
            <div className="np-analysis-output">
              <RouteCards
                data={whatIfResult}
                selectedRoute={null}
                setSelectedRoute={() => {}}
              />
            </div>
          </div>
        )}
      </section>

    </main>
  );
}

export default NetworkPlanner;