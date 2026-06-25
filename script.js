const cartBtn = document.getElementById("cart-btn");
const cartModal = document.getElementById("cart-modal");
const closeModalBtn = document.getElementById("close-modal-btn");

const cartItemsContainer = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const cartCount = document.getElementById("cart-count");

const checkoutBtn = document.getElementById("checkout-btn");
const addressInput = document.getElementById("address");
const addressWarn = document.getElementById("address-warn");

let cart = [];
let discount = 0;

/* ABRIR / FECHAR */
cartBtn.addEventListener("click", () => {
    cartModal.style.display = "flex";
});

closeModalBtn.addEventListener("click", () => {
    cartModal.style.display = "none";
});

/* ADICIONAR */
document.addEventListener("click", (e) => {
    const button = e.target.closest(".add-to-cart-btn");

    if (!button) return;

    const name = button.dataset.name;
    const price = parseFloat(button.dataset.price);

    addItem(name, price);
});

/* ADD ITEM */
function addItem(name, price) {
    let item = cart.find(i => i.name === name);

    if (item) {
        item.quantity++;
    } else {
        cart.push({
            name,
            price,
            quantity: 1
        });
    }

    updateCart();
}

/* MUDAR QTD */
function changeQty(name, type) {
    let item = cart.find(i => i.name === name);

    if (!item) return;

    if (type === "plus") item.quantity++;
    if (type === "minus") item.quantity--;

    if (item.quantity <= 0) {
        cart = cart.filter(i => i.name !== name);
    }

    updateCart();
}

/* ATUALIZAR */
function updateCart() {
    cartItemsContainer.innerHTML = "";

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

        cartItemsContainer.appendChild(div);
    });

    const delivery = cart.length > 0 ? 5 : 0;
    const total = subtotal + delivery - discount;

    cartTotal.textContent = total.toFixed(2);
    cartCount.textContent = cart.reduce((a, b) => a + b.quantity, 0);
}

/* FINALIZAR */
checkoutBtn.addEventListener("click", () => {
    if (!addressInput.value) {
        addressWarn.classList.remove("hidden");
        return;
    }

    addressWarn.classList.add("hidden");

    let itemsText = "";

    cart.forEach(item => {
        itemsText += `${item.name} x${item.quantity} - R$ ${(item.price * item.quantity).toFixed(2)}\n`;
    });

    const subtotal = cart.reduce((a, b) => a + b.price * b.quantity, 0);
    const delivery = cart.length > 0 ? 5 : 0;
    const total = subtotal + delivery - discount;

    const message = `
🛒 NOVO PEDIDO

${itemsText}

🚚 Entrega: R$ ${delivery.toFixed(2)}
💰 Total: R$ ${total.toFixed(2)}

📍 Endereço: ${addressInput.value}
`;

    const phone = "5500000000000";

    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, "_blank");
});