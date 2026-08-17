const CONFIG = {
  horaAbertura: 0,
  horaFechamento: 24,
  textoStatusAberto: "Aberto até às 24h",
  textoStatusFechado: "Fechado • Abre às 07h",
  corStatusAberto: "#2E7D32",
  corStatusFechado: "#C83232",
  numeroWhatsApp: "5519989021323",
  nomeLoja: "Alison Burger",
  taxaEntregaFixa: 8.00
};

let carrinho = [];
const abrirCarrinhoBtn = document.getElementById('abrir-carrinho');
const modalCarrinho = document.getElementById('modal-carrinho');
const fecharModalBtn = document.getElementById('fechar-modal');
const listaItensCarrinho = document.getElementById('lista-itens-carrinho');
const alertaFechado = document.getElementById('alerta-fechado');
const btnEntendi = document.getElementById('btn-entendi');
const campoBusca = document.getElementById('campoBusca');
const badgeQtdEl = document.getElementById('badge-qtd');
const subtotaisEl = document.getElementById('subtotal-itens');
const valorTotalEl = document.getElementById('valor-total');
const valorTaxaEl = document.getElementById('valor-taxa-fixa');
const nomeEl = document.getElementById('nome-cliente');
const avisoGeral = document.getElementById('aviso-geral');
const tipoAtendimentoEl = document.getElementById('tipo-atendimento');
const blocoEnderecoEl = document.getElementById('bloco-endereco');
const cepEl = document.getElementById('cep');
const numeroEl = document.getElementById('numero');
const complementoEl = document.getElementById('complemento');
const ruaEl = document.getElementById('rua');
const formaPagamentoEl = document.getElementById('forma-pagamento');
const observacaoEl = document.getElementById('observacao');
const btnLimpar = document.getElementById('btn-limpar');
const btnImprimir = document.getElementById('btn-imprimir-pedido');
const btnFinalizar = document.getElementById('btn-finalizar');
const areaCupom = document.getElementById('area-cupom-impressao');
const pontoCab = document.getElementById('cab-ponto-status');
const textoCab = document.getElementById('cab-texto-status');

// Status Loja
function verificarStatus() {
  const hora = new Date().getHours();
  const aberto = hora >= CONFIG.horaAbertura && hora < CONFIG.horaFechamento;
  if(pontoCab && textoCab){
    pontoCab.className = `ponto-status ${aberto ? 'aberto' : 'fechado'}`;
    textoCab.textContent = aberto ? CONFIG.textoStatusAberto : CONFIG.textoStatusFechado;
  }
  return aberto;
}
verificarStatus();
setInterval(verificarStatus, 60000);
btnEntendi?.addEventListener('click', () => alertaFechado.classList.add('oculto'));

// Adicionar ao carrinho direto do card
document.querySelectorAll('.btn-adicionar-produto').forEach((btn, idx) => {
  btn.addEventListener('click', () => {
    if(!verificarStatus(true)) return;
    const card = document.querySelectorAll('.produto-card')[idx];
    const nome = card.dataset.nome;
    const preco = parseFloat(card.dataset.preco);
    const existente = carrinho.find(i => i.nome === nome);
    if(existente) existente.quantidade++;
    else carrinho.push({ nome, preco, quantidade: 1 });
    atualizarCarrinho();
  });
});

// Categorias e Busca
document.querySelectorAll('.categoria').forEach(botao => {
  botao.addEventListener('click', () => {
    document.querySelectorAll('.categoria').forEach(b => b.classList.remove('ativa'));
    botao.classList.add('ativa');
    const cat = botao.dataset.categoria;
    document.querySelectorAll('.produto-card').forEach(p => {
      p.style.display = (cat === 'todos' || p.dataset.categoria === cat) ? 'flex' : 'none';
    });
    campoBusca.value = '';
  });
});
campoBusca?.addEventListener('input', () => {
  const termo = campoBusca.value.toLowerCase();
  document.querySelectorAll('.produto-card').forEach(p => {
    const nome = p.dataset.nome.toLowerCase();
    const desc = p.dataset.descricao.toLowerCase();
    p.style.display = nome.includes(termo) || desc.includes(termo) ? 'flex' : 'none';
  });
});

