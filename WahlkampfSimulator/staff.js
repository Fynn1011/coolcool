// Staff Management JavaScript

// Staff data structure
let staffDatabase = [
    {
        id: 1,
        name: "Peter Müller",
        initials: "PM",
        role: "Kampagnenleiter",
        roleType: "strategy",
        avatar: null,
        salary: 45000,
        hired: true,
        loyalty: 85,
        experience: "12 Jahre",
        specialty: "Wahlkampforganisation",
        bio: "Ehemaliger politischer Berater mit umfangreicher Erfahrung in nationalen Kampagnen. Spezialisiert auf Wahlkampfstrategie und Krisenkommunikation.",
        skills: {
            strategy: 8,
            media: 7,
            leadership: 8,
            finance: 5,
            publicSpeaking: 6,
            digitalCampaign: 5,
            regionalKnowledge: 7,
            crisisManagement: 8
        },
        effects: {
            polls: 0.2,
            donations: 5000,
            mediaBonus: 0.15
        },
        history: [
            { date: "März 2025", event: "Zum Team hinzugefügt" },
            { date: "April 2025", event: "Strategie für Ost-Deutschland entwickelt (+2% in Brandenburg)" }
        ],
        achievements: [
            "Erfolgreiche Krisenbewältigung",
            "Medientraining absolviert"
        ]
    },
    {
        id: 2,
        name: "Sabine Klein",
        initials: "SK",
        role: "Pressesprecherin",
        roleType: "media",
        avatar: null,
        salary: 38000,
        hired: true,
        loyalty: 78,
        experience: "8 Jahre",
        specialty: "Fernseh-Auftritte",
        bio: "Ehemalige Journalistin mit exzellenten Kontakten in der Medienlandschaft. Hat einen Hintergrund im öffentlich-rechtlichen Fernsehen und versteht die Medienlogik perfekt.",
        skills: {
            strategy: 5,
            media: 9,
            leadership: 6,
            finance: 4,
            publicSpeaking: 8,
            digitalCampaign: 6,
            regionalKnowledge: 5,
            crisisManagement: 7
        },
        effects: {
            polls: 0.1,
            media: 1,
            crisisReduction: 0.2
        },
        history: [
            { date: "März 2025", event: "Zum Team hinzugefügt" },
            { date: "Mai 2025", event: "Erfolgreicher TV-Auftritt (+0.5% Umfragewerte)" }
        ],
        achievements: [
            "Ausgezeichnete Pressemitteilung",
            "Kontakte zu Leitmedien aufgebaut"
        ]
    },
    {
        id: 3,
        name: "Thomas Weber",
        initials: "TW",
        role: "Schatzmeister",
        roleType: "finance",
        avatar: null,
        salary: 32000,
        hired: true,
        loyalty: 90,
        experience: "15 Jahre",
        specialty: "Fundraising",
        bio: "Erfahrener Finanzexperte mit Hintergrund im Bankwesen. Seine Expertise im Fundraising hat bereits mehrere Kampagnen finanziert und Budget-Engpässe verhindert.",
        skills: {
            strategy: 4,
            media: 3,
            leadership: 6,
            finance: 9,
            publicSpeaking: 4,
            digitalCampaign: 5,
            regionalKnowledge: 6,
            crisisManagement: 5
        },
        effects: {
            budget: 50000,
            donations: 15000,
            costReduction: 0.1
        },
        history: [
            { date: "März 2025", event: "Zum Team hinzugefügt" },
            { date: "April 2025", event: "Große Spendengala organisiert (+120.000 €)" }
        ],
        achievements: [
            "Budgetoptimierung durchgeführt",
            "Neues Spendernetzwerk aufgebaut"
        ]
    },
    {
        id: 4,
        name: "Maria Hoffmann",
        initials: "MH",
        role: "Social Media Managerin",
        roleType: "media",
        avatar: null,
        salary: 28000,
        hired: true,
        loyalty: 75,
        experience: "5 Jahre",
        specialty: "Digitale Kampagnen",
        bio: "Junge Digitalexpertin mit innovativen Ansätzen für moderne Kampagnenführung. Besonders stark in der Ansprache junger Wählergruppen und viralen Kampagnen.",
        skills: {
            strategy: 5,
            media: 7,
            leadership: 4,
            finance: 3,
            publicSpeaking: 6,
            digitalCampaign: 9,
            regionalKnowledge: 4,
            crisisManagement: 5
        },
        effects: {
            polls: 0.15,
            youngVoterBonus: 0.3,
            mediaVisibility: 0.2
        },
        history: [
            { date: "März 2025", event: "Zum Team hinzugefügt" },
            { date: "Juni 2025", event: "Virale Kampagne gestartet (+1.2% bei jungen Wählern)" }
        ],
        achievements: [
            "100.000 Follower auf Social Media erreicht",
            "Digitales Kampagnenkonzept entwickelt"
        ]
    }
];

// Candidate pool for hiring new staff
let candidatePool = [
    {
        id: 101,
        name: "Dr. Klaus Wagner",
        initials: "KW",
        role: "Strategieberater",
        roleType: "strategy",
        salary: 52000,
        experience: "20 Jahre",
        specialty: "Politische Analyse",
        skills: {
            strategy: 9,
            media: 6,
            leadership: 7,
            finance: 5,
            publicSpeaking: 7,
            digitalCampaign: 4,
            regionalKnowledge: 8,
            crisisManagement: 8
        },
        bio: "Ehemaliger Professor für Politikwissenschaft mit Beratererfahrung bei mehreren erfolgreichen Bundestagskampagnen."
    },
    {
        id: 102,
        name: "Lena Becker",
        initials: "LB",
        role: "Digitale Kampagnenleiterin",
        roleType: "media",
        salary: 36000,
        experience: "7 Jahre",
        specialty: "Online-Zielgruppenansprache",
        skills: {
            strategy: 6,
            media: 8,
            leadership: 5,
            finance: 4,
            publicSpeaking: 5,
            digitalCampaign: 9,
            regionalKnowledge: 3,
            crisisManagement: 4
        },
        bio: "Ehemalige Startup-Gründerin mit innovativen Ansätzen für digitale Kampagnen und Datenanalyse."
    },
    {
        id: 103,
        name: "Martin Schneider",
        initials: "MS",
        role: "Regionalkoordinator",
        roleType: "field",
        salary: 29000,
        experience: "10 Jahre",
        specialty: "Ost-Deutschland",
        skills: {
            strategy: 5,
            media: 4,
            leadership: 7,
            finance: 3,
            publicSpeaking: 6,
            digitalCampaign: 3,
            regionalKnowledge: 9,
            crstrategy: 5,
            media: 4,
            leadership: 7,
            finance: 3,
            publicSpeaking: 6,
            digitalCampaign: 3,
            regionalKnowledge: 9,
            crisisManagement: 6
        },
        bio: "Ehemaliger Landtagsabgeordneter mit hervorragenden Kontakten in den östlichen Bundesländern und Erfahrung in der Basisarbeit."
    },
    {
        id: 104,
        name: "Franziska Meyer",
        initials: "FM",
        role: "Fundraising-Expertin",
        roleType: "finance",
        salary: 34000,
        experience: "12 Jahre",
        specialty: "Großspender-Akquise",
        skills: {
            strategy: 4,
            media: 6,
            leadership: 5,
            finance: 9,
            publicSpeaking: 7,
            digitalCampaign: 5,
            regionalKnowledge: 6,
            crisisManagement: 4
        },
        bio: "Erfahrene Fundraiserin aus dem Non-Profit-Bereich mit einem beeindruckenden Netzwerk an potenziellen Großspendern."
    }
];

