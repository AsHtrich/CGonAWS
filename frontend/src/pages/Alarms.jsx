import React, { useContext, useEffect, useState } from "react";
import ErrorMessage from "../components/ErrorMessage";

import Lilo from "../components/Lilo";

const Alarms = () => {
  const [alarms, setAlarms] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [loaded, setLoaded] = useState(false);

  const handleDelete = async (id) => {
    const requestOptions = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      },
    };
    const response = await fetch(`/api/alarms/${id}`, requestOptions);
    if (!response.ok) {
      console.log(response)
      setErrorMessage("Failed to delete alarm");
    }
    getAlarms();
  };

  const getAlarms = async () => {
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    };
    const response = await fetch("/api/alarms", requestOptions);
    if (!response.ok) {
      setErrorMessage("Something went wrong. Couldn't load the alarms");
    } else {
      const data = await response.json();
      console.log(data)
      setAlarms(data);
      setLoaded(true);
    }
  };

  useEffect(() => {
    getAlarms();
  }, []);


  return (
    <div>
       <div className="items-center hidden justify-center">
        <ErrorMessage message={errorMessage} />
      </div>
    <div className="bg-black h-full">
      <div className="mx-[56px] mt-8 h-[650px] overflow-auto px-2 pt-6 rounded-lg shadow-lg bg-[#EEEEEE]">
        <table className="w-full table-auto">
          <thead>
            <tr className="text-xl">
              <th>Alarm ID</th>
              <th>Device ID</th>
              <th>Entry ID</th>
              <th>Description</th>
              <th>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {alarms ? (
              alarms.map((alarm) => (
                <tr key={alarm.alarmID} className="text-center">
                  <td className="p-2 font-bold ">{alarm.alarmID}</td>
                  <td>{alarm.deviceID}</td>
                  <td>{alarm.entryID}</td>
                  <td>{alarm.desc}</td>
                  <td>{alarm.timestamp}</td>
                  <td>
                  <button
                    className="bg-red-500 p-2 rounded m-1 text-white font-semibold"
                    onClick={() => handleDelete(alarm.alarmID)}
                  >
                    Delete
                  </button>
                </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">Loading alarms...</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
    </div>
   
  );
};

export default Alarms;
