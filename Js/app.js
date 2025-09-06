// =========================
// Reusable function
// =========================
const getElement = (id) => document.getElementById(id);




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
        setActiveButton('all-trees');  // mark "All Trees" as active
    } catch (error) {
        console.error("Error fetching plants:", error);
    }
};
getAllPlants();



// =========================
// Show plant cards
// =========================
const showCards = (plants) => {
    const cardContainer = getElement('card-container');
    cardContainer.innerHTML = ''; // clear previous cards

    plants.forEach(plant => {
        const card = document.createElement('div');
        card.innerHTML = `
            <div class="bg-white rounded-lg shadow p-4">
                <img
                    src="${plant.image}"
                    alt="image"
                    class="mx-auto w-full mb-4 h-50 object-cover"
                />
                <h3 onclick='openModal("${plant.id}")'  class="text-lg font-semibold text-left cursor-pointer">${plant.name}</h3>
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