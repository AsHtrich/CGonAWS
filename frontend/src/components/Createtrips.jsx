import React, { useEffect, useState } from "react";

const Alltrips = ({ active, handleModal, token, id, setErrorMessage }) => {
  const [trip_ID, setTripID] = useState("");
  const [driver_number, setDriverNO] = useState("");
  const [driver_ID, setDriverID] = useState("");
  const [source, setSRC] = useState("");
  const [destination, setDEST] = useState("");
  const [destination_location, setDestLOC] = useState("");
  const [source_location, setSrcLOC] = useState("");

  useEffect(() => {
    const getTrip = async () => {
      const requestOptions = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      };
      const response = await fetch(`/api/trips/${id}`, requestOptions);

      if (!response.ok) {
        setErrorMessage("Could not get the trip");
      } else {
        const data = await response.json();
        setTripID(data.trip_ID);
        setDriverNO(data.driver_number);
        setDriverID(data.driver_ID);
        setSRC(data.source);
        setDEST(data.destination);
        setDestLOC(data.destination_location);
        setSrcLOC(data.source_location);
        
      }
    };

    if (id) {
      getTrip();
    }
  }, [id, token]);

  const cleanFormData = () => {
        setTripID("");
        setDriverNO("");
        setDriverID("");
        setSRC("");
        setDEST("");
        setDestLOC("");
        setSrcLOC("");
  };

  const handleCreateTrip = async (e) => {
    e.preventDefault();
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        "uid": 0,
        "driverNO": driver_number,
        "src": source,
        "srcLoc": source_location,
        "destLoc": destination_location,
        "dest": destination,
        "tripID": trip_ID,
        "driverID": driver_ID
      }),
      };

    try {
      const response = await fetch("/api/trips", requestOptions);

      if (!response.ok) {
        setErrorMessage("Something went wrong when creating a trip.");
      } else {
        cleanFormData();
        handleModal();
      }
    } catch (error) {
      setErrorMessage("An error occurred while creating a trip.");
     
    }
  };

  return (
    <div className={active ? active : 'hidden'}>
      <div className=" my-4 p-2 pt-6 rounded-3xl shadow-lg bg-[#EEEEEE] flex flex-col justify-center">        
        <section className="">
          <h1 className="pl-4 p-4 text-red-600">* Make sure you enter unique Trip ID and Driver ID</h1>
          <form className="flex flex-col">
            <div className="px-4 pb-4 text-left">
              <label className="text-xl pl-2 underline underline-offset-4 font-semibold">Trip ID</label>
              <div className="">
                <input
                  type="text"
                  placeholder="Enter Trip ID"
                  value={trip_ID}
                  onChange={(e) => setTripID(e.target.value)}
                  className="p-2 rounded-xl border-x-2 border-black"
                  required
                />
              </div>
            </div>
            <div className="px-4 pb-4 ">
              <label className="text-xl underline underline-offset-4 pl-2 font-semibold ">Source</label>
              <div className="">
                <input
                  type="text"
                  placeholder="Enter Source"
                  value={source}
                  onChange={(e) => setSRC(e.target.value)}
                  className="p-2 rounded-xl border-x-2 border-black"
                  required
                />
              </div>
            </div>
            <div className="px-4 pb-4 ">
              <label className="text-xl underline underline-offset-4 pl-2 font-semibold ">Source Location</label>
              <div className="">
                <input
                  type="text"
                  placeholder="Enter source location"
                  value={source_location}
                  onChange={(e) => setSrcLOC(e.target.value)}
                  className="p-2 rounded-xl border-x-2 border-black"
                />
              </div>
            </div>
            <div className="px-4 pb-4 ">
              <label className="text-xl underline underline-offset-4 pl-2 font-semibold ">Destination</label>
              <div className="control">
                <input
                  type="text"
                  placeholder="Enter Destination"
                  value={destination}
                  onChange={(e) => setDEST(e.target.value)}
                  className="p-2 rounded-xl border-x-2 border-black"
                />
              </div>
            </div>
            <div className="px-4 pb-4 ">
              <label className="text-xl underline underline-offset-4 pl-2 font-semibold ">Destination Location</label>
              <div className="">
                <input
                  type="text"
                  placeholder="Enter Destination location"
                  value={destination_location}
                  onChange={(e) => setDestLOC(e.target.value)}
                  className="p-2 rounded-xl border-x-2 border-black"
                />
              </div>
            </div>
            <div className="px-4 pb-4 ">
              <label className="text-xl underline underline-offset-4 pl-2 mb-2  font-semibold ">driver_ID</label>
              <div className="">
                <input
                  type="text"
                  placeholder="Enter driver_ID"
                  value={driver_ID}
                  onChange={(e) => setDriverID(e.target.value)}
                  className="p-2 rounded-xl border-x-2 border-black"
                />
              </div>
            </div>
            <div className="px-4 pb-4 ">
              <label className="text-xl underline underline-offset-4 pl-2 font-semibold ">Driver No</label>
              <div className="">
                <input
                  type="text"
                  placeholder="Enter Driver NO"
                  value={driver_number}
                  onChange={(e) => setDriverNO(e.target.value)}
                  className="p-2 rounded-xl border-x-2 border-black"
                />
              </div>
            </div>
          </form>
        </section>
        
        <footer className=" flex flex-row items-centre justify-center">
          <button className="px-8 py-4 mt-4 mx-4 bg-black font-semibold text-white rounded-full " onClick={handleCreateTrip}>
              Create
          </button>        
          <button className="px-8 py-4 mt-4 bg-red-500 font-semibold text-white rounded-full " onClick={handleModal}>
            Cancel
          </button>
        </footer>
      </div>
    </div>
  );
};

export default Alltrips;