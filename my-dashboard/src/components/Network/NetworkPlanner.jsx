import { useState, useEffect, useMemo, useRef } from "react";
import "./NetworkPlanner.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faRightLeft,
  faRoute,
  faPlane,
  faChartBar,
  faLightbulb,
  faCircleNotch,
  faTriangleExclamation,
  faFlask,
  faClockRotateLeft,
  faPlay,
  faPause,
  faLayerGroup,
} from "@fortawesome/free-solid-svg-icons";

import {
  MapContainer,
  TileLayer,
  Popup,
  Polyline,
  CircleMarker,
  useMap,
} from "react-leaflet";

import "leaflet/dist/leaflet.css";

import RouteCards from "./RouteCards";

// ─────────────────────────────────────────────────────────────
// Configuration
// ─────────────────────────────────────────────────────────────

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

const SEASONS = [
  "Winter (Nov–Feb)",
  "Summer (Mar–Jun)",
  "Monsoon (Jul–Oct)",
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

// ─────────────────────────────────────────────────────────────
// Delta Badge
// ─────────────────────────────────────────────────────────────

function DeltaBadge({
  baseline,
  proposed,
  field,
  prefix = "",
  suffix = "",
}) {
  if (!baseline || !proposed) return null;

  const bVal = baseline[field];
  const pVal = proposed[field];

  if (bVal == null || pVal == null) return null;

  const delta = Number(pVal) - Number(bVal);

  if (delta === 0) {
    return (
      <span className="np-delta np-delta--neutral">
        No change
      </span>
    );
  }

  const positive = delta > 0;

  return (
    <span
      className={`np-delta ${
        positive
          ? "np-delta--up"
          : "np-delta--down"
      }`}
    >
      {positive ? "▲" : "▼"} {prefix}
      {Math.abs(delta).toLocaleString()}
      {suffix}
    </span>
  );
}

// ─────────────────────────────────────────────────────────────
// Great Circle Route
// ─────────────────────────────────────────────────────────────

function createGreatCircle(start, end, segments = 60) {
  const [lat1, lon1] = start.map(
    (value) => (value * Math.PI) / 180
  );

  const [lat2, lon2] = end.map(
    (value) => (value * Math.PI) / 180
  );

  const vector = (lat, lon) => [
    Math.cos(lat) * Math.cos(lon),
    Math.cos(lat) * Math.sin(lon),
    Math.sin(lat),
  ];

  const v1 = vector(lat1, lon1);
  const v2 = vector(lat2, lon2);

  const dot = Math.min(
    1,
    Math.max(
      -1,
      v1[0] * v2[0] +
        v1[1] * v2[1] +
        v1[2] * v2[2]
    )
  );

  const omega = Math.acos(dot);

  if (omega === 0) {
    return [start, end];
  }

  const points = [];
  const sinOmega = Math.sin(omega);

  for (let i = 0; i <= segments; i++) {
    const t = i / segments;

    const a =
      Math.sin((1 - t) * omega) /
      sinOmega;

    const b =
      Math.sin(t * omega) /
      sinOmega;

    const x = a * v1[0] + b * v2[0];
    const y = a * v1[1] + b * v2[1];
    const z = a * v1[2] + b * v2[2];

    const lat = Math.atan2(
      z,
      Math.sqrt(x * x + y * y)
    );

    const lon = Math.atan2(y, x);

    points.push([
      (lat * 180) / Math.PI,
      (lon * 180) / Math.PI,
    ]);
  }

  return points;
}

// ─────────────────────────────────────────────────────────────
// Map Controller
// ─────────────────────────────────────────────────────────────

function MapController({
  origin,
  destination,
  airports,
}) {
  const map = useMap();

  useEffect(() => {
    if (!origin || !destination) return;

    const originAirport = airports.find(
      (airport) => airport.iata === origin
    );

    const destinationAirport = airports.find(
      (airport) => airport.iata === destination
    );

    if (
      !originAirport ||
      !destinationAirport
    ) {
      return;
    }

    const bounds = [
      [
        Number(originAirport.latitude),
        Number(originAirport.longitude),
      ],
      [
        Number(destinationAirport.latitude),
        Number(destinationAirport.longitude),
      ],
    ];

    map.fitBounds(bounds, {
      padding: [50, 50],
      maxZoom: 5,
      animate: true,
    });
  }, [
    origin,
    destination,
    airports,
    map,
  ]);

  return null;
}

// ─────────────────────────────────────────────────────────────
// Network Planner
// ─────────────────────────────────────────────────────────────

function NetworkPlanner() {
  // ─────────────────────────────────────────────────────────
  // Baseline scenario
  // ─────────────────────────────────────────────────────────

  const [origin, setOrigin] = useState("");
  const [destination, setDestination] =
    useState("");

  const [aircraft, setAircraft] =
    useState("");

  const [season, setSeason] =
    useState("");

  const [flightsDay, setFlightsDay] =
    useState("");

  const [selectedRoute, setSelectedRoute] =
    useState(null);

  const [routeData, setRouteData] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState(null);

  // ─────────────────────────────────────────────────────────
  // Airports
  // ─────────────────────────────────────────────────────────

  const [airports, setAirports] =
    useState([]);

  const [airportsLoading, setAirportsLoading] =
    useState(true);

  // ─────────────────────────────────────────────────────────
  // What-If
  // ─────────────────────────────────────────────────────────

  const [whatIfAircraft, setWhatIfAircraft] =
    useState("");

  const [whatIfFlightsDay, setWhatIfFlightsDay] =
    useState("");

  const [whatIfSeason, setWhatIfSeason] =
    useState("");

  const [whatIfResult, setWhatIfResult] =
    useState(null);

  const [whatIfLoading, setWhatIfLoading] =
    useState(false);

  const [whatIfError, setWhatIfError] =
    useState(null);

  // ─────────────────────────────────────────────────────────
  // Historical Traffic
  // ─────────────────────────────────────────────────────────

  const [selectedYear, setSelectedYear] =
    useState(null);

  const [isPlaying, setIsPlaying] =
    useState(false);

  const [showAirports, setShowAirports] =
    useState(true);

  const [showRoute, setShowRoute] =
    useState(true);

  const [historicalTraffic, setHistoricalTraffic] =
    useState([]);

  const [historicalLoading, setHistoricalLoading] =
    useState(false);

  const [historicalError, setHistoricalError] =
    useState(null);

  // ─────────────────────────────────────────────────────────
  // Refs
  // ─────────────────────────────────────────────────────────

  const analysisRef = useRef(null);
  const whatIfRef = useRef(null);

  // ─────────────────────────────────────────────────────────
  // What-If configuration
  // ─────────────────────────────────────────────────────────

  const whatIfConfigured =
    (whatIfAircraft &&
      whatIfAircraft !== aircraft) ||
    (whatIfFlightsDay &&
      whatIfFlightsDay !== flightsDay) ||
    (whatIfSeason &&
      whatIfSeason !== season);

  // ─────────────────────────────────────────────────────────
  // Fetch Airports
  // ─────────────────────────────────────────────────────────

  useEffect(() => {
    const fetchAirports = async () => {
      try {
        setAirportsLoading(true);

        const res = await fetch(
          `${API_URL}/airports/api/airports/`
        );

        if (!res.ok) {
          throw new Error(
            `Airport API returned ${res.status}`
          );
        }

        const data = await res.json();

        const list = Array.isArray(data)
          ? data
          : Array.isArray(data.results)
          ? data.results
          : Array.isArray(data.airports)
          ? data.airports
          : [];

        setAirports(list);
      } catch (err) {
        console.error(
          "Failed to fetch airports:",
          err
        );

        setAirports([]);
      } finally {
        setAirportsLoading(false);
      }
    };

    fetchAirports();
  }, []);

  // ─────────────────────────────────────────────────────────
  // Seed What-If from baseline
  // ─────────────────────────────────────────────────────────

  useEffect(() => {
    setWhatIfAircraft(aircraft);
    setWhatIfFlightsDay(flightsDay);
    setWhatIfSeason(season);

    setWhatIfResult(null);
    setWhatIfError(null);
  }, [
    aircraft,
    flightsDay,
    season,
  ]);

  // ─────────────────────────────────────────────────────────
  // Historical Timeline Animation
  // ─────────────────────────────────────────────────────────

  const historicalYears = useMemo(() => {
    if (!Array.isArray(historicalTraffic)) {
      return [];
    }

    return [
      ...new Set(
        historicalTraffic
          .map((item) => Number(item.year))
          .filter(Number.isFinite)
      ),
    ].sort((a, b) => a - b);
  }, [historicalTraffic]);

  useEffect(() => {
    if (!isPlaying) return;

    if (historicalYears.length === 0) {
      setIsPlaying(false);
      return;
    }

    const timer = setInterval(() => {
      setSelectedYear((currentYear) => {
        const currentIndex =
          historicalYears.indexOf(
            currentYear
          );

        const nextIndex =
          currentIndex + 1;

        if (
          currentIndex === -1 ||
          nextIndex >=
            historicalYears.length
        ) {
          setIsPlaying(false);

          return historicalYears[0];
        }

        return historicalYears[nextIndex];
      });
    }, 1800);

    return () => clearInterval(timer);
  }, [
    isPlaying,
    historicalYears,
  ]);

  // ─────────────────────────────────────────────────────────
  // Fetch Historical Traffic
  // ─────────────────────────────────────────────────────────

  useEffect(() => {
    if (!origin || !destination) {
      setHistoricalTraffic([]);
      setSelectedYear(null);
      setHistoricalError(null);
      setIsPlaying(false);
      return;
    }

    const fetchHistoricalTraffic =
      async () => {
        try {
          setHistoricalLoading(true);
          setHistoricalError(null);
          setIsPlaying(false);

          const res = await fetch(
            `${API_URL}/historical_traffic/route/${origin}/${destination}`
          );

          if (!res.ok) {
            throw new Error(
              `Historical traffic API returned ${res.status}`
            );
          }

          const data = await res.json();

          /*
           * Backend response:
           *
           * {
           *   count: number,
           *   traffic: [...]
           * }
           */

          const traffic = Array.isArray(
            data.traffic
          )
            ? data.traffic
            : [];

          setHistoricalTraffic(
            traffic
          );

          // Derive available years
          // directly from backend data.
          const years = [
            ...new Set(
              traffic
                .map((item) =>
                  Number(item.year)
                )
                .filter(
                  Number.isFinite
                )
            ),
          ].sort(
            (a, b) => a - b
          );

          // Select latest available year.
          setSelectedYear(
            years.length
              ? years[years.length - 1]
              : null
          );
        } catch (err) {
          console.error(
            "Failed to fetch historical traffic:",
            err
          );

          setHistoricalTraffic([]);
          setSelectedYear(null);
          setHistoricalError(
            err.message
          );
        } finally {
          setHistoricalLoading(false);
        }
      };

    fetchHistoricalTraffic();
  }, [
    origin,
    destination,
  ]);

  // ─────────────────────────────────────────────────────────
  // Derived values
  // ─────────────────────────────────────────────────────────

  const formReady =
    origin &&
    destination &&
    origin !== destination;

  const selectedOrigin =
    Array.isArray(airports)
      ? airports.find(
          (airport) =>
            airport.iata === origin
        )
      : null;

  const selectedDestination =
    Array.isArray(airports)
      ? airports.find(
          (airport) =>
            airport.iata ===
            destination
        )
      : null;

  const routeCoordinates =
    selectedOrigin &&
    selectedDestination
      ? createGreatCircle(
          [
            Number(
              selectedOrigin.latitude
            ),
            Number(
              selectedOrigin.longitude
            ),
          ],
          [
            Number(
              selectedDestination.latitude
            ),
            Number(
              selectedDestination.longitude
            ),
          ]
        )
      : [];

  // ─────────────────────────────────────────────────────────
  // Traffic for selected year
  // ─────────────────────────────────────────────────────────

  const selectedYearTraffic =
    useMemo(() => {
      if (
        !Array.isArray(
          historicalTraffic
        ) ||
        selectedYear == null
      ) {
        return [];
      }

      return historicalTraffic.filter(
        (item) =>
          Number(item.year) ===
          Number(selectedYear)
      );
    }, [
      historicalTraffic,
      selectedYear,
    ]);

  // ─────────────────────────────────────────────────────────
  // Historical Metrics
  // ─────────────────────────────────────────────────────────

  const historicalMetrics =
    useMemo(() => {
      if (
        !selectedYearTraffic.length
      ) {
        return {
          passengers: 0,
          flights: 0,
          seats: 0,
          loadFactor: null,
        };
      }

      const passengers =
        selectedYearTraffic.reduce(
          (sum, item) =>
            sum +
            Number(
              item.passengers || 0
            ),
          0
        );

      const flights =
        selectedYearTraffic.reduce(
          (sum, item) =>
            sum +
            Number(
              item.flights || 0
            ),
          0
        );

      const seats =
        selectedYearTraffic.reduce(
          (sum, item) =>
            sum +
            Number(
              item.available_seats ||
                0
            ),
          0
        );

      const loadFactor =
        seats > 0
          ? (
              (passengers / seats) *
              100
            ).toFixed(1)
          : null;

      return {
        passengers,
        flights,
        seats,
        loadFactor,
      };
    }, [
      selectedYearTraffic,
    ]);

  // ─────────────────────────────────────────────────────────
  // Swap
  // ─────────────────────────────────────────────────────────

  const handleSwap = () => {
    setOrigin(destination);
    setDestination(origin);

    setRouteData(null);
    setWhatIfResult(null);
  };

  // ─────────────────────────────────────────────────────────
  // Route Analysis
  // ─────────────────────────────────────────────────────────

  const handleAnalyze = async () => {
    if (!formReady) return;

    setLoading(true);
    setError(null);
    setRouteData(null);
    setWhatIfResult(null);

    try {
      /*
       * Keep the currently tested route-analysis
       * endpoint for now.
       *
       * We will move this into routeService.js
       * after confirming the deployed Swagger path.
       */

      const res = await fetch(
        `${API_URL}/routes/${origin}/${destination}`
      );

      if (!res.ok) {
        throw new Error(
          `Server error: ${res.status}`
        );
      }

      const data =
        await res.json();

      setRouteData(data);

      setTimeout(() => {
        analysisRef.current?.scrollIntoView(
          {
            behavior: "smooth",
            block: "start",
          }
        );
      }, 100);
    } catch (err) {
      setError(
        err.message ||
          "Failed to fetch route analysis."
      );
    } finally {
      setLoading(false);
    }
  };

  // ─────────────────────────────────────────────────────────
  // What-If Analysis
  // ─────────────────────────────────────────────────────────

  const handleWhatIf = async () => {
    if (!formReady) return;

    setWhatIfLoading(true);
    setWhatIfError(null);
    setWhatIfResult(null);

    try {
      /*
       * Backend:
       *
       * POST /network/what-if
       *
       * The backend expects a JSON request body.
       */

      const payload = {
        origin,
        destination,
        aircraft_type:
          whatIfAircraft || null,
        season:
          whatIfSeason || null,
        flights_per_day:
          whatIfFlightsDay
            ? Number(
                whatIfFlightsDay
              )
            : null,
      };

      const res = await fetch(
        `${API_URL}/network/what-if`,
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

      if (!res.ok) {
        let message = `Server error: ${res.status}`;

        try {
          const errorData =
            await res.json();

          message =
            errorData?.detail ||
            errorData?.message ||
            message;
        } catch {
          // Keep default message.
        }

        throw new Error(message);
      }

      const data =
        await res.json();

      setWhatIfResult(data);

      setTimeout(() => {
        whatIfRef.current?.scrollIntoView(
          {
            behavior: "smooth",
            block: "start",
          }
        );
      }, 100);
    } catch (err) {
      setWhatIfError(
        err.message ||
          "Failed to run What-If scenario."
      );
    } finally {
      setWhatIfLoading(false);
    }
  };

  // ─────────────────────────────────────────────────────────
  // Render
  // ─────────────────────────────────────────────────────────

  return (
    <main className="np-root">

      {/* HERO */}

      <section className="np-hero">

        <div
          className="np-hero__aurora"
          aria-hidden="true"
        />

        <div className="np-hero__content">

          <p className="np-eyebrow">
            <FontAwesomeIcon
              icon={faRoute}
            />
            Network Intelligence
          </p>

          <h1 className="np-hero__title">
            Network
            <br />
            <span className="np-hero__accent">
              Planner
            </span>
          </h1>

          <p className="np-hero__sub">
            Evaluate routes, capacity
            signals, historical demand,
            and network opportunities
            before committing to
            planning decisions.
          </p>

        </div>

        <div className="np-hero__meta">

          <div className="np-meta-item">
            <span>NETWORK</span>
            <strong>
              India Domestic
            </strong>
          </div>

          <div className="np-meta-divider" />

          <div className="np-meta-item">
            <span>HISTORICAL DATA</span>
            <strong>
              {historicalYears.length
                ? `${historicalYears[0]}–${historicalYears[historicalYears.length - 1]}`
                : "—"}
            </strong>
          </div>

          <div className="np-meta-divider" />

          <div className="np-meta-item">
            <span>AIRPORTS</span>
            <strong>
              {airportsLoading
                ? "—"
                : airports.length}
            </strong>
          </div>

          <div className="np-meta-divider" />

          <div className="np-meta-item">
            <span>DATA STATUS</span>

            <strong className="np-meta-live">
              <span className="np-status-dot" />
              Live
            </strong>
          </div>

        </div>

      </section>

      {/* KPI STRIP */}

      <section className="np-kpis">

        <div className="np-kpi">

          <div className="np-kpi__icon">
            <FontAwesomeIcon
              icon={faRoute}
            />
          </div>

          <div className="np-kpi__body">

            <span>
              ACTIVE AIRPORTS
            </span>

            <strong>
              {airportsLoading
                ? "—"
                : airports.length}
            </strong>

            <small>
              In planning dataset
            </small>

          </div>

        </div>

        <div className="np-kpi">

          <div className="np-kpi__icon">
            <FontAwesomeIcon
              icon={faPlane}
            />
          </div>

          <div className="np-kpi__body">

            <span>
              {selectedYear
                ? `${selectedYear} PASSENGERS`
                : "PASSENGERS"}
            </span>

            <strong>
              {historicalMetrics.passengers
                ? historicalMetrics.passengers.toLocaleString()
                : "—"}
            </strong>

            <small>
              Historical traffic
            </small>

          </div>

        </div>

        <div className="np-kpi">

          <div className="np-kpi__icon">
            <FontAwesomeIcon
              icon={faChartBar}
            />
          </div>

          <div className="np-kpi__body">

            <span>
              LOAD FACTOR
            </span>

            <strong>
              {historicalMetrics.loadFactor
                ? `${historicalMetrics.loadFactor}%`
                : "—"}
            </strong>

            <small>
              Selected year
            </small>

          </div>

        </div>

        <div className="np-kpi">

          <div className="np-kpi__icon">
            <FontAwesomeIcon
              icon={faLightbulb}
            />
          </div>

          <div className="np-kpi__body">

            <span>
              OPPORTUNITIES
            </span>

            <strong>
              —
            </strong>

            <small>
              Route opportunity layer
            </small>

          </div>

        </div>

      </section>

      {/* WORKSPACE */}

      <section className="np-workspace">

        {/* SCENARIO FORM */}

        <div className="np-scenario">

          <div className="np-panel-header">

            <p className="np-eyebrow">
              ROUTE SCENARIO
            </p>

            <h2>
              Build a network scenario
            </h2>

            <p className="np-panel-sub">
              Select a route and operating
              parameters to run route
              intelligence.
            </p>

          </div>

          <div className="np-form">

            <div className="np-form__route-row">

              <div className="np-field">

                <label>
                  ORIGIN
                </label>

                <select
                  value={origin}
                  onChange={(e) =>
                    setOrigin(
                      e.target.value
                    )
                  }
                  disabled={
                    airportsLoading
                  }
                  className={
                    origin
                      ? "np-select--active"
                      : ""
                  }
                >

                  <option value="">
                    {airportsLoading
                      ? "Loading airports…"
                      : "Select origin"}
                  </option>

                  {airports.map(
                    (airport) => (
                      <option
                        key={
                          airport.iata
                        }
                        value={
                          airport.iata
                        }
                        disabled={
                          airport.iata ===
                          destination
                        }
                      >
                        {airport.city} (
                        {
                          airport.iata
                        }
                        )
                      </option>
                    )
                  )}

                </select>

              </div>

              <button
                className="np-swap"
                onClick={handleSwap}
                disabled={
                  !origin &&
                  !destination
                }
                aria-label="Swap airports"
              >
                <FontAwesomeIcon
                  icon={faRightLeft}
                />
              </button>

              <div className="np-field">

                <label>
                  DESTINATION
                </label>

                <select
                  value={destination}
                  onChange={(e) =>
                    setDestination(
                      e.target.value
                    )
                  }
                  disabled={
                    airportsLoading
                  }
                  className={
                    destination
                      ? "np-select--active"
                      : ""
                  }
                >

                  <option value="">
                    {airportsLoading
                      ? "Loading airports…"
                      : "Select destination"}
                  </option>

                  {airports.map(
                    (airport) => (
                      <option
                        key={
                          airport.iata
                        }
                        value={
                          airport.iata
                        }
                        disabled={
                          airport.iata ===
                          origin
                        }
                      >
                        {airport.city} (
                        {
                          airport.iata
                        }
                        )
                      </option>
                    )
                  )}

                </select>

              </div>

            </div>

            {formReady && (
              <div className="np-route-indicator">

                <span className="np-route-code">
                  {origin}
                </span>

                <FontAwesomeIcon
                  icon={faArrowRight}
                  className="np-route-arrow"
                />

                <span className="np-route-code">
                  {destination}
                </span>

                {selectedOrigin &&
                  selectedDestination && (
                    <span className="np-route-cities">
                      {
                        selectedOrigin.city
                      }{" "}
                      →{" "}
                      {
                        selectedDestination.city
                      }
                    </span>
                  )}

              </div>
            )}

            <div className="np-form__params-row">

              <div className="np-field">

                <label>
                  AIRCRAFT
                </label>

                <select
                  value={aircraft}
                  onChange={(e) =>
                    setAircraft(
                      e.target.value
                    )
                  }
                >

                  <option value="">
                    Any aircraft
                  </option>

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

              <div className="np-field">

                <label>
                  SEASON
                </label>

                <select
                  value={season}
                  onChange={(e) =>
                    setSeason(
                      e.target.value
                    )
                  }
                >

                  <option value="">
                    Any season
                  </option>

                  {SEASONS.map(
                    (item) => (
                      <option
                        key={item}
                        value={item}
                      >
                        {item}
                      </option>
                    )
                  )}

                </select>

              </div>

              <div className="np-field">

                <label>
                  FLIGHTS / DAY
                </label>

                <select
                  value={flightsDay}
                  onChange={(e) =>
                    setFlightsDay(
                      e.target.value
                    )
                  }
                >

                  <option value="">
                    Not specified
                  </option>

                  {FLIGHTS_PER_DAY.map(
                    (value) => (
                      <option
                        key={value}
                        value={value}
                      >
                        {value}
                      </option>
                    )
                  )}

                </select>

              </div>

            </div>

            <button
              className="np-analyse-btn"
              onClick={
                handleAnalyze
              }
              disabled={
                !formReady ||
                loading
              }
            >

              {loading ? (
                <>
                  <FontAwesomeIcon
                    icon={
                      faCircleNotch
                    }
                    spin
                  />
                  Analysing…
                </>
              ) : (
                <>
                  Run Analysis
                  <FontAwesomeIcon
                    icon={
                      faArrowRight
                    }
                  />
                </>
              )}

            </button>

            {error && (
              <div className="np-error">

                <FontAwesomeIcon
                  icon={
                    faTriangleExclamation
                  }
                />

                {error}

              </div>
            )}

          </div>

        </div>

        {/* NETWORK MAP */}

        <div className="np-map">

          <div className="np-panel-header np-panel-header--map">

            <div>

              <p className="np-eyebrow">
                NETWORK VISUALISATION
              </p>

              <h2>
                Historical Network Map
              </h2>

            </div>

            {origin &&
              destination && (
                <div className="np-map-badge">

                  <span>
                    {origin}
                  </span>

                  <FontAwesomeIcon
                    icon={
                      faArrowRight
                    }
                  />

                  <span>
                    {destination}
                  </span>

                </div>
              )}

          </div>

          {/* Map Controls */}

          <div className="np-map-controls">

            <div className="np-map-control-title">

              <FontAwesomeIcon
                icon={
                  faLayerGroup
                }
              />

              Layers

            </div>

            <button
              className={
                showAirports
                  ? "np-map-control active"
                  : "np-map-control"
              }
              onClick={() =>
                setShowAirports(
                  (value) =>
                    !value
                )
              }
            >
              Airports
            </button>

            <button
              className={
                showRoute
                  ? "np-map-control active"
                  : "np-map-control"
              }
              onClick={() =>
                setShowRoute(
                  (value) =>
                    !value
                )
              }
            >
              Route
            </button>

          </div>

          <div className="np-map__canvas">

            <MapContainer
              center={[
                20.5937,
                78.9629,
              ]}
              zoom={4}
              scrollWheelZoom={true}
              style={{
                width: "100%",
                height: "100%",
              }}
            >

              <TileLayer
                attribution="&copy; OpenStreetMap contributors"
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              <MapController
                origin={origin}
                destination={
                  destination
                }
                airports={airports}
              />

              {/* Airports */}

              {showAirports &&
                airports.map(
                  (airport) => {
                    const lat =
                      Number(
                        airport.latitude
                      );

                    const lon =
                      Number(
                        airport.longitude
                      );

                    if (
                      !Number.isFinite(
                        lat
                      ) ||
                      !Number.isFinite(
                        lon
                      )
                    ) {
                      return null;
                    }

                    const isSelected =
                      airport.iata ===
                        origin ||
                      airport.iata ===
                        destination;

                    return (
                      <CircleMarker
                        key={
                          airport.iata
                        }
                        center={[
                          lat,
                          lon,
                        ]}
                        radius={
                          isSelected
                            ? 7
                            : 4
                        }
                        pathOptions={{
                          weight:
                            isSelected
                              ? 2
                              : 1,
                          fillOpacity:
                            isSelected
                              ? 0.95
                              : 0.65,
                        }}
                      >

                        <Popup>

                          <div className="np-airport-popup">

                            <strong>
                              {
                                airport.iata
                              }
                            </strong>

                            <span>
                              {
                                airport.name
                              }
                            </span>

                            <small>
                              {
                                airport.city
                              }
                              ,{" "}
                              {
                                airport.country
                              }
                            </small>

                            {airport.airport_role && (
                              <small>
                                Role:{" "}
                                {
                                  airport.airport_role
                                }
                              </small>
                            )}

                          </div>

                        </Popup>

                      </CircleMarker>
                    );
                  }
                )}

              {/* Route */}

              {showRoute &&
                routeCoordinates.length >
                  0 && (
                  <Polyline
                    positions={
                      routeCoordinates
                    }
                    pathOptions={{
                      weight: 4,
                      opacity: 0.9,
                      dashArray:
                        "10 7",
                    }}
                  />
                )}

              {/* Demand Bubble */}

              {formReady &&
                selectedOrigin &&
                historicalMetrics.passengers >
                  0 && (
                  <CircleMarker
                    center={[
                      Number(
                        selectedOrigin.latitude
                      ),
                      Number(
                        selectedOrigin.longitude
                      ),
                    ]}
                    radius={Math.min(
                      35,
                      Math.max(
                        8,
                        historicalMetrics.passengers /
                          10000
                      )
                    )}
                    pathOptions={{
                      fillOpacity:
                        0.18,
                      weight: 2,
                    }}
                  >

                    <Popup>

                      <strong>
                        {origin} Demand
                      </strong>

                      <br />

                      Year:{" "}
                      {selectedYear}

                      <br />

                      Passengers:{" "}
                      {historicalMetrics.passengers.toLocaleString()}

                    </Popup>

                  </CircleMarker>
                )}

              {/* Destination Demand Bubble */}

              {formReady &&
                selectedDestination &&
                historicalMetrics.passengers >
                  0 && (
                  <CircleMarker
                    center={[
                      Number(
                        selectedDestination.latitude
                      ),
                      Number(
                        selectedDestination.longitude
                      ),
                    ]}
                    radius={Math.min(
                      35,
                      Math.max(
                        8,
                        historicalMetrics.passengers /
                          10000
                      )
                    )}
                    pathOptions={{
                      fillOpacity:
                        0.18,
                      weight: 2,
                    }}
                  >

                    <Popup>

                      <strong>
                        {destination} Demand
                      </strong>

                      <br />

                      Year:{" "}
                      {selectedYear}

                      <br />

                      Passengers:{" "}
                      {historicalMetrics.passengers.toLocaleString()}

                    </Popup>

                  </CircleMarker>
                )}

            </MapContainer>

            {historicalLoading && (
              <div className="np-map-loading">

                <FontAwesomeIcon
                  icon={
                    faCircleNotch
                  }
                  spin
                />

                Loading historical
                data…

              </div>
            )}

          </div>

          {/* Map Footer */}

          <div className="np-map-footer">

            <div className="np-map-stat">

              <span>
                YEAR
              </span>

              <strong>
                {selectedYear ??
                  "—"}
              </strong>

            </div>

            <div className="np-map-stat">

              <span>
                PASSENGERS
              </span>

              <strong>
                {historicalMetrics.passengers
                  ? historicalMetrics.passengers.toLocaleString()
                  : "—"}
              </strong>

            </div>

            <div className="np-map-stat">

              <span>
                FLIGHTS
              </span>

              <strong>
                {historicalMetrics.flights
                  ? historicalMetrics.flights.toLocaleString()
                  : "—"}
              </strong>

            </div>

            <div className="np-map-stat">

              <span>
                CAPACITY
              </span>

              <strong>
                {historicalMetrics.seats
                  ? historicalMetrics.seats.toLocaleString()
                  : "—"}
              </strong>

            </div>

            <div className="np-map-stat">

              <span>
                LOAD FACTOR
              </span>

              <strong>
                {historicalMetrics.loadFactor
                  ? `${historicalMetrics.loadFactor}%`
                  : "—"}
              </strong>

            </div>

          </div>

          {historicalError && (
            <div className="np-map-warning">

              <FontAwesomeIcon
                icon={
                  faTriangleExclamation
                }
              />

              Historical data could not
              be loaded for this route.

            </div>
          )}

        </div>

      </section>

      {/* HISTORICAL TIMELINE */}

      <section className="np-history">

        <div className="np-history-header">

          <div>

            <p className="np-eyebrow">

              <FontAwesomeIcon
                icon={
                  faClockRotateLeft
                }
              />

              Historical Market

            </p>

            <h2>
              Demand Timeline
            </h2>

            <p className="np-panel-sub">
              Explore the historical
              traffic available for the
              selected market.
            </p>

          </div>

          <div className="np-history-year">
            {selectedYear ?? "—"}
          </div>

        </div>

        {/* Play */}

        <button
          className="np-history-play"
          onClick={() =>
            setIsPlaying(
              (value) => !value
            )
          }
          disabled={
            historicalYears.length <
            2
          }
        >

          <FontAwesomeIcon
            icon={
              isPlaying
                ? faPause
                : faPlay
            }
          />

          {isPlaying
            ? "Pause Timeline"
            : "Play Timeline"}

        </button>

        {/* Timeline */}

        <div className="np-history-slider">

          {historicalYears.length >
          0 ? (
            <>
              <input
                type="range"
                min="0"
                max={
                  historicalYears.length -
                  1
                }
                step="1"
                value={Math.max(
                  0,
                  historicalYears.indexOf(
                    selectedYear
                  )
                )}
                onChange={(event) => {
                  setSelectedYear(
                    historicalYears[
                      Number(
                        event.target.value
                      )
                    ]
                  );

                  setIsPlaying(false);
                }}
              />

              <div className="np-history-years">

                {historicalYears.map(
                  (year) => (
                    <button
                      key={year}
                      className={
                        selectedYear ===
                        year
                          ? "active"
                          : ""
                      }
                      onClick={() => {
                        setSelectedYear(
                          year
                        );
                        setIsPlaying(
                          false
                        );
                      }}
                    >
                      {year}
                    </button>
                  )
                )}

              </div>
            </>
          ) : (
            <div className="np-history-empty">

              {historicalLoading
                ? "Loading available historical years…"
                : formReady
                ? "No historical traffic available for this route."
                : "Select a route to load historical traffic."}

            </div>
          )}

        </div>

      </section>

      {/* ROUTE INTELLIGENCE */}

      <section
        className="np-intelligence"
        ref={analysisRef}
      >

        <div className="np-panel-header">

          <p className="np-eyebrow">
            ROUTE INTELLIGENCE
          </p>

          <h2>
            {routeData
              ? `${origin} → ${destination}`
              : "Route Analysis"}
          </h2>

          <p className="np-panel-sub">

            {routeData
              ? `Demand, profitability and opportunity analysis for ${
                  selectedOrigin?.city ??
                  origin
                } to ${
                  selectedDestination?.city ??
                  destination
                }.`
              : "Select a route above and run the analysis to see route intelligence."}

          </p>

        </div>

        {!routeData &&
          !loading &&
          !error && (
            <div className="np-empty">

              <div className="np-empty__icon">

                <FontAwesomeIcon
                  icon={faChartBar}
                />

              </div>

              <strong>
                No route analysed yet
              </strong>

              <p>
                Configure a scenario
                above to begin.
              </p>

            </div>
          )}

        {loading && (
          <div className="np-empty">

            <div className="np-empty__spinner">

              <FontAwesomeIcon
                icon={
                  faCircleNotch
                }
                spin
              />

            </div>

            <strong>
              Analysing route…
            </strong>

            <p>
              Computing intelligence
              for {origin} →{" "}
              {destination}
            </p>

          </div>
        )}

        {routeData && (
          <div className="np-analysis-output">

            <RouteCards
              data={routeData}
              selectedRoute={
                selectedRoute
              }
              setSelectedRoute={
                setSelectedRoute
              }
            />

          </div>
        )}

      </section>

      {/* WHAT-IF */}

      <section
        className="np-whatif"
        ref={whatIfRef}
      >

        <div className="np-panel-header">

          <p className="np-eyebrow">
            SCENARIO PLANNING
          </p>

          <h2>
            What-If Analysis
          </h2>

          <p className="np-panel-sub">

            {routeData
              ? "Adjust parameters below to test a proposed scenario against the baseline."
              : "Run a route analysis first to unlock What-If scenario planning."}

          </p>

        </div>

        <div className="np-whatif__grid">

          {/* BASELINE */}

          <div className="np-scenario-card np-scenario-card--baseline">

            <span className="np-scenario-label">
              BASELINE
            </span>

            <h3 className="np-scenario-route">

              {origin &&
              destination
                ? `${origin} → ${destination}`
                : "No baseline yet"}

            </h3>

            <div className="np-scenario-params">

              <div className="np-scenario-param">

                <span>
                  Aircraft
                </span>

                <strong>
                  {aircraft ||
                    "Any"}
                </strong>

              </div>

              <div className="np-scenario-param">

                <span>
                  Flights / day
                </span>

                <strong>
                  {flightsDay ||
                    "—"}
                </strong>

              </div>

              <div className="np-scenario-param">

                <span>
                  Season
                </span>

                <strong>
                  {season ||
                    "Any"}
                </strong>

              </div>

            </div>

            {routeData && (
              <div className="np-scenario-metrics">

                {routeData.estimated_revenue !=
                  null && (
                  <div className="np-scenario-metric">

                    <span>
                      Est. Revenue
                    </span>

                    <strong>
                      ₹
                      {Number(
                        routeData.estimated_revenue
                      ).toLocaleString()}
                    </strong>

                  </div>
                )}

                {routeData.load_factor !=
                  null && (
                  <div className="np-scenario-metric">

                    <span>
                      Load Factor
                    </span>

                    <strong>
                      {
                        routeData.load_factor
                      }
                      %
                    </strong>

                  </div>
                )}

                {routeData.profitability_score !=
                  null && (
                  <div className="np-scenario-metric">

                    <span>
                      Profitability
                      Score
                    </span>

                    <strong>
                      {
                        routeData.profitability_score
                      }
                    </strong>

                  </div>
                )}

              </div>
            )}

            {!routeData && (
              <p className="np-scenario-hint">
                Run a route analysis
                above to populate
                the baseline.
              </p>
            )}

          </div>

          {/* PROPOSED */}

          <div
            className={`np-scenario-card np-scenario-card--proposed${
              !routeData
                ? " np-scenario-card--locked"
                : ""
            }`}
          >

            <span className="np-scenario-label">
              PROPOSED SCENARIO
            </span>

            <h3 className="np-scenario-route">

              {origin &&
              destination
                ? `${origin} → ${destination}`
                : "Configure baseline first"}

            </h3>

            {!routeData ? (
              <p className="np-scenario-hint">
                Run a baseline
                analysis first to
                enable scenario
                comparison.
              </p>
            ) : (
              <>

                <div className="np-whatif__params">

                  <div className="np-field">

                    <label>
                      AIRCRAFT
                    </label>

                    <select
                      value={
                        whatIfAircraft
                      }
                      onChange={(e) =>
                        setWhatIfAircraft(
                          e.target.value
                        )
                      }
                    >

                      <option value="">
                        Any aircraft
                      </option>

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

                  <div className="np-field">

                    <label>
                      SEASON
                    </label>

                    <select
                      value={
                        whatIfSeason
                      }
                      onChange={(e) =>
                        setWhatIfSeason(
                          e.target.value
                        )
                      }
                    >

                      <option value="">
                        Any season
                      </option>

                      {SEASONS.map(
                        (item) => (
                          <option
                            key={item}
                            value={item}
                          >
                            {item}
                          </option>
                        )
                      )}

                    </select>

                  </div>

                  <div className="np-field">

                    <label>
                      FLIGHTS / DAY
                    </label>

                    <select
                      value={
                        whatIfFlightsDay
                      }
                      onChange={(e) =>
                        setWhatIfFlightsDay(
                          e.target.value
                        )
                      }
                    >

                      <option value="">
                        Not specified
                      </option>

                      {FLIGHTS_PER_DAY.map(
                        (value) => (
                          <option
                            key={value}
                            value={value}
                          >
                            {value}
                          </option>
                        )
                      )}

                    </select>

                  </div>

                </div>

                {whatIfConfigured && (
                  <div className="np-whatif__changes">

                    <p className="np-whatif__changes-label">
                      Changes vs baseline:
                    </p>

                    <ul>

                      {whatIfAircraft !==
                        aircraft && (
                        <li>
                          Aircraft:{" "}
                          <s>
                            {aircraft ||
                              "Any"}
                          </s>{" "}
                          →
                          <strong>
                            {
                              whatIfAircraft ||
                              "Any"
                            }
                          </strong>
                        </li>
                      )}

                      {whatIfSeason !==
                        season && (
                        <li>
                          Season:{" "}
                          <s>
                            {season ||
                              "Any"}
                          </s>{" "}
                          →
                          <strong>
                            {
                              whatIfSeason ||
                              "Any"
                            }
                          </strong>
                        </li>
                      )}

                      {whatIfFlightsDay !==
                        flightsDay && (
                        <li>
                          Flights/day:{" "}
                          <s>
                            {flightsDay ||
                              "—"}
                          </s>{" "}
                          →
                          <strong>
                            {
                              whatIfFlightsDay ||
                              "—"
                            }
                          </strong>
                        </li>
                      )}

                    </ul>

                  </div>
                )}

                <button
                  className="np-whatif-btn"
                  onClick={
                    handleWhatIf
                  }
                  disabled={
                    !whatIfConfigured ||
                    whatIfLoading
                  }
                >

                  {whatIfLoading ? (
                    <>
                      <FontAwesomeIcon
                        icon={
                          faCircleNotch
                        }
                        spin
                      />

                      Running…

                    </>
                  ) : (
                    <>
                      <FontAwesomeIcon
                        icon={
                          faFlask
                        }
                      />

                      Run What-If

                      <FontAwesomeIcon
                        icon={
                          faArrowRight
                        }
                      />

                    </>
                  )}

                </button>

                {!whatIfConfigured &&
                  !whatIfLoading && (
                    <p
                      className="np-scenario-hint"
                      style={{
                        marginTop:
                          "0.75rem",
                      }}
                    >
                      Change at least
                      one parameter
                      above to enable
                      the comparison.
                    </p>
                  )}

                {whatIfError && (
                  <div
                    className="np-error"
                    style={{
                      marginTop:
                        "0.75rem",
                    }}
                  >

                    <FontAwesomeIcon
                      icon={
                        faTriangleExclamation
                      }
                    />

                    {whatIfError}

                  </div>
                )}

              </>
            )}

          </div>

        </div>

        {/* DELTA RESULTS */}

        {whatIfResult &&
          routeData && (
            <div className="np-whatif__delta">

              <div
                className="np-panel-header"
                style={{
                  marginBottom:
                    "1.5rem",
                }}
              >

                <p className="np-eyebrow">
                  SCENARIO COMPARISON
                </p>

                <h2>
                  Baseline vs Proposed
                </h2>

                <p className="np-panel-sub">
                  How the proposed
                  scenario performs
                  against the baseline
                  for {origin} →{" "}
                  {destination}.
                </p>

              </div>

              <div className="np-delta-grid">

                {/* Revenue */}

                {(routeData.estimated_revenue !=
                  null ||
                  whatIfResult.estimated_revenue !=
                    null) && (
                  <div className="np-delta-card">

                    <span className="np-delta-label">
                      Est. Revenue
                    </span>

                    <div className="np-delta-values">

                      <div className="np-delta-col">

                        <span>
                          Baseline
                        </span>

                        <strong>
                          ₹
                          {Number(
                            routeData.estimated_revenue ??
                              0
                          ).toLocaleString()}
                        </strong>

                      </div>

                      <div className="np-delta-arrow">
                        →
                      </div>

                      <div className="np-delta-col">

                        <span>
                          Proposed
                        </span>

                        <strong>
                          ₹
                          {Number(
                            whatIfResult.estimated_revenue ??
                              0
                          ).toLocaleString()}
                        </strong>

                      </div>

                    </div>

                    <DeltaBadge
                      baseline={
                        routeData
                      }
                      proposed={
                        whatIfResult
                      }
                      field="estimated_revenue"
                      prefix="₹"
                    />

                  </div>
                )}

                {/* Load Factor */}

                {(routeData.load_factor !=
                  null ||
                  whatIfResult.load_factor !=
                    null) && (
                  <div className="np-delta-card">

                    <span className="np-delta-label">
                      Load Factor
                    </span>

                    <div className="np-delta-values">

                      <div className="np-delta-col">

                        <span>
                          Baseline
                        </span>

                        <strong>
                          {
                            routeData.load_factor ??
                            "—"
                          }
                          %
                        </strong>

                      </div>

                      <div className="np-delta-arrow">
                        →
                      </div>

                      <div className="np-delta-col">

                        <span>
                          Proposed
                        </span>

                        <strong>
                          {
                            whatIfResult.load_factor ??
                            "—"
                          }
                          %
                        </strong>

                      </div>

                    </div>

                    <DeltaBadge
                      baseline={
                        routeData
                      }
                      proposed={
                        whatIfResult
                      }
                      field="load_factor"
                      suffix="%"
                    />

                  </div>
                )}

                {/* Profitability */}

                {(routeData.profitability_score !=
                  null ||
                  whatIfResult.profitability_score !=
                    null) && (
                  <div className="np-delta-card">

                    <span className="np-delta-label">
                      Profitability
                      Score
                    </span>

                    <div className="np-delta-values">

                      <div className="np-delta-col">

                        <span>
                          Baseline
                        </span>

                        <strong>
                          {
                            routeData.profitability_score ??
                            "—"
                          }
                        </strong>

                      </div>

                      <div className="np-delta-arrow">
                        →
                      </div>

                      <div className="np-delta-col">

                        <span>
                          Proposed
                        </span>

                        <strong>
                          {
                            whatIfResult.profitability_score ??
                            "—"
                          }
                        </strong>

                      </div>

                    </div>

                    <DeltaBadge
                      baseline={
                        routeData
                      }
                      proposed={
                        whatIfResult
                      }
                      field="profitability_score"
                    />

                  </div>
                )}

              </div>

              <div className="np-whatif__cards-header">

                <FontAwesomeIcon
                  icon={faFlask}
                />

                <span>
                  Proposed scenario —
                  full intelligence
                </span>

              </div>

              <div className="np-analysis-output">

                <RouteCards
                  data={
                    whatIfResult
                  }
                  selectedRoute={null}
                  setSelectedRoute={() => {}}
                />

              </div>

            </div>
          )}

      </section>

    </main>
  );
}

export default NetworkPlanner;