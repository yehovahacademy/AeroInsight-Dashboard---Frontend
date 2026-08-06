import { useEffect, useState } from "react";
import "./FleetOverview.css";

function FleetOverview() {
  const [fleet, setFleet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch('https://aeroinsight-dashboard-backend.onrender.com/fleet/fleet/')
      .then((res) => res.json())
      .then((data) => {
        setFleet(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError(true);
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="fleet-status">Loading fleet data...</p>;
  if (error || !fleet) return <p className="fleet-status fleet-status--error">Unable to load fleet data.</p>;

  const metrics = [
    { label: "Total Aircraft Types", value: fleet.total_aircraft },
    { label: "Manufacturers",        value: fleet.manufacturers  },
  ];

  return (
    <div className="fleet-overview">
      <h2 className="fleet-overview__title">Fleet Analytics</h2>

      <div className="fleet-cards">
        {metrics.map(({ label, value }) => (
          <div key={label} className="fleet-card">
            <h3 className="fleet-card__label">{label}</h3>
            <p  className="fleet-card__value">{value ?? "—"}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default FleetOverview;