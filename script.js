// script.js — versão ajustada, otimizada e com fechamento às 04:00
// Agora exibe mensagem de loja fechada sempre que estiver fora do horário

// -----------------------------
// Configurações
// -----------------------------
const WHATSAPP_NUMBER = "19989021323";
const TIME_CHECK_INTERVAL_MS = 1000;

// Horário fixo: abre 11:30 e fecha 04:00 (dia seguinte)
const defaultOpening = 11 * 60 + 30; // 11:30
const defaultClosing = (24 + 4) * 60; // 28:00 = 04:00 do dia seguinte

// -----------------------------
// DOM
// -----------------------------
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

// Toast root
const toastRoot = document.createElement("div");
toastRoot.id = "toast-root";
document.body.appendChild(toastRoot);

// Status
let statusState = {
    isOpen: false,
    minutesToClose: null,
    minutesToOpen: null,
    secondsToClose: null,
    secondsToOpen: null
};
let lastToast = { openedSoon: false, closingSoon: false };

// -----------------------------
// Util tempo
// -----------------------------
function minutesNow() {
    const now = new Date();
    return now.getHours() * 60 + now.getMinutes();
}
function secondsNow() {
    const now = new Date();
    return now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
}
function formatMinutesSeconds(totalSeconds) {
    totalSeconds = Math.max(0, Math.floor(totalSeconds));
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m}m ${s}s`;
}
function formatHoursMinutes(totalMinutes) {
    const h = Math.floor(totalMinutes / 60);
    const m = totalMinutes % 60;
    return `${h}h${m > 0 ? ` ${m}m` : ''}`;
}

// -----------------------------
// Cálculo de horário (corrigido e simplificado)
// -----------------------------
function computeStoreStatus(totalMinutesNow, totalSecondsNow, open, close) {
    const MINUTES_PER_DAY = 1440;
    const SECONDS_PER_DAY = 86400;
    const crossesMidnight = close > MINUTES_PER_DAY;

    let isOpen = false,
        minutesToClose = null,
        minutesToOpen = null,
        secondsToClose = null,
        secondsToOpen = null;

    if (!crossesMidnight) {
        isOpen = totalMinutesNow >= open && totalMinutesNow < close;
        if (isOpen) {
            secondsToClose = close * 60 - totalSecondsNow;
            minutesToClose = Math.ceil(secondsToClose / 60);
        } else {
            if (totalMinutesNow < open) {
                secondsToOpen = open * 60 - totalSecondsNow;
                minutesToOpen = Math.ceil(secondsToOpen / 60);
            } else {
                secondsToOpen = (open + MINUTES_PER_DAY) * 60 - totalSecondsNow;
                minutesToOpen = Math.ceil(secondsToOpen / 60);
            }
        }
    } else {
        const adjustedClose = close - MINUTES_PER_DAY;
        isOpen = totalMinutesNow >= open || totalMinutesNow < adjustedClose;

        if (isOpen) {
            if (totalMinutesNow >= open) {
                secondsToClose = close * 60 - totalSecondsNow;
            } else {
                secondsToClose = adjustedClose * 60 - (totalSecondsNow % SECONDS_PER_DAY);
            }
            minutesToClose = Math.ceil(secondsToClose / 60);
        } else {
            if (totalMinutesNow < open) {
                secondsToOpen = open * 60 - totalSecondsNow;
            } else {
                secondsToOpen = (open + MINUTES_PER_DAY) * 60 - totalSecondsNow;
            }
            minutesToOpen = Math.ceil(secondsToOpen / 60);
        }
    }

    return {
        isOpen,
        minutesToClose: minutesToClose != null ? Math.max(0, minutesToClose) : null,
        minutesToOpen: minutesToOpen != null ? Math.max(0, minutesToOpen) : null,
        secondsToClose: secondsToClose != null ? Math.max(0, secondsToClose) : null,
        secondsToOpen: secondsToOpen != null ? Math.max(0, secondsToOpen) : null
    };
}

// -----------------------------
// Toast
// -----------------------------
function showToast(text, timeout = 4500) {
    const t = document.createElement("div");
    t.className = "toast";
    t.textContent = text;
    toastRoot.appendChild(t);
    requestAnimationFrame(() => t.classList.add("show"));
    setTimeout(() => {
        t.classList.remove("show");
        setTimeout(() => t.remove(), 300);
    }, timeout);
}

// -----------------------------
// Atualizar status na tela
// -----------------------------
function updateStatusDisplay(showWarning = false) {
    const nowMin = minutesNow();
    const nowSec = secondsNow();

    const status = computeStoreStatus(nowMin, nowSec, defaultOpening, defaultClosing);
    statusState = status;

    if (!dateSpan) return;

    dateSpan.className = "";

    if (status.isOpen) {
        dateSpan.classList.add("status-open");
        dateSpan.textContent = "🟢 Estamos abertos — faça seu pedido!";
        lastToast.openedSoon = false;
    } else {
        dateSpan.classList.add("status-closed");
        dateSpan.textContent = "🔴 Loja fechada no momento";
        lastToast.closingSoon = false;
        if (showWarning) showClosedAlert();
    }
}

function checkStoreStatus(showWarning = false) {
    updateStatusDisplay(showWarning);
    return statusState.isOpen;
}

updateStatusDisplay(false);
setInterval(() => updateStatusDisplay(false), TIME_CHECK_INTERVAL_MS);

// -----------------------------
// Modal de loja fechada
// -----------------------------
function showClosedAlert() {
    closedAlert && closedAlert.classList.remove("hidden");
}
if (closedAlertBtn)
    closedAlertBtn.addEventListener("click", () => closedAlert.classList.add("hidden"));

// -----------------------------
// Carrinho
// -----------------------------
function updateCart() {
    if (!cartItemsContainer) return;

    cartItemsContainer.innerHTML = '';
    let total = 0;

    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        const div = document.createElement("div");
        div.className = "cart-item-row";
        div.innerHTML = `
            <div class="cart-item-info">
                <p class="font-bold">${escapeHtml(item.name)}</p>
                <p class="muted">Qtd: ${item.quantity}</p>
            </div>
            <div class="cart-item-controls flex items-center gap-2">
                <button class="decrease-btn px-3 py-1 bg-gray-800 text-white rounded" data-index="${index}">−</button>
                <button class="increase-btn px-3 py-1 bg-gray-800 text-white rounded" data-index="${index}">+</button>
                <p class="font-bold">R$ ${itemTotal.toFixed(2)}</p>
            </div>
        `;

        cartItemsContainer.appendChild(div);
    });

    cartTotal.textContent = total.toFixed(2);
    cartCount.textContent = cart.reduce((acc, i) => acc + i.quantity, 0);

    attachQuantityListeners();
}

function attachQuantityListeners() {
    document.querySelectorAll('.increase-btn').forEach(btn => btn.onclick = () => {
        const idx = Number(btn.dataset.index);
        cart[idx].quantity++;
        updateCart();
    });

    document.querySelectorAll('.decrease-btn').forEach(btn => btn.onclick = () => {
        const idx = Number(btn.dataset.index);
        if (cart[idx].quantity > 1) cart[idx].quantity--;
        else cart.splice(idx, 1);
        updateCart();
    });
}

function escapeHtml(str = '') {
    return String(str).replace(/[&<>"'`=\/]/g, s => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;', '`': '&#96;', '=': '&#61;', '/': '&#47;'
    }[s]));
}

// -----------------------------
// Botões adicionar ao carrinho
// -----------------------------
document.querySelectorAll('.add-to-cart-btn').forEach(button => {
    button.addEventListener('click', () => {
        if (!checkStoreStatus(true)) return;

        const name = button.dataset.name;
        const price = Number(button.dataset.price) || 0;

        const existing = cart.find(i => i.name === name);
        if (existing) existing.quantity++;
        else cart.push({ name, price, quantity: 1 });

        updateCart();
        showToast('✔ Item adicionado', 1400);
    });
});

// -----------------------------
// Abrir/fechar modal carrinho
// -----------------------------
if (cartBtn)
    cartBtn.addEventListener('click', () => {
        if (!checkStoreStatus(true)) return;
        cartModal.classList.remove('hidden');
        footerBar.classList.add('hidden');
    });

if (closeModalBtn)
    closeModalBtn.addEventListener('click', () => {
        cartModal.classList.add('hidden');
        footerBar.classList.remove('hidden');
    });

