function formatDate(time) {
  let current = new Date(time * 1000);
  let currentDay = current.getDay();
  let weekdays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let hour = current.getHours();
  if (hour <= 9) {
    hour = "0" + hour;
  }
  let minutes = current.getMinutes();
  if (minutes <= 9) {
    minutes = "0" + minutes;
  }

  return `${weekdays[currentDay]} ${hour}:${minutes}`;
}

function searchCity(cityValue) {
  let apiKey = `1ba7253fcfa69a274oe0449641943et5`;
  let apiUrl = `https://api.shecodes.io/weather/v1/current?query=${cityValue}&key=${apiKey}&units=metric`;
  axios.get(apiUrl).then(showTemp);
}

function handleSubmit(event) {
  event.preventDefault();
  let cityValue = document.querySelector(".city-value").value;
  searchCity(cityValue);
}

function getCoordinate(coordinate) {
  let lat = coordinate.latitude;
  let lon = coordinate.longitude;
  let apiKey = `1ba7253fcfa69a274oe0449641943et5`;
  let apiUrl = `https://api.shecodes.io/weather/v1/forecast?lon=${lon}&lat=${lat}&key=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayforecast);
  console.log(apiUrl);
}

function forecastFormatDay(timestamp) {
  let forecastdate = new Date(timestamp * 1000);
  let forecastDay = forecastdate.getDay();
  let forecastWeekDay = ["Sun", "Mon", "Thu", "Wed", "Thu", "Fri", "Sat"];
  return forecastWeekDay[forecastDay];
}

function displayforecast(response) {
  let forecast = response.data.daily;
  console.log(forecast);

  let forecastElement = document.querySelector("#forecast");
  let forecastHtml = `<div class="row">`;
  forecast.forEach((forecast) => {
    forecastHtml =
      forecastHtml +
      `<div class="forecast-date col" >
          <div class="day">${forecastFormatDay(forecast.time)}</div>
          <img class="forecast-icon" width= "80px" src="http://shecodes-assets.s3.amazonaws.com/api/weather/icons/${
            forecast.condition.icon
          }.png ">
          <div class="forecast-max-min">
            <span class="forecast-min">${Math.round(
              forecast.temperature.minimum
            )}°</span><span class="forecast-max">${Math.round(
        forecast.temperature.maximum
      )}°</span>
          </div>
        </div>`;
  });
  forecastHtml = forecastHtml + `</div>`;
  forecastElement.innerHTML = forecastHtml;
}

function showCurrentPosition() {
  navigator.geolocation.getCurrentPosition(showPosition);
  function showPosition(position) {
    let lat = position.coords.latitude;
    let lon = position.coords.longitude;
    let apiCurrentKey = `1ba7253fcfa69a274oe0449641943et5`;
    let apiCurrentUrl = `https://api.shecodes.io/weather/v1/current?lon=${lon}&lat=${lat}&key=${apiCurrentKey}&units=metric`;
    axios.get(apiCurrentUrl).then(showTemp);
  }
}

function showTemp(response) {
  console.log(response.data);
  let cityName = document.querySelector(".city-name");
  cityName.innerHTML = response.data.city;
  let countryName = document.querySelector(".country-name");
  countryName.innerHTML = response.data.country;
  let dayTime = document.querySelector(".day-time");
  dayTime.innerHTML = formatDate(response.data.time);
  let weatherDescription = document.querySelector(".wheather-description");
  weatherDescription.innerHTML = response.data.condition.description;
  let cityTemp = document.querySelector("h1");
  celsiusTemp = response.data.temperature.current;
  cityTemp.innerHTML = Math.round(celsiusTemp);
  let currentTempIcon = document.querySelector("#current-temp-icon");
  currentTempIcon.setAttribute(
    "src",
    `http://shecodes-assets.s3.amazonaws.com/api/weather/icons/${response.data.condition.icon}.png`
  );
  let feelsLike = document.querySelector("#feels-like");
  feelsLike.innerHTML = `${Math.round(
    response.data.temperature.feels_like
  )} °C`;
  let humidity = document.querySelector("#humidity");
  humidity.innerHTML = `${Math.round(response.data.temperature.humidity)}%`;
  let wind = document.querySelector("#wind");
  wind.innerHTML = `${Math.round(response.data.wind.speed)} km/h`;

  getCoordinate(response.data.coordinates);
}

let submitButton = document.querySelector(".search-box");
submitButton.addEventListener("submit", handleSubmit);

let currentBtn = document.querySelector("#current-btn");
currentBtn.addEventListener("click", showCurrentPosition);

searchCity("paris");
