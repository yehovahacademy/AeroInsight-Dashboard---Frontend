import AirLineCards from "../components/Flights/AirLineCards";
import FlightDetails from "../components/Flights/FlightDetails";
import { useState } from "react";


function Analytics() {

   const [selectedAirline, setSelectedAirline] = useState(null);
  return (
   <>
   
   <AirLineCards selectedAirline={selectedAirline}
    setSelectedAirline={setSelectedAirline} />
    
   <FlightDetails selectedAirline={selectedAirline} />
   
   </>
  );
}

export default Analytics;