// ==========================================
// SUPABASE
// ==========================================

const SUPABASE_URL =
    "https://utxbkbmdjhgsnlksjkst.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_6640Ix-kp0Diy3Crqb3PDw_7g1bK4Ca";


// ==========================================
// ELEMENTE
// ==========================================

const countryInput = document.getElementById("countryInput");
const guessButton = document.getElementById("guessButton");
const guessesContainer = document.getElementById("guesses");
const message = document.getElementById("message");


// ==========================================
// DATEN
// ==========================================

let countries = [];
let guessedCountries = [];


// ==========================================
// SUPABASE - LÄNDER LADEN
// ==========================================

async function loadCountries() {

    try {

        const response = await fetch(
            `${SUPABASE_URL}/rest/v1/countries?select=*`,
            {
                headers: {
                    apikey: SUPABASE_KEY,
                    Authorization: `Bearer ${SUPABASE_KEY}`
                }
            }
        );

        if (!response.ok) {

            throw new Error(
                `HTTP ${response.status}: ${await response.text()}`
            );

        }

        countries = await response.json();

        console.log("Supabase-Verbindung erfolgreich.");
        console.log("Geladene Länder:", countries);

        message.textContent =
            `${countries.length} Länder geladen.`;

    } catch (error) {

        console.error(
            "Fehler beim Laden der Länder:",
            error
        );

        message.textContent =
            "Fehler beim Verbinden mit der Datenbank.";

    }
}


// ==========================================
// LAND SUCHEN
// ==========================================

function findCountry(name) {

    return countries.find(country =>
        country.name.toLowerCase() === name.toLowerCase()
    );

}


// ==========================================
// GUESS
// ==========================================

function makeGuess() {

    const input = countryInput.value.trim();

    if (input === "") {
        message.textContent = "Bitte ein Land eingeben.";
        return;
    }

    const country = findCountry(input);

    if (!country) {

        message.textContent =
            "Dieses Land befindet sich nicht in der Datenbank.";

        return;
    }

    if (guessedCountries.includes(country.id)) {

        message.textContent =
            "Dieses Land hast du bereits geraten.";

        return;
    }

    guessedCountries.push(country.id);

    addGuess(country);

    countryInput.value = "";

    message.textContent = "";

}


// ==========================================
// GUESS ANZEIGEN
// ==========================================

function addGuess(country) {

    const element = document.createElement("div");

    element.classList.add("guess");

    element.textContent = country.name;

    guessesContainer.appendChild(element);

}


// ==========================================
// EVENTS
// ==========================================

guessButton.addEventListener(
    "click",
    makeGuess
);

countryInput.addEventListener(
    "keydown",
    event => {

        if (event.key === "Enter") {
            makeGuess();
        }

    }
);


// ==========================================
// START
// ==========================================

loadCountries();