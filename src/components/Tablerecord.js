import React from "react";
import styles from "../styles/tablerecord.module.css";

const Tablerecord = ({
  marker,
  markers,
  setMarkers,
  isCheck,
  setIsCheck,
  isCheckAll,
  setIsCheckAll,
  searchId,
  setSearchId,
  isChecked,
}) => {
  const handleRemoveLocation = (e) => {
    const name = e.target.getAttribute("name");
    //   markers will output an Object to use .filter
    // filter out the item which is equal to the name. (id is int, should be convert to string for matching)

    setMarkers(markers.filter((item) => item.id.toString() !== name));
    // !!!!!!!need to uncheck/delete checked box record
    setIsCheck(isCheck.filter((item) => item.id.toString() !== name));
  };
  // Click Checkbox
  const handleClick = (e) => {
    const { id, checked } = e.target;

    setIsCheck([...isCheck, { id: id, checked: checked }]);

    if (!checked) {
      setIsCheck(isCheck.filter((item) => item.id !== id));
    }
  };

  return (
    <div className={styles.table}>
      <center>
        <div className="container">
          <input
            type="checkbox"
            id={marker.id}
            name={marker.name}
            onChange={handleClick}
          />
        </div>

        {/* String type - name , lat, lng and time */}
        <p>Name: {marker.name}</p>
        <p>
          lat: {marker.lat}, lng: {marker.lng}, Added Time:{" "}
          {marker.addedTime.toTimeString()}
        </p>
        {/* marker.id can let setMarkers detect the name */}
        <button
          name={marker.id}
          onClick={handleRemoveLocation}
          className="btn btn-outline-secondary"
          style={{ height: "30px", marginTop: "20px" }}
        >
          x
        </button>
      </center>
    </div>
  );
};

export default Tablerecord;
