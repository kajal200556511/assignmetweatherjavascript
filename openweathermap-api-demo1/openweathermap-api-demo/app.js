const openWeatherApiKey = '61b8f28ae63488e95ee252138e92974b';
const openWeatherApiUrl = 'https://api.openweathermap.org/data/2.5/weather';
const openCageApiKey = '84045991099c4fb08ae2ac4fbf7875ce';
const openCageApiUrl = 'https://api.opencagedata.com/geocode/v1/json';
const cityInput = document.getElementById('city-input');
const getWeatherBtn = document.getElementById('get-weather-btn');
const getLocationBtn = document.getElementById('get-location-btn');
const weatherInfo = document.getElementById('weather-info');
const temperature = document.getElementById('temperature');
const description = document.getElementById('description');
const humidity = document.getElementById('humidity');
const windSpeed = document.getElementById('wind-speed');
const country = document.getElementById('country');
const locationInfo = document.getElementById('location');

getWeatherBtn.addEventListener('click', getWeatherByCity);
getLocationBtn.addEventListener('click', getWeatherByLocation);

function getWeatherByCity() {
  const cityName = cityInput.value.trim();
  if (cityName) {
    fetchWeatherData(`${openWeatherApiUrl}?q=${encodeURIComponent(cityName)}&appid=${openWeatherApiKey}&units=metric`);
  } else {
    alert('Please enter a city name.');
  }
}

function getWeatherByLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
      const { latitude, longitude } = position.coords;
      fetch(`${openCageApiUrl}?q=${latitude}+${longitude}&key=${openCageApiKey}&language=en&pretty=1`)
        .then(response => response.json())
        .then(data => {
          const cityName = data.results[0].components.city || data.results[0].components.town;
          fetchWeatherData(`${openWeatherApiUrl}?lat=${latitude}&lon=${longitude}&appid=${openWeatherApiKey}&units=metric`, cityName);
        })
        .catch(error => {
          console.error(error);
          alert('Error fetching location data.');
        });
    });
  } else {
    alert('Geolocation is not supported by this browser.');
  }
}

function fetchWeatherData(url, cityName = '') {
  fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(weatherData => {
      const { main, weather, wind, sys } = weatherData;
      const { temp, humidity: weatherHumidity } = main;
      const { description } = weather[0];
      const { speed } = wind;
      temperature.textContent = `Temperature: ${temp}°C`;
      description.textContent = `Description: ${description}`;
      humidity.textContent = `Humidity: ${weatherHumidity}%`;
      windSpeed.textContent = `Wind speed: ${speed} m/s`;
      country.textContent = `Country: ${sys.country}`;
      const formattedLocation = cityName ? `${cityName}, ${sys.country}` : `${sys.country}`;
      locationInfo.textContent = `Location: ${formattedLocation}`;
      const weatherIconUrl = `http://openweathermap.org/img/wn/${weather[0].icon}.png`;
      const weatherIcon = document.getElementById('weather-icon');
      weatherIcon.src = weatherIconUrl;
      weatherIcon.alt = `Weather Icon: ${description}`;
    })
    .catch(error => {
      console.error(error);
      alert('Error fetching weather data.');
    });
}
