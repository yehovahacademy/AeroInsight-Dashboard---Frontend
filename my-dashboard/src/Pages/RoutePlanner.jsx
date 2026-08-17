import NetworkPlanner from "../components/Network/NetworkPlanner";
import { Route,Routes } from "react-router-dom";
import { useState, useEffect } from "react";
import NetworkMap from "../components/Maps/NetworkMap";


function RoutePlanner(){ 
  return (
    <>
    <NetworkPlanner />
    <NetworkMap />

   
    </>

  );
}

export default RoutePlanner;