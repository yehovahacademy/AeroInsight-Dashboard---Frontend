import { useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./NetworkMap.css";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

function NetworkMap({ airports = [], routes = [] }) {
  const [activeCode, setActiveCode] = useState(null);

  return (
    <div className="nm-shell">
      {/* Header */}
      <header className="nm-header">
        <div className="nm-header-left">
          <span className="nm-logo">✈</span>
          <div>
            <h1 className="nm-title">AeroInsight</h1>
            <p className="nm-subtitle">Network Coverage · India Operations</p>
          </div>
        </div>
        <div className="nm-stats">
          <div className="nm-stat">
            <span className="nm-stat-value">{airports.length}</span>
            <span className="nm-stat-label">Airports</span>
          </div>
          <div className="nm-stat-divider" />
          <div className="nm-stat">
            <span className="nm-stat-value">{routes.length}</span>
            <span className="nm-stat-label">Routes</span>
          </div>
        </div>
      </header>

      <div className="nm-body">
        {/* Sidebar */}
        <aside className="nm-sidebar">
          <p className="nm-sidebar-heading">Airports</p>
          <ul className="nm-list">
            {airports.map((ap) => (
              <li
                key={ap.code}
                className={`nm-list-item nm-list-item--${ap.status ?? "spoke"} ${activeCode === ap.code ? "nm-list-item--active" : ""}`}
                onClick={() => setActiveCode(activeCode === ap.code ? null : ap.code)}
              >
                <span className="nm-list-dot" />
                <div className="nm-list-info">
                  <span className="nm-list-code">{ap.code}</span>
                  <span className="nm-list-city">{ap.city}</span>
                </div>
                {ap.flights != null && (
                  <span className="nm-list-flights">{ap.flights}</span>
                )}
              </li>
            ))}
          </ul>

          <div className="nm-legend">
            <p className="nm-sidebar-heading">Legend</p>
            {[["hub", "Hub"], ["major", "Major"], ["spoke", "Spoke"]].map(([key, label]) => (
              <div key={key} className="nm-legend-item">
                <span className={`nm-legend-dot nm-legend-dot--${key}`} />
                <span>{label}</span>
              </div>
            ))}
          </div>
        </aside>

        {/* Map */}
        <div className="nm-map-wrap">
          <MapContainer
            center={[20.5937, 78.9629]}
            zoom={5}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            />

            {airports.map((ap) => (
              <Marker
                key={ap.code}
                position={ap.position}
                eventHandlers={{
                  click: () => setActiveCode(activeCode === ap.code ? null : ap.code),
                }}
              >
                <Popup className="nm-popup">
                  <div className="nm-popup-inner">
                    <div className="nm-popup-header">
                      <span className="nm-popup-code">{ap.code}</span>
                      {ap.status && (
                        <span className={`nm-popup-status nm-popup-status--${ap.status}`}>
                          {ap.status}
                        </span>
                      )}
                    </div>
                    {ap.name && <p className="nm-popup-name">{ap.name}</p>}
                    <p className="nm-popup-city">{ap.city}</p>
                    {ap.flights != null && (
                      <div className="nm-popup-stat">
                        <span>{ap.flights}</span> daily flights
                      </div>
                    )}
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>
    </div>
  );
}

export default NetworkMap;