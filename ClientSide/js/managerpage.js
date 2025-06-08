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