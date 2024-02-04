import React, { useEffect,useContext } from "react";
import Register from "./components/Register";
import { UserContext } from "./context/UserContext";
import Login from "./components/Login";
import './style/Ash.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard.jsx';
import About from './pages/About.jsx';
import Data from './pages/Data.jsx';
import Alarms from './pages/Alarms.jsx';
import Graphs from './pages/Graphs.jsx';
import Trips from './pages/Trips.jsx';

const Ash = () => {
  const [token] = useContext(UserContext);

  const getWelcomeMessage = async () => {
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    };
    const response = await fetch("/api", requestOptions);
    const data = await response.json();

    if (!response.ok) {
      console.log("Something went wrong with /api boi");
    } else {
      
      console.log(data)
    }
  };
  useEffect(()=> {
    getWelcomeMessage();
  }, []);
  return (
   

        <div className="h-full w-full items-center justify-center">
          {!token ? (
           
              <div className="flex h-full my-0 flex-row items-center justify-center">
                <div className="p-11">
                  <Register/>
                </div>
                <div className="p-11">
                  <Login />
                </div>
              </div>
           
            
          ) : ( 
            <div className="flex flex-row ">
              <BrowserRouter>
              <Sidebar>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/data" element={<Data />} />
                  <Route path="/graphs" element={<Graphs/>} />
                  <Route path="/trips" element={<Trips/>} />
                  <Route path="/alarms" element={<Alarms/>} />
                  <Route path="/about" element={<About />} />
                </Routes>
              </Sidebar>
            </BrowserRouter>  
            </div> 
            
            
          )}
        </div>
     
   
      
    
  );
};

export default Ash;
