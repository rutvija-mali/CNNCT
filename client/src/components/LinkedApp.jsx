import React from 'react'
import styles from '../styles/LinkedApp.module.css'


const LinkedApp = ({icon,title,desc,key}) => {
  return (
    <div className={styles.mainContainer} key={key}>
       <img src={icon} />
       <div className={styles.info}>
         <h5>{title}</h5>
         <p>{desc}</p>
       </div>
    </div>
  )
}

export default LinkedApp