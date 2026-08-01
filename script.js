// ==============================================
// ⚙️ DADOS DA LOJA — EDITE AQUI OS DADOS DO CLIENTE
// ==============================================
const CONFIG_LOJA = {
    ativa: true, // coloque false para desativar temporariamente
    nomeLoja: "Alison Burger",
    numeroWhatsApp: "5519989021323",
    horaAbertura: 7,
    horaFechamento: 23,
    textoAberto: "Aberto até às 23:00",
    textoFechado: "Fechado • Abre às 07:00",
    taxaEntregaFixa: 8.00, // NÃO EDITÁVEL PELO CLIENTE
    categorias: ["Lanches", "Bebidas", "Porções"],
    produtos: [
        {
            nome: "X-Burguer Simples",
            desc: "Pão, carne, queijo, alface e tomate",
            categoria: "Lanches",
            preco: 15.00,
            img: "https://i.imgur.com/7Z7Z7Z7.jpg"
        },
        {
            nome: "X-Bacon",
            desc: "Pão, carne, queijo, bacon e molho especial",
            categoria: "Lanches",
            preco: 19.00,
            img: "https://i.imgur.com/9X9X9X9.jpg"
        },
        {
            nome: "Coca-Cola Lata 350ml",
            desc: "Refrigerante gelado",
            categoria: "Bebidas",
            preco: 5.00,
            img: "https://i.imgur.com/1A1A1A1.jpg"
        },
        {
            nome: "Batata Frita Pequena",
            desc: "Crocante e sequinha",
            categoria: "Porções",
            preco: 12.00,
            img: "https://i.imgur.com/2B2B2B2.jpg"
        }
    ]
};

// ==============================================
// 🛒 VARIÁVEIS GERAIS (NÃO MEXA)
// ==============================================
let carrinho = [];
let produtoModal = null;
let qtdModal = 1;

// ==============================================
// INICIALIZAÇÃO
// ==============================================
window.onload = function () {
    setTimeout(() => {
        document.getElementById('telaCarregando').style.display = 'none';

        if (!CONFIG_LOJA.ativa) {
            document.body.innerHTML = `
                <div class="inativa">
                    <h2>Loja temporariamente indisponível</h2>
                    <p style="margin-top:10px;">Volte mais tarde!</p>
                </div>`;
            return;
        }

        document.getElementById('conteudoPrincipal').style.display = 'block';
        montarCabecalho();
        montarCategorias();
        montarProdutos(CONFIG_LOJA.produtos);
        configurarBusca();
        atualizarLinkWhatsApp();
    }, 600);
};

// Cabeçalho e status
function montarCabecalho() {
    document.getElementById('nomeLoja').textContent = CONFIG_LOJA.nomeLoja;
    const hora = new Date().getHours();
    const aberta = hora >= CONFIG_LOJA.horaAbertura && hora < CONFIG_LOJA.horaFechamento;
    const statusEl = document.getElementById('statusLoja');
    statusEl.textContent = aberta ? CONFIG_LOJA.textoAberto : CONFIG_LOJA.textoFechado;
    statusEl.className = `status ${aberta ? 'aberto' : 'fechado'}`;
}

// Categorias
function montarCategorias() {
    const el = document.getElementById('listaCategorias');
    el.innerHTML = `<div class="categoria ativa" data-cat="todos">Todos</div>` +
        CONFIG_LOJA.categorias.map(c => `<div class="categoria" data-cat="${c}">${c}</div>`).join('');

    document.querySelectorAll('.categoria').forEach(cat => {
        cat.addEventListener('click', () => {
            document.querySelectorAll('.categoria').forEach(x => x.classList.remove('ativa'));
            cat.classList.add('ativa');
            const filtro = cat.dataset.cat;
            const filtrados = filtro === 'todos'
                ? CONFIG_LOJA.produtos
                : CONFIG_LOJA.produtos.filter(p => p.categoria === filtro);
            montarProdutos(filtrados);
        });
    });
}

