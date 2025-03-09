// Stock Market Initialization Fix
// Add this code at the end of your main JavaScript file or in a new script tag in your HTML

// Make sure the stock market is initialized
function initializeStockMarket() {
    // Check if stockMarket object exists
    if (typeof stockMarket === 'undefined') {
        console.log("Creating stockMarket object");
        window.stockMarket = {
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
    }

    // Initialize stock history if not already done
    if (window.stockMarket.stocks[0].history.length === 0) {
        window.stockMarket.stocks.forEach(stock => {
            // Create initial price history for each stock
            stock.history = [];
            for (let i = 0; i < 10; i++) {
                const variation = (Math.random() - 0.5) * stock.volatility * 2;
                const historicalPrice = stock.price * (1 + (variation / 100) * (i + 1));
                stock.history.push({
                    day: -10 + i,
                    price: Math.round(historicalPrice * 100) / 100
                });
            }
            // Add current price as last entry
            stock.history.push({
                day: 0,
                price: stock.price
            });
        });
    }

    // Make sure the showStockMarketTab function exists
    if (typeof window.showStockMarketTab !== 'function') {
        window.showStockMarketTab = function() {
            // Tab wechseln
            changeTab('stocks');
            
            // Cash mit aktuellem Budget abgleichen
            window.stockMarket.portfolio.cash = gameState.resources.budget;
            
            // UI aktualisieren
            updateStockMarketUI();
        };
    }

    // Make sure updateStockMarketUI function exists
    if (typeof window.updateStockMarketUI !== 'function') {
        window.updateStockMarketUI = function() {
            // Verfügbares Kapital anzeigen
            const cashElement = document.querySelector('.portfolio-item:first-child .portfolio-value');
            if (cashElement) {
                cashElement.textContent = formatMoney(window.stockMarket.portfolio.cash);
            }
            
            // Portfolio-Wert aktualisieren
            if (typeof window.updatePortfolioValue === 'function') {
                window.updatePortfolioValue();
            }
            
            // Aktienliste aktualisieren
            if (typeof window.renderStockList === 'function') {
                window.renderStockList();
            }
            
            // Handelshistorie aktualisieren
            if (typeof window.renderTradeHistory === 'function') {
                window.renderTradeHistory();
            }
        };
    }

    // Make sure the filterStocks function exists
    if (typeof window.filterStocks !== 'function') {
        window.filterStocks = function(filterType, value) {
            // Filter setzen
            window.stockMarket.filters[filterType] = value;
            
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
            if (typeof window.renderStockList === 'function') {
                window.renderStockList();
            }
        };
    }

    // Make sure the toggleOwnedStocks function exists
    if (typeof window.toggleOwnedStocks !== 'function') {
        window.toggleOwnedStocks = function() {
            const newState = !window.stockMarket.filters.owned;
            window.stockMarket.filters.owned = newState;
            
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
            if (typeof window.renderStockList === 'function') {
                window.renderStockList();
            }
        };
    }

    // Make sure the searchStocks function exists
    if (typeof window.searchStocks !== 'function') {
        window.searchStocks = function(query) {
            window.stockMarket.filters.search = query.trim();
            if (typeof window.renderStockList === 'function') {
                window.renderStockList();
            }
        };
    }

    // Make sure the renderStockList function exists
    if (typeof window.renderStockList !== 'function') {
        window.renderStockList = function() {
            const stockListElement = document.querySelector('.stock-list');
            if (!stockListElement) return;
            
            let stockCards = '';
            
            // Aktien filtern
            const filteredStocks = window.stockMarket.stocks.filter(stock => {
                // Kategorie-Filter
                if (window.stockMarket.filters.category !== 'all' && stock.category !== window.stockMarket.filters.category) {
                    return false;
                }
                
                // Risiko-Filter
                if (window.stockMarket.filters.riskLevel !== 'all' && stock.riskLevel !== window.stockMarket.filters.riskLevel) {
                    return false;
                }
                
                // Nur eigene Aktien
                if (window.stockMarket.filters.owned && stock.shares <= 0) {
                    return false;
                }
                
                // Suche
                if (window.stockMarket.filters.search && 
                    !stock.name.toLowerCase().includes(window.stockMarket.filters.search.toLowerCase()) && 
                    !stock.symbol.toLowerCase().includes(window.stockMarket.filters.search.toLowerCase())) {
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
        };
    }

    // Define the createTrendChart function if it doesn't exist
    if (typeof window.createTrendChart !== 'function') {
        window.createTrendChart = function(history) {
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
        };
    }

    // Connect to the game's showStockMarketTab function if not already connected
    if (typeof window.showStockMarketTab === 'function') {
        // Create a button if not exists
        const actionsContainer = document.querySelector('.actions');
        if (actionsContainer && !document.querySelector('.action-btn[data-action="stocks"]')) {
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

    // Make sure the showBuyModal function exists
    if (typeof window.showBuyModal !== 'function') {
        window.showBuyModal = function(stockId) {
            const stock = window.stockMarket.stocks.find(s => s.id === stockId);
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
            
            const maxSharesToBuy = Math.floor(window.stockMarket.portfolio.cash / stock.price);
            
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
                        <div class="detail-value">${formatMoney(window.stockMarket.portfolio.cash)}</div>
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
        };
    }

    // Define adjustShareAmount function
    if (typeof window.adjustShareAmount !== 'function') {
        window.adjustShareAmount = function(change, price, isSelling = false) {
            const amountInput = document.getElementById('shares-amount');
            if (!amountInput) return;
            
            let newValue = parseInt(amountInput.value) + change;
            
            // Grenzen festlegen
            const minValue = 1;
            const maxValue = isSelling ? 
                parseInt(amountInput.getAttribute('max')) : 
                Math.floor(window.stockMarket.portfolio.cash / price);
            
            // Sicherstellen, dass der Wert innerhalb der Grenzen liegt
            newValue = Math.max(minValue, Math.min(maxValue, newValue));
            
            // Neuen Wert setzen
            amountInput.value = newValue;
            
            // Gesamtbetrag aktualisieren
            updateTransactionTotal(price, isSelling);
        };
    }

    // Define updateTransactionTotal function
    if (typeof window.updateTransactionTotal !== 'function') {
        window.updateTransactionTotal = function(price, isSelling = false) {
            const amountInput = document.getElementById('shares-amount');
            const totalElement = document.getElementById('transaction-total');
            if (!amountInput || !totalElement) return;
            
            const amount = parseInt(amountInput.value) || 0;
            const total = amount * price;
            
            // Begrenzungen anwenden
            if (!isSelling && total > window.stockMarket.portfolio.cash) {
                amountInput.value = Math.floor(window.stockMarket.portfolio.cash / price);
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
        };
    }

    // Define the buyStock function
    if (typeof window.buyStock !== 'function') {
        window.buyStock = function(stockId) {
            const stock = window.stockMarket.stocks.find(s => s.id === stockId);
            if (!stock) return;
            
            const amountInput = document.getElementById('shares-amount');
            if (!amountInput) return;
            
            const amount = parseInt(amountInput.value) || 0;
            if (amount <= 0) return;
            
            const total = amount * stock.price;
            
            // Prüfen, ob genügend Geld verfügbar ist
            if (total > window.stockMarket.portfolio.cash) {
                showNotification('Nicht genug Kapital für diesen Kauf!', 'error');
                return;
            }
            
            // Kauf durchführen
            window.stockMarket.portfolio.cash -= total;
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
            
            window.stockMarket.portfolio.tradeHistory.unshift(transaction);
            
            // Portfolio-Wert aktualisieren
            if (typeof window.updatePortfolioValue === 'function') {
                window.updatePortfolioValue();
            }
            
            // Benachrichtigung anzeigen
            showNotification(`${amount} Anteile von ${stock.name} erfolgreich gekauft!`, 'success');
            
            // Gamestate budget aktualisieren
            gameState.resources.budget = window.stockMarket.portfolio.cash;
            
            // Log-Eintrag hinzufügen
            addLogEntry(`Du hast ${amount} Anteile von ${stock.name} für ${formatMoney(total)} gekauft.`);
            
            // Modal schließen// Modal schließen
            closeModals();
            
            // UI aktualisieren
            updateUI();
            if (typeof window.renderStockList === 'function') {
                window.renderStockList();
            }
            if (typeof window.renderTradeHistory === 'function') {
                window.renderTradeHistory();
            }
        };
    }

    // Define the showSellModal function
    if (typeof window.showSellModal !== 'function') {
        window.showSellModal = function(stockId) {
            const stock = window.stockMarket.stocks.find(s => s.id === stockId);
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
        };
    }

    // Define the sellStock function
    if (typeof window.sellStock !== 'function') {
        window.sellStock = function(stockId) {
            const stock = window.stockMarket.stocks.find(s => s.id === stockId);
            if (!stock) return;
            
            const amountInput = document.getElementById('shares-amount');
            if (!amountInput) return;
            
            const amount = parseInt(amountInput.value) || 0;
            if (amount <= 0 || amount > stock.shares) return;
            
            const total = amount * stock.price;
            
            // Verkauf durchführen
            window.stockMarket.portfolio.cash += total;
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
            
            window.stockMarket.portfolio.tradeHistory.unshift(transaction);
            
            // Portfolio-Wert aktualisieren
            if (typeof window.updatePortfolioValue === 'function') {
                window.updatePortfolioValue();
            }
            
            // Benachrichtigung anzeigen
            showNotification(`${amount} Anteile von ${stock.name} erfolgreich verkauft!`, 'success');
            
            // Gamestate budget aktualisieren
            gameState.resources.budget = window.stockMarket.portfolio.cash;
            
            // Log-Eintrag hinzufügen
            addLogEntry(`Du hast ${amount} Anteile von ${stock.name} für ${formatMoney(total)} verkauft.`);
            
            // Modal schließen
            closeModals();
            
            // UI aktualisieren
            updateUI();
            if (typeof window.renderStockList === 'function') {
                window.renderStockList();
            }
            if (typeof window.renderTradeHistory === 'function') {
                window.renderTradeHistory();
            }
        };
    }

    // Define the updatePortfolioValue function
    if (typeof window.updatePortfolioValue !== 'function') {
        window.updatePortfolioValue = function() {
            let portfolioValue = 0;
            
            window.stockMarket.stocks.forEach(stock => {
                portfolioValue += stock.shares * stock.price;
            });
            
            window.stockMarket.portfolio.value = portfolioValue;
            
            // UI-Elemente aktualisieren
            const portfolioValueElement = document.querySelector('.portfolio-value');
            if (portfolioValueElement) {
                portfolioValueElement.textContent = formatMoney(portfolioValue);
            }
            
            // Rendite berechnen
            calculateReturn();
        };
    }

    // Define the calculateReturn function
    if (typeof window.calculateReturn !== 'function') {
        window.calculateReturn = function() {
            let investedAmount = 0;
            let currentValue = 0;
            
            // Berechnung auf Basis der Handelshistorie
            const buyTransactions = window.stockMarket.portfolio.tradeHistory.filter(t => t.action === 'buy');
            const sellTransactions = window.stockMarket.portfolio.tradeHistory.filter(t => t.action === 'sell');
            
            // Gekaufte Aktien
            buyTransactions.forEach(transaction => {
                investedAmount += transaction.total;
            });
            
            // Verkaufte Aktien
            sellTransactions.forEach(transaction => {
                investedAmount -= transaction.total;
            });
            
            // Aktueller Wert der gehaltenen Aktien
            currentValue = window.stockMarket.portfolio.value;
            
            // Wenn noch keine Investitionen getätigt wurden
            if (investedAmount === 0) {
                window.stockMarket.portfolio.totalReturn = 0;
                
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
            window.stockMarket.portfolio.totalReturn = returnRate;
            
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
        };
    }

    // Define the renderTradeHistory function
    if (typeof window.renderTradeHistory !== 'function') {
        window.renderTradeHistory = function() {
            const tradeList = document.querySelector('.trade-list');
            if (!tradeList) return;
            
            if (window.stockMarket.portfolio.tradeHistory.length === 0) {
                tradeList.innerHTML = '<div class="trade-empty">Keine Transaktionen vorhanden.</div>';
                return;
            }
            
            let tradeItems = '';
            
            // Begrenzen auf die letzten 5 Transaktionen für die Standardansicht
            const transactions = window.stockMarket.filters.showAllTrades ? 
                window.stockMarket.portfolio.tradeHistory : 
                window.stockMarket.portfolio.tradeHistory.slice(0, 5);
            
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
                toggleElement.textContent = window.stockMarket.filters.showAllTrades ? 'Weniger anzeigen' : 'Alle anzeigen';
            }
        };
    }

    // Define the toggleTradeHistory function
    if (typeof window.toggleTradeHistory !== 'function') {
        window.toggleTradeHistory = function() {
            window.stockMarket.filters.showAllTrades = !window.stockMarket.filters.showAllTrades;
            renderTradeHistory();
        };
    }

    // Initialize the stock market cash with the current budget
    window.stockMarket.portfolio.cash = gameState.resources.budget;

    console.log("Stock market initialized successfully.");
    return true;
}

// Function to attach the stock market system to the game
function attachStockMarketToGame() {
    // Make sure the next turn function updates the stock market
    if (typeof window.nextTurn === 'function' && !window.stockMarketAttached) {
        const originalNextTurn = window.nextTurn;
        window.nextTurn = function() {
            // Call original function
            originalNextTurn();
            
            // Simulate market changes
            if (typeof window.simulateMarketChanges === 'function') {
                window.simulateMarketChanges();
            } else {
                // Simple market simulation if the full function doesn't exist
                window.stockMarket.stocks.forEach(stock => {
                    // Random price change (-3% to +3%)
                    const change = (Math.random() * 6) - 3;
                    const oldPrice = stock.price;
                    stock.price = Math.max(5, stock.price * (1 + change / 100));
                    stock.price = Math.round(stock.price * 100) / 100;
                    stock.trend = ((stock.price / oldPrice) - 1) * 100;
                    
                    // Update history
                    stock.history.push({
                        day: stock.history.length,
                        price: stock.price
                    });
                    
                    // Keep history at reasonable size
                    if (stock.history.length > 30) {
                        stock.history.shift();
                    }
                });
                
                // Update market index
                const oldIndex = window.stockMarket.marketIndex;
                const change = (Math.random() * 4) - 2; // -2% to +2%
                window.stockMarket.marketIndex = Math.max(5000, oldIndex * (1 + change / 100));
                window.stockMarket.marketTrend = ((window.stockMarket.marketIndex / oldIndex) - 1) * 100;
                
                // Trigger UI update
                const marketUpdateEvent = new CustomEvent('marketUpdate');
                document.dispatchEvent(marketUpdateEvent);
            }
            
            // Update the button to display current portfolio value
            const stockButton = document.querySelector('.action-btn[data-action="stocks"]');
            if (stockButton) {
                stockButton.querySelector('span').textContent = formatMoney(window.stockMarket.portfolio.value);
            }
        };
        
        window.stockMarketAttached = true;
    }
    
    // Define the simulateMarketChanges function if it doesn't exist
    if (typeof window.simulateMarketChanges !== 'function') {
        window.simulateMarketChanges = function() {
            // Wirtschaftszyklus fortschreiten
            window.stockMarket.economicCycleCounter++;
            
            // Auf Basis des Counters den Zyklus ändern
            if (window.stockMarket.economicCycleCounter >= 12) {
                // Zyklus wechseln
                switch (window.stockMarket.economicCycle) {
                    case 'growth':
                        window.stockMarket.economicCycle = 'peak';
                        break;
                    case 'peak':
                        window.stockMarket.economicCycle = 'recession';
                        break;
                    case 'recession':
                        window.stockMarket.economicCycle = 'recovery';
                        break;
                    case 'recovery':
                        window.stockMarket.economicCycle = 'growth';
                        break;
                }
                window.stockMarket.economicCycleCounter = 0;
                
                // Log message about the economic cycle change
                const cycleMessages = {
                    'growth': 'Die Wirtschaft befindet sich nun in einer Wachstumsphase.',
                    'peak': 'Die Konjunktur befindet sich nun auf einem Höchststand.',
                    'recession': 'Die Konjunktur kippt in eine Rezession.',
                    'recovery': 'Die Wirtschaft beginnt sich zu erholen.'
                };
                
                if (typeof addLogEntry === 'function') {
                    addLogEntry(`Wirtschaftslage: ${cycleMessages[window.stockMarket.economicCycle]}`);
                }
            }
            
            // Marktindex berechnen
            const previousIndex = window.stockMarket.marketIndex;
            
            // Basis-Änderung je nach Wirtschaftszyklus
            let baseChange = 0;
            switch (window.stockMarket.economicCycle) {
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
            const volatilityFactor = (Math.random() - 0.5) * window.stockMarket.volatility * 2;
            const totalChange = baseChange + volatilityFactor;
            
            // Neuen Index berechnen
            window.stockMarket.marketIndex = Math.max(5000, window.stockMarket.marketIndex * (1 + totalChange / 100));
            
            // Trend berechnen
            window.stockMarket.marketTrend = ((window.stockMarket.marketIndex / previousIndex) - 1) * 100;
            
            // Aktienpreise aktualisieren
            window.stockMarket.stocks.forEach(stock => {
                // Vorherigen Preis für Trendberechnung speichern
                const previousPrice = stock.price;
                
                // Basis-Änderung abhängig vom Markttrend und individueller Aktienvolatilität
                const marketInfluence = window.stockMarket.marketTrend * 0.7; // 70% vom Markttrend
                const stockSpecificChange = (Math.random() - 0.5) * stock.volatility * 5 * window.stockMarket.volatility;
                
                // Sektorenspezifische Faktoren
                let sectorFactor = 0;
                switch (stock.category) {
                    case 'tech':
                        // Tech-Unternehmen wachsen stärker in Wachstums- und Erholungsphasen
                        if (window.stockMarket.economicCycle === 'growth' || window.stockMarket.economicCycle === 'recovery') {
                            sectorFactor = 0.5 + Math.random() * 1.0;
                        }
                        break;
                    case 'finance':
                        // Finanzwerte reagieren stark auf Rezessionen
                        if (window.stockMarket.economicCycle === 'recession') {
                            sectorFactor = -1.0 - Math.random() * 1.0;
                        } else if (window.stockMarket.economicCycle === 'peak') {
                            sectorFactor = 0.5 + Math.random() * 0.5;
                        }
                        break;
                    case 'industry':
                        // Industriewerte sind stabiler, leiden aber unter Rezessionen
                        if (window.stockMarket.economicCycle === 'recession') {
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
                        if (window.stockMarket.economicCycle === 'recession') {
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
            
            // Update UI
            const marketUpdateEvent = new CustomEvent('marketUpdate');
            document.dispatchEvent(marketUpdateEvent);
        };
    }

    // Define a handler for the marketUpdate event if it doesn't exist
    if (typeof window.updateAllStockCards !== 'function') {
        window.updateAllStockCards = function() {
            // Marktindex aktualisieren
            const indexValueElement = document.querySelector('.index-value');
            const indexChangeElement = document.querySelector('.index-change');
            
            if (indexValueElement) {
                indexValueElement.textContent = formatMoney(window.stockMarket.marketIndex, false);
            }
            
            if (indexChangeElement) {
                const changePercent = window.stockMarket.marketTrend;
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
                
                switch (window.stockMarket.economicCycle) {
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
            if (typeof window.updatePortfolioValue === 'function') {
                window.updatePortfolioValue();
            }
            
            // Liste neu rendern
            if (typeof window.renderStockList === 'function') {
                window.renderStockList();
            }
        };
        
        // Add event listener for the marketUpdate event
        document.addEventListener('marketUpdate', window.updateAllStockCards);
    }
}

// Call the initialization functions when the page loads
document.addEventListener('DOMContentLoaded', function() {
    // Wait for the game state to be initialized
    const initInterval = setInterval(function() {
        if (typeof gameState !== 'undefined' && gameState.resources && gameState.resources.budget) {
            clearInterval(initInterval);
            
            // Initialize stock market
            initializeStockMarket();
            
            // Attach to game
            attachStockMarketToGame();
            
            // Ensure the stock market tab is active when clicked
            const stocksTab = document.querySelector('.tab[data-tab="stocks"]');
            if (stocksTab) {
                stocksTab.addEventListener('click', function() {
                    // Update cash amount from game budget
                    if (window.stockMarket) {
                        window.stockMarket.portfolio.cash = gameState.resources.budget;
                        
                        // Update UI
                        if (typeof window.updateStockMarketUI === 'function') {
                            window.updateStockMarketUI();
                        }
                    }
                });
            }
        }
    }, 500);
});