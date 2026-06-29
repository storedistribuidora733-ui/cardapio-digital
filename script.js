const carrinho = [];

// Elementos gerais
const statusLojaEl = document.getElementById('status-loja');
const abrirCarrinhoBtn = document.getElementById('abrir-carrinho');
const modalCarrinho = document.getElementById('modal-carrinho');
const fecharModalBtns = [document.getElementById('fechar-modal'), document.getElementById('btn-fechar')];
const listaItensCarrinho = document.getElementById('lista-itens-carrinho');
const valorTotalEl = document.getElementById('valor-total');
const qtdCarrinhoEl = document.getElementById('qtd-carrinho');
const alertaFechado = document.getElementById('alerta-fechado');
const btnEntendi = document.getElementById('btn-entendi');

// Horário de funcionamento
const HORA_ABERTURA = 8;
const HORA_FECHAMENTO = 22;

// ---------------- STATUS DA LOJA ----------------
function verificarStatusLoja(mostrarAviso = false) {
    const agora = new Date();
    const hora = agora.getHours();
    const minutos = agora.getMinutes();
    const totalMinutos = hora * 60 + minutos;

    const aberturaMin = HORA_ABERTURA * 60;
    const fechamentoMin = HORA_FECHAMENTO * 60;

    const aberta = totalMinutos >= aberturaMin && totalMinutos < fechamentoMin;

    if (aberta) {
        const minutosRestantes = fechamentoMin - totalMinutos;
        if (minutosRestantes <= 20) {
            statusLojaEl.textContent = "⚠ Aberto - Fecha em breve!";
            statusLojaEl.style.backgroundColor = "#ffc107";
            statusLojaEl.style.color = "#111";
        } else {
            statusLojaEl.textContent = "✅ Aberto agora • 08:00 às 22:00";
            statusLojaEl.style.backgroundColor = "#22c55e";
            statusLojaEl.style.color = "white";
        }
    } else {
        statusLojaEl.textContent = "🔒 Fechado agora • Volta às 08:00";
        statusLojaEl.style.backgroundColor = "#e21b23";
        statusLojaEl.style.color = "white";
        if (mostrarAviso) alertaFechado.classList.remove('oculto');
    }

    return aberta;
}

setInterval(verificarStatusLoja, 10000);
verificarStatusLoja();

btnEntendi.addEventListener('click', () => alertaFechado.classList.add('oculto'));

// ---------------- CONTROLE DE QUANTIDADE NOS PRODUTOS ----------------
document.querySelectorAll('.qtd-btn').forEach(botao => {
    botao.addEventListener('click', () => {
        const valorEl = botao.parentElement.querySelector('.qtd-valor');
        let valor = parseInt(valorEl.textContent);
        if (botao.classList.contains('aumentar')) valor++;
        if (botao.classList.contains('diminuir') && valor > 1) valor--;
        valorEl.textContent = valor;
    });
});

// ---------------- ADICIONAR AO CARRINHO ----------------
document.querySelectorAll('.add-carrinho').forEach(botao => {
    botao.addEventListener('click', () => {
        if (!verificarStatusLoja(true)) return;

        const nome = botao.dataset.nome;
        const preco = parseFloat(botao.dataset.preco);
        const qtd = parseInt(botao.closest('.produto').querySelector('.qtd-valor').textContent);

        const itemExistente = carrinho.find(item => item.nome === nome);
        if (itemExistente) {
            itemExistente.quantidade += qtd;
        } else {
            carrinho.push({ nome, preco, quantidade: qtd });
        }

        atualizarCarrinho();

        // Feedback visual
        const original = botao.innerHTML;
        botao.innerHTML = '<i class="fa fa-check"></i>';
        botao.style.background = '#22c55e';
        setTimeout(() => {
            botao.innerHTML = original;
            botao.style.background = '';
        }, 1200);
    });
});

