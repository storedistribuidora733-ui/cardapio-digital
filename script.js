// ==============================================
// ⚙️ CONFIGURAÇÕES DA LOJA
// ==============================================
const CONFIG = {
  horaAbertura: 7,
  horaFechamento: 23,
  textoStatusAberto: "Aberto até às 23:00",
  textoStatusFechado: "Fechado • Abre às 07:00",
  corStatusAberto: "#22c55e",
  corStatusFechado: "#dc2626",
  numeroWhatsApp: "5519989021323",
  nomeLoja: "Alison Burger",
  taxaEntregaPadrao: 8.00
};

// ==============================================
// 📥 CARREGA PRODUTOS DO ARQUIVO GLOBAL produtos.json
// QUALQUER PESSOA ACESSA A MESMA LISTA
// ==============================================
let listaProdutos = [];

async function carregarProdutos() {
  try {
    const resposta = await fetch('./produtos.json', { cache: "no-store" });
    if (!resposta.ok) throw new Error("Arquivo não encontrado");
    listaProdutos = await resposta.json();
    renderizarProdutos();
  } catch (erro) {
    console.warn("Usando lista padrão:", erro);
    listaProdutos = [
      {id:1,nome:"Hambúrguer Simples",preco:10.00,categoria:"hamburgueres",descricao:"Pão, carne, queijo, alface e tomate fresquinhos.",imagem:"https://images.unsplash.com/photo-1568901346375-23c9450c58cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",ativo:true,codigo:"01"},
      {id:2,nome:"Hambúrguer Duplo",preco:12.00,categoria:"hamburgueres",descricao:"Duas carnes suculentas, queijo derretido e molho secreto.",imagem:"https://images.unsplash.com/photo-1550547660-d9450d859349?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",ativo:true,codigo:"02"},
      {id:3,nome:"Hambúrguer Picante",preco:15.00,categoria:"hamburgueres",descricao:"Carne especial com molho apimentado caseiro.",imagem:"https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",ativo:true,codigo:"03"},
      {id:4,nome:"Batata Frita Tradicional",preco:12.00,categoria:"acompanhamentos",descricao:"Porção crocante e bem temperada.",imagem:"https://images.unsplash.com/photo-1630384069788-507091318437?auto=format&fit=crop&w=400&q=80",ativo:true,codigo:"04"},
      {id:5,nome:"Anéis de Cebola",preco:14.00,categoria:"acompanhamentos",descricao:"Anéis empanados crocantes com molho especial.",imagem:"https://images.unsplash.com/photo-1639024471283-03518883512d?auto=format&fit=crop&w=400&q=80",ativo:true,codigo:"05"},
      {id:6,nome:"Batata Cheddar e Bacon",preco:18.00,categoria:"acompanhamentos",descricao:"Batata com molho cheddar cremoso e bacon picado.",imagem:"https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=400&q=80",ativo:true,codigo:"06"},
      {id:7,nome:"Coca-Cola 350ml Zero",preco:6.00,categoria:"bebidas",descricao:"Lata gelada sem açúcar.",imagem:"https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=400&q=80",ativo:true,codigo:"07"},
      {id:8,nome:"Guaraná Antarctica 350ml",preco:6.00,categoria:"bebidas",descricao:"Lata tradicional bem gelada.",imagem:"https://images.unsplash.com/photo-1613485950590-d09f19d0647a?auto=format&fit=crop&w=400&q=80",ativo:true,codigo:"08"},
      {id:9,nome:"Suco de Laranja Natural 500ml",preco:9.00,categoria:"bebidas",descricao:"Suco 100% natural espremido na hora.",imagem:"https://images.unsplash.com/photo-1613478223713-59039128562e?auto=format&fit=crop&w=400&q=80",ativo:true,codigo:"09"},
      {id:10,nome:"Coca‑Cola 2 L Normal",preco:12.00,categoria:"bebidas",descricao:"Garrafa grande para toda a família, bem gelada.",imagem:"https://images.unsplash.com/photo-1554866531-0e5684a20d22?auto=format&fit=crop&w=400&q=80",ativo:true,codigo:"10"},
      {id:11,nome:"Coca‑Cola 2 L Zero Açúcar",preco:12.00,categoria:"bebidas",descricao:"Garrafa grande zero açúcar gelada.",imagem:"https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=400&q=80",ativo:true,codigo:"11"}
    ];
    renderizarProdutos();
  }
}

