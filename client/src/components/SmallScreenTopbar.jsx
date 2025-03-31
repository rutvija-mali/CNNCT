import React from 'react'
import styles from '../styles/SmallScreenTopBar.module.css'
import Logo from './Logo'
import Logout from './Logout'

const SmallScreenTopbar = () => {
  return (
    <div className={styles.mainContainer}>
       <div className={styles.container}>
         <Logo/>
         <Logout/>
       </div>
    </div>
  )
}

export default SmallScreenTopbar