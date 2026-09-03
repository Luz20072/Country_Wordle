// ==========================================
// BENUTZEROBERFLÄCHE
// ==========================================


// ==========================================
// GUESS ANZEIGEN
// ==========================================

function addGuess(
    country,
    comparison,
    correct = false
) {

    const element =
        document.createElement("div");


    element.classList.add(
        "guess"
    );


    // --------------------------------------
    // LANDNAME
    // --------------------------------------

    const countryName =
        document.createElement("strong");


    countryName.textContent =
        country.name;


    element.appendChild(
        countryName
    );


    // --------------------------------------
    // RICHTIG
    // --------------------------------------

    if (correct) {

        const correctMessage =
            document.createElement("div");


        correctMessage.classList.add(
            "correct-message"
        );


        correctMessage.textContent =
            "Richtig! Du hast das gesuchte Land gefunden.";


        element.appendChild(
            correctMessage
        );


        guessesContainer.appendChild(
            element
        );


        return;

    }


    // --------------------------------------
    // 2 × 2 GRID
    // --------------------------------------

    const categoryGrid =
        document.createElement("div");


    categoryGrid.classList.add(
        "category-grid"
    );


    addCategoryBox(
        categoryGrid,
        comparison.continent
    );


    addCategoryBox(
        categoryGrid,
        comparison.colors
    );


    addCategoryBox(
        categoryGrid,
        comparison.wars
    );


    addCategoryBox(
        categoryGrid,
        comparison.relationships
    );


    element.appendChild(
        categoryGrid
    );


    guessesContainer.appendChild(
        element
    );

}


// ==========================================
// KATEGORIE-BOX
// ==========================================

function addCategoryBox(
    container,
    category
) {

    const box =
        document.createElement("div");


    box.classList.add(
        "category-box"
    );


    if (
        category.match
    ) {

        box.classList.add(
            "match"
        );

    }

    else {

        box.classList.add(
            "no-match"
        );

    }


    // --------------------------------------
    // TITEL
    // --------------------------------------

    const title =
        document.createElement("strong");


    title.textContent =
        category.title;


    // --------------------------------------
    // WERT
    // --------------------------------------

    const value =
        document.createElement("span");


    value.textContent =
        category.value;


    // --------------------------------------
    // TOOLTIP
    // --------------------------------------

    const tooltip =
        document.createElement("div");


    tooltip.classList.add(
        "custom-tooltip"
    );


    tooltip.textContent =
        category.tooltip;


    box.appendChild(
        title
    );


    box.appendChild(
        value
    );


    box.appendChild(
        tooltip
    );


    container.appendChild(
        box
    );

}