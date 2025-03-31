import React from 'react'
import styles from '../styles/Model.module.css'
import { ImCancelCircle } from "react-icons/im";

function Models({participents,onClick}) {
  return (
    <div className={styles.mainContainer}>
       <div className={styles.container}>
            <div className={styles.header}>
                <h3 className={styles.headingModel}>Participant <span>{`(5)`}</span></h3>
                <ImCancelCircle size={'1.5rem'} color='#B6B6B6' onClick={onClick}/>
            </div>
            <div className={styles.participents}>
               {/* {participents.map((person,index)=>( */}
                <div className={styles.person}>
                    <p>Aneesh Menone</p>
                    <input type="checkbox" />  
                    {/* logic would be if status is true then checked later remove input and add span */}
                </div>
                <div className={styles.person}>
                    <p>Aneesh Menone</p>
                    <input type="checkbox" />
                </div>
                <div className={styles.person}>
                    <p>Aneesh Menone</p>
                    <input type="checkbox" />
                </div>
               {/* ))} */}
            </div>
       </div>
    </div>
  )
}

export default Models