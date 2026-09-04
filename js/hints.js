const hintState = {
    continent: null,

    regionMatches: [],

    colors: [],

    wars: [],

    neighbors: [],

    relationships: [],

    waterActive: false,
    waterPossible: [],
    waterCertain: [],
    waterMatches: [],
    waterExcluded: [],

    languageActive: false,
    languagePossible: [],
    languageCertain: [],
    languageMatches: [],
    languageExcluded: [],

    guessedCountries: []
};


/* ==========================================
   INITIALISIERUNG
   ========================================== */

function resetHints() {

    hintState.continent = null;

    hintState.regionMatches = [];

    hintState.colors = [];

    hintState.wars = [];

    hintState.neighbors = [];

    hintState.relationships = [];

    hintState.waterActive = false;
    hintState.waterPossible = [];
    hintState.waterCertain = [];
    hintState.waterMatches = [];
    hintState.waterExcluded = [];

    hintState.languageActive = false;
    hintState.languagePossible = [];
    hintState.languageCertain = [];
    hintState.languageMatches = [];
    hintState.languageExcluded = [];

    hintState.guessedCountries = [];
}


function initializeHintCandidates(countries) {

    /*
     * Es wird kein kompletter Kandidatenpool
     * aufgebaut.
     *
     * Gewässer und Sprachen entstehen ausschließlich
     * aus tatsächlich geratenen Ländern.
     */

}


/* ==========================================
   HILFSFUNKTIONEN
   ========================================== */

function uniqueValues(values) {

    return [
        ...new Set(
            (values || [])
                .filter(
                    value =>
                        value !== null &&
                        value !== undefined &&
                        String(value).trim() !== ""
                )
                .map(
                    value =>
                        String(value).trim()
                )
        )
    ];

}


function addUnique(array, value) {

    if (
        value === null ||
        value === undefined
    ) {

        return;

    }


    const normalized =
        String(value).trim();


    if (
        normalized !== "" &&
        !array.includes(normalized)
    ) {

        array.push(
            normalized
        );

    }

}


function addUniqueArray(array, values) {

    for (
        const value
        of values || []
    ) {

        addUnique(
            array,
            value
        );

    }

}


/*
 * Zählt, in wie vielen unterschiedlichen
 * positiven Treffern ein Wert vorkam.
 *
 * Jeder Eintrag in waterMatches /
 * languageMatches entspricht genau
 * einem geratenen Land.
 */

function countValueMatches(matches, value) {

    let count = 0;


    for (
        const match
        of matches
    ) {

        if (
            Array.isArray(match) &&
            match.includes(value)
        ) {

            count++;

        }

    }


    return count;

}


/* ==========================================
   GEWÄSSER-KANDIDATEN
   ========================================== */

/*
 * REGEL:
 *
 * Ein Gewässer wird zunächst nur MÖGLICH.
 *
 * Erst wenn es bei mindestens ZWEI positiven
 * Treffern vorkam, wird geprüft, ob es beim
 * gesuchten Zielland tatsächlich vorhanden ist.
 *
 * Erst dann kann es GESICHERT werden.
 *
 *
 * Beispiel:
 *
 * Deutschland → Nordsee, Ostsee
 * Niederlande → Nordsee
 *
 * Nordsee → 2 Treffer
 * Ostsee  → 1 Treffer
 *
 * Nur Nordsee darf jetzt überhaupt gegen
 * das Zielland geprüft werden.
 *
 * Nordsee beim Ziel vorhanden:
 * → GESICHERT
 *
 * Nordsee beim Ziel nicht vorhanden:
 * → bleibt MÖGLICH
 *
 * Ostsee:
 * → bleibt MÖGLICH
 */


/*
 * Diese Funktion wird von updateHints()
 * mit dem aktuellen comparison-Objekt
 * versorgt.
 */

