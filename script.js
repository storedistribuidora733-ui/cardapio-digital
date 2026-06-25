const cartBtn = document.getElementById("cart-btn");
const cartModal = document.getElementById("cart-modal");
const closeModalBtn = document.getElementById("close-modal-btn");

const cartItems = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const cartCount = document.getElementById("cart-count");

const checkoutBtn = document.getElementById("checkout-btn");
const addressInput = document.getElementById("address");
const addressWarn = document.getElementById("address-warn");

let cart = [];

/* abrir / fechar carrinho */
cartBtn.addEventListener("click", () => {
    cartModal.classList.remove("hidden");
});

closeModalBtn.addEventListener("click", () => {
    cartModal.classList.add("hidden");
});

/* adicionar produto */
document.addEventListener("click", (e) => {
    const button = e.target.closest(".add-to-cart-btn");
    if (!button) return;

    const name = button.dataset.name;
    const price = parseFloat(button.dataset.price);

    addItem(name, price);
});

/* adicionar item */
function addItem(name, price) {
    const item = cart.find(i => i.name === name);

    if (item) {
        item.quantity++;
    } else {
        cart.push({ name, price, quantity: 1 });
    }

    updateCart();
}

/* mudar quantidade (+ / -) */
function changeQty(name, type) {
    const item = cart.find(i => i.name === name);
    if (!item) return;

    if (type === "plus") item.quantity++;
    if (type === "minus") item.quantity--;

    if (item.quantity <= 0) {
        cart = cart.filter(i => i.name !== name);
    }

    updateCart();
}

/* atualizar carrinho */
function updateCart() {
    cartItems.innerHTML = "";

    let subtotal = 0;

    cart.forEach(item => {
        subtotal += item.price * item.quantity;

        const div = document.createElement("div");
        div.className = "flex justify-between items-center border-b py-2";

        div.innerHTML = `
            <div>
                <p class="font-bold">${item.name}</p>

                <div class="flex items-center gap-2 mt-1">
                    <button onclick="changeQty('${item.name}','minus')" class="px-2 bg-gray-200 rounded">-</button>

                    <span>${item.quantity}</span>

                    <button onclick="changeQty('${item.name}','plus')" class="px-2 bg-gray-200 rounded">+</button>
                </div>
            </div>

            <p>R$ ${(item.price * item.quantity).toFixed(2)}</p>
        `;

        cartItems.appendChild(div);
    });

    const delivery = cart.length > 0 ? 5 : 0;
    const total = subtotal + delivery;

    cartTotal.textContent = total.toFixed(2);
    cartCount.textContent = cart.reduce((a, b) => a + b.quantity, 0);
}

/* finalizar pedido */
checkoutBtn.addEventListener("click", () => {
    if (!addressInput.value) {
        addressWarn.classList.remove("hidden");
        return;
    }

    let itemsText = "";

    cart.forEach(item => {
        itemsText += `${item.name} x${item.quantity} - R$ ${(item.price * item.quantity).toFixed(2)}\n`;
    });

    const total = cart.reduce((a, b) => a + b.price * b.quantity, 0);

    const message = `
🛒 NOVO PEDIDO

${itemsText}

💰 Total: R$ ${total + 5}

📍 Endereço: ${addressInput.value}
`;

    const phone = "5500000000000";

    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, "_blank");
});