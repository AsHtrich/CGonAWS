import React, { useContext, useEffect, useState } from "react";
import ErrorMessage from "./ErrorMessage";
import { UserContext } from "../context/UserContext";
import Lilo from "./Lilo";

const Sensors = () => {
  const [sensors, setSensors] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [activeModal, setActiveModal] = useState(false);
  const [id, setId] = useState(null);


  const getSensors = async () => {
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    };
    const response = await fetch("/api/sensors", requestOptions);
    if (!response.ok) {
      setErrorMessage("Something went wrong. Couldn't load the sensors");
    } else {
      const data = await response.json();
      setSensors(data);
      setLoaded(true);
    }
  };

  useEffect(() => {
    getSensors();
  }, []);


  return (
     <div>
      {loaded && sensors ? (
        <div className="mx-[56px] mt-8 h-[650px] overflow-auto px-2 pt-6 rounded-lg shadow-lg bg-[#EEEEEE] ">
          <table className=" w-full table-auto">
          <thead>
            <tr className="text-xl">
              <th>EntryID</th>
              <th>Timestamp</th>
              <th>Device ID</th>
              <th>Temperature</th>
              <th>Humidity</th>
              <th>Pressure</th>
              <th>Light</th>
              <th>Shock</th>
              <th>Latitude</th>
              <th>Longitude</th>
            </tr>
          </thead>
          <tbody>
            {sensors.map((sensor) => (
              <tr key={sensor.entryID} className="text-center">
                <td className="p-2 font-bold ">{sensor.entryID}</td>
                <td>{sensor.timestamp}</td>
                <td>{sensor.deviceID}</td>
                <td>{sensor.temperature}</td>
                <td>{sensor.humidity}</td>
                <td>{sensor.pressure}</td>
                <td>{sensor.light}</td>
                <td>{sensor.shock}</td>
                <td>{sensor.latitude}</td>
                <td>{sensor.longitude}</td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
        
      ) : (
        <p>Loading</p>
      )}
    </div>
  );
};

export default Sensors;