// Selected staff member ID
let selectedStaffId = null;

// Initialize staff UI
function initializeStaffUI() {
    renderStaffList();
    updateTeamStats();
    updateStaffBudget();
    
    // Add event listeners
    document.getElementById('staff-sort').addEventListener('change', sortStaff);
    document.getElementById('staff-search').addEventListener('input', filterStaff);
}

// Render staff list based on current data
function renderStaffList() {
    const staffListElement = document.getElementById('active-staff-list');
    const hiredStaff = staffDatabase.filter(staff => staff.hired);
    
    if (hiredStaff.length === 0) {
        staffListElement.innerHTML = `
            <div class="empty-staff-message">
                Dein Team ist noch leer. Stelle neue Mitarbeiter ein, um deine Kampagne zu unterstützen.
            </div>
        `;
        return;
    }
    
    let staffCards = '';
    
    hiredStaff.forEach(staff => {
        const isSelected = selectedStaffId === staff.id;
        const selectedClass = isSelected ? 'selected' : '';
        
        staffCards += `
            <div class="staff-card ${selectedClass}" data-id="${staff.id}" onclick="selectStaff(${staff.id})">
                <div class="staff-header-row">
                    <div class="staff-avatar ${staff.roleType}">${staff.initials}</div>
                    <div class="staff-info">
                        <div class="staff-name">${staff.name}</div>
                        <div class="staff-role">${staff.role}</div>
                        <div class="staff-exp">${staff.experience}</div>
                    </div>
                </div>
                <div class="staff-specialty">${staff.specialty}</div>
                <div class="staff-stats">
                    <div class="staff-stat">
                        <span class="stat-name">Strategie:</span>
                        <span class="stat-value">${staff.skills.strategy}</span>
                    </div>
                    <div class="stat-bar">
                        <div class="stat-fill" style="width: ${staff.skills.strategy * 10}%;"></div>
                    </div>
                    
                    <div class="staff-stat">
                        <span class="stat-name">Medien:</span>
                        <span class="stat-value">${staff.skills.media}</span>
                    </div>
                    <div class="stat-bar">
                        <div class="stat-fill" style="width: ${staff.skills.media * 10}%;"></div>
                    </div>
                    
                    <div class="staff-stat">
                        <span class="stat-name">Führung:</span>
                        <span class="stat-value">${staff.skills.leadership}</span>
                    </div>
                    <div class="stat-bar">
                        <div class="stat-fill" style="width: ${staff.skills.leadership * 10}%;"></div>
                    </div>
                </div>
                <div class="staff-salary">Gehalt: ${formatMoney(staff.salary)}/Monat</div>
            </div>
        `;
    });
    
    staffListElement.innerHTML = staffCards;
    
    // Add animation classes
    const cards = staffListElement.querySelectorAll('.staff-card');
    cards.forEach((card, index) => {
        setTimeout(() => {
            card.classList.add('animated-item', 'fadeIn');
            card.style.animationDelay = `${index * 0.05}s`;
        }, 10);
    });
}

// Select a staff member and show details
function selectStaff(staffId) {
    selectedStaffId = staffId;
    
    // Update UI to show selected state
    document.querySelectorAll('.staff-card').forEach(card => {
        card.classList.remove('selected');
    });
    
    const selectedCard = document.querySelector(`.staff-card[data-id="${staffId}"]`);
    if (selectedCard) {
        selectedCard.classList.add('selected');
        selectedCard.classList.add('pulse');
        setTimeout(() => {
            selectedCard.classList.remove('pulse');
        }, 500);
    }
    
    // Update details panel
    updateStaffDetails(staffId);
}

// Update the staff details panel
function updateStaffDetails(staffId) {
    const detailsPanel = document.getElementById('staff-details');
    const staff = staffDatabase.find(s => s.id === staffId);
    
    if (!staff) {
        detailsPanel.innerHTML = '<p>Wähle eine Person aus, um Details anzuzeigen.</p>';
        return;
    }
    
    // Get all skills as an array for display
    const skillsArray = [
        { name: 'Strategie', value: staff.skills.strategy },
        { name: 'Medien', value: staff.skills.media },
        { name: 'Führung', value: staff.skills.leadership },
        { name: 'Finanzen', value: staff.skills.finance },
        { name: 'Rhetorik', value: staff.skills.publicSpeaking },
        { name: 'Digital', value: staff.skills.digitalCampaign },
        { name: 'Regionales', value: staff.skills.regionalKnowledge },
        { name: 'Krisenmanagement', value: staff.skills.crisisManagement }
    ];
    
    // Sort skills by value for better display
    skillsArray.sort((a, b) => b.value - a.value);
    
    // Create special effects text
    let effectsText = '';
    if (staff.effects) {
        effectsText += '<div class="staff-effects">';
        effectsText += '<h5>Spezielle Effekte:</h5>';
        effectsText += '<ul>';
        
        if (staff.effects.polls) {
            effectsText += `<li>Umfragewerte: ${staff.effects.polls > 0 ? '+' : ''}${staff.effects.polls}%</li>`;
        }
        if (staff.effects.donations) {
            effectsText += `<li>Spenden: ${staff.effects.donations > 0 ? '+' : ''}${formatMoney(staff.effects.donations)}</li>`;
        }
        if (staff.effects.mediaBonus) {
            effectsText += `<li>Medienresonanz: ${staff.effects.mediaBonus > 0 ? '+' : ''}${staff.effects.mediaBonus * 100}%</li>`;
        }
        if (staff.effects.budget) {
            effectsText += `<li>Budget-Bonus: ${staff.effects.budget > 0 ? '+' : ''}${formatMoney(staff.effects.budget)}</li>`;
        }
        if (staff.effects.costReduction) {
            effectsText += `<li>Kostenreduktion: ${staff.effects.costReduction * 100}%</li>`;
        }
        if (staff.effects.youngVoterBonus) {
            effectsText += `<li>Junge Wähler: ${staff.effects.youngVoterBonus > 0 ? '+' : ''}${staff.effects.youngVoterBonus * 100}%</li>`;
        }
        if (staff.effects.crisisReduction) {
            effectsText += `<li>Krisen-Abmilderung: ${staff.effects.crisisReduction * 100}%</li>`;
        }
        
        effectsText += '</ul>';
        effectsText += '</div>';
    }
    
    // Create history list
    let historyHtml = '';
    if (staff.history && staff.history.length > 0) {
        historyHtml += '<div class="staff-history">';
        historyHtml += '<h5>Verlauf:</h5>';
        
        staff.history.forEach(item => {
            historyHtml += `
                <div class="history-item">
                    <span class="history-date">${item.date}:</span> 
                    ${item.event}
                </div>
            `;
        });
        
        historyHtml += '</div>';
    }
    
    // Create achievements list
    let achievementsHtml = '';
    if (staff.achievements && staff.achievements.length > 0) {
        achievementsHtml += '<div class="staff-achievements">';
        achievementsHtml += '<h5>Erfolge:</h5>';
        achievementsHtml += '<ul>';
        
        staff.achievements.forEach(achievement => {
            achievementsHtml += `<li>${achievement}</li>`;
        });
        
        achievementsHtml += '</ul>';
        achievementsHtml += '</div>';
    }
    
    // Construct the HTML
    let detailsHtml = `
        <div class="staff-detail-header">
            <h4>${staff.name}</h4>
            <div class="staff-role-badge ${staff.roleType}">${staff.role}</div>
        </div>
        
        <div class="staff-bio">
            ${staff.bio}
        </div>
        
        <div class="staff-detail-grid">
            <div class="detail-column">
                <div class="detail-section">
                    <h5>Top-Fähigkeiten</h5>
                    <div class="skills-list">
    `;
    
    // Add top 4 skills
    skillsArray.slice(0, 4).forEach(skill => {
        detailsHtml += `
            <div class="skill-item">
                <div class="skill-name">${skill.name}</div>
                <div class="skill-bar">
                    <div class="skill-fill" style="width: ${skill.value * 10}%;">${skill.value}/10</div>
                </div>
            </div>
        `;
    });
    
    detailsHtml += `
                    </div>
                </div>
                
                <div class="detail-section">
                    <h5>Loyalität</h5>
                    <div class="loyalty-meter">
                        <div class="loyalty-label">
                            <span>Loyalität: ${staff.loyalty}/100</span>
                            <span>${getLoyaltyText(staff.loyalty)}</span>
                        </div>
                        <div class="loyalty-bar">
                            <div class="loyalty-fill ${getLoyaltyClass(staff.loyalty)}" style="width: ${staff.loyalty}%;"></div>
                        </div>
                    </div>
                </div>
                
                ${effectsText}
            </div>
            
            <div class="detail-column">
                ${achievementsHtml}
                ${historyHtml}
            </div>
        </div>
        
        <div class="staff-actions">
            <button class="action-btn" onclick="showStaffDetailModal(${staff.id})">Ausführliches Profil</button>
            <button class="action-btn" onclick="trainStaffMember(${staff.id})">Weiterbilden</button>
        </div>
    `;
    
    detailsPanel.innerHTML = detailsHtml;
    
    // Add animation classes
    const sections = detailsPanel.querySelectorAll('.detail-section, .staff-bio, .staff-history, .staff-achievements, .staff-actions');
    sections.forEach((section, index) => {
        section.classList.add('animated-item', 'fadeIn');
        section.style.animationDelay = `${index * 0.1}s`;
    });
}

