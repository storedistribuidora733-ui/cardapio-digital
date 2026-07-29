// ==============================================
// CONFIGURAÇÕES GERAIS
// ==============================================
const CONFIG = {
  horaAbertura: 7,
  horaFechamento: 23,
  textoAberto: "Aberto até às 23:00",
  textoFechado: "Fechado • Abre às 07:00",
  corStatusAberto: "#22c55e",
  corStatusFechado: "#dc2626",
  numeroWhatsApp: "5519989021323",
  nomeLoja: "Alison Burger",
  taxaEntregaPadrao: 8.00
};

let carrinho = [];
let produtos = [];
let adicionaisAtuais = [];

// ==============================================
// STATUS DA LOJA
// ==============================================
function atualizarStatus(aberto) {
  const ponto = document.getElementById('ponto-status');
  const texto = document.getElementById('texto-status');
  const pontoModal = document.getElementById('ponto-status-modal');
  const textoModal = document.getElementById('texto-status-modal');

  if (aberto) {
    ponto.className = 'ponto-status aberto';
    texto.textContent = CONFIG.textoAberto;
    if (pontoModal) {
      pontoModal.className = 'ponto-status aberto';
      textoModal.textContent = CONFIG.textoAberto;
    }
  } else {
    ponto.className = 'ponto-status fechado';
    texto.textContent = CONFIG.textoFechado;
    if (pontoModal) {
      pontoModal.className = 'ponto-status fechado';
      textoModal.textContent = CONFIG.textoFechado;
    }
  }
}

function verificarStatusLoja() {
  const horaAtual = new Date().getHours();
  const estaAberto = horaAtual >= CONFIG.horaAbertura && horaAtual < CONFIG.horaFechamento;
  atualizarStatus(estaAberto);
  return estaAberto;
}

verificarStatusLoja();
setInterval(verificarStatusLoja, 60000);

// ==============================================
// CARREGAR PRODUTOS DO JSON
// ==============================================
async function carregarProdutos() {
  try {
    const resp = await fetch('produtos.json');
    if (!resp.ok) throw new Error('Sem arquivo');
    produtos = await resp.json();
    renderizarProdutos();
  } catch (e) {
    document.getElementById('lista-produtos').innerHTML = 
      '<p style="padding:20px;color:#666;text-align:center;">Nenhum produto cadastrado ainda – use o painel admin para adicionar.</p>';
  }
}

function renderizarProdutos() {
  const container = document.getElementById('lista-produtos');
  if (!produtos.length) {
    container.innerHTML = '<p style="padding:20px;color:#666;text-align:center;">Nenhum produto cadastrado ainda – use o painel admin para adicionar.</p>';
    return;
  }
  container.innerHTML = produtos.map(p => `
    <div class="produto" data-categoria="${p.categoria}" data-id="${p.id}" onclick="abrirProduto('${p.id}')">
      <div class="produto-imagem">
        ${p.destaque ? '<span class="tag-mais-pedido">MAIS</span>' : ''}
        <img src="${p.imagem}" alt="${p.nome}" loading="lazy">
      </div>
      <div class="produto-info">
        <div class="produto-codigo">${p.id}</div>
        <h3 class="produto-nome">${p.nome}</h3>
        <p class="produto-descricao">${p.descricao}</p>
        <div class="produto-detalhes">
          <span><i class="fa fa-clock-o"></i> ${p.tempo}</span>
        </div>
      </div>
      <div class="produto-preco">R$ ${p.preco.toFixed(2).replace('.', ',')}</div>
    </div>
  `).join('');
}

// ==============================================
// FILTROS E BUSCA
// ==============================================
document.querySelectorAll('.categoria-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.categoria-btn').forEach(b => b.classList.remove('ativo'));
    btn.classList.add('ativo');
    const cat = btn.dataset.categoria;
    document.querySelectorAll('.produto').forEach(prod => {
      prod.classList.toggle('oculto', cat !== 'todos' && prod.dataset.categoria !== cat);
    });
  });
});

