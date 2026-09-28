// ==========================================
// STATISTIK
// ==========================================

const STATISTICS_KEY =
    "countryWordleStatistics";


// ==========================================
// KONTINENT-ZUORDNUNG
// ==========================================

const CONTINENT_KEYS = {

    "Afrika":
        "afrika",

    "Asien":
        "asien",

    "Europa":
        "europa",

    "Nordamerika":
        "nordamerika",

    "Südamerika":
        "suedamerika",

    "Ozeanien":
        "ozeanien"

};


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
// STANDARD-KONTINENT
// ==========================================

function getDefaultContinentStatistics() {

    return {

        games: 0,

        wins: 0,

        losses: 0,

        totalGuesses: 0,

        guessDistribution: {}

    };

}


// ==========================================
// STATISTIK AUS PROFILES AUFBAUEN
// ==========================================

function buildStatisticsFromProfile(
    profile
) {

    const statistics =
        getDefaultStatistics();


    statistics.gamesPlayed =
        Number(
            profile.games_played
        ) || 0;


    statistics.wins =
        Number(
            profile.wins
        ) || 0;


    statistics.losses =
        Number(
            profile.losses
        ) || 0;


    statistics.totalGuesses =
        Number(
            profile.total_guesses
        ) || 0;


    Object.entries(
        CONTINENT_KEYS
    ).forEach(
        (
            [
                continent,
                databaseKey
            ]
        ) => {

            const data =
                profile[
                databaseKey
                ];


            if (
                !data ||
                typeof data !== "object"
            ) {

                return;

            }


            statistics.continents[
                continent
            ] = {

                games:
                    Number(
                        data.games
                    ) || 0,

                wins:
                    Number(
                        data.wins
                    ) || 0,

                losses:
                    Number(
                        data.losses
                    ) || 0,

                totalGuesses:
                    Number(
                        data.totalGuesses
                    ) || 0,

                guessDistribution:
                    data.guessDistribution &&
                        typeof data.guessDistribution === "object"
                        ? {
                            ...data.guessDistribution
                        }
                        : {}

            };

        }
    );


    calculateDerivedStatistics(
        statistics
    );


    return statistics;

}


// ==========================================
// ABGELEITETE WERTE BERECHNEN
// ==========================================

function calculateDerivedStatistics(
    statistics
) {

    statistics.bestGuesses =
        null;


    statistics.worstGuesses =
        null;


    statistics.guessDistribution =
        {};


    Object.values(
        statistics.continents
    ).forEach(
        continent => {

            Object.entries(
                continent.guessDistribution || {}
            ).forEach(
                (
                    [
                        guesses,
                        count
                    ]
                ) => {

                    const numericGuesses =
                        Number(
                            guesses
                        );


                    const numericCount =
                        Number(
                            count
                        ) || 0;


                    if (
                        !Number.isFinite(
                            numericGuesses
                        ) ||
                        numericCount <= 0
                    ) {

                        return;

                    }


                    if (
                        !statistics.guessDistribution[
                        numericGuesses
                        ]
                    ) {

                        statistics.guessDistribution[
                            numericGuesses
                        ] =
                            0;

                    }


                    statistics.guessDistribution[
                        numericGuesses
                    ] +=
                        numericCount;


                    if (
                        statistics.bestGuesses === null ||
                        numericGuesses <
                        statistics.bestGuesses
                    ) {

                        statistics.bestGuesses =
                            numericGuesses;

                    }


                    if (
                        statistics.worstGuesses === null ||
                        numericGuesses >
                        statistics.worstGuesses
                    ) {

                        statistics.worstGuesses =
                            numericGuesses;

                    }

                }
            );

        }
    );

}


// ==========================================
// LOKALE STATISTIK LADEN
// ==========================================

function getLocalStatistics() {

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
                    ] =
                        getDefaultContinentStatistics();


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
            "Fehler beim Laden der lokalen Statistik:",
            error
        );


        return getDefaultStatistics();

    }

}


// ==========================================
// STATISTIK LADEN
// ==========================================

async function getStatistics() {

    const user =
        await getCurrentUser();


    // ======================================
    // GAST
    // ======================================

    if (!user) {

        return getLocalStatistics();

    }


    // ======================================
    // EINGELOGGT
    // ======================================

    try {

        const result =
            await supabaseRequest(
                `profiles?select=*&id=eq.${user.id}`
            );


        if (
            !result ||
            result.length === 0
        ) {

            console.error(
                "Kein Profil für den Benutzer gefunden."
            );


            return getDefaultStatistics();

        }


        return buildStatisticsFromProfile(
            result[0]
        );

    }

    catch (error) {

        console.error(
            "Fehler beim Laden der Benutzerstatistik:",
            error
        );


        return getDefaultStatistics();

    }

}


// ==========================================
// LOKALE STATISTIK SPEICHERN
// ==========================================

