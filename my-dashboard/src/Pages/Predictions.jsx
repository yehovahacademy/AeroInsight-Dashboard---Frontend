
import  { useState, useEffect } from "react";
import WeatherForecastCard from "../components/Predictions/WeatherForecastCard";
import AviationRiskCard from "../components/Predictions/AviationRiskCard";




function Predictions() {

  const [predictionData, setPredictionData] = useState(null);

  useEffect(() => {
    fetch( "https://aeroinsight-dashboard-backend.onrender.com/weather/?airport=BOM")
      .then((response) => response.json())
      .then((data) => setPredictionData(data))
      .catch((error) => console.error("Error fetching weather data:", error));
  }, []);

  return (
    <>
    <br></br><br></br>
    
    <WeatherForecastCard weather= {predictionData} />  
    <br></br><br></br>
    <AviationRiskCard
    risk={predictionData?.aviation_risk}
/>

    <br></br><br></br>

    </>
    
  );
}

export default Predictions;