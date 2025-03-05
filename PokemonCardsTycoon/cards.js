// Diese Funktion erstellt ein SVG-Karten-Element basierend auf der Karte und ihrer Seltenheit
function createCardElement(cardName, rarity, value, imageUrl) {
    // Farben und Stile basierend auf der Seltenheit definieren
    const rarityStyles = {
        common: {
            gradient: 'linear-gradient(135deg, #b0b0b0 0%, #8a8a8a 100%)',
            symbols: '★☆☆☆☆',
            animation: false
        },
        uncommon: {
            gradient: 'linear-gradient(135deg, #6aba7f 0%, #2c8841 100%)',
            symbols: '★★☆☆☆',
            animation: false
        },
        rare: {
            gradient: 'linear-gradient(135deg, #5b9bd5 0%, #2a5b8b 100%)',
            symbols: '★★★☆☆',
            animation: true
        },
        epic: {
            gradient: 'linear-gradient(135deg, #b589d6 0%, #6a3890 100%)',
            symbols: '★★★★☆',
            animation: true
        },
        legendary: {
            gradient: 'linear-gradient(135deg, #ffcd3c 0%, #cd7f32 100%)',
            symbols: '★★★★★',
            animation: true
        }
    };

    // Seltenheit formatieren (erster Buchstabe großgeschrieben)
    const formattedRarity = rarity.charAt(0).toUpperCase() + rarity.slice(1);
    
    // Seltenheitsstil abrufen
    const style = rarityStyles[rarity] || rarityStyles.common;

    // SVG erstellen
    const cardSVG = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 250 350" class="card-svg">
        <!-- Card Border -->
        <rect x="5" y="5" width="240" height="340" rx="15" ry="15" fill="black" />
        
        <!-- Card Main Background -->
        <rect x="10" y="10" width="230" height="330" rx="12" ry="12" fill="${style.gradient}" class="card-background" />
        
        <!-- Card Header -->
        <rect x="20" y="20" width="210" height="40" rx="5" ry="5" fill="rgba(0,0,0,0.6)" />
        <text x="30" y="47" font-family="Arial, sans-serif" font-size="20" font-weight="bold" fill="white">${cardName}</text>
        
        <!-- Card Image Area -->
        <rect x="20" y="70" width="210" height="155" rx="5" ry="5" fill="white" fill-opacity="0.9" />
        
        <!-- Character image -->
        <image href="${imageUrl}" x="45" y="80" width="160" height="135" rx="5" ry="5" />
        
        <!-- Rarity Display -->
        <rect x="20" y="235" width="210" height="30" rx="5" ry="5" fill="rgba(0,0,0,0.6)" />
        <text x="125" y="256" font-family="Arial, sans-serif" font-size="16" font-weight="bold" fill="#ffd700" text-anchor="middle">${style.symbols} ${formattedRarity} ${style.symbols}</text>
        
        <!-- Value Display -->
        <rect x="20" y="275" width="210" height="55" rx="5" ry="5" fill="rgba(0,0,0,0.6)" />
        <text x="125" y="305" font-family="Arial, sans-serif" font-size="14" fill="white" text-anchor="middle">CARD VALUE</text>
        <text x="125" y="325" font-family="Arial, sans-serif" font-size="22" font-weight="bold" fill="#ffd700" text-anchor="middle">${value}</text>
        
        <!-- Decorative Elements -->
        <circle cx="30" cy="30" r="5" fill="#ffd700" />
        <circle cx="220" cy="30" r="5" fill="#ffd700" />
        <circle cx="30" cy="320" r="5" fill="#ffd700" />
        <circle cx="220" cy="320" r="5" fill="#ffd700" />
    </svg>`;

    // CSS für Karten-Glanz-Animation hinzufügen
    const cardAnimation = style.animation ? `
        <style>
            @keyframes shineEffect {
                0% { transform: translateX(-300%); }
                100% { transform: translateX(300%); }
            }
            .card-svg:hover .card-background::after {
                content: "";
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: linear-gradient(to right, 
                    rgba(255,255,255,0) 0%, 
                    rgba(255,255,255,0) 45%, 
                    rgba(255,255,255,0.4) 50%, 
                    rgba(255,255,255,0) 55%, 
                    rgba(255,255,255,0) 100%);
                animation: shineEffect 2s forwards;
            }
        </style>
    ` : '';

    // Card-Container mit SVG und Animation erstellen
    const container = document.createElement('div');
    container.className = 'card-container';
    container.style.position = 'relative';
    container.style.width = '200px';
    container.style.height = '280px';
    container.innerHTML = cardAnimation + cardSVG;

    return container;
}

// Diese Funktion aktualisiert die Animierte Kartenoffenbarung,
// um die neuen SVG-Karten zu verwenden
function updateCardRevealAnimation() {
    // Original-Funktion speichern
    const originalShowCardRevealAnimation = showCardRevealAnimation;
    
    // Überschreiben mit der neuen Implementierung
    showCardRevealAnimation = function() {
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
        
        // Neues SVG-Karten-Frontend erstellen
        const cardFront = document.createElement('div');
        cardFront.className = 'card-front';
        
        // SVG-Karte einfügen
        const svgCard = createCardElement(card.name, card.rarity, card.value, card.image);
        cardFront.appendChild(svgCard);
        
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
    };
}

// Aktualisiert die Sammlung, um die neuen SVG-Karten anzuzeigen
function updateCollectionWithSVGCards() {
    // Original-Funktion speichern
    const originalUpdateCollection = updateCollection;
    
    // Überschreiben mit der neuen Implementierung
    updateCollection = function() {
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
            
            // Zählmarke hinzufügen
            const countBadge = document.createElement('div');
            countBadge.className = 'collection-card-count';
            countBadge.textContent = cardInfo.count;
            cardElement.appendChild(countBadge);
            
            // SVG-Karte hinzufügen (skaliert)
            const svgCard = createCardElement(cardName, cardInfo.rarity, cardInfo.value, cardInfo.image);
            svgCard.style.transform = 'scale(0.7)';
            svgCard.style.transformOrigin = 'top center';
            cardElement.appendChild(svgCard);
            
            // Verkaufen-Button
            const sellButton = document.createElement('button');
            sellButton.className = 'sell-button';
            sellButton.textContent = 'Verkaufen';
            sellButton.setAttribute('data-card', cardName);
            sellButton.addEventListener('click', () => {
                sellCard(cardName);
            });
            
            cardElement.appendChild(sellButton);
            collectionContainer.appendChild(cardElement);
        });
    };
    
    // Erstmalig aufrufen um die Sammlung zu aktualisieren
    updateCollection();
}

// CSS für die neuen Karten hinzufügen
function addCardStyles() {
    const styleElement = document.createElement('style');
    styleElement.textContent = `
        .card-svg {
            width: 100%;
            height: 100%;
        }
        
        .collection-card {
            position: relative;
            height: 220px;
            width: 160px;
        }
        
        .collection-card .sell-button {
            position: absolute;
            bottom: 5px;
            left: 50%;
            transform: translateX(-50%);
        }
        
        .card-front .card-container {
            transform: scale(0.8);
            transform-origin: top center;
        }
    `;
    document.head.appendChild(styleElement);
}

// Diese Funktion initialisiert die neuen Kartendesigns
function initializeNewCardDesigns() {
    addCardStyles();
    updateCardRevealAnimation();
    updateCollectionWithSVGCards();
    console.log('Neue Kartendesigns wurden initialisiert!');
}

// Die Funktion beim Laden der Seite aufrufen
document.addEventListener('DOMContentLoaded', initializeNewCardDesigns);