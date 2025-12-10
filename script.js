// script.js — versão corrigida: fechamento 04:00, execução após DOM ready,
// exibe alerta de loja fechada e bloqueia ações quando necessário.

// -----------------------------
// Configurações
// -----------------------------
const WHATSAPP_NUMBER = "19989021323";
const TIME_CHECK_INTERVAL_MS = 1000;

// Horário: abre 11:30 e fecha 04:00 (dia seguinte)
// Representamos closing como minutos além da meia-noite -> 24*60 + 4*60
const defaultOpening = 11 * 60 + 30; // 690 (11:30)
const defaultClosing = (24 * 60) + (4 * 60); // 1680 (28:00 -> 04:00 next day)

// -----------------------------
// Encapsula tudo até DOM pronto
// -----------------------------
document.addEventListener('DOMContentLoaded', () => {

    // DOM
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

    const dateSpan = document.getElementById("date-span");

    // toast root (cria só se não existir)
    let toastRoot = document.getElementById("toast-root");
    if (!toastRoot) {
        toastRoot = document.createElement("div");
        toastRoot.id = "toast-root";
        document.body.appendChild(toastRoot);
    }

    // estado
    let statusState = { isOpen: false, minutesToClose: null, minutesToOpen: null, secondsToClose: null, secondsToOpen: null };
    let lastToast = { openedSoon: false, closingSoon: false };

    // -----------------------------
    // util tempo
    // -----------------------------
    function minutesNow() {
        const now = new Date();
        return now.getHours() * 60 + now.getMinutes();
    }
    function secondsNow() {
        const now = new Date();
        return now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
    }
    function formatMinutesSeconds(totalSeconds) {
        totalSeconds = Math.max(0, Math.floor(totalSeconds));
        const m = Math.floor(totalSeconds / 60);
        const s = totalSeconds % 60;
        return `${m}m ${s}s`;
    }
    function formatHoursMinutes(totalMinutes) {
        const h = Math.floor(totalMinutes / 60);
        const m = totalMinutes % 60;
        return `${h}h${m > 0 ? ` ${m}m` : ''}`;
    }

    // -----------------------------
    // computeStoreStatus (robusto e testado)
    // - open: minutos (0..1439)
    // - close: pode ser > 1440 para indicar dia seguinte
    // -----------------------------
    function computeStoreStatus(totalMinutesNow, totalSecondsNow, open, close) {
        const MINUTES_PER_DAY = 1440;
        const SECONDS_PER_DAY = 86400;
        const crossesMidnight = close > MINUTES_PER_DAY;
        let isOpen = false, minutesToClose = null, minutesToOpen = null, secondsToClose = null, secondsToOpen = null;

        if (!crossesMidnight) {
            // exemplo: open=690, close=1320 (normal)
            isOpen = totalMinutesNow >= open && totalMinutesNow < close;
            if (isOpen) {
                secondsToClose = (close * 60) - totalSecondsNow;
                minutesToClose = Math.ceil(secondsToClose / 60);
            } else {
                if (totalMinutesNow < open) {
                    secondsToOpen = (open * 60) - totalSecondsNow;
                } else {
                    secondsToOpen = (open + MINUTES_PER_DAY) * 60 - totalSecondsNow;
                }
                minutesToOpen = Math.ceil(secondsToOpen / 60);
            }
        } else {
            // fecha após meia-noite, ex: close = 1680 (28:00 -> 04:00)
            const adjustedClose = close - MINUTES_PER_DAY; // 1680-1440 = 240 -> 04:00
            isOpen = totalMinutesNow >= open || totalMinutesNow < adjustedClose;

            if (isOpen) {
                // calculamos secondsToClose considerando se estamos antes ou depois da meia-noite
                if (totalMinutesNow >= open) {
                    secondsToClose = (close * 60) - totalSecondsNow;
                } else {
                    // estamos na faixa 0..adjustedClose-1
                    // converte totalSecondsNow no dia corrente e compara com adjustedClose
                    secondsToClose = (adjustedClose * 60) - totalSecondsNow;
                    if (secondsToClose < 0) {
                        // quando totalSecondsNow é > SECONDS_PER_DAY (não deve ocorrer), corrigimos
                        secondsToClose = (adjustedClose * 60) + SECONDS_PER_DAY - (totalSecondsNow % SECONDS_PER_DAY);
                    }
                }
                minutesToClose = Math.ceil(secondsToClose / 60);
            } else {
                if (totalMinutesNow < open) {
                    secondsToOpen = (open * 60) - totalSecondsNow;
                } else {
                    secondsToOpen = (open + MINUTES_PER_DAY) * 60 - totalSecondsNow;
                }
                minutesToOpen = Math.ceil(secondsToOpen / 60);
            }
        }

        return {
            isOpen,
            minutesToClose: minutesToClose != null ? Math.max(0, minutesToClose) : null,
            minutesToOpen: minutesToOpen != null ? Math.max(0, minutesToOpen) : null,
            secondsToClose: secondsToClose != null ? Math.max(0, Math.floor(secondsToClose)) : null,
            secondsToOpen: secondsToOpen != null ? Math.max(0, Math.floor(secondsToOpen)) : null
        };
    }

    // -----------------------------
    // toasts simples
    // -----------------------------
    function showToast(text, timeout = 3500) {
        const t = document.createElement('div');
        t.className = 'toast';
        t.textContent = text;
        toastRoot.appendChild(t);
        requestAnimationFrame(() => t.classList.add('show'));
        setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 300); }, timeout);
    }

    // -----------------------------
    // Atualiza display de status e mostra alerta quando fechado
    // -----------------------------
    function updateStatusDisplay(showWarning = false) {
        const nowMin = minutesNow();
        const nowSec = secondsNow();

        const status = computeStoreStatus(nowMin, nowSec, defaultOpening, defaultClosing);
        statusState = status;

        // debug (comente em produção)
        // console.log('STATUS_CHECK', { nowMin, nowSec, status, defaultOpening, defaultClosing });

        if (!dateSpan) return;

        dateSpan.className = '';

        if (status.isOpen) {
            dateSpan.classList.add('status-open');
            // se estiver abrindo em breve, mostrará contagem, senão mensagem padrão
            if (status.secondsToClose != null && status.secondsToClose <= 20 * 60) {
                dateSpan.textContent = `⚠ Fecha em ${formatMinutesSeconds(status.secondsToClose)}`;
                if (!lastToast.closingSoon) { showToast(`⚠ Fecha em ${formatMinutesSeconds(status.secondsToClose)}`); lastToast.closingSoon = true; }
            } else {
                dateSpan.textContent = '🟢 Estamos abertos — faça seu pedido!';
                lastToast.closingSoon = false;
            }
        } else {
            dateSpan.classList.add('status-closed');
            // mensagem simples para cliente
            dateSpan.textContent = '🔴 Loja fechada no momento';
            if (status.secondsToOpen != null && status.secondsToOpen <= 12 * 3600) {
                // se abre em menos de 12h, mostra tempo restante
                if (status.secondsToOpen <= 3600) {
                    dateSpan.textContent = `⏰ Abre em ${formatMinutesSeconds(status.secondsToOpen)}`;
                } else {
                    dateSpan.textContent = `⏰ Abre em ${formatHoursMinutes(status.minutesToOpen)}`;
                }
                if (!lastToast.openedSoon && status.secondsToOpen <= 15 * 60) {
                    showToast(`⏰ Abre em ${formatMinutesSeconds(status.secondsToOpen)}`);
                    lastToast.openedSoon = true;
                }
            } else {
                lastToast.openedSoon = false;
            }

            if (showWarning) showClosedAlert();
        }
    }

    function checkStoreStatus(showWarning = false) {
        updateStatusDisplay(showWarning);
        return statusState.isOpen;
    }

    // inicial + intervalo
    updateStatusDisplay(false);
    setInterval(() => updateStatusDisplay(false), TIME_CHECK_INTERVAL_MS);

    // -----------------------------
    // closed alert handlers
    // -----------------------------
    function showClosedAlert() { closedAlert && closedAlert.classList.remove('hidden'); }
    if (closedAlertBtn) closedAlertBtn.addEventListener('click', () => closedAlert.classList.add('hidden'));

    // -----------------------------
    // CART (simples e seguro)
    // -----------------------------
    function updateCart() {
        if (!cartItemsContainer) return;
        cartItemsContainer.innerHTML = '';
        let total = 0;
        cart.forEach((item, index) => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            const div = document.createElement('div');
            div.className = 'cart-item-row';
            div.innerHTML = `
                <div class="cart-item-info">
                    <p class="font-bold">${escapeHtml(item.name)}</p>
                    <p class="muted">Qtd: ${item.quantity}</p>
                </div>
                <div class="cart-item-controls flex items-center gap-2">
                    <button class="decrease-btn px-3 py-1 bg-gray-800 text-white rounded" data-index="${index}">−</button>
                    <button class="increase-btn px-3 py-1 bg-gray-800 text-white rounded" data-index="${index}">+</button>
                    <p class="font-bold">R$ ${itemTotal.toFixed(2)}</p>
                </div>
            `;
            cartItemsContainer.appendChild(div);
        });
        if (cartTotal) cartTotal.textContent = total.toFixed(2);
        if (cartCount) cartCount.textContent = cart.reduce((acc, i) => acc + i.quantity, 0);
        attachQuantityListeners();
    }

    function attachQuantityListeners() {
        document.querySelectorAll('.increase-btn').forEach(btn => {
            btn.onclick = () => {
                const idx = Number(btn.dataset.index);
                if (!Number.isInteger(idx) || !cart[idx]) return;
                cart[idx].quantity++;
                updateCart();
            };
        });
        document.querySelectorAll('.decrease-btn').forEach(btn => {
            btn.onclick = () => {
                const idx = Number(btn.dataset.index);
                if (!Number.isInteger(idx) || !cart[idx]) return;
                if (cart[idx].quantity > 1) cart[idx].quantity--;
                else cart.splice(idx, 1);
                updateCart();
            };
        });
    }

    function escapeHtml(str = '') {
        return String(str).replace(/[&<>"'`=\/]/g, s => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;', '`': '&#96;', '=': '&#61;', '/': '&#47;' }[s]));
    }

    // -----------------------------
    // adicionar ao carrinho (bloqueado se fechado)
    // -----------------------------
    document.querySelectorAll('.add-to-cart-btn').forEach(button => {
        button.addEventListener('click', () => {
            // tenta adicionar; se fechado, mostra alert/modal
            if (!checkStoreStatus(true)) {
                // feedback visual
                showToast('🔴 Loja fechada — não é possível adicionar', 2500);
                return;
            }
            const name = String(button.dataset.name || '').trim();
            const price = Number(button.dataset.price) || 0;
            const existing = cart.find(i => i.name === name);
            if (existing) existing.quantity++;
            else cart.push({ name, price, quantity: 1 });
            updateCart();
            showToast('✔ Item adicionado', 1200);
        });
    });

    // abrir/fechar modal carrinho (bloqueado se fechado)
    if (cartBtn) cartBtn.addEventListener('click', () => {
        if (!checkStoreStatus(true)) {
            showToast('🔴 Loja fechada — pedidos indisponíveis', 1800);
            return;
        }
        cartModal && cartModal.classList.remove('hidden');
        footerBar && footerBar.classList.add('hidden');
    });
    if (closeModalBtn) closeModalBtn.addEventListener('click', () => {
        cartModal && cartModal.classList.add('hidden');
        footerBar && footerBar.classList.remove('hidden');
    });

    // -----------------------------
    // checkout (mantém comportamento)
    // -----------------------------
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) checkoutBtn.addEventListener('click', () => {
        if (!checkStoreStatus(true)) { showToast('🔴 Loja fechada — não é possível finalizar', 1800); return; }

        const name = document.getElementById('customer-name').value.trim() || 'Cliente';
        const address = document.getElementById('address').value.trim();
        const payment = document.getElementById('payment-method').value;
        const obs = document.getElementById('observations').value.trim();

        if (cart.length === 0) { alert('Seu carrinho está vazio!'); return; }
        if (address.length < 5) { document.getElementById('address-warn').classList.remove('hidden'); return; }
        else document.getElementById('address-warn').classList.add('hidden');

        let message = `📦 *Novo pedido:*\n\n👤 *Cliente*: ${name}\n🏠 *Endereço*: ${address}\n💳 *Pagamento*: ${payment}\n\n🛒 *Itens:*\n`;
        cart.forEach(item => message += `• ${item.name} - Qtd: ${item.quantity} - R$ ${(item.price * item.quantity).toFixed(2)}\n`);
        const totalValue = cart.reduce((t, i) => t + i.price * i.quantity, 0).toFixed(2);
        message += `\n💬 *Observações*: ${obs || 'Nenhuma'}\n💰 *Total:* R$ ${totalValue}`;

        // abre WhatsApp com mensagem
        const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
        window.open(waUrl, '_blank');

        // limpa carrinho e fecha modal
        cart.length = 0; updateCart();
        cartModal && cartModal.classList.add('hidden');
        footerBar && footerBar.classList.remove('hidden');
        showToast('✅ Pedido iniciado via WhatsApp');
    });

    // -----------------------------
    // util: showClosedAlert wrapper (apenas segurança)
    // -----------------------------
    function showClosedAlert() { closedAlert && closedAlert.classList.remove('hidden'); }

    // -----------------------------
    // final: desconexões (se tiver QZ)
    // -----------------------------
    window.addEventListener('beforeunload', () => {
        try { if (window.qz && qz.websocket && qz.websocket.isActive()) qz.websocket.disconnect(); } catch (e) { /* ignore */ }
    });

}); // DOMContentLoaded
