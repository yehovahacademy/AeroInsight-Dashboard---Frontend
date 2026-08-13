import { useState, useEffect } from "react";
import "../../styles/NetworkPlanner.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartLine,
  faChartBar,
  faBuilding,
  faBrain,
  faPlaneCircleCheck,
  faRoute,
  faArrowRight,
  faRightLeft,
} from "@fortawesome/free-solid-svg-icons";
import RouteCards from "./RouteCards";

// ── Static data ──────────────────────────────────────────────

const AIRCRAFT_TYPES  = ["A320", "A321neo", "B737 MAX", "B777", "ATR 72"];
const SEASONS         = ["Winter (Nov–Feb)", "Summer (Mar–Jun)", "Monsoon (Jul–Oct)"];
const FLIGHTS_PER_DAY = ["1", "2", "3", "4", "5", "6+"];

const PLANNER_TOOLS = [
  { icon: faRoute,            label: "Route Optimisation"   },
  { icon: faChartLine,        label: "Demand Forecast"      },
  { icon: faBuilding,         label: "Airport Intelligence" },
  { icon: faPlaneCircleCheck, label: "Fleet Allocation"     },
  { icon: faChartBar,         label: "Competition Analysis" },
  { icon: faBrain,            label: "AI Recommendation"    },
];

