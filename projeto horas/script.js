document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById("hours-form");
    const totalExtra = document.getElementById("total-extra");
    const totalMissing = document.getElementById("total-missing");
    const totalBalance = document.getElementById("total-balance");
    const daySummaryList = document.getElementById("day-summary-list");
    const resetButton = document.getElementById("reset-button");

    let hoursByDay = loadFromLocalStorage() || {};

    updateBalance(); // Chamada para exibir as informações salvas ao abrir o arquivo

    form.addEventListener("submit", function(event) {
        event.preventDefault();

        const day = parseInt(document.getElementById("day").value);
        const type = document.getElementById("type").value;
        const hours = parseInt(document.getElementById("hours").value);
        const minutes = parseInt(document.getElementById("minutes").value);

        const totalMinutes = hours * 60 + minutes;

        if (!hoursByDay[day]) {
            hoursByDay[day] = 0;
        }

        if (type === "extra") {
            hoursByDay[day] += totalMinutes;
        } else {
            hoursByDay[day] -= totalMinutes;
        }

        updateBalance();
        saveToLocalStorage();
    });

    resetButton.addEventListener("click", function() {
        if (confirm("Tem certeza que deseja zerar as informações?")) {
            hoursByDay = {};
            updateBalance();
            saveToLocalStorage();
        }
    });

    function updateBalance() {
        let totalExtraMinutes = 0;
        let totalMissingMinutes = 0;

        // Limpa o resumo do dia
        daySummaryList.innerHTML = '';

        for (const day in hoursByDay) {
            const minutes = hoursByDay[day];
            if (minutes > 0) {
                totalExtraMinutes += minutes;
            } else {
                totalMissingMinutes -= minutes;
            }
            const dayMessage = minutes > 0 ? `Dia ${day} sobraram` : `Dia ${day} faltaram`;
            const dayHours = Math.floor(Math.abs(minutes) / 60);
            const dayMinutes = Math.abs(minutes) % 60;
            const daySummaryText = `${dayMessage} ${dayHours} horas e ${dayMinutes} minutos`;
            const listItem = document.createElement("li");
            listItem.textContent = daySummaryText;
            daySummaryList.appendChild(listItem);
        }

        totalExtra.textContent = formatMinutes(totalExtraMinutes);
        totalMissing.textContent = formatMinutes(totalMissingMinutes);

        const totalBalanceMinutes = totalExtraMinutes - totalMissingMinutes;
        totalBalance.textContent = formatMinutes(totalBalanceMinutes);
    }

    function formatMinutes(totalMinutes) {
        const hours = Math.floor(Math.abs(totalMinutes) / 60);
        const remainingMinutes = Math.abs(totalMinutes) % 60;
        const sign = totalMinutes < 0 ? '-' : ''; // Adiciona o sinal para minutos negativos
        return `${sign}${hours}h ${remainingMinutes < 10 ? '0' : ''}${remainingMinutes}min`;
    }

    function saveToLocalStorage() {
        localStorage.setItem('hoursByDay', JSON.stringify(hoursByDay));
    }

    function loadFromLocalStorage() {
        const data = localStorage.getItem('hoursByDay');
        return data ? JSON.parse(data) : null;
    }
});
