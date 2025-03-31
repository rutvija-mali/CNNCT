import React, { useEffect, useState } from 'react'
import styles from '../styles/MeetingCard.module.css'
import editIcon from '../assets/line-md_edit.svg'
import Switch from './Switch'
import deleteSvg from  '../assets/delete.svg'
import copy from '../assets/copy.svg'
import moment from 'moment'
import { useNavigate } from 'react-router-dom'


function MeetingCard({meeting}) {
    const [status, setStatus] = useState(false)
    const handleSwitchChange = (state) => {
        setStatus((prev)=>!prev)
    };
    const navigate = useNavigate()
  
    const startTime = moment(meeting.startTime).tz(meeting.timeZone).format("h:mm A");
    const endTime = moment(meeting.startTime).add(meeting.duration,'minutes').format('h:mm A')
    function formatDuration(minutes) {
      if (minutes < 60) {
          return `${minutes} min`; 
      } else {
          const hours = (minutes / 60).toFixed(1); 
          return `${hours} hr`; 
      }
  }
 
  
   
  return (
    <div className={status ?styles.mainContainer : styles.inactive}>
      <div className={styles.top}></div>
      <div className={styles.container}>
          <div className={styles.topSection}>
            <h3>{meeting.topic}</h3>
            <img src={editIcon} alt="" className={styles.icon} /> onClick={()=>navigate(`/layout/${meeting._id}`)}
          </div>
          <div className={styles.midSection}>
            <p className={styles.day}>{moment(meeting.startTime).format('dddd, D MMM')}</p>
            <p className={styles.time}>{startTime} - {endTime}</p>
            <p className={styles.details}>{formatDuration(meeting.duration)}, {meeting.bannerText}</p>
          </div>
          <div className={styles.line}></div>
          <div className={styles.footer}>
             <Switch onChange={handleSwitchChange} />
             <img src={copy} alt="" className={styles.icon} onClick={()=>navigator.clipboard.writeText(meeting.link)}/>
             <img src={deleteSvg} alt="" className={styles.icon} />
          </div>
      </div>
    </div>
  )
}

export default MeetingCard