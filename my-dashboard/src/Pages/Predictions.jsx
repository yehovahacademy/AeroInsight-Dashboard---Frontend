
import  { useState, useEffect } from "react";
import WeatherForecastCard from "../components/Predictions/WeatherForecastCard";




function Predictions() {

  const[weather, setWeather] = useState(null);

  useEffect(() => {
    fetch( "https://aeroinsight-dashboard-backend.onrender.com/weather/?airport=BOM")
      .then((response) => response.json())
      .then((data) => setWeather(data))
      .catch((error) => console.error("Error fetching weather data:", error));
  }, []);

  return (
    <>
    <br></br><br></br>
    
    <WeatherForecastCard weather={weather} />  

    <br></br><br></br>

    </>
    
  );
}

export default Predictions;