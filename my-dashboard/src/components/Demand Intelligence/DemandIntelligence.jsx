import { useEffect, useRef, useState } from "react";
import "./DemandIntelligence.css";

/* ═══════════════════════════════════════════════════════════════
   Constants
   ═══════════════════════════════════════════════════════════════ */
const BASE_URL = "https://aeroinsight-dashboard-backend.onrender.com";

const DAYS_OPTIONS = ["7","12","14","21","30","35"];

/* Popular routes as quick-pick pairs — fallback if airports haven't
   loaded yet, or the user just wants a one-click start. */
const QUICK_ROUTES = [
    { label: "DEL → DXB", origin: "DEL", dest: "DXB" },
    { label: "BOM → LHR", origin: "BOM", dest: "LHR" },
    { label: "BLR → SIN", origin: "BLR", dest: "SIN" },
    { label: "DEL → JFK", origin: "DEL", dest: "JFK" },
];

/* ═══════════════════════════════════════════════════════════════
   Sub-components — visual building blocks
   ═══════════════════════════════════════════════════════════════ */

function TrendIcon({ trend }) {
    if (trend === "INCREASING")
        return <span className="di-trend-icon di-trend-up">↗</span>;
    if (trend === "DECREASING")
        return <span className="di-trend-icon di-trend-down">↘</span>;
    return <span className="di-trend-icon di-trend-flat">→</span>;
}

function RunwayBar({ score, level }) {
    const fillRef = useRef(null);

    useEffect(() => {
        const el = fillRef.current;
        if (!el) return;
        // Double-rAF ensures the transition fires after the element paints
        requestAnimationFrame(() =>
            requestAnimationFrame(() => {
                el.style.height = `${score}%`;
            })
        );
    }, [score]);

    const levelClass =
        level === "HIGH"   ? "di-level-high"
        : level === "MEDIUM" ? "di-level-medium"
        : "di-level-low";

    return (
        <div className={`di-runway-track ${levelClass}`}>
            <div className="di-runway-fill" ref={fillRef} />
        </div>
    );
}

function ForecastDay({ day }) {
    const levelClass =
        day.demand_level === "HIGH"   ? "di-level-high"
        : day.demand_level === "MEDIUM" ? "di-level-medium"
        : "di-level-low";

    return (
        <div className="di-forecast-day">
            <span className="di-day-name">{day.day.slice(0, 3).toUpperCase()}</span>
            <RunwayBar score={day.demand_score} level={day.demand_level} />
            <span className="di-day-score">{day.demand_score}</span>
            <span className={`di-day-level ${levelClass}`}>{day.demand_level}</span>
            <small className="di-day-load">LF {day.estimated_load_factor}%</small>
        </div>
    );
}

/* Route Analysis result card */
function RouteAnalysisResult({ data }) {
    if (!data) return null;

    /* Normalise — backend shape may vary; fall back gracefully */
    const summary     = data.route_summary     ?? data.summary     ?? {};
    const demand      = data.demand_analysis   ?? data.demand      ?? {};
    const financials  = data.financial_analysis ?? data.financials  ?? {};
    const competition = data.competition_analysis ?? data.competition ?? {};
    const rec         = data.recommendation    ?? data.ai_recommendation ?? "";

    /* Viability score — try several known keys */
    const viability =
        data.viability_score ??
        summary.viability_score ??
        demand.viability_score ??
        null;

    const viabilityColor =
        viability >= 70 ? "var(--di-low)"
        : viability >= 40 ? "var(--di-medium)"
        : "var(--di-down)";

    return (
        <div className="di-ra-panel">
            <div className="di-ra-header">
                <div>
                    <span className="di-eyebrow">ROUTE ANALYSIS</span>
                    <h3 className="di-ra-title">
                        {summary.origin ?? data.origin ?? "—"} → {summary.destination ?? data.destination ?? "—"}
                    </h3>
                </div>

                {viability !== null && (
                    <div className="di-viability-badge" style={{ borderColor: viabilityColor }}>
                        <span className="di-viability-label">Viability</span>
                        <span className="di-viability-score" style={{ color: viabilityColor }}>
                            {viability}
                            <small>/100</small>
                        </span>
                    </div>
                )}
            </div>

            {/* Metric grid */}
            <div className="di-ra-grid">

                {summary.distance_km && (
                    <div className="di-ra-card">
                        <span className="di-ra-card-label">Distance</span>
                        <strong className="di-ra-card-value">
                            {Number(summary.distance_km).toLocaleString()}
                            <small> km</small>
                        </strong>
                    </div>
                )}

                {summary.flight_duration_hours && (
                    <div className="di-ra-card">
                        <span className="di-ra-card-label">Flight Time</span>
                        <strong className="di-ra-card-value">
                            {summary.flight_duration_hours}
                            <small> hrs</small>
                        </strong>
                    </div>
                )}

                {(demand.demand_score ?? demand.score) && (
                    <div className="di-ra-card">
                        <span className="di-ra-card-label">Demand Score</span>
                        <strong className="di-ra-card-value">
                            {demand.demand_score ?? demand.score}
                        </strong>
                    </div>
                )}

                {(financials.estimated_revenue_usd ?? financials.revenue) && (
                    <div className="di-ra-card">
                        <span className="di-ra-card-label">Est. Revenue</span>
                        <strong className="di-ra-card-value">
                            ${Number(
                                financials.estimated_revenue_usd ?? financials.revenue
                            ).toLocaleString()}
                        </strong>
                    </div>
                )}

                {(financials.load_factor_pct ?? financials.load_factor) && (
                    <div className="di-ra-card">
                        <span className="di-ra-card-label">Load Factor</span>
                        <strong className="di-ra-card-value">
                            {financials.load_factor_pct ?? financials.load_factor}
                            <small>%</small>
                        </strong>
                    </div>
                )}

                {(competition.competitor_count ?? competition.competitors) && (
                    <div className="di-ra-card">
                        <span className="di-ra-card-label">Competitors</span>
                        <strong className="di-ra-card-value">
                            {competition.competitor_count ?? competition.competitors}
                        </strong>
                    </div>
                )}

            </div>

            {/* AI recommendation */}
            {rec && (
                <div className="di-ra-recommendation">
                    <span className="di-rec-eyebrow">AI RECOMMENDATION</span>
                    <p className="di-rec-text">{rec}</p>
                </div>
            )}
        </div>
    );
}

