function formatDate(date) {
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  let day = days[now.getDay()];

  let hours = now.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }

  let minutes = now.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  return `${day} ${hours}:${minutes}`;
}

function formatDay(timestamp) {
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
            <div class="fcst">
              <div class="fcst-date">${formatDay(forecastDay.dt)}</div>
              <img
                src="https://openweathermap.org/img/wn/${
                  forecastDay.weather[0].icon
                }@2x.png"
                alt=""
                width="42"
              />
              <div class="fcst-temp">
                <span class="fcst-temp-min">${Math.round(
                  forecastDay.temp.min
                )}°</span>
                <span class="fcst-temp-slash">|</span>
                <span class="fcst-temp-max">${Math.round(
                  forecastDay.temp.max
                )}°</span>
              </div>
            </div>
          </div>
      `;
    }
  });

  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

function getForecast(coordinates) {
  console.log(coordinates);

  let apiEndpoint = "https://api.openweathermap.org/data/2.5/onecall";
  let unit = "metric";
  let apiKey = "cb286bad3607984b41ed10c8de5cf00e";
  let apiUrl = `${apiEndpoint}?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=${unit}`;

  axios.get(apiUrl).then(displayForecast);
}

function displayTemperature(response) {
  document.querySelector("#city-name").innerHTML = response.data.name;
  document.querySelector(".current-temperature-digit").innerHTML = Math.round(
    response.data.main.temp
  );
  document.querySelector(".weather-type").innerHTML =
    response.data.weather[0].description;

  getForecast(response.data.coord);
}

function displayQuote(response) {
  let temperature = Math.round(response.data.main.temp);
  let weatherQuote = document.querySelector(".quote");

  if (temperature > 28) {
    weatherQuote.innerHTML = `“Never kick a fresh turd on a hot day.” - Harry S. Truman`;
  } else if (temperature < 10) {
    weatherQuote.innerHTML = `“The cold never bothered me anyway.” - Elsa`;
  } else {
    weatherQuote.innerHTML = `“There's no such thing as bad weather, just soft people.” - Bill Bowerman`;
  }
}

function displayMeteorology(response) {
  let humidity = response.data.main.humidity;
  let speed = Math.round(response.data.wind.speed);
  let meteorology = `Humidity: ${humidity}%<br />Wind: ${speed}km/h<br /><br />`;
  let weatherQuote = document.querySelector(".weather-quote");
  let originalQuote = weatherQuote.innerHTML;

  function showMeteorology() {
    weatherQuote.innerHTML = meteorology;
  }

  function showOriginalQuote() {
    weatherQuote.innerHTML = originalQuote;
  }

  weatherQuote.addEventListener("mouseover", showMeteorology);
  weatherQuote.addEventListener("mouseout", showOriginalQuote);
}

function displayWeatherData(response) {
  displayTemperature(response);
  displayQuote(response);
  displayMeteorology(response);
}

function search(cityInput) {
  let apiEndpoint = "https://api.openweathermap.org/data/2.5/weather";
  let apiKey = "b42ff038129e72096b5d306da3a6a27d";
  let unit = "metric";
  let apiUrl = `${apiEndpoint}?q=${cityInput}&appid=${apiKey}&units=${unit}`;

  axios
    .get(apiUrl)
    .then((response) => {
      if (response.data.cod === "404") {
        throw new Error("City not found. Please enter a valid city name.");
      } else {
        displayWeatherData(response);
      }
    })
    .catch((error) => {
      if (error.response.status === 404) {
        alert("City not found. Please enter a valid city name.");
      } else {
        alert(
          "An error occurred while fetching weather data. Please try again later."
        );
        console.error(error);
      }
    });
}

function handleSubmit(event) {
  event.preventDefault();
  let cityInput = document.querySelector("#search-city-input");
  search(cityInput.value);
}

function getCurrentLocation(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;

  let apiEndpoint = "https://api.openweathermap.org/data/2.5/weather";
  let apiKey = "b42ff038129e72096b5d306da3a6a27d";
  let unit = "metric";
  let apiUrl = `${apiEndpoint}?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=${unit}`;

  axios.get(apiUrl).then((response) => {
    displayWeatherData(response);
  });
}

function showLocationTemperature() {
  navigator.geolocation.getCurrentPosition(getCurrentLocation);
}

function convertToFahrenheit(event) {
  event.preventDefault();
  let temperatureFahrenheit = (temperatureCelsius * 9) / 5 + 32;
  document.querySelector(".current-temperature-digit").innerHTML = Math.round(
    temperatureFahrenheit
  );

  currtemperatureCelsius.classList.remove("active");
  currtemperatureFahrenheit.classList.add("active");
}

function convertToCelsius(event) {
  event.preventDefault();
  document.querySelector(".current-temperature-digit").innerHTML =
    Math.round(temperatureCelsius);

  currtemperatureFahrenheit.classList.remove("active");
  currtemperatureCelsius.classList.add("active");
}

let temperatureCelsius = null;

let searchForm = document.querySelector("#search-city");
searchForm.addEventListener("submit", handleSubmit);

let myLocationButton = document.querySelector(".location-button");
myLocationButton.addEventListener("click", showLocationTemperature);

let currtemperatureFahrenheit = document.querySelector(
  ".current-temperature-fahrenheit"
);
currtemperatureFahrenheit.addEventListener("click", convertToFahrenheit);

let currtemperatureCelsius = document.querySelector(
  ".current-temperature-celsius"
);
currtemperatureCelsius.addEventListener("click", convertToCelsius);

let now = new Date();
document.querySelector("#city-day-time").innerHTML = formatDate(now);

search("Barcelona");
