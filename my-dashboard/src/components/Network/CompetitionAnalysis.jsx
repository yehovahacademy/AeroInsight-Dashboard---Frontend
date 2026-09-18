function CompetitionAnalysis({
  competition,
  fares,
  loading,
  error,
}) {
  if (
    !competition.length &&
    !fares.length &&
    !loading
  ) {
    return null;
  }

  return (
    <section className="np-section">

      <span className="np-section-label">
        COMPETITION & FARES
      </span>

      <h2>Competitive Market Analysis</h2>

      {loading && (
        <p>Loading competition data...</p>
      )}

      {error && (
        <div className="np-error">
          {error}
        </div>
      )}

      {!loading && (
        <div className="np-card-grid">

          <div className="np-info-card">
            <span>Competition Records</span>

            <strong>
              {competition.length}
            </strong>
          </div>

          <div className="np-info-card">
            <span>Fare Records</span>

            <strong>
              {fares.length}
            </strong>
          </div>

        </div>
      )}

    </section>
  );
}

export default CompetitionAnalysis;