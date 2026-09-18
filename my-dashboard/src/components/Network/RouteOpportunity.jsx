// RouteOpportunity.jsx

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faArrowTrendUp,
  faArrowTrendDown,
  faTriangleExclamation,
  faChartLine,
  faCoins,
  faGaugeHigh,
} from "@fortawesome/free-solid-svg-icons";
import "./RouteOpportunity.css";

/* ─────────────────────────────────────────
   FORMATTERS
───────────────────────────────────────── */

function formatNumber(value) {
  if (value == null) return "—";
  return Number(value).toLocaleString("en-IN");
}

function formatCurrency(value) {
  if (value == null) return "—";
  return `₹${Number(value).toLocaleString("en-IN")}`;
}

function formatCompact(value) {
  if (value == null) return "—";
  const n = Number(value);
  if (n >= 10_000_000) return `₹${(n / 10_000_000).toFixed(1)} Cr`;
  if (n >= 100_000)    return `₹${(n / 100_000).toFixed(1)} L`;
  return formatCurrency(value);
}

/* ─────────────────────────────────────────
   SCORE HELPERS
───────────────────────────────────────── */

function scoreColor(value) {
  const n = Number(value);
  if (n >= 70) return "#4ade80";
  if (n >= 40) return "#f59e0b";
  return "#f87171";
}

function scoreLabel(value) {
  const n = Number(value);
  if (n >= 70) return "Strong";
  if (n >= 40) return "Moderate";
  return "Weak";
}

/* ─────────────────────────────────────────
   RECOMMENDATION VARIANT
───────────────────────────────────────── */

function recommendationVariant(text) {
  if (!text) return "neutral";
  const lower = text.toLowerCase();
  if (
    lower.includes("launch") ||
    lower.includes("recommend") ||
    lower.includes("pursue")
  ) return "positive";
  if (
    lower.includes("caution") ||
    lower.includes("monitor") ||
    lower.includes("review")
  ) return "warning";
  if (
    lower.includes("avoid") ||
    lower.includes("not recommend") ||
    lower.includes("defer")
  ) return "negative";
  return "neutral";
}

/* ─────────────────────────────────────────
   SCORE BAR
───────────────────────────────────────── */

