import "./OperationsIntelligence.css";



const METRICS = [
  {
    label: "Demand Forecast",
    value: "HIGH",
    detail: "87% predicted demand",
  },
  {
    label: "Delay Risk",
    value: "MEDIUM",
    detail: "34% probability",
  },
  {
    label: "Weather Risk",
    value: "LOW",
    detail: "12% probability",
  },
  {
    label: "Operational Score",
    value: "82/100",
    detail: "Good operating conditions",
  },
];

function OperationMetric({ label, value, detail }) {
  return (
    <div className="operation-metric">
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{detail}</small>
    </div>
  );
}

function OperationsIntelligence() {
  return (
    <section className="operations-intelligence">
      <div className="operations-header">
        <div>
          <span className="section-label">PREDICTIVE ANALYTICS</span>
          <h2>Operations Intelligence</h2>
          <p>Predictive insights to support airline operational decisions.</p>
        </div>
        <div className="forecast-period">
          <span>Forecast</span>
          <strong>Next 7 Days</strong>
        </div>
      </div>

      <div className="operations-metrics">
        {METRICS.map((metric) => (
          <OperationMetric key={metric.label} {...metric} />
        ))}
      </div>

      <div className="operations-recommendation">
        <div className="recommendation-title">🤖 AeroInsight Recommendation</div>
        <p>
          Demand is expected to remain high over the forecast period. Consider
          increasing capacity during peak operating hours.
        </p>
      </div>
    </section>
  );
}

export default OperationsIntelligence;