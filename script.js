// ==============================================
// ⚙️ CONFIGURAÇÕES E PRODUTOS IGUAIS AO SEU
// ==============================================
const CONFIG = {
    nomeLoja: "Alison Burger",
    numeroWhatsApp: "5519989021323",
    horaAbertura: 7,
    horaFechamento: 23,
    textoAberto: "Aberto até às 23:00",
    textoFechado: "Fechado • Abre às 07:00",
    taxaEntregaFixa: 8.00,
    categorias: ["Lanches", "Bebidas", "Porções"],
    produtos: [
        {
            nome: "X-Burguer Simples",
            desc: "Pão, carne, queijo, alface e tomate",
            categoria: "Lanches",
            preco: 15.00,
            img: "https://i.imgur.com/7Z7Z7Z7.jpg",
            temAdicionais: false
        },
        {
            nome: "X-Bacon Especial",
            desc: "Pão, carne, queijo, bacon, ovo e molho especial",
            categoria: "Lanches",
            preco: 19.90,
            img: "https://i.imgur.com/9X9X9X9.jpg",
            temAdicionais: true,
            adicionais: [{nome:"Ovo",preco:2},{nome:"Bacon extra",preco:3}]
        },
        {
            nome: "Coca-Cola Lata 350ml",
            desc: "Refrigerante gelado",
            categoria: "Bebidas",
            preco: 5.00,
            img: "https://i.imgur.com/1A1A1A1.jpg",
            temAdicionais: false
        }
    ]
};

// ==============================================
// 🛒 VARIÁVEIS E FUNÇÕES 100% ORIGINAIS
// ==============================================
let carrinho = [];
let produtoModal = null;
let qtdModal = 1;
let adicionaisSelecionados = [];

window.onload = function () {
    setTimeout(() => {
        document.getElementById('telaCarregando').style.display = 'none';
        document.getElementById('conteudoPrincipal').style.display = 'block';
        atualizarStatus();
        montarCategorias();
        montarProdutos(CONFIG.produtos);
        configurarBusca();
        atualizarLinkWhatsApp();
        document.getElementById('mostrarTaxa').textContent = CONFIG.taxaEntregaFixa.toFixed(2).replace('.', ',');
    }, 500);
};

// Status do cabeçalho
function atualizarStatus() {
    const hora = new Date().getHours();
    const aberta = hora >= CONFIG.horaAbertura && hora < CONFIG.horaFechamento;
    const bloco = document.getElementById('blocoStatus');
    document.getElementById('textoStatus').textContent = aberta ? CONFIG.textoAberto : CONFIG.textoFechado;
    bloco.className = `status-loja ${aberta ? 'aberto' : 'fechado'}`;
}
setInterval(atualizarStatus, 60000);

function montarCategorias() {
    const el = document.getElementById('listaCategorias');
    el.innerHTML = `<div class="categoria ativa" data-cat="todos">Todos</div>` +
        CONFIG.categorias.map(c => `<div class="categoria" data-cat="${c}">${c}</div>`).join('');
    document.querySelectorAll('.categoria').forEach(cat => {
        cat.addEventListener('click', () => {
            document.querySelectorAll('.categoria').forEach(x => x.classList.remove('ativa'));
            cat.classList.add('ativa');
            const lista = cat.dataset.cat === 'todos' ? CONFIG.produtos : CONFIG.produtos.filter(p => p.categoria === cat.dataset.cat);
            montarProdutos(lista);
        });
    });
}

// ✅ CLICK FUNCIONA CORRETAMENTE — ABRE MODAL COM TODOS OS DETALHES
function montarProdutos(lista) {
    document.getElementById('listaProdutos').innerHTML = lista.map(p => `
        <div class="produto" onclick="abrirModal('${p.nome.replace(/'/g, "\\'")}')">
            <img src="${p.img}" alt="${p.nome}">
            <div class="info">
                <h3>${p.nome}</h3>
                <p class="desc">${p.desc}</p>
                <p class="preco">R$ ${p.preco.toFixed(2).replace('.', ',')}</p>
            </div>
        </div>
    `).join('');
}

function configurarBusca() {
    document.getElementById('buscaProduto').addEventListener('input', e => {
        const termo = e.target.value.toLowerCase();
        montarProdutos(CONFIG.produtos.filter(p =>
            p.nome.toLowerCase().includes(termo) || p.categoria.toLowerCase().includes(termo)
        ));
    });
}

