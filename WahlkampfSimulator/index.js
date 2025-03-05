        // Globaler Spielzustand
        const gameState = {
            selectedParty: null,
            partyName: "",
            partyColor: "",
            currentCampaign: 1,
            maxCampaigns: 3,
            monthsToElection: 18,
            currentMonth: 1,
            currentYear: 2025,
            difficulty: "medium",
            eventFrequency: "medium",
            isInGovernment: true,
            isChancellor: false,
            currentTurn: 0,
            strategyBonus: 0,
            strategyBonusRemaining: 0,
            activityCounter: {},
            lastActionTurn: {},
            resources: {
                budget: 2500000,
                members: 300000,
                polls: 32,
                media: "Mittel",
                donations: 125000
            },
            issues: {
                economy: { position: 0, strength: 5 },
                environment: { position: 0, strength: 5 },
                social: { position: 0, strength: 5 },
                security: { position: 0, strength: 5 },
                migration: { position: 0, strength: 5 },
                digital: { position: 0, strength: 5 }
            },
            partyPositions: {
                cdu: {
                    economy: 2,
                    environment: 0,
                    social: 1,
                    security: 2,
                    migration: 1,
                    digital: 1
                },
                spd: {
                    economy: -1,
                    environment: 1,
                    social: 2,
                    security: 0,
                    migration: 0,
                    digital: 0
                },
                gruene: {
                    economy: -1,
                    environment: 2,
                    social: 1,
                    security: -1,
                    migration: 1,
                    digital: 1
                },
                fdp: {
                    economy: 2,
                    environment: 0,
                    social: -1,
                    security: 0,
                    migration: 0,
                    digital: 2
                },
                linke: {
                    economy: -2,
                    environment: 1,
                    social: 2,
                    security: -2,
                    migration: 2,
                    digital: 0
                },
                afd: {
                    economy: 1,
                    environment: -2,
                    security: 2,
                    migration: -2,
                    social: -1,
                    digital: -1
                }
            },
            partyNames: {
                cdu: "CDU/CSU",
                spd: "SPD",
                gruene: "Die Grünen",
                fdp: "FDP",
                linke: "Die Linke",
                afd: "AfD"
            },
            partySlogans: {
                cdu: "Für ein starkes Deutschland",
                spd: "Zeit für mehr Gerechtigkeit",
                gruene: "Zukunft wird aus Mut gemacht",
                fdp: "Denken wir neu",
                linke: "Sozial. Gerecht. Für alle.",
                afd: "Deutschland, aber normal"
            },
            polls: {
                cdu: 32,
                spd: 25,
                gruene: 18,
                fdp: 10,
                afd: 10,
                linke: 5
            },
            // Beziehungs-Matrix für Parteien
            partyRelations: {
                cdu: { spd: 0, gruene: -10, fdp: 30, linke: -50, afd: -40 },
                spd: { cdu: 0, gruene: 30, fdp: 0, linke: 10, afd: -70 },
                gruene: { cdu: -10, spd: 30, fdp: 10, linke: 20, afd: -80 },
                fdp: { cdu: 30, spd: 0, gruene: 10, linke: -40, afd: -30 },
                linke: { cdu: -50, spd: 10, gruene: 20, fdp: -40, afd: -60 },
                afd: { cdu: -40, spd: -70, gruene: -80, fdp: -30, linke: -60 }
            },
            // Koalitionsausschlüsse
            coalitionExclusions: {
                cdu: ["linke", "afd"],
                spd: ["afd"],
                gruene: ["afd"],
                fdp: ["linke"],
                linke: ["cdu", "fdp", "afd"],
                afd: ["cdu", "spd", "gruene", "linke"]
            },
            // Spielereigene Koalitionsausschlüsse (wird dynamisch gefüllt)
            playerExclusions: [],
            events: [],
            staff: [
                {
                    name: "Peter Müller",
                    role: "Kampagnenleiter",
                    initials: "PM",
                    skills: {
                        strategy: 8,
                        media: 7
                    }
                },
                {
                    name: "Sabine Klein",
                    role: "Pressesprecherin",
                    initials: "SK",
                    skills: {
                        communication: 9,
                        crisis: 6
                    }
                },
                {
                    name: "Thomas Weber",
                    role: "Schatzmeister",
                    initials: "TW",
                    skills: {
                        finance: 8,
                        organization: 7
                    }
                },
                {
                    name: "Maria Hoffmann",
                    role: "Social Media",
                    initials: "MH",
                    skills: {
                        digital: 9,
                        youth: 8
                    }
                }
            ],
            selectedCoalition: null,
            isProcessingMonth: false,
            governmentCoalitions: [],
            oppositionCoalitions: []
        };
        
        // Aktualisierte Aktionen mit neuen Features
        const actions = {
            campaign: {
                title: "Wahlkampfveranstaltung planen",
                cost: 150000,
                description: "Organisiere eine Wahlkampfveranstaltung, um Wähler direkt zu erreichen und deine Botschaft zu verbreiten.",
                options: [
                    { id: "large", text: "Große Veranstaltung (250.000 €)", effect: { budget: -250000, polls: 1.2, media: 2 } },
                    { id: "medium", text: "Mittlere Veranstaltung (150.000 €)", effect: { budget: -150000, polls: 0.8, media: 1 } },
                    { id: "small", text: "Kleine Veranstaltung (75.000 €)", effect: { budget: -75000, polls: 0.4, media: 0.5 } }
                ],
                // Abnehmender Wirkungsgrad je näher zur Wahl
                getScaledEffect: function(effect, monthsToElection) {
                    // Wahlkampfveranstaltungen sind effektiver kurz vor der Wahl
                    const pollMultiplier = 1 + Math.max(0, (18 - monthsToElection) / 18);
                    return {
                        ...effect,polls: effect.polls * pollMultiplier
                    };
                }
            },
            ads: {
                title: "Werbekampagne starten",
                cost: 250000,
                description: "Starte eine Werbekampagne in verschiedenen Medien, um deine Bekanntheit zu steigern.",
                options: [
                    { id: "tv", text: "TV-Kampagne (300.000 €)", effect: { budget: -300000, polls: 1.5, media: 2 } },
                    { id: "digital", text: "Digitale Kampagne (200.000 €)", effect: { budget: -200000, polls: 1.2, media: 1 } },
                    { id: "print", text: "Printkampagne (150.000 €)", effect: { budget: -150000, polls: 0.7, media: 0.5 } }
                ],
                // Abnehmender Wirkungsgrad bei Wiederholung
                getScaledEffect: function(effect, actionCount) {
                    // Werbung wird weniger effektiv, wenn sie zu oft geschaltet wird
                    const diminisher = Math.max(0.3, 1 / (actionCount * 0.2 + 1));
                    return {
                        ...effect,
                        polls: effect.polls * diminisher
                    };
                }
            },
            policy: {
                title: "Positionspapier verfassen",
                cost: 50000,
                description: "Verfasse ein detailliertes Positionspapier zu einem wichtigen Thema.",
                options: [
                    { id: "economy", text: "Wirtschaft & Steuern", effect: { budget: -50000, economy: 1, polls: 0.4 } },
                    { id: "environment", text: "Umwelt & Klima", effect: { budget: -50000, environment: 1, polls: 0.4 } },
                    { id: "social", text: "Soziales & Rente", effect: { budget: -50000, social: 1, polls: 0.4 } },
                    { id: "security", text: "Innere Sicherheit", effect: { budget: -50000, security: 1, polls: 0.4 } },
                    { id: "migration", text: "Migration", effect: { budget: -50000, migration: 1, polls: 0.4 } }
                ],
                // Strategien haben einen stabileren Wirkungsgrad über Zeit
                getScaledEffect: function(effect, monthsToElection) {
                    return effect; // Konsistent über die gesamte Kampagne
                }
            },
            recruit: {
                title: "Mitgliederrekrutierung",
                cost: 100000,
                description: "Starte eine Kampagne zur Gewinnung neuer Parteimitglieder.",
                options: [
                    { id: "youth", text: "Junge Menschen (120.000 €)", effect: { budget: -120000, members: 5000, polls: 0.2, donations: 1500 } },
                    { id: "general", text: "Allgemeine Bevölkerung (100.000 €)", effect: { budget: -100000, members: 3000, polls: 0.15, donations: 1000 } },
                    { id: "targeted", text: "Gezielte Gruppen (80.000 €)", effect: { budget: -80000, members: 2000, polls: 0.1, donations: 500 } }
                ],
                // Mitglieder sind wichtig zu Beginn der Kampagne
                getScaledEffect: function(effect, monthsToElection) {
                    // Mitglieder früh zu rekrutieren ist effektiver
                    const memberMultiplier = 1 + (monthsToElection / 18) * 0.5;
                    return {
                        ...effect,
                        members: effect.members * memberMultiplier,
                        donations: effect.donations * memberMultiplier
                    };
                }
            },
            negative: {
                title: "Negativkampagne führen",
                cost: 180000,
                description: "Starte eine Negativkampagne gegen eine andere Partei, um deren Wähler zu dir zu ziehen.",
                // Optionen werden dynamisch generiert basierend auf anderen Parteien
                generateOptions: function() {
                    const options = [];
                    const parties = Object.keys(gameState.polls).filter(p => p !== gameState.selectedParty);
                    
                    parties.forEach(party => {
                        const relation = getPartyRelationship(gameState.selectedParty, party);
                        const backfireRisk = relation < -20 ? 0.1 : (relation < 0 ? 0.2 : 0.3);
                        
                        options.push({
                            id: party,
                            text: `Gegen ${gameState.partyNames[party]} (180.000 €)`,
                            effect: { 
                                budget: -180000, 
                                polls: 0.8, 
                                media: 1,
                                targetParty: party,
                                targetPollsEffect: -1.2,
                                backfireRisk: backfireRisk,
                                relationEffect: -15
                            }
                        });
                    });
                    
                    return options;
                },
                getScaledEffect: function(effect, monthsToElection) {
                    // Negativkampagnen sind effektiver je näher zur Wahl
                    const timeMultiplier = 1 + Math.max(0, (6 - monthsToElection) / 6) * 0.5;
                    
                    // Chance auf Backfire (kann nach hinten losgehen)
                    if (Math.random() < effect.backfireRisk) {
                        return {
                            ...effect,
                            polls: -effect.polls * 0.8,
                            targetPollsEffect: effect.targetPollsEffect * 0.3, // Trotzdem etwas Effekt auf Zielpartei
                            backfired: true
                        };
                    }
                    
                    return {
                        ...effect,
                        polls: effect.polls * timeMultiplier,
                        targetPollsEffect: effect.targetPollsEffect * timeMultiplier
                    };
                },
                cooldown: 2 // Kann nur alle 2 Monate verwendet werden
            },
            scandal: {
                title: "Skandal bekämpfen",
                cost: 200000,
                description: "Ein kleinerer Skandal ist aufgekommen. Wie gehst du damit um?",
                options: [
                    { id: "pr", text: "PR-Kampagne (200.000 €)", effect: { budget: -200000, polls: 0.7, media: 1 } },
                    { id: "transparency", text: "Transparenz-Offensive (150.000 €)", effect: { budget: -150000, polls: 0.4, media: 0.5 } },
                    { id: "ignore", text: "Ignorieren (0 €)", effect: { budget: 0, polls: -1.0, media: -1 } }
                ],
                // Skandale können mehr Schaden kurz vor der Wahl anrichten
                getScaledEffect: function(effect, monthsToElection) {
                    // Skandalmanagement ist wichtiger kurz vor der Wahl
                    if (effect.polls < 0) {
                        // Negativ-Effekte verstärken sich kurz vor der Wahl
                        const penaltyMultiplier = 1 + Math.max(0, (18 - monthsToElection) / 9);
                        return {
                            ...effect,
                            polls: effect.polls * penaltyMultiplier
                        };
                    }
                    return effect;
                }
            },
            fundraiser: {
                title: "Spendengala organisieren",
                cost: 75000,
                description: "Organisiere eine Veranstaltung, um Spenden für deine Kampagne zu sammeln.",
                options: [
                    { id: "exclusive", text: "Exklusive Gala (100.000 €)", effect: { budget: -100000, donations: 12000, polls: -0.2 } },
                    { id: "balanced", text: "Ausgewogene Veranstaltung (75.000 €)", effect: { budget: -75000, donations: 8000, polls: 0 } },
                    { id: "grassroots", text: "Basisorientiert (50.000 €)", effect: { budget: -50000, donations: 5000, polls: 0.1 } }
                ],
                // Abnehmender Wirkungsgrad bei Wiederholung (Spendenermüdung)
                getScaledEffect: function(effect, actionCount) {
                    // Spendengalen werden weniger effektiv mit häufiger Wiederholung
                    const donationFatigue = Math.max(0.2, 1 / (actionCount * 0.35 + 1));
                    return {
                        ...effect,
                        donations: effect.donations * donationFatigue
                    };
                },
                // Begrenzung: Maximal einmal alle 3 Monate 
                cooldown: 3
            },
            debate: {
                title: "TV-Debatte vorbereiten",
                cost: 120000,
                description: "Bereite dich auf eine anstehende TV-Debatte vor.",
                options: [
                    { id: "aggressive", text: "Aggressive Strategie (120.000 €)", effect: { budget: -120000, polls: 1.3, media: 2, chance_backfire: 0.3 } },
                    { id: "balanced", text: "Ausgewogene Strategie (120.000 €)", effect: { budget: -120000, polls: 0.9, media: 1, chance_backfire: 0.1 } },
                    { id: "defensive", text: "Defensive Strategie (120.000 €)", effect: { budget: -120000, polls: 0.6, media: 0.5, chance_backfire: 0.05 } }
                ],
                // TV-Debatten haben einen höheren Einfluss näher an der Wahl
                getScaledEffect: function(effect, monthsToElection) {
                    // Debatten sind wichtiger in den letzten Monaten
                    const debateMultiplier = 1 + Math.max(0, (12 - monthsToElection) / 6);
                    
                    // Möglichkeit des Backfiring (kann nach hinten losgehen)
                    if (Math.random() < effect.chance_backfire) {
                        return {
                            ...effect,
                            polls: -effect.polls * 0.7 * debateMultiplier
                        };
                    }
                    
                    return {
                        ...effect,
                        polls: effect.polls * debateMultiplier
                    };
                },
                // Verfügbarkeit: Nur alle 3 Monate
                availability: function(monthsToElection) {
                    // Nur verfügbar, wenn der Monat durch 3 teilbar ist
                    return monthsToElection % 3 === 0;
                }
            },
            research: {
                title: "Meinungsforschung",
                cost: 80000,
                description: "Führe Umfragen durch, um die Stimmung der Wähler zu testen.",
                options: [
                    { id: "focus", text: "Fokusgruppen (100.000 €)", effect: { budget: -100000, polls: 0.2, strategy_bonus: 0.15 } },
                    { id: "poll", text: "Repräsentative Umfrage (80.000 €)", effect: { budget: -80000, polls: 0.1, strategy_bonus: 0.1 } },
                    { id: "online", text: "Online-Umfrage (40.000 €)", effect: { budget: -40000, polls: 0.05, strategy_bonus: 0.05 } }
                ],
                // Forschung erhöht die Effektivität der nächsten Aktionen
                getScaledEffect: function(effect) {
                    return effect;
                },
                // Spezieller Bonus: Erhöht die Effektivität der nächsten X Aktionen
                specialEffect: function(effect) {
                    // Speichern des Strategy Bonus für die nächsten 3 Aktionen
                    gameState.strategyBonus = effect.strategy_bonus;
                    gameState.strategyBonusRemaining = 3;
                    
                    addLogEntry(`Die Meinungsforschung erhöht die Effektivität deiner nächsten ${gameState.strategyBonusRemaining} Aktionen um ${Math.round(effect.strategy_bonus * 100)}%.`);
                }
            },
            coalition: {
                title: "Koalitionsaussage machen",
                cost: 30000,
                description: "Mache eine klare Aussage zu möglichen Koalitionen nach der Wahl. Dies kann deine Beziehungen zu anderen Parteien beeinflussen und dein Profil schärfen.",
                // Optionen werden dynamisch generiert
                generateOptions: function() {
                    const options = [
                        { 
                            id: "clear", 
                            text: "Klare Aussage zu Koalitionsausschlüssen (30.000 €)", 
                            effect: { 
                                budget: -30000, 
                                polls: 0.3, 
                                media: 1
                            },
                            action: "showExclusionOptions"
                        },
                        { 
                            id: "preferred", 
                            text: "Wunschkoalition nennen (30.000 €)", 
                            effect: { 
                                budget: -30000, 
                                polls: 0.2, 
                                media: 0.5
                            },
                            action: "showPreferredOptions"
                        },
                        { 
                            id: "vague", 
                            text: "Vage Aussage (30.000 €)", 
                            effect: { 
                                budget: -30000, 
                                polls: 0.1
                            }
                        }
                    ];
                    
                    return options;
                },
                getScaledEffect: function(effect, monthsToElection) {
                    // Koalitionsaussagen sind wichtiger je näher an der Wahl
                    const timeMultiplier = 1 + Math.max(0, (12 - monthsToElection) / 12);
                    return {
                        ...effect,
                        polls: effect.polls * timeMultiplier
                    };
                },
                cooldown: 3 // Kann nur alle 3 Monate verwendet werden
            }
        };
        
        // Negative Ereignisse
        const negativeEvents = [
            {
                id: "party-scandal",
                title: "Partei-Skandal",
                description: "Ein hochrangiges Mitglied deiner Partei wurde in einen Skandal verwickelt. Die Medien berichten intensiv.",
                effect: { polls: -2.5, media: -1 }
            },
            {
                id: "policy-failure",
                title: "Politische Fehleinschätzung",
                description: "Eine deiner Positionen wird von der Bevölkerung stark kritisiert.",
                effect: { polls: -1.8 }
            },
            {
                id: "protest",
                title: "Proteste gegen deine Partei",
                description: "Verschiedene Gruppen demonstrieren gegen eine deiner Positionen.",
                effect: { polls: -1.5, media: 1 }
            },
            {
                id: "opponent-surge",
                title: "Gegner gewinnt an Beliebtheit",
                description: "Eine konkurrierende Partei hat eine erfolgreiche Kampagne gestartet.",
                getEffect: function() {
                    const opponent = Object.keys(gameState.polls)
                        .filter(p => p !== gameState.selectedParty)
                        .sort(() => 0.5 - Math.random())[0];
                    
                    const effect = { polls: {} };
                    effect.polls[opponent] = 2.5;
                    effect.polls[gameState.selectedParty] = -1.0;
                    
                    return {
                        effect: effect,
                        description: `${gameState.partyNames[opponent]} hat durch eine erfolgreiche Kampagne Stimmen gewonnen.`
                    };
                }
            },
            {
                id: "economic-downturn",
                title: "Wirtschaftlicher Abschwung",
                description: "Die Wirtschaft schwächelt und die Wähler geben den regierenden Parteien die Schuld.",
                effect: function() {
                    if (gameState.isInGovernment) {
                        return { polls: -2.0, economy: -1 };
                    } else {
                        return { polls: 1.0, economy: -1 };
                    }
                }
            },
            {
                id: "media-bias",
                title: "Negative Medienberichterstattung",
                description: "Einige Medien berichten negativ über deine Partei.",
                effect: { polls: -1.2, media: -1 }
            },
            {
                id: "coalition-rejection",
                title: "Koalitionsabsage",
                description: "Eine potenzielle Koalitionspartei hat sich öffentlich gegen eine Zusammenarbeit mit dir ausgesprochen.",
                getEffect: function() {
                    // Zufällige Partei auswählen, die nicht völlig unvereinbar ist
                    const potentialRejectors = Object.keys(gameState.polls)
                        .filter(p => p !== gameState.selectedParty)
                        .filter(p => {
                            const relation = getPartyRelationship(gameState.selectedParty, p);
                            return relation > -30; // Nur Parteien, die nicht völlig unvereinbar sind
                        });
                    
                    if (potentialRejectors.length === 0) {
                        // Kein passender Rejector gefunden, Standard-Effekt zurückgeben
                        return {
                            effect: { polls: -1.0 },
                            description: "Mehrere Parteien haben sich gegen eine Koalition mit dir ausgesprochen."
                        };
                    }
                    
                    const rejector = potentialRejectors[Math.floor(Math.random() * potentialRejectors.length)];
                    
                    // KI-Koalitionsausschluss hinzufügen
                    if (!gameState.coalitionExclusions[rejector].includes(gameState.selectedParty)) {
                        gameState.coalitionExclusions[rejector].push(gameState.selectedParty);
                    }
                    
                    // Beziehung verschlechtern
                    updatePartyRelationship(rejector, gameState.selectedParty, -20);
                    
                    return {
                        effect: { polls: -1.5 },
                        description: `${gameState.partyNames[rejector]} hat öffentlich erklärt, nicht mit dir koalieren zu wollen.`,
                        rejectorParty: rejector
                    };
                }
            }
        ];
        
        // KI-Gegner mit verbesserter Taktik
        const aiParties = {
            cdu: { aggression: 0.5, focus: ["economy", "security"], leaderAppeal: 0.7 },
            spd: { aggression: 0.4, focus: ["social", "economy"], leaderAppeal: 0.6 },
            gruene: { aggression: 0.4, focus: ["environment", "migration"], leaderAppeal: 0.7 },
            fdp: { aggression: 0.5, focus: ["economy", "digital"], leaderAppeal: 0.5 },
            linke: { aggression: 0.6, focus: ["social", "migration"], leaderAppeal: 0.5 },
            afd: { aggression: 0.7, focus: ["migration", "security"], leaderAppeal: 0.6 }
        };
        
        // Event-Datenbank
        const events = [
            {
                id: "rent-reform",
                title: "Rentenreform-Debatte",
                description: "Die Regierung hat einen neuen Vorschlag zur Rentenreform vorgelegt. Wie positionierst du deine Partei zu diesem Thema?",
                options: [
                    { id: "support", text: "Unterstützen (Sozialer Fokus)", effect: { social: 1, economy: -1, polls:{ spd: 2, gruene: 1, cdu: -1, fdp: -2 } } },
                    { id: "oppose", text: "Ablehnen (Wirtschaftlicher Fokus)", effect: { social: -1, economy: 1, polls: { fdp: 2, cdu: 1, spd: -1, gruene: -2 } } },
                    { id: "neutral", text: "Neutral bleiben (Ausgewogen)", effect: { social: 0, economy: 0, polls: { all: 0.5 } } }
                ]
            },
            {
                id: "climate-package",
                title: "Neues Klimapaket",
                description: "Die EU diskutiert ein neues Klimapaket mit strengeren Umweltauflagen. Wie reagierst du?",
                options: [
                    { id: "support", text: "Voll unterstützen", effect: { environment: 2, economy: -1, polls: { gruene: 3, spd: 1, fdp: -2, cdu: -1 } } },
                    { id: "modify", text: "Modifizieren vorschlagen", effect: { environment: 1, economy: 0, polls: { cdu: 1, spd: 1, gruene: -1, fdp: 1 } } },
                    { id: "oppose", text: "Ablehnen", effect: { environment: -2, economy: 1, polls: { fdp: 2, cdu: 1, gruene: -3, spd: -1 } } }
                ]
            },
            {
                id: "scandal",
                title: "Parteispendenskandal",
                description: "Ein Mitglied deiner Partei wird mit illegalen Spenden in Verbindung gebracht. Wie reagierst du?",
                options: [
                    { id: "fire", text: "Sofort ausschließen", effect: { media: 1, budget: -100000, polls: { all: 1 } } },
                    { id: "investigate", text: "Interne Untersuchung", effect: { media: 0, budget: -50000, polls: { all: -0.5 } } },
                    { id: "defend", text: "Verteidigen", effect: { media: -2, budget: 0, polls: { all: -2 } } }
                ]
            },
            {
                id: "industry-crisis",
                title: "Industriekrise",
                description: "Eine wichtige Branche in Deutschland steckt in einer Krise. Tausende Arbeitsplätze sind gefährdet.",
                options: [
                    { id: "bailout", text: "Staatliche Unterstützung anbieten", effect: { economy: -1, budget: -200000, polls: { spd: 2, linke: 3, fdp: -2 } } },
                    { id: "market", text: "Dem Markt überlassen", effect: { economy: 1, social: -2, polls: { fdp: 3, cdu: 1, spd: -2, linke: -3 } } },
                    { id: "compromise", text: "Bedingungen für Hilfen stellen", effect: { economy: 0, social: 0, polls: { cdu: 1, spd: 1, gruene: 1 } } }
                ]
            },{
                id: "migration-debate",
                title: "Migrationsdebatte",
                description: "Die Migrationszahlen steigen und lösen eine kontroverse Debatte aus. Welche Position nimmst du ein?",
                options: [
                    { id: "open", text: "Offenere Migrationspolitik", effect: { migration: 2, polls: { gruene: 2, linke: 3, spd: 1, cdu: -1, afd: -3 } } },
                    { id: "strict", text: "Strengere Kontrollen", effect: { migration: -2, polls: { afd: 3, cdu: 2, fdp: 0, gruene: -2, linke: -3 } } },
                    { id: "balanced", text: "Ausgewogene Position", effect: { migration: 0, polls: { cdu: 1, spd: 1, fdp: 1 } } }
                ]
            },
            {
                id: "coalition-offer",
                title: "Koalitionsanfrage",
                description: "Eine andere Partei signalisiert Interesse an zukünftiger Zusammenarbeit. Wie reagierst du?",
                getOptions: function() {
                    // Zufällige Partei auswählen, die einen gewissen Grad an Kompatibilität hat
                    const potentialPartners = Object.keys(gameState.polls)
                        .filter(p => p !== gameState.selectedParty)
                        .filter(p => {
                            const relation = getPartyRelationship(gameState.selectedParty, p);
                            return relation > -10; // Nur Parteien mit gewisser Mindestkompatibilität
                        });
                    
                    if (potentialPartners.length === 0) {
                        // Kein Partner gefunden, Standardoption
                        return [
                            { id: "none", text: "Keine möglichen Partner", effect: { polls: 0 } }
                        ];
                    }
                    
                    const partner = potentialPartners[Math.floor(Math.random() * potentialPartners.length)];
                    
                    this.partner = partner;
                    this.description = `${gameState.partyNames[partner]} signalisiert Interesse an zukünftiger Zusammenarbeit. Wie reagierst du?`;
                    
                    return [
                        { 
                            id: "accept", 
                            text: "Kooperationsbereitschaft signalisieren", 
                            effect: { 
                                polls: 0.5, 
                                partyRelation: { party: partner, change: 20 }
                            } 
                        },
                        { 
                            id: "neutral", 
                            text: "Unverbindlich reagieren", 
                            effect: { 
                                polls: 0.2,
                                partyRelation: { party: partner, change: 5 }
                            } 
                        },
                        { 
                            id: "reject", 
                            text: "Koalition ausschließen", 
                            effect: { 
                                polls: -0.3,
                                partyRelation: { party: partner, change: -25 },
                                addExclusion: partner
                            } 
                        }
                    ];
                }
            }
        ];
        
        // Helper-Funktionen
        function formatMoney(amount) {
            return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(amount);
        }
        
        function formatNumber(number) {
            return new Intl.NumberFormat('de-DE').format(number);
        }
        
        function getMonthName(monthNumber) {
            const months = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];
            return months[monthNumber - 1];
        }
        
        // Verbesserte Benachrichtigungsfunktion mit Animation
        function showNotification(message, type = 'info') {
            const notification = document.getElementById('notification');
            notification.textContent = message;
            notification.className = 'notification';
            
            if (type === 'success') {
                notification.classList.add('success');
            } else if (type === 'error') {
                notification.classList.add('error');
            } else if (type === 'warning') {
                notification.classList.add('warning');
            }
            
            // Ein kurze Verzögerung für bessere Animation
            setTimeout(() => {
                notification.classList.add('show');
            }, 10);
            
            // Automatisch ausblenden nach einer Zeit
            setTimeout(() => {
                notification.classList.remove('show');
            }, 4000);
        }
        
        // Verbesserte Log-Eintrags-Funktion mit Animation
        function addLogEntry(message, important = false) {
            const entry = document.createElement('div');
            entry.className = important ? 'log-entry important' : 'log-entry';
            entry.textContent = message;
            
            // Animation-Klassen hinzufügen
            entry.classList.add('animated-item');
            
            const eventLog = document.querySelector('.event-log');
            eventLog.prepend(entry);
            
            // Scroll zum Anfang des Logs
            eventLog.scrollTop = 0;
        }
        
        function getIssueName(issueKey) {
            const names = {
                economy: 'Wirtschaft & Steuern',
                environment: 'Umwelt & Klima',
                social: 'Soziales & Rente',
                security: 'Innere Sicherheit',
                migration: 'Migration',
                digital: 'Digitalisierung'
            };return names[issueKey];
        }
        
        // Funktion zur Aktivitätsverfolgung
        function trackActivity(actionType) {
            // Sicherstellen, dass der Aktivitätszähler existiert
            if (!gameState.activityCounter) {
                gameState.activityCounter = {};
            }
            
            // Aktivität zählen
            if (!gameState.activityCounter[actionType]) {
                gameState.activityCounter[actionType] = 1;
            } else {
                gameState.activityCounter[actionType]++;
            }
            
            return gameState.activityCounter[actionType];
        }
        
        // Funktionen für Parteibeziehungen
        function getPartyRelationship(partyA, partyB) {
            if (partyA === partyB) return 100; // Maximale Beziehung zur eigenen Partei
            
            return gameState.partyRelations[partyA][partyB];
        }
        
        function updatePartyRelationship(partyA, partyB, change) {
            if (partyA === partyB) return; // Keine Änderung der Beziehung zur eigenen Partei
            
            gameState.partyRelations[partyA][partyB] += change;
            
            // Grenzen sicherstellen (-100 bis 100)
            gameState.partyRelations[partyA][partyB] = Math.max(-100, Math.min(100, gameState.partyRelations[partyA][partyB]));
            
            // Gegenseitige Beziehung auch anpassen, aber mit geringerem Effekt
            gameState.partyRelations[partyB][partyA] += change * 0.7;
            gameState.partyRelations[partyB][partyA] = Math.max(-100, Math.min(100, gameState.partyRelations[partyB][partyA]));
            
            // UI aktualisieren, wenn auf Parteibeziehungen-Tab
            updatePartyRelationsUI();
        }
        
        function getRelationshipStatus(value) {
            if (value >= 50) return "Sehr gut";
            if (value >= 20) return "Gut";
            if (value >= -20) return "Neutral";
            if (value >= -50) return "Schlecht";
            return "Feindlich";
        }
        
        function getRelationshipClass(value) {
            if (value >= 20) return "relationship-positive";
            if (value >= -20) return "relationship-neutral";
            return "relationship-negative";
        }
        
        // Aktualisierte Funktion zum Anwenden von Aktionseffekten mit Animation
        function applyActionEffects(action, option) {
            const actionType = action.id;
            const actionCount = trackActivity(actionType);
            
            // Basiseffekt kopieren
            let effect = { ...option.effect };
            
            // Cooldown prüfen
            if (action.cooldown && gameState.lastActionTurn && gameState.lastActionTurn[actionType]) {
                const turnsSinceLastAction = gameState.currentTurn - gameState.lastActionTurn[actionType];
                if (turnsSinceLastAction < action.cooldown) {
                    showNotification(`Diese Aktion kann erst in ${action.cooldown - turnsSinceLastAction} Monaten wieder durchgeführt werden.`, 'warning');
                    return false;
                }
            }
            
            // Verfügbarkeit prüfen
            if (action.availability && !action.availability(gameState.monthsToElection)) {
                showNotification('Diese Aktion ist im aktuellen Monat nicht verfügbar.', 'warning');
                return false;
            }
            
            // Effekt basierend auf Spielzustand skalieren
            if (action.getScaledEffect) {
                if (actionType === 'ads' || actionType === 'fundraiser') {
                    effect = action.getScaledEffect(effect, actionCount);
                } else {
                    effect = action.getScaledEffect(effect, gameState.monthsToElection);
                }
            }
            
            // Strategy Bonus anwenden, falls vorhanden
            if (gameState.strategyBonus && gameState.strategyBonusRemaining > 0) {
                if (effect.polls) {
                    effect.polls *= (1 + gameState.strategyBonus);
                }
                gameState.strategyBonusRemaining--;
                
                if (gameState.strategyBonusRemaining === 0) {
                    addLogEntry("Der Bonus durch die Meinungsforschung ist aufgebraucht.");
                    gameState.strategyBonus = 0;
                }
            }
            
            // Speziellen Effekt anwenden, falls vorhanden
            if (action.specialEffect) {
                action.specialEffect(effect);
            }
            
            // Spezielle Aktion für Koalition oder Negativkampagne
            if (option.action === "showExclusionOptions") {
                showCoalitionExclusionModal(effect);
                return true;
            } else if (option.action === "showPreferredOptions") {
                showPreferredCoalitionModal(effect);
                return true;
            }
            
            // Letzten Aktionszeitpunkt speichern
            if (!gameState.lastActionTurn) {
                gameState.lastActionTurn = {};
            }
            gameState.lastActionTurn[actionType] = gameState.currentTurn;
            
            // Effekte auf den Spielzustand anwenden mit Animation
            applyEffects(effect);
            
            // Spezielle Effekte für Negativkampagnen
            if (effect.targetParty) {
                // Zielpartei Umfragewerte reduzieren
                gameState.polls[effect.targetParty] += effect.targetPollsEffect;
                
                // Sicherstellen, dass keine Partei unter 0% fällt
                gameState.polls[effect.targetParty] = Math.max(0, gameState.polls[effect.targetParty]);
                
                // Beziehung verschlechtern
                updatePartyRelationship(gameState.selectedParty, effect.targetParty, effect.relationEffect);
                
                // Log-Eintrag
                if (effect.backfired) {
                    addLogEntry(`Die Negativkampagne gegen ${gameState.partyNames[effect.targetParty]} ist nach hinten losgegangen! Du verlierst ${Math.abs(effect.polls).toFixed(1)}% Zustimmung.`, true);
                    
                    // Shake-Animation für das Umfrage-Element
                    const pollElement = document.getElementById('polls');
                    if (pollElement) {
                        pollElement.parentNode.classList.add('shake');
                        setTimeout(() => {
                            pollElement.parentNode.classList.remove('shake');
                        }, 1000);
                    }
                } else {
                    addLogEntry(`Die Negativkampagne gegen ${gameState.partyNames[effect.targetParty]} reduziert deren Umfragewerte um ${Math.abs(effect.targetPollsEffect).toFixed(1)}%.`);
                    
                    // Finden der Zielpartei in den Umfragebalken und animieren
                    const pollBars = document.querySelectorAll('.sidebar .poll-results .poll-bar');
                    pollBars.forEach(bar => {
                        const label = bar.querySelector('.poll-label');
                        if (label && label.textContent === gameState.partyNames[effect.targetParty]) {
                            bar.classList.add('shake');
                            setTimeout(() => {
                                bar.classList.remove('shake');
                            }, 1000);
                        }
                    });
                }
            }
            
            // Beziehungseffekte anwenden
            if (effect.partyRelation) {
                updatePartyRelationship(gameState.selectedParty, effect.partyRelation.party, effect.partyRelation.change);
                
                // Log-Eintrag
                const changeDirection = effect.partyRelation.change > 0 ? "verbessert" : "verschlechtert";
                addLogEntry(`Die Beziehung zu ${gameState.partyNames[effect.partyRelation.party]} hat sich ${changeDirection}.`);
            }
            
            // Koalitionsausschluss hinzufügen
            if (effect.addExclusion) {
                addCoalitionExclusion(effect.addExclusion);
                addLogEntry(`Du hast eine Koalition mit ${gameState.partyNames[effect.addExclusion]} ausgeschlossen.`, true);
            }
            
            return true;
        }
        
        // Funktion zum Hinzufügen eines Koalitionsausschlusses
        function addCoalitionExclusion(party) {
            if (!gameState.playerExclusions.includes(party)) {
                gameState.playerExclusions.push(party);
                
                // UI aktualisieren
                updateCoalitionExclusionsUI();
            }
        }
        
        // Funktion zum Entfernen eines Koalitionsausschlusses
        function removeCoalitionExclusion(party) {
            const index = gameState.playerExclusions.indexOf(party);
            if (index > -1) {
                gameState.playerExclusions.splice(index, 1);
                
                // UI aktualisieren
                updateCoalitionExclusionsUI();
            }
        }
        
        // Modal für Koalitionsausschlüsse mit Animation
        function showCoalitionExclusionModal(baseEffect) {
            const modalContent = document.getElementById('action-content');
            const parties = Object.keys(gameState.polls).filter(p => p !== gameState.selectedParty);
            
            let html = `
                <p>Wähle Parteien aus, mit denen du nicht koalieren möchtest:</p>
                <div class="coalition-exclusion-options">
            `;
            
            parties.forEach((party, index) => {
                const isExcluded = gameState.playerExclusions.includes(party);
                const className = isExcluded ? "coalition-exclusion-option excluded" : "coalition-exclusion-option";
                const delay = index * 0.1; // Staffelung der Animation
                
                html += `
                    <div class="${className} staggered-item" data-party="${party}" onclick="toggleCoalitionExclusion(this, '${party}')" style="transition-delay: ${delay}s;">
                        <div class="party-color ${party}"></div>
                        <span>${gameState.partyNames[party]}</span>
                    </div>
                `;
            });
            
            html +=`
                </div>
                
                <div style="margin-top: 1rem; display: flex; justify-content: space-between;">
                    <button class="action-btn" onclick="closeModals()">Abbrechen</button>
                    <button class="action-btn" onclick="confirmCoalitionExclusions(${JSON.stringify(baseEffect)})">Bestätigen</button>
                </div>
            `;
            
            modalContent.innerHTML = html;
            
            // Verzögertes Einblenden der Elemente
            setTimeout(() => {
                const staggeredItems = document.querySelectorAll('.staggered-item');
                staggeredItems.forEach(item => {
                    item.classList.add('show');
                });
            }, 50);
        }
        
        // Modal für Wunschkoalitionen mit Animation
        function showPreferredCoalitionModal(baseEffect) {
            const modalContent = document.getElementById('action-content');
            const parties = Object.keys(gameState.polls).filter(p => p !== gameState.selectedParty);
            
            // Parteien nach Beziehungswert sortieren
            const sortedParties = parties.sort((a, b) => {
                return getPartyRelationship(gameState.selectedParty, b) - getPartyRelationship(gameState.selectedParty, a);
            });
            
            let html = `
                <p>Wähle deine bevorzugte Koalition:</p>
                <div id="preferred-options">
            `;
            
            let optionIndex = 0;
            
            // Mögliche 2er-Koalitionen
            sortedParties.forEach(party => {
                const relation = getPartyRelationship(gameState.selectedParty, party);
                const statusClass = getRelationshipClass(relation);
                const isExcluded = gameState.playerExclusions.includes(party) || 
                                  gameState.coalitionExclusions[party].includes(gameState.selectedParty);
                
                if (!isExcluded) {
                    const delay = optionIndex * 0.1; // Staffelung der Animation
                    optionIndex++;
                    
                    html += `
                        <div class="coalition-option staggered-item" onclick="selectPreferredCoalition(['${party}'], ${JSON.stringify(baseEffect)})" style="transition-delay: ${delay}s;">
                            <div class="coalition-header">
                                <h4>${gameState.partyNames[gameState.selectedParty]} + ${gameState.partyNames[party]}</h4>
                                <span class="${statusClass}">${getRelationshipStatus(relation)}</span>
                            </div>
                            <p>Eine Zweierkoalition mit ${gameState.partyNames[party]}</p>
                        </div>
                    `;
                }
            });
            
            // Optionale 3er-Koalitionen mit höchsten Beziehungen
            if (sortedParties.length >= 2) {
                // Top 3 Parteien für mögliche 3er-Koalitionen
                const top3 = sortedParties.slice(0, Math.min(3, sortedParties.length));
                
                for (let i = 0; i < top3.length; i++) {
                    for (let j = i + 1; j < top3.length; j++) {
                        const party1 = top3[i];
                        const party2 = top3[j];
                        
                        // Prüfen ob eine der Parteien ausgeschlossen ist
                        const isParty1Excluded = gameState.playerExclusions.includes(party1) || 
                                               gameState.coalitionExclusions[party1].includes(gameState.selectedParty);
                        const isParty2Excluded = gameState.playerExclusions.includes(party2) || 
                                               gameState.coalitionExclusions[party2].includes(gameState.selectedParty);
                        // Prüfen ob die Parteien sich gegenseitig ausgeschlossen haben
                        const partiesExcludeEachOther = gameState.coalitionExclusions[party1].includes(party2) || 
                                                      gameState.coalitionExclusions[party2].includes(party1);
                        
                        if (!isParty1Excluded && !isParty2Excluded && !partiesExcludeEachOther) {
                            const delay = optionIndex * 0.1; // Staffelung der Animation
                            optionIndex++;
                            
                            html += `
                                <div class="coalition-option staggered-item" onclick="selectPreferredCoalition(['${party1}', '${party2}'], ${JSON.stringify(baseEffect)})" style="transition-delay: ${delay}s;">
                                    <div class="coalition-header">
                                        <h4>${gameState.partyNames[gameState.selectedParty]} + ${gameState.partyNames[party1]} + ${gameState.partyNames[party2]}</h4>
                                    </div>
                                    <p>Eine Dreierkoalition mit ${gameState.partyNames[party1]} und ${gameState.partyNames[party2]}</p>
                                </div>
                            `;
                        }
                    }
                }
            }
            
            html += `
                </div>
                
                <div style="margin-top: 1rem; display: flex; justify-content: flex-end;">
                    <button class="action-btn" onclick="closeModals()">Abbrechen</button>
                </div>
            `;
            
            modalContent.innerHTML = html;
            
            // Verzögertes Einblenden der Elemente
            setTimeout(() => {
                const staggeredItems = document.querySelectorAll('.staggered-item');
                staggeredItems.forEach(item => {
                    item.classList.add('show');
                });
            }, 50);
        }
        
        // Funktion zum Umschalten von Koalitionsausschlüssen mit Animation
        function toggleCoalitionExclusion(element, party) {
            const isCurrentlyExcluded = gameState.playerExclusions.includes(party);
            
            // Animation hinzufügen
            element.classList.add('pulse');
            
            if (isCurrentlyExcluded) {
                // Ausschluss entfernen
                removeCoalitionExclusion(party);
                element.classList.remove('excluded');
            } else {
                // Ausschluss hinzufügen
                addCoalitionExclusion(party);
                element.classList.add('excluded');
            }
            
            // Animation nach einer kurzen Zeit entfernen
            setTimeout(() => {
                element.classList.remove('pulse');
            }, 500);
        }
        
        // Funktion zum Bestätigen von Koalitionsausschlüssen
        function confirmCoalitionExclusions(baseEffect) {
            // Effekte anwenden
            applyEffects(baseEffect);
            
            // Für jeden Ausschluss die Beziehung verschlechtern
            gameState.playerExclusions.forEach(party => {
                updatePartyRelationship(gameState.selectedParty, party, -15);
            });
            
            // Log-Eintrag
            if (gameState.playerExclusions.length > 0) {
                const excludedNames = gameState.playerExclusions.map(p => gameState.partyNames[p]).join(', ');
                addLogEntry(`Du hast öffentlich eine Koalition mit ${excludedNames} ausgeschlossen.`, true);
            } else {
                addLogEntry("Du hast keine Partei von einer Koalition ausgeschlossen.");
            }
            
            // Modal animiert schließen
            const modal = document.getElementById('action-modal');
            modal.classList.remove('show');
            setTimeout(() => {
                modal.style.display = 'none';
            }, 300);
            
            // UI aktualisieren
            updateUI();
            updateCoalitionExclusionsUI();
        }
        
        // Funktion zum Auswählen einer bevorzugten Koalition mit Animation
        function selectPreferredCoalition(parties, baseEffect) {
            // Effekte anwenden
            applyEffects(baseEffect);
            
            // Für jede bevorzugte Partei die Beziehung verbessern
            parties.forEach(party => {
                updatePartyRelationship(gameState.selectedParty, party, 20);
            });
            
            // Log-Eintrag
            const partyNames = parties.map(p => gameState.partyNames[p]).join(' und ');
            addLogEntry(`Du hast öffentlich eine Koalition mit ${partyNames} als bevorzugte Option genannt.`, true);
            
            // Modal animiert schließen
            const modal = document.getElementById('action-modal');
            modal.classList.remove('show');
            setTimeout(() => {
                modal.style.display = 'none';
            }, 300);
            
            // UI aktualisieren
            updateUI();
        }
        
        // Aktualisierte Funktionen für die UI mit Animationen
        function updatePartyRelationsUI() {
            const relationsContainer = document.getElementById('party-relations');
            if (!relationsContainer) return; // Falls das Element noch nicht existiert
            
            const parties = Object.keys(gameState.polls).filter(p => p !== gameState.selectedParty);
            
            let html = '';
            
            parties.forEach((party, index) => {
                const relation = getPartyRelationship(gameState.selectedParty, party);
                const statusText = getRelationshipStatus(relation);
                const statusClass = getRelationshipClass(relation);
                const delay = index * 0.1; // Staffelung der Animation
                
                html += `
                    <div class="party-relationship staggered-item" style="transition-delay: ${delay}s;">
                        <div>
                            <span class="${party}-color" style="display: inline-block; width: 12px; height: 12px; border-radius: 50%; margin-right: 5px;"></span>
                            <strong>${gameState.partyNames[party]}</strong>
                        </div>
                        <span class="relationship-status ${statusClass}">${statusText} (${relation})</span>
                    </div>
                `;
            });
            
            relationsContainer.innerHTML = html;
            
            // Verzögertes Einblenden der Elemente
            setTimeout(() => {
                const staggeredItems = document.querySelectorAll('#party-relations .staggered-item');
                staggeredItems.forEach(item => {
                    item.classList.add('show');
                });
            }, 50);
        }
        
        function updateCoalitionExclusionsUI() {
            const exclusionsSpan = document.getElementById('coalition-exclusions');
            if (!exclusionsSpan) return;
            
            if (gameState.playerExclusions.length === 0) {
                exclusionsSpan.textContent = "Keine";
            } else {
                const exclusionNames = gameState.playerExclusions.map(p => gameState.partyNames[p]).join(', ');
                exclusionsSpan.textContent = exclusionNames;
                
                // Pulse-Animation bei Änderungen
                exclusionsSpan.classList.add('pulse');
                setTimeout(() => {
                    exclusionsSpan.classList.remove('pulse');
                }, 500);
            }
            
            // Auch die UI für die Optionen aktualisieren
            const optionsContainer = document.querySelector('.coalition-exclusion-options');
            if (!optionsContainer) return;
            
            let html = '';
            const parties = Object.keys(gameState.polls).filter(p => p !== gameState.selectedParty);
            
            parties.forEach((party, index) => {
                const isExcluded = gameState.playerExclusions.includes(party);
                const className = isExcluded ? "coalition-exclusion-option excluded" : "coalition-exclusion-option";
                const delay = index * 0.1; // Staffelung der Animation
                
                html += `
                    <div class="${className} staggered-item" data-party="${party}" onclick="toggleCoalitionExclusion(this, '${party}')" style="transition-delay: ${delay}s;">
                        <div class="party-color ${party}"></div>
                        <span>${gameState.partyNames[party]}</span>
                    </div>
                `;
            });
            
            optionsContainer.innerHTML = html;
            
            // Verzögertes Einblenden der Elemente
            setTimeout(() => {
                const staggeredItems = document.querySelectorAll('.coalition-exclusion-options .staggered-item');
                staggeredItems.forEach(item => {
                    item.classList.add('show');
                });
            }, 50);
        }
        
        // Anzeigen von Aktionsdaten im Modal mit Verfügbarkeitsprüfung und Animation
        function showActionModal(actionType) {
            const action = actions[actionType];
            const modal = document.getElementById('action-modal');
            
            // Verfügbarkeit prüfen
            let isAvailable = true;
            let unavailableReason = "";
            
            // Cooldown-Prüfung
            if (action.cooldown && gameState.lastActionTurn && gameState.lastActionTurn[actionType]) {
                const turnsSinceLastAction = gameState.currentTurn - gameState.lastActionTurn[actionType];
                if (turnsSinceLastAction < action.cooldown) {
                    isAvailable = false;
                    unavailableReason = `Diese Aktion hat eine Abklingzeit und ist erst in ${action.cooldown - turnsSinceLastAction} Monaten wieder verfügbar.`;
                }
            }
            
            // Zeitbasierte Verfügbarkeit prüfen
            if (action.availability && !action.availability(gameState.monthsToElection)) {
                isAvailable = false;
                unavailableReason = "Diese Aktion ist im aktuellen Monat nicht verfügbar.";
            }
            
            // Action Modal anzeigen mit Animation
            modal.style.display = 'flex';
            
            // Kleine Verzögerung für sanfte Überblendung
            setTimeout(() => {
                modal.classList.add('show');
            }, 10);
            
            // Modal-Titel setzen
            document.getElementById('action-title').textContent = action.title;
            
            // Modal-Inhalt füllen
            const modalContent = document.getElementById('action-content');
            
            if (isAvailable) {
                // Aktivitätszähler für angepasste Beschreibung
                const actionCount = gameState.activityCounter && gameState.activityCounter[actionType] ? gameState.activityCounter[actionType] : 0;
                let actionDescription = action.description;
                
                // Zusatzinfo für Wiederholungseffekte
                if (actionType === 'fundraiser' && actionCount > 0) {
                    const efficiency = Math.max(0.2, 1 / (actionCount * 0.35 + 1)) * 100;
                    actionDescription += ` (Effektivität: ${efficiency.toFixed(0)}% durch wiederholte Nutzung)`;
                } else if (actionType === 'ads' && actionCount > 0) {
                    const efficiency = Math.max(0.3, 1 / (actionCount * 0.2 + 1)) * 100;
                    actionDescription += ` (Effektivität: ${efficiency.toFixed(0)}% durch wiederholte Nutzung)`;
                }
                
                modalContent.innerHTML = `<p class="animated-item fadeIn">${actionDescription}</p>`;
                
                // Optionen basierend auf Aktionstyp hinzufügen
                if (actionType === 'negative') {
                    // Dynamisch Optionen für Negativkampagnen erzeugen
                    const negativeOptions = action.generateOptions();
                    
                    let optionsHTML = `<h4 class="animated-item fadeIn" style="animation-delay: 0.1s;">Wähle das Ziel deiner Negativkampagne:</h4><div class="negative-targets">`;
                    
                    negativeOptions.forEach((option, index) => {
                        const delay = (index + 1) * 0.1 + 0.1;
                        optionsHTML += `
                            <div class="negative-campaign-target animated-item slideInUp" data-target="${option.id}" onclick="handleNegativeCampaignTarget(this, '${option.id}')" style="animation-delay: ${delay}s;">
                                <div class="target-party-icon ${option.id}">${option.id.toUpperCase().substring(0, 3)}</div>
                                <div>
                                    <div><strong>${gameState.partyNames[option.id]}</strong></div>
                                    <div style="font-size: 0.8rem;">Beziehung: ${getRelationshipStatus(getPartyRelationship(gameState.selectedParty, option.id))}</div>
                                </div>
                            </div>
                        `;
                    });
                    
                    optionsHTML += `</div>`;
                    modalContent.innerHTML += optionsHTML;
                    
                } else if (actionType === 'coalition') {
                    // Dynamisch Optionen für Koalitionsaussagen erzeugen
                    const coalitionOptions = action.generateOptions();
                    
                    let optionsHTML = `<div style="margin-top: 1rem;">`;
                    
                    coalitionOptions.forEach((option, index) => {
                        const delay = (index + 1) * 0.1;
                        optionsHTML += `
                            <button class="action-btn action-option animated-item slideInUp" data-action="${actionType}" data-option="${option.id}" style="margin-top: 0.5rem; width: 100%; animation-delay: ${delay}s;" onclick="handleActionOption(this)">
                                ${option.text}
                            </button>
                        `;
                    });
                    
                    optionsHTML += `</div>`;
                    modalContent.innerHTML += optionsHTML;
                    
                } else {
                    // Standard-Optionen anzeigen
                    let optionsHTML = `<div style="margin-top: 1rem;">`;
                    
                    action.options.forEach((option, index) => {
                        const delay = (index + 1) * 0.1;
                        optionsHTML += `
                            <button class="action-btn action-option animated-item slideInUp" data-action="${actionType}" data-option="${option.id}" style="margin-top: 0.5rem; width: 100%; animation-delay: ${delay}s;" onclick="handleActionOption(this)">
                                ${option.text}
                            </button>
                        `;
                    });
                    
                    optionsHTML += `</div>`;
                    modalContent.innerHTML += optionsHTML;
                }
            } else {
                // Nicht verfügbare Aktion
                modalContent.innerHTML = `
                    <p class="animated-item fadeIn">${action.description}</p>
                    <div class="unavailable-notice animated-item fadeIn" style="animation-delay: 0.1s;">
                        <strong>Derzeit nicht verfügbar:</strong> ${unavailableReason}
                    </div>
                    <div style="margin-top: 1rem;">
                        <button class="action-btn animated-item slideInUp" style="margin-top: 0.5rem; width: 100%; animation-delay: 0.2s;" onclick="closeModals()">
                            Zurück
                        </button>
                    </div>
                `;
            }
        }
        
        // Funktion zum Handling von Negativkampagnen-Zielen mit Animation
        function handleNegativeCampaignTarget(element, targetParty) {
            // Vorherige Auswahl entfernen
            document.querySelectorAll('.negative-campaign-target').forEach(target => {
                target.classList.remove('selected');
            });
            
            // Neue Auswahl markieren mit Animation
            element.classList.add('selected');
            element.classList.add('pulse');
            
            // Optionen anzeigen
            const modalContent = document.getElementById('action-content');
            const actionButtons = modalContent.querySelector('.action-buttons');
            
            // Falls die Buttons noch nicht existieren, hinzufügen
            if (!actionButtons) {
                const buttonsHTML = `
                    <div class="action-buttons animated-item fadeIn" style="margin-top: 1rem; display: flex; justify-content: space-between; animation-delay: 0.3s;">
                        <button class="action-btn" onclick="closeModals()">Abbrechen</button>
                        <button class="action-btn" onclick="startNegativeCampaign('${targetParty}')">Kampagne starten (180.000 €)</button>
                    </div>
                `;
                
                modalContent.innerHTML += buttonsHTML;
            }
        }
        
        // Funktion zum Starten einer Negativkampagne mit Animation
        function startNegativeCampaign(targetParty) {
            const action = actions.negative;
            const targetOption = action.generateOptions().find(option => option.id === targetParty);
            
            if (targetOption) {
                const actionObj = {
                    ...action,
                    id: 'negative'
                };
                
                // Animierte Anzeige vor der Ausführung
                showNotification(`Negativkampagne gegen ${gameState.partyNames[targetParty]} wird vorbereitet...`, 'info');
                
                // Kurze Verzögerung für besseres Erlebnis
                setTimeout(() => {
                    // Effekte anwenden
                    const success = applyActionEffects(actionObj, targetOption);
                    
                    if (success) {
                        // UI aktualisieren
                        updateUI();
                        
                        // Modal animiert schließen
                        const modal = document.getElementById('action-modal');
                        modal.classList.remove('show');
                        setTimeout(() => {
                            modal.style.display = 'none';
                        }, 300);
                    }
                }, 500);
            }
        }
        
        // Neue Funktion zur Wirtschaftssimulation mit Animation
        function simulateEconomy() {
            // Wirtschaftliche Faktoren leicht zufällig verändern
            if (!gameState.economicFactors) {
                gameState.economicFactors = {
                    inflation: Math.random() * 2 + 1, // 1-3% Inflation
                    growth: Math.random() * 3 + 0.5,  // 0.5-3.5% Wachstum
                    unemployment: Math.random() * 4 + 3 // 3-7% Arbeitslosigkeit
                };
            }
            
            // Vorherige Werte für Animation
            const previousEconomicFactors = { ...gameState.economicFactors };
            
            gameState.economicFactors.inflation += (Math.random() - 0.5) * 0.2;
            gameState.economicFactors.inflation = Math.max(0.5, Math.min(5, gameState.economicFactors.inflation));
            
            gameState.economicFactors.growth += (Math.random() - 0.5) * 0.3;
            gameState.economicFactors.growth = Math.max(-1, Math.min(4, gameState.economicFactors.growth));
            
            gameState.economicFactors.unemployment += (Math.random() - 0.5) * 0.3;
            gameState.economicFactors.unemployment = Math.max(2, Math.min(10, gameState.economicFactors.unemployment));
            
            // Auswirkungen der Wirtschaft auf die Umfragewerte
            // Regierende Parteien profitieren von guter Wirtschaft, leiden unter schlechter
            if (gameState.isInGovernment) {
                const economicEffect = (gameState.economicFactors.growth - gameState.economicFactors.inflation - (gameState.economicFactors.unemployment / 10)) * 0.1;
                gameState.polls[gameState.selectedParty] += economicEffect;
                gameState.resources.polls += economicEffect;
                
                if (Math.abs(economicEffect) > 0.1) {
                    const direction = economicEffect > 0 ? "positive" : "negative";
                    addLogEntry(`Die wirtschaftliche Entwicklung hat einen ${direction}n Einfluss auf deine Umfragewerte. (${economicEffect > 0 ? "+" : ""}${economicEffect.toFixed(2)}%)`);
                    
                    // Animation für den Umfragewert
                    const pollElement = document.getElementById('polls');
                    if (pollElement) {
                        pollElement.parentNode.classList.add(economicEffect > 0 ? 'pulse' : 'shake');
                        setTimeout(() => {
                            pollElement.parentNode.classList.remove(economicEffect > 0 ? 'pulse' : 'shake');
                        }, 1000);
                    }
                }
            }
            
            // Wirtschaftsindikatoren im Kalender aktualisieren mit Animation
            updateEconomicIndicators(previousEconomicFactors);
        }
        
        // Neue Funktion zum Animieren der Wirtschaftsindikatoren
        function updateEconomicIndicators(previous) {
            const calendarInfo = document.getElementById('calendar-info');
            if (!calendarInfo || !gameState.economicFactors) return;
            
            const inflationTrend = gameState.economicFactors.inflation > previous.inflation;
            const growthTrend = gameState.economicFactors.growth > previous.growth;
            const unemploymentTrend = gameState.economicFactors.unemployment > previous.unemployment;
            
            const economicTrend = (gameState.economicFactors.growth - gameState.economicFactors.inflation) > 0 ? "positiv" : "negativ";
            
            // Wirtschaftsindikatoren mit Trendpfeilen
            const inflationArrow = inflationTrend ? '↑' : '↓';
            const growthArrow = growthTrend ? '↑' : '↓';
            const unemploymentArrow = unemploymentTrend ? '↑' : '↓';
            
            // Farben für die Indikatoren
            const inflationColor = !inflationTrend ? 'green' : 'red'; // Niedrigere Inflation ist gut
            const growthColor = growthTrend ? 'green' : 'red'; // Höheres Wachstum ist gut
            const unemploymentColor = !unemploymentTrend ? 'green' : 'red'; // Niedrigere Arbeitslosigkeit ist gut
            
            calendarInfo.innerHTML = `
                <strong>Monat:</strong> ${getMonthName(gameState.currentMonth)} ${gameState.currentYear}<br>
                <strong>Zeit bis zur Wahl:</strong> ${gameState.monthsToElection} Monate<br>
                <strong>Nächste Debatte:</strong> In ${3 - (gameState.currentMonth % 3) || 3} Monaten<br>
                <strong>Wirtschaftstrend:</strong> <span style="color: ${economicTrend === 'positiv' ? 'green' : 'red'}" class="animated-item pulse">${economicTrend}</span><br>
                <strong>Inflation:</strong> <span style="color: ${inflationColor}" class="animated-item pulse">${gameState.economicFactors.inflation.toFixed(1)}% ${inflationArrow}</span><br>
                <strong>Wachstum:</strong> <span style="color: ${growthColor}" class="animated-item pulse">${gameState.economicFactors.growth.toFixed(1)}% ${growthArrow}</span><br>
                <strong>Arbeitslosigkeit:</strong> <span style="color: ${unemploymentColor}" class="animated-item pulse">${gameState.economicFactors.unemployment.toFixed(1)}% ${unemploymentArrow}</span><br>
                <strong>Wichtige Ereignisse:</strong> ${gameState.monthsToElection % 6 === 0 ? 'Parteitag diesen Monat' : 'Parteitag in ' + (6 - (gameState.monthsToElection % 6)) + ' Monaten'}
            `;
        }
        
        // Initialisierungslogik für den Spielzustand
        function initGameState() {
            // Wichtige Spielparameter hinzufügen
            gameState.currentTurn = 0;
            gameState.strategyBonus = 0;
            gameState.strategyBonusRemaining = 0;
            gameState.activityCounter = {};
            gameState.lastActionTurn = {};
            gameState.playerExclusions = [];
            
            // Wirtschaftliche Faktoren hinzufügen
            gameState.economicFactors = {
                inflation: Math.random() * 2 + 1, // 1-3% Inflation
                growth: Math.random() * 3 + 0.5,  // 0.5-3.5% Wachstum
                unemployment: Math.random() * 4 + 3 // 3-7% Arbeitslosigkeit
            };
        }
        
        // Verbesserte UI-Aktualisierung mit Animationen
        function updateUI() {
            // Ressourcen aktualisieren mit Animation
            const oldValues = {
                budget: document.getElementById('budget').textContent,
                members: document.getElementById('members').textContent,
                polls: document.getElementById('polls').textContent,
                media: document.getElementById('media').textContent,
                donations: document.getElementById('donations').textContent
            };
            
            // Neue Werte setzen und Animationen hinzufügen, wo sich Werte geändert haben
            const budgetEl = document.getElementById('budget');
            const newBudget = formatMoney(gameState.resources.budget);
            budgetEl.textContent = newBudget;
            if (oldValues.budget !== newBudget) {
                budgetEl.parentNode.classList.add('updated');
                setTimeout(() => {
                    budgetEl.parentNode.classList.remove('updated');
                }, 1000);
            }
            
            const membersEl = document.getElementById('members');
            const newMembers = formatNumber(gameState.resources.members);
            membersEl.textContent = newMembers;
            if (oldValues.members !== newMembers) {
                membersEl.parentNode.classList.add('updated');
                setTimeout(() => {
                    membersEl.parentNode.classList.remove('updated');
                }, 1000);
            }
            
            const pollsEl = document.getElementById('polls');
            const newPolls = gameState.resources.polls.toFixed(1) + '%';
            pollsEl.textContent = newPolls;
            if (oldValues.polls !== newPolls) {
                pollsEl.parentNode.classList.add('updated');
                setTimeout(() => {
                    pollsEl.parentNode.classList.remove('updated');
                }, 1000);
            }
            
            const mediaEl = document.getElementById('media');
            mediaEl.textContent = gameState.resources.media;
            if (oldValues.media !== gameState.resources.media) {
                mediaEl.parentNode.classList.add('updated');
                setTimeout(() => {
                    mediaEl.parentNode.classList.remove('updated');
                }, 1000);
            }
            
            const donationsEl = document.getElementById('donations');
            const newDonations = '+ ' + formatMoney(gameState.resources.donations) + '/Monat';
            donationsEl.textContent = newDonations;
            if (oldValues.donations !== newDonations) {
                donationsEl.parentNode.classList.add('updated');
                setTimeout(() => {
                    donationsEl.parentNode.classList.remove('updated');
                }, 1000);
            }
            
            // Umfragen aktualisieren mit Animation
            updatePollBars();
            
            // Spieler-Partei hervorheben
            if (gameState.selectedParty) {
                document.querySelectorAll('.poll-label').forEach(label => {
                    if (label.textContent === gameState.partyName) {
                        label.style.fontWeight = 'bold';
                        label.parentNode.style.border = '2px solid ' + gameState.partyColor;
                    }
                });
            }
            
            // Aktuellen Monat und Jahr anzeigen
            document.getElementById('current-turn').textContent = `Wahlkampf ${gameState.currentYear}: ${gameState.monthsToElection} Monate bis zur Wahl`;
            
            // Kalender aktualisieren
            updateCalendarInfo();
            
            // Aktionsknöpfe aktivieren/deaktivieren je nach Budget und Animation für deaktivierte Knöpfe
            updateActionButtons();
            
            // Themenpositionen aktualisieren
            updateIssueDescriptions();
            
            // Parteibeziehungen aktualisieren falls der Tab aktiv ist
            if (document.querySelector('[data-tab="relations"].active')) {
                updatePartyRelationsUI();
                updateCoalitionExclusionsUI();
            }
        }
        
        // Neue Funktion für animierte Umfragebalken
        function updatePollBars() {
            const pollBars = document.querySelectorAll('.sidebar .poll-results .poll-bar');
            let partyIndex = 0;
            for (const party in gameState.polls) {
                if (pollBars[partyIndex]) {
                    const progressBar = pollBars[partyIndex].querySelector('.progress-bar');
                    const percentage = pollBars[partyIndex].querySelector('.poll-percentage');
                    
                    // Alten Wert für Vergleich speichern
                    const oldWidth = progressBar.style.width;
                    const oldPercentage = percentage.textContent;
                    
                    // Neuen Wert setzen
                    const newPercentage = gameState.polls[party].toFixed(1) + '%';
                    progressBar.style.width = newPercentage;
                    percentage.textContent = newPercentage;
                    
                    // Animation nur wenn sich der Wert geändert hat
                    if (oldWidth !== newPercentage || oldPercentage !== newPercentage) {
                        // Progressbar animieren
                        progressBar.style.transition = 'width 1s ease-in-out';
                        
                        // Percentage animieren
                        percentage.classList.add('animated-item');
                        percentage.classList.add('pulse');
                        setTimeout(() => {
                            percentage.classList.remove('pulse');
                        }, 1000);
                    }
                }
                partyIndex++;
            }
        }
        
        // Neue Funktion zur Aktualisierung des Kalenders
        function updateCalendarInfo() {
            if (!gameState.economicFactors) return;
            
            const economicTrend = (gameState.economicFactors.growth - gameState.economicFactors.inflation) > 0 ? "positiv" : "negativ";
            document.getElementById('calendar-info').innerHTML = `
                <strong>Monat:</strong> ${getMonthName(gameState.currentMonth)} ${gameState.currentYear}<br>
                <strong>Zeit bis zur Wahl:</strong> ${gameState.monthsToElection} Monate<br>
                <strong>Nächste Debatte:</strong> In ${3 - (gameState.currentMonth % 3) || 3} Monaten<br>
                <strong>Wirtschaftstrend:</strong> <span style="color: ${economicTrend === 'positiv' ? 'green' : 'red'}">${economicTrend}</span><br>
                <strong>Inflation:</strong> ${gameState.economicFactors.inflation.toFixed(1)}%<br>
                <strong>Wachstum:</strong> ${gameState.economicFactors.growth.toFixed(1)}%<br>
                <strong>Arbeitslosigkeit:</strong> ${gameState.economicFactors.unemployment.toFixed(1)}%<br>
                <strong>Wichtige Ereignisse:</strong> ${gameState.monthsToElection % 6 === 0 ? 'Parteitag diesen Monat' : 'Parteitag in ' + (6 - (gameState.monthsToElection % 6)) + ' Monaten'}
            `;
        }
        
        // Neue Funktion zur Aktualisierung der Aktionsbuttons
        function updateActionButtons() {
            document.querySelectorAll('.actions .action-btn').forEach(btn => {
                const action = btn.getAttribute('data-action');
                if (action && actions[action]) {
                    let isDisabled = false;
                    
                    // Budget-Check
                    if (gameState.resources.budget < actions[action].cost) {
                        isDisabled = true;
                    }
                    
                    // Verfügbarkeitscheck
                    if (actions[action].availability && !actions[action].availability(gameState.monthsToElection)) {
                        isDisabled = true;
                    }
                    
                    // Cooldown-Check
                    if (actions[action].cooldown && gameState.lastActionTurn && gameState.lastActionTurn[action]) {
                        const turnsSinceLastAction = gameState.currentTurn - gameState.lastActionTurn[action];
                        if (turnsSinceLastAction < actions[action].cooldown) {
                            isDisabled = true;
                        }
                    }
                    
                    // Zustandsänderung mit Animation
                    if (btn.disabled !== isDisabled) {
                        if (isDisabled) {
                            btn.classList.add('shake');
                            setTimeout(() => {
                                btn.classList.remove('shake');
                            }, 300);
                        } else {
                            btn.classList.add('pulse');
                            setTimeout(() => {
                                btn.classList.remove('pulse');
                            }, 300);
                        }
                    }
                    
                    btn.disabled = isDisabled;
                    
                    // Visuellen Hinweis für Abklingzeit-Aktionen
                    if (actions[action].cooldown && gameState.lastActionTurn && gameState.lastActionTurn[action]) {
                        const turnsSinceLastAction = gameState.currentTurn - gameState.lastActionTurn[action];
                        if (turnsSinceLastAction < actions[action].cooldown) {
                            btn.style.opacity = "0.5";
                            btn.title = `Verfügbar in ${actions[action].cooldown - turnsSinceLastAction} Monaten`;
                        } else {
                            btn.style.opacity = "1";
                            btn.title = "";
                        }
                    }
                }
            });
        }
        
        function updateIssueDescriptions() {
            // Beschreibung für alle Themen aktualisieren
            document.querySelectorAll('.issue-card').forEach(card => {
                const issueKey = card.getAttribute('data-issue');
                if (issueKey && gameState.issues[issueKey]) {
                    const position = gameState.issues[issueKey].position;
                    const description = getIssueDescription(issueKey, position);
                    
                    // Beschreibung aktualisieren wenn das Element existiert
                    const descElement = card.querySelector('.issue-description');
                    if (descElement) {
                        // Alten Text speichern für Vergleich
                        const oldText = descElement.textContent;
                        const newText = 'Aktuelle Position: ' + description;
                        
                        if (oldText !== newText) {
                            descElement.textContent = newText;
                            descElement.classList.add('pulse');
                            setTimeout(() => {
                                descElement.classList.remove('pulse');
                            }, 500);
                        } else {
                            descElement.textContent = newText;
                        }
                    }
                }
            });
        }
        
        function getIssueDescription(issueKey, position) {
            // Beschreibung basierend auf der Position
            const descriptions = {
                economy: {
                    '-2': 'Starke staatliche Eingriffe in die Wirtschaft, höhere Steuern für Reiche, Umverteilung',
                    '-1': 'Mehr Regulierung, leicht höhere Steuern für obere Einkommen',
                    '0': 'Ausgewogene Wirtschaftspolitik zwischen Markt und Staat',
                    '1': 'Weniger Regulierung, Steuererleichterungen, mehr Freiheit für Unternehmen',
                    '2': 'Maximale Marktfreiheit, deutliche Steuersenkungen, minimale Staatseingriffe'
                },
                environment: {
                    '-2': 'Wirtschaftswachstum hat Vorrang vor Umweltschutz',
                    '-1': 'Pragmatische Umweltpolitik ohne wirtschaftliche Einschränkungen',
                    '0': 'Balance zwischen Umweltschutz und wirtschaftlichen Interessen',
                    '1': 'Ambitionierte Klimaziele, Förderung erneuerbarer Energien',
                    '2': 'Radikaler Umwelt- und Klimaschutz mit tiefgreifenden Reformen'
                },
                social: {
                    '-2': 'Starke Kürzung von Sozialleistungen, mehr Eigenverantwortung',
                    '-1': 'Moderate Reduzierung staatlicher Unterstützung',
                    '0': 'Ausgewogene Sozialpolitik',
                    '1': 'Ausbau des Sozialstaats, höhere Mindestlöhne',
                    '2': 'Umfassender Sozialstaat, starke Umverteilung'
                },
                security: {
                    '-2': 'Bürgerrechte über alles, starke Einschränkung von Sicherheitsbehörden',
                    '-1': 'Mehr Datenschutz, weniger Überwachung',
                    '0': 'Balance zwischen Sicherheit und Freiheit',
                    '1': 'Mehr Befugnisse für Polizei und Sicherheitsbehörden',
                    '2': 'Maximale Sicherheit, auch auf Kosten persönlicher Freiheiten'
                },migration: {
                    '-2': 'Sehr strenge Einwanderungspolitik, Abschiebungen forcieren',
                    '-1': 'Restriktive Einwanderungsregeln, Begrenzung der Zuwanderung',
                    '0': 'Gesteuerte Einwanderung nach wirtschaftlichen Kriterien',
                    '1': 'Offenere Migrationspolitik mit klaren Regeln',
                    '2': 'Sehr liberale Einwanderungspolitik, offene Grenzen'
                },
                digital: {
                    '-2': 'Skepsis gegenüber Digitalisierung, strenge Regulierung',
                    '-1': 'Vorsichtige Digitalisierung mit klaren Grenzen',
                    '0': 'Ausgewogene Digitalpolitik',
                    '1': 'Förderung der Digitalisierung in allen Bereichen',
                    '2': 'Umfassende digitale Transformation, maximale Innovation'
                }
            };
            
            return descriptions[issueKey][position.toString()];
        }
        
        function getPositionLabels(issueKey) {
            // Beschriftungen für die Extreme der Skala
            const labels = {
                economy: { left: 'Staat', right: 'Markt' },
                environment: { left: 'Wirtschaft', right: 'Umwelt' },
                social: { left: 'Eigenverantwortung', right: 'Solidarität' },
                security: { left: 'Freiheit', right: 'Sicherheit' },
                migration: { left: 'Restriktiv', right: 'Liberal' },
                digital: { left: 'Konservativ', right: 'Progressiv' }
            };
            
            return labels[issueKey];
        }
        
        // Event Handler und Spiel-Funktionen mit Animation
        function selectParty(party) {
            // Vorherige Auswahl entfernen
            document.querySelectorAll('.party-card').forEach(card => {
                card.classList.remove('selected');
            });
            
            // Neue Auswahl markieren mit Animation
            const selectedCard = document.querySelector(`.party-card[data-party="${party}"]`);
            selectedCard.classList.add('selected');
            
            // Party im Spielstatus speichern
            gameState.selectedParty = party;
            gameState.partyName = gameState.partyNames[party];
            
            // Parteifarbe speichern
            const partyColorVar = `--${party}-color`;
            gameState.partyColor = getComputedStyle(document.documentElement).getPropertyValue(partyColorVar);
            
            // Startknopf aktivieren mit Animation
            const startButton = document.getElementById('start-game');
            startButton.disabled = false;
            startButton.classList.add('pulse');
            setTimeout(() => {
                startButton.classList.remove('pulse');
            }, 500);
            
            // Parteipositionen laden
            for (const issue in gameState.partyPositions[party]) {
                if (gameState.issues[issue]) {
                    gameState.issues[issue].position = gameState.partyPositions[party][issue];
                }
            }
            
            // Umfragewerte aktualisieren
            gameState.resources.polls = gameState.polls[party];
            
            showNotification(`Du hast ${gameState.partyName} ausgewählt`, 'success');
        }
        
        function startGame() {
            if (!gameState.selectedParty) {
                showNotification('Bitte wähle zuerst eine Partei aus!', 'warning');
                return;
            }
            
            // Spieleinstellungen laden
            gameState.difficulty = document.getElementById('difficulty').value;
            gameState.maxCampaigns = parseInt(document.getElementById('campaigns').value);
            gameState.eventFrequency = document.getElementById('events').value;
            
            // Schwierigkeitsgrad anpassen
            if (gameState.difficulty === 'hard') {
                gameState.resources.budget *= 0.8;
                gameState.resources.polls -= 2;
            } else if (gameState.difficulty === 'easy') {
                gameState.resources.budget *= 1.2;
                gameState.resources.polls += 2;
            }
            
            // Neue Spielmechaniken initialisieren
            initGameState();
            
            // UI aktualisieren
            document.getElementById('party-name').textContent = gameState.partyName;
            updateUI();
            
            // Positions-Slider für die Themen erstellen
            setupPositionSliders();
            
            // Animation für den Übergang
            const startScreen = document.getElementById('start-screen');
            const gameScreen = document.getElementById('game-screen');
            
            startScreen.style.opacity = '0';
            startScreen.style.transform = 'translateY(-20px)';
            startScreen.style.transition = 'opacity 0.5s, transform 0.5s';
            
            setTimeout(() => {
                startScreen.style.display = 'none';
                gameScreen.style.display = 'block';
                
                // Setze anfängliche Werte für die Animation
                gameScreen.style.opacity = '0';
                gameScreen.style.transform = 'translateY(20px)';
                
                // Force reflow, damit die Animation korrekt startet
                void gameScreen.offsetWidth;
                
                // Animation starten
                gameScreen.style.opacity = '1';
                gameScreen.style.transform = 'translateY(0)';
                gameScreen.style.transition = 'opacity 0.5s, transform 0.5s';
            }, 500);
            
            // Startmeldung
            setTimeout(() => {
                addLogEntry(`Der Wahlkampf hat begonnen. Du führst ${gameState.partyName} in die Bundestagswahl ${gameState.currentYear}.`);
                
                // Wirtschaftliche Informationen
                addLogEntry(`Wirtschaftslage zu Beginn - Inflation: ${gameState.economicFactors.inflation.toFixed(1)}%, Wachstum: ${gameState.economicFactors.growth.toFixed(1)}%, Arbeitslosigkeit: ${gameState.economicFactors.unemployment.toFixed(1)}%`);
                
                // Erstes Ereignis verzögert anzeigen für besseres Spielerlebnis
                setTimeout(() => {
                    triggerRandomEvent();
                }, 1000);
            }, 1000);
        }
        
        function setupPositionSliders() {
            // Positions-Slider für jedes Thema einfügen
            document.querySelectorAll('.issue-card').forEach((card, index) => {
                const issueKey = card.getAttribute('data-issue');
                if (!issueKey) return;
                
                const labels = getPositionLabels(issueKey);
                
                // Verzögerung für gestaffelte Animation
                const delay = index * 0.1;
                
                // Positionswähler hinzufügen
                const slider = document.createElement('div');
                slider.className = 'position-slider animated-item slideInUp';
                slider.style.animationDelay = `${delay}s`;
                slider.innerHTML = `
                    <div class="position-labels">
                        <span class="position-left">${labels.left}</span>
                        <span class="position-value">Neutral</span>
                        <span class="position-right">${labels.right}</span>
                    </div>
                    <input type="range" min="-2" max="2" value="${gameState.issues[issueKey].position}" class="position-range" data-issue="${issueKey}" oninput="handlePositionChange(this)">
                    <div class="position-strength">
                        <span>Themenstärke: ${gameState.issues[issueKey].strength}</span>
                        <button class="position-strengthen" data-issue="${issueKey}" onclick="handleStrengthening(this)">Stärken</button>
                    </div>
                `;
                
                card.appendChild(slider);
            });
            
            // Anfangspositionen aktualisieren
            updatePositionLabelsUI();
        }
        
        function updatePositionLabelsUI() {
            document.querySelectorAll('.position-range').forEach(rangeInput => {
                const issueKey = rangeInput.getAttribute('data-issue');
                const position = parseInt(rangeInput.value);
                const labels = getPositionLabels(issueKey);
                
                // Positionswert als Text
                let posText;
                if (position === -2) posText = 'Stark ' + labels.left;
                else if (position === -1) posText = 'Eher ' + labels.left;
                else if (position === 0) posText = 'Neutral';
                else if (position === 1) posText = 'Eher ' + labels.right;
                else if (position === 2) posText = 'Stark ' + labels.right;
                
                // UI aktualisieren
                const valueLabel = rangeInput.previousElementSibling.querySelector('.position-value');
                if (valueLabel) {
                    valueLabel.textContent = posText;
                }
            });
        }
        
        function handlePositionChange(element) {
            const issueKey = element.getAttribute('data-issue');
            const newPosition = parseInt(element.value);
            const oldPosition = gameState.issues[issueKey].position;
            
            // Position im Spielstatus aktualisieren
            gameState.issues[issueKey].position = newPosition;
            
            // UI aktualisieren mit Animation
            const positionValueElem = element.previousElementSibling.querySelector('.position-value');
            if (positionValueElem) {
                positionValueElem.classList.add('changed');
                setTimeout(() => {
                    positionValueElem.classList.remove('changed');
                }, 500);
            }
            
            updatePositionLabelsUI();
            updateIssueDescriptions();
            
            // Umfragewerte anpassen basierend auf der Positionsänderung
            updatePollsBasedOnPosition(issueKey, newPosition);
            
            // Animation basierend auf Richtung der Änderung
            if (newPosition > oldPosition) {
                // Bewegung nach rechts
                const rightLabel = element.previousElementSibling.querySelector('.position-right');
                rightLabel.classList.add('pulse');
                setTimeout(() => {
                    rightLabel.classList.remove('pulse');
                }, 500);
            } else if (newPosition < oldPosition) {
                // Bewegung nach links
                const leftLabel = element.previousElementSibling.querySelector('.position-left');
                leftLabel.classList.add('pulse');
                setTimeout(() => {
                    leftLabel.classList.remove('pulse');
                }, 500);
            }
            
            // Log-Eintrag
            addLogEntry(`Du hast die Position zu ${getIssueName(issueKey)} geändert.`);
            
            // Spielstatus aktualisieren
            updateUI();
        }
        
        function updatePollsBasedOnPosition(issueKey, position) {
            // Auswirkung der Positionsänderung auf die Umfragewerte
            const impact = 0.2; // Basisauswirkung
            const strengthMultiplier = gameState.issues[issueKey].strength / 5; // Stärke verstärkt die Auswirkung
            
            // Für jede Partei berechnen, wie gut die neue Position zu ihrer Grundhaltung passt
            for (const party in gameState.polls) {
                // Parteiposition zu diesem Thema
                const partyPosition = gameState.partyPositions[party][issueKey];
                
                // Differenz zwischen Spieler- und Parteiposition
                const diff = Math.abs(position - partyPosition);
                
                // Auswirkung berechnen
                let pollChange = 0;
                
                if (party === gameState.selectedParty) {
                    // Eigene Partei - Kernwähler reagieren auf Abweichungen von Parteipositionen
                    if (diff === 0) {
                        pollChange = 0.3; // Stärkung der Kernwähler
                    } else if (diff === 1) {
                        pollChange = 0; // Keine Änderung bei leichter Abweichung
                    } else {
                        pollChange = -0.5; // Verlust bei starker Abweichung
                    }
                } else {
                    // Andere Parteien - können Wähler verlieren, wenn der Spieler ihre Position übernimmt
                    if (diff === 0) {
                        pollChange = -0.2; // Spieler nimmt Wähler weg
                    } else if (diff === 4) {
                        pollChange = 0.2; // Polarisierung hilft den Gegnern
                    }
                }
                
                // Auswirkung verstärken basierend auf Themenstärke
                pollChange *= impact * strengthMultiplier;
                
                // Umfragewerte anpassen
                gameState.polls[party] += pollChange;
                
                // Grenzen sicherstellen (0-60%)
                gameState.polls[party] = Math.max(0, Math.min(60, gameState.polls[party]));
            }
            
            // Spieler-Umfragewert aktualisieren
            gameState.resources.polls = gameState.polls[gameState.selectedParty];
        }
        
        function handleStrengthening(element) {
            const issueKey = element.getAttribute('data-issue');
            const currentStrength = gameState.issues[issueKey].strength;
            
            // Themenstärke kann nur erhöht werden, wenn Budget vorhanden
            const cost = 100000 * (currentStrength / 2);
            
            if (gameState.resources.budget >= cost && currentStrength < 10) {
                // Budget reduzieren
                gameState.resources.budget -= cost;
                
                // Themenstärke erhöhen
                gameState.issues[issueKey].strength += 1;
                
                // Umfragewerte leicht verbessern
                gameState.polls[gameState.selectedParty] += 0.3;
                gameState.resources.polls += 0.3;
                
                // UI aktualisieren mit Animation
                const strengthSpan = element.previousElementSibling;
                strengthSpan.textContent = `Themenstärke: ${gameState.issues[issueKey].strength}`;
                strengthSpan.classList.add('pulse');
                setTimeout(() => {
                    strengthSpan.classList.remove('pulse');
                }, 500);
                
                // Animation für den Button
                element.classList.add('pulse');
                setTimeout(() => {
                    element.classList.remove('pulse');
                }, 500);
                
                // Log-Eintrag
                addLogEntry(`Du hast die Themenstärke zu ${getIssueName(issueKey)} erhöht.`);
                
                // Benachrichtigung
                showNotification(`Themenstärke zu ${getIssueName(issueKey)} erhöht auf ${gameState.issues[issueKey].strength}`, 'success');
                
                // Spielstatus aktualisieren
                updateUI();
            } else if (currentStrength >= 10) {
                showNotification('Maximale Themenstärke bereits erreicht!', 'warning');
                
                // Shake-Animation für den Button bei Fehler
                element.classList.add('shake');
                setTimeout(() => {
                    element.classList.remove('shake');
                }, 500);
            } else {
                showNotification(`Nicht genug Budget! Benötigt: ${formatMoney(cost)}`, 'error');
                
                // Shake-Animation für den Button bei Fehler
                element.classList.add('shake');
                setTimeout(() => {
                    element.classList.remove('shake');
                }, 500);
            }
        }
        
        function changeTab(tabName) {
            // Aktiven Tab entfernen
            document.querySelectorAll('.tab').forEach(tab => {
                tab.classList.remove('active');
            });
            document.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
            });
            
            // Neuen Tab aktivieren mit Animation
            const newTab = document.querySelector(`.tab[data-tab="${tabName}"]`);
            const newContent = document.querySelector(`.tab-content[data-tab="${tabName}"]`);
            
            newTab.classList.add('active');
            newContent.classList.add('active');
            
            // Besondere Aktionen für bestimmte Tabs
            if (tabName === 'relations') {
                updatePartyRelationsUI();
                updateCoalitionExclusionsUI();
            } else if (tabName === 'staff') {
                // Staffelung der Animation für Mitarbeiterkarten
                const staffCards = document.querySelectorAll('.staff-card');
                staffCards.forEach((card, index) => {
                    card.classList.remove('animated-item', 'slideInUp');
                    void card.offsetWidth; // Force reflow
                    card.style.animationDelay = `${index * 0.1}s`;
                    card.classList.add('animated-item', 'slideInUp');
                });
            } else if (tabName === 'regions') {
                // Staffelung der Animation für Bundesländer
                const states = document.querySelectorAll('.state');
                states.forEach((state, index) => {
                    state.classList.remove('animated-item', 'fadeIn');
                    void state.offsetWidth; // Force reflow
                    state.style.animationDelay = `${index * 0.05}s`;
                    state.classList.add('animated-item', 'fadeIn');
                });
            }
        }
        
        // Aktualisierte KI-Gegner-Logik mit Animation
