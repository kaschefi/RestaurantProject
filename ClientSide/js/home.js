const menuContainer = document.querySelector('.carousel');
document.querySelector('.left').addEventListener('click', scrollLeft);
document.querySelector('.right').addEventListener('click', scrollRight);
let allMenuItems = [];
let openHours = [];

// Fetch menu items from backend
fetch('http://localhost:3000/api/menu')
  .then(res => res.json())
  .then(data => {
    allMenuItems = data;
    renderMenu(allMenuItems);
  })
  .catch(err => console.error('Error fetching menu:', err));

function scrollRight() {
  document.querySelector('.carousel').scrollBy({
    left: 300,
    behavior: 'smooth'
  });
}
function scrollLeft() {
  document.querySelector('.carousel').scrollBy({
    left: -300,
    behavior: 'smooth'
  });
}
function renderMenu(items){
  items.forEach(item => {
    if(item.category === "Food"||item.category === "Soup"){
        const itemDiv = document.createElement('div');
        itemDiv.classList.add('menu-item');
        itemDiv.innerHTML = `
        <div class="menu-item-image-container">
            <img src="${item.image}" class="menu-item-image">
        </div>
        <div class="menu-item-details">
            <h3>${item.name}</h3>
            <div>
            <p>${item.description}</p>
            <p>${item.price.toFixed(2)} €</p>
        </div>  
        `;
        menuContainer.appendChild(itemDiv);
    }
  });
}
fetch('http://localhost:3000/api/openingHours')
  .then(res => res.json())
  .then(data => {
    openHours = data;
    renderOpeningHours(openHours);
  })
  .catch(err => console.error('Error fetching menu:', err));

function renderOpeningHours(openHours) {
  const timeContainer = document.querySelector(".timeContainer");
  timeContainer.innerHTML = '';
  
  Object.entries(openHours).forEach(([day, hours]) => {
    const div = document.createElement('div');
    div.innerHTML = `
      <p>${day}</p>
      <p>${hours.open} - ${hours.close}</p>
    `;
    timeContainer.appendChild(div);
  });
}