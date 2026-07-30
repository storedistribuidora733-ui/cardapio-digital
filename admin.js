// ===== CONFIGURAÇÃO — COLOQUE SEUS DADOS AQUI =====
const SENHA_ADMIN = "123456"; // TROQUE POR UMA SENHA SEGURA SUA!
const BIN_ID = "COLOQUE_AQUI_SEU_ID_BIN";
const API_KEY = "COLOQUE_AQUI_SUA_CHAVE_API";
// ===================================================

let dadosLoja = { config: {}, produtos: [] };

function mostrarAviso(elId, texto, tipo="sucesso") {
  const av = document.getElementById(elId);
  av.textContent = texto; av.className = `aviso ${tipo}`; av.style.display="block";
  setTimeout(()=>av.style.display="none", 3200);
}

function verificarSenha() {
  if(document.getElementById("senha-admin").value.trim() === SENHA_ADMIN) {
    document.getElementById("tela-login").style.display="none";
    document.getElementById("conteudo-admin").style.display="block";
    carregarDadosPainel();
  } else mostrarAviso("msg-login", "Senha incorreta!", "erro");
}

async function carregarDadosPainel() {
  try {
    const res = await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}`, {
      headers: { "X-Master-Key": API_KEY }
    });
    const ret = await res.json();
    dadosLoja = ret.record;
    preencherCampos(); listarProdutosPainel();
  } catch(e) { alert("Erro ao carregar dados! Verifique ID/Chave."); console.error(e); }
}

function preencherCampos() {
  document.getElementById("cfg-nome").value = dadosLoja.config.nomeLoja || "";
  document.getElementById("cfg-taxa").value = dadosLoja.config.taxaEntregaPadrao || "";
  document.getElementById("cfg-whats").value = dadosLoja.config.numeroWhatsApp || "";
  document.getElementById("cfg-hora-abre").value = dadosLoja.config.horaAbertura || 7;
  document.getElementById("cfg-hora-fecha").value = dadosLoja.config.horaFechamento || 23;
}

async function salvarTudo() {
  // Atualiza configurações com os valores do painel
  dadosLoja.config.nomeLoja = document.getElementById("cfg-nome").value.trim();
  dadosLoja.config.taxaEntregaPadrao = parseFloat(document.getElementById("cfg-taxa").value) || 0;
  dadosLoja.config.numeroWhatsApp = document.getElementById("cfg-whats").value.trim();
  dadosLoja.config.horaAbertura = parseInt(document.getElementById("cfg-hora-abre")) || 7;
  dadosLoja.config.horaFechamento = parseInt(document.getElementById("cfg-hora-fecha")) || 23;

  try {
    await fetch(`https://api.jsonbin.io/v3/b/${BIN_ID}`, {
      method: "PUT",
      headers: { "X-Master-Key": API_KEY, "Content-Type": "application/json" },
      body: JSON.stringify(dadosLoja)
    });
    mostrarAviso("aviso-salvar", "✅ SALVO COM SUCESSO! Atualizado para TODOS instantaneamente!");
    listarProdutosPainel();
  } catch(e) { mostrarAviso("aviso-salvar", "❌ Erro ao salvar! Verifique conexão/dados.", "erro"); console.error(e); }
}

function adicionarProduto() {
  const nome = document.getElementById("prod-nome").value.trim();
  const preco = parseFloat(document.getElementById("prod-preco").value) || 0;
  if(!nome || preco <= 0) return alert("Preencha nome e preço corretamente!");

  dadosLoja.produtos.push({
    id: Date.now(), categoria: document.getElementById("prod-cat").value,
    nome, preco, descricao: document.getElementById("prod-desc").value.trim(),
    imagem: document.getElementById("prod-img").value.trim() || "https://via.placeholder.com/300",
    ativo: true
  });
  listarProdutosPainel();
  // Limpa campos
  ["prod-nome","prod-preco","prod-desc","prod-img"].forEach(id=>document.getElementById(id).value="");
}

function listarProdutosPainel() {
  const container = document.getElementById("lista-produtos-admin");
  container.innerHTML = "";
  dadosLoja.produtos.forEach((p, i)=>{
    const el = document.createElement("div"); el.className="item-produto";
    el.innerHTML = `
      <strong>${p.nome}</strong> — R$ ${p.preco.toFixed(2).replace(".",",")}
      <p style="margin:4px 0; font-size:.9rem; color:#555;">${p.descricao || "Sem descrição"}</p>
      <span>${p.ativo ? "✅ Ativo" : "❌ Inativo"} | Categoria: ${p.categoria}</span>
      <br><button class="btn-remover" onclick="desativar(${i})">Desativar/Esconder</button>
    `;
    container.appendChild(el);
  });
}

function desativar(indice) {
  dadosLoja.produtos[indice].ativo = !dadosLoja.produtos[indice].ativo;
  listarProdutosPainel();
}
