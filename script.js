

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

// 🔥 HORÁRIOS CORRIGIDOS
const openingHour =  5 * 60; // abre 00:00
const closingHour = 24 * 60;      // fecha 24:00

const dateSpan = document.getElementById("date-span");

// 🔥 Função corrigida para controlar o status da loja
function checkStoreStatus(showWarning = false) {
    const now = new Date();
    const totalMinutesNow = now.getHours() * 60 + now.getMinutes();

    let isOpen = totalMinutesNow >= openingHour && totalMinutesNow < closingHour;

    if (isOpen) {
        const minutesToClose = closingHour - totalMinutesNow;

        if (minutesToClose <= 20) {
            dateSpan.className = "px-3 py-1 rounded-lg text-black font-bold";
            dateSpan.style.backgroundColor = "#FFD54F";
            dateSpan.textContent = "⚠ 20 minutos para fechar!";
        } else {
            dateSpan.className = "bg-green-500 px-3 py-1 rounded-lg text-white font-bold";
            dateSpan.style.backgroundColor = "";
            dateSpan.textContent = "Aberto agora";
        }
    } else {
        dateSpan.className = "bg-red-500 px-3 py-1 rounded-lg text-white font-bold";
        dateSpan.style.backgroundColor = "";
        dateSpan.textContent = "Fechado agora";

        if (showWarning) showClosedAlert();
    }

    return isOpen;
}

setInterval(checkStoreStatus, 10000);
checkStoreStatus();

// ALERTA LOJA FECHADA
function showClosedAlert() {
    closedAlert.classList.remove("hidden");
}

closedAlertBtn.addEventListener("click", () => {
    closedAlert.classList.add("hidden");
});

// MODAL DO CARRINHO
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

// ADICIONAR AO CARRINHO
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

// ATUALIZAR CARRINHO

function updateCart() {
    cartItemsContainer.innerHTML = "";
    let total = 0;

    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        const cartItemElement = document.createElement("div");

        cartItemElement.classList.add(
            "py-5",
            "border-b",
            "border-gray-200"
        );

        cartItemElement.innerHTML = `
            <div class="flex justify-between items-center">

                <!-- Nome e quantidade -->
                <div class="w-1/2">
                    <p class="font-bold text-lg">
                        ${item.name}
                    </p>

                    <p class="text-gray-500 text-base mt-1">
                        Qtd: ${item.quantity}
                    </p>
                </div>

                <!-- Controles -->
                <div class="flex items-center gap-6">

                    <button
                        class="decrease-btn w-12 h-12 rounded-xl bg-gray-100 text-3xl font-bold text-gray-700 flex items-center justify-center shadow-sm"
                        data-index="${index}">
                        −
                    </button>

                    <span class="font-bold text-2xl w-8 text-center">
                        ${item.quantity}
                    </span>

                    <button
                        class="increase-btn w-12 h-12 rounded-xl bg-green-500 text-white text-3xl font-bold flex items-center justify-center shadow-sm"
                        data-index="${index}">
                        +
                    </button>

                    <p class="font-bold text-2xl min-w-[110px] text-right">
                        R$ ${itemTotal.toFixed(2)}
                    </p>

                </div>
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

// FINALIZAR PEDIDO
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
    message += `🛒 *Itens:*\n`;

    cart.forEach(item => {
        message += `• ${item.name} - Qtd: ${item.quantity} - R$ ${(item.price * item.quantity).toFixed(2)}\n`;
    });

    message += `\n💬 *Observações*: ${obs || "Nenhuma"}\n`;
    message += `💰 *Total:* R$ ${cartTotal.innerText}`;

    const whatsappNumber = ""; 
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

    window.open(url, "_blank");
});