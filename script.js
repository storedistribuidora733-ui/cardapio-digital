// ================================
// STATUS DA LOJA (ABERTO / FECHADO)
// ================================

function checkStoreStatus() {
    const status = document.getElementById("store-status");
    const box = document.getElementById("date-span");

    if (!status || !box) return false;

    const now = new Date();
    const hour = now.getHours();

    // HORÁRIO DA LOJA
    const openHour = 7;   // abre 07:00
    const closeHour = 0;  // fecha 00:00

    let isOpen;

    if (openHour < closeHour) {
        isOpen = hour >= openHour && hour < closeHour;
    } else {
        // caso fecha meia-noite
        isOpen = hour >= openHour || hour < closeHour;
    }

    if (isOpen) {
        status.innerText = "🟢 ABERTO AGORA";
        box.className = "px-4 py-1 rounded-lg mt-5 bg-green-600";
    } else {
        status.innerText = "🔴 FECHADO NO MOMENTO";
        box.className = "px-4 py-1 rounded-lg mt-5 bg-red-600";
    }

    return isOpen;
}

// Executa ao carregar e atualiza a cada 1 minuto
checkStoreStatus();
setInterval(checkStoreStatus, 60000);

// ================================
// CARRINHO
// ================================

let cart = [];
let total = 0;

const cartBtn = document.getElementById("cart-btn");
const cartModal = document.getElementById("cart-modal");
const closeModalBtn = document.getElementById("close-modal-btn");
const cartItems = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const cartCount = document.getElementById("cart-count");

document.querySelectorAll(".add-to-cart-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        cart.push({
            name: btn.dataset.name,
            price: Number(btn.dataset.price)
        });

        total += Number(btn.dataset.price);
        updateCart();
    });
});

function updateCart() {
    cartItems.innerHTML = "";

    cart.forEach(item => {
        const div = document.createElement("div");
        div.innerText = `${item.name} - R$ ${item.price.toFixed(2)}`;
        cartItems.appendChild(div);
    });

    cartTotal.innerText = total.toFixed(2);
    cartCount.innerText = cart.length;
}

cartBtn.addEventListener("click", () => {
    cartModal.classList.remove("hidden");
});

closeModalBtn.addEventListener("click", () => {
    cartModal.classList.add("hidden");
});

// ================================
// BLOQUEAR PEDIDO SE FECHADO
// ================================

const checkoutBtn = document.getElementById("checkout-btn");
const closedAlert = document.getElementById("closed-alert");
const closedAlertBtn = document.getElementById("closed-alert-btn");

checkoutBtn.addEventListener("click", () => {
    if (!checkStoreStatus()) {
        closedAlert.classList.remove("hidden");
        return;
    }

    alert("Pedido enviado com sucesso!");
});

closedAlertBtn.addEventListener("click", () => {
    closedAlert.classList.add("hidden");
});
