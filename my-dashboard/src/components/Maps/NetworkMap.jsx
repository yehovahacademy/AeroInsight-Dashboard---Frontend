// NetworkMap.jsx

import { useState, useMemo, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./NetworkMap.css";

/* ─────────────────────────────────────────
   CUSTOM SVG MARKER
───────────────────────────────────────── */

const ROLE_COLORS = {
  hub:    "#3b82f6",
  major:  "#8b5cf6",
  spoke:  "#64748b",
};

function makeMarkerIcon(role, isActive) {
  const color = ROLE_COLORS[role] ?? ROLE_COLORS.spoke;
  const size  = role === "hub" ? 14 : role === "major" ? 11 : 9;
  const ring  = isActive ? 3 : 0;

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg"
         width="${size + ring * 2 + 4}"
         height="${size + ring * 2 + 4}"
         viewBox="0 0 ${size + ring * 2 + 4} ${size + ring * 2 + 4}">
      ${isActive ? `
        <circle
          cx="${(size + ring * 2 + 4) / 2}"
          cy="${(size + ring * 2 + 4) / 2}"
          r="${(size / 2) + ring + 1}"
          fill="${color}30"
          stroke="${color}"
          stroke-width="1"
        />
      ` : ""}
      <circle
        cx="${(size + ring * 2 + 4) / 2}"
        cy="${(size + ring * 2 + 4) / 2}"
        r="${size / 2}"
        fill="${color}"
        stroke="#0d1117"
        stroke-width="2"
      />
    </svg>
  `;

  const total = size + ring * 2 + 4;

  return L.divIcon({
    html: svg,
    className: "",
    iconSize:   [total, total],
    iconAnchor: [total / 2, total / 2],
    popupAnchor:[0, -(total / 2)],
  });
}

/* ─────────────────────────────────────────
   FLY-TO CONTROLLER
   Flies the map to a given position
   when activeCode changes.
───────────────────────────────────────── */

function FlyTo({ position }) {
  const map = useMap();

  if (position) {
    map.flyTo(position, Math.max(map.getZoom(), 7), {
      duration: 0.8,
    });
  }

  return null;
}

/* ─────────────────────────────────────────
   NETWORK MAP
───────────────────────────────────────── */

function NetworkMap({
  airports = [],
  routes   = [],
  origin,
  destination,
}) {
  const [activeCode, setActiveCode] = useState(null);
  const [search,     setSearch]     = useState("");
  const markerRefs = useRef({});

  const airportList = Array.isArray(airports) ? airports : [];

  /* ── Valid airports ── */

  const validAirports = useMemo(() =>
    airportList.filter((ap) => {
      const lat = Number(ap.latitude);
      const lng = Number(ap.longitude);
      return Number.isFinite(lat) && Number.isFinite(lng);
    }),
    [airportList]
  );

  /* ── Filtered list for sidebar ── */

  const filteredAirports = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return validAirports;
    return validAirports.filter(
      (ap) =>
        (ap.iata   ?? "").toLowerCase().includes(q) ||
        (ap.city   ?? "").toLowerCase().includes(q) ||
        (ap.name   ?? "").toLowerCase().includes(q)
    );
  }, [validAirports, search]);

  /* ── Route polyline ── */

  const routeLine = useMemo(() => {
    if (!origin || !destination) return null;

    const orig = validAirports.find((ap) => ap.iata === origin);
    const dest = validAirports.find((ap) => ap.iata === destination);

    if (!orig || !dest) return null;

    return [
      [Number(orig.latitude), Number(orig.longitude)],
      [Number(dest.latitude), Number(dest.longitude)],
    ];
  }, [origin, destination, validAirports]);

  /* ── Active airport position (for FlyTo) ── */

  const activeAirport = validAirports.find(
    (ap) => ap.iata === activeCode
  );

  const flyPosition = activeAirport
    ? [Number(activeAirport.latitude), Number(activeAirport.longitude)]
    : null;

  /* ── Handle sidebar click ── */

  const handleSidebarClick = (code) => {
    const next = activeCode === code ? null : code;
    setActiveCode(next);

    if (next && markerRefs.current[next]) {
      markerRefs.current[next].openPopup();
    }
  };

  /* ── Role counts ── */

  const roleCounts = useMemo(() => {
    const counts = { hub: 0, major: 0, spoke: 0 };
    validAirports.forEach((ap) => {
      const role = ap.airport_role || ap.status || "spoke";
      if (role in counts) counts[role]++;
    });
    return counts;
  }, [validAirports]);

  return (
    <div className="nm-shell">

      {/* ── Header ── */}

      <header className="nm-header">
        <div className="nm-header-brand">
          <span className="nm-header-icon">✈</span>

          <div>
            <h2 className="nm-header-title">Network Coverage</h2>
            <p className="nm-header-sub">India Operations</p>
          </div>
        </div>

        <div className="nm-header-stats">
          <div className="nm-header-stat">
            <strong>{validAirports.length}</strong>
            <span>Airports</span>
          </div>

          <div className="nm-header-divider" />

          <div className="nm-header-stat">
            <strong>{routes.length}</strong>
            <span>Routes</span>
          </div>

          {origin && destination && origin !== destination && (
            <>
              <div className="nm-header-divider" />

              <div className="nm-active-route">
                <span>{origin}</span>
                <svg
                  viewBox="0 0 16 8"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M0 4h13M10 1l3 3-3 3"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
                <span>{destination}</span>
              </div>
            </>
          )}
        </div>
      </header>

      <div className="nm-body">

        {/* ── Sidebar ── */}

        <aside className="nm-sidebar">

          {/* Search */}

          <div className="nm-search-wrap">
            <svg
              className="nm-search-icon"
              viewBox="0 0 20 20"
              fill="none"
            >
              <circle
                cx="8.5"
                cy="8.5"
                r="5.5"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <path
                d="M13 13l3.5 3.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>

            <input
              className="nm-search"
              type="text"
              placeholder="Search airports…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            {search && (
              <button
                className="nm-search-clear"
                onClick={() => setSearch("")}
                aria-label="Clear search"
              >
                ×
              </button>
            )}
          </div>

          {/* Airport list */}

          <p className="nm-sidebar-heading">
            {search
              ? `${filteredAirports.length} result${filteredAirports.length !== 1 ? "s" : ""}`
              : "Airports"}
          </p>

          <ul className="nm-list">
            {filteredAirports.length === 0 && (
              <li className="nm-list-empty">
                No airports match "{search}"
              </li>
            )}

            {filteredAirports.map((ap, index) => {
              const code   = ap.iata || `AIRPORT-${index}`;
              const role   = ap.airport_role || ap.status || "spoke";
              const isOrigin = code === origin;
              const isDest   = code === destination;
              const isActive = activeCode === code;

              return (
                <li
                  key={`${code}-${index}`}
                  className={[
                    "nm-list-item",
                    `nm-list-item--${role}`,
                    isActive     ? "nm-list-item--active"      : "",
                    isOrigin     ? "nm-list-item--origin"      : "",
                    isDest       ? "nm-list-item--destination" : "",
                  ].filter(Boolean).join(" ")}
                  onClick={() => handleSidebarClick(code)}
                >
                  <span
                    className="nm-list-dot"
                    style={{
                      background: ROLE_COLORS[role] ?? ROLE_COLORS.spoke,
                    }}
                  />

                  <div className="nm-list-info">
                    <span className="nm-list-code">
                      {code}

                      {isOrigin && (
                        <span className="nm-route-tag nm-route-tag--origin">
                          O
                        </span>
                      )}

                      {isDest && (
                        <span className="nm-route-tag nm-route-tag--dest">
                          D
                        </span>
                      )}
                    </span>

                    <span className="nm-list-city">
                      {ap.city || ap.name || ap.country || "Unknown"}
                    </span>
                  </div>

                  {ap.flights != null && (
                    <span className="nm-list-flights">
                      {ap.flights}
                    </span>
                  )}
                </li>
              );
            })}
          </ul>

          {/* Legend */}

          <div className="nm-legend">
            <p className="nm-sidebar-heading">Legend</p>

            {[
              ["hub",   "Hub",   roleCounts.hub],
              ["major", "Major", roleCounts.major],
              ["spoke", "Spoke", roleCounts.spoke],
            ].map(([key, label, count]) => (
              <div key={key} className="nm-legend-item">
                <span
                  className="nm-legend-dot"
                  style={{ background: ROLE_COLORS[key] }}
                />
                <span className="nm-legend-label">{label}</span>
                <span className="nm-legend-count">{count}</span>
              </div>
            ))}
          </div>

        </aside>

        {/* ── Map ── */}

        <div className="nm-map-wrap">
          <MapContainer
            center={[20.5937, 78.9629]}
            zoom={5}
            style={{ height: "100%", width: "100%" }}
            zoomControl={false}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            />

            {flyPosition && <FlyTo position={flyPosition} />}

            {/* Route arc */}

            {routeLine && (
              <>
                {/* Glow */}
                <Polyline
                  positions={routeLine}
                  pathOptions={{
                    color: "#3b82f6",
                    weight: 6,
                    opacity: 0.15,
                    dashArray: null,
                  }}
                />

                {/* Main line */}
                <Polyline
                  positions={routeLine}
                  pathOptions={{
                    color: "#60a5fa",
                    weight: 2,
                    opacity: 0.9,
                    dashArray: "6 5",
                  }}
                />
              </>
            )}

            {/* Markers */}

            {validAirports.map((ap, index) => {
              const code  = ap.iata || `AIRPORT-${index}`;
              const role  = ap.airport_role || ap.status || "spoke";
              const lat   = Number(ap.latitude);
              const lng   = Number(ap.longitude);
              const isActive =
                activeCode === code ||
                code === origin ||
                code === destination;

              return (
                <Marker
                  key={`${code}-marker-${index}`}
                  position={[lat, lng]}
                  icon={makeMarkerIcon(role, isActive)}
                  ref={(ref) => {
                    if (ref) markerRefs.current[code] = ref;
                  }}
                  eventHandlers={{
                    click: () =>
                      setActiveCode(
                        activeCode === code ? null : code
                      ),
                  }}
                >
                  <Popup className="nm-popup">
                    <div className="nm-popup-inner">
                      <div className="nm-popup-header">
                        <span className="nm-popup-code">
                          {code}
                        </span>

                        <span
                          className="nm-popup-role"
                          style={{
                            color: ROLE_COLORS[role] ?? ROLE_COLORS.spoke,
                            borderColor: `${ROLE_COLORS[role] ?? ROLE_COLORS.spoke}40`,
                            background:  `${ROLE_COLORS[role] ?? ROLE_COLORS.spoke}15`,
                          }}
                        >
                          {role}
                        </span>
                      </div>

                      <p className="nm-popup-name">
                        {ap.name || ap.airport_name || "Airport"}
                      </p>

                      <p className="nm-popup-city">
                        {ap.city || ap.region || ap.country || "Unknown location"}
                      </p>

                      {ap.flights != null && (
                        <div className="nm-popup-flights">
                          <strong>{ap.flights}</strong>
                          <span>daily flights</span>
                        </div>
                      )}
                    </div>
                  </Popup>
                </Marker>
              );
            })}

          </MapContainer>
        </div>

      </div>
    </div>
  );
}

export default NetworkMap;