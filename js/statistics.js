// ==========================================
// STATISTIK
// ==========================================


const STATISTICS_KEY =
    "countryWordleStatistics";


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


    if (
        !storedStatistics
    ) {

        return getDefaultStatistics();

    }


    try {

        const statistics =
            JSON.parse(
                storedStatistics
            );


        return {

            ...getDefaultStatistics(),
            ...statistics

        };

    } catch (
        error
    ) {

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


    // ======================================
    // ALLGEMEINE STATISTIK
    // ======================================

    statistics.gamesPlayed++;

    statistics.totalGuesses +=
        guesses;


    // ======================================
    // WENIGSTE VERSUCHE
    // ======================================

    if (
        statistics.bestGuesses === null ||
        guesses < statistics.bestGuesses
    ) {

        statistics.bestGuesses =
            guesses;

    }


    // ======================================
    // MEISTE VERSUCHE
    // ======================================

    if (
        statistics.worstGuesses === null ||
        guesses > statistics.worstGuesses
    ) {

        statistics.worstGuesses =
            guesses;

    }


    // ======================================
    // VERSUCHSVERTEILUNG
    // ======================================

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


    // ======================================
    // KONTINENT
    // ======================================

    if (
        !statistics.continents[
            continent
        ]
    ) {

        statistics.continents[
            continent
        ] = {

            games: 0,

            totalGuesses: 0

        };

    }


    statistics.continents[
        continent
    ].games++;


    statistics.continents[
        continent
    ].totalGuesses +=
        guesses;


    // ======================================
    // SPEICHERN
    // ======================================

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


    if (
        gamesElement
    ) {

        gamesElement.textContent =
            statistics.gamesPlayed;

    }


    if (
        averageElement
    ) {

        const average =
            getAverageGuesses();


        averageElement.textContent =
            average !== null
                ? average.toFixed(1)
                : "-";

    }


    if (
        bestElement
    ) {

        bestElement.textContent =
            statistics.bestGuesses !== null
                ? statistics.bestGuesses
                : "-";

    }


    if (
        worstElement
    ) {

        worstElement.textContent =
            statistics.worstGuesses !== null
                ? statistics.worstGuesses
                : "-";

    }


    if (
        mostContinentElement
    ) {

        mostContinentElement.textContent =
            getMostPlayedContinent() || "-";

    }


    if (
        bestContinentElement
    ) {

        bestContinentElement.textContent =
            getBestContinent() || "-";

    }


    if (
        worstContinentElement
    ) {

        worstContinentElement.textContent =
            getWorstContinent() || "-";

    }

}


// ==========================================
// STATISTIK BEIM LADEN ANZEIGEN
// ==========================================

displayStatistics();