const CONFIG = {
  horaAbertura: 7,
  horaFechamento: 23,
  textoAberto: "Aberto até às 23:00",
  textoFechado: "Fechado • Abre às 07:00",
  numeroWhatsApp: "5519989021323",
  nomeLoja: "Alison Burger",
  taxaEntregaPadrao: 8.00
};

// PRODUTOS DIRETO AQUI, SEM JSON SEPARADO
let produtos = [
  {"id":"01","nome":"Hambúrguer Simples","categoria":"hamburgueres","preco":10.00,"descricao":"Pão, carne, queijo, alface e tomate fresquinhos","tempo":"20-30min","imagem":"https://picsum.photos/id/1060/150/150","destaque":true},
  {"id":"02","nome":"Hambúrguer Duplo","categoria":"hamburgueres","preco":12.00,"descricao":"Duas carnes suculentas, queijo derretido e molho especial","tempo":"20-30min","imagem":"https://picsum.photos/id/1074/150/150","destaque":true},
  {"id":"03","nome":"Hambúrguer Picante","categoria":"hamburgueres","preco":15.00,"descricao":"Carne especial com molho apimentado caseiro","tempo":"20-30min","imagem":"https://picsum.photos/id/1076/150/150","destaque":true},
  {"id":"04","nome":"Batata Frita Tradicional","categoria":"acompanhamentos","preco":12.00,"descricao":"Porção crocante e bem temperada","tempo":"20-30min","imagem":"https://picsum.photos/id/180/150/150","destaque":true},
  {"id":"05","nome":"Anéis de Cebola","categoria":"acompanhamentos","preco":14.00,"descricao":"Empanados crocantes com molho especial","tempo":"20-30min","imagem":"https://picsum.photos/id/292/150/150","destaque":true},
  {"id":"06","nome":"Batata Cheddar e Bacon","categoria":"acompanhamentos","preco":18.00,"descricao":"Batata com molho cheddar cremoso e bacon picado","tempo":"20-30min","imagem":"https://picsum.photos/id/431/150/150","destaque":true},
  {"id":"07","nome":"Coca 350ml Zero","categoria":"bebidas","preco":6.00,"descricao":"Lata gelada sem açúcar","tempo":"Imediato","imagem":"https://picsum.photos/id/433/150/150","destaque":true},
  {"id":"08","nome":"Guaraná 350ml","categoria":"bebidas","preco":6.00,"descricao":"Lata gelada tradicional","tempo":"Imediato","imagem":"https://picsum.photos/id/429/150/150","destaque":true},
  {"id":"09","nome":"Suco Laranja 500ml","categoria":"bebidas","preco":9.00,"descricao":"100% natural espremido na hora","tempo":"Imediato","imagem":"https://picsum.photos/id/416/150/150","destaque":true},
  {"id":"10","nome":"Coca-Cola 2L Normal","categoria":"bebidas","preco":12.00,"descricao":"Garrafa grande bem gelada para a família","tempo":"Imediato","imagem":"https://picsum.photos/id/434/150/150","destaque":true},
  {"id":"11","nome":"Coca-Cola 2L Zero","categoria":"bebidas","preco":12.00,"descricao":"Garrafa grande zero açúcar gelada","tempo":"Imediato","imagem":"https://picsum.photos/id/435/150/150","destaque":true}
];

let carrinho = [], qtdAtual = 1, produtoAtual = null;

function atualizarStatus(aberto) {
  const corA = aberto ? "#22c55e" : "#dc2626", txt = aberto ? CONFIG.textoAberto : CONFIG.textoFechado;
  document.getElementById('ponto-status').style.background = corA;
  document.getElementById('texto-status').textContent = txt;
  const pm = document.getElementById('ponto-status-modal');
  if(pm) { pm.style.background = corA; document.getElementById('texto-status-modal').textContent = txt; }
}
function verificarStatusLoja() {
  const ok = new Date().getHours() >= CONFIG.horaAbertura && new Date().getHours() < CONFIG.horaFechamento;
  atualizarStatus(ok); return ok;
}
verificarStatusLoja(); setInterval(verificarStatusLoja, 60000);

