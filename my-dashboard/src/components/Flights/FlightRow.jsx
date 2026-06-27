import "../../styles/FlightRow.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartLine, faCloud,faChartBar,faBuilding,faClock,faArrowTrendUp,faArrowTrendDown} from "@fortawesome/free-solid-svg-icons";
import {faPlane} from "@fortawesome/free-solid-svg-icons";
import { faRightLeft } from "@fortawesome/free-solid-svg-icons";




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


    <br></br>


    </>

  );
}

export default FlightRow;