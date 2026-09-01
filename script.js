const CONFIG = {
  horaAbertura: 7,
  horaFechamento: 23,
  textoStatusAberto: "ABERTO",
  textoStatusFechado: "FECHADO",
  corStatusAberto: "#22c55e",
  corStatusFechado: "#dc2626",
  numeroWhatsApp: "5517981364681",
  nomeLoja: "Alison Burger",
  taxaEntregaFixa: 5.00
};

const carrinho = [];
let produtoAtual = null;
let quantidadeAtual = 1;
let adicionaisSelecionados = [];
let observacaoProdutoAtual = "";

// Elementos
const abrirCarrinhoBtn = document.getElementById('abrir-carrinho');
const modalCarrinho = document.getElementById('modal-carrinho');
const listaItensCarrinho = document.getElementById('lista-itens-carrinho');
const alertaFechado = document.getElementById('alerta-fechado');
const btnEntendi = document.getElementById('btn-entendi');
const campoBusca = document.getElementById('campoBusca');
const resumoValorEl = document.getElementById('resumo-valor');
const badgeQtdEl = document.getElementById('badge-qtd');
const blocoAdicionaisEl = document.getElementById('bloco-adicionais');
const observacaoItemEl = document.getElementById('observacao-item');
const subtotaisEl = document.getElementById('subtotal-itens');
const valorTotalEl = document.getElementById('valor-total');
const avisoGeral = document.getElementById('aviso-geral');
const tipoAtendimentoEl = document.getElementById('tipo-atendimento');
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
const pontoCab = document.getElementById('cab-ponto-status');
const textoCab = document.getElementById('cab-texto-status');
const btnAdicionarMais = document.getElementById('btn-adicionar-mais');

// ========== NAVEGAÇÃO — NÃO SAI DO SITE ==========
window.addEventListener('load', () => {
  history.pushState({fixo:true}, '');
  history.pushState({fixo:true}, '');
});
window.addEventListener('popstate', (e) => {
  e.preventDefault();
  if (!modalProduto.classList.contains('oculto')) { modalProduto.classList.add('oculto'); document.body.style.overflow='auto'; history.pushState({fixo:true},''); return; }
  if (!modalCarrinho.classList.contains('oculto')) { modalCarrinho.classList.add('oculto'); document.body.style.overflow='auto'; history.pushState({fixo:true},''); return; }
  history.pushState({fixo:true},'');
});

// ========== STATUS DA LOJA ==========
function verificarStatusLoja(mostrarAviso=false){
  const hora = new Date().getHours();
  const aberta = hora >= CONFIG.horaAbertura && hora < CONFIG.horaFechamento;
  pontoCab.style.backgroundColor = aberta ? CONFIG.corStatusAberto : CONFIG.corStatusFechado;
  textoCab.textContent = aberta ? CONFIG.textoStatusAberto : CONFIG.textoStatusFechado;
  if(!aberta && mostrarAviso) alertaFechado.classList.remove('oculto');
  return aberta;
}
verificarStatusLoja();
setInterval(verificarStatusLoja, 60000);
btnEntendi?.addEventListener('click', ()=>alertaFechado.classList.add('oculto'));

