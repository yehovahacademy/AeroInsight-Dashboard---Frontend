import "../styles/Dashboard.css"

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
</>
  );
}

export default Dashboard;