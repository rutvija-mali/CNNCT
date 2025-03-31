import React, { useEffect, useState } from 'react'
import styles from '../styles/Events.module.css'
import MeetingCard from '../components/MeetingCard'
import { FaPlus } from "react-icons/fa";
import { useScreenSize } from '../context/ScreenSizeProvider';
import SmallScreenTopbar from '../components/SmallScreenTopbar';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthProvider';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
import { toast } from 'react-toastify';

const Events = () => {
  const [meetings,setMeetngs] =useState([])
  const {user,fetchUser} = useAuth()
console.log("user id in event page: "+user);

  useEffect(()=>{
   if(user && user.id){
    const fetchMeettings = async()=>{
      try {
        const response = await axios.get(`${API_BASE_URL}/api/meetings`,{
          params:{hostId:user.id}
        })
        if(response.status === 200){
          setMeetngs(response.data)
        }
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
    fetchMeettings();
   }
  },[user])
  const {isMobile} = useScreenSize()
  const navigate = useNavigate()
  return (
    <div className={styles.mainContainer}>
      <div className={styles.container}>
        {isMobile && <SmallScreenTopbar/>}
        <div className={styles.headingSection}>
          <div>
            <h3>Event Types</h3>
            <p>Create events to share for people to book on your calendar.</p>
          </div>
            <button className={styles.createMeetingBtn} onClick={()=>navigate('/layout/add-event')}>
              <FaPlus size={'0.75rem'}/> Add new event
            </button>
        </div>
        <div className={styles.meetingCardList}>
           {meetings.map((meeting,index)=>(
            <div className={styles.meetingCard} key={index}>
              <MeetingCard meeting={meeting} />
            </div>
           ))}
        </div>
        
      </div>
    </div>
  )
}

export default Events