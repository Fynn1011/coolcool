// Aktienmarkt-System für den Wahlkampfsimulator

// Globale Variablen für den Aktienmarkt
let stockMarket = {
    // Aktueller Marktzustand
    marketIndex: 10000,
    marketTrend: 0,
    economicCycle: "growth", // "growth", "peak", "recession", "recovery"
    economicCycleCounter: 0,
    volatility: 1.0,
    
    // Spielerdaten
    portfolio: {
        cash: 0,
        value: 0,
        stocks: {},
        totalReturn: 0,
        tradeHistory: []
    },
    
    // Aktien
    stocks: [
        {
            id: "tech1",
            name: "DigiTech AG",
            symbol: "DTC",
            category: "tech",
            price: 120,
            startPrice: 120,
            shares: 0,
            volatility: 1.8,
            riskLevel: "high",
            trend: 0.2,
            history: [],
            description: "Führendes Technologieunternehmen im Bereich künstliche Intelligenz und Datenanalyse."
        },
        {
            id: "tech2",
            name: "InnoSoft GmbH",
            symbol: "INS",
            category: "tech",
            price: 85,
            startPrice: 85,
            shares: 0,
            volatility: 1.5,
            riskLevel: "medium",
            trend: 0.15,
            history: [],
            description: "Softwareentwickler mit Fokus auf Unternehmensanwendungen und Cloud-Dienste."
        },
        {
            id: "finance1",
            name: "Deutsche Kapital",
            symbol: "DKP",
            category: "finance",
            price: 145,
            startPrice: 145,
            shares: 0,
            volatility: 1.2,
            riskLevel: "medium",
            trend: 0.05,
            history: [],
            description: "Traditionsreiche Bank mit starker Position im deutschen Markt und internationaler Präsenz."
        },
        {
            id: "finance2",
            name: "EuroInvest AG",
            symbol: "EIV",
            category: "finance",
            price: 75,
            startPrice: 75,
            shares: 0,
            volatility: 1.0,
            riskLevel: "low",
            trend: 0.03,
            history: [],
            description: "Finanzdienstleister mit Schwerpunkt auf Vermögensverwaltung und Investmentlösungen."
        },
        {
            id: "industry1",
            name: "Deutsche Industrie",
            symbol: "DIN",
            category: "industry",
            price: 180,
            startPrice: 180,
            shares: 0,
            volatility: 0.8,
            riskLevel: "low",
            trend: 0.02,
            history: [],
            description: "Traditioneller Mischkonzern mit Fokus auf Maschinenbau und Automobilzulieferung."
        },
        {
            id: "energy1",
            name: "GreenPower GmbH",
            symbol: "GPW",
            category: "energy",
            price: 65,
            startPrice: 65,
            shares: 0,
            volatility: 1.3,
            riskLevel: "medium",
            trend: 0.1,
            history: [],
            description: "Führender Anbieter erneuerbarer Energien mit starkem Wachstum im Bereich Solarenergie."
        },
        {
            id: "pharma1",
            name: "MediHealth AG",
            symbol: "MHG",
            category: "pharma",
            price: 210,
            startPrice: 210,
            shares: 0,
            volatility: 1.4,
            riskLevel: "medium",
            trend: 0.08,
            history: [],
            description: "Pharmaunternehmen mit breitem Portfolio an Medikamenten und starker Forschungsabteilung."
        },
        {
            id: "consumer1",
            name: "EuroKonsum AG",
            symbol: "EKA",
            category: "consumer",
            price: 95,
            startPrice: 95,
            shares: 0,
            volatility: 0.9,
            riskLevel: "low",
            trend: 0.04,
            history: [],
            description: "Marktführer im deutschen Einzelhandel mit expandierendem Online-Geschäft."
        }
    ],
    
    // Filterzustände
    filters: {
        category: "all",
        riskLevel: "all",
        search: "",
        owned: false
    }
};

// Initialisierungsfunktion für den Aktienmarkt
function initStockMarket() {
    // Aktienverlauf initialisieren
    stockMarket.stocks.forEach(stock => {
        // Erstelle einen initialen Preisverlauf für jede Aktie
        stock.history = [];
        for (let i = 0; i < 10; i++) {
            const variation = (Math.random() - 0.5) * stock.volatility * 2;
            const historicalPrice = stock.price * (1 + (variation / 100) * (i + 1));
            stock.history.push({
                day: -10 + i,
                price: Math.round(historicalPrice * 100) / 100
            });
        }
        // Aktuelle Preise als letzten Eintrag hinzufügen
        stock.history.push({
            day: 0,
            price: stock.price
        });
    });
    
    // Setze Portfolio-Cash auf aktuelles Budget (wird beim Öffnen des Aktienmarkts aktualisiert)
    stockMarket.portfolio.cash = 0;
    
    // Tab für den Aktienmarkt erstellen
    addStockMarketTab();
    
    // Event-Listener für Marktupdate
    document.addEventListener('marketUpdate', updateAllStockCards);
    
    // Log-Eintrag
    console.log("Aktienmarkt initialisiert");
}

// Funktion zum Hinzufügen des Aktienmarkt-Tabs
function addStockMarketTab() {
    // Prüfen, ob der Tab bereits existiert
    if (document.querySelector('.tab[data-tab="stocks"]')) {
        return;
    }
    
    // Tab zum Menü hinzufügen
    const tabsContainer = document.querySelector('.tabs');
    const stocksTab = document.createElement('div');
    stocksTab.className = 'tab';
    stocksTab.setAttribute('data-tab', 'stocks');
    stocksTab.setAttribute('onclick', 'changeTab("stocks")');
    stocksTab.textContent = 'Aktienmarkt';
    tabsContainer.appendChild(stocksTab);
    
    // Tab-Inhalt erstellen
    const tabContentContainer = document.querySelector('.tab-container');
    const stocksTabContent = document.createElement('div');
    stocksTabContent.className = 'tab-content';
    stocksTabContent.setAttribute('data-tab', 'stocks');
    
    stocksTabContent.innerHTML = `
        <div class="stock-market-panel">
            <div class="stock-market-header">
                <h3>Aktienmarkt</h3>
                <div class="market-index">
                    <span class="index-name">DAX:</span>
                    <span class="index-value">${formatMoney(stockMarket.marketIndex, false)}</span>
                    <span class="index-change change-neutral">0.00%</span>
                </div>
                <div class="economic-cycle">
                    <span class="cycle-label">Wirtschaftszyklus:</span>
                    <span class="cycle-value cycle-growth">Wachstum</span>
                </div>
            </div>
            
            <div class="portfolio-summary">
                <div class="portfolio-item">
                    <div class="portfolio-label">Verfügbares Kapital</div>
                    <div class="portfolio-value">${formatMoney(stockMarket.portfolio.cash)}</div>
                </div>
                <div class="portfolio-item">
                    <div class="portfolio-label">Portfolio-Wert</div>
                    <div class="portfolio-value">${formatMoney(stockMarket.portfolio.value)}</div>
                </div>
                <div class="portfolio-item">
                    <div class="portfolio-label">Rendite</div>
                    <div class="portfolio-value">
                        0.00%
                        <div class="portfolio-change change-neutral">0.00%</div>
                    </div>
                </div>
            </div>
            
            <div class="stock-market-controls">
                <div class="stock-filter">
                    <div class="filter-option selected" data-filter="all" onclick="filterStocks('category', 'all')">Alle</div>
                    <div class="filter-option" data-filter="tech" onclick="filterStocks('category', 'tech')">Technologie</div>
                    <div class="filter-option" data-filter="finance" onclick="filterStocks('category', 'finance')">Finanzen</div>
                    <div class="filter-option" data-filter="industry" onclick="filterStocks('category', 'industry')">Industrie</div>
                    <div class="filter-option" data-filter="energy" onclick="filterStocks('category', 'energy')">Energie</div>
                    <div class="filter-option" data-filter="pharma" onclick="filterStocks('category', 'pharma')">Pharma</div>
                    <div class="filter-option" data-filter="consumer" onclick="filterStocks('category', 'consumer')">Konsum</div>
                </div>
                
                <div class="stock-filter">
                    <div class="filter-option selected" data-filter="all" onclick="filterStocks('riskLevel', 'all')">Alle Risiken</div>
                    <div class="filter-option" data-filter="low" onclick="filterStocks('riskLevel', 'low')">Niedriges Risiko</div>
                    <div class="filter-option" data-filter="medium" onclick="filterStocks('riskLevel', 'medium')">Mittleres Risiko</div>
                    <div class="filter-option" data-filter="high" onclick="filterStocks('riskLevel', 'high')">Hohes Risiko</div>
                </div>
                
                <div class="stock-filter">
                    <div class="filter-option" data-filter="owned" onclick="toggleOwnedStocks()">Nur eigene Aktien</div>
                </div>
                
                <div class="stock-search">
                    <span class="search-icon">🔍</span>
                    <input type="text" placeholder="Aktie suchen..." oninput="searchStocks(this.value)">
                </div>
            </div>
            
            <div class="stock-list">
                <!-- Wird dynamisch mit Aktien gefüllt -->
            </div>
            
            <div class="trade-history">
                <div class="trade-history-header">
                    <h4 class="trade-history-title">Transaktionshistorie</h4>
                    <span class="trade-history-toggle" onclick="toggleTradeHistory()">Alle anzeigen</span>
                </div>
                <div class="trade-list">
                    <!-- Wird dynamisch mit Transaktionen gefüllt -->
                    <div class="trade-empty">Keine Transaktionen vorhanden.</div>
                </div>
            </div>
        </div>
    `;
    
    tabContentContainer.appendChild(stocksTabContent);
    
    // Aktien rendern
    renderStockList();
}

