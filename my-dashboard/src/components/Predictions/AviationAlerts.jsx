import "./AviationAlerts.css";

function AviationAlerts({ alerts }) {

    const isEmpty = !alerts || alerts.length === 0;

    return (
        <div className="alerts-card">

            <div className="alerts-header">
                <span className="alerts-icon">🚨</span>
                <span className="alerts-label">Aviation Alerts</span>
                {!isEmpty && (
                    <span className="alerts-count">{alerts.length}</span>
                )}
            </div>

            {isEmpty ? (
                <div className="alerts-empty">
                    <span className="alerts-empty-dot" />
                    <span className="alerts-empty-text">No active alerts</span>
                </div>
            ) : (
                <ul className="alerts-list">
                    {alerts.map((alert, index) => (
                        <li
                            key={index}
                            className={`alert-item ${alert.severity.toLowerCase()}`}
                        >
                            <span className="alert-item-icon">{alert.icon}</span>
                            <div className="alert-item-body">
                                <span className="alert-item-title">{alert.title}</span>
                                <span className="alert-item-severity">{alert.severity} Severity</span>
                            </div>
                            <span className="alert-item-badge">{alert.severity}</span>
                        </li>
                    ))}
                </ul>
            )}

        </div>
    );
}

export default AviationAlerts;