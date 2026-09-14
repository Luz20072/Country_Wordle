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

        wins: 0,

        losses: 0,

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

    const savedStatistics =
        localStorage.getItem(
            STATISTICS_KEY
        );


    if (
        !savedStatistics
    ) {

        return getDefaultStatistics();

    }


    try {

        const parsedStatistics =
            JSON.parse(
                savedStatistics
            );


        const statistics = {

            ...getDefaultStatistics(),

            ...parsedStatistics

        };


        /*
         * Kompatibilität mit alten
         * Statistikdaten.
         *
         * Früher wurden nur Spiele gezählt.
         * Diese werden deshalb als Siege
         * übernommen.
         */

        if (
            parsedStatistics.wins === undefined &&
            parsedStatistics.losses === undefined
        ) {

            statistics.wins =
                Number(
                    statistics.gamesPlayed
                ) || 0;


            statistics.losses =
                0;

        }


        if (
            !statistics.continents ||
            typeof statistics.continents !== "object"
        ) {

            statistics.continents =
                {};

        }


        Object.keys(
            statistics.continents
        ).forEach(
            continent => {

                const data =
                    statistics.continents[
                    continent
                    ];


                if (
                    !data ||
                    typeof data !== "object"
                ) {

                    statistics.continents[
                        continent
                    ] = {

                        games: 0,

                        wins: 0,

                        losses: 0,

                        totalGuesses: 0,

                        guessDistribution: {}

                    };

                    return;

                }


                if (
                    data.wins === undefined &&
                    data.losses === undefined
                ) {

                    data.wins =
                        Number(
                            data.games
                        ) || 0;


                    data.losses =
                        0;

                }


                if (
                    data.guessDistribution === undefined
                ) {

                    data.guessDistribution =
                        {};

                }

            }
        );


        return statistics;

    }

    catch (error) {

        console.error(
            "Fehler beim Laden der Statistik:",
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
// SPIEL AUFZEICHNEN
// ==========================================

function recordGame(
    continent,
    guesses,
    won = true
) {

    if (
        !continent ||
        !Number.isFinite(
            Number(guesses)
        ) ||
        Number(guesses) < 1
    ) {

        return;

    }


    guesses =
        Number(
            guesses
        );


    const statistics =
        getStatistics();


    // ======================================
    // GESAMTSPIELE
    // ======================================

    statistics.gamesPlayed++;


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

            wins: 0,

            losses: 0,

            totalGuesses: 0,

            guessDistribution: {}

        };

    }


    const continentStatistics =
        statistics.continents[
        continent
        ];


    continentStatistics.games++;


    // ======================================
    // SIEG
    // ======================================

    if (
        won
    ) {

        statistics.wins++;


        statistics.totalGuesses +=
            guesses;


        continentStatistics.wins++;


        continentStatistics.totalGuesses +=
            guesses;


        // ==================================
        // BESTWERT
        // ==================================

        if (
            statistics.bestGuesses === null ||
            guesses <
            statistics.bestGuesses
        ) {

            statistics.bestGuesses =
                guesses;

        }


        // ==================================
        // SCHLECHTESTER WERT
        // ==================================

        if (
            statistics.worstGuesses === null ||
            guesses >
            statistics.worstGuesses
        ) {

            statistics.worstGuesses =
                guesses;

        }


        // ==================================
        // GESAMT-VERTEILUNG
        // ==================================

        if (
            !statistics.guessDistribution[
            guesses
            ]
        ) {

            statistics.guessDistribution[
                guesses
            ] =
                0;

        }


        statistics.guessDistribution[
            guesses
        ]++;


        // ==================================
        // KONTINENT-VERTEILUNG
        // ==================================

        if (
            !continentStatistics.guessDistribution[
            guesses
            ]
        ) {

            continentStatistics.guessDistribution[
                guesses
            ] =
                0;

        }


        continentStatistics.guessDistribution[
            guesses
        ]++;

    }


    // ======================================
    // VERLUST
    // ======================================

    else {

        statistics.losses++;


        continentStatistics.losses++;

    }


    saveStatistics(
        statistics
    );

}


// ==========================================
// DURCHSCHNITT
// ==========================================

function getAverageGuesses() {

    const statistics =
        getStatistics();


    if (
        statistics.wins === 0
    ) {

        return null;

    }


    return (
        statistics.totalGuesses /
        statistics.wins
    );

}


// ==========================================
// KONTINENT-DURCHSCHNITT
// ==========================================

