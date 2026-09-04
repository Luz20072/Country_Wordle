// ==========================================
// SPIEL
// ==========================================


// ==========================================
// ELEMENTE
// ==========================================

const countryInput =
    document.getElementById(
        "countryInput"
    );


const guessButton =
    document.getElementById(
        "guessButton"
    );


const restartButton =
    document.getElementById(
        "restartButton"
    );


const backToStartButton =
    document.getElementById(
        "backToStartButton"
    );


const showVictoryButton =
    document.getElementById(
        "showVictoryButton"
    );


const guessesContainer =
    document.getElementById(
        "guesses"
    );


const message =
    document.getElementById(
        "message"
    );


const suggestionsContainer =
    document.getElementById(
        "countrySuggestions"
    );


// ==========================================
// SIEGES-POPUP ELEMENTE
// ==========================================

const victoryModal =
    document.getElementById(
        "victoryModal"
    );


const victoryFlag =
    document.getElementById(
        "victoryFlag"
    );


const victoryCountryName =
    document.getElementById(
        "victoryCountryName"
    );


const victoryData =
    document.getElementById(
        "victoryData"
    );


const victoryBorders =
    document.getElementById(
        "victoryBorders"
    );


const victoryCloseButton =
    document.getElementById(
        "victoryCloseButton"
    );


const victoryRestartButton =
    document.getElementById(
        "victoryRestartButton"
    );


const victoryContinueButton =
    document.getElementById(
        "victoryContinueButton"
    );


const victoryOverlay =
    document.querySelector(
        ".victory-overlay"
    );


// ==========================================
// SPIELDATEN
// ==========================================

let targetCountry = null;

let targetColors = [];

let targetWars = [];

let guessedCountries = [];

let gameOver = false;


// ==========================================
// SIEGES-POPUP DATEN
// ==========================================

/*
 * Das zuletzt gewonnene Land wird gespeichert,
 * damit das Victory-Modal nach dem Schließen
 * erneut geöffnet werden kann.
 */

let victoryCountry = null;


// ==========================================
// INDIzien EINSTELLUNG
// ==========================================

function areHintsEnabled() {

    return (
        localStorage.getItem(
            "hintsEnabled"
        ) !== "false"
    );

}


// ==========================================
// INDIzien SICHTBARKEIT
// ==========================================

function updateHintsVisibility() {

    const hintsContainer =
        document.getElementById(
            "hints-container"
        );


    if (!hintsContainer) {
        return;
    }


    hintsContainer.style.display =
        areHintsEnabled()
            ? ""
            : "none";

}


// ==========================================
// SPIEL-BUTTONS AKTUALISIEREN
// ==========================================

function updateGameButtons() {

    /*
     * Während des Spiels:
     *
     * Neues Spiel       → unsichtbar
     * Zur Startseite    → sichtbar
     * Ergebnis anzeigen → unsichtbar
     *
     * Nach dem Sieg:
     *
     * Neues Spiel       → sichtbar
     * Zur Startseite    → sichtbar
     * Ergebnis anzeigen → zunächst unsichtbar
     */

    if (restartButton) {

        restartButton.style.display =
            gameOver
                ? ""
                : "none";

    }


    if (backToStartButton) {

        backToStartButton.style.display =
            "";

    }


    /*
     * "Ergebnis anzeigen" wird beim Sieg
     * zunächst versteckt.
     *
     * Nach dem Schließen des Victory-Modals
     * wird der Button über
     * showVictoryButtonAfterClose()
     * wieder eingeblendet.
     */

    if (showVictoryButton) {

        showVictoryButton.style.display =
            "none";

    }

}


// ==========================================
// ERGEBNIS-BUTTON ANZEIGEN
// ==========================================

function showVictoryButtonAfterClose() {

    if (
        !showVictoryButton ||
        !victoryCountry
    ) {
        return;
    }


    showVictoryButton.style.display =
        "";

}


// ==========================================
// AUTOCOMPLETE-DATEN
// ==========================================

let allCountries = [];

let currentSuggestions = [];

let selectedSuggestionIndex = -1;


// ==========================================
// ALLE LÄNDER DER DATENBANK LADEN
// ==========================================

async function loadCountries() {

    try {

        allCountries =
            await supabaseRequest(
                `countries?select=id,name&order=name`
            );


        console.log(
            "Länder für Autocomplete:",
            allCountries
        );

    }

    catch (error) {

        console.error(
            "Fehler beim Laden der Länder:",
            error
        );

    }

}