function updateWaterCandidates(
    comparison
) {

    const possible = [];

    const certain = [];


    /*
     * ALLE bisher bei positiven Treffern
     * gefundenen Gewässer zunächst als
     * MÖGLICH behandeln.
     */

    for (
        const match
        of hintState.waterMatches
    ) {

        const waters =
            uniqueValues(
                match
            );


        for (
            const water
            of waters
        ) {

            if (
                hintState.waterExcluded.includes(
                    water
                )
            ) {

                continue;

            }


            addUnique(
                possible,
                water
            );

        }

    }


    /*
     * Erst jetzt kommt die Prüfung:
     *
     * Wurde das Gewässer mindestens
     * zweimal gefunden?
     */

    const possibleForCertain =
        possible.filter(
            water =>
                countValueMatches(
                    hintState.waterMatches,
                    water
                ) >= 2
        );


    /*
     * NUR diese mindestens zweimal
     * gefundenen Werte werden gegen das
     * Zielland geprüft.
     *
     * Die Prüfung erfolgt über
     * comparison.water.sharedValues.
     */

    const targetWaters =
        comparison &&
        comparison.water &&
        Array.isArray(
            comparison.water.sharedValues
        )
            ? uniqueValues(
                comparison.water.sharedValues
            )
            : [];


    for (
        const water
        of possibleForCertain
    ) {

        /*
         * Jetzt und wirklich erst jetzt:
         *
         * Ist das Gewässer beim Zielland?
         */

        if (
            targetWaters.includes(
                water
            )
        ) {

            addUnique(
                certain,
                water
            );

        }

    }


    /*
     * Gesicherte Werte aus der Möglich-Liste
     * entfernen.
     */

    hintState.waterPossible =
        possible.filter(
            water =>
                !certain.includes(
                    water
                )
        );


    hintState.waterCertain =
        uniqueValues(
            certain
        );

}


/* ==========================================
   SPRACHEN-KANDIDATEN
   ========================================== */

/*
 * Identische Logik wie bei Gewässern:
 *
 * 1× gefunden
 * → MÖGLICH
 *
 * 2× gefunden
 * → Prüfung gegen Zielland
 *
 * 2× + beim Ziel vorhanden
 * → GESICHERT
 *
 * 2× + beim Ziel NICHT vorhanden
 * → bleibt MÖGLICH
 */

function updateLanguageCandidates(
    comparison
) {

    const possible = [];

    const certain = [];


    /*
     * ALLE bisher bei positiven Treffern
     * gefundenen Sprachen zunächst als
     * MÖGLICH behandeln.
     */

    for (
        const match
        of hintState.languageMatches
    ) {

        const languages =
            uniqueValues(
                match
            );


        for (
            const language
            of languages
        ) {

            if (
                hintState.languageExcluded.includes(
                    language
                )
            ) {

                continue;

            }


            addUnique(
                possible,
                language
            );

        }

    }


    /*
     * Erst ab zwei positiven Treffern
     * erfolgt die Zielland-Prüfung.
     */

    const possibleForCertain =
        possible.filter(
            language =>
                countValueMatches(
                    hintState.languageMatches,
                    language
                ) >= 2
        );


    /*
     * Zielland-Sprachen.
     */

    const targetLanguages =
        comparison &&
        comparison.language &&
        Array.isArray(
            comparison.language.sharedValues
        )
            ? uniqueValues(
                comparison.language.sharedValues
            )
            : [];


    /*
     * Jetzt wird geprüft, welche der
     * mindestens zweimal gefundenen Sprachen
     * tatsächlich beim Zielland vorkommen.
     */

    for (
        const language
        of possibleForCertain
    ) {

        if (
            targetLanguages.includes(
                language
            )
        ) {

            addUnique(
                certain,
                language
            );

        }

    }


    /*
     * Gesicherte Werte aus MÖGLICH entfernen.
     */

    hintState.languagePossible =
        possible.filter(
            language =>
                !certain.includes(
                    language
                )
        );


    hintState.languageCertain =
        uniqueValues(
            certain
        );

}


