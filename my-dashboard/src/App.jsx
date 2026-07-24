import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Dashboard from "./Pages/Dashboard";
import { Route,Routes } from "react-router-dom";
import Flights from "./Pages/Flights";
import Analytics from "./Pages/Analytics";
import Home from "./components/Flights/Home";
import Predictions from "./Pages/Predictions";






function App() {
  return (
    <>
<Navbar />



<Routes>
   <Route path="/" element={<Home />} />
  <Route path="/dashboard" element={<Dashboard />} />
  <Route path="/flights" element={<Flights/>}/>
  <Route path ="/analytics" element={<Analytics/>}/>
  <Route path="/predictions" element={<Predictions/>}/>
</Routes>


<Footer />

    </>
  );
}

export default App;

