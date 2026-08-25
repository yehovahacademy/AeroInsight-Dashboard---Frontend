import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./Pages/Home";
import { Route,Routes } from "react-router-dom";
import RoutePlanner from "./Pages/RoutePlanner";
import Predictions from "./Pages/Predictions";
import Reports from "./Pages/Reports";






function App() {
  return (
    <>
<Navbar />



<Routes>
   <Route path="/" element={<Home />} />
  <Route path="/home" element={<Home />} />
  <Route path="/routeplanner" element={<RoutePlanner/>}/>
  <Route path="/predictions" element={<Predictions/>}/>
  <Route path="/reports" element={<Reports />}/>
</Routes>


<Footer />

    </>
  );
}

export default App;

