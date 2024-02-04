import React, { useEffect, useState } from 'react';
import ChartTemp from '../components/ChartTemp'
import ChartHum from '../components/ChartHum'
import ChartPress from '../components/ChartPress';
import Lilo from '../components/Lilo';
import GetSensors from '../components/GetSensors'
import Alarms from './Alarms';
const Graphs = () => {
  const [page, setPage] = useState(false);
  return (
    <div className='bg-black h-full'>
      <div className='bg-[#f18912] w-full flex justify-between border-y-2 border-black items-center h-[58px]'>
          <h1 className='text-black px-[72px] font-bold text-3xl'>GRAPHS</h1>
          <div className='flex flex-row '>
            <h1 className='text-black font-semibold px-[64px] py-[32px] text-xl'>User@882003</h1>
            <Lilo></Lilo>
          </div>
      </div>
      <div className='w-full flex flex-row items-center justify-center h-[90px] bg-[#EEEEEE]'>
        <div className=' w-[80%]  px-10 pt-2 '>
            <h1 className='font-extrabold text-5xl text-black'>Device: 30082003</h1>
        </div>
        <div className='w-[30%] ml-[40%] pt-12 pr-20 flex flex-row '>
        <button 
        className='border-x-4 mx-4 mr-8 bg-black border-black py-2 hover:border-[#111111] focus:bg-black focus:border-black rounded-lg  px-4 text-3xl font-bold text-white '
        onClick={() => setPage(false)}
        >
          Overview
        </button>
        </div>
      </div>
      <div className=' mx-10 h-[700px] overflow-auto'>
        <div className='flex flex-row items-center justify-between'>
            <div className='bg-[#eeeeeec9] h-[200px] w-1/4 mx-4 rounded-2xl  '>
              <div className='border-b-2 border-black p-2 items-center justify-center flex'>
                <h1 className='text-xl  font-bold'>Current Temperature</h1>
              </div>
              <div className='p-4 bg-white h-full text-8xl text-red-500 rounded-lg font-bold flex items-center justify-center'>
              <h1>30</h1><h1 className='px-4'> °C</h1>
              </div>  
            </div>    
            <div className='bg-black border-2 h-[240px] flex items-center justify-center mt-10 w-3/4 mr-4 rounded-2xl'>
            <ChartTemp/>
            </div>        
        </div>

        <div className='flex flex-row items-center justify-between'>
            <div className='bg-[#eeeeeec9] h-[200px] w-1/4 mx-4 rounded-2xl  '>
              <div className='border-b-2 border-black p-2 items-center justify-center flex'>
                <h1 className='text-xl font-bold'>Current Humidity</h1>
              </div>
              <div className='p-4 bg-white h-full text-8xl text-blue-700 rounded-lg font-bold flex items-center justify-center'>
              <h1>80</h1><h1 className='px-4'> %</h1>
              </div>  
            </div>    
            <div className='bg-black border-2 h-[240px] flex items-center justify-center mt-10 w-3/4 mr-4 rounded-2xl'>
            <ChartHum/>
            </div>        
        </div>

        <div className='flex flex-row items-center justify-between'>
            <div className='bg-[#eeeeeec9] h-[200px] w-1/4 mx-4 rounded-2xl  '>
              <div className='border-b-2 border-black p-2 items-center justify-center flex'>
                <h1 className='text-xl font-bold'>Current Pressure</h1>
              </div>
              <div className='p-4 bg-white h-full text-8xl text-yellow-500 rounded-lg font-bold flex items-center justify-center'>
              <h1>1 </h1><h1 className='px-4'> atm</h1>
              </div>  
            </div>    
            <div className='bg-black border-2 h-[240px] flex items-center justify-center mt-10 w-3/4 mr-4 rounded-2xl'>
            <ChartPress/>
            </div>        
        </div>

      </div>
      
        
    
           
     

          
      
    </div>
  );
};

export default Graphs;
