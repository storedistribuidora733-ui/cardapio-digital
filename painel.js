// ⚙️ CONFIGURAÇÕES — ALTERE AQUI!
const CONFIG = {
    senhaAdmin: "123456", // 🔴 TROQUE ESTA SENHA PELA SUA!
    chaveArmazenamento: "agendamentosBarbearia" // NÃO ALTERE — deve ser igual ao do site principal
};

// 🔐 VERIFICAR SENHA DE ACESSO
function verificarSenha() {
    const senha = document.getElementById('senha-admin').value.trim();
    if (senha === CONFIG.senhaAdmin) {
        document.getElementById('tela-login').classList.add('oculto');
        document.getElementById('tela-painel').classList.remove('oculto');
        carregarEAtualizar();
    } else {
        alert('❌ Senha incorreta! Tente novamente.');
    }
}

// 📊 CARREGAR LISTA DE AGENDAMENTOS SALVOS
function carregarAgendamentos() {
    const dados = localStorage.getItem(CONFIG.chaveArmazenamento);
    return dados ? JSON.parse(dados) : [];
}

// 💾 SALVAR LISTA
function salvarAgendamentos(lista) {
    localStorage.setItem(CONFIG.chaveArmazenamento, JSON.stringify(lista));
}

// 🔄 ATUALIZAR TUDO NA TELA
function carregarEAtualizar() {
    let lista = carregarAgendamentos();
    
    // Atualizar números do resumo
    document.getElementById('total').textContent = lista.length;
    document.getElementById('pendentes').textContent = lista.filter(a => a.status === 'pendente').length;
    const total = lista.filter(a => a.status !== 'cancelado').reduce((s, a) => s + (a.valor || 0), 0);
    document.getElementById('faturamento').textContent = 'R$' + total.toFixed(2).replace('.', ',');

    // Ordenar: mais recente primeiro
    lista.sort((a, b) => b.id - a.id);

    // Campo de busca
    const termoBusca = document.getElementById('busca')?.value.toLowerCase() || '';
    
    // Filtrar se estiver buscando
    const filtrada = termoBusca 
        ? lista.filter(a => 
            (a.nome + '').toLowerCase().includes(termoBusca) ||
            (a.data + '').includes(termoBusca) ||
            (a.barbeiro + '').toLowerCase().includes(termoBusca))
        : lista;

    const container = document.getElementById('lista');

    // Lista vazia
    if (!filtrada.length) {
        container.innerHTML = `<div class="vazio">${termoBusca ? 'Nenhum resultado encontrado.' : 'Nenhum agendamento ainda.'}</div>`;
        return;
    }

    // Mostrar lista completa
    container.innerHTML = filtrada.map(a => {
        // Classes e textos de status
        let classeLinha = '';
        let statusTexto = '';
        let classeTag = '';

        if (a.status === 'pendente') {
            classeLinha = 'pendente';
            statusTexto = '⏳ Pendente';
            classeTag = 'pendente-tag';
        } else if (a.status === 'confirmado') {
            statusTexto = '✅ Confirmado';
            classeTag = 'confirmado-tag';
        } else if (a.status === 'concluido') {
            classeLinha = 'concluido';
            statusTexto = '✔️ Concluído';
            classeTag = 'concluido-tag';
        } else if (a.status === 'cancelado') {
            classeLinha = 'cancelado';
            statusTexto = '❌ Cancelado';
            classeTag = 'cancelado-tag';
        }

        return `
        <div class="agendamento ${classeLinha}">
            <div class="linha nome">
                📅 ${a.data} às ${a.horario} — 💈 ${a.barbeiro}
                <span class="status-tag ${classeTag}">${statusTexto}</span>
            </div>
            <div class="linha">
                👤 ${a.nome} | ✂️ ${a.servico} | 💰 R$${(a.valor || 0).toFixed(2).replace('.', ',')}
            </div>
            <div class="linha dados">
                📱 ${a.fone} ${a.email ? '| 📧 ' + a.email : ''}
            </div>
            ${a.obs ? `<div class="linha dados">📝 ${a.obs}</div>` : ''}
            <div class="linha dados">${a.dataCadastro || 'Sem data de cadastro'}</div>
            <div class="acoes">
                <button class="btn-acao" style="background:#22c55e; color:white" onclick="mudarStatus(${a.id}, 'confirmado')">✓ Confirmar</button>
                <button class="btn-acao" style="background:#4f46e5; color:white" onclick="mudarStatus(${a.id}, 'concluido')">✔ Concluir</button>
                <button class="btn-acao" style="background:#f59e0b; color:white" onclick="mudarStatus(${a.id}, 'cancelado')">⚠ Cancelar</button>
                <button class="btn-acao" style="background:#ef4444; color:white" onclick="excluirAgendamento(${a.id})">🗑 Excluir</button>
            </div>
        </div>`;
    }).join('');
}

// ✏️ ALTERAR STATUS DO AGENDAMENTO
function mudarStatus(id, novoStatus) {
    const lista = carregarAgendamentos();
    const item = lista.find(a => a.id === id);
    if (item) {
        item.status = novoStatus;
        salvarAgendamentos(lista);
        carregarEAtualizar();
    }
}

// 🗑️ EXCLUIR AGENDAMENTO
function excluirAgendamento(id) {
    if (!confirm('⚠️ Tem certeza? Essa ação não pode ser desfeita!')) return;
    let lista = carregarAgendamentos();
    lista = lista.filter(a => a.id !== id);
    salvarAgendamentos(lista);
    carregarEAtualizar();
}

// 🧹 LIMPAR TODOS OS CONCLUÍDOS
function limparConcluidos() {
    if (!confirm('⚠️ Apagar TODOS os agendamentos já concluídos?')) return;
    let lista = carregarAgendamentos();
    lista = lista.filter(a => a.status !== 'concluido');
    salvarAgendamentos(lista);
    carregarEAtualizar();
}

// 🔍 BUSCAR NA LISTA
function filtrarLista() {
    carregarEAtualizar();
}

// 📤 EXPORTAR PARA PLANILHA EXCEL
function exportarPlanilha() {
    const lista = carregarAgendamentos();
    let csv = 'Data,Horário,Barbeiro,Cliente,Serviço,Valor,WhatsApp,Email,Status,Observações\n';
    
    lista.forEach(a => {
        csv += `${a.data || ''},${a.horario || ''},"${a.barbeiro || ''}","${a.nome || ''}","${a.servico || ''}",${(a.valor || 0).toFixed(2).replace('.', ',')},"${a.fone || ''}","${a.email || ''}",${a.status || 'pendente'},"${(a.obs || '').replace(/"/g, "'")}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'agendamentos_' + new Date().toLocaleDateString('pt-BR').replace(/\//g, '-') + '.csv';
    link.click();
    URL.revokeObjectURL(url);
}

// 🚪 SAIR DO PAINEL
function sairPainel() {
    document.getElementById('tela-painel').classList.add('oculto');
    document.getElementById('tela-login').classList.remove('oculto');
    document.getElementById('senha-admin').value = '';
}