// Montar lista de produtos
function montarProdutos(lista) {
    document.getElementById('listaProdutos').innerHTML = lista.map(p => `
        <div class="produto" onclick="abrirModal('${p.nome.replace(/'/g, "\\'")}')">
            <img src="${p.img}" alt="${p.nome}" loading="lazy">
            <div class="info">
                <h3>${p.nome}</h3>
                <p class="desc">${p.desc}</p>
                <p class="preco">R$ ${p.preco.toFixed(2).replace('.', ',')}</p>
            </div>
        </div>
    `).join('');
}

// Busca
function configurarBusca() {
    document.getElementById('buscaProduto').addEventListener('input', (e) => {
        const termo = e.target.value.toLowerCase().trim();
        const filtrados = CONFIG_LOJA.produtos.filter(p =>
            p.nome.toLowerCase().includes(termo) || p.categoria.toLowerCase().includes(termo)
        );
        montarProdutos(filtrados);
    });
}

// Modal produto
function abrirModal(nomeProd) {
    produtoModal = CONFIG_LOJA.produtos.find(p => p.nome === nomeProd);
    qtdModal = 1;
    document.getElementById('modalNome').textContent = produtoModal.nome;
    document.getElementById('modalDesc').textContent = produtoModal.desc;
    document.getElementById('modalPreco').textContent = `R$ ${produtoModal.preco.toFixed(2).replace('.', ',')}`;
    document.getElementById('qtdAtual').textContent = 1;
    document.getElementById('modalProduto').style.display = 'flex';
}
function fecharModal() { document.getElementById('modalProduto').style.display = 'none'; }
function alterarQtd(n) {
    qtdModal = Math.max(1, qtdModal + n);
    document.getElementById('qtdAtual').textContent = qtdModal;
}

// Adicionar ao carrinho
function adicionarAoCarrinho() {
    const item = carrinho.find(i => i.nome === produtoModal.nome);
    if (item) item.qtd += qtdModal;
    else carrinho.push({ ...produtoModal, qtd: qtdModal });
    atualizarCarrinho();
    fecharModal();
}

// Atualizar contador e valor
function atualizarCarrinho() {
    const totalItens = carrinho.reduce((s, i) => s + i.qtd, 0);
    const totalProd = carrinho.reduce((s, i) => s + (i.preco * i.qtd), 0);
    const totalGeral = totalProd + CONFIG_LOJA.taxaEntregaFixa;

    document.getElementById('contadorCarrinho').textContent = totalItens;
    document.getElementById('valorCarrinho').textContent = totalGeral.toFixed(2).replace('.', ',');
    atualizarLinkWhatsApp();
}

// Montar link WhatsApp com pedido completo
function atualizarLinkWhatsApp() {
    if (carrinho.length === 0) {
        document.getElementById('linkWhatsApp').href = `https://wa.me/${CONFIG_LOJA.numeroWhatsApp}`;
        return;
    }
    let texto = `📋 *PEDIDO - ${CONFIG_LOJA.nomeLoja}*\n`;
    carrinho.forEach(i => {
        texto += `• ${i.qtd}x ${i.nome} — R$ ${(i.preco * i.qtd).toFixed(2).replace('.', ',')}\n`;
    });
    texto += `\n📦 Taxa de entrega: R$ ${CONFIG_LOJA.taxaEntregaFixa.toFixed(2).replace('.', ',')}\n`;
    texto += `✅ TOTAL: R$ ${(carrinho.reduce((s, i) => s + i.preco * i.qtd, 0) + CONFIG_LOJA.taxaEntregaFixa).toFixed(2).replace('.', ',')}`;

    document.getElementById('linkWhatsApp').href = `https://wa.me/${CONFIG_LOJA.numeroWhatsApp}?text=${encodeURIComponent(texto)}`;
}

// Clicar fora do modal fecha
window.onclick = e => {
    const m = document.getElementById('modalProduto');
    if (e.target === m) m.style.display = 'none';
};