/* ==========================================
   NEGATIVE GEWÄSSER
   ========================================== */

function excludeWaterValues(values) {

    const uniqueWater =
        uniqueValues(
            values
        );


    /*
     * Dauerhaft ausschließen.
     */

    for (
        const water
        of uniqueWater
    ) {

        addUnique(
            hintState.waterExcluded,
            water
        );

    }


    /*
     * Aus den aktuellen Listen entfernen.
     */

    hintState.waterPossible =
        hintState.waterPossible.filter(
            water =>
                !hintState.waterExcluded.includes(
                    water
                )
        );


    hintState.waterCertain =
        hintState.waterCertain.filter(
            water =>
                !hintState.waterExcluded.includes(
                    water
                )
        );

}


/* ==========================================
   NEGATIVE SPRACHEN
   ========================================== */

function excludeLanguageValues(values) {

    const uniqueLanguages =
        uniqueValues(
            values
        );


    /*
     * Dauerhaft ausschließen.
     */

    for (
        const language
        of uniqueLanguages
    ) {

        addUnique(
            hintState.languageExcluded,
            language
        );

    }


    /*
     * Aus den aktuellen Listen entfernen.
     */

    hintState.languagePossible =
        hintState.languagePossible.filter(
            language =>
                !hintState.languageExcluded.includes(
                    language
                )
        );


    hintState.languageCertain =
        hintState.languageCertain.filter(
            language =>
                !hintState.languageExcluded.includes(
                    language
                )
        );

}


/* ==========================================
   INDIZIEN AKTUALISIEREN
   ========================================== */

