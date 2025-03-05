        // Spielvariablen
        let credits = 1000;
        let collection = {};
        let openedCards = [];
        let currentCardIndex = 0;

        // Kartentypen und Seltenheiten
        const cardData = {
            "Feuerdrache": { rarity: "legendary", value: 500, image: "/api/placeholder/100/100" },
            "Eisriese": { rarity: "epic", value: 300, image: "/api/placeholder/100/100" },
            "Wassernymphe": { rarity: "epic", value: 280, image: "/api/placeholder/100/100" },
            "Erdgolem": { rarity: "rare", value: 150, image: "/api/placeholder/100/100" },
            "Luftelementar": { rarity: "rare", value: 140, image: "/api/placeholder/100/100" },
            "Waldelfe": { rarity: "rare", value: 130, image: "/api/placeholder/100/100" },
            "Bergtroll": { rarity: "uncommon", value: 80, image: "/api/placeholder/100/100" },
            "Schattenwolf": { rarity: "uncommon", value: 75, image: "/api/placeholder/100/100" },
            "Lichtkäfer": { rarity: "uncommon", value: 70, image: "/api/placeholder/100/100" },
            "Vulkankrieger": { rarity: "uncommon", value: 65, image: "/api/placeholder/100/100" },
            "Steppenjäger": { rarity: "common", value: 40, image: "/api/placeholder/100/100" },
            "Waldgeist": { rarity: "common", value: 35, image: "/api/placeholder/100/100" },
            "Höhlenzwerg": { rarity: "common", value: 30, image: "/api/placeholder/100/100" },
            "Sandkriecher": { rarity: "common", value: 25, image: "/api/placeholder/100/100" },
            "Nebelwandler": { rarity: "common", value: 20, image: "/api/placeholder/100/100" }
        };

        // Pack-Definitionen und Wahrscheinlichkeiten
        const packData = {
            "basic": {
                price: 100,
                cardCount: 3,
                rarityChances: {
                    common: 70,
                    uncommon: 25,
                    rare: 5,
                    epic: 0,
                    legendary: 0
                }
            },
            "premium": {
                price: 250,
                cardCount: 5,
                rarityChances: {
                    common: 40,
                    uncommon: 40,
                    rare: 15,
                    epic: 5,
                    legendary: 0
                }
            },
            "elite": {
                price: 500,
                cardCount: 7,
                rarityChances: {
                    common: 30,
                    uncommon: 30,
                    rare: 25,
                    epic: 10,
                    legendary: 5
                }
            }
        };

        // DOM-Elemente
        const creditsDisplay = document.querySelector('.credits');
        const cardsCountDisplay = document.querySelector('.cards-count');
        const collectionValueDisplay = document.querySelector('.collection-value');
        const collectionContainer = document.querySelector('.collection');
        const packElements = document.querySelectorAll('.pack');
        const infoBanner = document.getElementById('infoBanner');

        // Event Listener für Packs
        packElements.forEach(pack => {
            pack.addEventListener('click', () => {
                const packType = pack.getAttribute('data-pack');
                openPack(packType);
            });
        });

        // Pack öffnen
        function openPack(packType) {
            const pack = packData[packType];
            
            // Prüfen, ob genug Credits vorhanden sind
            if (credits < pack.price) {
                showInfoBanner('Nicht genug Guthaben!', 'error');
                return;
            }
            
            // Credits abziehen
            credits -= pack.price;
            updateStats();
            
            // Karten generieren
            openedCards = [];
            for (let i = 0; i < pack.cardCount; i++) {
                const card = generateRandomCard(pack.rarityChances);
                openedCards.push(card);
            }
            
            // Karten anzeigen
            currentCardIndex = 0;
            showCardRevealAnimation();
        }

        // Zufällige Karte basierend auf Seltenheitswahrscheinlichkeiten generieren
        function generateRandomCard(rarityChances) {
            // Seltenheit bestimmen
            const rarityRoll = Math.random() * 100;
            let selectedRarity;
            let cumulativeChance = 0;
            
            for (const [rarity, chance] of Object.entries(rarityChances)) {
                cumulativeChance += chance;
                if (rarityRoll < cumulativeChance) {
                    selectedRarity = rarity;
                    break;
                }
            }
            
            // Karte basierend auf Seltenheit auswählen
            const cardsOfRarity = Object.entries(cardData)
                .filter(([_, cardInfo]) => cardInfo.rarity === selectedRarity)
                .map(([name, info]) => ({ name, ...info }));
            
            return cardsOfRarity[Math.floor(Math.random() * cardsOfRarity.length)];
        }

        // Animierte Kartenoffenbarung anzeigen
        function showCardRevealAnimation() {
            if (currentCardIndex >= openedCards.length) {
                return;
            }
            
            const card = openedCards[currentCardIndex];
            
            // Animation-Container erstellen
            const animationContainer = document.createElement('div');
            animationContainer.className = 'opening-animation';
            
            // Karte erstellen
            const cardDisplay = document.createElement('div');
            cardDisplay.className = 'card-display';
            
            const cardElement = document.createElement('div');
            cardElement.className = 'card';
            
            const cardBack = document.createElement('div');
            cardBack.className = 'card-back';
            cardBack.innerHTML = `<img src="/api/placeholder/120/120" alt="Card Back">`;
            
            const cardFront = document.createElement('div');
            cardFront.className = 'card-front';
            cardFront.innerHTML = `
                <div class="card-name">${card.name}</div>
                <img src="${card.image}" alt="${card.name}" class="card-image">
                <div class="card-rarity rarity-${card.rarity}">${capitalizeFirstLetter(card.rarity)}</div>
                <div class="card-value">${card.value}</div>
            `;
            
            cardElement.appendChild(cardBack);
            cardElement.appendChild(cardFront);
            cardDisplay.appendChild(cardElement);
            
            // Buttons erstellen
            const buttonContainer = document.createElement('div');
            
            const openNextButton = document.createElement('button');
            openNextButton.className = 'open-next';
            openNextButton.textContent = currentCardIndex < openedCards.length - 1 ? 'Nächste Karte' : 'Alle sammeln';
            openNextButton.addEventListener('click', () => {
                if (currentCardIndex < openedCards.length - 1) {
                    document.body.removeChild(animationContainer);
                    currentCardIndex++;
                    showCardRevealAnimation();
                } else {
                    collectAllCards();
                    document.body.removeChild(animationContainer);
                }
            });
            
            buttonContainer.appendChild(openNextButton);
            
            // Zur Seite hinzufügen
            animationContainer.appendChild(cardDisplay);
            animationContainer.appendChild(buttonContainer);
            document.body.appendChild(animationContainer);
            
            // Karte umdrehen
            setTimeout(() => {
                cardElement.classList.add('flipped');
            }, 500);
        }

        // Alle geöffneten Karten zur Sammlung hinzufügen
        function collectAllCards() {
            openedCards.forEach(card => {
                if (collection[card.name]) {
                    collection[card.name].count++;
                } else {
                    collection[card.name] = { ...card, count: 1 };
                }
            });
            
            updateCollection();
            updateStats();
            showInfoBanner(`${openedCards.length} Karten zur Sammlung hinzugefügt!`, 'success');
        }

        // Sammlung aktualisieren
        function updateCollection() {
            collectionContainer.innerHTML = '';
            
            if (Object.keys(collection).length === 0) {
                collectionContainer.innerHTML = '<div class="collection-empty">Öffne Packs, um Karten zu sammeln!</div>';
                return;
            }
            
            // Karten sortieren (Seltenheit und dann Wert)
            const rarityOrder = { legendary: 5, epic: 4, rare: 3, uncommon: 2, common: 1 };
            const sortedCards = Object.entries(collection)
                .sort(([, a], [, b]) => {
                    if (rarityOrder[b.rarity] !== rarityOrder[a.rarity]) {
                        return rarityOrder[b.rarity] - rarityOrder[a.rarity];
                    }
                    return b.value - a.value;
                });
            
            sortedCards.forEach(([cardName, cardInfo]) => {
                const cardElement = document.createElement('div');
                cardElement.className = 'collection-card';
                
                cardElement.innerHTML = `
                    <div class="collection-card-count">${cardInfo.count}</div>
                    <img src="${cardInfo.image}" alt="${cardName}" class="collection-card-image">
                    <div class="card-name">${cardName}</div>
                    <div class="card-rarity rarity-${cardInfo.rarity}">${capitalizeFirstLetter(cardInfo.rarity)}</div>
                    <div class="card-value">${cardInfo.value}</div>
                    <button class="sell-button" data-card="${cardName}">Verkaufen</button>
                `;
                
                collectionContainer.appendChild(cardElement);
                
                // Event Listener für Verkaufen-Button
                cardElement.querySelector('.sell-button').addEventListener('click', () => {
                    sellCard(cardName);
                });
            });
        }

        // Eine Karte verkaufen
        function sellCard(cardName) {
            const card = collection[cardName];
            
            if (card.count > 1) {
                card.count--;
            } else {
                delete collection[cardName];
            }
            
            credits += card.value;
            updateStats();
            updateCollection();
            showInfoBanner(`${cardName} für ${card.value} Credits verkauft!`, 'success');
        }

        // Statistiken aktualisieren
        function updateStats() {
            creditsDisplay.textContent = credits;
            
            let totalCards = 0;
            let totalValue = 0;
            
            Object.values(collection).forEach(card => {
                totalCards += card.count;
                totalValue += card.value * card.count;
            });
            
            cardsCountDisplay.textContent = totalCards;
            collectionValueDisplay.textContent = totalValue;
        }

        // Infobanner anzeigen
        function showInfoBanner(message, type) {
            infoBanner.textContent = message;
            infoBanner.className = 'info-banner show';
            
            if (type === 'error') {
                infoBanner.style.backgroundColor = '#f44336';
            } else {
                infoBanner.style.backgroundColor = '#4caf50';
            }
            
            setTimeout(() => {
                infoBanner.className = 'info-banner';
            }, 3000);
        }

        // Hilfsfunktion: Ersten Buchstaben groß schreiben
        function capitalizeFirstLetter(string) {
            return string.charAt(0).toUpperCase() + string.slice(1);
        }

        // Initialen Zustand aktualisieren
        updateStats();
        updateCollection();