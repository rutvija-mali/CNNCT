import React, { useEffect, useState } from 'react'
import styles from '../styles/Bookings.module.css'
import { useScreenSize } from '../context/ScreenSizeProvider';
import SmallScreenTopbar from '../components/SmallScreenTopbar';
import MeetingCard2 from '../components/MeetingCard2'
import { fetchMeetings } from '../service/MeetingCard';
import { useAuth } from '../context/AuthProvider';


const Bookings = () => {
  const {isMobile} = useScreenSize()
  const [activeTab, setActiveTab]= useState('Upcoming')
  const [meetings, setMeeting] = useState([])
  const {user} = useAuth();
  const id = user?.id;
  console.log(id);
  
  console.log("active tab : "+activeTab);

  useEffect(()=>{  
        if(!id) return
        if(activeTab == "Upcoming"){
          console.log("log in upcoming");
          fetchMeetings(id,'Upcoming',null,setMeeting,null)
        } 
        if(activeTab == "Past"){
          console.log("log in past");     
            fetchMeetings(id,'Past',null,setMeeting,null)
        }
        if(activeTab == "Pending"){
          console.log("log in pending");     
            fetchMeetings(id,'Pending','Pending',setMeeting,null)
        }
        if(activeTab == "Canceled"){
          console.log("log in cancel");     
            fetchMeetings(id,'Canceled','Rejected',setMeeting,null)
        }
  },[activeTab, id])

  if (!id) {
    return <div>Loading...</div>;  
  }
  
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
                {["Upcoming", "Pending", "Canceled", "Past"].map((tab) => (
                  <button
                    key={tab}
                    className={`${styles.tabButton} ${activeTab === tab ? styles.active: ""}`}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>
              {meetings && meetings.map((meeting)=>(
                <div key={meeting._id}>
                  <MeetingCard2 meeting={meeting}/>
                </div>
              ))}
              
             
            </div>
          <div>
        </div>
      </div>
    </div>

  )
}

export default Bookings