// ---------------- ATUALIZAR CARRINHO ----------------
function atualizarCarrinho() {
    listaItensCarrinho.innerHTML = '';
    let total = 0;
    let qtdTotal = 0;

    if (carrinho.length === 0) {
        listaItensCarrinho.innerHTML = '<p style="text-align:center; padding:25px 0; color:#777;">Seu carrinho está vazio</p>';
        valorTotalEl.textContent = '0.00';
        qtdCarrinhoEl.textContent = '0';
        abrirCarrinhoBtn.querySelector('span:nth-child(3)').textContent = '0 itens • R$ 0,00';
        return;
    }

    carrinho.forEach((item, index) => {
        const totalItem = item.preco * item.quantidade;
        total += totalItem;
        qtdTotal += item.quantidade;

        const itemEl = document.createElement('div');
        itemEl.className = 'item-carrinho';
        itemEl.innerHTML = `
            <div>
                <h4>${item.nome}</h4>
                <p style="font-size:13px; color:#666;">R$ ${item.preco.toFixed(2)} cada</p>
            </div>
            <div style="display:flex; align-items:center; gap:10px;">
                <button class="qtd-btn diminuir-item" data-index="${index}">-</button>
                <span>${item.quantidade}</span>
                <button class="qtd-btn aumentar-item" data-index="${index}">+</button>
                <span style="font-weight:600; min-width:80px; text-align:right;">R$ ${totalItem.toFixed(2)}</span>
            </div>
        `;
        listaItensCarrinho.appendChild(itemEl);
    });

    valorTotalEl.textContent = total.toFixed(2);
    qtdCarrinhoEl.textContent = qtdTotal;
    abrirCarrinhoBtn.querySelector('span:nth-child(3)').textContent = `${qtdTotal} itens • R$ ${total.toFixed(2).replace('.', ',')}`;

    adicionarEventosCarrinho();
}

function adicionarEventosCarrinho() {
    document.querySelectorAll('.aumentar-item').forEach(botao => {
        botao.addEventListener('click', () => {
            const idx = parseInt(botao.dataset.index);
            carrinho[idx].quantidade++;
            atualizarCarrinho();
        });
    });
    document.querySelectorAll('.diminuir-item').forEach(botao => {
        botao.addEventListener('click', () => {
            const idx = parseInt(botao.dataset.index);
            if (carrinho[idx].quantidade > 1) {
                carrinho[idx].quantidade--;
            } else {
                carrinho.splice(idx, 1);
            }
            atualizarCarrinho();
        });
    });
}

// ---------------- ABRIR / FECHAR MODAL ----------------
abrirCarrinhoBtn.addEventListener('click', () => {
    if (!verificarStatusLoja(true)) return;
    modalCarrinho.classList.remove('oculto');
    document.body.style.overflow = 'hidden';
});

fecharModalBtns.forEach(botao => {
    botao.addEventListener('click', () => {
        modalCarrinho.classList.add('oculto');
        document.body.style.overflow = 'auto';
    });
});

// ---------------- FILTRO DE CATEGORIAS ----------------
document.querySelectorAll('.categoria-btn').forEach(botao => {
    botao.addEventListener('click', () => {
        document.querySelectorAll('.categoria-btn').forEach(b => b.classList.remove('ativo'));
        botao.classList.add('ativo');
        const categoria = botao.dataset.categoria;

        document.querySelectorAll('.produto').forEach(produto => {
            if (categoria === 'todos' || produto.dataset.categoria === categoria) {
                produto.style.display = 'flex';
            } else {
                produto.style.display = 'none';
            }
        });
    });
});

// ---------------- FINALIZAR PEDIDO NO WHATSAPP ----------------
document.getElementById('btn-finalizar').addEventListener('click', () => {
    const nome = document.getElementById('nome-cliente').value.trim();
    const endereco = document.getElementById('endereco-cliente').value.trim();
    const pagamento = document.getElementById('forma-pagamento').value;
    const obs = document.getElementById('observacoes').value.trim();
    const avisoEndereco = document.getElementById('aviso-endereco');

    if (carrinho.length === 0) {
        alert('Adicione itens ao carrinho primeiro!');
        return;
    }

    if (endereco.length < 8) {
        avisoEndereco.classList.remove('oculto');
        return;
    }
    avisoEndereco.classList.add('oculto');

    let mensagem = `📦 *NOVO PEDIDO*\n\n`;
    mensagem += `👤 *Nome:* ${nome || 'Não informado'}\n`;
    mensagem += `🏠 *Endereço:* ${endereco}\n`;
    mensagem += `💳 *Forma de pagamento:* ${pagamento}\n\n`;
    mensagem += `🛒 *Itens do pedido:*\n`;

    carrinho.forEach(item => {
        mensagem += `• ${item.nome} | ${item.quantidade}x | R$ ${(item.preco * item.quantidade).toFixed(2)}\n`;
    });

    mensagem += `\n💬 *Observações:* ${obs || 'Nenhuma observação'}\n`;
    mensagem += `💰 *Total:* R$ ${valorTotalEl.textContent}`;

    const numeroWhatsApp = '5519989021323';
    const url = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensagem)}`;
    window.open(url, '_blank');
});