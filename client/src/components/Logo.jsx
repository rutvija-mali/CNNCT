import React from 'react'
import logoSVG from '../assets/logo.svg'
import styles from '../styles/Logo.module.css'

const Logo = () => {
  return (
     <div className={styles.logoContainer}>
        <img src={logoSVG} alt="logo" />
        <span>CNNCT</span>
     </div>
  )
}

export default Logo