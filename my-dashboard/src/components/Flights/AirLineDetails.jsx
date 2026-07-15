import "./AirLineDetails.css";

export default function AirLineDetails({airline}) {

  if(!airline) return null;


   return (
    <>
    <section className="airline-details">
  <div className="airline-header">
    <img src={airline.logo} alt={airline.name} className="airline-logo" />
    <div>
      <h2>{airline.name}</h2>
      <p>{airline.country}</p>
    </div>
  </div>

  <div className="stats-grid">
    <div className="stat-card">
      <h3>Total Flights</h3>
      <p>{stats.totalFlights ?? "—"}</p>
    </div>
    <div className="stat-card">
      <h3>Average Delay</h3>
      <p>{stats.avgDelay != null ? `${stats.avgDelay} min` : "—"}</p>
    </div>
    <div className="stat-card">
      <h3>Average Air Time</h3>
      <p>{stats.avgAirTime != null ? `${stats.avgAirTime} min` : "—"}</p>
    </div>
    <div className="stat-card">
      <h3>Average Distance</h3>
      <p>{stats.avgDistance != null ? `${stats.avgDistance} mi` : "—"}</p>
    </div>
  </div>

  <div className="flight-table">
    <h3>Recent Flights</h3>
    <table>
      <thead>
        <tr>
          <th>Flight</th>
          <th>Origin</th>
          <th>Destination</th>
          <th>Air Time</th>
          <th>Delay</th>
        </tr>
      </thead>
      <tbody>
        {flights.length > 0 ? (
          flights.map((f) => (
            <tr key={f.id}>
              <td>{f.flightNumber}</td>
              <td>{f.origin}</td>
              <td>{f.destination}</td>
              <td>{f.airTime} min</td>
              <td className={f.delay > 0 ? "delay-positive" : "delay-none"}>
                {f.delay > 0 ? `${f.delay} min` : "On time"}
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="5" className="no-data">No recent flights found</td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
</section>
    </>

   );
}