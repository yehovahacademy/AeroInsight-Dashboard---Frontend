// RouteEconomics.jsx

import { useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlane,
  faDroplet,
  faBuildingColumns,
  faUsers,
  faWrench,
  faEllipsis,
  faCircleCheck,
  faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";
import "./RouteEconomics.css";

/* ─────────────────────────────────────────
   HELPERS
───────────────────────────────────────── */

function formatCurrency(value) {
  if (value == null) return "—";
  return `₹${Number(value).toLocaleString("en-IN")}`;
}

function formatPercent(value, total) {
  if (!value || !total) return "—";
  return `${((value / total) * 100).toFixed(1)}%`;
}

/* ─────────────────────────────────────────
   COST COMPONENTS CONFIG
───────────────────────────────────────── */

const COST_COMPONENTS = [
  {
    key: "fuel_cost_component",
    label: "Fuel",
    icon: faDroplet,
    color: "#3b82f6",
  },
  {
    key: "airport_cost_component",
    label: "Airport",
    icon: faBuildingColumns,
    color: "#8b5cf6",
  },
  {
    key: "crew_cost_component",
    label: "Crew",
    icon: faUsers,
    color: "#06b6d4",
  },
  {
    key: "maintenance_cost_component",
    label: "Maintenance",
    icon: faWrench,
    color: "#f59e0b",
  },
  {
    key: "other_cost_component",
    label: "Other",
    icon: faEllipsis,
    color: "#64748b",
  },
];

/* ─────────────────────────────────────────
   STACKED BAR
───────────────────────────────────────── */

function CostStackedBar({ aircraft }) {
  const total = aircraft.estimated_cost_per_flight;

  if (!total) return null;

  return (
    <div className="re-stacked-bar">
      {COST_COMPONENTS.map((component) => {
        const value = aircraft[component.key];
        const pct = value ? (value / total) * 100 : 0;

        return (
          <div
            key={component.key}
            className="re-stacked-segment"
            style={{
              width: `${pct}%`,
              background: component.color,
            }}
            title={`${component.label}: ${formatCurrency(value)} (${pct.toFixed(1)}%)`}
          />
        );
      })}
    </div>
  );
}

/* ─────────────────────────────────────────
   COST BREAKDOWN DETAIL
───────────────────────────────────────── */

function CostBreakdown({ aircraft }) {
  const total = aircraft.estimated_cost_per_flight;

  return (
    <div className="re-breakdown">
      {COST_COMPONENTS.map((component) => {
        const value = aircraft[component.key];
        const pct = value && total
          ? (value / total) * 100
          : 0;

        return (
          <div key={component.key} className="re-breakdown-item">
            <div className="re-breakdown-left">
              <span
                className="re-breakdown-dot"
                style={{ background: component.color }}
              />

              <FontAwesomeIcon
                icon={component.icon}
                className="re-breakdown-icon"
                style={{ color: component.color }}
              />

              <span className="re-breakdown-label">
                {component.label}
              </span>
            </div>

            <div className="re-breakdown-right">
              <div
                className="re-breakdown-bar-track"
              >
                <div
                  className="re-breakdown-bar-fill"
                  style={{
                    width: `${pct}%`,
                    background: component.color,
                  }}
                />
              </div>

              <span className="re-breakdown-pct">
                {formatPercent(value, total)}
              </span>

              <span className="re-breakdown-value">
                {formatCurrency(value)}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ─────────────────────────────────────────
   ROUTE ECONOMICS
───────────────────────────────────────── */

function RouteEconomics({
  operatingCosts = [],
  loading,
  error,
}) {
  const [selectedAircraft, setSelectedAircraft] = useState(null);

  const costs = Array.isArray(operatingCosts) ? operatingCosts : [];

  /* ── Group & average by aircraft type ── */

  const aircraftSummary = useMemo(() => {
    const grouped = {};

    costs.forEach((record) => {
      const aircraft = record.aircraft_type;
      if (!aircraft) return;
      if (!grouped[aircraft]) grouped[aircraft] = [];
      grouped[aircraft].push(record);
    });

    return Object.entries(grouped)
      .map(([aircraft, records]) => {
        const average = (field) => {
          const values = records
            .map((r) => Number(r[field]))
            .filter(Number.isFinite);
          return values.length
            ? values.reduce((sum, v) => sum + v, 0) / values.length
            : null;
        };

        return {
          aircraft,
          recordCount: records.length,
          estimated_cost_per_flight:
            average("estimated_cost_per_flight"),
          fuel_cost_component:
            average("fuel_cost_component"),
          airport_cost_component:
            average("airport_cost_component"),
          crew_cost_component:
            average("crew_cost_component"),
          maintenance_cost_component:
            average("maintenance_cost_component"),
          other_cost_component:
            average("other_cost_component"),
          records,
        };
      })
      .sort(
        (a, b) =>
          (a.estimated_cost_per_flight ?? Infinity) -
          (b.estimated_cost_per_flight ?? Infinity)
      );
  }, [costs]);

  const cheapestAircraft = aircraftSummary[0]?.aircraft;

  const activeAircraft =
    aircraftSummary.find((s) => s.aircraft === selectedAircraft) ||
    aircraftSummary[0];

  /* ── Early exits ── */

  if (!costs.length && !loading && !error) return null;

  return (
    <section className="re-section">

      {/* ── Header ── */}

      <div className="re-section-header">
        <div>
          <span className="re-section-label">
            Route Economics
          </span>

          <h2>Operating Economics</h2>

          <p>
            Estimated cost breakdown across available
            aircraft types for this route.
          </p>
        </div>

        {costs.length > 0 && (
          <span className="re-record-badge">
            {costs.length} cost{" "}
            {costs.length === 1 ? "record" : "records"}
          </span>
        )}
      </div>

      {/* ── Loading ── */}

      {loading && (
        <div className="re-state">
          <div className="re-state-spinner" />
          <span>Loading operating costs…</span>
        </div>
      )}

      {/* ── Error ── */}

      {error && (
        <div className="re-error">
          <FontAwesomeIcon icon={faTriangleExclamation} />
          <span>{error}</span>
        </div>
      )}

      {/* ── Content ── */}

      {!loading && !error && aircraftSummary.length > 0 && (
        <div className="re-body">

          {/* ── Comparison Table ── */}

          <div className="re-card">
            <div className="re-card-header">
              <span className="re-card-label">
                Aircraft Comparison
              </span>

              <h3>Average Estimated Cost per Flight</h3>
            </div>

            <div className="re-table-wrapper">
              <table className="re-table">
                <thead>
                  <tr>
                    <th>Aircraft</th>
                    <th>Cost / Flight</th>
                    <th>Fuel</th>
                    <th>Airport</th>
                    <th>Crew</th>
                    <th>Maintenance</th>
                    <th>Other</th>
                  </tr>
                </thead>

                <tbody>
                  {aircraftSummary.map((item) => (
                    <tr
                      key={item.aircraft}
                      className={
                        activeAircraft?.aircraft === item.aircraft
                          ? "re-row-active"
                          : ""
                      }
                      onClick={() =>
                        setSelectedAircraft(item.aircraft)
                      }
                    >
                      <td>
                        <div className="re-aircraft-cell">
                          <FontAwesomeIcon
                            icon={faPlane}
                            className="re-aircraft-icon"
                          />

                          <strong>{item.aircraft}</strong>

                          {item.aircraft === cheapestAircraft && (
                            <span className="re-cheapest-badge">
                              <FontAwesomeIcon
                                icon={faCircleCheck}
                              />
                              Lowest cost
                            </span>
                          )}
                        </div>
                      </td>

                      <td>
                        <strong className="re-cost-primary">
                          {formatCurrency(
                            item.estimated_cost_per_flight
                          )}
                        </strong>
                      </td>

                      <td>
                        {formatCurrency(item.fuel_cost_component)}
                      </td>

                      <td>
                        {formatCurrency(
                          item.airport_cost_component
                        )}
                      </td>

                      <td>
                        {formatCurrency(item.crew_cost_component)}
                      </td>

                      <td>
                        {formatCurrency(
                          item.maintenance_cost_component
                        )}
                      </td>

                      <td>
                        {formatCurrency(item.other_cost_component)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ── Selected Aircraft Detail ── */}

          {activeAircraft && (
            <div className="re-card re-detail-card">

              <div className="re-detail-header">
                <div>
                  <span className="re-card-label">
                    Cost Breakdown
                  </span>

                  <h3>{activeAircraft.aircraft}</h3>

                  <p>
                    Average of {activeAircraft.recordCount}{" "}
                    operating cost{" "}
                    {activeAircraft.recordCount === 1
                      ? "record"
                      : "records"}
                  </p>
                </div>

                <div className="re-total-cost">
                  <span>Total Cost / Flight</span>

                  <strong>
                    {formatCurrency(
                      activeAircraft.estimated_cost_per_flight
                    )}
                  </strong>
                </div>
              </div>

              <CostStackedBar aircraft={activeAircraft} />

              <CostBreakdown aircraft={activeAircraft} />

            </div>
          )}

        </div>
      )}

    </section>
  );
}

export default RouteEconomics;