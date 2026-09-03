// ==========================================
// SUPABASE
// ==========================================

const SUPABASE_URL =
    "https://utxbkbmdjhgsnlksjkst.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_6640Ix-kp0Diy3Crqb3PDw_7g1bK4Ca";


// ==========================================
// ELEMENTE
// ==========================================

const countryInput =
    document.getElementById("countryInput");

const guessButton =
    document.getElementById("guessButton");

const guessesContainer =
    document.getElementById("guesses");

const message =
    document.getElementById("message");


// ==========================================
// SPIELDATEN
// ==========================================

let targetCountry = null;

let targetColors = [];

let targetWars = [];

let guessedCountries = [];

let gameOver = false;


// ==========================================
// SUPABASE REQUEST
// ==========================================

async function supabaseRequest(endpoint) {

    const response =
        await fetch(
            `${SUPABASE_URL}/rest/v1/${endpoint}`,
            {
                headers: {
                    apikey: SUPABASE_KEY,
                    Authorization:
                        `Bearer ${SUPABASE_KEY}`
                }
            }
        );


    if (!response.ok) {

        throw new Error(
            `HTTP ${response.status}: ${await response.text()}`
        );

    }


    return await response.json();

}


// ==========================================
// ZIELLAND LADEN
// ==========================================

async function loadTargetCountry() {

    try {

        const result =
            await supabaseRequest(
                "rpc/get_random_country"
            );


        if (
            !result ||
            result.length === 0
        ) {

            throw new Error(
                "Kein Zielland erhalten."
            );

        }


        targetCountry =
            result[0];


        // ----------------------------------
        // Flaggenfarben
        // ----------------------------------

        targetColors =
            await getCountryColors(
                targetCountry.id
            );


        // ----------------------------------
        // Kriege
        // ----------------------------------

        targetWars =
            await getCountryWars(
                targetCountry.id
            );


        console.log(
            "Zielland:",
            targetCountry
        );

        console.log(
            "Zielland Flaggenfarben:",
            getColorArray(targetColors)
        );

        console.log(
            "Zielland Kriege:",
            targetWars
        );


        message.textContent =
            "Ein Land wurde ausgewählt. Viel Erfolg!";


    } catch (error) {

        console.error(
            "Fehler beim Laden des Spiels:",
            error
        );


        message.textContent =
            "Das Spiel konnte nicht gestartet werden.";

    }

}


// ==========================================
// LAND SUCHEN
// ==========================================

async function getCountryByName(name) {

    const encodedName =
        encodeURIComponent(name);


    const result =
        await supabaseRequest(
            `countries?select=*&name=eq.${encodedName}`
        );


    if (
        !result ||
        result.length === 0
    ) {

        return null;

    }


    return result[0];

}


// ==========================================
// FLAGGENFARBEN LADEN
// ==========================================

async function getCountryColors(countryId) {

    const result =
        await supabaseRequest(
            `flag_colors?select=*&country_id=eq.${countryId}`
        );


    return result || [];

}


// ==========================================
// FLAGGENFARBEN IN ARRAY UMWANDELN
// ==========================================

function getColorArray(colors) {

    if (
        !Array.isArray(colors)
    ) {

        return [];

    }


    return [
        ...new Set(
            colors
                .map(
                    entry => {

                        if (
                            !entry ||
                            entry.color === null ||
                            entry.color === undefined
                        ) {

                            return "";

                        }


                        return String(
                            entry.color
                        )
                            .trim()
                            .toLowerCase();

                    }
                )
                .filter(
                    color =>
                        color.length > 0
                )
        )
    ];

}


// ==========================================
// FLAGGENFARBEN VERGLEICHEN
// ==========================================

function compareColors(
    guessedColors,
    targetColors
) {

    const guessedColorArray =
        getColorArray(
            guessedColors
        );


    const targetColorArray =
        getColorArray(
            targetColors
        );


    // Jede Farbe einzeln vergleichen.
    // Eine einzige gemeinsame Farbe reicht
    // für eine Übereinstimmung.

    const sharedColors =
        guessedColorArray.filter(
            color =>
                targetColorArray.includes(
                    color
                )
        );


    console.log(
        "Geratene Farben:",
        guessedColorArray
    );

    console.log(
        "Zielfarben:",
        targetColorArray
    );

    console.log(
        "Gemeinsame Farben:",
        sharedColors
    );


    return {

        match:
            sharedColors.length > 0,

        guessedColors:
            guessedColorArray,

        targetColors:
            targetColorArray,

        sharedColors:
            sharedColors

    };

}


// ==========================================
// BEZIEHUNGEN LADEN
// ==========================================

async function getCountryRelationships(
    countryId,
    targetId
) {

    return await supabaseRequest(
        `relationships?select=*&or=(and(country_a.eq.${countryId},country_b.eq.${targetId}),and(country_a.eq.${targetId},country_b.eq.${countryId}))`
    );

}


