import React, { useContext, useEffect, useState } from "react";
import ErrorMessage from "../components/ErrorMessage";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
const DashboardBalls = () => {
    const [totalTrip, setTotalTrip] = useState("");
    const [totalAlarm, setTotalAlarm] = useState("");
    const [token] = useContext(UserContext);
    const [errorMessage, setErrorMessage] = useState("");
    let navigate = useNavigate(); 
    
    const routeChange = () =>{ 
      let path = `/trips`; 
      navigate(path);
    }
    const routeChangeA = () =>{ 
      let path = `/data`; 
      navigate(path);
    }
    useEffect(() => {
        const getTotalTrip = async () => {
          const requestOptions = {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + token,
            },
          };
          const response = await fetch(`/api/trips/total`, requestOptions);
    
          if (!response.ok) {
            setErrorMessage("Could not get the trip");
          } else {
            const data = await response.json();
            setTotalTrip(data)
          }
        };
        getTotalTrip();
      }, [token]);


     
      const getTotalAlarms = async () => {
        const requestOptions = {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        };
        const response = await fetch("/api/alarms/total", requestOptions);
        if (!response.ok) {
          setErrorMessage("Something went wrong. Couldn't load the alarms");
        } else {
          const data = await response.json();
          console.log(data)
          setTotalAlarm(data);
          
        }
      };
    
      useEffect(() => {
        getTotalAlarms();
      }, []);
    

      
    return (
    <div className='bg-black text-[#EEEEEE]'>
        <div className='flex justify-between  bg-white  py-2'>
            <div onClick={routeChange} className='bg-black cursor-pointer w-[110px] border-4 items-center rounded-full flex flex-col hover:border-[#f18912]  hover:text-[#f18912] border-white px-[100px] p-2'>
                <h1 className='font-bold text-4xl '>{totalTrip}</h1>            
                <p className=' font-semibold text-2xl'>Trips</p>
            </div>
            <div onClick={routeChangeA} className='bg-black cursor-pointer w-[110px] border-4 items-center rounded-full flex flex-col hover:border-[#f18912] hover:text-[#f18912] border-white px-[100px] p-2'>
                <h1 className='font-bold text-4xl'>{totalAlarm}</h1>            
                <p className=' font-semibold text-2xl'>Alarms</p>
            </div>
            <div className='bg-black cursor-pointer w-[110px] border-4 items-center rounded-full flex flex-col hover:border-[#f18912] hover:text-[#f18912] border-white px-[100px] p-2'>
                <h1 className=' font-bold text-4xl'>1</h1>            
                <p className=' font-semibold text-2xl'>Device</p>
            </div>
        </div>
        <div>

        </div>
    </div>
  )
}

export default DashboardBalls