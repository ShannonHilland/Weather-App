function dateAndTime() {
  let now = new Date();
  let weekday = document.querySelector("#weekday");
  let month = document.querySelector("#month");
  let date = document.querySelector("#date");
  let year = document.querySelector("#year");
  let time = document.querySelector("#time");
  let weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  weekday.innerHTML = weekdays[now.getDay()];
  let months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  month.innerHTML = months[now.getMonth()];
  date.innerHTML = `${now.getDate()},`;
  year.innerHTML = now.getFullYear();
  let hours = now.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = now.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  time.innerHTML = `${hours}:${minutes}`;
}
dateAndTime();

function defaultDisplay() {
  let apiURL =
    "https://api.openweathermap.org/data/2.5/weather?q=Saskatoon&appid=cf6b50b908fa2e0baca3eed8a569a5f6&units=metric";
  axios.get(apiURL).then(changeTemp);
  axios.get(apiURL).then(searchedCity);
  axios.get(apiURL).then(iconDisplay);
  document.getElementById("fahrenheit-button").style.color = "gray";
}
defaultDisplay();

function iconDisplay(response) {
  let currentWeatherIcon = document.querySelector("#current-weather-icon");
  let currentIconNumber = response.data.weather[0].icon;
  currentWeatherIcon.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
}
function formatForecastDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[day];
}
function displayForecast(response) {
  let forecast = response.data.daily;
  let forecastElement = document.querySelector("#forecast");
  let forecastHTML = `<div class="row">`;
  forecast.forEach(function (forecastDay, index) {
    if (index < 5) {
      forecastHTML =
        forecastHTML +
        `
  <div class="col">
      <h3 class="card-title" class="day">${formatForecastDay(
        forecastDay.dt
      )}</h3>
         <div class="card-highs">
         <span class="forecast-high">${Math.round(
           forecastDay.temp.max
         )}° </span>
         <span class="forecast-low"> ${Math.round(forecastDay.temp.min)}°</span>
         </div>
      <img class="forecast-icon" src="http://openweathermap.org/img/wn/${
        forecastDay.weather[0].icon
      }@2x.png" width=60px>
      <div class="card-text" id="forecast-dsc">${
        forecastDay.weather[0].description
      }</div>
   </div>
  `;
    }
  });
  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}
function forecastcoords(response) {
  let lon = response.data.coord.lon;
  let lat = response.data.coord.lat;
  let unit = "metric";
  let apiKey = "b400ae3b711a616262d18b0ca2cbe78f";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${unit}`;
  axios.get(apiUrl).then(displayForecast);
}
function changeTemp(response) {
  let temperature = Math.round(response.data.main.temp);
  celsiusTemperature = response.data.main.temp;
  perceivedCelsiusTemperature = response.data.main.feels_like;
  let tempShown = document.querySelector("#current-temp");
  tempShown.innerHTML = temperature;

  forecastcoords(response);
}

function searchedCity(response) {
  let city = document.querySelector("h1");
  let newCity = response.data.name;
  let countryName = response.data.sys.country;
  city.innerHTML = `${newCity}, ${countryName}`;
  let weatherDescription = document.querySelector("#current-weather-dsc");
  let cityWeatherDescription = response.data.weather[0].description;
  weatherDescription.innerHTML = cityWeatherDescription;
  let feelsLike = document.querySelector("#feels-like");
  let cityFeelsLike = Math.round(response.data.main.feels_like);
  feelsLike.innerHTML = `Feels Like: ${cityFeelsLike}°`;
  let wind = document.querySelector("#wind");
  let cityWind = Math.round(response.data.wind.speed);
  wind.innerHTML = `Wind: ${Math.round(cityWind * 3.6)} km/h`;
  let humidity = document.querySelector("#humidity");
  let cityHumidity = response.data.main.humidity;
  humidity.innerHTML = `Humidity: ${cityHumidity}%`;
}

function changeCity(event) {
  event.preventDefault();
  let newCity = document.querySelector("#search-bar");
  let apiKey = "cf6b50b908fa2e0baca3eed8a569a5f6";
  let units = "metric";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${newCity.value}&appid=${apiKey}&units=${units}`;
  axios.get(apiUrl).then(changeTemp);
  axios.get(apiUrl).then(searchedCity);
  axios.get(apiUrl).then(iconDisplay);
}

let form = document.querySelector("form");
form.addEventListener("submit", changeCity);

