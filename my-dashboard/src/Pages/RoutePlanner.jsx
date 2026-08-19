import { Route, Routes } from "react-router-dom";
import { useState, useEffect } from "react";

import NetworkPlanner from "../components/Network/NetworkPlanner";
import NetworkMap from "../components/Maps/NetworkMap";

// ─────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────

function RoutePlanner() {
  return (
    <NetworkPlanner />
  );
}

export default RoutePlanner;