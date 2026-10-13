// ==========================================
// COUNTRY WORDLE – ACHIEVEMENTS SEITE
// ==========================================


// ==========================================
// ACHIEVEMENT-DEFINITIONEN
// ==========================================

const ACHIEVEMENTS = [

    // --------------------------------------
    // SPIELE
    // --------------------------------------

    {
        id: "achievement_games_1",
        title: "Aller Anfang",
        description: "Spiele dein erstes Spiel.",
        icon: "🎮",
        category: "games",
        categoryName: "Spiele"
    },
    {
        id: "achievement_games_10",
        title: "Stammspieler",
        description: "Spiele insgesamt 10 Spiele.",
        icon: "🕹️",
        category: "games",
        categoryName: "Spiele"
    },
    {
        id: "achievement_games_50",
        title: "Spieler mit Erfahrung",
        description: "Spiele insgesamt 50 Spiele.",
        icon: "🎯",
        category: "games",
        categoryName: "Spiele"
    },
    {
        id: "achievement_games_100",
        title: "Unermüdlich",
        description: "Spiele insgesamt 100 Spiele.",
        icon: "🏅",
        category: "games",
        categoryName: "Spiele"
    },

    // --------------------------------------
    // SIEGE
    // --------------------------------------

    {
        id: "achievement_wins_1",
        title: "Erster Erfolg",
        description: "Gewinne dein erstes Spiel.",
        icon: "🥉",
        category: "wins",
        categoryName: "Siege"
    },
    {
        id: "achievement_wins_10",
        title: "Auf Erfolgskurs",
        description: "Gewinne insgesamt 10 Spiele.",
        icon: "🥈",
        category: "wins",
        categoryName: "Siege"
    },
    {
        id: "achievement_wins_50",
        title: "Erfolgreicher Entdecker",
        description: "Gewinne insgesamt 50 Spiele.",
        icon: "🥇",
        category: "wins",
        categoryName: "Siege"
    },
    {
        id: "achievement_wins_100",
        title: "Meister der Welt",
        description: "Gewinne insgesamt 100 Spiele.",
        icon: "💎",
        category: "wins",
        categoryName: "Siege"
    },

    // --------------------------------------
    // BESONDERE ERFOLGE
    // --------------------------------------

    {
        id: "achievement_geographic_genius",
        title: "Geografisches Genie",
        description: "Errate das Zielland mit höchstens zwei Versuchen.",
        icon: "🧠",
        category: "special",
        categoryName: "Besondere Erfolge"
    },
    {
        id: "achievement_hellseher",
        title: "Hellseher",
        description: "Errate das Zielland direkt beim ersten Versuch.",
        icon: "🔮",
        category: "special",
        categoryName: "Besondere Erfolge"
    },
    {
        id: "achievement_world_traveler",
        title: "Weltreisender",
        description: "Gewinne mindestens ein Spiel auf jedem spielbaren Kontinent.",
        icon: "🌍",
        category: "special",
        categoryName: "Besondere Erfolge"
    },
    {
        id: "achievement_series_master",
        title: "Serienmeister",
        description: "Gewinne fünf Spiele in Folge mit jeweils höchstens drei Versuchen.",
        icon: "🔥",
        category: "special",
        categoryName: "Besondere Erfolge"
    },
    {
        id: "achievement_last_second",
        title: "In letzter Sekunde",
        description: "Errate das Zielland mit deinem 20. Versuch.",
        icon: "⏳",
        category: "special",
        categoryName: "Besondere Erfolge"
    },
    {
        id: "achievement_without_hints",
        title: "Ohne Hilfe",
        description: "Gewinne ein Spiel, während die Hinweise deaktiviert sind.",
        icon: "🧭",
        category: "special",
        categoryName: "Besondere Erfolge"
    },

    // --------------------------------------
    // ENTDECKUNGEN
    // --------------------------------------

    {
        id: "achievement_explorer",
        title: "Entdecker",
        description: "Errate zehn verschiedene Länder als Zielland.",
        icon: "🗺️",
        category: "discovery",
        categoryName: "Entdeckungen"
    },
    {
        id: "achievement_globetrotter",
        title: "Globetrotter",
        description: "Errate 50 verschiedene Länder als Zielland.",
        icon: "✈️",
        category: "discovery",
        categoryName: "Entdeckungen"
    },
    {
        id: "achievement_geography_lexicon",
        title: "Geografie-Lexikon",
        description: "Errate 100 verschiedene Länder als Zielland.",
        icon: "📚",
        category: "discovery",
        categoryName: "Entdeckungen"
    },
    {
        id: "achievement_entire_world_discovered",
        title: "Die ganze Welt",
        description: "Errate jedes spielbare Land mindestens einmal als Zielland.",
        icon: "🌐",
        category: "discovery",
        categoryName: "Entdeckungen"
    },

    // --------------------------------------
    // KONTINENT-ERFOLGE: AFRIKA
    // --------------------------------------

    {
        id: "achievement_africa_expert_bronze",
        title: "Da Gamas Weggefährte",
        description: "Gewinne 10 Spiele mit einem Zielland aus Afrika.",
        icon: "🐘",
        category: "continents",
        categoryName: "Kontinente",
        tier: "Bronze",
        quote: "Du hast den richtigen Kurs eingeschlagen – da Gama wäre stolz auf dich!"
    },
    {
        id: "achievement_africa_expert_silver",
        title: "Livingstones Spurenleser",
        description: "Gewinne 50 Spiele mit einem Zielland aus Afrika.",
        icon: "🐘",
        category: "continents",
        categoryName: "Kontinente",
        tier: "Silber",
        quote: "Du findest dich langsam besser zurecht als mancher berühmte Entdecker."
    },
    {
        id: "achievement_africa_expert_gold",
        title: "Da Gamas Seefahrer",
        description: "Gewinne 100 Spiele mit einem Zielland aus Afrika.",
        icon: "🐘",
        category: "continents",
        categoryName: "Kontinente",
        tier: "Gold",
        quote: "Selbst da Gama würde dich ans Steuer seines nächsten Expeditionsschiffs lassen."
    },
    {
        id: "achievement_africa_expert_platinum",
        title: "Livingstones Vermächtnis",
        description: "Gewinne 250 Spiele mit einem Zielland aus Afrika.",
        icon: "🐘",
        category: "continents",
        categoryName: "Kontinente",
        tier: "Platin",
        quote: "Du kennst Afrika wie deine Westentasche – selbst Livingstone könnte noch von dir lernen!"
    },

    // --------------------------------------
    // KONTINENT-ERFOLGE: ASIEN
    // --------------------------------------

    {
        id: "achievement_asia_expert_bronze",
        title: "Marco Polos Lehrling",
        description: "Gewinne 10 Spiele mit einem Zielland aus Asien.",
        icon: "🏯",
        category: "continents",
        categoryName: "Kontinente",
        tier: "Bronze",
        quote: "Marco Polo wäre neugierig auf deine Reise."
    },
    {
        id: "achievement_asia_expert_silver",
        title: "Dschingis Khans Wegweiser",
        description: "Gewinne 50 Spiele mit einem Zielland aus Asien.",
        icon: "🏯",
        category: "continents",
        categoryName: "Kontinente",
        tier: "Silber",
        quote: "Du kennst dich so gut aus, dass selbst Dschingis Khan dich nach dem Weg fragen würde."
    },
    {
        id: "achievement_asia_expert_gold",
        title: "Marco Polos Rivale",
        description: "Gewinne 100 Spiele mit einem Zielland aus Asien.",
        icon: "🏯",
        category: "continents",
        categoryName: "Kontinente",
        tier: "Gold",
        quote: "Marco Polo kann langsam einpacken."
    },
    {
        id: "achievement_asia_expert_platinum",
        title: "Dschingis Khans Legende",
        description: "Gewinne 250 Spiele mit einem Zielland aus Asien.",
        icon: "🏯",
        category: "continents",
        categoryName: "Kontinente",
        tier: "Platin",
        quote: "Selbst Dschingis Khan hätte deine Orientierung beneidet."
    },

    // --------------------------------------
    // KONTINENT-ERFOLGE: EUROPA
    // --------------------------------------

    {
        id: "achievement_europe_expert_bronze",
        title: "Napoleons Nachwuchs",
        description: "Gewinne 10 Spiele mit einem Zielland aus Europa.",
        icon: "⚔️",
        category: "continents",
        categoryName: "Kontinente",
        tier: "Bronze",
        quote: "Ein erster Schritt zur Weltherrschaft – Napoleon wäre stolz!"
    },
    {
        id: "achievement_europe_expert_silver",
        title: "Karls Vertrauter",
        description: "Gewinne 50 Spiele mit einem Zielland aus Europa.",
        icon: "⚔️",
        category: "continents",
        categoryName: "Kontinente",
        tier: "Silber",
        quote: "Karl der Große hätte dich gern an seiner Seite gehabt."
    },
    {
        id: "achievement_europe_expert_gold",
        title: "Napoleons Albtraum",
        description: "Gewinne 100 Spiele mit einem Zielland aus Europa.",
        icon: "⚔️",
        category: "continents",
        categoryName: "Kontinente",
        tier: "Gold",
        quote: "Du kennst Europa besser, als Napoleon es je erobern konnte."
    },
    {
        id: "achievement_europe_expert_platinum",
        title: "Karls Erbe",
        description: "Gewinne 250 Spiele mit einem Zielland aus Europa.",
        icon: "⚔️",
        category: "continents",
        categoryName: "Kontinente",
        tier: "Platin",
        quote: "Europa liegt dir zu Füßen – selbst Karl der Große wäre beeindruckt."
    },

    // --------------------------------------
    // KONTINENT-ERFOLGE: NORDAMERIKA
    // --------------------------------------

    {
        id: "achievement_north_america_expert_bronze",
        title: "Pionier der Neuen Welt",
        description: "Gewinne 10 Spiele mit einem Zielland aus Nordamerika.",
        icon: "🗽",
        category: "continents",
        categoryName: "Kontinente",
        tier: "Bronze",
        quote: "Deine Entdeckungsreise beginnt!"
    },
    {
        id: "achievement_north_america_expert_silver",
        title: "Lewis und Clarks Gefährte",
        description: "Gewinne 50 Spiele mit einem Zielland aus Nordamerika.",
        icon: "🗽",
        category: "continents",
        categoryName: "Kontinente",
        tier: "Silber",
        quote: "Lewis und Clark hätten dich gern auf ihrer Expedition dabeigehabt."
    },
    {
        id: "achievement_north_america_expert_gold",
        title: "Kolumbus' Nachfolger",
        description: "Gewinne 100 Spiele mit einem Zielland aus Nordamerika.",
        icon: "🗽",
        category: "continents",
        categoryName: "Kontinente",
        tier: "Gold",
        quote: "Du hast deinen eigenen Weg in die Geschichte gefunden – Kolumbus wäre beeindruckt."
    },
    {
        id: "achievement_north_america_expert_platinum",
        title: "Meister der Wildnis",
        description: "Gewinne 250 Spiele mit einem Zielland aus Nordamerika.",
        icon: "🗽",
        category: "continents",
        categoryName: "Kontinente",
        tier: "Platin",
        quote: "Du findest dich in Nordamerika zurecht, als hättest du jeden Winkel selbst erkundet."
    },

    // --------------------------------------
    // KONTINENT-ERFOLGE: SÜDAMERIKA
    // --------------------------------------

    {
        id: "achievement_south_america_expert_bronze",
        title: "Cabrals Entdecker",
        description: "Gewinne 10 Spiele mit einem Zielland aus Südamerika.",
        icon: "🗿",
        category: "continents",
        categoryName: "Kontinente",
        tier: "Bronze",
        quote: "Cabral hätte dich gern an Bord gehabt, als er Brasilien erreichte!"
    },
    {
        id: "achievement_south_america_expert_silver",
        title: "Humboldts Gefährte",
        description: "Gewinne 50 Spiele mit einem Zielland aus Südamerika.",
        icon: "🗿",
        category: "continents",
        categoryName: "Kontinente",
        tier: "Silber",
        quote: "Humboldt hätte dich als Reisebegleitung gebucht."
    },
    {
        id: "achievement_south_america_expert_gold",
        title: "Cabrals Wegbereiter",
        description: "Gewinne 100 Spiele mit einem Zielland aus Südamerika.",
        icon: "🗿",
        category: "continents",
        categoryName: "Kontinente",
        tier: "Gold",
        quote: "Du hättest Cabral sicher durch unbekannte Gewässer geführt!"
    },
    {
        id: "achievement_south_america_expert_platinum",
        title: "Humboldts Vermächtnis",
        description: "Gewinne 250 Spiele mit einem Zielland aus Südamerika.",
        icon: "🗿",
        category: "continents",
        categoryName: "Kontinente",
        tier: "Platin",
        quote: "Du kennst Südamerika so gut, dass selbst Humboldt bei dir Nachhilfe nehmen könnte!"
    },

    // --------------------------------------
    // KONTINENT-ERFOLGE: OZEANIEN
    // --------------------------------------

    {
        id: "achievement_oceania_expert_bronze",
        title: "Cooks Schiffsjunge",
        description: "Gewinne 10 Spiele mit einem Zielland aus Ozeanien.",
        icon: "🪃",
        category: "continents",
        categoryName: "Kontinente",
        tier: "Bronze",
        quote: "James Cook wäre gespannt, wohin du segelst."
    },
    {
        id: "achievement_oceania_expert_silver",
        title: "Kartograf der Inselwelt",
        description: "Gewinne 50 Spiele mit einem Zielland aus Ozeanien.",
        icon: "🪃",
        category: "continents",
        categoryName: "Kontinente",
        tier: "Silber",
        quote: "Du hast schon einige Inseln auf dem Radar."
    },
    {
        id: "achievement_oceania_expert_gold",
        title: "Cooks Nachfolger",
        description: "Gewinne 100 Spiele mit einem Zielland aus Ozeanien.",
        icon: "🪃",
        category: "continents",
        categoryName: "Kontinente",
        tier: "Gold",
        quote: "Cook hätte dir längst das Kommando übergeben."
    },
    {
        id: "achievement_oceania_expert_platinum",
        title: "Herr der Südsee",
        description: "Gewinne 250 Spiele mit einem Zielland aus Ozeanien.",
        icon: "🪃",
        category: "continents",
        categoryName: "Kontinente",
        tier: "Platin",
        quote: "Du bist der unangefochtene Kapitän des Pazifiks."
    },

    // --------------------------------------
    // KONTINENT-KENNER
    // --------------------------------------

    {
        id: "achievement_africa_connoisseur",
        title: "Afrika-Kenner",
        description: "Errate jedes spielbare Land Afrikas als Zielland.",
        icon: "🦁",
        category: "continents",
        categoryName: "Kontinente"
    },
    {
        id: "achievement_asia_connoisseur",
        title: "Asien-Kenner",
        description: "Errate jedes spielbare Land Asiens als Zielland.",
        icon: "🐉",
        category: "continents",
        categoryName: "Kontinente"
    },
    {
        id: "achievement_europe_connoisseur",
        title: "Europa-Kenner",
        description: "Errate jedes spielbare Land Europas als Zielland.",
        icon: "🐺",
        category: "continents",
        categoryName: "Kontinente"
    },
    {
        id: "achievement_north_america_connoisseur",
        title: "Nordamerika-Kenner",
        description: "Errate jedes spielbare Land Nordamerikas als Zielland.",
        icon: "🦬",
        category: "continents",
        categoryName: "Kontinente"
    },
    {
        id: "achievement_south_america_connoisseur",
        title: "Südamerika-Kenner",
        description: "Errate jedes spielbare Land Südamerikas als Zielland.",
        icon: "🦜",
        category: "continents",
        categoryName: "Kontinente"
    },
    {
        id: "achievement_oceania_connoisseur",
        title: "Ozeanien-Kenner",
        description: "Errate jedes spielbare Land Ozeaniens als Zielland.",
        icon: "🐨",
        category: "continents",
        categoryName: "Kontinente"
    },

    // --------------------------------------
    // NIEDERLAGEN
    // --------------------------------------

    {
        id: "achievement_lost_5",
        title: "Rückschläge gehören dazu",
        description: "Verliere insgesamt fünf Spiele.",
        icon: "🌧️",
        category: "losses",
        categoryName: "Niederlagen"
    },
    {
        id: "achievement_lost_10",
        title: "Hartnäckig",
        description: "Verliere insgesamt zehn Spiele.",
        icon: "🪨",
        category: "losses",
        categoryName: "Niederlagen"
    },
    {
        id: "achievement_lost_50",
        title: "Ausdauernd",
        description: "Verliere insgesamt 50 Spiele.",
        icon: "🌪️",
        category: "losses",
        categoryName: "Niederlagen"
    },
    {
        id: "achievement_lost_100",
        title: "Niederlagen-Profi",
        description: "Verliere insgesamt 100 Spiele.",
        icon: "💀",
        category: "losses",
        categoryName: "Niederlagen"
    },
    {
        id: "achievement_bitter_end",
        title: "Bis zum bitteren Ende",
        description: "Verliere ein Spiel nach allen 20 Versuchen.",
        icon: "🥀",
        category: "losses",
        categoryName: "Niederlagen"
    },
    {
        id: "achievement_losing_streak",
        title: "Pechsträhne",
        description: "Verliere fünf Spiele in Folge.",
        icon: "📉",
        category: "losses",
        categoryName: "Niederlagen"
    }
];
// Achievement-Liste global für andere Skripte verfügbar machen.
window.ACHIEVEMENTS = ACHIEVEMENTS;


