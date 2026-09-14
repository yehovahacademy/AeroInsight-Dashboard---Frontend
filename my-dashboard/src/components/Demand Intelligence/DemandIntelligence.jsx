import { useEffect, useMemo, useState } from "react";
import "./DemandIntelligence.css";

const BASE_URL = "https://aeroinsight-dashboard-backend.onrender.com";

const QUICK_ROUTES = [
    { label: "DEL → DXB", origin: "DEL", dest: "DXB" },
    { label: "BOM → LHR", origin: "BOM", dest: "LHR" },
    { label: "BLR → SIN", origin: "BLR", dest: "SIN" },
    { label: "DEL → JFK", origin: "DEL", dest: "JFK" },
];

const MONTH_ABBR = [
    "", "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];


/* ═══════════════════════════════════════════════════════════════
   Error
   ═══════════════════════════════════════════════════════════════ */

function ErrorBox({ error }) {
    return (
        <div className="di-error-box">
            <span className="di-error-icon">⚠</span>
            <p>{error}</p>
        </div>
    );
}


/* ═══════════════════════════════════════════════════════════════
   Loading
   ═══════════════════════════════════════════════════════════════ */

function LoadingState({ label = "Loading historical traffic…" }) {
    return (
        <div className="di-history-loading">
            <div className="di-skeleton-card" />
            <div className="di-skeleton-card" style={{ opacity: 0.6 }} />
            <p>{label}</p>
        </div>
    );
}


/* ═══════════════════════════════════════════════════════════════
   Syntax-highlighted JSON viewer
   ═══════════════════════════════════════════════════════════════ */

function JsonViewer({ data }) {
    const raw = JSON.stringify(data, null, 2);

    const highlighted = raw.replace(
        /("(\\u[\da-fA-F]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(\.\d+)?([eE][+-]?\d+)?)/g,
        (match) => {
            if (/^"/.test(match)) {
                if (/:$/.test(match)) {
                    return `<span class="di-json-key">${match}</span>`;
                }
                return `<span class="di-json-string">${match}</span>`;
            }
            if (/true|false/.test(match)) {
                return `<span class="di-json-bool">${match}</span>`;
            }
            if (/null/.test(match)) {
                return `<span class="di-json-null">${match}</span>`;
            }
            return `<span class="di-json-num">${match}</span>`;
        }
    );

    return (
        <pre
            className="di-ra-json"
            dangerouslySetInnerHTML={{ __html: highlighted }}
        />
    );
}


/* ═══════════════════════════════════════════════════════════════
   Historical Traffic Chart
   ═══════════════════════════════════════════════════════════════ */

function TrafficChart({ data, selectedYear }) {

    if (!data.length) {
        return (
            <div className="di-empty-hint">
                No historical traffic data available for this route.
            </div>
        );
    }

    const width         = 900;
    const height        = 320;
    const paddingLeft   = 75;
    const paddingRight  = 24;
    const paddingTop    = 24;
    const paddingBottom = 50;
    const chartWidth    = width - paddingLeft - paddingRight;
    const chartHeight   = height - paddingTop - paddingBottom;

    const maxPassengers = Math.max(
        ...data.map(item => Number(item.passengers) || 0),
        1
    );

    const points = data.map((item, index) => {
        const x = paddingLeft + (index / Math.max(data.length - 1, 1)) * chartWidth;
        const y = paddingTop + chartHeight - ((Number(item.passengers) || 0) / maxPassengers) * chartHeight;
        return { ...item, x, y };
    });

    const linePath = points
        .map((pt, i) => `${i === 0 ? "M" : "L"} ${pt.x} ${pt.y}`)
        .join(" ");

    const first = points[0];
    const last  = points[points.length - 1];
    const fillPath = `${linePath} L ${last.x} ${paddingTop + chartHeight} L ${first.x} ${paddingTop + chartHeight} Z`;

    const yTicks = [0, 0.25, 0.5, 0.75, 1].map(t => ({
        value: maxPassengers * (1 - t),
        y:     paddingTop + t * chartHeight,
    }));

    return (
        <div className="di-history-chart">

            <div className="di-history-chart-header">
                <div>
                    <span className="di-eyebrow">Traffic Timeline</span>
                    <h3 className="di-history-chart-title">Monthly Passenger Traffic</h3>
                </div>
                <span className="di-history-year-badge">{selectedYear}</span>
            </div>

            <div className="di-chart-wrapper">
                <svg
                    viewBox={`0 0 ${width} ${height}`}
                    className="di-traffic-svg"
                    preserveAspectRatio="none"
                >
                    <defs>
                        <linearGradient id="trafficGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%"   stopColor="#00C8FF" stopOpacity="0.22" />
                            <stop offset="100%" stopColor="#00C8FF" stopOpacity="0" />
                        </linearGradient>
                    </defs>

                    {/* Grid lines */}
                    {yTicks.map((tick, i) => (
                        <g key={i}>
                            <line
                                x1={paddingLeft} x2={width - paddingRight}
                                y1={tick.y}      y2={tick.y}
                                className="di-chart-grid"
                            />
                            <text
                                x={paddingLeft - 10}
                                y={tick.y + 4}
                                textAnchor="end"
                                className="di-chart-label"
                            >
                                {Math.round(tick.value).toLocaleString()}
                            </text>
                        </g>
                    ))}

                    {/* Gradient fill */}
                    <path d={fillPath} fill="url(#trafficGrad)" />

                    {/* Traffic line */}
                    <path d={linePath} className="di-traffic-line" fill="none" />

                    {/* Points + month labels */}
                    {points.map(pt => {
                        const monthNum = Number(pt.month);
                        const label    = MONTH_ABBR[monthNum] ?? pt.month;
                        const isActive = Number(pt.year) === selectedYear;
                        return (
                            <g key={pt.month}>
                                <circle
                                    cx={pt.x} cy={pt.y}
                                    r={isActive ? 6 : 4}
                                    className={
                                        isActive
                                            ? "di-traffic-point di-traffic-point-active"
                                            : "di-traffic-point"
                                    }
                                />
                                <text
                                    x={pt.x}
                                    y={height - 16}
                                    textAnchor="middle"
                                    className="di-chart-label"
                                >
                                    {label}
                                </text>
                            </g>
                        );
                    })}

                </svg>
            </div>

            <div className="di-chart-caption">
                Monthly passenger traffic for {selectedYear}
            </div>

        </div>
    );
}


/* ═══════════════════════════════════════════════════════════════
   Main Component
   ═══════════════════════════════════════════════════════════════ */

function DemandIntelligence() {

    const [origin,      setOrigin]      = useState("DEL");
    const [destination, setDestination] = useState("DXB");

    const [airports,        setAirports]        = useState([]);
    const [airportsLoading, setAirportsLoading] = useState(true);

    const [historicalTraffic, setHistoricalTraffic] = useState([]);
    const [historyLoading,    setHistoryLoading]    = useState(false);
    const [historyError,      setHistoryError]      = useState(null);
    const [selectedYear,      setSelectedYear]      = useState(null);

    const [routeData,    setRouteData]    = useState(null);
    const [routeLoading, setRouteLoading] = useState(false);
    const [routeError,   setRouteError]   = useState(null);


    /* ── Load airports ───────────────────────────────────────── */

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
            const valid = results.filter(Boolean).sort((a, b) => a.city.localeCompare(b.city));
            setAirports(valid);
            setAirportsLoading(false);
        });
    }, []);


    /* ── Historical traffic ──────────────────────────────────── */

    const fetchHistoricalTraffic = (orig, dest) => {
        if (!orig || !dest || orig === dest) return;
        setHistoryLoading(true);
        setHistoryError(null);
        setHistoricalTraffic([]);

        fetch(`${BASE_URL}/historical-traffic/route/${orig}/${dest}`)
            .then(r => {
                if (!r.ok) throw new Error(`${r.status}`);
                return r.json();
            })
            .then(data => {
                const traffic = data.traffic ?? [];
                setHistoricalTraffic(traffic);
                if (traffic.length > 0) {
                    const years = [...new Set(traffic.map(item => Number(item.year)))].sort((a, b) => a - b);
                    setSelectedYear(years[years.length - 1]);
                }
            })
            .catch(err => setHistoryError("Could not load historical traffic. " + err.message))
            .finally(() => setHistoryLoading(false));
    };


    /* ── Route analysis ──────────────────────────────────────── */

    const fetchRoute = (orig, dest) => {
        if (!orig || !dest || orig === dest) return;
        setRouteLoading(true);
        setRouteError(null);
        setRouteData(null);

        fetch(`${BASE_URL}/api/network/analyze_route`, {
            method:  "POST",
            headers: { "Content-Type": "application/json" },
            body:    JSON.stringify({ origin: orig, destination: dest }),
        })
            .then(r => {
                if (!r.ok) throw new Error(`${r.status}`);
                return r.json();
            })
            .then(data => setRouteData(data))
            .catch(err => setRouteError("Route analysis failed. " + err.message))
            .finally(() => setRouteLoading(false));
    };


    /* ── Handlers ────────────────────────────────────────────── */

    const handleAnalyse = () => {
        fetchHistoricalTraffic(origin, destination);
        fetchRoute(origin, destination);
    };

    const handleQuickRoute = ({ origin: o, dest: d }) => {
        setOrigin(o);
        setDestination(d);
        fetchHistoricalTraffic(o, d);
        fetchRoute(o, d);
    };

    const handleSwap = () => {
        setOrigin(destination);
        setDestination(origin);
    };


    /* ── Derived state ───────────────────────────────────────── */

    const years = useMemo(() => (
        [...new Set(historicalTraffic.map(item => Number(item.year)))].sort((a, b) => a - b)
    ), [historicalTraffic]);

    const selectedYearData = useMemo(() => {
        if (!selectedYear) return [];
        return historicalTraffic
            .filter(item => Number(item.year) === selectedYear)
            .sort((a, b) => Number(a.month) - Number(b.month));
    }, [historicalTraffic, selectedYear]);

    const metrics = useMemo(() => {
        if (!selectedYearData.length) return { passengers: 0, flights: 0, seats: 0, loadFactor: 0 };
        const passengers = selectedYearData.reduce((s, i) => s + Number(i.passengers || 0), 0);
        const flights    = selectedYearData.reduce((s, i) => s + Number(i.flights || 0), 0);
        const seats      = selectedYearData.reduce((s, i) => s + Number(i.available_seats || 0), 0);
        const loadFactor = seats > 0 ? (passengers / seats) * 100 : 0;
        return { passengers, flights, seats, loadFactor };
    }, [selectedYearData]);

    const trafficGrowth = useMemo(() => {
        if (!selectedYear) return null;
        const prev = historicalTraffic.filter(i => Number(i.year) === selectedYear - 1);
        if (!prev.length) return null;
        const prevPass = prev.reduce((s, i) => s + Number(i.passengers || 0), 0);
        if (!prevPass) return null;
        return ((metrics.passengers - prevPass) / prevPass) * 100;
    }, [historicalTraffic, selectedYear, metrics.passengers]);

    const chartData = useMemo(() => (
        selectedYearData.map(item => ({ ...item, month: Number(item.month) }))
    ), [selectedYearData]);

    const formReady = origin && destination && origin !== destination;


    /* ── Initial fetch ───────────────────────────────────────── */

    useEffect(() => {
        fetchHistoricalTraffic(origin, destination);
        fetchRoute(origin, destination);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    return (
        <section className="di-section">

            {/* Header */}
            <div className="di-header">
                <div>
                    <span className="di-eyebrow">Network Analytics</span>
                    <h2 className="di-title">Demand Intelligence</h2>
                    <p className="di-subtitle">Historical route traffic &amp; network performance</p>
                </div>
                <div className="di-route-badge">
                    <span className="di-route-label">Route</span>
                    <span className="di-route-code">{origin} → {destination}</span>
                </div>
            </div>


            {/* Route search */}
            <div className="di-search-panel">
                <div className="di-search-row">

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

                    <button className="di-swap-btn" aria-label="Swap origin and destination" onClick={handleSwap}>
                        ⇄
                    </button>

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

                    <button
                        className="di-analyse-btn"
                        onClick={handleAnalyse}
                        disabled={!formReady || historyLoading || routeLoading}
                    >
                        {historyLoading || routeLoading ? "Analysing…" : "Analyse Route"}
                    </button>

                </div>

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


            {/* Historical traffic */}
            {historyLoading && <LoadingState />}
            {historyError   && <ErrorBox error={historyError} />}

            {historicalTraffic.length > 0 && !historyLoading && (
                <>
                    {/* Year timeline */}
                    <div className="di-timeline-panel">
                        <div className="di-timeline-header">
                            <div>
                                <span className="di-eyebrow">Historical Period</span>
                                <h3 className="di-history-title">{origin} → {destination}</h3>
                            </div>
                            <strong className="di-selected-year">{selectedYear}</strong>
                        </div>

                        {years.length > 1 && (
                            <div className="di-slider-wrapper">
                                <div className="di-slider-years">
                                    {years.map(year => (
                                        <button
                                            key={year}
                                            className={
                                                Number(year) === Number(selectedYear)
                                                    ? "di-slider-year di-slider-year-active"
                                                    : "di-slider-year"
                                            }
                                            onClick={() => setSelectedYear(year)}
                                        >
                                            {year}
                                        </button>
                                    ))}
                                </div>
                                <input
                                    type="range"
                                    className="di-year-slider"
                                    min={0}
                                    max={years.length - 1}
                                    step={1}
                                    value={Math.max(0, years.indexOf(selectedYear))}
                                    onChange={e => setSelectedYear(years[Number(e.target.value)])}
                                />
                            </div>
                        )}
                    </div>

                    {/* KPI cards */}
                    <div className="di-kpi-strip">
                        <div className="di-kpi-card">
                            <span className="di-kpi-label">Passengers</span>
                            <strong className="di-kpi-value">{metrics.passengers.toLocaleString()}</strong>
                            <span className="di-kpi-badge di-badge-neutral">{selectedYear}</span>
                        </div>
                        <div className="di-kpi-card">
                            <span className="di-kpi-label">Flights</span>
                            <strong className="di-kpi-value">{metrics.flights.toLocaleString()}</strong>
                            <span className="di-kpi-badge di-badge-neutral">Annual</span>
                        </div>
                        <div className="di-kpi-card">
                            <span className="di-kpi-label">Available Seats</span>
                            <strong className="di-kpi-value">{metrics.seats.toLocaleString()}</strong>
                            <span className="di-kpi-badge di-badge-neutral">Capacity</span>
                        </div>
                        <div className="di-kpi-card">
                            <span className="di-kpi-label">Load Factor</span>
                            <strong className="di-kpi-value">{metrics.loadFactor.toFixed(1)}%</strong>
                            <span className={`di-kpi-badge ${
                                metrics.loadFactor >= 75 ? "di-badge-positive"
                                : metrics.loadFactor >= 50 ? "di-badge-neutral"
                                : "di-badge-negative"
                            }`}>
                                {metrics.loadFactor >= 75 ? "Healthy" : metrics.loadFactor >= 50 ? "Moderate" : "Low"}
                            </span>
                        </div>
                    </div>

                    {/* Year-over-year growth */}
                    {trafficGrowth !== null && (
                        <div className="di-recommendation">
                            <div className="di-rec-left">
                                <span className="di-rec-eyebrow">Year-over-year traffic</span>
                                <p className="di-rec-text">
                                    {trafficGrowth >= 0
                                        ? `Passenger traffic grew ${trafficGrowth.toFixed(1)}% vs ${selectedYear - 1}.`
                                        : `Passenger traffic declined ${Math.abs(trafficGrowth).toFixed(1)}% vs ${selectedYear - 1}.`
                                    }
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Chart */}
                    <TrafficChart data={chartData} selectedYear={selectedYear} />
                </>
            )}


            {/* Route analysis */}
            <div className="di-divider-rule">
                <span>Route Analysis</span>
            </div>

            {routeLoading && <LoadingState label="Running route analysis…" />}
            {routeError   && <ErrorBox error={routeError} />}

            {routeData && !routeLoading && (
                <div className="di-ra-panel">
                    <div className="di-ra-header">
                        <div>
                            <span className="di-eyebrow">Route Analysis</span>
                            <h3 className="di-ra-title">{origin} → {destination}</h3>
                        </div>
                    </div>
                    <JsonViewer data={routeData} />
                </div>
            )}

        </section>
    );
}

export default DemandIntelligence;