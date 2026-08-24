// RouteCards.jsx
import React from 'react';
import { Divider } from 'antd';

const StatRow = ({ label, value }) => (
  <div className="rc-stat-row">
    <span className="rc-stat-label">{label}</span>
    <span className="rc-stat-value">{value ?? '—'}</span>
  </div>
);

function RouteCards({ data, routes = [] }) {
  // Handle both single route and array of routes
  const routeList = Array.isArray(data) ? data : (data ? [data] : routes);
  
  if (!routeList || routeList.length === 0) {
    return <div className="rc-empty">No routes available</div>;
  }

  return (
    <div className="rc-wrapper">
      {routeList.map((route, index) => (
        <div key={route.route_id || route.id || index} className="rc-card">
          {/* Header */}
          <div className="rc-header">
            <div className="rc-route">
              <span className="rc-iata">{route.origin_iata || route.origin || '—'}</span>
              <svg className="rc-plane-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M21 16v-2l-8-5V3.5A1.5 1.5 0 0 0 11.5 2 1.5 1.5 0 0 0 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5z" />
              </svg>
              <span className="rc-iata">{route.destination_iata || route.destination || '—'}</span>
            </div>
            <span className="rc-badge" style={{ background: '#fff8e1', color: '#f57f17' }}>
              {route.region || 'Domestic'}
            </span>
          </div>

          <Divider />

          {/* Content Grid */}
          <div className="rc-grid">
            {/* Left Column - Route Info */}
            <div className="rc-section">
              <p className="rc-section-title">Route Info</p>
              <StatRow label="Distance" value={route.distance_km ? `${route.distance_km} km` : '—'} />
              <StatRow label="Region" value={route.region || '—'} />
              <StatRow label="Route ID" value={route.route_id || route.id || '—'} />
              <StatRow label="Origin" value={route.origin_iata || route.origin || '—'} />
              <StatRow label="Destination" value={route.destination_iata || route.destination || '—'} />
            </div>

            {/* Right Column - Financials (Coming Soon) */}
            <div className="rc-section">
              <p className="rc-section-title">Financials</p>
              <StatRow label="Est. Revenue" value="⏳ Pending" />
              <StatRow label="Est. Cost" value="⏳ Pending" />
              <StatRow label="Profitability Score" value="⏳ Pending" />
              <StatRow label="Recommendation" value="🔍 Analysis required" />
            </div>
          </div>

          {/* Optional: Coordinates display */}
          {route.coordinates && (
            <div className="rc-footer">
              <span className="rc-coords">
                📍 {route.coordinates.lat?.toFixed(4)}, {route.coordinates.lng?.toFixed(4)}
              </span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default RouteCards;