// Get text description based on loyalty value
function getLoyaltyText(loyalty) {
    if (loyalty >= 90) return "Sehr hoch";
    if (loyalty >= 75) return "Hoch";
    if (loyalty >= 50) return "Mittel";
    if (loyalty >= 25) return "Niedrig";
    return "Sehr niedrig";
}

// Get CSS class based on loyalty value
function getLoyaltyClass(loyalty) {
    if (loyalty >= 75) return "high";
    if (loyalty >= 40) return "medium";
    return "low";
}

// Sort staff based on selected criteria
function sortStaff() {
    const sortCriteria = document.getElementById('staff-sort').value;
    const hiredStaff = staffDatabase.filter(staff => staff.hired);
    
    switch (sortCriteria) {
        case 'role':
            hiredStaff.sort((a, b) => a.role.localeCompare(b.role));
            break;
        case 'skill':
            hiredStaff.sort((a, b) => {
                const aMaxSkill = Math.max(...Object.values(a.skills));
                const bMaxSkill = Math.max(...Object.values(b.skills));
                return bMaxSkill - aMaxSkill;
            });
            break;
        case 'salary':
            hiredStaff.sort((a, b) => b.salary - a.salary);
            break;
        case 'exp':
            hiredStaff.sort((a, b) => {
                const aYears = parseInt(a.experience.match(/\d+/)[0]);
                const bYears = parseInt(b.experience.match(/\d+/)[0]);
                return bYears - aYears;
            });
            break;
    }
    
    // Update the staffDatabase order to match the sort
    const sortedIds = hiredStaff.map(staff => staff.id);
    staffDatabase.sort((a, b) => {
        if (!a.hired) return 1;
        if (!b.hired) return -1;
        return sortedIds.indexOf(a.id) - sortedIds.indexOf(b.id);
    });
    
    // Re-render with animation
    renderStaffList();
}

// Filter staff based on search input
function filterStaff() {
    const searchTerm = document.getElementById('staff-search').value.toLowerCase();
    const staffCards = document.querySelectorAll('.staff-card');
    
    staffCards.forEach(card => {
        const staffId = parseInt(card.getAttribute('data-id'));
        const staff = staffDatabase.find(s => s.id === staffId);
        
        if (!staff) return;
        
        const matchesSearch = staff.name.toLowerCase().includes(searchTerm) || 
                             staff.role.toLowerCase().includes(searchTerm) ||
                             staff.specialty.toLowerCase().includes(searchTerm);
        
        if (matchesSearch) {
            card.style.display = '';
            card.classList.add('pulse');
            setTimeout(() => {
                card.classList.remove('pulse');
            }, 500);
        } else {
            card.style.display = 'none';
        }
    });
}

// Update team statistics
function updateTeamStats() {
    const hiredStaff = staffDatabase.filter(staff => staff.hired);
    let totalStrength = 0;
    
    hiredStaff.forEach(staff => {
        // Calculate average skill level
        const skillValues = Object.values(staff.skills);
        const avgSkill = skillValues.reduce((sum, val) => sum + val, 0) / skillValues.length;
        totalStrength += avgSkill;
    });
    
    // Round total strength to nearest integer
    totalStrength = Math.round(totalStrength);
    
    // Update UI
    document.getElementById('team-strength').textContent = totalStrength;
    
    // Update strength bar color based on value
    const strengthElement = document.getElementById('team-strength');
    
    if (totalStrength >= 30) {
        strengthElement.style.color = '#4caf50'; // Green for high strength
    } else if (totalStrength >= 20) {
        strengthElement.style.color = '#ff9800'; // Orange for medium strength
    } else {
        strengthElement.style.color = '#f44336'; // Red for low strength
    }
    
    // Add animation
    strengthElement.classList.add('pulse');
    setTimeout(() => {
        strengthElement.classList.remove('pulse');
    }, 500);
}

// Update staff budget display
function updateStaffBudget() {
    const hiredStaff = staffDatabase.filter(staff => staff.hired);
    let totalSalary = 0;
    
    hiredStaff.forEach(staff => {
        totalSalary += staff.salary;
    });
    
    // Update UI
    document.getElementById('staff-total-cost').textContent = formatMoney(totalSalary);
    
    // Calculate percentage of total budget (assuming 20% maximum)
    const budgetPercentage = Math.min(100, (totalSalary / gameState.resources.budget) * 500);
    
    // Update budget bar
    const budgetFill = document.querySelector('.budget-fill');
    budgetFill.style.width = `${budgetPercentage}%`;
    
    // Update color based on percentage
    if (budgetPercentage < 30) {
        budgetFill.style.backgroundColor = '#4caf50'; // Green
    } else if (budgetPercentage < 60) {
        budgetFill.style.backgroundColor = '#ff9800'; // Orange
    } else {
        budgetFill.style.backgroundColor = '#f44336'; // Red
    }
}

// Show the staff market to hire new staff
function showStaffMarket() {
    // Create fresh candidates if needed
    if (candidatePool.length < 4) {
        generateCandidates(4 - candidatePool.length);
    }
    
    // Open the modal
    const modal = document.getElementById('staff-market-modal');
    modal.style.display = 'flex';
    
    // Small delay for smooth transition
    setTimeout(() => {
        modal.classList.add('show');
    }, 10);
    
    // Update available budget
    document.getElementById('available-hiring-budget').textContent = formatMoney(gameState.resources.budget);
    
    // Render candidates
    renderCandidates();
}

