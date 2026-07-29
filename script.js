// ==============================================
// ⚙️ CONFIGURAÇÕES GERAIS
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
// 🛒 VARIÁVEIS
// ==============================================
let listaProdutos = [];
let carrinho = [];
let adicionaisSelecionados = [];
let qtdAtual = 1;
let produtoAtual = null;

// ==============================================
// 📂 CARREGAMENTO: Arquivo público + Local (Painel)
// ==============================================
async function carregarProdutos() {
  try {
    const resposta = await fetch('produtos.json');
    if (resposta.ok) {
      listaProdutos = await resposta.json();
      console.log('✅ Produtos carregados do arquivo público (todos veem)');
    } else {
      listaProdutos = JSON.parse(localStorage.getItem('alisonBurgerProdutos') || '[]');
      console.log('ℹ️ Usando produtos locais (seu aparelho/painel)');
    }
  } catch (erro) {
    console.warn('⚠️ Erro ao ler JSON, usando salvos localmente:', erro);
    listaProdutos = JSON.parse(localStorage.getItem('alisonBurgerProdutos') || '[]');
  }
  renderizarProdutos();
}

function salvarProdutosLocal() {
  localStorage.setItem('alisonBurgerProdutos', JSON.stringify(listaProdutos));
  console.log('💾 Salvo localmente — lembre de atualizar o produtos.json no GitHub para todos verem!');
}

// ==============================================
// 🖼️ EXIBIR PRODUTOS NA TELA
// ==============================================
function renderizarProdutos() {
  const container = document.getElementById('lista-produtos');
  if (!container) return;

  if (!listaProdutos.length) {
    container.innerHTML = `<p style="padding:20px;text-align:center;color:#666;">Nenhum produto cadastrado ainda — use o painel admin para adicionar.</p>`;
    return;
  }

  container.innerHTML = listaProdutos.map(prod => `
    <div class="produto" data-categoria="${prod.categoria || 'outros'}" onclick="abrirDetalhe('${prod.id}')">
      <div class="produto-imagem">
        <img src="${prod.imagem || 'https://via.placeholder.com/150/f3f4f6/999?text=Sem+Imagem'}" alt="${prod.nome}">
        ${prod.destaque ? '<span class="tag-mais-pedido">Mais Pedido</span>' : ''}
      </div>
      <div class="produto-info">
        <h3 class="produto-nome">${prod.nome}</h3>
        <p class="produto-descricao">${prod.descricao || ''}</p>
        <div class="produto-detalhes">
          <span>Preparo: ${prod.tempo || '~15min'}</span>
          <span>Cód: ${prod.id}</span>
        </div>
      </div>
      <div class="produto-preco">R$ ${(prod.preco || 0).toFixed(2).replace('.', ',')}</div>
    </div>
  `).join('');
}

// ==============================================
// 🔄 STATUS DA LOJA
// ==============================================
function atualizarStatus(estaAberto) {
  const ponto = document.getElementById('ponto-status');
  const texto = document.getElementById('texto-status');
  const pontoM = document.getElementById('ponto-status-modal');
  const textoM = document.getElementById('texto-status-modal');

  if (estaAberto) {
    ponto?.classList.replace('fechado', 'aberto');
    if (pontoM) pontoM.className = 'ponto-status aberto';
    if (texto) texto.textContent = CONFIG.textoStatusAberto;
    if (textoM) textoM.textContent = CONFIG.textoStatusAberto;
  } else {
    ponto?.classList.replace('aberto', 'fechado');
    if (pontoM) pontoM.className = 'ponto-status fechado';
    if (texto) texto.textContent = CONFIG.textoStatusFechado;
    if (textoM) textoM.textContent = CONFIG.textoStatusFechado;
  }
}

function verificarStatus() {
  const hora = new Date().getHours();
  const ok = hora >= CONFIG.horaAbertura && hora < CONFIG.horaFechamento;
  atualizarStatus(ok);
  return ok;
}

