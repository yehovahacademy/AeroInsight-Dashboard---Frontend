import "./AirportWeather.css";

function AirportWeather({ weather }) {
    if (!weather) return null;

    const getWeatherIcon = (condition) => {
        switch (condition.toLowerCase()) {
            case "sunny":           return "☀️";
            case "partly cloudy":   return "⛅";
            case "cloudy":          return "☁️";
            case "rain":            return "🌧️";
            case "storm":           return "⛈️";
            default:                return "🌤️";
        }
    };

    const getSeverity = (condition) => {
        switch (condition.toLowerCase()) {
            case "storm":   return "aw-badge--danger";
            case "rain":    return "aw-badge--warning";
            case "cloudy":  return "aw-badge--neutral";
            default:        return "aw-badge--clear";
        }
    };

    return (
        <div className="aw-card">

            {/* ── Header ── */}
            <div className="aw-header">
                <div>
                    <p className="aw-label">Live conditions</p>
                    <h2 className="aw-title">Current weather</h2>
                </div>
                <div className={`aw-badge ${getSeverity(weather.condition)}`}>
                    <span className="aw-badge-icon">{getWeatherIcon(weather.condition)}</span>
                    {weather.condition}
                </div>
            </div>

            {/* ── Temperature hero ── */}
            <div className="aw-temp-hero">
                <span className="aw-temp-value">{weather.temperature}°</span>
                <span className="aw-temp-unit">C</span>
            </div>

            {/* ── Stats grid ── */}
            <div className="aw-grid">
                <div className="aw-item">
                    <span className="aw-item-icon">💧</span>
                    <span className="aw-item-label">Humidity</span>
                    <span className="aw-item-value">{weather.humidity}<span className="aw-item-unit">%</span></span>
                </div>
                <div className="aw-item">
                    <span className="aw-item-icon">🌬️</span>
                    <span className="aw-item-label">Wind speed</span>
                    <span className="aw-item-value">{weather.wind_speed}<span className="aw-item-unit">km/h</span></span>
                </div>
                <div className="aw-item">
                    <span className="aw-item-icon">👁️</span>
                    <span className="aw-item-label">Visibility</span>
                    <span className="aw-item-value">{weather.visibility}<span className="aw-item-unit">km</span></span>
                </div>
            </div>

        </div>
    );
}

export default AirportWeather;