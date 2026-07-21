import "../../styles/FlightRow.css";

import indigo from "../../assets/indigo.png";
import akasa from "../../assets/akasa.png";
import alaska from "../../assets/alaska.png";
import alliance from "../../assets/alliance.png";
import canada from "../../assets/canada.png";
import delta from "../../assets/delta.png";
import lufthansa from "../../assets/lufthansa.png";
import nippon from "../../assets/nippon.png";
import qatar from "../../assets/qatar.png";
import express from "../../assets/express.png";





function AirLineCards({
  selectedAirline,
  setSelectedAirline,
}) {

    const handleAirlineClick = (airlineName) => {
        setSelectedAirline(prev =>
            prev === airlineName ? null : airlineName
        );
    };




  return (

    <>
    <div className="hero-3">
      <div className="airlines">
        <div className="heading-airlines">Popular Airlines to Travel with</div>
        <div className="airlines-grid">
          <div className="airline-item" onClick={() => handleAirlineClick("IndiGo")}>
            <img src={indigo} alt="Indigo Airlines" />
            <h2>Indigo Airlines</h2>
          </div>
          <div className="airline-item" onClick={() => handleAirlineClick("Akasa Air")}>
            <img src={akasa} alt="Akasa Airlines" />
            <h2>Akasa Airlines</h2>
          </div>
          <div className="airline-item" onClick={() => handleAirlineClick("Alaska Airlines")}>
            <img src={alaska} alt="Alaska Airlines" />
            <h2>Alaska Airlines</h2>
          </div>
          <div className="airline-item" onClick={() => handleAirlineClick("Alliance Airlines")}>
            <img src={alliance} alt="Alliance Airlines" />
            <h2>Alliance Airlines</h2>
          </div>
          <div className="airline-item" onClick={() => handleAirlineClick("Air Canada")}>
            <img src={canada} alt="Canada Airlines" />
            <h2>Canada Airlines</h2>
          </div>
          <div className="airline-item" onClick={() => handleAirlineClick("Delta Air Lines")}>
            <img src={delta} alt="Delta Airlines" />
            <h2>Delta Airlines</h2>
          </div>
          <div className="airline-item" onClick={() => handleAirlineClick("Lufthansa")}>
            <img src={lufthansa} alt="Lufthansa Airlines" />
            <h2>Lufthansa Airlines</h2>
          </div>
          <div className="airline-item" onClick={() => handleAirlineClick("All Nippon Airways")}>
            <img src={nippon} alt="Nippon Airlines" />
            <h2>Nippon Airlines</h2>
          </div>
          <div className="airline-item" onClick={() => handleAirlineClick("Qatar Airways")}>
            <img src={qatar} alt="Qatar Airlines" />
            <h2>Qatar Airways</h2>
          </div>
          <div className="airline-item" onClick={() => handleAirlineClick("Air India Express")}>
            <img src={express} alt="Air India Express" />
            <h2>Air India Express</h2>
          </div>
        </div>
      </div>
    </div>



    </>

  );
}
export default AirLineCards;

