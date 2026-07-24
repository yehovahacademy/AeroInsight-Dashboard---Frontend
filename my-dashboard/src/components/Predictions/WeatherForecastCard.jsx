import  "./WeatherForecastCard.css";

const WEATHER_CODES = {
    0: "☀️",
    1: "🌤️",
    2: "⛅",
    3: "☁️",
    45: "🌫️",
    48: "🌫️",
    51: "🌦️",
    53: "🌦️",
    55: "🌧️",
    61: "🌧️",
    63: "🌧️",
    65: "🌧️",
    80: "🌦️",
    81: "🌧️",
    82: "🌧️",
    95: "⛈️",
    96: "⛈️",
    99: "⛈️"
};

function getWeatherEmoji(code) {
    return WEATHER_CODES[code] || "🌡️";
}

function getRainBadge(probability) {
    if (probability >= 70) {
        return "wx-rain-high";
    }

    if (probability >= 40) {
        return "wx-rain-medium";
    }

    return "wx-rain-low";
}


function WindArrow({ degrees }) {
  return (
    <span
      style={{
        display: "inline-block",
        marginRight: "6px",
        transform: `rotate(${degrees}deg)`,
        fontSize: "18px"
      }}
      ></span>
    );
  }


export default function WeatherForecastCard({ weather }) {
  if (!weather) {
    return (
      <div className="wx-panel wx-state">
        <div className="wx-spinner" aria-label="Loading forecast" />
        <span>Fetching weather briefing…</span>
      </div>
    );
  }

  const { airport, city, current, forecast } = weather;

  return (
    <div className="wx-panel">

      {/* ── Header ── */}
      <div className="wx-header">
        <div className="wx-icon-circle">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M19 16.9A5 5 0 0 0 18 7h-1.26a8 8 0 1 0-11.62 9" />
            <polyline points="13 11 9 17 15 17 11 23" />
          </svg>
        </div>
        <div>
          <div className="wx-title">Weather Briefing</div>
          <div className="wx-sub">📍 {city} · {airport}</div>
        </div>
      </div>

      {/* ── Current conditions ── */}
      <div className="wx-section-label">Current conditions</div>
      <div className="wx-current">

        <div className="wx-current-primary">
          <span className="wx-big-temp">{current.temperature}°C</span>
          <span className="wx-feels">Feels like {current.feels_like}°C</span>
        </div>

        <div className="wx-divider-v" />

        <div className="wx-metrics">
          <div className="wx-metric">
            <span className="wx-metric-label">💧 Humidity</span>
            <span className="wx-metric-val">{current.humidity}<span className="wx-metric-unit">%</span></span>
          </div>
          <div className="wx-metric">
            <span className="wx-metric-label">💨 Wind</span>
            <span className="wx-metric-val">
              {current.wind_speed}<span className="wx-metric-unit">km/h</span>
            </span>
          </div>
          <div className="wx-metric">
            <span className="wx-metric-label">💥 Gusts</span>
            <span className="wx-metric-val">{current.wind_gusts}<span className="wx-metric-unit">km/h</span></span>
          </div>
          <div className="wx-metric">
            <span className="wx-metric-label">🧭 Direction</span>
            <span className="wx-metric-val">
              <WindArrow degrees={current.wind_direction} />
              {current.wind_direction}°
            </span>
          </div>
          <div className="wx-metric">
            <span className="wx-metric-label">☁️ Cloud cover</span>
            <span className="wx-metric-val">{current.cloud_cover}<span className="wx-metric-unit">%</span></span>
          </div>
          <div className="wx-metric">
            <span className="wx-metric-label">⊙ Pressure</span>
            <span className="wx-metric-val">{current.pressure}<span className="wx-metric-unit">hPa</span></span>
          </div>
          <div className="wx-metric">
            <span className="wx-metric-label">🌧 Rain</span>
            <span className="wx-metric-val">{current.rain}<span className="wx-metric-unit">mm</span></span>
          </div>
        </div>

      </div>

      {/* ── 3-Day Forecast ── */}
      <div className="wx-section-label" style={{ marginTop: "1.25rem" }}>3-day forecast</div>
      <div className="wx-grid">
        {forecast.map((day, index) => (
          <div className="wx-card" key={index}>
            <span className="wx-day">{day.date}</span>
            <span className="wx-cond-icon">{getWeatherEmoji(day.condition)}</span>

            <span className="wx-temp-range">
              <span className="wx-temp-max">{day.max_temp}°</span>
              <span className="wx-temp-sep">/</span>
              <span className="wx-temp-min">{day.min_temp}°</span>
            </span>

            <div className="wx-card-row">
              <span className="wx-card-label">💨 Wind</span>
              <span className="wx-card-val">{day.wind_speed} km/h</span>
            </div>
            <div className="wx-card-row">
              <span className="wx-card-label">💥 Gusts</span>
              <span className="wx-card-val">{day.wind_gusts} km/h</span>
            </div>
            <div className="wx-card-row">
              <span className="wx-card-label">🌧 Rain</span>
              <span className="wx-card-val">{day.rainfall} mm</span>
            </div>

            <span className={`wx-badge ${getRainBadge(day.rain_probability)}`}>
              {day.rain_probability}% chance
            </span>

            <div className="wx-sun-row">
              <span>🌅 {day.sunrise.substring(11, 16)}</span>
              <span>🌇 {day.sunset.substring(11, 16)}</span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}