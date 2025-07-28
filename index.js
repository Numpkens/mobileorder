import { menuArr } from './menuArray.js'

const menuHtml = []

menuArr.forEach(function(item) {
  menuHtml.push(`
    <div class="food-container">
        <img src="${item.image}" class="food-image">
        <div class="food-details">
          <h4 class="food-name">${item.title}</h4>
          <p class="food-description">${item.decription}</p>
          <p class="food-price">${item.cost}</p>
        </div>
        <button class="order-btn">+</button>
      </div>
  `)
})

document.getElementById('menu-container').innerHTML = menuHtml.join('')

console.log(menuHtml)