import "../styles/Navbar.css";
import logo from "../assets/logo.png";


function Navbar() {
  return (
    <>
  <div className="Navbar">
      <a className="Navbar-brand" href="/Dashboard">
        <img src={logo} alt="AeroInsight logo" />
        <h1>AeroInsight</h1>
      </a>

      <div className="Navbar-divider" />

      <a href="/Dashboard">Dashboard</a>
      <a href="/Flights">Flights</a>
      <a href="/Analytics">Analytics</a>
      <a href="/Predictions">Predictions</a>
      <a href="/Reports">Reports</a>
    </div>
    <br></br>
    </>
  );
}

export default Navbar;