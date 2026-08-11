// ⚙️ CONFIGURAÇÕES — ALTERE AQUI SE PRECISAR
const CONFIG = {
    horaAbertura: 8,
    horaFechamento: 18,
    diaFechado: 0, // 0 = Domingo
    numeroWhatsApp: "5519989021323", // 🔴 COLOQUE SEU NÚMERO
    nomeLoja: "Barbearia Premium",
    limitePorHorario: 2,
    chaveArmazenamento: "agendamentosBarbearia",
    linkPainel: "painel.html" // 🔴 Atualize se mudar o nome do arquivo
};

// 📊 DADOS DO AGENDAMENTO
let agendamento = {
    barbeiro: null,
    servico: null,
    valor: 0,
    data: null,
    horario: null
};

// 📅 CARREGAR E SALVAR AGENDAMENTOS
function carregarAgendamentos() {
    const dados = localStorage.getItem(CONFIG.chaveArmazenamento);
    return dados ? JSON.parse(dados) : [];
}
function salvarAgendamentos(lista) {
    localStorage.setItem(CONFIG.chaveArmazenamento, JSON.stringify(lista));
}
let agendamentos = carregarAgendamentos();

// 🚀 INICIAR TUDO
document.addEventListener('DOMContentLoaded', () => {
    verificarStatusLoja();
    gerarCalendario();
    configurarBotoesAvancar();
    document.getElementById('limite-por-horario').textContent = CONFIG.limitePorHorario;
});

// 🟢 STATUS DA LOJA
function verificarStatusLoja() {
    const agora = new Date();
    const hora = agora.getHours(), dia = agora.getDay();
    const aberta = dia !== CONFIG.diaFechado && hora >= CONFIG.horaAbertura && hora < CONFIG.horaFechamento;
    const elStatus = document.getElementById('status-loja');
    const elTexto = document.getElementById('texto-status');
    
    if (aberta) {
        elStatus.classList.remove('fechado');
        elTexto.textContent = `Aberto • ${CONFIG.horaAbertura}h às ${CONFIG.horaFechamento}h`;
    } else {
        elStatus.classList.add('fechado');
        elTexto.textContent = dia === 0 ? "Fechado • Abre Segunda" : `Fechado • Abre às ${CONFIG.horaAbertura}h`;
    }
}

// 📅 CALENDÁRIO
function gerarCalendario() {
    const container = document.getElementById('calendario');
    const hoje = new Date();
    const diasSemana = ['D','S','T','Q','Q','S','S'];
    
    diasSemana.forEach(d => {
        const el = document.createElement('div');
        el.className = 'dia-semana';
        el.textContent = d;
        container.appendChild(el);
    });

    for (let i = 0; i < 28; i++) {
        const data = new Date();
        data.setDate(hoje.getDate() + i);
        const diaSemana = data.getDay();
        const diaMes = data.getDate();
        const mes = data.getMonth() + 1;
        const dataStr = `${diaMes}/${mes}/${data.getFullYear()}`;
        const ehDomingo = diaSemana === 0;

        const el = document.createElement('div');
        el.className = 'dia';
        el.textContent = diaMes;
        el.dataset.data = dataStr;

        if (ehDomingo) {
            el.classList.add('indisponivel');
        } else {
            el.onclick = () => {
                document.querySelectorAll('.dia').forEach(d => d.classList.remove('selecionado'));
                el.classList.add('selecionado');
                agendamento.data = dataStr;
                document.getElementById('btn-avancar-3').disabled = false;
                atualizarResumo();
                bloquearHorariosCheios();
            };
        }
        container.appendChild(el);
    }
}

// 🔒 BLOQUEAR HORÁRIOS CHEIOS
function bloquearHorariosCheios() {
    if (!agendamento.data) return;
    document.querySelectorAll('.horario').forEach(h => {
        h.classList.remove('indisponivel', 'selecionado');
        h.style.pointerEvents = 'auto';
    });

    document.querySelectorAll('.horario').forEach(horarioEl => {
        const horario = horarioEl.textContent;
        const qtd = agendamentos.filter(a => a.data === agendamento.data && a.horario === horario).length;
        
        if (qtd >= CONFIG.limitePorHorario) {
            horarioEl.classList.add('indisponivel');
            horarioEl.style.pointerEvents = 'none';
        } else {
            horarioEl.onclick = () => {
                document.querySelectorAll('.horario').forEach(h => h.classList.remove('selecionado'));
                horarioEl.classList.add('selecionado');
                agendamento.horario = horario;
                document.getElementById('btn-avancar-4').disabled = false;
                atualizarResumo();
            };
        }
    });
}

// 👤 ESCOLHER BARBEIRO
document.querySelectorAll('.barbeiro').forEach(b => {
    b.onclick = () => {
        document.querySelectorAll('.barbeiro').forEach(x => x.classList.remove('selecionado'));
        b.classList.add('selecionado');
        agendamento.barbeiro = b.dataset.nome;
        document.getElementById('btn-avancar-1').disabled = false;
        atualizarResumo();
    };
});

