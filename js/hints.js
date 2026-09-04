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
MOBILE-TOOLTIPS
========================================== */

let activeHintTooltipItem = null;

/*

* Prüft, ob ein Touch-Gerät verwendet wird.
  */

function isMobileTooltipDevice() {


return window.matchMedia(
    "(hover: none) and (pointer: coarse)"
).matches;


}

/*

* Aktives Tooltip schließen.
  */

function closeActiveHintTooltip() {


if (
    !activeHintTooltipItem
) {

    return;

}


const tooltip =
    activeHintTooltipItem.querySelector(
        ".hint-tooltip"
    );


if (
    tooltip
) {

    tooltip.classList.remove(
        "hint-tooltip-visible"
    );

}


activeHintTooltipItem.setAttribute(
    "aria-expanded",
    "false"
);


activeHintTooltipItem =
    null;


}

/*

* Mobile Tooltip öffnen bzw. schließen.
  */

function toggleMobileHintTooltip(item) {


if (
    !item ||
    !isMobileTooltipDevice()
) {

    return;

}


const tooltip =
    item.querySelector(
        ".hint-tooltip"
    );


if (
    !tooltip
) {

    return;

}


/*
 * Dasselbe Tooltip wurde erneut
 * angetippt -> schließen.
 */

if (
    activeHintTooltipItem === item
) {

    closeActiveHintTooltip();

    return;

}


/*
 * Vorheriges Tooltip schließen.
 */

closeActiveHintTooltip();


/*
 * Neues Tooltip öffnen.
 */

tooltip.classList.add(
    "hint-tooltip-visible"
);


item.setAttribute(
    "aria-expanded",
    "true"
);


activeHintTooltipItem =
    item;


}

/*

* Event Delegation:
* Die Hint-Elemente werden von renderHints()
* dynamisch erzeugt.
  */

if (
!window.__hintMobileTooltipInitialized
) {


document.addEventListener(
    "click",
    event => {

        if (
            !isMobileTooltipDevice()
        ) {

            return;

        }


        const item =
            event.target.closest(
                ".hint-tooltip-item"
            );


        /*
         * Ein Hinweis wurde angetippt.
         */

        if (
            item
        ) {

            event.preventDefault();

            event.stopPropagation();

            toggleMobileHintTooltip(
                item
            );

            return;

        }


        /*
         * Außerhalb eines Hinweises
         * wurde angetippt.
         */

        closeActiveHintTooltip();

    }
);


/*
 * ESC schließt das Tooltip.
 */

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Escape"
        ) {

            closeActiveHintTooltip();

        }

    }
);


/*
 * Bei Größenänderung schließen,
 * damit kein falsch positioniertes
 * Tooltip bestehen bleibt.
 */

window.addEventListener(
    "resize",
    () => {

        closeActiveHintTooltip();

    }
);


window.__hintMobileTooltipInitialized =
    true;


}

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

closeActiveHintTooltip();


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
 * Erst wenn ein Gewässer mindestens
 * zweimal gefunden wurde, darf es
 * gegen das Zielland geprüft werden.
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
 * Gewässer des Ziellandes,
 * die comparison.js als gemeinsame
 * Gewässer erkannt hat.
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
 * Gesicherte Werte aus der
 * Möglich-Liste entfernen.
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
 * Sprachen des Ziellandes,
 * die comparison.js als gemeinsame
 * Sprachen erkannt hat.
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


/* ==========================================
   AUSNAHME FÜR EINSPRACHIGE LÄNDER
   ========================================== */