// Funções do Carrinho
function atualizarCarrinho() {
  listaItensCarrinho.innerHTML = '';
  let totalItens = 0; let qtdTotal = 0;
  const taxa = tipoAtendimentoEl.value === 'entrega' ? CONFIG.taxaEntregaFixa : 0;

  if(carrinho.length === 0) {
    badgeQtdEl.textContent = '0';
    subtotaisEl.textContent = '0,00';
    valorTotalEl.textContent = '0,00';
    return;
  }

  carrinho.forEach((item, idx) => {
    const totalItem = item.preco * item.quantidade;
    totalItens += totalItem; qtdTotal += item.quantidade;
    listaItensCarrinho.innerHTML += `
      <div style="display:flex; justify-content:space-between; align-items:center; padding:8px 0; border-bottom:1px solid #eee;">
        <div>
          <div style="font-weight:500;">${item.nome}</div>
          <div style="font-size:12px; color:#777;">R$ ${item.preco.toFixed(2).replace('.',',')} cada</div>
        </div>
        <div style="display:flex; align-items:center; gap:10px;">
          <button class="qtd-btn" data-idx="${idx}" style="width:28px;height:28px;border-radius:50%;border:none;background:#f5f5f5;cursor:pointer;">-</button>
          <span>${item.quantidade}</span>
          <button class="qtd-btn" data-idx="${idx}" style="width:28px;height:28px;border-radius:50%;border:none;background:#f5f5f5;cursor:pointer;">+</button>
          <span style="font-weight:600;">R$ ${totalItem.toFixed(2).replace('.',',')}</span>
        </div>
      </div>
    `;
  });

  badgeQtdEl.textContent = qtdTotal;
  subtotaisEl.textContent = totalItens.toFixed(2).replace('.',',');
  valorTaxaEl.textContent = taxa.toFixed(2).replace('.',',');
  valorTotalEl.textContent = (totalItens + taxa).toFixed(2).replace('.',',');

  document.querySelectorAll('.qtd-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const i = parseInt(btn.dataset.idx);
      if(btn.textContent === '-' && carrinho[i].quantidade > 1) carrinho[i].quantidade--;
      else if(btn.textContent === '+') carrinho[i].quantidade++;
      else if(btn.textContent === '-') carrinho.splice(i,1);
      atualizarCarrinho();
    });
  });
}

// Abrir/Fechar Carrinho
abrirCarrinhoBtn?.addEventListener('click', () => {
  if(carrinho.length === 0) { alert('Adicione um produto primeiro!'); return; }
  if(!verificarStatus(true)) return;
  atualizarCarrinho();
  modalCarrinho.classList.remove('oculto');
});
fecharModalBtn?.addEventListener('click', () => modalCarrinho.classList.add('oculto'));
tipoAtendimentoEl?.addEventListener('change', () => {
  blocoEnderecoEl.classList.toggle('oculto', tipoAtendimentoEl.value !== 'entrega');
  atualizarCarrinho();
});
btnLimpar?.addEventListener('click', () => {
  carrinho = [];
  nomeEl.value = ''; observacaoEl.value = '';
  modalCarrinho.classList.add('oculto');
  atualizarCarrinho();
});

