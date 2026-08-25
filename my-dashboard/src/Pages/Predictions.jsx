import NetworkMap from "../components/Maps/NetworkMap"
import DemandIntelligence from "../components/Demand Intelligence/DemandIntelligence"


export default function Predictions() {
  return (
    <>
    <div>
      <h1>Predictions Page</h1>
      <NetworkMap />
      <br></br> <br></br>
      <h1>Market Demand</h1>
      <DemandIntelligence />  
      </div>
      </>
  );
}