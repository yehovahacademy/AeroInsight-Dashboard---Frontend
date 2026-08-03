import "./AirportOverview.css";


function AirportOverview({ airport }) {
    if (!airport) return null;

    return (
        <div className="ao-card">
            <div className="ao-header">
                <div className="ao-header-left">
                    <div className="ao-iata-badge">{airport.iata}</div>
                    <div>
                        <p className="ao-name">{airport.name}</p>
                        <p className="ao-location">
                            <span className="ao-location-icon">📍</span>
                            {airport.city}, {airport.country}
                        </p>
                    </div>
                </div>
                <span className="ao-type-badge">{airport.airport_type}</span>
            </div>

            <div className="ao-grid">
                <div className="ao-field">
                    <p className="ao-field-label">IATA</p>
                    <p className="ao-field-value ao-field-value--mono">{airport.iata}</p>
                </div>
                <div className="ao-field">
                    <p className="ao-field-label">ICAO</p>
                    <p className="ao-field-value ao-field-value--mono">{airport.icao}</p>
                </div>
                <div className="ao-field">
                    <p className="ao-field-label">Airport type</p>
                    <p className="ao-field-value">{airport.airport_type}</p>
                </div>
                <div className="ao-field">
                    <p className="ao-field-label">Runways</p>
                    <p className="ao-field-value">{airport.runways}</p>
                </div>
                <div className="ao-field">
                    <p className="ao-field-label">Timezone</p>
                    <p className="ao-field-value ao-field-value--mono">{airport.timezone}</p>
                </div>
                <div className="ao-field">
                    <p className="ao-field-label">Elevation</p>
                    <p className="ao-field-value">{airport.elevation_ft} ft</p>
                </div>
                <div className="ao-field">
                    <p className="ao-field-label">City</p>
                    <p className="ao-field-value">{airport.city}</p>
                </div>
                <div className="ao-field">
                    <p className="ao-field-label">Country</p>
                    <p className="ao-field-value">{airport.country}</p>
                </div>
            </div>
        </div>
    );
}

export default AirportOverview;