// ==============================================
// 📄 MODAL DETALHES DO PRODUTO
// ==============================================
function abrirDetalhe(id) {
  produtoAtual = listaProdutos.find(p => p.id === id);
  if (!produtoAtual) return;

  qtdAtual = 1;
  adicionaisSelecionados = [];

  document.getElementById('img-detalhe').src = produtoAtual.imagem || 'https://via.placeholder.com/400x200/f3f4f6/999?text=Sem+Imagem';
  document.getElementById('nome-detalhe').textContent = produtoAtual.nome;
  document.getElementById('descricao-detalhe').textContent = produtoAtual.descricao || 'Sem descrição';
  document.getElementById('preco-original').textContent = produtoAtual.precoOriginal ? `R$ ${produtoAtual.precoOriginal.toFixed(2).replace('.', ',')}` : '';
  document.getElementById('preco-promocional').textContent = `R$ ${(produtoAtual.preco || 0).toFixed(2).replace('.', ',')}`;
  document.getElementById('qtd-atual').textContent = '1';

  const listaAdic = document.getElementById('lista-adicionais');
  listaAdic.innerHTML = (produtoAtual.adicionais || []).map((adic, i) => `
    <div class="adicional-item">
      <div>
        <div class="adicional-nome">${adic.nome}</div>
        <div class="adicional-preco">+ R$ ${adic.preco.toFixed(2).replace('.', ',')}</div>
      </div>
      <button class="btn-add-adicional" data-ind="${i}" onclick="toggleAdicional(this)">+</button>
    </div>
  `).join('');

  document.getElementById('modal-produto').classList.remove('oculto');
  window.scrollTo(0, 0);
}

function toggleAdicional(btn) {
  const ind = parseInt(btn.dataset.ind);
  const adic = (produtoAtual.adicionais || [])[ind];
  const pos = adicionaisSelecionados.findIndex(a => a.nome === adic.nome);

  if (pos >= 0) {
    adicionaisSelecionados.splice(pos, 1);
    btn.classList.remove('selecionado');
    btn.textContent = '+';
  } else {
    adicionaisSelecionados.push(adic);
    btn.classList.add('selecionado');
    btn.textContent = '✓';
  }
}

// ==============================================
// 🛒 CARRINHO
// ==============================================
function atualizarCarrinhoTela() {
  const container = document.getElementById('carrinho-container');
  const qtdEl = document.getElementById('qtd-carrinho');
  const resumoEl = document.getElementById('resumo-carrinho');

  const totalItens = carrinho.reduce((s, i) => s + i.quantidade, 0);
  const totalValor = carrinho.reduce((s, i) => s + (i.precoUnit + i.adicionalValor) * i.quantidade, 0);

  if (totalItens > 0) container.style.display = 'block';
  else container.style.display = 'none';

  qtdEl.textContent = totalItens;
  resumoEl.textContent = `${totalItens} item(ns) • R$ ${totalValor.toFixed(2).replace('.', ',')} | 🔒 Ambiente seguro`;

  localStorage.setItem('alisonBurgerCarrinho', JSON.stringify(carrinho));
}

function adicionarAoCarrinho() {
  if (!produtoAtual) return;

  const valorAdic = adicionaisSelecionados.reduce((s, a) => s + a.preco, 0);
  const item = {
    id: produtoAtual.id,
    nome: produtoAtual.nome,
    precoUnit: produtoAtual.preco,
    adicionalValor: valorAdic,
    adicionais: adicionaisSelecionados.map(a => a.nome),
    quantidade: qtdAtual
  };

  const existente = carrinho.find(i => i.id === item.id && JSON.stringify(i.adicionais) === JSON.stringify(item.adicionais));
  if (existente) existente.quantidade += qtdAtual;
  else carrinho.push(item);

  document.getElementById('modal-produto').classList.add('oculto');
  atualizarCarrinhoTela();
}

