import React, { useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import styles from "../styles/Calendar.module.css"; // Import CSS correctly

const localizer = momentLocalizer(moment); // ✅ Move this outside

const CalendarComponent = () => {
  const [events, setEvents] = useState([
    {
      title: "Meeting-2",
      start: new Date(2024, 6, 25, 10, 0),
      end: new Date(2024, 6, 25, 11, 0),
      color: "gray",
    },
    {
      title: "Meeting",
      start: new Date(2024, 6, 28, 9, 0),
      end: new Date(2024, 6, 28, 10, 0),
      color: "lightblue",
    },
    {
      title: "Meeting-2",
      start: new Date(2024, 6, 28, 14, 0),
      end: new Date(2024, 6, 28, 15, 0),
      color: "purple",
    },
  ]);

  const eventStyleGetter = (event) => ({
    style: {
      backgroundColor: event.color,
      color: "white",
      borderRadius: "8px",
      padding: "5px",
      border: "none",
    },
  });

  return (
    <div className={styles.calendarContainer}>    
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        defaultView="week"
        views={["day", "week", "month", "agenda"]}
        style={{ height: 600, margin: "20px" }}
        eventPropGetter={eventStyleGetter}
      />
    </div>
  );
};

export default CalendarComponent;
