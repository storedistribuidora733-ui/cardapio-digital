const cart = [];
const cartBtn = document.getElementById("cart-btn");
const cartModal = document.getElementById("cart-modal");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const cartCount = document.getElementById("cart-count");
const closeModalBtn = document.getElementById("close-modal-btn");
const footerBar = document.querySelector("footer");
const footerTotal = document.querySelector("footer p.text-sm");

const closedAlert = document.getElementById("closed-alert");
const closedAlertBtn = document.getElementById("closed-alert-btn");

// 🔥 HORÁRIOS CORRIGIDOS
const openingHour = 7 * 60; // abre às 07:00
const closingHour = 24 * 60; // fecha às 00:00

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
            dateSpan.className = "bg-green-600 px-3 py-1 rounded-lg text-white font-bold";
            dateSpan.style.backgroundColor = "";
            dateSpan.textContent = "Aberto agora";
        }
    } else {
        dateSpan.className = "bg-red-600 px-3 py-1 rounded-lg text-white font-bold";
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
    let totalItems = 0;

    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        totalItems += item.quantity;

        const cartItemElement = document.createElement("div");

        cartItemElement.innerHTML = `
            <div style="
                display:flex;
                justify-content:space-between;
                align-items:center;
                padding:12px 0;
                border-bottom:1px solid #eee;
                flex-wrap: wrap;
                gap: 8px;
            ">
                <div>
                    <div style="font-weight:bold;font-size:16px;">
                        ${item.name}
                    </div>
                    <div style="color:#666;font-size:14px;">
                        Quantidade: ${item.quantity}
                    </div>
                </div>

                <div style="
                    display:flex;
                    align-items:center;
                    gap:8px;
                ">
                    <button class="decrease-btn"
                        data-index="${index}"
                        style="
                            width:36px;
                            height:36px;
                            border:none;
                            border-radius:6px;
                            font-size:20px;
                            background:#e5e7eb;
                            cursor:pointer;
                        ">
                        -
                    </button>

                    <span style="
                        font-size:18px;
                        font-weight:bold;
                        min-width:25px;
                        text-align:center;
                    ">
                        ${item.quantity}
                    </span>

                    <button class="increase-btn"
                        data-index="${index}"
                        style="
                            width:36px;
                            height:36px;
                            border:none;
                            border-radius:6px;
                            font-size:20px;
                            background:#22c55e;
                            color:white;
                            cursor:pointer;
                        ">
                        +
                    </button>

                    <span style="
                        font-size:16px;
                        font-weight:bold;
                        min-width:80px;
                        text-align:right;
                    ">
                        R$ ${itemTotal.toFixed(2)}
                    </span>
                </div>
            </div>
        `;

        cartItemsContainer.appendChild(cartItemElement);
    });

    cartTotal.innerText = total.toFixed(2);
    cartCount.innerText = totalItems;
    footerTotal.innerText = `${totalItems} itens • R$ ${total.toFixed(2)}`;

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
    message += `👤 *Cliente*: ${name || "Não informado"}\n`;
    message += `🏠 *Endereço*: ${address}\n`;
    message += `💳 *Pagamento*: ${payment}\n\n`;
    message += `🛒 *Itens:*\n`;

    cart.forEach(item => {
        message += `• ${item.name} - Qtd: ${item.quantity} - R$ ${(item.price * item.quantity).toFixed(2)}\n`;
    });

    message += `\n💬 *Observações*: ${obs || "Nenhuma"}\n`;
    message += `💰 *Total:* R$ ${cartTotal.innerText}`;

    const whatsappNumber = "19989021323"; 
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

    window.open(url, "_blank");
});