// ==========================================
// ACHIEVEMENT-SPRÜCHE UND STUFEN
// ==========================================

const ACHIEVEMENT_QUOTES = {
    achievement_games_1: {
        quote: "Jede Weltreise beginnt mit einem einzigen Klick.",
        tier: "Bronze"
    },
    achievement_games_10: {
        quote: "Du bist jetzt öfter hier als manche Länder Touristen haben.",
        tier: "Silber"
    },
    achievement_games_50: {
        quote: "Du solltest langsam einen eigenen Sitzplatz im Geografiearchiv bekommen.",
        tier: "Gold"
    },
    achievement_games_100: {
        quote: "Du hast mehr Runden gedreht als ein Satellit um die Erde.",
        tier: "Platin"
    },

    achievement_wins_1: {
        quote: "Ein Land erraten. Unendlich viele Möglichkeiten, damit anzugeben.",
        tier: "Bronze"
    },
    achievement_wins_10: {
        quote: "Dein innerer Atlas fängt an, Überstunden zu machen.",
        tier: "Silber"
    },
    achievement_wins_50: {
        quote: "Die Weltkarte hat langsam Angst vor dir.",
        tier: "Gold"
    },
    achievement_wins_100: {
        quote: "Die Vereinten Nationen möchten dich als Quizberater einstellen.",
        tier: "Platin"
    },

    achievement_geographic_genius: {
        quote: "Google Maps hat gerade diskret deinen Lebenslauf angefordert."
    },
    achievement_hellseher: {
        quote: "Zufall? Deine Wahrsagerin möchte mit dir reden."
    },
    achievement_world_traveler: {
        quote: "Der Reisepass ist leer, aber dein Kopf ist voll."
    },
    achievement_series_master: {
        quote: "Fünf Siege am Stück. Das nennt man wohl geografischen Lauf."
    },
    achievement_last_second: {
        quote: "Das war knapp. Selbst der letzte Versuch hat schon die Koffer gepackt."
    },
    achievement_without_hints: {
        quote: "Ganz ohne Hinweise. Dein Atlas darf heute Urlaub machen."
    },

    achievement_explorer: {
        quote: "Zehn Länder entdeckt. Die Postkarten schreiben sich nicht von allein.",
        tier: "Bronze"
    },
    achievement_globetrotter: {
        quote: "Dein imaginärer Reisepass braucht langsam mehr Seiten.",
        tier: "Silber"
    },
    achievement_geography_lexicon: {
        quote: "Du bist inzwischen die Fußnote, auf die selbst Atlanten verweisen.",
        tier: "Gold"
    },
    achievement_entire_world_discovered: {
        quote: "Du hast die ganze Welt gesehen, ohne einmal das Sofa zu verlassen.",
        tier: "Platin"
    },

    achievement_africa_connoisseur: {
        quote: "Vom Mittelmeer bis zum Kap der Guten Hoffnung – du hast mehr Überblick als die alten Handelsrouten."
    },
    achievement_asia_connoisseur: {
        quote: "Von Anatolien bis Japan – Marco Polo wäre bei dir in die Lehre gegangen."
    },
    achievement_europe_connoisseur: {
        quote: "Karl der Große wäre stolz: Du kennst sein Reich und noch ein paar mehr."
    },
    achievement_north_america_connoisseur: {
        quote: "Von Kanada bis Panama – selbst Lewis und Clark hätten dich als Reiseleiter genommen."
    },
    achievement_south_america_connoisseur: {
        quote: "Du kennst Südamerika so gut, dass Alexander von Humboldt dich um Reisetipps bitten würde."
    },
    achievement_oceania_connoisseur: {
        quote: "Du findest dich zwischen Tausenden Inseln zurecht – selbst Magellan wäre beeindruckt."
    },

    achievement_lost_5: {
        quote: "Fünf Niederlagen. Die Welt ist schließlich größer als gedacht.",
        tier: "Bronze"
    },
    achievement_lost_10: {
        quote: "Du nennst es Forschung. Andere nennen es danebenliegen.",
        tier: "Silber"
    },
    achievement_lost_50: {
        quote: "Du hast mehr Länder verfehlt als ein Kompass im Magnetfeld.",
        tier: "Gold"
    },
    achievement_lost_100: {
        quote: "Du bist nicht gescheitert. Du hast 100 alternative Antworten getestet.",
        tier: "Platin"
    },
    achievement_bitter_end: {
        quote: "Du hast bis zum Schluss gekämpft. Das Land hat sich trotzdem nicht ergeben."
    },
    achievement_losing_streak: {
        quote: "Vielleicht ist die Weltkarte heute einfach gegen dich."
    }
};

