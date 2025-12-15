/*
=========================================
CARRINHO + WHATSAPP
HORÁRIO SIMPLES
=========================================
*/

// ===============================
// VARIÁVEIS
// ===============================
const cart = [];

const cartBtn = document.getElementById("cart-btn");
const cartModal = document.getElementById("cart-modal");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const cartCount = document.getElementById("cart-count");
const closeModalBtn = document.getElementById("close-modal-btn");
const footerBar = document.querySelector("footer");

const closedAlert = document.getElementById("closed-alert");
const closedAlertBtn = document.getElementById("closed-alert-btn");
const dateSpan = document.getElementById("date-span");

// ===============================
// HORÁRIO DE FUNCIONAMENTO
// ===============================
// ABERTO: AGORA ATÉ 15:00
const OPEN_HOUR = new Date().getHours(); // hora atual
const CLOSE_HOUR = 15; // 3 da tarde

function storeIsOpen() {
  const now = new Date().getHours();
  return now >= OPEN_HOUR && now < CLOSE_HOUR;
}

function updateStoreStatus(showAlert = false) {
  if (storeIsOpen()) {
    dateSpan.className =
      "bg-green-500 px-3 py-1 rounded-lg text-white font-bold";
    dateSpan.textContent = "Aberto agora";
    return true;
  } else {
    dateSpan.className =
      "bg-red-500 px-3 py-1 rounded-lg text-white font-bold";
    dateSpan.textContent = "Loja fechada";

    if (showAlert) closedAlert.classList.remove("hidden");
    return false;
  }
}

// checar a cada 30s
setInterval(() => updateStoreStatus(false), 30000);
updateStoreStatus(false);

closedAlertBtn?.addEventListener("click", () => {
  closedAlert.classList.add("hidden");
});

// ===============================
// MODAL CARRINHO
// ===============================
cartBtn.addEventListener("click", () => {
  if (!updateStoreStatus(true)) return;
  cartModal.classList.remove("hidden");
  footerBar.classList.add("hidden");
});

closeModalBtn.addEventListener("click", () => {
  cartModal.classList.add("hidden");
  footerBar.classList.remove("hidden");
});

// ===============================
// ADICIONAR PRODUTO
// ===============================
document.querySelectorAll(".add-to-cart-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    if (!updateStoreStatus(true)) return;

    const name = btn.dataset.name;
    const price = parseFloat(btn.dataset.price);

    const item = cart.find(p => p.name === name);
    if (item) item.quantity++;
    else cart.push({ name, price, quantity: 1 });

    updateCart();
  });
});

// ===============================
// ATUALIZAR CARRINHO
// ===============================
function updateCart() {
  cartItemsContainer.innerHTML = "";
  let total = 0;

  cart.forEach((item, i) => {
    total += item.price * item.quantity;

    cartItemsContainer.innerHTML += `
      <div class="flex justify-between items-center py-2">
        <div>
          <p class="font-bold">${item.name}</p>
          <p>Qtd: ${item.quantity}</p>
        </div>
        <div class="flex gap-2 items-center">
          <button onclick="changeQty(${i}, -1)">−</button>
          <button onclick="changeQty(${i}, 1)">+</button>
          <strong>R$ ${(item.price * item.quantity).toFixed(2)}</strong>
        </div>
      </div>
    `;
  });

  cartTotal.innerText = total.toFixed(2);
  cartCount.innerText = cart.reduce((s, i) => s + i.quantity, 0);
}

window.changeQty = function (index, delta) {
  cart[index].quantity += delta;
  if (cart[index].quantity <= 0) cart.splice(index, 1);
  updateCart();
};

// ===============================
// FINALIZAR PEDIDO
// ===============================
document.getElementById("checkout-btn").addEventListener("click", () => {
  if (cart.length === 0) return alert("Carrinho vazio");

  const name = document.getElementById("customer-name").value || "Cliente";
  const address = document.getElementById("address").value;
  const payment = document.getElementById("payment-method").value;
  const obs = document.getElementById("observations").value;

  if (address.length < 5) return alert("Informe o endereço");

  let msg = `🛒 *NOVO PEDIDO*\n\n👤 ${name}\n🏠 ${address}\n💳 ${payment}\n\n`;

  cart.forEach(i => {
    msg += `• ${i.name} x${i.quantity} - R$ ${(i.price * i.quantity).toFixed(2)}\n`;
  });

  const total = cart.reduce((s, i) => s + i.price * i.quantity, 0).toFixed(2);
  msg += `\n💰 TOTAL: R$ ${total}\n📝 ${obs || ""}`;

  window.open(
    `https://wa.me/5519989021323?text=${encodeURIComponent(msg)}`,
    "_blank"
  );

  cart.length = 0;
  updateCart();
  cartModal.classList.add("hidden");
  footerBar.classList.remove("hidden");
});