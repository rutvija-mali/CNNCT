import React, { useState ,useRef,useEffect} from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import moment from 'moment-timezone';
import styles from '../styles/AddEvent.module.css';
import { useScreenSize } from '../context/ScreenSizeProvider';
import SmallScreenTopbar from '../components/SmallScreenTopbar';
import Button from '../components/Button';
import editSvg from '../assets/line-md_edit.svg'
import axios from 'axios'
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
import { toast } from 'react-toastify';
import {useAuth} from '../context/AuthProvider'


const AddEvent = () => {
  const [isNext, setNext] = useState(false);
  const { isMobile } = useScreenSize();
  const navigate = useNavigate();
  const timezones = moment.tz.names();
  const [image, setImage] = useState(null);
  const [text, setText] = useState("");
  const [bgColor, setBgColor] = useState("#ffffff");
  const fileInputRef = useRef(null);
  const [overlayText, setOverlayText] = useState("Enter text");
  const[loading,setLoading]=useState(false)
  const {userName} = useAuth()
  const {user} = useAuth()
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({
    topic: '',
    password: '',
    hostId:user.id,
    hostName:userName,
    description: '',
    date: '',
    time: '',
    amPm: 'PM',
    timeZone: '',
    duration: '',
    link: '',
    emails: ''

  });
  const {id:id} = useParams()
  
  const fetchMeeting = async()=>{ 
   try {
    const response =  await axios.get(`${API_BASE_URL}/api/meetings/${id}`)
      if(response.status === 200){
        formData(response.data)
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
  
  useEffect(() => {
    if(id){
     fetchMeeting()
    }else{
    setFormData((prevData) => ({
      ...prevData,
      hostName: userName,  
    }));
  }
  }, [userName]);
 

    // Handle Image Upload
  const handleImageChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
        setFile(selectedFile);
        setImage(URL.createObjectURL(selectedFile));
    }
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

    const handleClick = () => {
      fileInputRef.current.click();
    };

  // Duration options
  const durationOptions = [
    { value: 15, label: '15 minutes' },
    { value: 30, label: '30 minutes' },
    { value: 45, label: '45 minutes' },
    { value: 60, label: '1 hour' },
    { value: 90, label: '1.5 hours' },
    { value: 120, label: '2 hours' },
    { value: 180, label: '3 hours' },
  ];
  const colors = ['#EF6500', '#FFFFFF', '#000000'];

  // Handle next button click
  const handleClickNext = (e) => {
    e.preventDefault();
    console.log('log');
    setNext(true);
    console.log('isNext ' + isNext);
  };

 
const combinedDateTime = moment.tz(
  `${formData.date} ${formData.time}`, 
  "YYYY-MM-DD HH:mm", 
  formData.timeZone 
).toISOString();

 

  //handleSubmit
  const handleSubmit = async(e)=>{
    e.preventDefault()
    const newFormData = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      newFormData.append(key, value);
    });

    newFormData.append("startTime", combinedDateTime);
    newFormData.append("bannerColor", bgColor);
    newFormData.append("bannerText", overlayText);

    if (file) {
      newFormData.append("file", file);

    }
    try {
      setLoading(true)
      const response= await axios.post(`${API_BASE_URL}/api/meetings/`,newFormData)
      if(response.status === 201){
        toast.success('Meeting created successfully!', {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        }); 
        setFormData({
          topic: '',
          password: '',
          hostName:userName,
          description: '',
          date: '',
          time: '',
          amPm: 'PM',
          timeZone: '',
          duration: 15,
          link: '',
          emails: ''
      
        }) 
        setBgColor('')
        setOverlayText('Enter text')
        setFile('')
       setLoading(false)
      }
    } catch (error) {
      setLoading(false)
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

  return (
    <div className={styles.mainContainer}>
      {isMobile && <SmallScreenTopbar />}
      <div className={styles.container}>
        {/* Heading section for desktop */}
        {!isMobile && (
          <div className={styles.headingSection}>
            <div>
              <h3>Create Event</h3>
              <p>Create events to share for people to book on your calendar.</p>
            </div>
          </div>
        )}

        {/* Form Container */}
        <div className={styles.formContainer}>
          <h3 className={styles.header}>Add Event</h3>
          <div className={styles.formSection}>
          <form action="">
            {/* First Step */}
            {!isNext && (
              <div className={styles.firstSection}>
                <div className={styles.formGroup}>
                  <label htmlFor="topic">Event Topic <span>*</span></label>
                  <input
                    className={styles.eventInput}
                    type="text"
                    placeholder="Set a conference topic before it starts"
                    name="topic"
                    value={formData.topic}
                    onChange={handleChange}
                    id="topic"
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="password">Password</label>
                  <input
                    type="text"
                    placeholder="Password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    id="password"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="host">
                    Host name <span>*</span>
                  </label>
                  <input
                    type="text"
                    name="hostName"
                    id="host"
                    value={formData.hostName }
                    disabled
                  />
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="desc">Description</label>
                  <textarea name="description" id="desc" rows={6} value={formData.description} onChange={handleChange}/>
                </div>

                <div className={styles.line}></div>

                <div className={styles.formGroup}>
                  <label htmlFor="date&time">Date and time</label>
                  <div className={styles.dateTimeGroup}>
                    <input  name="date" type="date" value={formData.date} onChange={handleChange} />
                    <input  name='time' type="time" value={formData.time} onChange={handleChange}/>


                    <select name="amPm" id="AmPm" onChange={handleChange} value={formData.amPm}>
                      <option value="PM" defaultValue>
                        PM
                      </option>
                      <option value="AM">AM</option>
                    </select>

                    <select name="timeZone" id="timeZone" className={styles.timeStanndard} onChange={handleChange} value={formData.timeZone}   >
                      {timezones.map((tz, index) => (
                        <option key={index} value={tz}>
                          {tz}(UTC {moment.tz(tz).format('Z')})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="duration">Duration <span>*</span></label>
                  <select name="duration" id="duration" className={styles.duration} onChange={handleChange}  > 
                    {durationOptions.map((duration) => (
                      <option key={duration.value} value={duration.value}>
                        {duration.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className={styles.buttonSection}>
                  <Button
                    backgroundColor="#F3F3F1"
                    color="#000000"
                    type="button"
                    onClick={() => navigate('/layout')}
                  >
                    Cancel
                  </Button>
                  <Button
                    backgroundColor="#1877F2"
                    color="#FFFFFF"
                    type="button"
                    onClick={handleClickNext}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}

            {/* Second Step */}
            {isNext && 
              <div className={styles.secondSection}>
                 <h2>Banner</h2>
                 <div className={styles.bannerContainer}>
                 
                  <div className={styles.imgPreview} 
                       onClick={handleClick}
                       style={{backgroundColor:bgColor}}
                  >
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      style={{ display: "none" }} 
                      onChange={handleImageChange} 
                    /> 
                    {image ? (
                      <img 
                        src={image} 
                        alt="Preview" 
                        style={{ width: "50%", height: "50%", objectFit:"contain"}} 
                      />
                     
                    ) : (
                      <p style={{ color: "#aaa" }}>Click to upload image</p>
                    )
                    
                    }
                    <div className={styles.ovelayTextSection}>
                      <input type="text"
                            className={styles.overlayText} 
                            style={{border:'none',backgroundColor:bgColor}}  
                            placeholder='Enter Your Text' 
                            value={overlayText}
                            onClick={(e) => e.stopPropagation()}
                            onChange={(e) => setOverlayText(e.target.value)} 
                      />
                      <img src={editSvg} alt="" style={{color:'white'}}/>
                    </div>
                    
                  </div>
                  <p>custom background colors</p>
                  {colors.map((color, index) => (
                    <button
                      type='button' 
                      key={index} 
                      className={styles.selectColors} 
                      onClick={() => setBgColor(color)}
                      style={{backgroundColor:color}}
                    ></button>
                  ))}
                   <div className={styles.colorSelector}>
                      <input
                        type="color"
                        value={bgColor}
                        onChange={(e) => setBgColor(e.target.value)}
                        style={{ marginBottom: "20px",backgroundColor:bgColor }}
                      />
                      <div className={styles.colorSecetorDiv}>
                        {bgColor}
                      </div>
                    </div>
                 </div>
                 <div className={styles.line}></div>
                  <div className={styles.formGroup}>
                    <label htmlFor="link">
                      Add link <span>*</span>
                    </label>
                    <input
                      type="text"
                      placeholder='Enter URL Here'
                      name="link"
                      id="link"
                      value={formData.link}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="emails">
                      Add Emails <span>*</span>
                    </label>
                    <input
                      type="text"
                      placeholder='Add member Emails'
                      name="emails"
                      id="emails"
                      value={formData.emails}
                      onChange={handleChange}
                      required
                    />
                 </div>
                 <div className={styles.buttonSection}>
                  <Button
                    backgroundColor="#F3F3F1"
                    color="#000000"
                    type="button"
                    onClick={() => navigate('/layout')}
                  >
                    Cancel
                  </Button>
                  <Button
                    backgroundColor="#1877F2"
                    color="#FFFFFF"
                    type="button"
                    onClick={handleSubmit}
                  >
                    Save
                  </Button>
                </div>
              </div>

            }
          </form>


          </div>
        </div>
      </div>
    </div>
  );
};

export default AddEvent;
