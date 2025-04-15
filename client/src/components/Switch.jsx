import { useState } from "react";
import styles from "../styles/Switch.module.css"; 

const Switch = ({ isOn, onChange }) => {
  
    const toggleSwitch = () => {
        if (onChange) {
            onChange(!isOn);
        }
    };

    return (
        <div className={`${styles.switch} ${isOn ? styles.active : ""}`} onClick={toggleSwitch}>
            <div className={styles.switchHandle}></div>
        </div>
    );
};

export default Switch;
