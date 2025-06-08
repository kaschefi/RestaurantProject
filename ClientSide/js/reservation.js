document.addEventListener("DOMContentLoaded", () => {
  const weatherContainer = document.getElementById("weather-info");
  const apiKey = "3580436a12d0fa957788951131e02bcc"; // api key später hinzufügen lol
  const city = "Vienna";
  const dateInput = document.getElementById("date");
  const timeInput = document.getElementById("time");
  const form = document.getElementById("reservation-form");
  if (form) {
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      console.log("hi i am working ")

      const formData = {
        name: form.name.value,
        email: form.email.value,
        date: form.date.value,
        time: form.time.value,
        guests: form.guests.value
      };

      try {
        const response = await fetch('http://localhost:3000/submit', {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });

        if (response.ok) {
          const data = await response.json();
          console.log('Reservation submitted:', data);
          alert('Reservation submitted!');
          form.reset(); // optional: clear form
        } else {
          console.error('Error:', response.status);
        }
      } catch (err) {
        console.error('Submission failed:', err);
      }
    });
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
              <div>
                <strong>${target}</strong><br>
                <img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="icon"><br>  
                ${desc}, ${temp}°C
                <p>${suggest(temp, desc)} 
              </div>  
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
  function suggest(temp, desc) {
    if (desc.toLowerCase().includes("rain")) {
      return "It's raining cats, dogs, and possibly frogs — outdoor seating has left the chat. Indoors it is!";
    }
    if (desc.includes("snow")) {
      return "Unless you're building a snowman with your meal, stick to indoor";
    }
    if (temp < 0) {
      return "It's literally below zero. Unless you're trying to cosplay as an ice cube, book inside.";
    }
    if (temp >= 0 && temp < 10) {
      return "It's sweater weather, not survival weather. Indoor’s the move.";
    }
    if (temp >= 10 && temp < 30) {
      return "Weather’s on its best behavior today. Indoor? Outdoor? You’re winning either way.";
    }
    if (temp >= 30) {
      return "It's hot bro just stay in.";
    }
  }
});
