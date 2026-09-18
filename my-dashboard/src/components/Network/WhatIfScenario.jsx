import { useState } from "react";
import "./WhatIfScenario.css";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://aeroinsight-dashboard-backend.onrender.com";

const AIRCRAFT_TYPES = [
  "A320",
  "A321neo",
  "B737 MAX",
  "B777",
  "ATR 72",
];

const FLIGHTS_PER_DAY = [
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
];

export default function WhatIfScenario({
  origin,
  destination,
}) {
  const [aircraft, setAircraft] =
    useState("A320");

  const [flightsPerDay, setFlightsPerDay] =
    useState("3");

  const [loadFactor, setLoadFactor] =
    useState("0.85");

  const [averageFare, setAverageFare] =
    useState("10000");

  const [result, setResult] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState(null);

  const runScenario = async (event) => {
    event.preventDefault();

    if (!origin || !destination) {
      setError(
        "Please select an origin and destination first."
      );

      return;
    }

    try {
      setLoading(true);
      setError(null);
      setResult(null);

      const payload = {
        origin,
        destination,
        aircraft,
        flights_per_day: Number(
          flightsPerDay
        ),
        load_factor: Number(
          loadFactor
        ),
        average_fare: Number(
          averageFare
        ),
      };

      console.log(
        "WHAT-IF REQUEST:",
        payload
      );

      const response = await fetch(
        `${API_URL}/what-if/what-if`,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify(
            payload
          ),
        }
      );

      if (!response.ok) {
        throw new Error(
          `What-If API returned ${response.status}`
        );
      }

      const data =
        await response.json();

      console.log(
        "WHAT-IF API RESPONSE:",
        data
      );

      setResult(data);
    } catch (error) {
      console.error(
        "Failed to run What-If scenario:",
        error
      );

      setError(
        error.message ||
          "Failed to run scenario."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="what-if-scenario">
      <div className="section-header">
        <div>
          <span className="section-eyebrow">
            Network Planning
          </span>

          <h2>What-If Scenario</h2>

          <p>
            Test a proposed operating scenario
            for{" "}
            <strong>
              {origin && destination
                ? `${origin} → ${destination}`
                : "a selected route"}
            </strong>
            .
          </p>
        </div>
      </div>

      {!origin || !destination ? (
        <div className="scenario-empty">
          Select an origin and destination
          to run a scenario.
        </div>
      ) : (
        <div className="scenario-layout">

          {/* Input Panel */}

          <form
            className="scenario-form"
            onSubmit={runScenario}
          >
            <div className="form-header">
              <h3>Scenario Inputs</h3>

              <span>
                {origin} → {destination}
              </span>
            </div>

            <div className="form-group">
              <label htmlFor="aircraft">
                Aircraft
              </label>

              <select
                id="aircraft"
                value={aircraft}
                onChange={(event) =>
                  setAircraft(
                    event.target.value
                  )
                }
              >
                {AIRCRAFT_TYPES.map(
                  (type) => (
                    <option
                      key={type}
                      value={type}
                    >
                      {type}
                    </option>
                  )
                )}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="flights">
                Flights per day
              </label>

              <select
                id="flights"
                value={flightsPerDay}
                onChange={(event) =>
                  setFlightsPerDay(
                    event.target.value
                  )
                }
              >
                {FLIGHTS_PER_DAY.map(
                  (number) => (
                    <option
                      key={number}
                      value={number}
                    >
                      {number}
                    </option>
                  )
                )}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="loadFactor">
                Load factor
              </label>

              <input
                id="loadFactor"
                type="number"
                min="0"
                max="1"
                step="0.01"
                value={loadFactor}
                onChange={(event) =>
                  setLoadFactor(
                    event.target.value
                  )
                }
              />

              <span className="input-help">
                Enter a value between 0 and 1.
                Example: 0.85 = 85%
              </span>
            </div>

            <div className="form-group">
              <label htmlFor="averageFare">
                Average fare (₹)
              </label>

              <input
                id="averageFare"
                type="number"
                min="0"
                step="500"
                value={averageFare}
                onChange={(event) =>
                  setAverageFare(
                    event.target.value
                  )
                }
              />
            </div>

            {error && (
              <div className="scenario-error">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="run-scenario-button"
              disabled={loading}
            >
              {loading
                ? "Running Scenario..."
                : "Run Scenario"}
            </button>
          </form>

          {/* Result Panel */}

          <div className="scenario-result">

            {!result && !loading && (
              <div className="scenario-placeholder">
                <h3>
                  Scenario Results
                </h3>

                <p>
                  Configure the operating
                  assumptions and run the
                  scenario to see the
                  estimated results.
                </p>
              </div>
            )}

            {loading && (
              <div className="scenario-placeholder">
                <h3>
                  Calculating...
                </h3>

                <p>
                  The backend is evaluating
                  your proposed scenario.
                </p>
              </div>
            )}

            {result && (
              <>
                <div className="result-header">
                  <div>
                    <span className="section-eyebrow">
                      Scenario Output
                    </span>

                    <h3>
                      {result.origin} →{" "}
                      {result.destination}
                    </h3>
                  </div>

                  <span className="aircraft-badge">
                    {result.aircraft}
                  </span>
                </div>

                <div className="result-grid">

                  <div className="result-card">
                    <span>
                      Flights / Day
                    </span>

                    <strong>
                      {
                        result.flights_per_day
                      }
                    </strong>
                  </div>

                  <div className="result-card">
                    <span>
                      Load Factor
                    </span>

                    <strong>
                      {(
                        Number(
                          result.load_factor
                        ) * 100
                      ).toFixed(0)}
                      %
                    </strong>
                  </div>

                  <div className="result-card">
                    <span>
                      Average Fare
                    </span>

                    <strong>
                      ₹
                      {Number(
                        result.average_fare
                      ).toLocaleString(
                        "en-IN"
                      )}
                    </strong>
                  </div>

                  <div className="result-card">
                    <span>
                      Daily Capacity
                    </span>

                    <strong>
                      {Number(
                        result.daily_capacity
                      ).toLocaleString(
                        "en-IN"
                      )}
                    </strong>
                  </div>

                  <div className="result-card">
                    <span>
                      Estimated Passengers
                    </span>

                    <strong>
                      {Number(
                        result.estimated_passengers
                      ).toLocaleString(
                        "en-IN"
                      )}
                    </strong>
                  </div>

                  <div className="result-card result-card--revenue">
                    <span>
                      Daily Revenue
                    </span>

                    <strong>
                      ₹
                      {Number(
                        result.daily_revenue
                      ).toLocaleString(
                        "en-IN"
                      )}
                    </strong>
                  </div>

                </div>
              </>
            )}

          </div>
        </div>
      )}
    </section>
  );
}

