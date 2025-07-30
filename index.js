import { menuArr } from './menuArray.js';

const menuHtml = [];

// populate menu items
menuArr.forEach(function(item) {
  console.log("Creating item:", item.title, "Cost:", item.cost);

  menuHtml.push(`
    <div class="food-container">
        <img src="${item.image}" class="food-image">
        <div class="food-details">
          <h4 class="food-name">${item.title}</h4>
          <p class="food-description">${item.description}</p>
          <p class="food-price">${item.cost}</p>
        </div>
        <button class="order-btn" data-item-title="${item.title}" data-item-cost="${item.cost}">+</button>
      </div>
  `);
});

document.getElementById('menu-container').innerHTML = menuHtml.join('');

// make the add button interactive
document.getElementById('menu-container').addEventListener('click', function(e) {
  if (e.target.classList.contains('order-btn')) {
    console.log("button clicked!")
    const itemTitle = e.target.dataset.itemTitle;
    const itemCostRaw = e.target.dataset.itemCost;

    console.log("Raw cost from dataset:", itemCostRaw);
    console.log("After replace and trim:", itemCostRaw.replace('$', "").trim());

    const itemCost = parseFloat(itemCostRaw.replace('$', "").trim());
    console.log(`Clicked on: ${itemTitle}, Price: ${itemCost}`);
  }
});