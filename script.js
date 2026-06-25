script.js
   Carrinho + WhatsApp + Impressão automática (QZ Tray)
   Impressora alvo: térmica 80mm (cupom)
   Número WhatsApp configurado: 19989021323
*/

// -----------------------------
// Variáveis DOM e estado
// -----------------------------
const cart = [];
const cartBtn = document.getElementById("cart-btn");
const cartModal = document.getElementById("cart-modal");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const cartCount = document.getElementById("cart-count");
const closeModalBtn = document.getElementById("close-modal-btn");
const footerBar = document.querySelector("footer");

const closedAlert = document.getElementById("closed-alert");
const closedAlertBtn = document.getElementById("closed-alert-btn");

// HORÁRIOS (em minutos desde meia-noite)
// Exemplo: abre 11:30, fecha 01:00 do dia seguinte -> 25 * 60
const openingHour = 11 * 60 + 30; // abre 11:30
const closingHour = 25 * 60;      // fecha 25:00 (01:00 do dia seguinte)

// elemento de status
const dateSpan = document.getElementById("date-span");

// -----------------------------
// Funções utilitárias de horário
// -----------------------------
function minutesNow() {
    const now = new Date();
    return now.getHours() * 60 + now.getMinutes();
}

/**
 * computeStoreStatus:
 *  - totalMinutesNow: minutos desde meia-noite (0..1439)
 *  - open: abertura em minutos (p. ex. 690)
 *  - close: fechamento em minutos (p. ex. 1500 para 25:00)
 *
 * Retorna: { isOpen, minutesToClose, minutesToOpen }
 */
function computeStoreStatus(totalMinutesNow, open, close) {
    const MINUTES_PER_DAY = 24 * 60;

    // se close > 1440, significa que fecha no dia seguinte (ex: 1500 = 25:00)
    const crossesMidnight = close > MINUTES_PER_DAY;

    if (!crossesMidnight) {
        // caso simples: abre e fecha no mesmo dia
        const isOpen = totalMinutesNow >= open && totalMinutesNow < close;
        const minutesToClose = isOpen ? close - totalMinutesNow : null;
        let minutesToOpen = null;
        if (!isOpen) {
            if (totalMinutesNow < open) {
                minutesToOpen = open - totalMinutesNow;
            } else {
                // já passou hoje -> próxima abertura amanhã
                minutesToOpen = open + MINUTES_PER_DAY - totalMinutesNow;
            }
        }
        return {
            isOpen,
            minutesToClose: minutesToClose != null ? Math.max(0, Math.floor(minutesToClose)) : null,
            minutesToOpen: minutesToOpen != null ? Math.max(0, Math.floor(minutesToOpen)) : null
        };
    }

    // caso atravessa meia-noite (close > 1440)
    const adjustedClose = close - MINUTES_PER_DAY; // ex: 1500 -> adjustedClose = 60

    // A loja está aberta se:
    // - estamos após a abertura (open..23:59), ou
    // - estamos antes do adjustedClose (00:00..adjustedClose-1)
    const isOpen = (totalMinutesNow >= open) || (totalMinutesNow < adjustedClose);

    let minutesToClose = null;
    let minutesToOpen = null;

    if (isOpen) {
        // calcular minutos até fechar
        if (totalMinutesNow >= open) {
            // ainda no "lado antes da meia-noite"
            // close está em escala >1440, então subtrai direto
            minutesToClose = close - totalMinutesNow;
        } else {
            // já passou meia-noite: totalMinutesNow < adjustedClose
            minutesToClose = adjustedClose - totalMinutesNow;
        }
    } else {
        // fechado -> calcular minutos até abrir
        if (totalMinutesNow < open) {
            // abre hoje, ainda antes de abrir
            minutesToOpen = open - totalMinutesNow;
        } else {
            // já passou a abertura e estamos fora do período -> próxima abertura amanhã
            minutesToOpen = open + MINUTES_PER_DAY - totalMinutesNow;
        }
    }

    return {
        isOpen,
        minutesToClose: minutesToClose != null ? Math.max(0, Math.floor(minutesToClose)) : null,
        minutesToOpen: minutesToOpen != null ? Math.max(0, Math.floor(minutesToOpen)) : null
    };
}

