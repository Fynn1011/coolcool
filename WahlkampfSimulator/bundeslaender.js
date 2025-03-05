// Bundesländer mit zusätzlichen Informationen
// Unterteilung nach historischen Ost- und Westdeutschland
const bundeslaender = [
    // Westdeutschland (Alte Bundesländer)
    { name: "Bayern", region: "west", population: 13124737, support: 45 },
    { name: "Baden-Württemberg", region: "west", population: 11103043, support: 38 },
    { name: "NRW", region: "west", population: 17947221, support: 33 },
    { name: "Hessen", region: "west", population: 6288080, support: 35 },
    { name: "Niedersachsen", region: "west", population: 8003421, support: 28 },
    { name: "Rheinland-Pfalz", region: "west", population: 4098391, support: 30 },
    { name: "Schleswig-Holstein", region: "west", population: 2910875, support: 31 },
    { name: "Saarland", region: "west", population: 983991, support: 34 },
    { name: "Bremen", region: "west", population: 676463, support: 22 },
    { name: "Hamburg", region: "west", population: 1847253, support: 26 },
    
    // Ostdeutschland (Neue Bundesländer + Berlin)
    { name: "Sachsen", region: "east", population: 4056941, support: 27 },
    { name: "Brandenburg", region: "east", population: 2537868, support: 22 },
    { name: "Sachsen-Anhalt", region: "east", population: 2180684, support: 25 },
    { name: "Thüringen", region: "east", population: 2120237, support: 24 },
    { name: "Mecklenburg-Vorpommern", region: "east", population: 1610774, support: 23 },
    { name: "Berlin", region: "east", population: 3664088, support: 18 }
];

// Speichern des Bundesländer-Fokus
let focusedStates = [];

// Initialisiere die Bundesländer-Karten beim Laden der Seite
function initBundeslaender() {
    // Regionen-Legende hinzufügen
    const statesControlPanel = document.querySelector('.states-control-panel');
    const legendHTML = `
        <div class="region-legend">
            <div class="region-legend-item">
                <div class="region-legend-color legend-east"></div>
                <span>Ostdeutschland (Neue Bundesländer)</span>
            </div>
            <div class="region-legend-item">
                <div class="region-legend-color legend-west"></div>
                <span>Westdeutschland (Alte Bundesländer)</span>
            </div>
        </div>
    `;
    statesControlPanel.insertAdjacentHTML('afterend', legendHTML);
    
    // Bundesländer-Karten mit zusätzlichen Attributen versehen
    const stateElements = document.querySelectorAll('.state');
    
    stateElements.forEach((stateElement) => {
        // Den Namen des Bundeslandes aus dem HTML-Element extrahieren
        const stateNameElement = stateElement.querySelector('.state-name');
        if (!stateNameElement) return;
        
        const stateName = stateNameElement.textContent;
        
        // Das entsprechende Bundesland in der Datenstruktur finden
        const state = bundeslaender.find(land => land.name === stateName);
        
        if (state) {
            // Attribute setzen
            stateElement.setAttribute('data-name', state.name);
            stateElement.setAttribute('data-region', state.region);
            stateElement.setAttribute('data-population', state.population);
            stateElement.setAttribute('data-support', state.support);
            
            // Fokus-Indikator hinzufügen
            const focusIndicator = document.createElement('div');
            focusIndicator.className = 'state-focus';
            stateElement.appendChild(focusIndicator);
            
            // Event-Listener für Klick zum Umschalten des Fokus
            stateElement.addEventListener('click', () => toggleStateFocus(stateElement));
        }
    });
    
    // Initiale Sortierung nach Namen
    sortStates();
}

// Funktion zum Filtern der Bundesländer nach Region
function filterStates() {
    const regionFilter = document.getElementById('states-region-filter').value;
    const stateElements = document.querySelectorAll('.state');
    
    stateElements.forEach(stateElement => {
        const stateRegion = stateElement.getAttribute('data-region');
        
        if (regionFilter === 'all' || stateRegion === regionFilter) {
            stateElement.style.display = '';
            // Animation hinzufügen
            stateElement.classList.add('pulse');
            setTimeout(() => {
                stateElement.classList.remove('pulse');
            }, 500);
        } else {
            stateElement.style.display = 'none';
        }
    });
    
    // Benachrichtigung anzeigen
    const regionName = {
        'east': 'Ostdeutschland (Neue Bundesländer)', 
        'west': 'Westdeutschland (Alte Bundesländer)',
        'all': 'alle Bundesländer'
    }[regionFilter];
    
    showNotification(`Filter gesetzt: ${regionName}`, 'info');
}

