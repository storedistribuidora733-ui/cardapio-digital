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

/* ABRIR CARRINHO */
cartBtn.addEventListener("click", () => {
  cartModal.classList.remove("hidden");
  updateCart();
});

/* FECHAR CARRINHO */
closeModalBtn.addEventListener("click", () => {
  cartModal.classList.add("hidden");
});

/* FECHAR AO CLICAR FORA */
cartModal.addEventListener("click", (e) => {
  if (e.target === cartModal) {
    cartModal.classList.add("hidden");
  }
});

/* ADICIONAR PRODUTO */
document.querySelectorAll(".add-to-cart-btn").forEach((btn) => {
  btn.addEventListener("click", function () {
    const name = this.getAttribute("data-name");
    const price = parseFloat(this.getAttribute("data-price"));

    // pega imagem do produto
    const productCard = this.closest(".flex");
    const image = productCard.querySelector("img").src;

    addToCart(name, price, image);
  });
});

/* ADD CART */
function addToCart(name, price, image) {
  const item = cart.find((p) => p.name === name);

  if (item) {
    item.quantity++;
  } else {
    cart.push({
      name,
      price,
      image,
      quantity: 1,
    });
  }

  updateCart();
}

/* UPDATE CART */
function updateCart() {
  cartItemsContainer.innerHTML = "";

  let total = 0;
  let count = 0;

  cart.forEach((item, index) => {
    total += item.price * item.quantity;
    count += item.quantity;

    const div = document.createElement("div");

    div.classList.add(
      "flex",
      "items-center",
      "justify-between",
      "gap-3",
      "bg-zinc-100",
      "p-2",
      "rounded"
    );

    div.innerHTML = `
      <div class="flex items-center gap-3">
        <img src="${item.image}" class="w-12 h-12 rounded object-cover">

        <div>
          <p class="font-bold">${item.name}</p>
          <p>R$ ${item.price.toFixed(2)}</p>
        </div>
      </div>

      <div class="flex items-center gap-2">
        <button onclick="decreaseItem(${index})" class="bg-red-500 text-white px-2 rounded">-</button>
        <span>${item.quantity}</span>
        <button onclick="increaseItem(${index})" class="bg-green-500 text-white px-2 rounded">+</button>
      </div>
    `;

    cartItemsContainer.appendChild(div);
  });

  cartTotal.innerText = "R$ " + total.toFixed(2);
  cartCount.innerText = count;
}

/* + */
window.increaseItem = (index) => {
  cart[index].quantity++;
  updateCart();
};

/* - */
window.decreaseItem = (index) => {
  cart[index].quantity--;

  if (cart[index].quantity <= 0) {
    cart.splice(index, 1);
  }

  updateCart();
};

/* FINALIZAR */
checkoutBtn.addEventListener("click", () => {
  if (!addressInput.value) {
    addressWarn.classList.remove("hidden");
    return;
  }

  addressWarn.classList.add("hidden");

  alert("Pedido enviado com sucesso!");

  cart = [];
  updateCart();
  cartModal.classList.add("hidden");
  addressInput.value = "";
});