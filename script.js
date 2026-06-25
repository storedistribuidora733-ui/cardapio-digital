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
    const btn = e.target.closest(".add-to-cart-btn");
    if (!btn) return;

    const name = btn.dataset.name;
    const price = parseFloat(btn.dataset.price);

    const item = cart.find(i => i.name === name);

    if (item) {
        item.quantity++;
    } else {
        cart.push({ name, price, quantity: 1 });
    }

    renderCart();
});

/* render carrinho */
function renderCart() {
    cartItems.innerHTML = "";

    let total = 0;

    cart.forEach(item => {
        total += item.price * item.quantity;

        const div = document.createElement("div");
        div.className = "flex justify-between items-center border-b pb-2";

        const left = document.createElement("div");

        const name = document.createElement("p");
        name.textContent = item.name;
        name.className = "font-bold";

        const controls = document.createElement("div");
        controls.className = "flex items-center gap-2 mt-1";

        const minus = document.createElement("button");
        minus.textContent = "-";
        minus.className = "px-2 bg-gray-200 rounded";
        minus.onclick = () => changeQty(item.name, "minus");

        const qty = document.createElement("span");
        qty.textContent = item.quantity;

        const plus = document.createElement("button");
        plus.textContent = "+";
        plus.className = "px-2 bg-gray-200 rounded";
        plus.onclick = () => changeQty(item.name, "plus");

        controls.appendChild(minus);
        controls.appendChild(qty);
        controls.appendChild(plus);

        left.appendChild(name);
        left.appendChild(controls);

        const price = document.createElement("p");
        price.textContent = `R$ ${(item.price * item.quantity).toFixed(2)}`;

        div.appendChild(left);
        div.appendChild(price);

        cartItems.appendChild(div);
    });

    cartTotal.textContent = total.toFixed(2);
    cartCount.textContent = cart.reduce((a, b) => a + b.quantity, 0);
}

/* mudar quantidade */
function changeQty(name, type) {
    const item = cart.find(i => i.name === name);
    if (!item) return;

    if (type === "plus") item.quantity++;
    if (type === "minus") item.quantity--;

    if (item.quantity <= 0) {
        cart = cart.filter(i => i.name !== name);
    }

    renderCart();
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

💰 Total: R$ ${total}

📍 Endereço: ${addressInput.value}
`;

    const phone = "5500000000000";

    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, "_blank");
});