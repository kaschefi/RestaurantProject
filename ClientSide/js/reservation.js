document.addEventListener("DOMContentLoaded", () => {
  const weatherContainer = document.getElementById("weather-info");
  const apiKey = "3580436a12d0fa957788951131e02bcc"; // api key später hinzufügen lol
  const city = "Vienna";
  const dateInput = document.getElementById("date");
  const timeInput = document.getElementById("time");
  const from = document.querySelector(".from");
    const form = document.querySelector("form"); // or use specific ID like #reservationForm
  if (form) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
    })
  }
  function tryFetchWeather() {
    const date = dateInput.value;
    const time = timeInput.value;

    if (date && time) {
      // Both fields are filled, now fetch weather
      fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`)
        .then(res => res.json())
        .then(data => {
          // Find closest matching date-time
          const target = `${date} ${time}:00`;
          const match = data.list.find(entry => entry.dt_txt.startsWith(`${date}`) && entry.dt_txt.includes(time));

          if (match) {
            const desc = match.weather[0].description;
            const temp = match.main.temp.toFixed(1);
            const icon = match.weather[0].icon;

            weatherContainer.innerHTML = `
              <strong>${target}</strong><br>
              <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="icon"><br>
              ${desc}, ${temp}°C
            `;
          } else {
            weatherContainer.innerHTML = "<p>No weather data for that time.</p>";
          }
        })
        .catch(err => {
          console.error("Weather fetch error:", err);
          weatherContainer.innerHTML = "<p>Weather data error.</p>";
        });
    }
  }
  // Trigger when either input changes
  dateInput.addEventListener("input", tryFetchWeather);
  timeInput.addEventListener("input", tryFetchWeather);
});
