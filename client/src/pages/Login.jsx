import React, { useState } from 'react';
import styles from '../styles/Signin.module.css';
import { useScreenSize } from '../context/ScreenSizeProvider';
import Logo from '../components/Logo';
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
import { toast } from 'react-toastify';

const Login = () => {
  const [formData, setFormData] = useState({
    username:'',
    password: '',
  });
const navigate = useNavigate()
const [loading,setLoading] =useState(false)
const validateForm = () => {

  if (!formData.username.trim()) {
    toast.error("Username is required.");
    return false;
  }
  if (formData.password.length < 6) {
    toast.error("Password must be at least 6 characters long.");
    return false;
  }
  
  return true;
};
const handleSubmit = async(event) => {
  event.preventDefault();
  try {
    if (!validateForm()) return;
    setLoading(true)
   const response = await axios.post(`${API_BASE_URL}/api/users/login`,formData)
      if(response.status === 200){
        toast.success('User loged in successfully!', {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        setFormData({
          username:'',
          password: ''
        })
        navigate('/layout')
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
  const {isMobile} =useScreenSize();
  
  
  // form validation, loading and error handling is remaining 
  // for media query use use context

  return (
    <div className={styles.mainContainer}>
      <div className={styles.container}>
        <Logo/>
        <div className={styles.formSection}>
          <div className={styles.formHeader}>
            {!isMobile && <h1>Sign in</h1>}
            {isMobile && <h2 className={styles.heading}>Sign in to your Spark</h2>}
          </div>
          <div className={styles.formContainer}>
            <form onSubmit={handleSubmit}>
              <div className={styles.inputGroup}>
                <input
                  type="text"
                  id="username"
                  name="username"
                  placeholder='username'
                  value={formData.username}
                  onChange={handleChange}
                />
              </div>
              <div className={styles.inputGroup}>
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder='password'
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
              
              <button type="submit" className={styles.loginBtn} disabled={loading}>{loading?'Logging..':'Log in'}</button>
            </form>
          </div>
          <div className={styles.signUp}>
              <span>Create an account</span>
              <a href="#" onClick={()=>navigate('/signup')}>Sign up instead</a>
            </div>
        </div>
        <div className={styles.noticeContainer}>
            <p>
              This site is protected by reCAPTCHA and the
              <a href="#"> Google Privacy Policy </a> and
              <a href="#"> Terms of Service </a> apply.
            </p>
          </div>
      </div>
      <div className={styles.imgContainer}></div>
    </div>
  );
};

export default Login;
