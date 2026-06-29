// 🛒 CARRINHO E ELEMENTOS
const cart = [];
const cartBtn = document.getElementById("cart-btn");
const cartModal = document.getElementById("cart-modal");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const cartCount = document.getElementById("cart-count");
const closeModalBtn = document.getElementById("close-modal-btn");
const footerBar = document.getElementById("cart-footer");

const closedAlert = document.getElementById("closed-alert");
const closedAlertBtn = document.getElementById("closed-alert-btn");

// ⏰ HORÁRIOS DE FUNCIONAMENTO
const openingHour = 0;    // Abre à 00:00
const closingHour = 24 * 60; // Fecha às 24:00 (meia-noite)

const dateSpan = document.getElementById("date-span");

// ✅ FUNÇÃO DE VERIFICAÇÃO DO STATUS DA LOJA
function checkStoreStatus(showWarning = false) {
    const now = new Date();
    const totalMinutesNow = now.getHours() * 60 + now.getMinutes();

    let isOpen = totalMinutesNow >= openingHour && totalMinutesNow < closingHour;

    if (isOpen) {
        const minutesToClose = closingHour - totalMinutesNow;

        if (minutesToClose <= 20) {
            dateSpan.className = "px-3 py-1 rounded-lg text-black font-bold";
            dateSpan.style.backgroundColor = "#FFD54F";
            dateSpan.textContent = "⚠ 20 minutos para fechar!";
        } else {
            dateSpan.className = "bg-green-500 px-3 py-1 rounded-lg text-white font-bold";
            dateSpan.style.backgroundColor = "";
            dateSpan.textContent = "Aberto agora";
        }
    } else {
        dateSpan.className = "bg-red-500 px-3 py-1 rounded-lg text-white font-bold";
        dateSpan.style.backgroundColor = "";
        dateSpan.textContent = "Fechado agora";

        if (showWarning) showClosedAlert();
    }

    return isOpen;
}

// Atualiza o status da loja a cada 10 segundos
setInterval(checkStoreStatus, 10000);
checkStoreStatus();

// 🔔 ALERTA DE LOJA FECHADA
function showClosedAlert() {
    closedAlert.classList.remove("hidden");
}

closedAlertBtn.addEventListener("click", () => {
    closedAlert.classList.add("hidden");
});

// 📂 ABRIR / FECHAR MODAL DO CARRINHO
cartBtn.addEventListener("click", () => {
    if (!checkStoreStatus(true)) return;
    cartModal.classList.remove("hidden");
    footerBar.classList.add("hidden");
    cartModal.querySelector(".cart-content").scrollTop = 0;
});

closeModalBtn.addEventListener("click", () => {
    cartModal.classList.add("hidden");
    footerBar.classList.remove("hidden");
});

// ➕ ADICIONAR PRODUTO AO CARRINHO
document.querySelectorAll(".add-to-cart-btn").forEach(button => {
    button.addEventListener("click", () => {
        if (!checkStoreStatus(true)) return;

        const name = button.getAttribute("data-name");
        const price = parseFloat(button.getAttribute("data-price"));

        const existing = cart.find(item => item.name === name);
        if (existing) {
            existing.quantity++;
        } else {
            cart.push({ name, price, quantity: 1 });
        }

        updateCart();

        // Feedback visual no botão
        const originalHTML = button.innerHTML;
        button.innerHTML = `<i class="fa fa-check mr-1"></i> Adicionado`;
        button.classList.add("bg-green-600");

        setTimeout(() => {
            button.innerHTML = originalHTML;
            button.classList.remove("bg-green-600");
        }, 1200);
    });
});

// 🔄 ATUALIZAR VISUAL DO CARRINHO
function updateCart() {
    cartItemsContainer.innerHTML = "";
    let total = 0;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `<p class="text-center text-gray-500 py-8">Seu carrinho está vazio</p>`;
        cartTotal.innerText = "0.00";
        cartCount.innerText = "0";
        return;
    }

    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        const cartItemElement = document.createElement("div");
        cartItemElement.style.cssText = `
            display:flex;
            justify-content:space-between;
            align-items:center;
            padding:15px 0;
            border-bottom:1px solid #eee;
            flex-wrap:wrap;
            gap:10px;
        `;

        cartItemElement.innerHTML = `
            <div>
                <div style="font-weight:bold; font-size:18px;">${item.name}</div>
                <div style="color:#666; font-size:14px;">Preço unitário: R$ ${item.price.toFixed(2)}</div>
            </div>

            <div style="display:flex; align-items:center; gap:10px;">
                <button class="decrease-btn" data-index="${index}" style="
                    width:36px; height:36px; border:none; border-radius:6px;
                    font-size:20px; background:#e5e7eb; cursor:pointer;
                    display:flex; align-items:center; justify-content:center;
                ">−</button>

                <span style="font-size:18px; font-weight:bold; min-width:25px; text-align:center;">
                    ${item.quantity}
                </span>

                <button class="increase-btn" data-index="${index}" style="
                    width:36px; height:36px; border:none; border-radius:6px;
                    font-size:20px; background:#22c55e; color:white; cursor:pointer;
                    display:flex; align-items:center; justify-content:center;
                ">+</button>

                <span style="font-size:18px; font-weight:bold; min-width:90px; text-align:right;">
                    R$ ${itemTotal.toFixed(2)}
                </span>
            </div>
        `;

        cartItemsContainer.appendChild(cartItemElement);
    });

    cartTotal.innerText = total.toFixed(2);
    cartCount.innerText = cart.reduce((acc, item) => acc + item.quantity, 0);

    addQuantityEvents();
}