// Funktion zum Sortieren der Bundesländer
function sortStates() {
    const sortCriteria = document.getElementById('states-sort').value;
    const statesMap = document.querySelector('.states-map');
    const stateElements = Array.from(document.querySelectorAll('.state'));
    
    switch (sortCriteria) {
        case 'name':
            stateElements.sort((a, b) => {
                return a.getAttribute('data-name').localeCompare(b.getAttribute('data-name'));
            });
            break;
        case 'support-desc':
            stateElements.sort((a, b) => {
                return parseInt(b.getAttribute('data-support')) - parseInt(a.getAttribute('data-support'));
            });
            break;
        case 'support-asc':
            stateElements.sort((a, b) => {
                return parseInt(a.getAttribute('data-support')) - parseInt(b.getAttribute('data-support'));
            });
            break;
        case 'population':
            stateElements.sort((a, b) => {
                return parseInt(b.getAttribute('data-population')) - parseInt(a.getAttribute('data-population'));
            });
            break;
    }
    
    // Elemente neu anordnen
    stateElements.forEach(element => {
        statesMap.appendChild(element);
        
        // Animation hinzufügen
        element.classList.add('slideInUp');
        setTimeout(() => {
            element.classList.remove('slideInUp');
        }, 500);
    });
    
    // Benachrichtigung anzeigen
    const sortName = {
        'name': 'Name', 
        'support-desc': 'höchste Zustimmung', 
        'support-asc': 'niedrigste Zustimmung', 
        'population': 'Einwohnerzahl'
    }[sortCriteria];
    
    showNotification(`Sortiert nach: ${sortName}`, 'info');
}

// Funktion zum Umschalten des Fokus auf ein Bundesland
function toggleStateFocus(stateElement) {
    const stateName = stateElement.getAttribute('data-name');
    
    if (stateElement.classList.contains('focused')) {
        // Fokus entfernen
        stateElement.classList.remove('focused');
        focusedStates = focusedStates.filter(state => state !== stateName);
    } else {
        // Fokus hinzufügen
        stateElement.classList.add('focused');
        focusedStates.push(stateName);
    }
    
    // Benachrichtigung anzeigen
    if (stateElement.classList.contains('focused')) {
        showNotification(`${stateName} im Fokus`, 'success');
    } else {
        showNotification(`${stateName} aus dem Fokus entfernt`, 'info');
    }
}

// Funktion zum Zurücksetzen des Fokus auf alle Bundesländer
function resetStateFocus() {
    const stateElements = document.querySelectorAll('.state');
    
    stateElements.forEach(stateElement => {
        stateElement.classList.remove('focused');
    });
    
    focusedStates = [];
    
    showNotification('Fokus zurückgesetzt', 'info');
}

// Umfragewerte basierend auf Zustimmung in Bundesländern berechnen
function calculateNationalPolls() {
    const stateElements = document.querySelectorAll('.state');
    let totalPopulation = 0;
    let weightedSupport = 0;
    
    // Gewichteten Durchschnitt der Zustimmung berechnen, basierend auf Bevölkerungsgröße
    stateElements.forEach(stateElement => {
        const population = parseInt(stateElement.getAttribute('data-population'));
        const support = parseInt(stateElement.getAttribute('data-support'));
        
        totalPopulation += population;
        weightedSupport += population * support;
    });
    
    // Durchschnittliche Zustimmung berechnen
    const nationalSupport = weightedSupport / totalPopulation;
    
    return nationalSupport;
}

// Aktualisiert die Umfragewerte basierend auf den Bundesländern
function updateNationalPolls() {
    // Berechnet den nationalen Umfragewert aus den Bundesländern
    const nationalSupport = calculateNationalPolls();
    
    // Nationalen Umfragewert aktualisieren (sanfte Anpassung, um große Sprünge zu vermeiden)
    const currentPoll = gameState.polls[gameState.selectedParty];
    const newPoll = currentPoll * 0.7 + nationalSupport * 0.3; // Gewichtete Mischung aus altem und neuem Wert
    
    // Umfragewerte aktualisieren
    gameState.polls[gameState.selectedParty] = newPoll;
    gameState.resources.polls = newPoll;
    
    // UI aktualisieren
    updateUI();
}

// Regional-Kampagnen-Modal anzeigen
function showRegionalCampaignModal() {
    const modal = document.getElementById('regional-campaign-modal');
    const stateSelection = modal.querySelector('.state-selection');
    
    // Modal-Inhalt mit Bundesländern füllen
    stateSelection.innerHTML = '';
    
    bundeslaender.forEach(state => {
        const stateOption = document.createElement('div');
        stateOption.className = 'state-option';
        stateOption.setAttribute('data-name', state.name);
        stateOption.setAttribute('data-region', state.region);
        
        // Fokussierte Staaten vorauswählen
        if (focusedStates.includes(state.name)) {
            stateOption.classList.add('selected');
        }
        
        // Region-Farbmarker hinzufügen
        const regionColor = {
            'east': '#ff8a65',
            'west': '#4285f4'
        }[state.region];
        
        stateOption.innerHTML = `
            <div class="state-marker" style="background-color: ${regionColor}"></div>
            <span>${state.name} (${state.support}%)</span>
        `;
        
        stateOption.addEventListener('click', () => {
            stateOption.classList.toggle('selected');
            updateRegionalCampaignCost();
        });
        
        stateSelection.appendChild(stateOption);
    });
    
    // Initiale Kosten aktualisieren
    updateRegionalCampaignCost();
    
    // Modal anzeigen
    modal.style.display = 'flex';
    setTimeout(() => {
        modal.classList.add('show');
    }, 10);
}

