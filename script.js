  listaItensCarrinho.innerHTML = '';
  let totalItens = 0;
  let totalGeral = 0;
  const tipoAtend = tipoAtendimentoEl?.value || 'retirada';
  const taxa = tipoAtend === 'entrega' ? CONFIG.taxaEntregaFixa : 0;

  carrinho.forEach((item, indice) => {
    totalItens += item.preco * item.quantidade;

    const itemEl = document.createElement('div');
    itemEl.className = 'item-carrinho';
    itemEl.innerHTML = `
      <div class="item-info">
        <div class="item-nome">${item.quantidade}x ${item.nome}</div>
        ${item.observacao && item.observacao !== "Sem observação" 
          ? `<div class="observacao-item">Obs: ${item.observacao}</div>` 
          : ''}
        <div class="item-preco-unit">R$ ${item.preco.toFixed(2).replace('.', ',')} cada</div>
      </div>
      <div class="item-controle">
        <div class="qtd-controle">
          <button class="qtd-btn diminuir" data-indice="${indice}">&minus;</button>
          <span class="qtd-valor">${item.quantidade}</span>
          <button class="qtd-btn aumentar" data-indice="${indice}">+</button>
        </div>
        <div class="item-total">R$ ${(item.preco * item.quantidade).toFixed(2).replace('.', ',')}</div>
      </div>
    `;
    listaItensCarrinho.appendChild(itemEl);
  });

  totalGeral = totalItens + taxa;

  subtotaisEl.textContent = totalItens.toFixed(2).replace('.', ',');
  valorTotalEl.textContent = totalGeral.toFixed(2).replace('.', ',');
  resumoValorEl.textContent = `R$ ${totalGeral.toFixed(2).replace('.', ',')}`;
  badgeQtdEl.textContent = carrinho.reduce((soma, i) => soma + i.quantidade, 0);

  carrinhoContainer.style.display = carrinho.length > 0 ? 'block' : 'none';
}

// Eventos de alterar quantidade no carrinho
listaItensCarrinho?.addEventListener('click', (e) => {
  const btn = e.target.closest('.qtd-btn');
  if (!btn) return;
  const indice = parseInt(btn.dataset.indice);

  if (btn.classList.contains('diminuir')) {
    if (carrinho[indice].quantidade > 1) {
      carrinho[indice].quantidade--;
    } else {
      carrinho.splice(indice, 1);
    }
  } else {
    carrinho[indice].quantidade++;
  }
  atualizarCarrinho();
});

// Abrir e fechar carrinho
abrirCarrinhoBtn?.addEventListener('click', () => {
  if (!verificarStatusLoja(true)) return;
  modalCarrinho.classList.remove('oculto');
  document.body.style.overflow = 'hidden';
});

fecharModalBtns.forEach(btn => {
  btn?.addEventListener('click', () => {
    modalCarrinho.classList.add('oculto');
    document.body.style.overflow = 'auto';
  });
});

// Busca de produtos
campoBusca?.addEventListener('input', () => {
  const termo = campoBusca.value.toLowerCase().trim();
  document.querySelectorAll('.produto').forEach(prod => {
    const nome = prod.dataset.nome.toLowerCase();
    const desc = prod.dataset.descricao.toLowerCase();
    prod.style.display = nome.includes(termo) || desc.includes(termo) ? 'flex' : 'none';
  });
});

// Filtro por categorias
document.querySelectorAll('.categoria-btn').forEach(botao => {
  botao.addEventListener('click', () => {
    document.querySelectorAll('.categoria-btn').forEach(b => b.classList.remove('ativo'));
    botao.classList.add('ativo');

    const catEscolhida = botao.dataset.categoria;
    document.querySelectorAll('.produto').forEach(prod => {
      prod.style.display = catEscolhida === 'todos' || prod.dataset.categoria === catEscolhida ? 'flex' : 'none';
    });
  });
});

// Enviar pedido para WhatsApp
document.getElementById('btn-finalizar')?.addEventListener('click', () => {
  if (carrinho.length === 0) {
    avisoGeral.textContent = 'Adicione pelo menos 1 produto ao carrinho!';
    avisoGeral.classList.remove('oculto');
    return;
  }
  if (!nomeEl.value.trim()) {
    avisoGeral.textContent = 'Preencha seu nome completo!';
    avisoGeral.classList.remove('oculto');
    nomeEl.focus();
    return;
  }

  const numeroPedido = Math.floor(Math.random() * 9000) + 1000;
  const tipoAtend = tipoAtendimentoEl.value;
  const taxa = tipoAtend === 'entrega' ? CONFIG.taxaEntregaFixa : 0;
  const totalItens = carrinho.reduce((s, i) => s + (i.preco * i.quantidade), 0);
  const totalGeral = totalItens + taxa;

  let mensagem = `🍔 *NOVO PEDIDO - ${CONFIG.nomeLoja}* 🍔\n`;
  mensagem += `📝 *Pedido Nº:* ${numeroPedido}\n`;
  mensagem += `👤 *Cliente:* ${nomeEl.value.trim()}\n`;
  mensagem += `🚚 *Tipo:* ${tipoAtend === 'retirada' ? 'RETIRADA NA LOJA' : 'ENTREGA'}\n`;

  if (tipoAtend === 'entrega') {
    mensagem += `📍 *Endereço:* ${ruaEl.value || ''}, Nº ${numeroEl.value || ''}`;
    if (complementoEl.value.trim()) mensagem += ` - ${complementoEl.value.trim()}`;
    mensagem += `\nBairro: ${bairroEl.value || ''} | ${cidadeUfEl.value || ''} | CEP: ${cepEl.value || ''}`;
    if (referenciaEl.value.trim()) mensagem += `\n🔎 *Referência:* ${referenciaEl.value.trim()}`;
  }

  mensagem += `\n🛒 *ITENS DO PEDIDO:*\n`;
  carrinho.forEach(item => {
    mensagem += `• ${item.quantidade}x ${item.nome}`;
    if(item.observacao && item.observacao !== "Sem observação"){
      mensagem += `\n  📝 Obs: ${item.observacao}`;
    }
    mensagem += ` - R$ ${(item.preco * item.quantidade).toFixed(2).replace('.', ',')}\n`;
  });

  mensagem += `\n💸 *RESUMO:*\n`;
  mensagem += `Subtotal: R$ ${totalItens.toFixed(2).replace('.', ',')}\n`;
  if (tipoAtend === 'entrega') mensagem += `Taxa de entrega: R$ ${taxa.toFixed(2).replace('.', ',')}\n`;
  mensagem += `*TOTAL: R$ ${totalGeral.toFixed(2).replace('.', ',')}*\n`;
  mensagem += `💳 *Pagamento:* ${pagamentoEl.value}\n`;
  if (observacaoGeralEl.value.trim()) mensagem += `📝 *Obs Geral:* ${observacaoGeralEl.value.trim()}\n`;

  mensagem += `\n✅ *Enviado pelo cardápio online*`;

  const linkWhats = `https://wa.me/${CONFIG.numeroWhatsApp}?text=${encodeURIComponent(mensagem)}`;
  window.open(linkWhats, '_blank');
  
  modalCarrinho.classList.add('oculto');
  document.body.style.overflow = 'auto';
});

// Inicialização final
atualizarCarrinho();
verificarStatusLoja();
