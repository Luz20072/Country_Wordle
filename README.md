# Country Wordle

Ein Wordle-inspiriertes Länder-Ratespiel, bei dem nicht nur der Ländername, sondern auch Flaggen, Geografie, Sprachen, historische Beziehungen und weitere Zusammenhänge beim Erraten helfen.

**Spiel:**
[Country Wordle online spielen](https://luz20072.github.io/Country_Wordle/)

**Repository:**
[Country Wordle auf GitHub](https://github.com/Luz20072/Country_Wordle)

---

## Über das Projekt

**Country Wordle** ist ein webbasiertes Ratespiel rund um Länder der Welt.

Das Grundprinzip orientiert sich an bekannten Wordle-Spielen: Ein unbekanntes Zielland muss durch mehrere Versuche gefunden werden. Nach jedem geratenen Land werden verschiedene Informationen miteinander verglichen und als Hinweise dargestellt.

Dabei geht es nicht ausschließlich darum, Länder geografisch einzuordnen. Auch historische, politische, kulturelle und sprachliche Zusammenhänge können Hinweise auf das gesuchte Land liefern.

Das Projekt wurde als Webanwendung mit **HTML, CSS und JavaScript** umgesetzt. Die Länderdaten werden über eine **Supabase-Datenbank** bereitgestellt.

---

## Ziel des Spiels

Das Ziel besteht darin, das zufällig ausgewählte Zielland mit möglichst wenigen Versuchen zu erraten.

Nach jedem Versuch werden unter anderem folgende Kategorien ausgewertet:

* Kontinent
* Flaggenfarben
* Kriege und Konflikte
* Länderbeziehungen
* UN-M49-Region
* Gewässer
* Sprachen

Je nach Kategorie kann ein Hinweis entweder eine direkte Übereinstimmung, eine mögliche Übereinstimmung oder eine Abweichung anzeigen.

---

## Spielablauf

1. Das Spiel wählt ein Zielland aus den ausgewählten Kontinenten aus.
2. Der Spieler gibt ein Land als Tipp ein.
3. Das geratene Land wird mit dem Zielland verglichen.
4. Die Ergebnisse werden in verschiedenen Kategorien angezeigt.
5. Die Hinweise helfen dabei, das Zielland weiter einzugrenzen.
6. Das Spiel endet, sobald das richtige Land gefunden wurde oder keine weiteren Versuche möglich sind.

Die verfügbaren Kontinente können vor dem Start des Spiels ausgewählt werden.

Die **Antarktis** ist nicht Bestandteil des Spiels, da sich dort keine souveränen Staaten befinden.

---

## Länderbeziehungen

Ein besonderer Bestandteil von Country Wordle sind die Beziehungen zwischen Ländern.

Zwischen zwei Ländern können mehrere unterschiedliche Beziehungen gleichzeitig bestehen.

### Unterstützte Beziehungstypen

| Beziehung        | Bedeutung                                                                            |
| ---------------- | ------------------------------------------------------------------------------------ |
| `border`         | Die beiden Länder teilen eine gemeinsame Landgrenze.                                 |
| `same_region`    | Beide Länder befinden sich nach UN-M49 in derselben Region.                          |
| `same_sea`       | Beide Länder grenzen an dasselbe Meer oder denselben Ozean.                          |
| `former_union`   | Beide Länder oder ihre Gebiete waren Teil eines gemeinsamen Staates.                 |
| `cultural`       | Zwischen den Ländern besteht eine gemeinsame sprachliche oder kulturelle Verbindung. |
| `special`        | Eine besondere historische oder politische Beziehung ist hinterlegt.                 |
| `former_colonie` | Zwischen den Ländern bestand eine koloniale Beziehung.                               |

Bei den historischen Beziehungen wird bewusst zwischen tatsächlichen gemeinsamen Staatsgebilden und lediglich lockeren politischen oder territorialen Zusammenschlüssen unterschieden.

---

## Geografische Hinweise

### UN-M49-Regionen

Für die regionale Einordnung der Länder wird die **UN-M49-Klassifikation** verwendet.

Dadurch werden Länder nach einer einheitlichen internationalen Einteilung Regionen zugeordnet.

Diese Einteilung wird auch bei den Länderbeziehungen verwendet.

### Gewässer

Länder können gemeinsame Meere oder Ozeane haben.

Wenn zwei Länder an dasselbe Gewässer grenzen, kann dies als zusätzlicher Hinweis angezeigt werden.

Dabei werden sowohl Meere als auch Ozeane berücksichtigt.

---

## Sprachhinweise

Auch Sprachen können Hinweise auf das gesuchte Land liefern.

Dabei werden die in der Datenbank hinterlegten Sprachen der Länder miteinander verglichen.

Bei einer gemeinsamen Sprache kann der Hinweis beispielsweise darauf aufmerksam machen, dass beide Länder eine Sprache gemeinsam haben.

Bei mehreren möglichen Sprachen wird zwischen sicheren und möglichen Treffern unterschieden.

---

## Flaggen

Die Flaggen der Länder werden ebenfalls für Hinweise verwendet.

Dabei werden die in einer Länderflagge vorhandenen Farben analysiert und miteinander verglichen.

Dadurch kann beispielsweise erkannt werden, welche Farben das geratene Land und das Zielland gemeinsam verwenden.

---

## Kriege und Konflikte

Historische und aktuelle Kriege können ebenfalls Bestandteil der Länderhinweise sein.

Dazu werden Länder mit den entsprechenden Kriegen und Konflikten verknüpft.

Beim Vergleich wird unter anderem berücksichtigt:

* ob beide Länder am selben Krieg beteiligt waren,
* ob sie im selben Lager standen,
* ob sie gegeneinander kämpften,
* welche gemeinsamen Konflikte vorhanden sind.

Dadurch können auch historische Zusammenhänge als Hinweis genutzt werden.

---

## Statistiken

Country Wordle speichert lokale Spielstatistiken im Browser.

Gespeichert werden unter anderem:

* Anzahl der gespielten Spiele
* Anzahl der gewonnenen Spiele
* durchschnittliche Anzahl benötigter Versuche
* Verteilung der benötigten Versuche
* Statistiken nach Kontinent
* meistgespielter Kontinent
* bester Kontinent
* schlechtester Kontinent

Die detaillierten Kontinentstatistiken können einzeln ausgewählt werden.

Die Statistik wird ausschließlich lokal im Browser gespeichert.

Verwendeter `localStorage`-Schlüssel:

```text
countryWordleStatistics
```

---

## Daten und Datenbank

Die Länderdaten werden über **Supabase** verwaltet.

Die Datenbank enthält unter anderem Informationen zu:

* Ländern
* Kontinenten
* UN-M49-Regionen
* Flaggenfarben
* Sprachen
* Gewässern
* Ländergrenzen
* historischen Beziehungen
* kolonialen Beziehungen
* Kriegen und Konflikten
* besonderen Länderbeziehungen

Dadurch können die verschiedenen Hinweise dynamisch aus den Daten der jeweiligen Länder erzeugt werden.

Die Datenbank ermöglicht außerdem, die Länderinformationen unabhängig von der eigentlichen Spiellogik zu verwalten und zu erweitern.

---

## Datenquellen

Für die Länder- und Geodaten werden externe Datenquellen und Referenzen verwendet.

Bei der regionalen Einordnung bildet insbesondere die **UN-M49-Systematik** die Grundlage.

Weitere Daten werden abhängig von ihrer Verwendung aus geeigneten historischen, geografischen und staatlichen Quellen zusammengestellt und in der Datenbank für das Spiel aufbereitet.

Die verwendeten Daten werden nicht ungeprüft übernommen, sondern für die Anforderungen des Spiels strukturiert und miteinander verknüpft.

---

## Technischer Aufbau

Das Projekt verwendet folgende Technologien:

| Technologie      | Verwendung                               |
| ---------------- | ---------------------------------------- |
| **HTML5**        | Struktur der Webseiten                   |
| **CSS3**         | Gestaltung und responsives Layout        |
| **JavaScript**   | Spiellogik und Benutzerinteraktionen     |
| **Supabase**     | Datenbank und Datenzugriff               |
| **Leaflet**      | Interaktive Karten                       |
| **GitHub Pages** | Hosting der Webanwendung                 |
| **localStorage** | Speicherung der lokalen Spielstatistiken |

Die Anwendung läuft vollständig im Browser.

---

## Projektstruktur

```text
Country_Wordle/
│
├── css/
│   ├── base.css
│   ├── game.css
│   ├── guesses.css
│   ├── hints.css
│   ├── responsive.css
│   ├── start.css
│   └── victory.css
│
├── history/
│   ├── script.js
│   └── style.css
│
├── js/
│   ├── colors.js
│   ├── comparison.js
│   ├── config.js
│   ├── game.js
│   ├── gameData.js
│   ├── hints.js
│   ├── relationships.js
│   ├── statistics.js
│   ├── supabase.js
│   ├── ui.js
│   └── wars.js
│
├── game.html
├── index.html
└── README.md
```

---

## Speicherung der Spielstatistik

Die Statistik wird über die Browser-API `localStorage` gespeichert.

Dadurch bleiben die persönlichen Statistiken auch nach dem Schließen der Webseite erhalten.

Die Daten werden dabei nicht an einen Server übertragen.

Beim Löschen der Browserdaten oder des entsprechenden `localStorage`-Eintrags werden auch die gespeicherten Statistiken entfernt.

---

## Hosting

Die Webanwendung wird über **GitHub Pages** bereitgestellt.

Das Projekt ist dadurch direkt über folgende Adresse erreichbar:

[Country Wordle öffnen](https://luz20072.github.io/Country_Wordle/)

Die Datenbank wird unabhängig vom Hosting über Supabase bereitgestellt.

---

## Nutzung

Das Projekt ist primär als eigenes Webprojekt und Lernprojekt gedacht.

Der Quellcode kann eingesehen werden, eine Nutzung, Veränderung oder Weitergabe ist jedoch nur im Rahmen der im Projekt festgelegten Lizenzbedingungen gestattet.

---

## Entwicklungsziele

Das Projekt wird schrittweise erweitert.

Geplante beziehungsweise mögliche Erweiterungen sind unter anderem:

* Erweiterung der Länderdatenbank
* weitere historische Beziehungen
* zusätzliche Länderhinweise
* weitere statistische Auswertungen
* Verbesserungen der Benutzeroberfläche
* zusätzliche geografische Informationen
* weitere historische Zusammenhänge

---

## Lizenz

Dieses Projekt steht unter **keiner freien Lizenz**. Alle Rechte vorbehalten.

Die Nutzung, Vervielfältigung, Veränderung, Weitergabe und Veröffentlichung des Quellcodes oder von Teilen davon ist ohne ausdrückliche Genehmigung des Urhebers nicht gestattet.

Dies gilt sowohl für kommerzielle als auch für nicht-kommerzielle Nutzung.

Die Veröffentlichung des Quellcodes auf GitHub stellt keine Erteilung einer Nutzungslizenz dar.

---

## Status

**Country Wordle befindet sich in aktiver Entwicklung.**

Die grundlegende Spiellogik, Länderhinweise, Länderbeziehungen, Statistiken und die Datenbankanbindung sind implementiert.