function updateHints(
    country,
    comparison
) {

    if (
        !country ||
        !comparison
    ) {

        return;

    }


    /* ==========================================
       GERATENES LAND
       ========================================== */

    if (
        country.name &&
        !hintState.guessedCountries.includes(
            country.name
        )
    ) {

        hintState.guessedCountries.push(
            country.name
        );

    }


    /* ==========================================
       KONTINENT
       ========================================== */

    if (
        comparison.continent &&
        comparison.continent.match &&
        !hintState.continent
    ) {

        hintState.continent =
            country.continent;

    }


    /* ==========================================
       UN-REGION
       ========================================== */

    if (
        comparison.region &&
        comparison.region.match
    ) {

        addUnique(
            hintState.regionMatches,
            country.name
        );

    }


    /* ==========================================
       FLAGGENFARBEN
       ========================================== */

    if (
        comparison.colors &&
        Array.isArray(
            comparison.colors.sharedColors
        )
    ) {

        addUniqueArray(
            hintState.colors,
            comparison.colors.sharedColors
        );

    }


    /* ==========================================
       KRIEGE
       ========================================== */

    if (
        comparison.wars &&
        Array.isArray(
            comparison.wars.sharedWars
        )
    ) {

        for (
            const war
            of comparison.wars.sharedWars
        ) {

            if (
                !war ||
                !war.name
            ) {

                continue;

            }


            const existing =
                hintState.wars.find(
                    entry =>
                        entry.name === war.name
                );


            if (!existing) {

                hintState.wars.push({

                    name:
                        war.name,

                    tooltip:
                        comparison.wars.tooltip || ""

                });

            }

        }

    }


    /* ==========================================
       NACHBARN
       ========================================== */

    if (
        comparison.relationships &&
        Array.isArray(
            comparison.relationships.rawRelationships
        )
    ) {

        const hasBorder =
            comparison.relationships.rawRelationships.some(
                relationship =>
                    relationship.type === "border"
            );


        if (hasBorder) {

            addUnique(
                hintState.neighbors,
                country.name
            );

        }

    }


    /* ==========================================
       BEZIEHUNGEN
       ========================================== */

    if (
        comparison.relationships &&
        Array.isArray(
            comparison.relationships.rawRelationships
        )
    ) {

        for (
            const relationship
            of comparison.relationships.rawRelationships
        ) {

            if (!relationship) {

                continue;

            }


            let relationshipName =
                null;


            switch (
                relationship.type
            ) {

                case "former_union":

                    relationshipName =
                        "Ehemalige Union";

                    break;


                case "former_colonie":

                    relationshipName =
                        "Ehemalige Kolonie";

                    break;


                case "special":

                    relationshipName =
                        "Besondere Beziehung";

                    break;


                default:

                    continue;

            }


            const existing =
                hintState.relationships.find(
                    entry =>
                        entry.type === relationshipName &&
                        entry.country === country.name
                );


            if (!existing) {

                hintState.relationships.push({

                    type:
                        relationshipName,

                    country:
                        country.name,

                    description:
                        relationship.description || ""

                });

            }

        }

    }


    /* ==========================================
       GEWÄSSER
       ========================================== */

    if (
        comparison.water
    ) {

        const guessedSeas =
            Array.isArray(
                country.seas
            )
                ? uniqueValues(
                    country.seas
                )
                : [];


        /*
         * POSITIVER TREFFER
         *
         * Wichtig:
         *
         * Hier wird NOCH NICHT geprüft,
         * ob das Gewässer beim Zielland ist.
         *
         * Die Gewässer werden einfach als
         * mögliche Kandidaten gespeichert.
         */

        if (
            comparison.water.match
        ) {

            if (
                guessedSeas.length > 0
            ) {

                hintState.waterMatches.push(
                    guessedSeas
                );

            }


            hintState.waterActive =
                true;


            /*
             * Erst hier wird die Kandidatenliste
             * aktualisiert.
             *
             * updateWaterCandidates() entscheidet
             * anschließend:
             *
             * mindestens 2 Treffer?
             * UND
             * beim Ziel vorhanden?
             */

            updateWaterCandidates(
                comparison
            );

        }

        else {

            /*
             * NEGATIVER TREFFER
             *
             * Die Gewässer des geratenen Landes
             * sind beim Ziel nicht vorhanden.
             */

            if (
                guessedSeas.length > 0
            ) {

                excludeWaterValues(
                    guessedSeas
                );

            }

        }

    }


    /* ==========================================
       SPRACHEN
       ========================================== */

    if (
        comparison.language
    ) {

        const guessedLanguages =
            Array.isArray(
                country.languages
            )
                ? uniqueValues(
                    country.languages
                )
                : [];


        /*
         * POSITIVER TREFFER
         *
         * Die Sprachen werden zunächst nur
         * als mögliche Kandidaten gespeichert.
         *
         * Die Prüfung gegen das Zielland erfolgt
         * erst ab mindestens zwei Treffern.
         */

        if (
            comparison.language.match
        ) {

            if (
                guessedLanguages.length > 0
            ) {

                hintState.languageMatches.push(
                    guessedLanguages
                );

            }


            hintState.languageActive =
                true;


            /*
             * Erst jetzt werden die Kandidaten
             * aktualisiert.
             */

            updateLanguageCandidates(
                comparison
            );

        }

        else {

            /*
             * NEGATIVER TREFFER
             *
             * Die Sprachen des geratenen Landes
             * sind beim Ziel nicht vorhanden.
             */

            if (
                guessedLanguages.length > 0
            ) {

                excludeLanguageValues(
                    guessedLanguages
                );

            }

        }

    }


    /* ==========================================
       RENDER
       ========================================== */

    renderHints();

}


/* ==========================================
   RENDERING
   ========================================== */

