import "../../styles/NetworkPlanner.css";

const RECOMMENDATION_COLORS = {
  "Increase flight frequency": {
    bg: "#e8f5e9",
    text: "#2e7d32",
  },

  "Maintain": {
    bg: "#e8f5e9",
    text: "#2e7d32",
  },

  "Reduce Frequency": {
    bg: "#fce4ec",
    text: "#c62828",
  },

  "Monitor": {
    bg: "#fff8e1",
    text: "#f57f17",
  },

  "Review": {
    bg: "#fce4ec",
    text: "#c62828",
  },
};



function RouteCards({ data }) {


  if (!data) {
    return (
      <div className="hero-3">
        <div className="airlines">
          <div className="heading-airlines">
            Route Analysis
          </div>

          <p>
            Select a route and click Analyse Route to see insights.
          </p>

        </div>
      </div>
    );
  }



  const badge =
    RECOMMENDATION_COLORS[data.recommendation] ||
    RECOMMENDATION_COLORS["Monitor"];



  return (

    <div className="hero-3">

      <div className="airlines">


        <div className="heading-airlines">
          Route Performance Overview
        </div>



        <div className="airlines-grid">


          <div
            className="airline-item"
            style={{
              cursor:"pointer",
              padding:"16px",
              borderRadius:"8px"
            }}
          >


            <h2
              style={{
                fontSize:"18px",
                fontWeight:700
              }}
            >
              {data.origin} → {data.destination}
            </h2>



            <div style={{marginTop:"10px"}}>

              <p>
                <strong>Distance:</strong>{" "}
                {data.distance_km} km
              </p>


              <p>
                <strong>Estimated Duration:</strong>{" "}
                {data.estimated_duration}
              </p>


              <p>
                <strong>Demand Score:</strong>{" "}
                {data.demand_score}%
              </p>


              <p>
                <strong>Weather Risk:</strong>{" "}
                {data.weather_risk}
              </p>


              <p>
                <strong>Estimated Revenue:</strong>{" "}
                ₹{data.estimated_revenue.toLocaleString()}
              </p>


              <p>
                <strong>Estimated Cost:</strong>{" "}
                ₹{data.estimated_cost.toLocaleString()}
              </p>


              <p>
                <strong>Estimated Profit:</strong>{" "}
                ₹{data.estimated_profit.toLocaleString()}
              </p>


            </div>



            <div
              style={{
                marginTop:"12px",
                display:"inline-block",
                padding:"5px 12px",
                borderRadius:"15px",
                fontSize:"12px",
                fontWeight:600,
                background:badge.bg,
                color:badge.text
              }}
            >

              {data.recommendation}

            </div>



          </div>


        </div>


      </div>

    </div>

  );

}


export default RouteCards;