// ✂️ ESCOLHER SERVIÇO
document.querySelectorAll('.servico').forEach(s => {
    s.onclick = () => {
        document.querySelectorAll('.servico').forEach(x => x.classList.remove('selecionado'));
        s.classList.add('selecionado');
        agendamento.servico = s.dataset.nome;
        agendamento.valor = parseFloat(s.dataset.valor);
        document.getElementById('btn-avancar-2').disabled = false;
        atualizarResumo();
    };
});

// 🔘 BOTÕES DE NAVEGAÇÃO
function configurarBotoesAvancar() {
    document.getElementById('btn-avancar-1').onclick = () => irParaEtapa(2);
    document.getElementById('btn-avancar-2').onclick = () => irParaEtapa(3);
    document.getElementById('btn-avancar-3').onclick = () => irParaEtapa(4);
    document.getElementById('btn-avancar-4').onclick = () => irParaEtapa(5);
}

// 🔄 TROCAR ETAPA
function irParaEtapa(numero) {
    if (numero > 1 && !agendamento.barbeiro) return alert('Escolha um barbeiro!');
    if (numero > 2 && !agendamento.servico) return alert('Escolha um serviço!');
    if (numero > 3 && !agendamento.data) return alert('Escolha uma data!');
    if (numero > 4 && !agendamento.horario) return alert('Escolha um horário!');

    document.querySelectorAll('.etapa').forEach(e => e.classList.remove('ativa'));
    document.getElementById(`etapa-${numero}`).classList.add('ativa');

    document.querySelectorAll('.passo').forEach((p, i) => {
        p.classList.remove('ativo', 'concluido');
        if (i + 1 === numero) p.classList.add('ativo');
        else if (i + 1 < numero) p.classList.add('concluido');
    });
}

// 📋 ATUALIZAR RESUMO
function atualizarResumo() {
    document.getElementById('res-barbeiro').textContent = agendamento.barbeiro || '—';
    document.getElementById('res-servico').textContent = agendamento.servico || '—';
    document.getElementById('res-data').textContent = agendamento.data || '—';
    document.getElementById('res-horario').textContent = agendamento.horario || '—';
    document.getElementById('res-valor').textContent = agendamento.valor ? agendamento.valor.toFixed(2).replace('.', ',') : '0,00';
}

// ✅ CONFIRMAR AGENDAMENTO — SALVA NO SISTEMA + MENSAGEM CURTA NO WHATSAPP
function confirmarAgendamento() {
    const nome = document.getElementById('nome').value.trim();
    const fone = document.getElementById('fone').value.trim();
    const email = document.getElementById('email').value.trim();
    const obs = document.getElementById('obs').value.trim();

    if (!nome) return alert('Digite seu nome!');
    if (!fone) return alert('Digite seu WhatsApp!');
    if (!agendamento.barbeiro || !agendamento.servico || !agendamento.data || !agendamento.horario) {
        return alert('Preencha todas as etapas!');
    }

    // Verificar se horário encheu
    const qtd = agendamentos.filter(a => a.data === agendamento.data && a.horario === agendamento.horario).length;
    if (qtd >= CONFIG.limitePorHorario) {
        return alert('⚠️ Esse horário acabou de ficar cheio! Escolha outro.');
    }

    // ✅ SALVAR NO SISTEMA (aparece no Painel)
    const novo = {
        id: Date.now(),
        nome,
        fone,
        email,
        barbeiro: agendamento.barbeiro,
        servico: agendamento.servico,
        data: agendamento.data,
        horario: agendamento.horario,
        valor: agendamento.valor,
        obs,
        status: 'pendente',
        dataCadastro: new Date().toLocaleString('pt-BR')
    };

    agendamentos.push(novo);
    salvarAgendamentos(agendamentos);

    // ✅ MENSAGEM CURTA NO WHATSAPP — SÓ AVISO, SEM BAGUNÇA!
    const mensagem = `🔔 NOVO AGENDAMENTO RECEBIDO

👤 Cliente: ${nome}
💈 Barbeiro: ${agendamento.barbeiro}
✂️ Serviço: ${agendamento.servico}
📅 Data: ${agendamento.data}
⏰ Horário: ${agendamento.horario}
💰 Valor: R$ ${agendamento.valor.toFixed(2).replace('.', ',')}

✅ Detalhes completos no Painel: ${CONFIG.linkPainel}`;

    // Abrir WhatsApp
    window.open(`https://wa.me/${CONFIG.numeroWhatsApp}?text=${encodeURIComponent(mensagem)}`, '_blank');

    // Mostrar sucesso
    document.getElementById('modal-sucesso').classList.add('aberto');

    // Resetar formulário
    agendamento = { barbeiro: null, servico: null, valor: 0, data: null, horario: null };
    document.getElementById('nome').value = '';
    document.getElementById('fone').value = '';
    document.getElementById('email').value = '';
    document.getElementById('obs').value = '';
    
    // Resetar botões e seleções
    document.getElementById('btn-avancar-1').disabled = true;
    document.getElementById('btn-avancar-2').disabled = true;
    document.getElementById('btn-avancar-3').disabled = true;
    document.getElementById('btn-avancar-4').disabled = true;
    document.querySelectorAll('.barbeiro, .servico, .dia, .horario').forEach(el => el.classList.remove('selecionado'));

    irParaEtapa(1);
}

// ❌ FECHAR MODAL
function fecharModal(idModal) {
    document.getElementById(idModal).classList.remove('aberto');
}