// Funktion zum Rendern der Aktienliste
function renderStockList() {
    const stockListElement = document.querySelector('.stock-list');
    if (!stockListElement) return;
    
    let stockCards = '';
    
    // Aktien filtern
    const filteredStocks = stockMarket.stocks.filter(stock => {
        // Kategorie-Filter
        if (stockMarket.filters.category !== 'all' && stock.category !== stockMarket.filters.category) {
            return false;
        }
        
        // Risiko-Filter
        if (stockMarket.filters.riskLevel !== 'all' && stock.riskLevel !== stockMarket.filters.riskLevel) {
            return false;
        }
        
        // Nur eigene Aktien
        if (stockMarket.filters.owned && stock.shares <= 0) {
            return false;
        }
        
        // Suche
        if (stockMarket.filters.search && 
            !stock.name.toLowerCase().includes(stockMarket.filters.search.toLowerCase()) && 
            !stock.symbol.toLowerCase().includes(stockMarket.filters.search.toLowerCase())) {
                return false;
            }
            
            return true;
        });
        
        // Sortieren nach Kategorie und Name
        filteredStocks.sort((a, b) => {
            if (a.category !== b.category) {
                return a.category.localeCompare(b.category);
            }
            return a.name.localeCompare(b.name);
        });
        
        filteredStocks.forEach(stock => {
            // Bestimme Trend-Klasse
            let trendClass = "trend-neutral";
            if (stock.trend > 0.05) {
                trendClass = "trend-up";
            } else if (stock.trend < -0.05) {
                trendClass = "trend-down";
            }
            
            // Berechne Preis-Änderung
            const priceChange = ((stock.price - stock.startPrice) / stock.startPrice) * 100;
            const priceChangeClass = priceChange >= 0 ? "change-positive" : "change-negative";
            
            // Berechne Gesamtwert der Anteile
            const totalValue = stock.shares * stock.price;
            
            // Erstelle HTML für Chart
            const chartSvg = createTrendChart(stock.history);
            
            // Bestimme Risiko-Klasse und Label
            const riskClass = `risk-${stock.riskLevel}`;
            const riskLabel = stock.riskLevel === 'high' ? 'Hoch' : (stock.riskLevel === 'medium' ? 'Mittel' : 'Niedrig');
            
            // Erstelle Aktienkarte
            stockCards += `
                <div class="stock-card ${stock.shares > 0 ? 'owned' : ''} ${stock.riskLevel}" data-id="${stock.id}">
                    ${stock.shares > 0 ? '<div class="owned-tag">Im Besitz</div>' : ''}
                    <div class="stock-header">
                        <div class="stock-icon stock-${stock.category}">${stock.symbol.substring(0, 2)}</div>
                        <div class="stock-info">
                            <div class="stock-name">${stock.name}
                                <span class="risk-label ${riskClass}">Risiko: ${riskLabel}</span>
                            </div>
                            <div class="stock-symbol">${stock.symbol}</div>
                        </div>
                    </div>
                    
                    <div class="stock-description">${stock.description}</div>
                    
                    <div class="stock-trend ${trendClass}">
                        ${chartSvg}
                    </div>
                    
                    <div class="stock-details">
                        <div class="stock-detail-item">
                            <div class="detail-label">Aktueller Kurs</div>
                            <div class="detail-value">${formatMoney(stock.price, false)}</div>
                        </div>
                        <div class="stock-detail-item">
                            <div class="detail-label">Veränderung</div>
                            <div class="detail-value ${priceChangeClass}">${priceChange.toFixed(2)}%</div>
                        </div>
                        <div class="stock-detail-item">
                            <div class="detail-label">Anteile</div>
                            <div class="detail-value">${stock.shares}</div>
                        </div>
                        <div class="stock-detail-item">
                            <div class="detail-label">Wert</div>
                            <div class="detail-value">${formatMoney(totalValue)}</div>
                        </div>
                    </div>
                    
                    <div class="stock-actions">
                        <button class="stock-btn buy-btn" onclick="showBuyModal('${stock.id}')">Kaufen</button>
                        <button class="stock-btn sell-btn" onclick="showSellModal('${stock.id}')" ${stock.shares > 0 ? '' : 'disabled'}>Verkaufen</button>
                    </div>
                </div>
            `;
        });
        
        // Wenn keine Aktien gefunden wurden
        if (filteredStocks.length === 0) {
            stockCards = `
                <div class="no-stocks-message">
                    <p>Keine Aktien gefunden, die den Filterkriterien entsprechen.</p>
                </div>
            `;
        }
        
        stockListElement.innerHTML = stockCards;
        
        // Animation für die Karten
        const cards = stockListElement.querySelectorAll('.stock-card');
        cards.forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('animated-item', 'fadeIn');
                card.style.animationDelay = `${index * 0.05}s`;
            }, 10);
        });
    }
    
    // Hilfsfunktion zum Erstellen eines Trend-Charts
    function createTrendChart(history) {
        if (!history || history.length === 0) return '';
        
        const width = 100;
        const height = 40;
        const padding = 2;
        
        // X und Y Werte ermitteln
        const xValues = history.map(point => point.day);
        const yValues = history.map(point => point.price);
        
        const minX = Math.min(...xValues);
        const maxX = Math.max(...xValues);
        const minY = Math.min(...yValues) * 0.95;
        const maxY = Math.max(...yValues) * 1.05;
        
        // Skalierungsfunktionen
        const scaleX = (x) => ((x - minX) / (maxX - minX)) * (width - padding * 2) + padding;
        const scaleY = (y) => height - (((y - minY) / (maxY - minY)) * (height - padding * 2) + padding);
        
        // Punkte für die Pfade generieren
        let pathPoints = '';
        let areaPoints = '';
        
        history.forEach((point, i) => {
            const x = scaleX(point.day);
            const y = scaleY(point.price);
            
            if (i === 0) {
                pathPoints += `M ${x},${y}`;
                areaPoints += `M ${x},${height} L ${x},${y}`;
            } else {
                pathPoints += ` L ${x},${y}`;
                areaPoints += ` L ${x},${y}`;
            }
            
            // Am Ende den Pfad zum Boden schließen für die Füllung
            if (i === history.length - 1) {
                areaPoints += ` L ${x},${height} Z`;
            }
        });
        
        return `
            <svg class="trend-chart" viewBox="0 0 ${width} ${height}" preserveAspectRatio="none">
                <path class="trend-fill" d="${areaPoints}"></path>
                <path class="trend-line" d="${pathPoints}"></path>
            </svg>
        `;
    }
    
    // Funktion zum Filtern der Aktien
    function filterStocks(filterType, value) {
        // Filter setzen
        stockMarket.filters[filterType] = value;
        
        // UI-Status aktualisieren
        const filterOptions = document.querySelectorAll(`.stock-filter .filter-option[data-filter]`);
        
        filterOptions.forEach(option => {
            const filterValue = option.getAttribute('data-filter');
            const filterGroup = option.closest('.stock-filter');
            
            // Prüfen, ob dieses Element zur aktuellen Filtergruppe gehört
            if (filterGroup && filterGroup.querySelector(`[data-filter="${value}"]`)) {
                if (filterValue === value) {
                    option.classList.add('selected');
                } else {
                    option.classList.remove('selected');
                }
            }
        });
        
        // Aktienliste neu rendern
        renderStockList();
    }
    
    // Funktion zum Umschalten des "Nur eigene Aktien" Filters
    function toggleOwnedStocks() {
        const newState = !stockMarket.filters.owned;
        stockMarket.filters.owned = newState;
        
        // UI aktualisieren
        const ownedFilter = document.querySelector('.filter-option[data-filter="owned"]');
        if (ownedFilter) {
            if (newState) {
                ownedFilter.classList.add('selected');
            } else {
                ownedFilter.classList.remove('selected');
            }
        }
        
        // Aktienliste neu rendern
        renderStockList();
    }
    
    // Funktion für die Aktiensuche
    function searchStocks(query) {
        stockMarket.filters.search = query.trim();
        renderStockList();
    }
    
    // Zeigt den Kaufmodal für eine Aktie an
    function showBuyModal(stockId) {
        const stock = stockMarket.stocks.find(s => s.id === stockId);
        if (!stock) return;
        
        // Prüfen, ob das Action-Modal bereits existiert
        let actionModal = document.getElementById('action-modal');
        
        if (!actionModal) {
            // Wenn nicht, ein neues Modal erstellen
            actionModal = document.createElement('div');
            actionModal.id = 'action-modal';
            actionModal.className = 'modal';
            
            const modalContent = document.createElement('div');
            modalContent.className = 'modal-content stock-modal-content';
            
            actionModal.appendChild(modalContent);
            document.body.appendChild(actionModal);
        }
        
        // Modal-Inhalt setzen
        const modalContent = actionModal.querySelector('.modal-content');
        
        const maxSharesToBuy = Math.floor(stockMarket.portfolio.cash / stock.price);
        
        modalContent.innerHTML = `
            <div class="modal-header">
                <h3>Aktien kaufen: ${stock.name} (${stock.symbol})</h3>
                <span class="close-btn" onclick="closeModals()">&times;</span>
            </div>
            
            <div class="stock-details">
                <div class="stock-detail-item">
                    <div class="detail-label">Aktueller Kurs</div>
                    <div class="detail-value">${formatMoney(stock.price, false)}</div>
                </div>
                <div class="stock-detail-item">
                    <div class="detail-label">Verfügbares Kapital</div>
                    <div class="detail-value">${formatMoney(stockMarket.portfolio.cash)}</div>
                </div>
                <div class="stock-detail-item">
                    <div class="detail-label">Max. kaufbare Anteile</div>
                    <div class="detail-value">${maxSharesToBuy}</div>
                </div>
            </div>
            
            <div class="transaction-form">
                <div class="amount-control">
                    <div class="amount-label">Anzahl:</div>
                    <div class="amount-input">
                        <button class="amount-btn" onclick="adjustShareAmount(-1, ${stock.price})">-</button>
                        <input type="number" id="shares-amount" class="amount-field" value="1" min="1" max="${maxSharesToBuy}" onchange="updateTransactionTotal(${stock.price})">
                        <button class="amount-btn" onclick="adjustShareAmount(1, ${stock.price})">+</button>
                    </div>
                </div>
                
                <div class="transaction-summary">
                    <div class="summary-row">
                        <div class="summary-label">Anteile:</div>
                        <div class="summary-value">1</div>
                    </div>
                    <div class="summary-row">
                        <div class="summary-label">Preis pro Anteil:</div>
                        <div class="summary-value">${formatMoney(stock.price)}</div>
                    </div>
                    <div class="summary-row summary-total">
                        <div class="summary-label">Gesamtbetrag:</div>
                        <div class="summary-value" id="transaction-total">${formatMoney(stock.price)}</div>
                    </div>
                </div>
                
                <div class="stock-history">
                    <div class="history-title">Kursverlauf</div>
                    <div class="history-chart">
                        ${createTrendChart(stock.history)}
                    </div>
                    <div class="history-stats">
                        <div>Höchster Kurs: ${formatMoney(Math.max(...stock.history.map(h => h.price)), false)}</div>
                        <div>Niedrigster Kurs: ${formatMoney(Math.min(...stock.history.map(h => h.price)), false)}</div>
                    </div>
                </div>
                
                <div style="margin-top: 1rem; display: flex; justify-content: space-between;">
                    <button class="action-btn" onclick="closeModals()">Abbrechen</button>
                    <button class="action-btn" onclick="buyStock('${stock.id}')" id="confirm-purchase-btn">Kaufen</button>
                </div>
            </div>
        `;
        
        // Modal anzeigen
        actionModal.style.display = 'flex';
        setTimeout(() => {
            actionModal.classList.add('show');
        }, 10);
    }
    
    // Zeigt den Verkaufsmodal für eine Aktie an
    function showSellModal(stockId) {
        const stock = stockMarket.stocks.find(s => s.id === stockId);
        if (!stock || stock.shares <= 0) return;
        
        // Prüfen, ob das Action-Modal bereits existiert
        let actionModal = document.getElementById('action-modal');
        
        if (!actionModal) {
            // Wenn nicht, ein neues Modal erstellen
            actionModal = document.createElement('div');
            actionModal.id = 'action-modal';
            actionModal.className = 'modal';
            
            const modalContent = document.createElement('div');
            modalContent.className = 'modal-content stock-modal-content';
            
            actionModal.appendChild(modalContent);
            document.body.appendChild(actionModal);
        }
        
        // Modal-Inhalt setzen
        const modalContent = actionModal.querySelector('.modal-content');
        
        modalContent.innerHTML = `
            <div class="modal-header">
                <h3>Aktien verkaufen: ${stock.name} (${stock.symbol})</h3>
                <span class="close-btn" onclick="closeModals()">&times;</span>
            </div>
            
            <div class="stock-details">
                <div class="stock-detail-item">
                    <div class="detail-label">Aktueller Kurs</div>
                    <div class="detail-value">${formatMoney(stock.price, false)}</div>
                </div>
                <div class="stock-detail-item">
                    <div class="detail-label">Anteile im Besitz</div>
                    <div class="detail-value">${stock.shares}</div>
                </div>
                <div class="stock-detail-item">
                    <div class="detail-label">Gesamtwert</div>
                    <div class="detail-value">${formatMoney(stock.shares * stock.price)}</div>
                </div>
            </div>
            
            <div class="transaction-form">
                <div class="amount-control">
                    <div class="amount-label">Anzahl:</div>
                    <div class="amount-input">
                        <button class="amount-btn" onclick="adjustShareAmount(-1, ${stock.price}, true)">-</button>
                        <input type="number" id="shares-amount" class="amount-field" value="1" min="1" max="${stock.shares}" onchange="updateTransactionTotal(${stock.price}, true)">
                        <button class="amount-btn" onclick="adjustShareAmount(1, ${stock.price}, true)">+</button>
                    </div>
                </div>
                
                <div class="transaction-summary">
                    <div class="summary-row">
                        <div class="summary-label">Anteile:</div>
                        <div class="summary-value">1</div>
                    </div>
                    <div class="summary-row">
                        <div class="summary-label">Preis pro Anteil:</div>
                        <div class="summary-value">${formatMoney(stock.price)}</div>
                    </div>
                    <div class="summary-row summary-total">
                        <div class="summary-label">Erlös:</div>
                        <div class="summary-value" id="transaction-total">${formatMoney(stock.price)}</div>
                    </div>
                </div>
                
                <div class="stock-history">
                    <div class="history-title">Kursverlauf</div>
                    <div class="history-chart">
                        ${createTrendChart(stock.history)}
                    </div>
                    <div class="history-stats">
                        <div>Höchster Kurs: ${formatMoney(Math.max(...stock.history.map(h => h.price)), false)}</div>
                        <div>Niedrigster Kurs: ${formatMoney(Math.min(...stock.history.map(h => h.price)), false)}</div>
                    </div>
                </div>
                
                <div style="margin-top: 1rem; display: flex; justify-content: space-between;">
                    <button class="action-btn" onclick="closeModals()">Abbrechen</button>
                    <button class="action-btn" onclick="sellStock('${stock.id}')" id="confirm-sale-btn">Verkaufen</button>
                </div>
            </div>
        `;
        
        // Modal anzeigen
        actionModal.style.display = 'flex';
        setTimeout(() => {
            actionModal.classList.add('show');
        }, 10);
    }
    
    // Hilfsfunktion zum Anpassen der Anzahl der Aktien im Kauf/Verkauf-Modal
    function adjustShareAmount(change, price, isSelling = false) {
        const amountInput = document.getElementById('shares-amount');
        if (!amountInput) return;
        
        let newValue = parseInt(amountInput.value) + change;
        
        // Grenzen festlegen
        const minValue = 1;
        const maxValue = isSelling ? 
            parseInt(amountInput.getAttribute('max')) : 
            Math.floor(stockMarket.portfolio.cash / price);
        
        // Sicherstellen, dass der Wert innerhalb der Grenzen liegt
        newValue = Math.max(minValue, Math.min(maxValue, newValue));
        
        // Neuen Wert setzen
        amountInput.value = newValue;
        
        // Gesamtbetrag aktualisieren
        updateTransactionTotal(price, isSelling);
    }
    
    // Aktualisiert den Gesamtbetrag im Kauf/Verkauf-Modal
    function updateTransactionTotal(price, isSelling = false) {
        const amountInput = document.getElementById('shares-amount');
        const totalElement = document.getElementById('transaction-total');
        if (!amountInput || !totalElement) return;
        
        const amount = parseInt(amountInput.value) || 0;
        const total = amount * price;
        
        // Begrenzungen anwenden
        if (!isSelling && total > stockMarket.portfolio.cash) {
            amountInput.value = Math.floor(stockMarket.portfolio.cash / price);
            updateTransactionTotal(price, isSelling);
            return;
        }
        
        // Zusammenfassung aktualisieren
        const summaryValue = document.querySelector('.summary-row .summary-value');
        if (summaryValue) {
            summaryValue.textContent = amount;
        }
        
        // Gesamtbetrag aktualisieren
        totalElement.textContent = formatMoney(total);
        
        // Kaufen/Verkaufen-Button aktivieren/deaktivieren
        const actionButton = document.getElementById(isSelling ? 'confirm-sale-btn' : 'confirm-purchase-btn');
        if (actionButton) {
            actionButton.disabled = amount <= 0;
        }
    }
    
    // Funktion zum Kaufen von Aktien
    function buyStock(stockId) {
        const stock = stockMarket.stocks.find(s => s.id === stockId);
        if (!stock) return;
        
        const amountInput = document.getElementById('shares-amount');
        if (!amountInput) return;
        
        const amount = parseInt(amountInput.value) || 0;
        if (amount <= 0) return;
        
        const total = amount * stock.price;
        
        // Prüfen, ob genügend Geld verfügbar ist
        if (total > stockMarket.portfolio.cash) {
            showNotification('Nicht genug Kapital für diesen Kauf!', 'error');
            return;
        }
        
        // Kauf durchführen
        stockMarket.portfolio.cash -= total;
        stock.shares += amount;
        
        // Transaktion zur Historie hinzufügen
        const transaction = {
            date: `${getMonthName(gameState.currentMonth)} ${gameState.currentYear}`,
            action: 'buy',
            stockId: stock.id,
            stockName: stock.name,
            symbol: stock.symbol,
            shares: amount,
            price: stock.price,
            total: total
        };
        
        stockMarket.portfolio.tradeHistory.unshift(transaction);
        
        // Portfolio-Wert aktualisieren
        updatePortfolioValue();
        
        // Benachrichtigung anzeigen
        showNotification(`${amount} Anteile von ${stock.name} erfolgreich gekauft!`, 'success');
        
        // Gamestate budget aktualisieren
        gameState.resources.budget = stockMarket.portfolio.cash;
        
        // Log-Eintrag hinzufügen
        addLogEntry(`Du hast ${amount} Anteile von ${stock.name} für ${formatMoney(total)} gekauft.`);
        
        // Modal schließen
        closeModals();
        
        // UI aktualisieren
        updateUI();
        renderStockList();
        renderTradeHistory();
    }
    
    // Funktion zum Verkaufen von Aktien
    function sellStock(stockId) {
        const stock = stockMarket.stocks.find(s => s.id === stockId);
        if (!stock) return;
        
        const amountInput = document.getElementById('shares-amount');
        if (!amountInput) return;
        
        const amount = parseInt(amountInput.value) || 0;
        if (amount <= 0 || amount > stock.shares) return;
        
        const total = amount * stock.price;
        
        // Verkauf durchführen
        stockMarket.portfolio.cash += total;
        stock.shares -= amount;
        
        // Transaktion zur Historie hinzufügen
        const transaction = {
            date: `${getMonthName(gameState.currentMonth)} ${gameState.currentYear}`,
            action: 'sell',
            stockId: stock.id,
            stockName: stock.name,
            symbol: stock.symbol,
            shares: amount,
            price: stock.price,
            total: total
        };
        
        stockMarket.portfolio.tradeHistory.unshift(transaction);
        
        // Portfolio-Wert aktualisieren
        updatePortfolioValue();
        
        // Benachrichtigung anzeigen
        showNotification(`${amount} Anteile von ${stock.name} erfolgreich verkauft!`, 'success');
        
        // Gamestate budget aktualisieren
        gameState.resources.budget = stockMarket.portfolio.cash;
        
        // Log-Eintrag hinzufügen
        addLogEntry(`Du hast ${amount} Anteile von ${stock.name} für ${formatMoney(total)} verkauft.`);
        
        // Modal schließen
        closeModals();
        
        // UI aktualisieren
        updateUI();
        renderStockList();
        renderTradeHistory();
    }
    
    // Aktualisiert den Gesamtwert des Portfolios
    function updatePortfolioValue() {
        let portfolioValue = 0;
        
        stockMarket.stocks.forEach(stock => {
            portfolioValue += stock.shares * stock.price;
        });
        
        stockMarket.portfolio.value = portfolioValue;
        
        // UI-Elemente aktualisieren
        const portfolioValueElement = document.querySelector('.portfolio-value');
        if (portfolioValueElement) {
            portfolioValueElement.textContent = formatMoney(portfolioValue);
        }
        
        // Rendite berechnen
        calculateReturn();
    }
    
    // Berechnet die Rendite des Portfolios
    function calculateReturn() {
        let investedAmount = 0;
        let currentValue = 0;
        
        // Berechnung auf Basis der Handelshistorie
        const buyTransactions = stockMarket.portfolio.tradeHistory.filter(t => t.action === 'buy');
        const sellTransactions = stockMarket.portfolio.tradeHistory.filter(t => t.action === 'sell');
        
        // Gekaufte Aktien
        buyTransactions.forEach(transaction => {
            investedAmount += transaction.total;
        });
        
        // Verkaufte Aktien
        sellTransactions.forEach(transaction => {
            investedAmount -= transaction.total;
        });
        
        // Aktueller Wert der gehaltenen Aktien
        currentValue = stockMarket.portfolio.value;
        
        // Wenn noch keine Investitionen getätigt wurden
        if (investedAmount === 0) {
            stockMarket.portfolio.totalReturn = 0;
            
            // UI aktualisieren
            const returnElement = document.querySelector('.portfolio-item:nth-child(3) .portfolio-value');
            if (returnElement) {
                returnElement.innerHTML = `0.00%<div class="portfolio-change change-neutral">0.00%</div>`;
            }
            
            return;
        }
        
        // Gesamtgewinn/-verlust
        const totalProfit = currentValue - investedAmount;
        
        // Rendite berechnen
        const returnRate = (totalProfit / investedAmount) * 100;
        stockMarket.portfolio.totalReturn = returnRate;
        
        // UI aktualisieren
        const returnElement = document.querySelector('.portfolio-item:nth-child(3) .portfolio-value');
        if (returnElement) {
            const changeClass = returnRate >= 0 ? 'change-positive' : 'change-negative';
            const sign = returnRate >= 0 ? '+' : '';
            
            returnElement.innerHTML = `
                ${returnRate.toFixed(2)}%
                <div class="portfolio-change ${changeClass}">${sign}${returnRate.toFixed(2)}%</div>
            `;
        }
    }
    
    // Rendert die Transaktionshistorie
    function renderTradeHistory() {
        const tradeList = document.querySelector('.trade-list');
        if (!tradeList) return;
        
        if (stockMarket.portfolio.tradeHistory.length === 0) {
            tradeList.innerHTML = '<div class="trade-empty">Keine Transaktionen vorhanden.</div>';
            return;
        }
        
        let tradeItems = '';
        
        // Begrenzen auf die letzten 5 Transaktionen für die Standardansicht
        const transactions = stockMarket.filters.showAllTrades ? 
            stockMarket.portfolio.tradeHistory : 
            stockMarket.portfolio.tradeHistory.slice(0, 5);
        
        transactions.forEach(transaction => {
            const actionClass = transaction.action === 'buy' ? 'trade-buy' : 'trade-sell';
            const actionText = transaction.action === 'buy' ? 'Kauf' : 'Verkauf';
            
            tradeItems += `
                <div class="trade-item">
                    <div class="trade-date">${transaction.date}</div>
                    <div class="trade-action ${actionClass}">${actionText}: ${transaction.stockName} (${transaction.symbol})</div>
                    <div class="trade-details">
                        ${transaction.shares} × ${formatMoney(transaction.price, false)} = ${formatMoney(transaction.total)}
                    </div>
                </div>
            `;
        });
        
        tradeList.innerHTML = tradeItems;
        
        // Toggle-Text aktualisieren
        const toggleElement = document.querySelector('.trade-history-toggle');
        if (toggleElement) {
            toggleElement.textContent = stockMarket.filters.showAllTrades ? 'Weniger anzeigen' : 'Alle anzeigen';
        }
    }
    
    // Umschalten zwischen kompakter und vollständiger Transaktionshistorie
    function toggleTradeHistory() {
        stockMarket.filters.showAllTrades = !stockMarket.filters.showAllTrades;
        renderTradeHistory();
    }
    
    // Aktualisiert alle Aktienkarten (wird bei Marktänderungen aufgerufen)
    function updateAllStockCards() {
        // Marktindex aktualisieren
        const indexValueElement = document.querySelector('.index-value');
        const indexChangeElement = document.querySelector('.index-change');
        
        if (indexValueElement) {
            indexValueElement.textContent = formatMoney(stockMarket.marketIndex, false);
        }
        
        if (indexChangeElement) {
            const changePercent = stockMarket.marketTrend;
            const changeClass = changePercent >= 0 ? 'change-positive' : 'change-negative';
            const sign = changePercent >= 0 ? '+' : '';
            
            indexChangeElement.textContent = `${sign}${changePercent.toFixed(2)}%`;
            indexChangeElement.className = `index-change ${changeClass}`;
        }
        
        // Wirtschaftszyklus aktualisieren
        const cycleValueElement = document.querySelector('.cycle-value');
        
        if (cycleValueElement) {
            let cycleText = '';
            let cycleClass = '';
            
            switch (stockMarket.economicCycle) {
                case 'growth':
                    cycleText = 'Wachstum';
                    cycleClass = 'cycle-growth';
                    break;
                case 'peak':
                    cycleText = 'Hochkonjunktur';
                    cycleClass = 'cycle-peak';
                    break;
                case 'recession':
                    cycleText = 'Rezession';
                    cycleClass = 'cycle-recession';
                    break;
                case 'recovery':
                    cycleText = 'Erholung';
                    cycleClass = 'cycle-recovery';
                    break;
            }
            
            cycleValueElement.textContent = cycleText;
            cycleValueElement.className= 'cycle-value ' + cycleClass;
        }
        
        // Portfolio Übersicht aktualisieren
        updatePortfolioValue();
        
        // Liste neu rendern
        renderStockList();
    }
    
    // Simuliert Marktveränderungen für einen Monat
    function simulateMarketChanges() {
        // Wirtschaftszyklus fortschreiten
        progressEconomicCycle();
        
        // Marktindex berechnen
        calculateMarketIndex();
        
        // Aktienpreise aktualisieren
        updateStockPrices();
        
        // Ein custom Event auslösen, um die UI zu aktualisieren
        const marketUpdateEvent = new CustomEvent('marketUpdate');
        document.dispatchEvent(marketUpdateEvent);
    }
    
    // Fortschritt des Wirtschaftszyklus simulieren
    function progressEconomicCycle() {
        // Zyklus-Counter erhöhen
        stockMarket.economicCycleCounter++;
        
        // Auf Basis des Counters den Zyklus ändern
        // Typischer Zyklus: Wachstum (8-12 Monate) -> Hochkonjunktur (3-6 Monate) -> Rezession (4-8 Monate) -> Erholung (4-10 Monate)
        switch (stockMarket.economicCycle) {
            case 'growth':
                // Wachstumsphase dauert typischerweise 8-12 Monate
                if (stockMarket.economicCycleCounter >= 8 + Math.floor(Math.random() * 5)) {
                    stockMarket.economicCycle = 'peak';
                    stockMarket.economicCycleCounter = 0;
                    addLogEntry("Wirtschaftslage: Die Konjunktur befindet sich nun auf einem Höchststand.");
                }
                break;
                
            case 'peak':
                // Hochkonjunktur dauert typischerweise 3-6 Monate
                if (stockMarket.economicCycleCounter >= 3 + Math.floor(Math.random() * 4)) {
                    stockMarket.economicCycle = 'recession';
                    stockMarket.economicCycleCounter = 0;
                    addLogEntry("Wirtschaftslage: Die Konjunktur kippt in eine Rezession.", true);
                }
                break;
                
            case 'recession':
                // Rezession dauert typischerweise 4-8 Monate
                if (stockMarket.economicCycleCounter >= 4 + Math.floor(Math.random() * 5)) {
                    stockMarket.economicCycle = 'recovery';
                    stockMarket.economicCycleCounter = 0;
                    addLogEntry("Wirtschaftslage: Die Wirtschaft beginnt sich zu erholen.");
                }
                break;
                
            case 'recovery':
                // Erholung dauert typischerweise 4-10 Monate
                if (stockMarket.economicCycleCounter >= 4 + Math.floor(Math.random() * 7)) {
                    stockMarket.economicCycle = 'growth';
                    stockMarket.economicCycleCounter = 0;
                    addLogEntry("Wirtschaftslage: Die Wirtschaft ist wieder in einer Wachstumsphase.");
                }
                break;
        }
        
        // Volatilität basierend auf dem Zyklus anpassen
        switch (stockMarket.economicCycle) {
            case 'growth':
                stockMarket.volatility = 0.8 + Math.random() * 0.4; // 0.8 - 1.2
                break;
            case 'peak':
                stockMarket.volatility = 0.7 + Math.random() * 0.3; // 0.7 - 1.0
                break;
            case 'recession':
                stockMarket.volatility = 1.3 + Math.random() * 0.7; // 1.3 - 2.0
                break;
            case 'recovery':
                stockMarket.volatility = 1.0 + Math.random() * 0.5; // 1.0 - 1.5
                break;
        }
    }
    
    // Berechnet den Marktindex auf Basis des Wirtschaftszyklus
    function calculateMarketIndex() {
        // Vorherigen Index für Trendberechnung speichern
        const previousIndex = stockMarket.marketIndex;
        
        // Basis-Änderung je nach Wirtschaftszyklus
        let baseChange = 0;
        switch (stockMarket.economicCycle) {
            case 'growth':
                baseChange = 0.5 + Math.random() * 1.5; // 0.5% - 2.0% Wachstum
                break;
            case 'peak':
                baseChange = -0.3 + Math.random() * 1.3; // -0.3% - 1.0% Wachstum/Stagnation
                break;
            case 'recession':
                baseChange = -2.0 + Math.random() * 1.5; // -2.0% - -0.5% Rückgang
                break;
            case 'recovery':
                baseChange = -0.5 + Math.random() * 1.5; // -0.5% - 1.0% Erholung
                break;
        }
        
        // Volatilität hinzufügen
        const volatilityFactor = (Math.random() - 0.5) * stockMarket.volatility * 2;
        const totalChange = baseChange + volatilityFactor;
        
        // Neuen Index berechnen
        stockMarket.marketIndex = Math.max(5000, stockMarket.marketIndex * (1 + totalChange / 100));
        
        // Trend berechnen
        stockMarket.marketTrend = ((stockMarket.marketIndex / previousIndex) - 1) * 100;
    }
    
    // Aktualisiert die Aktienpreise basierend auf Marktbedingungen
    function updateStockPrices() {
        stockMarket.stocks.forEach(stock => {
            // Vorherigen Preis für Trendberechnung speichern
            const previousPrice = stock.price;
            
            // Basis-Änderung abhängig vom Markttrend und individueller Aktienvolatilität
            const marketInfluence = stockMarket.marketTrend * 0.7; // 70% vom Markttrend
            const stockSpecificChange = (Math.random() - 0.5) * stock.volatility * 5 * stockMarket.volatility;
            
            // Sektorenspezifische Faktoren
            let sectorFactor = 0;
            switch (stock.category) {
                case 'tech':
                    // Tech-Unternehmen wachsen stärker in Wachstums- und Erholungsphasen
                    if (stockMarket.economicCycle === 'growth' || stockMarket.economicCycle === 'recovery') {
                        sectorFactor = 0.5 + Math.random() * 1.0;
                    }
                    break;
                case 'finance':
                    // Finanzwerte reagieren stark auf Rezessionen
                    if (stockMarket.economicCycle === 'recession') {
                        sectorFactor = -1.0 - Math.random() * 1.0;
                    } else if (stockMarket.economicCycle === 'peak') {
                        sectorFactor = 0.5 + Math.random() * 0.5;
                    }
                    break;
                case 'industry':
                    // Industriewerte sind stabiler, leiden aber unter Rezessionen
                    if (stockMarket.economicCycle === 'recession') {
                        sectorFactor = -0.7 - Math.random() * 0.5;
                    }
                    break;
                case 'energy':
                    // Energiewerte sind volatiler
                    sectorFactor = (Math.random() - 0.5) * 2.0;
                    break;
                case 'pharma':
                    // Pharmawerte sind weniger konjunkturabhängig
                    sectorFactor = (Math.random() - 0.3) * 1.2;
                    break;
                case 'consumer':
                    // Konsumwerte leiden unter Rezessionen
                    if (stockMarket.economicCycle === 'recession') {
                        sectorFactor = -0.8 - Math.random() * 0.5;
                    }
                    break;
            }
            
            // Gesamtänderung berechnen
            const totalChange = marketInfluence + stockSpecificChange + sectorFactor;
            
            // Neuen Preis berechnen (mit Grenzen)
            const newPrice = Math.max(5, stock.price * (1 + totalChange / 100));
            stock.price = Math.round(newPrice * 100) / 100;
            
            // Trend aktualisieren
            stock.trend = ((stock.price / previousPrice) - 1) * 100;
            
            // Kurshistorie aktualisieren
            stock.history.push({
                day: stock.history.length,
                price: stock.price
            });
            
            // Historien auf 30 Einträge begrenzen
            if (stock.history.length > 30) {
                stock.history.shift();
            }
        });
    }
    
    // Aktiviert den Aktienmarkt-Tab
    function showStockMarketTab() {
        // Tab wechseln
        changeTab('stocks');
        
        // Cash mit aktuellem Budget abgleichen
        stockMarket.portfolio.cash = gameState.resources.budget;
        
        // UI aktualisieren
        updateStockMarketUI();
    }
    
    // Aktualisiert die Aktienmarkt-UI
    function updateStockMarketUI() {
        // Verfügbares Kapital anzeigen
        const cashElement = document.querySelector('.portfolio-item:first-child .portfolio-value');
        if (cashElement) {
            cashElement.textContent = formatMoney(stockMarket.portfolio.cash);
        }
        
        // Portfolio-Wert aktualisieren
        updatePortfolioValue();
        
        // Aktienliste aktualisieren
        renderStockList();
        
        // Handelshistorie aktualisieren
        renderTradeHistory();
    }
    
    // Integration in das Hauptspiel
    
    // Funktion zum Initialisieren des Aktienmarkts
    function initializeStockMarket() {
        // CSS einbinden
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'stock-market.css';
        document.head.appendChild(link);
        
        // Aktienmarkt initialisieren
        initStockMarket();
        
        // Aktien-Button zum Hauptmenü hinzufügen
        addStockMarketButton();
        
        // Log-Eintrag
        addLogEntry("Der Aktienmarkt steht nun für Investitionen zur Verfügung.");
    }
    
    // Fügt einen Aktienmarkt-Button zum Hauptspiel hinzu
    function addStockMarketButton() {
        // Prüfen, ob der Button bereits existiert
        if (document.querySelector('.action-btn[data-action="stocks"]')) {
            return;
        }
        
        // Button erstellen und einfügen
        const actionsContainer = document.querySelector('.actions');
        if (actionsContainer) {
            const stockButton = document.createElement('button');
            stockButton.className = 'action-btn';
            stockButton.setAttribute('data-action', 'stocks');
            stockButton.setAttribute('onclick', 'showStockMarketTab()');
            stockButton.innerHTML = `
                Aktienmarkt 
                <span>${formatMoney(0)}</span>
            `;
            
            actionsContainer.appendChild(stockButton);
        }
    }
    
    // Überschreibt die nextTurn-Funktion, um Aktienbewegungen zu simulieren
    const originalNextTurn = window.nextTurn;
    window.nextTurn = function() {
        // Originalfunktion aufrufen
        originalNextTurn();
        
        // Aktienmarkt simulieren
        simulateMarketChanges();
        
        // Den Button aktualisieren, um den aktuellen Portfolio-Wert anzuzeigen
        const stockButton = document.querySelector('.action-btn[data-action="stocks"]');
        if (stockButton) {
            stockButton.querySelector('span').textContent = formatMoney(stockMarket.portfolio.value);
        }
    };
    
    // Event-Listener für die Initialisierung
    document.addEventListener('DOMContentLoaded', function() {
        // Verzögerung für die Initialisierung, um sicherzustellen, dass die Spieloberfläche geladen ist
        setTimeout(initializeStockMarket, 1000);
    });
    
    // Event-Listener für dynamisch hinzugefügte Tabs
    document.addEventListener('click', function(event) {
        // Prüfen, ob auf einen Tab geklickt wurde
        if (event.target.classList.contains('tab') && event.target.getAttribute('data-tab') === 'stocks') {
            // Portfolio-Cash auf das aktuelle Budget setzen
            stockMarket.portfolio.cash = gameState.resources.budget;
            
            // UI aktualisieren
            updateStockMarketUI();
        }
    });
    
    // Mit seltener Wahrscheinlichkeit besondere Marktbewegungen auslösen
    function triggerSpecialMarketEvent() {
        // Nur mit 5% Wahrscheinlichkeit auslösen
        if (Math.random() > 0.05) return;
        
        // Mögliche Spezielereignisse
        const specialEvents = [
            {
                name: "Marktboom",
                description: "Ein unerwarteter Wirtschaftsboom lässt die Aktienkurse steigen!",
                effect: function() {
                    // Alle Aktien steigen um 5-15%
                    stockMarket.stocks.forEach(stock => {
                        const boost = 5 + Math.random() * 10;
                        stock.price *= (1 + boost / 100);
                        stock.price = Math.round(stock.price * 100) / 100;
                        stock.trend = boost;
                    });
                    
                    // Marktindex erhöhen
                    stockMarket.marketIndex *= 1.1;
                    stockMarket.marketTrend = 10;
                }
            },
            {
                name: "Marktcrash",
                description: "Ein plötzlicher Markteinbruch lässt die Aktienkurse fallen!",
                effect: function() {
                    // Alle Aktien fallen um 10-25%
                    stockMarket.stocks.forEach(stock => {
                        const drop = 10 + Math.random() * 15;
                        stock.price *= (1 - drop / 100);
                        stock.price = Math.round(stock.price * 100) / 100;
                        stock.trend = -drop;
                    });
                    
                    // Marktindex reduzieren
                    stockMarket.marketIndex *= 0.85;
                    stockMarket.marketTrend = -15;
                    
                    // Zyklus ändern
                    stockMarket.economicCycle = 'recession';
                    stockMarket.economicCycleCounter = 0;
                }
            },
            {
                name: "Tech-Blase",
                description: "Eine Blase im Technologiesektor ist geplatzt!",
                effect: function() {
                    // Tech-Aktien fallen stark, andere weniger
                    stockMarket.stocks.forEach(stock => {
                        if (stock.category === 'tech') {
                            const drop = 20 + Math.random() * 20;
                            stock.price *= (1 - drop / 100);
                            stock.trend = -drop;
                        } else {
                            const drop = 5 + Math.random() * 5;
                            stock.price *= (1 - drop / 100);
                            stock.trend = -drop;
                        }
                        stock.price = Math.round(stock.price * 100) / 100;
                    });
                    
                    // Marktindex reduzieren
                    stockMarket.marketIndex *= 0.92;
                    stockMarket.marketTrend = -8;
                }
            },
            {
                name: "Ölpreisschock",
                description: "Ein plötzlicher Anstieg der Ölpreise erschüttert die Märkte!",
                effect: function() {
                    // Energieaktien steigen, andere fallen
                    stockMarket.stocks.forEach(stock => {
                        if (stock.category === 'energy') {
                            const boost = 10 + Math.random() * 15;
                            stock.price *= (1 + boost / 100);
                            stock.trend = boost;
                        } else {
                            const drop = 3 + Math.random() * 7;
                            stock.price *= (1 - drop / 100);
                            stock.trend = -drop;
                        }
                        stock.price = Math.round(stock.price * 100) / 100;
                    });
                    
                    // Marktindex leicht reduzieren
                    stockMarket.marketIndex *= 0.96;
                    stockMarket.marketTrend = -4;
                }
            }
        ];
        
        // Zufälliges Ereignis auswählen
        const event = specialEvents[Math.floor(Math.random() * specialEvents.length)];
        
        // Ereignis anwenden
        event.effect();
        
        // Log-Eintrag und Benachrichtigung
        addLogEntry(`Wirtschaftsnachricht: ${event.description}`, true);
        showNotification(event.description, 'warning');
        
        // Event auslösen, um UI zu aktualisieren
        const marketUpdateEvent = new CustomEvent('marketUpdate');
        document.dispatchEvent(marketUpdateEvent);
    }
    
    // Funktion aufrufen, um spezielle Marktereignisse auszulösen (bei jedem Monatswechsel)
    const originalSimulateMarketChanges = simulateMarketChanges;
    simulateMarketChanges = function() {
        originalSimulateMarketChanges();
        triggerSpecialMarketEvent();
    };
    
    // Expertenmodus: Erweiterte Informationen und manuelle Steuerungsmöglichkeiten
    let expertMode = false;
    
    function toggleExpertMode() {
        expertMode = !expertMode;
        
        // UI aktualisieren
        updateExpertModeUI();
        
        // Benachrichtigung anzeigen
        showNotification(`Expertenmodus ${expertMode ? 'aktiviert' : 'deaktiviert'}`, 'info');
    }
    
    function updateExpertModeUI() {
        // Prüfen, ob der Aktienmarkt-Tab aktiv ist
        const stocksTab = document.querySelector('.tab-content[data-tab="stocks"]');
        if (!stocksTab || !stocksTab.classList.contains('active')) return;
        
        // Expert-Controls Container suchen oder erstellen
        let expertControls = document.querySelector('.expert-controls');
        
        if (expertMode) {
            // Controls erstellen, wenn sie noch nicht existieren
            if (!expertControls) {
                expertControls = document.createElement('div');
                expertControls.className = 'expert-controls';
                
                expertControls.innerHTML = `
                    <div class="expert-header">
                        <h4>Expertenanalyse</h4>
                        <button class="expert-toggle" onclick="toggleExpertMode()">Ausblenden</button>
                    </div>
                    
                    <div class="market-details">
                        <div class="market-detail-row">
                            <div class="detail-label">Wirtschaftszyklus:</div>
                            <div class="detail-value">${stockMarket.economicCycle} (Monat ${stockMarket.economicCycleCounter})</div>
                        </div>
                        <div class="market-detail-row">
                            <div class="detail-label">Marktvolatilität:</div>
                            <div class="detail-value">${(stockMarket.volatility * 100).toFixed(1)}%</div>
                        </div>
                        <div class="market-detail-row">
                            <div class="detail-label">Markttrend (30 Tage):</div>
                            <div class="detail-value trend-indicator">
                                <span class="trend-arrow ${stockMarket.marketTrend >= 0 ? 'up' : 'down'}">
                                    ${stockMarket.marketTrend >= 0 ? '↑' : '↓'}
                                </span>
                                ${Math.abs(stockMarket.marketTrend).toFixed(2)}%
                            </div>
                        </div>
                    </div>
                    
                    <div class="sector-performance">
                        <h5>Sektorperformance</h5>
                        <div class="sector-chart">
                            ${generateSectorPerformanceChart()}
                        </div>
                    </div>
                    
                    <div class="expert-actions">
                        <button class="action-btn small-btn" onclick="runMarketAnalysis()">Marktanalyse</button>
                        <button class="action-btn small-btn" onclick="showPortfolioAnalysis()">Portfolio-Analyse</button>
                    </div>
                `;
                
                // Einfügen nach den Filtern
                const stockMarketControls = document.querySelector('.stock-market-controls');
                if (stockMarketControls) {
                    stockMarketControls.after(expertControls);
                }
            }
        } else {
            // Controls entfernen, wenn sie existieren
            if (expertControls) {
                expertControls.remove();
            }
        }
    }
    
    // Generiert ein Chart zur Sektorperformance
    function generateSectorPerformanceChart() {
        // Performance pro Sektor berechnen
        const sectorPerformance = {
            tech: 0,
            finance: 0,
            industry: 0,
            energy: 0,
            pharma: 0,
            consumer: 0
        };
        
        // Anzahl Aktien pro Sektor
        const sectorCounts = {
            tech: 0,
            finance: 0,
            industry: 0,
            energy: 0,
            pharma: 0,
            consumer: 0
        };
        
        // Durchschnittliche Performance berechnen
        stockMarket.stocks.forEach(stock => {
            const performance = ((stock.price / stock.startPrice) - 1) * 100;
            sectorPerformance[stock.category] += performance;
            sectorCounts[stock.category]++;
        });
        
        // Durchschnitt berechnen
        Object.keys(sectorPerformance).forEach(sector => {
            if (sectorCounts[sector] > 0) {
                sectorPerformance[sector] /= sectorCounts[sector];
            }
        });
        
        // Sektoren nach Performance sortieren
        const sortedSectors = Object.keys(sectorPerformance).sort((a, b) => {
            return sectorPerformance[b] - sectorPerformance[a];
        });
        
        // Chart generieren
        let chartHTML = '<div class="sector-bars">';
        
        sortedSectors.forEach(sector => {
            const performance = sectorPerformance[sector];
            const width = Math.min(100, Math.max(1, Math.abs(performance) * 2));
            const direction = performance >= 0 ? 'positive' : 'negative';
            const sectorName = getSectorName(sector);
            
            chartHTML += `
                <div class="sector-row">
                    <div class="sector-name">${sectorName}</div>
                    <div class="sector-bar-container">
                        <div class="sector-bar ${direction}" style="width: ${width}%"></div>
                        <div class="sector-value">${performance.toFixed(1)}%</div>
                    </div>
                </div>
            `;
        });
        
        chartHTML += '</div>';
        return chartHTML;
    }
    
    // Gibt den deutschen Namen eines Sektors zurück
    function getSectorName(sector) {
        const names = {
            tech: 'Technologie',
            finance: 'Finanzen',
            industry: 'Industrie',
            energy: 'Energie',
            pharma: 'Pharma',
            consumer: 'Konsum'
        };
        
        return names[sector] || sector;
    }
    
    // Ausführliche Marktanalyse
    function runMarketAnalysis() {
        // Prüfen, ob das Modal bereits existiert
        let analysisModal = document.getElementById('analysis-modal');
        
        if (!analysisModal) {
            // Wenn nicht, ein neues Modal erstellen
            analysisModal = document.createElement('div');
            analysisModal.id = 'analysis-modal';
            analysisModal.className = 'modal';
            
            const modalContent = document.createElement('div');
            modalContent.className = 'modal-content analysis-modal-content';
            
            analysisModal.appendChild(modalContent);
            document.body.appendChild(analysisModal);
        }
        
        // Aktuelle Wirtschaftslage analysieren
        let economicOutlook = '';
        let investmentAdvice = '';
        
        switch (stockMarket.economicCycle) {
            case 'growth':
                economicOutlook = 'Die Wirtschaft befindet sich in einer stabilen Wachstumsphase. Unternehmensgewinne steigen moderat an, und die Verbraucherstimmung ist positiv.';
                investmentAdvice = 'In dieser Phase empfiehlt sich ein ausgewogenes Portfolio mit Schwerpunkt auf Wachstumswerten. Technologie- und Konsumaktien haben gute Aussichten.';
                break;
            case 'peak':
                economicOutlook = 'Die Wirtschaft hat ihren Höhepunkt erreicht. Die Gewinne sind hoch, aber es gibt Anzeichen für eine mögliche Abschwächung in den kommenden Monaten.';
                investmentAdvice = 'Vorsicht ist geboten. Eine teilweise Umschichtung in defensivere Werte wie Versorger und Pharma könnte sinnvoll sein. Liquidität aufbauen für kommende Kaufgelegenheiten.';
                break;
            case 'recession':
                economicOutlook = 'Die Wirtschaft befindet sich in einer Rezessionsphase. Unternehmensgewinne sinken, und die allgemeine Marktstimmung ist pessimistisch.';
                investmentAdvice = 'Defensive Werte bevorzugen und nach unterbewerteten Qualitätsaktien Ausschau halten. Diese Phase bietet oft gute Einstiegsmöglichkeiten für langfristige Investoren.';
                break;
            case 'recovery':
                economicOutlook = 'Die Wirtschaft erholt sich langsam. Frühindikatoren zeigen eine Verbesserung, aber die vollständige Erholung wird Zeit brauchen.';
                investmentAdvice = 'Zyklische Werte und Finanzaktien könnten in dieser Phase überdurchschnittlich profitieren. Eine schrittweise Erhöhung des Aktienanteils kann sinnvoll sein.';
                break;
        }
        
        // Top-Performer und Underperformer identifizieren
        const sortedByPerformance = [...stockMarket.stocks].sort((a, b) => {
            const perfA = ((a.price / a.startPrice) - 1) * 100;
            const perfB = ((b.price / b.startPrice) - 1) * 100;
            return perfB - perfA;
        });
        
        const topPerformers = sortedByPerformance.slice(0, 3);
        const underperformers = sortedByPerformance.slice(-3).reverse();
        
        // Modal-Inhalt setzen
        const modalContent = analysisModal.querySelector('.modal-content');
        
        modalContent.innerHTML = `
            <div class="modal-header">
                <h3>Marktanalyse</h3>
                <span class="close-btn" onclick="closeModals()">&times;</span>
            </div>
            
            <div class="analysis-section">
                <h4>Wirtschaftliche Lage</h4>
                <p>${economicOutlook}</p>
                
                <div class="analysis-indicators">
                    <div class="indicator">
                        <div class="indicator-label">Marktstimmung:</div>
                        <div class="indicator-value ${stockMarket.marketTrend >= 0 ? 'positive' : 'negative'}">
                            ${stockMarket.marketTrend >= 1 ? 'Optimistisch' : (stockMarket.marketTrend <= -1 ? 'Pessimistisch' : 'Neutral')}
                        </div>
                    </div>
                    <div class="indicator">
                        <div class="indicator-label">Volatilität:</div>
                        <div class="indicator-value ${stockMarket.volatility >= 1.2 ? 'negative' : (stockMarket.volatility <= 0.8 ? 'positive' : 'neutral')}">
                            ${stockMarket.volatility >= 1.2 ? 'Hoch' : (stockMarket.volatility <= 0.8 ? 'Niedrig' : 'Moderat')}
                        </div>
                    </div>
                    <div class="indicator">
                        <div class="indicator-label">Phase:</div>
                        <div class="indicator-value">
                            ${stockMarket.economicCycle === 'growth' ? 'Wachstum' : 
                              stockMarket.economicCycle === 'peak' ? 'Hochkonjunktur' : 
                              stockMarket.economicCycle === 'recession' ? 'Rezession' : 'Erholung'}
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="analysis-section">
                <h4>Anlagestrategie</h4>
                <p>${investmentAdvice}</p>
            </div>
            
            <div class="analysis-section">
                <h4>Top-Performer</h4>
                <div class="stock-performance-list">
                    ${topPerformers.map(stock => {
                        const performance = ((stock.price / stock.startPrice) - 1) * 100;
                        return `
                            <div class="performance-item">
                                <div class="performance-stock">
                                    <div class="stock-icon stock-${stock.category}">${stock.symbol.substring(0, 2)}</div>
                                    <div class="stock-name">${stock.name} <span class="stock-symbol">(${stock.symbol})</span></div></div>
                            <div class="performance-value positive">+${performance.toFixed(2)}%</div>
                        </div>
                    `;
                }).join('')}
            </div>
        </div>
        
        <div class="analysis-section">
            <h4>Underperformer</h4>
            <div class="stock-performance-list">
                ${underperformers.map(stock => {
                    const performance = ((stock.price / stock.startPrice) - 1) * 100;
                    return `
                        <div class="performance-item">
                            <div class="performance-stock">
                                <div class="stock-icon stock-${stock.category}">${stock.symbol.substring(0, 2)}</div>
                                <div class="stock-name">${stock.name} <span class="stock-symbol">(${stock.symbol})</span></div>
                            </div>
                            <div class="performance-value negative">${performance.toFixed(2)}%</div>
                        </div>
                    `;
                }).join('')}
            </div>
        </div>
        
        <div class="analysis-actions">
            <button class="action-btn" onclick="closeModals()">Schließen</button>
        </div>
    `;
    
    // Modal anzeigen
    analysisModal.style.display = 'flex';
    setTimeout(() => {
        analysisModal.classList.add('show');
    }, 10);
}

