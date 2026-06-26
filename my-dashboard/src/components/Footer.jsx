import "../styles/Footer.css";




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
      <a href="/Dashboard">Dashboard</a>
      <a href="/Flights">Flights</a>
      <a href="/Analytics">Analytics</a>
      <a href="/Predictions">Predictions</a>
      <a href="/Reports">Reports</a>
    </div>

    <div className="footer-links">
      <h3>Resources</h3>
      <a href="/Documentation">Documentation</a>
      <a href="/About">About</a>
      <a href="/Contact">Contact</a>
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