// ✅ MODAL COMPLETO COM IMAGEM, DESCRIÇÃO, ENTREGA/RETIRADA E ADICIONAIS
function abrirModal(nome) {
    produtoModal = CONFIG.produtos.find(p => p.nome === nome);
    qtdModal = 1;
    adicionaisSelecionados = [];

    document.getElementById('modalImg').src = produtoModal.img;
    document.getElementById('modalNome').textContent = produtoModal.nome;
    document.getElementById('modalDesc').textContent = produtoModal.desc;
    document.getElementById('modalPreco').textContent = `R$ ${produtoModal.preco.toFixed(2).replace('.', ',')}`;
    document.getElementById('qtdAtual').textContent = '1';

    // Mostra/esconde área de adicionais
    const areaAdic = document.getElementById('areaAdicionais');
    if (produtoModal.temAdicionais && produtoModal.adicionais.length > 0) {
        areaAdic.style.display = 'block';
        areaAdic.innerHTML = `<p><strong>Adicionais:</strong></p>` +
            produtoModal.adicionais.map((a, i) => `
                <label class="opcao">
                    <input type="checkbox" value="${i}" onchange="toggleAdicional(${i}, '${a.nome}', ${a.preco})">
                    ${a.nome} (+R$ ${a.preco.toFixed(2).replace('.', ',')})
                </label>
            `).join('');
    } else {
        areaAdic.style.display = 'none';
    }

    document.getElementById('modalProduto').style.display = 'flex';
}

function fecharModal() { document.getElementById('modalProduto').style.display = 'none'; }
function alterarQtd(n) { qtdModal = Math.max(1, qtdModal + n); document.getElementById('qtdAtual').textContent = qtdModal; }

// Controle de adicionais
function toggleAdicional(ind, nome, preco) {
    const existe = adicionaisSelecionados.find(x => x.ind === ind);
    if (existe) adicionaisSelecionados = adicionaisSelecionados.filter(x => x.ind !== ind);
    else adicionaisSelecionados.push({ind, nome, preco});
}

// ✅ ADICIONA AO CARRINHO COM TAXA SE ENTREGA
function adicionarAoCarrinho() {
    const formaReceb = document.querySelector('input[name="recebimento"]:checked').value;
    const precoAdic = adicionaisSelecionados.reduce((s, a) => s + a.preco, 0);
    const valorUnit = produtoModal.preco + precoAdic;

    const item = carrinho.find(i => i.nome === produtoModal.nome && JSON.stringify(i.adicionais) === JSON.stringify(adicionaisSelecionados));
    if (item) item.qtd += qtdModal;
    else carrinho.push({
        nome: produtoModal.nome,
        desc: produtoModal.desc,
        precoUnit: valorUnit,
        qtd: qtdModal,
        adicionais: [...adicionaisSelecionados],
        recebimento: formaReceb
    });

    atualizarCarrinho();
    fecharModal();
}

function atualizarCarrinho() {
    const totalItens = carrinho.reduce((s, i) => s + i.qtd, 0);
    let totalProd = carrinho.reduce((s, i) => s + (i.precoUnit * i.qtd), 0);
    const temEntrega = carrinho.some(i => i.recebimento === 'entregar');
    if (temEntrega) totalProd += CONFIG.taxaEntregaFixa;

    document.getElementById('contadorCarrinho').textContent = totalItens;
    document.getElementById('valorCarrinho').textContent = totalProd.toFixed(2).replace('.', ',');
    atualizarLinkWhatsApp();
}

// ✅ MENSAGEM COMPLETA NO WHATSAPP COM TUDO
function atualizarLinkWhatsApp() {
    if (carrinho.length === 0) {
        document.getElementById('linkWhatsApp').href = `https://wa.me/${CONFIG.numeroWhatsApp}`;
        return;
    }
    let texto = `🍔 *PEDIDO — ${CONFIG.nomeLoja}*\n`;
    carrinho.forEach(i => {
        texto += `• ${i.qtd}x ${i.nome}`;
        if (i.adicionais.length > 0) texto += ` (${i.adicionais.map(a => a.nome).join(', ')})`;
        texto += ` — R$ ${(i.precoUnit * i.qtd).toFixed(2).replace('.', ',')} — ${i.recebimento === 'retirar' ? 'Retirada' : 'Entrega'}\n`;
    });
    const precisaTaxa = carrinho.some(i => i.recebimento === 'entregar');
    if (precisaTaxa) texto += `\n📦 Taxa de entrega: R$ ${CONFIG.taxaEntregaFixa.toFixed(2).replace('.', ',')}\n`;
    const totalFinal = carrinho.reduce((s, i) => s + i.precoUnit * i.qtd, 0) + (precisaTaxa ? CONFIG.taxaEntregaFixa : 0);
    texto += `✅ TOTAL: R$ ${totalFinal.toFixed(2).replace('.', ',')}`;

    document.getElementById('linkWhatsApp').href = `https://wa.me/${CONFIG.numeroWhatsApp}?text=${encodeURIComponent(texto)}`;
}

window.onclick = e => { const m = document.getElementById('modalProduto'); if (e.target === m) m.style.display = 'none'; };
