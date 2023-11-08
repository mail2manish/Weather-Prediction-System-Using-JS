
const temp = document.getElementById("temp"),
    currentLocation = document.getElementById("location"),
    condition = document.getElementById("condition"),
    rain = document.getElementById("rain"),
    mainIcon = document.getElementById("icon"),
    uvIndex = document.querySelector(".uv-index"),
    uvText = document.querySelector(".uv-text"),
    windSpeed = document.querySelector(".wind-speed"),
    sunRise = document.querySelector(".sun-rise"),
    sunSet = document.querySelector(".sun-set"),
    humidity = document.querySelector(".humidity"),
    visibility = document.querySelector(".visibility"),
    humidityStatus = document.querySelector(".humidity-status"),
    airQuality = document.querySelector(".air-quality"),
    airQualityStatus = document.querySelector(".air-quality-status"),
    visibilityStatus = document.querySelector(".visibility-status"),
    weatherCards = document.querySelector("#weather-cards"),
    celciusBtn = document.querySelector(".celcius"),
    fahrenheitBtn = document.querySelector(".fahrenheit"),
    hourlyBtn = document.querySelector(".hourly"),
    weekBtn = document.querySelector(".week"),
    tempUnit = document.querySelectorAll(".temp-unit"),
    searchForm = document.querySelector("#search");
    search = document.querySelector("#query");


let currentCity = "";
let currentUnit = "c";
let hourlyorWeek = "Week";


//manish mad the changes
searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let location = search.value; 
    console.log(location);
    if (location) {
       
      const requestData = {
        query: location,
        unit: currentUnit,
          hourlyorWeek: hourlyorWeek,
         
      };
        console.log(location);
      fetch("/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          },
          
          body: JSON.stringify(requestData),
          
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error("City not found");
          }
        })
        .then((dataFromServer) => {
          console.log("Fetched weather data:", dataFromServer);
          printData(dataFromServer);
        })
        .catch((err) => {
          alert("City is not found");
        });
    }
  });
  

  





function printData(dataFromServer) {
    let today = dataFromServer.currentConditions;

   
    if (currentUnit === "c") {
      temp.innerText = today.temp;
    } else {
      // Corrected the assignment operator from '==' to '='
      temp.innerText = celciusToFahrenheit(today.temp);
    }
    currentLocation.innerText = dataFromServer.resolvedAddress;
    condition.innerText = today.conditions;
    rain.innerText = "Perc - " + today.precip + "%";
    uvIndex.innerText = today.uvindex;
    windSpeed.innerText = today.windspeed;
    humidity.innerText = today.humidity + "%";
    visibility.innerText = today.visibility;
    airQuality.innerText = today.winddir;
    measureUvIndex(today.uvindex);
    updateHumidityStatus(today.humidity);
    updatVisibilityStatus(today.visibility);
    updateAirQualityStatus(today.winddir);
    sunRise.innerText = convertTimeTo12HourFormat(today.sunrise);
    sunSet.innerText = convertTimeTo12HourFormat(today.sunset);
    mainIcon.src = getIcon(today.icon);
    changeBackground(today.icon);
    if (hourlyorWeek === "hourly") {
      updateForecast(dataFromServer.days[0].hours, currentUnit, "day");
    } else {
      updateForecast(dataFromServer.days, currentUnit, "week");
    }
}
  

  //convert c to f

  function celciusToFahrenheit(temperature) {
    return ((temperature * 9) / 5 + 32).toFixed(1);
}


//uv index
function measureUvIndex(uvIndex){
    if(uvIndex <= 2){
        uvText.innerText = "Low";
    }else if(uvIndex <= 5){
        uvText.innerText = "Moderate";
    }else if(uvIndex <= 7){
        uvText.innerText = "High";
    }else if(uvIndex <= 10){
        uvText.innerText = "Very High";
    }else{
        uvText.innerText = "Extreme";
    }
}


// Humidity Status
function updateHumidityStatus(humidity){
    if(humidity <= 30){
        humidityStatus.innerHTML = "Low";
    }else if(humidity <= 60){
        humidityStatus.innerHTML = "Moderate";
    }else{
        humidityStatus.innerHTML = "High";
    }
}

//Visibility Status
function updatVisibilityStatus(visibility){
    if(visibility <= 0.3){
        visibilityStatus.innerText = "Dense Fog";
    }else if(visibility <= 0.16){
        visibilityStatus.innerText = "Moderate Fog";
    }else if(visibility <= 0.35){
        visibilityStatus.innerText = "Light Fog";
    }else if(visibility <= 1.13){
        visibilityStatus.innerText = "Very Light Fog";
    }else if(visibility <= 2.16){
        visibilityStatus.innerText = "Light Mist";
    }else if(visibility <= 5.4){
        visibilityStatus.innerText = "Very Light Mist";
    }else if(visibility <= 10.8){
        visibilityStatus.innerText = "Clear Air";
    }else{
        visibilityStatus.innerText = "Very Clear Air"; 
    }
}



//Air Quality Status
function updateAirQualityStatus(airQuality){
    if(airQuality <= 50){
        airQualityStatus.innerText = "Good";
    }else if(airQuality <= 100){
        airQualityStatus.innerText = "Moderate";
    }else if(airQuality <= 150){
        airQualityStatus.innerText = "Unhealthy for Sensitive Groups";
    }else if(airQuality <= 200){
        airQualityStatus.innerText = "Unhealthy";
    }else if(airQuality <= 250){
        airQualityStatus.innerText = "Very Unhealthy";
    }else{
        airQuality.innerText = "Hazardous";
    }
}



