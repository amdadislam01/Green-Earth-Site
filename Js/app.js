// === Reusable function ===
const $ = (id) => document.getElementById(id);

let allPlants = [], cart = [];

// === Loading System ===
const toggleLoading = (id, show) => $(id).classList.toggle("hidden", !show);

// === Fetch Plants ===
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

// === Fetch Categories ===
async function getAllCategories() {
  try {
    const res = await fetch("https://openapi.programming-hero.com/api/categories");
    const data = await res.json();
    showCategories(data.categories || []);
  } catch (err) {
    console.error("Error fetching categories:", err);
  }
}
getAllCategories();

// === Show Cards ===
function showCards(plants) {
  const box = $("card-container");
  box.innerHTML = "";

  plants.forEach(p => {
    const card = document.createElement("div");
    card.className = "bg-white rounded-lg shadow p-4";

    card.innerHTML = `
      <img src="${p.image}" alt="${p.name}" class="mx-auto w-full mb-4 h-50 object-cover"/>
      <h3 class="text-lg font-semibold text-left cursor-pointer">${p.name}</h3>
      <p class="text-sm text-gray-600 text-left">${p.description}</p>
      <div class="flex justify-between items-center mt-2">
        <p class="text-green-500 text-sm bg-[#DCFCE7] p-2 rounded-full">${p.category}</p>
        <p class="font-bold">৳${p.price}</p>
      </div>
      <button class="mt-4 w-full bg-green-600 hover:bg-white cursor-pointer hover:border hover:border-gray-400 hover:text-black font-bold text-lg text-white py-3 rounded-full">Add to Cart</button>
    `;

    // modal
    card.querySelector("h3").onclick = () => openModal(p.id);
    // cart
    card.querySelector("button").onclick = () => addToCart(p);

    box.appendChild(card);
  });
}

// === Show Categories ===
function showCategories(cats) {
  const box = $("category");
  box.innerHTML = "";

  const makeBtn = (text, btn) => {
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
        btn(); 
        toggleLoading("loading", false);
      }, 800); 
    };
    return a;
  };

  box.appendChild(makeBtn("All Trees", () => showCards(allPlants)));

  cats.forEach((c) => {
    const li = document.createElement("li");
    li.appendChild(
      makeBtn(c.category_name, () => {
        showCards(allPlants.filter((p) => p.category === c.category_name));
      })
    );
    box.appendChild(li);
  });
}


// === Active Button ===
function setActiveButton(btn) {
  $("category").querySelectorAll("a").forEach(a => a.classList.remove("bg-green-600", "text-white"));
  btn.classList.add("bg-green-600", "text-white");
}

// === Modal ===
async function openModal(id) {
  try {
    const res = await fetch(`https://openapi.programming-hero.com/api/plant/${id}`);
    const item = (await res.json()).plants;
    $("modal_container").innerHTML = `
      <div class="space-y-3">
        <h4 class="text-xl font-bold">${item.name}</h4>
        <img class="w-full rounded-lg h-50 object-cover" src="${item.image}" alt="${item.name}">
        <p class="font-bold">Category: <span class="font-normal">${item.category}</span></p>
        <p class="font-bold">Price: <span class="font-normal">৳${item.price}</span></p>
        <p class="font-bold">Description: <span class="font-normal">${item.description}</span></p>
      </div>
    `;
    $("my_modal_5").showModal();
  } catch (err) {
    console.error("Error loading plant details:", err);
  }
}

// === Cart ===
function addToCart(p) {
  const found = cart.find(i => i.id === p.id);
  found ? found.quantity++ : cart.push({ id: p.id, name: p.name, price: p.price, quantity: 1 });
  alert(`${p.name} added to cart 🛒`);
  renderCart();
}

function renderCart() {
  const list = $("cart-items");
  list.innerHTML = "";
  let total = 0;

  cart.forEach(item => {
    total += item.price * item.quantity;
    const li = document.createElement("li");
    li.className = "bg-green-50 rounded-lg p-3 flex justify-between items-center";
    li.innerHTML = `
      <div>
        <p class="font-semibold">${item.name}</p>
        <p class="text-gray-600 text-sm">৳${item.price} × ${item.quantity}</p>
      </div>
      <button class="text-gray-500 hover:text-red-600 text-xl font-bold cursor-pointer">✕</button>
    `;
    li.querySelector("button").onclick = () => removeFromCart(item.id);
    list.appendChild(li);
  });

  $("cart-total").textContent = `৳${total}`;
}

function removeFromCart(id) {
  cart = cart.filter(i => i.id !== id);
  renderCart();
}
