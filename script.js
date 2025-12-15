// ===============================
// HORÁRIO DE FUNCIONAMENTO
// ===============================
const openingHour = 11 * 60 + 30; // 11:30
const closingHour = 25 * 60;      // 01:00 do outro dia

function minutesNow() {
  const d = new Date();
  return d.getHours() * 60 + d.getMinutes();
}

function computeStoreStatus(now, open, close) {
  const DAY = 1440;
  const crossesMidnight = close > DAY;

  if (!crossesMidnight) {
    const isOpen = now >= open && now < close;
    return {
      isOpen,
      minutesToClose: isOpen ? close - now : null,
      minutesToOpen: !isOpen ? (now < open ? open - now : open + DAY - now) : null
    };
  }

  const adjClose = close - DAY;
  const isOpen = now >= open || now < adjClose;

  return {
    isOpen,
    minutesToClose: isOpen
      ? (now >= open ? close - now : adjClose - now)
      : null,
    minutesToOpen: !isOpen
      ? (now < open ? open - now : open + DAY - now)
      : null
  };
}

function checkStoreStatus(showWarning = false) {
  const { isOpen, minutesToClose, minutesToOpen } =
    computeStoreStatus(minutesNow(), openingHour, closingHour);

  if (isOpen) {
    if (minutesToClose <= 20) {
      dateSpan.className = "px-3 py-1 rounded-lg font-bold text-black";
      dateSpan.style.backgroundColor = "#FFD54F";
      dateSpan.textContent = `⚠ ${minutesToClose} min para fechar`;
    } else {
      dateSpan.className = "bg-green-500 px-3 py-1 rounded-lg text-white font-bold";
      dateSpan.textContent = "Aberto agora";
    }
  } else {
    dateSpan.className = "bg-red-500 px-3 py-1 rounded-lg text-white font-bold";
    dateSpan.textContent =
      minutesToOpen < 60
        ? `⏰ Abre em ${minutesToOpen} min`
        : `⏰ Abre em ${Math.floor(minutesToOpen / 60)}h`;

    if (showWarning) closedAlert.classList.remove("hidden");
  }
  return isOpen;
}

setInterval(() => checkStoreStatus(false), 10000);
checkStoreStatus(false);