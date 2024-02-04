import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet'; // You need to import the 'leaflet' library
import redMarkerIcon from '../assets/red_marker-icon.png';
import Lilo from '../components/Lilo';
import DashboardBalls from '../components/DashboardBalls';

const Dashboard = () => {
  const [position, setPosition] = useState([13.082680, 80.270721]);
  const [newLat, setNewLat] = useState(null);
  const [newLng, setNewLng] = useState(null);
  const [mapKey, setMapKey] = useState(0); // Add a key for MapContainer

  // Create a custom red marker icon
    const customMarkerIcon = new L.Icon({
    iconUrl: redMarkerIcon,
    iconSize: [32, 32], // Set the size of the red marker icon
    iconAnchor: [16, 32], // Set the anchor point to half the height of the icon
  });

  const handleLatChange = (e) => {
    const lat = parseFloat(e.target.value);
    setNewLat(!isNaN(lat) ? lat : '');
  };

  const handleLngChange = (e) => {
    const lng = parseFloat(e.target.value);
    setNewLng(!isNaN(lng) ? lng : '');
  };

  const handleUpdateMap = () => {
    if (!isNaN(newLat) && !isNaN(newLng)) {
      setPosition([newLat, newLng]);
      setMapKey((prevKey) => prevKey + 1); // Change the key to trigger a reload
    }
  };

  return (
    <div className='flex flex-col w-full'>
      <div className='bg-[#f18912] w-full flex justify-between border-y-2 border-black items-center h-[58px]'>
          <h1 className='text-black px-[72px] font-bold text-3xl'>DASHBOARD</h1>
          
          <div className='flex flex-row '>
            <h1 className='text-black font-semibold px-[64px] py-[32px] text-xl'>User@882003</h1>
            <Lilo></Lilo>
          </div>
      </div>
      <div>
        <div className='flex flex-row h-full'>
          <div className='w-2/5'>
              <DashboardBalls/>
              <div className='h-[700px] p-4 overflow-auto bg-black '>
                  <div className='h-[265px] w-full rounded-xl  border-[#5A5A5A] border-4 bg-green-100'>
                    <div className='w-full flex justify-between rounded-lg h-[40px] bg-[#EEEEEE]'>
                      <h1 className='text-black p-1 flex justify-center w-[30%] my-1 ml-4 overflow-x-auto font-semibold'>Belgaum</h1>
                      <h1 className='text-black p-1  w-[40%] my-1 overflow-hidden font-semibold'>---------------------------------------</h1>
                      <h1 className='text-black p-1 flex justify-center w-[30%] my-1  mr-2 ml-2 truncate font-semibold'>Bangalore</h1>
                    </div>
                    <div className='p-2'>
                      <div className=' h-full'>
                        <div className='flex flex-row justify-between'>                 
                            <h1 className='text-lg font-semibold'>TRIP ID: 1234</h1>
                            <h1 className='text-lg font-semibold'>DRIVER ID: 666</h1>
                            <h1 className='text-lg font-semibold'>DEVICE ID: 666</h1> 
                        </div>
                        <div className='flex flex-row justify-between p-2 rounded-lg h-[50px] bg-black'>
                        <h1 className='text-lg font-semibold text-white'>30 °C</h1>
                        <h1 className='text-lg font-semibold text-white'>Expected temperature: 2 ~ 4 °C</h1> 
                        </div>
                        <div className='flex flex-row justify-between p-2 rounded-lg h-[70px] '>
                          <div>
                           <h1 className='text-md font-light text-black'>Humidity: 80%</h1>
                           <h1 className='text-md font-light text-black'>Pressure: 1.0001 atm</h1>
                          </div>
                          <div>
                           <h1 className='text-md font-light text-black'>Shock: 5.6 G</h1>
                           <h1 className='text-md font-light text-black'>Light: Lit</h1>
                          </div>
                        </div>
     
                      </div>
                    </div>
                    <div className='w-full flex justify-between rounded-lg h-[40px] bg-[#EEEEEE]'>
                          <h1 className='text-black p-1 flex justify-center w-[30%] my-1  mr-2 ml-2 truncate font-semibold'>Asset: Penicilin</h1>
                    </div>
                  </div>

                  



                  <div className='h-[260px] mt-6 rounded-xl border-[#5A5A5A] border-4 bg-green-100'>
                    <div className='w-full flex justify-between rounded-lg h-[40px] bg-[#EEEEEE]'>
                      <h1 className='text-black p-1 flex justify-center w-[30%] my-1 ml-4 overflow-x-auto font-semibold'>XXXXXXX</h1>
                      <h1 className='text-black p-1  w-[40%] my-1 overflow-hidden font-semibold'>---------------------------------------</h1>
                      <h1 className='text-black p-1 flex justify-center w-[30%] my-1  mr-2 ml-2 truncate font-semibold'>XXXXXXXXX</h1>
                    </div>
                    <div className='p-2'>
                      <div className=' h-full'>
                        <div className='flex flex-row justify-between'>                 
                            <h1 className='text-lg font-semibold'>TRIP ID: xxxx</h1>
                            <h1 className='text-lg font-semibold'>DRIVER ID: xxx</h1>
                            <h1 className='text-lg font-semibold'>DEVICE ID: xxx</h1> 
                        </div>
                        <div className='flex flex-row justify-between p-2 rounded-lg h-[50px] bg-black'>
                        <h1 className='text-lg font-semibold text-white'>30 °C</h1>
                        <h1 className='text-lg font-semibold text-white'>Expected temperature: 2 ~ 4 °C</h1> 
                        </div>
                        <div className='flex flex-row justify-between p-2 rounded-lg h-[70px] '>
                          <div>
                           <h1 className='text-md font-light text-black'>Humidity: 80%</h1>
                           <h1 className='text-md font-light text-black'>Pressure: 1.0001 atm</h1>
                          </div>
                          <div>
                           <h1 className='text-md font-light text-black'>Shock: 5.6 G</h1>
                           <h1 className='text-md font-light text-black'>Light: Lit</h1>
                          </div>
                        </div>
     
                      </div>
                    </div>
                    <div className='w-full flex justify-between rounded-lg h-[40px] bg-[#EEEEEE]'>
                          <h1 className='text-black p-1 flex justify-center w-[30%] my-1  mr-2 ml-2 truncate font-semibold'>Asset: XXXXXXXXX</h1>
                    </div>
                  </div>

                  <div className='h-[260px] mt-6 rounded-xl border-[#5A5A5A] border-4 bg-green-100'>
                    <div className='w-full flex justify-between rounded-lg h-[40px] bg-[#EEEEEE]'>
                      <h1 className='text-black p-1 flex justify-center w-[30%] my-1 ml-4 overflow-x-auto font-semibold'>XXXXXXX</h1>
                      <h1 className='text-black p-1  w-[40%] my-1 overflow-hidden font-semibold'>---------------------------------------</h1>
                      <h1 className='text-black p-1 flex justify-center w-[30%] my-1  mr-2 ml-2 truncate font-semibold'>XXXXXXXXX</h1>
                    </div>
                    <div className='p-2'>
                      <div className=' h-full'>
                        <div className='flex flex-row justify-between'>                 
                            <h1 className='text-lg font-semibold'>TRIP ID: xxxx</h1>
                            <h1 className='text-lg font-semibold'>DRIVER ID: xxx</h1>
                            <h1 className='text-lg font-semibold'>DEVICE ID: xxx</h1> 
                        </div>
                        <div className='flex flex-row justify-between p-2 rounded-lg h-[50px] bg-black'>
                        <h1 className='text-lg font-semibold text-white'>30 °C</h1>
                        <h1 className='text-lg font-semibold text-white'>Expected temperature: 2 ~ 4 °C</h1> 
                        </div>
                        <div className='flex flex-row justify-between p-2 rounded-lg h-[70px] '>
                          <div>
                           <h1 className='text-md font-light text-black'>Humidity: 80%</h1>
                           <h1 className='text-md font-light text-black'>Pressure: 1.0001 atm</h1>
                          </div>
                          <div>
                           <h1 className='text-md font-light text-black'>Shock: 5.6 G</h1>
                           <h1 className='text-md font-light text-black'>Light: Lit</h1>
                          </div>
                        </div>
     
                      </div>
                    </div>
                    <div className='w-full flex justify-between rounded-lg h-[40px] bg-[#EEEEEE]'>
                          <h1 className='text-black p-1 flex justify-center w-[30%] my-1  mr-2 ml-2 truncate font-semibold'>Asset: XXXXXXXXX</h1>
                    </div>
                  </div>

                  <div className='h-[260px] mt-6 rounded-xl border-[#5A5A5A] border-4 bg-green-100'>
                    <div className='w-full flex justify-between rounded-lg h-[40px] bg-[#EEEEEE]'>
                      <h1 className='text-black p-1 flex justify-center w-[30%] my-1 ml-4 overflow-x-auto font-semibold'>XXXXXXX</h1>
                      <h1 className='text-black p-1  w-[40%] my-1 overflow-hidden font-semibold'>---------------------------------------</h1>
                      <h1 className='text-black p-1 flex justify-center w-[30%] my-1  mr-2 ml-2 truncate font-semibold'>XXXXXXXXX</h1>
                    </div>
                    <div className='p-2'>
                      <div className=' h-full'>
                        <div className='flex flex-row justify-between'>                 
                            <h1 className='text-lg font-semibold'>TRIP ID: xxxx</h1>
                            <h1 className='text-lg font-semibold'>DRIVER ID: xxx</h1>
                            <h1 className='text-lg font-semibold'>DEVICE ID: xxx</h1> 
                        </div>
                        <div className='flex flex-row justify-between p-2 rounded-lg h-[50px] bg-black'>
                        <h1 className='text-lg font-semibold text-white'>30 °C</h1>
                        <h1 className='text-lg font-semibold text-white'>Expected temperature: 2 ~ 4 °C</h1> 
                        </div>
                        <div className='flex flex-row justify-between p-2 rounded-lg h-[70px] '>
                          <div>
                           <h1 className='text-md font-light text-black'>Humidity: 80%</h1>
                           <h1 className='text-md font-light text-black'>Pressure: 1.0001 atm</h1>
                          </div>
                          <div>
                           <h1 className='text-md font-light text-black'>Shock: 5.6 G</h1>
                           <h1 className='text-md font-light text-black'>Light: Lit</h1>
                          </div>
                        </div>
     
                      </div>
                    </div>
                    <div className='w-full flex justify-between rounded-lg h-[40px] bg-[#EEEEEE]'>
                          <h1 className='text-black p-1 flex justify-center w-[30%] my-1  mr-2 ml-2 truncate font-semibold'>Asset: XXXXXXXXX</h1>
                    </div>
                  </div>





              </div>
          </div>
          <div className='h-[800px] border border-white p-[3px] shadow rounded-xl w-3/5'>
            <MapContainer
              key={mapKey} // Set the key to trigger a reload
              center={position}
              zoom={13}
              className='h-full w-full'
            >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <Marker position={position} icon={customMarkerIcon}>
              <Popup>
                Latitude: {position[0]}, Longitude: {position[1]}
              </Popup>
            </Marker>
            </MapContainer>
          </div>
       </div> 
      </div>
    </div>
    
  );
};

export default Dashboard;
