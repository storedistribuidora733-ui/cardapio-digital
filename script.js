window.onload = function () {
  const diasEl = document.getElementById("dias");
  const horasEl = document.getElementById("horas");
  const minutosEl = document.getElementById("minutos");
  const segundosEl = document.getElementById("segundos");

  // Se algum elemento não existir, para tudo
  if (!diasEl || !horasEl || !minutosEl || !segundosEl) {
    return;
  }

  // Data do evento: 17/02/2026 às 14:00 (horário Brasil)
  const dataEvento = new Date(2026, 1, 17, 14, 0, 0);

  function atualizarCronometro() {
    const agora = new Date().getTime();
    const diferenca = dataEvento.getTime() - agora;

    if (diferenca <= 0) {
      diasEl.textContent = "0";
      horasEl.textContent = "0";
      minutosEl.textContent = "0";
      segundosEl.textContent = "0";
      return;
    }

    const dias = Math.floor(diferenca / (1000 * 60 * 60 * 24));
    const horas = Math.floor((diferenca / (1000 * 60 * 60)) % 24);
    const minutos = Math.floor((diferenca / (1000 * 60)) % 60);
    const segundos = Math.floor((diferenca / 1000) % 60);

    diasEl.textContent = dias;
    horasEl.textContent = horas;
    minutosEl.textContent = minutos;
    segundosEl.textContent = segundos;
  }

  atualizarCronometro();
  setInterval(atualizarCronometro, 1000);
};
