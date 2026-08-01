// ==============================================
// ⚙️ SEUS DADOS E PRODUTOS — EXATAMENTE COMO VOCÊ TEM
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
        {nome:"X-Burguer Simples",desc:"Pão, carne, queijo, alface, tomate",categoria:"Lanches",preco:15.00,img:"https://i.imgur.com/7Z7Z7Z7.jpg"},
        {nome:"X-Bacon Especial",desc:"Pão, carne, queijo, bacon, ovo, molho especial",categoria:"Lanches",preco:19.90,img:"https://i.imgur.com/9X9X9X9.jpg"},
        {nome:"X-Tudo",desc:"Pão, carne, queijo, bacon, presunto, ovo, salada",categoria:"Lanches",preco:24.00,img:"https://i.imgur.com/3A3A3A3.jpg"},
        {nome:"Coca-Cola Lata",desc:"Refrigerante gelado",categoria:"Bebidas",preco:5.00,img:"https://i.imgur.com/1A1A1A1.jpg"},
        {nome:"Guaraná Antarctica Lata",desc:"Bebida gelada",categoria:"Bebidas",preco:4.50,img:"https://i.imgur.com/guarana-lata.png"},
        {nome:"Batata Frita Pequena",desc:"Crocante e sequinha",categoria:"Porções",preco:12.00,img:"https://i.imgur.com/2B2B2B2.jpg"}
    ]
};

// ==============================================
// 🛒 VARIÁVEIS E FUNÇÕES ORIGINAIS — NENHUMA ALTERADA
// ==============================================
let carrinho = [];
let produtoModal = null;
let qtdModal = 1;

window.onload = function () {
    setTimeout(() => {
        document.getElementById('telaCarregando').style.display = 'none';
        document.getElementById('conteudoPrincipal').style.display = 'block';
        atualizarStatus();
        montarCategorias();
        montarProdutos(CONFIG.produtos);
        configurarBusca();
        atualizarLinkWhatsApp();
    }, 500);
};

// Status no cabeçalho
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

// ✅ CLICK NOS PRODUTOS FUNCIONA IGUAL ANTES — ABRE O MODAL NORMALMENTE
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
        montarProdutos(CONFIG.produtos.filter(p => p.nome.toLowerCase().includes(termo) || p.categoria.toLowerCase().includes(termo)));
    });
}

// ✅ MODAL — FUNCIONAMENTO 100% IGUAL AO SEU CÓDIGO ANTIGO
function abrirModal(nome) {
    produtoModal = CONFIG.produtos.find(p => p.nome === nome);
    qtdModal = 1;
    document.getElementById('modalNome').textContent = produtoModal.nome;
    document.getElementById('modalDesc').textContent = produtoModal.desc;
    document.getElementById('modalPreco').textContent = `R$ ${produtoModal.preco.toFixed(2).replace('.', ',')}`;
    document.getElementById('qtdAtual').textContent = '1';
    document.getElementById('modalProduto').style.display = 'flex';
}
function fecharModal() { document.getElementById('modalProduto').style.display = 'none'; }
function alterarQtd(n) { qtdModal = Math.max(1, qtdModal + n); document.getElementById('qtdAtual').textContent = qtdModal; }

function adicionarAoCarrinho() {
    const item = carrinho.find(i => i.nome === produtoModal.nome);
    item ? item.qtd += qtdModal : carrinho.push({ ...produtoModal, qtd: qtdModal });
    atualizarCarrinho(); fecharModal();
}

function atualizarCarrinho() {
    const totalItens = carrinho.reduce((s, i) => s + i.qtd, 0);
    const totalProd = carrinho.reduce((s, i) => s + (i.preco * i.qtd), 0);
    const totalGeral = totalProd + CONFIG.taxaEntregaFixa;
    document.getElementById('contadorCarrinho').textContent = totalItens;
    document.getElementById('valorCarrinho').textContent = totalGeral.toFixed(2).replace('.', ',');
    atualizarLinkWhatsApp();
}

function atualizarLinkWhatsApp() {
    if (carrinho.length === 0) {
        document.getElementById('linkWhatsApp').href = `https://wa.me/${CONFIG.numeroWhatsApp}`;
        return;
    }
    let texto = `🍔 PEDIDO - ${CONFIG.nomeLoja}\n`;
    carrinho.forEach(i => texto += `• ${i.qtd}x ${i.nome} — R$ ${(i.preco*i.qtd).toFixed(2).replace('.',',')}\n`);
    texto += `\n📦 Taxa entrega: R$ ${CONFIG.taxaEntregaFixa.toFixed(2).replace('.',',')}\n✅ TOTAL: R$ ${(carrinho.reduce((s,i)=>s+i.preco*i.qtd,0)+CONFIG.taxaEntregaFixa).toFixed(2).replace('.',',')}`;
    document.getElementById('linkWhatsApp').href = `https://wa.me/${CONFIG.numeroWhatsApp}?text=${encodeURIComponent(texto)}`;
}

window.onclick = e => { const m = document.getElementById('modalProduto'); if (e.target === m) m.style.display = 'none'; };
