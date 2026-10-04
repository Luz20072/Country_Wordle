// ==========================================
// RANKINGS
// ==========================================

const RANKING_LIMIT =
    5;


// ==========================================
// AKTUELLER RANKING-TYP
// ==========================================

let currentRanking =
    "average";


// ==========================================
// AKTUELLER KONTINENT
// ==========================================

let currentRankingContinent =
    "europa";


// ==========================================
// ELEMENTE
// ==========================================

const rankingTabs =
    document.querySelectorAll(
        ".ranking-tab"
    );


const rankingContinentSelection =
    document.getElementById(
        "ranking-continent-selection"
    );


const rankingContinents =
    document.querySelectorAll(
        ".ranking-continent"
    );


const rankingTableBody =
    document.getElementById(
        "ranking-table-body"
    );


const rankingValueHeader =
    document.getElementById(
        "ranking-value-header"
    );


// ==========================================
// RANKING-TABS
// ==========================================

rankingTabs.forEach(
    tab => {

        tab.addEventListener(
            "click",
            async () => {

                rankingTabs.forEach(
                    currentTab => {

                        currentTab.classList.remove(
                            "active"
                        );

                    }
                );


                tab.classList.add(
                    "active"
                );


                currentRanking =
                    tab.dataset.ranking;


                rankingContinentSelection.hidden =
                    currentRanking !==
                    "continents";


                updateRankingHeader();


                await loadRankings();

            }
        );

    }
);


// ==========================================
// KONTINENT-TABS
// ==========================================

rankingContinents.forEach(
    continent => {

        continent.addEventListener(
            "click",
            async () => {

                rankingContinents.forEach(
                    currentContinent => {

                        currentContinent.classList.remove(
                            "active"
                        );

                    }
                );


                continent.classList.add(
                    "active"
                );


                currentRankingContinent =
                    continent.dataset.continent;


                await loadRankings();

            }
        );

    }
);


// ==========================================
// ÜBERSCHRIFT AKTUALISIEREN
// ==========================================

function updateRankingHeader() {

    switch (
    currentRanking
    ) {

        case "average":

            rankingValueHeader.textContent =
                "Ø Versuche";

            break;


        case "continents":

            rankingValueHeader.textContent =
                "Ø Versuche";

            break;


        case "games":

            rankingValueHeader.textContent =
                "Gespielte Spiele";

            break;


        case "wins":

            rankingValueHeader.textContent =
                "Siege";

            break;

    }

}


// ==========================================
// RANKINGS LADEN
// ==========================================

async function loadRankings() {

    rankingTableBody.innerHTML = `
        <tr>
            <td colspan="3">
                Rankings werden geladen...
            </td>
        </tr>
    `;


    try {

        const profiles =
            await getRankingProfiles();


        const currentUser =
            await getCurrentUser();


        let rankingData;


        switch (
        currentRanking
        ) {

            case "average":

                rankingData =
                    buildAverageRanking(
                        profiles
                    );

                break;


            case "continents":

                rankingData =
                    buildContinentRanking(
                        profiles,
                        currentRankingContinent
                    );

                break;


            case "games":

                rankingData =
                    buildGamesRanking(
                        profiles
                    );

                break;


            case "wins":

                rankingData =
                    buildWinsRanking(
                        profiles
                    );

                break;


            default:

                rankingData = [];

        }


        displayRanking(
            rankingData,
            currentUser
        );

    }

    catch (error) {

        console.error(
            "Fehler beim Laden der Rankings:",
            error
        );


        rankingTableBody.innerHTML = `
            <tr>
                <td colspan="3">
                    Rankings konnten nicht geladen werden.
                </td>
            </tr>
        `;

    }

}


// ==========================================
// PROFILE LADEN
// ==========================================

async function getRankingProfiles() {

    const {
        data,
        error
    } =
        await supabaseClient
            .from("profiles")
            .select(`
                id,
                username,
                games_played,
                wins,
                losses,
                total_guesses,
                europa,
                asien,
                afrika,
                nordamerika,
                suedamerika,
                ozeanien
            `);


    if (error) {

        throw error;

    }


    return data || [];

}


