const cartBtn = document.getElementById("cart-btn");
const cartModal = document.getElementById("cart-modal");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const checkoutBtn = document.getElementById("checkout-btn");
const cartCount = document.getElementById("cart-count");
const addressInput = document.getElementById("address");
const addressWarn = document.getElementById("address-warn");
const closeModalBtn = document.getElementById("close-modal-btn");

let cart = [];

// Abrir carrinho
cartBtn.addEventListener("click", () => {
    updateCartModal();
    cartModal.classList.remove("hidden");
    cartModal.classList.add("flex");
});

// Fechar clicando fora
cartModal.addEventListener("click", (event) => {
    if (event.target === cartModal) {
        cartModal.classList.add("hidden");
        cartModal.classList.remove("flex");
    }
});

// Fechar pelo botão
closeModalBtn.addEventListener("click", () => {
    cartModal.classList.add("hidden");
    cartModal.classList.remove("flex");
});

// Adicionar produtos ao carrinho
document.querySelectorAll(".add-to-cart-btn").forEach(button => {

    button.addEventListener("click", () => {

        const name = button.getAttribute("data-name");
        const price = parseFloat(button.getAttribute("data-price"));

        addToCart(name, price);
    });

});

// Função adicionar item
function addToCart(name, price) {

    const existingItem = cart.find(item => item.name === name);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            name,
            price,
            quantity: 1
        });
    }

    updateCartModal();
}

// Atualizar carrinho
function updateCartModal() {

    cartItemsContainer.innerHTML = "";

    let total = 0;

    cart.forEach((item, index) => {

        total += item.price * item.quantity;

        const itemElement = document.createElement("div");

        itemElement.classList.add(
            "flex",
            "justify-between",
            "items-center",
            "border-b",
            "pb-2",
            "mb-2"
        );

        itemElement.innerHTML = `
            <div>
                <p class="font-bold">${item.name}</p>
                <p>Qtd: ${item.quantity}</p>
                <p>R$ ${(item.price * item.quantity).toFixed(2)}</p>
            </div>

            <div class="flex gap-2">
                <button class="decrease-btn bg-red-500 text-white px-2 rounded" data-index="${index}">-</button>
                <button class="increase-btn bg-green-500 text-white px-2 rounded" data-index="${index}">+</button>
            </div>
        `;

        cartItemsContainer.appendChild(itemElement);

    });

    cartTotal.textContent = total.toFixed(2);

    cartCount.textContent = cart.reduce(
        (total, item) => total + item.quantity,
        0
    );

    addQuantityEvents();
}

// Eventos dos botões + e -
function addQuantityEvents() {

    document.querySelectorAll(".increase-btn").forEach(btn => {

        btn.addEventListener("click", () => {

            const index = btn.getAttribute("data-index");

            cart[index].quantity++;

            updateCartModal();

        });

    });

    document.querySelectorAll(".decrease-btn").forEach(btn => {

        btn.addEventListener("click", () => {

            const index = btn.getAttribute("data-index");

            cart[index].quantity--;

            if (cart[index].quantity <= 0) {
                cart.splice(index, 1);
            }

            updateCartModal();

        });

    });

}

// Finalizar pedido
checkoutBtn.addEventListener("click", () => {

    if (cart.length === 0) {
        alert("Seu carrinho está vazio!");
        return;
    }

    if (addressInput.value.trim() === "") {

        addressWarn.classList.remove("hidden");

        return;
    }

    addressWarn.classList.add("hidden");

    const pedido = `
Pedido:

${cart.map(item =>
`${item.name} - ${item.quantity}x - R$ ${(item.price * item.quantity).toFixed(2)}`
).join("\n")}

Total: R$ ${cart.reduce((total, item) =>
total + (item.price * item.quantity), 0).toFixed(2)}

Endereço:
${addressInput.value}
`;

    alert("Pedido finalizado!");

    console.log(pedido);

    cart = [];

    addressInput.value = "";

    updateCartModal();

    cartModal.classList.add("hidden");
    cartModal.classList.remove("flex");
});