// -----------------------------
// Função: verificação de horário (com UI)
// -----------------------------
function checkStoreStatus(showWarning = false) {
    const totalMinutesNow = minutesNow();

    const { isOpen, minutesToClose, minutesToOpen } = computeStoreStatus(totalMinutesNow, openingHour, closingHour);

    if (isOpen) {
        // Loja aberta
        if (minutesToClose !== null && minutesToClose <= 20) {
            dateSpan.className = "px-3 py-1 rounded-lg text-black font-bold";
            dateSpan.style.backgroundColor = "#FFD54F";
            dateSpan.textContent = `⚠ ${minutesToClose} minuto${minutesToClose === 1 ? "" : "s"} para fechar!`;
        } else {
            dateSpan.className = "bg-green-500 px-3 py-1 rounded-lg text-white font-bold";
            dateSpan.style.backgroundColor = "";
            dateSpan.textContent = "Aberto agora";
        }
    } else {
        // Loja fechada
        if (minutesToOpen !== null && minutesToOpen <= 24 * 60) {
            if (minutesToOpen < 60) {
                dateSpan.textContent = `⏰ Abre em ${minutesToOpen} minuto${minutesToOpen === 1 ? "" : "s"}`;
            } else {
                const h = Math.floor(minutesToOpen / 60);
                const m = minutesToOpen % 60;
                dateSpan.textContent = `⏰ Abre em ${h}h${m > 0 ? ` ${m}m` : ""}`;
            }
        } else {
            dateSpan.textContent = "Fechado agora";
        }

        dateSpan.className = "bg-red-500 px-3 py-1 rounded-lg text-white font-bold";
        dateSpan.style.backgroundColor = "";

        if (showWarning) showClosedAlert();
    }

    return isOpen;
}

// atualizar a cada 10s (ou ajuste conforme desejar)
setInterval(() => checkStoreStatus(false), 10000);
checkStoreStatus(false);

// -----------------------------
// Alertas
// -----------------------------
function showClosedAlert() {
    closedAlert.classList.remove("hidden");
}

closedAlertBtn.addEventListener("click", () => {
    closedAlert.classList.add("hidden");
});

// -----------------------------
// Modal do carrinho
// -----------------------------
cartBtn.addEventListener("click", () => {
    if (!checkStoreStatus(true)) return;
    cartModal.classList.remove("hidden");
    footerBar.classList.add("hidden");
    const content = cartModal.querySelector(".cart-content");
    if (content) content.scrollTop = 0;
});

closeModalBtn.addEventListener("click", () => {
    cartModal.classList.add("hidden");
    footerBar.classList.remove("hidden");
});

// -----------------------------
// Adicionar ao carrinho
// -----------------------------
document.querySelectorAll(".add-to-cart-btn").forEach(button => {
    button.addEventListener("click", () => {
        if (!checkStoreStatus(true)) return;

        const name = button.getAttribute("data-name");
        const price = parseFloat(button.getAttribute("data-price")) || 0;

        const existing = cart.find(item => item.name === name);
        if (existing) {
            existing.quantity++;
        } else {
            cart.push({ name, price, quantity: 1 });
        }

        updateCart();
    });
});

// -----------------------------
// Atualizar visual do carrinho
// -----------------------------
function updateCart() {
    cartItemsContainer.innerHTML = "";
    let total = 0;

    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        const cartItemElement = document.createElement("div");
        cartItemElement.classList.add("flex", "items-center", "justify-between", "py-2");

        cartItemElement.innerHTML = `
            <div>
                <p class="font-bold">${item.name}</p>
                <p>Qtd: ${item.quantity}</p>
            </div>
            <div class="flex items-center gap-4">
                <button class="decrease-btn font-bold text-white bg-black w-10 h-10 flex items-center justify-center rounded" data-index="${index}">−</button>
                <button class="increase-btn font-bold text-white bg-black w-10 h-10 flex items-center justify-center rounded" data-index="${index}">+</button>
                <p class="font-bold">R$ ${itemTotal.toFixed(2)}</p>
            </div>
        `;

        cartItemsContainer.appendChild(cartItemElement);
    });

    cartTotal.innerText = total.toFixed(2);
    cartCount.innerText = cart.reduce((acc, item) => acc + item.quantity, 0);

    addQuantityEvents();
}

function addQuantityEvents() {
    // remove listeners duplicados clonando nós
    document.querySelectorAll(".increase-btn").forEach(btn => {
        btn.replaceWith(btn.cloneNode(true));
    });
    document.querySelectorAll(".decrease-btn").forEach(btn => {
        btn.replaceWith(btn.cloneNode(true));
    });

    document.querySelectorAll(".increase-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const index = parseInt(btn.getAttribute("data-index"), 10);
            if (!isNaN(index) && cart[index]) {
                cart[index].quantity++;
                updateCart();
            }
        });
    });

    document.querySelectorAll(".decrease-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            const index = parseInt(btn.getAttribute("data-index"), 10);
            if (isNaN(index) || !cart[index]) return;
            if (cart[index].quantity > 1) {
                cart[index].quantity--;
            } else {
                cart.splice(index, 1);
            }
            updateCart();
        });
    });
}

// -----------------------------
// QZ TRAY: conexão (opcional precoce)
// -----------------------------
/*
  Observação:
  - Certifique-se que o lojista baixe/instale o QZ Tray em https://qz.io/download/
  - Ao abrir o site, o QZ Tray precisa autorizar a conexão (uma vez) na máquina da loja.
*/
function connectQzIfNeeded() {
    try {
        if (!qz.websocket.isActive()) {
            qz.websocket.connect().then(() => {
                console.log("QZ Tray: conectado");
            }).catch(err => {
                console.warn("QZ Tray: não conectado (ok se não instalado).", err);
            });
        }
    } catch (e) {
        console.warn("QZ Tray não disponível (biblioteca não carregada).", e);
    }
}

