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
  menuContainer.innerHTML = '';
  items.forEach(item => {
    const itemDiv = document.createElement('div');
    itemDiv.classList.add('menu-item');
    itemDiv.innerHTML = `
      <h3>${item.name} - $${item.price.toFixed(2)}</h3>
      <p>${item.description}</p>
    `;
    menuContainer.appendChild(itemDiv);
  });
}

// Highlight the active filter button
function setActiveButton(activeBtn) {
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  activeBtn.classList.add('active');
}
