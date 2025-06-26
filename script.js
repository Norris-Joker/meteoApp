function getMeteo() {
    const ville = document.getElementById('ville').value.trim();
    const resultat = document.getElementById('resultat');
    const cloudsContainer = document.getElementById('cloudsContainer');
    const container = document.querySelector('.container');
    const apiKey = "f570ba4a8945e02cc0cdf9bb166d14e1";
  
    if (!ville) {
      resultat.innerHTML = "<p>❌ Merci d’entrer une ville.</p>";
      cloudsContainer.style.display = 'none';
      document.body.className = '';
      container.style.display = 'block';
      return;
    }
  
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(ville)}&appid=${apiKey}&units=metric&lang=fr`;
  
    fetch(url)
      .then(response => response.json())
      .then(data => {
        if (data.cod !== 200) {
          resultat.innerHTML = "<p>❌ Ville introuvable.</p>";
          cloudsContainer.style.display = 'none';
          document.body.className = '';
          container.style.display = 'block';
          return;
        }
  
        const temps = data.weather[0].main.toLowerCase(); // ex: clear, clouds, rain
        const description = data.weather[0].description;
        const temp = Math.round(data.main.temp);
        const iconCode = data.weather[0].icon;
        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
  
        // Appliquer fond météo et gestion des nuages animés
        if (temps.includes('cloud')) {
          document.body.className = 'clouds';
          cloudsContainer.style.display = 'block';
          container.style.display = 'none'; // cacher le fond blanc
        } else if (temps.includes('rain') || temps.includes('drizzle') || temps.includes('thunderstorm')) {
          document.body.className = 'rain';
          cloudsContainer.style.display = 'none';
          container.style.display = 'block';
        } else {
          document.body.className = 'clear';
          cloudsContainer.style.display = 'none';
          container.style.display = 'block';
        }
  
        // Affichage météo (toujours visible)
        resultat.innerHTML = `
          <div class="weather-card">
            <img src="${iconUrl}" alt="${description}" class="weather-icon" />
            <div class="weather-temp">${temp}°C</div>
            <div class="weather-desc">${description}</div>
            <div class="weather-details">
              Vent : ${Math.round(data.wind.speed)} m/s<br>
              Humidité : ${data.main.humidity} %<br>
              Pression : ${data.main.pressure} hPa
            </div>
          </div>
        `;
      })
      .catch(() => {
        resultat.innerHTML = `<p>❌ Une erreur est survenue.</p>`;
        cloudsContainer.style.display = 'none';
        document.body.className = '';
        container.style.display = 'block';
      });
  }
