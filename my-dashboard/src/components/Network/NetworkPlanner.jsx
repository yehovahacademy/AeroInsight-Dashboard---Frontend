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

  // ── Airport state ──────────────────────────────────────────
  const [airports, setAirports]               = useState([]);
  const [airportsLoading, setAirportsLoading] = useState(true);

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

  // ── Fetch airports ─────────────────────────────────────────
  useEffect(() => {
  const fetchAirports = async () => {
    try {
      setAirportsLoading(true);

      const res = await fetch(
        "https://aeroinsight-dashboard-backend.onrender.com/airports/api/airports/"
      );

      if (!res.ok) {
        throw new Error(`Airport API returned ${res.status}`);
      }

      const data = await res.json();

      const list = Array.isArray(data)
        ? data
        : Array.isArray(data.results)
        ? data.results
        : Array.isArray(data.airports)
        ? data.airports
        : [];

      if (!Array.isArray(list)) {
        throw new Error("Airport API did not return an array");
      }

      setAirports(list);
    } catch (err) {
      console.error("Failed to fetch airports:", err);
      setAirports([]);
    } finally {
      setAirportsLoading(false);
    }
  };

  fetchAirports();
}, []);

  // ── Seed What-If fields from baseline when baseline changes ─
  useEffect(() => {
    setWhatIfAircraft(aircraft);
    setWhatIfFlightsDay(flightsDay);
    setWhatIfSeason(season);
    setWhatIfResult(null);
    setWhatIfError(null);
  }, [aircraft, flightsDay, season]);

  // ── Derived ────────────────────────────────────────────────
  const formReady = origin && destination && origin !== destination;

  const selectedOrigin = Array.isArray(airports)
  ? airports.find((a) => a.iata === origin)
  : null;

  const selectedDestination = Array.isArray(airports)
  ? airports.find((a) => a.iata === destination)
  : null;

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
      const params = new URLSearchParams({ origin, destination });


      const res = await fetch(
        `https://aeroinsight-dashboard-backend.onrender.com/routes/${origin}/${destination}`
      );
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
    if (!formReady) return;
    setWhatIfLoading(true);
    setWhatIfError(null);
    setWhatIfResult(null);

    try {
      const params = new URLSearchParams({ origin, destination });
      if (whatIfAircraft)  params.append("aircraft_type", whatIfAircraft);
      if (whatIfSeason)    params.append("season", whatIfSeason);
      if (whatIfFlightsDay) params.append("flights_per_day", whatIfFlightsDay);

      const res = await fetch(
        `https://aeroinsight-dashboard-backend.onrender.com/network/network/what-if`
      );
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
          <div className="np-kpi__icon"><FontAwesomeIcon icon={faRoute} /></div>
          <div className="np-kpi__body">
            <span>ACTIVE AIRPORTS</span>
            <strong>{airportsLoading ? "—" : airports.length}</strong>
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
                  onChange={(e) => setOrigin(e.target.value)}
                  disabled={airportsLoading}
                  className={origin ? "np-select--active" : ""}
                >
                  <option value="">
                    {airportsLoading ? "Loading airports…" : "Select origin"}
                  </option>
                  {airports.map((a) => (
                    <option key={a.iata} value={a.iata} disabled={a.iata === destination}>
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
                    <option key={a.iata} value={a.iata} disabled={a.iata === origin}>
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

            {/* Baseline key metrics (when available) */}
            {routeData && (
              <div className="np-scenario-metrics">
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
                {/* Editable params */}
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

                {/* Change summary */}
                {whatIfConfigured && (
                  <div className="np-whatif__changes">
                    <p className="np-whatif__changes-label">Changes vs baseline:</p>
                    <ul>
                      {whatIfAircraft !== aircraft && (
                        <li>
                          Aircraft: <s>{aircraft || "Any"}</s> → <strong>{whatIfAircraft || "Any"}</strong>
                        </li>
                      )}
                      {whatIfSeason !== season && (
                        <li>
                          Season: <s>{season || "Any"}</s> → <strong>{whatIfSeason || "Any"}</strong>
                        </li>
                      )}
                      {whatIfFlightsDay !== flightsDay && (
                        <li>
                          Flights/day: <s>{flightsDay || "—"}</s> → <strong>{whatIfFlightsDay || "—"}</strong>
                        </li>
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
              {/* Revenue */}
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
                  <DeltaBadge
                    baseline={routeData}
                    proposed={whatIfResult}
                    field="estimated_revenue"
                    prefix="₹"
                  />
                </div>
              )}

              {/* Load factor */}
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
                  <DeltaBadge
                    baseline={routeData}
                    proposed={whatIfResult}
                    field="load_factor"
                    suffix="%"
                  />
                </div>
              )}

              {/* Profitability score */}
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
                  <DeltaBadge
                    baseline={routeData}
                    proposed={whatIfResult}
                    field="profitability_score"
                  />
                </div>
              )}
            </div>

            {/* Proposed RouteCards */}
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