// ==========================================
// LÄNDERVORSCHLÄGE
// ==========================================

function showCountrySuggestions() {

    const input =
        countryInput.value
            .trim()
            .toLowerCase();


    suggestionsContainer.innerHTML =
        "";


    currentSuggestions =
        [];


    selectedSuggestionIndex =
        -1;


    if (
        input === ""
    ) {

        return;

    }


    currentSuggestions =
        allCountries
            .filter(
                country =>
                    country.name
                        .toLowerCase()
                        .includes(input)
            )
            .slice(
                0,
                8
            );


    currentSuggestions.forEach(
        (
            country,
            index
        ) => {

            const suggestion =
                document.createElement(
                    "div"
                );


            suggestion.classList.add(
                "country-suggestion"
            );


            suggestion.textContent =
                country.name;


            suggestion.dataset.index =
                index;


            suggestion.addEventListener(
                "click",
                () => {

                    selectSuggestion(
                        index
                    );

                }
            );


            suggestionsContainer.appendChild(
                suggestion
            );

        }
    );

}


// ==========================================
// VORSCHLAG AUSWÄHLEN
// ==========================================

function selectSuggestion(
    index
) {

    if (
        index < 0 ||
        index >= currentSuggestions.length
    ) {

        return;

    }


    const country =
        currentSuggestions[index];


    countryInput.value =
        country.name;


    suggestionsContainer.innerHTML =
        "";


    currentSuggestions =
        [];


    selectedSuggestionIndex =
        -1;


    countryInput.focus();

}


// ==========================================
// AUSWAHL HERVORHEBEN
// ==========================================

function updateSuggestionHighlight() {

    const suggestions =
        suggestionsContainer.querySelectorAll(
            ".country-suggestion"
        );


    suggestions.forEach(
        (
            suggestion,
            index
        ) => {

            if (
                index ===
                selectedSuggestionIndex
            ) {

                suggestion.classList.add(
                    "selected"
                );

            }

            else {

                suggestion.classList.remove(
                    "selected"
                );

            }

        }
    );


    if (
        selectedSuggestionIndex >= 0
    ) {

        const selected =
            suggestions[
                selectedSuggestionIndex
            ];


        if (
            selected
        ) {

            selected.scrollIntoView({
                block:
                    "nearest"
            });

        }

    }

}


// ==========================================
// TASTATUR-NAVIGATION
// ==========================================

countryInput.addEventListener(
    "keydown",
    event => {

        // ==================================
        // ESCAPE
        // ==================================

        if (
            event.key === "Escape"
        ) {

            suggestionsContainer.innerHTML =
                "";


            currentSuggestions =
                [];


            selectedSuggestionIndex =
                -1;


            return;

        }


        // ==================================
        // PFEIL NACH UNTEN
        // ==================================

        if (
            event.key === "ArrowDown"
        ) {

            if (
                currentSuggestions.length === 0
            ) {

                return;

            }


            event.preventDefault();


            if (
                selectedSuggestionIndex <
                currentSuggestions.length - 1
            ) {

                selectedSuggestionIndex++;

            }

            else {

                selectedSuggestionIndex =
                    0;

            }


            updateSuggestionHighlight();


            return;

        }


        // ==================================
        // PFEIL NACH OBEN
        // ==================================

        if (
            event.key === "ArrowUp"
        ) {

            if (
                currentSuggestions.length === 0
            ) {

                return;

            }


            event.preventDefault();


            if (
                selectedSuggestionIndex <= 0
            ) {

                selectedSuggestionIndex =
                    currentSuggestions.length - 1;

            }

            else {

                selectedSuggestionIndex--;

            }


            updateSuggestionHighlight();


            return;

        }


        // ==================================
        // ENTER
        // ==================================

        if (
            event.key === "Enter"
        ) {

            if (
                selectedSuggestionIndex >= 0 &&
                currentSuggestions.length > 0
            ) {

                event.preventDefault();


                selectSuggestion(
                    selectedSuggestionIndex
                );


                return;

            }


            suggestionsContainer.innerHTML =
                "";


            makeGuess();

        }

    }
);


// ==========================================
// ZIELLAND LADEN
// ==========================================

