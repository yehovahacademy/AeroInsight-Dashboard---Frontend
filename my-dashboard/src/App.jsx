import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./Pages/Home";
import { Route, Routes } from "react-router-dom";
import RoutePlanner from "./Pages/RoutePlanner";
import Predictions from "./Pages/Predictions";
import Reports from "./Pages/Reports";
import AuthPage from "./Pages/AuthPage";

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/"             element={<Home />} />
        <Route path="/home"         element={<Home />} />
        <Route path="/routeplanner" element={<RoutePlanner />} />
        <Route path="/predictions"  element={<Predictions />} />
        <Route path="/reports"      element={<Reports />} />
        {/* Both routes render the same AuthPage — it reads the path internally */}
        <Route path="/login"        element={<AuthPage />} />
        <Route path="/register"     element={<AuthPage />} />
      </Routes>

      <Footer />
    </>
  );
}

export default App;