// ==============================================
// 📄 EXIBIÇÃO E FILTROS
// ==============================================
function renderizarProdutos() {
  const container = document.getElementById('lista-produtos');
  container.innerHTML = '';

  listaProdutos.filter(p => p.ativo).forEach(prod => {
    const div = document.createElement('div');
    div.className = 'produto';
    div.dataset.categoria = prod.categoria;
    div.dataset.nome = prod.nome;
    div.dataset.preco = prod.preco;
    div.dataset.descricao = prod.descricao || "Sem descrição";
    div.dataset.imagem = prod.imagem || "";

    div.innerHTML = `
      <div class="produto-imagem">
        <img src="${prod.imagem}" alt="${prod.nome}" loading="lazy">
        ${prod.codigo === "01" ? '<span class="tag-mais-pedido">★ MAIS</span>' : ''}
      </div>
      <div class="produto-info">
        <p class="produto-codigo">${prod.codigo || ""}</p>
        <h2 class="produto-nome">${prod.nome}</h2>
        <p class="produto-descricao">${prod.descricao}</p>
        <div class="produto-detalhes">
          <span><i class="fa fa-fire"></i> Muito pedido</span>
          <span><i class="fa fa-clock"></i> 20-30 min</span>
        </div>
      </div>
      <p class="produto-preco">R$ ${prod.preco.toFixed(2).replace('.', ',')}</p>
    `;
    container.appendChild(div);
  });

  configurarCliqueProdutos();
}

// ==============================================
// 🛒 VARIÁVEIS GERAIS
// ==============================================
const carrinho = [];
let produtoAtual = null;
let quantidadeAtual = 1;
let adicionaisSelecionados = [];

const abrirCarrinhoBtn = document.getElementById('abrir-carrinho');
const modalCarrinho = document.getElementById('modal-carrinho');
const fecharModalBtns = [document.getElementById('fechar-modal')];
const btnLimparCarrinho = document.getElementById('btn-limpar');
const listaItensCarrinho = document.getElementById('lista-itens-carrinho');
const valorTotalEl = document.getElementById('valor-total');
const qtdCarrinhoEl = document.getElementById('qtd-carrinho');
const alertaFechado = document.getElementById('alerta-fechado');
const btnEntendi = document.getElementById('btn-entendi');
const textoStatusEl = document.getElementById('texto-status');
const pontoStatusEl = document.getElementById('ponto-status');
const campoBusca = document.getElementById('campoBusca');
const carrinhoContainer = document.getElementById('carrinho-container');
const resumoCarrinhoEl = document.getElementById('resumo-carrinho');

const nomeEl = document.getElementById('nome-cliente');
const avisoGeral = document.getElementById('aviso-geral');
const tipoAtendimentoEl = document.getElementById('tipo-atendimento');
const campoTaxaEntregaEl = document.getElementById('campo-taxa-entrega');
const blocoEnderecoEl = document.getElementById('bloco-endereco');
const taxaEntregaEl = document.getElementById('taxa-entrega');
const cepEl = document.getElementById('cep');
const numeroEl = document.getElementById('numero');
const complementoEl = document.getElementById('complemento');
const referenciaEl = document.getElementById('referencia');
const ruaEl = document.getElementById('rua');
const bairroEl = document.getElementById('bairro');
const cidadeUfEl = document.getElementById('cidade-uf');
const avisoCepEl = document.getElementById('aviso-cep');
const pagamentoEl = document.getElementById('forma-pagamento');

const modalProduto = document.getElementById('modal-produto');
const btnVoltarLista = document.getElementById('btn-voltar');
const imgDetalhe = document.getElementById('img-detalhe');
const nomeDetalhe = document.getElementById('nome-detalhe');
const descricaoDetalhe = document.getElementById('descricao-detalhe');
const precoOriginalEl = document.getElementById('preco-original');
const precoPromocionalEl = document.getElementById('preco-promocional');
const listaAdicionaisEl = document.getElementById('lista-adicionais');
const qtdAtualEl = document.getElementById('qtd-atual');
const diminuirQtdBtn = document.getElementById('diminuir-qtd');
const aumentarQtdBtn = document.getElementById('aumentar-qtd');
const btnAdicionarDetalhe = document.getElementById('btn-adicionar-detalhe');
const pontoStatusModal = document.getElementById('ponto-status-modal');
const textoStatusModal = document.getElementById('texto-status-modal');

// ==============================================
// 🗑️ LIMPAR CARRINHO
// ==============================================
function limparTudoCarrinho() {
  carrinho.length = 0;
  listaItensCarrinho.innerHTML = '';
  valorTotalEl.textContent = '0,00';
  qtdCarrinhoEl.textContent = '0';
  resumoCarrinhoEl.innerHTML = '0 itens • R$ 0,00 &nbsp; | &nbsp; 🔒 Ambiente 100% seguro';
  carrinhoContainer.style.display = 'none';
  nomeEl.value = '';
  tipoAtendimentoEl.value = 'retirada';
  taxaEntregaEl.value = '8,00';
  pagamentoEl.value = 'Dinheiro';
  avisoGeral.classList.add('oculto');
  limparCamposEndereco();
  campoTaxaEntregaEl.classList.add('oculto');
  blocoEnderecoEl.classList.add('oculto');
  modalCarrinho.classList.add('oculto');
  document.body.style.overflow = 'auto';
}
btnLimparCarrinho.addEventListener('click', limparTudoCarrinho);