// Aktualisierte KI-Gegner-Logik mit Animation
function simulateAIPartyActions() {
    // Nur für Parteien außer der Spielerpartei
    const otherParties = Object.keys(aiParties).filter(p => p !== gameState.selectedParty);
    
    // Zufällige Anzahl von Aktionen basierend auf der Spielschwierigkeit
    const actionsCount = {
        "easy": 1,
        "medium": 2,
        "hard": 3
    }[gameState.difficulty];
    
    // Ausgewählte Parteien, die in diesem Monat handeln
    const activeParties = otherParties
        .sort(() => 0.5 - Math.random())
        .slice(0, actionsCount);
    
    // Ankündigungslog zu Beginn für bessere Übersicht
    addLogEntry(`${activeParties.map(p => gameState.partyNames[p]).join(', ')} sind diesen Monat aktiv.`);
    
    // Für jede aktive Partei eine Aktion durchführen
    activeParties.forEach((party, index) => {
        // Kurze Verzögerung zwischen KI-Aktionen für besser lesbare Logs
        setTimeout(() => {
            // Taktische Entscheidung basierend auf der verbleibenden Zeit bis zur Wahl
            const useTacticalApproach = gameState.monthsToElection < 6;
            const partyStrength = gameState.polls[party];
            
            // KI wird aggressiver je nach Position
            let actionType;
            
            if (useTacticalApproach) {
                if (partyStrength > gameState.polls[gameState.selectedParty] + 5) {
                    // Führende Partei: Verteidigen der Position
                    actionType = "defensive";
                } else if (partyStrength < gameState.polls[gameState.selectedParty] - 5) {
                    // Schwächere Partei: Aggressivere Angriffe
                    actionType = "aggressive";
                } else {
                    // Nahe am Spieler: Fokussierte Angriffe
                    actionType = "targeted";
                }
            } else {
                // Früher im Wahlkampf: Aufbau der eigenen Stärke
                actionType = "building";
            }
            
            // Aggression bestimmt, ob die Partei angreift oder eigene Positionen stärkt
            // Reduzierte Aggressionswahrscheinlichkeit für mehr Balance
            const isAttack = useTacticalApproach ? 
                            (Math.random() < aiParties[party].aggression * 1.0) : // von 1.3 auf 1.0 reduziert
                            (Math.random() < aiParties[party].aggression * 0.5);  // von 0.6 auf 0.5 reduziert
            
            // Möglichkeit für negative Kampagnen
            const useNegativeCampaign = isAttack && Math.random() < 0.25 && gameState.monthsToElection < 9; // von 0.3 auf 0.25 reduziert
            
            if (useNegativeCampaign) {
                // Zielpartei auswählen (weniger wahrscheinlich den Spieler, mehr Verteilung)
                let targetParty;
                if (gameState.polls[gameState.selectedParty] > partyStrength && Math.random() < 0.4) { // von 0.7 auf 0.4 reduziert
                    // Angriff auf Spieler
                    targetParty = gameState.selectedParty;
                } else {
                    // Angriff auf eine andere starke Partei
                    const otherStrongParties = Object.entries(gameState.polls)
                        .filter(([p]) => p !== party && p !== gameState.selectedParty)
                        .sort((a, b) => b[1] - a[1]);
                    
                    if (otherStrongParties.length > 0) {
                        // Entweder die stärkste Partei oder manchmal eine zufällige andere
                        if (Math.random() < 0.7) {
                            targetParty = otherStrongParties[0][0];
                        } else {
                            // Eine zufällige Partei aus den Top 3
                            const targetIndex = Math.min(Math.floor(Math.random() * 3), otherStrongParties.length - 1);
                            targetParty = otherStrongParties[targetIndex][0];
                        }
                    } else {
                        targetParty = gameState.selectedParty; // Fallback auf Spieler
                    }
                }
                
                // Negativkampagne gegen Zielpartei durchführen
                const baseStrength = 0.6 + Math.random() * 0.3; // von 0.8/0.4 auf 0.6/0.3 reduziert
                const timeMultiplier = 1 + Math.max(0, (6 - gameState.monthsToElection) / 15); // von /12 auf /15 erhöht
                
                // Effekt auf die Zielpartei berechnen
                let effectOnTarget = -baseStrength * timeMultiplier;
                
                // Reduzierter Effekt wenn Spieler das Ziel ist
                if (targetParty === gameState.selectedParty) {
                    effectOnTarget = effectOnTarget * 0.7; // Effekt gegen Spieler um 30% reduziert
                }
                
                // Gewinn für die angreifende Partei
                const gainForAttacker = Math.abs(effectOnTarget) * 0.6; // von 0.7 auf 0.6 reduziert
                
                // Beziehung verschlechtern
                updatePartyRelationship(party, targetParty, -15);
                
                // Umfragewerte anpassen
                gameState.polls[targetParty] += effectOnTarget;
                gameState.polls[party] += gainForAttacker;
                
                // Sicherstellen, dass die Werte im gültigen Bereich bleiben
                gameState.polls[targetParty] = Math.max(0, Math.min(60, gameState.polls[targetParty]));
                gameState.polls[party] = Math.max(0, Math.min(60, gameState.polls[party]));
                
                // Spieler-Umfragewerte aktualisieren
                if (targetParty === gameState.selectedParty) {
                    gameState.resources.polls = gameState.polls[gameState.selectedParty];
                }
                
                // Animation der Umfragebalken aktualisieren
                updatePollBars();
                
                // Log-Eintrag mit Animation, wenn der Spieler angegriffen wird
                if (targetParty === gameState.selectedParty) {
                    addLogEntry(`${gameState.partyNames[party]} hat eine Negativkampagne gegen deine Partei gestartet. Du verlierst ${Math.abs(effectOnTarget).toFixed(1)}% Zustimmung.`, true);
                    
                    // Shake-Animation für den Spieler-Umfragewert
                    const pollElement = document.getElementById('polls');
                    if (pollElement) {
                        pollElement.parentNode.classList.add('shake');
                        setTimeout(() => {
                            pollElement.parentNode.classList.remove('shake');
                        }, 1000);
                    }
                } else {
                    addLogEntry(`${gameState.partyNames[party]} hat eine Negativkampagne gegen ${gameState.partyNames[targetParty]} gestartet.`);
                    
                    // Animation für den Umfragebalken der Zielpartei
                    const pollBars = document.querySelectorAll('.sidebar .poll-results .poll-bar');
                    pollBars.forEach(bar => {
                        const label = bar.querySelector('.poll-label');
                        if (label && label.textContent === gameState.partyNames[targetParty]) {
                            bar.classList.add('shake');
                            setTimeout(() => {
                                bar.classList.remove('shake');
                            }, 1000);
                        }
                    });
                }
                
            } else if (isAttack) {
                // Normaler Angriff auf den Spieler oder andere führende Parteien
                let attackTarget;
                
                // Wähle Angriffsziel fairer aus
                if (Math.random() < 0.4 && gameState.polls[gameState.selectedParty] > partyStrength) {
                    // 40% Chance, den Spieler anzugreifen, wenn er führt
                    attackTarget = gameState.selectedParty;
                } else {
                    // Sonst die führende Partei oder eine zufällige starke Partei angreifen
                    const leadingParties = Object.entries(gameState.polls)
                        .filter(([p]) => p !== party)
                        .sort((a, b) => b[1] - a[1]);
                    
                    // Entweder die stärkste Partei angreifen oder manchmal eine zufällige
                    if (Math.random() < 0.7) {
                        attackTarget = leadingParties[0][0];
                    } else {
                        // Eine zufällige Partei aus den Top 3 wählen
                        const targetIndex = Math.min(2, leadingParties.length - 1);
                        attackTarget = leadingParties[Math.floor(Math.random() * targetIndex)][0];
                    }
                }
                
                // Stärke des Angriffs ist höher je näher die Wahl ist, aber moderater
                const baseAttackStrength = 0.25 + Math.random() * 0.4; // von 0.3/0.5 auf 0.25/0.4 reduziert
                const timeMultiplier = 1 + Math.max(0, (18 - gameState.monthsToElection) / 12); // von /9 auf /12 erhöht
                let attackStrength = baseAttackStrength * timeMultiplier;
                
                // Reduzierter Effekt wenn Spieler das Ziel ist
                if (attackTarget === gameState.selectedParty) {
                    attackStrength = attackStrength * 0.8; // Effekt gegen Spieler um 20% reduziert
                }
                
                // Angriffe werden effektiver je später im Wahlkampf
                gameState.polls[attackTarget] -= attackStrength;
                gameState.polls[party] += attackStrength * 0.5; // von 0.6 auf 0.5 reduziert
                
                // Sicherstellen, dass die Werte im gültigen Bereich bleiben
                gameState.polls[attackTarget] = Math.max(0, Math.min(60, gameState.polls[attackTarget]));
                gameState.polls[party] = Math.max(0, Math.min(60, gameState.polls[party]));
                
                // Spieler-Umfragewerte aktualisieren
                if (attackTarget === gameState.selectedParty) {
                    gameState.resources.polls = gameState.polls[gameState.selectedParty];
                }
                
                // Animation der Umfragebalken aktualisieren
                updatePollBars();
                
                if (attackTarget === gameState.selectedParty) {
                    // Log-Eintrag mit Animation für Angriffe auf den Spieler
                    addLogEntry(`${gameState.partyNames[party]} kritisiert deine Partei und gewinnt ${(attackStrength * 0.5).toFixed(1)}% Wähler.`, true);
                    
                    // Shake-Animation für den Spieler-Umfragewert
                    const pollElement = document.getElementById('polls');
                    if (pollElement) {
                        pollElement.parentNode.classList.add('shake');
                        setTimeout(() => {
                            pollElement.parentNode.classList.remove('shake');
                        }, 1000);
                    }
                } else {
                    // Subtiler Angriff auf andere KI-Parteien
                    addLogEntry(`${gameState.partyNames[party]} greift ${gameState.partyNames[attackTarget]} an und gewinnt ${(attackStrength * 0.5).toFixed(1)}% Wähler.`);
                    
                    // Animation für den Umfragebalken der Zielpartei
                    const pollBars = document.querySelectorAll('.sidebar .poll-results .poll-bar');
                    pollBars.forEach(bar => {
                        const label = bar.querySelector('.poll-label');
                        if (label && label.textContent === gameState.partyNames[attackTarget]) {
                            bar.classList.add('shake');
                            setTimeout(() => {
                                bar.classList.remove('shake');
                            }, 1000);
                        }
                    });
                }
            } else {
                // Eigene Position stärken
                const baseGainStrength = 0.2 + Math.random() * 0.4;
                
                // Fokus auf Kernthemen gibt Bonus
                const focusThemes = aiParties[party].focus;
                const hasFocusEvent = Math.random() < 0.4; // 40% Chance für thematischen Fokus
                
                let gainStrength = baseGainStrength;
                let focusTheme = "";
                
                if (hasFocusEvent && focusThemes.length > 0) {
                    // Bonus für Fokus auf Kernthemen
                    const themeIndex = Math.floor(Math.random() * focusThemes.length);
                    focusTheme = focusThemes[themeIndex];
                    gainStrength *= 1.4;
                }
                
                // Fairere Verteilung der Verluste von anderen Parteien
                let lossFromPlayer = 0;
                if (gameState.polls[gameState.selectedParty] > gameState.polls[party]) {
                    // Reduzierter Verlust vom Spieler
                    lossFromPlayer = gainStrength * 0.3; // von 0.5 auf 0.3 reduziert
                    gameState.polls[gameState.selectedParty] -= lossFromPlayer;
                }
                
                // Rest gleichmäßiger von allen Parteien nehmen
                const otherLossPerParty = (gainStrength - lossFromPlayer) / (Object.keys(gameState.polls).length - 1);
                for (const otherParty in gameState.polls) {
                    if (otherParty !== party) {
                        // Weniger vom Spieler nehmen wenn wir schon direkt genommen haben
                        const adjustedLoss = otherParty === gameState.selectedParty ? otherLossPerParty * 0.5 : otherLossPerParty;
                        gameState.polls[otherParty] -= adjustedLoss;
                    }
                }
                
                // Partei gewinnt Stimmen
                gameState.polls[party] += gainStrength;
                
                // Sicherstellen, dass alle Werte im gültigen Bereich bleiben
                for (const p in gameState.polls) {
                    gameState.polls[p] = Math.max(0, Math.min(60, gameState.polls[p]));
                }
                
                // Spieler-Umfragewerte aktualisieren
                gameState.resources.polls = gameState.polls[gameState.selectedParty];
                
                // Animation der Umfragebalken aktualisieren
                updatePollBars();
                
                // Log-Eintrag mit Animation
                if (focusTheme) {
                    addLogEntry(`${gameState.partyNames[party]} gewinnt durch Fokus auf ${getIssueName(focusTheme)} ${gainStrength.toFixed(1)}% an Zustimmung.`);
                } else {
                    addLogEntry(`${gameState.partyNames[party]} gewinnt durch Kampagnenarbeit ${gainStrength.toFixed(1)}% an Zustimmung.`);
                }
                
                // Pulse-Animation für den Umfragebalken der aktiven Partei
                const pollBars = document.querySelectorAll('.sidebar .poll-results .poll-bar');
                pollBars.forEach(bar => {
                    const label = bar.querySelector('.poll-label');
                    if (label && label.textContent === gameState.partyNames[party]) {
                        bar.classList.add('pulse');
                        setTimeout(() => {
                            bar.classList.remove('pulse');
                        }, 1000);
                    }
                });
            }
            
            // UI aktualisieren nach jeder Partei-Aktion
            updateUI();
        }, index * 800); // Verzögerung zwischen KI-Aktionen für bessere Lesbarkeit der Logs
    });
    
    // KI-Parteien machen gelegentlich Koalitionsaussagen mit Verzögerung
    setTimeout(() => {
        simulateAICoalitionStatements();
    }, activeParties.length * 800 + 500);
}
        
        // KI-Parteien machen Koalitionsaussagen mit Animation
        function simulateAICoalitionStatements() {
            // Kurz vor der Wahl häufiger
            const baseProbability = gameState.monthsToElection < 6 ? 0.15 : 0.05;
            
            if (Math.random() < baseProbability) {
                // Zufällige KI-Partei auswählen
                const aiPartiesArray = Object.keys(aiParties).filter(p => p !== gameState.selectedParty);
                const party = aiPartiesArray[Math.floor(Math.random() * aiPartiesArray.length)];
                
                // Entscheiden, ob Koalitionsaussage oder Ausschluss
                const makeExclusion = Math.random() < 0.7; // 70% Chance für Ausschluss
                
                if (makeExclusion) {
                    // Partei für Ausschluss wählen
                    const potentialExclusions = Object.keys(gameState.polls)
                        .filter(p => p !== party)
                        .filter(p => !gameState.coalitionExclusions[party].includes(p))
                        .filter(p => {
                            const relation = getPartyRelationship(party, p);
                            return relation < -20; // Nur Parteien mit schlechten Beziehungen ausschließen
                        });
                    
                    if (potentialExclusions.length > 0) {
                        // Zufällige Partei zum Ausschließen wählen
                        const excludedParty = potentialExclusions[Math.floor(Math.random() * potentialExclusions.length)];
                        
                        // Ausschluss hinzufügen
                        gameState.coalitionExclusions[party].push(excludedParty);
                        
                        // Beziehung verschlechtern
                        updatePartyRelationship(party, excludedParty, -20);
                        
                        // Log-Eintrag mit Animation
                        const isPlayerExcluded = excludedParty === gameState.selectedParty;
                        if (isPlayerExcluded) {
                            addLogEntry(`${gameState.partyNames[party]} hat öffentlich erklärt, nicht mit deiner Partei koalieren zu wollen.`, true);
                            
                            // Shake-Animation für den Beziehungswert, falls im Beziehungstab
                            const relationElements = document.querySelectorAll('#party-relations .party-relationship');
                            relationElements.forEach(elem => {
                                if (elem.querySelector('strong').textContent === gameState.partyNames[party]) {
                                    elem.classList.add('shake');
                                    setTimeout(() => {
                                        elem.classList.remove('shake');
                                    }, 1000);
                                }
                            });
                        } else {
                            addLogEntry(`${gameState.partyNames[party]} hat eine Koalition mit ${gameState.partyNames[excludedParty]} ausgeschlossen.`);
                        }
                    }
                } else {
                    // Wunschkoalition nennen
                    const potentialPartners = Object.keys(gameState.polls)
                        .filter(p => p !== party)
                        .filter(p => !gameState.coalitionExclusions[party].includes(p))
                        .filter(p => {
                            const relation = getPartyRelationship(party, p);
                            return relation > 20; // Nur Parteien mit guten Beziehungen als Partner nennen
                        });
                    
                    if (potentialPartners.length > 0) {
                        // Zufälligen Partner wählen
                        const partner = potentialPartners[Math.floor(Math.random() * potentialPartners.length)];
                        
                        // Beziehung verbessern
                        updatePartyRelationship(party, partner, 15);
                        
                        // Log-Eintrag mit Animation
                        const isPlayerPartner = partner === gameState.selectedParty;
                        if (isPlayerPartner) {
                            addLogEntry(`${gameState.partyNames[party]} hat deine Partei als bevorzugten Koalitionspartner genannt.`, true);
                            
                            // Pulse-Animation für den Beziehungswert, falls im Beziehungstab
                            const relationElements = document.querySelectorAll('#party-relations .party-relationship');
                            relationElements.forEach(elem => {
                                if (elem.querySelector('strong').textContent === gameState.partyNames[party]) {
                                    elem.classList.add('pulse');
                                    setTimeout(() => {
                                        elem.classList.remove('pulse');
                                    }, 1000);
                                }
                            });
                        } else {
                            addLogEntry(`${gameState.partyNames[party]} hat ${gameState.partyNames[partner]} als bevorzugten Koalitionspartner genannt.`);
                        }
                    }
                }
            }
        }
        
        // Verbesserte nextTurn-Funktion mit Animationen
        function nextTurn() {
            // Verhindert, dass der Button mehrfach geklickt wird
            if (gameState.isProcessingMonth) return;
            
            // Status setzen
            gameState.isProcessingMonth = true;
            document.getElementById('next-turn').disabled = true;
            
            // Animation für den "Nächster Monat"-Button
            const nextTurnButton = document.getElementById('next-turn');
            nextTurnButton.classList.add('pulse');
            setTimeout(() => {nextTurnButton.classList.remove('pulse');
            }, 500);
            
            // Zeit fortschreiten lassen
            gameState.monthsToElection--;
            gameState.currentMonth++;
            gameState.currentTurn++;
            
            if (gameState.currentMonth > 12) {
                gameState.currentMonth = 1;
                gameState.currentYear++;
            }
            
            // Log-Eintrag mit Animation
            addLogEntry(`Neuer Monat: ${getMonthName(gameState.currentMonth)} ${gameState.currentYear}. Noch ${gameState.monthsToElection} Monate bis zur Wahl.`);
            
            // Visuelles Feedback für den Monatswechsel
            const calendarInfo = document.getElementById('calendar-info');
            calendarInfo.classList.add('pulse');
            setTimeout(() => {
                calendarInfo.classList.remove('pulse');
            }, 1000);
            
            // Wirtschaftssimulation mit Animation - kleine Schwankungen
            simulateEconomy();
            
            // Monatliche Ressourcen aktualisieren mit wirtschaftlichen Faktoren und Animation
            const economicMultiplier = 1 + ((gameState.economicFactors.growth - gameState.economicFactors.inflation) / 100);
            const oldBudget = gameState.resources.budget;
            gameState.resources.budget += Math.round(gameState.resources.donations * economicMultiplier);
            
            // Animation für Budgetänderung
            const budgetElem = document.getElementById('budget');
            if (budgetElem) {
                budgetElem.parentNode.classList.add('updated');
                setTimeout(() => {
                    budgetElem.parentNode.classList.remove('updated');
                }, 1000);
            }
            
            // UI aktualisieren
            updateUI();
            
            // KI-Parteien handeln lassen mit Verzögerung für bessere Lesbarkeit
            setTimeout(() => {
                simulateAIPartyActions();
                
                // Zufällige negative Ereignisse mit Verzögerung
                setTimeout(() => {
                    triggerRandomNegativeEvent();
                    
                    // Zufälliges (normales) Ereignis mit Verzögerung
                    const eventDelay = Math.random() < getEventProbability() ? 1000 : 0;
                    
                    setTimeout(() => {
                        // Wahlsimulation
                        if (gameState.monthsToElection === 0) {
                            simulateElection();
                            showElectionResults();
                        } else {
                            // Zufälliges Ereignis anzeigen wenn nötig
                            if (eventDelay > 0) {
                                triggerRandomEvent();
                            }
                            
                            // Status zurücksetzen
                            gameState.isProcessingMonth = false;
                            document.getElementById('next-turn').disabled = false;
                        }
                    }, eventDelay + 500);
                }, 1000);
            }, 1000);
        }
        
        function getEventProbability() {
            // Wahrscheinlichkeit für Ereignisse basierend auf Einstellungen
            const baseProb = 0.3;
            
            switch (gameState.eventFrequency) {
                case 'low': return baseProb * 0.5;
                case 'medium': return baseProb;
                case 'high': return baseProb * 1.5;
                default: return baseProb;
            }
        }
        
        // Modifizierte Funktion für zufällige negative Ereignisse mit Animation
        function triggerRandomNegativeEvent() {
            // Wahrscheinlichkeit für negative Ereignisse (höhere Schwierigkeit = mehr Ereignisse)
            const baseProb = {
                "easy": 0.15,
                "medium": 0.25,
                "hard": 0.35
            }[gameState.difficulty];
            
            // Je näher an der Wahl, desto höher die Wahrscheinlichkeit für skandalöse Ereignisse
            const timeModifier = Math.min(1.5, 1 + ((18 - gameState.monthsToElection) / 36));
            const finalProb = baseProb * timeModifier;
            
            // Zufällige Entscheidung, ob ein negatives Ereignis auftritt
            if (Math.random() < finalProb) {
                // Zufälliges Ereignis auswählen
                const eventIndex = Math.floor(Math.random() * negativeEvents.length);
                const randomEvent = negativeEvents[eventIndex];
                
                // Effekt berechnen (falls dynamisch)
                let effect = randomEvent.effect;
                let description = randomEvent.description;
                
                if (typeof effect === 'function') {
                    effect = effect();
                }
                
                if (randomEvent.getEffect) {
                    const result = randomEvent.getEffect();
                    effect = result.effect;
                    description = result.description;
                }
                
                // Effekte verstärken sich je näher die Wahl rückt
                if (effect.polls && effect.polls < 0) {
                    const timeMultiplier = 1 + Math.max(0, (18 - gameState.monthsToElection) / 18);
                    effect.polls *= timeMultiplier;
                }
                
                // Effekte anwenden
                applyEffects(effect);
                
                // Log-Eintrag mit Animation
                addLogEntry(`Negatives Ereignis: ${randomEvent.title} - ${description}`, true);
                
                // Benachrichtigung mit Animation
                showNotification(`${randomEvent.title}: ${description}`, 'warning');
                
                // UI aktualisieren
                updateUI();
                
                // Zusätzliche Animation für besonders starke Effekte
                if (effect.polls && effect.polls < -1.5) {
                    // Shake-Animation für den Umfragewert
                    const pollElement = document.getElementById('polls');
                    if (pollElement) {
                        pollElement.parentNode.classList.add('shake');
                        setTimeout(() => {
                            pollElement.parentNode.classList.remove('shake');
                        }, 1000);
                    }
                }
            }
        }
        
        // Verbesserte Funktion für zufällige Ereignisse mit Animation
        function triggerRandomEvent() {
            // Zufälliges Ereignis auswählen
            let randomEvent;
            
            // Manche Ereignisse haben besondere Bedingungen
            const eligibleEvents = events.filter(event => {
                // Prüfen, ob das Ereignis eine getOptions-Funktion hat und ob diese funktioniert
                if (event.getOptions) {
                    const options = event.getOptions();
                    return options.length > 0 && options[0].id !== 'none';
                }
                return true;
            });
            
            if (eligibleEvents.length > 0) {
                randomEvent = eligibleEvents[Math.floor(Math.random() * eligibleEvents.length)];
            } else {
                // Sollte nicht passieren, aber als Fallback
                randomEvent = events[Math.floor(Math.random() * events.length)];
            }
            
            // Optionen für das Ereignis generieren, falls notwendig
            let options = randomEvent.options;
            if (randomEvent.getOptions) {
                options = randomEvent.getOptions();
                // Aktualisiere die Beschreibung, falls sie dynamisch ist
                if (randomEvent.description !== randomEvent.originalDescription) {
                    randomEvent.originalDescription = randomEvent.originalDescription || randomEvent.description;
                }
            }
            
            // Event-Modal anzeigen mit Animation
            const modal = document.getElementById('event-modal');
            modal.style.display = 'flex';
            
            // Kleine Verzögerung für sanfte Überblendung
            setTimeout(() => {
                modal.classList.add('show');
            }, 10);
            
            // Modal-Inhalt füllen mit Animationen
            const modalContent = document.getElementById('event-content');
            modalContent.innerHTML = `
                <h4 class="animated-item fadeIn">${randomEvent.title}</h4>
                <p class="animated-item fadeIn" style="animation-delay: 0.1s;">${randomEvent.description}</p>
                
                <div style="margin-top: 1rem;">
                    ${options.map((option, index) => {
                        const delay = (index + 1) * 0.1 + 0.1;
                        return `
                            <button class="action-btn event-option animated-item slideInUp" data-event="${randomEvent.id}" data-option="${option.id}" style="margin-top: 0.5rem; width: 100%; animation-delay: ${delay}s;" onclick="handleEventOption(this)">
                                ${option.text}
                            </button>
                        `;
                    }).join('')}
                </div>
            `;
            
            // Log-Eintrag mit Animation
            addLogEntry(`Neues Ereignis: ${randomEvent.title}`, true);
        }
        
        // Verbesserte Funktion zum Behandeln von Ereignisoptionen mit Animation
        function handleEventOption(element) {
            const eventId = element.getAttribute('data-event');
            const optionId = element.getAttribute('data-option');
            
            // Visuelle Rückmeldung für den geklickten Button
            element.classList.add('pulse');
            
            // Event und Option finden
            const selectedEvent = events.find(event => event.id === eventId);
            let selectedOption;
            
            // Optionen können dynamisch sein
            if (selectedEvent.getOptions) {
                selectedOption = selectedEvent.getOptions().find(option => option.id === optionId);
            } else {
                selectedOption = selectedEvent.options.find(option => option.id === optionId);
            }
            
            // Kurze Verzögerung für besseres Benutzererlebnis
            setTimeout(() => {
                // Effekte anwenden
                applyEffects(selectedOption.effect);
                
                // UI aktualisieren
                updateUI();
                
                // Modal animiert schließen
                const modal = document.getElementById('event-modal');
                modal.classList.remove('show');
                setTimeout(() => {
                    modal.style.display = 'none';
                }, 300);
                
                // Log-Eintrag mit Animation
                addLogEntry(`Du hast dich bei "${selectedEvent.title}" für "${selectedOption.text}" entschieden.`);
                
                // Benachrichtigung mit Animation
                showNotification(`Entscheidung getroffen: ${selectedOption.text}`, 'info');
                
                // Falls wir im Monats-Prozess sind, nächsten Monat-Button wieder aktivieren
                if (gameState.isProcessingMonth) {
                    gameState.isProcessingMonth = false;
                    document.getElementById('next-turn').disabled = false;
                }
            }, 300);
        }
        
        // Aktualisierte Funktion für die Handhabung von Aktionen mit Animation
        function handleActionOption(element) {
            const actionType = element.getAttribute('data-action');
            const optionId = element.getAttribute('data-option');
            
            // Visuelle Rückmeldung für den geklickten Button
            element.classList.add('pulse');
            
            // Aktion und Option finden
            const action = actions[actionType];
            let option;
            
            // Dynamische Optionen für bestimmte Aktionen
            if (actionType === 'negative' || actionType === 'coalition') {
                option = action.generateOptions().find(opt => opt.id === optionId);
            } else {
                option = action.options.find(opt => opt.id === optionId);
            }
            
            // Aktionsobjekt erweitern
            const actionObj = {
                ...action,
                id: actionType
            };
            
            // Kurze Verzögerung für besseres Benutzererlebnis
            setTimeout(() => {
                // Effekte anwenden
                const success = applyActionEffects(actionObj, option);
                
                if (success) {
                    // UI aktualisieren
                    updateUI();
                    
                    // Modal schließen, falls keine besondere Aktion ausgeführt wird
                    if (!option.action) {
                        // Modal animiert schließen
                        const modal = document.getElementById('action-modal');
                        modal.classList.remove('show');
                        setTimeout(() => {
                            modal.style.display = 'none';
                        }, 300);
                        
                        // Log-Eintrag mit Animation
                        addLogEntry(`Du hast die Aktion "${action.title}" mit der Option "${option.text}" durchgeführt.`);
                        
                        // Benachrichtigung mit Animation
                        showNotification(`Aktion durchgeführt: ${option.text}`, 'success');
                    }
                }
            }, 300);
        }
        
        // Verbesserte Funktion zum Schließen von Modals mit Animation
        function closeModals() {
            // Alle Modals animiert schließen
            document.querySelectorAll('.modal').forEach(modal => {
                modal.classList.remove('show');
                setTimeout(() => {
                    modal.style.display = 'none';
                }, 300);
            });
        }
        
        // Verbesserte Funktion zum Anwenden von Effekten mit Animation
        function applyEffects(effects) {
            // Budget-Effekte mit Animation
            if (effects.budget) {
                const oldBudget = gameState.resources.budget;
                gameState.resources.budget += effects.budget;
                
                // Animation für Budgetänderung
                const budgetDiff = gameState.resources.budget - oldBudget;
                const budgetElem = document.getElementById('budget');
                
                if (budgetElem) {
                    if (budgetDiff > 0) {
                        budgetElem.parentNode.classList.add('pulse');
                    } else if (budgetDiff < 0) {
                        budgetElem.parentNode.classList.add('shake');
                    }
                    
                    setTimeout(() => {
                        budgetElem.parentNode.classList.remove('pulse', 'shake');
                    }, 1000);
                }
            }
            
            // Mitglieder-Effekte mit Animation
            if (effects.members) {
                const oldMembers = gameState.resources.members;
                gameState.resources.members += effects.members;
                
                // Animation für Mitgliederänderung
                const membersDiff = gameState.resources.members - oldMembers;
                const membersElem = document.getElementById('members');
                
                if (membersElem) {
                    if (membersDiff > 0) {
                        membersElem.parentNode.classList.add('pulse');
                    } else if (membersDiff < 0) {
                        membersElem.parentNode.classList.add('shake');
                    }
                    
                    setTimeout(() => {
                        membersElem.parentNode.classList.remove('pulse', 'shake');
                    }, 1000);
                }
            }
            
            // Spenden-Effekte mit Animation
            if (effects.donations) {
                const oldDonations = gameState.resources.donations;
                gameState.resources.donations += effects.donations;
                
                // Animation für Spendenänderung
                const donationsDiff = gameState.resources.donations - oldDonations;
                const donationsElem = document.getElementById('donations');
                
                if (donationsElem) {
                    if (donationsDiff > 0) {
                        donationsElem.parentNode.classList.add('pulse');
                    } else if (donationsDiff < 0) {
                        donationsElem.parentNode.classList.add('shake');
                    }
                    
                    setTimeout(() => {
                        donationsElem.parentNode.classList.remove('pulse', 'shake');
                    }, 1000);
                }
            }
            
            // Umfrage-Effekte mit Animation
            if (effects.polls) {
                // Falls spezifische Parteien betroffen sind
                if (typeof effects.polls === 'object') {
                    for (const party in effects.polls) {
                        if (party === 'all') {
                            // Alle Parteien betroffen
                            for (const p in gameState.polls) {
                                if (p === gameState.selectedParty) {
                                    const oldPolls = gameState.polls[p];
                                    gameState.polls[p] += effects.polls.all;
                                    gameState.resources.polls += effects.polls.all;
                                    
                                    // Animation für Änderung der eigenen Umfragewerte
                                    const pollsDiff = gameState.polls[p] - oldPolls;
                                    const pollsElem = document.getElementById('polls');
                                    
                                    if (pollsElem) {
                                        if (pollsDiff > 0) {
                                            pollsElem.parentNode.classList.add('pulse');
                                        } else if (pollsDiff < 0) {
                                            pollsElem.parentNode.classList.add('shake');
                                        }
                                        
                                        setTimeout(() => {
                                            pollsElem.parentNode.classList.remove('pulse', 'shake');
                                        }, 1000);
                                    }
                                } else {
                                    gameState.polls[p] += effects.polls.all / 2;
                                }
                            }
                        } else if (party === gameState.selectedParty) {
                            // Spielerpartei betroffen
                            const oldPolls = gameState.polls[party];
                            gameState.polls[party] += effects.polls[party];
                            gameState.resources.polls += effects.polls[party];
                            
                            // Animation für Änderung der eigenen Umfragewerte
                            const pollsDiff = gameState.polls[party] - oldPolls;
                            const pollsElem = document.getElementById('polls');
                            
                            if (pollsElem) {
                                if (pollsDiff > 0) {
                                    pollsElem.parentNode.classList.add('pulse');
                                } else if (pollsDiff < 0) {
                                    pollsElem.parentNode.classList.add('shake');
                                }
                                
                                setTimeout(() => {
                                    pollsElem.parentNode.classList.remove('pulse', 'shake');
                                }, 1000);
                            }
                        } else {
                            // Andere Partei betroffen
                            const oldPolls = gameState.polls[party];
                            gameState.polls[party] += effects.polls[party];
                            
                            // Animation für die betroffene Partei in der Umfrageleiste
                            const pollsDiff = gameState.polls[party] - oldPolls;
                            
                            const pollBars = document.querySelectorAll('.sidebar .poll-results .poll-bar');
                            pollBars.forEach(bar => {
                                const label = bar.querySelector('.poll-label');
                                if (label && label.textContent === gameState.partyNames[party]) {
                                    if (pollsDiff > 0) {
                                        bar.classList.add('pulse');
                                    } else if (pollsDiff < 0) {
                                        bar.classList.add('shake');
                                    }
                                    
                                    setTimeout(() => {
                                        bar.classList.remove('pulse', 'shake');
                                    }, 1000);
                                }
                            });
                        }
                    }
                } else {
                    // Allgemeiner Umfrage-Effekt nur für Spielerpartei
                    const oldPolls = gameState.polls[gameState.selectedParty];
                    gameState.polls[gameState.selectedParty] += effects.polls;
                    gameState.resources.polls += effects.polls;
                    
                    // Animation für Änderung der eigenen Umfragewerte
                    const pollsDiff = gameState.polls[gameState.selectedParty] - oldPolls;
                    const pollsElem = document.getElementById('polls');
                    
                    if (pollsElem) {
                        if (pollsDiff > 0) {
                            pollsElem.parentNode.classList.add('pulse');
                        } else if (pollsDiff < 0) {
                            pollsElem.parentNode.classList.add('shake');
                        }
                        
                        setTimeout(() => {
                            pollsElem.parentNode.classList.remove('pulse', 'shake');
                        }, 1000);
                    }
                }
                
                // Sicherstellen, dass keine Partei unter 0% oder über 60% kommt
                for (const party in gameState.polls) {
                    gameState.polls[party] = Math.max(0, Math.min(60, gameState.polls[party]));
                }
                
                // Spieler-Umfragewert aktualisieren
                gameState.resources.polls = gameState.polls[gameState.selectedParty];
                
                // Umfragebalken animiert aktualisieren
                updatePollBars();
            }
            
            // Medienresonanz-Effekte mit Animation
            if (effects.media) {
                const mediaValues = ["Sehr niedrig", "Niedrig", "Mittel", "Hoch", "Sehr hoch"];
                const currentIndex = mediaValues.indexOf(gameState.resources.media);
                let newIndex = currentIndex + effects.media;
                
                // Index im gültigen Bereich halten
                newIndex = Math.max(0, Math.min(mediaValues.length - 1, newIndex));
                
                // Medienresonanz aktualisieren mit Animation
                const oldMedia = gameState.resources.media;
                gameState.resources.media = mediaValues[newIndex];
                
                if (oldMedia !== gameState.resources.media) {
                    const mediaElem = document.getElementById('media');
                    if (mediaElem) {
                        if (newIndex > currentIndex) {
                            mediaElem.parentNode.classList.add('pulse');
                        } else if (newIndex < currentIndex) {
                            mediaElem.parentNode.classList.add('shake');
                        }
                        
                        setTimeout(() => {
                            mediaElem.parentNode.classList.remove('pulse', 'shake');
                        }, 1000);
                    }
                }
            }
            
            // Themen-Effekte mit Animation
            for (const issue in gameState.issues) {
                if (effects[issue]) {
                    const oldStrength = gameState.issues[issue].strength;
                    gameState.issues[issue].strength += effects[issue];
                    gameState.issues[issue].strength = Math.max(1, Math.min(10, gameState.issues[issue].strength));
                    
                    // Animation für Themenkarten, wenn sie sichtbar sind
                    const issueCard = document.querySelector(`.issue-card[data-issue="${issue}"]`);
                    if (issueCard) {
                        if (gameState.issues[issue].strength > oldStrength) {
                            issueCard.classList.add('pulse');
                        } else if (gameState.issues[issue].strength < oldStrength) {
                            issueCard.classList.add('shake');
                        }
                        
                        setTimeout(() => {
                            issueCard.classList.remove('pulse', 'shake');
                        }, 1000);
                    }
                    
                    // Animation für die Positionsstärke, wenn sichtbar
                    const strengthSpan = document.querySelector(`.position-strength span[data-issue="${issue}"]`);
                    if (strengthSpan) {
                        strengthSpan.textContent = `Themenstärke: ${gameState.issues[issue].strength}`;
                        
                        if (gameState.issues[issue].strength > oldStrength) {
                            strengthSpan.classList.add('pulse');
                        } else if (gameState.issues[issue].strength < oldStrength) {
                            strengthSpan.classList.add('shake');
                        }
                        
                        setTimeout(() => {
                            strengthSpan.classList.remove('pulse', 'shake');
                        }, 1000);
                    }
                }
            }
        }
        
        // Verbesserte Simulation der Wahl mit Animation
        function simulateElection() {
            // Umfragewerte als Basis nehmen
            const electionResults = {...gameState.polls};
            
            // Zufällige Schwankungen hinzufügen (+/- 2%)
            for (const party in electionResults) {
                // Verschiedene Faktoren berücksichtigen
                const leadBonus = party === gameState.selectedParty && gameState.isChancellor ? 0.5 : 0; // Amtsinhabervorteil
                const aiPartyBonus = gameState.selectedParty !== party && aiParties[party] ? aiParties[party].leaderAppeal * 0.5 : 0; // KI-Parteiführer-Bonus
                const randomFactor = (Math.random() * 4) - 2; // Basis-Schwankung
                
                const totalSwing = randomFactor + leadBonus + aiPartyBonus;
                electionResults[party] = Math.max(0, electionResults[party] + totalSwing);
            }
            
            // Prozente normalisieren auf exakt 100%
            let total = 0;
            for (const party in electionResults) {
                total += electionResults[party];
            }
            
            // Normalisierung mit exakter Summierung zu 100%
            let normalizedTotal = 0;
            const partyKeys = Object.keys(electionResults);
            
            // Alle Parteien außer der letzten normalisieren und runden
            for (let i = 0; i < partyKeys.length - 1; i++) {
                const party = partyKeys[i];
                const normalizedValue = parseFloat(((electionResults[party] * 100) / total).toFixed(1));
                electionResults[party] = normalizedValue;
                normalizedTotal += normalizedValue;
            }
            
            // Die letzte Partei bekommt den Rest auf 100%
            const lastParty = partyKeys[partyKeys.length - 1];
            electionResults[lastParty] = parseFloat((100 - normalizedTotal).toFixed(1));
            
            // Sicherstellen, dass keine negativen Werte entstehen
            if (electionResults[lastParty] < 0) {
                // Falls negativ, Umverteilung der Werte
                electionResults[lastParty] = 0.1; // Mindestens 0.1%
                
                // Restliche Parteien neu normalisieren
                let remainingTotal = 0;
                for (let i = 0; i < partyKeys.length - 1; i++) {
                    remainingTotal += electionResults[partyKeys[i]];
                }
                
                for (let i = 0; i < partyKeys.length - 1; i++) {
                    const party = partyKeys[i];
                    electionResults[party] = parseFloat(((electionResults[party] * (99.9 - 0.1)) / remainingTotal).toFixed(1));
                }
            }
            
            // Ergebnisse im Spielstatus speichern
            gameState.electionResults = electionResults;
            
            // Log-Eintrag für die Wahlergebnisse
            addLogEntry(`Die Bundestagswahl ${gameState.currentYear} ist beendet.`, true);
        }
        
        function calculateCoalitions() {
            const results = gameState.electionResults;
            const selectedParty = gameState.selectedParty;
            const coalitions = [];
            
            // Parteien über der 5%-Hürde sammeln
            const qualifiedParties = {};
            for (const party in results) {
                if (results[party] >= 5) {
                    qualifiedParties[party] = results[party];
                }
            }
            
            // Prüfen, ob die Spielerpartei die 5%-Hürde genommen hat
            if (!qualifiedParties[selectedParty]) {
                coalitions.push({
                    name: "Keine Koalitionsoption",
                    parties: [selectedParty],
                    total: results[selectedParty],
                    playerIsLeader: false,
                    playerInGovernment: false,
                    description: "Deine Partei hat die 5%-Hürde nicht geschafft und ist nicht im Bundestag vertreten."
                });
                return coalitions;
            }
            
            // Koalitionsausschlüsse berücksichtigen
            function isCoalitionPossible(parties) {
                // Alle Kombinationen prüfen
                for (let i = 0; i < parties.length; i++) {
                    for (let j = i + 1; j < parties.length; j++) {
                        const party1 = parties[i];
                        const party2 = parties[j];
                        
                        // Gegenseitige Ausschlüsse prüfen
                        if (gameState.coalitionExclusions[party1].includes(party2) || 
                            gameState.coalitionExclusions[party2].includes(party1) ||
                            (party1 === selectedParty && gameState.playerExclusions.includes(party2)) ||
                            (party2 === selectedParty && gameState.playerExclusions.includes(party1))) {
                            return false;
                        }
                    }
                }
                
                return true;
            }
            
            // Alle möglichen Zweierbündnisse berechnen
            const possibleTwoPartyCoalitions = [];
            const allParties = Object.keys(qualifiedParties);
            
            for (let i = 0; i < allParties.length; i++) {
                for (let j = i + 1; j < allParties.length; j++) {
                    const party1 = allParties[i];
                    const party2 = allParties[j];
                    
                    // Koalitionsausschlüsse prüfen
                    if (!isCoalitionPossible([party1, party2])) {
                        continue;
                    }
                    
                    // Berechnung des prozentualen Anteils an Sitzen (basierend auf qualifizierten Parteien)
                    const qualifiedTotal = Object.values(qualifiedParties).reduce((sum, val) => sum + val, 0);
                    const party1Seats = (qualifiedParties[party1] / qualifiedTotal) * 100;
                    const party2Seats = (qualifiedParties[party2] / qualifiedTotal) * 100;
                    const total = party1Seats + party2Seats;if (total >= 50) {
                        possibleTwoPartyCoalitions.push({
                            parties: [party1, party2],
                            total: parseFloat(total.toFixed(1)),
                            leader: qualifiedParties[party1] > qualifiedParties[party2] ? party1 : party2
                        });
                    }
                }
            }
            
            // Alle möglichen Dreierbündnisse berechnen
            const possibleThreePartyCoalitions = [];
            
            for (let i = 0; i < allParties.length; i++) {
                for (let j = i + 1; j < allParties.length; j++) {
                    for (let k = j + 1; k < allParties.length; k++) {
                        const party1 = allParties[i];
                        const party2 = allParties[j];
                        const party3 = allParties[k];
                        
                        // Koalitionsausschlüsse prüfen
                        if (!isCoalitionPossible([party1, party2, party3])) {
                            continue;
                        }
                        
                        // Berechnung des prozentualen Anteils an Sitzen
                        const qualifiedTotal = Object.values(qualifiedParties).reduce((sum, val) => sum + val, 0);
                        const party1Seats = (qualifiedParties[party1] / qualifiedTotal) * 100;
                        const party2Seats = (qualifiedParties[party2] / qualifiedTotal) * 100;
                        const party3Seats = (qualifiedParties[party3] / qualifiedTotal) * 100;
                        const total = party1Seats + party2Seats + party3Seats;
                        
                        if (total >= 50) {
                            // Partei mit den meisten Stimmen wird Koalitionsführer
                            let leader = party1;
                            if (qualifiedParties[party2] > qualifiedParties[leader]) leader = party2;
                            if (qualifiedParties[party3] > qualifiedParties[leader]) leader = party3;
                            
                            possibleThreePartyCoalitions.push({
                                parties: [party1, party2, party3],
                                total: parseFloat(total.toFixed(1)),
                                leader: leader
                            });
                        }
                    }
                }
            }
            
            // Große Koalition (die zwei stärksten Parteien)
            let sortedParties = Object.entries(qualifiedParties).sort((a, b) => b[1] - a[1]);
            if (sortedParties.length >= 2) {
                const party1 = sortedParties[0][0];
                const party2 = sortedParties[1][0];
                
                // Koalitionsausschlüsse prüfen
                if (isCoalitionPossible([party1, party2])) {
                    // Berechnung des prozentualen Anteils an Sitzen
                    const qualifiedTotal = Object.values(qualifiedParties).reduce((sum, val) => sum + val, 0);
                    const party1Seats = (qualifiedParties[party1] / qualifiedTotal) * 100;
                    const party2Seats = (qualifiedParties[party2] / qualifiedTotal) * 100;
                    const total = party1Seats + party2Seats;
                    
                    if (total >= 50) {
                        const coalition = {
                            name: "Große Koalition",
                            parties: [party1, party2],
                            total: parseFloat(total.toFixed(1)),
                            playerIsLeader: party1 === selectedParty,
                            playerInGovernment: party1 === selectedParty || party2 === selectedParty,
                            leader: party1,
                            description: "Stabilität, aber schwierige Kompromisse"
                        };
                        coalitions.push(coalition);
                    }
                }
            }
            
            // Spezifische Koalitionen mit Namen
            const coalitionNames = {
                "cdu,fdp": "Schwarz-Gelb",
                "cdu,gruene": "Schwarz-Grün",
                "spd,gruene": "Rot-Grün",
                "spd,linke": "Rot-Rot",
                "spd,fdp": "Sozial-Liberal",
                "gruene,linke": "Grün-Rot",
                "cdu,spd,gruene": "Kenia (Schwarz-Rot-Grün)",
                "cdu,gruene,fdp": "Jamaika (Schwarz-Grün-Gelb)",
                "spd,gruene,fdp": "Ampel (Rot-Grün-Gelb)",
                "spd,gruene,linke": "Rot-Rot-Grün"
            };
            
            // Koalitionsbeschreibungen
            const coalitionDescriptions = {
                "cdu,fdp": "Wirtschaftsliberale Politik mit konservativen Werten",
                "cdu,gruene": "Konservative Werte mit Umweltfokus",
                "spd,gruene": "Sozial-ökologische Politik",
                "spd,linke": "Sozialpolitisch links ausgerichtete Regierung",
                "spd,fdp": "Sozialer Liberalismus",
                "gruene,linke": "Stark ökologisch-sozial ausgerichtete Politik",
                "cdu,spd,gruene": "Breite Mitte mit ökologischem Einschlag",
                "cdu,gruene,fdp": "Wirtschaftsliberal mit ökologischer Komponente",
                "spd,gruene,fdp": "Progressive Politik mit wirtschaftsliberalem Einschlag",
                "spd,gruene,linke": "Links-progressive Ausrichtung mit starkem Umweltfokus"
            };
            
            // Zweierbündnisse hinzufügen
            possibleTwoPartyCoalitions.forEach(coalition => {
                const sortedParties = [...coalition.parties].sort();
                const coalitionKey = sortedParties.join(',');
                const name = coalitionNames[coalitionKey] || `${gameState.partyNames[sortedParties[0]]}-${gameState.partyNames[sortedParties[1]]}`;
                const description = coalitionDescriptions[coalitionKey] || "Eine pragmatische Regierungskoalition";
                
                coalitions.push({
                    name: name,
                    parties: coalition.parties,
                    total: coalition.total,
                    playerIsLeader: coalition.leader === selectedParty,
                    playerInGovernment: coalition.parties.includes(selectedParty),
                    leader: coalition.leader,
                    description: description
                });
            });
            
            // Dreierbündnisse hinzufügen
            possibleThreePartyCoalitions.forEach(coalition => {
                const sortedParties = [...coalition.parties].sort();
                const coalitionKey = sortedParties.join(',');
                const name = coalitionNames[coalitionKey] || `${gameState.partyNames[sortedParties[0]]}-${gameState.partyNames[sortedParties[1]]}-${gameState.partyNames[sortedParties[2]]}`;
                const description = coalitionDescriptions[coalitionKey] || "Eine breite Koalition mit verschiedenen politischen Ausrichtungen";
                
                coalitions.push({
                    name: name,
                    parties: coalition.parties,
                    total: coalition.total,
                    playerIsLeader: coalition.leader === selectedParty,
                    playerInGovernment: coalition.parties.includes(selectedParty),
                    leader: coalition.leader,
                    description: description
                });
            });
            
            // Opposition hinzufügen, falls der Spieler in keiner Koalition vertreten ist
            if (coalitions.length > 0 && !coalitions.some(c => c.playerInGovernment)) {
                // Der Spieler ist in der Opposition
                coalitions.push({
                    name: "Opposition",
                    parties: [selectedParty],
                    total: results[selectedParty],
                    playerIsLeader: false,
                    playerInGovernment: false,
                    leader: null,
                    description: "Deine Partei ist in der Opposition und versucht, die Regierung zu kontrollieren und eigene Themen zu setzen."
                });
            } else if (coalitions.length === 0) {
                // Keine funktionsfähige Koalition möglich, Minderheitsregierung notwendig
                const strongestParty = sortedParties[0][0];
                const isPlayerStrongest = strongestParty === selectedParty;
                
                coalitions.push({
                    name: "Minderheitsregierung",
                    parties: [strongestParty],
                    total: parseFloat((qualifiedParties[strongestParty] / Object.values(qualifiedParties).reduce((sum, val) => sum + val, 0) * 100).toFixed(1)),
                    playerIsLeader: isPlayerStrongest,
                    playerInGovernment: isPlayerStrongest,
                    leader: strongestParty,
                    description: "Eine schwierige Regierungsform, bei der für jedes Gesetz neue Mehrheiten gefunden werden müssen."
                });
                
                if (!isPlayerStrongest) {
                    // Spieler ist in der Opposition
                    coalitions.push({
                        name: "Opposition",
                        parties: [selectedParty],
                        total: parseFloat((qualifiedParties[selectedParty] / Object.values(qualifiedParties).reduce((sum, val) => sum + val, 0) * 100).toFixed(1)),
                        playerIsLeader: false,
                        playerInGovernment: false,
                        leader: null,
                        description: "Deine Partei ist in der Opposition und versucht, die Regierung zu kontrollieren und eigene Themen zu setzen."
                    });
                }
            }
            
            return coalitions;
        }
        
        // Verbesserte Anzeige der Wahlergebnisse mit Animation
        function showElectionResults() {
            // Election Modal anzeigen mit Animation
            const modal = document.getElementById('election-modal');
            modal.style.display = 'flex';
            
            // Kleine Verzögerung für sanfte Überblendung
            setTimeout(() => {
                modal.classList.add('show');
            }, 10);
            
            // Sieger ermitteln
            let winner = "";
            let highestVote = 0;
            
            for (const party in gameState.electionResults) {
                if (gameState.electionResults[party] > highestVote) {
                    highestVote = gameState.electionResults[party];
                    winner = party;
                }
            }
            
            // Banner aktualisieren mit Animation
            const winnerBanner = document.querySelector('.winner-banner');
            winnerBanner.innerHTML = `
                <h2 class="animated-item fadeIn">Wahlergebnis ${gameState.currentYear}</h2>
                <h3 class="animated-item fadeIn" style="animation-delay: 0.2s;">${gameState.partyNames[winner]} wird stärkste Kraft mit ${gameState.electionResults[winner]}%</h3>
            `;
            
            // Ergebnisse aktualisieren mit Animation
            const pollBars = document.querySelectorAll('.election-results .poll-bar');
            
            // Verzögerung für nacheinander animierte Balken
            setTimeout(() => {
                let partyIndex = 0;
                for (const party in gameState.electionResults) {
                    if (pollBars[partyIndex]) {
                        const progressBar = pollBars[partyIndex].querySelector('.progress-bar');
                        const percentage = pollBars[partyIndex].querySelector('.poll-percentage');
                        
                        // Berechnete Werte
                        const targetWidth = gameState.electionResults[party] + '%';
                        const percentageText = gameState.electionResults[party] + '%';
                        
                        // CSS-Variable setzen für Animation
                        progressBar.style.setProperty('--target-width', targetWidth);
                        
                        // Animation für die Balken
                        progressBar.style.animation = `progressFill 1.5s ease-out ${partyIndex * 0.1}s forwards`;
                        
                        // Text nach kurzer Verzögerung aktualisieren
                        setTimeout(() => {
                            percentage.textContent = percentageText;
                            percentage.classList.add('pulse');
                            setTimeout(() => {
                                percentage.classList.remove('pulse');
                            }, 500);
                        }, 500 + partyIndex * 100);
                    }
                    partyIndex++;
                }
            }, 500);
            
            // Koalitionsoptionen generieren mit Verzögerung für bessere Animation
            setTimeout(() => {
                const coalitionOptions = document.querySelector('.coalition-options');
                coalitionOptions.innerHTML = '';
                
                // Mögliche Koalitionen berechnen
                const viableCoalitions = calculateCoalitions();
                
                // Gruppieren nach Regierung und Opposition
                const governmentCoalitions = viableCoalitions.filter(c => c.playerInGovernment);
                const oppositionCoalitions = viableCoalitions.filter(c => !c.playerInGovernment);
                
                // Speichern für späteren Zugriff
                gameState.governmentCoalitions = governmentCoalitions;
                gameState.oppositionCoalitions = oppositionCoalitions;
                
                // Header für Regierungsoptionen mit Animation
                if (governmentCoalitions.length > 0) {
                    coalitionOptions.innerHTML += `<h4 class="animated-item fadeIn">Koalitionsoptionen für Regierungsbeteiligung</h4>`;
                }
                
                // Regierungskoalitionen anzeigen mit Animation
                let coalitionHtml = '';
                governmentCoalitions.forEach((coalition, index) => {
                    const parties = coalition.parties.map(p => gameState.partyNames[p]).join(' + ');
                    const total = coalition.total.toFixed(1);
                    const leaderText = coalition.playerIsLeader ? 
                        '<span class="leader-badge">Du bist Kanzler</span>' : 
                        (coalition.leader ? `<span>Geführt von ${gameState.partyNames[coalition.leader]}</span>` : '');
                    
                    // Verzögerung für gestaffelte Animation
                    const delay = index * 0.15 + 0.2;
                    
                    coalitionHtml += `
                        <div class="coalition-option animated-item slideInUp" onclick="selectCoalition(${index}, true)" style="animation-delay: ${delay}s;">
                            <div class="coalition-header">
                                <h4>${coalition.name} (${parties})</h4>
                                ${leaderText}
                            </div>
                            <p>${total}% der Stimmen - ${coalition.description}</p>
                        </div>
                    `;
                });
                
                // Header für Oppositionsoptionen mit Animation
                if (oppositionCoalitions.length > 0) {
                    const oppositionHeaderDelay = governmentCoalitions.length * 0.15 + 0.3;
                    coalitionHtml += `<h4 class="animated-item fadeIn" style="animation-delay: ${oppositionHeaderDelay}s;">Opposition</h4>`;
                    
                    // Oppositionskoalitionen anzeigen mit Animation
                    oppositionCoalitions.forEach((coalition, index) => {
                        const parties = coalition.parties.map(p => gameState.partyNames[p]).join(' + ');
                        const total = coalition.total.toFixed(1);
                        
                        // Verzögerung für gestaffelte Animation
                        const delay = governmentCoalitions.length * 0.15 + 0.4 + index * 0.15;
                        
                        coalitionHtml += `
                            <div class="coalition-option opposition animated-item slideInUp" onclick="selectCoalition(${index}, false)" style="animation-delay: ${delay}s;">
                                <div class="coalition-header">
                                    <h4>${coalition.name} (${parties})</h4>
                                </div>
                                <p>${total}% der Stimmen - ${coalition.description}</p>
                            </div>
                        `;
                    });
                }
                
                coalitionOptions.innerHTML += coalitionHtml;
                
                // Button mit Animation
                const buttonDelay = Math.max(governmentCoalitions.length, 1) * 0.15 + Math.max(oppositionCoalitions.length, 1) * 0.15 + 0.5;
                const continueButton = document.getElementById('continue-game');
                continueButton.style.animationDelay = `${buttonDelay}s`;
                continueButton.classList.add('animated-item', 'fadeIn');
            }, 1500);
            
            // Log-Eintrag
            addLogEntry(`Die Bundestagswahl ${gameState.currentYear} ist beendet. ${gameState.partyNames[winner]} wurde mit ${gameState.electionResults[winner]}% stärkste Kraft.`, true);
        }
        
        // Funktion zum Auswählen einer Koalition mit Animation
        function selectCoalition(index, isGovernment) {
            // Bisherige Auswahl entfernen
            document.querySelectorAll('.coalition-option').forEach(opt => {
                opt.classList.remove('selected');
            });
            
            // Die Liste der entsprechenden Koalitionsoptionen
            const coalitionsList = isGovernment ? gameState.governmentCoalitions : gameState.oppositionCoalitions;
            
            // Die ausgewählte Koalition
            const coalition = coalitionsList[index];
            
            // Die ausgewählte Option markieren mit Animation
            const options = isGovernment 
                ? document.querySelectorAll('.coalition-option:not(.opposition)') 
                : document.querySelectorAll('.coalition-option.opposition');
                
            if (options && options[index]) {
                options[index].classList.add('selected');
                options[index].classList.add('pulse');
                setTimeout(() => {
                    options[index].classList.remove('pulse');
                }, 500);
            }
            
            // Koalition im Spielzustand speichern
            gameState.selectedCoalition = coalition;
            
            // Button-Animation für besseres Feedback
            const continueButton = document.getElementById('continue-game');
            continueButton.classList.add('pulse');
            setTimeout(() => {
                continueButton.classList.remove('pulse');
            }, 500);
        }
        
        // Funktion zum Fortsetzen nach Wahl mit Animation
        function continueAfterElection() {
            if (!gameState.selectedCoalition) {
                showNotification('Bitte wähle erst eine Koalition aus!', 'warning');
                
                // Shake-Animation für besseres Feedback
                const coalitionOptions = document.querySelector('.coalition-options');
                coalitionOptions.classList.add('shake');
                setTimeout(() => {
                    coalitionOptions.classList.remove('shake');
                }, 500);
                
                return;
            }
            
            // Modal animiert schließen
            const modal = document.getElementById('election-modal');
            modal.classList.remove('show');
            setTimeout(() => {
                modal.style.display = 'none';
                
                // Weiter zum nächsten Wahlkampf
                continueToNextElection(gameState.selectedCoalition);
            }, 300);
        }
        
        // Funktion zum Fortfahren zur nächsten Wahl mit Animation
        function continueToNextElection(coalition) {
            // Zeit bis zur nächsten Wahl zurücksetzen
            gameState.monthsToElection = 48; // 4 Jahre = 48 Monate
            
            // Nächstes Wahljahr setzen
            gameState.currentYear += 4;
            
            // Speichern, ob der Spieler in der Regierung ist
            gameState.isInGovernment = coalition.playerInGovernment;
            gameState.isChancellor = coalition.playerIsLeader;
            
            // Ressourcen anpassen basierend auf Koalition und Regierungsbeteiligung
            const popularity = coalition.total / 100; // 0-1 basierend auf Koalitionsstärke
            
            if (coalition.playerInGovernment) {
                // In der Regierung - mehr Ressourcen, aber auch mehr Verantwortung
                gameState.resources.budget = 2500000 + (1000000 * popularity);
                gameState.resources.donations = 120000 + (60000 * popularity);
                
                // Als Kanzler noch mehr Einfluss
                if (coalition.playerIsLeader) {
                    gameState.resources.budget += 500000;
                    gameState.resources.donations += 30000;
                }
            } else {
                // In der Opposition - weniger Ressourcen, aber weniger Verantwortung
                gameState.resources.budget = 1500000 + (500000 * popularity);
                gameState.resources.donations = 80000 + (30000 * popularity);
            }
            
            // Aktivitätszähler und andere Rundenwerte zurücksetzen
            gameState.activityCounter = {};
            gameState.lastActionTurn = {};
            gameState.currentTurn = 0;
            gameState.strategyBonus = 0;
            gameState.strategyBonusRemaining = 0;
            
            // Kampagne zählen
            gameState.currentCampaign++;
            
            // Beziehungen zu anderen Parteien aktualisieren basierend auf Koalitionsentscheidung
            if (coalition.playerInGovernment) {
                // Beziehungen zu Koalitionspartnern verbessern
                coalition.parties.forEach(party => {
                    if (party !== gameState.selectedParty) {
                        updatePartyRelationship(gameState.selectedParty, party, 30);
                    }
                });
                
                // Beziehungen zu Oppositionsparteien verschlechtern
                Object.keys(gameState.polls).forEach(party => {
                    if (!coalition.parties.includes(party) && party !== gameState.selectedParty) {
                        updatePartyRelationship(gameState.selectedParty, party, -15);
                    }
                });
            } else {
                // In der Opposition: Beziehungen zur Regierung verschlechtern
                const governingParties = gameState.oppositionCoalitions[0].parties;
                governingParties.forEach(party => {
                    updatePartyRelationship(gameState.selectedParty, party, -15);
                });
                
                // Beziehungen zu anderen Oppositionsparteien leicht verbessern
                Object.keys(gameState.polls).forEach(party => {
                    if (!governingParties.includes(party) && party !== gameState.selectedParty) {
                        updatePartyRelationship(gameState.selectedParty, party, 10);
                    }
                });
            }
            
            // Log-Eintrag für Regierung oder Opposition mit Animation
            if (coalition.playerInGovernment) {
                if (coalition.playerIsLeader) {
                    addLogEntry(`Du bist Kanzler in einer ${coalition.name}. Der nächste Wahlkampf beginnt!`, true);
                } else {
                    addLogEntry(`Deine Partei ist Teil der Regierung in einer ${coalition.name}. Der nächste Wahlkampf beginnt!`, true);
                }
            } else {
                addLogEntry(`Deine Partei ist in der Opposition. Die Regierung besteht aus ${coalition.parties.map(p => gameState.partyNames[p]).join(', ')}. Der nächste Wahlkampf beginnt!`, true);
            }
            
            // Zurücksetzen der ausgewählten Koalition
            gameState.selectedCoalition = null;
            
            // Koalitionsausschlüsse zurücksetzen für neuen Wahlkampf
            gameState.playerExclusions = [];
            
            // Prüfen, ob Spiel zu Ende ist
            if (gameState.currentCampaign > gameState.maxCampaigns) {
                endGame(coalition);
            } else {
                // UI aktualisieren mit Animation
                updateUI();
                
                // Animation für den Beginn des neuen Wahlkampfs
                const mainPanel = document.querySelector('.main-panel');
                mainPanel.classList.add('pulse');
                setTimeout(() => {
                    mainPanel.classList.remove('pulse');
                }, 1000);
                
                // Status zurücksetzen für nächsten Monat
                gameState.isProcessingMonth = false;
                document.getElementById('next-turn').disabled = false;
            }
        }
        
        // Verbesserte Endspiel-Funktion mit Animation
        function endGame(coalition) {
            // Spiel beenden
            
            // Animation für den Übergang zum Ergebnisbildschirm
            const gameScreen = document.getElementById('game-screen');
            gameScreen.style.opacity = '0';
            gameScreen.style.transform = 'translateY(20px)';
            gameScreen.style.transition = 'opacity 0.5s, transform 0.5s';
            
            setTimeout(() => {
                // Ergebnis-Screen anzeigen
                gameScreen.style.display = 'none';
                
                // Festlegen, ob man in der Regierung oder Opposition war
                const governmentStatus = coalition.playerInGovernment ? 
                    (coalition.playerIsLeader ? "als Kanzler" : "als Koalitionspartner") : 
                    "in der Opposition";
                
                // Gesamtzahl der Regierungsbeteiligungen berechnen
                let governmentCount = 0;
                let chancellorCount = 0;
                
                // Diese Werte müssen wir aus dem aktuellen Spielzustand berechnen
                if (coalition.playerInGovernment) {
                    governmentCount++;
                    if (coalition.playerIsLeader) {
                        chancellorCount++;
                    }
                }
                
                // Erfolgstext basierend auf Spielerfolg
                let successText = "";
                if (chancellorCount > 0) {
                    successText = `Gratulation! Du hast es geschafft, ${chancellorCount} mal Bundeskanzler zu werden!`;
                } else if (governmentCount > 0) {
                    successText = `Du warst Teil von ${governmentCount} Regierungskoalitionen.`;
                } else {
                    successText = "Du warst durchgehend in der Opposition. Vielleicht klappt es beim nächsten Mal mit der Regierungsbeteiligung.";
                }
                
                // Zusammenfassung erstellen
                const startScreen = document.getElementById('start-screen');
                startScreen.style.display = 'block';
                startScreen.style.opacity = '0';
                startScreen.style.transform = 'translateY(-20px)';
                
                startScreen.innerHTML = `
                    <div class="panel">
                        <h2 class="animated-item fadeIn">Spielzusammenfassung</h2>
                        <h3 class="animated-item fadeIn" style="animation-delay: 0.1s;">${gameState.partyName}</h3>
                        
                        <p class="animated-item fadeIn" style="animation-delay: 0.2s;">${successText}</p>
                        <p class="animated-item fadeIn" style="animation-delay: 0.3s;">Du hast ${gameState.maxCampaigns} Wahlkämpfe geführt und am Ende ${governmentStatus} in einer ${coalition.name} mit ${coalition.total.toFixed(1)}% der Stimmen agiert.</p>
                        
                        <h4 class="animated-item fadeIn" style="animation-delay: 0.4s;">Deine politischen Positionen am Ende:</h4>
                        <ul class="animated-item fadeIn" style="animation-delay: 0.5s;">
                            <li><strong>Wirtschaft:</strong> ${getPositionText('economy', gameState.issues.economy.position)}</li>
                            <li><strong>Umwelt:</strong> ${getPositionText('environment', gameState.issues.environment.position)}</li>
                            <li><strong>Soziales:</strong> ${getPositionText('social', gameState.issues.social.position)}</li>
                            <li><strong>Sicherheit:</strong> ${getPositionText('security', gameState.issues.security.position)}</li>
                            <li><strong>Migration:</strong> ${getPositionText('migration', gameState.issues.migration.position)}</li>
                            <li><strong>Digitalisierung:</strong> ${getPositionText('digital', gameState.issues.digital.position)}</li>
                        </ul>
                        
                        <h4 class="animated-item fadeIn" style="animation-delay: 0.6s;">Beziehungen zu anderen Parteien:</h4>
                        <ul class="animated-item fadeIn" style="animation-delay: 0.7s;">
                            ${Object.keys(gameState.partyRelations[gameState.selectedParty])
                                .map(party => `<li><strong>${gameState.partyNames[party]}:</strong> ${getRelationshipStatus(getPartyRelationship(gameState.selectedParty, party))}</li>`)
                                .join('')}
                        </ul>
                        
                        <h4 class="animated-item fadeIn" style="animation-delay: 0.8s;">Ressourcen am Ende:</h4>
                        <ul class="animated-item fadeIn" style="animation-delay: 0.9s;">
                            <li><strong>Budget:</strong> ${formatMoney(gameState.resources.budget)}</li>
                            <li><strong>Mitglieder:</strong> ${formatNumber(gameState.resources.members)}</li>
                            <li><strong>Umfragewerte:</strong> ${gameState.resources.polls.toFixed(1)}%</li>
                        </ul>
                        
                        <button class="action-btn animated-item fadeIn" onclick="location.reload()" style="margin-top: 1.5rem; width: 100%; animation-delay: 1s;">Neues Spiel starten</button>
                    </div>
                `;
                
                // Animation für den Ergebnisbildschirm
                setTimeout(() => {
                    startScreen.style.opacity = '1';
                    startScreen.style.transform = 'translateY(0)';
                    startScreen.style.transition = 'opacity 0.5s, transform 0.5s';
                }, 10);
            }, 500);
        }
        
        function getPositionText(issue, value) {
            const positions = {
                economy: {
                    '-2': 'Stark interventionistisch',
                    '-1': 'Eher interventionistisch',
                    '0': 'Ausgewogen',
                    '1': 'Eher marktliberal',
                    '2': 'Stark marktliberal'
                },
                environment: {
                    '-2': 'Wirtschaft vor Umwelt',
                    '-1': 'Eher wirtschaftsorientiert',
                    '0': 'Ausgewogen',
                    '1': 'Eher umweltorientiert',
                    '2': 'Starker Umweltschutz'
                },
                social: {
                    '-2': 'Starke Eigenverantwortung',
                    '-1': 'Eher Eigenverantwortung',
                    '0': 'Ausgewogen',
                    '1': 'Eher sozial',
                    '2': 'Stark sozial'
                },
                security: {
                    '-2': 'Freiheit vor Sicherheit',
                    '-1': 'Eher freiheitsorientiert',
                    '0': 'Ausgewogen',
                    '1': 'Eher sicherheitsorientiert',
                    '2': 'Sicherheit vor Freiheit'
                },
                migration: {
                    '-2': 'Strenge Beschränkung',
                    '-1': 'Eher restriktiv',
                    '0': 'Ausgewogen',
                    '1': 'Eher offen',
                    '2': 'Sehr offen'
                },
                digital: {
                    '-2': 'Sehr zurückhaltend',
                    '-1': 'Eher zurückhaltend',
                    '0': 'Ausgewogen',
                    '1': 'Eher fortschrittlich',
                    '2': 'Sehr fortschrittlich'
                }
            };
            
            return positions[issue][value.toString()];
        }
        
        // Initialisierung beim Laden der Seite mit Animation
        window.addEventListener('load', function() {
            // Startknopf standardmäßig deaktivieren, bis eine Partei ausgewählt wird
            document.getElementById('start-game').disabled = true;
            
            // Animation für das Einblenden der Parteikarten
            const partyCards = document.querySelectorAll('.party-card');
            partyCards.forEach((card, index) => {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                    card.style.transition = 'opacity 0.5s, transform 0.5s';
                }, 100 + index * 100);
            });
            
            // Animation für die Überschrift
            const header = document.querySelector('header');
            header.style.opacity = '0';
            header.style.transform = 'translateY(-20px)';
            
            setTimeout(() => {
                header.style.opacity = '1';
                header.style.transform = 'translateY(0)';
                header.style.transition = 'opacity 0.5s, transform 0.5s';
            }, 100);
            
            // Animation für das Hauptpanel
            const mainPanel = document.getElementById('start-screen');
            mainPanel.style.opacity = '0';
            mainPanel.style.transform = 'scale(0.95)';
            
            setTimeout(() => {
                mainPanel.style.opacity = '1';
                mainPanel.style.transform = 'scale(1)';
                mainPanel.style.transition = 'opacity 0.5s, transform 0.5s';
            }, 300);
            
            // Willkommensnachricht
            setTimeout(() => {
                showNotification('Willkommen zum Wahlkampf-Simulator! Wähle eine Partei, um zu beginnen.', 'info');
            }, 1000);
        });
        
        // Zusätzliche Animationsfunktionen
        
        // Funktion zum Animieren von Elementen, wenn sie ins Sichtfeld scrollen
        function animateOnScroll() {
            const elementsToAnimate = document.querySelectorAll('.animate-on-scroll');
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animated');
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1 });
            
            elementsToAnimate.forEach(element => {
                observer.observe(element);
            });
        }
        
        // Funktion zum Hinzufügen von Konfetti-Effekten bei wichtigen Ereignissen
        function showConfetti() {
            const confettiContainer = document.createElement('div');
            confettiContainer.className = 'confetti-container';
            document.body.appendChild(confettiContainer);
            
            // 50 Konfetti-Stücke erstellen
            for (let i = 0; i < 50; i++) {
                const confetti = document.createElement('div');
                confetti.className = 'confetti';
                
                // Zufällige Farbe
                const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];
                const color = colors[Math.floor(Math.random() * colors.length)];
                confetti.style.backgroundColor = color;
                
                // Zufällige Größe
                const size = Math.random() * 10 + 5;
                confetti.style.width = size + 'px';
                confetti.style.height = size + 'px';
                
                // Zufällige Position
                const posX = Math.random() * 100;
                confetti.style.left = posX + 'vw';
                
                // Zufällige Animation-Verzögerung
                const delay = Math.random() * 5;
                confetti.style.animationDelay = delay + 's';
                
                // Zufällige Animation-Dauer
                const duration = Math.random() * 3 + 2;
                confetti.style.animationDuration = duration + 's';
                
                confettiContainer.appendChild(confetti);
            }
            
            // Konfetti nach einiger Zeit entfernen
            setTimeout(() => {
                confettiContainer.remove();
            }, 8000);
        }
        
        // Funktion zum Zeigen eines Tooltips
        function showTooltip(element, text) {
            // Vorhandene Tooltips entfernen
            const existingTooltip = document.querySelector('.tooltip');
            if (existingTooltip) {
                existingTooltip.remove();
            }
            
            // Tooltip erstellen
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = text;
            
            // Tooltip positionieren
            const rect = element.getBoundingClientRect();
            tooltip.style.left = rect.left + (rect.width / 2) + 'px';
            tooltip.style.top = rect.top - 10 + 'px';
            
            // Tooltip zum DOM hinzufügen
            document.body.appendChild(tooltip);
            
            // Tooltip nach einiger Zeit ausblenden
            setTimeout(() => {
                tooltip.classList.add('show');
            }, 10);
            
            setTimeout(() => {
                tooltip.classList.remove('show');
                setTimeout(() => {
                    tooltip.remove();
                }, 300);
            }, 3000);
        }
        
        // Erweiterter Wahlkampfabschluss mit visuellen Effekten
        function celebrateElection(isVictory) {
            if (isVictory) {
                // Konfetti für einen Sieg
                showConfetti();
                
                // Triumphierende Benachrichtigung
                showNotification("Glückwunsch zum Wahlsieg! Du hast die stärkste Partei!", "success");
                
                // Hintergrundfarbe kurz in Parteifarbe ändern
                const originalBackgroundColor = document.body.style.backgroundColor;
                document.body.style.backgroundColor = gameState.partyColor;
                document.body.style.transition = "background-color 1s";
                
                setTimeout(() => {
                    document.body.style.backgroundColor = originalBackgroundColor;
                }, 3000);
            } else {
                // Trostbenachrichtigung
                showNotification("Die Wahl ist vorbei. Es hat nicht zum Sieg gereicht, aber es gibt eine nächste Chance!", "info");
            }
        }
        
        // Funktion zum Hinzufügen eines Partei-Emblem-Animations
        function showPartyEmblem(party) {
            const emblemContainer = document.createElement('div');
            emblemContainer.className = 'party-emblem-container';
            document.body.appendChild(emblemContainer);
            
            const emblem = document.createElement('div');
            emblem.className = 'party-emblem ' + party;
            emblem.textContent = party.toUpperCase();
            emblemContainer.appendChild(emblem);
            
            setTimeout(() => {
                emblemContainer.classList.add('show');
            }, 10);
            
            setTimeout(() => {
                emblemContainer.classList.remove('show');
                setTimeout(() => {
                    emblemContainer.remove();
                }, 1000);
            }, 3000);
        }
        
        // Funktion für eine pulsierende "Breaking News" Animation
        function showBreakingNews(headline) {
            const newsContainer = document.createElement('div');
            newsContainer.className = 'breaking-news';
            
            const newsHeader = document.createElement('div');
            newsHeader.className = 'breaking-news-header';
            newsHeader.textContent = 'EILMELDUNG';
            
            const newsContent = document.createElement('div');
            newsContent.className = 'breaking-news-content';
            newsContent.textContent = headline;
            
            newsContainer.appendChild(newsHeader);
            newsContainer.appendChild(newsContent);
            document.body.appendChild(newsContainer);
            
            setTimeout(() => {
                newsContainer.classList.add('show');
            }, 10);
            
            setTimeout(() => {
                newsContainer.classList.remove('show');
                setTimeout(() => {
                    newsContainer.remove();
                }, 1000);
            }, 5000);
        }
        
        // Zusätzliche CSS-Stile für die neuen Animationen
        const additionalStyles = document.createElement('style');
        additionalStyles.textContent = `
            @keyframes fall {
                0% { transform: translateY(-100vh); }
                100% { transform: translateY(100vh); }
            }
            
            .confetti-container {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                pointer-events: none;
                z-index: 9999;
            }
            
            .confetti {
                position: absolute;
                top: -10px;
                width: 10px;
                height: 10px;
                background-color: red;
                border-radius: 50%;
                animation: fall 5s linear forwards;
            }
            
            .tooltip {
                position: fixed;
                z-index: 9999;
                background-color: rgba(0, 0, 0, 0.8);
                color: white;
                padding: 8px 12px;
                border-radius: 4px;
                font-size: 14px;
                pointer-events: none;
                transform: translate(-50%, -100%) scale(0.8);
                opacity: 0;
                transition: opacity 0.3s, transform 0.3s;
            }
            
            .tooltip.show {
                opacity: 1;
                transform: translate(-50%, -100%) scale(1);
            }
            
            .tooltip::after {
                content: '';
                position: absolute;
                top: 100%;
                left: 50%;
                margin-left: -5px;
                border-width: 5px;
                border-style: solid;
                border-color: rgba(0, 0, 0, 0.8) transparent transparent transparent;
            }
            
            .party-emblem-container {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                display: flex;
                justify-content: center;
                align-items: center;
                pointer-events: none;
                z-index: 9999;
                opacity: 0;
                transition: opacity 0.5s;
            }
            
            .party-emblem-container.show {
                opacity: 1;
            }
            
            .party-emblem {
                width: 200px;
                height: 200px;
                border-radius: 50%;
                display: flex;
                justify-content: center;
                align-items: center;
                font-size: 48px;
                font-weight: bold;
                color: white;
                animation: pulse 2s infinite;
            }
            
            .breaking-news {
                position: fixed;
                bottom: 50px;
                left: 50%;
                transform: translateX(-50%) translateY(100px);
                background-color: white;
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
                border-radius: 5px;
                overflow: hidden;
                width: 80%;
                max-width: 600px;
                z-index: 9999;
                opacity: 0;
                transition: transform 0.5s, opacity 0.5s;
            }
            
            .breaking-news.show {
                transform: translateX(-50%) translateY(0);
                opacity: 1;
            }
            
            .breaking-news-header {
                background-color: #e74c3c;
                color: white;
                padding: 8px 15px;
                font-weight: bold;
                font-size: 18px;
                animation: pulse 1s infinite;
            }
            
            .breaking-news-content {
                padding: 15px;
                font-size: 16px;
            }
            
            .animate-on-scroll {
                opacity: 0;
                transform: translateY(20px);
                transition: opacity 0.5s, transform 0.5s;
            }
            
            .animate-on-scroll.animated {
                opacity: 1;
                transform: translateY(0);
            }
            
            /* Responsives Design verbessern */
            @media (max-width: 768px) {
                .breaking-news {
                    width: 90%;
                }
                
                .party-emblem {
                    width: 150px;
                    height: 150px;
                    font-size: 36px;
                }
                
                .confetti {
                    width: 8px;
                    height: 8px;
                }
            }
        `;
        
        document.head.appendChild(additionalStyles);