// Imprimir e Enviar WhatsApp
function gerarCupom() {
  const num = Math.floor(Math.random()*9000)+1000;
  const data = new Date().toLocaleString('pt-BR');
  const totalItens = carrinho.reduce((s,i)=>s+(i.preco*i.quantidade),0);
  const taxa = tipoAtendimentoEl.value === 'entrega' ? CONFIG.taxaEntregaFixa : 0;
  const totalGeral = totalItens + taxa;
  let html = `<div class="area-impressao"><h3 style="text-align:center;">${CONFIG.nomeLoja}</h3><p style="text-align:center;">Pedido ${num} - ${data}</p><hr>`;
  carrinho.forEach(i => html += `<p>${i.quantidade}x ${i.nome} - R$ ${(i.preco*i.quantidade).toFixed(2).replace('.',',')}</p>`);
  html += `<hr><p>Subtotal: R$ ${totalItens.toFixed(2).replace('.',',')}</p>`;
  if(taxa>0) html += `<p>Taxa: R$ ${taxa.toFixed(2).replace('.',',')}</p>`;
  html += `<p><strong>TOTAL: R$ ${totalGeral.toFixed(2).replace('.',',')}</strong></p>`;
  html += `<p>Cliente: ${nomeEl.value} | Pagamento: ${formaPagamentoEl.value}</p>`;
  if(observacaoEl.value) html += `<p>Obs: ${observacaoEl.value}</p>`;
  html += `<p style="text-align:center;">Obrigado!</p></div>`;
  return html;
}
btnImprimir?.addEventListener('click', () => {
  if(carrinho.length ===0 || !nomeEl.value.trim()) { alert('Preencha os dados primeiro!'); return; }
  areaCupom.innerHTML = gerarCupom();
  areaCupom.classList.remove('oculto');
  setTimeout(() => { window.print(); areaCupom.classList.add('oculto'); }, 100);
});
btnFinalizar?.addEventListener('click', () => {
  avisoGeral.classList.add('oculto');
  if(carrinho.length ===0) { avisoGeral.textContent = 'Adicione um produto!'; avisoGeral.classList.remove('oculto'); return; }
  if(!nomeEl.value.trim()) { avisoGeral.textContent = 'Informe seu nome!'; avisoGeral.classList.remove('oculto'); return; }
  if(tipoAtendimentoEl.value === 'entrega' && cepEl.value.replace(/\D/g,'').length !==8) { avisoGeral.textContent = 'Informe um CEP válido!'; avisoGeral.classList.remove('oculto'); return; }

  const num = Math.floor(Math.random()*9000)+1000;
  const data = new Date().toLocaleString('pt-BR');
  const totalItens = carrinho.reduce((s,i)=>s+(i.preco*i.quantidade),0);
  const taxa = tipoAtendimentoEl.value === 'entrega' ? CONFIG.taxaEntregaFixa : 0;
  const totalGeral = totalItens + taxa;
  let mensagem = `🍔 *PEDIDO ${num} - ${CONFIG.nomeLoja}*\n📅 ${data}\n👤 Cliente: ${nomeEl.value}\n📦 Tipo: ${tipoAtendimentoEl.value === 'retirada' ? 'Retirada' : 'Entrega'}\n`;
  if(tipoAtendimentoEl.value === 'entrega') mensagem += `📍 Endereço: ${ruaEl.value}, Nº ${numeroEl.value} ${complementoEl.value}\nCEP: ${cepEl.value}\n`;
  mensagem += `\n🛒 *ITENS:*\n`;
  carrinho.forEach(i => mensagem += `• ${i.quantidade}x ${i.nome} = R$ ${(i.preco*i.quantidade).toFixed(2).replace('.',',')}\n`);
  mensagem += `\n💸 *RESUMO:*\nSubtotal: R$ ${totalItens.toFixed(2).replace('.',',')}\n`;
  if(taxa>0) mensagem += `Taxa entrega: R$ ${taxa.toFixed(2).replace('.',',')}\n`;
  mensagem += `*TOTAL: R$ ${totalGeral.toFixed(2).replace('.',',')}*\n💳 Pagamento: ${formaPagamentoEl.value}\n`;
  if(observacaoEl.value) mensagem += `📝 Obs: ${observacaoEl.value}`;

  window.open(`https://wa.me/${CONFIG.numeroWhatsApp}?text=${encodeURIComponent(mensagem)}`, '_blank');
  modalCarrinho.classList.add('oculto');
});
