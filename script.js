const googleSheetURL = 'https://sheets.googleapis.com/v4/spreadsheets/1u57aB5atkMbABo3SXlLiBw1VG9rP_fMgMnr_3GCKvuk/values/Sheet1?key=AIzaSyA5MpOPdy6cyAZKWQ542uEBhJ5V49Il7NI';

async function fetchData() {
    const response = await fetch(googleSheetURL);
    const data = await response.json();

    const items = data.values.slice(1); 

    document.getElementById('logo').src = 'items[0][4]';

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
            <p>Price: ${price}</p>
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

document.addEventListener('DOMContentLoaded', fetchData);
