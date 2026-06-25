const cartBtn = document.getElementById("cart-btn");
const cartModal = document.getElementById("cart-modal");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const checkoutBtn = document.getElementById("checkout-btn");
const cartCount = document.getElementById("cart-count");
const addressInput = document.getElementById("address");
const addressWarn = document.getElementById("address-warn");
const closeModalBtn = document.getElementById("close-modal-btn");

// NOVOS CAMPOS PARA DADOS DO CLIENTE
const customerNameInput = document.getElementById("customer-name");
const paymentMethodInput = document.getElementById("payment-method");
const observationsInput = document.getElementById("observations");

// FOOTER
const footerBar = document.querySelector("footer");

let cart = [];

// Abre o modal do carrinho
cartBtn.addEventListener("click", function () {
  updateCartModal();
  cartModal.style.display = "flex";

  // 🔥 Esconde footer
  footerBar.classList.add("hidden");
});

// Fecha ao clicar fora do modal
cartModal.addEventListener("click", function (event) {
  if (event.target === cartModal) {
    cartModal.style.display = "none";

    // 🔥 Mostra footer novamente
    footerBar.classList.remove("hidden");
  }
});

// Fecha clicando no botão fechar
closeModalBtn.addEventListener("click", function () {
  cartModal.style.display = "none";

  // 🔥 Mostra footer novamente
  footerBar.classList.remove("hidden");
});

// Função para adicionar itens ao carrinho
document.querySelectorAll('.add-to-cart-btn').forEach(button => {
  button.addEventListener('click', function () {
    const name = this.getAttribute("data-name");
    const price = parseFloat(this.getAttribute("data-price"));
    addCart(name, price);
  });
});

// Adiciona item
function addCart(name, price) {
  const existingItem = cart.find(item => item.name === name);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ name, price, quantity: 1 });
  }

  updateCartModal();
}

// Atualiza carrinho
function updateCartModal() {
  cartItemsContainer.innerHTML = "";
  let total = 0;

  cart.forEach((item, index) => {
    total += item.price * item.quantity;

    const cartItemElement = document.createElement("div");
    cartItemElement.classList.add("cart-item");

    cartItemElement.innerHTML = `
      <div class="item-info flex justify-between items-center">
        <div>
          <p><strong>${item.name}</strong></p>
          <p>Preço unitário: R$ ${item.price.toFixed(2)}</p>
          <p>Quantidade: ${item.quantity}</p>
        </div>

        <div class="flex gap-2 items-center">
          <button class="decrease-btn text-black text-3xl font-bold" data-index="${index}">−</button>
          <button class="increase-btn text-black text-3xl font-bold" data-index="${index}">+</button>
        </div>
      </div>
    `;

    cartItemsContainer.appendChild(cartItemElement);
  });

  cartTotal.textContent = "R$ " + total.toFixed(2);
  cartCount.textContent = cart.reduce((acc, item) => acc + item.quantity, 0);

  addQuantityEvents();
}

// Eventos quantidade
function addQuantityEvents() {
  document.querySelectorAll(".increase-btn").forEach(btn => {
    btn.addEventListener("click", function () {
      const index = this.getAttribute("data-index");
      cart[index].quantity += 1;
      updateCartModal();
    });
  });

  document.querySelectorAll(".decrease-btn").forEach(btn => {
    btn.addEventListener("click", function () {
      const index = this.getAttribute("data-index");
      cart[index].quantity -= 1;
      if (cart[index].quantity <= 0) cart.splice(index, 1);
      updateCartModal();
    });
  });
}

// Finalizar pedido
checkoutBtn.addEventListener("click", function () {
  if (!addressInput.value.trim()) {
    addressWarn.style.display = "block";
    return;
  } else {
    addressWarn.style.display = "none";
  }

  const orderData = {
    name: customerNameInput.value.trim(),
    address: addressInput.value.trim(),
    paymentMethod: paymentMethodInput.value,
    observations: observationsInput.value.trim(),
    cart,
    total: cart.reduce((acc, item) => acc + item.price * item.quantity, 0)
  };

  console.log("Pedido finalizado:", orderData);
  alert("Pedido finalizado! Veja o console para detalhes.");

  cart = [];
  updateCartModal();
  cartModal.style.display = "none";

  // 🔥 Mostra footer novamente
  footerBar.classList.remove("hidden");

  customerNameInput.value = "";
  addressInput.value = "";
  observationsInput.value = "";
  paymentMethodInput.value = "cartao";
});