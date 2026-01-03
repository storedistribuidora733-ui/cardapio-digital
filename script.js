let cart = [];

const cartModal = document.getElementById("cart-modal");
const cartItems = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const cartCount = document.getElementById("cart-count");

document.querySelectorAll(".add-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const name = btn.dataset.name;
    const price = Number(btn.dataset.price);
    const image = btn.dataset.image;

    const item = cart.find(p => p.name === name);
    if (item) {
      item.qty++;
    } else {
      cart.push({ name, price, image, qty: 1 });
    }

    updateCart();
    openCart();
  });
});

function updateCart() {
  cartItems.innerHTML = "";
  let total = 0;
  let count = 0;

  cart.forEach(item => {
    total += item.price * item.qty;
    count += item.qty;

    cartItems.innerHTML += `
      <div class="flex gap-3 items-center border-b pb-3">
        <img src="${item.image}" class="w-20 h-20 rounded-lg object-cover">
        <div class="flex-1">
          <p class="font-bold">${item.name}</p>
          <p class="text-sm">Qtd: ${item.qty}</p>
          <p class="font-bold">R$ ${(item.price * item.qty).toFixed(2)}</p>
        </div>
        <button onclick="removeItem('${item.name}')" class="text-red-500 text-xl">
          <i class="fa fa-trash"></i>
        </button>
      </div>
    `;
  });

  cartTotal.textContent = total.toFixed(2);
  cartCount.textContent = count;
}

function removeItem(name) {
  cart = cart.filter(i => i.name !== name);
  updateCart();
}

function openCart() {
  cartModal.classList.remove("hidden");
}

document.getElementById("open-cart").addEventListener("click", openCart);
document.getElementById("clear-cart").addEventListener("click", () => {
  cart = [];
  updateCart();
});
