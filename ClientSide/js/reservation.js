document.addEventListener("DOMContentLoaded", () => {
  const weatherContainer = document.getElementById("weather-info");
  const apiKey = "8725217ca080ca132ddb5edd08a0d01c"; 
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
      fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`)
        .then(res => res.json())
        .then(data => {
          // Find closest matching date-time
          const target = `${date} ${time}:00`;
          const match = data.list.find(entry => entry.dt_txt.startsWith(`${date}`) && entry.dt_txt.includes(time));

          if (match) {
            const weatherId = match.weather[0].id;
            const desc = match.weather[0].description;
            const temp = match.main.temp.toFixed(1);
            updateWeatherVideoById(weatherId)
            weatherContainer.innerHTML = `
              <div>
                <strong>${target}</strong><br>
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
      return "The sidewalk’s cooking harder than your meal — go inside";
    }
  }
  function updateWeatherVideoById(id) {
    const video = document.getElementById('weather-video');
    const source = document.getElementById('weather-source');
    let videoFile = '';
    if (id >= 200 && id < 600) {
      videoFile = '../videos/rain.mp4';
    } else if (id >= 600 && id < 700) {
      videoFile = '../videos/snow.mp4';
    } else if (id === 800) {
      videoFile = '../videos/sun2.mp4';
    } else if (id >= 701 && id <= 804) {
      videoFile = '../videos/cloud2.mp4';
    }

    if (videoFile) {
      source.src = videoFile;
      video.load();
      video.play();
    }
  }
});
