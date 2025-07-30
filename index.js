import { menuArr } from './menuArray.js';

const menuHtml = [];
let shoppingCart = [];

// populate menu items
menuArr.forEach(function(item) {
  

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
    const itemTitle = e.target.dataset.itemTitle;
    const itemCostRaw = e.target.dataset.itemCost;
    const itemCost = parseFloat(itemCostRaw.replace('$', "").trim());
    const existingItem = shoppingCart.find(item => item.title === itemTitle);

    if (existingItem){
      existingItem.quanity++
    }
    else{
      shoppingCart.push({
        title: itemTitle,
        cost: itemCost,
        quanity: 1,
      });

    }

  }
  console.log(shoppingCart);
});

function updatedOrder(){
  let total = 0;
  shoppingCart.forEach(item => {
  total += item.cost * item.quanity;
  return
});
}
console.log(updatedOrder());
