// ==========================================
// VERGLEICHE
// ==========================================


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


    const sharedColors =
        guessedColorArray.filter(
            color =>
                targetColorArray.includes(
                    color
                )
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
// KRIEGE VERGLEICHEN
// ==========================================

function compareWars(
    guessedWars,
    targetWars,
    commonWars
) {

    if (
        !commonWars ||
        commonWars.length === 0
    ) {

        return {

            match:
                false,

            title:
                "Krieg",

            value:
                "Keine Übereinstimmung",

            tooltip:
                "Die beiden Länder waren an keinem gemeinsamen Krieg beteiligt."

        };

    }


    const details = [];


    for (
        const war
        of commonWars
    ) {

        const guessed =
            guessedWars.find(
                entry =>
                    Number(entry.war_id) ===
                    Number(war.id)
            );


        const target =
            targetWars.find(
                entry =>
                    Number(entry.war_id) ===
                    Number(war.id)
            );


        if (
            !guessed ||
            !target
        ) {

            continue;

        }


        /*
         * Die eigentliche Auswertung der
         * Beziehung zwischen den Ländern
         * erfolgt später in hints.js.
         *
         * comparison.js stellt hier nur fest,
         * dass ein gemeinsamer Krieg existiert.
         */

        details.push(
            war.name
        );

    }


    return {

        match:
            details.length > 0,

        title:
            "Krieg",

        value:
            `${details.length} gemeinsamer${details.length === 1 ? "" : "e"} Krieg${details.length === 1 ? "" : "e"}`,

        tooltip:
            details.length > 0
                ? details.join("\n")
                : "Gemeinsamer Krieg vorhanden.",

        sharedWars:
            commonWars

    };

}


// ==========================================
// SONSTIGE BEZIEHUNGEN
// ==========================================

function compareRelationships(
    relationships
) {

    if (
        !relationships ||
        relationships.length === 0
    ) {

        return {

            match:
                false,

            title:
                "Beziehungen",

            value:
                "Keine Übereinstimmung",

            tooltip:
                "Keine Beziehung zwischen den Ländern."

        };

    }


    const relationshipNames = [];


    for (
        const relationship
        of relationships
    ) {

        if (
            relationship.type === "war_enemy" ||
            relationship.type === "war_ally"
        ) {

            continue;

        }


        switch (
            relationship.type
        ) {

            case "border":

                relationshipNames.push(
                    "Beide Länder sind Nachbarn."
                );

                break;


            case "same_region":

                relationshipNames.push(
                    "Beide Länder liegen in derselben UN-Region."
                );

                break;


            case "same_sea":

                relationshipNames.push(
                    "Beide Länder grenzen an dasselbe Meer oder denselben Ozean."
                );

                break;


            case "former_union":

                relationshipNames.push(
                    "Beide Länder waren Teil eines gemeinsamen Staates."
                );

                break;


            case "former_colonie":

                relationshipNames.push(
                    "Zwischen beiden Ländern bestand eine koloniale Beziehung."
                );

                break;


            case "cultural":

                relationshipNames.push(
                    "Beide Länder haben eine gemeinsame Amtssprache."
                );

                break;


            case "special":

                relationshipNames.push(
                    "Beide Länder haben eine besondere Beziehung."
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


    if (
        uniqueRelationships.length === 0
    ) {

        return {

            match:
                false,

            title:
                "Beziehungen",

            value:
                "Keine Übereinstimmung",

            tooltip:
                "Keine Beziehung zwischen den Ländern."

        };

    }


    return {

        match:
            true,

        title:
            "Beziehungen",

        value:
            `${uniqueRelationships.length} Übereinstimmung${uniqueRelationships.length === 1 ? "" : "en"}`,

        tooltip:
            uniqueRelationships.join("\n"),

        rawRelationships:
            relationships

    };

}


// ==========================================
// ALLE VERGLEICHE ERSTELLEN
// ==========================================

function createComparison(
    country,
    guessedColors,
    guessedWars,
    commonWars,
    relationships
) {

    // ======================================
    // KONTINENT
    // ======================================

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

                : "Das geratene Land liegt auf einem anderen Kontinent."

    };


    // ======================================
    // FLAGGENFARBEN
    // ======================================

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

                ? `Gemeinsame Farben: ${colorComparison.sharedColors.join(", ")}`

                : "Keine gemeinsame Farbe",

        sharedColors:
            colorComparison.sharedColors

    };


    // ======================================
    // KRIEGE
    // ======================================

    const wars =
        compareWars(
            guessedWars,
            targetWars,
            commonWars
        );


    // ======================================
    // BEZIEHUNGEN
    // ======================================

    const otherRelationships =
        compareRelationships(
            relationships
        );


    // ======================================
    // REGION
    // ======================================

    const regionMatch =
        relationships.some(
            relationship =>
                relationship.type ===
                "same_region"
        );


    const region = {

        match:
            regionMatch

    };


    // ======================================
    // GEWÄSSER
    // ======================================

    const guessedSeas =
        Array.isArray(
            country.seas
        )
            ? country.seas
            : [];


    const targetSeas =
        Array.isArray(
            targetCountry.seas
        )
            ? targetCountry.seas
            : [];


    const commonSeas =
        guessedSeas.filter(
            sea =>
                targetSeas.includes(
                    sea
                )
        );


    const water = {

        match:
            commonSeas.length > 0,

        sharedValues:
            commonSeas

    };


    // ======================================
    // SPRACHEN
    // ======================================

    const guessedLanguages =
        Array.isArray(
            country.languages
        )
            ? country.languages
            : [];


    const targetLanguages =
        Array.isArray(
            targetCountry.languages
        )
            ? targetCountry.languages
            : [];


    const commonLanguages =
        guessedLanguages.filter(
            language =>
                targetLanguages.includes(
                    language
                )
        );


    const language = {

        match:
            commonLanguages.length > 0,

        sharedValues:
            commonLanguages

    };


    // ======================================
    // ERGEBNIS
    // ======================================

    return {

        continent:
            continent,

        colors:
            colors,

        wars:
            wars,

        relationships:
            otherRelationships,

        region:
            region,

        water:
            water,

        language:
            language

    };

}