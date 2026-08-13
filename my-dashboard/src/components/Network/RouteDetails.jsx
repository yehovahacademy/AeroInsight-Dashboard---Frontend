import "../../styles/RouteDetails.css";

// Spark line renderer — inline SVG, no library needed
function SparkLine({ values, color = "#1565c0" }) {
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;
  const w = 120, h = 36, pad = 4;

  const points = values.map((v, i) => {
    const x = pad + (i / (values.length - 1)) * (w - pad * 2);
    const y = h - pad - ((v - min) / range) * (h - pad * 2);
    return `${x},${y}`;
  }).join(" ");

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ display: "block", marginTop: "6px" }}>
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      {/* End dot */}
      {(() => {
        const last = values[values.length - 1];
        const x = w - pad;
        const y = h - pad - ((last - min) / range) * (h - pad * 2);
        return <circle cx={x} cy={y} r="3" fill={color} />;
      })()}
    </svg>
  );
}

// Horizontal bar — reused for Load Factor & Competition
function MiniBar({ value, max = 100, color }) {
  const barColor = color || (
    value >= 80 ? "#2e7d32" :
    value >= 60 ? "#f57f17" :
                  "#c62828"
  );
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "6px" }}>
      <div style={{
        flex: 1, height: "8px", background: "#e0e0e0",
        borderRadius: "4px", overflow: "hidden",
      }}>
        <div style={{
          width: `${(value / max) * 100}%`,
          height: "100%",
          background: barColor,
          borderRadius: "4px",
          transition: "width 0.4s ease",
        }} />
      </div>
      <span style={{ fontSize: "12px", fontWeight: 700, color: barColor, minWidth: "32px" }}>
        {value}%
      </span>
    </div>
  );
}

// Season pill row
function SeasonPills({ seasons }) {
  const SEASON_COLORS = {
    Peak:     { bg: "#e8f5e9", text: "#2e7d32" },
    Moderate: { bg: "#fff8e1", text: "#f57f17" },
    Low:      { bg: "#fce4ec", text: "#c62828" },
  };
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "8px" }}>
      {seasons.map(({ month, level }) => {
        const style = SEASON_COLORS[level] || SEASON_COLORS["Moderate"];
        return (
          <span key={month} style={{
            padding: "2px 8px", borderRadius: "10px", fontSize: "11px",
            fontWeight: 600, background: style.bg, color: style.text,
          }}>
            {month} · {level}
          </span>
        );
      })}
    </div>
  );
}

export default function RouteDetails({ airline }) {
  if (!airline) return null;

  // `airline` is now a route object from ROUTE_CARDS.
  // Expected shape (add these fields to your ROUTE_CARDS data):
  // {
  //   id, origin, destination, originCode, destinationCode,
  //   loadFactor, revenue, recommendation,
  //   competitorCount,          // number 0–100 scale or raw count
  //   competitorLabel,          // e.g. "4 airlines"
  //   aircraftTypes,            // e.g. ["A320", "B737"]
  //   revenueTrend,             // array of 7 numbers, e.g. [72,75,78,74,80,83,87]
  //   seasons,                  // [{month:"Jan",level:"Peak"}, ...]
  //   avgFlightTime,            // e.g. "1h 55m"
  //   distanceKm,               // e.g. 1148
  // }

  const {
    origin, destination, originCode, destinationCode,
    loadFactor, revenue, recommendation,
    competitorCount = 40,
    competitorLabel = "—",
    aircraftTypes = [],
    revenueTrend = [65, 70, 68, 74, 78, 80, 83],
    seasons = [],
    avgFlightTime = "—",
    distanceKm = "—",
  } = airline;

  const RECOMMENDATION_COLORS = {
    "Maintain":           { bg: "#e8f5e9", text: "#2e7d32" },
    "Expand":             { bg: "#e3f2fd", text: "#1565c0" },
    "Increase Frequency": { bg: "#e8f5e9", text: "#2e7d32" },
    "Monitor":            { bg: "#fff8e1", text: "#f57f17" },
    "Reduce Frequency":   { bg: "#fce4ec", text: "#c62828" },
    "Review":             { bg: "#fce4ec", text: "#c62828" },
  };
  const badge = RECOMMENDATION_COLORS[recommendation] || RECOMMENDATION_COLORS["Monitor"];

  const trendColor =
    revenueTrend[revenueTrend.length - 1] >= revenueTrend[0] ? "#2e7d32" : "#c62828";

  return (
    <section className="airline-details">

      {/* ── Header: Route Overview ── */}
      <div className="airline-header">
        <div>
          <h2 style={{ margin: 0 }}>
            {origin} → {destination}
          </h2>
          <p style={{ margin: "4px 0 0", color: "#888", fontSize: "13px" }}>
            {originCode} → {destinationCode} &nbsp;·&nbsp; {distanceKm} km &nbsp;·&nbsp; {avgFlightTime}
          </p>
        </div>
        <span style={{
          padding: "4px 14px", borderRadius: "14px", fontSize: "12px",
          fontWeight: 700, background: badge.bg, color: badge.text,
          alignSelf: "flex-start",
        }}>
          {recommendation}
        </span>
      </div>

      {/* ── Stats Grid ── */}
      <div className="stats-grid">

        {/* Load Factor */}
        <div className="stat-card">
          <h3>Load Factor</h3>
          <MiniBar value={loadFactor} />
        </div>

        {/* Competition */}
        <div className="stat-card">
          <h3>Competition</h3>
          <p style={{ margin: "4px 0 0", fontSize: "20px", fontWeight: 700 }}>
            {competitorLabel}
          </p>
          <MiniBar value={competitorCount} color="#7b1fa2" />
        </div>

        {/* Revenue */}
        <div className="stat-card">
          <h3>Revenue Level</h3>
          <p style={{
            margin: "8px 0 0", fontSize: "20px", fontWeight: 700,
            color: revenue === "High" ? "#2e7d32" : revenue === "Medium" ? "#f57f17" : "#c62828",
          }}>
            {revenue}
          </p>
        </div>

        {/* Aircraft Used */}
        <div className="stat-card">
          <h3>Aircraft Used</h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "8px" }}>
            {aircraftTypes.length > 0 ? aircraftTypes.map(ac => (
              <span key={ac} style={{
                padding: "2px 10px", borderRadius: "10px", fontSize: "12px",
                fontWeight: 600, background: "#e3f2fd", color: "#1565c0",
              }}>
                {ac}
              </span>
            )) : <span style={{ color: "#aaa", fontSize: "13px" }}>—</span>}
          </div>
        </div>

      </div>

      {/* ── Seasonality ── */}
      <div className="stat-card" style={{ marginTop: "16px" }}>
        <h3>Seasonality</h3>
        {seasons.length > 0
          ? <SeasonPills seasons={seasons} />
          : <p style={{ color: "#aaa", fontSize: "13px", marginTop: "6px" }}>No seasonal data available.</p>
        }
      </div>

      {/* ── Revenue Trend Spark Line ── */}
      <div className="stat-card" style={{ marginTop: "16px" }}>
        <h3>Revenue Trend <span style={{ fontSize: "11px", color: "#aaa", fontWeight: 400 }}>(last 7 months)</span></h3>
        <SparkLine values={revenueTrend} color={trendColor} />
        <p style={{ fontSize: "12px", color: trendColor, margin: "4px 0 0", fontWeight: 600 }}>
          {revenueTrend[revenueTrend.length - 1] >= revenueTrend[0] ? "▲ Trending up" : "▼ Trending down"}
        </p>
      </div>

    </section>
  );
}