function convertTimeTo12HourFormat(time){
    let hour = time.split(":")[0];
    let minute = time.split(":")[1];
    let ampm = hour >= 12 ? "pm" : "am";
    hour = hour & 12;
    hour = hour ? hour : 12;
    hour = hour < 10 ? "0" + hour : hour;
    minute = minute < 10 ? "0" + minute : minute;
    let strTime = hour + ":" + minute + ":" + ampm;
    return strTime;
}

//change icon as per weather
function getIcon(condition){
    if(condition === "Partly-cloudy-day"){
        return "icons/cloudy.png";
    }else if(condition === "partly-cloudy-night"){
        return "icons/cloudy-night.png";
    }else if(condition === "rain"){
        return "icons/rain.png";
    }else if(condition === "clear-day"){
        return "icons/clear-day.png";
    }else if(condition === "clear-night"){
        return "icons/night.png";
    }else{
        return "icons/sun.png";
    }
}

function getDayName(date){
    let day = new Date(date);
    let days = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
    ];
    return days[day.getDay()];
}

function getHour(time){
    let hour = time.split(":")[0];
    let min = time.split(":")[1];
    if(hour > 12){
        hour = hour - 12;
        return `${hour}:${min} PM`;
    } else{
        return `${hour}:${min} AM`;
    }
}


function updateForecast(data, unit, type){
    weatherCards.innerHTML = "";

    let day = 0;
    let numCards = 0;
    // number of cards 24 for hourly and 7 for weekly
    if(type === "day"){
        numCards = 14;
    } else{
        numCards = 7;
    }
    for(let i = 0; i < numCards; i++){
        let card = document.createElement("div");
        card.classList.add("card");
        let dayName = getHour(data[day].datetime);
        if(type === "week"){
            dayName = getDayName(data[day].datetime);;
        }
        let dayTemp = data[day].temp;
        if(unit === "f"){
            dayTemp = celciusToFahrenheit(data[day].temp);
        }
        let iconCondition = data[day].icon;
        let iconSrc = getIcon(iconCondition);
        let tempUnit = "°C";
        if(unit === "f"){
            tempUnit = "°F";
        }
        card.innerHTML = `
        
        <h2 class="day-name">${dayName}</h2>
            <div class="card-icon">
              <img src="${iconSrc}" alt="">
            </div>
            <div class="day-temp">
              <h2 class="temp">${dayTemp}</h2>
              <span class="temp-unit">${tempUnit}</span>
              </div>
        
        `;
        weatherCards.appendChild(card);
        day++;
    }
}


//change icon as per weather
function changeBackground(condition) {
    const body = document.querySelector("body");
    let bg = "";

    switch (condition) {
        case "Partly-cloudy-day":
            bg = "images/partly-cloudy-day.jpeg";
            break;
        case "partly-cloudy-night":
            bg = "images/partly-cloudy-night.jpeg";
            break;
        case "rain":
            bg = "images/rain.jpeg";
            break;
        case "clear-day":
            bg = "images/clear-day.jpg";
            break;
        case "clear-night":
            bg = "images/clear-night.jpeg";
            break;
        default:
            bg = "images/1.png"; // Set default background image here
            break;
    }

    body.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${bg})`;
}



fahrenheitBtn.addEventListener("click", () => {
    console.log("you just clicked F");
    changeUnit("f");
});

celciusBtn.addEventListener("click", () => {
    console.log("you just clicked C");
    changeUnit("c");
});



hourlyBtn.addEventListener("click", () => {

    changeTimeSpan("hourly");
});

weekBtn.addEventListener("click", () =>{
    changeTimeSpan("week");
});


//new one 
function changeTimeSpan(unit, dataFromServer) {
    hourlyorWeek = unit;
    hourlyBtn.classList.toggle("active", unit === "hourly");
    weekBtn.classList.toggle("active", unit === "week");
  
    if (unit === "hourly" && dataFromServer && dataFromServer.days && dataFromServer.days[0] && dataFromServer.days[0].hours) {
      updateForecast(dataFromServer.days[0].hours, currentUnit, "day");
    } else if (unit === "week" && dataFromServer && dataFromServer.days) {
      updateForecast(dataFromServer.days, currentUnit, "week");
    }
  }
  



// //new one 
function changeUnit(unit) {
    if (currentUnit != unit) {
        console.log("what is current unit:", currentUnit);
        console.log("what is unit that is passed to the function :", unit);
      currentUnit = unit;
      
      // Update the temperature unit for all elements with the class "temp-unit"
      const updatedTempUnit = `°${unit.toUpperCase()}`;
      tempUnit.forEach((elem) => {
        elem.innerText = updatedTempUnit;
      });
  
      // Update the button styles based on the selected unit
      if (unit === "c") {
        celciusBtn.classList.add("active");
        fahrenheitBtn.classList.remove("active");
      } else {
        celciusBtn.classList.remove("active");
        fahrenheitBtn.classList.add("active");
        }
        // printData(dataFromServer);
    }
  }
  

  



















