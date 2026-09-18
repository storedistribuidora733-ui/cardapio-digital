// ==========================================
// HOMEM & ESTILO — Moda Masculina Premium
// Código Completo e Funcional
// ==========================================

const produtos = [
    {
        id: 1,
        nome: "Camisa Social Branca Premium",
        categoria: "sociais",
        preco: 129.90,
        precoAntigo: 169.90,
        imagem: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=500&fit=crop",
        avaliacao: 5,
        tamanhos: ["PP", "P", "M", "G", "GG"],
        cores: ["Branco"],
        descricao: "Camisa social 100% algodão egípcio. Tecido de alta qualidade que não amassa fácil. Caimento perfeito e elegante para qualquer ocasião.",
        destaque: true,
        lancamento: false
    },
    {
        id: 2,
        nome: "Calça Jeans Slim Fit Premium",
        categoria: "casuais",
        preco: 149.90,
        precoAntigo: 199.90,
        imagem: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=500&fit=crop",
        avaliacao: 4.8,
        tamanhos: ["38", "40", "42", "44", "46"],
        cores: ["Azul"],
        descricao: "Calça jeans com modelagem slim moderna. Com elastano para conforto e mobilidade. Lavagem escura sofisticada que combina com tudo.",
        destaque: true,
        lancamento: false
    },
    {
        id: 3,
        nome: "Blazer Preto Alfaiataria",
        categoria: "sociais",
        preco: 299.90,
        precoAntigo: 399.90,
        imagem: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&h=500&fit=crop",
        avaliacao: 5,
        tamanhos: ["P", "M", "G", "GG"],
        cores: ["Preto"],
        descricao: "Blazer estruturado em tecido premium. Corte clássico e elegante. Perfeito para eventos, trabalho e ocasiões especiais.",
        destaque: true,
        lancamento: true
    },
    {
        id: 4,
        nome: "Camiseta Básica Algodão Penteado",
        categoria: "casuais",
        preco: 59.90,
        precoAntigo: 79.90,
        imagem: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=500&fit=crop",
        avaliacao: 4.9,
        tamanhos: ["PP", "P", "M", "G", "GG", "XG"],
        cores: ["Branco", "Preto", "Cinza"],
        descricao: "Camiseta básica confeccionada em algodão penteado de alta densidade. Macia, durável e com caimento perfeito.",
        destaque: true,
        lancamento: true
    },
    {
        id: 5,
        nome: "Calça Chino Bege Elegante",
        categoria: "casuais",
        preco: 139.90,
        precoAntigo: 179.90,
        imagem: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400&h=500&fit=crop",
        avaliacao: 4.7,
        tamanhos: ["38", "40", "42", "44"],
        cores: ["Marrom", "Cinza"],
        descricao: "Calça chino em tecido leve e confortável. Versátil, do esporte ao social. Cor bege clássica que nunca sai de moda.",
        destaque: true,
        lancamento: false
    },
    {
        id: 6,
        nome: "Polo Masculina Premium",
        categoria: "casuais",
        preco: 89.90,
        precoAntigo: 119.90,
        imagem: "https://images.unsplash.com/photo-1625910514582-25c3e8232a71?w=400&h=500&fit=crop",
        avaliacao: 4.8,
        tamanhos: ["PP", "P", "M", "G", "GG"],
        cores: ["Azul", "Branco", "Preto"],
        descricao: "Polo em piquet de algodão premium. Gola e punhos reforçados. Elegante e confortável para o dia a dia.",
        destaque: true,
        lancamento: true
    },
    {
        id: 7,
        nome: "Jaqueta de Couro Sintético",
        categoria: "casuais",
        preco: 259.90,
        precoAntigo: 349.90,
        imagem: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=500&fit=crop",
        avaliacao: 4.9,
        tamanhos: ["P", "M", "G", "GG"],
        cores: ["Preto", "Marrom"],
        descricao: "Jaqueta com acabamento premium e forro interno. Estilo clássico que valoriza qualquer produção.",
        destaque: true,
        lancamento: false
    },
    {
        id: 8,
        nome: "Calça Social Cinza",
        categoria: "sociais",
        preco: 159.90,
        precoAntigo: 199.90,
        imagem: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&h=500&fit=crop",
        avaliacao: 4.7,
        tamanhos: ["38", "40", "42", "44"],
        cores: ["Cinza"],
        descricao: "Calça social em tecido de alfaiataria. Caimento reto e elegante. Combina com camisas e blazers.",
        destaque: true,
        lancamento: false
    },
    {
        id: 9,
        nome: "Bermuda Linho Bege",
        categoria: "esportivos",
        preco: 99.90,
        precoAntigo: 129.90,
        imagem: "https://images.unsplash.com/photo-1591195850943-493c40e53678?w=400&h=500&fit=crop",
        avaliacao: 4.6,
        tamanhos: ["P", "M", "G", "GG"],
        cores: ["Bege", "Azul"],
        descricao: "Bermuda em tecido de linho leve. Confortável e estilosa para dias quentes.",
        destaque: true,
        lancamento: true
    },
    {
        id: 10,
        nome: "Relógio Analógico Clássico",
        categoria: "acessorios",
        preco: 189.90,
        precoAntigo: 249.90,
        imagem: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400&h=500&fit=crop",
        avaliacao: 5,
        tamanhos: ["Único"],
        cores: ["Marrom", "Preto", "Dourado"],
        descricao: "Relógio com pulseira de couro e mostrador clássico. O acessório essencial do homem elegante.",
        destaque: true,
        lancamento: false
    },
    {
        id: 11,
        nome: "Tênis Casual Branco",
        categoria: "esportivos",
        preco: 179.90,
        precoAntigo: 229.90,
        imagem: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=500&fit=crop",
        avaliacao: 4.8,
        tamanhos: ["39", "40", "41", "42", "43", "44"],
        cores: ["Branco", "Preto"],
        descricao: "Tênis versátil e confortável. Solado em borracha antiderrapante. Perfeito para o dia a dia.",
        destaque: true,
        lancamento: true
    },
    {
        id: 12,
        nome: "Cinto de Couro Preto",
        categoria: "acessorios",
        preco: 79.90,
        precoAntigo: 99.90,
        imagem: "https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=400&h=500&fit=crop",
        avaliacao: 4.9,
        tamanhos: ["M", "G", "GG"],
        cores: ["Preto", "Marrom"],
        descricao: "Cinto em couro legítimo com fivela clássica. Durabilidade e estilo para sempre.",
        destaque: true,
        lancamento: false
    }
];