function renderizarProdutos() {
  document.getElementById('lista-produtos').innerHTML = produtos.map(p=>`
    <div class="produto" data-categoria="${p.categoria}" data-id="${p.id}" onclick="abrirProduto('${p.id}')">
      <div class="produto-imagem">${p.destaque?'<span class="tag-mais-pedido">MAIS</span>':''}<img src="${p.imagem}" alt="${p.nome}"></div>
      <div class="produto-info"><div class="produto-codigo">${p.id}</div><h3 class="produto-nome">${p.nome}</h3><p class="produto-descricao">${p.descricao}</p><div class="produto-detalhes"><span><i class="fa fa-clock-o"></i> ${p.tempo}</span></div></div>
      <div class="produto-preco">R$ ${p.preco.toFixed(2).replace('.',',')}</div>
    </div>
  `).join('');
}
renderizarProdutos();

document.querySelectorAll('.categoria-btn').forEach(b=>b.addEventListener('click',()=>{
  document.querySelectorAll('.categoria-btn').forEach(x=>x.classList.remove('ativo')); b.classList.add('ativo');
  document.querySelectorAll('.produto').forEach(p=>p.classList.toggle('oculto', b.dataset.categoria!=='todos' && p.dataset.categoria!==b.dataset.categoria));
}));
document.getElementById('campoBusca').addEventListener('input',e=>{
  const t = e.target.value.trim().toLowerCase();
  document.querySelectorAll('.produto').forEach(p=>p.classList.toggle('oculto', !p.textContent.toLowerCase().includes(t)));
});

window.abrirProduto = function(id) {
  produtoAtual = produtos.find(p=>p.id===id); if(!produtoAtual) return; qtdAtual=1;
  document.getElementById('img-detalhe').src=produtoAtual.imagem;
  document.getElementById('nome-detalhe').textContent=produtoAtual.nome;
  document.getElementById('descricao-detalhe').textContent=produtoAtual.descricao;
  document.getElementById('preco-promocional').textContent=`R$ ${produtoAtual.preco.toFixed(2).replace('.',',')}`;
  document.getElementById('qtd-atual').textContent='1';
  document.getElementById('modal-produto').classList.remove('oculto'); window.scrollTo(0,0);
};
document.getElementById('btn-voltar').addEventListener('click',()=>document.getElementById('modal-produto').classList.add('oculto'));
document.getElementById('diminuir-qtd').addEventListener('click',()=>{if(qtdAtual>1) qtdAtual--; document.getElementById('qtd-atual').textContent=qtdAtual;});
document.getElementById('aumentar-qtd').addEventListener('click',()=>{qtdAtual++; document.getElementById('qtd-atual').textContent=qtdAtual;});
document.getElementById('btn-adicionar-detalhe').addEventListener('click',()=>{
  if(!verificarStatusLoja()) { document.getElementById('alerta-fechado').classList.remove('oculto'); return; }
  carrinho.push({...produtoAtual, quantidade:qtdAtual}); atualizarCarrinhoVisivel(); document.getElementById('modal-produto').classList.add('oculto');
});

function atualizarCarrinhoVisivel() {
  const totalItens = carrinho.reduce((s,i)=>s+i.quantidade,0), total = carrinho.reduce((s,i)=>s+i.preco*i.quantidade,0);
  document.getElementById('qtd-carrinho').textContent=totalItens;
  document.getElementById('resumo-carrinho').textContent=`${totalItens} itens • R$ ${total.toFixed(2).replace('.',',')}`;
  document.getElementById('carrinho-container').style.display = carrinho.length?'flex':'none';
}
document.getElementById('abrir-carrinho').addEventListener('click',()=>{if(!carrinho.length)return; renderizarCarrinho(); document.getElementById('modal-carrinho').classList.remove('oculto');});
document.getElementById('fechar-modal').addEventListener('click',()=>document.getElementById('modal-carrinho').classList.add('oculto'));
document.getElementById('btn-limpar').addEventListener('click',()=>{carrinho=[]; atualizarCarrinhoVisivel(); document.getElementById('modal-carrinho').classList.add('oculto');});