// Regional-Kampagnen-Modal schließen
function closeRegionalCampaignModal() {
    const modal = document.getElementById('regional-campaign-modal');
    modal.classList.remove('show');
    setTimeout(() => {
        modal.style.display = 'none';
    }, 300);
}

// Kosten für die regionale Kampagne aktualisieren
function updateRegionalCampaignCost() {
    const selectedStates = document.querySelectorAll('#regional-campaign-modal .state-option.selected');
    const campaignType = document.getElementById('campaign-type').value;
    
    // Basiskosten pro Bundesland
    const baseCost = 100000;
    
    // Multiplikator je nach Kampagnentyp
    const multiplier = {
        'standard': 1,
        'intensive': 1.8,
        'focused': 2.5
    }[campaignType];
    
    // Gesamtkosten berechnen
    const totalCost = selectedStates.length * baseCost * multiplier;
    
    // Kosten anzeigen
    document.getElementById('regional-campaign-cost').textContent = formatMoney(totalCost);
}

// Regionale Kampagne starten
function startRegionalCampaign() {
    const selectedStates = document.querySelectorAll('#regional-campaign-modal .state-option.selected');
    const campaignType = document.getElementById('campaign-type').value;
    
    // Prüfen, ob mindestens ein Bundesland ausgewählt ist
    if (selectedStates.length === 0) {
        showNotification('Bitte wähle mindestens ein Bundesland aus!', 'warning');
        return;
    }
    
    // Basiskosten pro Bundesland
    const baseCost = 100000;
    
    // Konfiguration je nach Kampagnentyp
    const campaignConfig = {
        'standard': { multiplier: 1, supportBoost: 1.5 },
        'intensive': { multiplier: 1.8, supportBoost: 3 },
        'focused': { multiplier: 2.5, supportBoost: 4.5 }
    }[campaignType];
    
    // Gesamtkosten berechnen
    const totalCost = selectedStates.length * baseCost * campaignConfig.multiplier;
    
    // Prüfen, ob genug Budget vorhanden ist
    if (gameState.resources.budget < totalCost) {
        showNotification(`Nicht genug Budget! Benötigt: ${formatMoney(totalCost)}`, 'error');
        return;
    }
    
    // Budget abziehen
    gameState.resources.budget -= totalCost;
    
    // Liste der Bundesländer für die Kampagne
    const campaignStates = Array.from(selectedStates).map(el => el.getAttribute('data-name'));
    
    // Zustimmung in den ausgewählten Bundesländern erhöhen
    const stateElements = document.querySelectorAll('.state');
    stateElements.forEach(stateElement => {
        const stateName = stateElement.getAttribute('data-name');
        
        if (campaignStates.includes(stateName)) {
            // Aktuelle Zustimmung abrufen
            let currentSupport = parseInt(stateElement.getAttribute('data-support'));
            
            // Zustimmung erhöhen
            currentSupport += campaignConfig.supportBoost;
            
            // Maximum von 60% Zustimmung
            currentSupport = Math.min(60, currentSupport);
            
            // Neue Zustimmung setzen
            stateElement.setAttribute('data-support', currentSupport);
            
            // Bundesländer-Daten aktualisieren
            const bundesland = bundeslaender.find(land => land.name === stateName);
            if (bundesland) {
                bundesland.support = currentSupport;
            }
            
            // Text in der Karte aktualisieren
            const stateValueElement = stateElement.querySelector('.state-value');
            if (stateValueElement) {
                stateValueElement.textContent = `${currentSupport}% Zustimmung`;
            }
            
            // Visuelle Hervorhebung
            stateElement.classList.add('active-campaign');
            setTimeout(() => {
                stateElement.classList.remove('active-campaign');
            }, 3000);
        }
    });
    
    // Nationalen Umfragewert aktualisieren
    updateNationalPolls();
    
    // Log-Eintrag
    const campaignTypeNames = {
        'standard': 'Standard-Kampagne',
        'intensive': 'Intensive Kampagne',
        'focused': 'Fokussierte Kampagne'
    };
    
    addLogEntry(`${campaignTypeNames[campaignType]} in ${campaignStates.join(', ')} durchgeführt. Zustimmung um ${campaignConfig.supportBoost}% erhöht.`);
    
    // Benachrichtigung anzeigen
    showNotification(`Regionale Kampagne erfolgreich gestartet!`, 'success');
    
    // Modal schließen
    closeRegionalCampaignModal();
}

// Initialisierung nach dem Laden der Seite
document.addEventListener('DOMContentLoaded', function() {
    // Verzögerung für die Initialisierung, um sicherzustellen, dass die Bundesländer-Karten bereits geladen sind
    setTimeout(initBundeslaender, 500);
    
    // Anfängliche nationale Umfragewerte berechnen
    setTimeout(() => {
        updateNationalPolls();
    }, 1000);
    
    // Event-Listener für die Änderung des Kampagnentyps
    document.getElementById('campaign-type').addEventListener('change', updateRegionalCampaignCost);
});