// ========== ABRIR PRODUTO ==========
document.querySelectorAll('.produto').forEach(prod => {
  prod.addEventListener('click', ()=>{
    if(!verificarStatusLoja(true)) return;
    const temAdd = (prod.dataset.temAdicionais||'sim')==='sim';
    produtoAtual = {
      nome: prod.dataset.nome, preco: parseFloat(prod.dataset.preco),
      descricao: prod.dataset.descricao||'', imagem: prod.dataset.imagem||'',
      adicionais: temAdd ? [
        {nome:'Bacon Extra',preco:2.90},{nome:'Queijo Extra',preco:2.50},
        {nome:'Ovo',preco:1.50},{nome:'Catupiry',preco:2.00}
      ] : []
    };
    quantidadeAtual=1; adicionaisSelecionados=[]; observacaoProdutoAtual='';
    qtdAtualEl.textContent='1'; observacaoItemEl.value='';
    imgDetalhe.src=produtoAtual.imagem; nomeDetalhe.textContent=produtoAtual.nome; descricaoDetalhe.textContent=produtoAtual.descricao;
    precoOriginalEl.textContent=`R$ ${(produtoAtual.preco*1.2).toFixed(2).replace('.',',')}`;
    precoPromocionalEl.textContent=`R$ ${produtoAtual.preco.toFixed(2).replace('.',',')}`;
    blocoAdicionaisEl.classList.toggle('oculto',!temAdd);
    listaAdicionaisEl.innerHTML='';
    produtoAtual.adicionais.forEach((add,i)=>{
      const el=document.createElement('div'); el.className='adicional-item';
      el.innerHTML=`<span>${add.nome} <small>+ R$ ${add.preco.toFixed(2).replace('.',',')}</small></span><button class="btn-add-adicional" data-idx="${i}">+</button>`;
      listaAdicionaisEl.appendChild(el);
    });
    atualizarTotalDetalhe();
    modalProduto.classList.remove('oculto'); document.body.style.overflow='hidden';
    history.pushState({fixo:true},'');
  });
});
btnVoltarLista?.addEventListener('click', ()=>{ modalProduto.classList.add('oculto'); document.body.style.overflow='auto'; });

// ========== QUANTIDADE NO DETALHE ==========
diminuirQtdBtn?.addEventListener('click',()=>{ if(quantidadeAtual>1) quantidadeAtual--; qtdAtualEl.textContent=quantidadeAtual; atualizarTotalDetalhe(); });
aumentarQtdBtn?.addEventListener('click',()=>{ quantidadeAtual++; qtdAtualEl.textContent=quantidadeAtual; atualizarTotalDetalhe(); });

// ========== ADICIONAIS ==========
listaAdicionaisEl?.addEventListener('click',(e)=>{
  const btn=e.target.closest('.btn-add-adicional'); if(!btn) return;
  const idx=+btn.dataset.idx; const add=produtoAtual.adicionais[idx];
  const existe = adicionaisSelecionados.findIndex(a=>a.nome===add.nome);
  if(existe===-1){ adicionaisSelecionados.push(add); btn.textContent='✓'; btn.classList.add('selecionado'); }
  else { adicionaisSelecionados.splice(existe,1); btn.textContent='+'; btn.classList.remove('selecionado'); }
  atualizarTotalDetalhe();
});

function atualizarTotalDetalhe(){
  const somaAdd = adicionaisSelecionados.reduce((s,a)=>s+a.preco,0);
  const total = (produtoAtual.preco + somaAdd) * quantidadeAtual;
  btnAdicionarDetalhe.textContent = `Adicionar • R$ ${total.toFixed(2).replace('.',',')}`;
}

// ========== ADICIONAR AO CARRINHO — SEM FECHAR ==========
btnAdicionarDetalhe?.addEventListener('click',()=>{
  if(!verificarStatusLoja(true)) return;
  observacaoProdutoAtual = observacaoItemEl.value.trim();
  const nomeFinal = adicionaisSelecionados.length 
    ? `${produtoAtual.nome} (${adicionaisSelecionados.map(a=>a.nome).join(', ')})` 
    : produtoAtual.nome;
  const precoFinal = produtoAtual.preco + adicionaisSelecionados.reduce((s,a)=>s+a.preco,0);
  carrinho.push({nome:nomeFinal, preco:precoFinal, quantidade:quantidadeAtual, observacao:observacaoProdutoAtual, imagem:produtoAtual.imagem});
  
  atualizarCarrinho();

  // Aviso rápido
  const aviso = document.createElement('div');
  aviso.style.cssText='position:fixed;top:15px;left:50%;transform:translateX(-50%);background:#22c55e;color:#fff;padding:10px 20px;border-radius:8px;font-weight:600;z-index:99999;';
  aviso.textContent='✅ Adicionado!'; document.body.appendChild(aviso); setTimeout(()=>aviso.remove(),1500);

  // RESET TOTAL — CONTINUA ABERTO
  quantidadeAtual=1; adicionaisSelecionados=[]; observacaoProdutoAtual='';
  qtdAtualEl.textContent='1'; observacaoItemEl.value='';
  document.querySelectorAll('.btn-add-adicional').forEach(b=>{b.textContent='+';b.classList.remove('selecionado');});
  atualizarTotalDetalhe();
});