// Estado da Aplicação
let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
let categoriaAtiva = 'todos';
let produtoSelecionado = null;
let tamanhoSelecionado = null;

// Elementos do DOM
const listaProdutos = document.getElementById('lista-produtos');
const tituloCategoria = document.getElementById('titulo-categoria');
const qtdProdutos = document.getElementById('qtd-produtos');
const botoesCategoria = document.querySelectorAll('.menu-item');
const botaoCarrinho = document.getElementById('botao-carrinho');
const painelCarrinho = document.getElementById('painel-carrinho');
const fecharCarrinho = document.getElementById('fechar-carrinho');
const fundoOpaco = document.getElementById('fundo-opaco');
const itensCarrinho = document.getElementById('itens-carrinho');
const contadorCarrinho = document.querySelector('.contador-carrinho');
const subtotalValor = document.getElementById('subtotal-valor');
const totalValor = document.getElementById('total-valor');
const btnFinalizar = document.getElementById('btn-finalizar');
const modalProduto = document.getElementById('modal-produto');
const fecharModal = document.getElementById('fechar-modal');
const btnAplicarFiltro = document.getElementById('btn-aplicar-filtro');
const campoBusca = document.getElementById('campo-busca');
const btnBusca = document.getElementById('btn-busca');
const formNewsletter = document.getElementById('form-newsletter');

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
    renderizarProdutos();
    atualizarCarrinho();
    configurarEventos();
});

