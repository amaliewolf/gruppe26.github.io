const DEVICE = "AU_STUDENT1";
const SERVER_URL = "https://iot-paia-production.up.railway.app";
const BASE = `${SERVER_URL}/api/env-sensors/${DEVICE}`;

function fmt(v, dec = 1) {
    return v !== null && v !== undefined ? Number(v).toFixed(dec) : "—";
}

function fmtTid(tid) {
    if (!tid) return "—";

    return new Date(tid).toLocaleString("da-DK", {
        dateStyle: "short",
        timeStyle: "short"
    });
}

async function hentHistorik() {
    const tbody = document.getElementById("tbody");

    try {
        const svar = await fetch(BASE + "/history?limit=20");
        const data = await svar.json();

        if (!data.length) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="3">Ingen målinger endnu</td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = data.map(måling => `
            <tr>
                <td>${fmtTid(måling.Created_At)}</td>
                <td>${fmt(måling.temperature_c, 1)} °C</td>
                <td>${fmt(måling.humidity_pct, 1)} %</td>
            </tr>
        `).join("");

    } catch (error) {
        tbody.innerHTML = `
            <tr>
                <td colspan="3">Kunne ikke hente målinger</td>
            </tr>
        `;
    }
}

hentHistorik();