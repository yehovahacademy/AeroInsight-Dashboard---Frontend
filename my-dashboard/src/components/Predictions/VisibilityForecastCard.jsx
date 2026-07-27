import "./VisibilityForecastCard.css";

function VisibilityForecastCard({ visibility }) {
    if (!visibility || visibility.length === 0) return null;

    return (
        <div className="visibility-card">

            <div className="visibility-header">
                <span className="visibility-icon">🌫️</span>
                <span className="visibility-label">Visibility Forecast</span>
            </div>

            <ul className="visibility-list">
                {visibility.map((item, index) => (
                    <li key={index} className="visibility-row">

                        <span className="visibility-time">
                            {new Date(item.time).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                            })}
                        </span>

                        <span className="visibility-km">
                            {item.visibility_km}
                            <span className="visibility-unit"> km</span>
                        </span>

                        <span className={`visibility-badge ${item.fog_risk.toLowerCase()}`}>
                            {item.fog_risk}
                        </span>

                    </li>
                ))}
            </ul>

        </div>
    );
}

export default VisibilityForecastCard;