const menuContainer = document.querySelector('.menu');
const filterContainer = document.querySelector('.filter');

let allMenuItems = [];

// Fetch menu items from backend
fetch('http://localhost:3000/api/menu')
  .then(res => res.json())
  .then(data => {
    allMenuItems = data;
    renderFilters();
    renderMenuItems(allMenuItems);
    
  })
  .catch(err => console.error('Error fetching menu:', err));

// Render filter buttons dynamically based on categories
function renderFilters() {
  const categories = ['All', ...new Set(allMenuItems.map(item => item.category))];
  categories.forEach(category => {

    const btn = document.createElement('button');
    btn.textContent = category;
    btn.classList.add('filter-btn');
    btn.addEventListener('click', () => {
      if (category === 'All') {
        renderMenuItems(allMenuItems);
      } else {
        const filtered = allMenuItems.filter(item => item.category === category);
        renderMenuItems(filtered);
      }
      setActiveButton(btn);
    });
    filterContainer.appendChild(btn);
  });
  // Set "All" as active initially
  setActiveButton(filterContainer.querySelector('button'));
}

// Render menu items into container
function renderMenuItems(items) {
  let lastCategory = '';
  let categorySection;

  menuContainer.innerHTML = '';

  items.forEach(item => {
    if (item.category !== lastCategory) {
      const categoryHeader = document.createElement('h2');
      categoryHeader.classList.add('menu-category');
      categoryHeader.textContent = item.category;

      // Container for items in this category
      categorySection = document.createElement('div');
      categorySection.classList.add('menu-category-items');

      menuContainer.appendChild(categoryHeader);
      menuContainer.appendChild(categorySection);

      lastCategory = item.category;
    }
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
    categorySection.appendChild(itemDiv);
  });
}

// Highlight the active filter button
function setActiveButton(activeBtn) {
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  
  activeBtn.classList.add('active');
}