function getContinentAverage(
    continent
) {

    const statistics =
        getStatistics();


    const data =
        statistics.continents[
        continent
        ];


    if (
        !data ||
        !data.wins
    ) {

        return null;

    }


    return (
        data.totalGuesses /
        data.wins
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
            b.games -
            a.games
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
        )
            .filter(
                ([, data]) =>
                    data.wins > 0
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
                a.wins;


            const averageB =
                b.totalGuesses /
                b.wins;


            return (
                averageA -
                averageB
            );

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
        )
            .filter(
                ([, data]) =>
                    data.wins > 0
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
                a.wins;


            const averageB =
                b.totalGuesses /
                b.wins;


            return (
                averageB -
                averageA
            );

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


    const winsElement =
        document.getElementById(
            "stat-wins"
        );


    const lossesElement =
        document.getElementById(
            "stat-losses"
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


    if (
        gamesElement
    ) {

        gamesElement.textContent =
            statistics.gamesPlayed;

    }


    if (
        winsElement
    ) {

        winsElement.textContent =
            statistics.wins;

    }


    if (
        lossesElement
    ) {

        lossesElement.textContent =
            statistics.losses;

    }


    if (
        averageElement
    ) {

        const average =
            getAverageGuesses();


        averageElement.textContent =
            average === null
                ? "-"
                : average.toFixed(1);

    }


    if (
        bestElement
    ) {

        bestElement.textContent =
            statistics.bestGuesses === null
                ? "-"
                : statistics.bestGuesses;

    }


    if (
        worstElement
    ) {

        worstElement.textContent =
            statistics.worstGuesses === null
                ? "-"
                : statistics.worstGuesses;

    }


    const mostContinent =
        getMostPlayedContinent();


    const bestContinent =
        getBestContinent();


    const worstContinent =
        getWorstContinent();


    const mostElement =
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
        mostElement
    ) {

        mostElement.textContent =
            mostContinent || "-";

    }


    if (
        bestContinentElement
    ) {

        bestContinentElement.textContent =
            bestContinent || "-";

    }


    if (
        worstContinentElement
    ) {

        worstContinentElement.textContent =
            worstContinent || "-";

    }

}


// ==========================================
// VERSUCHSVERTEILUNG
// ==========================================

function displayGuessDistribution(
    continent = null
) {

    const container =
        document.getElementById(
            "guess-distribution"
        );


    const title =
        document.getElementById(
            "guess-distribution-title"
        );


    if (
        !container
    ) {

        return;

    }


    const statistics =
        getStatistics();


    let distribution =
        statistics.guessDistribution;


    if (
        continent
    ) {

        const continentStatistics =
            statistics.continents[
            continent
            ];


        distribution =
            continentStatistics
                ? continentStatistics.guessDistribution
                : {};

    }


    container.innerHTML =
        "";


    if (
        title
    ) {

        title.textContent =
            continent
                ? `Versuchsverteilung – ${continent}`
                : "Versuchsverteilung – Gesamt";

    }


    const entries =
        Object.entries(
            distribution
        )
            .map(
                ([guesses, count]) => [
                    Number(guesses),
                    Number(count)
                ]
            )
            .sort(
                ([a], [b]) =>
                    a - b
            );


    if (
        entries.length === 0
    ) {

        const empty =
            document.createElement(
                "p"
            );


        empty.className =
            "statistics-empty";


        empty.textContent =
            "Noch keine gewonnenen Spiele vorhanden.";


        container.appendChild(
            empty
        );


        return;

    }


    const maxCount =
        Math.max(
            ...entries.map(
                ([, count]) =>
                    count
            )
        );


    entries.forEach(
        (
            [
                guesses,
                count
            ]
        ) => {

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
                guesses === 1
                    ? "1 Versuch"
                    : `${guesses} Versuche`;


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
                `${(count / maxCount) * 100}%`;


            const countElement =
                document.createElement(
                    "span"
                );


            countElement.className =
                "guess-distribution-count";


            countElement.textContent =
                count;


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
                countElement
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

function displayContinentDetails(
    selectedContinent = null
) {

    const container =
        document.getElementById(
            "continent-statistics-detail"
        );


    if (
        !container
    ) {

        return;

    }


    const statistics =
        getStatistics();


    container.innerHTML =
        "";


    const continents =
        selectedContinent
            ? [
                selectedContinent
            ]
            : Object.keys(
                statistics.continents
            );


    if (
        continents.length === 0
    ) {

        const empty =
            document.createElement(
                "p"
            );


        empty.className =
            "statistics-empty";


        empty.textContent =
            "Noch keine Spiele vorhanden.";


        container.appendChild(
            empty
        );


        return;

    }


    continents.sort();


    continents.forEach(
        continent => {

            const data =
                statistics.continents[
                continent
                ];


            if (
                !data
            ) {

                return;

            }


            const card =
                document.createElement(
                    "button"
                );


            card.type =
                "button";


            card.className =
                "continent-statistic-detail";


            const title =
                document.createElement(
                    "strong"
                );


            title.textContent =
                continent;


            const details =
                document.createElement(
                    "span"
                );


            const average =
                data.wins > 0
                    ? (
                        data.totalGuesses /
                        data.wins
                    ).toFixed(1)
                    : "-";


            details.textContent =
                `${data.games} Spiele · ` +
                `${data.wins} Siege · ` +
                `${data.losses} Niederlagen· ` +
                `Ø ${average} Versuche`;


            card.appendChild(
                title
            );


            card.appendChild(
                details
            );


            card.addEventListener(
                "click",
                () => {

                    displayGuessDistribution(
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
// DETAILSTATISTIK
// ==========================================

function displayDetailedStatistics(
    continent = null
) {

    displayGuessDistribution(
        continent
    );


    displayContinentDetails(
        continent
    );

}


// ==========================================
// STATISTIK INITIALISIEREN
// ==========================================

displayStatistics();