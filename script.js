// DATA DO ANIVERSÁRIO
// Ano, Mês (0 = Janeiro), Dia, Hora, Minuto
const dataEvento = new Date(2026, 1, 17, 14, 0, 0);

function atualizarContagem() {
  const agora = new Date();
  const diferenca = dataEvento - agora;

  if (diferenca <= 0) {
    document.getElementById("dias").innerText = 0;
    document.getElementById("horas").innerText = 0;
    document.getElementById("minutos").innerText = 0;
    document.getElementById("segundos").innerText = 0;
    return;
  }

  const dias = Math.floor(diferenca / (1000 * 60 * 60 * 24));
  const horas = Math.floor((diferenca / (1000 * 60 * 60)) % 24);
  const minutos = Math.floor((diferenca / (1000 * 60)) % 60);
  const segundos = Math.floor((diferenca / 1000) % 60);

  document.getElementById("dias").innerText = dias;
  document.getElementById("horas").innerText = horas;
  document.getElementById("minutos").innerText = minutos;
  document.getElementById("segundos").innerText = segundos;
}

// Atualiza a cada 1 segundo
setInterval(atualizarContagem, 1000);
atualizarContagem();
