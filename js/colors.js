// ==========================================
// FLAGGENFARBEN
// ==========================================


// ==========================================
// FLAGGENFARBEN LADEN
// ==========================================

async function getCountryColors(countryId) {

    const result =
        await supabaseRequest(
            `countries?select=flag_colors&id=eq.${countryId}`
        );


    if (
        !Array.isArray(result) ||
        result.length === 0
    ) {

        return [];

    }


    return result[0].flag_colors || [];

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
                    color =>
                        String(
                            color
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