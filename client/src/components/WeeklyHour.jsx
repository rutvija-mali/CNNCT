import React, { useCallback, useState ,useEffect} from "react";
import styles from "../styles/WeeklyHours.module.css";
import moment from 'moment-timezone';
import { RxCross2 } from "react-icons/rx";
import { MdContentCopy } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";
import axios from 'axios'
import {useAuth} from '../context/AuthProvider'
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
import { toast } from 'react-toastify';
import debounce from 'lodash/debounce'

const WeeklyHours = () => {
  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const timezones = moment.tz.names();
  const {user} = useAuth()

  
  const [timeZone, setTimeZone] = useState()
  const [inputs, setInputs] = useState(
    daysOfWeek.reduce((acc, day) => ({ ...acc, [day]: [""] }), {})
  );
const [days,setDays] = useState([])
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

  useEffect(()=>{
    const fetchAvailability = async ()=>{
      try {
        const response = await axios.get(`${API_BASE_URL}/api/users/${user.id}`)
        const {timeZone ,  availability=[] } = response.data
        const newInputs = daysOfWeek.reduce((acc,day)=>{ 
           const matchedDay = availability.find((item)=>item.day === day)
           const slots =  matchedDay?.slots.map((slot)=>(`${slot.startTime}-${slot.endTime}`))
           const inputValue = slots? slots : ['']
          return {
            ...acc,
            [day]:inputValue
          }
           
        },{})
        const availableDays = availability.map((item)=> item.day)
         console.log("days available");
         
          console.log(availableDays);
          
        setInputs(newInputs)
        setDays(availableDays)
        setTimeZone(timeZone)

      } catch (error) {
        toast.error(error.message||'Something went wrong!', {
                  position: 'top-right',
                  autoClose: 3000, // Auto close in 3 seconds
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
        });
      }
    }

    if(user){
      fetchAvailability()
    }
  },[user])
  
  

  const handleChangeInputs = (day, index,value,type)=>{
    setInputs((prev)=>{
      const currentValue = prev[day][index] || ""
      let [start,end] = currentValue.split("-")
        if(type === "start"){
          start = value
        }else if(type === "end"){
          end =value;
        }
        
      const  updatedValue = `${start ||""}-${end||''}`
      const updatedInputs = [...prev[day]  ]
      updatedInputs[index] = updatedValue
        
      return {
        ...prev,
        [day]:updatedInputs
      }

    })
    
  }
  const handleDayChange=(days)=>{
     setDays((prev)=>[...prev,days])
  }


const debounceSubmit =  useCallback(
  debounce(async ()=>{
    if(user){
      const availability = Object.entries(inputs)
      .filter(([day,slots])=> slots.length > 0 && days.includes(day))
      .map(([day,slots])=>({
        day,
        slots:slots.filter((slots)=> slots.includes("-"))
        .map((slot)=>{
          const [start, end] = slot.split("-")
          return { startTime:start.trim(), endTime:end.trim()}
        })
      }))
      try {
        const response = await axios.patch(`${API_BASE_URL}/api/users/${user.id}`,{
          availability,
          timeZone
        })
        if (response.status === 200) { 
          toast.success("Availability updated successfully!");
        }
      } catch (error) {
         toast.error(error.message||'Something went wrong!', {
                  position: 'top-right',
                  autoClose: 3000, // Auto close in 3 seconds
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                });
      }
    }
  },5000),[inputs, days, timeZone]
)

useEffect(()=>{
  debounceSubmit()
  return ()=>(debounceSubmit.cancel())
},[inputs,days,timeZone,debounceSubmit])


  return (
    <div className={styles.mainContainer}>
     <div className={styles.headerContainer}>
        <div className={styles.header}>
          <h3>Activity</h3>
        </div>
        <div className={styles.header}>
          <h3>Time Zone</h3>
          <select name="timeZone" id="timeZone" className={styles.timeStanndard} onChange={(e) => setTimeZone(e.target.value)}  value={timeZone} >
              {timezones.map((tz, index) => (
                  <option key={index} value={tz}>
                    {tz}(UTC {moment.tz(tz).format('Z')})
                  </option>
                ))}
            </select>
         </div>
        </div>
      <div>
      <div className={styles.body}>
        <h3>Weekly hours</h3>
        { daysOfWeek.map((day)=>(
          <div className={styles.inputContainer}>
              <div className={styles.day}>
                <input type="checkbox" disabled={day == 'Sunday'}   onChange={()=>handleDayChange(day)}/>
                {day.slice(0, 3)}
              </div>
              <div className={styles.input}>{ day == 'Sunday'? (<p>Unavailable</p>):
           
           ((inputs[day]||[]).map((timeSlots, index)=>(
                  <div className={styles.inputGroup} key={index}>
                      <div>
                        <input 
                           type="text" 
                           disabled={!days.includes(day)}
                           value={timeSlots.split("-")[0]||''}
                           onChange={(e)=>handleChangeInputs(day,index,e.target.value,"start")}
                        />
                        <span>-</span>
                        <input 
                           type="text" 
                           value={timeSlots.split("-")[1]||''}
                           onChange={(e)=>handleChangeInputs(day,index,e.target.value,"end")}
                        />
                      </div>
                      
                        <RxCross2 color="#00000080" size={'1rem'} onClick={()=>removeInput(day,index)}/>
                  </div>
                )))
              }
                </div>
              <div className={styles.icons}>
                <IoMdAdd color="#0000008C" size={'1rem'} onClick={()=>addInput(day)}/>
                <MdContentCopy  color="#0000008C" size={'1rem'} onClick={()=>navigator.clipboard.writeText(inputs[day])}/>
              </div>
          </div>
        ))
        }
      </div>
      
     </div>
    </div>
  );
};

export default WeeklyHours;
