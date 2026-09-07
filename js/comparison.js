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


    const allies = [];


    const enemies = [];


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


        // ======================================
        // KRIEGSSEITE BESTIMMEN
        // ======================================

        const relation =
            getWarRelation(
                guessed,
                target
            );


        if (
            relation ===
            "Verbündete"
        ) {

            allies.push(
                war.name
            );

        }

        else if (
            relation ===
            "Gegner"
        ) {

            enemies.push(
                war.name
            );

        }

    }


    return {

        match:
            allies.length > 0 ||
            enemies.length > 0,

        title:
            "Krieg",

        value:
            `${allies.length + enemies.length} gemeinsamer${allies.length + enemies.length === 1 ? "" : "e"} Krieg${allies.length + enemies.length === 1 ? "" : "e"}`,

        tooltip:
            {

                allies:
                    allies,

                enemies:
                    enemies

            },

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


    const relationshipItems = [];


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

                relationshipItems.push({

                    symbol:
                        "↔",

                    label:
                        "Nachbarländer"

                });

                break;


            case "same_region":

                relationshipItems.push({

                    symbol:
                        "◎",

                    label:
                        "Gleiche UN-Region"

                });

                break;


            case "same_sea":

                relationshipItems.push({

                    symbol:
                        "≋",

                    label:
                        "Gemeinsames Meer / Ozean"

                });

                break;


            case "former_union":

                relationshipItems.push({

                    symbol:
                        "⛓",

                    label:
                        "Gemeinsamer früherer Staat"

                });

                break;


            case "former_colonie":

                relationshipItems.push({

                    symbol:
                        "⚑",

                    label:
                        "Koloniale Beziehung"

                });

                break;


            case "cultural":

                relationshipItems.push({

                    symbol:
                        "文",

                    label:
                        "Gemeinsame Sprache / Kultur"

                });

                break;

        }

    }


    const uniqueRelationships = [];


    for (
        const relationship
        of relationshipItems
    ) {

        const exists =
            uniqueRelationships.some(
                existing =>
                    existing.label ===
                    relationship.label
            );


        if (
            !exists
        ) {

            uniqueRelationships.push(
                relationship
            );

        }

    }


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
            {

                relationships:
                    uniqueRelationships

            },

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
            {

                match:
                    continentMatch

            }

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
            {

                colors:
                    colorComparison.sharedColors

            },

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