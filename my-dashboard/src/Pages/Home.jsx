import "../styles/Home.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartLine, faCloud,faChartBar,faBuilding,faClock,faArrowTrendUp,faArrowTrendDown} from "@fortawesome/free-solid-svg-icons";
import {faPlane} from "@fortawesome/free-solid-svg-icons";
import airportvideo from "../assets/airportvideo.mp4";
import {useEffect} from "react";

function Dashboard() {
    useEffect(() => {
    document.title = "Home";
  }, []);

  return (
    <>
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

<br></br><br></br>
<div className="title">
  <h1>Accurate Statistics</h1>
</div>
<div className="stats-bar">
  <div className="stats-inner">

    <div className="stat-item">
      <FontAwesomeIcon icon={faPlane} className="stat-icon" />
      <div className="stat-number"><span id="s1">0</span>+</div>
      <div className="stat-label">Flights Tracked</div>
      <div className="stat-delta">
        <FontAwesomeIcon icon={faArrowTrendUp} /> Live updates
      </div>
    </div>

    <div className="stat-item">
      <FontAwesomeIcon icon={faChartBar} className="stat-icon" />
      <div className="stat-number"><span id="s2">0</span><span>%</span></div>
      <div className="stat-label">Prediction Accuracy</div>
      <div className="stat-delta">
        <FontAwesomeIcon icon={faArrowTrendUp} /> This month
      </div>
    </div>

    <div className="stat-item">
      <FontAwesomeIcon icon={faBuilding} className="stat-icon" />
      <div className="stat-number"><span id="s3">0</span><span>+</span></div>
      <div className="stat-label">Airports Monitored</div>
      <div className="stat-delta">
        <FontAwesomeIcon icon={faArrowTrendUp} /> Worldwide
      </div>
    </div>

    <div className="stat-item">
      <FontAwesomeIcon icon={faClock} className="stat-icon" />
      <div className="stat-number"><span id="s4">0</span><span>ms</span></div>
      <div className="stat-label">Avg. Data Latency</div>
      <div className="stat-delta">
        <FontAwesomeIcon icon={faArrowTrendDown} /> Near real-time
      </div>
    </div>

  </div>
</div>
</>
  );
}

export default Dashboard;