// Close the staff market modal
function closeStaffMarket() {
    const modal = document.getElementById('staff-market-modal');
    modal.classList.remove('show');
    
    setTimeout(() => {
        modal.style.display = 'none';
    }, 300);
}

// Render candidates in the staff market
function renderCandidates() {
    const candidatesContainer = document.getElementById('staff-candidates');
    const roleFilter = document.getElementById('market-filter-role').value;
    
    // Filter candidates by role if needed
    let filteredCandidates = candidatePool;
    if (roleFilter !== 'all') {
        filteredCandidates = candidatePool.filter(candidate => candidate.roleType === roleFilter);
    }
    
    // If no candidates match filter, show message
    if (filteredCandidates.length === 0) {
        candidatesContainer.innerHTML = `
            <div class="empty-candidates-message">
                Keine Kandidaten gefunden. Versuch es mit einem anderen Filter oder aktualisiere die Kandidatenliste.
            </div>
        `;
        return;
    }
    
    let candidatesHtml = '';
    
    filteredCandidates.forEach((candidate, index) => {
        // Calculate if player can afford this candidate
        const canAfford = gameState.resources.budget >= candidate.salary * 3; // 3 months upfront
        
        // Get top skills for display
        const skillsArray = [
            { name: 'Strategie', value: candidate.skills.strategy },
            { name: 'Medien', value: candidate.skills.media },
            { name: 'Führung', value: candidate.skills.leadership },
            { name: 'Finanzen', value: candidate.skills.finance }
        ];
        
        skillsArray.sort((a, b) => b.value - a.value);
        
        // Create HTML for candidate card
        candidatesHtml += `
            <div class="candidate-card staggered-item" style="transition-delay: ${index * 0.1}s;">
                <div class="candidate-header">
                    <div class="staff-avatar ${candidate.roleType}">${candidate.initials}</div>
                    <div class="candidate-info">
                        <div class="candidate-name">${candidate.name}</div>
                        <div class="candidate-role">${candidate.role}</div>
                        <div class="candidate-exp">${candidate.experience}</div>
                    </div>
                </div>
                <div class="candidate-body">
                    <div class="candidate-specialty">${candidate.specialty}</div>
                    <div class="candidate-skills">
        `;
        
        // Add top 3 skills
        skillsArray.slice(0, 3).forEach(skill => {
            candidatesHtml += `
                <div class="skill-item">
                    <div class="skill-name">${skill.name}:</div>
                    <div class="skill-bar">
                        <div class="skill-fill" style="width: ${skill.value * 10}%;">${skill.value}</div>
                    </div>
                </div>
            `;
        });
        
        candidatesHtml += `
                    </div>
                    <div class="candidate-background">${candidate.bio}</div>
                    <div class="candidate-cost">
                        <div class="salary-amount">${formatMoney(candidate.salary)}/Monat</div>
                        <button class="hire-btn" onclick="hireStaff(${candidate.id})" ${canAfford ? '' : 'disabled'}>
                            ${canAfford ? 'Einstellen' : 'Zu teuer'}
                        </button>
                    </div>
                </div>
            </div>
        `;
    });
    
    candidatesContainer.innerHTML = candidatesHtml;
    
    // Trigger animations
    setTimeout(() => {
        const staggeredItems = candidatesContainer.querySelectorAll('.staggered-item');
        staggeredItems.forEach(item => {
            item.classList.add('show');
        });
    }, 50);
}

// Hire a staff member from the candidate pool
function hireStaff(candidateId) {
    const candidate = candidatePool.find(c => c.id === candidateId);
    
    if (!candidate) return;
    
    // Check if player can afford (3 months upfront)
    const hireCost = candidate.salary * 3;
    
    if (gameState.resources.budget < hireCost) {
        showNotification('Nicht genug Budget, um diese Person einzustellen!', 'error');
        return;
    }
    
    // Deduct cost from budget
    gameState.resources.budget -= hireCost;
    
    // Add to staff database
    const newStaff = {
        ...candidate,
        hired: true,
        loyalty: 70 + Math.floor(Math.random() * 20), // Random initial loyalty 70-90
        history: [
            { date: `${getMonthName(gameState.currentMonth)} ${gameState.currentYear}`, event: "Zum Team hinzugefügt" }
        ],
        achievements: [],
        effects: generateStaffEffects(candidate)
    };
    
    staffDatabase.push(newStaff);
    
    // Remove from candidate pool
    candidatePool = candidatePool.filter(c => c.id !== candidateId);
    
    // Show notification
    showNotification(`${newStaff.name} wurde erfolgreich eingestellt!`, 'success');
    
    // Update UI
    renderStaffList();
    updateTeamStats();
    updateStaffBudget();
    
    // Close modal with delay for better UX
    setTimeout(() => {
        closeStaffMarket();
    }, 1000);
    
    // Add event to game log
    addLogEntry(`Du hast ${newStaff.name} als ${newStaff.role} eingestellt.`);
}

// Generate effects for a new staff member based on skills
function generateStaffEffects(candidate) {
    const effects = {};
    
    // Apply effects based on role and skills
    switch (candidate.roleType) {
        case 'strategy':
            if (candidate.skills.strategy >= 8) effects.polls = 0.2 + (candidate.skills.strategy - 8) * 0.1;
            if (candidate.skills.leadership >= 7) effects.leadershipBonus = 0.1 * candidate.skills.leadership / 10;
            if (candidate.skills.crisisManagement >= 6) effects.crisisReduction = 0.15 * candidate.skills.crisisManagement / 10;
            break;
            
        case 'media':
            if (candidate.skills.media >= 7) effects.media = 1 + (candidate.skills.media - 7) * 0.2;
            if (candidate.skills.digitalCampaign >= 8) effects.youngVoterBonus = 0.2 * candidate.skills.digitalCampaign / 10;
            if (candidate.skills.publicSpeaking >= 7) effects.polls = 0.1 * candidate.skills.publicSpeaking / 10;
            break;
            
        case 'finance':
            if (candidate.skills.finance >= 7) effects.donations = 10000 * (candidate.skills.finance / 10);
            if (candidate.skills.finance >= 8) effects.costReduction = 0.05 * candidate.skills.finance / 10;
            break;
            
        case 'field':
            if (candidate.skills.regionalKnowledge >= 7) effects.regionalBonus = 0.15 * candidate.skills.regionalKnowledge / 10;
            if (candidate.skills.leadership >= 6) effects.memberRecruitment = 1000 * candidate.skills.leadership / 10;
            break;
    }
    
    return effects;
}

// Refresh candidate pool with new options
function refreshCandidates() {
    // Cost to refresh
    const refreshCost = 25000;
    
    if (gameState.resources.budget < refreshCost) {
        showNotification('Nicht genug Budget, um neue Kandidaten zu suchen!', 'error');
        return;
    }
    
    // Deduct cost from budget
    gameState.resources.budget -= refreshCost;
    
    // Generate new candidates
    candidatePool = [];
    generateCandidates(4);
    
    // Show notification
    showNotification('Neue Kandidaten gefunden!', 'success');
    
    // Update UI
    document.getElementById('available-hiring-budget').textContent = formatMoney(gameState.resources.budget);
    renderCandidates();
}

