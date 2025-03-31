import React, { useEffect, useState } from 'react'
import styles from '../styles/Settings.module.css'
import Button from '../components/Button'
import {useScreenSize} from '../context/ScreenSizeProvider'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthProvider'

const Settings = () => {
const {isMobile} = useScreenSize()
const [formData,setFormData] =useState(
  { 
    firstName:'',
    lastName:'',
    email:'',
    password:'',
    confirmPassword:'',
  }
)
const[loading,setLoading]=useState(false)
const {user} = useAuth()
console.log(user);

useEffect(() => {
  const fetchUser = async () => {
    if (!user || !user.id) return;
    try {
      const response = await axios.get(`${API_BASE_URL}/api/users/${user.id}`);
      if (response.status === 200) {
        setFormData(response.data);
      }
    } catch (error) {
      toast.error(error.message || 'Something went wrong!', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };
  fetchUser();
}, []);

const validateForm = () => {
  if (!formData.firstName.trim()) {
    toast.error("First name is required.");
    return false;
  }
  if (!formData.lastName.trim()) {
    toast.error("Last name is required.");
    return false;
  }
  if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
    toast.error("Enter a valid email.");
    return false;
  }
  if (formData.password.length < 6) {
    toast.error("Password must be at least 6 characters long.");
    return false;
  }
  if (formData.password !== formData.confirmPassword) {
    toast.error("Passwords do not match.");
    return false;
  }
  if (!formData.toc) {
    toast.error("You must agree to the terms and conditions.");
    return false;
  }
  return true;
};
const handleSubmit = async(event) => {
  event.preventDefault();
  try {
    if (!validateForm()) return;
    setLoading(true)
   const response = await axios.put(`${API_BASE_URL}/api/users/user/${user.id}`,formData)
      if(response.status == 200){
        toast.success('User updated successfully!', {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        setFormData(response.data)
       
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

const handleChange = (event) => {
  const { name, value } = event.target;
  setFormData({
    ...formData,
    [name] : value,
  });
};
  return (
      <div className={styles.mainContainer}>
        <div className={styles.container}>
          {/* Heading Section */}
          <div className={styles.headingSection}>
            <div>
              <h3>Profile</h3>
              {!isMobile &&<p>Manage settings for your profile.</p>}
              
            </div>
            
          </div>
          <div className={styles.mainContent}>
             <div className={styles.heading}>
                 <button>Edit profile</button>
             </div>
             <form onSubmit={handleSubmit}>
                <div className={styles.inputGroup}>
                  <label htmlFor="firstName">First Name</label>
                  <input
                   className={styles.userInput}
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                  />
                </div>
                
                <div className={styles.inputGroup}>
                  <label htmlFor="lastName">Last Name</label>
                  <input
                    className={styles.userInput}
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                  />
                </div>
                
                <div className={styles.inputGroup}>
                  <label htmlFor="email">Email</label>
                  <input
                    className={styles.userInput}
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
                
                <div className={styles.inputGroup}>
                  <label htmlFor="password">Password</label>
                  <input
                   className={styles.userInput}
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>
                
                <div className={styles.inputGroup}>
                  <label htmlFor="confirmPassword">Confirm Password</label>
                  <input
                    className={styles.userInput}
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                </div>
             </form>
             <div className={styles.buttonSection}>
              <Button type={'submit'} backgroundColor={'#1877F2'} color={'#FFFFFF'} onClick={handleSubmit} disable={loading}>
               {loading?'Editing':'Edit'}

              </Button>
             </div>

          </div>
          
        </div>
      </div>
  
  )
}

export default Settings