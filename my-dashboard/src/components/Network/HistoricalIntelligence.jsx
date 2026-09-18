function HistoricalIntelligence({
  traffic,
  demand,
  capacity,
  loading,
  error,
}) {
  if (!traffic.length && !demand.length && !capacity.length) {
    if (!loading) return null;
  }

  return (
    <section className="np-section">

      <div className="np-section-header">
        <span className="np-section-label">
          HISTORICAL MARKET INTELLIGENCE
        </span>

        <h2>Traffic, Demand & Capacity</h2>

        <p>
          Historical market performance used to
          understand route behaviour.
        </p>
      </div>

      {loading && (
        <p>Loading historical intelligence...</p>
      )}

      {error && (
        <div className="np-error">
          {error}
        </div>
      )}

      {!loading && (
        <div className="np-card-grid">

          <div className="np-info-card">
            <span>Traffic Records</span>
            <strong>
              {traffic.length}
            </strong>
          </div>

          <div className="np-info-card">
            <span>Demand Records</span>
            <strong>
              {demand.length}
            </strong>
          </div>

          <div className="np-info-card">
            <span>Capacity Records</span>
            <strong>
              {capacity.length}
            </strong>
          </div>

        </div>
      )}

    </section>
  );
}

export default HistoricalIntelligence;