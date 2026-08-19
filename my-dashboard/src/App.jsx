import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./Pages/Home";
import { Route,Routes } from "react-router-dom";
import RoutePlanner from "./Pages/RoutePlanner";
import Analytics from "./Pages/Analytics";
import Predictions from "./Pages/Predictions";






function App() {
  return (
    <>
<Navbar />



<Routes>
   <Route path="/" element={<Home />} />
  <Route path="/home" element={<Dashboard />} />
  <Route path="/routeplanner" element={<RoutePlanner/>}/>
  <Route path ="/analytics" element={<Analytics/>}/>
  <Route path="/predictions" element={<Predictions/>}/>
</Routes>


<Footer />

    </>
  );
}

export default App;

