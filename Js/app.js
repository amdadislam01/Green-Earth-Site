// =========================
// Reusable function
// =========================
const getElement = (id) => document.getElementById(id);

let allPlants = []; 


// =========================
// Fetch all plants from API
// =========================
const getAllPlants = async () => {
    try {
        const url = 'https://openapi.programming-hero.com/api/plants';
        const response = await fetch(url);
        const data = await response.json();
        allPlants = data.plants;
        showCards(allPlants); 
    } catch (error) {
        console.error("Error fetching plants:", error);
    }
};
getAllPlants();


// =========================
// Fetch all categories from API
// =========================
const getAllCategories = async () => {
    try {
        const url = 'https://openapi.programming-hero.com/api/categories';
        const response = await fetch(url);
        const data = await response.json();
        showCategories(data.categories);
        setActiveButton('all-trees');  
    } catch (error) {
        console.error("Error fetching categories:", error);
    }
};
getAllCategories();


// =========================
// Show plant cards
// =========================
const showCards = (plants) => {
    const cardContainer = getElement('card-container');
    cardContainer.innerHTML = ''; 

    plants.forEach(plant => {
        const card = document.createElement('div');
        card.innerHTML = `
            <div class="bg-white rounded-lg shadow p-4">
                <img
                    src="${plant.image}"
                    alt="image"
                    class="mx-auto w-full mb-4 h-50 object-cover"
                />
                <h3 onclick='openModal("${plant.id}")'  
                    class="text-lg font-semibold text-left cursor-pointer">${plant.name}</h3>
                <p class="text-sm text-gray-600 text-left">${plant.description}</p>
                <div class="flex justify-between items-center mt-2">
                    <p class="text-green-500 text-sm bg-[#DCFCE7] p-2 rounded-full">${plant.category}</p>
                    <p class="font-bold">৳${plant.price}</p>
                </div>
                <button class="mt-4 w-full bg-green-600 font-bold text-lg text-white py-3 rounded-full">
                    Add to Cart
                </button>
            </div>
        `;
        cardContainer.appendChild(card);
    });
};


// =========================
// Show categories
// =========================
const showCategories = (categories) => {
    const categoriesContainer = getElement('category');
    categoriesContainer.innerHTML = ''; 

    // -------- All Trees button --------
    const allBtn = document.createElement('a');
    allBtn.href = '#';
    allBtn.id = 'all-trees';
    allBtn.innerText = 'All Trees';
    allBtn.className = "px-2.5 py-2 rounded-sm duration-300 hover:bg-green-600 hover:text-white cursor-pointer block";

    allBtn.addEventListener('click', (e) => {
        e.preventDefault();
        setActiveButton('all-trees');
        showCards(allPlants);
    });

    categoriesContainer.appendChild(allBtn);

    // -------- Other categories --------
    categories.forEach(category => {
        const li = document.createElement('li');
        li.innerHTML = `
            <a href="#"
               class="px-2.5 py-2 rounded-sm duration-300 hover:bg-green-600 hover:text-white cursor-pointer block">
               ${category.category_name}
            </a>
        `;
        const categoryBtn = li.querySelector('a');

        categoryBtn.addEventListener('click', (e) => {
            e.preventDefault();
            setActiveButton(categoryBtn);
            const filteredPlants = allPlants.filter(plant => plant.category === category.category_name);
            showCards(filteredPlants);
        });

        categoriesContainer.appendChild(li);
    });
};


// =========================
// Set active button
// =========================
const setActiveButton = (btn) => {
    const categories = getElement('category');
    categories.querySelectorAll('a').forEach(a => 
        a.classList.remove('bg-green-600', 'text-white')
    );

    if (typeof btn === 'string') {
        getElement(btn).classList.add('bg-green-600', 'text-white');
    } else {
        btn.classList.add('bg-green-600', 'text-white');
    }
};
