import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Dashboard from "./Pages/Dashboard";
import { Route,Routes } from "react-router-dom";
import Flights from "./Pages/Flights";






function App() {
  return (
    <>
<Navbar />



<Routes>
  <Route path="/Dashboard" element={<Dashboard />} />
  <Route path="/Flights" element={<Flights/>}/>
</Routes>


<Footer />

    </>
  );
}

export default App;

