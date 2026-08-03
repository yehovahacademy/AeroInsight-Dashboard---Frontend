import { useState } from "react";
import "./AirportSearch.css";

const AirportSearch = ({ onSearch }) => {
    const [iata, setIata] = useState("BOM");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!iata.trim()) return;
        onSearch(iata.toUpperCase());
    };

    return (
        <div className="airport-search-card">
            <div className="airport-search-card__header">
                <span className="airport-search-card__icon">✈</span>
                <h2 className="airport-search-card__title">Airport Intelligence</h2>
            </div>
            <p className="airport-search-card__subtitle">
                Enter an IATA code to analyze route performance and traffic data.
            </p>
            <form className="airport-search-card__form" onSubmit={handleSubmit}>
                <div className="airport-search-card__input-wrapper">
                    <span className="airport-search-card__input-badge">IATA</span>
                    <input
                        className="airport-search-card__input"
                        type="text"
                        placeholder="e.g. BOM, DEL, BLR"
                        value={iata}
                        maxLength={3}
                        onChange={(e) => setIata(e.target.value.toUpperCase())}
                        spellCheck={false}
                        autoComplete="off"
                    />
                    {iata.length === 3 && (
                        <span className="airport-search-card__input-check">✓</span>
                    )}
                </div>
                <button
                    className="airport-search-card__btn"
                    type="submit"
                    disabled={iata.length !== 3}
                >
                    Analyze Airport
                </button>
            </form>
        </div>
    );
};

export default AirportSearch;