import React from "react";

const Clock = ({
  newSearchLocation,
  setNewSearchLocation,
  newSearchLocationTime,
  setNewSearchLocationTime,
  getTime,
}) => {
  if (newSearchLocation == "" && "undefined") {
    return (
      <center>
        <h1>Welcome, please search location!</h1>
      </center>
    );
  } else {
    return (
      <div>
        <center>
          <h1> Your search result - {newSearchLocation[0].name}</h1>
          <p>
            lat:{newSearchLocation[0].lat} , lng:{newSearchLocation[0].lng}
          </p>

          <button onClick={getTime}>Get Time</button>
        </center>
      </div>
    );
  }
};

export default Clock;
