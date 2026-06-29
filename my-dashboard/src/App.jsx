import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Dashboard from "./Pages/Dashboard";
import { Route,Routes } from "react-router-dom";
import Flights from "./Pages/Flights";
import Analytics from "./Pages/Analytics";






function App() {
  return (
    <>
<Navbar />



<Routes>
  <Route path="/Dashboard" element={<Dashboard />} />
  <Route path="/Flights" element={<Flights/>}/>
  <Route path ="/Analytics" element={<Analytics/>}/>
</Routes>


<Footer />

    </>
  );
}

export default App;