/* Skeleton rows */
function SkeletonState({ title = "Demand Intelligence", label = "Loading…" }) {
    return (
        <section className="di-section">
            <div className="di-header">
                <div>
                    <span className="di-eyebrow">NETWORK ANALYTICS</span>
                    <h2 className="di-title">{title}</h2>
                </div>
            </div>
            <div className="di-skeleton-grid">
                {[...Array(4)].map((_, i) => <div key={i} className="di-skeleton-card" />)}
            </div>
            <p className="di-skeleton-label">{label}</p>
        </section>
    );
}

function ErrorBox({ error }) {
    return (
        <div className="di-error-box">
            <span className="di-error-icon">⚠</span>
            <p>{error}</p>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════════════
   Main component
   ═══════════════════════════════════════════════════════════════ */

function DemandIntelligence() {

    /* ── Route search state ─── */
    const [origin,      setOrigin     ] = useState("DEL");
    const [destination, setDestination] = useState("DXB");
    const [days,        setDays       ] = useState("7");

    /* ── Airports dropdown ─── */
    const [airports,        setAirports       ] = useState([]);
    const [airportsLoading, setAirportsLoading] = useState(true);

    /* ── Demand forecast state ─── */
    const [demandForecast, setDemandForecast] = useState(null);
    const [demandLoading,  setDemandLoading ] = useState(false);
    const [demandError,    setDemandError   ] = useState(null);

    /* ── Route analysis state ─── */
    const [routeData,    setRouteData   ] = useState(null);
    const [routeLoading, setRouteLoading] = useState(false);
    const [routeError,   setRouteError  ] = useState(null);

    /* ── Load airports on mount ─── */
    useEffect(() => {
        const CODES = [
            "BOM","DEL","BLR","MAA","CCU","HYD","GOI","PNQ","AMD","JAI",
            "COK","TRV","LKO","SXR","IXE","VTZ","ATQ","JDH","UDR",
            "DXB","AUH","DOH","KWI","BAH","MCT","RUH","JED","AMM",
            "LHR","CDG","AMS","FRA","IST","MAD","BCN","FCO","MUC","ZRH",
            "SIN","BKK","KUL","CGK","MNL","HKG","ICN","NRT","PVG","PEK",
            "SYD","MEL","JFK","LAX","ORD","MIA","SFO","YYZ","GRU",
            "JNB","NBO","CAI","ADD",
        ];

        Promise.all(
            CODES.map(code =>
                fetch(`${BASE_URL}/airports/api/airports/search/${code}`)
                    .then(r => r.ok ? r.json() : [])
                    .then(results => results.find(a => a.iata === code) ?? null)
                    .catch(() => null)
            )
        ).then(results => {
            const valid = results
                .filter(Boolean)
                .sort((a, b) => a.city.localeCompare(b.city));
            setAirports(valid);
            setAirportsLoading(false);
        });
    }, []);

    /* ── Fetch demand forecast ─── */
    const fetchDemand = (orig, dest, d) => {
        if (!orig || !dest || orig === dest) return;

        setDemandLoading(true);
        setDemandError(null);
        setDemandForecast(null);

        fetch(`${BASE_URL}/demand-forecast/demand/forecast/${orig}/${dest}?days=${d}`)
            .then(r => { if (!r.ok) throw new Error(`${r.status}`); return r.json(); })
            .then(data => setDemandForecast(data))
            .catch(err => setDemandError("Could not load demand forecast. " + err.message))
            .finally(() => setDemandLoading(false));
    };

    /* ── Fetch route analysis ─── */
    const fetchRoute = (orig, dest) => {
        if (!orig || !dest || orig === dest) return;

        setRouteLoading(true);
        setRouteError(null);
        setRouteData(null);

        fetch(`${BASE_URL}/api/network/analyze_route`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ origin: orig, destination: dest }),
        })
            .then(r => { if (!r.ok) throw new Error(`${r.status}`); return r.json(); })
            .then(data => setRouteData(data))
            .catch(err => setRouteError("Route analysis failed. " + err.message))
            .finally(() => setRouteLoading(false));
    };

    /* ── Auto-fetch on mount with defaults ─── */
    useEffect(() => {
        fetchDemand(origin, destination, days);
        fetchRoute(origin, destination);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    /* ── Handle Analyse click ─── */
    const handleAnalyse = () => {
        fetchDemand(origin, destination, days);
        fetchRoute(origin, destination);
    };

    /* ── Quick route pick ─── */
    const handleQuickRoute = ({ origin: o, dest: d }) => {
        setOrigin(o);
        setDestination(d);
        fetchDemand(o, d, days);
        fetchRoute(o, d);
    };

    const formReady = origin && destination && origin !== destination;

    /* ── Destructure forecast for rendering ─── */
    const {
        route,
        average_demand_score,
        demand_level,
        average_load_factor,
        trend,
        peak_day,
        recommendation,
        forecast,
    } = demandForecast ?? {};

    return (
        <section className="di-section">

            {/* ════════════════════════════════════════════════════
                Header
            ════════════════════════════════════════════════════ */}
            <div className="di-header">
                <div>
                    <span className="di-eyebrow">NETWORK ANALYTICS</span>
                    <h2 className="di-title">Demand Intelligence</h2>
                    <p className="di-subtitle">Demand forecast &amp; route analysis</p>
                </div>

                {route && (
                    <div className="di-route-badge">
                        <span className="di-route-label">ROUTE</span>
                        <span className="di-route-code">{route}</span>
                    </div>
                )}
            </div>

            {/* ════════════════════════════════════════════════════
                Route Search Bar
            ════════════════════════════════════════════════════ */}
            <div className="di-search-panel">

                <div className="di-search-row">

                    {/* Origin */}
                    <div className="di-input-group">
                        <label className="di-input-label">Origin</label>
                        <select
                            className="di-select"
                            value={origin}
                            onChange={e => setOrigin(e.target.value)}
                            disabled={airportsLoading}
                        >
                            <option value="">
                                {airportsLoading ? "Loading…" : "Select origin"}
                            </option>
                            {airports.map(a => (
                                <option key={a.iata} value={a.iata} disabled={a.iata === destination}>
                                    {a.city} ({a.iata})
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Swap */}
                    <button
                        className="di-swap-btn"
                        aria-label="Swap origin and destination"
                        onClick={() => { setOrigin(destination); setDestination(origin); }}
                    >
                        ⇄
                    </button>

                    {/* Destination */}
                    <div className="di-input-group">
                        <label className="di-input-label">Destination</label>
                        <select
                            className="di-select"
                            value={destination}
                            onChange={e => setDestination(e.target.value)}
                            disabled={airportsLoading}
                        >
                            <option value="">
                                {airportsLoading ? "Loading…" : "Select destination"}
                            </option>
                            {airports.map(a => (
                                <option key={a.iata} value={a.iata} disabled={a.iata === origin}>
                                    {a.city} ({a.iata})
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Days */}
                    <div className="di-input-group di-input-group--narrow">
                        <label className="di-input-label">Days</label>
                        <select
                            className="di-select"
                            value={days}
                            onChange={e => setDays(e.target.value)}
                        >
                            {DAYS_OPTIONS.map(d => (
                                <option key={d} value={d}>{d} days</option>
                            ))}
                        </select>
                    </div>

                    {/* Analyse */}
                    <button
                        className="di-analyse-btn"
                        onClick={handleAnalyse}
                        disabled={!formReady || demandLoading || routeLoading}
                    >
                        {(demandLoading || routeLoading) ? "Analysing…" : "Analyse Route"}
                    </button>

                </div>

                {/* Quick routes */}
                <div className="di-quick-routes">
                    <span className="di-quick-label">Quick:</span>
                    {QUICK_ROUTES.map(qr => (
                        <button
                            key={qr.label}
                            className={`di-quick-btn ${
                                origin === qr.origin && destination === qr.dest
                                    ? "di-quick-btn--active"
                                    : ""
                            }`}
                            onClick={() => handleQuickRoute(qr)}
                        >
                            {qr.label}
                        </button>
                    ))}
                </div>

            </div>

            {/* ════════════════════════════════════════════════════
                Demand Forecast
            ════════════════════════════════════════════════════ */}

            {demandLoading && (
                <>
                    <div className="di-skeleton-grid">
                        {[...Array(4)].map((_, i) => <div key={i} className="di-skeleton-card" />)}
                    </div>
                    <p className="di-skeleton-label">Analysing demand…</p>
                </>
            )}

            {demandError && <ErrorBox error={demandError} />}

            {demandForecast && !demandLoading && (
                <>
                    {/* KPI Strip */}
                    <div className="di-kpi-strip">

                        <div className="di-kpi-card">
                            <span className="di-kpi-label">Avg. Demand Score</span>
                            <strong className="di-kpi-value">{average_demand_score}</strong>
                            <span className={`di-kpi-badge ${
                                demand_level === "HIGH"   ? "di-level-high"
                                : demand_level === "MEDIUM" ? "di-level-medium"
                                : "di-level-low"
                            }`}>
                                {demand_level}
                            </span>
                        </div>

                        <div className="di-kpi-card">
                            <span className="di-kpi-label">Expected Load Factor</span>
                            <strong className="di-kpi-value">{average_load_factor}%</strong>
                            <span className="di-kpi-badge di-badge-neutral">Estimated</span>
                        </div>

                        <div className="di-kpi-card">
                            <span className="di-kpi-label">Demand Trend</span>
                            <TrendIcon trend={trend} />
                            <span className="di-kpi-badge di-badge-neutral">{trend}</span>
                        </div>

                        <div className="di-kpi-card">
                            <span className="di-kpi-label">Peak Day</span>
                            <strong className="di-kpi-value di-kpi-day">{peak_day?.day}</strong>
                            <span className="di-kpi-badge di-badge-neutral">
                                Score {peak_day?.demand_score}
                            </span>
                        </div>

                    </div>

                    {/* 7-Day Forecast */}
                    <div className="di-forecast-panel">
                        <div className="di-forecast-header">
                            <h3 className="di-forecast-title">{days}-Day Demand Forecast</h3>
                            <p className="di-forecast-sub">Predicted route demand by day</p>
                        </div>
                        <div className="di-forecast-row">
                            {forecast?.map((day) => (
                                <ForecastDay key={day.date} day={day} />
                            ))}
                        </div>
                    </div>

                    {/* Capacity Recommendation */}
                    <div className="di-recommendation">
                        <div className="di-rec-left">
                            <span className="di-rec-eyebrow">CAPACITY RECOMMENDATION</span>
                            <p className="di-rec-text">{recommendation}</p>
                        </div>
                        <div className="di-route-badge di-route-badge--accent">
                            <span className="di-route-label">ROUTE</span>
                            <span className="di-route-code">{route}</span>
                        </div>
                    </div>
                </>
            )}

            {/* ════════════════════════════════════════════════════
                Route Analysis
            ════════════════════════════════════════════════════ */}

            <div className="di-divider-rule">
                <span>Route Analysis</span>
            </div>

            {routeLoading && (
                <>
                    <div className="di-skeleton-grid">
                        {[...Array(6)].map((_, i) => <div key={i} className="di-skeleton-card di-skeleton-card--sm" />)}
                    </div>
                    <p className="di-skeleton-label">Running route analysis…</p>
                </>
            )}

            {routeError && <ErrorBox error={routeError} />}

            {routeData && !routeLoading && (
                <RouteAnalysisResult data={routeData} />
            )}

            {!routeData && !routeLoading && !routeError && (
                <p className="di-empty-hint">
                    Select a route and click <strong>Analyse Route</strong> to see insights.
                </p>
            )}

        </section>
    );
}

export default DemandIntelligence;