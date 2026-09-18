function CompetitionAnalysis({
  competition,
  fares,
  loading,
  error,
}) {
  if (!competition.length && !fares.length && !loading) {
    return null;
  }

  return (
    <section className="competition-analysis">
      <header className="section-header">
        <span className="section-eyebrow">Competition & Fares</span>
        <h2>Competitive Market Analysis</h2>
        <p>
          Overview of competitive presence and fare records for the selected market.
        </p>
      </header>

      {loading && (
        <div className="competition-loading">
          Loading competition data...
        </div>
      )}

      {error && (
        <div className="competition-error" role="alert">
          <strong>Unable to load competition data</strong>
          <span>{error}</span>
        </div>
      )}

      {!loading && !error && (
        <div className="competition-summary">
          <div className="competition-metric">
            <span className="metric-label">Competition Records</span>
            <strong className="metric-value">{competition.length}</strong>
            <span className="metric-subtext">Active competitors</span>
          </div>

          <div className="competition-metric">
            <span className="metric-label">Fare Records</span>
            <strong className="metric-value">{fares.length}</strong>
            <span className="metric-subtext">Available fare points</span>
          </div>
        </div>
      )}
    </section>
  );
}

export default CompetitionAnalysis;