// ==========================================
// STATISTIK AUS PROFILE AUFBAUEN
// ==========================================

function getRankingStatistics(
    profile
) {

    return buildStatisticsFromProfile(
        profile
    );

}


// ==========================================
// DURCHSCHNITT
// ==========================================

function buildAverageRanking(
    profiles
) {

    return profiles

        .map(
            profile => {

                const statistics =
                    getRankingStatistics(
                        profile
                    );


                if (
                    statistics.wins <= 0
                ) {

                    return null;

                }


                return {

                    id:
                        profile.id,

                    username:
                        profile.username ||
                        "Unbekannt",

                    value:
                        statistics.totalGuesses /
                        statistics.wins

                };

            }
        )

        .filter(
            entry =>
                entry !== null
        )

        .sort(
            (a, b) => {

                if (
                    a.value !==
                    b.value
                ) {

                    return (
                        a.value -
                        b.value
                    );

                }


                return a.username.localeCompare(
                    b.username,
                    "de"
                );

            }
        );

}


// ==========================================
// KONTINENT-RANKING
// ==========================================

function buildContinentRanking(
    profiles,
    continent
) {

    return profiles

        .map(
            profile => {

                const statistics =
                    getRankingStatistics(
                        profile
                    );


                const data =
                    statistics.continents[
                    getContinentName(
                        continent
                    )
                    ];


                if (
                    !data ||
                    data.wins <= 0
                ) {

                    return null;

                }


                return {

                    id:
                        profile.id,

                    username:
                        profile.username ||
                        "Unbekannt",

                    value:
                        data.totalGuesses /
                        data.wins

                };

            }
        )

        .filter(
            entry =>
                entry !== null
        )

        .sort(
            (a, b) => {

                if (
                    a.value !==
                    b.value
                ) {

                    return (
                        a.value -
                        b.value
                    );

                }


                return a.username.localeCompare(
                    b.username,
                    "de"
                );

            }
        );

}


// ==========================================
// KONTINENT-NAMEN
// ==========================================

function getContinentName(
    databaseKey
) {

    const entry =
        Object.entries(
            CONTINENT_KEYS
        )
            .find(
                ([, value]) =>
                    value ===
                    databaseKey
            );


    return entry
        ? entry[0]
        : null;

}


// ==========================================
// SPIELE-RANKING
// ==========================================

function buildGamesRanking(
    profiles
) {

    return profiles

        .map(
            profile => {

                const statistics =
                    getRankingStatistics(
                        profile
                    );


                if (
                    statistics.gamesPlayed <= 0
                ) {

                    return null;

                }


                return {

                    id:
                        profile.id,

                    username:
                        profile.username ||
                        "Unbekannt",

                    value:
                        statistics.gamesPlayed

                };

            }
        )

        .filter(
            entry =>
                entry !== null
        )

        .sort(
            (a, b) => {

                if (
                    a.value !==
                    b.value
                ) {

                    return (
                        b.value -
                        a.value
                    );

                }


                return a.username.localeCompare(
                    b.username,
                    "de"
                );

            }
        );

}


// ==========================================
// SIEGE-RANKING
// ==========================================

function buildWinsRanking(
    profiles
) {

    return profiles

        .map(
            profile => {

                const statistics =
                    getRankingStatistics(
                        profile
                    );


                if (
                    statistics.wins <= 0
                ) {

                    return null;

                }


                return {

                    id:
                        profile.id,

                    username:
                        profile.username ||
                        "Unbekannt",

                    value:
                        statistics.wins

                };

            }
        )

        .filter(
            entry =>
                entry !== null
        )

        .sort(
            (a, b) => {

                if (
                    a.value !==
                    b.value
                ) {

                    return (
                        b.value -
                        a.value
                    );

                }


                return a.username.localeCompare(
                    b.username,
                    "de"
                );

            }
        );

}


