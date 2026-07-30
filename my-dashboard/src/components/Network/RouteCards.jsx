import "../../styles/NetworkPlanner.css";

// UI-only colors
const RECOMMENDATION_COLORS = {
  Maintain: { bg: "#e8f5e9", text: "#2e7d32" },
  Expand: { bg: "#e3f2fd", text: "#1565c0" },
  "Increase Frequency": { bg: "#e8f5e9", text: "#2e7d32" },
  Monitor: { bg: "#fff8e1", text: "#f57f17" },
  "Reduce Frequency": { bg: "#fce4ec", text: "#c62828" },
  Review: { bg: "#fce4ec", text: "#c62828" },
};

function LoadBar({ value }) {
  const color =
    value >= 85
      ? "#2e7d32"
      : value >= 70
      ? "#f57f17"
      : "#c62828";

  return (
    <div style={{ marginTop: "6px" }}>
      <div
        style={{
          background: "#e0e0e0",
          borderRadius: "4px",
          height: "6px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${value}%`,
            height: "100%",
            background: color,
            borderRadius: "4px",
            transition: "width 0.4s ease",
          }}
        />
      </div>
    </div>
  );
}

function RouteCards({
  routes = [],
  selectedRoute,
  setSelectedRoute,
}) {
  const handleRouteClick = (routeId) => {
    setSelectedRoute((prev) => (prev === routeId ? null : routeId));
  };

  return (
    <div className="hero-3">
      <div className="airlines">
        <div className="heading-airlines">
          Top Routes — Performance Overview
        </div>

        <div className="airlines-grid">
          {routes.length === 0 ? (
            <p>No routes available.</p>
          ) : (
            routes.map((route) => {
              const isSelected = selectedRoute === route.id;

              const badge =
                RECOMMENDATION_COLORS[route.recommendation] ||
                RECOMMENDATION_COLORS["Monitor"];

              return (
                <div
                  key={route.id}
                  className="airline-item"
                  onClick={() => handleRouteClick(route.id)}
                  style={{
                    cursor: "pointer",
                    outline: isSelected
                      ? "2px solid #1565c0"
                      : "none",
                    borderRadius: "8px",
                    padding: "12px",
                    transition: "outline 0.2s ease",
                  }}
                >
                  <h2
                    style={{
                      fontSize: "15px",
                      fontWeight: 700,
                      margin: "0 0 6px",
                    }}
                  >
                    {route.origin} → {route.destination}
                  </h2>

                  <div
                    style={{
                      fontSize: "12px",
                      color: "#888",
                      marginBottom: "8px",
                    }}
                  >
                    {route.originCode} → {route.destinationCode}
                  </div>

                  <div
                    style={{
                      fontSize: "13px",
                      marginBottom: "2px",
                    }}
                  >
                    <span style={{ color: "#555" }}>
                      Load Factor:
                    </span>{" "}
                    <strong>{route.loadFactor}%</strong>
                  </div>

                  <LoadBar value={route.loadFactor} />

                  <div
                    style={{
                      fontSize: "13px",
                      marginTop: "8px",
                    }}
                  >
                    <span style={{ color: "#555" }}>
                      Revenue:
                    </span>{" "}
                    <strong>{route.revenue}</strong>
                  </div>

                  <div
                    style={{
                      marginTop: "10px",
                      display: "inline-block",
                      padding: "3px 10px",
                      borderRadius: "12px",
                      fontSize: "11px",
                      fontWeight: 600,
                      background: badge.bg,
                      color: badge.text,
                    }}
                  >
                    {route.recommendation}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

export default RouteCards;