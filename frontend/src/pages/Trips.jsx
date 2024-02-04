import React, { useContext, useEffect, useState } from "react";
import ErrorMessage from "../components/ErrorMessage";
import { UserContext } from "../context/UserContext";
import Alltrips from "../components/Createtrips";
import Lilo from "../components/Lilo";

const Trips = () => {
  const [token] = useContext(UserContext);
  const [trips, setTrips] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [activeModal, setActiveModal] = useState(false);
  const [id, setId] = useState(null);

  const handleDelete = async (id) => {
    const requestOptions = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      },
    };
    const response = await fetch(`/api/trips/${id}`, requestOptions);
    if (!response.ok) {
      console.log(response)
      setErrorMessage("Failed to delete lead");
    }
    getTrips();
  };

  const getTrips = async () => {
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    };
    const response = await fetch("/api/trips", requestOptions);
    if (!response.ok) {
      setErrorMessage("Something went wrong. Couldn't load the trips");
    } else {
      const data = await response.json();
      setTrips(data);
      setLoaded(true);
    }
  };

  useEffect(() => {
    getTrips();
  }, []);

  const handleModal = () => {
    setActiveModal(!activeModal);
    setErrorMessage(!errorMessage)
    getTrips();
    setId(null);
  };

  return (
    <div className="bg-[#111111] h-full">
      <div className='bg-[#eb760f] w-full flex justify-between border-y-2 border-black items-center h-[58px]'>
          <h1 className='text-black px-[72px] font-bold text-3xl'>ALL TRIPS</h1>
          <div className='flex flex-row '>
            <h1 className='text-black font-semibold px-[64px] py-[32px] text-xl'>User@882003</h1>
            <Lilo></Lilo>
          </div>
      </div>
      <Alltrips
        active={activeModal}
        handleModal={handleModal}
        token={token}
        id={id}
        setErrorMessage={setErrorMessage}
      />
      <div className="flex items-center justify-center">
        <ErrorMessage message={errorMessage} />
      </div>
       
      <div className="flex items-centre justify-center m-2">
        <button
        className="w-1/4 p-2 text-2xl font-bold mb-4 border-2 rounded-3xl text-white bg-black"
        onClick={() => setActiveModal(true)}
      >
        Create Trip
      </button>
      </div>
      
     
      {loaded && trips ? (
        <div className="mx-[56px] h-[350px] overflow-auto px-2 pt-6 shadow-lg bg-[#EEEEEE] rounded-3xl">
          <table className=" w-full table-auto">
          <thead>
            <tr className="text-xl">
              <th>Trip ID</th>
              <th>Drivier ID</th>
              <th>Driver NO</th>
              <th>Src_LOC</th>
              <th>Source</th>
              <th>Dest_LOC</th>
              <th>Destination</th>
            </tr>
          </thead>
          <tbody>
            {trips.map((trip) => (
              <tr key={trip.tripID} className="text-center">
                <td className="p-2 font-bold ">{trip.tripID}</td>
                <td>{trip.driverID}</td>
                <td>{trip.driverNO}</td>
                <td>{trip.srcLoc}</td>
                <td>{trip.src}</td>
                <td>{trip.destLoc}</td>
                <td>{trip.dest}</td>
                <td>
                  <button
                    className="bg-red-500 p-2 rounded m-1 text-white font-semibold"
                    onClick={() => handleDelete(trip.tripID)}
                  >
                    Delete
                  </button>
                </td>
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

export default Trips;
