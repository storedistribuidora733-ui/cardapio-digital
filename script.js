/*
========================================
 Carrinho + WhatsApp + Impressão (QZ Tray)
 Impressora: Térmica 80mm
 WhatsApp: 19989021323
========================================
*/

// =============================
// VARIÁVEIS E ESTADO
// =============================
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

// =============================
// HORÁRIO DA LOJA
// =============================
const openingHour = 11 * 60 + 30; // 11:30
const closingHour = 25 * 60;      // 01:00 do dia seguinte

function minutesNow() {
    const now = new Date();
    return now.getHours() * 60 + now.getMinutes();
}

function computeStoreStatus(now, open, close) {
    const DAY = 1440;
    const crossesMidnight = close > DAY;
    const adjustedClose = crossesMidnight ? close - DAY : close;

    const isOpen = crossesMidnight
        ? now >= open || now < adjustedClose
        : now >= open && now < close;

    let minutesToClose = null;
    let minutesToOpen = null;

    if (isOpen) {
        minutesToClose = now >= open ? close - now : adjustedClose - now;
    } else {
        minutesToOpen = now < open ? open - now : open + DAY - now;
    }

    return {
        isOpen,
        minutesToClose,
        minutesToOpen
    };
}

function checkStoreStatus(showAlert = false) {
    const status = computeStoreStatus(minutesNow(), openingHour, closingHour);

    if (status.isOpen) {
        if (status.minutesToClose <= 20) {
            dateSpan.className = "px-3 py-1 rounded-lg bg-yellow-400 text-black font-bold";
            dateSpan.textContent = `⚠ Fecha em ${status.minutesToClose} min`;
        } else {
            dateSpan.className = "px-3 py-1 rounded-lg bg-green-500 text-white font-bold";
            dateSpan.textContent = "Aberto agora";
        }
    } else {
        dateSpan.className = "px-3 py-1 rounded-lg bg-red-500 text-white font-bold";
        dateSpan.textContent = "Fechado agora";
        if (showAlert) closedAlert.classList.remove("hidden");
    }

    return status.isOpen;
}

setInterval(() => checkStoreStatus(false), 10000);
checkStoreStatus(false);

// =============================
// ALERTA LOJA FECHADA
// =============================
closedAlertBtn.addEventListener("click", () => {
    closedAlert.classList.add("hidden");
});

// =============================
// MODAL CARRINHO
// =============================
cartBtn.addEventListener("click", () => {
    if (!checkStoreStatus(true)) return;
    cartModal.classList.remove("hidden");
    footerBar.classList.add("hidden");
});

closeModalBtn.addEventListener("click", () => {
    cartModal.classList.add("hidden");
    footerBar.classList.remove("hidden");
});

// =============================
// ADICIONAR AO CARRINHO
// =============================
document.querySelectorAll(".add-to-cart-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        if (!checkStoreStatus(true)) return;

        const name = btn.dataset.name;
        const price = parseFloat(btn.dataset.price);

        const item = cart.find(p => p.name === name);
        item ? item.quantity++ : cart.push({ name, price, quantity: 1 });

        updateCart();
    });
});

// =============================
// ATUALIZAR CARRINHO
// =============================
function updateCart() {
    cartItemsContainer.innerHTML = "";
    let total = 0;

    cart.forEach((item, index) => {
        total += item.price * item.quantity;

        cartItemsContainer.innerHTML += `
            <div class="flex justify-between items-center py-2">
                <div>
                    <p class="font-bold">${item.name}</p>
                    <p>Qtd: ${item.quantity}</p>
                </div>
                <div class="flex items-center gap-2">
                    <button class="dec" data-i="${index}">−</button>
                    <button class="inc" data-i="${index}">+</button>
                    <span class="font-bold">R$ ${(item.price * item.quantity).toFixed(2)}</span>
                </div>
            </div>
        `;
    });

    cartTotal.textContent = total.toFixed(2);
    cartCount.textContent = cart.reduce((s, i) => s + i.quantity, 0);

    document.querySelectorAll(".inc").forEach(b =>
        b.onclick = () => { cart[b.dataset.i].quantity++; updateCart(); }
    );

    document.querySelectorAll(".dec").forEach(b =>
        b.onclick = () => {
            const i = b.dataset.i;
            cart[i].quantity > 1 ? cart[i].quantity-- : cart.splice(i, 1);
            updateCart();
        }
    );
}

// =============================
// QZ TRAY
// =============================
function connectQZ() {
    if (window.qz && !qz.websocket.isActive()) {
        qz.websocket.connect().catch(() => {});
    }
}

window.onload = connectQZ;

// =============================
// CUPOM TÉRMICO
// =============================
function buildReceipt(data) {
    let t = "NOME DA LOJA\n";
    t += "-----------------------------\n";
    t += `Cliente: ${data.name}\n`;
    t += `End: ${data.address}\n`;
    t += `Pag: ${data.payment}\n`;
    t += "-----------------------------\n";

    data.items.forEach(i => {
        t += `${i.name} x${i.quantity}  R$ ${(i.price*i.quantity).toFixed(2)}\n`;
    });

    t += "-----------------------------\n";
    t += `TOTAL: R$ ${data.total}\n\n\n`;
    return t;
}

function printQZ(text) {
    if (!window.qz) return;

    qz.websocket.connect().then(() => {
        const cfg = qz.configs.create(null);
        return qz.print(cfg, [{ type: "raw", format: "plain", data: text }]);
    }).catch(() => {
        alert("Erro ao imprimir. QZ Tray não conectado.");
    });
}

// =============================
// FINALIZAR PEDIDO
// =============================
document.getElementById("checkout-btn").onclick = () => {
    if (!cart.length) return alert("Carrinho vazio!");

    const name = customer-name.value || "Cliente";
    const address = address.value;
    const payment = payment-method.value;
    const obs = observations.value || "Nenhuma";

    const total = cart.reduce((t, i) => t + i.price*i.quantity, 0).toFixed(2);

    const receipt = buildReceipt({ name, address, payment, obs, items: cart, total });
    printQZ(receipt);

    let msg = `📦 *Novo pedido*\n👤 ${name}\n🏠 ${address}\n💳 ${payment}\n\n`;
    cart.forEach(i => msg += `• ${i.name} x${i.quantity}\n`);
    msg += `\n💰 Total: R$ ${total}`;

    window.open(`https://wa.me/19989021323?text=${encodeURIComponent(msg)}`);

    cart.length = 0;
    updateCart();
    cartModal.classList.add("hidden");
    footerBar.classList.remove("hidden");
};
