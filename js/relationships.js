// ==========================================
// BEZIEHUNGEN ZWISCHEN ZWEI LÄNDERN
// ==========================================


// ==========================================
// BEZIEHUNGEN ZWISCHEN ZWEI LÄNDERN LADEN
// ==========================================

async function getCountryRelationships(
    countryId,
    targetId
) {

    return await supabaseRequest(
        `relationships?select=*&or=(and(country_a.eq.${countryId},country_b.eq.${targetId}),and(country_a.eq.${targetId},country_b.eq.${countryId}))`
    );

}


// ==========================================
// BEZIEHUNGEN VERGLEICHEN
// ==========================================

function compareRelationships(
    relationships
) {

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
    // BEZIEHUNGSKATEGORIEN
    // ==========================================

    const relationshipNames = [];


    for (
        const relationship of relationships
    ) {

        switch (
            relationship.type
        ) {

            // ------------------------------------------
            // GEMEINSAME GRENZE
            // ------------------------------------------

            case "border":

                relationshipNames.push(
                    "Beide Länder sind Nachbarn."
                );

                break;


            // ------------------------------------------
            // GLEICHE UN-REGION
            // ------------------------------------------

            case "same_region":

                relationshipNames.push(
                    "Beide Länder liegen in derselben UN-Region."
                );

                break;


            // ------------------------------------------
            // GLEICHES MEER
            // ------------------------------------------

            case "same_sea":

                relationshipNames.push(
                    "Beide Länder grenzen an dasselbe Meer oder denselben Ozean."
                );

                break;


            // ------------------------------------------
            // FRÜHERE POLITISCHE UNION
            // ------------------------------------------

            case "former_union":

                relationshipNames.push(
                    "Beide Länder oder ihre Gebiete waren Teil eines gemeinsamen Staates."
                );

                break;


            // ------------------------------------------
            // FRÜHERE KOLONIE
            // ------------------------------------------

            case "former_colonie":

                relationshipNames.push(
                    "Zwischen beiden Ländern bestand eine koloniale Beziehung."
                );

                break;


            // ------------------------------------------
            // KULTURELLE VERBINDUNG
            // ------------------------------------------

            case "cultural":

                relationshipNames.push(
                    "Beide Länder haben eine oder mehrere gemeinsame Amtssprache."
                );

                break;


            // ------------------------------------------
            // BESONDERE BEZIEHUNG
            // ------------------------------------------

            case "special":

                relationshipNames.push(
                    "Beide Länder haben eine besondere sonstige Beziehung."
                );

                break;


            // ------------------------------------------
            // UNBEKANNTER TYP
            // ------------------------------------------

            default:

                relationshipNames.push(
                    relationship.type
                );

                break;

        }

    }


    // ==========================================
    // DOPPELTE KATEGORIEN ENTFERNEN
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