for (const achievement of ACHIEVEMENTS) {
    const extra = ACHIEVEMENT_QUOTES[achievement.id];

    if (extra) {
        achievement.quote = extra.quote;

        if (extra.tier) {
            achievement.tier = extra.tier;
        }
    }
}


// ==========================================
// KATEGORIEN
// ==========================================

const ACHIEVEMENT_CATEGORY_ORDER = [
    "games",
    "wins",
    "special",
    "discovery",
    "continents",
    "losses"
];

const ACHIEVEMENT_CATEGORY_NAMES = {
    games: "Spiele",
    wins: "Siege",
    special: "Besondere Erfolge",
    discovery: "Entdeckungen",
    continents: "Kontinente",
    losses: "Niederlagen"
};


// ==========================================
// DOM-ELEMENTE
// ==========================================

const achievementElements = {
    guestNotice: document.getElementById("guestNotice"),
    error: document.getElementById("achievementsError"),
    loading: document.getElementById("achievementsLoading"),
    content: document.getElementById("achievementsContent"),
    groups: document.getElementById("achievementGroups"),
    empty: document.getElementById("emptyAchievements"),

    unlockedCount: document.getElementById("unlockedCount"),
    totalCount: document.getElementById("totalCount"),
    progressFill: document.getElementById("overallProgressFill"),
    progressBar: document.getElementById("overallProgressBar"),
    progressPercentage: document.getElementById("progressPercentage"),
    remainingCount: document.getElementById("remainingCount"),
    visibleCount: document.getElementById("visibleAchievementCount"),

    categoryFilter: document.getElementById("categoryFilter"),
    statusFilter: document.getElementById("statusFilter")
};

