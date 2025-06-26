const API_KEY = "f570ba4a8945e02cc0cdf9bb166d14e1";

const elements = {
  city: document.getElementById("city"),
  temp: document.getElementById("temp"),
  desc: document.getElementById("desc"),
  wind: document.getElementById("wind"),
  humidity: document.getElementById("humidity"),
  error: document.getElementById("error"),
  villeInput: document.getElementById("ville"),
  btnChercher: document.getElementById("btnChercher"),
  forecast24h: document.getElementById("forecast24h"),
};

function degToDirection(deg) {
  const directions = ["N", "NE", "E", "SE", "S", "SO", "O", "NO"];
  return directions[Math.round(deg / 45) % 8];
}

function formatHour(timestamp, timezoneOffset) {
  const date = new Date((timestamp + timezoneOffset) * 1000);
  return date.getUTCHours() + "h";
}

async function fetchWeatherData(ville) {
  if (!ville) {
    elements.error.textContent = "Merci de saisir une ville";
    return;
  }
  elements.error.textContent = "";
  elements.forecast24h.innerHTML = "Chargement...";

  try {
    // Données météo actuelles
    const responseWeather = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(ville)}&appid=${API_KEY}&units=metric&lang=fr`);
    if (!responseWeather.ok) throw new Error("Ville non trouvée");
    const dataWeather = await responseWeather.json();

    elements.city.textContent = dataWeather.name;
    elements.temp.textContent = `${Math.round(dataWeather.main.temp)}°C`;
    elements.desc.textContent = dataWeather.weather[0].description;

    const speedKmh = (dataWeather.wind.speed * 3.6).toFixed(1);
    const direction = degToDirection(dataWeather.wind.deg);
    elements.wind.textContent = `${speedKmh} km/h ${direction}`;
    elements.humidity.textContent = dataWeather.main.humidity + "%";

    // Prévisions 24h (3h x 8)
    const responseForecast = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(ville)}&appid=${API_KEY}&units=metric&lang=fr`);
    if (!responseForecast.ok) throw new Error("Erreur prévisions");
    const dataForecast = await responseForecast.json();

    const timezoneOffset = dataForecast.city.timezone;
    elements.forecast24h.innerHTML = "";

    dataForecast.list.slice(0, 8).forEach(item => {
      const hour = formatHour(item.dt, timezoneOffset);
      const icon = item.weather[0].icon;
      const temp = Math.round(item.main.temp);

      const forecastItem = document.createElement("div");
      forecastItem.className = "forecast-item";
      forecastItem.innerHTML = `
        ${hour}<br>
        <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="" /><br>
        ${temp}°
      `;
      elements.forecast24h.appendChild(forecastItem);
    });

  } catch (err) {
    elements.error.textContent = "Erreur : " + err.message;
    elements.city.textContent = "Ville introuvable";
    elements.temp.textContent = "--°";
    elements.desc.textContent = "---";
    elements.wind.textContent = "---";
    elements.humidity.textContent = "--%";
    elements.forecast24h.innerHTML = "---";
  }
}

// ▶ Clique bouton
elements.btnChercher.addEventListener("click", () => {
  fetchWeatherData(elements.villeInput.value.trim());
});

// ▶ Touche Entrée
elements.villeInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    fetchWeatherData(elements.villeInput.value.trim());
  }
});
