const API_KEY = "f570ba4a8945e02cc0cdf9bb166d14e1";

function kelvinToCelsius(k) {
  return Math.round(k - 273.15);
}

function getWeatherByCoords(lat, lon) {
  // Météo actuelle
  fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&lang=fr&appid=${API_KEY}`)
    .then(res => res.json())
    .then(current => {
      document.getElementById("city").textContent = current.name;
      document.getElementById("temp").textContent = `${Math.round(current.main.temp)}°`;
      document.getElementById("desc").textContent = current.weather[0].description;
      document.getElementById("humidity").textContent = `${current.main.humidity}%`;
      document.getElementById("pressure").textContent = `${current.main.pressure} hPa`;
      document.getElementById("wind").textContent = `${(current.wind.speed * 3.6).toFixed(1)} km/h`; // m/s to km/h
    })
    .catch(() => {
      document.getElementById("desc").textContent = "Erreur lors du chargement de la météo.";
    });

  // Prévisions 5 prochaines heures
  fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&lang=fr&appid=${API_KEY}`)
    .then(res => res.json())
    .then(forecast => {
      const forecastEl = document.getElementById("forecast");
      forecastEl.innerHTML = "";
      // Affiche 5 prévisions, 3h d'intervalle (OpenWeather donne des tranches de 3h)
      forecast.list.slice(0, 5).forEach(item => {
        const hour = new Date(item.dt * 1000).getHours();
        const block = document.createElement("div");
        block.className = "item";
        block.innerHTML = `
          ${hour}h<br>
          <img src="https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png" alt="${item.weather[0].description}"><br>
          ${Math.round(item.main.temp)}°
        `;
        forecastEl.appendChild(block);
      });
    })
    .catch(() => {
      document.getElementById("forecast").textContent = "Prévisions indisponibles.";
    });
}

function getWeatherFallback(city = "Givors") {
  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&lang=fr&appid=${API_KEY}`)
    .then(res => res.json())
    .then(data => {
      getWeatherByCoords(data.coord.lat, data.coord.lon);
    })
    .catch(() => {
      document.getElementById("desc").textContent = "Impossible de récupérer la météo.";
    });
}

function initWeatherApp() {
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(
      position => {
        getWeatherByCoords(position.coords.latitude, position.coords.longitude);
      },
      error => {
        console.warn("Localisation refusée, chargement de Givors");
        getWeatherFallback("Givors");
      }
    );
  } else {
    console.warn("Géolocalisation non supportée");
    getWeatherFallback("Givors");
  }
}

window.onload = initWeatherApp;