const achievementInfoElements = {
    modal: document.getElementById("achievementInfoModal"),
    title: document.getElementById("achievementInfoTitle"),
    description: document.getElementById("achievementInfoDescription"),
    progress: document.getElementById("achievementInfoProgress"),
    history: document.getElementById("achievementInfoHistory")
};


// ==========================================
// ZUSTAND
// ==========================================

let achievementStates = {};
let achievementGlobalUnlockCounts = {};


// ==========================================
// FORTSCHRITTSDATEN
// ==========================================

let achievementProgressData = {
    games: 0,
    wins: 0,
    losses: 0,
    discoveredCountryIds: [],
    continentWins: {},
    continentDiscovered: {},
    continentCountryTotals: {}
};

const ACHIEVEMENT_PROGRESS_TARGETS = {
    achievement_games_1: 1,
    achievement_games_10: 10,
    achievement_games_50: 50,
    achievement_games_100: 100,

    achievement_wins_1: 1,
    achievement_wins_10: 10,
    achievement_wins_50: 50,
    achievement_wins_100: 100,

    achievement_explorer: 10,
    achievement_globetrotter: 50,
    achievement_geography_lexicon: 100,

    achievement_lost_5: 5,
    achievement_lost_10: 10,
    achievement_lost_50: 50,
    achievement_lost_100: 100
};

const ACHIEVEMENT_CONTINENTS_METADATA = {
    africa: {
        experts: [
            "achievement_africa_expert_bronze",
            "achievement_africa_expert_silver",
            "achievement_africa_expert_gold",
            "achievement_africa_expert_platinum"
        ],
        connoisseur: "achievement_africa_connoisseur"
    },
    asia: {
        experts: [
            "achievement_asia_expert_bronze",
            "achievement_asia_expert_silver",
            "achievement_asia_expert_gold",
            "achievement_asia_expert_platinum"
        ],
        connoisseur: "achievement_asia_connoisseur"
    },
    europe: {
        experts: [
            "achievement_europe_expert_bronze",
            "achievement_europe_expert_silver",
            "achievement_europe_expert_gold",
            "achievement_europe_expert_platinum"
        ],
        connoisseur: "achievement_europe_connoisseur"
    },
    north_america: {
        experts: [
            "achievement_north_america_expert_bronze",
            "achievement_north_america_expert_silver",
            "achievement_north_america_expert_gold",
            "achievement_north_america_expert_platinum"
        ],
        connoisseur: "achievement_north_america_connoisseur"
    },
    south_america: {
        experts: [
            "achievement_south_america_expert_bronze",
            "achievement_south_america_expert_silver",
            "achievement_south_america_expert_gold",
            "achievement_south_america_expert_platinum"
        ],
        connoisseur: "achievement_south_america_connoisseur"
    },
    oceania: {
        experts: [
            "achievement_oceania_expert_bronze",
            "achievement_oceania_expert_silver",
            "achievement_oceania_expert_gold",
            "achievement_oceania_expert_platinum"
        ],
        connoisseur: "achievement_oceania_connoisseur"
    }
};


