import "./RouteCards.css";

const RECOMMENDATION_COLORS = {
  "Increase flight frequency": { bg: "#e8f5e9", text: "#2e7d32" },
  "Maintain":                  { bg: "#e8f5e9", text: "#2e7d32" },
  "Reduce Frequency":          { bg: "#fce4ec", text: "#c62828" },
  "Monitor":                   { bg: "#fff8e1", text: "#f57f17" },
  "Review":                    { bg: "#fce4ec", text: "#c62828" },
};

// ── Sub-components ───────────────────────────────────────────

function StatRow({ label, value }) {
  return (
    <div className="rc-stat-row">
      <span className="rc-stat-label">{label}</span>
      <span className="rc-stat-value">{value}</span>
    </div>
  );
}

function Divider() {
  return <div className="rc-divider" />;
}

// ── Main component ───────────────────────────────────────────

function RouteCards({ data }) {
  if (!data) return null;

  const badge =
    RECOMMENDATION_COLORS[data.recommendation] ||
    RECOMMENDATION_COLORS["Monitor"];

  const profitPositive = data.estimated_profit >= 0;

  return (
    <div className="rc-wrapper">

      {/* ── Card ── */}
      <div className="rc-card">

        {/* Header */}
        <div className="rc-header">
          <div className="rc-route">
            <span className="rc-iata">{data.origin}</span>
            <svg className="rc-plane-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M21 16v-2l-8-5V3.5A1.5 1.5 0 0 0 11.5 2 1.5 1.5 0 0 0 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5z" />
            </svg>
            <span className="rc-iata">{data.destination}</span>
          </div>
          <span
            className="rc-badge"
            style={{ background: badge.bg, color: badge.text }}
          >
            {data.recommendation}
          </span>
        </div>

        <Divider />

        {/* ── Two-column grid ── */}
        <div className="rc-grid">

          {/* Left: Route info */}
          <div className="rc-section">
            <p className="rc-section-title">Route Info</p>
            <StatRow label="Distance"          value={`${data.distance_km} km`} />
            <StatRow label="Est. Duration"     value={data.estimated_duration} />
            <StatRow label="Demand Score"      value={`${data.demand_score}%`} />
            <StatRow label="Weather Risk"      value={data.weather_risk} />
          </div>

          {/* Right: Financials */}
          <div className="rc-section">
            <p className="rc-section-title">Financials</p>
            <StatRow label="Est. Revenue" value={`₹${data.estimated_revenue.toLocaleString()}`} />
            <StatRow label="Est. Cost"    value={`₹${data.estimated_cost.toLocaleString()}`} />
            <div className="rc-stat-row">
              <span className="rc-stat-label">Est. Profit</span>
              <span
                className="rc-stat-value"
                style={{ color: profitPositive ? "#166534" : "#991b1b", fontWeight: 700 }}
              >
                {profitPositive ? "+" : ""}₹{data.estimated_profit.toLocaleString()}
              </span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

export default RouteCards;