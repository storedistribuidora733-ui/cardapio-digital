const cart = [];
const cartBtn = document.getElementById("cart-btn");
const cartModal = document.getElementById("cart-modal");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const cartCount = document.getElementById("cart-count");
const closeModalBtns = document.querySelectorAll("#close-modal-btn, #close-modal-btn-2");
const closedAlert = document.getElementById("closed-alert");
const closedAlertBtn = document.getElementById("closed-alert-btn");

// ⏰ HORÁRIOS
const openingHour = 8;
const closingHour = 22;
const dateSpan = document.getElementById("date-span");

function checkStoreStatus(showWarning = false) {
    const agora = new Date();
    const hora = agora.getHours();
    const minutos = agora.getMinutes();
    const totalMinutos = hora * 60 + minutos;

    const aberturaMin = openingHour * 60;
    const fechamentoMin = closingHour * 60;

    const aberta = totalMinutos >= aberturaMin && totalMinutos < fechamentoMin;

    if (aberta) {
        const minutosRestantes = fechamentoMin - totalMinutos;
        if (minutosRestantes <= 20) {
            dateSpan.textContent = "⚠ Últimos minutos - Fecha em breve!";
            dateSpan.style.backgroundColor = "#ffc107";
            dateSpan.style.color = "#111";
        } else {
            dateSpan.textContent = "✅ Aberto agora • 08:00 às 22:00";
            dateSpan.style.backgroundColor = "#22c55e";
            dateSpan.style.color = "white";
        }
    } else {
        dateSpan.textContent = "🔒 Fechado agora • Volta às 08:00";
        dateSpan.style.backgroundColor = "#e51e25";
        dateSpan.style.color = "white";
        if (showWarning) closedAlert.classList.remove("hidden");
    }

    return aberta;
}

setInterval(checkStoreStatus, 10000);
checkStoreStatus();

closedAlertBtn.addEventListener("click", () => closedAlert.classList.add("hidden"));

// 📂 ABRIR / FECHAR CARRINHO
cartBtn.addEventListener("click", () => {
    if (!checkStoreStatus(true)) return;
    cartModal.classList.remove("hidden");
    document.body.style.overflow = "hidden";
});

closeModalBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        cartModal.classList.add("hidden");
        document.body.style.overflow = "auto";
    });
});

// ➕ CONTROLE DE QUANTIDADE NOS PRODUTOS
document.querySelectorAll(".qtd-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        const qtdEl = btn.parentElement.querySelector(".qtd-valor");
        let qtd = parseInt(qtdEl.textContent);
        if (btn.classList.contains("aumentar")) qtd++;
        if (btn.classList.contains("diminuir") && qtd > 1) qtd--;
        qtdEl.textContent = qtd;
    });
});

// ➕ ADICIONAR AO CARRINHO
document.querySelectorAll(".add-to-cart-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        if (!checkStoreStatus(true)) return;

        const nome = btn.dataset.name;
        const preco = parseFloat(btn.dataset.price);
        const qtd = parseInt(btn.closest(".produto-card").querySelector(".qtd-valor").textContent);

        const existe = cart.find(item => item.nome === nome);
        if (existe) {
            existe.quantidade += qtd;
        } else {
            cart.push({ nome, preco, quantidade: qtd });
        }

        updateCart();

        // Feedback visual
        const original = btn.innerHTML;
        btn.innerHTML = `<i class="fa fa-check"></i> Adicionado`;
        btn.style.background = "#22c55e";
        setTimeout(() => {
            btn.innerHTML = original;
            btn.style.background = "";
        }, 1300);
    });
});

// 🔄 ATUALIZAR CARRINHO
function updateCart() {
    cartItemsContainer.innerHTML = "";
    let total = 0;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `<p style="text-align:center; padding:30px 0; color:#777;">Seu carrinho está vazio</p>`;
        cartTotal.textContent = "0.00";
        cartCount.textContent = "0";
        return;
    }

    cart.forEach((item, index) => {
        const totalItem = item.preco * item.quantidade;
        total += totalItem;

        const itemEl = document.createElement("div");
        itemEl.className = "cart-item";
        itemEl.innerHTML = `
            <div class="item-info">
                <h4>${item.nome}</h4>
                <p>R$ ${item.preco.toFixed(2)} cada</p>
            </div>
            <div class="item-controle">
                <button class="qtd-btn diminuir-item" data-index="${index}">−</button>
                <span>${item.quantidade}</span>
                <button class="qtd-btn aumentar-item" data-index="${index}">+</button>
                <span style="font-weight:600; min-width:80px; text-align:right;">R$ ${totalItem.toFixed(2)}</span>
            </div>
        `;
        cartItemsContainer.appendChild(itemEl);
    });

    cartTotal.textContent = total.toFixed(2);
    cartCount.textContent = cart.reduce((soma, i) => soma + i.quantidade, 0);

    addCartEvents();
}

function addCartEvents() {
    document.querySelectorAll(".aumentar-item").forEach(btn => {
        btn.addEventListener("click", () => {
            const idx = parseInt(btn.dataset.index);
            cart[idx].quantidade++;
            updateCart();
        });
    });
    document.querySelectorAll(".diminuir-item").forEach(btn => {
        btn.addEventListener("click", () => {
            const idx = parseInt(btn.dataset.index);
            if (cart[idx].quantidade > 1) {
                cart[idx].quantidade--;
            } else {
                cart.splice(idx, 1);
            }
            updateCart();
        });
    });
}

// 📤 FINALIZAR PEDIDO
document.getElementById("checkout-btn").addEventListener("click", () => {
    const nome = document.getElementById("customer-name").value.trim();
    const endereco = document.getElementById("address").value.trim();
    const pagamento = document.getElementById("payment-method").value;
    const obs = document.getElementById("observations").value.trim();
    const avisoEndereco = document.getElementById("address-warn");

    if (cart.length === 0) return alert("Carrinho vazio!");
    if (endereco.length < 8) {
        avisoEndereco.classList.remove("hidden");
        return;
    }
    avisoEndereco.classList.add("hidden");

    let mensagem = `📦 *NOVO PEDIDO*\n\n`;
    mensagem += `👤 *Nome:* ${nome || "Não informado"}\n`;
    mensagem += `🏠 *Endereço:* ${endereco}\n`;
    mensagem += `💳 *Pagamento:* ${pagamento}\n\n`;
    mensagem += `🛒 *Itens:*\n`;
    cart.forEach(i => {
        mensagem += `• ${i.nome} | ${i.quantidade}x | R$ ${(i.preco * i.quantidade).toFixed(2)}\n`;
    });
    mensagem += `\n💬 *Obs:* ${obs || "Nenhuma"}\n`;
    mensagem += `💰 *Total:* R$ ${cartTotal.textContent}`;

    const numero = "5519989021323";
    const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`;
    window.open(url, "_blank");
});

// 🔍 FILTRO CATEGORIAS
document.querySelectorAll(".categoria-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelectorAll(".categoria-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        const cat = btn.dataset.categoria;

        document.querySelectorAll(".produto-card").forEach(prod => {
            if (cat === "todos" || prod.dataset.categoria === cat) {
                prod.style.display = "flex";
            } else {
                prod.style.display = "none";
            }
        });
    });
});