// ==========================================
// KRIEGE LADEN
// ==========================================

async function getCountryWars(countryId) {

    return await supabaseRequest(
        `country_wars?select=*&country_id=eq.${countryId}`
    );

}


// ==========================================
// KRIEGSNAMEN LADEN
// ==========================================

async function getWarsByIds(warIds) {

    if (
        !warIds ||
        warIds.length === 0
    ) {

        return [];

    }


    const ids =
        warIds.join(",");


    return await supabaseRequest(
        `wars?select=*&id=in.(${ids})`
    );

}


// ==========================================
// KRIEGE VERGLEICHEN
// ==========================================

function compareWars(
    guessedWars,
    targetWars,
    commonWars
) {

    if (
        commonWars.length === 0
    ) {

        return {

            match: false,

            title: "Krieg",

            value:
                "Keine Übereinstimmung",

            tooltip:
                "Die beiden Länder waren an keinem gemeinsamen Krieg beteiligt."

        };

    }


    const details = [];


    for (
        const war of commonWars
    ) {

        const guessed =
            guessedWars.find(
                entry =>
                    entry.war_id === war.id
            );


        const target =
            targetWars.find(
                entry =>
                    entry.war_id === war.id
            );


        if (
            !guessed ||
            !target
        ) {

            continue;

        }


        if (
            guessed.side ===
            target.side
        ) {

            details.push(
                `${war.name}: gleiche Seite`
            );

        } else if (
            guessed.side !== "Neutral" &&
            target.side !== "Neutral"
        ) {

            details.push(
                `${war.name}: Gegner`
            );

        } else {

            details.push(
                `${war.name}: Beteiligung`
            );

        }

    }


    return {

        match: true,

        title: "Krieg",

        value:
            `${commonWars.length} gemeinsame${commonWars.length === 1 ? "r" : ""} Krieg${commonWars.length === 1 ? "" : "e"}`,

        tooltip:
            details.length > 0
                ? details.join("\n")
                : "Gemeinsamer Krieg vorhanden."

    };

}


// ==========================================
// SONSTIGE BEZIEHUNGEN VERGLEICHEN
// ==========================================

function compareRelationships(
    relationships
) {

    if (
        !relationships ||
        relationships.length === 0
    ) {

        return {

            match: false,

            title: "Beziehungen",

            value:
                "Keine Übereinstimmung",

            tooltip:
                "Es wurde keine sonstige historische Beziehung gefunden."

        };

    }


    const relationshipNames = [];


    for (
        const relationship of relationships
    ) {

        switch (
            relationship.type
        ) {

            case "neighbor":

                relationshipNames.push(
                    "Nachbar"
                );

                break;


            case "war_ally":

                relationshipNames.push(
                    "Historischer Verbündeter"
                );

                break;


            case "alliance":

                relationshipNames.push(
                    "Bündnis"
                );

                break;


            case "invaded":

                relationshipNames.push(
                    "Invasion"
                );

                break;


            case "historical_conflict":

                relationshipNames.push(
                    "Historischer Konflikt"
                );

                break;


            case "historical":

                relationshipNames.push(
                    "Historische Verbindung"
                );

                break;


            case "cooperation":

                relationshipNames.push(
                    "Historische Zusammenarbeit"
                );

                break;


            default:

                relationshipNames.push(
                    relationship.type
                );

                break;

        }

    }


    const uniqueRelationships =
        [
            ...new Set(
                relationshipNames
            )
        ];


    return {

        match: true,

        title: "Beziehungen",

        value:
            `${uniqueRelationships.length} Übereinstimmung${uniqueRelationships.length === 1 ? "" : "en"}`,

        tooltip:
            uniqueRelationships.join("\n")

    };

}


// ==========================================
// KATEGORIEN ERSTELLEN
// ==========================================

function createComparison(
    country,
    guessedColors,
    guessedWars,
    commonWars,
    relationships
) {

    // --------------------------------------
    // KONTINENT
    // --------------------------------------

    const continentMatch =
        country.continent ===
        targetCountry.continent;


    const continent = {

        match:
            continentMatch,

        title:
            "Kontinent",

        value:
            country.continent,

        tooltip:
            continentMatch
                ? `Beide Länder liegen in ${targetCountry.continent}.`
                : `Geraten: ${country.continent}\nGesucht: ${targetCountry.continent}`

    };


    // --------------------------------------
    // FLAGGENFARBEN
    // --------------------------------------

    const colorComparison =
        compareColors(
            guessedColors,
            targetColors
        );


    const colors = {

        match:
            colorComparison.match,

        title:
            "Flaggenfarben",

        value:
            colorComparison.match
                ? `${colorComparison.sharedColors.length} gemeinsame Farbe${colorComparison.sharedColors.length === 1 ? "" : "n"}`
                : "Keine Übereinstimmung",

        tooltip:
            colorComparison.match
                ? `Gemeinsame Farben:\n${colorComparison.sharedColors.join("\n")}`
                : `Geraten:\n${colorComparison.guessedColors.join("\n")}\n\nGesucht:\n${colorComparison.targetColors.join("\n")}`

    };


    // --------------------------------------
    // KRIEGE
    // --------------------------------------

    const wars =
        compareWars(
            guessedWars,
            targetWars,
            commonWars
        );


    // --------------------------------------
    // SONSTIGE BEZIEHUNGEN
    // --------------------------------------

    const otherRelationships =
        compareRelationships(
            relationships
        );


    return {

        continent:
            continent,

        colors:
            colors,

        wars:
            wars,

        relationships:
            otherRelationships

    };

}


