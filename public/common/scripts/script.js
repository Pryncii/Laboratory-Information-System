function startTime() {
  const today = new Date();

  let h = today.getHours();
  let m = today.getMinutes();
  let s = today.getSeconds();

  let ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12;
  h = h ? h : 12;
  
  h = checkTime(h);
  m = checkTime(m);
  s = checkTime(s);

  let day = today.getDate();
  let month = today.getMonth() + 1;
  let year = today.getFullYear();
  let weekday = today.getDay();

  day = checkTime(day);
  month = checkTime(month);

  const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const formattedDateTime = weekdays[weekday] + ", " + day + "/" + month + "/" + year + " " + h + ":" + m + ":" + s + " " + ampm;
  document.getElementById('time').innerHTML = formattedDateTime;
  
  setTimeout(startTime, 1000);
}

function checkTime(i) {
  if (i < 10) {i = "0" + i};  // add zero in front of numbers < 10
  return i;
}