import React, { useState } from 'react';
import styles from '../styles/Preference.module.css';
import Logo from '../components/Logo'
import { useScreenSize } from '../context/ScreenSizeProvider';
import marketingIcon from '../assets/marketing.svg'
import CompareIcon from '../assets/⚖️.png'
import BuildingIcon from '../assets/🏢.png'
import BooksICon from '../assets/📚.png'
import laptopIcon from '../assets/🖥.png'
import MoneyIcon from '../assets/flat-color-icons_money-transfer.svg'
import BriefcaseIcon from "../assets/openmoji_briefcase.svg"
import noteIcon from '../assets/fxemoji_note.svg'
import { useNavigate } from 'react-router-dom';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
import { toast } from 'react-toastify';
import axios from 'axios';

const Preference = () => {
 
  const [username, setUsername] = useState("");
  const [preference, setPreference] = useState("");
  const[loading,setLoading]=useState(false)
  const navigate = useNavigate();
  const categories = [
    { id: 1, icon: BuildingIcon, name: "Sales" },
    { id: 5, icon: BooksICon, name: "Education" },
    { id: 2, icon: MoneyIcon, name: "Finance" },
    { id: 6, icon: CompareIcon, name: "Government & Politics" },
    { id: 3, icon: BriefcaseIcon, name: "Consulting" },
    { id: 4, icon: laptopIcon, name: "Tech" },
    { id: 7, icon: noteIcon, name: "Recruiting" },
    { id: 8, icon: marketingIcon, name: "Marketing" }
  ]

  const validateForm = () => {
    if (!username.trim()) {
      toast.error("Username is required.");
      return false;
    }
    if(!preference.trim()){
      toast.error("Select one preference.");
      return false;
    }
    return true;
  };
  const handleSubmit = async(event) => {
    event.preventDefault();
    try {
      if (!validateForm()) return;
      setLoading(true)
     const response = await axios.put(`${API_BASE_URL}/api/users/preference`,{username,preference})
        if(response.status === 200){
          toast.success('Preference added successfully!', {
            position: 'top-center',
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          setUsername('')
          setPreference('')
          navigate('/login')
        }
      setLoading(false)
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
      setLoading(false)
    }


  };

  const {isMobile} =useScreenSize();
  console.log(preference);

  return (
    <div className={styles.mainContainer}>
      <div className={styles.container}>
        <Logo/>
        <div className={styles.formSection}>
          <div className={styles.formHeader}>
            <h1>Your Preferences</h1>
          </div>
          <div className={styles.formContainer}>
            <form onSubmit={handleSubmit}>
              <div className={styles.inputGroup}>
                <input
                  type="text"
                  id="username"
                  name="username"
                  placeholder='Tell us your username'
                  value={username}
                  onChange={(e)=>setUsername(e.target.value)}
                />
              </div>
              <div className={styles.inputGroup}>
                <p>Select one category that best describes your CNNCT:</p>
                  <div className={styles.preference}>
                      {categories && categories.map((category)=>(
                        <button type='button' className={`${styles.preferenceBtn} ${preference == category.name ? styles.selected
                        :''}`} key={category.id} onClick={()=>setPreference(category.name)}>
                          <img src={category.icon} alt="" />
                          <span>{category.name}</span>
                        </button>
                      ))}
                  </div>
                
              </div>
              
              <button type="submit" className={styles.continueBtn} disabled={loading}>{loading? 'Continue...':'Continue'}</button>
            </form>
          </div>
         
        </div>
      </div>
      <div className={styles.imgContainer}></div>
    </div>
  );
};

export default Preference;
