// HistoricalIntelligence.jsx

import { useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowTrendUp,
  faArrowTrendDown,
  faMinus,
  faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";
import "./HistoricalIntelligence.css";

/* ─────────────────────────────────────────
   FORMATTERS
───────────────────────────────────────── */

const formatMonth = (year, month) => {
  if (!year || !month) return "—";
  return new Date(year, month - 1).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
};

const formatMonthShort = (year, month) => {
  if (!year || !month) return "—";
  return new Date(year, month - 1).toLocaleDateString("en-US", {
    month: "short",
  });
};

const formatNumber = (value) => {
  if (value == null || Number.isNaN(Number(value))) return "—";
  return Number(value).toLocaleString();
};

const formatPercent = (value) => {
  if (value == null || Number.isNaN(Number(value))) return "—";
  return `${Number(value).toFixed(1)}%`;
};

/* ─────────────────────────────────────────
   LOAD FACTOR COLOR
───────────────────────────────────────── */

function loadFactorColor(value) {
  const n = Number(value);
  if (Number.isNaN(n)) return "#64748b";
  if (n >= 75) return "#4ade80";
  if (n >= 50) return "#f59e0b";
  return "#f87171";
}

/* ─────────────────────────────────────────
   TREND DELTA
───────────────────────────────────────── */

function getTrend(sorted, field) {
  if (sorted.length < 2) return null;
  const curr = Number(sorted[sorted.length - 1]?.[field]);
  const prev = Number(sorted[sorted.length - 2]?.[field]);
  if (!Number.isFinite(curr) || !Number.isFinite(prev) || prev === 0) return null;
  const delta = ((curr - prev) / prev) * 100;
  return delta;
}

function TrendBadge({ delta }) {
  if (delta == null) return null;
  const up = delta > 0;
  const flat = Math.abs(delta) < 0.05;

  if (flat) {
    return (
      <span className="hi-trend hi-trend--flat">
        <FontAwesomeIcon icon={faMinus} />
        <span>0.0%</span>
      </span>
    );
  }

  return (
    <span className={`hi-trend hi-trend--${up ? "up" : "down"}`}>
      <FontAwesomeIcon icon={up ? faArrowTrendUp : faArrowTrendDown} />
      <span>{Math.abs(delta).toFixed(1)}%</span>
    </span>
  );
}

/* ─────────────────────────────────────────
   SPARKLINE
───────────────────────────────────────── */

function Sparkline({ data, field, color = "#3b82f6" }) {
  if (!data?.length) return null;

  const values = data.map((d) => Number(d[field])).filter(Number.isFinite);
  if (values.length < 2) return null;

  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;

  const W = 80;
  const H = 28;
  const step = W / (values.length - 1);

  const points = values
    .map((v, i) => {
      const x = i * step;
      const y = H - ((v - min) / range) * H;
      return `${x},${y}`;
    })
    .join(" ");

  const lastX = (values.length - 1) * step;
  const lastY = H - ((values[values.length - 1] - min) / range) * H;

  return (
    <svg
      width={W}
      height={H}
      viewBox={`0 0 ${W} ${H}`}
      className="hi-sparkline"
      aria-hidden="true"
    >
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.6"
      />
      <circle cx={lastX} cy={lastY} r="2.5" fill={color} />
    </svg>
  );
}

/* ─────────────────────────────────────────
   METRIC CARD
───────────────────────────────────────── */

function MetricCard({ label, value, trend, sparkData, sparkField, sparkColor, isPercent }) {
  return (
    <div className="hi-metric-card">
      <div className="hi-metric-top">
        <span className="hi-metric-label">{label}</span>
        <TrendBadge delta={trend} />
      </div>

      <strong
        className="hi-metric-value"
        style={isPercent ? { color: loadFactorColor(value) } : undefined}
      >
        {isPercent ? formatPercent(value) : formatNumber(value)}
      </strong>

      <Sparkline
        data={sparkData}
        field={sparkField}
        color={sparkColor ?? "#3b82f6"}
      />
    </div>
  );
}

/* ─────────────────────────────────────────
   STATE PANEL
───────────────────────────────────────── */

function StatePanel({ loading, error, label }) {
  if (loading) {
    return (
      <div className="hi-state">
        <div className="hi-spinner" />
        <span>Loading {label.toLowerCase()}…</span>
      </div>
    );
  }
  if (error) {
    return (
      <div className="hi-state hi-state--error">
        <FontAwesomeIcon icon={faTriangleExclamation} />
        <span>Failed to load {label.toLowerCase()}.</span>
      </div>
    );
  }
  return null;
}

/* ─────────────────────────────────────────
   TABLE
───────────────────────────────────────── */

function DataTable({ columns, rows }) {
  return (
    <div className="hi-table-wrapper">
      <table className="hi-table">
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key}>{col.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              {columns.map((col) => (
                <td
                  key={col.key}
                  style={col.color ? { color: col.color(row[col.key]) } : undefined}
                >
                  {col.format ? col.format(row[col.key], row) : (row[col.key] ?? "—")}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ─────────────────────────────────────────
   TAB PANELS
───────────────────────────────────────── */

function TrafficPanel({ sorted, loading, error }) {
  const latest = sorted[sorted.length - 1];
  const state  = <StatePanel loading={loading} error={error} label="Traffic" />;
  if (state && (!sorted.length || loading || error)) return state;

  return (
    <>
      <div className="hi-metrics">
        <MetricCard
          label="Passengers"
          value={latest?.passengers}
          trend={getTrend(sorted, "passengers")}
          sparkData={sorted}
          sparkField="passengers"
          sparkColor="#3b82f6"
        />
        <MetricCard
          label="Flights"
          value={latest?.flights}
          trend={getTrend(sorted, "flights")}
          sparkData={sorted}
          sparkField="flights"
          sparkColor="#8b5cf6"
        />
        <MetricCard
          label="Available Seats"
          value={latest?.available_seats}
          trend={getTrend(sorted, "available_seats")}
          sparkData={sorted}
          sparkField="available_seats"
          sparkColor="#06b6d4"
        />
        <MetricCard
          label="Load Factor"
          value={latest?.load_factor}
          trend={getTrend(sorted, "load_factor")}
          sparkData={sorted}
          sparkField="load_factor"
          sparkColor={loadFactorColor(latest?.load_factor)}
          isPercent
        />
      </div>

      <DataTable
        columns={[
          {
            key: "period",
            label: "Period",
            format: (_, row) => formatMonth(row.year, row.month),
          },
          {
            key: "passengers",
            label: "Passengers",
            format: formatNumber,
          },
          {
            key: "flights",
            label: "Flights",
            format: formatNumber,
          },
          {
            key: "available_seats",
            label: "Avail. Seats",
            format: formatNumber,
          },
          {
            key: "load_factor",
            label: "Load Factor",
            format: formatPercent,
            color: loadFactorColor,
          },
        ]}
        rows={sorted.map((r) => ({ ...r, period: null }))}
      />
    </>
  );
}

function DemandPanel({ sorted, loading, error }) {
  const latest = sorted[sorted.length - 1];
  const state  = <StatePanel loading={loading} error={error} label="Demand" />;
  if (state && (!sorted.length || loading || error)) return state;

  return (
    <>
      <div className="hi-metrics">
        <MetricCard
          label="Total Demand"
          value={latest?.total_demand}
          trend={getTrend(sorted, "total_demand")}
          sparkData={sorted}
          sparkField="total_demand"
          sparkColor="#3b82f6"
        />
        <MetricCard
          label="Business"
          value={latest?.business_demand}
          trend={getTrend(sorted, "business_demand")}
          sparkData={sorted}
          sparkField="business_demand"
          sparkColor="#8b5cf6"
        />
        <MetricCard
          label="Leisure"
          value={latest?.leisure_demand}
          trend={getTrend(sorted, "leisure_demand")}
          sparkData={sorted}
          sparkField="leisure_demand"
          sparkColor="#06b6d4"
        />
        <MetricCard
          label="Connecting"
          value={latest?.connecting_demand}
          trend={getTrend(sorted, "connecting_demand")}
          sparkData={sorted}
          sparkField="connecting_demand"
          sparkColor="#f59e0b"
        />
      </div>

      <DataTable
        columns={[
          {
            key: "period",
            label: "Period",
            format: (_, row) => formatMonth(row.year, row.month),
          },
          { key: "total_demand",      label: "Total",      format: formatNumber },
          { key: "business_demand",   label: "Business",   format: formatNumber },
          { key: "leisure_demand",    label: "Leisure",    format: formatNumber },
          { key: "connecting_demand", label: "Connecting", format: formatNumber },
          {
            key: "seasonality_index",
            label: "Seasonality",
            format: (v) => v != null ? Number(v).toFixed(3) : "—",
          },
          {
            key: "demand_growth_index",
            label: "Growth Index",
            format: (v) => v != null ? Number(v).toFixed(2) : "—",
          },
        ]}
        rows={sorted.map((r) => ({ ...r, period: null }))}
      />
    </>
  );
}

function CapacityPanel({ sorted, loading, error }) {
  const latest = sorted[sorted.length - 1];
  const state  = <StatePanel loading={loading} error={error} label="Capacity" />;
  if (state && (!sorted.length || loading || error)) return state;

  return (
    <>
      <div className="hi-metrics">
        <MetricCard
          label="Existing Seats"
          value={latest?.existing_seats}
          trend={getTrend(sorted, "existing_seats")}
          sparkData={sorted}
          sparkField="existing_seats"
          sparkColor="#3b82f6"
        />
        <MetricCard
          label="Existing Flights"
          value={latest?.existing_flights}
          trend={getTrend(sorted, "existing_flights")}
          sparkData={sorted}
          sparkField="existing_flights"
          sparkColor="#8b5cf6"
        />
        <MetricCard
          label="Avg. Aircraft Size"
          value={latest?.average_aircraft_size}
          trend={getTrend(sorted, "average_aircraft_size")}
          sparkData={sorted}
          sparkField="average_aircraft_size"
          sparkColor="#06b6d4"
        />
        <MetricCard
          label="Avg. Load Factor"
          value={latest?.average_load_factor}
          trend={getTrend(sorted, "average_load_factor")}
          sparkData={sorted}
          sparkField="average_load_factor"
          sparkColor={loadFactorColor(latest?.average_load_factor)}
          isPercent
        />
      </div>

      <DataTable
        columns={[
          {
            key: "period",
            label: "Period",
            format: (_, row) => formatMonth(row.year, row.month),
          },
          { key: "existing_seats",        label: "Seats",        format: formatNumber },
          { key: "existing_flights",      label: "Flights",      format: formatNumber },
          { key: "average_aircraft_size", label: "Aircraft Size",format: formatNumber },
          {
            key: "average_load_factor",
            label: "Load Factor",
            format: formatPercent,
            color: loadFactorColor,
          },
        ]}
        rows={sorted.map((r) => ({ ...r, period: null }))}
      />
    </>
  );
}

/* ─────────────────────────────────────────
   HISTORICAL INTELLIGENCE
───────────────────────────────────────── */

const TABS = [
  { key: "traffic",  label: "Traffic"  },
  { key: "demand",   label: "Demand"   },
  { key: "capacity", label: "Capacity" },
];

function HistoricalIntelligence({
  traffic  = [],
  demand   = [],
  capacity = [],
  trafficLoading  = false,
  demandLoading   = false,
  capacityLoading = false,
  trafficError    = null,
  demandError     = null,
  capacityError   = null,
}) {
  const [activeTab, setActiveTab] = useState("traffic");

  const sortBy = (arr) =>
    [...arr].sort(
      (a, b) =>
        new Date(a.year, a.month - 1) -
        new Date(b.year, b.month - 1)
    );

  const sortedTraffic  = useMemo(() => sortBy(traffic),  [traffic]);
  const sortedDemand   = useMemo(() => sortBy(demand),   [demand]);
  const sortedCapacity = useMemo(() => sortBy(capacity), [capacity]);

  const anyData =
    traffic.length || demand.length || capacity.length;
  const anyLoading =
    trafficLoading || demandLoading || capacityLoading;
  const anyError =
    trafficError || demandError || capacityError;

  if (!anyData && !anyLoading && !anyError) return null;

  const counts = {
    traffic:  sortedTraffic.length,
    demand:   sortedDemand.length,
    capacity: sortedCapacity.length,
  };

  return (
    <section className="hi-section">

      {/* ── Header ── */}

      <div className="hi-header">
        <div>
          <span className="hi-section-label">
            Market Intelligence
          </span>

          <h2>Historical Market Intelligence</h2>

          <p>
            Traffic, demand and capacity indicators
            for the selected route.
          </p>
        </div>
      </div>

      {/* ── Tabs ── */}

      <div className="hi-tabs">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            className={`hi-tab ${activeTab === tab.key ? "hi-tab--active" : ""}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}

            {counts[tab.key] > 0 && (
              <span className="hi-tab-count">
                {counts[tab.key]}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ── Panel ── */}

      <div className="hi-panel">
        {activeTab === "traffic" && (
          <TrafficPanel
            sorted={sortedTraffic}
            loading={trafficLoading}
            error={trafficError}
          />
        )}

        {activeTab === "demand" && (
          <DemandPanel
            sorted={sortedDemand}
            loading={demandLoading}
            error={demandError}
          />
        )}

        {activeTab === "capacity" && (
          <CapacityPanel
            sorted={sortedCapacity}
            loading={capacityLoading}
            error={capacityError}
          />
        )}
      </div>

    </section>
  );
}

export default HistoricalIntelligence;