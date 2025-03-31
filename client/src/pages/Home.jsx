import React from 'react'
import styles from '../styles/Home.module.css'
import Topbar from '../components/Topbar'
import heroImage from '../assets/heroImage.png'
import flowerSvg from '../assets/flower.svg'
import { useScreenSize } from '../context/ScreenSizeProvider'
import TestimonyCard from '../components/TestimonyCard'
import contact from "../assets/contact.svg";
import calenderImg from "../assets/calenderImg.png";
import bandsintown from "../assets/second.svg";
import bonfire from "../assets/bonfire.svg";
import books from "../assets/books.svg";
import gift from "../assets/gift.svg";
import cameo from "../assets/cameo.svg";
import club from "../assets/club.svg";
import community from "../assets/community.svg";
import audiomac from '../assets/audioMac.svg';
import LinkedApp from '../components/LinkedApp'
import Footer from '../components/Footer'
import {useNavigate} from 'react-router-dom'


const Home = () => {
  const {isMobile} = useScreenSize()
 const apps = [
    { "id": 1, "icon":audiomac , "name": "Audiomack", "desc": "Add an Audiomack player to your Linktree" },
    { "id": 2, "icon":bandsintown , "name": "Bandistown", "desc": "Drive ticket sales by listing your events" },
    { "id": 3, "icon":bonfire , "name": "Bonfire", "desc": "Display and sell your custom merch" },
    { "id": 4, "icon":gift , "name": "Buy Me A Gift", "desc": "Let visitors support you with a small gift" },
    { "id": 5, "icon":cameo , "name": "Cameo", "desc": "Make impossible fan connections possible" },
    { "id": 6, "icon":books , "name": "Books", "desc": "Promote books on your Linktree" },
    { "id": 7, "icon":club , "name": "Clubhouse", "desc": "Let your community in on the conversation" },
    { "id": 8, "icon":community , "name": "Community", "desc": "Build an SMS subscriber list" },
    { "id": 9, "icon":contact , "name": "Contact Details", "desc": "Easily share downloadable contact details" }
  ]
  const navigate = useNavigate();
  
  return (
    <div className={styles.mainContainer}>
      <div className={styles.container}>
        <Topbar/>
        <div className={styles.heroTitle}>
           <h1>CNNCT – Easy 
           Scheduling Ahead</h1>
        </div>
        <div className={styles.btnContainer}>
          <button className={styles.signUpBtn} onClick={()=>navigate('/signup')}>Sign up free</button>
        </div>
        <div className={styles.heroImage}>
          <img src={heroImage} alt="hero image" />
        </div>
        <div className={styles.secondContainer}>
          <h2>Simplified scheduling for you and your team</h2>
          <p>CNNCT eliminates the back-and-forth of scheduling meetings so you can focus on what matters. Set your availability, share your link, and let others book time with you instantly.</p>
        </div>
        <div className={styles.subSection}>
          <div className={styles.subSectionInfo}>
               <h2>Stay Organized with Your Calendar & Meetings</h2>
               <p>Seamless Event Scheduling</p>
               <ul>
                <li>View all your upcoming meetings and appointments in one place.
                </li>
                <li>Syncs with Google Calendar, Outlook, and iCloud to avoid conflicts</li>
                <li>Customize event types: one-on-ones, team meetings, group sessions, and webinars.</li>
               </ul>
          </div>
          <div className={styles.subSectionImage}>
             <img src={calenderImg} alt="" />
          </div>
        </div>
        <div className={styles.testimony}>
          <div className={styles.testimonyTitle}>
             <h1>Here's what our <span>customer</span>{isMobile && <br/>} has to says</h1>
             <button>Read customer stories</button>
          </div>
          <div className={styles.reviewSection}>
             <img src={flowerSvg} alt="flowersvg" className={styles.flowerSvg}/>
             <p>[short description goes in here] lorem ipsum is a placeholder text to demonstrate</p>
          </div>
        </div>
        <div className={styles.testimonialContainer}>
          {[1,2,3,4].map((index)=>(
            <div key={index} className={styles.card}>
              <TestimonyCard index={index} />
            </div>
          ))}
        </div>
        <div className={styles.linkedAppHeading}>
           <h2>All Link Apps and Integration</h2>
        </div>
        <div className={styles.LinkedAppSection}>
           {apps && apps.map((app)=>(
            <div className={styles.appContainer} key={app.index}>
              <LinkedApp title={app.name}  desc={app.desc} icon={app.icon}/>
            </div>
 
           ))}
        </div>
        <Footer/>
      </div>
    </div>
  )
}

export default Home