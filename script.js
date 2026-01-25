document.addEventListener("DOMContentLoaded", () => {
  const dataEvento = new Date("2026-02-17T14:00:00-03:00");

  function atualizar() {
    const agora = new Date().getTime();
    const diferenca = dataEvento.getTime() - agora;

    if (diferenca <= 0) return;

    document.getElementById("dias").textContent =
      Math.floor(diferenca / (1000 * 60 * 60 * 24));

    document.getElementById("horas").textContent =
      Math.floor((diferenca / (1000 * 60 * 60)) % 24);

    document.getElementById("minutos").textContent =
      Math.floor((diferenca / (1000 * 60)) % 60);

    document.getElementById("segundos").textContent =
      Math.floor((diferenca / 1000) % 60);
  }

  atualizar();
  setInterval(atualizar, 1000);
});
