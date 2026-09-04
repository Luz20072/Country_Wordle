// ==========================================
// SPIELDATEN
// ==========================================


const SUPABASE_URL =
    "https://utxbkbmdjhgsnlksjkst.supabase.co";


const SUPABASE_KEY =
    "sb_publishable_6640Ix-kp0Diy3Crqb3PDw_7g1bK4Ca";


// ==========================================
// SUPABASE REQUEST
// ==========================================

async function supabaseRequest(
    endpoint
) {

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
// ZUFÄLLIGES ZIELLAND
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
            Math.random() *
            result.length
        );


    return result[randomIndex];

}


// ==========================================
// LAND NACH NAMEN
// ==========================================

async function getCountryByName(
    name
) {

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
// LÄNDER FÜR STÜTZRÄDER
// ==========================================
//
// Enthält genau die Länder, die als Zielland
// überhaupt in Frage kommen.
//
// Die Kontinentauswahl bestimmt also weiterhin
// den möglichen Zielpool.
// ==========================================

async function getHintCountries() {

    const selectedContinents =
        getSelectedContinents();


    if (
        selectedContinents.length === 0
    ) {

        return [];

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
            `countries?select=id,name,continent,region,seas,languages,borders&continent=in.(${encodeURIComponent(continentFilter)})&order=name`
        );


    return result || [];

}


// ==========================================
// FLAGGENFARBEN
// ==========================================

async function getCountryColors(
    countryId
) {

    const result =
        await supabaseRequest(
            `flag_colors?select=*&country_id=eq.${countryId}`
        );


    return result || [];

}


// ==========================================
// FARBEN NORMALISIEREN
// ==========================================

function getColorArray(
    colors
) {

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
// BEZIEHUNGEN
// ==========================================

async function getCountryRelationships(
    countryId,
    targetId
) {

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


    // ======================================
    // NACHBARN
    // ======================================

    const bordersA =
        countryA.borders || [];


    const bordersB =
        countryB.borders || [];


    if (
        bordersA.includes(
            Number(countryB.id)
        ) ||
        bordersB.includes(
            Number(countryA.id)
        )
    ) {

        relationships.push({
            type: "border"
        });

    }


    // ======================================
    // UN-REGION
    // ======================================

    if (
        countryA.region &&
        countryB.region &&
        countryA.region === countryB.region
    ) {

        relationships.push({
            type: "same_region"
        });

    }


    // ======================================
    // GEMEINSAME GEWÄSSER
    // ======================================

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



    // ======================================
    // FRÜHERE UNION
    // ======================================

    const unionsA =
        countryA.former_unions || [];


    const unionsB =
        countryB.former_unions || [];


    const commonUnions =
        unionsA.filter(
            union =>
                unionsB.includes(union)
        );


    if (
        commonUnions.length > 0
    ) {

        relationships.push({
            type: "former_union"
        });

    }




    // ======================================
    // KOLONIALE BEZIEHUNG
    // ======================================

    const colonialPowersA =
        countryA.colonial_powers || [];


    const colonialPowersB =
        countryB.colonial_powers || [];


    if (
        colonialPowersA.includes(
            Number(countryB.id)
        ) ||
        colonialPowersB.includes(
            Number(countryA.id)
        )
    ) {

        relationships.push({
            type: "former_colonie"
        });

    }


    // ======================================
    // GEMEINSAME SPRACHEN
    // ======================================

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


    // ======================================
    // BESONDERE BEZIEHUNGEN
    // ======================================

    const specialRelationships =
        await supabaseRequest(
            `special_relationships?select=*&or=` +
            `(and(country_a.eq.${countryA.id},country_b.eq.${countryB.id}),` +
            `and(country_a.eq.${countryB.id},country_b.eq.${countryA.id}))`
        );


    for (
        const relationship
        of specialRelationships || []
    ) {

        relationships.push({
            type: "special",
            description:
                relationship.description
        });

    }


    return relationships;

}


// ==========================================
// KRIEGE EINES LANDES
// ==========================================

async function getCountryWars(
    countryId
) {

    const result =
        await supabaseRequest(
            `country_wars?select=*&country_id=eq.${countryId}`
        );


    return result || [];

}


// ==========================================
// KRIEGE NACH IDS
// ==========================================

async function getWarsByIds(
    warIds
) {

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


// ==========================================
// LÄNDER NACH IDS
// ==========================================

async function getCountriesByIds(
    countryIds
) {

    if (
        !countryIds ||
        countryIds.length === 0
    ) {

        return [];

    }


    const ids =
        countryIds
            .map(
                id =>
                    Number(id)
            )
            .filter(
                id =>
                    Number.isFinite(id)
            )
            .join(",");


    if (
        ids === ""
    ) {

        return [];

    }


    const result =
        await supabaseRequest(
            `countries?select=id,name,iso_code&id=in.(${ids})&order=name`
        );


    return result || [];

}