// ==========================================
// HILFSFUNKTIONEN
// ==========================================

function achievementSetVisible(element, visible) {
    if (element) {
        element.hidden = !visible;
    }
}

function achievementEscapeHTML(value) {
    return String(value).replace(/[&<>"']/g, character => {
        const entities = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        };

        return entities[character];
    });
}

function achievementShowError(message) {
    if (!achievementElements.error) return;

    achievementElements.error.textContent = message;
    achievementSetVisible(achievementElements.error, true);
}

function achievementHideError() {
    achievementSetVisible(achievementElements.error, false);
}


// ==========================================
// FORTSCHRITT
// ==========================================

function achievementUpdateProgress() {
    const total = ACHIEVEMENTS.length;

    const unlocked = ACHIEVEMENTS.filter(
        achievement => achievementStates[achievement.id] === true
    ).length;

    const remaining = total - unlocked;

    const percentage = total > 0
        ? Math.round((unlocked / total) * 100)
        : 0;

    if (achievementElements.unlockedCount) {
        achievementElements.unlockedCount.textContent = unlocked;
    }

    if (achievementElements.totalCount) {
        achievementElements.totalCount.textContent = total;
    }

    if (achievementElements.progressFill) {
        achievementElements.progressFill.style.width = `${percentage}%`;
    }

    if (achievementElements.progressBar) {
        achievementElements.progressBar.setAttribute(
            "aria-valuemax",
            String(total)
        );

        achievementElements.progressBar.setAttribute(
            "aria-valuenow",
            String(unlocked)
        );
    }

    if (achievementElements.progressPercentage) {
        achievementElements.progressPercentage.textContent =
            `${percentage} % abgeschlossen`;
    }

    if (achievementElements.remainingCount) {
        achievementElements.remainingCount.textContent =
            remaining === 1
                ? "1 noch offen"
                : `${remaining} noch offen`;
    }
}


// ==========================================
// INDIVIDUELLEN FORTSCHRITT BERECHNEN
// ==========================================

function achievementGetProgress(achievement) {
if (!achievement || typeof achievement.id !== "string") {
return null;
}
const id = achievement.id;
let current = 0;
let target = ACHIEVEMENT_PROGRESS_TARGETS[id];

if (id.startsWith("achievement_games_")) {
    current = achievementProgressData.games;

} else if (id.startsWith("achievement_wins_")) {
    current = achievementProgressData.wins;

} else if (id.startsWith("achievement_lost_")) {
    current = achievementProgressData.losses;

} else if (
    id === "achievement_explorer" ||
    id === "achievement_globetrotter" ||
    id === "achievement_geography_lexicon"
) {
    current = new Set(
        achievementProgressData.discoveredCountryIds
    ).size;

} else {
    for (const [continent, data] of Object.entries(
        ACHIEVEMENT_CONTINENTS_METADATA
    )) {
        const expertIndex = data.experts.indexOf(id);

        if (expertIndex !== -1) {
            current =
                achievementProgressData.continentWins[continent] || 0;

            target = [10, 50, 100, 250][expertIndex];
            break;
        }

        if (id === data.connoisseur) {
            current =
                achievementProgressData.continentDiscovered[continent] || 0;

            target =
                achievementProgressData.continentCountryTotals[continent] || 0;

            break;
        }
    }
}

if (!Number.isFinite(target) || target <= 0) {
    return null;
}

current = Math.max(0, current);

return {
    current: Math.min(current, target),
    actual: current,
    target,
    percentage: Math.min(
        100,
        Math.round((current / target) * 100)
    )
};
}


// ==========================================
// STUFEN-GRUPPEN
// ==========================================

function achievementGetTierGroups() {
    return [
        [
            "achievement_games_1",
            "achievement_games_10",
            "achievement_games_50",
            "achievement_games_100"
        ],
        [
            "achievement_wins_1",
            "achievement_wins_10",
            "achievement_wins_50",
            "achievement_wins_100"
        ],
        [
            "achievement_explorer",
            "achievement_globetrotter",
            "achievement_geography_lexicon",
            "achievement_entire_world_discovered"
        ],
        [
            "achievement_lost_5",
            "achievement_lost_10",
            "achievement_lost_50",
            "achievement_lost_100"
        ],
        ...Object.values(ACHIEVEMENT_CONTINENTS_METADATA).map(
            continent => continent.experts
        )
    ];
}

// ==========================================
// AKTUELLE UND NÄCHSTE STUFE
// ==========================================

function achievementGetCurrentTier(achievement) {
    const tierGroup = achievementGetTierGroups().find(
        group => group.includes(achievement.id)
    );

    if (!tierGroup) {
        return {
            current: achievement,
            next: null,
            hasUnlockedTier: false
        };
    }

    let highestUnlockedIndex = -1;

    for (let index = 0; index < tierGroup.length; index++) {
        if (achievementStates[tierGroup[index]] === true) {
            highestUnlockedIndex = index;
        }
    }

    const hasUnlockedTier = highestUnlockedIndex >= 0;

    // Ohne freigeschaltete Stufe bleibt Bronze das sichtbare Ziel.
    const currentIndex = hasUnlockedTier
        ? highestUnlockedIndex
        : 0;

    const current = ACHIEVEMENTS.find(
        item => item.id === tierGroup[currentIndex]
    );

    const nextIndex = hasUnlockedTier
        ? highestUnlockedIndex + 1
        : 0;

    const next = nextIndex < tierGroup.length
        ? ACHIEVEMENTS.find(
            item => item.id === tierGroup[nextIndex]
        )
        : null;

    return {
        current,
        next,
        hasUnlockedTier
    };
}

// ==========================================
// INFO-MODAL: GLOBALEN FORTSCHRITT LADEN
// ==========================================

async function achievementLoadGlobalUnlockCounts() {
try {
const result = await supabaseRequest(
"rpc/get_achievement_unlock_counts",
{
method: "POST",
authenticated: true,
body: {}
}
);

    achievementGlobalUnlockCounts = {
        total_players: 0
    };

    // Alle Achievements zunächst auf 0 setzen
    for (const achievement of ACHIEVEMENTS) {
        achievementGlobalUnlockCounts[achievement.id] = 0;
    }

    // Freischaltungszahlen und Gesamtzahl übernehmen
    if (Array.isArray(result)) {
        for (const row of result) {
            achievementGlobalUnlockCounts[row.achievement_id] =
                Number(row.unlocked_count) || 0;

            achievementGlobalUnlockCounts.total_players =
                Number(row.total_players) || 0;
        }
    }
} catch (error) {
    console.warn(
        "Globale Achievement-Zahlen konnten nicht geladen werden:",
        error
    );

    achievementGlobalUnlockCounts = {
        total_players: 0
    };

    for (const achievement of ACHIEVEMENTS) {
        achievementGlobalUnlockCounts[achievement.id] = 0;
    }
}

}