// ========== ATUALIZA CARRINHO ==========
function atualizarCarrinho(){
  listaItensCarrinho.innerHTML='';
  let subtotal=0, qtdTotal=0;
  const usaTaxa = tipoAtendimentoEl.value==='entrega';
  const taxa = usaTaxa ? CONFIG.taxaEntregaFixa : 0;

  if(carrinho.length===0){
    subtotaisEl.textContent='R$ 0,00'; valorTotalEl.textContent='R$ 0,00'; resumoValorEl.textContent='R$ 0,00'; badgeQtdEl.textContent='0';
    document.querySelector('.barra-inferior').style.opacity='.5'; return;
  }
  document.querySelector('.barra-inferior').style.opacity='1';

  carrinho.forEach((item,i)=>{
    subtotal += item.preco * item.quantidade; qtdTotal += item.quantidade;
    const el = document.createElement('div'); el.className='item-carrinho';
    el.innerHTML = `
      <img src="${item.imagem||'https://via.placeholder.com/60'}" alt="">
      <div class="item-info">
        <h4 class="item-nome">${item.nome}</h4>
        ${item.observacao?`<p class="item-obs">Obs: ${item.observacao}</p>`:''}
        <p class="item-preco-unit">R$ ${item.preco.toFixed(2).replace('.',',')} cada</p>
      </div>
      <div class="qtd-controle">
        <button class="qtd-btn dim" data-i="${i}">&minus;</button>
        <span class="qtd-valor">${item.quantidade}</span>
        <button class="qtd-btn aum" data-i="${i}">+</button>
      </div>
      <div class="item-total">R$ ${(item.preco*item.quantidade).toFixed(2).replace('.',',')}</div>
    `;
    listaItensCarrinho.appendChild(el);
  });

  const totalGeral = subtotal + taxa;
  subtotaisEl.textContent = `R$ ${subtotal.toFixed(2).replace('.',',')}`;
  valorTotalEl.textContent = `R$ ${totalGeral.toFixed(2).replace('.',',')}`;
  resumoValorEl.textContent = `R$ ${subtotal.toFixed(2).replace('.',',')}`;
  badgeQtdEl.textContent = qtdTotal;
  document.getElementById('taxa-resumo').textContent = `R$ ${taxa.toFixed(2).replace('.',',')}`;

  // Ações dos botões
  document.querySelectorAll('.dim').forEach(b=>b.onclick=()=>{ const i=+b.dataset.i; if(carrinho[i].quantidade>1) carrinho[i].quantidade--; else carrinho.splice(i,1); atualizarCarrinho(); });
  document.querySelectorAll('.aum').forEach(b=>b.onclick=()=>{ const i=+b.dataset.i; carrinho[i].quantidade++; atualizarCarrinho(); });
}

// ========== ABRIR/FECHAR CARRINHO ==========
abrirCarrinhoBtn?.addEventListener('click',()=>{
  if(carrinho.length===0){ avisoGeral.textContent='Adicione pelo menos um produto!'; avisoGeral.classList.remove('oculto'); return; }
  if(!verificarStatusLoja(true)) return;
  atualizarCarrinho(); modalCarrinho.classList.remove('oculto'); document.body.style.overflow='hidden';
  history.pushState({fixo:true},'');
});
document.querySelector('.fechar-modal')?.addEventListener('click',()=>{ modalCarrinho.classList.add('oculto'); document.body.style.overflow='auto'; });
btnAdicionarMais?.addEventListener('click',()=>{ modalCarrinho.classList.add('oculto'); document.body.style.overflow='auto'; });

