// Current date & time

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

// --------------------TO UPDATE: FOR CITY DATE/TIME - AXIOS------------------------

let now = new Date();
let cityDayTime = document.querySelector("#city-day-time");

cityDayTime.innerHTML = formatDate(now);

// Update city name after user submits form

function showTemperature(response) {
  document.querySelector("#city-name").innerHTML = response.data.name; // consolidated line - can update rest for this later

  tempC = response.data.main.temp;

  let currTempNum = document.querySelector(".curr-temp-num");
  currTempNum.innerHTML = Math.round(tempC);

  let currWeather = document.querySelector(".weather-type");
  currWeather.innerHTML = response.data.weather[0].description;

  // icon
  let iconElement = document.querySelector("#icon");
  iconElement.setAttribute(
    "src",
    `https://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  iconElement.setAttribute("alt", response.data.weather[0].description);
}

function showQuote(response) {
  let temperature = Math.round(response.data.main.temp);
  let weatherQuote = document.querySelector(".quote");

  if (temperature < 10) {
    weatherQuote.innerHTML = `“The cold never bothered me anyway.” – Elsa`;
    if (temperature > 28) {
      weatherQuote.innerHTML = `“Never kick a fresh turd on a hot day.” – Harry S. Truman`;
    }
  } else {
    weatherQuote.innerHTML = `“There's no such thing as bad weather, just soft people.” – Bill Bowerman`;
  }
}

function getMeteorology(response) {
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

// Search city
function searchCity(searchCityInput) {
  let apiEndpoint = "https://api.openweathermap.org/data/2.5/weather";
  let apiKey = "b42ff038129e72096b5d306da3a6a27d";
  let unit = "metric";
  let apiUrl = `${apiEndpoint}?q=${searchCityInput}&appid=${apiKey}&units=${unit}`;

  axios
    .get(apiUrl)
    .then((response) => {
      if (response.data.cod === "404") {
        // City not found
        throw new Error("City not found. Please enter a valid city name.");
      } else {
        showTemperature(response);
        showQuote(response);
        getMeteorology(response);
      }
    })
    .catch((error) => {
      if (error.response.status === 404) {
        // City not found
        alert("City not found. Please enter a valid city name.");
      } else {
        // Other errors
        alert(
          "An error occurred while fetching weather data. Please try again later."
        );
        console.error(error);
      }
    });
}

// -----------TO UPDATE: Clear search box after submitted-----------------
function handleSubmit(event) {
  event.preventDefault();
  let searchCityInput = document.querySelector("#search-city-input").value;
  searchCity(searchCityInput);
}

// Current location BUTTON

function getCurrentLocation(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;

  let apiEndpoint = "https://api.openweathermap.org/data/2.5/weather";
  let apiKey = "b42ff038129e72096b5d306da3a6a27d";
  let unit = "metric";
  let apiUrl = `${apiEndpoint}?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=${unit}`;

  axios.get(apiUrl).then(showTemperature);
  axios.get(apiUrl).then(showQuote);
}

function showLocationTemperature() {
  navigator.geolocation.getCurrentPosition(getCurrentLocation);
}

// Celcius & Farenheit conversion - DEFAULT: CELSIUS

function convertToFahrenheit(event) {
  event.preventDefault();
  let currTempNum = document.querySelector(".curr-temp-num");

  let tempF = (tempC * 9) / 5 + 32;
  currTempNum.innerHTML = Math.round(tempF);

  currTempC.classList.remove("active");
  currTempF.classList.add("active");
}

function convertToCelsius(event) {
  event.preventDefault();
  let currTempNum = document.querySelector(".curr-temp-num");

  currTempNum.innerHTML = Math.round(tempC);

  currTempF.classList.remove("active");
  currTempC.classList.add("active");
}

let tempC = null;

let searchForm = document.querySelector("#search-city");
searchForm.addEventListener("submit", handleSubmit);

let myLocationButton = document.querySelector(".location-button");
myLocationButton.addEventListener("click", showLocationTemperature);

let currTempF = document.querySelector(".curr-temp-f");
currTempF.addEventListener("click", convertToFahrenheit);

let currTempC = document.querySelector(".curr-temp-c");
currTempC.addEventListener("click", convertToCelsius);

// show default city on reload
searchCity("Barcelona");
