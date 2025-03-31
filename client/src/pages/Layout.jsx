import React, { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import { useScreenSize } from '../context/ScreenSizeProvider'
import styles from '../styles/Layout.module.css'
import Bottombar from '../components/Bottombar'
import { useAuth } from '../context/AuthProvider'

const Layout = () => {
  // const { fetchUser} = useAuth;
  // useEffect(()=>{
  //   fetchUser();
  // },[])
  const {isMobile} = useScreenSize()
  return (
    <div className={styles.mainContainer}>
        <div className={styles.sidebar}>
          {!isMobile && <Sidebar/>}
        </div>
        <div className={styles.mainContent}>
          <Outlet/>
        </div>
        {isMobile && (
         <div className={styles.bottombar}>
           <Bottombar/>
         </div>
        )}
    </div>
  )
}

export default Layout