// ==========================================
// RANKING ANZEIGEN
// ==========================================

// ==========================================
// RANKING ANZEIGEN
// ==========================================

function displayRanking(
    rankingData,
    currentUser
) {

    if (
        rankingData.length === 0
    ) {

        rankingTableBody.innerHTML = `
            <tr>
                <td colspan="3">
                    Noch keine Daten vorhanden.
                </td>
            </tr>
        `;

        return;

    }


    const topPlayers =
        rankingData.slice(
            0,
            RANKING_LIMIT
        );


    const displayedPlayers =
        [...topPlayers];


    // ==========================================
    // EIGENEN SPIELER ERGÄNZEN
    // ==========================================

    if (currentUser) {

        const ownEntry =
            rankingData.find(
                entry =>
                    entry.id ===
                    currentUser.id
            );


        const alreadyDisplayed =
            topPlayers.some(
                entry =>
                    entry.id ===
                    currentUser.id
            );


        if (
            ownEntry &&
            !alreadyDisplayed
        ) {

            displayedPlayers.push(
                ownEntry
            );

        }

    }


    // ==========================================
    // TABELLE AUFBAUEN
    // ==========================================

    rankingTableBody.innerHTML =
        displayedPlayers
            .map(
                entry => {

                    const rank =
                        rankingData.findIndex(
                            rankingEntry =>
                                rankingEntry.id ===
                                entry.id
                        ) + 1;


                    // ==========================================
                    // RANG-DESIGN
                    // ==========================================

                    let rankDisplay;


                    switch (rank) {

                        case 1:

                            rankDisplay = `
                                <span class="ranking-badge ranking-badge-gold">
                                    <i data-lucide="trophy"></i>
                                    <span>1</span>
                                </span>
                            `;

                            break;


                        case 2:

                            rankDisplay = `
                                <span class="ranking-badge ranking-badge-silver">
                                    <i data-lucide="medal"></i>
                                    <span>2</span>
                                </span>
                            `;

                            break;


                        case 3:

                            rankDisplay = `
                                <span class="ranking-badge ranking-badge-bronze">
                                    <i data-lucide="medal"></i>
                                    <span>3</span>
                                </span>
                            `;

                            break;


                        default:

                            rankDisplay = `
                                <span class="ranking-rank">
                                    ${rank}
                                </span>
                            `;

                    }


                    // ==========================================
                    // EIGENER SPIELER
                    // ==========================================

                    const isCurrentPlayer =
                        currentUser &&
                        entry.id ===
                        currentUser.id;


                    // ==========================================
                    // ZEILE
                    // ==========================================

                    return `
                        <tr class="
                            ${isCurrentPlayer
                            ? "current-player "
                            : ""
                        }${rank <= 3
                            ? `ranking-place-${rank}`
                            : ""
                        }
                        ">

                            <td>
                                ${rankDisplay}
                            </td>

                            <td>
                                ${escapeRankingHTML(
                            entry.username
                        )}
                            </td>

                            <td>
                                ${formatRankingValue(
                            entry.value
                        )}
                            </td>

                        </tr>
                    `;

                }
            )
            .join("");


    // ==========================================
    // LUCIDE-ICONS INITIALISIEREN
    // ==========================================

    if (
        typeof lucide !== "undefined"
    ) {

        lucide.createIcons();

    }

}


// ==========================================
// WERTE FORMATIEREN
// ==========================================

function formatRankingValue(
    value
) {

    if (
        currentRanking ===
        "average" ||
        currentRanking ===
        "continents"
    ) {

        return value
            .toFixed(2)
            .replace(
                ".",
                ","
            );

    }


    return Math.round(
        value
    );

}


// ==========================================
// HTML ESCAPEN
// ==========================================

function escapeRankingHTML(
    value
) {

    return String(
        value
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


// ==========================================
// INITIALISIERUNG
// ==========================================

updateRankingHeader();

loadRankings();