function changeToCelsius(event) {
  event.preventDefault();
  let currentTemp = document.querySelector("#current-temp");
  currentTemp.innerHTML = Math.round(celsiusTemperature);
  let feelsLike = document.querySelector("#feels-like");
  feelsLike.innerHTML = `Feels Like: ${Math.round(
    perceivedCelsiusTemperature
  )} °`;
  document.getElementById("fahrenheit-button").style.color = "gray";
  document.getElementById("celsius-button").style.color = "black";
  let newCity = document.getElementById("city-name").innerHTML;
  let apiKey = "cf6b50b908fa2e0baca3eed8a569a5f6";
  let units = "metric";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${newCity}&appid=${apiKey}&units=${units}`;
  axios.get(apiUrl).then(forecastcoords);
}
let celsiusButton = document.querySelector("#celsius-button");
celsiusButton.addEventListener("click", changeToCelsius);

function changeToFahrenheit(event) {
  event.preventDefault();
  let currentTemp = document.querySelector("#current-temp");
  let farhenheitTemperature = Math.round((celsiusTemperature * 9) / 5 + 32);
  currentTemp.innerHTML = farhenheitTemperature;
  let feelsLike = document.querySelector("#feels-like");
  feelsLike.innerHTML = `Feels Like: ${Math.round(
    (perceivedCelsiusTemperature * 9) / 5 + 32
  )} °`;
  document.getElementById("fahrenheit-button").style.color = "black";
  document.getElementById("celsius-button").style.color = "gray";

  let newCity = document.getElementById("city-name").innerHTML;
  let apiKey = "cf6b50b908fa2e0baca3eed8a569a5f6";
  let units = "imperial";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${newCity}&appid=${apiKey}&units=${units}`;
  axios.get(apiUrl).then(forecastcoordsImperial);
}
let fahrenheitButton = document.querySelector("#fahrenheit-button");
fahrenheitButton.addEventListener("click", changeToFahrenheit);

let celsiusTemperature = null;
let perceivedCelsiusTemperature = null;

function currentLocationDetails(response) {
  let city = document.querySelector("h1");
  let cityName = response.data.name;
  let countryName = response.data.sys.country;
  city.innerHTML = `${cityName}, ${countryName}`;
  let weatherDescription = document.querySelector("#current-weather-dsc");
  let cityWeatherDescription = response.data.weather[0].description;
  weatherDescription.innerHTML = cityWeatherDescription;
  let feelsLike = document.querySelector("#feels-like");
  let cityFeelsLike = Math.round(response.data.main.feels_like);
  feelsLike.innerHTML = `Feels Like: ${cityFeelsLike}°`;
  let wind = document.querySelector("#wind");
  let cityWind = Math.round(response.data.wind.speed);
  wind.innerHTML = `Wind: ${Math.round(cityWind * 3.6)} km/h`;
  let humidity = document.querySelector("#humidity");
  let cityHumidity = response.data.main.humidity;
  humidity.innerHTML = `Humidity: ${cityHumidity}%`;
}

function showCurrentPosition(position) {
  let lat = position.coords.latitude;
  let lon = position.coords.longitude;
  let apiKey = "cf6b50b908fa2e0baca3eed8a569a5f6";
  let units = "metric";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${units}`;
  axios.get(apiUrl).then(changeTemp);
  axios.get(apiUrl).then(currentLocationDetails);
  axios.get(apiUrl).then(iconDisplay);
}

function currentLocation(event) {
  event.preventDefault();
  navigator.geolocation.getCurrentPosition(showCurrentPosition);
}

let currentLocationIcon = document.querySelector("#current-location-icon");
currentLocationIcon.addEventListener("click", currentLocation);

function displayForecastImperial(response) {
  let forecast = response.data.daily;
  let forecastElement = document.querySelector("#forecast");
  let forecastHTML = `<div class="row">`;
  forecast.forEach(function (forecastDay, index) {
    if (index < 5) {
      forecastHTML =
        forecastHTML +
        `
  <div class="col">
      <h3 class="card-title" class="day">${formatForecastDay(
        forecastDay.dt
      )}</h3>
         <div class="card-highs">
         <span class="forecast-high">${Math.round(
           forecastDay.temp.max
         )}° </span>
         <span class="forecast-low"> ${Math.round(forecastDay.temp.min)}°</span>
         </div>
      <img class="forecast-icon" src="http://openweathermap.org/img/wn/${
        forecastDay.weather[0].icon
      }@2x.png" width=60px>
      <div class="card-text" id="forecast-dsc">${
        forecastDay.weather[0].description
      }</div>
   </div>
  `;
    }
  });
  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}
function forecastcoordsImperial(response) {
  let lon = response.data.coord.lon;
  let lat = response.data.coord.lat;
  let unit = "imperial";
  let apiKey = "b400ae3b711a616262d18b0ca2cbe78f";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${unit}`;
  axios.get(apiUrl).then(displayForecastImperial);
}