document.getElementById('campoBusca').addEventListener('input', e => {
  const termo = e.target.value.trim().toLowerCase();
  document.querySelectorAll('.produto').forEach(prod => {
    prod.classList.toggle('oculto', !prod.textContent.toLowerCase().includes(termo));
  });
});

// ==============================================
// MODAL PRODUTO
// ==============================================
let qtdAtual = 1;
let produtoAtual = null;

window.abrirProduto = function(id) {
  produtoAtual = produtos.find(p => p.id === id);
  if (!produtoAtual) return;
  qtdAtual = 1;
  adicionaisAtuais = [];

  document.getElementById('img-detalhe').src = produtoAtual.imagem;
  document.getElementById('nome-detalhe').textContent = produtoAtual.nome;
  document.getElementById('descricao-detalhe').textContent = produtoAtual.descricao;
  document.getElementById('preco-promocional').textContent = `R$ ${produtoAtual.preco.toFixed(2).replace('.', ',')}`;
  document.getElementById('preco-original').textContent = '';
  document.getElementById('qtd-atual').textContent = '1';
  document.getElementById('lista-adicionais').innerHTML = '';

  document.getElementById('modal-produto').classList.remove('oculto');
  window.scrollTo(0,0);
};

document.getElementById('btn-voltar').addEventListener('click', () => {
  document.getElementById('modal-produto').classList.add('oculto');
});

document.getElementById('diminuir-qtd').addEventListener('click', () => {
  if (qtdAtual > 1) qtdAtual--;
  document.getElementById('qtd-atual').textContent = qtdAtual;
});
document.getElementById('aumentar-qtd').addEventListener('click', () => {
  qtdAtual++;
  document.getElementById('qtd-atual').textContent = qtdAtual;
});

document.getElementById('btn-adicionar-detalhe').addEventListener('click', () => {
  if (!verificarStatusLoja()) {
    document.getElementById('alerta-fechado').classList.remove('oculto');
    return;
  }
  carrinho.push({
    ...produtoAtual,
    quantidade: qtdAtual,
    adicionais: [...adicionaisAtuais]
  });
  atualizarCarrinhoVisivel();
  document.getElementById('modal-produto').classList.add('oculto');
});

// ==============================================
// CARRINHO
// ==============================================
function atualizarCarrinhoVisivel() {
  const container = document.getElementById('carrinho-container');
  const qtdEl = document.getElementById('qtd-carrinho');
  const resumo = document.getElementById('resumo-carrinho');
  if (!carrinho.length) {
    container.style.display = 'none';
    return;
  }
  const total = carrinho.reduce((s, i) => s + i.preco * i.quantidade, 0);
  const totalItens = carrinho.reduce((s, i) => s + i.quantidade, 0);
  qtdEl.textContent = totalItens;
  resumo.textContent = `${totalItens} itens • R$ ${total.toFixed(2).replace('.', ',')} &nbsp; | &nbsp; 🔒 Ambiente 100% seguro`;
  container.style.display = 'flex';
}

document.getElementById('abrir-carrinho').addEventListener('click', () => {
  if (!carrinho.length) return;
  renderizarCarrinho();
  document.getElementById('modal-carrinho').classList.remove('oculto');
});
document.getElementById('fechar-modal').addEventListener('click', () => {
  document.getElementById('modal-carrinho').classList.add('oculto');
});
document.getElementById('btn-limpar').addEventListener('click', () => {
  carrinho = [];
  atualizarCarrinhoVisivel();
  document.getElementById('modal-carrinho').classList.add('oculto');
});

function renderizarCarrinho() {
  const lista = document.getElementById('lista-itens-carrinho');
  const totalEl = document.getElementById('valor-total');
  lista.innerHTML = carrinho.map((item, idx) => `
    <div class="item-carrinho">
      <div>
        <strong>${item.quantidade}x</strong> ${item.nome}
        ${item.adicionais.length ? `<br><small>+ ${item.adicionais.map(a=>a.nome).join(', ')}</small>` : ''}
      </div>
      <div style="text-align:right;">
        R$ ${(item.preco * item.quantidade).toFixed(2).replace('.',',')}
      </div>
    </div>
  `).join('');
  const total = carrinho.reduce((s, i) => s + i.preco * i.quantidade, 0);
  totalEl.textContent = total.toFixed(2).replace('.', ',');
}

