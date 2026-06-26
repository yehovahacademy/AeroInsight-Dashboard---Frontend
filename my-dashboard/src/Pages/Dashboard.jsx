import "../styles/Dashboard.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartLine, faCloud } from "@fortawesome/free-solid-svg-icons";
import {faPlane} from "@fortawesome/free-solid-svg-icons";
import airportvideo from "../assets/airportvideo.mp4";

function Dashboard() {
  return (
    <>
    <title>Dashboard Page</title>
    <div className="hero">
  <video
    className="background-video"
    autoPlay
    loop
    muted
    playsInline
  >
    <source src={airportvideo} type="video/mp4" />
  </video>

  <div className="hero-overlay" />

  <div className="hero-content">
    <div className="heading">
      <h1>Welcome to AeroInsight Dashboard</h1>
      <h2>Where aviation meets Insights</h2>
    </div>

    <div className="buttons">
      <button>Login</button>
      <button>SignUp</button>
    </div>
  </div>
</div>
<br></br><br></br>

<div className="features-section">
  <div className="features-header">
    <p>Platform Capabilities</p>
    <h1>Take a Look at What We Do</h1>
  </div>

  <div className="features-grid">

    <div className="feature-card card-realtime">
      <div className="card-icon">
        <FontAwesomeIcon icon={faChartLine} />
      </div>
      <div>
        <h2>Real-Time Analysis</h2>
        <p>Live aviation data processed and visualised the moment it lands.</p>
        <span className="card-tag">Live Data</span>
      </div>
    </div>

    <div className="feature-card card-delays">
      <div className="card-icon">
        <FontAwesomeIcon icon={faPlane} />
      </div>
      <h2>Flight Delays</h2>
      <p>Predict and track delay patterns before they impact your operations.</p>
      <span className="card-tag">Predictive</span>
    </div>

    <div className="feature-card card-weather">
      <div className="card-icon">
        <FontAwesomeIcon icon={faCloud} />
      </div>
      <h2>Weather Forecast</h2>
      <p>For a safe and peaceful journey.</p>
      <span className="card-tag">Safety First</span>
    </div>

  </div>
</div>
</>
  );
}

export default Dashboard;