async function loadTargetCountry() {

    try {

        targetCountry =
            await getRandomCountry();


        targetColors =
            await getCountryColors(
                targetCountry.id
            );


        targetWars =
            await getCountryWars(
                targetCountry.id
            );


        console.log(
            "Zielland:",
            targetCountry
        );


        console.log(
            "Flaggenfarben:",
            getColorArray(
                targetColors
            )
        );


        console.log(
            "Kriege:",
            targetWars
        );


        message.textContent =
            "Ein Land wurde ausgewählt. Viel Erfolg!";

    }

    catch (error) {

        console.error(
            "Fehler beim Laden des Spiels:",
            error
        );


        message.textContent =
            "Das Spiel konnte nicht gestartet werden.";

    }

}


// ==========================================
// INDIzien INITIALISIEREN
// ==========================================

async function initializeHints() {

    if (!areHintsEnabled()) {
        return;
    }


    try {

        const hintCountries =
            await getHintCountries();


        resetHints();


        initializeHintCandidates(
            hintCountries
        );


        renderHints();

    }

    catch (error) {

        console.error(
            "Fehler beim Initialisieren der Indizien:",
            error
        );

    }

}


// ==========================================
// NEUES SPIEL
// ==========================================

async function restartGame() {

    closeVictoryPopup();


    targetCountry =
        null;


    targetColors =
        [];


    targetWars =
        [];


    guessedCountries =
        [];


    victoryCountry =
        null;


    gameOver =
        false;


    currentSuggestions =
        [];


    selectedSuggestionIndex =
        -1;


    countryInput.value =
        "";


    countryInput.disabled =
        false;


    guessButton.disabled =
        false;


    suggestionsContainer.innerHTML =
        "";


    guessesContainer.innerHTML =
        "";


    resetHints();


    updateHintsVisibility();


    /*
     * Buttons wieder in den Zustand
     * eines laufenden Spiels versetzen.
     */

    updateGameButtons();


    if (areHintsEnabled()) {

        renderHints();

    }


    message.textContent =
        "Neues Spiel wird gestartet...";


    await loadTargetCountry();


    if (areHintsEnabled()) {

        await initializeHints();

    }

}


// ==========================================
// GUESS
// ==========================================

async function makeGuess() {

    if (
        gameOver
    ) {

        return;

    }


    const input =
        countryInput.value.trim();


    if (
        input === ""
    ) {

        message.textContent =
            "Bitte ein Land eingeben.";


        return;

    }


    const country =
        await getCountryByName(
            input
        );


    if (
        !country
    ) {

        message.textContent =
            "Dieses Land befindet sich nicht in der Datenbank.";


        return;

    }


    // ======================================
    // JEDES LAND DARF GERATEN WERDEN
    // ======================================

    if (
        guessedCountries.includes(
            country.id
        )
    ) {

        message.textContent =
            "Dieses Land hast du bereits geraten.";


        return;

    }


    guessedCountries.push(
        country.id
    );


    countryInput.value =
        "";


    suggestionsContainer.innerHTML =
        "";


    currentSuggestions =
        [];


    selectedSuggestionIndex =
        -1;


    // ======================================
    // RICHTIG GERATEN
    // ======================================

    if (
        Number(country.id) ===
        Number(targetCountry.id)
    ) {

        addGuess(
            country,
            null,
            true
        );


        /*
         * Die separate "Gewonnen!"-Meldung
         * wird nicht mehr verwendet.
         *
         * Die eigentliche Siegmeldung wird
         * direkt in ui.js innerhalb des
         * Guess-Elements erzeugt.
         */

        message.textContent =
            "";


        gameOver =
            true;


        countryInput.disabled =
            true;


        guessButton.disabled =
            true;


        /*
         * Das gewonnene Land speichern,
         * damit das Ergebnis später erneut
         * geöffnet werden kann.
         */

        victoryCountry =
            country;


        /*
         * Nach dem Sieg:
         *
         * Neues Spiel → sichtbar
         * Zur Startseite → sichtbar
         * Ergebnis anzeigen → zunächst versteckt
         */

        updateGameButtons();


        showVictoryPopup(
            country
        );


        return;

    }


    // ======================================
    // VERGLEICH
    // ======================================

    try {

        const guessedColors =
            await getCountryColors(
                country.id
            );


        const guessedRelationships =
            await getCountryRelationships(
                country.id,
                targetCountry.id
            );


        const guessedWars =
            await getCountryWars(
                country.id
            );


        const guessedWarIds =
            guessedWars.map(
                war =>
                    war.war_id
            );


        const targetWarIds =
            targetWars.map(
                war =>
                    war.war_id
            );


        const commonWarIds =
            guessedWarIds.filter(
                id =>
                    targetWarIds.includes(
                        id
                    )
            );


        const commonWars =
            await getWarsByIds(
                commonWarIds
            );


        const comparison =
            createComparison(
                country,
                guessedColors,
                guessedWars,
                commonWars,
                guessedRelationships
            );


        // ==================================
        // INDIzien AKTUALISIEREN
        // ==================================

        if (areHintsEnabled()) {

            updateHints(
                country,
                comparison
            );

        }


        // ==================================
        // GUESS ANZEIGEN
        // ==================================

        addGuess(
            country,
            comparison
        );


        message.textContent =
            "Das war nicht das gesuchte Land.";

    }

    catch (error) {

        console.error(
            "Fehler beim Verarbeiten des Guesses:",
            error
        );


        message.textContent =
            "Beim Ermitteln der Daten ist ein Fehler aufgetreten.";

    }

}


