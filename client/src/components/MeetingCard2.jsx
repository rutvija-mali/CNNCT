import React, { useState } from "react";
import styles from "../styles/MeetingCard2.module.css";
import peopleSvg from "../assets/mdi_people-outline.svg";
import rejectSvg from "../assets/reject.svg";
import acceptSvg from "../assets/mdi_tick.svg";
import {useScreenSize} from '../context/ScreenSizeProvider'
import Models from './Models';

function MeetingCard2({ meetings }) {
  const [status, setStatus] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const {isMobile} = useScreenSize()

  const handleCloseModel = ()=>{
    setIsOpen(false)
  }

  return (
    <div className={styles.mainContainer}>
      <div className={styles.timeSection}>
        <p className={styles.date}>Friday, 28 Feb</p>
        <p className={styles.time}>2:35 pm - 3:00 pm</p>
      </div>
      <div className={styles.nameSection}>
        <div>
          <p className={styles.name}>Meeting-2</p>
          <p className={styles.time}>You and team 2</p>
        </div>
        {isMobile && 
          <p>
            <img src={peopleSvg} alt="" onClick={() => setIsOpen((prev) => !prev)} />
            13 
          </p>
        }
      </div>
      <div className={styles.status}>
        {status === null ? (
          <div className={styles.statusButtons}>
            <button
              className={`${styles.statusBtn} ${styles.reject}`}
              style={{ backgroundColor: "red" }}
              onClick={() => setStatus("rejected")} 
            >
              <img src={rejectSvg} alt="" /> {!isMobile && 'Reject'}
            </button>
            <button
              className={`${styles.statusBtn} ${styles.accept}`}
              style={{ backgroundColor: "green" }}
              onClick={() => setStatus("accepted")} 
            >
              <img src={acceptSvg} alt="" /> {!isMobile && 'Accept'}
            </button>
          </div>
        ) : status === "accepted" ? (
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
          <img src={peopleSvg} alt="" onClick={() => setIsOpen(true)} />
          13 
        </p>
      </div>}
      {isOpen && <Models  onClick={handleCloseModel}/>}
    </div>
  );
}

export default MeetingCard2;