// Configurar Eventos
function configurarEventos() {
    // Navegação por Categorias
    botoesCategoria.forEach(botao => {
        botao.addEventListener('click', (e) => {
            e.preventDefault();
            categoriaAtiva = botao.dataset.categoria;
            botoesCategoria.forEach(b => b.classList.remove('ativo'));
            botao.classList.add('ativo');
            renderizarProdutos();
        });
    });

    // Carrinho
    botaoCarrinho.addEventListener('click', abrirCarrinho);
    fecharCarrinho.addEventListener('click', fecharCarrinhoPainel);
    fundoOpaco.addEventListener('click', fecharCarrinhoPainel);
    btnFinalizar.addEventListener('click', finalizarCompra);

    // Modal
    fecharModal.addEventListener('click', fecharModalProduto);
    modalProduto.addEventListener('click', (e) => {
        if (e.target === modalProduto) fecharModalProduto();
    });
    document.getElementById('modal-adicionar').addEventListener('click', adicionarAoCarrinhoDoModal);

    // Filtros
    btnAplicarFiltro.addEventListener('click', renderizarProdutos);

    // Busca
    btnBusca.addEventListener('click', (e) => {
        e.preventDefault();
        renderizarProdutos();
    });
    campoBusca.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') renderizarProdutos();
    });

    // Newsletter
    formNewsletter.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('✅ Obrigado! Você receberá o desconto por e-mail em instantes.');
        formNewsletter.reset();
    });

    // Botão "Ver Coleção"
    document.getElementById('ver-colecao').addEventListener('click', () => {
        document.querySelector('.produtos').scrollIntoView({ behavior: 'smooth' });
    });
}

// Filtrar Produtos
function filtrarProdutos() {
    const termoBusca = campoBusca.value.toLowerCase().trim();
    const filtroTamanho = document.getElementById('filtro-tamanho').value;
    const filtroCor = document.getElementById('filtro-cor').value;
    const filtroPreco = document.getElementById('filtro-preco').value;

    return produtos.filter(produto => {
        // Categoria
        let validaCategoria = true;
        if (categoriaAtiva !== 'todos') {
            if (categoriaAtiva === 'promocoes') {
                validaCategoria = produto.preco < produto.precoAntigo;
            } else {
                validaCategoria = produto.categoria === categoriaAtiva;
            }
        }

        // Busca
        const validaBusca = termoBusca === '' || 
            produto.nome.toLowerCase().includes(termoBusca) ||
            produto.descricao.toLowerCase().includes(termoBusca);

        // Tamanho
        const validaTamanho = filtroTamanho === 'todos' || produto.tamanhos.includes(filtroTamanho);

        // Cor
        const validaCor = filtroCor === 'todas' || produto.cores.includes(filtroCor);

        // Preço
        let validaPreco = true;
        if (filtroPreco !== 'todos') {
            const [min, max] = filtroPreco.split('-').map(v => v === '+' ? Infinity : parseFloat(v));
            validaPreco = produto.preco >= (min || 0) && produto.preco <= (max || Infinity);
        }

        return validaCategoria && validaBusca && validaTamanho && validaCor && validaPreco;
    });
}

