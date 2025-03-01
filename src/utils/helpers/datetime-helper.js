function compareTime (timeString1, timeString2){
    let date1 = new Date(timeString1);
    let date2 = new Date(timeString2);
    return date1.getTime() >= date2.getTime();
}

function getFormattedTime(date = new Date()) {
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Months are 0-based
    const day = String(date.getUTCDate()).padStart(2, '0');
    const hours = String(date.getUTCHours()).padStart(2, '0');
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');
    const seconds = String(date.getUTCSeconds()).padStart(2, '0');
  
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

module.exports = {
    compareTime,
    getFormattedTime,
}