function ScoreBar({ label, value }) {
  const color = scoreColor(value);
  const pct   = Math.min(100, Math.max(0, Number(value) || 0));

  return (
    <div className="ro-score-item">
      <div className="ro-score-meta">
        <span className="ro-score-label">{label}</span>

        <div className="ro-score-right">
          <span
            className="ro-score-tag"
            style={{ color, borderColor: `${color}40`, background: `${color}12` }}
          >
            {scoreLabel(value)}
          </span>

          <strong
            className="ro-score-value"
            style={{ color }}
          >
            {value ?? "—"}
          </strong>
        </div>
      </div>

      <div className="ro-score-track">
        <div
          className="ro-score-fill"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   CAPACITY BAR
───────────────────────────────────────── */

function CapacityBar({ demand, capacity }) {
  if (!demand || !capacity) return null;

  const total   = Math.max(demand, capacity);
  const demPct  = (demand   / total) * 100;
  const capPct  = (capacity / total) * 100;
  const hasGap  = demand > capacity;

  return (
    <div className="ro-capacity-chart">
      <div className="ro-capacity-row">
        <span className="ro-capacity-track-label">Demand</span>

        <div className="ro-capacity-track">
          <div
            className="ro-capacity-fill ro-capacity-fill--demand"
            style={{ width: `${demPct}%` }}
          />
        </div>

        <span className="ro-capacity-track-value">
          {formatNumber(demand)}
        </span>
      </div>

      <div className="ro-capacity-row">
        <span className="ro-capacity-track-label">Capacity</span>

        <div className="ro-capacity-track">
          <div
            className="ro-capacity-fill ro-capacity-fill--capacity"
            style={{ width: `${capPct}%` }}
          />
        </div>

        <span className="ro-capacity-track-value">
          {formatNumber(capacity)}
        </span>
      </div>

      {hasGap && (
        <p className="ro-capacity-gap-note">
          Gap of{" "}
          <strong>
            {formatNumber(demand - capacity)}
          </strong>{" "}
          seats — unmet demand opportunity
        </p>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────
   ROUTE OPPORTUNITY
───────────────────────────────────────── */

function RouteOpportunity({ opportunity, loading, error }) {
  if (!opportunity && !loading && !error) return null;

  const variant      = recommendationVariant(opportunity?.recommendation);
  const profitSign   = Number(opportunity?.profit_opportunity) >= 0 ? "positive" : "negative";
  const overallScore = opportunity?.opportunity_score;

  return (
    <section className="ro-section">

      {/* ── Header ── */}

      <div className="ro-header">
        <div className="ro-header-left">
          <span className="ro-section-label">
            Route Opportunity
          </span>

          <h2>Market Opportunity</h2>

          {opportunity && (
            <p className="ro-header-sub">
              {opportunity.origin}

              <FontAwesomeIcon
                icon={faArrowRight}
                className="ro-header-arrow"
              />

              {opportunity.destination}

              <span className="ro-header-sep">·</span>

              Planning Year {opportunity.planning_year}
            </p>
          )}
        </div>

        {overallScore != null && (
          <div className="ro-score-hero">
            <span>Opportunity Score</span>

            <strong style={{ color: scoreColor(overallScore) }}>
              {overallScore}
            </strong>

            <span
              className="ro-score-hero-tag"
              style={{
                color: scoreColor(overallScore),
                background: `${scoreColor(overallScore)}15`,
                borderColor: `${scoreColor(overallScore)}40`,
              }}
            >
              {scoreLabel(overallScore)}
            </span>
          </div>
        )}
      </div>

      {/* ── Recommendation banner ── */}

      {opportunity?.recommendation && (
        <div className={`ro-recommendation ro-recommendation--${variant}`}>
          <FontAwesomeIcon
            icon={
              variant === "positive"
                ? faArrowTrendUp
                : variant === "negative"
                ? faArrowTrendDown
                : faGaugeHigh
            }
          />

          <span>{opportunity.recommendation}</span>
        </div>
      )}

      {/* ── Loading ── */}

      {loading && (
        <div className="ro-state">
          <div className="ro-spinner" />
          <span>Loading opportunity analysis…</span>
        </div>
      )}

      {/* ── Error ── */}

      {error && (
        <div className="ro-error">
          <FontAwesomeIcon icon={faTriangleExclamation} />
          <span>{error}</span>
        </div>
      )}

      {/* ── Content ── */}

      {!loading && !error && opportunity && (
        <div className="ro-body">

          {/* Demand & Capacity */}

          <div className="ro-card">
            <div className="ro-card-header">
              <div className="ro-card-icon">
                <FontAwesomeIcon icon={faChartLine} />
              </div>

              <div>
                <span className="ro-card-label">
                  Demand & Capacity
                </span>

                <h3>Market Capacity Profile</h3>
              </div>
            </div>

            <div className="ro-metrics">
              <div className="ro-metric">
                <span>Forecast Demand</span>
                <strong>
                  {formatNumber(opportunity.forecast_demand)}
                </strong>
              </div>

              <div className="ro-metric">
                <span>Existing Capacity</span>
                <strong>
                  {formatNumber(opportunity.existing_capacity)}
                </strong>
              </div>

              <div className="ro-metric ro-metric--highlight">
                <span>Capacity Gap</span>
                <strong>
                  {formatNumber(opportunity.capacity_gap)}
                </strong>
              </div>

              <div className="ro-metric">
                <span>Expected Passengers</span>
                <strong>
                  {formatNumber(opportunity.expected_passengers)}
                </strong>
              </div>

              <div className="ro-metric">
                <span>Expected Load Factor</span>
                <strong>{opportunity.expected_load_factor}%</strong>
              </div>

              <div className="ro-metric">
                <span>Average Fare</span>
                <strong>
                  {formatCurrency(opportunity.average_fare)}
                </strong>
              </div>
            </div>

            <CapacityBar
              demand={opportunity.forecast_demand}
              capacity={opportunity.existing_capacity}
            />
          </div>

          {/* Financial */}

          <div className="ro-card">
            <div className="ro-card-header">
              <div className="ro-card-icon">
                <FontAwesomeIcon icon={faCoins} />
              </div>

              <div>
                <span className="ro-card-label">
                  Financial Opportunity
                </span>

                <h3>Route Economics</h3>
              </div>
            </div>

            <div className="ro-financial-grid">
              <div className="ro-financial-item">
                <span>Revenue Opportunity</span>
                <strong>
                  {formatCompact(opportunity.revenue_opportunity)}
                </strong>
              </div>

              <div className="ro-financial-item">
                <span>Estimated Operating Cost</span>
                <strong>
                  {formatCompact(opportunity.estimated_operating_cost)}
                </strong>
              </div>

              <div className={`ro-financial-item ro-financial-item--${profitSign}`}>
                <span>Profit Opportunity</span>
                <strong>
                  {formatCompact(opportunity.profit_opportunity)}
                </strong>
              </div>

              <div className={`ro-financial-item ro-financial-item--${profitSign}`}>
                <span>Profit Margin</span>
                <strong>{opportunity.profit_margin}%</strong>
              </div>
            </div>
          </div>

          {/* Scores */}

          <div className="ro-card">
            <div className="ro-card-header">
              <div className="ro-card-icon">
                <FontAwesomeIcon icon={faGaugeHigh} />
              </div>

              <div>
                <span className="ro-card-label">
                  Opportunity Assessment
                </span>

                <h3>Market Indicators</h3>
              </div>
            </div>

            <div className="ro-score-grid">
              {[
                { label: "Competition",   key: "competition_score"   },
                { label: "Demand",        key: "demand_score"        },
                { label: "Capacity Gap",  key: "capacity_gap_score"  },
                { label: "Fare",          key: "fare_score"          },
                { label: "Profitability", key: "profitability_score" },
                { label: "Strategic",     key: "strategic_score"     },
                { label: "Risk",          key: "risk_score"          },
                { label: "Opportunity",   key: "opportunity_score"   },
              ].map(({ label, key }) => (
                <ScoreBar
                  key={key}
                  label={label}
                  value={opportunity[key]}
                />
              ))}
            </div>
          </div>

        </div>
      )}

    </section>
  );
}

export default RouteOpportunity;