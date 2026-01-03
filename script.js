let cart = [];

function addToCart(name, price, image) {
  const item = cart.find(p => p.name === name);
  if (item) {
    item.qty++;
  } else {
    cart.push({ name, price, image, qty: 1 });
  }
  updateCart();
}

function updateCart() {
  const container = document.getElementById("cart-items");
  const totalEl = document.getElementById("cart-total");
  const countEl = document.getElementById("cart-count");

  container.innerHTML = "";
  let total = 0;
  let count = 0;

  cart.forEach(item => {
    total += item.price * item.qty;
    count += item.qty;

    container.innerHTML += `
      <div class="flex gap-3 items-center border-b pb-3">
        <img src="${item.image}" class="w-20 h-20 rounded">
        <div class="flex-1">
          <p class="font-bold">${item.name}</p>
          <p class="text-sm">Qtd: ${item.qty}</p>
          <p class="font-bold">R$ ${(item.price * item.qty).toFixed(2)}</p>
        </div>
        <button onclick="removeItem('${item.name}')" class="text-red-500">
          <i class="fa fa-trash"></i>
        </button>
      </div>
    `;
  });

  totalEl.textContent = total.toFixed(2);
  countEl.textContent = count;
}

function removeItem(name) {
  cart = cart.filter(i => i.name !== name);
  updateCart();
}

function clearCart() {
  cart = [];
  updateCart();
}

function openCart() {
  document.getElementById("cart-modal").classList.remove("hidden");
}