// ➕➖ CONTROLE DE QUANTIDADE DENTRO DO CARRINHO
function addQuantityEvents() {
    document.querySelectorAll(".increase-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const index = parseInt(btn.getAttribute("data-index"));
            cart[index].quantity++;
            updateCart();
        });
    });

    document.querySelectorAll(".decrease-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const index = parseInt(btn.getAttribute("data-index"));
            if (cart[index].quantity > 1) {
                cart[index].quantity--;
            } else {
                cart.splice(index, 1);
            }
            updateCart();
        });
    });
}

// 📤 FINALIZAR PEDIDO E ENVIAR PARA O WHATSAPP
document.getElementById("checkout-btn").addEventListener("click", () => {
    const name = document.getElementById("customer-name").value.trim();
    const address = document.getElementById("address").value.trim();
    const payment = document.getElementById("payment-method").value;
    const obs = document.getElementById("observations").value.trim();

    if (cart.length === 0) {
        alert("Seu carrinho está vazio! Adicione itens antes de finalizar.");
        return;
    }

    if (address.length < 5) {
        document.getElementById("address-warn").classList.remove("hidden");
        return;
    } else {
        document.getElementById("address-warn").classList.add("hidden");
    }

    // Monta a mensagem formatada
    let message = `📦 *NOVO PEDIDO*\n\n`;
    message += `👤 *Nome:* ${name || "Não informado"}\n`;
    message += `🏠 *Endereço:* ${address}\n`;
    message += `💳 *Forma de pagamento:* ${payment}\n\n`;
    message += `🛒 *Itens do pedido:*\n`;

    cart.forEach(item => {
        message += `• ${item.name} | ${item.quantity}x | R$ ${(item.price * item.quantity).toFixed(2)}\n`;
    });

    message += `\n💬 *Observações:* ${obs || "Nenhuma observação"}\n`;
    message += `💰 *Total do pedido:* R$ ${cartTotal.innerText}`;

    // Número do WhatsApp da loja
    const whatsappNumber = "5519989021323"; 
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

    // Abre a conversa no WhatsApp
    window.open(url, "_blank");
});

// 📱 MENU LATERAL
const menuToggle = document.getElementById('menuToggle');
const sidebar = document.getElementById('sidebar');
const sidebarContent = document.getElementById('sidebarContent');
const closeSidebar = document.getElementById('closeSidebar');

menuToggle.addEventListener('click', () => {
    sidebar.classList.remove('hidden');
    setTimeout(() => sidebarContent.classList.remove('translate-x-[-100%]'), 10);
});

function fecharMenu() {
    sidebarContent.classList.add('translate-x-[-100%]');
    setTimeout(() => sidebar.classList.add('hidden'), 300);
}

closeSidebar.addEventListener('click', fecharMenu);
sidebar.addEventListener('click', (e) => e.target === sidebar && fecharMenu());

// 🔍 FILTRO DE CATEGORIAS
const botoesCategoria = document.querySelectorAll('.categoria-btn');
const produtos = document.querySelectorAll('.produto');

botoesCategoria.forEach(botao => {
    botao.addEventListener('click', () => {
        botoesCategoria.forEach(b => {
            b.classList.remove('bg-red-600', 'text-white', 'active');
            b.classList.add('bg-white', 'border', 'border-gray-200', 'hover:bg-gray-100');
        });
        botao.classList.add('bg-red-600', 'text-white', 'active');
        botao.classList.remove('bg-white', 'border', 'border-gray-200', 'hover:bg-gray-100');

        const categoria = botao.dataset.categoria;
        produtos.forEach(produto => {
            if (categoria === 'todos' || produto.dataset.categoria === categoria) {
                produto.classList.remove('hidden');
            } else {
                produto.classList.add('hidden');
            }
        });
    });
});

// ➕➖ CONTROLE DE QUANTIDADE NOS PRODUTOS
document.querySelectorAll('.qtd-btn').forEach(botao => {
    botao.addEventListener('click', () => {
        const qtdEl = botao.parentElement.querySelector('.quantidade');
        let qtd = parseInt(qtdEl.textContent);
        if (botao.classList.contains('aumentar')) qtd++;
        if (botao.classList.contains('diminuir') && qtd > 1) qtd--;
        qtdEl.textContent = qtd;
    });
});