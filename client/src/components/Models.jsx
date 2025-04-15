import React from 'react'
import styles from '../styles/Model.module.css'
import { ImCancelCircle } from "react-icons/im";

function Models({participents,onClick}) {
  return (
    <div className={styles.mainContainer}>
       <div className={styles.container}>
            <div className={styles.header}>
                <h3 className={styles.headingModel}>Participant <span>{`(${participents.length})`}</span></h3>
                <ImCancelCircle size={'1.5rem'} color='#B6B6B6' onClick={onClick}/>
            </div>
            <div className={styles.participents}>
               {participents.map((person,index)=>(
                <div className={styles.person} key={index}>
                    <p>{`${person.user.firstName} ${person.user.lastName}`}</p>
                    <input type="checkbox" checked={person.status == 'Accepted'}/>  
                </div>
               
               ))}
            </div>
       </div>
    </div>
  )
}

export default Models