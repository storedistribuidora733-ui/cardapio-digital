// ==============================================
// ⚙️ CONFIGURAÇÕES — SEUS DADOS E PRODUTOS ORIGINAIS
// ==============================================
const CONFIG = {
    ativa: true,
    nomeLoja: "Alison Burger",
    numeroWhatsApp: "5519989021323",
    horaAbertura: 7,
    horaFechamento: 23,
    textoAberto: "Aberto até às 23:00",
    textoFechado: "Fechado • Abre às 07:00",
    corAberto: "#22c55e",
    corFechado: "#dc2626",
    taxaEntregaFixa: 8.00,
    categorias: ["Lanches", "Bebidas", "Porções"],

    // ✅ SEUS PRODUTOS MANTIDOS INTEGRALMENTE — NENHUM REMOVIDO
    produtos: [
        {
            nome: "X-Burguer Simples",
            desc: "Pão, carne, queijo, alface e tomate",
            categoria: "Lanches",
            preco: 15.00,
            img: "https://i.imgur.com/7Z7Z7Z7.jpg"
        },
        {
            nome: "X-Bacon Especial",
            desc: "Pão, carne, queijo, bacon, ovo e molho especial",
            categoria: "Lanches",
            preco: 19.90,
            img: "https://i.imgur.com/9X9X9X9.jpg"
        },
        {
            nome: "X-Tudo",
            desc: "Pão, carne, queijo, bacon, presunto, ovo e salada",
            categoria: "Lanches",
            preco: 24.00,
            img: "https://i.imgur.com/3A3A3A3.jpg"
        },
        {
            nome: "Coca-Cola Lata 350ml",
            desc: "Refrigerante gelado",
            categoria: "Bebidas",
            preco: 5.00,
            img: "https://i.imgur.com/1A1A1A1.jpg"
        },
        {
            nome: "Guaraná Antarctica Lata",
            desc: "Bebida gelada",
            categoria: "Bebidas",
            preco: 4.50,
            img: "https://i.imgur.com/guarana-lata.png"
        },
        {
            nome: "Batata Frita Pequena",
            desc: "Crocante e sequinha",
            categoria: "Porções",
            preco: 12.00,
            img: "https://i.imgur.com/2B2B2B2.jpg"
        },
        {
            nome: "Batata Frita Grande com Bacon",
            desc: "Crocante, com bacon e queijo ralado",
            categoria: "Porções",
            preco: 18.00,
            img: "https://i.imgur.com/4C4C4C4.jpg"
        }
    ]
};

// ==============================================
// 🛒 VARIÁVEIS E FUNÇÕES ORIGINAIS INTACTAS
// ==============================================
let carrinho = [];
let produtoModal = null;
let qtdModal = 1;

window.onload = function () {
    setTimeout(() => {
        document.getElementById('telaCarregando').style.display = 'none';

        if (!CONFIG.ativa) {
            document.body.innerHTML = `<div style="max-width:400px;margin:40px auto;padding:30px;background:#fff;border:2px solid #dc2626;border-radius:10px;text-align:center;"><h2>Loja temporariamente indisponível</h2></div>`;
            return;
        }

        document.getElementById('conteudoPrincipal').style.display = 'block';
        atualizarStatusCabecalho(); // ✅ Status no cabeçalho integrado
        montarCategorias();
        montarProdutos(CONFIG.produtos);
        configurarBusca();
        atualizarLinkWhatsApp();
    }, 500);
};

// ✅ Status automático no cabeçalho alinhado
function atualizarStatusCabecalho() {
    const hora = new Date().getHours();
    const aberta = hora >= CONFIG.horaAbertura && hora < CONFIG.horaFechamento;
    const bloco = document.getElementById('blocoStatus');
    const texto = document.getElementById('textoStatus');

    bloco.className = `status-loja ${aberta ? 'aberto' : 'fechado'}`;
    texto.textContent = aberta ? CONFIG.textoAberto : CONFIG.textoFechado;
    bloco.querySelector('.ponto-status').style.background = aberta ? CONFIG.corAberto : CONFIG.corFechado;
}
setInterval(atualizarStatusCabecalho, 60000); // atualiza a cada minuto

function montarCategorias() {
    const el = document.getElementById('listaCategorias');
    el.innerHTML = `<div class="categoria ativa" data-cat="todos">Todos</div>` +
        CONFIG.categorias.map(c => `<div class="categoria" data-cat="${c}">${c}</div>`).join('');

    document.querySelectorAll('.categoria').forEach(cat => {
        cat.addEventListener('click', () => {
            document.querySelectorAll('.categoria').forEach(x => x.classList.remove('ativa'));
            cat.classList.add('ativa');
            const filtro = cat.dataset.cat;
            const lista = filtro === 'todos' ? CONFIG.produtos : CONFIG.produtos.filter(p => p.categoria === filtro);
            montarProdutos(lista);
        });
    });
}

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

function configurarBusca() {
    document.getElementById('buscaProduto').addEventListener('input', e => {
        const termo = e.target.value.toLowerCase().trim();
        montarProdutos(CONFIG.produtos.filter(p =>
            p.nome.toLowerCase().includes(termo) || p.categoria.toLowerCase().includes(termo)
        ));
    });
}

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
    let texto = `🍔 *PEDIDO — ${CONFIG.nomeLoja}*\n`;
    carrinho.forEach(i => texto += `• ${i.qtd}x ${i.nome} — R$ ${(i.preco*i.qtd).toFixed(2).replace('.',',')}\n`);
    texto += `\n📦 Taxa entrega: R$ ${CONFIG.taxaEntregaFixa.toFixed(2).replace('.',',')}\n✅ TOTAL: R$ ${(carrinho.reduce((s,i)=>s+i.preco*i.qtd,0)+CONFIG.taxaEntregaFixa).toFixed(2).replace('.',',')}`;
    document.getElementById('linkWhatsApp').href = `https://wa.me/${CONFIG.numeroWhatsApp}?text=${encodeURIComponent(texto)}`;
}

window.onclick = e => { const m = document.getElementById('modalProduto'); if (e.target === m) m.style.display = 'none'; };