// tenta conectar ao carregar a página (não obrigatório)
window.addEventListener("load", () => {
    connectQzIfNeeded();
});

// -----------------------------
// Função que monta o texto do cupom térmico
// -----------------------------
function buildThermalReceipt({ name, address, payment, obs, items, total }) {
    // Largura típica de 80mm ~ 32-40 chars por linha dependendo da fonte.
    // Montamos com ~32 chars por linha.
    const line = (txt = "") => txt + "\n";
    let text = "";
    text += "NOME DA LOJA\n";
    text += "ENDEREÇO DA LOJA\n";
    text += "-------------------------------\n";
    text += `Cliente: ${name}\n`;
    text += `End: ${address}\n`;
    text += `Pagamento: ${payment}\n`;
    text += "-------------------------------\n";
    text += "ITENS\n";

    items.forEach(item => {
        // Nome + qtd + preço por linha
        const itemLine = `${item.name} x${item.quantity}  R$ ${(item.price * item.quantity).toFixed(2)}`;
        text += itemLine + "\n";
    });

    text += "-------------------------------\n";
    text += `TOTAL: R$ ${total}\n`;
    text += "-------------------------------\n";
    text += `Obs: ${obs || "Nenhuma"}\n\n`;
    text += "\n\n"; // espaço para o papel
    // tentativa de comando de corte (algumas impressoras aceitam)
    // adicionar bytes de comando como string pode ou não funcionar conforme impressora,
    // QZ também aceita arrays de bytes se necessário. Vamos enviar texto simples primeiro.
    return text;
}

// -----------------------------
// Imprimir via QZ Tray (térmica)
// -----------------------------
function printOrderViaQz(text) {
    try {
        // assegura conexão
        const connectPromise = (qz && qz.websocket && qz.websocket.isActive()) ? Promise.resolve() : qz.websocket.connect();

        connectPromise.then(() => {
            // usa impressora padrão (null) - se quiser uma impressora específica, passe o nome
            const config = qz.configs.create(null, {
                encoding: "CP437" // encoding comum para termicas; ajuste se necessário
            });

            const data = [{
                type: "raw",
                format: "plain",
                data: text
            }];

            return qz.print(config, data);
        }).then(() => {
            console.log("Impressão enviada com sucesso.");
        }).catch(err => {
            console.error("Erro na impressão:", err);
            alert("Falha ao imprimir automaticamente. Verifique se o QZ Tray está instalado e autorizado na máquina da loja.");
        });
    } catch (err) {
        console.error("Erro printOrderViaQz:", err);
    }
}

// -----------------------------
// FINALIZAR PEDIDO: WhatsApp + Impressão
// -----------------------------
document.getElementById("checkout-btn").addEventListener("click", () => {
    const name = document.getElementById("customer-name").value.trim() || "Cliente";
    const address = document.getElementById("address").value.trim();
    const payment = document.getElementById("payment-method").value;
    const obs = document.getElementById("observations").value.trim();

    if (cart.length === 0) {
        alert("Seu carrinho está vazio!");
        return;
    }

    if (address.length < 5) {
        document.getElementById("address-warn").classList.remove("hidden");
        return;
    } else {
        document.getElementById("address-warn").classList.add("hidden");
    }

    // Monta mensagem para WhatsApp (com emojis/estilo)
    let message = `📦 *Novo pedido:*\n\n`;
    message += `👤 *Cliente*: ${name}\n`;
    message += `🏠 *Endereço*: ${address}\n`;
    message += `💳 *Pagamento*: ${payment}\n\n`;
    message += `🛒 *Itens:*\n`;

    cart.forEach(item => {
        message += `• ${item.name} - Qtd: ${item.quantity} - R$ ${(item.price * item.quantity).toFixed(2)}\n`;
    });

    const totalValue = cart.reduce((t, i) => t + i.price * i.quantity, 0).toFixed(2);

    message += `\n💬 *Observações*: ${obs || "Nenhuma"}\n`;
    message += `💰 *Total:* R$ ${totalValue}`;

    // ---------- Imprime via QZ (cupom térmico)
    const thermalData = {
        name,
        address,
        payment,
        obs,
        items: cart,
        total: totalValue
    };

    const receiptText = buildThermalReceipt(thermalData);
    printOrderViaQz(receiptText);

    // ---------- Envia para WhatsApp (abre em nova aba)
    const whatsappNumber = "19989021323"; // número que você passou
    const waUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(waUrl, "_blank");

    // opcional: esvaziar carrinho e fechar modal
    cart.length = 0;
    updateCart();
    cartModal.classList.add("hidden");
    footerBar.classList.remove("hidden");
});

// -----------------------------
// Segurança: desconectar QZ ao fechar página
// -----------------------------
window.addEventListener("beforeunload", () => {
    try {
        if (qz && qz.websocket && qz.websocket.isActive()) {
            qz.websocket.disconnect();
        }
    } catch (e) {
        // ignore
    }
});