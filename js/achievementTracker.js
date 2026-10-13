// ==========================================
// COUNTRY WORDLE – ACHIEVEMENT TRACKER
// ==========================================


// ==========================================
// KONFIGURATION
// ==========================================

const ACHIEVEMENT_CONTINENTS = {
    "Afrika": {
        key: "afrika",
        expert: "achievement_africa_expert",
        connoisseur: "achievement_africa_connoisseur"
    },

    "Asien": {
        key: "asien",
        expert: "achievement_asia_expert",
        connoisseur: "achievement_asia_connoisseur"
    },

    "Europa": {
        key: "europa",
        expert: "achievement_europe_expert",
        connoisseur: "achievement_europe_connoisseur"
    },

    "Nordamerika": {
        key: "nordamerika",
        expert: "achievement_north_america_expert",
        connoisseur: "achievement_north_america_connoisseur"
    },

    "Südamerika": {
        key: "suedamerika",
        expert: "achievement_south_america_expert",
        connoisseur: "achievement_south_america_connoisseur"
    },

    "Ozeanien": {
        key: "ozeanien",
        expert: "achievement_oceania_expert",
        connoisseur: "achievement_oceania_connoisseur"
    }
};


// Alle Achievement-Spalten der Datenbank.
// Bereits freigeschaltete Achievements werden niemals zurückgesetzt.

const ACHIEVEMENT_COLUMNS = [
    "achievement_games_1",
    "achievement_games_10",
    "achievement_games_50",
    "achievement_games_100",

    "achievement_wins_1",
    "achievement_wins_10",
    "achievement_wins_50",
    "achievement_wins_100",

    "achievement_geographic_genius",
    "achievement_hellseher",
    "achievement_world_traveler",

    "achievement_africa_expert",
    "achievement_asia_expert",
    "achievement_europe_expert",
    "achievement_north_america_expert",
    "achievement_south_america_expert",
    "achievement_oceania_expert",

    "achievement_series_master",

    "achievement_explorer",
    "achievement_globetrotter",
    "achievement_geography_lexicon",

    "achievement_africa_connoisseur",
    "achievement_asia_connoisseur",
    "achievement_europe_connoisseur",
    "achievement_north_america_connoisseur",
    "achievement_south_america_connoisseur",
    "achievement_oceania_connoisseur",

    "achievement_entire_world_discovered",

    "achievement_last_second",
    "achievement_without_hints",

    "achievement_lost_5",
    "achievement_lost_10",
    "achievement_lost_50",
    "achievement_lost_100",

    "achievement_bitter_end",
    "achievement_losing_streak"
];


// ==========================================
// HILFSFUNKTIONEN
// ==========================================


/**
 * Gibt die aktuelle Anzahl eines Wertes sicher zurück.
 */
function achievementNumber(value) {
    const number = Number(value);

    return Number.isFinite(number)
        ? number
        : 0;
}


/**
 * Liest eine JSONB-Kontinentstatistik aus dem Profil.
 */
function achievementGetContinentStats(profile, continent) {
    const config = ACHIEVEMENT_CONTINENTS[continent];

    if (!config) {
        return {
            wins: 0,
            games: 0,
            losses: 0
        };
    }

    let stats = profile[config.key];

    if (typeof stats === "string") {
        try {
            stats = JSON.parse(stats);
        } catch {
            stats = {};
        }
    }

    if (!stats || typeof stats !== "object") {
        stats = {};
    }

    return {
        wins: achievementNumber(stats.wins),
        games: achievementNumber(stats.games),
        losses: achievementNumber(stats.losses)
    };
}


/**
 * Normalisiert die von Supabase gelieferte integer[]-Spalte.
 *
 * Supabase liefert normalerweise ein JavaScript-Array.
 * Der String-Fallback unterstützt zusätzlich PostgreSQL-Arraynotation.
 */
