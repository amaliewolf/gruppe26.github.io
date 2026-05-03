const DEVICE = "AU_STUDENT1";
const SERVER_URL = "https://iot-paia-production.up.railway.app";
const BASE = `${SERVER_URL}/api/env-sensors/${DEVICE}`;

function fmt(v, dec = 1) {
    return v !== null && v !== undefined ? Number(v).toFixed(dec) : "—";
}

function opdaterKort(data) {
    const tempEl = document.getElementById("temperature_c");
    const humEl = document.getElementById("humidity_pct");
    const opdateretEl = document.getElementById("opdateret");

    if (tempEl) {
        tempEl.textContent = fmt(data.temperature_c, 1) + " °C";
    }

    if (humEl) {
        humEl.textContent = fmt(data.humidity_pct, 1) + " %";
    }

    if (opdateretEl && data.Created_At) {
        const måltTid = new Date(data.Created_At);
        const nu = new Date();

        const diffMs = nu - måltTid;
        const diffMin = Math.floor(diffMs / 60000);
        const diffTimer = Math.floor(diffMin / 60);
        const diffDage = Math.floor(diffTimer / 24);

        let tekst = "";

        if (diffMin < 1) {
            tekst = "Målt lige nu";
        } 
        else if (diffMin < 60) {
            tekst = `Målt for ${diffMin} min siden`;
        } 
        else if (diffTimer < 24) {
            tekst = diffTimer === 1
                ? "Målt for 1 time siden"
                : `Målt for ${diffTimer} timer siden`;
        } 
        else {
            tekst = diffDage === 1
                ? "Målt for 1 dag siden"
                : `Målt for ${diffDage} dage siden`;
        }

        opdateretEl.textContent = tekst;
    }
}

async function hentSeneste() {
    const svar = await fetch(BASE + "/history?limit=1");
    const data = await svar.json();

    if (data.length > 0) {
        opdaterKort(data[0]);
    }
}

hentSeneste().catch(() => {
    console.log("Kunne ikke hente seneste måling");
});

const es = new EventSource(BASE + "/stream");

es.onmessage = function (event) {
    try {
        const data = JSON.parse(event.data);
        opdaterKort(data);
    } catch {
        console.log("Kunne ikke læse live data");
    }
};

es.onerror = function () {
    console.log("Live-forbindelse mistet");
};