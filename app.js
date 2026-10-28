document.addEventListener("DOMContentLoaded", () => {

    const statusDiv = document.createElement("div");
    statusDiv.id = "status";

    document.body.appendChild(statusDiv);

    const cards = document.querySelectorAll(".card");

    const pmoInput = cards[0].querySelector("input");
    const capexInput = cards[1].querySelector("input");

    pmoInput.addEventListener("change", () => {

        const file = pmoInput.files[0];

        if (!file) return;

        statusDiv.innerHTML =
            `<p>✅ PMO365 file selected:</p><p><strong>${file.name}</strong></p>`;
    });

    capexInput.addEventListener("change", () => {

        const file = capexInput.files[0];

        if (!file) return;

        statusDiv.innerHTML =
            `<p>✅ CAPEX PDF selected:</p><p><strong>${file.name}</strong></p>`;
    });

});
