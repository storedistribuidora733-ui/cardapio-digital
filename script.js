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

const openingHour = 5;
const closingHour = 6;

const dateSpan = document.getElementById("date-span");

function checkStoreStatus(showWarning = false) {
    const now = new Date();
    const hour = now.getHours();
    const minutes = now.getMinutes();
    const totalMinutesNow = hour * 60 + minutes;
    const totalMinutesClose = closingHour * 60;

    let isOpen = hour >= openingHour && hour < closingHour;

    if (isOpen) {
        if (totalMinutesClose - totalMinutesNow <= 20) {
            // 🔥 ALERTA DE 20 MINUTOS (CORRIGIDO)
            dateSpan.className = "px-4 py-1 rounded-lg text-black font-bold";
            dateSpan.style.backgroundColor = "#FFD54F"; 
            dateSpan.textContent = "⚠ 20 minutos para fechar!";
        } else {
            dateSpan.className = "bg-green-500 px-4 py-1 rounded-lg text-white font-bold";
            dateSpan.style.backgroundColor = "";
            dateSpan.textContent = "Aberto agora";
        }
    } else {
        dateSpan.className = "bg-red-500 px-4 py-1 rounded-lg text-white font-bold";
        dateSpan.style.backgroundColor = "";
        dateSpan.textContent = "Fechado agora";
        if (showWarning) showClosedAlert();
    }

    return isOpen;
}

setInterval(checkStoreStatus, 10000);
checkStoreStatus();

function showClosedAlert() {
    closedAlert.classList.remove("hidden");
}

closedAlertBtn.addEventListener("click", () => {
    closedAlert.classList.add("hidden");
});

cartBtn.addEventListener("click", () => {
    if (!checkStoreStatus(true)) return;
    cartModal.classList.remove("hidden");
    footerBar.classList.add("hidden");
    cartModal.querySelector(".cart-content").scrollTop = 0;
});

closeModalBtn.addEventListener("click", () => {
    cartModal.classList.add("hidden");
    footerBar.classList.remove("hidden");
});

document.querySelectorAll(".add-to-cart-btn").forEach(button => {
    button.addEventListener("click", () => {
        if (!checkStoreStatus(true)) return;

        const name = button.getAttribute("data-name");
        const price = parseFloat(button.getAttribute("data-price"));

        const existing = cart.find(item => item.name === name);
        if (existing) {
            existing.quantity++;
        } else {
            cart.push({ name, price, quantity: 1 });
        }

        updateCart();
    });
});

function updateCart() {
    cartItemsContainer.innerHTML = "";
    let total = 0;

    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        const cartItemElement = document.createElement("div");
        cartItemElement.classList.add("flex", "items-center", "justify-between", "py-2");

        cartItemElement.innerHTML = `
            <div>
                <p class="font-bold">${item.name}</p>
                <p>Qtd: ${item.quantity}</p>
            </div>
            <div class="flex items-center gap-4">
                <button class="decrease-btn font-bold text-white bg-black w-10 h-10 flex items-center justify-center rounded" data-index="${index}">−</button>
                <button class="increase-btn font-bold text-white bg-black w-10 h-10 flex items-center justify-center rounded" data-index="${index}">+</button>
                <p class="font-bold">R$ ${itemTotal.toFixed(2)}</p>
            </div>
        `;

        cartItemsContainer.appendChild(cartItemElement);
    });

    cartTotal.innerText = total.toFixed(2);
    cartCount.innerText = cart.reduce((acc, item) => acc + item.quantity, 0);

    addQuantityEvents();
}

function addQuantityEvents() {
    document.querySelectorAll(".increase-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const index = btn.getAttribute("data-index");
            cart[index].quantity++;
            updateCart();
        });
    });

    document.querySelectorAll(".decrease-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const index = btn.getAttribute("data-index");
            if (cart[index].quantity > 1) {
                cart[index].quantity--;
            } else {
                cart.splice(index, 1);
            }
            updateCart();
        });
    });
}

document.getElementById("checkout-btn").addEventListener("click", () => {
    const name = document.getElementById("customer-name").value.trim();
    const address = document.getElementById("address").value.trim();
    const payment = document.getElementById("payment-method").value;
    const obs = document.getElementById("observations").value.trim();

    if (cart.length === 0) {
        alert("Seu carrinho está vazio!");
        return;
    }

    if (address.length < 5) {
        document.getElementById("address-warn").classList.remove("hidden");
        return;
    }

    let message = `📦 *Novo pedido:*\n`;
    message += `👤 *Cliente*: ${name}\n`;
    message += `🏠 *Endereço*: ${address}\n`;
    message += `💳 *Pagamento*: ${payment}\n\n`;

    message += `🛒 *Itens*: \n`;
    cart.forEach(item => {
        message += `• ${item.name} - Qtd: ${item.quantity} - R$ ${(item.price * item.quantity).toFixed(2)}\n`;
    });

    message += `\n💬 *Observações*: ${obs || "Nenhuma"}\n`;
    message += `💰 *Total:* R$ ${cartTotal.innerText}`;

    const whatsappNumber = ""; // coloque seu número
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

    window.open(url, "_blank");
});

