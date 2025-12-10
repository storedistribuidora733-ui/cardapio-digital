/* script.js — versão profissional integrada ao seu HTML existente
   Mantive toda a lógica funcional (carrinho, QZ, WhatsApp).
   Adicionei: status profissional, contagem em tempo real, toasts, proteção QZ.
*/

// -----------------------------
// Configs
// -----------------------------
const WHATSAPP_NUMBER = "19989021323";
const TIME_CHECK_INTERVAL_MS = 1000; // 1s para contagem em tempo real
const defaultOpening = 11 * 60 + 30; // 11:30
const defaultClosing = (26 + 1) * 60; // 25:00 -> 01:00 next day

// -----------------------------
// DOM e estado (usando seus IDs)
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

// toast root
const toastRoot = document.createElement("div");
toastRoot.id = "toast-root";
document.body.appendChild(toastRoot);

// state
let statusState = { isOpen: false, minutesToClose: null, minutesToOpen: null, secondsToClose: null, secondsToOpen: null };
let lastToast = { openedSoon: false, closingSoon: false };

// -----------------------------
// util tempo
function minutesNow() {
    const now = new Date();
    return now.getHours() * 60 + now.getMinutes();
}
function secondsNow() {
    const now = new Date();
    return now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
}
function formatMinutesSeconds(totalSeconds){
    totalSeconds = Math.max(0, Math.floor(totalSeconds));
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m}m ${s}s`;
}
function formatHoursMinutes(totalMinutes){
    const h = Math.floor(totalMinutes / 60);
    const m = totalMinutes % 60;
    return `${h}h${m>0?` ${m}m`:''}`;
}

// -----------------------------
// computeStoreStatus (robusto)
function computeStoreStatus(totalMinutesNow, totalSecondsNow, open, close) {
    const MINUTES_PER_DAY = 1440;
    const SECONDS_PER_DAY = 86400;
    const crossesMidnight = close > MINUTES_PER_DAY;
    let isOpen=false, minutesToClose=null, minutesToOpen=null, secondsToClose=null, secondsToOpen=null;

    if (!crossesMidnight) {
        isOpen = totalMinutesNow >= open && totalMinutesNow < close;
        if (isOpen) {
            minutesToClose = close - totalMinutesNow;
            secondsToClose = (close*60) - totalSecondsNow;
        } else {
            if (totalMinutesNow < open) {
                minutesToOpen = open - totalMinutesNow;
                secondsToOpen = (open*60) - totalSecondsNow;
            } else {
                minutesToOpen = open + MINUTES_PER_DAY - totalMinutesNow;
                secondsToOpen = (open + MINUTES_PER_DAY)*60 - totalSecondsNow;
            }
        }
    } else {
        const adjustedClose = close - MINUTES_PER_DAY;
        isOpen = totalMinutesNow >= open || totalMinutesNow < adjustedClose;
        if (isOpen) {
            if (totalMinutesNow >= open) {
                secondsToClose = (close*60) - totalSecondsNow;
                minutesToClose = Math.ceil(secondsToClose/60);
            } else {
                secondsToClose = (adjustedClose*60) - (totalSecondsNow % SECONDS_PER_DAY);
                minutesToClose = Math.ceil(secondsToClose/60);
            }
        } else {
            if (totalMinutesNow < open) {
                minutesToOpen = open - totalMinutesNow;
                secondsToOpen = (open*60) - totalSecondsNow;
            } else {
                minutesToOpen = open + MINUTES_PER_DAY - totalMinutesNow;
                secondsToOpen = (open + MINUTES_PER_DAY)*60 - totalSecondsNow;
            }
        }
    }

    return {
        isOpen,
        minutesToClose: minutesToClose!=null?Math.max(0,Math.floor(minutesToClose)):null,
        minutesToOpen: minutesToOpen!=null?Math.max(0,Math.floor(minutesToOpen)):null,
        secondsToClose: secondsToClose!=null?Math.max(0,Math.floor(secondsToClose)):null,
        secondsToOpen: secondsToOpen!=null?Math.max(0,Math.floor(secondsToOpen)):null
    };
}

// -----------------------------
// UI: toasts
function showToast(text, timeout = 4500){
    const t = document.createElement('div');
    t.className = 'toast';
    t.textContent = text;
    toastRoot.appendChild(t);
    requestAnimationFrame(()=> t.classList.add('show'));
    setTimeout(()=>{ t.classList.remove('show'); setTimeout(()=>t.remove(),300); }, timeout);
}

// -----------------------------
// Update status display (preserves your #date-span)
function updateStatusDisplay(showWarning=false){
    const nowMin = minutesNow();
    const nowSec = secondsNow();
    // use default single schedule (same each day)
    const open = defaultOpening;
    const close = defaultClosing;

    const status = computeStoreStatus(nowMin, nowSec, open, close);
    statusState = status;

    // apply classes and text to dateSpan (your existing element)
    if (!dateSpan) return;

    // reset classes
    dateSpan.className = '';

    if (status.isOpen) {
        if (status.secondsToClose != null && status.secondsToClose <= 20*60) {
            dateSpan.classList.add('status-open-warn');
            dateSpan.textContent = `⚠ Fecha em ${formatMinutesSeconds(status.secondsToClose)}`;
            if (!lastToast.closingSoon) { showToast(`⚠ Fecha em ${formatMinutesSeconds(status.secondsToClose)}`); lastToast.closingSoon = true; }
        } else {
            dateSpan.classList.add('status-open');
            dateSpan.textContent = '🟢 Estamos abertos — faça seu pedido!';
            lastToast.closingSoon = false;
        }
    } else {
        if (status.secondsToOpen != null && status.secondsToOpen <= 12*3600) {
            dateSpan.classList.add('status-closed-warn');
            if (status.secondsToOpen <= 3600) {
                dateSpan.textContent = `⏰ Abre em ${formatMinutesSeconds(status.secondsToOpen)}`;
            } else {
                dateSpan.textContent = `⏰ Abre em ${formatHoursMinutes(status.minutesToOpen)}`;
            }
            if (!lastToast.openedSoon && status.secondsToOpen <= 15*60) { showToast(`⏰ Abre em ${formatMinutesSeconds(status.secondsToOpen)}`); lastToast.openedSoon = true; }
        } else {
            dateSpan.classList.add('status-closed');
            if (status.minutesToOpen != null && status.minutesToOpen < 24*60) {
                dateSpan.textContent = `🔴 Fechado — abre em ${formatHoursMinutes(status.minutesToOpen)}`;
            } else {
                dateSpan.textContent = '🔴 Fechado agora';
            }
            lastToast.openedSoon = false;
        }

        if (showWarning) showClosedAlert(); // your modal
    }
}

// -----------------------------
// Old checkStoreStatus wrapper (keeps same API your code used)
function checkStoreStatus(showWarning=false){
    updateStatusDisplay(showWarning);
    return statusState.isOpen;
}

// run initial and interval
updateStatusDisplay(false);
setInterval(()=> updateStatusDisplay(false), TIME_CHECK_INTERVAL_MS);

// -----------------------------
// closed alert handlers (keeps your existing UI)
function showClosedAlert(){ closedAlert && closedAlert.classList.remove('hidden'); }
if (closedAlertBtn) closedAlertBtn.addEventListener('click', ()=> closedAlert.classList.add('hidden'));

// -----------------------------
// CART functions (maintain your behavior)
function updateCart(){
    if (!cartItemsContainer) return;
    cartItemsContainer.innerHTML = '';
    let total = 0;
    cart.forEach((item,index)=>{
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        // create row
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

    if (cartTotal) cartTotal.innerText = total.toFixed(2);
    if (cartCount) cartCount.innerText = cart.reduce((acc,i)=>acc+i.quantity,0);

    attachQuantityListeners();
}

function attachQuantityListeners(){
    document.querySelectorAll('.increase-btn').forEach(btn=> btn.replaceWith(btn.cloneNode(true)));
    document.querySelectorAll('.decrease-btn').forEach(btn=> btn.replaceWith(btn.cloneNode(true)));

    document.querySelectorAll('.increase-btn').forEach(btn=>{
        btn.addEventListener('click', ()=>{
            const idx = parseInt(btn.getAttribute('data-index'),10);
            if (!isNaN(idx) && cart[idx]) { cart[idx].quantity++; updateCart(); }
        });
    });
    document.querySelectorAll('.decrease-btn').forEach(btn=>{
        btn.addEventListener('click', ()=>{
            const idx = parseInt(btn.getAttribute('data-index'),10);
            if (isNaN(idx) || !cart[idx]) return;
            if (cart[idx].quantity>1) cart[idx].quantity--; else cart.splice(idx,1);
            updateCart();
        });
    });
}

function escapeHtml(str=''){ return String(str).replace(/[&<>"'`=\/]/g,s=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;','`':'&#96;','=':'&#61;','/':'&#47;'}[s])); }

// add-to-cart buttons (preserve your data attributes)
document.querySelectorAll('.add-to-cart-btn').forEach(button=>{
    button.addEventListener('click', ()=>{
        if (!checkStoreStatus(true)) return;
        const name = button.getAttribute('data-name');
        const price = parseFloat(button.getAttribute('data-price')) || 0;
        const existing = cart.find(i=>i.name===name);
        if (existing) existing.quantity++; else cart.push({ name, price, quantity: 1 });
        updateCart();
        showToast('✅ Item adicionado', 1400);
    });
});

// cart modal open/close (keeps your modal)
if (cartBtn) cartBtn.addEventListener('click', ()=>{
    if (!checkStoreStatus(true)) return;
    cartModal && cartModal.classList.remove('hidden');
    footerBar && footerBar.classList.add('hidden');
    const content = cartModal && cartModal.querySelector('.cart-content');
    if (content) content.scrollTop = 0;
});
if (closeModalBtn) closeModalBtn.addEventListener('click', ()=>{
    cartModal && cartModal.classList.add('hidden');
    footerBar && footerBar.classList.remove('hidden');
});

// -----------------------------
// QZ TRAY helpers (safer)
function connectQzIfNeeded(){
    try {
        if (!(window.qz && qz.websocket)) return Promise.reject('QZ não carregado');
        if (!qz.websocket.isActive()) {
            return qz.websocket.connect();
        }
        return Promise.resolve();
    } catch (e) {
        return Promise.reject(e);
    }
}
function printOrderViaQz(text){
    connectQzIfNeeded().then(()=>{
        const config = qz.configs.create(null, { encoding: 'CP437' });
        const data = [{ type:'raw', format:'plain', data: text }];
        return qz.print(config, data);
    }).then(()=> showToast('🖨️ Impressão enviada')).catch(err=>{
        console.warn('QZ error', err);
        showToast('⚠ Falha ao imprimir automaticamente');
    });
}

// -----------------------------
// finalize (checkout)
const checkoutBtn = document.getElementById('checkout-btn');
if (checkoutBtn) checkoutBtn.addEventListener('click', ()=>{
    const name = document.getElementById('customer-name').value.trim() || 'Cliente';
    const address = document.getElementById('address').value.trim();
    const payment = document.getElementById('payment-method').value;
    const obs = document.getElementById('observations').value.trim();

    if (cart.length===0){ alert('Seu carrinho está vazio!'); return; }
    if (address.length<5){ document.getElementById('address-warn').classList.remove('hidden'); return; }
    else document.getElementById('address-warn').classList.add('hidden');

    let message = `📦 *Novo pedido:*\n\n👤 *Cliente*: ${name}\n🏠 *Endereço*: ${address}\n💳 *Pagamento*: ${payment}\n\n🛒 *Itens:*\n`;
    cart.forEach(item=> message += `• ${item.name} - Qtd: ${item.quantity} - R$ ${(item.price*item.quantity).toFixed(2)}\n`);
    const totalValue = cart.reduce((t,i)=>t + i.price * i.quantity, 0).toFixed(2);
    message += `\n💬 *Observações*: ${obs || 'Nenhuma'}\n💰 *Total:* R$ ${totalValue}`;

    // print & whatsapp
    const receiptText = buildThermalReceipt({ name, address, payment, obs, items: cart, total: totalValue });
    printOrderViaQz(receiptText);

    const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(waUrl, '_blank');

    cart.length = 0; updateCart();
    cartModal && cartModal.classList.add('hidden');
    footerBar && footerBar.classList.remove('hidden');
    showToast('✅ Pedido enviado');
});

// -----------------------------
// buildThermalReceipt (profissional)
// (mantive formato e acrescentei ESC/POS corte)
function buildThermalReceipt({ name, address, payment, obs, items, total }){
    const line = t => t + '\n';
    let txt = '';
    txt += '      *** SABOR EXPRESS ***\n';
    txt += '   Av. Central, 100 - Centro\n';
    txt += '        Tel: (19) 99999-9999\n';
    txt += '--------------------------------\n';
    txt += line(`Cliente : ${name}`);
    txt += line(`Endereço: ${address}`);
    txt += line(`Pagamento: ${payment}`);
    txt += '--------------------------------\n';
    txt += 'ITEM               QTD    TOTAL\n';
    txt += '--------------------------------\n';
    items.forEach(i=>{
        const totalItem = (i.price * i.quantity).toFixed(2);
        let nomeFormatado = i.name.slice(0,16).padEnd(16,' ');
        let qtdFormat = String(i.quantity).padStart(3,' ');
        let totalFormat = String(totalItem).padStart(7,' ');
        txt += `${nomeFormatado} ${qtdFormat} ${totalFormat}\n`;
    });
    txt += '--------------------------------\n';
    txt += `TOTAL: R$ ${total}\n`;
    txt += '--------------------------------\n';
    txt += `OBS: ${obs || 'Nenhuma'}\n\n\n\n`;
    // ESC/POS cut (may or may not be supported by device)
    txt += '\x1B\x69';
    return txt;
}

// -----------------------------
// cleanup on unload
window.addEventListener('beforeunload', ()=>{
    try { if (window.qz && qz.websocket && qz.websocket.isActive()) qz.websocket.disconnect(); } catch(e){}
});

