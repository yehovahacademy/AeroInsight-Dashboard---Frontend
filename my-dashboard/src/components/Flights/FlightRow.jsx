import "../../styles/FlightRow.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartLine, faCloud,faChartBar,faBuilding,faClock,faArrowTrendUp,faArrowTrendDown, faCreditCard} from "@fortawesome/free-solid-svg-icons";
import {faPlane} from "@fortawesome/free-solid-svg-icons";
import { faRightLeft } from "@fortawesome/free-solid-svg-icons";
import { faCcVisa } from "@fortawesome/free-brands-svg-icons";
import { faUsers } from "@fortawesome/free-solid-svg-icons";
import {faGem} from "@fortawesome/free-solid-svg-icons";
import {faBell} from "@fortawesome/free-solid-svg-icons";


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



  function FlightRow() {

   const handleSwap = () => {
    const from = document.querySelector(".search-1 input");
    const to = document.querySelector(".search-2 input");
    [from.value, to.value] = [to.value, from.value];
  };

  return (
    <>
    <div className="Hero">
      <h2>Book Your Flights From Your Comfort Place</h2>
      <h3>Anytime and anywhere</h3>
   <div className="card-1">
    <div className="button-1">
      <button>One way</button>
    </div>
    <br></br>
    <div className="button-2">
      <button>Round Trip</button>
    </div>
   </div>
   <br></br>
  <div className="search-bar">

      <div className="search-group">
        <div className="search-1 input-box">
          <input type="text" placeholder="From" />
        </div>
        <button className="swap-btn" onClick={handleSwap} aria-label="Swap">
          <FontAwesomeIcon icon={faRightLeft} />
        </button>
        <div className="search-2 input-box">
          <input type="text" placeholder="To" />
        </div>
      </div>

      <div className="divider"></div>

      <div className="date-group">
        <div className="date-1 input-box">
          <span className="date-label">Departure</span>
          <input type="datetime-local" />
        </div>
        <div className="date-2 input-box">
          <span className="date-label">Return</span>
          <input type="datetime-local" />
        </div>
      </div>

      <div className="Traveller&Class">
        <div className="Traveller">
          <label>Traveller</label>
          <input type="text" placeholder="Traveller"/>
        </div>
        <div className="Class">
          <label>Class</label>
          <input type="text" placeholder="Class"/>
        </div>
      </div>

    </div>

    </div>

    <br></br><br></br>

     <div className="heading-hero">
      <h1>Do more with AeroInsight</h1>
    </div>
    <br></br>
    <div className="hero-2">
  <div className="flight-Tracker">
    <FontAwesomeIcon icon={faPlane} />
    <span>Flight Tracker</span>
  </div>

  <div className="divider" />

  <div className="Credit-Card">
    <FontAwesomeIcon icon={faCreditCard} />
    <span>Credit Card</span>
  </div>

  <div className="divider" />

  <div className="Book-visa">
    <FontAwesomeIcon icon={faCcVisa} />
    <span>Book Visa</span>
  </div>

  <div className="divider" />

  <div className="group-booking">
    <FontAwesomeIcon icon={faUsers} />
    <span>Group Booking</span>
  </div>

  <div className="divider" />

  <div className="plan">
    <FontAwesomeIcon icon={faGem} />
    <span>Plan</span>
  </div>

  <div className="divider" />

  <div className="fare-alerts">
    <FontAwesomeIcon icon={faBell} />
    <span>Fare Alerts</span>
  </div>
</div>

<br></br> <br></br>
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

    <br></br>


    </>

  );
}

export default FlightRow;