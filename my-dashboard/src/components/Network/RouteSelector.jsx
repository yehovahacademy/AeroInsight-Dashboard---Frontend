import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faRightLeft,
  faRoute,
  faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";

function RouteSelector({
  airports,
  airportsLoading,
  airportsError,
  origin,
  destination,
  onOriginChange,
  onDestinationChange,
  onSwap,
}) {
  const airportList = Array.isArray(airports)
    ? airports
    : [];

  const validRoute =
    origin &&
    destination &&
    origin !== destination;

  return (
    <section className="np-section np-route-selection">

      <div className="np-section-header">
        <span className="np-section-label">
          ROUTE SELECTION
        </span>

        <h2>Select a Market</h2>

        <p>
          Choose an origin and destination to begin
          network analysis.
        </p>
      </div>

      {airportsError && (
        <div className="np-error">
          <FontAwesomeIcon
            icon={faTriangleExclamation}
          />
          {airportsError}
        </div>
      )}

      <div className="np-route-form">

        <div className="np-field">
          <label htmlFor="origin">
            Origin
          </label>

          <select
            id="origin"
            value={origin}
            onChange={(event) =>
              onOriginChange(event.target.value)
            }
            disabled={airportsLoading}
          >
            <option value="">
              {airportsLoading
                ? "Loading airports..."
                : "Select origin"}
            </option>

            {airportList.map((airport) => (
              <option
                key={airport.iata}
                value={airport.iata}
              >
                {airport.city
                  ? `${airport.city} (${airport.iata})`
                  : airport.iata}
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          className="np-swap-button"
          onClick={onSwap}
          disabled={!origin && !destination}
        >
          <FontAwesomeIcon icon={faRightLeft} />
        </button>

        <div className="np-field">
          <label htmlFor="destination">
            Destination
          </label>

          <select
            id="destination"
            value={destination}
            onChange={(event) =>
              onDestinationChange(
                event.target.value
              )
            }
            disabled={airportsLoading}
          >
            <option value="">
              {airportsLoading
                ? "Loading airports..."
                : "Select destination"}
            </option>

            {airportList.map((airport) => (
              <option
                key={airport.iata}
                value={airport.iata}
              >
                {airport.city
                  ? `${airport.city} (${airport.iata})`
                  : airport.iata}
              </option>
            ))}
          </select>
        </div>

      </div>

      {validRoute && (
        <div className="np-selected-route">
          <FontAwesomeIcon icon={faRoute} />

          <strong>{origin}</strong>

          <FontAwesomeIcon icon={faArrowRight} />

          <strong>{destination}</strong>
        </div>
      )}

      {origin === destination && origin && (
        <div className="np-warning">
          <FontAwesomeIcon
            icon={faTriangleExclamation}
          />

          Origin and destination must be different.
        </div>
      )}

    </section>
  );
}

export default RouteSelector;