// ==============================================
// ENDEREÇO / CEP / FINALIZAR
// ==============================================
document.getElementById('tipo-atendimento').addEventListener('change', e => {
  const entrega = e.target.value === 'entrega';
  document.getElementById('campo-taxa-entrega').classList.toggle('oculto', !entrega);
  document.getElementById('bloco-endereco').classList.toggle('oculto', !entrega);
});

document.getElementById('btn-finalizar').addEventListener('click', () => {
  if (!verificarStatusLoja()) {
    document.getElementById('modal-carrinho').classList.add('oculto');
    document.getElementById('alerta-fechado').classList.remove('oculto');
    return;
  }
  if (!carrinho.length) {
    document.getElementById('aviso-geral').textContent = 'Carrinho vazio!';
    document.getElementById('aviso-geral').classList.remove('oculto');
    return;
  }
  const nome = document.getElementById('nome-cliente').value.trim();
  if (!nome) {
    document.getElementById('aviso-geral').textContent = 'Informe seu nome!';
    document.getElementById('aviso-geral').classList.remove('oculto');
    return;
  }
  document.getElementById('aviso-geral').classList.add('oculto');

  const tipo = document.getElementById('tipo-atendimento').value;
  const pagamento = document.getElementById('forma-pagamento').value;
  const obs = document.getElementById('observacao').value.trim();
  const taxa = tipo === 'entrega' ? parseFloat(CONFIG.taxaEntregaPadrao) : 0;
  const total = carrinho.reduce((s,i)=>s + i.preco*i.quantidade,0) + taxa;

  let textoPedido = `🍔 *${CONFIG.nomeLoja}*%0A`;
  textoPedido += `📅 ${new Date().toLocaleString('pt-BR')}%0A`;
  textoPedido += `👤 Nome: ${nome}%0A`;
  textoPedido += `📦 Tipo: ${tipo}%0A`;
  if (tipo === 'entrega') {
    const rua = document.getElementById('rua').value.trim();
    const num = document.getElementById('numero').value.trim();
    const bairro = document.getElementById('bairro').value.trim();
    const cidade = document.getElementById('cidade-uf').value.trim();
    textoPedido += `📍 Endereço: ${rua}, ${num} - ${bairro} / ${cidade}%0A`;
    textoPedido += `💸 Taxa entrega: R$ ${taxa.toFixed(2).replace('.',',')}%0A`;
  }
  textoPedido += `💳 Pagamento: ${pagamento}%0A`;
  if (obs) textoPedido += `📝 Obs: ${obs}%0A---%0A`;
  textoPedido += `*ITENS:*%0A`;
  carrinho.forEach(i => {
    textoPedido += `• ${i.quantidade}x ${i.nome} | R$ ${(i.preco*i.quantidade).toFixed(2).replace('.',',')}%0A`;
  });
  textoPedido += `---%0A*TOTAL: R$ ${total.toFixed(2).replace('.',',')}*`;

  window.open(`https://wa.me/${CONFIG.numeroWhatsApp}?text=${textoPedido}`, '_blank');
});

document.getElementById('btn-entendi').addEventListener('click', () => {
  document.getElementById('alerta-fechado').classList.add('oculto');
});

// Busca CEP simples
document.getElementById('cep').addEventListener('blur', async function() {
  const cep = this.value.replace(/\D/g,'');
  if (cep.length !== 8) return;
  try {
    const r = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    const d = await r.json();
    if (!d.erro) {
      document.getElementById('rua').value = d.logradouro || '';
      document.getElementById('bairro').value = d.bairro || '';
      document.getElementById('cidade-uf').value = `${d.localidade}/${d.uf}`;
    }
  } catch(e){}
});

// Categoria sticky animação
window.addEventListener('scroll', () => {
  const cat = document.querySelector('.categorias');
  if (!cat) return;
  cat.classList.toggle('sticky-visivel', window.scrollY > 10);
});

// Iniciar
carregarProdutos();