function renderHints() {

    const container =
        document.getElementById(
            "hints-content"
        );


    if (!container) {

        return;

    }


    let html = "";


    /* ==========================================
       KONTINENT
       ========================================== */

    html += `
        <div class="hint-section">

            <strong>
                Kontinent
            </strong>

            <div class="hint-list">

                ${
                    hintState.continent
                        ? `
                            <span
                                class="hint-item certain"
                                title="Ein geratenes Land hat denselben Kontinent wie das gesuchte Land."
                            >
                                ${escapeHintHtml(
                                    hintState.continent
                                )}
                            </span>
                        `
                        : ""
                }

            </div>

        </div>
    `;


    /* ==========================================
       UN-REGION
       ========================================== */

    html += `
        <div class="hint-section">

            <strong>
                UN-Region – Treffer
            </strong>

            <div class="hint-list">

                ${
                    hintState.regionMatches
                        .map(
                            name => `
                                <span
                                    class="hint-item certain"
                                    title="Dieses geratene Land liegt in derselben UN-M49-Region wie das gesuchte Land."
                                >
                                    ${escapeHintHtml(
                                        name
                                    )}
                                </span>
                            `
                        )
                        .join("")
                }

            </div>

        </div>
    `;


    /* ==========================================
       FLAGGENFARBEN
       ========================================== */

    html += `
        <div class="hint-section">

            <strong>
                Flaggenfarben – Treffer
            </strong>

            <div class="hint-list">

                ${
                    hintState.colors
                        .map(
                            color => `
                                <span
                                    class="hint-item certain"
                                    title="Diese Flaggenfarbe kommt sowohl beim geratenen als auch beim gesuchten Land vor."
                                >
                                    ${escapeHintHtml(
                                        color
                                    )}
                                </span>
                            `
                        )
                        .join("")
                }

            </div>

        </div>
    `;


    /* ==========================================
       KRIEGE
       ========================================== */

    html += `
        <div class="hint-section">

            <strong>
                Kriege – Treffer
            </strong>

            <div class="hint-list">

                ${
                    hintState.wars
                        .map(
                            war => `
                                <span
                                    class="hint-item certain"
                                    title="${escapeHintHtml(
                                        war.tooltip
                                    )}"
                                >
                                    ${escapeHintHtml(
                                        war.name
                                    )}
                                </span>
                            `
                        )
                        .join("")
                }

            </div>

        </div>
    `;


    /* ==========================================
       NACHBARN
       ========================================== */

    html += `
        <div class="hint-section">

            <strong>
                Nachbarn – Treffer
            </strong>

            <div class="hint-list">

                ${
                    hintState.neighbors
                        .map(
                            name => `
                                <span
                                    class="hint-item certain"
                                    title="Dieses Land grenzt an das gesuchte Land."
                                >
                                    ${escapeHintHtml(
                                        name
                                    )}
                                </span>
                            `
                        )
                        .join("")
                }

            </div>

        </div>
    `;


    /* ==========================================
       BEZIEHUNGEN
       ========================================== */

    html += `
        <div class="hint-section">

            <strong>
                Beziehungen – Treffer
            </strong>

            <div class="hint-list">

                ${
                    hintState.relationships
                        .map(
                            relationship => {

                                const text =
                                    `${relationship.type}: ${relationship.country}`;


                                const tooltip =
                                    relationship.description ||
                                    getRelationshipTooltip(
                                        relationship.type
                                    );


                                return `
                                    <span
                                        class="hint-item certain"
                                        title="${escapeHintHtml(
                                            tooltip
                                        )}"
                                    >
                                        ${escapeHintHtml(
                                            text
                                        )}
                                    </span>
                                `;

                            }
                        )
                        .join("")
                }

            </div>

        </div>
    `;


    /* ==========================================
       GEWÄSSER
       ========================================== */

    if (
        hintState.waterActive &&
        (
            hintState.waterPossible.length > 0 ||
            hintState.waterCertain.length > 0
        )
    ) {

        html += `
            <div class="hint-section">

                <strong>
                    Gewässer
                </strong>
        `;


        /* --------------------------------------
           GESICHERTE GEWÄSSER
           -------------------------------------- */

        if (
            hintState.waterCertain.length > 0
        ) {

            html += `
                <div class="hint-subsection">

                    <small>
                        Gesichert
                    </small>

                    <div class="hint-list">

                        ${
                            hintState.waterCertain
                                .map(
                                    water => `
                                        <span
                                            class="hint-item certain"
                                            title="Dieses Gewässer wurde bei mindestens zwei positiven Treffern gefunden und kommt nachweislich auch beim gesuchten Land vor."
                                        >
                                            ${escapeHintHtml(
                                                water
                                            )}
                                        </span>
                                    `
                                )
                                .join("")
                        }

                    </div>

                </div>
            `;

        }


        /* --------------------------------------
           MÖGLICHE GEWÄSSER
           -------------------------------------- */

        if (
            hintState.waterPossible.length > 0
        ) {

            html += `
                <div class="hint-subsection">

                    <small>
                        Möglich
                    </small>

                    <div class="hint-list">

                        ${
                            hintState.waterPossible
                                .map(
                                    water => `
                                        <span
                                            class="hint-item possible"
                                            title="Dieses Gewässer wurde bei mindestens einem positiven Treffer gefunden. Es ist noch nicht gesichert."
                                        >
                                            ${escapeHintHtml(
                                                water
                                            )}
                                        </span>
                                    `
                                )
                                .join("")
                        }

                    </div>

                </div>
            `;

        }


        html += `
            </div>
        `;

    }


    /* ==========================================
       SPRACHEN
       ========================================== */

    if (
        hintState.languageActive &&
        (
            hintState.languagePossible.length > 0 ||
            hintState.languageCertain.length > 0
        )
    ) {

        html += `
            <div class="hint-section">

                <strong>
                    Sprachen
                </strong>
        `;


        /* --------------------------------------
           GESICHERTE SPRACHEN
           -------------------------------------- */

        if (
            hintState.languageCertain.length > 0
        ) {

            html += `
                <div class="hint-subsection">

                    <small>
                        Gesichert
                    </small>

                    <div class="hint-list">

                        ${
                            hintState.languageCertain
                                .map(
                                    language => `
                                        <span
                                            class="hint-item certain"
                                            title="Diese Sprache wurde bei mindestens zwei positiven Treffern gefunden und kommt nachweislich auch beim gesuchten Land vor."
                                        >
                                            ${escapeHintHtml(
                                                language
                                            )}
                                        </span>
                                    `
                                )
                                .join("")
                        }

                    </div>

                </div>
            `;

        }


        /* --------------------------------------
           MÖGLICHE SPRACHEN
           -------------------------------------- */

        if (
            hintState.languagePossible.length > 0
        ) {

            html += `
                <div class="hint-subsection">

                    <small>
                        Möglich
                    </small>

                    <div class="hint-list">

                        ${
                            hintState.languagePossible
                                .map(
                                    language => `
                                        <span
                                            class="hint-item possible"
                                            title="Diese Sprache wurde bei mindestens einem positiven Treffer gefunden. Sie ist noch nicht gesichert."
                                        >
                                            ${escapeHintHtml(
                                                language
                                            )}
                                        </span>
                                    `
                                )
                                .join("")
                        }

                    </div>

                </div>
            `;

        }


        html += `
            </div>
        `;

    }


    container.innerHTML =
        html;

}


/* ==========================================
   BEZIEHUNGS-TOOLTIPS
   ========================================== */

function getRelationshipTooltip(type) {

    switch (type) {

        case "Ehemalige Union":

            return "Beide Länder waren Teil eines gemeinsamen Staates.";


        case "Ehemalige Kolonie":

            return "Zwischen beiden Ländern bestand eine koloniale Beziehung.";


        case "Besondere Beziehung":

            return "Zwischen beiden Ländern besteht eine besondere Beziehung.";


        default:

            return "";

    }

}


/* ==========================================
   HTML ESCAPEN
   ========================================== */

function escapeHintHtml(value) {

    return String(
        value ?? ""
    )
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}


/* ==========================================
   INITIALISIERUNG
   ========================================== */

async function initializeHints() {

    resetHints();

    renderHints();

}
