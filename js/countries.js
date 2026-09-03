// ==========================================
// LÄNDER
// ==========================================


// ==========================================
// ZIELLAND LADEN
// ==========================================

async function getRandomCountry() {

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


    return result[0];

}


// ==========================================
// LAND NACH NAMEN SUCHEN
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