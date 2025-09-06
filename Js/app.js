// =========================
// Reusable function
// =========================
const getElement = (id) => document.getElementById(id);

let allPlants = [];
let cart = []; // 🛒 cart array

// =========================
// Loading System
// =========================
const toggleLoading = (id, show) => {
  const el = getElement(id);
  if (show) {
    el.classList.remove("hidden");
  } else {
    el.classList.add("hidden");
  }
};

// =========================
// Fetch all plants from API
// =========================
const getAllPlants = async () => {
  toggleLoading("loading", true);

  try {
    const url = "https://openapi.programming-hero.com/api/plants";
    const response = await fetch(url);
    const data = await response.json();

    if (data && data.plants) {
      allPlants = data.plants;
      setTimeout(() => {
        showCards(allPlants);
        toggleLoading("loading", false);
      }, 800);
    } else {
      console.error("No plants found");
      toggleLoading("loading", false);
    }
  } catch (error) {
    console.error("Error fetching plants:", error);
    toggleLoading("loading", false);
  }
};
getAllPlants();

// =========================
// Fetch all categories from API
// =========================
const getAllCategories = async () => {
  try {
    const url = "https://openapi.programming-hero.com/api/categories";
    const response = await fetch(url);
    const data = await response.json();
    showCategories(data.categories);
    setActiveButton("all-trees");
  } catch (error) {
    console.error("Error fetching categories:", error);
  }
};
getAllCategories();

// =========================
// Show plant cards
// =========================
const showCards = (plants) => {
  const cardContainer = getElement("card-container");
  cardContainer.innerHTML = "";

  plants.forEach((plant) => {
    const card = document.createElement("div");
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
          <button onclick='addToCart(${JSON.stringify(
            plant
          )})' class="mt-4 w-full bg-green-600 hover:bg-white hover:border cursor-pointer hover:border-gray-400 hover:text-black font-bold text-lg text-white py-3 rounded-full">
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
  const categoriesContainer = getElement("category");
  categoriesContainer.innerHTML = "";

  // -------- All Trees button --------
  const allBtn = document.createElement("a");
  allBtn.href = "#";
  allBtn.id = "all-trees";
  allBtn.innerText = "All Trees";
  allBtn.className =
    "px-2.5 py-2 rounded-sm duration-300 hover:bg-green-600 hover:text-white cursor-pointer block";

  allBtn.addEventListener("click", (e) => {
    e.preventDefault();
    setActiveButton("all-trees");
    toggleLoading("loading", true);

    setTimeout(() => {
      showCards(allPlants);
      toggleLoading("loading", false);
    }, 500);
  });

  categoriesContainer.appendChild(allBtn);

  // -------- Other categories --------
  categories.forEach((category) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <a href="#"
         class="px-2.5 py-2 rounded-sm duration-300 hover:bg-green-600 hover:text-white cursor-pointer block">
         ${category.category_name}
      </a>
    `;
    const categoryBtn = li.querySelector("a");

    categoryBtn.addEventListener("click", (e) => {
      e.preventDefault();
      setActiveButton(categoryBtn);
      toggleLoading("loading", true);

      const filteredPlants = allPlants.filter(
        (plant) => plant.category === category.category_name
      );

      setTimeout(() => {
        showCards(filteredPlants);
        toggleLoading("loading", false);
      }, 500);
    });

    categoriesContainer.appendChild(li);
  });
};

// =========================
// Set active button
// =========================
const setActiveButton = (btn) => {
  const categories = getElement("category");
  categories.querySelectorAll("a").forEach((a) =>
    a.classList.remove("bg-green-600", "text-white")
  );

  if (typeof btn === "string") {
    getElement(btn).classList.add("bg-green-600", "text-white");
  } else {
    btn.classList.add("bg-green-600", "text-white");
  }
};

// =========================
// Card Details Modal
// =========================
const openModal = async (id) => {
  const url = `https://openapi.programming-hero.com/api/plant/${id}`;
  const response = await fetch(url);
  const data = await response.json();
  const plant = data.plants;

  const modalContainer = getElement("modal_container");
  modalContainer.innerHTML = `
    <div class="space-y-3">
        <h4 class="text-xl font-bold">${plant.name}</h4>
        <img class="w-full rounded-lg h-50 object-cover" src="${plant.image}" alt="${plant.name}">
        <p class="font-bold">Category: <span class="font-normal">${plant.category}</span></p>
        <p class="font-bold">Price: <span class="font-normal">৳${plant.price}</span></p>
        <p class="font-bold">Description: <span class="font-normal">${plant.description}</span></p>
    </div>
  `;
  getElement("my_modal_5").showModal();
};

// =========================
// 🛒 Cart Functions
// =========================
function addToCart(product) {
  const productId = product.id || product.plantId || product._id;
  const existing = cart.find((item) => item.id === productId);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({
      id: productId,
      name: product.name,
      price: product.price,
      quantity: 1,
    });
  }

  alert(`${product.name} added to cart 🛒`);
  renderCart();
}

function renderCart() {
  const cartItems = getElement("cart-items");
  const cartTotal = getElement("cart-total");

  cartItems.innerHTML = "";
  let total = 0;

  cart.forEach((item) => {
    const li = document.createElement("li");
    li.className =
      "bg-green-50 rounded-lg p-3 flex justify-between items-center";

    li.innerHTML = `
      <div>
        <p class="font-semibold">${item.name}</p>
        <p class="text-gray-600 text-sm">৳${item.price} × ${item.quantity}</p>
      </div>
      <button class="text-gray-500 hover:text-red-600 text-xl font-bold cursor-pointer" onclick="removeFromCart('${item.id}')">
        ✕
      </button>
    `;

    cartItems.appendChild(li);
    total += item.price * item.quantity;
  });

  cartTotal.textContent = `৳${total}`;
}

function removeFromCart(id) {
  cart = cart.filter((item) => item.id.toString() !== id.toString());
  renderCart();
}
