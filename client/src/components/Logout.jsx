import React, { useState } from 'react'
import styles from '../styles/Logout.module.css'
import ProfilePic from '../assets/profilePic.svg'
import { useNavigate } from 'react-router-dom'
import {useScreenSize} from '../context/ScreenSizeProvider'
import logoutSvg from '../assets/circum_logout.svg'
import {useAuth} from '../context/AuthProvider';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
import axios from 'axios'
import { toast } from 'react-toastify';

export default function Logout() {
  const[isOpen,setIsOpen] = useState(false)
  const navigate =useNavigate()
  const {isMobile} = useScreenSize()
  const {fetchUser} = useAuth()
  const handleLogout = ()=>{
      try {
        axios.post(`${API_BASE_URL}/api/users/logout`)
        .then((response)=>{
          if(response.status == 200){
            toast.success('User created successfully!', {
              position: 'top-right',
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            });           
            navigate("/")
            fetchUser()
          }
        })
      } catch (error) {
        toast.error(error.message||'Something went wrong!', {
          position: 'top-right',
          autoClose: 3000, // Auto close in 3 seconds
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    }
  return (
   <div className={styles.mainConatienre}>
       { !isMobile && <button className={styles.profileSection} onClick={()=>setIsOpen((prev)=>!prev)} >
            <img src={ProfilePic} alt="" />
           User name
        </button>}
        {isMobile && 
          <img src={ProfilePic} alt="" className={styles.profile} onClick={()=>setIsOpen((prev)=>!prev)}/>
        }
        {isOpen && <button className={isMobile?styles.logoutBtnMobile:(styles.logoutBtn)}  onClick={handleLogout}>
          <img src={logoutSvg} alt="" />
          Sign out
        </button>}
   </div>
  )
}
