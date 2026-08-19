import "../styles/Footer.css";
import {Link} from "react-router-dom";




function Footer() {
  return (
    <>
    <footer className="footer">
  <div className="footer-top">

    <div className="footer-brand">
      <h2>AeroInsight</h2>
      <p>Where aviation meets insights. Real-time analytics and predictions for modern aviation intelligence.</p>
    </div>

    <div className="footer-links">
      <h3>Quick Links</h3>
      <Link to="/Home">Home</Link>
      <Link to="/RoutePlanner">Route Planner</Link>
      <Link to="/Analytics">Analytics</Link>
      <Link to="/Predictions">Predictions</Link>
      <Link to="/Reports">Reports</Link>
    </div>

    <div className="footer-links">
      <h3>Resources</h3>
      <Link to="/Documentation">Documentation</Link>
      <Link to="/About">About</Link>
      <Link to="/Contact">Contact</Link>
    </div>

    <div className="footer-links">
      <h3>Tech Stack</h3>
      <ul>
        <li>React</li>
        <li>Python</li>
        <li>FastAPI</li>
        <li>PostgreSQL</li>
      </ul>
    </div>

  </div>

  <div className="footer-bottom">
    <p>© 2026 AeroInsight. All rights reserved.</p>
  </div>
</footer>
    </>
  );
}

export default Footer;