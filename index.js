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
    itemElement.innerHTML =`
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

// Checkout modal functions
function showCheckoutModal() {
  const modal = document.getElementById('checkout-modal');
  const checkoutTotal = document.getElementById('checkout-total');
  checkoutTotal.textContent = updatedOrder().toFixed(2);
  modal.classList.remove('hidden');
}

function hideCheckoutModal() {
  const modal = document.getElementById('checkout-modal');
  modal.classList.add('hidden');
  clearFormErrors();
}

function showSuccessModal() {
  const modal = document.getElementById('success-modal');
  modal.classList.remove('hidden');
}

function hideSuccessModal() {
  const modal = document.getElementById('success-modal');
  modal.classList.add('hidden');
  shoppingCart = [];
  updateAllQuantityDisplays();
  updatedOrderDisplay();
  hideOrderModal();
  hideCheckoutModal();
}

function formatCardNumber(value) {
  const numbers = value.replace(/\D/g, '');
  return numbers.replace(/(\d{4})(?=\d)/g, '$1 ');
}

function formatExpiryDate(value) {
  const numbers = value.replace(/\D/g, '');
  if (numbers.length >= 2) {
    return numbers.substring(0, 2) + '/' + numbers.substring(2, 4);
  }
  return numbers;
}

function validateCardNumber(cardNumber) {
  const numbers = cardNumber.replace(/\s/g, '');
  return /^\d{16}$/.test(numbers);
}


function validateExpiryDate(expiryDate) {
  if (!/^\d{2}\/\d{2}$/.test(expiryDate)) {
    return false;
  }
  
  const [month, year] = expiryDate.split('/').map(num => parseInt(num));
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear() % 100;
  const currentMonth = currentDate.getMonth() + 1;
  
  if (month < 1 || month > 12) {
    return false;
  }
  
  if (year < currentYear || (year === currentYear && month < currentMonth)) {
    return false;
  }
  
  return true;
}

function validateCVV(cvv) {
  return /^\d{3}$/.test(cvv);
}

function validateName(name) {
  return name.trim().length >= 2;
}

function showError(fieldId, message) {
  const field = document.getElementById(fieldId);
  const errorElement = document.getElementById(fieldId + '-error');
  field.classList.add('error');
  errorElement.textContent = message;
}

function clearError(fieldId) {
  const field = document.getElementById(fieldId);
  const errorElement = document.getElementById(fieldId + '-error');
  field.classList.remove('error');
  errorElement.textContent = '';
}

function clearFormErrors() {
  const fields = ['card-name', 'card-number', 'expiry-date', 'cvv'];
  fields.forEach(field => clearError(field));
}

function updateAllQuantityDisplays() {
  const quantityDisplays = document.querySelectorAll('.quantity-display');
  quantityDisplays.forEach(display => {
    display.textContent = '0';
  });
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

document.getElementById('order-modal').addEventListener('click', function(e){
  if(e.target === this){
    hideOrderModal();
  }
});

// Checkout event listeners
document.getElementById('checkout-btn').addEventListener('click', function() {
  if (shoppingCart.length > 0) {
    hideOrderModal();
    showCheckoutModal();
  }
});

document.getElementById('cancel-checkout').addEventListener('click', function() {
  hideCheckoutModal();
});

document.getElementById('close-success').addEventListener('click', function() {
  hideSuccessModal();
});

document.getElementById('card-number').addEventListener('input', function(e) {
  const formatted = formatCardNumber(e.target.value);
  e.target.value = formatted;
  clearError('card-number');
});

document.getElementById('expiry-date').addEventListener('input', function(e) {
  const formatted = formatExpiryDate(e.target.value);
  e.target.value = formatted;
  clearError('expiry-date');
});

document.getElementById('cvv').addEventListener('input', function(e) {
  e.target.value = e.target.value.replace(/\D/g, '');
  clearError('cvv');
});

document.getElementById('card-name').addEventListener('input', function(e) {
  clearError('card-name');
});

document.getElementById('checkout-form').addEventListener('submit', function(e) {
  e.preventDefault();
  
  const cardName = document.getElementById('card-name').value;
  const cardNumber = document.getElementById('card-number').value;
  const expiryDate = document.getElementById('expiry-date').value;
  const cvv = document.getElementById('cvv').value;
  
  clearFormErrors();
  
  let isValid = true;
  
  if (!validateName(cardName)) {
    showError('card-name', 'Please enter a valid name (at least 2 characters)');
    isValid = false;
  }
  
  if (!validateCardNumber(cardNumber)) {
    showError('card-number', 'Please enter a valid 16-digit card number');
    isValid = false;
  }
  
  if (!validateExpiryDate(expiryDate)) {
    showError('expiry-date', 'Please enter a valid future date (MM/YY)');
    isValid = false;
  }
  
  if (!validateCVV(cvv)) {
    showError('cvv', 'Please enter a valid 3-digit CVV');
    isValid = false;
  }
  
  if (isValid) {
    showSuccessModal();
  }
});

document.getElementById('checkout-modal').addEventListener('click', function(e) {
  if (e.target === this) {
    hideCheckoutModal();
  }
});

document.getElementById('success-modal').addEventListener('click', function(e) {
  if (e.target === this) {
    hideSuccessModal();
  }
});
    