// ==========================================
// SIEGES-POPUP
// ==========================================

async function showVictoryPopup(
    country
) {

    if (!country) {
        return;
    }


    // ======================================
    // LANDESNAME
    // ======================================

    victoryCountryName.textContent =
        country.name;


    // ======================================
    // FLAGGE
    // ======================================

    if (
        country.iso_code
    ) {

        const isoCode =
            country.iso_code
                .toLowerCase();


        victoryFlag.src =
            `https://flagcdn.com/w640/${isoCode}.png`;


        victoryFlag.alt =
            `Flagge von ${country.name}`;


        victoryFlag.style.display =
            "block";

    }

    else {

        victoryFlag.removeAttribute(
            "src"
        );


        victoryFlag.alt =
            "";


        victoryFlag.style.display =
            "none";

    }


    // ======================================
    // DATEN ZURÜCKSETZEN
    // ======================================

    victoryData.innerHTML =
        "";


    victoryBorders.innerHTML =
        "";


    // ======================================
    // HAUPTSTADT
    // ======================================

    addVictoryData(
        "Hauptstadt",
        country.capital
    );


    // ======================================
    // KONTINENT
    // ======================================

    addVictoryData(
        "Kontinent",
        country.continent
    );


    // ======================================
    // UN-M49-REGION
    // ======================================

    addVictoryData(
        "Region",
        country.region
    );


    // ======================================
    // UNABHÄNGIGKEIT
    // ======================================

    if (
        country.independence_date
    ) {

        const date =
            new Date(
                `${country.independence_date}T00:00:00`
            );


        addVictoryData(
            "Unabhängigkeit",
            date.toLocaleDateString(
                "de-DE"
            )
        );

    }


    // ======================================
    // SPRACHEN
    // ======================================

    if (
        Array.isArray(
            country.languages
        ) &&
        country.languages.length > 0
    ) {

        addVictoryData(
            "Sprachen",
            country.languages.join(
                ", "
            )
        );

    }


    // ======================================
    // MEERE / OZEANE
    // ======================================

    if (
        Array.isArray(
            country.seas
        ) &&
        country.seas.length > 0
    ) {

        addVictoryData(
            "Meere / Ozeane",
            country.seas.join(
                ", "
            )
        );

    }


    // ======================================
    // NACHBARLÄNDER
    // ======================================

    if (
        Array.isArray(
            country.borders
        ) &&
        country.borders.length > 0
    ) {

        try {

            const borderCountries =
                await getCountriesByIds(
                    country.borders
                );


            if (
                borderCountries.length > 0
            ) {

                const title =
                    document.createElement(
                        "h4"
                    );


                title.textContent =
                    "Nachbarländer";


                victoryBorders.appendChild(
                    title
                );


                const borderList =
                    document.createElement(
                        "div"
                    );


                borderList.className =
                    "border-list";


                borderCountries.forEach(
                    borderCountry => {

                        const border =
                            document.createElement(
                                "span"
                            );


                        border.className =
                            "border-country";


                        border.textContent =
                            borderCountry.name;


                        borderList.appendChild(
                            border
                        );

                    }
                );


                victoryBorders.appendChild(
                    borderList
                );

            }

        }

        catch (error) {

            console.error(
                "Fehler beim Laden der Nachbarländer:",
                error
            );

        }

    }


    // ======================================
    // POPUP ÖFFNEN
    // ======================================

    victoryModal.classList.add(
        "visible"
    );


    victoryModal.setAttribute(
        "aria-hidden",
        "false"
    );


    document.body.classList.add(
        "modal-open"
    );


    /*
     * Beim Öffnen des Ergebnisses darf der
     * erneute Ergebnis-Button nicht sichtbar
     * sein.
     */

    if (showVictoryButton) {

        showVictoryButton.style.display =
            "none";

    }


    setTimeout(
        () => {

            victoryCloseButton.focus();

        },
        100
    );

}