// ==========================================
// INFO-MODAL: EINZELNEN EINTRAG ERSTELLEN
// ==========================================

function achievementCreateHistoryItem(achievement, isNextTarget = false) {
const unlocked = achievementStates[achievement.id] === true;
const progress = achievementGetProgress(achievement);
const globalCount = achievementGlobalUnlockCounts[achievement.id];

const item = document.createElement("article");

// Das nächste geheime Ziel ausschließlich als Fortschritt anzeigen
if (isNextTarget && !unlocked) {
    item.className = "achievement-history-item is-locked is-mystery";

    item.innerHTML = progress
        ? `
            <div class="achievement-history-content">
                <div class="achievement-history-progress">
                    <div class="achievement-progress-track"
                         role="progressbar"
                         aria-label="Fortschritt zum nächsten geheimen Erfolg"
                         aria-valuemin="0"
                         aria-valuemax="${progress.target}"
                         aria-valuenow="${progress.current}">
                        <div class="achievement-progress-fill"
                             style="width:${progress.percentage}%"></div>
                    </div>

                    <span class="achievement-progress-label">
                        ${progress.actual} / ${progress.target}
                    </span>
                </div>
            </div>
        `
        : `
            <div class="achievement-history-content">
                <div class="achievement-history-progress">
                    <div class="achievement-progress-track"
                         role="progressbar"
                         aria-label="Fortschritt zum nächsten geheimen Erfolg"
                         aria-valuemin="0"
                         aria-valuemax="1"
                         aria-valuenow="0">
                        <div class="achievement-progress-fill"
                             style="width:0%"></div>
                    </div>
                    <span class="achievement-progress-label">
                        Fortschritt wird ermittelt
                    </span>
                </div>
            </div>
        `;

    return item;
}

item.className = unlocked
    ? "achievement-history-item is-unlocked"
    : "achievement-history-item is-locked";

const tierHTML = achievement.tier
    ? `<span class="achievement-tier tier-${achievement.tier.toLowerCase()}">
            ${achievementEscapeHTML(achievement.tier)}
       </span>`
    : "";

const progressHTML = !unlocked && progress
    ? `
        <div class="achievement-history-progress">
            <div class="achievement-progress-track"
                 role="progressbar"
                 aria-label="Fortschritt zum Erfolg"
                 aria-valuemin="0"
                 aria-valuemax="${progress.target}"
                 aria-valuenow="${progress.current}">
                <div class="achievement-progress-fill"
                     style="width:${progress.percentage}%"></div>
            </div>
            <span class="achievement-progress-label">
                ${progress.actual} / ${progress.target}
            </span>
        </div>
    `
    : "";

const totalPlayers = achievementGlobalUnlockCounts.total_players;

const globalCountText =
    Number.isFinite(globalCount) &&
    Number.isFinite(totalPlayers)
        ? `${globalCount} von ${totalPlayers} Spielern`
        : "Globale Daten nicht verfügbar";

let globalRatioText =
    "Globale Freischaltungsquote derzeit nicht verfügbar.";

if (
    Number.isFinite(globalCount) &&
    Number.isFinite(totalPlayers) &&
    totalPlayers > 1
) {
    const ratio =
        globalCount === totalPlayers
            ? 100
            : (globalCount / (totalPlayers - 1)) * 100;

    globalRatioText = `${ratio.toLocaleString("de-DE", {
        maximumFractionDigits: 1
    })} % der Spieler haben dieses Achievement freigeschaltet.`;
}

item.innerHTML = `
    <div class="achievement-history-icon" aria-hidden="true">
        ${achievementEscapeHTML(achievement.icon)}
    </div>

    <div class="achievement-history-content">
        <div class="achievement-history-title-row">
            <h3 class="achievement-history-title">
                ${achievementEscapeHTML(achievement.title)}
            </h3>

            ${tierHTML}

            <span class="achievement-history-status">
                ${unlocked ? "Freigeschaltet" : "Fortschritt"}
            </span>
        </div>

        <p class="achievement-history-description">
            ${achievementEscapeHTML(achievement.description)}
        </p>

        ${
            unlocked && achievement.quote
                ? `<p class="achievement-history-quote">
                       „${achievementEscapeHTML(achievement.quote)}“
                   </p>`
                : ""
        }

        ${progressHTML}

        <p class="achievement-global-count">
            ${achievementEscapeHTML(globalRatioText)}
        </p>
    </div>
`;

return item;

}


// ==========================================
// INFO-MODAL ÖFFNEN
// ==========================================

function achievementOpenInfo(achievementId) {
    const achievement = ACHIEVEMENTS.find(
        item => item.id === achievementId
    );

    if (
        !achievement ||
        !achievementInfoElements.modal ||
        !achievementInfoElements.title ||
        !achievementInfoElements.description ||
        !achievementInfoElements.history
    ) {
        return;
    }

    achievementInfoElements.title.textContent = achievement.title;

    achievementInfoElements.description.textContent =
        "Details zum Achievement und zum aktuellen Fortschritt.";

    achievementInfoElements.history.innerHTML = "";

    const tierGroup = achievementGetTierGroups().find(
        group => group.includes(achievementId)
    );

    // ======================================
    // EINZELNES ACHIEVEMENT
    // ======================================

    if (!tierGroup) {
        const historyItem = achievementCreateHistoryItem(achievement);

        achievementInfoElements.history.appendChild(historyItem);
    }

    // ======================================
    // ACHIEVEMENTS MIT MEHREREN STUFEN
    // ======================================

    else {
        let highestUnlockedIndex = -1;

        for (let index = 0; index < tierGroup.length; index++) {
            if (achievementStates[tierGroup[index]] === true) {
                highestUnlockedIndex = index;
            }
        }

        // Freigeschaltete Stufen anzeigen.
        // Falls noch keine Stufe freigeschaltet ist, Bronze anzeigen.
        const visibleIds = highestUnlockedIndex >= 0
            ? tierGroup.slice(0, highestUnlockedIndex + 1)
            : [tierGroup[0]];

        for (const id of visibleIds) {
            const historyAchievement = ACHIEVEMENTS.find(
                item => item.id === id
            );

            if (!historyAchievement) {
                continue;
            }

            const historyItem = achievementCreateHistoryItem(
                historyAchievement
            );

            if (achievementStates[id] === true) {
                historyItem.classList.add("is-current-tier");
            }

            achievementInfoElements.history.appendChild(historyItem);
        }

        // Mystery erst anzeigen, nachdem Bronze erreicht wurde.
        const nextTargetIndex = highestUnlockedIndex + 1;

        const nextTargetId = highestUnlockedIndex >= 0 &&
            nextTargetIndex < tierGroup.length
                ? tierGroup[nextTargetIndex]
                : null;

        if (nextTargetId) {
            const nextAchievement = ACHIEVEMENTS.find(
                item => item.id === nextTargetId
            );

            if (
                nextAchievement &&
                achievementStates[nextAchievement.id] !== true
            ) {
                achievementInfoElements.history.appendChild(
                    achievementCreateHistoryItem(
                        nextAchievement,
                        true
                    )
                );
            }
        }
    }

    // ======================================
    // SEPARATEN MODAL-FORTSCHRITT AUSBLENDEN
    // ======================================

    if (achievementInfoElements.progress) {
        achievementInfoElements.progress.hidden = true;
        achievementInfoElements.progress.innerHTML = "";
    }

    // ======================================
    // MODAL ÖFFNEN
    // ======================================

    achievementInfoElements.modal.hidden = false;
    achievementInfoElements.modal.style.display = "";
    achievementInfoElements.modal.classList.add("active");

    document.body.classList.add("achievement-info-open");

    const closeButton =
        achievementInfoElements.modal.querySelector(
            "[data-close-achievement-info]"
        );

    if (closeButton) {
        closeButton.focus();
    }
}


