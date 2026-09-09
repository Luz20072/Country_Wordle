// ==========================================
// STATISTIK
// ==========================================

const STATISTICS_KEY =
    "countryWordleStatistics";


// ==========================================
// AUSGEWÄHLTER KONTINENT
// ==========================================

let selectedStatisticsContinent =
    null;


// ==========================================
// STANDARDWERTE
// ==========================================

function getDefaultStatistics() {

    return {
        gamesPlayed: 0,
        totalGuesses: 0,
        bestGuesses: null,
        worstGuesses: null,
        guessDistribution: {},
        continents: {}
    };

}


// ==========================================
// STATISTIK LADEN
// ==========================================

function getStatistics() {

    const storedStatistics =
        localStorage.getItem(
            STATISTICS_KEY
        );


    if (!storedStatistics) {

        return getDefaultStatistics();

    }


    try {

        const statistics =
            JSON.parse(
                storedStatistics
            );


        const result = {
            ...getDefaultStatistics(),
            ...statistics
        };


        // ==========================================
        // DATENSTRUKTUR ABSICHERN
        // ==========================================

        if (
            !result.guessDistribution ||
            typeof result.guessDistribution !== "object"
        ) {

            result.guessDistribution = {};

        }


        if (
            !result.continents ||
            typeof result.continents !== "object"
        ) {

            result.continents = {};

        }


        return result;

    } catch (error) {

        console.error(
            "Statistik konnte nicht geladen werden:",
            error
        );


        return getDefaultStatistics();

    }

}


// ==========================================
// STATISTIK SPEICHERN
// ==========================================

function saveStatistics(
    statistics
) {

    localStorage.setItem(
        STATISTICS_KEY,
        JSON.stringify(
            statistics
        )
    );

}


// ==========================================
// SPIEL SPEICHERN
// ==========================================

function recordGame(
    continent,
    guesses
) {

    if (
        !continent ||
        !Number.isFinite(guesses) ||
        guesses < 1
    ) {

        return;

    }


    const statistics =
        getStatistics();


    // ==========================================
    // ALLGEMEINE STATISTIK
    // ==========================================

    statistics.gamesPlayed++;

    statistics.totalGuesses +=
        guesses;


    // ==========================================
    // WENIGSTE VERSUCHE
    // ==========================================

    if (
        statistics.bestGuesses === null ||
        guesses < statistics.bestGuesses
    ) {

        statistics.bestGuesses =
            guesses;

    }


    // ==========================================
    // MEISTE VERSUCHE
    // ==========================================

    if (
        statistics.worstGuesses === null ||
        guesses > statistics.worstGuesses
    ) {

        statistics.worstGuesses =
            guesses;

    }


    // ==========================================
    // GESAMT-VERSUCHSVERTEILUNG
    // ==========================================

    const guessKey =
        String(guesses);


    if (
        !statistics.guessDistribution[
        guessKey
        ]
    ) {

        statistics.guessDistribution[
            guessKey
        ] = 0;

    }


    statistics.guessDistribution[
        guessKey
    ]++;


    // ==========================================
    // KONTINENT
    // ==========================================

    if (
        !statistics.continents[
        continent
        ]
    ) {

        statistics.continents[
            continent
        ] = {
            games: 0,
            totalGuesses: 0,
            guessDistribution: {}
        };

    }


    const continentStatistics =
        statistics.continents[
        continent
        ];


    continentStatistics.games++;

    continentStatistics.totalGuesses +=
        guesses;


    // ==========================================
    // KONTINENTALE VERSUCHSVERTEILUNG
    // ==========================================

    if (
        !continentStatistics.guessDistribution ||
        typeof continentStatistics.guessDistribution !== "object"
    ) {

        continentStatistics.guessDistribution = {};

    }


    if (
        !continentStatistics.guessDistribution[
        guessKey
        ]
    ) {

        continentStatistics.guessDistribution[
            guessKey
        ] = 0;

    }


    continentStatistics.guessDistribution[
        guessKey
    ]++;


    // ==========================================
    // SPEICHERN
    // ==========================================

    saveStatistics(
        statistics
    );

}


// ==========================================
// DURCHSCHNITTLICHE VERSUCHSZAHL
// ==========================================

function getAverageGuesses() {

    const statistics =
        getStatistics();


    if (
        statistics.gamesPlayed === 0
    ) {

        return null;

    }


    return (
        statistics.totalGuesses /
        statistics.gamesPlayed
    );

}


// ==========================================
// DURCHSCHNITT EINES KONTINENTS
// ==========================================

