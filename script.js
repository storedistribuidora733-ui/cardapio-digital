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

// ABRIR CARRINHO (CORRIGIDO)
cartBtn.addEventListener("click", () => {
  cartModal.classList.remove("hidden");
  cartModal.classList.add("flex");
  updateCartModal();
});

// FECHAR CARRINHO
function closeCart() {
  cartModal.classList.add("hidden");
  cartModal.classList.remove("flex");
}

closeModalBtn.addEventListener("click", closeCart);

// clicar fora do modal
cartModal.addEventListener("click", (event) => {
  if (event.target === cartModal) {
    closeCart();
  }
});

// ADICIONAR PRODUTO
document.querySelectorAll(".add-to-cart-btn").forEach((button) => {
  button.addEventListener("click", () => {
    const name = button.dataset.name;
    const price = parseFloat(button.dataset.price);

    addToCart(name, price);
  });
});

function addToCart(name, price) {
  const item = cart.find((p) => p.name === name);

  if (item) {
    item.quantity += 1;
  } else {
    cart.push({
      name,
      price,
      quantity: 1,
    });
  }

  updateCartModal();
}

// ATUALIZAR CARRINHO
function updateCartModal() {
  cartItemsContainer.innerHTML = "";

  let total = 0;
  let count = 0;

  cart.forEach((item, index) => {
    total += item.price * item.quantity;
    count += item.quantity;

    const div = document.createElement("div");

    div.classList.add("flex", "justify-between", "items-center", "border-b", "py-2");

    div.innerHTML = `
      <div>
        <p class="font-bold">${item.name}</p>
        <p>R$ ${item.price.toFixed(2)}</p>
      </div>

      <div class="flex items-center gap-2">
        <button onclick="decreaseItem(${index})" class="px-2 bg-gray-200">-</button>
        <span>${item.quantity}</span>
        <button onclick="increaseItem(${index})" class="px-2 bg-gray-200">+</button>
      </div>
    `;

    cartItemsContainer.appendChild(div);
  });

  cartTotal.textContent = total.toFixed(2);
  cartCount.textContent = count;
}

// aumentar
window.increaseItem = function (index) {
  cart[index].quantity++;
  updateCartModal();
};

// diminuir
window.decreaseItem = function (index) {
  cart[index].quantity--;

  if (cart[index].quantity <= 0) {
    cart.splice(index, 1);
  }

  updateCartModal();
};

// FINALIZAR PEDIDO
checkoutBtn.addEventListener("click", () => {
  if (!addressInput.value.trim()) {
    addressWarn.classList.remove("hidden");
    return;
  }

  addressWarn.classList.add("hidden");

  alert("Pedido finalizado com sucesso!");

  cart = [];
  updateCartModal();
  closeCart();

  addressInput.value = "";
});