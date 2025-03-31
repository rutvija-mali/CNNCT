import React, { useState } from 'react'
import styles from '../styles/Availability.module.css'
import { FaList } from "react-icons/fa";
import { IoIosCalendar } from "react-icons/io";
import WeeklyHours from '../components/WeeklyHour';
import CalendarComponent from '../components/Calendar';

const Availability = () => {
  const [isAvailabilityView, setAvailabilityView] = useState(true)
  console.log(isAvailabilityView);
  
  return (
    <div className={styles.mainContainer}>
      <div className={styles.container}>
        {/* Heading Section */}
        <div className={styles.headingSection}>
          <div>
            <h3>Availability</h3>
            <p>Configure times when you are available for bookings.</p>
            
          </div>
          
        </div>

        <div className={styles.buttonSection}>
              <button onClick={()=>setAvailabilityView(true)} className={`${styles.button} ${isAvailabilityView ? styles.activeBtn : ''}`}>
                <FaList /> Availability
              </button>
              <button onClick={()=>setAvailabilityView(false)} className={`${styles.button} ${!isAvailabilityView ? styles.activeBtn : ''}`}>
                <IoIosCalendar />Calendar View
              </button>
        </div>

        <div className={styles.mainContent}>
           {isAvailabilityView && <WeeklyHours/>}
           {!isAvailabilityView && <CalendarComponent/>}
        </div>
      </div>
    </div>

  )
}

export default Availability