

import { useEffect } from "react";
import NetworkPlanner from "../components/Network/NetworkPlanner";


// ─────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────

function RoutePlanner() {
  useEffect (() => {
       document.title = "AeroInsight | Route Planner"
    },[]);


  return (
    <NetworkPlanner />

  );
}

export default RoutePlanner;