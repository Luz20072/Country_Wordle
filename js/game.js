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


const victoryAttempts =
    document.getElementById(
        "victoryAttempts"
    );


const victoryMap =
    document.getElementById(
        "victoryMap"
    );


const victoryMapCanvas =
    document.getElementById(
        "victoryMapCanvas"
    );


const victoryMapLoading =
    document.getElementById(
        "victoryMapLoading"
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
// VERGRÖSSERTE KARTE
// ==========================================

const victoryMapModal =
    document.getElementById(
        "victoryMapModal"
    );


const victoryMapLarge =
    document.getElementById(
        "victoryMapLarge"
    );


const victoryMapClose =
    document.getElementById(
        "victoryMapClose"
    );


const victoryMapModalOverlay =
    document.querySelector(
        ".victory-map-modal-overlay"
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
// KARTEN-DATEN
// ==========================================

let victoryMapInstance = null;

let victoryMapLargeInstance = null;

let victoryMapLatitude = null;

let victoryMapLongitude = null;


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

    closeVictoryMap();

    closeVictoryPopup();


    if (victoryMapInstance) {

        victoryMapInstance.remove();

        victoryMapInstance =
            null;

    }


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


    victoryMapLatitude =
        null;


    victoryMapLongitude =
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
    countryInput.value
        .trim()
        .toLowerCase();

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
    // BEREITS GERATEN?
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


        recordGame(
            targetCountry.continent,
            guessedCountries.length
        );


        message.textContent =
            "";


        gameOver =
            true;


        countryInput.disabled =
            true;


        guessButton.disabled =
            true;


        victoryCountry =
            country;


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
// ZAHLEN FORMATIEREN
// ==========================================

function formatArea(
    area
) {

    if (
        area === null ||
        area === undefined ||
        area === ""
    ) {

        return "Keine Angabe";

    }


    const numericArea =
        Number(
            area
        );


    if (
        !Number.isFinite(
            numericArea
        )
    ) {

        return "Keine Angabe";

    }


    return (
        new Intl.NumberFormat(
            "de-DE"
        ).format(
            Math.round(
                numericArea
            )
        ) +
        " km²"
    );

}


// ==========================================
// BEVÖLKERUNG FORMATIEREN
// ==========================================

function formatPopulation(
    population,
    year
) {

    if (
        population === null ||
        population === undefined ||
        population === ""
    ) {

        return "Keine Angabe";

    }


    const numericPopulation =
        Number(
            population
        );


    if (
        !Number.isFinite(
            numericPopulation
        )
    ) {

        return "Keine Angabe";

    }


    const formatted =
        new Intl.NumberFormat(
            "de-DE"
        ).format(
            Math.round(
                numericPopulation
            )
        );


    if (
        year !== null &&
        year !== undefined &&
        year !== ""
    ) {

        return (
            formatted +
            " (" +
            year +
            ")"
        );

    }


    return formatted;

}


// ==========================================
// DATUM FORMATIEREN
// ==========================================

function formatIndependenceDate(
    dateValue
) {

    if (
        !dateValue
    ) {

        return "Keine Angabe";

    }


    const date =
        new Date(
            `${dateValue}T00:00:00`
        );


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return "Keine Angabe";

    }


    return date.toLocaleDateString(
        "de-DE"
    );

}


// ==========================================
// ARRAY-WERT FORMATIEREN
// ==========================================

function formatCountryArray(
    value
) {

    if (
        !Array.isArray(value) ||
        value.length === 0
    ) {

        return "Keine Angabe";

    }


    return value.join(
        ", "
    );

}


// ==========================================
// VICTORY DATEN HINZUFÜGEN
// ==========================================

function addVictoryData(
    label,
    value,
    category
) {

    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {

        value =
            "Keine Angabe";

    }


    const item =
        document.createElement(
            "div"
        );


    item.className =
        `victory-data-item ${category}`;


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
// VICTORY KARTE
// ==========================================

function hasValidCoordinates(
    country
) {

    if (
        !country
    ) {

        return false;

    }


    const latitude =
        Number(
            country.latitude
        );


    const longitude =
        Number(
            country.longitude
        );


    return (
        Number.isFinite(
            latitude
        ) &&
        Number.isFinite(
            longitude
        ) &&
        latitude >= -90 &&
        latitude <= 90 &&
        longitude >= -180 &&
        longitude <= 180
    );

}


// ==========================================
// LEAFLET KARTE ERSTELLEN
// ==========================================

function initializeVictoryMap(
    country
) {

    if (
        !victoryMap ||
        !window.L
    ) {

        return;

    }


    if (
        !hasValidCoordinates(
            country
        )
    ) {

        if (victoryMapLoading) {

            victoryMapLoading.textContent =
                "Keine Kartendaten verfügbar.";

            victoryMapLoading.style.display =
                "flex";

        }


        return;

    }


    const latitude =
        Number(
            country.latitude
        );


    const longitude =
        Number(
            country.longitude
        );


    victoryMapLatitude =
        latitude;


    victoryMapLongitude =
        longitude;


    if (
        victoryMapInstance
    ) {

        victoryMapInstance.remove();

        victoryMapInstance =
            null;

    }


    /*
     * Das alte Canvas wird nicht mehr
     * für die Karte benötigt.
     */

    if (
        victoryMapCanvas
    ) {

        victoryMapCanvas.style.display =
            "none";

    }


    if (
        victoryMapLoading
    ) {

        victoryMapLoading.style.display =
            "flex";

        victoryMapLoading.textContent =
            "Karte wird geladen...";

    }


    victoryMapInstance =
        L.map(
            victoryMap,
            {
                center: [
                    latitude,
                    longitude
                ],

                zoom:
                    4,

                zoomControl:
                    false,

                dragging:
                    false,

                scrollWheelZoom:
                    false,

                doubleClickZoom:
                    false,

                boxZoom:
                    false,

                keyboard:
                    false,

                touchZoom:
                    false,

                attributionControl:
                    false
            }
        );


    L.tileLayer(
        "https://{s}.tile.openstreetmap.de/{z}/{x}/{y}.png",
        {
            maxZoom:
                19,

            attribution:
                '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>-Mitwirkende'
        }
    ).addTo(
        victoryMapInstance
    );


    L.marker(
        [
            latitude,
            longitude
        ]
    )
    .addTo(
        victoryMapInstance
    )
    .bindTooltip(
        country.name,
        {
            direction:
                "top"
        }
    );


    /*
     * Karte nach dem Laden der Tiles
     * korrekt aktualisieren.
     */

    victoryMapInstance.whenReady(
        () => {

            setTimeout(
                () => {

                    if (
                        !victoryMapInstance
                    ) {

                        return;

                    }


                    victoryMapInstance.invalidateSize();


                    victoryMapInstance.setView(
                        [
                            latitude,
                            longitude
                        ],
                        4,
                        {
                            animate:
                                false
                        }
                    );


                    if (
                        victoryMapLoading
                    ) {

                        victoryMapLoading.style.display =
                            "none";

                    }

                },
                300
            );

        }
    );

}


// ==========================================
// KARTE VERGRÖSSERN
// ==========================================

function openVictoryMap() {

    if (
        !victoryMapModal ||
        !victoryMapLarge ||
        !window.L
    ) {

        return;

    }


    if (
        !Number.isFinite(
            victoryMapLatitude
        ) ||
        !Number.isFinite(
            victoryMapLongitude
        )
    ) {

        return;

    }


    victoryMapModal.classList.add(
        "visible"
    );


    victoryMapModal.setAttribute(
        "aria-hidden",
        "false"
    );


    document.body.classList.add(
        "map-modal-open"
    );


    if (
        victoryMapLargeInstance
    ) {

        victoryMapLargeInstance.remove();

        victoryMapLargeInstance =
            null;

    }


    victoryMapLarge.innerHTML =
        "";


    victoryMapLargeInstance =
        L.map(
            victoryMapLarge,
            {
                center: [
                    victoryMapLatitude,
                    victoryMapLongitude
                ],

                zoom:
                    5,

                zoomControl:
                    true,

                dragging:
                    true,

                scrollWheelZoom:
                    true,

                doubleClickZoom:
                    true,

                boxZoom:
                    true,

                keyboard:
                    true,

                touchZoom:
                    true,

                attributionControl:
                    true
            }
        );


    L.tileLayer(
        "https://{s}.tile.openstreetmap.de/{z}/{x}/{y}.png",
        {
            maxZoom:
                19,

            attribution:
                '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>-Mitwirkende'
        }
    ).addTo(
        victoryMapLargeInstance
    );


    if (
        victoryCountry
    ) {

        L.marker(
            [
                victoryMapLatitude,
                victoryMapLongitude
            ]
        )
        .addTo(
            victoryMapLargeInstance
        )
        .bindTooltip(
            victoryCountry.name,
            {
                permanent:
                    true,

                direction:
                    "top"
            }
        );

    }


    victoryMapLargeInstance.whenReady(
        () => {

            setTimeout(
                () => {

                    if (
                        !victoryMapLargeInstance
                    ) {

                        return;

                    }


                    victoryMapLargeInstance.invalidateSize();


                    victoryMapLargeInstance.setView(
                        [
                            victoryMapLatitude,
                            victoryMapLongitude
                        ],
                        5,
                        {
                            animate:
                                false
                        }
                    );

                },
                100
            );

        }
    );

}


// ==========================================
// KARTE SCHLIESSEN
// ==========================================

function closeVictoryMap() {

    if (
        victoryMapModal
    ) {

        victoryMapModal.classList.remove(
            "visible"
        );


        victoryMapModal.setAttribute(
            "aria-hidden",
            "true"
        );

    }


    document.body.classList.remove(
        "map-modal-open"
    );


    if (
        victoryMapLargeInstance
    ) {

        victoryMapLargeInstance.remove();

        victoryMapLargeInstance =
            null;

    }

}


// ==========================================
// SIEGES-POPUP
// ==========================================

async function showVictoryPopup(
    country
) {

    if (
        !country
    ) {

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


    victoryAttempts.innerHTML =
        "";


    // ======================================
    // KARTE
    // ======================================

    initializeVictoryMap(
        country
    );


    // ======================================
    // 1. HAUPTSTADT
    // ======================================

    addVictoryData(
        "Hauptstadt",
        country.capital ||
            "Keine Angabe",
        "geography"
    );


    // ======================================
    // 2. KONTINENT
    // ======================================

    addVictoryData(
        "Kontinent",
        country.continent ||
            "Keine Angabe",
        "geography"
    );


    // ======================================
    // 3. REGION
    // ======================================

    addVictoryData(
        "Region",
        country.region ||
            "Keine Angabe",
        "geography"
    );


    // ======================================
    // 4. UNABHÄNGIGKEIT
    // ======================================

    addVictoryData(
        "Unabhängigkeit",
        formatIndependenceDate(
            country.independence_date
        ),
        "history"
    );


    // ======================================
    // 5. FLÄCHE
    // ======================================

    addVictoryData(
        "Fläche",
        formatArea(
            country.area_km2
        ),
        "statistics"
    );


    // ======================================
    // 6. BEVÖLKERUNG
    // ======================================

    addVictoryData(
        "Bevölkerung",
        formatPopulation(
            country.population,
            country.population_year
        ),
        "statistics"
    );


    // ======================================
    // 7. WÄHRUNG
    // ======================================

    addVictoryData(
        "Währung",
        country.currency ||
            "Keine Angabe",
        "state"
    );


    // ======================================
    // 8. REGIERUNGSFORM
    // ======================================

    addVictoryData(
        "Regierungsform",
        country.government_type ||
            "Keine Angabe",
        "state"
    );


    // ======================================
    // 9. SPRACHEN
    // ======================================

    addVictoryData(
        "Sprachen",
        formatCountryArray(
            country.languages
        ),
        "culture"
    );


    // ======================================
    // 10. MEERE / OZEANE
    // ======================================

    addVictoryData(
        "Meere / Ozeane",
        formatCountryArray(
            country.seas
        ),
        "culture"
    );


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
    // VERSUCHE
    // ======================================

    const attemptNumber =
        guessedCountries.length;


    const attemptLabel =
        attemptNumber === 1
            ? "Versuch"
            : "Versuche";


    victoryAttempts.textContent =
        `${attemptNumber} ${attemptLabel}`;


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


    if (
        showVictoryButton
    ) {

        showVictoryButton.style.display =
            "none";

    }


    /*
     * Leaflet muss wissen, dass sich
     * die Größe des sichtbaren Containers
     * geändert hat.
     */

    if (
        victoryMapInstance
    ) {

        setTimeout(
            () => {

                victoryMapInstance.invalidateSize();

            },
            100
        );

    }


    setTimeout(
        () => {

            victoryCloseButton.focus();

        },
        100
    );

}


// ==========================================
// POPUP SCHLIESSEN
// ==========================================

function closeVictoryPopup() {

    closeVictoryMap();


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


if (
    backToStartButton
) {

    backToStartButton.addEventListener(
        "click",
        backToStart
    );

}


if (
    showVictoryButton
) {

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
// KARTE VERGRÖSSERN
// ==========================================

if (
    victoryMap
) {

    victoryMap.addEventListener(
        "click",
        event => {

            /*
             * Klicks auf Leaflet-Elemente wie
             * Attributionen sollen nicht zum
             * Vergrößern führen.
             */

            if (
                event.target.closest(
                    ".leaflet-control"
                )
            ) {

                return;

            }


            openVictoryMap();

        }
    );

}


if (
    victoryMapClose
) {

    victoryMapClose.addEventListener(
        "click",
        closeVictoryMap
    );

}


if (
    victoryMapModalOverlay
) {

    victoryMapModalOverlay.addEventListener(
        "click",
        closeVictoryMap
    );

}


// ==========================================
// ESCAPE
// ==========================================

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key !== "Escape"
        ) {

            return;

        }


        if (
            victoryMapModal &&
            victoryMapModal.classList.contains(
                "visible"
            )
        ) {

            closeVictoryMap();

            return;

        }


        if (
            victoryModal &&
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

    gameOver =
        false;


    victoryCountry =
        null;


    updateGameButtons();


    updateHintsVisibility();


    await loadCountries();


    await loadTargetCountry();


    if (
        areHintsEnabled()
    ) {

        await initializeHints();

    }

}


startGame();
