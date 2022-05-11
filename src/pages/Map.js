import React, { useState, useEffect, useRef } from "react";
import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  StandaloneSearchBox,
} from "@react-google-maps/api";

import Tablerecord from "../components/Tablerecord";
import Clock from "../components/Clock";

import axios from "axios";
console.log();
// important for Google map API (libraries & places)
const libraries = ["places"];

const containerStyle = {
  width: "100%",
  height: "400px",
};

const inputStyle = {
  width: "100%",
  height: "500px",
};

const center = {
  lat: 43.7658314,
  lng: -79.4137297,
};

const options = {
  disableDefaultUI: true,
  zoomControl: true,
};

function App() {
  const [markers, setMarkers] = useState([]);
  const searchBox = useRef(null);
  const [searchPlaceCenter, setSearchPlaceCenter] = useState([
    parseFloat(43.7658314),
    parseFloat(-79.4137297),
  ]);
  const [searchId, setSearchId] = useState(1);

  // CheckBox
  const [isCheck, setIsCheck] = useState([]);
  const [isCheckAll, setIsCheckAll] = useState(false);

  // Clock
  const [newSearchLocation, setNewSearchLocation] = useState([""]);
  // console.log(newSearchLocation);
  const [newSearchLocationTime, setNewSearchLocationTime] = useState();

  //  Clock time based on Google Time-zone api (calculate timestamp)
  let targetDate = new Date(); // Current date/time of user computer
  let timestamp =
    targetDate.getTime() / 1000 + targetDate.getTimezoneOffset() * 60;
  const getTime = () => {
    let config = {
      method: "get",
      url: `https://maps.googleapis.com/maps/api/timezone/json?location=${newSearchLocation[0].lat}%2C${newSearchLocation[0].lng}&timestamp=${timestamp}&key=${process.env.REACT_APP_GOOGLE_MAP_API_KEY}`,
      headers: {},
    };
    axios(config)
      .then(function (response) {
        // console.log(JSON.stringify(response.data));

        //  Calculate time through Google Time-zone API
        let offsets =
          response.data.dstOffset * 1000 + response.data.rawOffset * 1000; // get DST and time zone offsets in milliseconds
        let localdate = new Date(timestamp * 1000 + offsets); // Date object containing current time of target location

        //  Update time per GET requests
        let refreshDate = new Date();
        let millisecondselapsed = refreshDate - targetDate;
        localdate.setMilliseconds(
          localdate.getMilliseconds() + millisecondselapsed
        );
        // console.log(localdate);
        setNewSearchLocationTime(localdate);
        alert(`The time of your searched location is:  ${localdate}`);
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  const handleSelectAll = (e) => {
    setIsCheckAll(!isCheckAll);
    // setIsCheck(markers.map((item) => item.id.toString()));
    // setIsCheck([...isCheck, { id: id, checked: checked }]);
    setIsCheck(markers.map((item) => item.id.toString()));

    if (isCheckAll) {
      setIsCheck([]);
    }
  };

  //  isCheck is to show check box state (selected items)
  console.log(isCheck);
  //  markers is to show all search results
  console.log(markers);

  const handleRemoveLocationAll = () => {
    // setMarkers(markers.filter((item) => item.id.toString() !== isCheck[0].id ) );
    // -----------------------------------------------

    // setMarkers(
    //   markers.filter(
    //     (item) =>
    //       // ?.id let the "undefined" value not to error, .id is exact match
    //       // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining
    //       item?.id.toString() !== isCheck[0]?.id &&
    //       item?.id.toString() !== isCheck[1]?.id &&
    //       item?.id.toString() !== isCheck[2]?.id &&
    //       item?.id.toString() !== isCheck[3]?.id &&
    //       item?.id.toString() !== isCheck[4]?.id &&
    //       item?.id.toString() !== isCheck[5]?.id &&
    //       item?.id.toString() !== isCheck[6]?.id &&
    //       item?.id.toString() !== isCheck[7]?.id &&
    //       item?.id.toString() !== isCheck[8]?.id
    //   )
    // );

    // setIsCheck(
    //   isCheck.filter(
    //     (item) =>
    //       // ?.id let the "undefined" value not to error, .id is exact match , no need to ?.id
    //       item.id.toString() !== isCheck[0].id &&
    //       item.id.toString() !== isCheck[1].id &&
    //       item.id.toString() !== isCheck[2].id &&
    //       item.id.toString() !== isCheck[3].id &&
    //       item.id.toString() !== isCheck[4].id &&
    //       item.id.toString() !== isCheck[5].id &&
    //       item.id.toString() !== isCheck[6].id &&
    //       item.id.toString() !== isCheck[7].id &&
    //       item.id.toString() !== isCheck[8].id
    //   )
    // );
    // -----------------------------------------------

    // ?.id let the "undefined" value not to error, .id is exact match
    //  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining
    //  It is a better solution with for loop
    setMarkers(
      markers.filter((item) => {
        for (let i = 0; i < isCheck.length; i++) {
          if (item.id.toString() === isCheck[i].id) {
            return false;
          }
        }
        return true;
      })
    );

    setIsCheck(
      isCheck.filter((item) => {
        for (let i = 0; i < isCheck.length; i++) {
          if (item.id.toString() === isCheck[i].id) {
            return false;
          }
        }
        return true;
      })
    );
  };
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAP_API_KEY,
    // important
    libraries,
  });

  return isLoaded ? (
    <div>
      <Clock
        newSearchLocation={newSearchLocation}
        setNewSearchLocation={setNewSearchLocation}
        newSearchLocationTime={newSearchLocationTime}
        setNewSearchLocationTime={setNewSearchLocationTime}
        getTime={getTime}
      />
      {/* <button onClick={getTime}>Get Time</button> */}
      <StandaloneSearchBox
        onLoad={(ref) => (searchBox.current = ref)}
        //  get API by search to run function
        onPlacesChanged={(event) => {
          // Find the search field value and make it be center value.
          // Make the center location
          setSearchPlaceCenter([
            parseFloat(
              searchBox.current.getPlaces()[0].geometry.location.lat()
            ),
            parseFloat(
              searchBox.current.getPlaces()[0].geometry.location.lng()
            ),
          ]);

          //  Store Search geolocation value to useState markers for Red markers

          setMarkers((current) => [
            ...current,
            {
              lat: parseFloat(
                searchBox.current.getPlaces()[0].geometry.location.lat()
              ),
              lng: parseFloat(
                searchBox.current.getPlaces()[0].geometry.location.lng()
              ),
              name: searchBox.current.getPlaces()[0].formatted_address,
              addedTime: new Date(),
              id: searchId,
            },
          ]);

          //   For show time
          setNewSearchLocation(() => [
            {
              lat: searchBox.current.getPlaces()[0].geometry.location.lat(),
              lng: searchBox.current.getPlaces()[0].geometry.location.lng(),
              name: searchBox.current.getPlaces()[0].formatted_address,
              time: new Date(),
              id: searchId,
            },
          ]);
          setSearchId(searchId + 1);
        }}
      >
        <input
          type="text"
          name="address"
          placeholder="Search Address"
          autoComplete="off"
          style={{
            boxSizing: `border-box`,
            border: `1px solid transparent`,
            width: `240px`,
            height: `32px`,
            marginTop: `27px`,
            padding: `0 12px`,
            borderRadius: `3px`,
            boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
            fontSize: `14px`,
            outline: `none`,
            textOverflow: `ellipses`,
          }}
        ></input>
      </StandaloneSearchBox>

      <GoogleMap
        mapContainerStyle={containerStyle}
        zoom={8}
        //  Set center to searchPlace location to change center
        center={{
          lat: parseFloat(searchPlaceCenter[0]),
          lng: parseFloat(searchPlaceCenter[1]),
        }}
        options={options}
        //  onclick function
        onClick={(event) => {
          //  Mouse Click location
          setSearchPlaceCenter([
            parseFloat(event.latLng.lat()),
            parseFloat(event.latLng.lng()),
          ]);
          setMarkers((current) => [
            ...current,
            {
              lat: parseFloat(event.latLng.lat()),
              lng: parseFloat(event.latLng.lng()),
              name: "Click function is not able to retrieve the location name",
              addedTime: new Date(),
              id: searchId,
            },
          ]);

          //   For show time
          setNewSearchLocation(() => [
            {
              lat: parseFloat(event.latLng.lat()),
              lng: parseFloat(event.latLng.lng()),
              name: "Click function is not able to retrieve the location name",
              time: new Date(),
              id: searchId,
            },
          ]);
          setSearchId(searchId + 1);
        }}
      >
        {markers.map((marker) => (
          <Marker
            // key={marker.addedTime.toISOString()}
            key={marker.id}
            position={{
              lat: parseFloat(marker.lat),
              lng: parseFloat(marker.lng),
            }}
          />
        ))}

        {/* Search and red mark , parseFloat to make sure lat and lng is number*/}
        {/* <Marker
          position={{
            lat: parseFloat(searchPlace[0]),
            lng: parseFloat(searchPlace[1]),
          }}
        /> */}
      </GoogleMap>

      {/* Button to delete all */}
      <button onClick={handleRemoveLocationAll} className="btn btn-warning">
        Delete All Selected
      </button>

      {markers.map((marker) => (
        <Tablerecord
          key={marker.id}
          marker={marker}
          markers={markers}
          setMarkers={setMarkers}
          isCheck={isCheck}
          setIsCheck={setIsCheck}
          isCheckAll={isCheckAll}
          setIsCheckAll={setIsCheckAll}
        />
      ))}
    </div>
  ) : (
    <div>Loading...</div>
  );
}

export default React.memo(App);