function abrirModalCarrinho() {
  const lista = document.getElementById('lista-itens-carrinho');
  if (!carrinho.length) {
    lista.innerHTML = '<p style="text-align:center;color:#666;">Carrinho vazio</p>';
  } else {
    lista.innerHTML = carrinho.map((item, idx) => `
      <div class="item-carrinho">
        <div>
          <strong>${item.quantidade}x</strong> ${item.nome}
          ${item.adicionais.length ? `<br><small>+ ${item.adicionais.join(', ')}</small>` : ''}
        </div>
        <div style="text-align:right;">
          R$ ${((item.precoUnit + item.adicionalValor) * item.quantidade).toFixed(2).replace('.', ',')}
          <br><button style="font-size:12px;color:#dc2626;background:none;border:none;cursor:pointer;" onclick="removerItem(${idx})">remover</button>
        </div>
      </div>
    `).join('');
  }
  document.getElementById('valor-total').textContent = carrinho.reduce((s,i)=>s+(i.precoUnit+i.adicionalValor)*i.quantidade,0).toFixed(2).replace('.',',');
  document.getElementById('modal-carrinho').classList.remove('oculto');
}

function removerItem(ind) {
  carrinho.splice(ind, 1);
  atualizarCarrinhoTela();
  abrirModalCarrinho();
}

function limparCarrinho() {
  carrinho = [];
  localStorage.removeItem('alisonBurgerCarrinho');
  document.getElementById('modal-carrinho').classList.add('oculto');
  atualizarCarrinhoTela();
}

// ==============================================
// 🚀 INICIALIZAÇÃO GERAL
// ==============================================
document.addEventListener('DOMContentLoaded', () => {
  carrinho = JSON.parse(localStorage.getItem('alisonBurgerCarrinho') || '[]');
  carregarProdutos();
  verificarStatus();
  setInterval(verificarStatus, 60000);

  document.getElementById('btn-voltar')?.addEventListener('click', () => document.getElementById('modal-produto').classList.add('oculto'));
  document.getElementById('diminuir-qtd')?.addEventListener('click', () => { if(qtdAtual>1) qtdAtual--; document.getElementById('qtd-atual').textContent=qtdAtual; });
  document.getElementById('aumentar-qtd')?.addEventListener('click', () => { qtdAtual++; document.getElementById('qtd-atual').textContent=qtdAtual; });
  document.getElementById('btn-adicionar-detalhe')?.addEventListener('click', adicionarAoCarrinho);

  document.getElementById('abrir-carrinho')?.addEventListener('click', abrirModalCarrinho);
  document.getElementById('fechar-modal')?.addEventListener('click', () => document.getElementById('modal-carrinho').classList.add('oculto'));
  document.getElementById('btn-limpar')?.addEventListener('click', limparCarrinho);

  document.querySelectorAll('.categoria-btn').forEach(btn => btn.addEventListener('click', e => {
    document.querySelectorAll('.categoria-btn').forEach(b=>b.classList.remove('ativo'));
    e.target.classList.add('ativo');
    const cat = btn.dataset.categoria;
    document.querySelectorAll('.produto').forEach(p => p.classList.toggle('oculto', cat !== 'todos' && p.dataset.categoria !== cat));
  }));

  document.getElementById('campoBusca')?.addEventListener('input', e => {
    const termo = e.target.value.trim().toLowerCase();
    document.querySelectorAll('.produto').forEach(p => p.classList.toggle('oculto', !p.textContent.toLowerCase().includes(termo)));
  });

  document.getElementById('tipo-atendimento')?.addEventListener('change', e => {
    const entregaEl = document.getElementById('bloco-endereco');
    const taxaEl = document.getElementById('campo-taxa-entrega');
    if (e.target.value === 'entrega') { entregaEl?.classList.remove('oculto'); taxaEl?.classList.remove('oculto'); }
    else { entregaEl?.classList.add('oculto'); taxaEl?.classList.add('oculto'); }
  });

  atualizarCarrinhoTela();
});