function achievementNormalizeCountryIds(value) {
    if (Array.isArray(value)) {
        return [
            ...new Set(
                value
                    .map(Number)
                    .filter(Number.isSafeInteger)
            )
        ];
    }

    if (typeof value === "string") {
        const trimmed = value.trim();

        if (!trimmed || trimmed === "{}") {
            return [];
        }

        const withoutBraces = trimmed
            .replace(/^\{/, "")
            .replace(/\}$/, "");

        if (!withoutBraces) {
            return [];
        }

        return [
            ...new Set(
                withoutBraces
                    .split(",")
                    .map(value => Number(value.trim()))
                    .filter(Number.isSafeInteger)
            )
        ];
    }

    return [];
}


/**
 * Fügt eine Achievement-Spalte zum Update hinzu,
 * wenn sie freigeschaltet ist.
 *
 * Bestehende Freischaltungen werden nicht überschrieben.
 */
function achievementUnlock(updateData, currentStats, column, condition) {
    if (
        condition &&
        currentStats[column] !== true
    ) {
        updateData[column] = true;
    }
}


/**
 * Prüft, ob alle Länder einer Gruppe entdeckt wurden.
 */
function achievementAllCountriesDiscovered(
    discoveredCountryIds,
    countryIds
) {
    if (!countryIds.length) {
        return false;
    }

    const discovered = new Set(discoveredCountryIds);

    return countryIds.every(id => discovered.has(id));
}


// ==========================================
// DATENBANKZUGRIFF
// ==========================================


/**
 * Stellt sicher, dass ein Achievement-Datensatz existiert.
 *
 * Die Funktion arbeitet ausschließlich für angemeldete Nutzer.
 * Es werden keine Achievement-Datensätze für Gäste angelegt.
 */
async function ensureAchievementStatsRow(userId) {
    if (!userId) {
        return null;
    }

    const endpoint =
        `user_achievement_stats?select=*&user_id=eq.${encodeURIComponent(userId)}`;

    let result = await supabaseRequest(
        endpoint,
        {
            method: "GET",
            authenticated: true
        }
    );

    if (result.length > 0) {
        return result[0];
    }

    // Neuen Datensatz anlegen.
    // resolution=ignore-duplicates verhindert einen Fehler,
    // falls gleichzeitig ein anderer Tab den Datensatz erstellt.

    await supabaseRequest(
        "user_achievement_stats",
        {
            method: "POST",
            authenticated: true,
            headers: {
                Prefer: "resolution=ignore-duplicates,return=minimal"
            },
            body: JSON.stringify({
                user_id: userId
            })
        }
    );

    // Datensatz erneut laden.
    result = await supabaseRequest(
        endpoint,
        {
            method: "GET",
            authenticated: true
        }
    );

    if (!result.length) {
        throw new Error(
            "Achievement-Datensatz konnte nicht geladen werden."
        );
    }

    return result[0];
}


/**
 * Lädt das aktuelle Nutzerprofil.
 */
async function achievementGetProfile(userId) {
    const result = await supabaseRequest(
        `profiles?select=*&id=eq.${encodeURIComponent(userId)}`,
        {
            method: "GET",
            authenticated: true
        }
    );

    if (!result.length) {
        throw new Error(
            "Nutzerprofil für Achievements nicht gefunden."
        );
    }

    return result[0];
}


/**
 * Lädt alle Länder, um Kontinent- und Weltentdeckungen
 * zuverlässig überprüfen zu können.
 */
async function achievementGetCountries() {
    return await supabaseRequest(
        "countries?select=id,continent&order=id.asc",
        {
            method: "GET",
            authenticated: true
        }
    );
}


// ==========================================
// HAUPTFUNKTION
// ==========================================


/**
 * Verarbeitet ein abgeschlossenes Spiel und aktualisiert
 * die Achievement-Fortschritte des angemeldeten Nutzers.
 *
 * Erwartetes Objekt:
 *
 * {
 *     targetCountryId: 4,
 *     continent: "Europa",
 *     guesses: 3,
 *     won: true,
 *     hintsEnabled: true
 * }
 *
 * Diese Funktion ausschließlich einmal pro abgeschlossenem
 * Spiel aufrufen – nicht beim Anzeigen des Siegfensters.
 */
