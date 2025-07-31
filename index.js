import { menuArr } from './menuArray.js';

const menuHtml = [];
let shoppingCart = [];

// populate menu items and increment and decrement buttons
menuArr.forEach(function(item) {
  menuHtml.push(`
    <div class="food-container">
      <img src="${item.image}" class="food-image">
      <div class="food-details">
        <h4 class="food-name">${item.title}</h4>
        <p class="food-description">${item.description}</p>
        <p class="food-price">${item.cost}</p>
      </div>
      <div class="quantity-controls">
        <button class="order-btn decrement-btn" data-item-title="${item.title}" data-item-cost="${item.cost}">-</button>
        <span class="quantity-display" data-item-title="${item.title}">0</span>
        <button class="order-btn increment-btn" data-item-title="${item.title}" data-item-cost="${item.cost}">+</button>
      </div>
    </div>
  `);
});

document.getElementById('menu-container').innerHTML = menuHtml.join('');

// Define functions 
function updatedOrder() {
  let total = 0;
  console.log("Shopping cart contents:", shoppingCart);
  
  shoppingCart.forEach(item => {
    console.log("Processing item:", item.title, "Cost:", item.cost, "Quantity:", item.quantity);
    
    let itemPrice = typeof item.cost === 'string' ? 
      parseFloat(item.cost.replace('$', '').trim()) : 
      item.cost;
    
    let itemTotal = itemPrice * item.quantity;
    total += itemTotal;
    
    console.log("Item total:", itemTotal, "Running total:", total);
  });
  
  return total; 
}

function updatedOrderDisplay() {
  const total = updatedOrder();
  const totalElement = document.getElementById('order-total');
  totalElement.textContent = total.toFixed(2); 
}

function updateQuantityDisplay(itemTitle){
  const quantityElement = document.querySelector(`[data-item-title="${itemTitle}"].quantity-display`);
  const cartItem = shoppingCart.find(item => item.title === itemTitle);
  const quantity = cartItem ? cartItem.quantity : 0;
  quantityElement.textContent = quantity;
}

function showOrderModal(){
  const modal = document.getElementById('order-modal');
  const orderItemsContainer = document.getElementById('order-items');
  const modalTotal = document.getElementById('modal-total')

  orderItemsContainer.innerHTML = "";
  

  shoppingCart.forEach(item =>{
    const itemElement = document.createElement('div');
    itemElement.innerHtml =`
      <div style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee;">
        <span>${item.title}</span>
        <span>${item.quantity} x $${item.cost.toFixed(2)} = $${(item.cost * item.quantity).toFixed(2)}</span>
      </div>
    `;
    orderItemsContainer.appendChild(itemElement);
  });

  modalTotal.textContent = updatedOrder().toFixed(2);

  modal.classList.remove('hidden')
}

function hideOrderModal() {
  const modal = document.getElementById('order-modal');
  modal.classList.add('hidden')
}


document.getElementById('menu-container').addEventListener('click', function(e) {
  if (e.target.classList.contains('increment-btn') || e.target.classList.contains('decrement-btn')) {
    const itemTitle = e.target.dataset.itemTitle;
    const itemCostRaw = e.target.dataset.itemCost;
    const itemCost = parseFloat(itemCostRaw.replace('$', "").trim());
    
    const existingItem = shoppingCart.find(item => item.title === itemTitle);
    
    if (e.target.classList.contains('increment-btn')) {
      // Handle increment (+)
      if (existingItem) {
        existingItem.quantity++;
      } else {
        shoppingCart.push({
          title: itemTitle,
          cost: itemCost,
          quantity: 1,
        });
      }
    } else if (e.target.classList.contains('decrement-btn')) {
      // Handle decrement (-)
      if (existingItem && existingItem.quantity > 0) {
        existingItem.quantity--;
        
        // Remove item if quantity becomes 0
        if (existingItem.quantity === 0) {
          const index = shoppingCart.indexOf(existingItem);
          shoppingCart.splice(index, 1);
        }
      }
    }
    
    updateQuantityDisplay(itemTitle);
    updatedOrderDisplay();
    console.log(shoppingCart);
  }
});

document.getElementById('view-order-btn').addEventListener('click', function(){
  if (shoppingCart.length > 0){
    showOrderModal();
  }else{
    alert('Your cart is empty');
  }
});

document.getElementById('close-order').addEventListener('click', function(){
  hideOrderModal();
})

document.getElementById('order-modeal').addEventListener('click', function(e){
  if(e.target === this){
    hideOrderModal();
  }
})
    
