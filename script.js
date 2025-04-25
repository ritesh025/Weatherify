const cityInput = document.querySelector(".city-input");
const searchBtn = document.querySelector(".search-btn");

const notFoundSection = document.querySelector(".not-found");

const weatherInfoSection = document.querySelector(".weather-info");

const searchCitySection = document.querySelector(".search-city");

const apiKey = "e5c00922536ba32cf98b278920b3cb49";

const countryText = document.querySelector(".country-text");
const dateText = document.querySelector(".date-text");
const tempText = document.querySelector(".temp-text");
const conditionText = document.querySelector(".condition-text");
const humidityValueText = document.querySelector(".humidity-value-text");
const windValueText = document.querySelector(".wind-value-text");
const weatherSummaryImg = document.querySelector(".weather-summary-img");
const currentDateText = document.querySelector(".current-date-text");
const forecastItemsContainer = document.querySelector(
  ".forecast-items-container"
);

searchBtn.addEventListener("click", () => {
  if (cityInput.value.trim() != "") {
    updateWeatherInfo(cityInput.value);
    cityInput.value = "";
    cityInput.blur();
  }
});

cityInput.addEventListener("keydown", (event) => {
  if (event.key == "Enter" && cityInput.value.trim() != "") {
    updateWeatherInfo(cityInput.value);
    cityInput.value = "";
    cityInput.blur();
  }
});

async function getFetchData(endPoint, city) {
  const apiURL = `https://api.openweathermap.org/data/2.5/${endPoint}?q=${city}&appid=${apiKey}&units=metric`;

  const response = await fetch(apiURL);

  return response.json();
}

function getWeatherIcon(id) {
  if (id <= 232) return "thunderstorm.svg";
  if (id <= 321) return "drizzle.svg";
  if (id <= 531) return "rain.svg";
  if (id <= 622) return "snow.svg";
  if (id <= 781) return "atmosphere.svg";

  if (id <= 800) return "clear.svg";
  else return "clouds.svg";
}

function getCurrentDate() {
  const currentDate = new Date();
  const options = {
    weekday: "short",
    day: "2-digit",
    month: "short",
  };
  return currentDate.toLocaleDateString("en-US", options);
}

async function updateWeatherInfo(city) {
  const weatherData = await getFetchData("weather", city);
  if (weatherData.cod != 200) {
    showDisplaySection(notFoundSection);
    return;
  }
  console.log(weatherData);

  const {
    name: country,
    main: { temp, humidity },
    weather: [{ id, main }],
    wind: { speed },
  } = weatherData;

  /* countryText.textContent = country; 
  countryText.textContent = `${city}, ${weatherData.sys.country}`; */
  countryText.textContent = `${
    city.charAt(0).toUpperCase() + city.slice(1).toLowerCase()
  }, ${weatherData.sys.country.toUpperCase()}`;
  tempText.textContent = Math.round(temp) + " °C";
  conditionText.textContent = main;
  humidityValueText.textContent = humidity + " %";
  windValueText.textContent = speed + " km/h";
  currentDateText.textContent = getCurrentDate();
  weatherSummaryImg.src = `assets/assets/weather/${getWeatherIcon(id)}`;

  await updateForecastInfo(city);

  showDisplaySection(weatherInfoSection);
}

async function updateForecastInfo(city) {
  const forecastData = await getFetchData("forecast", city);
  const timeTaken = "12:00:00";
  const todayDate = new Date().toISOString().split("T")[0];

  forecastItemsContainer.innerHTML = "";

  forecastData.list.forEach((forecastWeather) => {
    if (
      forecastWeather.dt_txt.includes(timeTaken) &&
      !forecastWeather.dt_txt.includes(todayDate)
    ) {
      updateForecastItems(forecastWeather);
    }
  });
}

function updateForecastItems(weatherData) {
  console.log(weatherData);
  const {
    dt_txt: date,
    weather: [{ id }],
    main: { temp },
  } = weatherData;

  const dateTaken = new Date(date);
  const dateOption = {
    day: "2-digit",
    month: "short",
  };
  const dateResult = dateTaken.toLocaleDateString("en-US", dateOption);


  const forecastItem = `<div class="forecast-item">
            <h5 class="forecast-item-date regular-text">${dateResult}</h5>
            <img
              src="assets/assets/weather/${getWeatherIcon(id)}"
              class="forecast-item-img"
            />
            <h5 class="forecast-item-temp">${Math.round(temp)} °C</h5>
          </div>
`

  forecastItemsContainer.insertAdjacentHTML("beforeend", forecastItem);

}

/* city suggestion 
async function suggestCities(query) {
  const response = await fetch(
    `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${apiKey}`
  );
  const suggestions = await response.json();

  const dataList = document.getElementById("city-suggestions");
  dataList.innerHTML = "";

  suggestions.forEach((city) => {
    const option = document.createElement("option");
    option.value = `${city.name}, ${city.country}`;
    dataList.appendChild(option);
  });
}

cityInput.addEventListener("input", () => {
  if (cityInput.value.trim().length >= 2) {
    suggestCities(cityInput.value.trim());
  }
});

*/


function showDisplaySection(section) {
  [weatherInfoSection, searchCitySection, notFoundSection].forEach(
    (section) => (section.style.display = "none")
  );

  section.style.display = "flex";
}
