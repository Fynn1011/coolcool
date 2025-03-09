/**
 * Überprüft, ob eine Zahl eine vollkommene Zahl ist.
 * Eine vollkommene Zahl ist eine natürliche Zahl, die gleich der Summe ihrer echten Teiler ist.
 * Beispiel: 6 = 1 + 2 + 3, 28 = 1 + 2 + 4 + 7 + 14
 * 
 * @param {number} num - Die zu überprüfende Zahl
 * @returns {boolean} True, wenn die Zahl vollkommen ist, sonst false
 */
function istVollkommenZahl(num) {
    // Eine Zahl kleiner als 6 kann nicht vollkommen sein
    if (num < 6) return false;
    
    let summeTeiler = 0;
    
    // Finde alle Teiler und addiere sie
    for (let i = 1; i <= Math.floor(num / 2); i++) {
        if (num % i === 0) {
            summeTeiler += i;
        }
    }
    
    // Überprüfe, ob die Summe der Teiler gleich der ursprünglichen Zahl ist
    return summeTeiler === num;
}

/**
 * Findet alle vollkommenen Zahlen in einem bestimmten Bereich
 * 
 * @param {number} vonZahl - Untergrenze des Bereichs
 * @param {number} bisZahl - Obergrenze des Bereichs
 * @returns {number[]} Ein Array mit allen vollkommenen Zahlen im angegebenen Bereich
 */
function findeVollkommeneZahlen(vonZahl, bisZahl) {
    const vollkommeneZahlen = [];
    
    for (let i = Math.max(6, vonZahl); i <= bisZahl; i++) {
        if (istVollkommenZahl(i)) {
            vollkommeneZahlen.push(i);
        }
    }
    
    return vollkommeneZahlen;
}

// Beispiel: Finde vollkommene Zahlen zwischen 1 und 10000
const bereich = {
    von: 1,
    bis: 10000
};

console.log(`Suche nach vollkommenen Zahlen im Bereich von ${bereich.von} bis ${bereich.bis}:`);
const ergebnis = findeVollkommeneZahlen(bereich.von, bereich.bis);

if (ergebnis.length > 0) {
    console.log(`Gefundene vollkommene Zahlen: ${ergebnis.join(', ')}`);
} else {
    console.log('Keine vollkommenen Zahlen gefunden.');
}

// Überprüfung einer Einzelzahl
const testZahl = 28;
const istVollkommen = istVollkommenZahl(testZahl);
console.log(`Ist ${testZahl} eine vollkommene Zahl? ${istVollkommen ? 'Ja' : 'Nein'}`);