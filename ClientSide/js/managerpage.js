fetch('http://localhost:3000/reservations')  
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json(); 
  })
  .then(data => {
    const reservationsContainer = document.querySelector('.reservation');
    reservationsContainer.innerHTML = ''; // Clear existing content

    data.forEach(reservation => {
      const reservationDiv = document.createElement('div');
      reservationDiv.className = 'reservation';
      reservationDiv.innerHTML = `
        <p><strong>Name:</strong> ${reservation.name}</p>
        <p><strong>Date:</strong> ${reservation.date}</p>
        <p><strong>Time:</strong> ${reservation.time}</p>
        <p><strong>Guests:</strong> ${reservation.guests}</p>
        <p>Indoor</p>
      `;
      reservationsContainer.appendChild(reservationDiv);
    });
  })
  .catch(error => {
    console.error('There was a problem with the fetch operation:', error);
  });

  document.addEventListener("DOMContentLoaded", () => {
  const dishNameInput = document.getElementById("dish-name");
  const priceInput = document.getElementById("dish-price");
  const descriptionInput = document.getElementById("dish-description");

  // Auto-Vervollständigung für Dish Name
  dishNameInput.addEventListener("focus", () => {
    fetch("http://localhost:3000/api/menu/names")
      .then(res => res.json())
      .then(names => {
        const datalist = document.getElementById("dish-list") || document.createElement("datalist");
        datalist.id = "dish-list";
        dishNameInput.setAttribute("list", "dish-list");
        datalist.innerHTML = names.map(name => `<option value="${name}">`).join("");
        document.body.appendChild(datalist);


      });
  });

  // Wenn Dish-Name geändert oder ausgewählt wird → hole Details
dishNameInput.addEventListener("change", () => {
  const name = dishNameInput.value;

  if (!name) return;

  fetch(`http://localhost:3000/api/menu/details?name=${encodeURIComponent(name)}`)
    .then(res => {
      if (!res.ok) throw new Error("Nicht gefunden");
      return res.json();
    })
    .then(dish => {
      priceInput.value = dish.price;
      descriptionInput.value = dish.description;
    })
    .catch(err => {
      priceInput.value = "";
      descriptionInput.value = "";
      console.warn("Gericht nicht gefunden:", err);
    });
});

  // EDIT Dish
  document.querySelector("form").addEventListener("submit", (e) => {
    e.preventDefault();
    const data = {
      name: dishNameInput.value,
      price: priceInput.value,
      description: descriptionInput.value
    };

    fetch("http://localhost:3000/api/menu/update", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    })
      .then(res => res.json())
      .then(result => alert("Gericht bearbeitet: " + result.message))
      .catch(err => console.error("Fehler:", err));
  });

  // DELETE Dish
  document.querySelector(".delete-dish").addEventListener("click", () => {
    const name = dishNameInput.value;

    fetch("http://localhost:3000/api/menu/delete", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name })
    })
      .then(res => res.json())
      .then(result => alert("Gericht gelöscht: " + result.message))
      .catch(err => console.error("Fehler:", err));
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const daySelect = document.getElementById("day");
  const openInput = document.getElementById("opening-time");
  const closeInput = document.getElementById("closing-time");

  // Öffnungszeiten beim Auswählen eines Tages laden
  daySelect.addEventListener("change", () => {
    const day = daySelect.value.toLowerCase();

    fetch(`http://localhost:3000/api/opening-hours/${day}`)
      .then(res => res.json())
      .then(data => {
        openInput.value = data.open;
        closeInput.value = data.close;
      })
      .catch(err => {
        openInput.value = "";
        closeInput.value = "";
        console.warn("Keine Zeiten gefunden:", err);
      });
  });

  // Aktualisieren beim Klick auf "Update Hours"
  document.querySelector(".edit-openHours form").addEventListener("submit", (e) => {
    e.preventDefault();
    const day = daySelect.value.toLowerCase();
    const data = {
      open: openInput.value,
      close: closeInput.value
    };

    fetch(`http://localhost:3000/api/opening-hours/${day}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    })
      .then(res => res.json())
      .then(result => {
        alert(`Öffnungszeiten für ${day} aktualisiert: ${result.hours.open} – ${result.hours.close}`);
      })
      .catch(err => console.error("Fehler beim Aktualisieren:", err));
  });

  // Beim ersten Laden automatisch Montag anzeigen
  daySelect.dispatchEvent(new Event("change"));
});

