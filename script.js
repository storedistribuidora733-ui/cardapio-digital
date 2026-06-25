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
    cartModal.classList.remove("hidden");
});

closeModalBtn.addEventListener("click", () => {
    cartModal.classList.add("hidden");
});

/* ADICIONAR ITEM */
document.addEventListener("click", (e) => {
    if (e.target.closest(".add-to-cart-btn")) {
        const button = e.target.closest(".add-to-cart-btn");

        const name = button.getAttribute("data-name");
        const price = parseFloat(button.getAttribute("data-price"));

        addItem(name, price);
    }
});

/* ADICIONAR */
function addItem(name, price) {
    const item = cart.find(i => i.name === name);

    if (item) {
        item.quantity++;
    } else {
        cart.push({ name, price, quantity: 1 });
    }

    updateCart();
}

/* AUMENTAR / DIMINUIR */
function changeQty(name, type) {
    const item = cart.find(i => i.name === name);

    if (!item) return;

    if (type === "plus") {
        item.quantity++;
    } else {
        item.quantity--;
    }

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
        div.classList.add("flex", "justify-between", "items-center", "border-b", "py-2");

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

    let delivery = subtotal > 0 ? 5 : 0;
    let total = subtotal + delivery - discount;

    cartTotal.innerHTML = total.toFixed(2);
    cartCount.innerHTML = cart.reduce((acc, item) => acc + item.quantity, 0);
}

/* CUPOM SIMPLES */
window.applyCoupon = function () {
    const code = prompt("Digite o cupom:");

    if (code === "DESCONTO10") {
        discount = 10;
        alert("Cupom aplicado! R$10 de desconto");
    } else {
        alert("Cupom inválido");
    }

    updateCart();
};

/* FINALIZAR */
checkoutBtn.addEventListener("click", () => {
    if (addressInput.value === "") {
        addressWarn.classList.remove("hidden");
        return;
    }

    addressWarn.classList.add("hidden");

    let itemsText = "";

    cart.forEach(item => {
        itemsText += `${item.name} x${item.quantity} - R$ ${(item.price * item.quantity).toFixed(2)}\n`;
    });

    let subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    let delivery = subtotal > 0 ? 5 : 0;
    let total = subtotal + delivery - discount;

    const message = `
🛒 NOVO PEDIDO

${itemsText}

🚚 Entrega: R$ ${delivery.toFixed(2)}
💰 Total: R$ ${total.toFixed(2)}

📍 Endereço: ${addressInput.value}
`;

    const phone = "5500000000000"; // TROCAR

    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, "_blank");
});