// Generate new candidates for the pool
function generateCandidates(count) {
    // Role types to generate
    const roleTypes = ['strategy', 'media', 'finance', 'field'];
    
    // Role titles for each type
    const roleTitles = {
        strategy: ['Strategieberater', 'Kampagnenleiter', 'Politikberater', 'Wahlkampfstratege'],
        media: ['Pressesprecher', 'Medienberater', 'Social Media Manager', 'Kommunikationschef'],
        finance: ['Fundraiser', 'Schatzmeister', 'Finanzmanager', 'Budget-Koordinator'],
        field: ['Regionalkoordinator', 'Wahlkreisleiter', 'Organisationsleiter', 'Basiskoordinator']
    };
    
    // Specialty options
    const specialties = {
        strategy: ['Wahlkampfstrategie', 'Politische Analyse', 'Krisenkommunikation', 'Zielgruppenanalyse'],
        media: ['TV-Auftritte', 'Digitale Kampagnen', 'Pressearbeit', 'Content-Strategie'],
        finance: ['Großspender-Kontakte', 'Budgetoptimierung', 'Fundraising-Events', 'Kostenmanagement'],
        field: ['Ost-Deutschland', 'Städtische Wähler', 'Ländliche Regionen', 'Wahlkreisorganisation']
    };
    
    // Generate candidates
    for (let i = 0; i < count; i++) {
        // Generate a random ID between 100-999
        const id = 100 + Math.floor(Math.random() * 900);
        
        // Pick a random role type
        const roleType = roleTypes[Math.floor(Math.random() * roleTypes.length)];
        
        // Pick a random role title for that type
        const role = roleTitles[roleType][Math.floor(Math.random() * roleTitles[roleType].length)];
        
        // Pick a random specialty for that type
        const specialty = specialties[roleType][Math.floor(Math.random() * specialties[roleType].length)];
        
        // Generate skills based on role type (primary skills boosted)
        const skills = {
            strategy: 3 + Math.floor(Math.random() * 4),
            media: 3 + Math.floor(Math.random() * 4),
            leadership: 3 + Math.floor(Math.random() * 4),
            finance: 3 + Math.floor(Math.random() * 4),
            publicSpeaking: 3 + Math.floor(Math.random() * 4),
            digitalCampaign: 3 + Math.floor(Math.random() * 4),
            regionalKnowledge: 3 + Math.floor(Math.random() * 4),
            crisisManagement: 3 + Math.floor(Math.random() * 4)
        };
        
        // Boost primary skills for the role
        switch (roleType) {
            case 'strategy':
                skills.strategy += 2 + Math.floor(Math.random() * 3);
                skills.leadership += 1 + Math.floor(Math.random() * 2);
                skills.crisisManagement += 1 + Math.floor(Math.random() * 2);
                break;
            case 'media':
                skills.media += 2 + Math.floor(Math.random() * 3);
                skills.publicSpeaking += 1 + Math.floor(Math.random() * 2);
                skills.digitalCampaign += 1 + Math.floor(Math.random() * 2);
                break;
            case 'finance':
                skills.finance += 2 + Math.floor(Math.random() * 3);
                skills.strategy += 1 + Math.floor(Math.random() * 2); // Für strategy
                skills.finance += 2 + Math.floor(Math.random() * 3);  // Für finance
                skills.strategy += 1 + Math.floor(Math.random() * 2);
                skills.leadership += 1;
                break;
            case 'field':
                skills.regionalKnowledge += 2 + Math.floor(Math.random() * 3);
                skills.leadership += 1 + Math.floor(Math.random() * 2);
                skills.publicSpeaking += 1;
                break;
        }
        
        // Cap all skills at 10
        for (const skill in skills) {
            skills[skill] = Math.min(10, skills[skill]);
        }
        
        // Generate experience (years)
        const experience = `${3 + Math.floor(Math.random() * 18)} Jahre`;
        
        // Generate salary based on average skill level and experience
        const avgSkill = Object.values(skills).reduce((sum, val) => sum + val, 0) / Object.keys(skills).length;
        const expYears = parseInt(experience.match(/\d+/)[0]);
        const baseSalary = 25000;
        const skillBonus = avgSkill * 1000;
        const expBonus = expYears * 500;
        const salary = Math.round((baseSalary + skillBonus + expBonus) / 1000) * 1000; // Round to nearest 1000
        
        // Generate random name
        const firstName = getRandomFirstName();
        const lastName = getRandomLastName();
        const name = `${firstName} ${lastName}`;
        const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`;
        
        // Generate bio text
        const bio = generateBioText(roleType, specialty, expYears);
        
        // Create new candidate
        const newCandidate = {
            id,
            name,
            initials,
            role,
            roleType,
            salary,
            experience,
            specialty,
            skills,
            bio
        };
        
        candidatePool.push(newCandidate);
    }
}

// Open the staff detail modal
function showStaffDetailModal(staffId) {
    const staff = staffDatabase.find(s => s.id === staffId);
    if (!staff) return;
    
    // Set the staff ID in modal
    const nameElement = document.getElementById('detail-staff-name');
    nameElement.textContent = staff.name;
    nameElement.setAttribute('data-id', staffId); // Store the ID as attribute
    
    // Populate detail container
    const detailContainer = document.getElementById('detail-container');
    
    // Build skill bars HTML
    let skillsHtml = '';
    for (const [skill, value] of Object.entries(staff.skills)) {
        const skillLabel = getSkillLabel(skill);
        skillsHtml += `
            <div class="skill-item">
                <div class="skill-name">${skillLabel}</div>
                <div class="skill-bar">
                    <div class="skill-fill" style="width: ${value * 10}%;">${value}/10</div>
                </div>
            </div>
        `;
    }
    
    // Build history HTML
    let historyHtml = '';
    if (staff.history && staff.history.length > 0) {
        historyHtml = '<ul class="detail-history">';
        staff.history.forEach(item => {
            historyHtml += `
                <li class="history-event">
                    <div class="event-date">${item.date}</div>
                    <div class="event-description">${item.event}</div>
                </li>
            `;
        });
        historyHtml += '</ul>';
    } else {
        historyHtml = '<p>Keine Einträge vorhanden.</p>';
    }
    
    // Build achievements HTML
    let achievementsHtml = '';
    if (staff.achievements && staff.achievements.length > 0) {
        achievementsHtml = '<div class="achievements-list">';
        staff.achievements.forEach(achievement => {
            achievementsHtml += `
                <div class="achievement-item">
                    <div class="achievement-icon">🏆</div>
                    <div class="achievement-text">${achievement}</div>
                </div>
            `;
        });
        achievementsHtml += '</div>';
    } else {
        achievementsHtml = '<p>Noch keine Erfolge erzielt.</p>';
    }
    
    // Build effects HTML
    let effectsHtml = '<ul class="effects-list">';
    if (staff.effects) {
        for (const [effect, value] of Object.entries(staff.effects)) {
            const effectLabel = getEffectLabel(effect);
            const formattedValue = formatEffectValue(effect, value);
            
            effectsHtml += `
                <li class="effect-item">
                    <span class="effect-name">${effectLabel}:</span>
                    <span class="effect-value">${formattedValue}</span>
                </li>
            `;
        }
    }
    effectsHtml += '</ul>';
    
    // Set HTML content
    detailContainer.innerHTML = `
        <div class="detail-section">
            <h5>Biografie</h5>
            <div class="detail-bio">${staff.bio}</div>
        </div>
        
        <div class="detail-loyalty">
            <h5>Loyalität</h5>
            <div class="loyalty-label">
                <span>Loyalität:</span>
                <span>${staff.loyalty}/100 (${getLoyaltyText(staff.loyalty)})</span>
            </div>
            <div class="loyalty-bar">
                <div class="loyalty-fill ${getLoyaltyClass(staff.loyalty)}" style="width: ${staff.loyalty}%;"></div>
            </div>
        </div>
        
        <div class="detail-section">
            <h5>Fähigkeiten</h5>
            <div class="detail-stats">
                ${skillsHtml}
            </div>
        </div>
        
        <div class="detail-section">
            <h5>Spezielle Effekte</h5>
            ${effectsHtml}
        </div>
        
        <div class="detail-section">
            <h5>Erfolge</h5>
            ${achievementsHtml}
        </div>
        
        <div class="detail-section">
            <h5>Aktivitätshistorie</h5>
            ${historyHtml}
        </div>
    `;
    
    // Display fire button
    document.getElementById('fire-staff-btn').style.display = '';
    
    // Open modal
    const modal = document.getElementById('staff-detail-modal');
    modal.style.display = 'flex';
    
    // Small delay for smooth transition
    setTimeout(() => {
        modal.classList.add('show');
    }, 10);
}
    
    // Build history HTML
    let historyHtml = '';
    if (staff.history && staff.history.length > 0) {
        historyHtml = '<ul class="detail-history">';
        staff.history.forEach(item => {
            historyHtml += `
                <li class="history-event">
                    <div class="event-date">${item.date}</div>
                    <div class="event-description">${item.event}</div>
                </li>
            `;
        });
        historyHtml += '</ul>';
    } else {
        historyHtml = '<p>Keine Einträge vorhanden.</p>';
    }
    
    // Build achievements HTML
    let achievementsHtml = '';
    if (staff.achievements && staff.achievements.length > 0) {
        achievementsHtml = '<div class="achievements-list">';
        staff.achievements.forEach(achievement => {
            achievementsHtml += `
                <div class="achievement-item">
                    <div class="achievement-icon">🏆</div>
                    <div class="achievement-text">${achievement}</div>
                </div>
            `;
        });
        achievementsHtml += '</div>';
    } else {
        achievementsHtml = '<p>Noch keine Erfolge erzielt.</p>';
    }
    
    // Build effects HTML
    let effectsHtml = '<ul class="effects-list">';
    if (staff.effects) {
        for (const [effect, value] of Object.entries(staff.effects)) {
            const effectLabel = getEffectLabel(effect);
            const formattedValue = formatEffectValue(effect, value);
            
            effectsHtml += `
                <li class="effect-item">
                    <span class="effect-name">${effectLabel}:</span>
                    <span class="effect-value">${formattedValue}</span>
                </li>
            `;
        }
    }
    effectsHtml += '</ul>';
    
    // Set HTML content
    detailContainer.innerHTML = `
        <div class="detail-section">
            <h5>Biografie</h5>
            <div class="detail-bio">${staff.bio}</div>
        </div>
        
        <div class="detail-loyalty">
            <h5>Loyalität</h5>
            <div class="loyalty-label">
                <span>Loyalität:</span>
                <span>${staff.loyalty}/100 (${getLoyaltyText(staff.loyalty)})</span>
            </div>
            <div class="loyalty-bar">
                <div class="loyalty-fill ${getLoyaltyClass(staff.loyalty)}" style="width: ${staff.loyalty}%;"></div>
            </div>
        </div>
        
        <div class="detail-section">
            <h5>Fähigkeiten</h5>
            <div class="detail-stats">
                ${skillsHtml}
            </div>
        </div>
        
        <div class="detail-section">
            <h5>Spezielle Effekte</h5>
            ${effectsHtml}
        </div>
        
        <div class="detail-section">
            <h5>Erfolge</h5>
            ${achievementsHtml}
        </div>
        
        <div class="detail-section">
            <h5>Aktivitätshistorie</h5>
            ${historyHtml}
        </div>
    `;
    
    // Display fire button
    document.getElementById('fire-staff-btn').style.display = '';
    
    // Open modal
    const modal = document.getElementById('staff-detail-modal');
    modal.style.display = 'flex';
    
    // Small delay for smooth transition
    setTimeout(() => {
        modal.classList.add('show');
    }, 10);


// Close the staff detail modal
function closeStaffDetailModal() {
    const modal = document.getElementById('staff-detail-modal');
    modal.classList.remove('show');
    
    setTimeout(() => {
        modal.style.display = 'none';
    }, 300);
}

// Fire a staff member
function fireStaff() {
    const nameElement = document.getElementById('detail-staff-name');
    const staffId = parseInt(nameElement.getAttribute('data-id'));
    
    if (!staffId) {
        showNotification('Konnte Mitarbeiter nicht finden!', 'error');
        return;
    }
    
    const staff = staffDatabase.find(s => s.id === staffId);
    
    if (!staff) {
        showNotification('Konnte Mitarbeiter nicht finden!', 'error');
        return;
    }
    
    // Show confirmation dialog
    if (!confirm(`Möchtest du ${staff.name} wirklich entlassen? Dies kann sich negativ auf die Moral des restlichen Teams auswirken.`)) {
        return;
    }
    
    // Remove from hired staff
    staff.hired = false;
    
    // Give partial refund of this month's salary
    const refund = Math.round(staff.salary * 0.3); // 30% refund
    gameState.resources.budget += refund;
    
    // Lower team morale
    staffDatabase.filter(s => s.hired).forEach(s => {
        s.loyalty = Math.max(10, s.loyalty - 5);
    });
    
    // Show notification
    showNotification(`${staff.name} wurde entlassen. Rückerstattung: ${formatMoney(refund)}`, 'warning');
    
    // Close modals
    closeStaffDetailModal();
    
    // Add event to game log
    addLogEntry(`Du hast ${staff.name} entlassen.`);
    
    // Update UI
    renderStaffList();
    updateTeamStats();
    updateStaffBudget();
    
    // Clear selection if the fired staff was selected
    if (selectedStaffId === staffId) {
        selectedStaffId = null;
        document.getElementById('staff-details').innerHTML = '<p>Wähle eine Person aus, um Details anzuzeigen.</p>';
    }
}

// Train staff with specific training
function trainStaff(trainingType) {
    if (!selectedStaffId) {
        showNotification('Bitte wähle zuerst ein Teammitglied aus!', 'warning');
        return;
    }
    
    const staff = staffDatabase.find(s => s.id === selectedStaffId);
    if (!staff) return;
    
    // Determine training cost and effects
    const trainingCosts = {
        leadership: 50000,
        media: 35000,
        strategy: 40000,
        field: 25000
    };
    
    const cost = trainingCosts[trainingType];
    
    // Check if player can afford
    if (gameState.resources.budget < cost) {
        showNotification(`Nicht genug Budget für dieses Training! (${formatMoney(cost)})`, 'error');
        return;
    }
    
    // Deduct cost
    gameState.resources.budget -= cost;
    
    // Apply training effects
    applyTrainingEffects(staff, trainingType);
    
    // Add to history
    staff.history.push({
        date: `${getMonthName(gameState.currentMonth)} ${gameState.currentYear}`,
        event: `${getTrainingLabel(trainingType)}-Training absolviert`
    });
    
    // Increase loyalty
    staff.loyalty = Math.min(100, staff.loyalty + 5);
    
    // Show notification
    showNotification(`${staff.name} hat das Training erfolgreich abgeschlossen!`, 'success');
    
    // Update UI
    updateStaffDetails(selectedStaffId);
    updateTeamStats();
    
    // Add event to game log
    addLogEntry(`${staff.name} hat ein ${getTrainingLabel(trainingType)}-Training absolviert.`);
}

// Apply specific training effects to a staff member
function applyTrainingEffects(staff, trainingType) {
    switch (trainingType) {
        case 'leadership':
            // Improve leadership, strategy and public speaking
            staff.skills.leadership = Math.min(10, staff.skills.leadership + 1);
            staff.skills.strategy = Math.min(10, staff.skills.strategy + 0.5);
            staff.skills.publicSpeaking = Math.min(10, staff.skills.publicSpeaking + 0.5);
            
            // Add leadership effect if not present
            if (!staff.effects.leadershipBonus) {
                staff.effects.leadershipBonus = 0.05;
            } else {
                staff.effects.leadershipBonus += 0.03;
            }
            
            // Add achievement if first leadership training
            if (!staff.achievements.includes("Führungstraining abgeschlossen")) {
                staff.achievements.push("Führungstraining abgeschlossen");
            }
            break;
            
        case 'media':
            // Improve media, digital campaign and public speaking
            staff.skills.media = Math.min(10, staff.skills.media + 1);
            staff.skills.digitalCampaign = Math.min(10, staff.skills.digitalCampaign + 0.5);
            staff.skills.publicSpeaking = Math.min(10, staff.skills.publicSpeaking + 0.5);
            
            // Add media effect if not present
            if (!staff.effects.mediaBonus) {
                staff.effects.mediaBonus = 0.1;
            } else {
                staff.effects.mediaBonus += 0.05;
            }
            
            // Add achievement if first media training
            if (!staff.achievements.includes("Medientraining abgeschlossen")) {
                staff.achievements.push("Medientraining abgeschlossen");
            }
            break;
            
        case 'strategy':
            // Improve strategy, crisis management and leadership
            staff.skills.strategy = Math.min(10, staff.skills.strategy + 1);
            staff.skills.crisisManagement = Math.min(10, staff.skills.crisisManagement + 0.5);
            staff.skills.leadership = Math.min(10, staff.skills.leadership + 0.5);
            
            // Add polls effect if not present
            if (!staff.effects.polls) {
                staff.effects.polls = 0.05;
            } else {
                staff.effects.polls += 0.03;
            }
            
            // Add achievement if first strategy training
            if (!staff.achievements.includes("Strategietraining abgeschlossen")) {
                staff.achievements.push("Strategietraining abgeschlossen");
            }
            break;
            
        case 'field':
            // Improve regional knowledge, public speaking and leadership
            staff.skills.regionalKnowledge = Math.min(10, staff.skills.regionalKnowledge + 1);
            staff.skills.publicSpeaking = Math.min(10, staff.skills.publicSpeaking + 0.5);
            staff.skills.leadership = Math.min(10, staff.skills.leadership + 0.5);
            
            // Add regional bonus effect if not present
            if (!staff.effects.regionalBonus) {
                staff.effects.regionalBonus = 0.1;
            } else {
                staff.effects.regionalBonus += 0.05;
            }
            
            // Add achievement if first field training
            if (!staff.achievements.includes("Feldeinsatztraining abgeschlossen")) {
                staff.achievements.push("Feldeinsatztraining abgeschlossen");
            }
            break;
    }
}

// Train a specific staff member
function trainStaffMember(staffId) {
    selectStaff(staffId);
    
    // Highlight training panel
    const trainingPanel = document.querySelector('.staff-training-panel');
    trainingPanel.classList.add('pulse');
    setTimeout(() => {
        trainingPanel.classList.remove('pulse');
    }, 1000);
    
    // Scroll to training panel
    trainingPanel.scrollIntoView({ behavior: 'smooth' });
}

// Helper function to format effect values
function formatEffectValue(effect, value) {
    switch (effect) {
        case 'polls':
        case 'mediaBonus':
        case 'leadershipBonus':
        case 'costReduction':
        case 'youngVoterBonus':
        case 'crisisReduction':
        case 'regionalBonus':
            return `+${(value * 100).toFixed(1)}%`;
        case 'donations':
        case 'budget':
            return `+${formatMoney(value)}`;
        default:
            return value;
    }
}

// Get human-readable label for a skill
function getSkillLabel(skill) {
    const labels = {
        strategy: 'Strategie',
        media: 'Medien',
        leadership: 'Führung',
        finance: 'Finanzen',
        publicSpeaking: 'Rhetorik',
        digitalCampaign: 'Digitales',
        regionalKnowledge: 'Regionales',
        crisisManagement: 'Krisenmanagement'
    };
    
    return labels[skill] || skill;
}

// Get human-readable label for an effect
function getEffectLabel(effect) {
    const labels = {
        polls: 'Umfragewerte',
        donations: 'Spenden',
        mediaBonus: 'Medienresonanz',
        budget: 'Budget-Bonus',
        costReduction: 'Kostenreduktion',
        youngVoterBonus: 'Junge Wähler',
        crisisReduction: 'Krisen-Abmilderung',
        leadershipBonus: 'Führungsbonus',
        regionalBonus: 'Regionaler Bonus',
        memberRecruitment: 'Mitgliedergewinnung'
    };
    
    return labels[effect] || effect;
}

// Get human-readable label for training type
function getTrainingLabel(trainingType) {
    const labels = {
        leadership: 'Führungs',
        media: 'Medien',
        strategy: 'Strategie',
        field: 'Feldeinsatz'
    };
    
    return labels[trainingType] || trainingType;
}

// Helper functions for generating random content
function getRandomFirstName() {
    const firstNames = [
        'Alexander', 'Andreas', 'Anna', 'Bernd', 'Birgit', 'Christian', 
        'Christine', 'Daniel', 'Dennis', 'Elisabeth', 'Eva', 'Frank', 
        'Friedrich', 'Gabriele', 'Hans', 'Heike', 'Jan', 'Jennifer', 
        'Julia', 'Jürgen', 'Katharina', 'Klaus', 'Laura', 'Lisa', 
        'Lukas', 'Manfred', 'Marie', 'Martin', 'Martina', 'Matthias', 
        'Michael', 'Monika', 'Nicole', 'Peter', 'Ralf', 'Sabine', 
        'Sandra', 'Sarah', 'Stefan', 'Susanne', 'Thomas', 'Ulrich', 
        'Ursula', 'Wolfgang'
    ];
    
    return firstNames[Math.floor(Math.random() * firstNames.length)];
}

function getRandomLastName() {
    const lastNames = [
        'Müller', 'Schmidt', 'Schneider', 'Fischer', 'Weber', 'Meyer', 
        'Wagner', 'Becker', 'Schulz', 'Hoffmann', 'Koch', 'Richter', 
        'Bauer', 'Klein', 'Wolf', 'Schröder', 'Neumann', 'Schwarz', 
        'Zimmermann', 'Braun', 'Krüger', 'Hofmann', 'Hartmann', 'Lange', 
        'Schmitt', 'Werner', 'Schmitz', 'Krause', 'Meier', 'Lehmann', 
        'Schmid', 'Schulze', 'Maier', 'Köhler', 'Herrmann', 'Walter', 
        'König', 'Mayer', 'Huber', 'Kaiser', 'Fuchs', 'Peters', 'Lang', 
        'Scholz', 'Möller', 'Weiß', 'Jung', 'Hahn', 'Keller', 'Vogel'
    ];
    
    return lastNames[Math.floor(Math.random() * lastNames.length)];
}

function generateBioText(roleType, specialty, expYears) {
    // Background templates
    const backgrounds = {
        strategy: [
            "Ehemaliger politischer Berater mit Erfahrung in %EXP% Wahlkämpfen. Spezialisiert auf %SPEC%.",
            "Hat zuvor für verschiedene Parteien gearbeitet und bringt eine Perspektive mit %EXP% Jahren Erfahrung. Besonderer Fokus auf %SPEC%.",
            "Politikwissenschaftler mit praktischer Erfahrung aus %EXP% Jahren in der Politikberatung. Experte für %SPEC%."
        ],
        media: [
            "Ehemalige/r Journalist/in mit exzellenten Medienkontakten und %EXP% Jahren Erfahrung. Spezialisiert auf %SPEC%.",
            "Kommunikationsexperte/in aus der PR-Branche mit %EXP%-jähriger Erfahrung. Besondere Stärke im Bereich %SPEC%.",
            "Hat zuvor bei einer großen Medienagentur gearbeitet und kennt die Medienlandschaft aus %EXP% Jahren Praxis. Fokus auf %SPEC%."
        ],
        finance: [
            "Erfahrene/r Finanzexperte/in mit %EXP%-jährigem Hintergrund im Fundraising. Spezialisiert auf %SPEC%.",
            "Hat %EXP% Jahre für verschiedene Organisationen Finanzierungskonzepte entwickelt. Besondere Expertise in %SPEC%.",
            "Bringt Erfahrung aus dem Banken- und Finanzsektor mit %EXP% Jahren Praxis. Schwerpunkt auf %SPEC%."
        ],
        field: [
            "Organisationstalent mit %EXP% Jahren praktischer Erfahrung in der Basisarbeit. Besonders versiert in %SPEC%.",
            "Ehemaliger/e Wahlkreiskoordinator/in mit %EXP%-jähriger Erfahrung im Feldeinsatz. Spezialisiert auf %SPEC%.",
            "Hat %EXP% Jahre Erfahrung in der Koordination von Freiwilligen und Wahlkampfteams. Fokus auf %SPEC%."
        ]
    };
    
    // Select random template for the role type
    const templates = backgrounds[roleType];
    const template = templates[Math.floor(Math.random() * templates.length)];
    
    // Replace placeholders
    return template
        .replace('%EXP%', expYears)
        .replace('%SPEC%', specialty);
}

// Update staff for monthly changes
function updateStaffMonthly() {
    const hiredStaff = staffDatabase.filter(staff => staff.hired);
    
    hiredStaff.forEach(staff => {
        // Pay salary
        gameState.resources.budget -= staff.salary;
        
        // Random events that might affect loyalty
        const randomEvent = Math.random();
        
        // Special event (10% chance)
        if (randomEvent < 0.1) {
            const eventType = Math.random();
            
            if (eventType < 0.6) {
                // Positive event (60% of special events)
                staff.loyalty = Math.min(100, staff.loyalty + Math.floor(Math.random() * 5) + 1);
                
                // Add to history
                staff.history.push({
                    date: `${getMonthName(gameState.currentMonth)} ${gameState.currentYear}`,
                    event: getRandomPositiveEvent(staff)
                });
                
                // Log if significant improvement
                if (Math.random() < 0.3) {
                    addLogEntry(`${staff.name} hat diesen Monat hervorragende Arbeit geleistet.`);
                }
            } else {
                // Negative event (40% of special events)
                staff.loyalty = Math.max(10, staff.loyalty - Math.floor(Math.random() * 8) - 2);
                
                // Add to history
                staff.history.push({
                    date: `${getMonthName(gameState.currentMonth)} ${gameState.currentYear}`,
                    event: getRandomNegativeEvent(staff)
                });
                
                // Log if significant problem
                if (Math.random() < 0.4) {
                    addLogEntry(`${staff.name} hatte diesen Monat Schwierigkeiten mit ${staff.role === 'Pressesprecherin' ? 'ihrer' : 'seiner'} Arbeit.`);
                }
            }
        } else {
            // Normal loyalty change (small fluctuation)
            const loyaltyChange = Math.floor(Math.random() * 3) - 1; // -1, 0, or +1
            staff.loyalty = Math.max(10, Math.min(100, staff.loyalty + loyaltyChange));
        }
        
        // Low loyalty warning
        if (staff.loyalty < 30 && Math.random() < 0.5) {
            addLogEntry(`${staff.name} scheint unzufrieden zu sein. Die Loyalität ist niedrig.`, true);
        }
        
        // Very low loyalty: risk of resignation
        if (staff.loyalty < 20 && Math.random() < 0.3) {
            // Staff resigns
            staff.hired = false;
            
            // Show notification
            showNotification(`${staff.name} hat gekündigt aufgrund niedriger Zufriedenheit!`, 'error');
            
            // Add to game log
            addLogEntry(`${staff.name} hat das Team verlassen.`, true);
            
            // Clear selection if the resigned staff was selected
            if (selectedStaffId === staff.id) {
                selectedStaffId = null;
                document.getElementById('staff-details').innerHTML = '<p>Wähle eine Person aus, um Details anzuzeigen.</p>';
            }
        }
    });
    
    // Update UI
    renderStaffList();
    updateTeamStats();
    updateStaffBudget();
}

// Random event text generators
function getRandomPositiveEvent(staff) {
    const events = [
        "Hat eine erfolgreiche Kampagnenstrategie entwickelt",
        "Gute Beziehungen zu wichtigen Medienvertretern aufgebaut",
        "Erfolgreiches Fundraising-Event organisiert",
        "Positive Medienresonanz für die Kampagne erzielt",
        "Effektive Krisenkommunikation geleistet",
        "Neue Unterstützergruppe erschlossen",
        "Starke Präsenz in sozialen Medien erzielt",
        "Innovative Kampagnenidee umgesetzt",
        "Erfolgreiches Briefing für TV-Debatte durchgeführt",
        "Wichtige Kontakte zu Meinungsbildnern geknüpft"
    ];
    
    return events[Math.floor(Math.random() * events.length)];
}

function getRandomNegativeEvent(staff) {
    const events = [
        "Hatte Schwierigkeiten mit der Umsetzung von Kampagnenzielen",
        "Kommunikationsprobleme mit anderen Teammitgliedern",
        "Versäumte wichtige Deadline",
        "Unzufriedenheit mit der Arbeitsbelastung geäußert",
        "Fehler in einer Pressemitteilung gemacht",
        "Konflikt mit einem anderen Teammitglied",
        "Probleme mit der Anpassung an neue Kampagnenstrategie",
        "Kritik an der Führung des Wahlkampfteams geäußert",
        "Unzufriedenheit mit der Vergütung signalisiert",
        "Wichtiges Meeting verpasst"
    ];
    
    return events[Math.floor(Math.random() * events.length)];
}

// Call initialization on page load
document.addEventListener('DOMContentLoaded', initializeStaffUI);

// Update game state to include staff functionality
gameState.updateStaff = function() {
    updateStaffMonthly();
};

// Add to NextTurn function
const originalNextTurn = window.nextTurn;
window.nextTurn = function() {
    // Call original function
    originalNextTurn();
    
    // Add staff update after original next turn
    if (typeof gameState.updateStaff === 'function') {
        gameState.updateStaff();
    }
};