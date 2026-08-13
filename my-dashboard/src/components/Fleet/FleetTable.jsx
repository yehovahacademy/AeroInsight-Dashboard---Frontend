import { useState } from "react";
import "./FleetTable.css";

const COLUMNS = [
    { key: "name",         label: "Aircraft"      },
    { key: "manufacturer", label: "Manufacturer"  },
    { key: "iata_code",    label: "IATA"          },
    { key: "icao_code",    label: "ICAO"          },
];

function FleetTable({ aircraft = [] }) {
    const [search, setSearch] = useState("");

    const filtered = aircraft.filter((plane) => {
        const query = search.toLowerCase();
        return (
            plane.name.toLowerCase().includes(query)              ||
            plane.manufacturer.toLowerCase().includes(query)      ||
            (plane.iata_code || "").toLowerCase().includes(query) ||
            (plane.icao_code || "").toLowerCase().includes(query)
        );
    });

    return (
        <div className="fleet-table-section">

            {/* ── Header ── */}
            <div className="fleet-table-section__header">
                <h2 className="fleet-table-section__title">Aircraft Catalogue</h2>
                <input
                    className="fleet-table-section__search"
                    type="text"
                    placeholder="Search aircraft..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            {/* ── Table ── */}
            <div className="fleet-table-wrapper">
                <table className="fleet-table">
                    <thead>
                        <tr>
                            {COLUMNS.map(({ key, label }) => (
                                <th key={key} className="fleet-table__th">{label}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.length > 0 ? (
                            filtered.map((plane, index) => (
                               <tr key={`${plane.iata_code}-${index}`} className="fleet-table__row">
                                    <td className="fleet-table__td">{plane.name}</td>
                                    <td className="fleet-table__td">
                                        <span className={`manufacturer-badge manufacturer-badge--${plane.manufacturer.toLowerCase()}`}>
                                            {plane.manufacturer}
                                        </span>
                                    </td>
                                    <td className="fleet-table__td fleet-table__td--code">{plane.iata_code || "—"}</td>
                                    <td className="fleet-table__td fleet-table__td--code">{plane.icao_code || "—"}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td className="fleet-table__empty" colSpan={COLUMNS.length}>
                                    No aircraft match &ldquo;{search}&rdquo;
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* ── Footer count ── */}
            <p className="fleet-table-section__count">
                {filtered.length} of {aircraft.length} aircraft
            </p>

        </div>
    );
}

export default FleetTable;