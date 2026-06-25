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

/* abrir carrinho */
cartBtn.addEventListener("click", () => {
    cartModal.classList.remove("hidden");
    cartModal.classList.add("flex");
});

/* fechar carrinho */
closeModalBtn.addEventListener("click", () => {
    cartModal.classList.add("hidden");
});

/* adicionar produto */
document.addEventListener("click", (e) => {
    const button = e.target.closest(".add-to-cart-btn");

    if (!button) return;

    const name = button.dataset.name;
    const price = parseFloat(button.dataset.price);

    addToCart(name, price);
});

function addToCart(name, price) {
    const item = cart.find(i => i.name === name);

    if (item) {
        item.quantity++;
    } else {
        cart.push({ name, price, quantity: 1 });
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
        div.className = "flex justify-between";

        div.innerHTML = `
            <p>${item.name} x${item.quantity}</p>
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