for (
    const languages
    of hintState.languageMatches
) {

    const uniqueLanguages =
        uniqueValues(
            languages
        );


    if (
        uniqueLanguages.length !== 1
    ) {

        continue;

    }


    const language =
        uniqueLanguages[0];


    if (
        hintState.languageExcluded.includes(
            language
        )
    ) {

        continue;

    }


    /*
     * Einsprachige Länder dürfen bereits
     * nach einem einzigen positiven Treffer
     * geprüft werden.
     */

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


/* ==========================================
   NORMALE 2-TREFFER-REGEL
   ========================================== */

const possibleForCertain =
    possible.filter(
        language =>
            !certain.includes(language) &&
            countValueMatches(
                hintState.languageMatches,
                language
            ) >= 2
    );


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
KRIEGSDATEN
========================================== */

/*

* Holt den country_wars-Eintrag eines Landes
* für einen bestimmten Krieg.
  */

async function getHintCountryWarEntry(
countryId,
warId
) {


if (
    countryId === null ||
    countryId === undefined ||
    warId === null ||
    warId === undefined
) {

    return null;

}


try {

    const wars =
        await getCountryWars(
            countryId
        );


    return (
        wars.find(
            entry =>
                Number(entry.war_id) ===
                Number(warId)
        ) ||
        null
    );

}
catch (error) {

    console.error(
        "Fehler beim Laden der Kriegsdaten:",
        error
    );

    return null;

}


}

/*

* Ermittelt die Beziehung zwischen
* geratenem Land und Zielland.
*
* 1. Gleiche Seite = Verbündete
*
* 2. Unterschiedliche Seite,
* aber gleiches Ergebnis = Verbündete
*
* 3. Unterschiedliche Seite
* und unterschiedliches Ergebnis = Gegner
  */

function getWarRelation(
guessedWar,
targetWar
) {


if (
    !guessedWar ||
    !targetWar
) {

    return null;

}


if (
    guessedWar.side ===
    targetWar.side
) {

    return "Verbündete";

}


if (
    guessedWar.result ===
    targetWar.result
) {

    return "Verbündete";

}


return "Gegner";


}

/* ==========================================
KRIEGSHINWEIS HINZUFÜGEN
========================================== */

function addWarHint(
war,
country,
relation
) {


if (
    !war ||
    !country ||
    !relation
) {

    return;

}


/*
 * Bereits vorhandenen Krieg suchen.
 */

let warHint =
    hintState.wars.find(
        entry =>
            Number(entry.warId) ===
            Number(war.id)
    );


/*
 * Krieg noch nicht vorhanden.
 */

if (
    !warHint
) {

    warHint = {

        warId:
            Number(war.id),

        name:
            war.name,

        allies:
            [],

        enemies:
            []

    };


    hintState.wars.push(
        warHint
    );

}


/*
 * Das geratene Land wird innerhalb
 * dieses Krieges der entsprechenden
 * Gruppe zugeordnet.
 */

if (
    relation === "Verbündete"
) {

    /*
     * Falls das Land zuvor als Gegner
     * gespeichert war, entfernen.
     */

    warHint.enemies =
        warHint.enemies.filter(
            name =>
                name !== country.name
        );


    addUnique(
        warHint.allies,
        country.name
    );

}


if (
    relation === "Gegner"
) {

    /*
     * Falls das Land zuvor als Verbündeter
     * gespeichert war, entfernen.
     */

    warHint.allies =
        warHint.allies.filter(
            name =>
                name !== country.name
        );


    addUnique(
        warHint.enemies,
        country.name
    );

}


}

/* ==========================================
KRIEGSHINWEISE AKTUALISIEREN
========================================== */

async function updateWarHint(
country,
sharedWars
) {


if (
    !country ||
    !Array.isArray(sharedWars) ||
    sharedWars.length === 0
) {

    return;

}


/*
 * Jeder gemeinsame Krieg wird separat
 * verarbeitet.
 */

for (
    const war
    of sharedWars
) {

    if (
        !war ||
        war.id === undefined ||
        war.id === null
    ) {

        continue;

    }


    /*
     * Beteiligung des geratenen Landes
     */

    const guessedWar =
        await getHintCountryWarEntry(
            country.id,
            war.id
        );


    if (
        !guessedWar
    ) {

        continue;

    }


    /*
     * Beteiligung des Ziellandes
     */

    const targetWar =
        Array.isArray(
            targetWars
        )
            ? targetWars.find(
                entry =>
                    Number(entry.war_id) ===
                    Number(war.id)
            )
            : null;


    if (
        !targetWar
    ) {

        continue;

    }


    /*
     * Beziehung zwischen geratenem
     * Land und Zielland bestimmen.
     */

    const relation =
        getWarRelation(
            guessedWar,
            targetWar
        );


    if (
        !relation
    ) {

        continue;

    }


    /*
     * Krieg und Land speichern.

    */

    addWarHint(
        war,
        country,
        relation
    );

}


/*
 * Kriege nach ihrer ID sortieren.
 */

hintState.wars.sort(
    (a, b) =>
        Number(a.warId) -
        Number(b.warId)
);


}

/* ==========================================
INDIZIEN AKTUALISIEREN
========================================== */

async function updateHints(
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

    await updateWarHint(
        country,
        comparison.wars.sharedWars
    );

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


    if (
        hasBorder
    ) {

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

        if (
            !relationship
        ) {

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


        if (
            !existing
        ) {

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


        updateWaterCandidates(
            comparison
        );

    }

    else {

        /*
         * NEGATIVER TREFFER
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


        updateLanguageCandidates(
            comparison
        );

    }

    else {

        /*
         * NEGATIVER TREFFER
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


if (
    !container
) {

    return;

}


/*
 * Beim erneuten Rendern kann ein bisher
 * geöffnetes Tooltip nicht mehr existieren.
 */

activeHintTooltipItem =
    null;


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
                            class="hint-item certain hint-tooltip-item"
                            tabindex="0"
                            role="button"
                            aria-expanded="false"
                        >
                            ${escapeHintHtml(
                                hintState.continent
                            )}

                            <span
                                class="hint-tooltip"
                                role="tooltip"
                            >
                                Ein geratenes Land hat denselben Kontinent wie das gesuchte Land.
                            </span>
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
                                class="hint-item certain hint-tooltip-item"
                                tabindex="0"
                                role="button"
                                aria-expanded="false"
                            >
                                ${escapeHintHtml(
                                    name
                                )}

                                <span
                                    class="hint-tooltip"
                                    role="tooltip"
                                >
                                    Dieses geratene Land liegt in derselben UN-M49-Region wie das gesuchte Land.
                                </span>
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
                                class="hint-item certain hint-tooltip-item"
                                tabindex="0"
                                role="button"
                                aria-expanded="false"
                            >
                                ${escapeHintHtml(
                                    color
                                )}

                                <span
                                    class="hint-tooltip"
                                    role="tooltip"
                                >
                                    Diese Flaggenfarbe kommt sowohl beim geratenen als auch beim gesuchten Land vor.
                                </span>
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

/*
 * Jeder Krieg ist ein eigener Hinweis.
 *
 * Es gibt KEINE Top-Level-Kategorien
 * "Verbündete" oder "Gegner".
 */

if (
    hintState.wars.length > 0
) {

    html += `
        <div class="hint-section">

            <strong>
                Kriege – Treffer
            </strong>

            <div class="hint-list">

                ${
                    hintState.wars
                        .map(
                            war => {

                                const tooltipLines =
                                    [];


                                /*
                                 * Kriegsname
                                 */

                                tooltipLines.push(
                                    war.name
                                );


                                /*
                                 * Verbündete
                                 */

                                if (
                                    Array.isArray(
                                        war.allies
                                    ) &&
                                    war.allies.length > 0
                                ) {

                                    tooltipLines.push(
                                        ""
                                    );


                                    tooltipLines.push(
                                        "Verbündete:"
                                    );


                                    for (
                                        const country
                                        of war.allies
                                    ) {

                                        tooltipLines.push(
                                            country
                                        );

                                    }

                                }


                                /*
                                 * Gegner
                                 */

                                if (
                                    Array.isArray(
                                        war.enemies
                                    ) &&
                                    war.enemies.length > 0
                                ) {

                                    tooltipLines.push(
                                        ""
                                    );


                                    tooltipLines.push(
                                        "Gegner:"
                                    );


                                    for (
                                        const country
                                        of war.enemies
                                    ) {

                                        tooltipLines.push(
                                            country
                                        );

                                    }

                                }


                                const tooltip =
                                    tooltipLines.join(
                                        "\n"
                                    );


                                return `
                                    <span
                                        class="hint-item certain hint-tooltip-item"
                                        tabindex="0"
                                        role="button"
                                        aria-expanded="false"
                                    >
                                        ${escapeHintHtml(
                                            war.name
                                        )}

                                        <span
                                            class="hint-tooltip"
                                            role="tooltip"
                                        >
                                            ${escapeHintHtml(
                                                tooltip
                                            )}
                                        </span>
                                    </span>
                                `;

                            }
                        )
                        .join("")
                }

            </div>

        </div>
    `;

}


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
                                class="hint-item certain hint-tooltip-item"
                                tabindex="0"
                                role="button"
                                aria-expanded="false"
                            >
                                ${escapeHintHtml(
                                    name
                                )}

                                <span
                                    class="hint-tooltip"
                                    role="tooltip"
                                >
                                    Dieses Land grenzt an das gesuchte Land.
                                </span>
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
                                    class="hint-item certain hint-tooltip-item"
                                    tabindex="0"
                                    role="button"
                                    aria-expanded="false"
                                >
                                    ${escapeHintHtml(
                                        text
                                    )}

                                    <span
                                        class="hint-tooltip"
                                        role="tooltip"
                                    >
                                        ${escapeHintHtml(
                                            tooltip
                                        )}
                                    </span>
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
                                        class="hint-item certain hint-tooltip-item"
                                        tabindex="0"
                                        role="button"
                                        aria-expanded="false"
                                    >
                                        ${escapeHintHtml(
                                            water
                                        )}

                                        <span
                                            class="hint-tooltip"
                                            role="tooltip"
                                        >
                                            Dieses Gewässer wurde bei mindestens zwei positiven Treffern gefunden und kommt nachweislich auch beim gesuchten Land vor.
                                        </span>
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
                                        class="hint-item possible hint-tooltip-item"
                                        tabindex="0"
                                        role="button"
                                        aria-expanded="false"
                                    >
                                        ${escapeHintHtml(
                                            water
                                        )}

                                        <span
                                            class="hint-tooltip"
                                            role="tooltip"
                                        >
                                            Dieses Gewässer wurde bei mindestens einem positiven Treffer gefunden. Es ist noch nicht gesichert.
                                        </span>
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
                                        class="hint-item certain hint-tooltip-item"
                                        tabindex="0"
                                        role="button"
                                        aria-expanded="false"
                                    >
                                        ${escapeHintHtml(
                                            language
                                        )}

                                        <span
                                            class="hint-tooltip"
                                            role="tooltip"
                                        >
                                            Diese Sprache wurde bei einem einsprachigen positiven Treffer oder bei mindestens zwei positiven Treffern gefunden und kommt nachweislich auch beim gesuchten Land vor.
                                        </span>
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
                                        class="hint-item possible hint-tooltip-item"
                                        tabindex="0"
                                        role="button"
                                        aria-expanded="false"
                                    >
                                        ${escapeHintHtml(
                                            language
                                        )}

                                        <span
                                            class="hint-tooltip"
                                            role="tooltip"
                                        >
                                            Diese Sprache wurde bei mindestens einem positiven Treffer gefunden. Sie ist noch nicht gesichert.
                                        </span>
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
