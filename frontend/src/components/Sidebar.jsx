import React, { useState } from 'react';
import {
    FaTh,
    FaBars,
    FaUserAlt,
    FaRegChartBar,
    FaDatabase, 
    FaThList
}from "react-icons/fa";
import { NavLink } from 'react-router-dom';



const Sidebar = ({children}) => {
    const[isOpen ,setIsOpen] = useState(false);
    const toggle = () => setIsOpen (!isOpen);
    const menuItem=[
        {
            path:"/",
            name:"Dashboard",
            icon:<FaTh/>
        },
        {
            path:"/data",
            name:"Data",
            icon:<FaDatabase/>
        },
        {
            path:"/graphs",
            name:"Graphs",
            icon:<FaRegChartBar/>
        },
        {
            path:"/trips",
            name:"All Trips",
            icon:<FaThList/>
        },
        {
            path:"/about",
            name:"About",
            icon:<FaUserAlt/>
        },
    ]
    return (
        <div className="container overflow-hidden relative h-screen">
           <div style={{width: isOpen ? "220px" : "70px"}} className="sidebar border-r-[#5A5A5A] border-r-4 ">
               <div className="top_section">
                    <img style={{display: isOpen ? "block" : "none"}} src='https://i.imgur.com/LW7VT5z.png' className='h-[80px]' alt='ccc' />
               </div>
               {
                   menuItem.map((item, index)=>(
                       <NavLink to={item.path} key={index} className="link" activeclassName="active">
                           <div className="icon">{item.icon}</div>
                           <div style={{display: isOpen ? "block" : "none "}} className="link_text">{item.name}</div>
                       </NavLink> 
                   ))        
               }
               <div style={{marginLeft: isOpen ? "80px" : "12px"}} className="bars">
                       <FaBars onClick={toggle}/>
                   </div>   
           </div>
           <main className='bg-[#111111]'>{children}</main>
        </div>
        
    );
};

export default Sidebar;