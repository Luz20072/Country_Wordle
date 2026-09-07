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
        document.createElement(
            "div"
        );


    element.classList.add(
        "guess"
    );


    // ======================================
    // GUESS-HEADER
    // ======================================

    const guessHeader =
        document.createElement(
            "div"
        );


    guessHeader.classList.add(
        "guess-header"
    );


    // ======================================
    // FLAGGE
    // ======================================

    const countryFlag =
        document.createElement(
            "img"
        );


    countryFlag.classList.add(
        "guess-flag"
    );


    countryFlag.src =
        `https://flagcdn.com/w40/${country.iso_code.toLowerCase()}.png`;


    countryFlag.alt =
        `Flagge von ${country.name}`;


    // ======================================
    // LANDNAME
    // ======================================

    const countryName =
        document.createElement(
            "strong"
        );


    countryName.textContent =
        country.name;


    guessHeader.appendChild(
        countryFlag
    );


    guessHeader.appendChild(
        countryName
    );


    element.appendChild(
        guessHeader
    );


    // ======================================
    // RICHTIG GERATEN
    // ======================================

    if (
        correct
    ) {

        const correctRow =
            document.createElement(
                "div"
            );


        correctRow.classList.add(
            "correct-row"
        );


        const correctMessage =
            document.createElement(
                "div"
            );


        correctMessage.classList.add(
            "correct-message"
        );


        correctMessage.textContent =
            "Richtig! Du hast das gesuchte Land gefunden.";


        correctRow.appendChild(
            correctMessage
        );


        /*
         * Der vorhandene Button "Ergebnis anzeigen"
         * wird direkt neben die Siegmeldung verschoben.
         *
         * Der Event-Listener aus game.js bleibt erhalten,
         * da dasselbe DOM-Element nur verschoben wird.
         */

        if (
            showVictoryButton
        ) {

            correctRow.appendChild(
                showVictoryButton
            );

        }


        element.appendChild(
            correctRow
        );


        guessesContainer.prepend(
            element
        );


        return;

    }


    // ======================================
    // NORMALES GERATENES LAND
    // ======================================

    const categoryGrid =
        document.createElement(
            "div"
        );


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


    // ======================================
    // NEUESTEN GUESS OBEN
    // ======================================

    guessesContainer.prepend(
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
        document.createElement(
            "div"
        );


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


    // ======================================
    // TITEL
    // ======================================

    const title =
        document.createElement(
            "strong"
        );


    title.textContent =
        category.title;


    // ======================================
    // WERT
    // ======================================

    const value =
        document.createElement(
            "span"
        );


    value.textContent =
        category.value;


    // ======================================
    // TOOLTIP
    // ======================================

    const tooltip =
        document.createElement(
            "div"
        );


    tooltip.classList.add(
        "custom-tooltip"
    );


    // ======================================
    // KONTINENT
    // ======================================

    if (
        category.title ===
        "Kontinent" &&
        typeof category.tooltip ===
        "object"
    ) {

        const tooltipTitle =
            document.createElement(
                "strong"
            );


        tooltipTitle.textContent =
            category.tooltip.match
                ? "Kontinent stimmt überein"
                : "Kontinent stimmt nicht überein";


        const tooltipText =
            document.createElement(
                "span"
            );


        tooltipText.textContent =
            category.tooltip.match

                ? "Beide Länder liegen auf demselben Kontinent."

                : "Die Länder liegen auf unterschiedlichen Kontinenten.";


        tooltip.appendChild(
            tooltipTitle
        );


        tooltip.appendChild(
            tooltipText
        );

    }


    // ======================================
    // FLAGGENFARBEN
    // ======================================

    else if (
        category.title ===
        "Flaggenfarben" &&
        typeof category.tooltip ===
        "object"
    ) {

        const colors =
            category.tooltip.colors;


        if (
            colors &&
            colors.length > 0
        ) {

            const tooltipTitle =
                document.createElement(
                    "strong"
                );


            tooltipTitle.textContent =
                "Gemeinsame Farben";


            tooltip.appendChild(
                tooltipTitle
            );


            colors.forEach(
                colorName => {

                    const colorItem =
                        document.createElement(
                            "span"
                        );


                    colorItem.classList.add(
                        "color-tooltip-item"
                    );


                    const colorDot =
                        document.createElement(
                            "span"
                        );


                    colorDot.classList.add(
                        "color-tooltip-dot"
                    );


                    colorDot.dataset.color =
                        colorName.toLowerCase();


                    const colorText =
                        document.createElement(
                            "span"
                        );


                    colorText.textContent =
                        colorName;


                    colorItem.appendChild(
                        colorDot
                    );


                    colorItem.appendChild(
                        colorText
                    );


                    tooltip.appendChild(
                        colorItem
                    );

                }
            );

        }

        else {

            tooltip.textContent =
                "Keine gemeinsame Farbe.";

        }

    }


    // ======================================
    // KRIEGS-TOOLTIP
    // ======================================

    else if (
        category.title ===
        "Krieg" &&
        typeof category.tooltip ===
        "object"
    ) {

        // ==================================
        // VERBÜNDETE
        // ==================================

        if (
            category.tooltip.allies &&
            category.tooltip.allies.length > 0
        ) {

            const alliesTitle =
                document.createElement(
                    "strong"
                );


            alliesTitle.textContent =
                "Verbündete";


            tooltip.appendChild(
                alliesTitle
            );


            category.tooltip.allies.forEach(
                warName => {

                    const war =
                        document.createElement(
                            "span"
                        );


                    war.textContent =
                        warName;


                    tooltip.appendChild(
                        war
                    );

                }
            );

        }


        // ==================================
        // GEGNER
        // ==================================

        if (
            category.tooltip.enemies &&
            category.tooltip.enemies.length > 0
        ) {

            const enemiesTitle =
                document.createElement(
                    "strong"
                );


            enemiesTitle.textContent =
                "Gegner";


            tooltip.appendChild(
                enemiesTitle
            );


            category.tooltip.enemies.forEach(
                warName => {

                    const war =
                        document.createElement(
                            "span"
                        );


                    war.textContent =
                        warName;


                    tooltip.appendChild(
                        war
                    );

                }
            );

        }

    }


    // ======================================
    // BEZIEHUNGEN
    // ======================================

    else if (
        category.title ===
        "Beziehungen" &&
        typeof category.tooltip ===
        "object"
    ) {

        const relationships =
            category.tooltip.relationships;


        if (
            relationships &&
            relationships.length > 0
        ) {

            const tooltipTitle =
                document.createElement(
                    "strong"
                );


            tooltipTitle.textContent =
                "Beziehungen";


            tooltip.appendChild(
                tooltipTitle
            );


            relationships.forEach(
                relationship => {

                    const relationshipItem =
                        document.createElement(
                            "span"
                        );


                    relationshipItem.classList.add(
                        "relationship-tooltip-item"
                    );


                    const relationshipSymbol =
                        document.createElement(
                            "span"
                        );


                    relationshipSymbol.classList.add(
                        "relationship-tooltip-symbol"
                    );


                    relationshipSymbol.textContent =
                        relationship.symbol;


                    const relationshipText =
                        document.createElement(
                            "span"
                        );


                    relationshipText.textContent =
                        relationship.label;


                    relationshipItem.appendChild(
                        relationshipSymbol
                    );


                    relationshipItem.appendChild(
                        relationshipText
                    );


                    tooltip.appendChild(
                        relationshipItem
                    );

                }
            );

        }

        else {

            tooltip.textContent =
                "Keine Beziehung zwischen den Ländern.";

        }

    }


    // ======================================
    // STANDARD-TOOLTIP
    // ======================================

    else {

        tooltip.textContent =
            category.tooltip;

    }


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