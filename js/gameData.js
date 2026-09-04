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


    if (
        !response.ok
    ) {

        throw new Error(
            `HTTP ${response.status}: ${await response.text()}`
        );

    }


    return await response.json();

}


// ==========================================
// AUSGEWÄHLTE KONTINENTE
// ==========================================

function getSelectedContinents() {

    const selectedContinents =
        JSON.parse(
            localStorage.getItem(
                "selectedContinents"
            ) || "[]"
        );


    return selectedContinents;

}


// ==========================================
// ZUFÄLLIGES LAND LADEN
// ==========================================

async function getRandomCountry() {

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


    const result =
        await supabaseRequest(
            `countries?select=*&continent=in.(${encodeURIComponent(continentFilter)})`
        );


    if (
        !result ||
        result.length === 0
    ) {

        throw new Error(
            "Keine Länder für die ausgewählten Kontinente gefunden."
        );

    }


    const randomIndex =
        Math.floor(
            Math.random() * result.length
        );


    return result[randomIndex];

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
// BEZIEHUNGEN ZWISCHEN ZWEI LÄNDERN
// ==========================================

async function getCountryRelationships(
    countryId,
    targetId
) {

    // ==========================================
    // BEIDE LÄNDER LADEN
    // ==========================================

    const countries =
        await supabaseRequest(
            `countries?select=id,region,seas,languages,colonial_powers,former_unions,borders&id=in.(${countryId},${targetId})`
        );


    if (
        !countries ||
        countries.length !== 2
    ) {

        return [];

    }


    const countryA =
        countries.find(
            country =>
                Number(country.id) ===
                Number(countryId)
        );


    const countryB =
        countries.find(
            country =>
                Number(country.id) ===
                Number(targetId)
        );


    if (
        !countryA ||
        !countryB
    ) {

        return [];

    }


    const relationships = [];


    // ==========================================
    // GEMEINSAME GRENZE
    // ==========================================

    const bordersA =
        countryA.borders || [];


    const bordersB =
        countryB.borders || [];


    if (
        bordersA.includes(Number(countryB.id)) ||
        bordersB.includes(Number(countryA.id))
    ) {

        relationships.push({
            type: "border"
        });

    }


    // ==========================================
    // GLEICHE UN-M49-REGION
    // ==========================================

    if (
        countryA.region &&
        countryB.region &&
        countryA.region === countryB.region
    ) {

        relationships.push({
            type: "same_region"
        });

    }


    // ==========================================
    // GLEICHES MEER / OZEAN
    // ==========================================

    const seasA =
        countryA.seas || [];


    const seasB =
        countryB.seas || [];


    const commonSeas =
        seasA.filter(
            sea =>
                seasB.includes(sea)
        );


    commonSeas.forEach(
        sea => {

            relationships.push({
                type: "same_sea",
                description: sea
            });

        }
    );


    // ==========================================
    // FRÜHERE POLITISCHE UNION
    // ==========================================

    const unionsA =
        countryA.former_unions || [];


    const unionsB =
        countryB.former_unions || [];


    if (
        unionsA.includes(Number(countryB.id)) ||
        unionsB.includes(Number(countryA.id))
    ) {

        relationships.push({
            type: "former_union"
        });

    }


    // ==========================================
    // KOLONIALE BEZIEHUNG
    // ==========================================

    const colonialPowersA =
        countryA.colonial_powers || [];


    const colonialPowersB =
        countryB.colonial_powers || [];


    if (
        colonialPowersA.includes(Number(countryB.id)) ||
        colonialPowersB.includes(Number(countryA.id))
    ) {

        relationships.push({
            type: "former_colonie"
        });

    }


    // ==========================================
    // GEMEINSAME AMTSSPRACHE
    // ==========================================

    const languagesA =
        countryA.languages || [];


    const languagesB =
        countryB.languages || [];


    const commonLanguages =
        languagesA.filter(
            language =>
                languagesB.includes(language)
        );


    if (
        commonLanguages.length > 0
    ) {

        relationships.push({
            type: "cultural",
            description:
                commonLanguages.join(", ")
        });

    }


    // ==========================================
    // BESONDERE BEZIEHUNGEN
    // ==========================================

    const specialRelationships =
        await supabaseRequest(
            `special_relationships?select=*&or=` +
            `(and(country_a.eq.${countryA.id},country_b.eq.${countryB.id}),` +
            `and(country_a.eq.${countryB.id},country_b.eq.${countryA.id}))`
        );


    for (
        const relationship of
        specialRelationships || []
    ) {

        relationships.push({

            type:
                "special",

            description:
                relationship.description

        });

    }


    return relationships;

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