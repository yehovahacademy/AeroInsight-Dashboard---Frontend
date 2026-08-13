import NetworkPlanner from "../components/Network/NetworkPlanner";
import { Route,Routes } from "react-router-dom";
import { useState, useEffect } from "react";


function RoutePlanner(){
  const[route, setRoute] = useState(null);

  useEffect(() => {
    fetch("https://aeroinsight-dashboard-backend.onrender.com/airports/api/airports/search/QUO")
      .then((response) => response.json())
      .then((data) => {
        setRoute(data); 
      })
      .catch((error) => {
        console.error("Error fetching route data:", error);
      });
  }, []);  


  return (
    <>
    <NetworkPlanner />

   
    </>

  );
}

export default RoutePlanner;