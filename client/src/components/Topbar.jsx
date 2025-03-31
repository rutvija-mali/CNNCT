import React from 'react'
import styles from '../styles/Topbar.module.css'
import Logo from './Logo'
import { useNavigate } from 'react-router-dom'

const Topbar = () => {
  const navigate = useNavigate();
  
  return (
   <div className={styles.mainContainer}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <Logo/>
        </div>
        <button className={styles.signUpBtn} onClick={()=>navigate('/signup')}>
          Sign up free
        </button>
      </div>
   </div>
  )
}

export default Topbar