// ==========================================
// INFO-MODAL SCHLIESSEN
// ==========================================

function achievementCloseInfo() {
    if (!achievementInfoElements.modal) return;

    achievementInfoElements.modal.classList.remove("active");
    achievementInfoElements.modal.hidden = true;
    achievementInfoElements.modal.style.display = "none";

    document.body.classList.remove("achievement-info-open");
    document.body.style.overflow = "";
    document.documentElement.style.overflow = "";
}


// ==========================================
// ACHIEVEMENT-KARTE
// ==========================================

function achievementCreateCard(achievement, nextAchievement = null) {
    const unlocked = achievementStates[achievement.id] === true;

    const card = document.createElement("article");
    card.className = unlocked
        ? "achievement-card unlocked"
        : "achievement-card locked";

    card.tabIndex = 0;
    card.setAttribute("role", "button");
    card.setAttribute("aria-pressed", "false");

    const tierHTML = achievement.tier
        ? `<span class="achievement-tier tier-${achievement.tier.toLowerCase()}">
                ${achievementEscapeHTML(achievement.tier)}
           </span>`
        : "";

    const progressTarget =
        nextAchievement && typeof nextAchievement.id === "string"
            ? nextAchievement
            : (!unlocked ? achievement : null);

    const progress = progressTarget
        ? achievementGetProgress(progressTarget)
        : null;

    const progressHTML = progress
        ? `
            <div class="achievement-progress">
                <div class="achievement-progress-track"
                     role="progressbar"
                     aria-label="Fortschritt zum nächsten geheimen Erfolg"
                     aria-valuemin="0"
                     aria-valuemax="${progress.target}"
                     aria-valuenow="${progress.current}">
                    <div class="achievement-progress-fill"
                         style="width:${progress.percentage}%"></div>
                </div>

                <span class="achievement-progress-label">
                    ${progress.actual} / ${progress.target}
                </span>
            </div>
        `
        : "";

    card.innerHTML = `
        <div class="achievement-icon" aria-hidden="true">
            ${achievementEscapeHTML(achievement.icon)}
        </div>

        <div class="achievement-details">
            <div class="achievement-title-row">
                <h4 class="achievement-title">
                    ${achievementEscapeHTML(achievement.title)}
                </h4>

                <span class="achievement-status">
                    ${unlocked ? "Freigeschaltet" : "Noch offen"}
                </span>
            </div>

            ${tierHTML}

            <p class="achievement-description achievement-quote">
                ${achievementEscapeHTML(
                    achievement.quote ||
                    "Die Welt wartet darauf, entdeckt zu werden."
                )}
            </p>

            <p class="achievement-description achievement-condition" hidden>
                ${achievementEscapeHTML(achievement.description)}
            </p>

            ${progress ? `
                <p class="achievement-progress-heading">
                    Fortschritt bis zum nächsten Erfolg
                </p>
            ` : ""}
            ${progressHTML}

            <button
                type="button"
                class="achievement-details-button"
                aria-label="Details zu ${achievementEscapeHTML(achievement.title)} anzeigen"
            >Details anzeigen</button>
        </div>
    `;

    const quote = card.querySelector(".achievement-quote");
    const condition = card.querySelector(".achievement-condition");
    const detailsButton = card.querySelector(".achievement-details-button");

    function toggleDescription() {
        const showCondition = condition.hidden;

        quote.hidden = showCondition;
        condition.hidden = !showCondition;

        card.setAttribute("aria-pressed", String(showCondition));
    }

    card.addEventListener("click", event => {
        if (event.target.closest(".achievement-details-button")) {
            return;
        }

        toggleDescription();
    });

    card.addEventListener("keydown", event => {
        if (event.target !== card) return;

        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            toggleDescription();
        }
    });

    detailsButton.addEventListener("click", event => {
        event.stopPropagation();
        achievementOpenInfo(achievement.id);
    });

    return card;
}

// ==========================================
// ACHIEVEMENTS RENDERN
// ==========================================

function achievementRender() {
if (
!achievementElements.categoryFilter ||
!achievementElements.statusFilter ||
!achievementElements.groups
) {
return;
}

const category = achievementElements.categoryFilter.value;
const status = achievementElements.statusFilter.value;

achievementElements.groups.innerHTML = "";

const tierGroups = achievementGetTierGroups();
const tierGroupById = new Map();
const visibleTierIds = new Set();
const nextTargetById = new Map();

for (const group of tierGroups) {
    for (const id of group) {
        tierGroupById.set(id, group);
    }

    let highestUnlockedIndex = -1;

    group.forEach((id, index) => {
        if (achievementStates[id] === true) {
            highestUnlockedIndex = index;
        }
    });

    if (highestUnlockedIndex === -1) {
        // Noch keine Stufe freigeschaltet:
        // Nur die erste Stufe mit Fortschritt anzeigen.
        visibleTierIds.add(group[0]);
    } else {
        // Nur die höchste freigeschaltete Stufe anzeigen.
        const currentId = group[highestUnlockedIndex];
        visibleTierIds.add(currentId);

        // Die nächste Stufe als verborgenes Fortschrittsziel verwenden.
        const nextIndex = highestUnlockedIndex + 1;

        if (nextIndex < group.length) {
            const nextAchievement = ACHIEVEMENTS.find(
                achievement => achievement.id === group[nextIndex]
            );

            if (nextAchievement) {
                nextTargetById.set(currentId, nextAchievement);
            }
        }
    }

}

const filteredAchievements = ACHIEVEMENTS.filter(achievement => {
    const unlocked = achievementStates[achievement.id] === true;
    const tierGroup = tierGroupById.get(achievement.id);

    const categoryMatches =
        category === "all" ||
        achievement.category === category;

    const statusMatches =
        status === "all" ||
        (status === "unlocked" && unlocked) ||
        (status === "locked" && !unlocked);

    const tierIsVisible =
        !tierGroup || visibleTierIds.has(achievement.id);

    return categoryMatches && statusMatches && tierIsVisible;
});

achievementSetVisible(
    achievementElements.empty,
    filteredAchievements.length === 0
);

if (achievementElements.visibleCount) {
    achievementElements.visibleCount.textContent =
        filteredAchievements.length;
}

if (filteredAchievements.length === 0) {
    return;
}

for (const categoryKey of ACHIEVEMENT_CATEGORY_ORDER) {
    const categoryAchievements = filteredAchievements.filter(
        achievement => achievement.category === categoryKey
    );

    if (categoryAchievements.length === 0) {
        continue;
    }

    const group = document.createElement("section");
    group.className = "achievement-group";

    const unlockedInGroup = categoryAchievements.filter(
        achievement => achievementStates[achievement.id] === true
    ).length;

    const header = document.createElement("div");
    header.className = "achievement-group-header";

    const title = document.createElement("h3");
    title.textContent = ACHIEVEMENT_CATEGORY_NAMES[categoryKey];

    const count = document.createElement("span");

    header.append(title);

    const grid = document.createElement("div");
    grid.className = "achievement-grid";

    for (const achievement of categoryAchievements) {
        grid.appendChild(
            achievementCreateCard(
                achievement,
                nextTargetById.get(achievement.id) || null
            )
        );
    }

    group.append(header, grid);
    achievementElements.groups.appendChild(group);
}
}


