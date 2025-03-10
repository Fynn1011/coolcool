        // Spielvariablen
        let money = 100;
        let reputation = 0;
        let packsOpened = 0;
        let cardsFound = 0;
        let collection = {};
        let purchasedUpgrades = {};
        
        // Pack-Typen
        const packTypes = [
            { 
                id: 'base', 
                name: 'Basis Set', 
                price: 10, 
                image: 'https://cdnjs.cloudflare.com/ajax/libs/foundicons/3.0.0/svgs/fi-shopping-bag.svg', 
                unlocked: true,
                rarityChances: { common: 0.7, uncommon: 0.2, rare: 0.08, ultraRare: 0.02, secretRare: 0.003 }
            },
            { 
                id: 'jungle', 
                name: 'Dschungel', 
                price: 25, 
                image: 'https://cdnjs.cloudflare.com/ajax/libs/foundicons/3.0.0/svgs/fi-trees.svg', 
                unlocked: false,
                rarityChances: { common: 0.65, uncommon: 0.22, rare: 0.1, ultraRare: 0.03, secretRare: 0.005 }
            },
            { 
                id: 'fossil', 
                name: 'Fossil', 
                price: 50, 
                image: 'https://cdnjs.cloudflare.com/ajax/libs/foundicons/3.0.0/svgs/fi-mountains.svg', 
                unlocked: false,
                rarityChances: { common: 0.6, uncommon: 0.25, rare: 0.11, ultraRare: 0.035, secretRare: 0.007 }
            },
            { 
                id: 'team-rocket', 
                name: 'Team Rocket', 
                price: 100, 
                image: 'https://cdnjs.cloudflare.com/ajax/libs/foundicons/3.0.0/svgs/fi-star.svg', 
                unlocked: false,
                rarityChances: { common: 0.55, uncommon: 0.25, rare: 0.13, ultraRare: 0.06, secretRare: 0.01 }
            },
            { 
                id: 'legendary', 
                name: 'Legendär', 
                price: 250, 
                image: 'https://cdnjs.cloudflare.com/ajax/libs/foundicons/3.0.0/svgs/fi-crown.svg', 
                unlocked: false,
                rarityChances: { common: 0.45, uncommon: 0.3, rare: 0.15, ultraRare: 0.08, secretRare: 0.02 }
            }
        ];
        
        // Upgrades
        const upgrades = [
            {
                id: 'auto-opener',
                name: 'Auto-Öffner',
                description: 'Öffnet automatisch ein Basis-Pack alle 10 Sekunden',
                baseCost: 50,
                level: 0,
                maxLevel: 5,
                effect: (level) => {
                    return 10 / (level + 1);
                }
            },
            {
                id: 'better-odds',
                name: 'Bessere Chancen',
                description: 'Erhöht die Chance auf seltene Karten',
                baseCost: 100,
                level: 0,
                maxLevel: 10,
                effect: (level) => {
                    return level * 0.02;
                }
            },
            {
                id: 'bulk-discount',
                name: 'Mengenrabatt',
                description: 'Reduziert die Kosten aller Packs',
                baseCost: 75,
                level: 0,
                maxLevel: 5,
                effect: (level) => {
                    return level * 0.05;
                }
            },
            {
                id: 'sell-bonus',
                name: 'Verkaufsbonus',
                description: 'Erhöht den Wert beim Verkauf von Karten',
                baseCost: 60,
                level: 0,
                maxLevel: 10,
                effect: (level) => {
                    return level * 0.1;
                }
            },
            {
                id: 'unlock-jungle',
                name: 'Dschungel freischalten',
                description: 'Schaltet Dschungel-Packs frei',
                baseCost: 200,
                level: 0,
                maxLevel: 1,
                effect: () => {
                    return 0;
                }
            },
            {
                id: 'unlock-fossil',
                name: 'Fossil freischalten',
                description: 'Schaltet Fossil-Packs frei',
                baseCost: 500,
                level: 0,
                maxLevel: 1,
                effect: () => {
                    return 0;
                }
            },
            {
                id: 'unlock-rocket',
                name: 'Team Rocket freischalten',
                description: 'Schaltet Team Rocket-Packs frei',
                baseCost: 1500,
                level: 0,
                maxLevel: 1,
                effect: () => {
                    return 0;
                }
            },
            {
                id: 'unlock-legendary',
                name: 'Legendär freischalten',
                description: 'Schaltet Legendäre Packs frei',
                baseCost: 5000,
                level: 0,
                maxLevel: 1,
                effect: () => {
                    return 0;
                }
            }
        ];
        
        // Erfolge
        const achievements = [
            {
                id: 'first-pack',
                name: 'Anfänger',
                description: 'Öffne dein erstes Pack',
                requirement: 1,
                progress: 0,
                unlocked: false,
                reward: 10,
                progressType: 'packs'
            },
            {
                id: 'pack-addict',
                name: 'Pack-Süchtiger',
                description: 'Öffne 50 Packs',
                requirement: 50,
                progress: 0,
                unlocked: false,
                reward: 100,
                progressType: 'packs'
            },
            {
                id: 'pack-master',
                name: 'Pack-Meister',
                description: 'Öffne 250 Packs',
                requirement: 250,
                progress: 0,
                unlocked: false,
                reward: 500,
                progressType: 'packs'
            },
            {
                id: 'first-rare',
                name: 'Glückspilz',
                description: 'Finde deine erste seltene Karte',
                requirement: 1,
                progress: 0,
                unlocked: false,
                reward: 20,
                progressType: 'rare'
            },
            {
                id: 'collector',
                name: 'Sammler',
                description: 'Finde 25 einzigartige Karten',
                requirement: 25,
                progress: 0,
                unlocked: false,
                reward: 50,
                progressType: 'collection'
            },
            {
                id: 'master-collector',
                name: 'Meistersammler',
                description: 'Finde 100 einzigartige Karten',
                requirement: 100,
                progress: 0,
                unlocked: false,
                reward: 500,
                progressType: 'collection'
            }
        ];
        
        // Kartenpool - eine Liste möglicher Karten für jeden Seltenheitsgrad
        const cardPool = {
            common: [
                { id: 1, name: 'Pikachu', rarity: 'common', baseValue: 2 },
                { id: 2, name: 'Bisasam', rarity: 'common', baseValue: 2 },
                { id: 3, name: 'Glumanda', rarity: 'common', baseValue: 2 },
                { id: 4, name: 'Schiggy', rarity: 'common', baseValue: 2 },
                { id: 5, name: 'Rattfratz', rarity: 'common', baseValue: 1 },
                { id: 6, name: 'Taubsi', rarity: 'common', baseValue: 1 },
                { id: 7, name: 'Raupy', rarity: 'common', baseValue: 1 },
                { id: 8, name: 'Hornliu', rarity: 'common', baseValue: 1 },
                { id: 9, name: 'Knofensa', rarity: 'common', baseValue: 1 },
                { id: 10, name: 'Smogon', rarity: 'common', baseValue: 1 },
                { id: 11, name: 'Menki', rarity: 'common', baseValue: 1 },
                { id: 12, name: 'Enton', rarity: 'common', baseValue: 1 },
                { id: 13, name: 'Machollo', rarity: 'common', baseValue: 1 },
                { id: 14, name: 'Nebulak', rarity: 'common', baseValue: 1 },
                { id: 15, name: 'Digda', rarity: 'common', baseValue: 1 },
                { id: 16, name: 'Fukano', rarity: 'common', baseValue: 1 },
                { id: 17, name: 'Abra', rarity: 'common', baseValue: 1 },
                { id: 18, name: 'Folipurba', rarity: 'common', baseValue: 1 },
                { id: 19, name: 'Sleima', rarity: 'common', baseValue: 1 },
                { id: 20, name: 'Muschas', rarity: 'common', baseValue: 1 },
                { id: 21, name: 'Kleinstein', rarity: 'common', baseValue: 1 },
                { id: 22, name: 'Mauzi', rarity: 'common', baseValue: 1 },
                { id: 23, name: 'Enton', rarity: 'common', baseValue: 1 },
                { id: 24, name: 'Magnetilo', rarity: 'common', baseValue: 1 },
                { id: 25, name: 'Porenta', rarity: 'common', baseValue: 1 },
                { id: 26, name: 'Jurob', rarity: 'common', baseValue: 1 },
                { id: 27, name: 'Krabby', rarity: 'common', baseValue: 1 },
                { id: 28, name: 'Voltobal', rarity: 'common', baseValue: 1 },
                { id: 29, name: 'Owei', rarity: 'common', baseValue: 1 },
                { id: 30, name: 'Traumato', rarity: 'common', baseValue: 1 }
            ],
            uncommon: [
                { id: 31, name: 'Pikachu (Holo)', rarity: 'uncommon', baseValue: 5 },
                { id: 32, name: 'Bisaknosp', rarity: 'uncommon', baseValue: 4 },
                { id: 33, name: 'Glutexo', rarity: 'uncommon', baseValue: 4 },
                { id: 34, name: 'Schillok', rarity: 'uncommon', baseValue: 4 },
                { id: 35, name: 'Rattikarl', rarity: 'uncommon', baseValue: 3 },
                { id: 36, name: 'Tauboga', rarity: 'uncommon', baseValue: 3 },
                { id: 37, name: 'Safcon', rarity: 'uncommon', baseValue: 3 },
                { id: 38, name: 'Kokuna', rarity: 'uncommon', baseValue: 3 },
                { id: 39, name: 'Knogga', rarity: 'uncommon', baseValue: 3 },
                { id: 40, name: 'Smogmog', rarity: 'uncommon', baseValue: 3 },
                { id: 41, name: 'Rasaff', rarity: 'uncommon', baseValue: 3 },
                { id: 42, name: 'Entoron', rarity: 'uncommon', baseValue: 3 },
                { id: 43, name: 'Maschock', rarity: 'uncommon', baseValue: 3 },
                { id: 44, name: 'Alpollo', rarity: 'uncommon', baseValue: 3 },
                { id: 45, name: 'Digdri', rarity: 'uncommon', baseValue: 3 },
                { id: 46, name: 'Arkani', rarity: 'uncommon', baseValue: 4 },
                { id: 47, name: 'Kadabra', rarity: 'uncommon', baseValue: 4 },
                { id: 48, name: 'Ponita', rarity: 'uncommon', baseValue: 3 },
                { id: 49, name: 'Flegmon', rarity: 'uncommon', baseValue: 3 },
                { id: 50, name: 'Magnetilo (Holo)', rarity: 'uncommon', baseValue: 5 }
            ],
            rare: [
                { id: 51, name: 'Bisaflor', rarity: 'rare', baseValue: 10 },
                { id: 52, name: 'Glurak', rarity: 'rare', baseValue: 12 },
                { id: 53, name: 'Turtok', rarity: 'rare', baseValue: 10 },
                { id: 54, name: 'Tauboss', rarity: 'rare', baseValue: 8 },
                { id: 55, name: 'Bibor', rarity: 'rare', baseValue: 8 },
                { id: 56, name: 'Machomei', rarity: 'rare', baseValue: 9 },
                { id: 57, name: 'Gengar', rarity: 'rare', baseValue: 12 },
                { id: 58, name: 'Onix', rarity: 'rare', baseValue: 8 },
                { id: 59, name: 'Lahmus', rarity: 'rare', baseValue: 8 },
                { id: 60, name: 'Garados', rarity: 'rare', baseValue: 12 },
                { id: 61, name: 'Lapras', rarity: 'rare', baseValue: 10 },
                { id: 62, name: 'Relaxo', rarity: 'rare', baseValue: 10 },
                { id: 63, name: 'Gallopa', rarity: 'rare', baseValue: 9 },
                { id: 64, name: 'Simsala', rarity: 'rare', baseValue: 12 },
                { id: 65, name: 'Magneton', rarity, rarity: 'rare', baseValue: 9 },
                { id: 66, name: 'Kokowei', rarity: 'rare', baseValue: 10 },
                { id: 67, name: 'Elektek', rarity: 'rare', baseValue: 9 },
                { id: 68, name: 'Magmar', rarity: 'rare', baseValue: 9 },
                { id: 69, name: 'Pinsir', rarity: 'rare', baseValue: 8 },
                { id: 70, name: 'Tauros', rarity: 'rare', baseValue: 8 }
            ],
            ultraRare: [
                { id: 71, name: 'Arktos', rarity: 'ultra-rare', baseValue: 25 },
                { id: 72, name: 'Zapdos', rarity: 'ultra-rare', baseValue: 25 },
                { id: 73, name: 'Lavados', rarity: 'ultra-rare', baseValue: 25 },
                { id: 74, name: 'Dragoran', rarity: 'ultra-rare', baseValue: 20 },
                { id: 75, name: 'Mewtu', rarity: 'ultra-rare', baseValue: 30 },
                { id: 76, name: 'Glurak (Holo)', rarity: 'ultra-rare', baseValue: 35 },
                { id: 77, name: 'Bisaflor (Holo)', rarity: 'ultra-rare', baseValue: 28 },
                { id: 78, name: 'Turtok (Holo)', rarity: 'ultra-rare', baseValue: 28 },
                { id: 79, name: 'Gengar (Holo)', rarity: 'ultra-rare', baseValue: 30 },
                { id: 80, name: 'Garados (Holo)', rarity: 'ultra-rare', baseValue: 30 }
            ],
            secretRare: [
                { id: 81, name: 'Mew', rarity: 'secret-rare', baseValue: 100 },
                { id: 82, name: 'Shiny Glurak', rarity: 'secret-rare', baseValue: 150 },
                { id: 83, name: 'Ancient Mew', rarity: 'secret-rare', baseValue: 200 },
                { id: 84, name: 'Gold Star Pikachu', rarity: 'secret-rare', baseValue: 250 },
                { id: 85, name: 'Shiny Mewtu', rarity: 'secret-rare', baseValue: 300 }
            ]
        };
        
        // DOM-Elemente abrufen
        const moneyDisplay = document.getElementById('money');
        const packsOpenedDisplay = document.getElementById('packs-opened');
        const cardsFoundDisplay = document.getElementById('cards-found');
        const reputationDisplay = document.getElementById('reputation');
        const packsContainer = document.getElementById('packs-container');
        const cardsDisplay = document.getElementById('cards-display');
        const upgradesContainer = document.getElementById('upgrades-container');
        const achievementsContainer = document.getElementById('achievements-container');
        const collectionGrid = document.getElementById('collection-grid');
        const collectionStats = document.getElementById('collection-stats');
        const sellAllBtn = document.getElementById('sell-all-btn');
        const tabs = document.querySelectorAll('.tab');
        const tabContents = document.querySelectorAll('.tab-content');
        const tutorialModal = document.getElementById('tutorial-modal');
        const closeBtn = document.querySelector('.close');
        const startBtn = document.getElementById('start-btn');
        
        // Timer für automatisches Öffnen
        let autoOpenTimer = null;
        
        // Funktion zum Aktualisieren der Anzeige
        function updateDisplay() {
            moneyDisplay.textContent = money.toFixed(0);
            packsOpenedDisplay.textContent = packsOpened;
            cardsFoundDisplay.textContent = `${Object.keys(collection).length}/150`;
            reputationDisplay.textContent = reputation.toFixed(0);
            collectionStats.textContent = `${Object.keys(collection).length}/150 Karten gesammelt`;
            
            // Aktualisiere Erfolge
            updateAchievements();
        }
        
        // Funktion zum Erstellen von Packs
        function renderPacks() {
            packsContainer.innerHTML = '';
            packTypes.forEach(pack => {
                if (pack.unlocked) {
                    const packElem = document.createElement('div');
                    packElem.className = 'pack';
                    packElem.innerHTML = `
                        <img src="${pack.image}" alt="${pack.name}">
                        <div class="pack-name">${pack.name}</div>
                        <div class="pack-price">${getPackPrice(pack)} €</div>
                    `;
                    packElem.addEventListener('click', () => buyPack(pack));
                    packsContainer.appendChild(packElem);
                }
            });
        }
        
        // Funktion zum Berechnen des Packpreises mit Rabatten
        function getPackPrice(pack) {
            let discount = 0;
            if (purchasedUpgrades['bulk-discount']) {
                discount = upgrades.find(u => u.id === 'bulk-discount').effect(purchasedUpgrades['bulk-discount']);
            }
            return Math.round(pack.price * (1 - discount));
        }
        
        // Funktion zum Kaufen eines Packs
        function buyPack(pack) {
            const price = getPackPrice(pack);
            if (money >= price) {
                money -= price;
                openPack(pack);
                updateDisplay();
            } else {
                // Nicht genug Geld
                moneyDisplay.parentElement.classList.add('shake');
                setTimeout(() => {
                    moneyDisplay.parentElement.classList.remove('shake');
                }, 500);
            }
        }
        
        // Funktion zum Öffnen eines Packs
        function openPack(pack) {
            packsOpened++;
            updateAchievement('packs');
            
            cardsDisplay.innerHTML = '';
            
            // Generiere 5 Karten basierend auf Seltenheitsverteilung
            for (let i = 0; i < 5; i++) {
                const card = getRandomCard(pack);
                const cardElem = document.createElement('div');
                cardElem.className = `card`;
                cardElem.innerHTML = `
                    <div class="card-front">
                        <img src="/api/placeholder/80/100" alt="Kartenrückseite">
                    </div>
                    <div class="card-back ${card.rarity}">
                        <div class="card-name">${card.name}</div>
                        <div class="card-rarity">${getRarityName(card.rarity)}</div>
                        <div>${getCardValue(card)} €</div>
                    </div>
                `;
                
                cardsDisplay.appendChild(cardElem);
                
                // Verzögerte Animation für das Umdrehen der Karten
                setTimeout(() => {
                    cardElem.classList.add('flipped');
                }, 500 + i * 300);
                
                // Karte zur Sammlung hinzufügen
                addToCollection(card);
            }
        }
        
        // Funktion zum Abrufen einer zufälligen Karte basierend auf der Seltenheitsverteilung
        function getRandomCard(pack) {
            let bonusChance = 0;
            if (purchasedUpgrades['better-odds']) {
                bonusChance = upgrades.find(u => u.id === 'better-odds').effect(purchasedUpgrades['better-odds']);
            }
            
            const rand = Math.random();
            let rarityPool;
            
            // Erhöhe die Chancen für seltenere Karten basierend auf dem Bonus
            const chances = { ...pack.rarityChances };
            chances.secretRare += bonusChance;
            chances.ultraRare += bonusChance;
            chances.rare += bonusChance;
            
            if (rand < chances.secretRare) {
                rarityPool = cardPool.secretRare;
                updateAchievement('rare');
            } else if (rand < chances.secretRare + chances.ultraRare) {
                rarityPool = cardPool.ultraRare;
                updateAchievement('rare');
            } else if (rand < chances.secretRare + chances.ultraRare + chances.rare) {
                rarityPool = cardPool.rare;
                updateAchievement('rare');
            } else if (rand < chances.secretRare + chances.ultraRare + chances.rare + chances.uncommon) {
                rarityPool = cardPool.uncommon;
            } else {
                rarityPool = cardPool.common;
            }
            
            return rarityPool[Math.floor(Math.random() * rarityPool.length)];
        }
        
        // Funktion zum Hinzufügen einer Karte zur Sammlung
        function addToCollection(card) {
            if (collection[card.id]) {
                collection[card.id].quantity++;
            } else {
                collection[card.id] = {
                    ...card,
                    quantity: 1
                };
                // Aktualisiere den Erfolgsfortschritt für die Sammlung
                updateAchievement('collection');
            }
            
            renderCollection();
        }
        
        // Funktion zum Anzeigen der Sammlung
        function renderCollection() {
            collectionGrid.innerHTML = '';
            
            // Sortiere nach ID
            const sortedCards = Object.values(collection).sort((a, b) => a.id - b.id);
            
            sortedCards.forEach(card => {
                const cardElem = document.createElement('div');
                cardElem.className = `collection-card ${card.rarity}`;
                cardElem.innerHTML = `
                    <div class="card-name">${card.name}</div>
                    <div class="card-rarity">${getRarityName(card.rarity)}</div>
                    <div>Wert: ${getCardValue(card)} €</div>
                    <div>Anzahl: ${card.quantity}</div>
                    ${card.quantity > 1 ? `<button class="sell-btn" data-id="${card.id}">Verkaufen (${getCardValue(card)} €)</button>` : ''}
                `;
                
                collectionGrid.appendChild(cardElem);
            });
            
            // Event-Listener für Verkaufsbuttons
            document.querySelectorAll('.sell-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const cardId = parseInt(btn.getAttribute('data-id'));
                    sellCard(cardId);
                });
            });
        }
        
        // Funktion zum Verkaufen einer Karte
        function sellCard(cardId) {
            const card = collection[cardId];
            if (card && card.quantity > 1) {
                const value = getCardValue(card);
                money += value;
                card.quantity--;
                
                reputation += value * 0.1;
                
                renderCollection();
                updateDisplay();
            }
        }
        
        // Funktion zum Verkaufen aller Duplikate
        function sellAllDuplicates() {
            let totalValue = 0;
            
            Object.values(collection).forEach(card => {
                if (card.quantity > 1) {
                    const value = getCardValue(card) * (card.quantity - 1);
                    totalValue += value;
                    card.quantity = 1;
                }
            });
            
            if (totalValue > 0) {
                money += totalValue;
                reputation += totalValue * 0.1;
                renderCollection();
                updateDisplay();
                
                alert(`Du hast alle Duplikate für ${totalValue.toFixed(0)} € verkauft!`);
            } else {
                alert('Du hast keine Duplikate zum Verkaufen!');
            }
        }
        
        // Funktion zum Berechnen des Kartenwertes (mit Verkaufsbonus)
        function getCardValue(card) {
            let bonus = 1;
            if (purchasedUpgrades['sell-bonus']) {
                bonus = 1 + upgrades.find(u => u.id === 'sell-bonus').effect(purchasedUpgrades['sell-bonus']);
            }
            return Math.round(card.baseValue * bonus);
        }
        
        // Funktion zum Anzeigen von Rarität in deutscher Sprache
        function getRarityName(rarity) {
            const rarityNames = {
                'common': 'Gewöhnlich',
                'uncommon': 'Ungewöhnlich',
                'rare': 'Selten',
                'ultra-rare': 'Ultra Selten',
                'secret-rare': 'Geheim Selten'
            };
            
            return rarityNames[rarity] || rarity;
        }
        
        // Funktion zum Rendern der Upgrades
        function renderUpgrades() {
            upgradesContainer.innerHTML = '';
            
            upgrades.forEach(upgrade => {
                const currentLevel = purchasedUpgrades[upgrade.id] || 0;
                
                // Prüfe, ob das Upgrade sichtbar sein soll
                let isVisible = true;
                
                // Verstecke Freischaltungs-Upgrades für Packs, die bereits freigeschaltet sind
                if (upgrade.id === 'unlock-jungle' && packTypes.find(p => p.id === 'jungle').unlocked) {
                    isVisible = false;
                } else if (upgrade.id === 'unlock-fossil' && packTypes.find(p => p.id === 'fossil').unlocked) {
                    isVisible = false;
                } else if (upgrade.id === 'unlock-rocket' && packTypes.find(p => p.id === 'team-rocket').unlocked) {
                    isVisible = false;
                } else if (upgrade.id === 'unlock-legendary' && packTypes.find(p => p.id === 'legendary').unlocked) {
                    isVisible = false;
                }
                
                // Zeige nur Upgrades, die noch nicht maximiert sind
                if (currentLevel < upgrade.maxLevel && isVisible) {
                    const cost = getUpgradeCost(upgrade, currentLevel);
                    
                    const upgradeElem = document.createElement('div');
                    upgradeElem.className = 'upgrade';
                    upgradeElem.innerHTML = `
                        <div class="upgrade-name">${upgrade.name}</div>
                        <div class="upgrade-desc">${upgrade.description}</div>
                        <div class="upgrade-cost">${cost} €</div>
                        <div>Level: ${currentLevel}/${upgrade.maxLevel}</div>
                        <button class="upgrade-btn" data-id="${upgrade.id}" ${money < cost ? 'disabled' : ''}>Kaufen</button>
                    `;
                    
                    upgradesContainer.appendChild(upgradeElem);
                }
            });
            
            // Event-Listener für Upgrade-Buttons
            document.querySelectorAll('.upgrade-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const upgradeId = btn.getAttribute('data-id');
                    purchaseUpgrade(upgradeId);
                });
            });
        }
        
        // Funktion zum Berechnen der Upgrade-Kosten
        function getUpgradeCost(upgrade, level) {
            return Math.round(upgrade.baseCost * Math.pow(1.5, level));
        }
        
        // Funktion zum Kaufen eines Upgrades
        function purchaseUpgrade(upgradeId) {
            const upgrade = upgrades.find(u => u.id === upgradeId);
            const currentLevel = purchasedUpgrades[upgradeId] || 0;
            
            if (currentLevel < upgrade.maxLevel) {
                const cost = getUpgradeCost(upgrade, currentLevel);
                
                if (money >= cost) {
                    money -= cost;
                    purchasedUpgrades[upgradeId] = currentLevel + 1;
                    
                    // Handle special upgrades
                    if (upgradeId === 'unlock-jungle') {
                        packTypes.find(p => p.id === 'jungle').unlocked = true;
                        renderPacks();
                    } else if (upgradeId === 'unlock-fossil') {
                        packTypes.find(p => p.id === 'fossil').unlocked = true;
                        renderPacks();
                    } else if (upgradeId === 'unlock-rocket') {
                        packTypes.find(p => p.id === 'team-rocket').unlocked = true;
                        renderPacks();
                    } else if (upgradeId === 'unlock-legendary') {
                        packTypes.find(p => p.id === 'legendary').unlocked = true;
                        renderPacks();
                    } else if (upgradeId === 'auto-opener') {
                        setupAutoOpener();
                    }
                    
                    renderUpgrades();
                    updateDisplay();
                } else {
                    // Nicht genug Geld
                    moneyDisplay.parentElement.classList.add('shake');
                    setTimeout(() => {
                        moneyDisplay.parentElement.classList.remove('shake');
                    }, 500);
                }
            }
        }
        
        // Funktion zum Einrichten des automatischen Öffners
        function setupAutoOpener() {
            if (autoOpenTimer) {
                clearInterval(autoOpenTimer);
            }
            
            const level = purchasedUpgrades['auto-opener'] || 0;
            if (level > 0) {
                const interval = upgrades.find(u => u.id === 'auto-opener').effect(level) * 1000;
                
                autoOpenTimer = setInterval(() => {
                    const basePack = packTypes.find(p => p.id === 'base');
                    if (money >= getPackPrice(basePack)) {
                        buyPack(basePack);
                    }
                }, interval);
            }
        }
        
        // Funktion zum Aktualisieren der Erfolge
        function updateAchievements() {
            achievementsContainer.innerHTML = '<h2>Erfolge</h2>';
            
            achievements.forEach(achievement => {
                const progressPercent = Math.min(100, (achievement.progress / achievement.requirement) * 100);
                
                const achievementElem = document.createElement('div');
                achievementElem.className = `achievement ${achievement.unlocked ? 'unlocked' : ''}`;
                achievementElem.innerHTML = `
                    <div class="achievement-icon">${achievement.unlocked ? '✓' : '?'}</div>
                    <div class="achievement-details">
                        <div class="achievement-name">${achievement.name}</div>
                        <div class="achievement-desc">${achievement.description}</div>
                        <div class="progress-bar">
                            <div class="progress" style="width: ${progressPercent}%"></div>
                        </div>
                        <div>${achievement.progress}/${achievement.requirement}</div>
                    </div>
                `;
                
                achievementsContainer.appendChild(achievementElem);
            });
        }
        
        // Funktion zum Aktualisieren des Fortschritts bei Erfolgen
        function updateAchievement(type) {
            achievements.forEach(achievement => {
                if (achievement.progressType === type) {
                    if (!achievement.unlocked) {
                        if (type === 'packs') {
                            achievement.progress = packsOpened;
                        } else if (type === 'collection') {
                            achievement.progress = Object.keys(collection).length;
                        } else if (type === 'rare' && type === 'rare') {
                            achievement.progress += 1;
                        }
                        
                        if (achievement.progress >= achievement.requirement) {
                            achievement.unlocked = true;
                            unlockAchievement(achievement);
                        }
                    }
                }
            });
        }
        
        // Funktion zum Freischalten eines Erfolgs
        function unlockAchievement(achievement) {
            money += achievement.reward;
            reputation += achievement.reward * 0.2;
            
            alert(`Erfolg freigeschaltet: ${achievement.name}!\nBelohnung: ${achievement.reward} €`);
        }
        
        // Tab-Wechsel-Funktion
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const tabId = tab.getAttribute('data-tab');
                
                tabs.forEach(t => t.classList.remove('active'));
                tabContents.forEach(c => c.classList.remove('active'));
                
                tab.classList.add('active');
                document.getElementById(`${tabId}-tab`).classList.add('active');
            });
        });
        
        // Event-Listener für den "Alle verkaufen"-Button
        sellAllBtn.addEventListener('click', sellAllDuplicates);
        
        // Tutorial-Modal schließen
        closeBtn.addEventListener('click', () => {
            tutorialModal.style.display = 'none';
        });
        
        startBtn.addEventListener('click', () => {
            tutorialModal.style.display = 'none';
        });
        
        // Spiel initialisieren
        function initGame() {
            renderPacks();
            renderUpgrades();
            updateAchievements();
            updateDisplay();
            
            // Tutorial anzeigen
            tutorialModal.style.display = 'flex';
            
            // Speichern/Laden einrichten
            setupSaveSystem();
        }
        
        // Speichersystem einrichten
        function setupSaveSystem() {
            // Automatisches Speichern alle 30 Sekunden
            setInterval(saveGame, 30000);
            
            // Spiel beim Start laden
            loadGame();
            
            // Speichern beim Verlassen der Seite
            window.addEventListener('beforeunload', saveGame);
        }
        
        // Spielstand speichern
        function saveGame() {
            const gameData = {
                money,
                reputation,
                packsOpened,
                collection,
                purchasedUpgrades,
                packTypes: packTypes.map(p => ({ id: p.id, unlocked: p.unlocked })),
                achievements
            };
            
            localStorage.setItem('pokemon-tycoon-save', JSON.stringify(gameData));
        }
        
        // Spielstand laden
        function loadGame() {
            const savedData = localStorage.getItem('pokemon-tycoon-save');
            
            if (savedData) {
                try {
                    const gameData = JSON.parse(savedData);
                    
                    money = gameData.money || 100;
                    reputation = gameData.reputation || 0;
                    packsOpened = gameData.packsOpened || 0;
                    collection = gameData.collection || {};
                    purchasedUpgrades = gameData.purchasedUpgrades || {};
                    
                    // Pack-Entsperrungen wiederherstellen
                    if (gameData.packTypes) {
                        gameData.packTypes.forEach(savedPack => {
                            const pack = packTypes.find(p => p.id === savedPack.id);
                            if (pack) {
                                pack.unlocked = savedPack.unlocked;
                            }
                        });
                    }
                    
                    // Erfolge wiederherstellen
                    if (gameData.achievements) {
                        gameData.achievements.forEach((savedAchievement, index) => {
                            if (index < achievements.length) {
                                achievements[index].progress = savedAchievement.progress || 0;
                                achievements[index].unlocked = savedAchievement.unlocked || false;
                            }
                        });
                    }
                    
                    // Auto-Opener neu einrichten, falls gekauft
                    setupAutoOpener();
                    
                    // UI aktualisieren
                    renderPacks();
                    renderCollection();
                    renderUpgrades();
                    updateDisplay();
                } catch (error) {
                    console.error('Fehler beim Laden des Spielstands:', error);
                }
            }
        }
        
        // Spiel starten
        initGame();