import React, { useEffect, useState } from "react";
import styles from "../styles/MeetingCard2.module.css";
import peopleSvg from "../assets/mdi_people-outline.svg";
import rejectSvg from "../assets/reject.svg";
import acceptSvg from "../assets/mdi_tick.svg";
import {useScreenSize} from '../context/ScreenSizeProvider'
import Models from './Models';
import moment from 'moment'
import { useAuth } from "../context/AuthProvider";
import axios from "axios";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
import { toast } from 'react-toastify';

function MeetingCard2({ meeting }) {
  const [status, setStatus] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const {isMobile} = useScreenSize()
  const {user} = useAuth()
  console.log(`${API_BASE_URL}/api/participants/`);
  const startTime = moment(meeting.startTime).tz(user?.timeZone).format("h:mm A");
  const endTime = moment(meeting.startTime).add(meeting.duration,'minutes').format('h:mm A')
  const handleCloseModel = ()=>{
      setIsOpen(false)
  }
  const handleParticipantsStatus = async(status)=>{
     
    try {
      const response = await axios.put(`${API_BASE_URL}/api/participants/`,{
          user:user.id,
          status:status,
          meeting:meeting._id
        
      })
      if(response.status === 200){
        setStatus(response.data.status)
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

  useEffect(()=>{
    const fetch = async()=>{
       try {
        const response =await axios.get(`${API_BASE_URL}/api/participants/`,{
          params:{
            user:user,
            meeting:meeting
          }
        })
        if(response.status == 200){
          setStatus(response.data.status)
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
    fetch()
  },[])
 
  return (
    <div className={styles.mainContainer}>
      <div className={styles.timeSection}>
        <p className={styles.date}>{moment(meeting.startTime).format('dddd, D MMM')}</p>
        <p className={styles.time}>{startTime} - {endTime}</p>
      </div>
      <div className={styles.nameSection}>
        <div>
          <p className={styles.name}>{meeting.topic}</p>
          <p className={styles.time}>{(meeting.participants.length -1 > 0) ?`You and ${meeting.participants.length -1} others`:'You' }</p>
        </div>
       
        {isMobile && 
          <p>
            <img src={peopleSvg} alt="" onClick={() => setIsOpen((prev) => !prev)} />
            {meeting.participants.length} 
          </p>
        }
      </div>
      <div className={styles.status}>
        {status === null || status === 'Pending' ? (
          <div className={styles.statusButtons}>
            <button
              className={`${styles.statusBtn} ${styles.reject}`}
              style={{ backgroundColor: "red" }}
              onClick={() => handleParticipantsStatus('Rejected')} 
            >
              <img src={rejectSvg} alt="" /> {!isMobile && 'Reject'}
            </button>
            <button
              className={`${styles.statusBtn} ${styles.accept}`}
              style={{ backgroundColor: "green" }}
              onClick={() => handleParticipantsStatus('Accepted')} 
            >
              <img src={acceptSvg} alt="" /> {!isMobile && 'Accept'}
            </button>
          </div>
        ) : status === "Accepted" ? (
          <button className={`${styles.statusBtn} ${styles.acceptedBtn}`} disabled>
           Accepted
          </button>
        ) : (
          <button className={`${styles.statusBtn} ${styles.rejectedBtn}`} disabled>
            Rejected
          </button>
        )}
      </div>
      {!isMobile &&<div className={styles.participents}>
        <p>
          <img src={peopleSvg} alt="" onClick={()=>setIsOpen(true)} />
          {meeting.participants.length}
        </p>
      </div>}
      {isOpen && <Models  onClick={handleCloseModel} participents={meeting.participants}/>}
    </div>
  );
}

export default MeetingCard2;
