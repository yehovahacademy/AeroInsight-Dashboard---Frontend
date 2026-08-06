import "./FleetStats.css";

function FleetStats({ fleet }) {
  if (!fleet) return null;

  const airbus = fleet.aircraft.filter((a) => a.manufacturer === "Airbus").length;
  const boeing = fleet.aircraft.filter((a) => a.manufacturer === "Boeing").length;

  const stats = [
    { label: "Total Aircraft Types", value: fleet.total_aircraft, accent: "orange" },
    { label: "Manufacturers",        value: fleet.manufacturers,  accent: "blue"   },
    { label: "Airbus Models",        value: airbus,               accent: "orange" },
    { label: "Boeing Models",        value: boeing,               accent: "blue"   },
  ];

  return (
    <div className="fleet-stats">
      {stats.map(({ label, value }) => (
        <div key={label} className="fleet-stat-card">
          <h3 className="fleet-stat-card__label">{label}</h3>
          <p  className="fleet-stat-card__value">{value ?? "—"}</p>
        </div>
      ))}
    </div>
  );
}

export default FleetStats;