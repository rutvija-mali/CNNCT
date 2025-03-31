import React from 'react'
import styles from '../styles/Footer.module.css'
import twitter from "../assets/twitter.svg";
import insta from "../assets/insta.svg";
import yt from "../assets/yt.svg";
import tikTok from "../assets/tikTok.svg";
import cbiPlugEu from "../assets/cbi_plug-eu.svg";
import { useScreenSize } from '../context/ScreenSizeProvider';
import { useNavigate } from 'react-router-dom';


const Footer = () => {
    const links = [
        "About CNNCT",
        "Blog",
        "Press",
        "Social Good",
        "Contact",
        "Careers",
        "Getting Started",
        "Features and How-Tos",
        "FAQs",
        "Report a Violation",
        "Terms and Conditions",
        "Privacy Policy",
        "Cookie Notice",
        "Trust Center"
      ];
    const socialLinks = [
        twitter,
        insta,
        yt,
        tikTok,
        cbiPlugEu
    ]
    const {isMobile} = useScreenSize()
    const navigate = useNavigate();
  return (
    <div className={styles.mainContainer}>
       <div className={styles.conatiner}>
            <div className={styles.subSection}>
                {!isMobile &&(
                    <div className={styles.buttonSection}>
                        <button className={styles.loginBtn} onClick={()=>navigate('/login')}>Log in</button>
                        <button className={styles.signIn} onClick={()=>navigate('/signup')}>Sign in</button>
                    </div>
                )}
                <div className={styles.linksSection}>
                    {links && links.map((link,index)=><a href='#' key={index}>{link}</a>)}
                    {isMobile &&(
                        <button className={styles.signIn} onClick={()=>navigate('/signup')}>Sign in</button>
                    )}
                </div>
               

            </div>
            <div className={styles.socialSection}>
               {!isMobile && <p>We acknowledge the Traditional Custodians of the land on which our office stands, The Wurundjeri people of the Kulin Nation, and pay our respects to Elders past, present and emerging.</p>}

               <div className={styles.socialLinks}>
                  {socialLinks && socialLinks.map((link,index)=>(
                    <a href='#' key={index}>
                        <img src={link} alt="" />
                    </a>
                ))}
               </div>

            </div>
       </div>
    </div>
  )
}

export default Footer