document.addEventListener("DOMContentLoaded", () => {
  const weatherContainer = document.getElementById("weather-info");
  const apiKey = "3580436a12d0fa957788951131e02bcc"; // <-- Key später hinzufügen lol
  const city = "Vienna"; //  Stadt wo das Restaurant ist

  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`)
    .then(response => response.json())
    .then(data => {
      const weather = data.weather[0].description;
      const temp = data.main.temp;
      const icon = data.weather[0].icon;

      weatherContainer.innerHTML = `
        <p><strong>${city}:</strong> ${weather}, ${temp}°C</p>
        <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="Weather Icon" />
      `;
    })
    .catch(error => {
      console.error("Fehler beim Laden des Wetters:", error);
      weatherContainer.innerHTML = "<p>Wetterdaten nicht verfügbar.</p>";
    });
});