import "../styles/Navbar.css";
import logo from "../assets/logo.png";
import {Link} from "react-router-dom";


function Navbar() {
  return (
    <>
  <div className="Navbar">
      <a className="Navbar-brand" href="/Dashboard">
        <img src={logo} alt="AeroInsight logo" />
        <h1>AeroInsight</h1>
      </a>

      <div className="Navbar-divider" />

      <Link to="/Dashboard">Dashboard</Link>
      <Link to="/Flights">Flights</Link>
      <Link to="/Analytics">Analytics</Link>
      <Link to="/Predictions">Predictions</Link>
      <Link to="/Reports">Reports</Link>
    </div>
    <br></br>
    </>
  );
}

export default Navbar;