function renderizarCarrinho() {
  document.getElementById('lista-itens-carrinho').innerHTML = carrinho.map(i=>`<div class="item-carrinho"><div><strong>${i.quantidade}x</strong> ${i.nome}</div><div>R$ ${(i.preco*i.quantidade).toFixed(2).replace('.',',')}</div></div>`).join('');
  document.getElementById('valor-total').textContent = carrinho.reduce((s,i)=>s+i.preco*i.quantidade,0).toFixed(2).replace('.',',');
}

document.getElementById('tipo-atendimento').addEventListener('change',e=>{
  const entrega = e.target.value === 'entrega';
  document.getElementById('campo-taxa-entrega').classList.toggle('oculto',!entrega);
  document.getElementById('bloco-endereco').classList.toggle('oculto',!entrega);
});
document.getElementById('btn-finalizar').addEventListener('click',()=>{
  if(!verificarStatusLoja()){document.getElementById('modal-carrinho').classList.add('oculto');document.getElementById('alerta-fechado').classList.remove('oculto');return;}
  if(!carrinho.length){document.getElementById('aviso-geral').textContent='Carrinho vazio!';document.getElementById('aviso-geral').classList.remove('oculto');return;}
  const nome = document.getElementById('nome-cliente').value.trim(); if(!nome){document.getElementById('aviso-geral').textContent='Informe seu nome!';document.getElementById('aviso-geral').classList.remove('oculto');return;}
  document.getElementById('aviso-geral').classList.add('oculto');
  const tipo = document.getElementById('tipo-atendimento').value, pgto = document.getElementById('forma-pagamento').value, obs = document.getElementById('observacao').value.trim();
  const taxa = tipo==='entrega'?CONFIG.taxaEntregaPadrao:0, total = carrinho.reduce((s,i)=>s+i.preco*i.quantidade,0)+taxa;
  let txt = `🍔 *${CONFIG.nomeLoja}*%0A📅 ${new Date().toLocaleString('pt-BR')}%0A👤 Nome: ${nome}%0A📦 Tipo: ${tipo}%0A`;
  if(tipo==='entrega') txt += `📍 Endereço: ${document.getElementById('rua').value.trim()}, ${document.getElementById('numero').value.trim()} - ${document.getElementById('bairro').value.trim()}/${document.getElementById('cidade-uf').value.trim()}%0A💸 Taxa entrega: R$ ${taxa.toFixed(2).replace('.',',')}%0A`;
  txt += `💳 Pagamento: ${pgto}%0A${obs?`📝 Obs: ${obs}%0A`:''}---%0A*ITENS:*%0A${carrinho.map(i=>`• ${i.quantidade}x ${i.nome} | R$ ${(i.preco*i.quantidade).toFixed(2).replace('.',',')}%0A`).join('')}---%0A*TOTAL: R$ ${total.toFixed(2).replace('.',',')}*`;
  window.open(`https://wa.me/${CONFIG.numeroWhatsApp}?text=${txt}`,'_blank');
});
document.getElementById('btn-entendi').addEventListener('click',()=>document.getElementById('alerta-fechado').classList.add('oculto'));
document.getElementById('cep').addEventListener('blur',async function(){
  const cep = this.value.replace(/\D/g,''); if(cep.length!==8)return;
  try{const d=await fetch(`https://viacep.com.br/ws/${cep}/json/`).then(r=>r.json()); if(!d.erro){document.getElementById('rua').value=d.logradouro||'';document.getElementById('bairro').value=d.bairro||'';document.getElementById('cidade-uf').value=`${d.localidade}/${d.uf}`;}}catch(e){}
});
