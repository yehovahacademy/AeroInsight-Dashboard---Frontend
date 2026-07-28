import { useState } from "react";
import "../../styles/NetworkPlanner.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartLine,
  faCloudSun,
  faChartBar,
  faBuilding,
  faArrowTrendUp,
  faBrain,
  faPlaneCircleCheck,
  faRoute,
} from "@fortawesome/free-solid-svg-icons";
import { faArrowRight, faRightLeft } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import RouteCards from "./RouteCards";

// ── Static data ──────────────────────────────────────────────
const AIRPORTS = [
  "Mumbai (BOM)", "Delhi (DEL)", "Bengaluru (BLR)",
  "Chennai (MAA)", "Hyderabad (HYD)", "Kolkata (CCU)",
  "Goa (GOI)", "Pune (PNQ)", "Ahmedabad (AMD)", "Kochi (COK)",
];

const AIRCRAFT_TYPES = ["A320", "A321neo", "B737 MAX", "B777", "ATR 72"];
const SEASONS       = ["Winter (Nov–Feb)", "Summer (Mar–Jun)", "Monsoon (Jul–Oct)"];
const FLIGHTS_PER_DAY = ["1", "2", "3", "4", "5", "6+"];

const PLANNER_TOOLS = [
  { icon: faRoute,           label: "Route Optimisation" },
  { icon: faChartLine,       label: "Demand Forecast"    },
  { icon: faBuilding,        label: "Airport Intelligence"},
  { icon: faPlaneCircleCheck,label: "Fleet Allocation"   },
  { icon: faChartBar,        label: "Competition Analysis"},
  { icon: faBrain,           label: "AI Recommendation"  },
];

// ── Component ────────────────────────────────────────────────
function NetworkPlanner() {
  const navigate = useNavigate();

  const [origin,      setOrigin     ] = useState("");
  const [destination, setDestination] = useState("");
  const [aircraft,    setAircraft   ] = useState("");
  const [season,      setSeason     ] = useState("");
  const [flightsDay,  setFlightsDay ] = useState("");
  const [selectedRoute, setSelectedRoute] = useState(null);

  const handleSwap = () => {
    setOrigin(destination);
    setDestination(origin);
  };

  const handleAnalyze = () => {
    if (!origin || !destination) return;
    navigate(
      `/network?origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&aircraft=${encodeURIComponent(aircraft)}&season=${encodeURIComponent(season)}&fpd=${flightsDay}`
    );
  };

  const formReady = origin && destination && origin !== destination;

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

          {/* Row 1 — Origin / Swap / Destination */}
          <div className="search-bar" style={{ flexWrap: "wrap", gap: "12px" }}>
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
                  {AIRPORTS.map(a => (
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
                  {AIRPORTS.map(a => (
                    <option key={a} value={a} disabled={a === origin}>{a}</option>
                  ))}
                </select>
              </div>

            </div>

            <div className="divider" />

            {/* Row 2 — Aircraft / Season / Flights per day */}
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
                disabled={!formReady}
                style={{ opacity: formReady ? 1 : 0.45, cursor: formReady ? "pointer" : "not-allowed" }}
              >
                Analyse Route <FontAwesomeIcon icon={faArrowRight} />
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

      {/* ── Route Cards ── */}
      <RouteCards
        selectedRoute={selectedRoute}
        setSelectedRoute={setSelectedRoute}
      />

      <br />
    </>
  );
}

export default NetworkPlanner;