// ==========================================
// GUESS
// ==========================================

async function makeGuess() {

    if (gameOver) {
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


    // --------------------------------------
    // LAND LADEN
    // --------------------------------------

    const country =
        await getCountryByName(
            input
        );


    if (!country) {

        message.textContent =
            "Dieses Land befindet sich nicht in der Datenbank.";

        return;

    }


    // --------------------------------------
    // DOPPELTEN GUESS VERHINDERN
    // --------------------------------------

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


    // --------------------------------------
    // RICHTIG
    // --------------------------------------

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


    // --------------------------------------
    // DATEN LADEN
    // --------------------------------------

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


        // ----------------------------------
        // GEMEINSAME KRIEGE
        // ----------------------------------

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


        // ----------------------------------
        // VERGLEICH
        // ----------------------------------

        const comparison =
            createComparison(
                country,
                guessedColors,
                guessedWars,
                commonWars,
                guessedRelationships
            );


        // ----------------------------------
        // GUESS ANZEIGEN
        // ----------------------------------

        addGuess(
            country,
            comparison
        );


        message.textContent =
            "Das war nicht das gesuchte Land.";


    } catch (error) {

        console.error(
            "Fehler beim Verarbeiten des Guesses:",
            error
        );


        message.textContent =
            "Beim Ermitteln der Daten ist ein Fehler aufgetreten.";

    }

}


// ==========================================
// GUESS ANZEIGEN
// ==========================================

function addGuess(
    country,
    comparison,
    correct = false
) {

    const element =
        document.createElement("div");


    element.classList.add(
        "guess"
    );


    // --------------------------------------
    // LANDNAME
    // --------------------------------------

    const countryName =
        document.createElement("strong");


    countryName.textContent =
        country.name;


    element.appendChild(
        countryName
    );


    // --------------------------------------
    // RICHTIG
    // --------------------------------------

    if (correct) {

        const correctMessage =
            document.createElement("div");


        correctMessage.classList.add(
            "correct-message"
        );


        correctMessage.textContent =
            "Richtig! Du hast das gesuchte Land gefunden.";


        element.appendChild(
            correctMessage
        );


        guessesContainer.appendChild(
            element
        );


        return;

    }


    // --------------------------------------
    // 2 × 2 KATEGORIEN
    // --------------------------------------

    const categoryGrid =
        document.createElement("div");


    categoryGrid.classList.add(
        "category-grid"
    );


    addCategoryBox(
        categoryGrid,
        comparison.continent
    );


    addCategoryBox(
        categoryGrid,
        comparison.colors
    );


    addCategoryBox(
        categoryGrid,
        comparison.wars
    );


    addCategoryBox(
        categoryGrid,
        comparison.relationships
    );


    element.appendChild(
        categoryGrid
    );


    guessesContainer.appendChild(
        element
    );

}


// ==========================================
// KATEGORIE-BOX
// ==========================================

function addCategoryBox(
    container,
    category
) {

    const box =
        document.createElement("div");


    box.classList.add(
        "category-box"
    );


    if (
        category.match
    ) {

        box.classList.add(
            "match"
        );

    } else {

        box.classList.add(
            "no-match"
        );

    }


    // --------------------------------------
    // TITEL
    // --------------------------------------

    const title =
        document.createElement("strong");


    title.textContent =
        category.title;


    // --------------------------------------
    // WERT
    // --------------------------------------

    const value =
        document.createElement("span");


    value.textContent =
        category.value;


    // --------------------------------------
    // TOOLTIP
    // --------------------------------------

    const tooltip =
        document.createElement("div");


    // WICHTIG:
    // CSS verwendet ebenfalls custom-tooltip

    tooltip.classList.add(
        "custom-tooltip"
    );


    tooltip.textContent =
        category.tooltip;


    box.appendChild(
        title
    );

    box.appendChild(
        value
    );

    box.appendChild(
        tooltip
    );


    container.appendChild(
        box
    );

}


// ==========================================
// EVENTS
// ==========================================

guessButton.addEventListener(
    "click",
    makeGuess
);


countryInput.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Enter"
        ) {

            makeGuess();

        }

    }
);


// ==========================================
// SPIEL STARTEN
// ==========================================

loadTargetCountry();