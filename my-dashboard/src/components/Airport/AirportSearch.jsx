import { useState, useRef } from "react";
import "./AirportSearch.css";

const POPULAR_AIRPORTS = [
  { code: "BOM", city: "Mumbai" },
  { code: "DEL", city: "Delhi" },
  { code: "BLR", city: "Bengaluru" },
  { code: "MAA", city: "Chennai" },
  { code: "DXB", city: "Dubai" },
  { code: "LHR", city: "London" },
  { code: "JFK", city: "New York" },
  { code: "SIN", city: "Singapore" },
];

const AirportSearch = ({ onSearch }) => {
  const [iata, setIata] = useState("BOM");
  const [active, setActive] = useState(null);
  const inputRef = useRef(null);

  const isValid = iata.trim().length === 3;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isValid) return;
    onSearch(iata.toUpperCase());
  };

  const handleChip = (code) => {
    setActive(code);
    setIata(code);
    onSearch(code);
  };

  const handleChange = (e) => {
    const val = e.target.value.replace(/[^a-zA-Z]/g, "").toUpperCase();
    setIata(val);
    setActive(null);
  };

  return (
    <div className="as-card">
      {/* Header */}
      <div className="as-header">
        <div className="as-header-icon">✈</div>
        <div>
          <h2 className="as-title">Airport Intelligence</h2>
          <p className="as-subtitle">
            Search any airport worldwide by IATA code
          </p>
        </div>
      </div>

      <div className="as-divider" />

      {/* Search Form */}
      <div className="as-body">
        <form className="as-form" onSubmit={handleSubmit}>
          <div className={`as-input-wrapper${isValid ? " as-input-wrapper--valid" : ""}`}>
            <span className="as-input-badge">IATA</span>
            <input
              ref={inputRef}
              className="as-input"
              type="text"
              placeholder="e.g. BOM"
              value={iata}
              maxLength={3}
              autoComplete="off"
              spellCheck={false}
              onChange={handleChange}
            />
            <span className={`as-input-check${isValid ? " as-input-check--visible" : ""}`}>
              ✓
            </span>
          </div>
          <button
            className="as-btn"
            type="submit"
            disabled={!isValid}
          >
            <span className="as-btn-icon">⚡</span>
            Analyze Airport
          </button>
        </form>

        {/* Popular Airports */}
        <div className="as-popular">
          <p className="as-popular-label">Quick Select</p>
          <div className="as-chips">
            {POPULAR_AIRPORTS.map(({ code, city }) => (
              <button
                key={code}
                className={`as-chip${active === code ? " as-chip--active" : ""}`}
                onClick={() => handleChip(code)}
                title={city}
              >
                <span className="as-chip-code">{code}</span>
                <span className="as-chip-city">{city}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AirportSearch;