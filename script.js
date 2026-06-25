// ===== ELEMENTOS =====
const cart = [];

const menu = document.getElementById("menu");
const cartBtn = document.getElementById("cart-btn");
const cartModal = document.getElementById("cart-modal");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const cartCount = document.getElementById("cart-count");

const closeModalBtn = document.getElementById("close-modal-btn");
const checkoutBtn = document.getElementById("checkout-btn");

const customerName = document.getElementById("customer-name");
const address = document.getElementById("address");
const addressWarn = document.getElementById("address-warn");
const paymentMethod = document.getElementById("payment-method");
const observations = document.getElementById("observations");

const closedAlert = document.getElementById("closed-alert");
const closedAlertBtn = document.getElementById("closed-alert-btn");

// ===== TROQUE PELO WHATSAPP DA SUA LOJA =====
const STORE_PHONE = "5511999999999";

// ===== ADICIONAR AO CARRINHO =====
menu.addEventListener("click", (event) => {

    const button = event.target.closest(".add-to-cart-btn");

    if (!button) return;

    const name = button.getAttribute("data-name");
    const price = parseFloat(button.getAttribute("data-price"));

    addToCart(name, price);
});

function addToCart(name, price) {

    const existingItem = cart.find(item => item.name === name);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            name,
            price,
            quantity: 1
        });
    }

    updateCart();
}

// ===== ATUALIZAR CARRINHO =====
function updateCart() {

    cartItemsContainer.innerHTML = "";
    let total = 0;
    let totalItems = 0;

    cart.forEach((item, index) => {

        total += item.price * item.quantity;
        totalItems += item.quantity;

        const itemElement = document.createElement("div");

        itemElement.className =
            "flex justify-between items-center border-b py-3";

        itemElement.innerHTML = `
            <div>
                <p class="font-bold">${item.name}</p>
                <p>Quantidade: ${item.quantity}</p>
                <p>R$ ${(item.price * item.quantity).toFixed(2)}</p>
            </div>

            <button
                class="remove-btn bg-red-500 text-white px-3 py-1 rounded"
                data-index="${index}">
                Remover
            </button>
        `;

        cartItemsContainer.appendChild(itemElement);
    });

    cartTotal.textContent = total.toFixed(2);
    cartCount.textContent = totalItems;
}

// ===== REMOVER ITEM =====
cartItemsContainer.addEventListener("click", (event) => {

    if (!event.target.classList.contains("remove-btn")) return;

    const index = event.target.getAttribute("data-index");

    cart.splice(index, 1);

    updateCart();
});

// ===== ABRIR MODAL =====
cartBtn.addEventListener("click", () => {
    cartModal.classList.remove("hidden");
    cartModal.classList.add("flex");
});

// ===== FECHAR MODAL =====
closeModalBtn.addEventListener("click", closeModal);

cartModal.addEventListener("click", (event) => {

    if (event.target === cartModal) {
        closeModal();
    }
});

function closeModal() {
    cartModal.classList.add("hidden");
    cartModal.classList.remove("flex");
}

// ===== ESCONDER AVISO DE ENDEREÇO =====
address.addEventListener("input", () => {

    if (address.value.trim() !== "") {
        addressWarn.classList.add("hidden");
    }
});

// ===== HORÁRIO DA LOJA =====
function isStoreOpen() {

    const currentHour = new Date().getHours();

    // Loja abre às 07:00 e fecha à meia-noite
    return currentHour >= 7 && currentHour < 24;
}

// ===== FINALIZAR PEDIDO =====
checkoutBtn.addEventListener("click", () => {

    if (!isStoreOpen()) {
        closedAlert.classList.remove("hidden");
        return;
    }

    if (cart.length === 0) {
        alert("Seu carrinho está vazio!");
        return;
    }

    if (customerName.value.trim() === "") {
        alert("Digite seu nome.");
        return;
    }

    if (address.value.trim() === "") {
        addressWarn.classList.remove("hidden");
        return;
    }

    let message = "🍔 *NOVO PEDIDO*%0A%0A";

    message += `👤 *Nome:* ${customerName.value}%0A`;
    message += `📍 *Endereço:* ${address.value}%0A`;
    message += `💳 *Pagamento:* ${paymentMethod.value}%0A`;

    if (observations.value.trim() !== "") {
        message += `📝 *Observações:* ${observations.value}%0A`;
    }

    message += `%0A📦 *Itens do Pedido:*%0A`;

    cart.forEach(item => {

        message += `• ${item.quantity}x ${item.name} - R$ ${(item.price * item.quantity).toFixed(2)}%0A`;
    });

    message += `%0A💰 *Total:* R$ ${cartTotal.textContent}`;

    window.open(
        `https://wa.me/${STORE_PHONE}?text=${message}`,
        "_blank"
    );

    // Limpar carrinho
    cart.length = 0;

    customerName.value = "";
    address.value = "";
    observations.value = "";

    updateCart();
    closeModal();
});

// ===== FECHAR AVISO DE LOJA FECHADA =====
closedAlertBtn.addEventListener("click", () => {
    closedAlert.classList.add("hidden");
});