// ── Component ────────────────────────────────────────────────
function NetworkPlanner() {

  const [origin,        setOrigin       ] = useState("");
  const [destination,   setDestination  ] = useState("");
  const [aircraft,      setAircraft     ] = useState("");
  const [season,        setSeason       ] = useState("");
  const [flightsDay,    setFlightsDay   ] = useState("");
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [routeData,     setRouteData    ] = useState(null);
  const [loading,       setLoading      ] = useState(false);
  const [error,         setError        ] = useState(null);
  const [airports,      setAirports     ] = useState([]);  // ← moved here, top-level

  // ── Fetch airports once on mount ──
  // We fetch each IATA code individually and pick the exact match from results
  useEffect(() => {
    const INDIAN_IATA_CODES = [
      "BOM", "DEL", "BLR", "MAA", "CCU", "HYD", "GOI", "PNQ", "AMD", "JAI",
      "COK", "TRV", "IXC", "PAT", "BHO", "NAG", "IXB", "GAU", "VNS", "IXR",
      "SXR", "LKO", "IDR", "IXE", "IXM", "VTZ", "BDQ", "ATQ", "JDH", "UDR",
      "IMF", "DIB", "IXA", "IXD", "RPR", "IXG", "IXU", "IXW", "IXJ", "PGH"
    ];

    Promise.all(
      INDIAN_IATA_CODES.map(code =>
        fetch(`https://aeroinsight-dashboard-backend.onrender.com/airports/api/airports/search/${code}`)
          .then(res => res.json())
          .then(results => results.find(a => a.iata === code) ?? null)
          .catch(() => null)
      )
    ).then(results => {
      const valid = results.filter(Boolean);
      const airportNames = valid
        .map(a => `${a.name} (${a.iata})`)
        .sort();
      setAirports(airportNames);
    });
  }, []);

  const formReady = origin && destination && origin !== destination;

  const handleSwap = () => {
    setOrigin(destination);
    setDestination(origin);
  };

  // Extract IATA code from "Mumbai (BOM)" → "BOM"
  const extractIATA = (value) => value.match(/\(([^)]+)\)/)?.[1] ?? value;

  const handleAnalyze = async () => {
    if (!formReady) return;

    setLoading(true);
    setError(null);
    setRouteData(null);

    try {
      const response = await fetch(
        "https://aeroinsight-dashboard-backend.onrender.com/network/analyze_route",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            origin:          extractIATA(origin),
            destination:     extractIATA(destination),
            aircraft:        aircraft || null,
            season:          season || null,
            flights_per_day: flightsDay || null,
          }),
        }
      );

      if (!response.ok) throw new Error(`Server error: ${response.status}`);

      const data = await response.json();
      setRouteData(data);

    } catch (err) {
      console.error("Route analysis failed:", err);
      setError("Failed to analyse route. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* ── Hero ── */}
      <div className="Hero">
        <h2>Network Route Planner</h2>
        <h3>
          Analyse demand, profitability, and network opportunities
          before launching or modifying routes.
        </h3>

        {/* ── Planner Form ── */}
        <div className="card-1" style={{ flexDirection: "column", gap: "0" }}>
          <div className="search-bar" style={{ flexWrap: "wrap", gap: "12px" }}>

            {/* Origin / Swap / Destination */}
            <div className="search-group">
              <div className="search-1 input-box">
                <label style={{ fontSize: "11px", color: "#888", marginBottom: "2px", display: "block" }}>
                  Origin Airport
                </label>
                <select
                  value={origin}
                  onChange={e => setOrigin(e.target.value)}
                  style={{ border: "none", background: "transparent", fontSize: "14px", width: "100%", outline: "none" }}
                >
                  <option value="">Select origin</option>
                  {airports.map(a => (
                    <option key={a} value={a} disabled={a === destination}>{a}</option>
                  ))}
                </select>
              </div>

              <button className="swap-btn" onClick={handleSwap} aria-label="Swap origin and destination">
                <FontAwesomeIcon icon={faRightLeft} />
              </button>

              <div className="search-2 input-box">
                <label style={{ fontSize: "11px", color: "#888", marginBottom: "2px", display: "block" }}>
                  Destination Airport
                </label>
                <select
                  value={destination}
                  onChange={e => setDestination(e.target.value)}
                  style={{ border: "none", background: "transparent", fontSize: "14px", width: "100%", outline: "none" }}
                >
                  <option value="">Select destination</option>
                  {airports.map(a => (
                    <option key={a} value={a} disabled={a === origin}>{a}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="divider" />

            {/* Aircraft / Season */}
            <div className="date-group" style={{ gap: "12px" }}>
              <div className="date-1 input-box">
                <span className="date-label">Aircraft Type</span>
                <select
                  value={aircraft}
                  onChange={e => setAircraft(e.target.value)}
                  style={{ border: "none", background: "transparent", fontSize: "14px", outline: "none" }}
                >
                  <option value="">Any</option>
                  {AIRCRAFT_TYPES.map(ac => <option key={ac}>{ac}</option>)}
                </select>
              </div>

              <div className="date-2 input-box">
                <span className="date-label">Season</span>
                <select
                  value={season}
                  onChange={e => setSeason(e.target.value)}
                  style={{ border: "none", background: "transparent", fontSize: "14px", outline: "none" }}
                >
                  <option value="">Any</option>
                  {SEASONS.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
            </div>

            {/* Flights / Day + Analyse button */}
            <div className="Traveller&Class">
              <div className="Traveller">
                <label>Flights / Day</label>
                <select
                  value={flightsDay}
                  onChange={e => setFlightsDay(e.target.value)}
                  style={{ border: "none", background: "transparent", fontSize: "14px", outline: "none", width: "100%" }}
                >
                  <option value="">—</option>
                  {FLIGHTS_PER_DAY.map(n => <option key={n}>{n}</option>)}
                </select>
              </div>

              <button
                className="search-btn"
                onClick={handleAnalyze}
                disabled={!formReady || loading}
                style={{ opacity: formReady && !loading ? 1 : 0.45, cursor: formReady && !loading ? "pointer" : "not-allowed" }}
              >
                {loading ? "Analysing..." : "Analyse Route"} <FontAwesomeIcon icon={faArrowRight} />
              </button>
            </div>

          </div>
        </div>
      </div>

      <br /><br />

      {/* ── Planner Tools Strip ── */}
      <div className="heading-hero">
        <h1>Planning tools</h1>
      </div>
      <br />
      <div className="hero-2">
        {PLANNER_TOOLS.map(({ icon, label }, i) => (
          <div key={label} style={{ display: "contents" }}>
            {i > 0 && <div className="divider" />}
            <div className="flight-Tracker" style={{ cursor: "pointer" }}>
              <FontAwesomeIcon icon={icon} />
              <span>{label}</span>
            </div>
          </div>
        ))}
      </div>

      <br /><br />

      {/* ── Route Analysis Results ── */}
      <div className="heading-hero">
        <h1>Route Analysis</h1>
      </div>
      <br />

      {error && (
        <p style={{ color: "red", textAlign: "center" }}>{error}</p>
      )}

      {!routeData && !loading && !error && (
        <p style={{ textAlign: "center", color: "#888" }}>
          Select a route and click Analyse Route to see insights.
        </p>
      )}

      {loading && (
        <p style={{ textAlign: "center", color: "#888" }}>Analysing route...</p>
      )}

      {routeData && (
        <RouteCards
          data={routeData}
          selectedRoute={selectedRoute}
          setSelectedRoute={setSelectedRoute}
        />
      )}

      <br />
    </>
  );
}

export default NetworkPlanner;