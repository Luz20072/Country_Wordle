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

    if (selectedContinents.length === 0) {
        throw new Error(
            "Keine Kontinente ausgewählt."
        );
    }

    const continentFilter =
        selectedContinents
            .map(
                continent =>
                    encodeURIComponent(continent)
            )
            .join(",");

    const endpoint =
        `countries?select=*&continent=in.(${continentFilter})`;

    const result =
        await supabaseRequest(endpoint);

    if (!result || result.length === 0) {
        throw new Error(
            `Keine Länder gefunden für Kontinente: ${selectedContinents.join(", ")}`
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

    const normalizedName =
        name
            .trim()
            .toLowerCase();


    const encodedName =
        encodeURIComponent(
            normalizedName
        );


    const result =
        await supabaseRequest(
            `countries?select=*&name=ilike.${encodedName}`
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
        selectedContinents.join(",");


    const result =
        await supabaseRequest(
            `countries?select=id,name,continent,region,seas,languages,borders&continent=in.(${continentFilter})&order=name`
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
            `countries?select=flag_colors&id=eq.${countryId}`
        );


    if (
        !result ||
        result.length === 0
    ) {

        return [];

    }


    return result[0].flag_colors || [];

}


// ==========================================
// FARBEN NORMALISIEREN
// ==========================================

function getColorArray(
    colors
) {

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