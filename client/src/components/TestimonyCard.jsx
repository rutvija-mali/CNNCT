import React from 'react'
import styles from '../styles/TestimonyCard.module.css'
import avatar from '../assets/avatar.png'

const TestimonyCard = ({index}) => {
  return (
    <div className={styles.mainContainer} style={(index === 1 || index === 4)?{backgroundColor:'#DEDEDE'}:{backgroundColor:'#FFFFFF'}}>
        <div className={styles.container}>
            <h3>Amazing Tool! saved me months</h3>
            <p>This is a placeholder for the first user review about how CNNCT is so helpful and your client has to say that it is wonderful and meaningful.</p>
            <div className={styles.profile}>
                <img src={avatar} alt="avtar" />
                <div className={styles.info}>
                  <span>John baker</span><br/>
                  <span>Some_StartupName</span>
                </div>
            </div>
        </div>
    </div>
  )
}

export default TestimonyCard