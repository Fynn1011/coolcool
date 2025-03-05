        // JavaScript für den Abschiebe-Simulator
        const cases = [
            {
                name: "Ahmed K.",
                info: {
                    "Alter": "32 Jahre",
                    "Herkunftsland": "Syrien",
                    "Aufenthaltsdauer": "4 Jahre",
                    "Familienstand": "Verheiratet, 2 Kinder in Deutschland",
                    "Arbeitsstatus": "Festanstellung als Krankenpfleger",
                    "Sprachkenntnisse": "Gute Deutschkenntnisse (B2)"
                },
                statement: "Ich bin vor dem Krieg geflohen und habe hier ein neues Leben aufgebaut. Meine Kinder gehen hier zur Schule, und ich arbeite im Krankenhaus. Eine Rückkehr nach Syrien wäre für meine Familie gefährlich.",
                correctDecision: "accept",
                reason: "Ahmed hat sich gut integriert, ist berufstätig in einem Mangelberuf und hat Familie mit schulpflichtigen Kindern in Deutschland. Zudem stammt er aus einem Kriegsgebiet."
            },
            {
                name: "Elena M.",
                info: {
                    "Alter": "27 Jahre",
                    "Herkunftsland": "Ukraine",
                    "Aufenthaltsdauer": "2 Jahre",
                    "Familienstand": "Ledig",
                    "Arbeitsstatus": "Arbeitslos, Sozialhilfeempfängerin",
                    "Sprachkenntnisse": "Grundlegende Deutschkenntnisse (A1)"
                },
                statement: "In meiner Heimatstadt gibt es immer noch Kämpfe. Ich habe Angst zurückzukehren. Ich suche seit Monaten Arbeit, aber es ist schwierig ohne gute Sprachkenntnisse.",
                correctDecision: "accept",
                reason: "Als Ukrainerin hat Elena temporären Schutz, solange der Konflikt andauert. Ihre Bemühungen um Integration sollten unterstützt werden."
            },
            {
                name: "Carlos F.",
                info: {
                    "Alter": "35 Jahre",
                    "Herkunftsland": "Kolumbien",
                    "Aufenthaltsdauer": "6 Monate",
                    "Familienstand": "Ledig",
                    "Arbeitsstatus": "Keine Arbeitserlaubnis",
                    "Sprachkenntnisse": "Keine Deutschkenntnisse"
                },
                statement: "Ich bin hergekommen, um Arbeit zu finden und meiner Familie in Kolumbien Geld zu schicken. In meiner Heimat gibt es keine Jobs für mich.",
                correctDecision: "reject",
                reason: "Wirtschaftliche Gründe allein rechtfertigen keinen Asylstatus. Carlos hat keine Schutzgründe genannt und zeigt bisher keine Integrationsanstrengungen."
            },
            {
                name: "Fatima H.",
                info: {
                    "Alter": "19 Jahre",
                    "Herkunftsland": "Afghanistan",
                    "Aufenthaltsdauer": "1 Jahr",
                    "Familienstand": "Ledig",
                    "Arbeitsstatus": "In Ausbildung zur Friseurin",
                    "Sprachkenntnisse": "Mittlere Deutschkenntnisse (B1)"
                },
                statement: "Als Frau kann ich in Afghanistan nicht frei leben. Die Taliban würden mich nicht ausbilden oder arbeiten lassen. Hier habe ich eine Chance auf ein selbstbestimmtes Leben.",
                correctDecision: "accept",
                reason: "Frauen sind in Afghanistan systematischer Diskriminierung ausgesetzt. Fatima hat zudem gute Integrationschancen durch ihre Ausbildung und Sprachkenntnisse."
            },
            {
                name: "Ibrahim T.",
                info: {
                    "Alter": "29 Jahre",
                    "Herkunftsland": "Türkei",
                    "Aufenthaltsdauer": "3 Jahre",
                    "Familienstand": "Verheiratet, Frau lebt in der Türkei",
                    "Arbeitsstatus": "Selbstständig im Lieferservice",
                    "Sprachkenntnisse": "Grundlegende Deutschkenntnisse (A2)"
                },
                statement: "Ich bin Kurde und wurde in der Türkei politisch verfolgt. Hier habe ich mir ein kleines Geschäft aufgebaut. Meine Frau möchte auch nach Deutschland kommen.",
                correctDecision: "accept",
                reason: "Politische Verfolgung ist ein anerkannter Asylgrund. Ibrahim zeigt wirtschaftliche Integration und baut sich eine Existenz auf."
            },
            {
                name: "Dimitri K.",
                info: {
                    "Alter": "41 Jahre",
                    "Herkunftsland": "Russland",
                    "Aufenthaltsdauer": "8 Monate",
                    "Familienstand": "Geschieden",
                    "Arbeitsstatus": "Arbeitslos",
                    "Sprachkenntnisse": "Keine Deutschkenntnisse"
                },
                statement: "Ich bin nach Deutschland gekommen, weil ich hier mehr Geld verdienen kann als in Russland. Die Wirtschaft dort ist schlecht.",
                correctDecision: "reject",
                reason: "Wirtschaftliche Gründe allein begründen keinen Asylstatus. Dimitri zeigt keine Anzeichen von Verfolgung oder besonderer Schutzbedürftigkeit."
            },
            {
                name: "Maria L.",
                info: {
                    "Alter": "23 Jahre",
                    "Herkunftsland": "Venezuela",
                    "Aufenthaltsdauer": "1,5 Jahre",
                    "Familienstand": "Ledig",
                    "Arbeitsstatus": "Studentisch, Teilzeitjob",
                    "Sprachkenntnisse": "Gute Deutschkenntnisse (B2)"
                },
                statement: "In Venezuela herrscht eine humanitäre Krise. Es gibt kaum Nahrung und Medikamente. Ich studiere hier Informatik und arbeite nebenbei, um mein Studium zu finanzieren.",
                correctDecision: "accept",
                reason: "Venezuela befindet sich in einer anerkannten humanitären Krise. Maria zeigt gute Integration durch Studium, Arbeit und Sprachkenntnisse."
            }
        ];

        // Statistik-Variablen
        let totalCases = 0;
        let correctDecisions = 0;
        let currentCaseIndex = 0;

        // DOM-Elemente
        const caseNameElement = document.getElementById('case-name');
        const caseInfoElement = document.getElementById('case-info');
        const caseStatementElement = document.getElementById('case-statement');
        const acceptButton = document.getElementById('accept-button');
        const rejectButton = document.getElementById('reject-button');
        const feedbackElement = document.getElementById('feedback');
        const nextCaseButton = document.getElementById('next-case');
        const totalCasesElement = document.getElementById('total-cases');
        const correctDecisionsElement = document.getElementById('correct-decisions');
        const accuracyElement = document.getElementById('accuracy');

        // Funktionen
        function displayCase(caseIndex) {
            const currentCase = cases[caseIndex];
            
            // Fall-Informationen anzeigen
            caseNameElement.textContent = currentCase.name;
            
            // Info-Bereich leeren und neu befüllen
            caseInfoElement.innerHTML = '';
            for (const [key, value] of Object.entries(currentCase.info)) {
                const infoItem = document.createElement('div');
                infoItem.className = 'info-item';
                
                const infoLabel = document.createElement('div');
                infoLabel.className = 'info-label';
                infoLabel.textContent = key;
                
                const infoValue = document.createElement('div');
                infoValue.className = 'info-value';
                infoValue.textContent = value;
                
                infoItem.appendChild(infoLabel);
                infoItem.appendChild(infoValue);
                caseInfoElement.appendChild(infoItem);
            }
            
            // Aussage anzeigen
            caseStatementElement.textContent = currentCase.statement;
            
            // Feedback zurücksetzen
            feedbackElement.style.display = 'none';
            nextCaseButton.style.display = 'none';
            
            // Buttons aktivieren
            acceptButton.disabled = false;
            rejectButton.disabled = false;
        }

        function makeDecision(decision) {
            totalCases++;
            
            const currentCase = cases[currentCaseIndex];
            const isCorrect = decision === currentCase.correctDecision;
            
            if (isCorrect) {
                correctDecisions++;
                feedbackElement.className = 'feedback correct';
                feedbackElement.textContent = `Korrekte Entscheidung! ${currentCase.reason}`;
            } else {
                feedbackElement.className = 'feedback incorrect';
                feedbackElement.textContent = `Nicht korrekt. ${currentCase.reason}`;
            }
            
            // Statistik aktualisieren
            updateStats();
            
            // Feedback anzeigen
            feedbackElement.style.display = 'block';
            nextCaseButton.style.display = 'block';
            
            // Buttons deaktivieren
            acceptButton.disabled = true;
            rejectButton.disabled = true;
        }

        function updateStats() {
            totalCasesElement.textContent = totalCases;
            correctDecisionsElement.textContent = correctDecisions;
            
            const accuracy = totalCases > 0 ? Math.round((correctDecisions / totalCases) * 100) : 0;
            accuracyElement.textContent = `${accuracy}%`;
        }

        function nextCase() {
            currentCaseIndex = (currentCaseIndex + 1) % cases.length;
            displayCase(currentCaseIndex);
        }

        // Event-Listener
        acceptButton.addEventListener('click', () => makeDecision('accept'));
        rejectButton.addEventListener('click', () => makeDecision('reject'));
        nextCaseButton.addEventListener('click', nextCase);

        // Spiel starten
        displayCase(currentCaseIndex);