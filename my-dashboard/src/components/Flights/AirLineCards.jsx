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


export default function AirLineCards() {
  return (
    <>
    <div className="hero-3">
      <div className="airlines">
        <div className="heading-airlines">Popular Airlines to Travel with</div>
        <div className="airlines-grid">
          <div className="airline-item">
            <img src={indigo} alt="Indigo Airlines" />
            <h2>Indigo Airlines</h2>
          </div>
          <div className="airline-item">
            <img src={akasa} alt="Akasa Airlines" />
            <h2>Akasa Airlines</h2>
          </div>
          <div className="airline-item">
            <img src={alaska} alt="Alaska Airlines" />
            <h2>Alaska Airlines</h2>
          </div>
          <div className="airline-item">
            <img src={alliance} alt="Alliance Airlines" />
            <h2>Alliance Airlines</h2>
          </div>
          <div className="airline-item">
            <img src={canada} alt="Canada Airlines" />
            <h2>Canada Airlines</h2>
          </div>
          <div className="airline-item">
            <img src={delta} alt="Delta Airlines" />
            <h2>Delta Airlines</h2>
          </div>
          <div className="airline-item">
            <img src={lufthansa} alt="Lufthansa Airlines" />
            <h2>Lufthansa Airlines</h2>
          </div>
          <div className="airline-item">
            <img src={nippon} alt="Nippon Airlines" />
            <h2>Nippon Airlines</h2>
          </div>
          <div className="airline-item">
            <img src={qatar} alt="Qatar Airlines" />
            <h2>Qatar Airways</h2>
          </div>
          <div className="airline-item">
            <img src={express} alt="Air India Express" />
            <h2>Air India Express</h2>
          </div>
        </div>
      </div>
    </div>



    </>

  );
}

