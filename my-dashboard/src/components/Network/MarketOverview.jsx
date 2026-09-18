import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faRoute,
  faRulerHorizontal,
  faGlobeAsia,
  faChartPie,
} from "@fortawesome/free-solid-svg-icons";

import "./MarketOverview.css";

function MarketOverview({
  market,
  loading,
  error,
}) {
  if (!market && !loading && !error) {
    return null;
  }

  if (loading) {
    return (
      <section className="np-market-overview">
        <div className="np-section-header">
          <span className="np-section-label">
            MARKET OVERVIEW
          </span>

          <h2>Loading market data...</h2>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="np-market-overview">
        <div className="np-error">
          {error}
        </div>
      </section>
    );
  }

  return (
    <section className="np-market-overview">
      <div className="np-section-header">
        <div>
          <span className="np-section-label">
            MARKET OVERVIEW
          </span>

          <h2>
            {market.origin} → {market.destination}
          </h2>

          <p>
            Market profile and passenger mix
          </p>
        </div>

        <span className="np-market-id">
          {market.market_id}
        </span>
      </div>

      <div className="np-market-grid">

        <div className="np-market-card">
          <div className="np-market-card-icon">
            <FontAwesomeIcon icon={faRoute} />
          </div>

          <div>
            <span>Route</span>
            <strong>
              {market.origin} → {market.destination}
            </strong>
          </div>
        </div>

        <div className="np-market-card">
          <div className="np-market-card-icon">
            <FontAwesomeIcon
              icon={faRulerHorizontal}
            />
          </div>

          <div>
            <span>Distance</span>
            <strong>
              {market.distance_km?.toLocaleString()} km
            </strong>
          </div>
        </div>

        <div className="np-market-card">
          <div className="np-market-card-icon">
            <FontAwesomeIcon icon={faGlobeAsia} />
          </div>

          <div>
            <span>Market Region</span>
            <strong>
              {market.market_region}
            </strong>
          </div>
        </div>

        <div className="np-market-card">
          <div className="np-market-card-icon">
            <FontAwesomeIcon icon={faChartPie} />
          </div>

          <div>
            <span>Market Type</span>
            <strong>
              {market.market_type}
            </strong>
          </div>
        </div>

      </div>

      <div className="np-passenger-mix">
        <div className="np-passenger-mix-header">
          <div>
            <span className="np-section-label">
              PASSENGER MIX
            </span>

            <h3>Market Demand Composition</h3>
          </div>
        </div>

        <div className="np-mix-grid">

          <div className="np-mix-item">
            <span>Business</span>

            <strong>
              {market.business_share}%
            </strong>
          </div>

          <div className="np-mix-item">
            <span>Leisure</span>

            <strong>
              {market.leisure_share}%
            </strong>
          </div>

          <div className="np-mix-item">
            <span>Connecting</span>

            <strong>
              {market.connecting_share}%
            </strong>
          </div>

        </div>
      </div>
    </section>
  );
}

export default MarketOverview;