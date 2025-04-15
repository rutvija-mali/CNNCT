import React, { useState, useEffect } from 'react'
import moment from 'moment'
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import styles from '../styles/Year.module.css'

const localizer = momentLocalizer(moment)

const navigate = {
  PREVIOUS: 'PREV',
  NEXT: 'NEXT',
  TODAY: 'TODAY',
  DATE: 'DATE',
}
function createCalendar({currentDate}) {
    currentDate = currentDate ? moment(currentDate) : moment();
  
    const startOfMonth = currentDate.clone().startOf("month");
    const endOfMonth = currentDate.clone().endOf("month");
  
    const startDate = startOfMonth.clone().startOf("week"); 
    const endDate = endOfMonth.clone().endOf("week"); 
  
    const calendar = [];
    let date = startDate.clone();
  
    while (date.isBefore(endDate)) {
      const week = [];
  
      for (let i = 0; i < 7; i++) {
        week.push(date.clone());
        date.add(1, "day");
      }
  
      calendar.push(week);
    }
  
    calendar.currentDate = currentDate;
    return calendar;
  }
  

function CalendarDate({ dateToRender, dateOfMonth, onClick ,events = []}) {
  const isToday =
    dateToRender.format('YYYY-MM-DD') === moment().format('YYYY-MM-DD')

  const todayClass = isToday ? styles.today : ''
  const eventForDate = events.filter(event =>
    moment(event.start).isSame(dateToRender, 'day')
  )

  const hasEvents = eventForDate.length > 0

  if (dateToRender.month() < dateOfMonth.month()) {
    return (
      <button disabled className={`${styles.date} ${styles.prevMonth} `}>
        {dateToRender.date()}
        {hasEvents && <div className={styles.eventDot}></div>}
      </button>
    )
  }
  

  if (dateToRender.month() > dateOfMonth.month()) {
    return (
      <button disabled className={`${styles.date} ${styles.nextMonth}`}>
        {dateToRender.date()}
        {hasEvents && <div className={styles.eventDot}></div>}
      </button>
    )
  }

  return (
    <button
      className={`${styles.date} ${styles.inMonth} ${todayClass}`}
      onClick={() => onClick(dateToRender)}
    >
      {dateToRender.date()}
      {hasEvents && <div className={styles.eventDot}></div>}
    </button>
  )
}

const MonthGrid= ({ date, events = [] }) => {
  const [calendar, setCalendar] = useState(null)
  console.log("Events received in Year view:", events);

  useEffect(() => {
    setCalendar(createCalendar({ currentDate: date, events }))
  }, [date, events])

  if (!calendar) return null

  return (
    <div className={styles.month}>
      <div className={styles.monthName}>
        {calendar.currentDate.format('MMMM').toUpperCase()}
      </div>
      {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
        <span key={index} className={styles.day}>
          {day}
        </span>
      ))}
      {calendar.map((week, index) => (
        <div key={index}>
          {week.map(date => (
            <CalendarDate
              key={date.format('YYYY-MM-DD')}
              dateToRender={date}
              dateOfMonth={calendar.currentDate}
         
              onClick={clickedDate =>
                alert(`Will go to daily-view of ${clickedDate.format('YYYY-MM-DD')}`)
              }
              events={events} 
            />
          ))}
        </div>
      ))}
    </div>
  )
}


const Year = ({ date, events = [] }) => {
  const months = []
  const firstMonth = moment(date).startOf('year')

  for (let i = 0; i < 12; i++) {
    const monthDate = moment(firstMonth).add(i, 'months')

    const eventsInMonth = events.filter(event =>
      moment(event.start).isSame(monthDate, 'month')
    )

    months.push(
      <MonthGrid key={i} date={monthDate} events={eventsInMonth} />
    )
  }

  return <div className={styles.year}>{months}</div>
}

Year.range = date => {
  return [moment(date).startOf('year')]
}

Year.navigate = (date, action) => {
  switch (action) {
    case navigate.PREVIOUS:
      return moment(date).subtract(1, 'year')
    case navigate.NEXT:
      return moment(date).add(1, 'year')
    default:
      return moment(date)
  }
}

Year.title = (date, { localizer }) => localizer.format(date, 'YYYY')

export default Year

