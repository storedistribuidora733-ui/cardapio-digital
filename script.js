// Data do evento: 17/02/2026 às 14:00
const dataEvento = new Date("2026-02-17T14:00:00");

function atualizarCronometro() {
  const agora = new Date().getTime();
  const evento = dataEvento.getTime();
  const diferenca = evento - agora;

  if (diferenca <= 0) {
    document.getElementById("dias").textContent = "0";
    document.getElementById("horas").textContent = "0";
    document.getElementById("minutos").textContent = "0";
    document.getElementById("segundos").textContent = "0";
    return;
  }

  const dias = Math.floor(diferenca / (1000 * 60 * 60 * 24));
  const horas = Math.floor((diferenca / (1000 * 60 * 60)) % 24);
  const minutos = Math.floor((diferenca / (1000 * 60)) % 60);
  const segundos = Math.floor((diferenca / 1000) % 60);

  document.getElementById("dias").textContent = dias;
  document.getElementById("horas").textContent = horas;
  document.getElementById("minutos").textContent = minutos;
  document.getElementById("segundos").textContent = segundos;
}

// Inicia imediatamente
atualizarCronometro();
setInterval(atualizarCronometro, 1000);
