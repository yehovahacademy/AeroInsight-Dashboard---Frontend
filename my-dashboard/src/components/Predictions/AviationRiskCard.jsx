import "./AviationRiskCard.css";

function AviationRiskCard({ risk }) {
    if (!risk) return null;

    return (
        <div className={`aviation-risk-card ${risk.color}`}>
            <div className="risk-header">
                <span className="risk-icon">✈</span>
                <span className="risk-label">Aviation Risk</span>
            </div>

            <div className="risk-body">
                <div className="risk-level">{risk.level}</div>

                <div className="risk-score-bar">
                    <div
                        className="risk-score-fill"
                        style={{ width: `${risk.score}%` }}
                    />
                </div>

                <div className="risk-score-text">Score: {risk.score} / 100</div>
            </div>

            <p className="risk-message">{risk.message}</p>
        </div>
    );
}

export default AviationRiskCard;