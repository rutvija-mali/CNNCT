import React, { useState } from 'react'
import styles from '../styles/Bookings.module.css'
import { useScreenSize } from '../context/ScreenSizeProvider';
import SmallScreenTopbar from '../components/SmallScreenTopbar';
import MeetingCard2 from '../components/MeetingCard2'



const Bookings = () => {
  const {isMobile} = useScreenSize()
  const [activeTab, setActiveTab]= useState()
  
  return (
    <div className={styles.mainContainer}>
      {isMobile && <SmallScreenTopbar/>}
      <div className={styles.container}>
        {/* Heading Section */}
        <div className={styles.headingSection}>
          <div>
            <h3>Bookings</h3>
            <p>See upcoming and past events bookedd through your event type links</p>
          </div>
        </div>
            <div className={styles.mainContent}>
              <div className={styles.tabs}>
                {["upcoming", "pending", "canceled", "past"].map((tab) => (
                  <button
                    key={tab}
                    className={`${styles.tabButton} ${activeTab === tab ? styles.active: ""}`}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>
              
             <MeetingCard2/>
             <MeetingCard2/>
             <MeetingCard2/>

             
            </div>
          <div>
        </div>
      </div>
    </div>

  )
}

export default Bookings