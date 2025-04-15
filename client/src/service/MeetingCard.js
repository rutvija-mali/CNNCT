import axios from 'axios'
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
import { toast } from 'react-toastify';
import moment from 'moment-timezone';


export  const fetchMeeting = async(setFormData,setBgColor,setOverlayText,setFile,setImage,id)=>{ 
   try {
    const response =  await axios.get(`${API_BASE_URL}/api/meetings/${id}`)
      if(response.status === 200){
        const meetingData = response.data;

        setFormData((prevData) => ({
          ...prevData,
          ...meetingData,
          date: moment(meetingData.startTime).format('YYYY-MM-DD') || "",
          time: moment(meetingData.startTime).format('HH:mm') || "",
          duration:meetingData.duration,
          amPm: moment(meetingData.startTime).format('hh:mm A') || "",
          
        }));

        setBgColor(meetingData.bannerColor)
        setOverlayText(meetingData.bannerText)
        
        
  
        if (meetingData.bannerImg) {
          
          const imgUrl = `${API_BASE_URL}/${meetingData.bannerImg.replace(/\\/g, "/")}`
          console.log(imgUrl);
          setImage(imgUrl);
        }
        
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

  export const updatedMeeting = async(id,newFormData,setLoading,setFormData,setBgColor,setOverlayText,setFile,userName) =>{
    try {
        setLoading(true)
          const response = await axios.put(`${API_BASE_URL}/api/meetings/${id}`,newFormData)
          if(response.status === 200){
            toast.success('Meeting updated successfully!', {
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

  export const  saveMeeting =async(newFormData,setLoading,setFormData,setBgColor,setOverlayText,setFile,userName)=>{
        try {
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

  export const  deleteMeeting =async(id)=>{
    try {
      console.log("in service "+id);
      
        const response= await axios.delete(`${API_BASE_URL}/api/meetings/${id}`)
        if(response.status === 200){
          toast.success('Meeting deleted successfully!', {
            position: 'top-right',
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          }); 

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

export const fetchMeetings = async(userId,startTime,participantsStatus,setMeetings,hostId)=>{
  console.log("log in service "+startTime);
  
   try {
    const response = await axios.get(`${API_BASE_URL}/api/meetings/`,{
      params:{
        userId:userId,
        startTime:startTime,
        participantsStatus:participantsStatus,
        hostId:hostId

      }
    })

    if(response.status === 200){
      setMeetings(response.data)
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

export const fetchMeetingsForCalender = async(userId,setEvents,rangeStart,rangeEnd,searchQuery)=>{  
  console.log("fetch meeting is being called..........");
  console.log(`${API_BASE_URL}/api/meetings/`);
  
   try {
    const response = await axios.get(`${API_BASE_URL}/api/meetings/all/`,{
      params:{
        userId:userId,
        rangeStart:rangeStart,
        rangeEnd:rangeEnd,
        nameOfMeeting:searchQuery
        

      }
    })

    if(response.status === 200){
      setEvents(response.data)
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