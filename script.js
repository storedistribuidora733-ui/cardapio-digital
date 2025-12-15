/*
====================================================
CARRINHO + WHATSAPP + IMPRESSÃO (QZ TRAY)
Impressora térmica 80mm
WhatsApp: 55 19 98902-1323
====================================================
*/

// ===============================
// VARIÁVEIS / DOM
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
const openingHour = 11 * 60 + 30; // 11:30
const closingHour = 25 * 60;      // 01:00 do outro dia

function minutesNow() {
  const d = new Date();
  return d.getHours() * 60 + d.getMinutes();
}

function computeStoreStatus(now, open, close) {
  const DAY = 1440;
  const crossesMidnight = close > DAY;

  if (!crossesMidnight) {
    const isOpen = now >= open && now < close;
    return {
      isOpen,
      minutesToClose: isOpen ? close - now : null,
      minutesToOpen: !isOpen
        ? (now < open ? open - now : open + DAY - now)
        : null
    };
  }

  const adjClose = close - DAY;
  const isOpen = now >= open || now < adjClose;

  return {
    isOpen,
    minutesToClose: isOpen
      ? (now >= open ? close - now : adjClose - now)
      : null,
    minutesToOpen: !isOpen
      ? (now < open ? open - now : open + DAY - now)
      : null
  };
}

function checkStoreStatus(showWarning = false) {
  const { isOpen, minutesToClose, minutesToOpen } =
    computeStoreStatus(minutesNow(), openingHour, closingHour);

  if (isOpen) {
    if (minutesToClose <= 20) {
      dateSpan.className = "px-3 py-1 rounded-lg font-bold text-black";
      dateSpan.style.backgroundColor = "#FFD54F";
      dateSpan.textContent = `⚠ ${minutesToClose} min para fechar`;
    } else {
      dateSpan.className =
        "bg-green-500 px-3 py-1 rounded-lg text-white font-bold";
      dateSpan.textContent = "Aberto agora";
    }
  } else {
    dateSpan.className =
      "bg-red-500 px-3 py-1 rounded-lg text-white font-bold";
    dateSpan.textContent =
      minutesToOpen < 60
        ? `⏰ Abre em ${minutesToOpen} min`
        : `⏰ Abre em ${Math.floor(minutesToOpen / 60)}h`;

    if (showWarning) closedAlert?.classList.remove("hidden");
  }
  return isOpen;
}

setInterval(() => checkStoreStatus(false), 10000);
checkStoreStatus(false);

closedAlertBtn?.addEventListener("click", () => {
  closedAlert.classList.add("hidden");
});

// ===============================
// MODAL CARRINHO
// ===============================
cartBtn?.addEventListener("click", () => {
  if (!checkStoreStatus(true)) return;
  cartModal.classList.remove("hidden");
  footerBar?.classList.add("hidden");
});

closeModalBtn?.addEventListener("click", () => {
  cartModal.classList.add("hidden");
  footerBar?.classList.remove("hidden");
});

// ===============================
// ADICIONAR PRODUTO
// ===============================
document.querySelectorAll(".add-to-cart-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    if (!checkStoreStatus(true)) return;

    const name = btn.dataset.name;
    const price = parseFloat(btn.dataset.price) || 0;

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
          <button onclick="changeQty(${i},-1)">−</button>
          <button onclick="changeQty(${i},1)">+</button>
          <strong>R$ ${(item.price * item.quantity).toFixed(2)}</strong>
        </div>
      </div>
    `;
  });

  cartTotal.innerText = total.toFixed(2);
  cartCount.innerText = cart.reduce((s, i) => s + i.quantity, 0);
}

window.changeQty = function (index, delta) {
  if (!cart[index]) return;
  cart[index].quantity += delta;
  if (cart[index].quantity <= 0) cart.splice(index, 1);
  updateCart();
};

// ===============================
// QZ TRAY
// ===============================
function connectQZ() {
  try {
    if (window.qz && !qz.websocket.isActive()) {
      qz.websocket.connect();
    }
  } catch {}
}

window.addEventListener("load", connectQZ);

// ===============================
// CUPOM TÉRMICO
// ===============================
function buildReceipt(data) {
  let t = "";
  t += "NOME DA LOJA\n";
  t += "----------------------------\n";
  t += `Cliente: ${data.name}\n`;
  t += `End: ${data.address}\n`;
  t += `Pgto: ${data.payment}\n`;
  t += "----------------------------\n";
  data.items.forEach(i => {
    t += `${i.name} x${i.quantity}  R$ ${(i.price * i.quantity).toFixed(2)}\n`;
  });
  t += "----------------------------\n";
  t += `TOTAL: R$ ${data.total}\n\n\n`;
  return t;
}

function printQZ(text) {
  try {
    const cfg = qz.configs.create(null);
    qz.print(cfg, [{ type: "raw", data: text }]);
  } catch {
    alert("QZ Tray não conectado");
  }
}

// ===============================
// FINALIZAR PEDIDO
// ===============================
document.getElementById("checkout-btn")?.addEventListener("click", () => {
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

  const receipt = buildReceipt({ name, address, payment, items: cart, total });
  printQZ(receipt);

  window.open(
    `https://wa.me/5519989021323?text=${encodeURIComponent(msg)}`,
    "_blank"
  );

  cart.length = 0;
  updateCart();
  cartModal.classList.add("hidden");
  footerBar?.classList.remove("hidden");
});