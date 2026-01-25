window.addEventListener("load", function () {
  const dias = document.getElementById("dias");
  const horas = document.getElementById("horas");
  const minutos = document.getElementById("minutos");
  const segundos = document.getElementById("segundos");

  const dataEvento = new Date(2026, 1, 17, 14, 0, 0); // 17/02/2026 14:00

  function atualizar() {
    const agora = new Date().getTime();
    const diff = dataEvento.getTime() - agora;

    if (diff <= 0) {
      dias.textContent = "0";
      horas.textContent = "0";
      minutos.textContent = "0";
      segundos.textContent = "0";
      return;
    }

    dias.textContent = Math.floor(diff / (1000 * 60 * 60 * 24));
    horas.textContent = Math.floor((diff / (1000 * 60 * 60)) % 24);
    minutos.textContent = Math.floor((diff / (1000 * 60)) % 60);
    segundos.textContent = Math.floor((diff / 1000) % 60);
  }

  atualizar();
  setInterval(atualizar, 1000);
});
