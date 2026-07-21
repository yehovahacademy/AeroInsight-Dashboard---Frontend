import AirLineCards from "../components/Flights/AirLineCards";
import FlightDetails from "../components/Flights/FlightDetails";
import { useState, useEffect } from "react";


function Analytics() {

  const [stats, setStats] = useState(null);

  fetch("https://aeroinsight-dashboard-backend.onrender.com/analytics/")
        .then((response) => response.json())
        .then((data) => {
            setStats(data);
        })
        .catch((error) => {
            console.log(error);
        });


   const [selectedAirline, setSelectedAirline] = useState(null);
  return (
   <>
   <div>
            <h1>Analytics Dashboard</h1>

            {stats && (
                <div>
                    <h3>Total Flights: {stats.total_flights}</h3>
                    <h3>On Time: {stats.on_time_flights}</h3>
                    <h3>Delayed: {stats.delayed_flights}</h3>
                </div>
            )}

        </div>
    
   
   <AirLineCards selectedAirline={selectedAirline}
    setSelectedAirline={setSelectedAirline} />

   <FlightDetails selectedAirline={selectedAirline} />
   
   </>
  );
}

export default Analytics;