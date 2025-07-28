import { menuArr } from './menuArray.js'
const menuHtml = []
menuArr.forEach(function(item){
  menuHtml.push(`
    <section class= "card">
        <div class="card=start">
          <img src="/images/${item.image}">
        </div>
        <div class="card-mid">
          <h4 class="card-title">${item.title}</h4>
          <p class="card-desc">${item.decription}</p>
        </div>
        <div class="card-end">
          <p class="card-menu">...</p>
        </div>
      </section>
    ') 
}).join('')

document.getElementById('menu-container').innerHTML = menuHtml