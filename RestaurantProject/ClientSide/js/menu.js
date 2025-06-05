document.addEventListener('DOMContentLoaded', () => {
  const menuContainer = document.querySelector('.menu');

  // Clear the menu container just in case
  menuContainer.innerHTML = '<p>Loading menu...</p>';

  fetch('http://localhost:3000/api/menu')
    .then(response => {
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.status}`);
      }
      return response.json();
    })
    .then(menuItems => {
      if (!Array.isArray(menuItems) || menuItems.length === 0) {
        menuContainer.innerHTML = '<p>No menu items found.</p>';
        return;
      }

      menuContainer.innerHTML = ''; // Clear loading text

      menuItems.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.classList.add('menu-item');
        itemDiv.innerHTML = `
          <h3>${item.name} - $${item.price.toFixed(2)}</h3>
          <p>${item.description}</p>
        `;
        menuContainer.appendChild(itemDiv);
      });
    })
    .catch(error => {
      console.error('Error fetching the menu:', error);
      menuContainer.innerHTML = '<p>Failed to load menu. Please try again later.</p>';
    });
});
