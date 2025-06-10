document.addEventListener("DOMContentLoaded", () => {
  const weatherContainer = document.getElementById("weather-info");
  const apiKey = "8725217ca080ca132ddb5edd08a0d01c";
  const city = "Vienna";
  const dateInput = document.getElementById("date");
  const timeInput = document.getElementById("time");
  const form = document.getElementById("reservation-form");
  const img = document.querySelector(".background-img");
  img.src = "../images/1.png"

  const today = new Date();
  const todayDate = new Date().toISOString().split("T")[0];
  document.getElementById("date").setAttribute("min", today);
  if (form) {
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      console.log("hi i am working ")
      
      const formData = {
        name: form.name.value,
        email: form.email.value,
        date: form.date.value,
        time: form.time.value,
        guests: form.guests.value,
        side: form.checkbox.checked
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
          const roundedHour24 = apiTimeFormat(time);
          const formattedRoundedHour = String(roundedHour24).padStart(2, '0');
      fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`)
        .then(res => res.json())
        .then(data => {
          // Find closest matching date-time

          const match = data.list.find(entry =>
            entry.dt_txt.startsWith(`${date}`) && 
            entry.dt_txt.substring(11, 13) === formattedRoundedHour 
          );

          if (match) {
            const weatherId = match.weather[0].id;
            const desc = match.weather[0].description;
            const temp = match.main.temp.toFixed(1);
            let isNight = updateWeatherImg(time)
            updateWeatherVideoById(weatherId, isNight)
            weatherContainer.innerHTML = `
              <div>
                <p>${desc}, ${temp}°C</p>
                <p>${suggest(temp, desc)}</p> 
              </div>  
            `;
          } else {
            weatherContainer.innerHTML = "<div><p>Oops!<br> My crystal ball for weather only goes 5 days into the future.<br> But hey,<strong> you can still book your table!</strong><br> Just decide if you're feeling lucky with an outdoor spot, or if the cozy indoors is calling your name</p></div>";
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
  function updateWeatherVideoById(id, isNight) {
    const video = document.getElementById('weather-video');
    const source = document.getElementById('weather-source');
    let videoFile = '';

    if (id >= 200 && id < 600) {
      videoFile = '../videos/rain3.mp4';
    } else if (id >= 600 && id < 700) {
      videoFile = '../videos/snow.mp4';
    } else if (id === 800 && isNight) {
      videoFile = '../videos/moon0.mp4';
    } else if (id === 800 && !isNight) {
      videoFile = '../videos/sun3.mp4';
    }
    else if (id >= 701 && id <= 804) {
      videoFile = '../videos/cloud3.mp4';
    }

    if (videoFile) {
      source.src = videoFile;
      video.load();
      video.play();
    }
  }
  function updateWeatherImg(timeString) {
    const parts = timeString.split(' ');
    const timePart = parts[0];
    const ampm = parts[1] ? parts[1].toUpperCase() : '';
    let hour = parseInt(timePart.split(':')[0], 10);

    // Convert to 24-hour format
    if (ampm === 'PM' && hour !== 12) {
      hour += 12;
    } else if (ampm === 'AM' && hour === 12) {
      hour = 0;
    }
    img.src = ""
    if (hour >= 20 || hour <= 8) {
      img.src = "../images/3.png"
      return true
    } else {
      img.src = "../images/1.png"
      return false
    }
  }
  function apiTimeFormat(timeString) {
    // This function converts user's "H:MM AM/PM" to a rounded 24-hour integer (0, 3, 6, ..., 21)
    const parts = timeString.split(' ');
    const timePart = parts[0];
    const ampm = parts[1] ? parts[1].toUpperCase() : '';

    let hour24 = parseInt(timePart.split(':')[0], 10);

    if (ampm === 'PM' && hour24 !== 12) {
      hour24 += 12;
    } else if (ampm === 'AM' && hour24 === 12) {
      hour24 = 0;
    }

    return hour24 - (hour24 % 3);
  }
});