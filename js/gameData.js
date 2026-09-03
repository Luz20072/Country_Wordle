// ==========================================
// SUPABASE
// ==========================================

const SUPABASE_URL =
    "https://utxbkbmdjhgsnlksjkst.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_6640Ix-kp0Diy3Crqb3PDw_7g1bK4Ca";


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
// ZUFÄLLIGES LAND LADEN
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
// LAND NACH NAMEN LADEN
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

    return [
        ...new Set(
            colors
                .map(
                    entry =>
                        String(entry.color)
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
// BEZIEHUNGEN LADEN
// ==========================================

async function getCountryRelationships(
    countryId,
    targetId
) {

    const result =
        await supabaseRequest(
            `relationships?select=*&or=(and(country_a.eq.${countryId},country_b.eq.${targetId}),and(country_a.eq.${targetId},country_b.eq.${countryId}))`
        );


    return result || [];

}


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


    const result =
        await supabaseRequest(
            `wars?select=*&id=in.(${ids})`
        );


    return result || [];

}