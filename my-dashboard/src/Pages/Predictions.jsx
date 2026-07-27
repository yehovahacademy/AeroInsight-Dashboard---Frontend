import { useState, useEffect } from "react";
import WeatherForecastCard from "../components/Predictions/WeatherForecastCard";
import AviationRiskCard from "../components/Predictions/AviationRiskCard";
import DelayPredictionCard from "../components/Predictions/DelayPredictionCard";
import "../styles/Predictions.css";
import AviationAlerts from "../components/Predictions/AviationAlerts";
import VisibilityForecastCard from "../components/Predictions/VisibilityForecastCard";



function Predictions() {
  const [predictionData, setPredictionData] = useState(null);

  useEffect(() => {
    fetch("https://aeroinsight-dashboard-backend.onrender.com/weather/?airport=BOM")
      .then((res) => res.json())
      .then((data) => setPredictionData(data))
      .catch((err) => console.error("Error fetching weather data:", err));
  }, []);

  return (
    <div className="predictions-page">

      <div className="predictions-grid">

        {/* Weather takes the full left column */}
        <div className="predictions-col-main">
          <WeatherForecastCard weather={predictionData} />
          <br></br><br></br>
          <VisibilityForecastCard visibility={predictionData?.visibility_forecast} />
        </div>

        {/* Delay + Aviation stack in the right column */}
        <div className="predictions-col-side">
          <DelayPredictionCard prediction={predictionData?.delay_prediction} />
          <AviationRiskCard risk={predictionData?.aviation_risk} />
          <AviationAlerts alerts={predictionData?.aviation_alerts} />
        </div>


      </div>

    </div>
  );
}

export default Predictions;