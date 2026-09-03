// ==========================================
// KRIEGE
// ==========================================


// ==========================================
// KRIEGE EINES LANDES LADEN
// ==========================================

async function getCountryWars(countryId) {

    const result =
        await supabaseRequest(
            `country_wars?select=*&country_id=eq.${countryId}`
        );


    return result || [];

}


// ==========================================
// KRIEGE NACH IDS LADEN
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

            title:
                "Kriege",

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

        }

        else if (
            guessed.side !== "Neutral" &&
            target.side !== "Neutral"
        ) {

            details.push(
                `${war.name}: Gegner`
            );

        }

        else {

            details.push(
                `${war.name}: Beteiligung`
            );

        }

    }


    return {

        match: true,

        title:
            "Kriege",

        value:
            `${commonWars.length} gemeinsame${commonWars.length === 1 ? "r" : ""} Krieg${commonWars.length === 1 ? "" : "e"}`,

        tooltip:
            details.length > 0
                ? details.join("\n")
                : "Gemeinsamer Krieg vorhanden."

    };

}