import { useEffect, useState } from "react";
import "./FleetOverview.css";
import FleetStats from "./FleetStats";
import FleetTable from "./FleetTable";

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

  return (
   <>
  <div className="fleet-overview">
    <h2 className="fleet-overview__title">
      Fleet Analytics
    </h2>

    <FleetStats fleet={fleet} />

    
  </div>
  </>
);
  
}

export default FleetOverview;