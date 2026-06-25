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

/* ABRIR CARRINHO */
cartBtn.addEventListener("click", () => {
    cartModal.classList.remove("hidden");
});

/* FECHAR CARRINHO */
closeModalBtn.addEventListener("click", () => {
    cartModal.classList.add("hidden");
});

/* ADICIONAR PRODUTOS */
document.addEventListener("click", (e) => {
    const button = e.target.closest(".add-to-cart-btn");

    if (!button) return;

    const name = button.dataset.name;
    const price = parseFloat(button.dataset.price);

    addToCart(name, price);
});

/* ADICIONAR AO CARRINHO */
function addToCart(name, price) {
    const item = cart.find(i => i.name === name);

    if (item) {
        item.quantity += 1;
    } else {
        cart.push({
            name,
            price,
            quantity: 1
        });
    }

    updateCart();
}

/* ATUALIZAR CARRINHO */
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
                <p class="text-sm">Qtd: ${item.quantity}</p>
            </div>

            <p>R$ ${(item.price * item.quantity).toFixed(2)}</p>
        `;

        cartItemsContainer.appendChild(div);
    });

    const delivery = cart.length > 0 ? 5 : 0;
    const total = subtotal + delivery;

    cartTotal.textContent = total.toFixed(2);
    cartCount.textContent = cart.reduce((acc, item) => acc + item.quantity, 0);
}

/* FINALIZAR PEDIDO */
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

    const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const delivery = cart.length > 0 ? 5 : 0;
    const total = subtotal + delivery;

    const message = `
🛒 NOVO PEDIDO

${itemsText}

🚚 Entrega: R$ ${delivery.toFixed(2)}
💰 Total: R$ ${total.toFixed(2)}

📍 Endereço: ${addressInput.value}
`;

    const phone = "5500000000000"; // TROQUE PELO SEU NÚMERO

    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, "_blank");
});