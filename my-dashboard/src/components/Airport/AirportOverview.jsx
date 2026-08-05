import "./AirportOverview.css";

const AIRPORT_TYPE_LABELS = {
  large_airport: "Large Airport",
  medium_airport: "Medium Airport",
  small_airport: "Small Airport",
  heliport: "Heliport",
  seaplane_base: "Seaplane Base",
  closed: "Closed",
};

const STATUS_CONFIG = {
  large_airport: { color: "var(--ao-blue)", dot: "#22c55e" },
  medium_airport: { color: "var(--ao-orange)", dot: "#f59e0b" },
  small_airport: { color: "#6b7280", dot: "#6b7280" },
  default: { color: "#6b7280", dot: "#9ca3af" },
};

function CoordBadge({ label, value }) {
  return (
    <div className="ao-coord">
      <span className="ao-coord-label">{label}</span>
      <span className="ao-coord-value">{value.toFixed(4)}°</span>
    </div>
  );
}

function MetaField({ label, value, mono = false }) {
  if (!value && value !== 0) return null;
  return (
    <div className="ao-field">
      <p className="ao-field-label">{label}</p>
      <p className={`ao-field-value${mono ? " ao-field-value--mono" : ""}`}>
        {value}
      </p>
    </div>
  );
}

function AirportOverview({ airport }) {
  if (!airport) return null;

  const typeLabel =
    AIRPORT_TYPE_LABELS[airport.airport_type] || airport.airport_type;
  const statusCfg =
    STATUS_CONFIG[airport.airport_type] || STATUS_CONFIG.default;

  const hasCoords =
    typeof airport.latitude === "number" &&
    typeof airport.longitude === "number";

  const googleMapsUrl =
    hasCoords
      ? `https://maps.google.com/?q=${airport.latitude},${airport.longitude}`
      : null;

  return (
    <div className="ao-card">
      {/* Header */}
      <div className="ao-header">
        <div className="ao-header-left">
          <div className="ao-iata-badge">{airport.iata}</div>
          <div className="ao-header-info">
            <h2 className="ao-name">{airport.name}</h2>
            <p className="ao-location">
              <span className="ao-location-icon">📍</span>
              {airport.city}, {airport.country}
            </p>
          </div>
        </div>
        <div className="ao-header-right">
          <span
            className="ao-type-badge"
            style={{ borderColor: statusCfg.color, color: statusCfg.color }}
          >
            <span
              className="ao-type-dot"
              style={{ background: statusCfg.dot }}
            />
            {typeLabel.toUpperCase()}
          </span>
          {airport.icao && (
            <span className="ao-icao-pill">{airport.icao}</span>
          )}
        </div>
      </div>

      {/* Divider */}
      <div className="ao-divider" />

      {/* Core Info Grid */}
      <div className="ao-section">
        <p className="ao-section-label">Airport Details</p>
        <div className="ao-grid">
          <MetaField label="IATA Code" value={airport.iata} mono />
          <MetaField label="ICAO Code" value={airport.icao} mono />
          <MetaField label="Airport Type" value={typeLabel} />
          <MetaField label="Timezone" value={airport.timezone} />
          <MetaField
            label="Elevation"
            value={airport.altitude != null ? `${airport.altitude} ft` : null}
          />
          <MetaField label="Country" value={airport.country} />
          {airport.region && (
            <MetaField label="Region" value={airport.region} />
          )}
          {airport.municipality && (
            <MetaField label="Municipality" value={airport.municipality} />
          )}
          {airport.scheduled_service != null && (
            <MetaField
              label="Scheduled Service"
              value={airport.scheduled_service ? "Yes" : "No"}
            />
          )}
          {airport.runways != null && (
            <MetaField label="Runways" value={airport.runways} />
          )}
        </div>
      </div>

      {/* Coordinates */}
      {hasCoords && (
        <>
          <div className="ao-divider" />
          <div className="ao-section">
            <p className="ao-section-label">Coordinates</p>
            <div className="ao-coords-row">
              <CoordBadge label="LAT" value={airport.latitude} />
              <CoordBadge label="LON" value={airport.longitude} />
              {googleMapsUrl && (
                <a
                  className="ao-map-link"
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Open in Maps ↗
                </a>
              )}
            </div>
          </div>
        </>
      )}

      {/* Identifiers / Links */}
      {(airport.wikipedia_link || airport.home_link) && (
        <>
          <div className="ao-divider" />
          <div className="ao-section">
            <p className="ao-section-label">Links</p>
            <div className="ao-links">
              {airport.home_link && (
                <a
                  className="ao-link"
                  href={airport.home_link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Official Website ↗
                </a>
              )}
              {airport.wikipedia_link && (
                <a
                  className="ao-link"
                  href={airport.wikipedia_link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Wikipedia ↗
                </a>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default AirportOverview;