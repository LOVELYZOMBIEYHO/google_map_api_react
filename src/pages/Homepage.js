import React, { useState, useEffect } from "react";
import useGeoLocation from "../hooks/useGeoLocation";

const Homepage = () => {
  const [showGeolocation, setShowGeolocation] = useState(false);
  const onClickGeolocation = () => setShowGeolocation(true);
  const location = useGeoLocation();

  return (
    <div>
      <h1>Homepage</h1>
      <button onClick={onClickGeolocation}>Geolocation</button>
      <div>
        It page just for see your geolocation. Please go to Google Map API for
        view more.
      </div>
      <br />
      <div> Click the button and wait for few seconds</div>
      <br />
      <div>
        {showGeolocation ? (
          <div>
            {location.loaded
              ? JSON.stringify(location)
              : "Location data not available yet."}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Homepage;
