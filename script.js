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

// ABRIR CARRINHO
cartBtn.addEventListener("click", () => {
    updateCartModal();
    cartModal.classList.remove("hidden");
    cartModal.classList.add("flex");
});

// FECHAR CARRINHO CLICANDO FORA
cartModal.addEventListener("click", (event) => {
    if (event.target === cartModal) {
        closeCartModal();
    }
});

// FECHAR CARRINHO PELO BOTÃO
closeModalBtn.addEventListener("click", closeCartModal);

function closeCartModal() {
    cartModal.classList.add("hidden");
    cartModal.classList.remove("flex");
}

// ADICIONAR PRODUTO
document.querySelectorAll(".add-to-cart-btn").forEach(button => {

    button.addEventListener("click", () => {

        const name = button.getAttribute("data-name");
        const price = parseFloat(button.getAttribute("data-price"));

        addToCart(name, price);
    });

});

// ADICIONAR AO CARRINHO
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

// ATUALIZAR CARRINHO
function updateCartModal() {

    cartItemsContainer.innerHTML = "";
    let total = 0;

    cart.forEach((item, index) => {

        total += item.price * item.quantity;

        const cartItem = document.createElement("div");

        cartItem.className =
            "flex justify-between items-center border-b py-3";

        cartItem.innerHTML = `
            <div>
                <p class="font-bold">${item.name}</p>
                <p>Quantidade: ${item.quantity}</p>
                <p>R$ ${(item.price * item.quantity).toFixed(2)}</p>
            </div>

            <div class="flex gap-2">
                <button class="decrease-btn bg-red-500 text-white px-2 rounded"
                    data-index="${index}">
                    -
                </button>

                <button class="increase-btn bg-green-500 text-white px-2 rounded"
                    data-index="${index}">
                    +
                </button>
            </div>
        `;

        cartItemsContainer.appendChild(cartItem);
    });

    cartTotal.textContent = `R$ ${total.toFixed(2)}`;

    cartCount.textContent = cart.reduce(
        (acc, item) => acc + item.quantity,
        0
    );

    addCartEvents();
}

// EVENTOS + E -
function addCartEvents() {

    document.querySelectorAll(".increase-btn").forEach(button => {

        button.onclick = () => {

            const index = button.dataset.index;
            cart[index].quantity++;

            updateCartModal();
        };
    });

    document.querySelectorAll(".decrease-btn").forEach(button => {

        button.onclick = () => {

            const index = button.dataset.index;

            cart[index].quantity--;

            if (cart[index].quantity <= 0) {
                cart.splice(index, 1);
            }

            updateCartModal();
        };
    });
}

// FINALIZAR PEDIDO
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

    let message = "🍔 *NOVO PEDIDO*%0A%0A";

    cart.forEach(item => {

        message += `• ${item.quantity}x ${item.name} - R$ ${(item.price * item.quantity).toFixed(2)}%0A`;
    });

    message += `%0A📍 Endereço: ${addressInput.value}`;
    message += `%0A💰 Total: ${cartTotal.textContent}`;

    // TROQUE PELO NÚMERO DA SUA LOJA
    const phone = "5511999999999";

    window.open(
        `https://wa.me/${phone}?text=${message}`,
        "_blank"
    );

    cart = [];
    updateCartModal();

    addressInput.value = "";

    closeCartModal();
});