const API_KEY = "f570ba4a8945e02cc0cdf9bb166d14e1";

function getWeatherByCoords(lat, lon) {
  console.log("Recherche météo aux coords :", lat, lon);

  fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&lang=fr&appid=${API_KEY}`)
    .then(res => {
      if (!res.ok) throw new Error(`Erreur API météo actuelle: ${res.status}`);
      return res.json();
    })
    .then(current => {
      console.log("Météo actuelle reçue :", current);
      document.getElementById("city").textContent = current.name;
      document.getElementById("temp").textContent = `${Math.round(current.main.temp)}°`;
      document.getElementById("desc").textContent = current.weather[0].description;
      document.getElementById("humidity").textContent = `${current.main.humidity}%`;
      document.getElementById("pressure").textContent = `${current.main.pressure} hPa`;
      document.getElementById("wind").textContent = `${(current.wind.speed * 3.6).toFixed(1)} km/h`;
    })
    .catch(err => {
      console.error(err);
      document.getElementById("desc").textContent = "Erreur lors du chargement de la météo.";
    });

  fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&lang=fr&appid=${API_KEY}`)
    .then(res => {
      if (!res.ok) throw new Error(`Erreur API prévisions: ${res.status}`);
      return res.json();
    })
    .then(forecast => {
      console.log("Prévisions reçues :", forecast);
      const forecastEl = document.getElementById("forecast");
      forecastEl.innerHTML = "";
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
    .catch(err => {
      console.error(err);
      document.getElementById("forecast").textContent = "Prévisions indisponibles.";
    });
}

function getWeatherFallback(city = "Givors") {
  console.log("Chargement fallback météo pour la ville :", city);
  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&lang=fr&appid=${API_KEY}`)
    .then(res => {
      if (!res.ok) throw new Error(`Erreur API fallback météo: ${res.status}`);
      return res.json();
    })
    .then(data => {
      getWeatherByCoords(data.coord.lat, data.coord.lon);
    })
    .catch(err => {
      console.error(err);
      document.getElementById("desc").textContent = "Impossible de récupérer la météo.";
    });
}

function initWeatherApp() {
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(
      position => {
        console.log("Position obtenue :", position.coords.latitude, position.coords.longitude);
        getWeatherByCoords(position.coords.latitude, position.coords.longitude);
      },
      error => {
        console.warn("Localisation refusée ou indisponible, chargement de Givors");
        getWeatherFallback("Givors");
      }
    );
  } else {
    console.warn("Géolocalisation non supportée");
    getWeatherFallback("Givors");
  }
}

window.onload = initWeatherApp;
