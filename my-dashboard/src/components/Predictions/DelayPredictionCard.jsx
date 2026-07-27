import "./DelayPredictionCard.css";

function DelayPredictionCard({ prediction }) {
    if (!prediction) return null;

    return (
        <div className={`delay-card ${prediction.risk?.toLowerCase()}`}>

            <div className="delay-header">
                <span className="delay-icon">🛫</span>
                <span className="delay-label">Flight Delay Prediction</span>
            </div>

            <div className="delay-body">
                <div className="delay-risk">{prediction.risk}</div>

                <div className="delay-score-bar">
                    <div
                        className="delay-score-fill"
                        style={{ width: `${prediction.probability}%` }}
                    />
                </div>

                <div className="delay-meta">
                    <span className="delay-meta-item">
                        <span className="delay-meta-label">Probability</span>
                        <span className="delay-meta-val">{prediction.probability}%</span>
                    </span>
                    <span className="delay-meta-divider" />
                    <span className="delay-meta-item">
                        <span className="delay-meta-label">Expected Delay</span>
                        <span className="delay-meta-val">{prediction.expected_delay}</span>
                    </span>
                </div>
            </div>

            <div className="delay-reasons">
                <span className="delay-reasons-label">Contributing Factors</span>
                <ul className="delay-reasons-list">
                    {prediction.reasons.map((reason, index) => (
                        <li key={index} className="delay-reason-item">
                            <span className="delay-reason-dot" />
                            {reason}
                        </li>
                    ))}
                </ul>
            </div>

        </div>
    );
}

export default DelayPredictionCard;