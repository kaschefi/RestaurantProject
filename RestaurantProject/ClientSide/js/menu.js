function appenditem(items, element) {
  const item = document.createElement("article");
  const title = document.createElement("h2");
    title.innerText = items.name;
    const description = document.createElement("p");
    description.innerText = items.description;
    const price = document.createElement("p");
    price.innerText = `Price: ${items.price}€`;
    const image = document.createElement("img");    
    image.src = items.image;
    image.alt = items.name;
    item.appendChild(image);
    item.appendChild(title);
    item.appendChild(description);
    item.appendChild(price);
    element.appendChild(item);  
}
function loadMenu() {
  const xhr = new XMLHttpRequest();
  xhr.onload = function () {
    const mainElement = document.querySelector(".menu");

    while (mainElement.childElementCount > 0) {
      mainElement.firstChild.remove();
    }

    if (xhr.status === 200) {
      const menuItems = JSON.parse(xhr.responseText);
      for (const item of menuItems) {
        
        appenditem(item, mainElement);
      }
    } else {
      mainElement.append(`Daten konnten nicht geladen werden, Status ${xhr.status} - ${xhr.statusText}`);
    }
  }

  xhr.open("GET", "/menu");
  xhr.send();
}