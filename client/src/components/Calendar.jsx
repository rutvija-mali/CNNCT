import React, { useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import styles from "../styles/Calendar.module.css";
import { MdOutlineArrowForwardIos } from "react-icons/md";
import { MdArrowBackIos } from "react-icons/md";
import { FaSearch } from "react-icons/fa";
import {useScreenSize} from '../context/ScreenSizeProvider'
import {fetchMeetingsForCalender} from '../service/MeetingCard'
import { getMonthRange, getWeekRange, getYearRange } from "./helper";
import {useAuth} from '../context/AuthProvider'
import Year from "./Year";

const localizer = momentLocalizer(moment); 

const CustomToolbar = ({ label, onView, views, view, onNavigate }) => {
  const {isMobile} = useScreenSize()
  return (
    <div className={styles.toolBarContainer}>
   
      { !isMobile && <div className={styles.PrevBtn}>
        <button onClick={() => onNavigate('PREV')} className={styles.prevBtn}> <MdArrowBackIos/></button>
        <button onClick={() => onNavigate('TODAY')} className={styles.day}>Today</button>
        <button onClick={() => onNavigate('NEXT')} className={styles.nextBtn}><MdOutlineArrowForwardIos/></button>
      </div>}
      <div className={styles.label}>
        {label}
      </div>

     {!isMobile && <div className={styles.viewBtnContainer}>
        {views.map((v) => (
          <button
            key={v}
            onClick={() => onView(v)}
            className={styles.viewBtns}
            style={{ backgroundColor: v === view ? '#007bff' : 'transparent',
              color:v=== view?'#FFF':'#71717A'
            }}
          >
            {v}
          </button>
        ))}
      </div>}

     { !isMobile && <div className={styles.searchbarContainer}>
        <input type="text" placeholder="Search" className={styles.searchbar} />
        <span className={styles.icon}><FaSearch /></span>
      </div>}
    </div>
  );
};

const CustomDateHeader = ({ label, date }) => {
  const isToday = moment(date).isSame(new Date(), 'day');

  return (
    <div
      className={`${styles.customDateHeader} ${isToday ? styles.today : ""}`}
    >
      <div className={styles.day}>{moment(date).format("ddd").toUpperCase()}</div>
      <div className={styles.date}>{moment(date).format("D")}</div>
    </div>
  );
};

const CalendarComponent = () => {
  const [view, setView] = useState("week"); 
  const [currentDate, setCurrentDate] = useState(new Date());
  const {isMobile} = useScreenSize()
  const [meetings,setMeetings] = useState([])
  const [events, setEvents] = useState();
  const {user} = useAuth()
  let rangeStart = currentDate;
  let rangeEnd = currentDate;

  if (view === 'week') {
    ({ rangeStart, rangeEnd } = getWeekRange(currentDate));
  }else if( view === 'month'){
    ({ rangeStart, rangeEnd } = getMonthRange(currentDate));
  }else if(view === 'year'){
    ({ rangeStart, rangeEnd } = getYearRange(currentDate));
  }

  useEffect(()=>{
    if(user){
      fetchMeetingsForCalender(user.id,setMeetings,rangeStart,rangeEnd,null)
    }
  },[view,currentDate,user])

  useEffect(() => {
    const transformed = meetings.map(meeting => ({
      title: meeting.topic|| 'Untitled',
      start: new Date(meeting.startTime),
      end: new Date(new Date(meeting.startTime).getTime() + meeting.duration * 60000),
      allDay: false,
      color: meeting.bannerColor || '#1877F2/50'
    }));
    setEvents(transformed);
  }, [meetings]);

  
  const eventStyleGetter = (event) => ({
    style: {
      backgroundColor: event.color || '#1877F2',
      color: "white",
      borderRadius: "8px",
      padding: "5px",
      border: "none",
    },
  });

  return (
    <div className={styles.mainContainer}>
     {!isMobile && <div className={styles.headerContainer}>
        <div className={styles.header}>
          <h3>Activity</h3>
        </div>
        <div className={styles.header}>
          <h3>Time Zone</h3>
          <p>{user?user.timeZone:''}</p>
        </div>
      </div>}
      <div>
        <div className={styles.calendarContainer}>    
          <Calendar
            localizer={localizer}
            events={events}
            view={view} 
            date={currentDate}
            onNavigate={(date)=>setCurrentDate(date)}
            onView={(newView) => setView(newView)} 
            startAccessor="start"
            endAccessor="end"
              views={{ 
              day: true, 
              week: true, 
              month: true, 
              year:Year 
            }}
            defaultView="week"
            components={{
              toolbar:CustomToolbar,
              week: {
                header: CustomDateHeader
              
              },
              
            }}
            messages={{Year:'year'}}
            showAllDayEvents={false} 
            style={{ height: 600, margin: "20px" }}
            eventPropGetter={eventStyleGetter}
          />
        </div>
    
      </div>
    </div>
   
  );
};

export default CalendarComponent;
