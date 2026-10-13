// ==========================================
// ACHIEVEMENT-POPUP
// ==========================================

const achievementPopupQueue = [];

let achievementPopupCurrent = null;
let achievementPopupOpen = false;


// ==========================================
// DOM-ELEMENTE
// ==========================================

const achievementPopupOverlay =
    document.getElementById("achievement-popup-overlay");

const achievementPopupTitle =
    document.getElementById("achievement-popup-title");

const achievementPopupDescription =
    document.getElementById("achievement-popup-description");

const achievementPopupQueueText =
    document.getElementById("achievement-popup-queue");

const achievementPopupNext =
    document.getElementById("achievement-popup-next");

const achievementPopupClose =
    document.getElementById("achievement-popup-close");


// ==========================================
// ERFOLGSINFORMATIONEN
// ==========================================

function achievementPopupGetInfo(id) {
    const achievements =
        window.ACHIEVEMENTS ||
        (typeof ACHIEVEMENTS !== "undefined"
            ? ACHIEVEMENTS
            : []);

    const achievementList = Array.isArray(achievements)
        ? achievements
        : Object.values(achievements);

    const achievement = achievementList.find(item =>
        item &&
        (
            item.id === id ||
            item.column === id ||
            item.key === id
        )
    );

    if (!achievement) {
        console.warn(
            "Achievement nicht gefunden:",
            id,
            achievementList
        );

        return {
            title: achievementPopupFormatId(id),
            description: achievementPopupDefaultDescription
        };
    }

    return {
        title:
            achievement.title ||
            achievement.name ||
            achievement.label ||
            achievementPopupFormatId(id),

        description:
            achievement.description ||
            achievement.text ||
            achievementPopupDefaultDescription,

        icon: achievement.icon || "🏆"
    };
}


// ==========================================
// FALLBACK-TEXTE
// ==========================================

const achievementPopupDefaultDescription =
    "Du hast einen neuen Erfolg freigeschaltet!";


function achievementPopupFormatId(id) {

    return id
        .replace(/^achievement_/, "")
        .replace(/_/g, " ")
        .replace(/\b\w/g, letter => letter.toUpperCase());

}


// ==========================================
// ERFOLGE EINREIHEN
// ==========================================

function achievementPopupEnqueue(ids) {

    if (!Array.isArray(ids)) {
        return;
    }

    ids.forEach(id => {

        if (
            typeof id !== "string" ||
            !id.startsWith("achievement_")
        ) {
            return;
        }

        if (
            achievementPopupQueue.includes(id) ||
            achievementPopupCurrent === id
        ) {
            return;
        }

        achievementPopupQueue.push(id);

    });

    achievementPopupShowNext();

}


// ==========================================
// NÄCHSTEN ERFOLG ANZEIGEN
// ==========================================

function achievementPopupShowNext() {

    if (
        achievementPopupOpen ||
        achievementPopupQueue.length === 0 ||
        !achievementPopupOverlay
    ) {
        return;
    }

    achievementPopupCurrent =
        achievementPopupQueue.shift();

    const info =
        achievementPopupGetInfo(
            achievementPopupCurrent
        );

    achievementPopupTitle.textContent =
        info.title;

    achievementPopupDescription.textContent =
        info.description;

    achievementPopupQueueText.textContent =
        achievementPopupQueue.length > 0
            ? `Noch ${achievementPopupQueue.length} weitere Erfolge`
            : "";

    achievementPopupNext.textContent =
        achievementPopupQueue.length > 0
            ? "Weiter"
            : "Schließen";

    achievementPopupOverlay.classList.add("is-visible");

    achievementPopupOverlay.setAttribute(
        "aria-hidden",
        "false"
    );

    achievementPopupOpen = true;

    achievementPopupNext.focus();

}


// ==========================================
// POPUP SCHLIESSEN
// ==========================================

function achievementPopupCloseCurrent() {

    if (!achievementPopupOpen) {
        return;
    }

    achievementPopupOverlay.classList.remove(
        "is-visible"
    );

    achievementPopupOverlay.setAttribute(
        "aria-hidden",
        "true"
    );

    achievementPopupOpen = false;
    achievementPopupCurrent = null;

    window.setTimeout(() => {

        achievementPopupShowNext();

    }, 200);

}


// ==========================================
// SCHALTFLÄCHEN
// ==========================================

achievementPopupNext.addEventListener(
    "click",
    achievementPopupCloseCurrent
);

achievementPopupClose.addEventListener(
    "click",
    achievementPopupCloseCurrent
);


// ==========================================
// HINTERGRUND-KLICK
// ==========================================

achievementPopupOverlay.addEventListener(
    "click",
    event => {

        if (
            event.target === achievementPopupOverlay
        ) {
            achievementPopupCloseCurrent();
        }

    }
);


// ==========================================
// ESC-TASTE
// ==========================================

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Escape" &&
            achievementPopupOpen
        ) {
            achievementPopupCloseCurrent();
        }

    }
);