function saveLocalStatistics(
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

async function recordGame(
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


    const user =
        await getCurrentUser();


    // ======================================
    // GAST
    // ======================================

    if (!user) {

        const statistics =
            getLocalStatistics();


        statistics.gamesPlayed++;


        if (
            !statistics.continents[
            continent
            ]
        ) {

            statistics.continents[
                continent
            ] =
                getDefaultContinentStatistics();

        }


        const continentStatistics =
            statistics.continents[
            continent
            ];


        continentStatistics.games++;


        if (won) {

            statistics.wins++;


            statistics.totalGuesses +=
                guesses;


            continentStatistics.wins++;


            continentStatistics.totalGuesses +=
                guesses;


            if (
                statistics.bestGuesses === null ||
                guesses <
                statistics.bestGuesses
            ) {

                statistics.bestGuesses =
                    guesses;

            }


            if (
                statistics.worstGuesses === null ||
                guesses >
                statistics.worstGuesses
            ) {

                statistics.worstGuesses =
                    guesses;

            }


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

        else {

            statistics.losses++;


            continentStatistics.losses++;

        }


        saveLocalStatistics(
            statistics
        );


        return;

    }


    // ======================================
    // EINGELOGGT
    // ======================================

    const databaseKey =
        CONTINENT_KEYS[
        continent
        ];


    if (!databaseKey) {

        console.error(
            "Unbekannter Kontinent:",
            continent
        );


        return;

    }


    try {

        const result =
            await supabaseRequest(
                `profiles?select=*&id=eq.${user.id}`
            );


        if (
            !result ||
            result.length === 0
        ) {

            throw new Error(
                "Benutzerprofil nicht gefunden."
            );

        }


        const profile =
            result[0];


        const continentStatistics = {

            ...(profile[
                databaseKey
            ] || getDefaultContinentStatistics())

        };


        continentStatistics.games =
            Number(
                continentStatistics.games
            ) || 0;


        continentStatistics.wins =
            Number(
                continentStatistics.wins
            ) || 0;


        continentStatistics.losses =
            Number(
                continentStatistics.losses
            ) || 0;


        continentStatistics.totalGuesses =
            Number(
                continentStatistics.totalGuesses
            ) || 0;


        continentStatistics.guessDistribution =
            continentStatistics.guessDistribution &&
                typeof continentStatistics.guessDistribution === "object"
                ? {
                    ...continentStatistics.guessDistribution
                }
                : {};


        continentStatistics.games++;


        if (won) {

            continentStatistics.wins++;


            continentStatistics.totalGuesses +=
                guesses;


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

        else {

            continentStatistics.losses++;

        }


        const gamesPlayed =
            Number(
                profile.games_played
            ) || 0;


        const wins =
            Number(
                profile.wins
            ) || 0;


        const losses =
            Number(
                profile.losses
            ) || 0;


        const totalGuesses =
            Number(
                profile.total_guesses
            ) || 0;


        const updateData = {

            games_played:
                gamesPlayed + 1,

            wins:
                wins +
                (
                    won
                        ? 1
                        : 0
                ),

            losses:
                losses +
                (
                    won
                        ? 0
                        : 1
                ),

            total_guesses:
                totalGuesses +
                (
                    won
                        ? guesses
                        : 0
                )

        };


        updateData[
            databaseKey
        ] =
            continentStatistics;


        await supabaseRequest(
            `profiles?id=eq.${user.id}`,
            {

                method:
                    "PATCH",

                headers: {

                    Prefer:
                        "return=minimal"

                },

                body:
                    JSON.stringify(
                        updateData
                    )

            }
        );

    }

    catch (error) {

        console.error(
            "Fehler beim Speichern der Benutzerstatistik:",
            error
        );

    }

}


// ==========================================
// DURCHSCHNITT
// ==========================================

async function getAverageGuesses() {

    const statistics =
        await getStatistics();


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

async function getContinentAverage(
    continent
) {

    const statistics =
        await getStatistics();


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

async function getMostPlayedContinent() {

    const statistics =
        await getStatistics();


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

async function getBestContinent() {

    const statistics =
        await getStatistics();


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

async function getWorstContinent() {

    const statistics =
        await getStatistics();


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

async function displayStatistics() {

    const statistics =
        await getStatistics();


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


    if (gamesElement) {

        gamesElement.textContent =
            statistics.gamesPlayed;

    }


    if (winsElement) {

        winsElement.textContent =
            statistics.wins;

    }


    if (lossesElement) {

        lossesElement.textContent =
            statistics.losses;

    }


    if (averageElement) {

        const average =
            statistics.wins > 0
                ? statistics.totalGuesses /
                statistics.wins
                : null;


        averageElement.textContent =
            average === null
                ? "-"
                : average.toFixed(1);

    }


    if (bestElement) {

        bestElement.textContent =
            statistics.bestGuesses === null
                ? "-"
                : statistics.bestGuesses;

    }


    if (worstElement) {

        worstElement.textContent =
            statistics.worstGuesses === null
                ? "-"
                : statistics.worstGuesses;

    }


    const mostContinent =
        await getMostPlayedContinent();


    const bestContinent =
        await getBestContinent();


    const worstContinent =
        await getWorstContinent();


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


    if (mostElement) {

        mostElement.textContent =
            mostContinent || "-";

    }


    if (bestContinentElement) {

        bestContinentElement.textContent =
            bestContinent || "-";

    }


    if (worstContinentElement) {

        worstContinentElement.textContent =
            worstContinent || "-";

    }

}


// ==========================================
// VERSUCHSVERTEILUNG
// ==========================================

async function displayGuessDistribution(
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


    if (!container) {

        return;

    }


    const statistics =
        await getStatistics();


    let distribution =
        statistics.guessDistribution;


    if (continent) {

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


    if (title) {

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


    if (entries.length === 0) {

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

async function displayContinentDetails(
    selectedContinent = null
) {

    const container =
        document.getElementById(
            "continent-statistics-detail"
        );


    if (!container) {

        return;

    }


    const statistics =
        await getStatistics();


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


    if (continents.length === 0) {

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


            if (!data) {

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
                `${data.losses} Niederlagen · ` +
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

async function displayDetailedStatistics(
    continent = null
) {

    await displayGuessDistribution(
        continent
    );


    await displayContinentDetails(
        continent
    );

}


// ==========================================
// STATISTIK INITIALISIEREN
// ==========================================

displayStatistics();