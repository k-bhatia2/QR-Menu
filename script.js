const googleSheetURL = 'https://sheets.googleapis.com/v4/spreadsheets/1u57aB5atkMbABo3SXlLiBw1VG9rP_fMgMnr_3GCKvuk/values/Sheet1?key=AIzaSyA5MpOPdy6cyAZKWQ542uEBhJ5V49Il7NI';
let cart = [];

async function fetchData() {
    const response = await fetch(googleSheetURL);
    const data = await response.json();

    const items = data.values.slice(1); 
    document.getElementById('logo').src = 'item[0][4]';

    const categories = [...new Set(items.map(item => item[2]))];

    const categoryPills = document.getElementById('category-pills');
    categoryPills.innerHTML = '<div class="category-pill" onclick="filterItems(\'all\')">All</div>';
    categories.forEach(category => {
        const pill = document.createElement('div');
        pill.className = 'category-pill';
        pill.textContent = category;
        pill.onclick = () => filterItems(category);
        categoryPills.appendChild(pill);
    });

    renderItems(items);
}

function renderItems(items) {
    const menuContainer = document.getElementById('menu-container');
    menuContainer.innerHTML = '';

    items.forEach(item => {
        const [name, price, category, imageLink] = item;

        const itemDiv = document.createElement('div');
        itemDiv.className = 'menu-item';
        itemDiv.innerHTML = `
            <img src="${imageLink}" alt="${name}">
            <h3>${name}</h3>
            <p>Price: ₹${price}</p>
            <button onclick="addToCart('${name}', ${price})">Add to Cart</button>
        `;

        menuContainer.appendChild(itemDiv);
    });
}

function filterItems(category) {
    fetch(googleSheetURL)
        .then(response => response.json())
        .then(data => {
            const items = data.values.slice(1);
            const filteredItems = category === 'all' ? items : items.filter(item => item[2] === category);
            renderItems(filteredItems);
        });
}
function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.remove('hidden');
    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
        toast.classList.add('hidden');
    }, 3000); 
}

function addToCart(item) {
    cart.push(item);
    updateCartButton();
    showToast('Item added to cart!'); 
}


function updateCartButton() {
    const cartButton = document.getElementById('cart-button');
    cartButton.textContent = `🛒 Cart (${cart.length})`;
}

function showCart() {
    const cartSection = document.getElementById('cart');
    const cartItems = document.getElementById('cart-items');
    const totalAmount = document.getElementById('total-amount');

    cartItems.innerHTML = '';
    let total = 0;

    cart.forEach((item, index) => {
        const li = document.createElement('li');
        li.textContent = `${item.name} - ₹${item.price}`;

        const deleteButton = document.createElement('button');
        deleteButton.textContent = '❌'; 
        deleteButton.onclick = () => deleteFromCart(index);

        li.appendChild(deleteButton);
        cartItems.appendChild(li);
        total += item.price;
    });

    totalAmount.textContent = `₹${total}`;
    cartSection.classList.remove('hidden');
}

function deleteFromCart(index) {
    cart.splice(index, 1);
    updateCartButton();
    showCart(); // Re-render the cart to update the UI
}


function closeCart() {
    const cartSection = document.getElementById('cart');
    cartSection.classList.add('hidden');
}

document.getElementById('cart-button').addEventListener('click', showCart);
document.getElementById('close-cart').addEventListener('click', closeCart);
document.addEventListener('DOMContentLoaded', fetchData);
