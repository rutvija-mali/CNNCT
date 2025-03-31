import React, { useState } from "react";
import styles from "../styles/WeeklyHours.module.css";

const WeeklyHours = () => {
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const [inputs, setInputs] = useState(
    daysOfWeek.reduce((acc, day) => ({ ...acc, [day]: [""] }), {})
  );

  const addInput = (day) => {
    setInputs((prev) => ({
      ...prev,
      [day]: [...prev[day], ""],
    }));
  };

  const removeInput = (day, index) => {
    setInputs((prev) => ({
      ...prev,
      [day]: prev[day].filter((_, i) => i !== index),
    }));
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Weekly Hours</h2>
      {daysOfWeek.map((day) => (
        <div key={day} className={styles.dayRow}>
          <label className={styles.checkboxLabel}>
            <input type="checkbox" defaultChecked /> {day}
          </label>
          <div className={styles.inputs}>
            {inputs[day].map((_, index) => (
              <div key={index} className={styles.timeSlot}>
                <input type="text" placeholder="Start" className={styles.input} />
                <span className={styles.separator}>-</span>
                <input type="text" placeholder="End" className={styles.input} />
                <button onClick={() => removeInput(day, index)} className={styles.removeBtn}>✖</button>
              </div>
            ))}
            <button className={styles.addBtn} onClick={() => addInput(day)}>+</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default WeeklyHours;