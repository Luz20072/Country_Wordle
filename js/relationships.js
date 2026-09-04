// ==========================================
// BEZIEHUNGEN ZWISCHEN ZWEI LÄNDERN
// ==========================================


// ==========================================
// LÄNDERDATEN LADEN
// ==========================================

async function getCountryRelationships(
    countryId,
    targetId
) {

    const countries = await supabaseRequest(
        `countries?select=*&id=in.(${countryId},${targetId})`
    );

    if (
        !countries ||
        countries.length !== 2
    ) {

        return [];

    }

    const countryA =
        countries.find(
            country => Number(country.id) === Number(countryId)
        );

    const countryB =
        countries.find(
            country => Number(country.id) === Number(targetId)
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

    if (
        (countryA.borders || []).includes(Number(countryB.id)) &&
        (countryB.borders || []).includes(Number(countryA.id))
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
            sea => seasB.includes(sea)
        );

    for (
        const sea of commonSeas
    ) {

        relationships.push({
            type: "same_sea",
            description: sea
        });

    }


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
        await getSpecialRelationships(
            countryA.id,
            countryB.id
        );

    for (
        const relationship of specialRelationships
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
// BESONDERE BEZIEHUNGEN LADEN
// ==========================================

async function getSpecialRelationships(
    countryId,
    targetId
) {

    return await supabaseRequest(
        `specialbeziehungen?select=*&or=` +
        `(and(country_a.eq.${countryId},country_b.eq.${targetId}),` +
        `and(country_a.eq.${targetId},country_b.eq.${countryId}))`
    );

}


// ==========================================
// BEZIEHUNGEN VERGLEICHEN
// ==========================================

function compareRelationships(
    relationships
) {

    // ==========================================
    // KEINE BEZIEHUNG
    // ==========================================

    if (
        !relationships ||
        relationships.length === 0
    ) {

        return {

            match: false,

            title:
                "Beziehungen",

            value:
                "Keine Übereinstimmung",

            tooltip:
                "Keine Beziehung zwischen den Ländern."

        };

    }


    // ==========================================
    // BEZIEHUNGSTEXTE
    // ==========================================

    const relationshipNames = [];


    for (
        const relationship of relationships
    ) {

        switch (
            relationship.type
        ) {


            // ==========================================
            // GRENZE
            // ==========================================

            case "border":

                relationshipNames.push(
                    "Beide Länder sind Nachbarn."
                );

                break;


            // ==========================================
            // UN-M49-REGION
            // ==========================================

            case "same_region":

                relationshipNames.push(
                    "Beide Länder liegen in derselben UN-Region."
                );

                break;


            // ==========================================
            // MEER / OZEAN
            // ==========================================

            case "same_sea":

                relationshipNames.push(
                    relationship.description
                        ? `Beide Länder grenzen an die ${relationship.description}.`
                        : "Beide Länder grenzen an dasselbe Meer oder denselben Ozean."
                );

                break;


            // ==========================================
            // FRÜHERE UNION
            // ==========================================

            case "former_union":

                relationshipNames.push(
                    "Beide Länder oder ihre Gebiete waren Teil eines gemeinsamen Staates."
                );

                break;


            // ==========================================
            // KOLONIALE BEZIEHUNG
            // ==========================================

            case "former_colonie":

                relationshipNames.push(
                    "Zwischen beiden Ländern bestand eine koloniale Beziehung."
                );

                break;


            // ==========================================
            // KULTURELLE VERBINDUNG
            // ==========================================

            case "cultural":

                relationshipNames.push(
                    relationship.description
                        ? `Beide Länder haben die Amtssprache ${relationship.description} gemeinsam.`
                        : "Beide Länder haben eine oder mehrere gemeinsame Amtssprachen."
                );

                break;


            // ==========================================
            // BESONDERE BEZIEHUNG
            // ==========================================

            case "special":

                relationshipNames.push(
                    relationship.description ||
                    "Beide Länder haben eine besondere Beziehung."
                );

                break;


            // ==========================================
            // UNBEKANNTER TYP
            // ==========================================

            default:

                relationshipNames.push(
                    relationship.type
                );

                break;

        }

    }


    // ==========================================
    // DOPPELTE BEZIEHUNGEN ENTFERNEN
    // ==========================================

    const uniqueRelationships =
        [
            ...new Set(
                relationshipNames
            )
        ];


    // ==========================================
    // ERGEBNIS
    // ==========================================

    return {

        match: true,

        title:
            "Beziehungen",

        value:
            `${uniqueRelationships.length} Übereinstimmung${uniqueRelationships.length === 1 ? "" : "en"}`,

        tooltip:
            uniqueRelationships.join("\n")

    };

}