// ========== TIPO DE ATENDIMENTO ==========
document.querySelectorAll('.btn-tipo').forEach(b=>{
  b.addEventListener('click',()=>{
    document.querySelectorAll('.btn-tipo').forEach(bt=>bt.classList.remove('ativo'));
    b.classList.add('ativo'); tipoAtendimentoEl.value = b.dataset.tipo;
    document.getElementById('bloco-endereco').classList.toggle('oculto', b.dataset.tipo!=='entrega');
    atualizarCarrinho();
  });
});

// ========== BUSCA E CATEGORIAS ==========
document.querySelectorAll('.categoria-btn').forEach(b=>{
  b.addEventListener('click',()=>{
    document.querySelectorAll('.categoria-btn').forEach(bt=>bt.classList.remove('ativo')); b.classList.add('ativo');
    const cat = b.dataset.categoria;
    document.querySelectorAll('.produto').forEach(p=>p.style.display = (cat==='todos'||p.dataset.categoria===cat)?'flex':'none');
    campoBusca.value='';
  });
});
campoBusca?.addEventListener('input',()=>{
  const t = campoBusca.value.toLowerCase();
  document.querySelectorAll('.produto').forEach(p=>p.style.display = p.dataset.nome.toLowerCase().includes(t)?'flex':'none');
});

// ========== FINALIZAR PEDIDO — WHATSAPP ==========
document.querySelector('.btn-finalizar')?.addEventListener('click',()=>{
  avisoGeral.classList.add('oculto');
  if(carrinho.length===0){ avisoGeral.textContent='Adicione itens ao carrinho!'; avisoGeral.classList.remove('oculto'); return; }

  const subtotal = carrinho.reduce((s,i)=>s+(i.preco*i.quantidade),0);
  const taxa = tipoAtendimentoEl.value==='entrega' ? CONFIG.taxaEntregaFixa : 0;
  const total = subtotal + taxa;
  const nPedido = Math.floor(Math.random()*9000)+1000;
  const data = new Date().toLocaleString('pt-BR',{timeZone:'America/Sao_Paulo'});

  let msg = `═══════════════════════════════════
        🍔 ALISON BURGER 🍔
═══════════════════════════════════
PEDIDO Nº: ${nPedido}
DATA/HORA: ${data}
───────────────────────────────────
CLIENTE: Guilherme Zanini
TEL: (17) 98136-4681
${tipoAtendimentoEl.value==='entrega'?`
ENTREGA EM:
Rua José Carvalho de Oliveira, 123
Parque Residencial Celina Dalul
Mirassol/SP`:'RETIRADA NA LOJA'}
───────────────────────────────────
ITEM                QTD   VALOR
───────────────────────────────────
`;
  carrinho.forEach(i=>{
    msg += `${i.nome.padEnd(20)} ${String(i.quantidade).padStart(2)}  R$ ${(i.preco*i.quantidade).toFixed(2).replace('.',',')}\n`;
    if(i.observacao) msg += `  ⚠️ Obs: ${i.observacao}\n`;
  });
  msg += `───────────────────────────────────
SUBTOTAL ............ R$ ${subtotal.toFixed(2).replace('.',',')}
TAXA DE ENTREGA ..... R$ ${taxa.toFixed(2).replace('.',',')}
DESCONTO ............ - R$ 4,68
───────────────────────────────────
TOTAL .............. R$ 47,12
═══════════════════════════════════
PAGAMENTO: Cartão de crédito (na entrega)
═══════════════════════════════════
   Obrigado! Agradecemos a preferência 🤝
`;
  window.open(`https://wa.me/${CONFIG.numeroWhatsApp}?text=${encodeURIComponent(msg)}`,'_blank');
  // Limpa tudo
  carrinho.length=0; atualizarCarrinho(); modalCarrinho.classList.add('oculto'); document.body.style.overflow='auto';
});
