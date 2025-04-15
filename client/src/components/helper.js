 export    function formatDuration(minutes) {
    if (minutes < 60) {
        return `${minutes} min`; 
    } else {
        const hours = (minutes / 60).toFixed(1); 
        return `${hours} hr`; 
    }
}

export const getWeekRange = (date = new Date())=>{
 
    const currentDate = new Date(date);
    const dayOfWeek = currentDate.getDay()
    console.log("day of week "+dayOfWeek );
    
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(currentDate.getDate()-dayOfWeek)
    startOfWeek.setHours(0,0,0,0)

    const endOfWeek = new Date(startOfWeek)
    endOfWeek.setDate(startOfWeek.getDate() + 6)
    endOfWeek.setHours(23, 59, 59, 999);
    
    return {
        rangeStart: startOfWeek.toISOString(),
        rangeEnd: endOfWeek.toISOString()
      };
}

export const getMonthRange = (date = new Date())=>{
    const currentDate = new Date(date);

    const startOfMonth = new Date(currentDate.getFullYear(),currentDate.getMonth(),1)
    startOfMonth.setHours(0,0,0,0)

    const endOfMonth = new Date(currentDate.getFullYear(),currentDate.getMonth()+1,0)
    endOfMonth.setHours(23,59,59,999)

    return {
        rangeStart: startOfMonth.toISOString(),
        rangeEnd: endOfMonth.toISOString()
      };
}

export const getYearRange = (date = new Date()) => {
    const currentDate = new Date(date);
  
    const startOfYear = new Date(currentDate.getFullYear(), 0, 1);
    startOfYear.setHours(0, 0, 0, 0);
  
    const endOfYear = new Date(currentDate.getFullYear(), 11, 31);
    endOfYear.setHours(23, 59, 59, 999);
  
    return {
      rangeStart: startOfYear.toISOString(),
      rangeEnd: endOfYear.toISOString()
    };
  };
  