function getContinentAverage(
    continent
) {

    const statistics =
        getStatistics();


    const continentStatistics =
        statistics.continents[
        continent
        ];


    if (
        !continentStatistics ||
        continentStatistics.games === 0
    ) {

        return null;

    }


    return (
        continentStatistics.totalGuesses /
        continentStatistics.games
    );

}


// ==========================================
// MEISTGESPIELTER KONTINENT
// ==========================================

function getMostPlayedContinent() {

    const statistics =
        getStatistics();


    const continents =
        Object.entries(
            statistics.continents
        );


    if (
        continents.length === 0
    ) {

        return null;

    }


    continents.sort(
        (
            [, a],
            [, b]
        ) =>
            b.games - a.games
    );


    return continents[0][0];

}


// ==========================================
// ERFOLGREICHSTER KONTINENT
// ==========================================

function getBestContinent() {

    const statistics =
        getStatistics();


    const continents =
        Object.entries(
            statistics.continents
        );


    if (
        continents.length === 0
    ) {

        return null;

    }


    continents.sort(
        (
            [, a],
            [, b]
        ) => {

            const averageA =
                a.totalGuesses /
                a.games;


            const averageB =
                b.totalGuesses /
                b.games;


            return averageA - averageB;

        }
    );


    return continents[0][0];

}


// ==========================================
// SCHWIERIGSTER KONTINENT
// ==========================================

function getWorstContinent() {

    const statistics =
        getStatistics();


    const continents =
        Object.entries(
            statistics.continents
        );


    if (
        continents.length === 0
    ) {

        return null;

    }


    continents.sort(
        (
            [, a],
            [, b]
        ) => {

            const averageA =
                a.totalGuesses /
                a.games;


            const averageB =
                b.totalGuesses /
                b.games;


            return averageB - averageA;

        }
    );


    return continents[0][0];

}


// ==========================================
// STATISTIK ANZEIGEN
// ==========================================

function displayStatistics() {

    const statistics =
        getStatistics();


    const gamesElement =
        document.getElementById(
            "stat-games"
        );


    const averageElement =
        document.getElementById(
            "stat-average"
        );


    const bestElement =
        document.getElementById(
            "stat-best"
        );


    const worstElement =
        document.getElementById(
            "stat-worst"
        );


    const mostContinentElement =
        document.getElementById(
            "stat-most-continent"
        );


    const bestContinentElement =
        document.getElementById(
            "stat-best-continent"
        );


    const worstContinentElement =
        document.getElementById(
            "stat-worst-continent"
        );


    if (gamesElement) {

        gamesElement.textContent =
            statistics.gamesPlayed;

    }


    if (averageElement) {

        const average =
            getAverageGuesses();


        averageElement.textContent =
            average !== null
                ? average.toFixed(1)
                : "-";

    }


    if (bestElement) {

        bestElement.textContent =
            statistics.bestGuesses !== null
                ? statistics.bestGuesses
                : "-";

    }


    if (worstElement) {

        worstElement.textContent =
            statistics.worstGuesses !== null
                ? statistics.worstGuesses
                : "-";

    }


    if (mostContinentElement) {

        mostContinentElement.textContent =
            getMostPlayedContinent() || "-";

    }


    if (bestContinentElement) {

        bestContinentElement.textContent =
            getBestContinent() || "-";

    }


    if (worstContinentElement) {

        worstContinentElement.textContent =
            getWorstContinent() || "-";

    }

}


// ==========================================
// VERSUCHSVERTEILUNG ERSTELLEN
// ==========================================