// ==============================================
// 🚀 ENTREGA / RETIRADA
// ==============================================
tipoAtendimentoEl.addEventListener('change', () => {
  if (tipoAtendimentoEl.value === 'entrega') {
    campoTaxaEntregaEl.classList.remove('oculto');
    blocoEnderecoEl.classList.remove('oculto');
    taxaEntregaEl.value = CONFIG.taxaEntregaPadrao.toFixed(2).replace('.', ',');
  } else {
    campoTaxaEntregaEl.classList.add('oculto');
    blocoEnderecoEl.classList.add('oculto');
    taxaEntregaEl.value = '0,00';
    limparCamposEndereco();
  }
});

// ==============================================
// 🔍 BUSCA CEP
// ==============================================
cepEl.addEventListener('input', () => {
  let cep = cepEl.value.replace(/\D/g, '');
  if (cep.length > 5) cep = cep.replace(/^(\d{5})(\d)/, '$1-$2');
  cepEl.value = cep;
});

cepEl.addEventListener('blur', async () => {
  const cepNumeros = cepEl.value.replace(/\D/g, '');
  if (cepNumeros.length !== 8) {
    avisoCepEl.textContent = 'CEP inválido! Digite 8 dígitos.';
    avisoCepEl.style.color = '#dc2626';
    limparCamposEndereco();
    return;
  }
  avisoCepEl.textContent = 'Buscando endereço...';
  avisoCepEl.style.color = '#2563eb';
  try {
    const resposta = await fetch(`https://viacep.com.br/ws/${cepNumeros}/json/`);
    const dados = await resposta.json();
    if (dados.erro) throw new Error();
    ruaEl.value = dados.logradouro || '';
    bairroEl.value = dados.bairro || '';
    cidadeUfEl.value = `${dados.localidade} / ${dados.uf}`;
    avisoCepEl.textContent = 'Endereço preenchido!';
    avisoCepEl.style.color = '#22c55e';
  } catch {
    avisoCepEl.textContent = 'CEP não encontrado!';
    avisoCepEl.style.color = '#dc2626';
    limparCamposEndereco();
  }
});

function limparCamposEndereco() {
  cepEl.value = ''; numeroEl.value = ''; complementoEl.value = ''; referenciaEl.value = '';
  ruaEl.value = ''; bairroEl.value = ''; cidadeUfEl.value = '';
  avisoCepEl.textContent = 'Digite o CEP para preencher automaticamente';
  avisoCepEl.style.color = '#2563eb';
}

// ==============================================
// 🕒 STATUS LOJA
// ==============================================
function verificarStatusLoja(mostrarAviso = false) {
  const agora = new Date();
  const horaAtual = agora.getHours();
  const lojaAberta = horaAtual >= CONFIG.horaAbertura && horaAtual < CONFIG.horaFechamento;

  pontoStatusEl.style.backgroundColor = lojaAberta ? CONFIG.corStatusAberto : CONFIG.corStatusFechado;
  textoStatusEl.textContent = lojaAberta ? CONFIG.textoStatusAberto : CONFIG.textoStatusFechado;

  pontoStatusModal.style.backgroundColor = lojaAberta ? CONFIG.corStatusAberto : CONFIG.corStatusFechado;
  textoStatusModal.textContent = lojaAberta ? CONFIG.textoStatusAberto : CONFIG.textoStatusFechado;

  if (!lojaAberta && mostrarAviso) alertaFechado.classList.remove("oculto");
  return lojaAberta;
}
verificarStatusLoja();
setInterval(verificarStatusLoja, 60000);
btnEntendi.addEventListener('click', () => alertaFechado.classList.add("oculto"));

// ==============================================
// 📂 DETALHES PRODUTO
// ==============================================
function configurarCliqueProdutos() {
  document.querySelectorAll('.produto').forEach(produto => {
    produto.addEventListener('click', () => {
      if (!verificarStatusLoja(true)) return;

      produtoAtual = {
        nome: produto.dataset.nome,
        preco: parseFloat(produto.dataset.preco),
        descricao: produto.dataset.descricao || 'Sem descrição.',
        imagem: produto.dataset.imagem || '',
        adicionais: [
          { nome: 'Bacon Suculento', preco: 2.90 },
          { nome: 'Queijo Extra', preco: 2.50 },
          { nome: 'Catupiry', preco: 2.00 },
          { nome: 'Ovo', preco: 1.50 }
        ]
      };

      quantidadeAtual = 1;
      adicionaisSelecionados = [];
      qtdAtualEl.textContent = quantidadeAtual;

      imgDetalhe.src = produtoAtual.imagem;
      nomeDetalhe.textContent = produtoAtual.nome;
      descricaoDetalhe.textContent = produtoAtual.descricao;
      precoOriginalEl.textContent = `R$ ${(produtoAtual.preco * 1.2).toFixed(2).replace('.', ',')}`;
      precoPromocionalEl.textContent = `R$ ${produtoAtual.preco.toFixed(2).replace('.', ',')}`;
      atualizarTotalDet
