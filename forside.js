const slider = document.getElementById("rumSlider");
const klover = document.getElementById("klover");

const farveKnap = document.getElementById("farveKnap");
const farveVaelger = document.getElementById("farveVaelger");

const emojiKnap = document.getElementById("emojiKnap");
const emojiPanel = document.getElementById("emojiPanel");
const valgtEmoji = document.getElementById("valgtEmoji");

// Åbn/luk emoji-panelet
emojiKnap.addEventListener("click", function () {
    emojiPanel.classList.toggle("vis");
});

// Find alle emoji-knapper inde i panelet
const emojiValg = document.querySelectorAll(".emoji-panel button");

// Når man klikker på en emoji
emojiValg.forEach(function (knap) {
    knap.addEventListener("click", function () {
        const emoji = knap.getAttribute("data-emoji");

        valgtEmoji.textContent = emoji;

        emojiPanel.classList.remove("vis");
    });
});


// Startfarve til højre på slideren
let valgtFarve = {
    r: 94,
    g: 179,
    b: 212
};

// Farven helt til venstre
const venstreFarve = {
    r: 243,
    g: 243,
    b: 243
};

// Gør hex-farve om til rgb
function hexTilRgb(hex) {
    return {
        r: parseInt(hex.slice(1, 3), 16),
        g: parseInt(hex.slice(3, 5), 16),
        b: parseInt(hex.slice(5, 7), 16)
    };
}

function opdaterUI() {
    const vaerdi = Number(slider.value);
    const procent = vaerdi / 100;

    const r = Math.round(venstreFarve.r + (valgtFarve.r - venstreFarve.r) * procent);
    const g = Math.round(venstreFarve.g + (valgtFarve.g - venstreFarve.g) * procent);
    const b = Math.round(venstreFarve.b + (valgtFarve.b - venstreFarve.b) * procent);

    const farve = `rgb(${r}, ${g}, ${b})`;

    slider.style.setProperty("--thumb-color", farve);
    klover.style.backgroundColor = farve;

    slider.style.background = `linear-gradient(to right, #f3f3f3, rgb(${valgtFarve.r}, ${valgtFarve.g}, ${valgtFarve.b}))`;
}

// Når man trækker i slideren
slider.addEventListener("input", opdaterUI);

// Når man trykker på farvehjulet
farveKnap.addEventListener("click", function () {
    farveVaelger.click();
});

// Når man vælger en farve
farveVaelger.addEventListener("input", function () {
    valgtFarve = hexTilRgb(farveVaelger.value);

    document.documentElement.style.setProperty("--valgt-farve", farveVaelger.value);

    opdaterUI();
});

opdaterUI();

const bekraeftKnap = document.querySelector(".bekraeft-knap");

bekraeftKnap.addEventListener("click", function () {
    const vaerdi = Number(slider.value);

    const linje1 = document.getElementById("popupLinje1");
    const linje2 = document.getElementById("popupLinje2");
    const linje3 = document.getElementById("popupLinje3");
    const popupBox = document.querySelector(".popup-box");

    popupBox.classList.remove("ubehageligt", "neutral", "behageligt");

    linje1.textContent = "Tak for din feedback";

    if (vaerdi < 40) {
        popupBox.classList.add("ubehageligt");
        linje2.textContent = "Det tyder på at rummet ikke føles optimalt";
        linje3.textContent = "Det bliver taget med i forståelsen af jeres præferencer";
    } else if (vaerdi < 60) {
        popupBox.classList.add("neutral");
        linje2.textContent = "Rummet opleves neutralt";
        linje3.textContent = "Det bidrager til forståelsen af jeres præferencer";
    } else {
        popupBox.classList.add("behageligt");
        linje2.textContent = "Rummet opleves behageligt";
        linje3.textContent = "Det bekræfter hvad der fungerer godt";
    }
});