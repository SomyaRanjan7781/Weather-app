function displayWeather(data) {
  const weatherDiv = document.getElementById("weatherResult");
  const rain = data.rain ? data.rain["1h"] || data.rain["3h"] || 0 : 0;

  weatherDiv.innerHTML = `
    <h3>${data.name}, ${data.sys.country}</h3>
    <p>Temperature: ${data.main.temp} °C</p>
    <p>Humidity: ${data.main.humidity} %</p>
    <p>Weather: ${data.weather[0].description}</p>
    <p>Rain (last hour): ${rain} mm</p>
    <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="weather icon">
  `;
}

function getWeather(city = null, lat = null, lon = null) {
  const apiKey = "8b578569eecee3ba36ea02c94b036ebc";
  let url = "";

  if (city) {
    url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  } else if (lat && lon) {
    url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
  } else {
    document.getElementById("weatherResult").innerText = "No city or coordinates provided";
    return;
  }

  fetch(url)
    .then(response => {
      if (!response.ok) throw new Error("City not found");
      return response.json();
    })
    .then(displayWeather)
    .catch(error => {
      document.getElementById("weatherResult").innerText = error.message;
    });
}

function getWeatherByCity() {
  const city = document.getElementById("cityInput").value;
  if (city.trim() !== "") {
    getWeather(city);
  } else {
    document.getElementById("weatherResult").innerText = "Please enter a city name.";
  }
}

// Auto-detect on page load
window.onload = function() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      position => {
        getWeather(null, position.coords.latitude, position.coords.longitude);
      },
      () => {
        document.getElementById("weatherResult").innerText = "Geolocation permission denied.";
      }
    );
  } else {
    document.getElementById("weatherResult").innerText = "Geolocation not supported.";
  }

  // 🌓 Load saved theme preference
  const savedTheme = localStorage.getItem("theme") || "light";
  document.body.classList.add(savedTheme);
};

// 🌓 Theme toggle functionality
document.getElementById("toggleTheme").addEventListener("click", () => {
  if (document.body.classList.contains("light")) {
    document.body.classList.remove("light");
    document.body.classList.add("dark");
    localStorage.setItem("theme", "dark");
  } else {
    document.body.classList.remove("dark");
    document.body.classList.add("light");
    localStorage.setItem("theme", "light");
  }
});