// ==========================================
// DATEN LADEN
// ==========================================

async function achievementLoadData() {
    achievementSetVisible(achievementElements.loading, true);
    achievementSetVisible(achievementElements.content, false);
    achievementSetVisible(achievementElements.guestNotice, false);

    achievementHideError();

    try {
        const user = await getCurrentUser();

        // --------------------------------------
        // GASTMODUS
        // --------------------------------------

        if (!user) {
            achievementSetVisible(achievementElements.guestNotice, true);
            return;
        }

        // --------------------------------------
        // EIGENE ACHIEVEMENTS LADEN
        // --------------------------------------

        const result = await supabaseRequest(
            `user_achievement_stats?select=*&user_id=eq.${encodeURIComponent(user.id)}`,
            {
                method: "GET",
                authenticated: true
            }
        );

        if (!Array.isArray(result) || result.length === 0) {
            throw new Error(
                "Deine Achievement-Daten wurden noch nicht angelegt. Bitte schließe ein Spiel ab und lade diese Seite erneut."
            );
        }

        const stats = result[0];

        // --------------------------------------
        // PROFIL UND SPIELESTATISTIKEN LADEN
        // --------------------------------------

        const profiles = await supabaseRequest(
            `profiles?select=games_played,wins,losses,afrika,asien,europa,nordamerika,suedamerika,ozeanien&id=eq.${encodeURIComponent(user.id)}`,
            {
                method: "GET",
                authenticated: true
            }
        );

        if (profiles && profiles.length > 0) {
            const profile = profiles[0];

            achievementProgressData.games =
                Number(profile.games_played) || 0;

            achievementProgressData.wins =
                Number(profile.wins) || 0;

            achievementProgressData.losses =
                Number(profile.losses) || 0;

            const continentColumns = {
                africa: "afrika",
                asia: "asien",
                europe: "europa",
                north_america: "nordamerika",
                south_america: "suedamerika",
                oceania: "ozeanien"
            };

            achievementProgressData.continentWins = {};

            for (const [continent, column] of Object.entries(continentColumns)) {
                const continentStats = profile[column];

                achievementProgressData.continentWins[continent] =
                    Number(continentStats?.wins) || 0;
            }
        }

        // --------------------------------------
        // ENTDECKTE LÄNDER LADEN
        // --------------------------------------

        const discoveredCountryIds = Array.isArray(
            stats.discovered_country_ids
        )
            ? stats.discovered_country_ids.map(Number)
            : [];

        const countries = await supabaseRequest(
            "countries?select=id,continent",
            {
                method: "GET",
                authenticated: false
            }
        );

        const continentKeys = {
            "Afrika": "africa",
            "Asien": "asia",
            "Europa": "europe",
            "Nordamerika": "north_america",
            "Südamerika": "south_america",
            "Ozeanien": "oceania"
        };

        achievementProgressData.discoveredCountryIds =
            discoveredCountryIds;

        achievementProgressData.continentDiscovered = {};
        achievementProgressData.continentCountryTotals = {};

        for (const key of Object.values(continentKeys)) {
            achievementProgressData.continentDiscovered[key] = 0;
            achievementProgressData.continentCountryTotals[key] = 0;
        }

        const discoveredSet = new Set(discoveredCountryIds);

        for (const country of countries) {
            const continent = continentKeys[country.continent];

            if (!continent) continue;

            achievementProgressData.continentCountryTotals[continent]++;

            if (discoveredSet.has(Number(country.id))) {
                achievementProgressData.continentDiscovered[continent]++;
            }
        }

        // --------------------------------------
        // EIGENE FREISCHALTUNGEN ÜBERNEHMEN
        // --------------------------------------

        achievementStates = {};

        for (const achievement of ACHIEVEMENTS) {
            achievementStates[achievement.id] =
                stats[achievement.id] === true;
        }

        // Globale Zahlen sind ergänzend.
        // Ein Fehler beim Laden darf die Seite nicht blockieren.
        await achievementLoadGlobalUnlockCounts();

        achievementUpdateProgress();
        achievementRender();

        achievementSetVisible(achievementElements.content, true);

    } catch (error) {
        console.error("Fehler beim Laden der Achievements:", error);

        achievementShowError(
            "Die Achievements konnten nicht geladen werden. " +
            "Bitte überprüfe deine Verbindung und versuche es erneut."
        );

    } finally {
        achievementSetVisible(achievementElements.loading, false);
    }
}

// ==========================================
// ERFOLGS-INFO SCHLIESSEN
// ==========================================

document.addEventListener("click", event => {

    const closeButton = event.target.closest(
        ".achievement-info-close, [data-close-achievement-info]"
    );

    if (!closeButton) {
        return;
    }

    const modal = document.getElementById(
        "achievementInfoModal"
    );

    if (modal) {
        modal.classList.remove("active");
        modal.style.display = "none";
    }

});


// ==========================================
// FILTER
// ==========================================

if (achievementElements.categoryFilter) {
    achievementElements.categoryFilter.addEventListener(
        "change",
        achievementRender
    );
}

if (achievementElements.statusFilter) {
    achievementElements.statusFilter.addEventListener(
        "change",
        achievementRender
    );
}


// ==========================================
// INITIALISIERUNG
// ==========================================

achievementLoadData();