// ==========================================
// DATENZEILE ERSTELLEN
// ==========================================

function addVictoryData(
    label,
    value
) {

    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {

        return;

    }


    const item =
        document.createElement(
            "div"
        );


    item.className =
        "victory-data-item";


    const labelElement =
        document.createElement(
            "span"
        );


    labelElement.className =
        "victory-data-label";


    labelElement.textContent =
        label;


    const valueElement =
        document.createElement(
            "span"
        );


    valueElement.className =
        "victory-data-value";


    valueElement.textContent =
        value;


    item.appendChild(
        labelElement
    );


    item.appendChild(
        valueElement
    );


    victoryData.appendChild(
        item
    );

}


// ==========================================
// POPUP SCHLIESSEN
// ==========================================

function closeVictoryPopup() {

    victoryModal.classList.remove(
        "visible"
    );


    victoryModal.setAttribute(
        "aria-hidden",
        "true"
    );


    document.body.classList.remove(
        "modal-open"
    );


    /*
     * Nur nach einem abgeschlossenen Spiel
     * darf das Ergebnis erneut geöffnet werden.
     */

    if (
        gameOver &&
        victoryCountry &&
        showVictoryButton
    ) {

        showVictoryButtonAfterClose();

    }

}


// ==========================================
// ZUR STARTSEITE
// ==========================================

function backToStart() {

    window.location.href =
        "index.html";

}


// ==========================================
// ERGEBNIS ERNEUT ÖFFNEN
// ==========================================

function reopenVictoryPopup() {

    if (
        !gameOver ||
        !victoryCountry
    ) {

        return;

    }


    showVictoryPopup(
        victoryCountry
    );

}


// ==========================================
// BUTTONS
// ==========================================

guessButton.addEventListener(
    "click",
    makeGuess
);


restartButton.addEventListener(
    "click",
    restartGame
);


if (backToStartButton) {

    backToStartButton.addEventListener(
        "click",
        backToStart
    );

}


if (showVictoryButton) {

    showVictoryButton.addEventListener(
        "click",
        reopenVictoryPopup
    );

}


victoryCloseButton.addEventListener(
    "click",
    closeVictoryPopup
);


victoryContinueButton.addEventListener(
    "click",
    closeVictoryPopup
);


victoryRestartButton.addEventListener(
    "click",
    restartGame
);


victoryOverlay.addEventListener(
    "click",
    closeVictoryPopup
);


// ==========================================
// ESCAPE
// ==========================================

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Escape" &&
            victoryModal.classList.contains(
                "visible"
            )
        ) {

            closeVictoryPopup();

        }

    }
);


// ==========================================
// EINGABE
// ==========================================

countryInput.addEventListener(
    "input",
    showCountrySuggestions
);


// ==========================================
// KLICK AUSSERHALB
// ==========================================

document.addEventListener(
    "click",
    event => {

        if (
            !event.target.closest(
                ".autocomplete-container"
            )
        ) {

            suggestionsContainer.innerHTML =
                "";


            currentSuggestions =
                [];


            selectedSuggestionIndex =
                -1;

        }

    }
);


// ==========================================
// SPIEL STARTEN
// ==========================================

async function startGame() {

    /*
     * Zu Beginn eines Spiels sind:
     *
     * Neues Spiel       → versteckt
     * Zur Startseite    → sichtbar
     * Ergebnis anzeigen → versteckt
     */

    gameOver =
        false;


    victoryCountry =
        null;


    updateGameButtons();


    updateHintsVisibility();


    await loadCountries();


    await loadTargetCountry();


    if (areHintsEnabled()) {

        await initializeHints();

    }

}


startGame();