// Renderizar Produtos
function renderizarProdutos() {
    const produtosFiltrados = filtrarProdutos();

    // Atualizar Título
    const nomesCategorias = {
        todos: 'Todos os Produtos',
        casuais: 'Roupas Casuais',
        sociais: 'Roupas Sociais',
        esportivos: 'Esportivos',
        acessorios: 'Acessórios',
        promocoes: '⚡ Promoções'
    };
    tituloCategoria.textContent = nomesCategorias[categoriaAtiva] || 'Produtos em Destaque';
    qtdProdutos.textContent = `Exibindo ${produtosFiltrados.length} produto${produtosFiltrados.length !== 1 ? 's' : ''}`;

    // Limpar e Preencher
    listaProdutos.innerHTML = '';

    if (produtosFiltrados.length === 0) {
        listaProdutos.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px; color: var(--cinza-medio);">
                <i class="fas fa-search" style="font-size: 48px; margin-bottom: 16px; opacity: 0.3;"></i>
                <h3>Nenhum produto encontrado</h3>
                <p>Tente ajustar os filtros ou termos de busca</p>
            </div>
        `;
        return;
    }

    produtosFiltrados.forEach(produto => {
        const card = document.createElement('div');
        card.className = 'produto-card';
        card.innerHTML = `
            <div class="produto-imagem">
                ${produto.preco < produto.precoAntigo ? 
                    `<span class="etiqueta-desconto">-${Math.round((1 - produto.preco / produto.precoAntigo) * 100)}%</span>` : 
                    (produto.lancamento ? '<span class="etiqueta-novo">NOVO</span>' : '')}
                <img src="${produto.imagem}" alt="${produto.nome}" loading="lazy">
                <div class="produto-acoes">
                    <button class="acao-btn" title="Ver Produto" data-id="${produto.id}">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="acao-btn" title="Adicionar ao Carrinho" data-id="${produto.id}" data-tamanho="${produto.tamanhos[0]}">
                        <i class="fas fa-shopping-bag"></i>
                    </button>
                </div>
            </div>
            <div class="produto-info">
                <span class="produto-categoria">${produto.categoria.charAt(0).toUpperCase() + produto.categoria.slice(1)}</span>
                <h3 class="produto-nome">${produto.nome}</h3>
                <div class="produto-avaliacao">
                    ${'★'.repeat(Math.floor(produto.avaliacao))}${produto.avaliacao % 1 >= 0.5 ? '½' : ''}
                    <span>(${produto.avaliacao})</span>
                </div>
                <div class="produto-preco">
                    ${produto.preco < produto.precoAntigo ? `<span class="preco-antigo">R$ ${produto.precoAntigo.toFixed(2)}</span>` : ''}
                    <span class="preco-atual">R$ ${produto.preco.toFixed(2)}</span>
                </div>
            </div>
        `;
        listaProdutos.appendChild(card);
    });

    // Adicionar Eventos aos Botões
    document.querySelectorAll('.acao-btn[data-id]').forEach(botao => {
        botao.addEventListener('click', (e) => {
            e.stopPropagation();
            const id = parseInt(botao.dataset.id);
            const produto = produtos.find(p => p.id === id);
            
            if (botao.querySelector('.fa-eye')) {
                abrirModalProduto(produto);
            } else {
                const tamanho = botao.dataset.tamanho;
                adicionarProdutoAoCarrinho(produto, tamanho);
            }
        });
    });
}

// Modal de Produto
function abrirModalProduto(produto) {
    produtoSelecionado = produto;
    tamanhoSelecionado = null;

    document.getElementById('modal-img').src = produto.imagem;
    document.getElementById('modal-img').alt = produto.nome;
    document.getElementById('modal-cat').textContent = produto.categoria.toUpperCase();
    document.getElementById('modal-nome').textContent = produto.nome;
    document.getElementById('modal-avaliacao').textContent = `(${produto.avaliacao})`;
    document.getElementById('modal-preco').textContent = `R$ ${produto.preco.toFixed(2)}`;
    document.getElementById('modal-preco-antigo').textContent = 
        produto.preco < produto.precoAntigo ? `De R$ ${produto.precoAntigo.toFixed(2)}` : '';
    document.getElementById('modal-desc').textContent = produto.descricao;

    // Tamanhos
    const containerTamanhos = document.getElementById('modal-tamanhos');
    containerTamanhos.innerHTML = '';
    produto.tamanhos.forEach(tam => {
        const btn = document.createElement('button');
        btn.className = 'tamanho-btn';
        btn.textContent = tam;
        btn.addEventListener('click', () => {
            containerTamanhos.querySelectorAll('.tamanho-btn').forEach(b => b.classList.remove('selecionado'));
            btn.classList.add('selecionado');
            tamanhoSelecionado = tam;
        });
        containerTamanhos.appendChild(btn);
    });

    modalProduto.classList.add('ativo');
    document.body.style.overflow = 'hidden';
}

function fecharModalProduto() {
    modalProduto.classList.remove('ativo');
    document.body.style.overflow = '';
    produtoSelecionado = null;
    tamanhoSelecionado = null;
}

function adicionarAoCarrinhoDoModal() {
    if (!produtoSelecionado) return;
    
    if (!tamanhoSelecionado) {
        alert('⚠️ Por favor, selecione um tamanho!');
        return;
    }

    adicionarProdutoAoCarrinho(produtoSelecionado, tamanhoSelecionado);
    fecharModalProduto();
    abrirCarrinho();
}

// Carrinho
function adicionarProdutoAoCarrinho(produto, tamanho) {
    const itemExistente = carrinho.find(
        item => item.id === produto.id && item.tamanho === tamanho
    );

    if (itemExistente) {
        itemExistente.quantidade++;
    } else {
        carrinho.push({
            id: produto.id,
            nome: produto.nome,
            preco: produto.preco,
            imagem: produto.imagem,
            tamanho: tamanho,
            quantidade: 1
        });
    }

    salvarCarrinho();
    atualizarCarrinho();
}

function removerDoCarrinho(index) {
    carrinho.splice(index, 1);
    salvarCarrinho();
    atualizarCarrinho();
}

function salvarCarrinho() {
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
}

function atualizarCarrinho() {
    // Contador
    const totalItens = carrinho.reduce((soma, item) => soma + item.quantidade, 0);
    contadorCarrinho.textContent = totalItens;

    // Itens
    if (carrinho.length === 0) {
        itensCarrinho.innerHTML = `
            <div class="carrinho-vazio">
                <i class="fas fa-shopping-bag" style="font-size: 48px; margin-bottom: 16px; opacity: 0.2;"></i>
                <h4>Seu carrinho está vazio</h4>
                <p>Adicione produtos para continuar</p>
            </div>
        `;
    } else {
        itensCarrinho.innerHTML = carrinho.map((item, index) => `
            <div class="item-carrinho">
                <div class="item-carrinho-img">
                    <img src="${item.imagem}" alt="${item.nome}">
                </div>
                <div class="item-carrinho-info">
                    <h4 class="item-carrinho-nome">${item.nome}</h4>
                    <p class="item-carrinho-detalhe">Tamanho: ${item.tamanho} | Qtd: ${item.quantidade}</p>
                    <p class="item-carrinho-preco">R$ ${(item.preco * item.quantidade).toFixed(2)}</p>
                </div>
                <button class="item-carrinho-remover" data-index="${index}">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </div>
        `).join('');

        // Eventos de remoção
        document.querySelectorAll('.item-carrinho-remover').forEach(botao => {
            botao.addEventListener('click', () => {
                removerDoCarrinho(parseInt(botao.dataset.index));
            });
        });
    }

    // Valores
    const subtotal = carrinho.reduce((soma, item) => soma + (item.preco * item.quantidade), 0);
    subtotalValor.textContent = `R$ ${subtotal.toFixed(2)}`;
    totalValor.textContent = `R$ ${subtotal.toFixed(2)}`;
}

function abrirCarrinho() {
    painelCarrinho.classList.add('aberto');
    fundoOpaco.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function fecharCarrinhoPainel() {
    painelCarrinho.classList.remove('aberto');
    fundoOpaco.style.display = 'none';
    document.body.style.overflow = '';
}

function finalizarCompra() {
    if (carrinho.length === 0) {
        alert('⚠️ Seu carrinho está vazio!');
        return;
    }

    const subtotal = carrinho.reduce((soma, item) => soma + (item.preco * item.quantidade), 0);
    
    let mensagem = `🛒 *PEDIDO — HOMEM & ESTILO*\n\n`;
    mensagem += `Itens do pedido:\n`;
    
    carrinho.forEach(item => {
        mensagem += `• ${item.nome} — Tamanho: ${item.tamanho} — Qtd: ${item.quantidade} — R$ ${(item.preco * item.quantidade).toFixed(2)}\n`;
    });
    
    mensagem += `\n💰 *Subtotal: R$ ${subtotal.toFixed(2)}*\n`;
    mensagem += `🚚 Frete calculado após confirmação do endereço.\n\n`;
    mensagem += `Aguarde nosso retorno com o valor total e dados de pagamento. Obrigado! 👔`;

    const numeroWhatsApp = '5519999999999'; // Substitua pelo número real
    const url = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensagem)}`;
    
    window.open(url, '_blank');
    
    // Limpar carrinho após envio
    carrinho = [];
    salvarCarrinho();
    atualizarCarrinho();
    fecharCarrinhoPainel();
}
