// NetworkPlanner.jsx

import { useEffect, useState } from "react";
import "./NetworkPlanner.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlane,
  faCircle,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";

import RouteSelector from "./RouteSelector";
import MarketOverview from "./MarketOverview";
import NetworkMap from "../Maps/NetworkMap";
import HistoricalIntelligence from "./HistoricalIntelligence";
import DemandForecast from "./DemandForecast";
import CompetitionAnalysis from "./CompetitionAnalysis";
import RouteOpportunity from "./RouteOpportunity";
import RouteEconomics from "./RouteEconomics";
import WhatIfScenario from "./WhatIfScenario";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://aeroinsight-dashboard-backend.onrender.com";

/* ─────────────────────────────────────────
   SKELETON
───────────────────────────────────────── */

function SectionSkeleton({ rows = 3 }) {
  return (
    <div className="np-skeleton">
      <div className="np-skeleton-header">
        <div className="np-skeleton-label" />
        <div className="np-skeleton-title" />
      </div>

      <div className="np-skeleton-rows">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="np-skeleton-row" />
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   EMPTY STATE
───────────────────────────────────────── */

function EmptyState() {
  return (
    <div className="np-empty">
      <div className="np-empty-icon">
        <FontAwesomeIcon icon={faPlane} />
      </div>

      <h3>Select a route to begin</h3>

      <p>
        Choose an origin and destination above to load
        market data, demand forecasts, and route economics.
      </p>
    </div>
  );
}

/* ─────────────────────────────────────────
   ROUTE PILL (sticky bar)
───────────────────────────────────────── */

function RoutePill({ origin, destination }) {
  if (!origin || !destination || origin === destination) {
    return null;
  }

  return (
    <div className="np-route-pill">
      <FontAwesomeIcon
        icon={faCircle}
        className="np-pill-dot np-pill-dot--origin"
      />

      <span>{origin}</span>

      <FontAwesomeIcon
        icon={faArrowRight}
        className="np-pill-arrow"
      />

      <span>{destination}</span>

      <FontAwesomeIcon
        icon={faCircle}
        className="np-pill-dot np-pill-dot--destination"
      />
    </div>
  );
}

/* ─────────────────────────────────────────
   NETWORK PLANNER
───────────────────────────────────────── */

function NetworkPlanner() {

  /* ── Route ── */

  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");

  /* ── Airports ── */

  const [airports, setAirports] = useState([]);
  const [airportsLoading, setAirportsLoading] = useState(true);
  const [airportsError, setAirportsError] = useState(null);

  /* ── Market ── */

  const [market, setMarket] = useState(null);
  const [marketLoading, setMarketLoading] = useState(false);
  const [marketError, setMarketError] = useState(null);

  /* ── Historical Traffic ── */

  const [historicalTraffic, setHistoricalTraffic] = useState([]);
  const [trafficLoading, setTrafficLoading] = useState(false);
  const [trafficError, setTrafficError] = useState(null);

  /* ── Demand ── */

  const [demand, setDemand] = useState([]);
  const [demandLoading, setDemandLoading] = useState(false);
  const [demandError, setDemandError] = useState(null);

  /* ── Capacity ── */

  const [capacity, setCapacity] = useState([]);
  const [capacityLoading, setCapacityLoading] = useState(false);
  const [capacityError, setCapacityError] = useState(null);

  /* ── Competition ── */

  const [competition, setCompetition] = useState([]);
  const [competitionLoading, setCompetitionLoading] = useState(false);
  const [competitionError, setCompetitionError] = useState(null);

  /* ── Fares ── */

  const [fares, setFares] = useState([]);
  const [faresLoading, setFaresLoading] = useState(false);
  const [faresError, setFaresError] = useState(null);

  /* ── Opportunity ── */

  const [opportunity, setOpportunity] = useState(null);
  const [opportunityLoading, setOpportunityLoading] = useState(false);
  const [opportunityError, setOpportunityError] = useState(null);

  /* ── Operating Costs ── */

  const [operatingCosts, setOperatingCosts] = useState([]);
  const [costLoading, setCostLoading] = useState(false);
  const [costError, setCostError] = useState(null);

  /* ─────────────────────────────────────
     FETCH: AIRPORTS
  ───────────────────────────────────── */

  useEffect(() => {
    const fetchAirports = async () => {
      try {
        setAirportsLoading(true);
        setAirportsError(null);

        const response = await fetch(
          `${API_URL}/airports/api/airports/`
        );

        if (!response.ok) {
          throw new Error(
            `Airport API returned ${response.status}`
          );
        }

        const data = await response.json();

        const airportList = Array.isArray(data)
          ? data
          : Array.isArray(data.results)
          ? data.results
          : Array.isArray(data.airports)
          ? data.airports
          : [];

        setAirports(airportList);
      } catch (error) {
        console.error(error);
        setAirportsError(
          error.message || "Failed to load airports."
        );
      } finally {
        setAirportsLoading(false);
      }
    };

    fetchAirports();
  }, []);

  /* ─────────────────────────────────────
     FETCH: MARKET
  ───────────────────────────────────── */

  useEffect(() => {
    if (!origin || !destination || origin === destination) {
      setMarket(null);
      return;
    }

    const fetchMarket = async () => {
      try {
        setMarketLoading(true);
        setMarketError(null);

        const response = await fetch(
          `${API_URL}/markets/${origin}/${destination}`
        );

        if (!response.ok) {
          throw new Error(
            `Market API returned ${response.status}`
          );
        }

        const data = await response.json();
        setMarket(data);
      } catch (error) {
        console.error(error);
        setMarket(null);
        setMarketError(
          error.message || "Failed to load market."
        );
      } finally {
        setMarketLoading(false);
      }
    };

    fetchMarket();
  }, [origin, destination]);

  /* ─────────────────────────────────────
     FETCH: MARKET-DEPENDENT DATA
  ───────────────────────────────────── */

  useEffect(() => {
    if (!market?.market_id) {
      setHistoricalTraffic([]);
      setDemand([]);
      setCapacity([]);
      setCompetition([]);
      setFares([]);
      setOpportunity(null);
      setOperatingCosts([]);
      return;
    }

    const marketId = market.market_id;

    const fetchMarketData = async () => {
      setTrafficLoading(true);
      setDemandLoading(true);
      setCapacityLoading(true);
      setCompetitionLoading(true);
      setFaresLoading(true);
      setOpportunityLoading(true);
      setCostLoading(true);

      const requests = [
        fetch(`${API_URL}/historical_traffic/market/${marketId}`),
        fetch(`${API_URL}/monthly_demand/market/${marketId}`),
        fetch(`${API_URL}/monthly_capacity/market/${marketId}`),
        fetch(`${API_URL}/competition/market/${marketId}`),
        fetch(`${API_URL}/market-fares/market/${marketId}`),
        fetch(`${API_URL}/route-opportunity/${marketId}`),
        fetch(`${API_URL}/operating-costs/market/${marketId}`),
      ];

      const results = await Promise.allSettled(requests);

      const parse = async (result, fallback = []) => {
        if (result.status !== "fulfilled") return null;
        if (!result.value.ok) return null;
        const data = await result.value.json();
        return Array.isArray(data) ? data : (data.results ?? fallback);
      };

      const [
        traffic,
        demandData,
        capacityData,
        competitionData,
        faresData,
        opportunityData,
        costsData,
      ] = await Promise.all(results.map((r, i) =>
        i === 5 // opportunity is a single object, not array
          ? (r.status === "fulfilled" && r.value.ok
              ? r.value.json()
              : Promise.resolve(null))
          : parse(r)
      ));

      setHistoricalTraffic(traffic ?? []);
      setTrafficError(traffic === null ? "Failed to load historical traffic." : null);

      setDemand(demandData ?? []);
      setDemandError(demandData === null ? "Failed to load demand." : null);

      setCapacity(capacityData ?? []);
      setCapacityError(capacityData === null ? "Failed to load capacity." : null);

      setCompetition(competitionData ?? []);
      setCompetitionError(competitionData === null ? "Failed to load competition." : null);

      setFares(faresData ?? []);
      setFaresError(faresData === null ? "Failed to load market fares." : null);

      setOpportunity(opportunityData);
      setOpportunityError(opportunityData === null ? "Failed to load route opportunity." : null);

      setOperatingCosts(costsData ?? []);
      setCostError(costsData === null ? "Failed to load operating costs." : null);

      setTrafficLoading(false);
      setDemandLoading(false);
      setCapacityLoading(false);
      setCompetitionLoading(false);
      setFaresLoading(false);
      setOpportunityLoading(false);
      setCostLoading(false);
    };

    fetchMarketData();
  }, [market?.market_id]);

  /* ─────────────────────────────────────
     ROUTE SWAP
  ───────────────────────────────────── */

  const handleSwap = () => {
    setOrigin(destination);
    setDestination(origin);
  };

  /* ─────────────────────────────────────
     DERIVED STATE
  ───────────────────────────────────── */

  const routeReady =
    origin &&
    destination &&
    origin !== destination;

  /* ─────────────────────────────────────
     RENDER
  ───────────────────────────────────── */

  return (
    <div className="np-shell">

      {/* ── App Header ── */}

      <header className="np-header">
        <div className="np-header-brand">
          <FontAwesomeIcon
            icon={faPlane}
            className="np-header-icon"
          />

          <div>
            <span className="np-header-title">
              AeroInsight
            </span>

            <span className="np-header-subtitle">
              Network Planning Dashboard
            </span>
          </div>
        </div>

        <RoutePill
          origin={origin}
          destination={destination}
        />
      </header>

      {/* ── Sticky Route Bar ── */}

      {routeReady && (
        <div className="np-sticky-bar">
          <span className="np-sticky-label">
            Active Route
          </span>

          <span className="np-sticky-route">
            {origin}
            <FontAwesomeIcon icon={faArrowRight} />
            {destination}
          </span>

          {market && (
            <span className="np-sticky-meta">
              {market.market_region}
              &nbsp;·&nbsp;
              {market.distance_km?.toLocaleString()} km
            </span>
          )}
        </div>
      )}

      {/* ── Main Content ── */}

      <main className="np-main">

        <RouteSelector
          airports={airports}
          airportsLoading={airportsLoading}
          airportsError={airportsError}
          origin={origin}
          destination={destination}
          onOriginChange={setOrigin}
          onDestinationChange={setDestination}
          onSwap={handleSwap}
        />

        {!routeReady && !airportsLoading && (
          <EmptyState />
        )}

        {routeReady && (
          <div className="np-sections">

            <NetworkMap
              airports={airports}
              origin={origin}
              destination={destination}
            />

            {marketLoading
              ? <SectionSkeleton rows={4} />
              : <MarketOverview
                  market={market}
                  loading={marketLoading}
                  error={marketError}
                />
            }

            {(trafficLoading || demandLoading || capacityLoading)
              ? <SectionSkeleton rows={5} />
              : <HistoricalIntelligence
                  traffic={historicalTraffic}
                  demand={demand}
                  capacity={capacity}
                  loading={trafficLoading || demandLoading || capacityLoading}
                  error={trafficError || demandError || capacityError}
                />
            }

            <DemandForecast
              origin={origin}
              destination={destination}
            />

            {(competitionLoading || faresLoading)
              ? <SectionSkeleton rows={3} />
              : <CompetitionAnalysis
                  competition={competition}
                  fares={fares}
                  loading={competitionLoading || faresLoading}
                  error={competitionError || faresError}
                />
            }

            {opportunityLoading
              ? <SectionSkeleton rows={3} />
              : <RouteOpportunity
                  opportunity={opportunity}
                  loading={opportunityLoading}
                  error={opportunityError}
                />
            }

            {costLoading
              ? <SectionSkeleton rows={3} />
              : <RouteEconomics
                  operatingCosts={operatingCosts}
                  loading={costLoading}
                  error={costError}
                />
            }

            <WhatIfScenario
              origin={origin}
              destination={destination}
            />

          </div>
        )}

      </main>

      {/* ── Footer ── */}

      <footer className="np-footer">
        <span>AeroInsight</span>
        <span>·</span>
        <span>Network Planning Dashboard</span>
        <span>·</span>
        <span>Data for planning purposes only</span>
      </footer>

    </div>
  );
}

export default NetworkPlanner;