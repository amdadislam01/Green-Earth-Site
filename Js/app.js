// === Reusable function ===
const $ = (id) => document.getElementById(id);

let allPlants = [];
let cart = [];

// === Loading System ===
const toggleLoading = (id, show) => $(id).classList.toggle("hidden", !show);

// === Fetch Plants ===
const getAllPlants = async () => {
  toggleLoading("loading", true);

  try {
    const res = await fetch("https://openapi.programming-hero.com/api/plants");
    const { plants } = await res.json();

    if (plants) {
      allPlants = plants;
      setTimeout(() => {
        showCards(allPlants);
        toggleLoading("loading", false);
      }, 800);
    } else {
      console.error("No plants found");
      toggleLoading("loading", false);
    }
  } catch (err) {
    console.error("Error fetching plants:", err);
    toggleLoading("loading", false);
  }
};
getAllPlants();

// === Fetch Categories ===
const getAllCategories = async () => {
  try {
    const res = await fetch("https://openapi.programming-hero.com/api/categories");
    const { categories } = await res.json();
    showCategories(categories || []);
  } catch (err) {
    console.error("Error fetching categories:", err);
  }
};
getAllCategories();

// === Show Cards ===
const showCards = (plants) => {
  const box = $("card-container");
  box.innerHTML = "";

  plants.forEach(({ id, name, image, description, category, price }) => {
    const card = document.createElement("div");
    card.className = "bg-white rounded-lg shadow p-4";

    card.innerHTML = `
      <img src="${image}" alt="${name}" class="mx-auto w-full mb-4 h-50 object-cover"/>
      <h3 class="text-lg font-semibold text-left cursor-pointer">${name}</h3>
      <p class="text-sm text-gray-600 text-left">${description}</p>
      <div class="flex justify-between items-center mt-2">
        <p class="text-green-500 text-sm bg-[#DCFCE7] p-2 rounded-full">${category}</p>
        <p class="font-bold">৳${price}</p>
      </div>
      <button class="mt-4 w-full bg-green-600 hover:bg-white cursor-pointer hover:border hover:border-gray-400 hover:text-black font-bold text-lg text-white py-3 rounded-full">Add to Cart</button>
    `;

    card.querySelector("h3").onclick = () => openModal(id);
    card.querySelector("button").onclick = () => addToCart({ id, name, price });

    box.appendChild(card);
  });
};

// === Show Categories ===
const showCategories = (cats) => {
  const box = $("category");
  box.innerHTML = "";

  const makeBtn = (text, handler) => {
    const a = document.createElement("a");
    a.href = "#";
    a.textContent = text;
    a.className =
      "px-2.5 py-2 rounded-sm duration-300 hover:bg-green-600 hover:text-white cursor-pointer block";
    a.onclick = (e) => {
      e.preventDefault();
      setActiveButton(a);
      toggleLoading("loading", true);
      setTimeout(() => {
        handler();
        toggleLoading("loading", false);
      }, 800);
    };
    return a;
  };

  box.appendChild(makeBtn("All Trees", () => showCards(allPlants)));

  cats.forEach(({ category_name }) => {
    const li = document.createElement("li");
    li.appendChild(
      makeBtn(category_name, () =>
        showCards(allPlants.filter((p) => p.category === category_name))
      )
    );
    box.appendChild(li);
  });
};

// === Active Button ===
const setActiveButton = (btn) => {
  $("category")
    .querySelectorAll("a")
    .forEach((a) => a.classList.remove("bg-green-600", "text-white"));
  btn.classList.add("bg-green-600", "text-white");
};

// === Modal ===
const openModal = async (id) => {
  try {
    const res = await fetch(`https://openapi.programming-hero.com/api/plant/${id}`);
    const { plants } = await res.json();

    $("modal_container").innerHTML = `
      <div class="space-y-3">
        <h4 class="text-xl font-bold">${plants.name}</h4>
        <img class="w-full rounded-lg h-50 object-cover" src="${plants.image}" alt="${plants.name}">
        <p class="font-bold">Category: <span class="font-normal">${plants.category}</span></p>
        <p class="font-bold">Price: <span class="font-normal">৳${plants.price}</span></p>
        <p class="font-bold">Description: <span class="font-normal">${plants.description}</span></p>
      </div>
    `;
    $("my_modal_5").showModal();
  } catch (err) {
    console.error("Error loading plant details:", err);
  }
};

// === Cart ===
const addToCart = ({ id, name, price }) => {
  const found = cart.find((i) => i.id === id);
  found ? found.quantity++ : cart.push({ id, name, price, quantity: 1 });
  alert(`${name} added to cart 🛒`);
  renderCart();
};

const renderCart = () => {
  const list = $("cart-items");
  list.innerHTML = "";
  let total = 0;

  cart.forEach(({ id, name, price, quantity }) => {
    total += price * quantity;
    const li = document.createElement("li");
    li.className =
      "bg-green-50 rounded-lg p-3 flex justify-between items-center";
    li.innerHTML = `
      <div>
        <p class="font-semibold">${name}</p>
        <p class="text-gray-600 text-sm">৳${price} × ${quantity}</p>
      </div>
      <button class="text-gray-500 hover:text-red-600 text-xl font-bold cursor-pointer">✕</button>
    `;
    li.querySelector("button").onclick = () => removeFromCart(id);
    list.appendChild(li);
  });

  $("cart-total").textContent = `৳${total}`;
};

const removeFromCart = (id) => {
  cart = cart.filter((i) => i.id !== id);
  renderCart();
};
