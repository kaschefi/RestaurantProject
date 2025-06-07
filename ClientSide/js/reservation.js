window.addEventListener("scroll", function () {
  const nav = document.querySelector(".nav");
  if (window.scrollY > 100) {
    nav.style.width = "50%";
    nav.style.left = "50%";
    nav.style.transform = "translateX(-50%)";
    nav.style.top = "20px";
    nav.style.borderRadius = "50px";
  } else {
    nav.style.width = "100%";
    nav.style.left = "0";
    nav.style.transform = "none";
    nav.style.top = "0";
    nav.style.borderRadius = "0";
  }
});

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