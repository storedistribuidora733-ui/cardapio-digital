const cart = JSON.parse(localStorage.getItem("cart")) || [];
const pedidos = JSON.parse(localStorage.getItem("pedidos")) || [];

const cartModal = document.getElementById("cart-modal");
const openCartBtn = document.getElementById("open-cart-btn");
const cartHeaderBtn = document.getElementById("cart-header-btn");
const closeModalBtn = document.getElementById("close-modal-btn");

const cartItems = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const cartTotalFooter = document.getElementById("cart-total-footer");
const cartCountFooter = document.getElementById("cart-count-footer");
const cartCountHeader = document.getElementById("cart-count-header");

openCartBtn.addEventListener("click", () => {
    cartModal.classList.remove("hidden");
});

cartHeaderBtn.addEventListener("click", () => {
    cartModal.classList.remove("hidden");
});

closeModalBtn.addEventListener("click", () => {
    cartModal.classList.add("hidden");
});

function atualizarCarrinho() {
    cartItems.innerHTML = "";

    let total = 0;
    let quantidade = 0;

    cart.forEach((item, index) => {
        total += item.price * item.quantity;
        quantidade += item.quantity;

        cartItems.innerHTML += `
            <div class="bg-primary p-3 rounded-lg flex justify-between items-center">
                <div>
                    <h3 class="font-bold">${item.name}</h3>
                    <p>${item.quantity}x R$ ${item.price.toFixed(2)}</p>
                </div>

                <button onclick="removerItem(${index})"
                    class="text-red-500">
                    <i class="fa fa-trash"></i>
                </button>
            </div>
        `;
    });

    cartTotal.textContent = total.toFixed(2).replace(".", ",");
    cartTotalFooter.textContent = total.toFixed(2).replace(".", ",");
    cartCountFooter.textContent = quantidade;
    cartCountHeader.textContent = quantidade;

    localStorage.setItem("cart", JSON.stringify(cart));
}

window.removerItem = function(index){
    cart.splice(index,1);
    atualizarCarrinho();
}

document.querySelectorAll(".add-to-cart-btn").forEach(btn => {
    btn.addEventListener("click", () => {

        const name = btn.dataset.name;
        const price = parseFloat(btn.dataset.price);

        const existente = cart.find(item => item.name === name);

        if(existente){
            existente.quantity++;
        }else{
            cart.push({
                name,
                price,
                quantity:1
            });
        }

        atualizarCarrinho();
    });
});

document.getElementById("checkout-btn").addEventListener("click", () => {

    const nome = document.getElementById("customer-name").value;
    const endereco = document.getElementById("address").value;
    const pagamento = document.getElementById("payment-method").value;
    const observacao = document.getElementById("observations").value;

    if(cart.length === 0){
        alert("Seu carrinho está vazio.");
        return;
    }

    if(endereco === ""){
        document.getElementById("address-warn").classList.remove("hidden");
        return;
    }

    let mensagem = `🍔 *NOVO PEDIDO*%0A%0A`;

    cart.forEach(item=>{
        mensagem += `• ${item.quantity}x ${item.name} - R$ ${(item.price * item.quantity).toFixed(2)}%0A`;
    });

    mensagem += `%0A💰 Total: R$ ${cartTotal.textContent}`;
    mensagem += `%0A👤 Cliente: ${nome}`;
    mensagem += `%0A📍 Endereço: ${endereco}`;
    mensagem += `%0A💳 Pagamento: ${pagamento}`;
    mensagem += `%0A📝 Observações: ${observacao}`;

    pedidos.push({
        data:new Date().toLocaleString(),
        itens:[...cart],
        total:cartTotal.textContent
    });

    localStorage.setItem("pedidos", JSON.stringify(pedidos));

    const numeroWhatsapp = "5599999999999";

    window.open(
        `https://wa.me/${numeroWhatsapp}?text=${mensagem}`,
        "_blank"
    );

    cart.length = 0;
    localStorage.removeItem("cart");

    atualizarCarrinho();

    cartModal.classList.add("hidden");
});

atualizarCarrinho();