async function trackAchievementsAfterGame(gameResult) {
    try {
        // --------------------------------------
        // 1. Eingaben prüfen
        // --------------------------------------

        if (!gameResult || typeof gameResult !== "object") {
            throw new Error(
                "Ungültige Spieldaten für den Achievement-Tracker."
            );
        }

        const targetCountryId = Number(
            gameResult.targetCountryId
        );

        const guesses = Number(
            gameResult.guesses
        );

        const won = gameResult.won === true;

        const continent = gameResult.continent;

        const hintsEnabled =
            gameResult.hintsEnabled !== false;

        if (
            !Number.isSafeInteger(targetCountryId) ||
            targetCountryId <= 0
        ) {
            throw new Error(
                "Ungültige Ziel-Länder-ID."
            );
        }

        if (
            !Number.isSafeInteger(guesses) ||
            guesses < 1 ||
            guesses > 20
        ) {
            throw new Error(
                "Ungültige Anzahl an Versuchen."
            );
        }

        if (!ACHIEVEMENT_CONTINENTS[continent]) {
            throw new Error(
                `Unbekannter Kontinent: ${continent}`
            );
        }

        // --------------------------------------
        // 2. Nutzer prüfen
        // --------------------------------------

        const user = await getCurrentUser();

        // Gastmodus:
        // Keine Datenbankeinträge und keine Änderungen.
        if (!user) {
            return;
        }

        // --------------------------------------
        // 3. Daten laden
        // --------------------------------------

        const [
            profile,
            currentStats,
            countries
        ] = await Promise.all([
            achievementGetProfile(user.id),
            ensureAchievementStatsRow(user.id),
            achievementGetCountries()
        ]);

        // --------------------------------------
        // 4. Länderbestand vorbereiten
        // --------------------------------------

        const validCountries = countries.filter(country => {
            return (
                Number.isSafeInteger(Number(country.id)) &&
                ACHIEVEMENT_CONTINENTS[country.continent]
            );
        });

        const countryIdsByContinent = {};

        for (const country of validCountries) {
            const countryId = Number(country.id);

            if (!countryIdsByContinent[country.continent]) {
                countryIdsByContinent[country.continent] = [];
            }

            countryIdsByContinent[country.continent].push(
                countryId
            );
        }

        const targetCountry = validCountries.find(
            country => Number(country.id) === targetCountryId
        );

        if (!targetCountry) {
            throw new Error(
                "Das Ziel-Land wurde in der Länder-Tabelle nicht gefunden."
            );
        }

        if (targetCountry.continent !== continent) {
            throw new Error(
                "Der übergebene Kontinent stimmt nicht mit dem Ziel-Land überein."
            );
        }

        // --------------------------------------
        // 5. Bisherige Daten übernehmen
        // --------------------------------------

        const discoveredCountryIds =
            achievementNormalizeCountryIds(
                currentStats.discovered_country_ids
            );

        const discoveredSet = new Set(
            discoveredCountryIds
        );

        const updateData = {};

        // --------------------------------------
        // 6. Serien aktualisieren
        // --------------------------------------

        let currentWinStreak = achievementNumber(
            currentStats.current_win_streak
        );

        let maxWinStreak = achievementNumber(
            currentStats.max_win_streak
        );

        let currentLossStreak = achievementNumber(
            currentStats.current_loss_streak
        );

        let maxLossStreak = achievementNumber(
            currentStats.max_loss_streak
        );

        let currentPrecisionStreak = achievementNumber(
            currentStats.current_precision_streak
        );

        let maxPrecisionStreak = achievementNumber(
            currentStats.max_precision_streak
        );

        if (won) {
            // Siegesserie
            currentWinStreak += 1;
            currentLossStreak = 0;

            maxWinStreak = Math.max(
                maxWinStreak,
                currentWinStreak
            );

            // Präzisionsserie:
            // Sieg mit höchstens drei Versuchen.
            if (guesses <= 3) {
                currentPrecisionStreak += 1;
            } else {
                currentPrecisionStreak = 0;
            }

            maxPrecisionStreak = Math.max(
                maxPrecisionStreak,
                currentPrecisionStreak
            );
        } else {
            // Niederlagenserie
            currentLossStreak += 1;
            currentWinStreak = 0;

            maxLossStreak = Math.max(
                maxLossStreak,
                currentLossStreak
            );

            // Eine Niederlage beendet die Präzisionsserie.
            currentPrecisionStreak = 0;
        }

        updateData.current_win_streak =
            currentWinStreak;

        updateData.max_win_streak =
            maxWinStreak;

        updateData.current_loss_streak =
            currentLossStreak;

        updateData.max_loss_streak =
            maxLossStreak;

        updateData.current_precision_streak =
            currentPrecisionStreak;

        updateData.max_precision_streak =
            maxPrecisionStreak;

        // --------------------------------------
        // 7. Entdeckte Länder aktualisieren
        // --------------------------------------

        // Nur ein korrekt erratenes Zielland zählt.
        // Falsche Vermutungen werden niemals gespeichert.

        if (won && !discoveredSet.has(targetCountryId)) {
            discoveredSet.add(targetCountryId);
        }

        const updatedDiscoveredCountryIds = [
            ...discoveredSet
        ];

        updateData.discovered_country_ids =
            updatedDiscoveredCountryIds;

        const discoveredCount =
            updatedDiscoveredCountryIds.length;

        // --------------------------------------
        // 8. Spielstatistiken aus dem Profil
        // --------------------------------------

        // recordGame() muss die profiles-Statistiken vor
        // dem Aufruf dieses Trackers aktualisiert haben.

        const gamesPlayed = achievementNumber(
            profile.games_played
        );

        const wins = achievementNumber(
            profile.wins
        );

        const losses = achievementNumber(
            profile.losses
        );

        // --------------------------------------
        // 9. Spielanzahl-Achievements
        // --------------------------------------

        achievementUnlock(
            updateData,
            currentStats,
            "achievement_games_1",
            gamesPlayed >= 1
        );

        achievementUnlock(
            updateData,
            currentStats,
            "achievement_games_10",
            gamesPlayed >= 10
        );

        achievementUnlock(
            updateData,
            currentStats,
            "achievement_games_50",
            gamesPlayed >= 50
        );

        achievementUnlock(
            updateData,
            currentStats,
            "achievement_games_100",
            gamesPlayed >= 100
        );

        // --------------------------------------
        // 10. Sieg-Achievements
        // --------------------------------------

        achievementUnlock(
            updateData,
            currentStats,
            "achievement_wins_1",
            wins >= 1
        );

        achievementUnlock(
            updateData,
            currentStats,
            "achievement_wins_10",
            wins >= 10
        );

        achievementUnlock(
            updateData,
            currentStats,
            "achievement_wins_50",
            wins >= 50
        );

        achievementUnlock(
            updateData,
            currentStats,
            "achievement_wins_100",
            wins >= 100
        );

        // --------------------------------------
        // 11. Besondere Sieg-Achievements
        // --------------------------------------

        achievementUnlock(
            updateData,
            currentStats,
            "achievement_geographic_genius",
            won && guesses <= 2
        );

        achievementUnlock(
            updateData,
            currentStats,
            "achievement_hellseher",
            won && guesses === 1
        );

        achievementUnlock(
            updateData,
            currentStats,
            "achievement_series_master",
            currentPrecisionStreak >= 5
        );

        achievementUnlock(
            updateData,
            currentStats,
            "achievement_last_second",
            won && guesses === 20
        );

        achievementUnlock(
            updateData,
            currentStats,
            "achievement_without_hints",
            won && !hintsEnabled
        );

        // --------------------------------------
        // 12. Niederlagen-Achievements
        // --------------------------------------

        achievementUnlock(
            updateData,
            currentStats,
            "achievement_lost_5",
            losses >= 5
        );

        achievementUnlock(
            updateData,
            currentStats,
            "achievement_lost_10",
            losses >= 10
        );

        achievementUnlock(
            updateData,
            currentStats,
            "achievement_lost_50",
            losses >= 50
        );

        achievementUnlock(
            updateData,
            currentStats,
            "achievement_lost_100",
            losses >= 100
        );

        achievementUnlock(
            updateData,
            currentStats,
            "achievement_bitter_end",
            !won && guesses >= 20
        );

        achievementUnlock(
            updateData,
            currentStats,
            "achievement_losing_streak",
            currentLossStreak >= 5
        );

        // --------------------------------------
        // 13. Länderentdeckungs-Achievements
        // --------------------------------------

        achievementUnlock(
            updateData,
            currentStats,
            "achievement_explorer",
            discoveredCount >= 10
        );

        achievementUnlock(
            updateData,
            currentStats,
            "achievement_globetrotter",
            discoveredCount >= 50
        );

        achievementUnlock(
            updateData,
            currentStats,
            "achievement_geography_lexicon",
            discoveredCount >= 100
        );

        // --------------------------------------
        // 14. Kontinent-Experten
        // --------------------------------------

        for (const [name, config] of Object.entries(
            ACHIEVEMENT_CONTINENTS
        )) {
            const continentStats =
                achievementGetContinentStats(
                    profile,
                    name
                );

            achievementUnlock(
                updateData,
                currentStats,
                config.expert,
                continentStats.wins >= 10
            );
        }

        // --------------------------------------
        // 15. Weltreisender
        // --------------------------------------

        const hasWonOnEveryContinent =
            Object.keys(ACHIEVEMENT_CONTINENTS).every(
                name => {
                    return achievementGetContinentStats(
                        profile,
                        name
                    ).wins >= 1;
                }
            );

        achievementUnlock(
            updateData,
            currentStats,
            "achievement_world_traveler",
            hasWonOnEveryContinent
        );

        // --------------------------------------
        // 16. Kontinent-Kenner
        // --------------------------------------

        for (const [name, config] of Object.entries(
            ACHIEVEMENT_CONTINENTS
        )) {
            const continentCountryIds =
                countryIdsByContinent[name] || [];

            const hasDiscoveredEntireContinent =
                achievementAllCountriesDiscovered(
                    updatedDiscoveredCountryIds,
                    continentCountryIds
                );

            achievementUnlock(
                updateData,
                currentStats,
                config.connoisseur,
                hasDiscoveredEntireContinent
            );
        }

        // --------------------------------------
        // 17. Die ganze Welt entdeckt
        // --------------------------------------

        const allCountryIds = validCountries.map(
            country => Number(country.id)
        );

        const hasDiscoveredEntireWorld =
            achievementAllCountriesDiscovered(
                updatedDiscoveredCountryIds,
                allCountryIds
            );

        achievementUnlock(
            updateData,
            currentStats,
            "achievement_entire_world_discovered",
            hasDiscoveredEntireWorld
        );

        // --------------------------------------
        // 18. Achievement-Daten speichern
        // --------------------------------------

        const updateKeys = Object.keys(updateData);

        if (updateKeys.length === 0) {
            return;
        }

        await supabaseRequest(
            `user_achievement_stats?user_id=eq.${encodeURIComponent(user.id)}`,
            {
                method: "PATCH",
                authenticated: true,
                headers: {
                    Prefer: "return=minimal"
                },
                body: JSON.stringify(updateData)
            }
        );

    } catch (error) {
        // Fehler im Achievement-System dürfen das Spiel
        // oder die regulären Spielstatistiken nicht abbrechen.

        console.error(
            "Fehler beim Aktualisieren der Achievements:",
            error
        );
    }
}