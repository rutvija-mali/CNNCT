import React, { useEffect, useState } from 'react'
import styles from '../styles/MeetingCard.module.css'
import editIcon from '../assets/line-md_edit.svg'
import Switch from './Switch'
import deleteSvg from  '../assets/delete.svg'
import copy from '../assets/copy.svg'
import moment from 'moment'
import { useNavigate } from 'react-router-dom'
import { formatDuration } from './helper'
import axios from 'axios'
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
import {useAuth} from '../context/AuthProvider'
import { toast } from 'react-toastify';
import { useScreenSize } from '../context/ScreenSizeProvider'
import errorSvg from '../assets/material-symbols_error.svg'


function MeetingCard({meeting ,handleDeleteMeeting}) {
    const [status, setStatus] = useState(meeting.status === 'active'?true:false)
   const {user} = useAuth();
    console.log("user time zone ",user);
    
   const handleSwitchChange = async (newState) => {
    setStatus(newState); // this updates the UI
  
    try {
      if (user) {
        await axios.patch(`${API_BASE_URL}/api/meetings/${meeting._id}`, {
          status: newState ? 'active' : 'inactive'
        });
      }
    } catch (error) {
      toast.error(error.message || 'Something went wrong!', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };
    
    const navigate = useNavigate()
      const startTime = (meeting?.startTime && user?.timeZone)
      ? moment(meeting.startTime).tz(user.timeZone).format("h:mm A")
      : "Invalid Start Time";

      const endTime = (meeting?.startTime)
      ? moment(meeting.startTime).add(meeting.duration, 'minutes').format("h:mm A")
      : "Invalid End Time";
      console.log("startTime raw:", meeting.startTime);
      console.log("timezone:", user?.timeZone);



   
  return (
    <div className={status ?styles.mainContainer : styles.inactive}>
      <div className={styles.top}></div>
      <div className={styles.container}>
         {meeting.isConflict && 
            <div className={styles.conflictDiv}>
             <img src={errorSvg} width={'12px'} height={'12px'}/>
             <div className={styles.conflictPopup}>Conflicts of timing</div>
            </div>
          }
          <div className={styles.topSection}>
            <h3>{meeting.topic}</h3>
            <img src={editIcon} alt="" className={styles.icon}  onClick={()=>navigate(`/layout/${meeting._id}`)}/>
          </div>
          <div className={styles.midSection}>
            <p className={styles.day}>{moment(meeting.startTime).format('dddd, D MMM')}</p>
            <p className={styles.time}>{startTime} - {endTime}</p>
            <p className={styles.details}>{formatDuration(meeting.duration)}, {meeting.bannerText}</p>
          </div>
          <div className={styles.line}></div>
          <div className={styles.footer}>
             <Switch onChange={handleSwitchChange}  isOn={status}/>
             <img src={copy} alt="" className={styles.icon} onClick={()=>navigator.clipboard.writeText(meeting.link)}/>
             <img src={deleteSvg} alt="" className={styles.icon} onClick={()=>handleDeleteMeeting(meeting._id)} />
          </div>
      </div>
    </div>
  )
}


export default MeetingCard