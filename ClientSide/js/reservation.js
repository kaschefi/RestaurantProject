document.addEventListener("DOMContentLoaded", () => {
  const weatherContainer = document.getElementById("weather-info");
  const apiKey = "3580436a12d0fa957788951131e02bcc"; // api key später hinzufügen lol
  const city = "Vienna";

  fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`)
    .then(response => response.json())
    .then(data => {
      const forecasts = {};

      data.list.forEach(entry => {
        const date = entry.dt_txt.split(" ")[0];
        if (!forecasts[date]) forecasts[date] = [];
        forecasts[date].push(entry);
      });

      const output = Object.entries(forecasts)
        .slice(0, 5)
        .map(([date, entries]) => {
          const noonEntry = entries.find(e => e.dt_txt.includes("12:00:00")) || entries[0];
          const weather = noonEntry.weather[0].description;
          const temp = noonEntry.main.temp.toFixed(1);
          const icon = noonEntry.weather[0].icon;

          return `
            <div style="margin-bottom: 15px;">
              <strong>${date}</strong><br>
              <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="Wettericon"><br>
              ${weather}, ${temp}°C
            </div>
          `;
        })
        .join("");

      weatherContainer.innerHTML = output;
    })
    .catch(error => {
      console.error("Fehler beim Laden der Wetterdaten:", error);
      weatherContainer.innerHTML = "<p>Wetterdaten nicht verfügbar.</p>";
    });
});
