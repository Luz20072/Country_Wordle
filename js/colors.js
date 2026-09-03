// ==========================================
// FLAGGENFARBEN
// ==========================================


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
// FARBEN IN ARRAY UMWANDELN
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
                    entry =>
                        String(
                            entry.color
                        )
                        .trim()
                        .toLowerCase()
                )
                .filter(
                    color =>
                        color !== ""
                )
        )
    ];

}


// ==========================================
// FARBEN VERGLEICHEN
// ==========================================

function compareColors(
    guessedColors,
    targetColors
) {

    const guessedArray =
        getColorArray(
            guessedColors
        );


    const targetArray =
        getColorArray(
            targetColors
        );


    const sharedColors =
        guessedArray.filter(
            color =>
                targetArray.includes(
                    color
                )
        );


    return {

        match:
            sharedColors.length > 0,

        guessedColors:
            guessedArray,

        targetColors:
            targetArray,

        sharedColors:
            sharedColors

    };

}