// Portfolio-Analyse anzeigen
function showPortfolioAnalysis() {
    // Prüfen, ob das Modal bereits existiert
    let analysisModal = document.getElementById('analysis-modal');
    
    if (!analysisModal) {
        // Wenn nicht, ein neues Modal erstellen
        analysisModal = document.createElement('div');
        analysisModal.id = 'analysis-modal';
        analysisModal.className = 'modal';
        
        const modalContent = document.createElement('div');
        modalContent.className = 'modal-content analysis-modal-content';
        
        analysisModal.appendChild(modalContent);
        document.body.appendChild(analysisModal);
    }
    
    // Portfolio-Zusammensetzung berechnen
    const portfolioComposition = {};
    let totalPortfolioValue = 0;
    
    stockMarket.stocks.forEach(stock => {
        if (stock.shares > 0) {
            const value = stock.shares * stock.price;
            totalPortfolioValue += value;
            
            if (!portfolioComposition[stock.category]) {
                portfolioComposition[stock.category] = 0;
            }
            
            portfolioComposition[stock.category] += value;
        }
    });
    
    // In Prozent umrechnen
    Object.keys(portfolioComposition).forEach(category => {
        portfolioComposition[category] = (portfolioComposition[category] / totalPortfolioValue) * 100;
    });
    
    // Gesamtperformance berechnen
    const totalInvested = stockMarket.portfolio.tradeHistory.reduce((sum, transaction) => {
        if (transaction.action === 'buy') return sum + transaction.total;
        if (transaction.action === 'sell') return sum - transaction.total;
        return sum;
    }, 0);
    
    const currentValue = stockMarket.portfolio.value;
    const totalReturn = totalInvested > 0 ? ((currentValue / totalInvested) - 1) * 100 : 0;
    
    // Aktuelle Positionen
    const positions = stockMarket.stocks.filter(stock => stock.shares > 0).map(stock => {
        const value = stock.shares * stock.price;
        const performance = ((stock.price / stock.startPrice) - 1) * 100;
        return {
            stock,
            value,
            performance,
            percentage: (value / totalPortfolioValue) * 100
        };
    });
    
    // Nach Wert sortieren
    positions.sort((a, b) => b.value - a.value);
    
    // Empfehlungen generieren
    let recommendations = [];
    
    // Diversifikationsempfehlung
    const categories = Object.keys(portfolioComposition);
    if (categories.length < 3 && totalPortfolioValue > 0) {
        recommendations.push({
            type: 'diversification',
            text: 'Ihr Portfolio ist stark konzentriert. Eine breitere Streuung über verschiedene Sektoren könnte das Risiko reduzieren.'
        });
    }
    
    // Empfehlung basierend auf Wirtschaftszyklus
    switch (stockMarket.economicCycle) {
        case 'growth':
            if (!portfolioComposition['tech'] || portfolioComposition['tech'] < 20) {
                recommendations.push({
                    type: 'sector',
                    text: 'In der aktuellen Wachstumsphase könnten Technologiewerte Ihr Portfolio stärken.'
                });
            }
            break;
        case 'peak':
            if ((!portfolioComposition['consumer'] || portfolioComposition['consumer'] < 15) && 
                (!portfolioComposition['pharma'] || portfolioComposition['pharma'] < 15)) {
                recommendations.push({
                    type: 'sector',
                    text: 'Vor dem möglichen Abschwung könnte eine Erhöhung der defensiven Sektoren wie Pharma und Konsumgüter sinnvoll sein.'
                });
            }
            break;
        case 'recession':
            if ((portfolioComposition['tech'] && portfolioComposition['tech'] > 30) || 
                (portfolioComposition['finance'] && portfolioComposition['finance'] > 30)) {
                recommendations.push({
                    type: 'sector',
                    text: 'In der Rezession könnte eine Reduzierung zyklischer Sektoren (Tech, Finanzen) zugunsten defensiver Werte Verluste begrenzen.'
                });
            }
            break;
        case 'recovery':
            if (!portfolioComposition['finance'] || portfolioComposition['finance'] < 15) {
                recommendations.push({
                    type: 'sector',
                    text: 'In der beginnenden Erholungsphase könnten Finanzwerte und zyklische Konsumgüter gut performen.'
                });
            }
            break;
    }
    
    // Cashempfehlung
    const cashPercentage = (stockMarket.portfolio.cash / (stockMarket.portfolio.cash + totalPortfolioValue)) * 100;
    if (stockMarket.economicCycle === 'peak' && cashPercentage < 20) {
        recommendations.push({
            type: 'cash',
            text: 'Vor einem möglichen Abschwung könnte es ratsam sein, mehr Liquidität aufzubauen, um später günstig einsteigen zu können.'
        });
    } else if (stockMarket.economicCycle === 'recession' && cashPercentage > 50) {
        recommendations.push({
            type: 'cash',
            text: 'Mit Ihrer hohen Liquidität könnten Sie die niedrigen Kurse in der Rezession für günstige Einstiege nutzen.'
        });
    }
    
    // Modal-Inhalt setzen
    const modalContent = analysisModal.querySelector('.modal-content');
    
    modalContent.innerHTML = `
        <div class="modal-header">
            <h3>Portfolio-Analyse</h3>
            <span class="close-btn" onclick="closeModals()">&times;</span>
        </div>
        
        <div class="analysis-section">
            <h4>Portfolio-Übersicht</h4>
            <div class="portfolio-summary-details">
                <div class="summary-detail">
                    <div class="detail-label">Gesamtwert:</div>
                    <div class="detail-value">${formatMoney(totalPortfolioValue)}</div>
                </div>
                <div class="summary-detail">
                    <div class="detail-label">Gesamtrendite:</div>
                    <div class="detail-value ${totalReturn >= 0 ? 'positive' : 'negative'}">${totalReturn.toFixed(2)}%</div>
                </div>
                <div class="summary-detail">
                    <div class="detail-label">Bargeldanteil:</div>
                    <div class="detail-value">${cashPercentage.toFixed(1)}%</div>
                </div>
            </div>
        </div>
        
        <div class="analysis-section">
            <h4>Sektorallokation</h4>
            ${Object.keys(portfolioComposition).length > 0 ? `
                <div class="sector-allocation">
                    ${Object.entries(portfolioComposition).map(([category, percentage]) => `
                        <div class="allocation-row">
                            <div class="allocation-label">${getSectorName(category)}</div>
                            <div class="allocation-bar-container">
                                <div class="allocation-bar" style="width: ${percentage}%"></div>
                                <div class="allocation-value">${percentage.toFixed(1)}%</div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            ` : '<p>Keine Aktien im Portfolio.</p>'}
        </div>
        
        <div class="analysis-section">
            <h4>Positionen</h4>
            ${positions.length > 0 ? `
                <div class="positions-list">
                    ${positions.map(position => `
                        <div class="position-item">
                            <div class="position-header">
                                <div class="position-stock">
                                    <div class="stock-icon stock-${position.stock.category}">${position.stock.symbol.substring(0, 2)}</div>
                                    <div class="stock-name">${position.stock.name}</div>
                                </div>
                                <div class="position-value">${formatMoney(position.value)} (${position.percentage.toFixed(1)}%)</div>
                            </div>
                            <div class="position-details">
                                <div class="position-detail">
                                    <span>Anteile: ${position.stock.shares}</span>
                                    <span>Kurs: ${formatMoney(position.stock.price, false)}</span>
                                    <span class="performance ${position.performance >= 0 ? 'positive' : 'negative'}">
                                        ${position.performance >= 0 ? '+' : ''}${position.performance.toFixed(2)}%
                                    </span>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            ` : '<p>Keine Aktien im Portfolio.</p>'}
        </div>
        
        ${recommendations.length > 0 ? `
            <div class="analysis-section">
                <h4>Empfehlungen</h4>
                <ul class="recommendations-list">
                    ${recommendations.map(rec => `
                        <li class="recommendation-item">
                            <div class="recommendation-icon ${rec.type}"></div>
                            <div class="recommendation-text">${rec.text}</div>
                        </li>
                    `).join('')}
                </ul>
            </div>
        ` : ''}
        
        <div class="analysis-actions">
            <button class="action-btn" onclick="closeModals()">Schließen</button>
            <button class="action-btn" onclick="printPortfolioReport()">Bericht exportieren</button>
        </div>
    `;
    
    // Modal anzeigen
    analysisModal.style.display = 'flex';
    setTimeout(() => {
        analysisModal.classList.add('show');
    }, 10);
}

// Export des Portfolio-Berichts (simuliert)
function printPortfolioReport() {
    showNotification('Portfolio-Bericht wird generiert...', 'info');
    
    setTimeout(() => {
        showNotification('Portfolio-Bericht exportiert!', 'success');
    }, 1500);
}

// Integration in den Spielspeicherstand
function saveStockMarketData() {
    // Speichere den Aktienmarkt-Zustand im gameState
    gameState.stockMarket = {
        marketIndex: stockMarket.marketIndex,
        marketTrend: stockMarket.marketTrend,
        economicCycle: stockMarket.economicCycle,
        economicCycleCounter: stockMarket.economicCycleCounter,
        volatility: stockMarket.volatility,
        
        portfolio: {
            value: stockMarket.portfolio.value,
            stocks: stockMarket.stocks.filter(s => s.shares > 0).map(s => ({
                id: s.id,
                shares: s.shares
            })),
            totalReturn: stockMarket.portfolio.totalReturn,
            tradeHistory: stockMarket.portfolio.tradeHistory
        },
        
        stocks: stockMarket.stocks.map(s => ({
            id: s.id,
            price: s.price,
            trend: s.trend,
            history: s.history
        }))
    };
}

function loadStockMarketData() {
    // Wenn Aktienmarktdaten im gameState vorhanden sind, lade sie
    if (gameState.stockMarket) {
        // Marktdaten übernehmen
        stockMarket.marketIndex = gameState.stockMarket.marketIndex;
        stockMarket.marketTrend = gameState.stockMarket.marketTrend;
        stockMarket.economicCycle = gameState.stockMarket.economicCycle;
        stockMarket.economicCycleCounter = gameState.stockMarket.economicCycleCounter;
        stockMarket.volatility = gameState.stockMarket.volatility;
        
        // Portfolio-Wert laden
        stockMarket.portfolio.value = gameState.stockMarket.portfolio.value;
        stockMarket.portfolio.totalReturn = gameState.stockMarket.portfolio.totalReturn;
        stockMarket.portfolio.tradeHistory = gameState.stockMarket.portfolio.tradeHistory;
        
        // Aktienpreise und -anteile aktualisieren
        gameState.stockMarket.stocks.forEach(savedStock => {
            const stock = stockMarket.stocks.find(s => s.id === savedStock.id);
            if (stock) {
                stock.price = savedStock.price;
                stock.trend = savedStock.trend;
                stock.history = savedStock.history;
            }
        });
        
        // Aktienanteile aktualisieren
        gameState.stockMarket.portfolio.stocks.forEach(ownedStock => {
            const stock = stockMarket.stocks.find(s => s.id === ownedStock.id);
            if (stock) {
                stock.shares = ownedStock.shares;
            }
        });
        
        // Cash-Wert mit Budget synchronisieren
        stockMarket.portfolio.cash = gameState.resources.budget;
    }
}

// Event-Listener für das Speichern des Spielstands
document.addEventListener('savegame', saveStockMarketData);
document.addEventListener('loadgame', loadStockMarketData);

// Erweiterte Spielintegrationen: Ereignisse und Missionen

// Aktienmarkt-bezogene Ereignisse
const stockMarketEvents = [
    {
        id: "market_boom",
        title: "Wirtschaftsboom",
        description: "Die Wirtschaft erlebt einen unerwarteten Aufschwung. Alle Aktienindizes steigen stark an. Wie möchtest du reagieren?",
        options: [
            {
                id: "invest_heavily",
                text: "Stark investieren (+500.000 €)",
                effect: function() {
                    // Zusätzliches Geld in den Aktienmarkt investieren
                    const investmentAmount = 500000;
                    if (gameState.resources.budget < investmentAmount) {
                        showNotification('Nicht genug Budget für diese Investition!', 'error');
                        return false;
                    }
                    
                    // Budget reduzieren
                    gameState.resources.budget -= investmentAmount;
                    stockMarket.portfolio.cash = gameState.resources.budget;
                    
                    // Aktien im Wert des investierten Betrags kaufen
                    const stocksToInvest = stockMarket.stocks.filter(s => s.category !== 'finance' && s.riskLevel !== 'high');
                    
                    if (stocksToInvest.length > 0) {
                        // Investiere gleichmäßig in alle ausgewählten Aktien
                        const amountPerStock = investmentAmount / stocksToInvest.length;
                        
                        stocksToInvest.forEach(stock => {
                            const sharesToBuy = Math.floor(amountPerStock / stock.price);
                            
                            if (sharesToBuy > 0) {
                                // Aktien kaufen
                                stock.shares += sharesToBuy;
                                
                                // Transaktion zur Historie hinzufügen
                                const transaction = {
                                    date: `${getMonthName(gameState.currentMonth)} ${gameState.currentYear}`,
                                    action: 'buy',
                                    stockId: stock.id,
                                    stockName: stock.name,
                                    symbol: stock.symbol,
                                    shares: sharesToBuy,
                                    price: stock.price,
                                    total: sharesToBuy * stock.price
                                };
                                
                                stockMarket.portfolio.tradeHistory.unshift(transaction);
                                
                                // Log-Eintrag
                                addLogEntry(`Du hast ${sharesToBuy} Anteile von ${stock.name} im Rahmen der Wirtschaftsboom-Investition gekauft.`);
                            }
                        });
                        
                        // Portfolio-Wert aktualisieren
                        updatePortfolioValue();
                    }
                    
                    // Bonus: Aktien steigen stärker
                    stockMarket.stocks.forEach(stock => {
                        const boost = 3 + Math.random() * 5;
                        stock.price *= (1 + boost / 100);
                        stock.price = Math.round(stock.price * 100) / 100;
                        stock.trend = boost;
                    });
                    
                    return true;
                }
            },
            {
                id: "invest_moderately",
                text: "Moderat investieren (+250.000 €)",
                effect: function() {
                    // Zusätzliches Geld in den Aktienmarkt investieren
                    const investmentAmount = 250000;
                    if (gameState.resources.budget < investmentAmount) {
                        showNotification('Nicht genug Budget für diese Investition!', 'error');
                        return false;
                    }
                    
                    // Budget reduzieren
                    gameState.resources.budget -= investmentAmount;
                    stockMarket.portfolio.cash = gameState.resources.budget;
                    
                    // Aktien im Wert des investierten Betrags kaufen
                    const stocksToInvest = stockMarket.stocks.filter(s => s.riskLevel === 'low');
                    
                    if (stocksToInvest.length > 0) {
                        // Investiere gleichmäßig in alle ausgewählten Aktien
                        const amountPerStock = investmentAmount / stocksToInvest.length;
                        
                        stocksToInvest.forEach(stock => {
                            const sharesToBuy = Math.floor(amountPerStock / stock.price);
                            
                            if (sharesToBuy > 0) {
                                // Aktien kaufen
                                stock.shares += sharesToBuy;
                                
                                // Transaktion zur Historie hinzufügen
                                const transaction = {
                                    date: `${getMonthName(gameState.currentMonth)} ${gameState.currentYear}`,
                                    action: 'buy',
                                    stockId: stock.id,
                                    stockName: stock.name,
                                    symbol: stock.symbol,
                                    shares: sharesToBuy,
                                    price: stock.price,
                                    total: sharesToBuy * stock.price
                                };
                                
                                stockMarket.portfolio.tradeHistory.unshift(transaction);
                                
                                // Log-Eintrag
                                addLogEntry(`Du hast ${sharesToBuy} Anteile von ${stock.name} im Rahmen der moderaten Investition gekauft.`);
                            }
                        });
                        
                        // Portfolio-Wert aktualisieren
                        updatePortfolioValue();
                    }
                    
                    // Bonus: Aktien steigen leicht
                    stockMarket.stocks.forEach(stock => {
                        const boost = 1 + Math.random() * 3;
                        stock.price *= (1 + boost / 100);
                        stock.price = Math.round(stock.price * 100) / 100;
                        stock.trend = boost;
                    });
                    
                    return true;
                }
            },
            {
                id: "ignore",
                text: "Nicht reagieren",
                effect: function() {
                    // Keine zusätzliche Aktion, normaler Markteffekt
                    stockMarket.stocks.forEach(stock => {
                        const boost = 0.5 + Math.random() * 2;
                        stock.price *= (1 + boost / 100);
                        stock.price = Math.round(stock.price * 100) / 100;
                        stock.trend = boost;
                    });
                    
                    return true;
                }
            }
        ]
    },
    {
        id: "market_crash",
        title: "Börsencrash",
        description: "Die Märkte erleben einen dramatischen Einbruch. Alle Aktienindizes fallen stark. Wie reagierst du?",
        options: [
            {
                id: "sell_all",
                text: "Alle Aktien verkaufen",
                effect: function() {
                    // Alle Aktien verkaufen
                    const ownedStocks = stockMarket.stocks.filter(s => s.shares > 0);
                    let totalSales = 0;
                    
                    ownedStocks.forEach(stock => {
                        const salesValue = stock.shares * stock.price;
                        totalSales += salesValue;
                        
                        // Transaktion zur Historie hinzufügen
                        const transaction = {
                            date: `${getMonthName(gameState.currentMonth)} ${gameState.currentYear}`,
                            action: 'sell',
                            stockId: stock.id,
                            stockName: stock.name,
                            symbol: stock.symbol,
                            shares: stock.shares,
                            price: stock.price,
                            total: salesValue
                        };
                        
                        stockMarket.portfolio.tradeHistory.unshift(transaction);
                        
                        // Anteile zurücksetzen
                        stock.shares = 0;
                    });
                    
                    // Budget erhöhen
                    gameState.resources.budget += totalSales;
                    stockMarket.portfolio.cash = gameState.resources.budget;
                    
                    // Portfolio-Wert aktualisieren
                    updatePortfolioValue();
                    
                    // Log-Eintrag
                    addLogEntry(`Du hast während des Börsencrashs alle Aktien im Wert von ${formatMoney(totalSales)} verkauft.`);
                    
                    // Aktien fallen stark
                    stockMarket.stocks.forEach(stock => {
                        const drop = 15 + Math.random() * 10;
                        stock.price *= (1 - drop / 100);
                        stock.price = Math.round(stock.price * 100) / 100;
                        stock.trend = -drop;
                    });
                    
                    return true;
                }
            },
            {
                id: "buy_opportunity",
                text: "Günstig nachkaufen (+200.000 €)",
                effect: function() {
                    // Zusätzliches Geld in den Aktienmarkt investieren
                    const investmentAmount = 200000;
                    if (gameState.resources.budget < investmentAmount) {
                        showNotification('Nicht genug Budget für diese Investition!', 'error');
                        return false;
                    }
                    
                    // Budget reduzieren
                    gameState.resources.budget -= investmentAmount;
                    stockMarket.portfolio.cash = gameState.resources.budget;
                    
                    // Aktien fallen stark
                    stockMarket.stocks.forEach(stock => {
                        const drop = 20 + Math.random() * 15;
                        stock.price *= (1 - drop / 100);
                        stock.price = Math.round(stock.price * 100) / 100;
                        stock.trend = -drop;
                    });
                    
                    // Nach dem Preisverfall in qualitativ hochwertige Aktien investieren
                    const qualityStocks = stockMarket.stocks.filter(s => s.riskLevel === 'low');
                    
                    if (qualityStocks.length > 0) {
                        // Investiere gleichmäßig in alle ausgewählten Aktien
                        const amountPerStock = investmentAmount / qualityStocks.length;
                        
                        qualityStocks.forEach(stock => {
                            const sharesToBuy = Math.floor(amountPerStock / stock.price);
                            
                            if (sharesToBuy > 0) {
                                // Aktien kaufen
                                stock.shares += sharesToBuy;
                                
                                // Transaktion zur Historie hinzufügen
                                const transaction = {
                                    date: `${getMonthName(gameState.currentMonth)} ${gameState.currentYear}`,
                                    action: 'buy',
                                    stockId: stock.id,
                                    stockName: stock.name,
                                    symbol: stock.symbol,
                                    shares: sharesToBuy,
                                    price: stock.price,
                                    total: sharesToBuy * stock.price
                                };
                                
                                stockMarket.portfolio.tradeHistory.unshift(transaction);
                                
                                // Log-Eintrag
                                addLogEntry(`Du hast ${sharesToBuy} Anteile von ${stock.name} während des Börsencrashs günstig gekauft.`);
                            }
                        });
                        
                        // Portfolio-Wert aktualisieren
                        updatePortfolioValue();
                    }
                    
                    return true;
                }
            },
            {
                id: "hold",
                text: "Halten und aussitzen",
                effect: function() {
                    // Aktien fallen, aber nicht ganz so stark
                    stockMarket.stocks.forEach(stock => {
                        const drop = 15 + Math.random() * 10;
                        stock.price *= (1 - drop / 100);
                        stock.price = Math.round(stock.price * 100) / 100;
                        stock.trend = -drop;
                    });
                    
                    // Log-Eintrag
                    addLogEntry("Du hast während des Börsencrashs deine Positionen gehalten.");
                    
                    return true;
                }
            }
        ]
    }
];

// Aktienmarkt-Ereignisse in die Hauptereignisliste einfügen
if (typeof events !== 'undefined') {
    events.push(...stockMarketEvents);
}

// Finale Funktionen für bessere Spielintegration

// Speichern der Aktienmarktdaten beim Speichern des Spiels
function saveGame() {
    // Vorhandene Speicherfunktion aufrufen, falls sie existiert
    if (typeof originalSaveGame === 'function') {
        originalSaveGame();
    }
    
    // Aktienmarktdaten speichern
    saveStockMarketData();
}

// Laden der Aktienmarktdaten beim Laden des Spiels
function loadGame() {
    // Vorhandene Ladefunktion aufrufen, falls sie existiert
    if (typeof originalLoadGame === 'function') {
        originalLoadGame();
    }
    
    // Aktienmarktdaten laden
    loadStockMarketData();
    
    // UI aktualisieren
    updateStockMarketUI();
}

// Ursprüngliche Funktionen speichern, wenn sie existieren
if (typeof window.saveGame === 'function') {
    const originalSaveGame = window.saveGame;
    window.saveGame = saveGame;
}

if (typeof window.loadGame === 'function') {
    const originalLoadGame = window.loadGame;
    window.loadGame = loadGame;
}

// Aktienmarkt in ein Hauptspiel-Event integrieren
function integrateStockMarketEvent() {
    // Ein spezielles Ereignis erstellen, das dem Spieler den Aktienmarkt vorstellt
    const stockMarketIntroEvent = {
        id: "stock_market_intro",
        title: "Finanzberater",
        description: "Ein erfahrener Finanzberater kontaktiert dich und bietet dir an, deine Wahlkampffinanzen durch Aktieninvestitionen zu verstärken. Er verspricht potenziell hohe Renditen, weist aber auch auf die damit verbundenen Risiken hin.",
        options: [
            {
                id: "accept",
                text: "Angebot annehmen und in den Aktienmarkt einsteigen",
                effect: function() {
                    // Aktienmarkt initialisieren, falls noch nicht geschehen
                    initializeStockMarket();
                    
                    // Zum Aktienmarkt-Tab wechseln
                    showStockMarketTab();
                    
                    // Tutorial anzeigen
                    showStockMarketTutorial();
                    
                    addLogEntry("Du hast beschlossen, in den Aktienmarkt zu investieren, um potenzielle zusätzliche Einnahmequellen für deinen Wahlkampf zu erschließen.");
                    
                    return true;
                }
            },
            {
                id: "reject",
                text: "Ablehnen und sich auf traditionelle Finanzierung konzentrieren",
                effect: function() {
                    // Log-Eintrag
                    addLogEntry("Du hast dich entschieden, nicht in den Aktienmarkt zu investieren und dich auf traditionelle Kampagnenfinanzierung zu konzentrieren.");
                    
                    return true;
                }
            }
        ]
    };
    
    // Event dem Spielsystem hinzufügen
    if (typeof events !== 'undefined') {events.push(stockMarketIntroEvent);
    }
}

// Aktienmarkt-Tutorial anzeigen
function showStockMarketTutorial() {
    // Prüfen, ob das Modal bereits existiert
    let tutorialModal = document.getElementById('tutorial-modal');
    
    if (!tutorialModal) {
        // Wenn nicht, ein neues Modal erstellen
        tutorialModal = document.createElement('div');
        tutorialModal.id = 'tutorial-modal';
        tutorialModal.className = 'modal';
        
        const modalContent = document.createElement('div');
        modalContent.className = 'modal-content tutorial-modal-content';
        
        tutorialModal.appendChild(modalContent);
        document.body.appendChild(tutorialModal);
    }
    
    // Modal-Inhalt setzen
    const modalContent = tutorialModal.querySelector('.modal-content');
    
    modalContent.innerHTML = `
        <div class="modal-header">
            <h3>Einführung in den Aktienmarkt</h3>
            <span class="close-btn" onclick="closeTutorial()">&times;</span>
        </div>
        
        <div class="tutorial-content">
            <div class="tutorial-step">
                <h4>1. Übersicht</h4>
                <p>
                    Der Aktienmarkt bietet dir die Möglichkeit, dein Wahlkampfbudget zu investieren und potenziell zu vermehren.
                    Du kannst Aktien verschiedener Unternehmen kaufen und verkaufen, um Gewinne zu erzielen.
                </p>
                <div class="tutorial-image">
                    <img src="/api/placeholder/400/200" alt="Aktienmarkt-Übersicht">
                </div>
            </div>
            
            <div class="tutorial-step">
                <h4>2. Investieren</h4>
                <p>
                    Klicke auf "Kaufen", um Aktien zu erwerben. Je nach Wirtschaftslage und Unternehmensentwicklung
                    können die Aktienkurse steigen oder fallen. Behalte den Wirtschaftszyklus im Auge!
                </p>
                <div class="tutorial-tip">
                    <strong>Tipp:</strong> Diversifiziere dein Portfolio über verschiedene Sektoren, um das Risiko zu streuen.
                </div>
            </div>
            
            <div class="tutorial-step">
                <h4>3. Gewinne realisieren</h4>
                <p>
                    Verkaufe Aktien, wenn du glaubst, dass ein guter Zeitpunkt gekommen ist, oder wenn du 
                    Liquidität für deinen Wahlkampf benötigst. Gewinne werden automatisch deinem Wahlkampfbudget gutgeschrieben.
                </p>
            </div>
            
            <div class="tutorial-step">
                <h4>4. Wirtschaftszyklen</h4>
                <p>
                    Der Markt durchläuft verschiedene Phasen: Wachstum, Hochkonjunktur, Rezession und Erholung.
                    Diese beeinflussen die Entwicklung der Aktienkurse und bieten verschiedene Chancen und Risiken.
                </p>
                <div class="cycle-overview">
                    <div class="cycle-phase">
                        <div class="phase-name cycle-growth">Wachstum</div>
                        <div class="phase-tip">Technologie- und Wachstumsaktien bevorzugen</div>
                    </div>
                    <div class="cycle-phase">
                        <div class="phase-name cycle-peak">Hochkonjunktur</div>
                        <div class="phase-tip">Gewinne sichern, defensiver werden</div>
                    </div>
                    <div class="cycle-phase">
                        <div class="phase-name cycle-recession">Rezession</div>
                        <div class="phase-tip">Defensive Werte, Qualitätsaktien kaufen</div>
                    </div>
                    <div class="cycle-phase">
                        <div class="phase-name cycle-recovery">Erholung</div>
                        <div class="phase-tip">Zyklische Werte und Finanzaktien bevorzugen</div>
                    </div>
                </div>
            </div>
            
            <div class="tutorial-step">
                <h4>5. Risikomanagement</h4>
                <p>
                    Jede Aktie hat ein Risikoniveau (Niedrig, Mittel, Hoch). Hochrisikoaktien bieten potenziell höhere 
                    Renditen, können aber auch stärker fallen. Achte auf eine ausgewogene Mischung im Portfolio.
                </p>
                <div class="tutorial-warning">
                    <strong>Achtung:</strong> Investieren birgt Risiken. Du könntest einen Teil deines Wahlkampfbudgets verlieren.
                </div>
            </div>
        </div>
        
        <div class="tutorial-actions">
            <button class="action-btn" onclick="closeTutorial()">Verstanden</button>
            <button class="action-btn" onclick="closeTutorial(); showStockMarketTab();">Zum Aktienmarkt</button>
        </div>
    `;
    
    // Modal anzeigen
    tutorialModal.style.display = 'flex';
    setTimeout(() => {
        tutorialModal.classList.add('show');
    }, 10);
}

// Tutorial schließen
function closeTutorial() {
    const tutorialModal = document.getElementById('tutorial-modal');
    if (!tutorialModal) return;
    
    tutorialModal.classList.remove('show');
    setTimeout(() => {
        tutorialModal.style.display = 'none';
    }, 300);
}

// Belohnungssystem: Aktien-Experten als Kampagnenmitglieder
function addStockMarketExperts() {
    // Prüfen, ob Staffdatabase verfügbar ist
    if (typeof staffDatabase === 'undefined') return;
    
    // Finanzexperten hinzufügen
    const financialExperts = [
        {
            id: 501,
            name: "Dr. Markus Steinberg",
            initials: "MS",
            role: "Finanzberater",
            roleType: "finance",
            avatar: null,
            salary: 42000,
            hired: false,
            loyalty: 80,
            experience: "18 Jahre",
            specialty: "Investmentberatung",
            bio: "Ehemaliger Investmentbanker mit ausgezeichnetem Gespür für Marktbewegungen. Seine Strategien haben mehrere Kampagnen finanziell abgesichert.",
            skills: {
                strategy: 7,
                media: 4,
                leadership: 6,
                finance: 9,
                publicSpeaking: 5,
                digitalCampaign: 4,
                regionalKnowledge: 6,
                crisisManagement: 7,
                stockMarketExpertise: 9
            },
            effects: {
                budget: 60000,
                donations: 20000,
                stockMarketBonus: 0.15, // 15% bessere Rendite bei Aktieninvestitionen
                costReduction: 0.08
            },
            history: [
                { date: "Vor der Kampagne", event: "Erfolgreich als Fondsmanager tätig" }
            ],
            achievements: []
        },
        {
            id: 502,
            name: "Sabine Ackermann",
            initials: "SA",
            role: "Investmentstrategin",
            roleType: "finance",
            avatar: null,
            salary: 38000,
            hired: false,
            loyalty: 75,
            experience: "14 Jahre",
            specialty: "Technische Analyse",
            bio: "Ehemalige Hedgefonds-Managerin mit Spezialisierung auf technische Marktanalyse. Ihre Strategien haben durchschnittlich 12% Jahresrendite erzielt.",
            skills: {
                strategy: 8,
                media: 3,
                leadership: 5,
                finance: 9,
                publicSpeaking: 4,
                digitalCampaign: 5,
                regionalKnowledge: 4,
                crisisManagement: 7,
                stockMarketExpertise: 8
            },
            effects: {
                budget: 50000,
                stockMarketRiskReduction: 0.2, // 20% weniger Verlustrisiko bei Marktkrisen
                stockMarketBonus: 0.1, // 10% bessere Rendite
                costReduction: 0.05
            },
            history: [
                { date: "Vor der Kampagne", event: "Leitete erfolgreich ein Investmentteam" }
            ],
            achievements: []
        }
    ];
    
    // Zu Candidate Pool hinzufügen, wenn verfügbar
    if (typeof candidatePool !== 'undefined') {
        // Experten mit 30% Wahrscheinlichkeit hinzufügen
        if (Math.random() < 0.3) {
            const expertToAdd = financialExperts[Math.floor(Math.random() * financialExperts.length)];
            
            // Prüfen, ob der Experte bereits im Pool ist
            const alreadyExists = candidatePool.some(candidate => candidate.id === expertToAdd.id);
            
            if (!alreadyExists) {
                candidatePool.push(expertToAdd);
            }
        }
    }
}

// Aktienmarkt-Experten alle paar Monate verfügbar machen
const originalRefreshCandidates = window.refreshCandidates;
window.refreshCandidates = function() {
    // Originale Funktion aufrufen
    if (typeof originalRefreshCandidates === 'function') {
        originalRefreshCandidates();
    }
    
    // Mit 30% Wahrscheinlichkeit Finanzexperten hinzufügen
    addStockMarketExperts();
};

// Aktienkurs-Verbesserung wenn Finanzexperte im Team ist
function applyStaffBonusToStockMarket() {
    if (typeof staffDatabase === 'undefined') return;
    
    // Prüfen, ob Finanzexperten mit Stockmarket-Bonus im Team sind
    const experts = staffDatabase.filter(staff => 
        staff.hired && 
        staff.effects && 
        (staff.effects.stockMarketBonus || staff.effects.stockMarketRiskReduction)
    );
    
    if (experts.length === 0) return;
    
    // Kumulierte Boni berechnen
    let cumulatedBonus = 0;
    let cumulatedRiskReduction = 0;
    
    experts.forEach(expert => {
        if (expert.effects.stockMarketBonus) {
            cumulatedBonus += expert.effects.stockMarketBonus;
        }
        
        if (expert.effects.stockMarketRiskReduction) {
            cumulatedRiskReduction += expert.effects.stockMarketRiskReduction;
        }
    });
    
    // Boni auf Aktienmarkt anwenden
    
    // 1. Performance-Bonus auf alle Aktien im Portfolio
    if (cumulatedBonus > 0) {
        stockMarket.stocks.forEach(stock => {
            if (stock.shares > 0) {
                // Zusätzliche Preissteigerung
                const bonusIncrease = stock.price * (cumulatedBonus / 20); // Moderater Bonus
                stock.price += bonusIncrease;
                stock.price = Math.round(stock.price * 100) / 100;
            }
        });
    }
    
    // 2. Risikoreduktion bei Marktabschwüngen
    if (cumulatedRiskReduction > 0 && stockMarket.marketTrend < 0) {
        // Negative Marktbewegungen abfedern
        const absorbedLoss = Math.abs(stockMarket.marketTrend) * cumulatedRiskReduction;
        
        stockMarket.stocks.forEach(stock => {
            if (stock.shares > 0 && stock.trend < 0) {
                // Verlust reduzieren
                stock.price *= (1 + absorbedLoss / 100);
                stock.price = Math.round(stock.price * 100) / 100;
                stock.trend += absorbedLoss;
            }
        });
    }
    
    // Log-Eintrag nur bei signifikantem Bonus
    if ((cumulatedBonus + cumulatedRiskReduction) > 0.25 && Math.random() < 0.3) {
        addLogEntry(`Deine Finanzexperten haben die Performance deines Aktienportfolios verbessert.`);
    }
}

// Experten-Bonus auf Aktienkurse anwenden
const originalUpdateStockPrices = updateStockPrices;
updateStockPrices = function() {
    // Originale Funktion aufrufen
    originalUpdateStockPrices();
    
    // Expertenboni anwenden
    applyStaffBonusToStockMarket();
};

// Integrationscheck ausführen
function checkStockMarketIntegration() {
    // Aktienmarkt-Tab hinzufügen, falls nicht vorhanden
    if (!document.querySelector('.tab[data-tab="stocks"]')) {
        addStockMarketTab();
    }
    
    // Aktienmarkt-Button hinzufügen, falls nicht vorhanden
    if (!document.querySelector('.action-btn[data-action="stocks"]')) {
        addStockMarketButton();
    }
    
    // Aktienmarkt-Event in Ereignisse einbinden, falls noch nicht geschehen
    integrateStockMarketEvent();
}

// Aktienmarkt-Integration beim Spielstart prüfen
document.addEventListener('DOMContentLoaded', function() {
    // Mit Verzögerung prüfen, um sicherzustellen, dass die Spieloberfläche geladen ist
    setTimeout(checkStockMarketIntegration, 1500);
});

// Statistikfunktionen für Spielende
function generateStockMarketStatistics() {
    // Berechnet die Gesamtperformance der Aktieninvestitionen
    
    // Gesamtinvestitionen
    const totalInvested = stockMarket.portfolio.tradeHistory.reduce((sum, transaction) => {
        if (transaction.action === 'buy') return sum + transaction.total;
        if (transaction.action === 'sell') return sum - transaction.total;
        return sum;
    }, 0);
    
    // Aktueller Portfoliowert
    const currentValue = stockMarket.portfolio.value;
    
    // Gesamtrendite
    const totalReturn = totalInvested > 0 ? ((currentValue / totalInvested) - 1) * 100 : 0;
    
    // Beste und schlechteste Investitionen identifizieren
    const stockPerformance = stockMarket.stocks.map(stock => {
        // Durchschnittlichen Kaufpreis berechnen
        const buyTransactions = stockMarket.portfolio.tradeHistory.filter(t => 
            t.action === 'buy' && t.stockId === stock.id
        );
        
        const sellTransactions = stockMarket.portfolio.tradeHistory.filter(t => 
            t.action === 'sell' && t.stockId === stock.id
        );
        
        const totalBought = buyTransactions.reduce((sum, t) => sum + t.shares, 0);
        const totalSpent = buyTransactions.reduce((sum, t) => sum + t.total, 0);
        
        const totalSold = sellTransactions.reduce((sum, t) => sum + t.shares, 0);
        const totalReceived = sellTransactions.reduce((sum, t) => sum + t.total, 0);
        
        // Falls keine Käufe getätigt wurden, überspringen
        if (totalBought === 0) return null;
        
        const avgBuyPrice = totalSpent / totalBought;
        const currentReturn = stock.shares > 0 ? ((stock.price / avgBuyPrice) - 1) * 100 : 0;
        
        // Realisierte Gewinne/Verluste
        const realizedReturn = totalSold > 0 ? ((totalReceived / (avgBuyPrice * totalSold)) - 1) * 100 : 0;
        
        return {
            id: stock.id,
            name: stock.name,
            symbol: stock.symbol,
            category: stock.category,
            shares: stock.shares,
            totalBought,
            totalSold,
            avgBuyPrice,
            currentPrice: stock.price,
            currentReturn,
            realizedReturn,
            overallReturn: stock.shares > 0 ? currentReturn : realizedReturn
        };
    }).filter(perf => perf !== null);
    
    // Nach Rendite sortieren
    stockPerformance.sort((a, b) => b.overallReturn - a.overallReturn);
    
    // Beste und schlechteste Aktien
    const bestStock = stockPerformance.length > 0 ? stockPerformance[0] : null;
    const worstStock = stockPerformance.length > 0 ? stockPerformance[stockPerformance.length - 1] : null;
    
    // Anzahl profitabler Aktien
    const profitableStocks = stockPerformance.filter(perf => perf.overallReturn > 0).length;
    
    // Handelsaktivität
    const tradeCount = stockMarket.portfolio.tradeHistory.length;
    
    return {
        totalInvested,
        currentValue,
        totalReturn,
        bestStock,
        worstStock,
        profitableStocks,
        totalStocks: stockPerformance.length,
        tradeCount
    };
}

// Aktienmarkt-Statistiken zur Spielzusammenfassung hinzufügen
function addStockMarketStatsToGameSummary(summaryElement) {
    if (!summaryElement) return;
    
    // Statistiken berechnen
    const stats = generateStockMarketStatistics();
    
    // HTML für Statistiken generieren
    const statsHTML = `
        <div class="summary-section">
            <h4>Aktienmarkt-Performance</h4>
            <div class="stock-market-summary">
                <div class="summary-stats">
                    <div class="stat-item">
                        <div class="stat-label">Gesamtinvestition:</div>
                        <div class="stat-value">${formatMoney(stats.totalInvested)}</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-label">Portfoliowert:</div>
                        <div class="stat-value">${formatMoney(stats.currentValue)}</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-label">Gesamtrendite:</div>
                        <div class="stat-value ${stats.totalReturn >= 0 ? 'positive' : 'negative'}">
                            ${stats.totalReturn.toFixed(2)}%
                        </div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-label">Anzahl Transaktionen:</div>
                        <div class="stat-value">${stats.tradeCount}</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-label">Profitable Aktien:</div>
                        <div class="stat-value">${stats.profitableStocks} / ${stats.totalStocks}</div>
                    </div>
                </div>
                
                ${stats.bestStock ? `
                    <div class="best-worst-stocks">
                        <div class="best-stock">
                            <h5>Beste Investition</h5>
                            <div class="stock-detail">
                                <div class="stock-icon stock-${stats.bestStock.category}">${stats.bestStock.symbol.substring(0, 2)}</div>
                                <div class="stock-name">${stats.bestStock.name}</div>
                                <div class="stock-return positive">+${stats.bestStock.overallReturn.toFixed(2)}%</div>
                            </div>
                        </div>
                        
                        ${stats.worstStock ? `
                            <div class="worst-stock">
                                <h5>Schlechteste Investition</h5>
                                <div class="stock-detail">
                                    <div class="stock-icon stock-${stats.worstStock.category}">${stats.worstStock.symbol.substring(0, 2)}</div>
                                    <div class="stock-name">${stats.worstStock.name}</div>
                                    <div class="stock-return ${stats.worstStock.overallReturn >= 0 ? 'positive' : 'negative'}">
                                        ${stats.worstStock.overallReturn >= 0 ? '+' : ''}${stats.worstStock.overallReturn.toFixed(2)}%
                                    </div>
                                </div>
                            </div>
                        ` : ''}
                    </div>
                ` : ''}
                
                <div class="investment-conclusion">
                    ${getInvestmentConclusion(stats.totalReturn)}
                </div>
            </div>
        </div>
    `;
    
    // Statistiken zur Zusammenfassung hinzufügen
    const insertPoint = summaryElement.querySelector('h4:last-of-type');
    if (insertPoint) {
        // Nach dem letzten h4-Element einfügen
        const statsElement = document.createElement('div');
        statsElement.innerHTML = statsHTML;
        insertPoint.parentNode.insertBefore(statsElement, insertPoint.nextSibling);
    } else {
        // Ans Ende anhängen
        summaryElement.innerHTML += statsHTML;
    }
}

// Textuelle Zusammenfassung der Investmentperformance
function getInvestmentConclusion(totalReturn) {
    if (totalReturn > 20) {
        return "Deine Aktieninvestitionen waren ein voller Erfolg und haben deinem Wahlkampf signifikante zusätzliche Mittel verschafft.";
    } else if (totalReturn > 10) {
        return "Deine Investitionsstrategie war solide und hat deinem Wahlkampf einen finanziellen Vorteil gebracht.";
    } else if (totalReturn > 0) {
        return "Deine Aktieninvestitionen haben einen bescheidenen Gewinn erzielt, der deinem Wahlkampf zugute kam.";
    } else if (totalReturn > -10) {
        return "Deine Investitionen haben leichte Verluste erlitten, die jedoch deinen Wahlkampf nicht wesentlich beeinträchtigten.";
    } else if (totalReturn > -20) {
        return "Deine Aktieninvestitionen haben spürbare Verluste erlitten und deinem Wahlkampfbudget geschadet.";
    } else {
        return "Deine Investitionsstrategie war ein Misserfolg und hat einen erheblichen Teil deines Wahlkampfbudgets aufgezehrt.";
    }
}

// Integration in die endGame-Funktion
const originalEndGame = window.endGame;
window.endGame = function(coalition) {
    // Originale Funktion aufrufen
    if (typeof originalEndGame === 'function') {
        originalEndGame(coalition);
    }
    
    // Nach einer kurzen Verzögerung die Aktienmarkt-Statistiken hinzufügen
    setTimeout(() => {
        const summaryElement = document.querySelector('.panel');
        if (summaryElement) {
            addStockMarketStatsToGameSummary(summaryElement);
        }
    }, 1000);
};

// Aktienmarkt-Addon-Integration abschließen
console.log("Aktienmarkt-Addon erfolgreich geladen");

// Exportierte Funktionen für externes Testing
window.stockMarket = {
    init: initStockMarket,
    showTab: showStockMarketTab,
    simulate: simulateMarketChanges,
    showTutorial: showStockMarketTutorial,
    getStats: generateStockMarketStatistics
};
    
// Aktienmarkt-Tab hinzufügen
if (typeof addStockMarketTab === 'function') {
    addStockMarketTab();
}

// Aktienmarkt-Button zum Hauptmenü hinzufügen
if (typeof addStockMarketButton === 'function') {
    addStockMarketButton();
}

// Aktienmarkt-Ereignisse integrieren
integrateStockMarketEvents();

// Speichern/Laden-Integration
checkSaveLoadIntegration();

// Event-Listener für Marktaktualisierungen hinzufügen
document.addEventListener('marketUpdate', function() {
    if (typeof updateAllStockCards === 'function') {
        updateAllStockCards();
    }
});

// Log-Eintrag
if (typeof addLogEntry === 'function') {
    addLogEntry("Aktienmarkt erfolgreich in den Wahlkampfsimulator integriert.");
}

console.log("Aktienmarkt-Integration abgeschlossen");


// Finanzexperten zum Personal-System hinzufügen
function integrateStockExpertsToStaffSystem() {
// Prüfe, ob das Personal-System verfügbar ist
if (typeof staffDatabase === 'undefined' || typeof candidatePool === 'undefined') {
    console.error('Personal-System nicht gefunden!');
    return;
}

// Prüfe, ob die Funktion zum Hinzufügen von Experten bereits existiert
if (typeof addStockMarketExperts === 'function') {
    // Experten mit einer gewissen Wahrscheinlichkeit hinzufügen
    if (Math.random() < 0.3) {
        addStockMarketExperts();
    }
    
    // Original-Funktion zum Aktualisieren der Kandidaten sichern
    if (typeof window.refreshCandidates === 'function' && typeof originalRefreshCandidates === 'undefined') {
        const originalRefreshCandidates = window.refreshCandidates;
        window.refreshCandidates = function() {
            // Originale Funktion aufrufen
            originalRefreshCandidates();
            
            // Mit 30% Wahrscheinlichkeit Finanzexperten hinzufügen
            if (Math.random() < 0.3) {
                addStockMarketExperts();
            }
        };
    }
}
}

// Aktienmarkt-Tutorial in den Spielstart integrieren
function integrateStockMarketTutorial() {
// Prüfe, ob die Tutorial-Funktion verfügbar ist
if (typeof showStockMarketTutorial !== 'function') {
    console.error('Aktienmarkt-Tutorial nicht gefunden!');
    return;
}

// Funktion zum Starten des Spiels erweitern
if (typeof window.startGame === 'function') {
    const originalStartGame = window.startGame;
    window.startGame = function() {
        // Originale Funktion aufrufen
        originalStartGame();
        
        // Mit geringer Wahrscheinlichkeit das Aktienmarkt-Intro-Event triggern
        if (Math.random() < 0.2) {
            // Nach einer kurzen Verzögerung das Intro-Event auslösen
            setTimeout(() => {
                // Suche das Intro-Event
                const introEvent = events.find(e => e.id === 'stock_market_intro');
                if (introEvent) {
                    // Event manuell auslösen
                    showEventModal(introEvent);
                }
            }, 10000); // Nach 10 Sekunden auslösen, damit der Spieler Zeit hat, sich zu orientieren
        }
    };
}
}

// Konfigurationsobjekt für den Aktienmarkt
const stockMarketConfig = {
// Anfangsdaten
startIndex: 10000,
initialStocks: 8,
minStockPrice: 20,
maxStockPrice: 300,

// Spielbalance
riskRewardRatio: 1.5,       // Höheres Risiko = höhere potenzielle Rendite
maxGainPerMonth: 8,         // Maximale Kurssteigerung pro Monat in Prozent
maxLossPerMonth: 10,        // Maximaler Kursverlust pro Monat in Prozent
specialEventChance: 0.05,   // Wahrscheinlichkeit für besondere Marktereignisse

// Wirtschaftszyklen
cycleSettings: {
    growth: {
        duration: { min: 8, max: 12 },
        volatility: { min: 0.8, max: 1.2 },
        baseChange: { min: 0.5, max: 2.0 }
    },
    peak: {
        duration: { min: 3, max: 6 },
        volatility: { min: 0.7, max: 1.0 },
        baseChange: { min: -0.3, max: 1.0 }
    },
    recession: {
        duration: { min: 4, max: 8 },
        volatility: { min: 1.3, max: 2.0 },
        baseChange: { min: -2.0, max: -0.5 }
    },
    recovery: {
        duration: { min: 4, max: 10 },
        volatility: { min: 1.0, max: 1.5 },
        baseChange: { min: -0.5, max: 1.0 }
    }
},

// Sektoren-Eigenschaften
sectorSettings: {
    tech: {
        volatility: 1.8,
        growthBonus: 2.0,
        recessionImpact: 1.5
    },
    finance: {
        volatility: 1.2,
        peakBonus: 1.5,
        recessionImpact: 2.0
    },
    industry: {
        volatility: 0.8,
        growthBonus: 1.2,
        recessionImpact: 1.3
    },
    energy: {
        volatility: 1.3,
        recoveryBonus: 1.4,
        specialEvents: true
    },
    pharma: {
        volatility: 1.4,
        recessionImmunity: 0.7,
        randomEvents: true
    },
    consumer: {
        volatility: 0.9,
        stabilityBonus: 0.8,
        recessionImpact: 1.2
    }
}
};

// Funktion zur Anpassung der Aktienmarkt-Konfiguration
function configureStockMarket(config) {
// Prüfe, ob das Aktienmarkt-Objekt existiert
if (typeof stockMarket === 'undefined') {
    console.error('Aktienmarkt-Objekt nicht gefunden!');
    return;
}

// Konfigurationseinstellungen anwenden
if (config.startIndex) stockMarket.marketIndex = config.startIndex;
if (config.volatility) stockMarket.volatility = config.volatility;

// Konfiguriere die einzelnen Aktien
if (stockMarket.stocks && Array.isArray(stockMarket.stocks)) {
    stockMarket.stocks.forEach(stock => {
        // Sektor-spezifische Einstellungen anwenden
        const sectorConfig = config.sectorSettings && config.sectorSettings[stock.category];
        if (sectorConfig) {
            if (sectorConfig.volatility) stock.volatility = sectorConfig.volatility;
            
            // Risiko-Level basierend auf Volatilität anpassen
            if (stock.volatility >= 1.5) {
                stock.riskLevel = "high";
            } else if (stock.volatility >= 1.0) {
                stock.riskLevel = "medium";
            } else {
                stock.riskLevel = "low";
            }
        }
    });
}

console.log("Aktienmarkt-Konfiguration angewendet");
}

// Debug-Funktionen für Entwickler
const stockMarketDebug = {
// Aktienmarkt-Zustand in der Konsole ausgeben
printStatus: function() {
    if (typeof stockMarket === 'undefined') {
        console.error('Aktienmarkt-Objekt nicht gefunden!');
        return;
    }
    
    console.log('Aktienmarkt-Status:');
    console.log('Marktindex:', stockMarket.marketIndex);
    console.log('Markttrend:', stockMarket.marketTrend);
    console.log('Wirtschaftszyklus:', stockMarket.economicCycle, '(Monat', stockMarket.economicCycleCounter, ')');
    console.log('Volatilität:', stockMarket.volatility);
    console.log('Portfolio-Wert:', stockMarket.portfolio.value);
    console.log('Anzahl Aktien im Besitz:', stockMarket.stocks.filter(s => s.shares > 0).length);
    console.log('Gesamtrendite:', stockMarket.portfolio.totalReturn);
},

// Wirtschaftszyklus manuell setzen
setCycle: function(cycle, counter = 0) {
    if (typeof stockMarket === 'undefined') {
        console.error('Aktienmarkt-Objekt nicht gefunden!');
        return;
    }
    
    if (['growth', 'peak', 'recession', 'recovery'].includes(cycle)) {
        stockMarket.economicCycle = cycle;
        stockMarket.economicCycleCounter = counter;
        console.log('Wirtschaftszyklus geändert zu:', cycle);
        
        // UI aktualisieren
        const marketUpdateEvent = new CustomEvent('marketUpdate');
        document.dispatchEvent(marketUpdateEvent);
    } else {
        console.error('Ungültiger Zyklus! Erlaubte Werte: growth, peak, recession, recovery');
    }
},

// Spezielle Marktereignisse manuell auslösen
triggerEvent: function(eventType) {
    if (typeof triggerSpecialMarketEvent !== 'function') {
        console.error('Funktion zum Auslösen spezieller Ereignisse nicht gefunden!');
        return;
    }
    
    // Prüfe, ob der Ereignistyp existiert
    const specialEvents = {
        boom: {
            name: "Marktboom",
            description: "Ein unerwarteter Wirtschaftsboom lässt die Aktienkurse steigen!",
            effect: function() {
                // Alle Aktien steigen um 5-15%
                stockMarket.stocks.forEach(stock => {
                    const boost = 5 + Math.random() * 10;
                    stock.price *= (1 + boost / 100);
                    stock.price = Math.round(stock.price * 100) / 100;
                    stock.trend = boost;
                });
                
                // Marktindex erhöhen
                stockMarket.marketIndex *= 1.1;
                stockMarket.marketTrend = 10;
            }
        },
        crash: {
            name: "Marktcrash",
            description: "Ein plötzlicher Markteinbruch lässt die Aktienkurse fallen!",
            effect: function() {
                // Alle Aktien fallen um 10-25%
                stockMarket.stocks.forEach(stock => {
                    const drop = 10 + Math.random() * 15;
                    stock.price *= (1 - drop / 100);
                    stock.price = Math.round(stock.price * 100) / 100;
                    stock.trend = -drop;
                });
                
                // Marktindex reduzieren
                stockMarket.marketIndex *= 0.85;
                stockMarket.marketTrend = -15;
                
                // Zyklus ändern
                stockMarket.economicCycle = 'recession';
                stockMarket.economicCycleCounter = 0;
            }
        },
        techBubble: {
            name: "Tech-Blase",
            description: "Eine Blase im Technologiesektor ist geplatzt!",
            effect: function() {
                // Tech-Aktien fallen stark, andere weniger
                stockMarket.stocks.forEach(stock => {
                    if (stock.category === 'tech') {
                        const drop = 20 + Math.random() * 20;
                        stock.price *= (1 - drop / 100);
                        stock.trend = -drop;
                    } else {
                        const drop = 5 + Math.random() * 5;
                        stock.price *= (1 - drop / 100);
                        stock.trend = -drop;
                    }
                    stock.price = Math.round(stock.price * 100) / 100;
                });
                
                // Marktindex reduzieren
                stockMarket.marketIndex *= 0.92;
                stockMarket.marketTrend = -8;
            }
        },
        oilShock: {
            name: "Ölpreisschock",
            description: "Ein plötzlicher Anstieg der Ölpreise erschüttert die Märkte!",
            effect: function() {
                // Energieaktien steigen, andere fallen
                stockMarket.stocks.forEach(stock => {
                    if (stock.category === 'energy') {
                        const boost = 10 + Math.random() * 15;
                        stock.price *= (1 + boost / 100);
                        stock.trend = boost;
                    } else {
                        const drop = 3 + Math.random() * 7;
                        stock.price *= (1 - drop / 100);
                        stock.trend = -drop;
                    }
                    stock.price = Math.round(stock.price * 100) / 100;
                });
                
                // Marktindex leicht reduzieren
                stockMarket.marketIndex *= 0.96;
                stockMarket.marketTrend = -4;
            }
        }
    };
    
    const event = specialEvents[eventType];
    if (event) {
        // Ereignis auslösen
        event.effect();
        
        // Log-Eintrag und Benachrichtigung
        if (typeof addLogEntry === 'function') {
            addLogEntry(`Wirtschaftsnachricht: ${event.description}`, true);
        }
        
        if (typeof showNotification === 'function') {
            showNotification(event.description, 'warning');
        }
        
        // Event auslösen, um UI zu aktualisieren
        const marketUpdateEvent = new CustomEvent('marketUpdate');
        document.dispatchEvent(marketUpdateEvent);
        
        console.log('Spezielles Marktereignis ausgelöst:', eventType);
    } else {
        console.error('Ungültiger Ereignistyp! Erlaubte Werte: boom, crash, techBubble, oilShock');
    }
},

// Aktien zum Portfolio hinzufügen (für Testzwecke)
addStocks: function(stockId, amount) {
    if (typeof stockMarket === 'undefined') {
        console.error('Aktienmarkt-Objekt nicht gefunden!');
        return;
    }
    
    // Aktie finden
    const stock = stockMarket.stocks.find(s => s.id === stockId);
    if (!stock) {
        console.error('Aktie nicht gefunden!');
        return;
    }
    
    // Aktien hinzufügen
    stock.shares += amount;
    
    // Transaktion zur Historie hinzufügen
    const transaction = {
        date: `DEBUG (${getMonthName(gameState.currentMonth)} ${gameState.currentYear})`,
        action: 'buy',
        stockId: stock.id,
        stockName: stock.name,
        symbol: stock.symbol,
        shares: amount,
        price: stock.price,
        total: amount * stock.price
    };
    
    stockMarket.portfolio.tradeHistory.unshift(transaction);
    
    // Portfolio-Wert aktualisieren
    updatePortfolioValue();
    
    // UI aktualisieren
    const marketUpdateEvent = new CustomEvent('marketUpdate');
    document.dispatchEvent(marketUpdateEvent);
    
    console.log(`${amount} Anteile von ${stock.name} zum Portfolio hinzugefügt.`);
},

// Testszenario: Alle Aktien kaufen
buyAllStocks: function(amount = 10) {
    if (typeof stockMarket === 'undefined') {
        console.error('Aktienmarkt-Objekt nicht gefunden!');
        return;
    }
    
    // Genug Budget sicherstellen
    const totalCost = stockMarket.stocks.reduce((sum, stock) => sum + (stock.price * amount), 0);
    if (gameState.resources.budget < totalCost) {
        gameState.resources.budget = totalCost + 100000;
        stockMarket.portfolio.cash = gameState.resources.budget;
    }
    
    // Für jede Aktie Anteile kaufen
    stockMarket.stocks.forEach(stock => {
        // Aktien hinzufügen
        stock.shares += amount;
        
        // Transaktion zur Historie hinzufügen
        const transaction = {
            date: `DEBUG (${getMonthName(gameState.currentMonth)} ${gameState.currentYear})`,
            action: 'buy',
            stockId: stock.id,
            stockName: stock.name,
            symbol: stock.symbol,
            shares: amount,
            price: stock.price,
            total: amount * stock.price
        };
        
        stockMarket.portfolio.tradeHistory.unshift(transaction);
        
        // Budget reduzieren
        gameState.resources.budget -= amount * stock.price;
        stockMarket.portfolio.cash = gameState.resources.budget;
    });
    
    // Portfolio-Wert aktualisieren
    updatePortfolioValue();
    
    // UI aktualisieren
    const marketUpdateEvent = new CustomEvent('marketUpdate');
    document.dispatchEvent(marketUpdateEvent);
    
    console.log(`Je ${amount} Anteile von allen Aktien gekauft.`);
}
};

// Aktienmarkt-Debug-Funktionen global verfügbar machen
window.stockMarketDebug = stockMarketDebug;

// Abschließende Integration
window.addEventListener('load', function() {
// Mit Verzögerung ausführen, um sicherzustellen, dass alle anderen Skripte geladen sind
setTimeout(() => {
    // Aktienmarkt vollständig integrieren
    completeStockMarketIntegration();
    
    // Aktienmarkt konfigurieren
    configureStockMarket(stockMarketConfig);
    
    // Finanzexperten zum Personal-System hinzufügen
    integrateStockExpertsToStaffSystem();
    
    // Aktienmarkt-Tutorial integrieren
    integrateStockMarketTutorial();
    
    console.log("Aktienmarkt-Integration vollständig abgeschlossen");
}, 2000);
});

// Export der Hauptfunktionen
const stockMarketModule = {
initialize: completeStockMarketIntegration,
configure: configureStockMarket,
showTab: function() {
    if (typeof showStockMarketTab === 'function') {
        showStockMarketTab();
    }
},
showTutorial: function() {
    if (typeof showStockMarketTutorial === 'function') {
        showStockMarketTutorial();
    }
},
debug: stockMarketDebug
};

// Globale Verfügbarkeit
window.stockMarketModule = stockMarketModule;