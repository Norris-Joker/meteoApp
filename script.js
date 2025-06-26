function getMeteo() {
    const ville = document.getElementById("ville").value.trim();
    const resultat = document.getElementById("resultat");
    const apiKey = "f570ba4a8945e02cc0cdf9bb166d14e1";
  
    if (ville === "") {
      resultat.innerHTML = "<p>❌ Merci d’entrer une ville.</p>";
      return;
    }
  
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(ville)}&appid=${apiKey}&units=metric&lang=fr`;
  
    fetch(url)
      .then(response => response.json())
      .then(data => {
        console.log(data);
  
        if (data.cod === 200) {
            const iconCode = data.weather[0].icon;
            const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
          
            resultat.innerHTML = `
              <h2>${data.name}</h2>
              <img src="${iconUrl}" alt="${data.weather[0].description}" />
              <p>${data.weather[0].description}</p>
              <p>🌡️ ${data.main.temp}°C</p>
            `;
          } else {
            resultat.innerHTML = "<p>❌ Ville introuvable</p>";
          }
          
      })
      .catch(error => {
        console.error(error);
        resultat.innerHTML = "<p>❌ Une erreur est survenue</p>";
      });
  }
  