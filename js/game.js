// ==========================================
// SPIEL
// ==========================================


// ==========================================
// ELEMENTE
// ==========================================

const countryInput =
    document.getElementById("countryInput");


const guessButton =
    document.getElementById("guessButton");


const restartButton =
    document.getElementById("restartButton");


const guessesContainer =
    document.getElementById("guesses");


const message =
    document.getElementById("message");


const suggestionsContainer =
    document.getElementById("countrySuggestions");


// ==========================================
// SPIELDATEN
// ==========================================

let targetCountry = null;

let targetColors = [];

let targetWars = [];

let guessedCountries = [];

let gameOver = false;


// ==========================================
// AUTOCOMPLETE-DATEN
// ==========================================

let allCountries = [];

let currentSuggestions = [];

let selectedSuggestionIndex = -1;


// ==========================================
// ALLE LÄNDER DER AUSGEWÄHLTEN
// KONTINENTE LADEN
// ==========================================

async function loadCountries() {

    try {

        const selectedContinents =
            getSelectedContinents();


        if (
            selectedContinents.length === 0
        ) {

            throw new Error(
                "Keine Kontinente ausgewählt."
            );

        }


        const continentFilter =
            selectedContinents
                .map(
                    continent =>
                        `"${continent}"`
                )
                .join(",");


        allCountries =
            await supabaseRequest(
                `countries?select=id,name&continent=in.(${encodeURIComponent(continentFilter)})&order=name`
            );


        console.log(
            "Ausgewählte Kontinente:",
            selectedContinents
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


    suggestionsContainer.innerHTML = "";

    currentSuggestions = [];

    selectedSuggestionIndex = -1;


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
            .slice(0, 8);


    currentSuggestions.forEach(
        (country, index) => {

            const suggestion =
                document.createElement("div");


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

                    selectSuggestion(index);

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

function selectSuggestion(index) {

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

    currentSuggestions = [];

    selectedSuggestionIndex = -1;


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
        (suggestion, index) => {

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
                block: "nearest"
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

            currentSuggestions = [];

            selectedSuggestionIndex = -1;

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

                selectedSuggestionIndex = 0;

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
            getColorArray(targetColors)
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
// NEUES SPIEL
// ==========================================

async function restartGame() {

    targetCountry = null;

    targetColors = [];

    targetWars = [];

    guessedCountries = [];

    gameOver = false;


    currentSuggestions = [];

    selectedSuggestionIndex = -1;


    countryInput.value = "";

    countryInput.disabled = false;

    guessButton.disabled = false;

    suggestionsContainer.innerHTML = "";

    guessesContainer.innerHTML = "";


    message.textContent =
        "Neues Spiel wird gestartet...";


    await loadTargetCountry();

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


    if (
        !allCountries.some(
            availableCountry =>
                Number(availableCountry.id) ===
                Number(country.id)
        )
    ) {

        message.textContent =
            "Dieses Land gehört nicht zu den ausgewählten Kontinenten.";

        return;

    }


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


    countryInput.value = "";

    suggestionsContainer.innerHTML = "";

    currentSuggestions = [];

    selectedSuggestionIndex = -1;


    // ======================================
    // RICHTIG GERATEN
    // ======================================

    if (
        country.id ===
        targetCountry.id
    ) {

        addGuess(
            country,
            null,
            true
        );


        message.textContent =
            "Gewonnen!";


        gameOver =
            true;


        countryInput.disabled =
            true;


        guessButton.disabled =
            true;


        return;

    }


    // ======================================
    // VERGLEICH DURCHFÜHREN
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

            currentSuggestions = [];

            selectedSuggestionIndex = -1;

        }

    }
);


// ==========================================
// SPIEL STARTEN
// ==========================================

async function startGame() {

    await loadCountries();

    await loadTargetCountry();

}


startGame();