import React from 'react'
import styles from '../styles/BottomBar.module.css'
import { IoMdLink } from "react-icons/io";
import { RiCalendarEventLine } from "react-icons/ri";
import { FaRegClock } from "react-icons/fa";
import { IoSettingsOutline } from "react-icons/io5";
import { FaPlus } from "react-icons/fa";
import ProfilePic from '../assets/profilePic.svg'
import Logo from './Logo';
import { Link, NavLink, useNavigate } from 'react-router-dom';

const Bottombar = () => {
  const navigate =useNavigate()
  const sidebarItems = [
    { id: 1, icon: <RiCalendarEventLine size="1rem" />, text: "Events", route: "/layout" },
    { id: 2, icon: <IoMdLink size="1rem" />, text: "Booking", route: "/layout/bookings" },
    { id: 3, icon: <FaRegClock  size="1rem"/>, text: "Availability", route: "/layout/availability" },
    { id: 4, icon: <IoSettingsOutline size="1rem"/>, text: "Settings", route: "/layout/settings" },
  ];
  return (
    <div className={styles.mainContainer}>
      <div className={styles.container}>
        <div className={styles.navlinks}>
          {sidebarItems.map((item)=>(
            <div className={styles.links}>
              <NavLink to={item.route} 
                className={({isActive})=>isActive?(styles.active):(styles.link)}
                end={item.route === "/layout"}
              >
                {item.icon}
                {item.text}
              </NavLink>
            </div>
          ))}
        </div>
        
      </div>
    </div>
  )
}

export default Bottombar