const cartBtn = document.getElementById("cart-btn");
const cartModal = document.getElementById("cart-modal");
const closeModalBtn = document.getElementById("close-modal-btn");

const cartItems = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const cartCount = document.getElementById("cart-count");

let cart = [];

/* abrir / fechar */
cartBtn.addEventListener("click", () => {
    cartModal.classList.remove("hidden");
    cartModal.classList.add("flex");
});

closeModalBtn.addEventListener("click", () => {
    cartModal.classList.add("hidden");
});

/* adicionar produto */
document.addEventListener("click", (e) => {
    const btn = e.target.closest(".add-to-cart-btn");
    if (!btn) return;

    const name = btn.dataset.name;
    const price = parseFloat(btn.dataset.price);

    addItem(name, price);
});

function addItem(name, price) {
    const item = cart.find(i => i.name === name);

    if (item) {
        item.quantity++;
    } else {
        cart.push({ name, price, quantity: 1 });
    }

    renderCart();
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

/* render carrinho (AQUI ESTÁ O FIX REAL DOS BOTÕES) */
function renderCart() {
    cartItems.innerHTML = "";

    let total = 0;

    cart.forEach(item => {
        total += item.price * item.quantity;

        const row = document.createElement("div");
        row.className = "flex justify-between items-center border-b pb-2";

        const left = document.createElement("div");

        const title = document.createElement("p");
        title.textContent = item.name;
        title.className = "font-bold";

        const controls = document.createElement("div");
        controls.className = "flex items-center gap-2 mt-1";

        const btnMinus = document.createElement("button");
        btnMinus.textContent = "-";
        btnMinus.className = "px-2 bg-gray-200 rounded";
        btnMinus.onclick = () => changeQty(item.name, "minus");

        const qty = document.createElement("span");
        qty.textContent = item.quantity;

        const btnPlus = document.createElement("button");
        btnPlus.textContent = "+";
        btnPlus.className = "px-2 bg-gray-200 rounded";
        btnPlus.onclick = () => changeQty(item.name, "plus");

        controls.appendChild(btnMinus);
        controls.appendChild(qty);
        controls.appendChild(btnPlus);

        left.appendChild(title);
        left.appendChild(controls);

        const price = document.createElement("p");
        price.textContent = `R$ ${(item.price * item.quantity).toFixed(2)}`;

        row.appendChild(left);
        row.appendChild(price);

        cartItems.appendChild(row);
    });

    cartTotal.textContent = total.toFixed(2);
    cartCount.textContent = cart.reduce((a, b) => a + b.quantity, 0);
}