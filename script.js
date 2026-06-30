// ==============================================
// ⚙️ CONFIGURAÇÕES — AJUSTE AQUI SE PRECISAR
// ==============================================
const CONFIG = {
  horaAbertura: 23,       // 23h = 23:00
  horaFechamento: 6,      // 6h = 06:00
  textoStatusAberto: "Aberto até às 06:00",
  textoStatusFechado: "Fechado",
  corStatusAberto: "#22c55e",
  corStatusFechado: "#dc2626",
  numeroWhatsApp: "5519989021323",
  nomeLoja: "ALISON BURGER",
  taxaEntregaPadrao: 6.00
};

// ==============================================
// 🛒 VARIÁVEIS ELEMENTOS (COM PROTEÇÃO CONTRA ERROS)
// ==============================================
document.addEventListener("DOMContentLoaded", () => {
  const carrinho = [];
  let metodoPagamentoSelecionado = 'pix';
  let pixTimerInterval = null;

  const abrirCarrinhoBtn = document.getElementById('abrir-carrinho');
  const modalCarrinho = document.getElementById('modal-carrinho');
  const fecharModalBtns = [document.getElementById('fechar-modal'), document.getElementById('btn-fechar')].filter(Boolean);
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

  // Campos de endereço
  const cepEl = document.getElementById('cep');
  const numeroEl = document.getElementById('numero');
  const complementoEl = document.getElementById('complemento');
  const referenciaEl = document.getElementById('referencia');
  const ruaEl = document.getElementById('rua');
  const bairroEl = document.getElementById('bairro');
  const cidadeUfEl = document.getElementById('cidade-uf');
  const avisoCepEl = document.getElementById('aviso-cep');

  const obsEl = document.getElementById('observacoes');

  // Novos Elementos do Checkout (Opcionais no HTML)
  const cardInstallmentsEl = document.getElementById('card-installments');
  const pixTimerEl = document.getElementById('pix-timer-count');

  // ==============================================
  // 🚀 CONTROLE ENTREGA / RETIRADA
  // ==============================================
  if (tipoAtendimentoEl) {
    tipoAtendimentoEl.addEventListener('change', () => {
      if (tipoAtendimentoEl.value === 'entrega') {
        if (campoTaxaEntregaEl) campoTaxaEntregaEl.classList.remove('oculto');
        if (blocoEnderecoEl) blocoEnderecoEl.classList.remove('oculto');
        if (taxaEntregaEl) taxaEntregaEl.value = CONFIG.taxaEntregaPadrao.toFixed(2).replace('.', ',');
      } else {
        if (campoTaxaEntregaEl) campoTaxaEntregaEl.classList.add('oculto');
        if (blocoEnderecoEl) blocoEnderecoEl.classList.add('oculto');
        if (taxaEntregaEl) taxaEntregaEl.value = '0,00';
        limparCamposEndereco();
      }
      atualizarCarrinho();
    });
  }

  // ==============================================
  // 🔍 BUSCA DE CEP
  // ==============================================
  if (cepEl) {
    cepEl.addEventListener('input', () => {
      let cep = cepEl.value.replace(/\D/g, '');
      if (cep.length > 5) cep = cep.replace(/^(\d{5})(\d)/, '$1-$2');
      cepEl.value = cep;
    });

    cepEl.addEventListener('blur', async () => {
      const cepNumeros = cepEl.value.replace(/\D/g, '');
      if (cepNumeros.length !== 8) {
        if (avisoCepEl) {
          avisoCepEl.textContent = 'CEP inválido! Digite 8 dígitos.';
          avisoCepEl.style.color = '#dc2626';
        }
        limparCamposEndereco();
        return;
      }

      if (avisoCepEl) {
        avisoCepEl.textContent = 'Buscando endereço...';
        avisoCepEl.style.color = '#2563eb';
      }

      try {
        const resposta = await fetch(`https://viacep.com.br/ws/${cepNumeros}/json/`);
        const dados = await resposta.json();

        if (dados.erro) {
          if (avisoCepEl) {
            avisoCepEl.textContent = 'CEP não encontrado!';
            avisoCepEl.style.color = '#dc2626';
          }
          limparCamposEndereco();
          return;
        }

        if (ruaEl) ruaEl.value = dados.logradouro || '';
        if (bairroEl) bairroEl.value = dados.bairro || '';
        if (cidadeUfEl) cidadeUfEl.value = `${dados.localidade} / ${dados.uf}`;
        if (avisoCepEl) {
          avisoCepEl.textContent = 'Endereço preenchido!';
          avisoCepEl.style.color = '#22c55e';
        }

      } catch (erro) {
        if (avisoCepEl) {
          avisoCepEl.textContent = 'Erro ao buscar CEP. Tente novamente.';
          avisoCepEl.style.color = '#dc2626';
        }
        limparCamposEndereco();
      }
    });
  }

  function limparCamposEndereco() {
    if (cepEl) cepEl.value = '';
    if (numeroEl) numeroEl.value = '';
    if (complementoEl) complementoEl.value = '';
    if (referenciaEl) referenciaEl.value = '';
    if (ruaEl) ruaEl.value = '';
    if (bairroEl) bairroEl.value = '';
    if (cidadeUfEl) cidadeUfEl.value = '';
    if (avisoCepEl) {
      avisoCepEl.textContent = 'Digite o CEP para preencher automaticamente';
      avisoCepEl.style.color = '#2563eb';
    }
  }

  // ==============================================
  // 🕒 STATUS DA LOJA
  // ==============================================
  function verificarStatusLoja(mostrarAviso = false) {
    const agora = new Date();
    const horaAtual = agora.getHours();
    const lojaAberta = horaAtual >= CONFIG.horaAbertura || horaAtual < CONFIG.horaFechamento;

    if (pontoStatusEl && textoStatusEl) {
      if (lojaAberta) {
        pontoStatusEl.style.backgroundColor = CONFIG.corStatusAberto;
        textoStatusEl.textContent = CONFIG.textoStatusAberto;
        textoStatusEl.classList.remove("fechado");
        textoStatusEl.classList.add("aberto");
      } else {
        pontoStatusEl.style.backgroundColor = CONFIG.corStatusFechado;
        textoStatusEl.textContent = CONFIG.textoStatusFechado;
        textoStatusEl.classList.remove("aberto");
        textoStatusEl.classList.add("fechado");
      }
    }

    if (!lojaAberta && mostrarAviso && alertaFechado) {
      alertaFechado.classList.remove("oculto");
    }
    return lojaAberta;
  }

  verificarStatusLoja();
  setInterval(verificarStatusLoja, 60000);
  
  if (btnEntendi && alertaFechado) {
    btnEntendi.addEventListener('click', () => alertaFechado.classList.add("oculto"));
  }

  // ==============================================
  // ➕ / ➖ CONTROLE DE QUANTIDADE PRODUTOS
  // ==============================================
  document.querySelectorAll('.qtd-btn').forEach(botao => {
    botao.addEventListener('click', () => {
      const valorEl = botao.parentElement.querySelector('.qtd-valor');
      if (valorEl) {
        let valor = parseInt(valorEl.textContent);
        if (botao.classList.contains('aumentar')) valor++;
        if (botao.classList.contains('diminuir') && valor > 0) valor--;
        valorEl.textContent = valor;
      }
    });
  });

  // ==============================================
  // 🛍️ ADICIONAR AO CARRINHO
  // ==============================================
  document.querySelectorAll('.add-carrinho').forEach(botao => {
    botao.addEventListener('click', () => {
      if (!verificarStatusLoja(true)) return;

      const nome = botao.dataset.nome;
      const preco = parseFloat(botao.dataset.preco);
      const containerProduto = botao.closest('.produto');
      if (!containerProduto) return;

      const qtdEl = containerProduto.querySelector('.qtd-valor');
      const qtd = qtdEl ? parseInt(qtdEl.textContent) : 0;

      if (qtd <= 0) {
        alert('Escolha uma quantidade antes de adicionar!');
        return;
      }

      const itemExistente = carrinho.find(item => item.nome === nome);
      if (itemExistente) {
        itemExistente.quantidade += qtd;
      } else {
        carrinho.push({ nome, preco, quantidade: qtd });
      }

      atualizarCarrinho();
      if (qtdEl) qtdEl.textContent = '0';

      const original = botao.innerHTML;
      botao.innerHTML = '<i class="fa fa-check"></i> Ok';
      botao.style.background = '#22c55e';
      botao.style.color = 'white';
      setTimeout(() => {
        botao.innerHTML = original;
        botao.style.background = '#facc15';
        botao.style.color = '#111827';
      }, 1100);
    });
  });

  // ==============================================
  // 🔄 ATUALIZAR CARRINHO
  // ==============================================
  function atualizarCarrinho() {
    if (!listaItensCarrinho) return;
    listaItensCarrinho.innerHTML = '';
    let totalItens = 0;
    let qtdTotal = 0;

    if (carrinho.length === 0) {
      if (valorTotalEl) valorTotalEl.textContent = '0,00';
      if (carrinhoContainer) carrinhoContainer.style.display = 'none';
      fecharCronometroPix();
      return;
    }

    if (carrinhoContainer) carrinhoContainer.style.display = 'flex';

    carrinho.forEach((item, index) => {
      const totalItem = item.preco * item.quantidade;
      totalItens += totalItem;
      qtdTotal += item.quantidade;

      const itemEl = document.createElement('div');
      itemEl.className = 'item-carrinho';
      itemEl.innerHTML = `
        <div>
          <h4 style="font-size:13px; margin-bottom:1px; font-weight:600;">${item.nome}</h4>
          <p style="font-size:11px; color:#666;">R$ ${item.preco.toFixed(2).replace('.', ',')} cada</p>
        </div>
        <div style="display:flex; align-items:center; gap:8px;">
          <button class="qtd-btn diminuir-item" data-index="${index}">-</button>
          <span style="font-weight:600; font-size:13px;">${item.quantidade}</span>
          <button class="qtd-btn aumentar-item" data-index="${index}">+</button>
          <span style="font-weight:700; min-width:70px; text-align:right; font-size:13px;">R$ ${totalItem.toFixed(2).replace('.', ',')}</span>
        </div>
      `;
      listaItensCarrinho.appendChild(itemEl);
    });

    const taxaEntrega = (taxaEntregaEl && parseFloat(taxaEntregaEl.value.replace(',', '.'))) || 0;
    const totalGeral = totalItens + taxaEntrega;

    if (valorTotalEl) valorTotalEl.textContent = totalGeral.toFixed(2).replace('.', ',');
    if (qtdCarrinhoEl) qtdCarrinhoEl.textContent = qtdTotal;
    if (resumoCarrinhoEl) {
      resumoCarrinhoEl.innerHTML = `${qtdTotal} itens • R$ ${totalGeral.toFixed(2).replace('.', ',')} &nbsp; | &nbsp; 🔒 Ambiente 100% seguro`;
    }

    atualizarParcelasCartao(totalGeral);
    adicionarEventosCarrinho();
  }

  function adicionarEventosCarrinho() {
    document.querySelectorAll('.aumentar-item').forEach(botao => {
      botao.addEventListener('click', () => {
        const idx = parseInt(botao.dataset.index);
        carrinho[idx].quantidade++;
        atualizarCarrinho();
      });
    });
    document.querySelectorAll('.diminuir-item').forEach(botao => {
      botao.addEventListener('click', () => {
        const idx = parseInt(botao.dataset.index);
        if (carrinho[idx].quantidade > 1) {
          carrinho[idx].quantidade--;
        } else {
          carrinho.splice(idx, 1);
        }
        atualizarCarrinho();
      });
    });
  }

  // ==============================================
  // 💳 INTERATIVIDADE DO CHECKOUT
  // ==============================================
  function selectPaymentMethod(method) {
    metodoPagamentoSelecionado = method;
    
    const optPix = document.getElementById('option-pix-wrapper');
    const optCard = document.getElementById('option-card-wrapper');
    const optCash = document.getElementById('option-cash-wrapper');

    if (optPix) optPix.classList.remove('active');
    if (optCard) optCard.classList.remove('active-card');
    if (optCash) optCash.classList.remove('active-card');

    if (method === 'pix' && optPix) {
      optPix.classList.add('active');
      iniciarCronometroPix();
    } else if (method === 'card' && optCard) {
      optCard.classList.add('active-card');
      fecharCronometroPix();
    } else if (method === 'cash' && optCash) {
      optCash.classList.add('active-card');
      fecharCronometroPix();
    }
  }

  // Vincula botões de seleção de pagamento se eles existirem no HTML
  ['pix', 'card', 'cash'].forEach(method => {
    const btn = document.getElementById(`btn-select-${method}`);
    if (btn) {
      btn.addEventListener('click', () => selectPaymentMethod(method));
    }
  });

  function atualizarParcelasCartao(total) {
    if (!cardInstallmentsEl) return;
    cardInstallmentsEl.innerHTML = '';
    
    for (let i = 1; i <= 12; i++) {
      let valorParcela = total / i;
      if (i > 1) {
          valorParcela = (total * Math.pow(1 + 0.015, i)) / i;
      }
      const option = document.createElement('option');
      option.value = i;
      option.textContent = `${i}x de R$ ${valorParcela.toFixed(2).replace('.', ',')} ${i > 1 ? 'com juros' : 'sem juros'}`;
      cardInstallmentsEl.appendChild(option);
    }
  }

  const copyPixBtn = document.getElementById('btn-copy-pix');
  if (copyPixBtn) {
    copyPixBtn.addEventListener('click', () => {
      const pixText = document.getElementById('pix-copia-cola-text');
      if (pixText) {
        pixText.select();
        pixText.setSelectionRange(0, 99999);
        try {
          navigator.clipboard.writeText(pixText.value);
          alert('Código Pix copiado!');
        } catch (err) {
          document.execCommand('copy');
          alert('Código Pix copiado!');
        }
      }
    });
  }

  function iniciarCronometroPix() {
    fecharCronometroPix();
    if (!pixTimerEl) return;
    let tempo = 585; 

    pixTimerInterval = setInterval(() => {
      let minutos = Math.floor(tempo / 60);
      let segundos = tempo % 60;
      minutos = minutos < 10 ? '0' + minutos : minutos;
      segundos = segundos < 10 ? '0' + segundos : segundos;

      pixTimerEl.textContent = `${minutos}:${segundos}`;

      if (tempo === 0) {
        clearInterval(pixTimerInterval);
        pixTimerEl.textContent = "Expirado";
      }
      tempo--;
    }, 1000);
  }

  function fecharCronometroPix() {
    if (pixTimerInterval) {
      clearInterval(pixTimerInterval);
    }
  }

  // ==============================================
  // 📂 ABRIR / FECHAR MODAL
  // ==============================================
  if (abrirCarrinhoBtn) {
    abrirCarrinhoBtn.addEventListener('click', () => {
      if (carrinho.length === 0) return;
      if (!verificarStatusLoja(true)) return;
      if (modalCarrinho) modalCarrinho.classList.remove('oculto');
      document.body.style.overflow = 'hidden';
      if (avisoGeral) avisoGeral.classList.add('oculto');
      selectPaymentMethod('pix');
    });
  }

  fecharModalBtns.forEach(botao => {
    botao.addEventListener('click', () => {
      if (modalCarrinho) modalCarrinho.classList.add('oculto');
      document.body.style.overflow = 'auto';
      fecharCronometroPix();
    });
  });

  // ==============================================
  // 🗂️ FILTRAR E BUSCAR
  // ==============================================
  document.querySelectorAll('.categoria-btn').forEach(botao => {
    botao.addEventListener('click', () => {
      document.querySelectorAll('.categoria-btn').forEach(b => b.classList.remove('ativo'));
      botao.classList.add('ativo');
      const categoria = botao.dataset.categoria;

      document.querySelectorAll('.produto').forEach(produto => {
        produto.style.display = (categoria === 'todos' || produto.dataset.categoria === categoria) ? 'grid' : 'none';
      });
      if (campoBusca) campoBusca.value = '';
    });
  });

  if (campoBusca) {
    campoBusca.addEventListener('input', () => {
      const termo = campoBusca.value.toLowerCase().trim();
      document.querySelectorAll('.produto').forEach(produto => {
        const nome = produto.dataset.nome ? produto.dataset.nome.toLowerCase() : '';
        produto.style.display = nome.includes(termo) ? 'grid' : 'none';
      });
    });
  }

  // ==============================================
  // ✅ ENVIAR PARA WHATSAPP
  // ==============================================
  const btnFinalizar = document.getElementById('btn-finalizar');
  if (btnFinalizar) {
    btnFinalizar.addEventListener('click', () => {
      if (avisoGeral) avisoGeral.classList.add('oculto');
      const nome = nomeEl ? nomeEl.value.trim() : '';
      const obs = obsEl ? obsEl.value.trim() : '';

      const tipoAtendimento = tipoAtendimentoEl ? tipoAtendimentoEl.value : 'retirada';
      const taxaEntrega = (taxaEntregaEl && parseFloat(taxaEntregaEl.value.replace(',', '.'))) || 0;
      const totalItens = carrinho.reduce((soma, item) => soma + (item.preco * item.quantidade), 0);
      const totalGeral = totalItens + taxaEntrega;

      if (carrinho.length === 0) {
        if (avisoGeral) {
          avisoGeral.textContent = 'Adicione pelo menos um produto!';
          avisoGeral.classList.remove('oculto');
        }
        return;
      }
      if (!nome) {
        if (avisoGeral) {
          avisoGeral.textContent = 'Informe seu nome completo!';
          avisoGeral.classList.remove('oculto');
        }
        return;
      }

      if (tipoAtendimento === 'entrega') {
        const cep = cepEl ? cepEl.value.trim() : '';
        const numero = numeroEl ? numeroEl.value.trim() : '';
        const rua = ruaEl ? ruaEl.value.trim() : '';

        if (!cep || cep.replace(/\D/g, '').length !== 8) {
          if (avisoGeral) {
            avisoGeral.textContent = 'Informe um CEP válido!';
            avisoGeral.classList.remove('oculto');
          }
          return;
        }
        if (!rua) {
          if (avisoGeral) {
            avisoGeral.textContent = 'Digite o CEP e aguarde o preenchimento do endereço!';
            avisoGeral.classList.remove('oculto');
          }
          return;
        }
        if (!numero) {
          if (avisoGeral) {
            avisoGeral.textContent = 'Informe o número da residência!';
            avisoGeral.classList.remove('oculto');
          }
          return;
        }
      }

      let enderecoCompleto = '';
      if (tipoAtendimento === 'entrega' && ruaEl && numeroEl && bairroEl && cidadeUfEl && cepEl) {
        enderecoCompleto = `${ruaEl.value}, Nº ${numeroEl.value}`;
        if (complementoEl && complementoEl.value.trim()) enderecoCompleto += ` - ${complementoEl.value.trim()}`;
        enderecoCompleto += ` | Bairro: ${bairroEl.value} | ${cidadeUfEl.value} | CEP: ${cepEl.value}`;
        if (referenciaEl && referenciaEl.value.trim()) enderecoCompleto += ` | Referência: ${referenciaEl.value.trim()}`;
      }

      let formaPagamentoTexto = '';
      if (metodoPagamentoSelecionado === 'pix') {
        formaPagamentoTexto = 'Pix (Pago via QR Code)';
      } else if (metodoPagamentoSelecionado === 'card') {
        const parcelaEscolhida = cardInstallmentsEl ? cardInstallmentsEl.options[cardInstallmentsEl.selectedIndex].text : 'Cartão';
        formaPagamentoTexto = `Cartão de Crédito/Débito (${parcelaEscolhida})`;
      } else {
        formaPagamentoTexto = 'Dinheiro (Na entrega)';
      }

      let mensagem = `📦 *NOVO PEDIDO - ${CONFIG.nomeLoja}*\n\n`;
      mensagem += `📋 *Tipo:* ${tipoAtendimento === 'entrega' ? 'Entrega em domicílio' : 'Retirada na loja'}\n`;
      mensagem += `👤 *Nome:* ${nome}\n`;

      if (tipoAtendimento === 'entrega') {
        mensagem += `🏠 *Endereço:* ${enderecoCompleto}\n`;
      }

      mensagem += `\n💳 *Forma de pagamento:* ${formaPagamentoTexto}\n\n`;
      mensagem += `🛒 *Itens do pedido:*\n`;

      carrinho.forEach(item => {
        mensagem += `• ${item.nome} | ${item.quantidade}x | R$ ${(item.preco * item.quantidade).toFixed(2).replace('.', ',')}\n`;
      });

      mensagem += `\n💬 *Observações:* ${obs || 'Nenhuma'}\n`;
      mensagem += `🧾 *Subtotal:* R$ ${totalItens.toFixed(2).replace('.', ',')}\n`;

      if (tipoAtendimento === 'entrega') {
        mensagem += `🚚 *Taxa de entrega:* R$ ${taxaEntrega.toFixed(2).replace('.', ',')}\n`;
      }

      mensagem += `💰 *TOTAL GERAL:* R$ ${totalGeral.toFixed(2).replace('.', ',')}`;

      const urlWhatsApp = `https://wa.me/${CONFIG.numeroWhatsApp}?text=${encodeURIComponent(mensagem)}`;
      window.open(urlWhatsApp, '_blank');
    });
  }
});