function displayGuessDistribution(
    distribution
) {

    const container =
        document.getElementById(
            "guess-distribution"
        );


    if (!container) {

        return;

    }


    container.innerHTML = "";


    const entries =
        Object.entries(
            distribution || {}
        )
            .map(
                ([guesses, count]) => ({
                    guesses: Number(guesses),
                    count: Number(count)
                })
            )
            .filter(
                entry =>
                    Number.isFinite(entry.guesses) &&
                    Number.isFinite(entry.count) &&
                    entry.count > 0
            )
            .sort(
                (a, b) =>
                    a.guesses - b.guesses
            );


    if (entries.length === 0) {

        const emptyMessage =
            document.createElement(
                "p"
            );


        emptyMessage.className =
            "statistics-empty";


        emptyMessage.textContent =
            "Noch keine Spiele gespielt.";


        container.appendChild(
            emptyMessage
        );


        return;

    }


    const highestCount =
        Math.max(
            ...entries.map(
                entry =>
                    entry.count
            )
        );


    entries.forEach(
        entry => {

            const row =
                document.createElement(
                    "div"
                );


            row.className =
                "guess-distribution-row";


            const label =
                document.createElement(
                    "span"
                );


            label.className =
                "guess-distribution-label";


            label.textContent =
                `${entry.guesses} Versuche`;


            const barContainer =
                document.createElement(
                    "div"
                );


            barContainer.className =
                "guess-distribution-bar-container";


            const bar =
                document.createElement(
                    "div"
                );


            bar.className =
                "guess-distribution-bar";


            bar.style.width =
                `${(entry.count / highestCount) * 100}%`;


            const count =
                document.createElement(
                    "span"
                );


            count.className =
                "guess-distribution-count";


            count.textContent =
                entry.count;


            barContainer.appendChild(
                bar
            );


            row.appendChild(
                label
            );


            row.appendChild(
                barContainer
            );


            row.appendChild(
                count
            );


            container.appendChild(
                row
            );

        }
    );

}


// ==========================================
// KONTINENT-DETAILS
// ==========================================

function displayContinentDetails() {

    const statistics =
        getStatistics();


    const container =
        document.getElementById(
            "continent-statistics-detail"
        );


    if (!container) {

        return;

    }


    container.innerHTML = "";


    const continents =
        Object.entries(
            statistics.continents
        )
            .sort(
                ([a], [b]) =>
                    a.localeCompare(
                        b,
                        "de"
                    )
            );


    if (continents.length === 0) {

        const emptyMessage =
            document.createElement(
                "p"
            );


        emptyMessage.className =
            "statistics-empty";


        emptyMessage.textContent =
            "Noch keine Spiele gespielt.";


        container.appendChild(
            emptyMessage
        );


        return;

    }


    continents.forEach(
        (
            [
                continent,
                data
            ]
        ) => {

            const card =
                document.createElement(
                    "button"
                );


            card.type =
                "button";


            card.className =
                "continent-statistic-detail";


            card.dataset.continent =
                continent;


            const name =
                document.createElement(
                    "strong"
                );


            name.textContent =
                continent;


            const average =
                data.games > 0
                    ? (
                        data.totalGuesses /
                        data.games
                    ).toFixed(1)
                    : "-";


            const details =
                document.createElement(
                    "span"
                );


            details.textContent =
                `${data.games} Spiele · Ø ${average} Versuche`;


            card.appendChild(
                name
            );


            card.appendChild(
                details
            );


            // ==========================================
            // KONTINENT AUSWÄHLEN
            // ==========================================

            card.addEventListener(
                "click",
                () => {

                    // ==========================================
                    // GLEICHEN KONTINENT ERNEUT ANGEKLICKT
                    // ==========================================

                    if (
                        selectedStatisticsContinent ===
                        continent
                    ) {

                        displayDetailedStatistics();

                        return;

                    }


                    // ==========================================
                    // ANDEREN KONTINENT AUSWÄHLEN
                    // ==========================================

                    displayDetailedStatistics(
                        continent
                    );

                }
            );


            container.appendChild(
                card
            );

        }
    );

}


// ==========================================
// DETAIL-STATISTIK ANZEIGEN
// ==========================================

function displayDetailedStatistics(
    continent = null
) {

    const statistics =
        getStatistics();


    // ==========================================
    // AKTUELLEN KONTINENT SPEICHERN
    // ==========================================

    selectedStatisticsContinent =
        continent;


    const title =
        document.getElementById(
            "guess-distribution-title"
        );


    let distribution =
        statistics.guessDistribution;


    // ==========================================
    // GESAMT
    // ==========================================

    if (!continent) {

        if (title) {

            title.textContent =
                "Versuchsverteilung – Gesamt";

        }

    }


    // ==========================================
    // KONTINENT
    // ==========================================

    else {

        const continentStatistics =
            statistics.continents[
            continent
            ];


        if (
            continentStatistics
        ) {

            distribution =
                continentStatistics.guessDistribution || {};

        } else {

            distribution = {};

        }


        if (title) {

            title.textContent =
                `Versuchsverteilung – ${continent}`;

        }

    }


    // ==========================================
    // VERTEILUNG AKTUALISIEREN
    // ==========================================

    displayGuessDistribution(
        distribution
    );


    // ==========================================
    // KONTINENTE AKTUALISIEREN
    // ==========================================

    displayContinentDetails();

}


// ==========================================
// STATISTIK BEIM LADEN ANZEIGEN
// ==========================================

displayStatistics();