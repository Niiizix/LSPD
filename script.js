// script.js

// Attendre que le DOM soit complètement chargé
document.addEventListener('DOMContentLoaded', function() {
    // Variables pour la modal du formulaire de recrutement
    const modal = document.getElementById('recruitmentModal');
    const openBtn = document.getElementById('openFormBtn');
    const closeBtn = document.querySelector('.close-modal');
    const form = document.getElementById('recruitmentForm');
    const knowledgeSlider = document.getElementById('knowledge');
    const knowledgeValue = document.getElementById('knowledgeValue');
    const formStatus = document.getElementById('formStatus');
    
    // URL de votre webhook Discord (à remplacer par votre URL réelle)
    const webhookUrl = "https://discord.com/api/webhooks/1369278950077104229/bDqJnKwJ8GqyGzB1T9RHLF9edTn9oMwJ-fdZZZrsQedlzvYvUZrvC_pp07Cci_b6_XQS";
    
    // Ouvrir la modal quand on clique sur le bouton
    if (openBtn) {
        openBtn.addEventListener('click', function() {
            modal.style.display = "block";
            document.body.style.overflow = "hidden"; // Empêcher le défilement de la page
        });
    }
    
    // Fermer la modal
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            modal.style.display = "none";
            document.body.style.overflow = "auto"; // Réactiver le défilement
        });
    }
    
    // Fermer la modal si on clique en dehors
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = "none";
            document.body.style.overflow = "auto";
        }
    });
    
    // Mettre à jour la valeur affichée du slider
    if (knowledgeSlider) {
        knowledgeSlider.addEventListener('input', function() {
            knowledgeValue.textContent = this.value;
        });
    }
    
    // Gérer la soumission du formulaire
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Vérifier l'âge (21 ans minimum)
            const birthdate = new Date(document.getElementById('birthdate').value);
            const today = new Date();
            let age = today.getFullYear() - birthdate.getFullYear();
            const monthDiff = today.getMonth() - birthdate.getMonth();
            
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthdate.getDate())) {
                age--;
            }
            
            if (age < 21) {
                formStatus.textContent = "Vous devez avoir au moins 21 ans pour postuler.";
                formStatus.className = "form-status error";
                return;
            }
            
            // Collecter toutes les données du formulaire
            const formData = {
                // Contact
                phone: document.getElementById('phone').value,
                discord: document.getElementById('discord').value,
                
                // Infos personnelles
                firstName: document.getElementById('firstName').value,
                lastName: document.getElementById('lastName').value,
                birthdate: document.getElementById('birthdate').value,
                nationality: document.getElementById('nationality').value,
                height: document.getElementById('height').value,
                weight: document.getElementById('weight').value,
                diseases: document.getElementById('diseases').value || "Aucune",
                
                // Questionnaire
                motivation: document.getElementById('motivation').value,
                whyYou: document.getElementById('whyYou').value,
                knowledge: document.getElementById('knowledge').value
            };
            
            // Préparer les données pour Discord
            const discordPayload = {
                embeds: [{
                    title: "Nouvelle Candidature LSPD",
                    color: 3447003, // Bleu
                    fields: [
                        {
                            name: "📞 Contact",
                            value: `**Téléphone:** ${formData.phone}\n**Discord:** ${formData.discord}`,
                            inline: false
                        },
                        {
                            name: "👤 Informations Personnelles",
                            value: `**Nom:** ${formData.lastName} ${formData.firstName}\n**Date de naissance:** ${formData.birthdate}\n**Nationalité:** ${formData.nationality}\n**Taille:** ${formData.height} cm\n**Poids:** ${formData.weight} kg\n**Maladies:** ${formData.diseases}`,
                            inline: false
                        },
                        {
                            name: "💬 Motivations",
                            value: formData.motivation,
                            inline: false
                        },
                        {
                            name: "🔍 Pourquoi vous?",
                            value: formData.whyYou,
                            inline: false
                        },
                        {
                            name: "📊 Connaissance du métier",
                            value: `${formData.knowledge}/10`,
                            inline: false
                        }
                    ],
                    timestamp: new Date(),
                    footer: {
                        text: "Candidature via le site LSPD"
                    }
                }]
            };
            
            // Envoyer les données au webhook Discord
            fetch(webhookUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(discordPayload)
            })
            .then(response => {
                if (response.ok) {
                    // Succès
                    formStatus.textContent = "Votre candidature a été envoyée avec succès! Nous vous contacterons prochainement.";
                    formStatus.className = "form-status success";
                    form.reset();
                    
                    // Fermer la modal après 3 secondes
                    setTimeout(() => {
                        modal.style.display = "none";
                        document.body.style.overflow = "auto";
                        formStatus.style.display = "none";
                    }, 3000);
                } else {
                    // Erreur
                    throw new Error("Erreur lors de l'envoi");
                }
            })
            .catch(error => {
                formStatus.textContent = "Une erreur est survenue. Veuillez réessayer plus tard.";
                formStatus.className = "form-status error";
                console.error("Erreur:", error);
            });
        });
    }
});

// Hiérarchie des grades
const hierarchyRanks = [
    "Rookie",
    "Officier I",
    "Officier II",
    "Officier III",
    "Senior Lead Officer",
    "Sergent I",
    "Sergent II",
    "Lieutenant I",
    "Lieutenant II",
    "Captain I",
    "Captain II",
    "Captain III",
    "Commander",
    "Assistant Chief",
    "Deputy Chief",
    "Chief Of Police"
];

// Corps et leur niveau d'accès
const corpsDivisions = {
    "Corps exécutif": {
        ranks: ["Rookie", "Officier I", "Officier II", "Officier III", "Senior Lead Officer"],
        accessLevel: 1
    },
    "Corps de supervision": {
        ranks: ["Sergent I", "Sergent II"],
        accessLevel: 2
    },
    "Corps de commandement": {
        ranks: ["Lieutenant I", "Lieutenant II", "Captain I", "Captain II", "Captain III"],
        accessLevel: 3
    },
    "Corps de direction": {
        ranks: ["Commander", "Assistant Chief", "Deputy Chief", "Chief Of Police"],
        accessLevel: 4
    }
};

// Fonction pour déterminer le corps d'un grade
function getCorpsByRank(rank) {
    for (const [corps, data] of Object.entries(corpsDivisions)) {
        if (data.ranks.includes(rank)) {
            return corps;
        }
    }
    return null;
}

// Fonction pour déterminer le niveau d'accès d'un grade
function getAccessLevelByRank(rank) {
    const corps = getCorpsByRank(rank);
    return corps ? corpsDivisions[corps].accessLevel : 0;
}

// Fonction pour vérifier si un niveau d'accès est suffisant pour accéder à une fonctionnalité
function hasAccess(userAccessLevel, requiredAccessLevel) {
    return userAccessLevel >= requiredAccessLevel;
}

// Fonction pour initialiser les utilisateurs depuis localStorage ou utiliser les valeurs par défaut
function initializeUsers() {
    const savedUsers = localStorage.getItem('lspdUsers');
    if (savedUsers) {
        // Si des utilisateurs sont déjà sauvegardés, les utiliser
        return JSON.parse(savedUsers);
    } else {
        // Sinon, utiliser les valeurs par défaut et les sauvegarder
        const defaultUsers = [
            {
                prenom: "Nico",
                nom: "Capone",
                grade: "Chief Of Police",
                matricule: "COP-41",
                badge: "566843",
                division: "Direction",
                code: "1234"
            }
        ];
        localStorage.setItem('lspdUsers', JSON.stringify(defaultUsers));
        return defaultUsers;
    }
}

// Initialiser la liste des utilisateurs
const users = initializeUsers();

// Fonction pour sauvegarder les changements dans localStorage
function saveUsers() {
    localStorage.setItem('lspdUsers', JSON.stringify(users));
    console.log("Utilisateurs sauvegardés dans localStorage");
}

// Gestion de la connexion
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const loginMessage = document.getElementById('loginMessage');
    
    // Si on est sur la page de login
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const badge = document.getElementById('badge').value;
            const accessCode = document.getElementById('accessCode').value;
            
            // Vérifier les identifiants
            const user = users.find(u => u.badge === badge && u.code === accessCode);
            
            if (user) {
                // Ajouter le niveau d'accès à l'utilisateur
                const accessLevel = getAccessLevelByRank(user.grade);
                const corps = getCorpsByRank(user.grade);
                
                console.log("Connexion réussie pour", user.prenom, user.nom);
                console.log("Grade:", user.grade, "- Niveau d'accès:", accessLevel);
                
                // Connexion réussie
                loginMessage.textContent = "Connexion réussie. Redirection en cours...";
                loginMessage.className = "login-message success";
                
                // Stocker les informations de l'utilisateur dans le sessionStorage
                sessionStorage.setItem('currentUser', JSON.stringify({
                    prenom: user.prenom,
                    nom: user.nom,
                    grade: user.grade,
                    matricule: user.matricule,
                    badge: user.badge,
                    division: user.division,
                    accessLevel: accessLevel,
                    corps: corps
                }));
                
                // Rediriger vers la page d'accueil de l'espace agent après 2 secondes
                setTimeout(() => {
                    window.location.href = "agent-dashboard.html";
                }, 2000);
            } else {
                // Échec de la connexion
                loginMessage.textContent = "Numéro de badge ou code d'accès incorrect.";
                loginMessage.className = "login-message error";
            }
        });
    }
    
    // Pour les pages nécessitant une authentification
    const restrictedPages = ['agent-dashboard.html', 'rapports-ois.html', 'personnel.html', 'service.html', 'parametres.html'];
    const currentPage = window.location.pathname.split('/').pop();
    
    if (restrictedPages.includes(currentPage)) {
        // Vérifier si l'utilisateur est connecté
        const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
        
        if (!currentUser) {
            // Rediriger vers la page de login si non connecté
            window.location.href = "login.html";
            return;
        }
        
        console.log("Page sécurisée:", currentPage);
        console.log("Utilisateur connecté:", currentUser.prenom, currentUser.nom);
        console.log("Niveau d'accès:", currentUser.accessLevel);
        
        // Vérifications spécifiques pour certaines pages
        if (currentPage === 'parametres.html' && !hasAccess(currentUser.accessLevel, 4)) {
            // Accès aux paramètres uniquement pour le corps de direction
            window.location.href = "agent-dashboard.html";
            alert("Accès refusé. Niveau d'autorisation insuffisant.");
            return;
        }
        
        // Afficher les informations de l'agent dans le header
        const agentInfoHeader = document.getElementById('agentInfoHeader');
        if (agentInfoHeader) {
            agentInfoHeader.innerHTML = `
                <div class="agent-badge">
                    <i class="fas fa-id-badge"></i>
                </div>
                <div class="agent-details">
                    <div class="agent-name">${currentUser.grade} ${currentUser.prenom} ${currentUser.nom}</div>
                    <div class="agent-division">${currentUser.division} - Badge: ${currentUser.badge}</div>
                </div>
            `;
        }
        
        // Personnaliser le message d'accueil sur le tableau de bord
        const welcomeMessage = document.getElementById('welcomeMessage');
        if (welcomeMessage) {
            welcomeMessage.textContent = `Bienvenue, ${currentUser.grade} ${currentUser.nom}`;
        }
        
        // Gestion de la déconnexion
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', function() {
                sessionStorage.removeItem('currentUser');
                window.location.href = "index.html";
            });
        }
        
        // Gestion de la navigation et des permissions
        setupNavigation(currentUser.accessLevel);
    }
});

// Configuration de la navigation en fonction du niveau d'accès
function setupNavigation(accessLevel) {
    const navItems = document.querySelectorAll('.agent-nav a');
    
    navItems.forEach(item => {
        // Masquer les éléments pour lesquels l'utilisateur n'a pas l'accès
        const requiredLevel = parseInt(item.getAttribute('data-access-level'));
        if (requiredLevel > accessLevel) {
            item.parentElement.style.display = 'none';
        } else {
            console.log("Élément de navigation visible:", item.textContent.trim(), "- Niveau requis:", requiredLevel);
        }
    });
}

// Fonctions pour les rapports OIS
const oisReports = [];

function addOISReport(report) {
    // Ajouter un timestamp et un statut
    report.timestamp = new Date();
    report.status = "En attente";
    report.id = Date.now(); // Utiliser timestamp comme ID unique
    
    // Ajouter au début du tableau pour avoir les plus récents en premier
    oisReports.unshift(report);
    
    // Sauvegarde immédiate dans localStorage
    saveOISReports();
    
    console.log("Rapport ajouté:", report);
    console.log("Nombre total de rapports:", oisReports.length);
    
    return report;
}

function updateOISReportStatus(reportId, newStatus) {
    const report = oisReports.find(r => r.id === reportId);
    if (report) {
        report.status = newStatus;
        saveOISReports();
        return true;
    }
    return false;
}

function deleteOISReport(reportId) {
    const index = oisReports.findIndex(r => r.id === reportId);
    if (index !== -1) {
        oisReports.splice(index, 1);
        saveOISReports();
        return true;
    }
    return false;
}

function saveOISReports() {
    localStorage.setItem('oisReports', JSON.stringify(oisReports));
    console.log("Rapports sauvegardés dans localStorage:", oisReports.length);
}

function loadOISReports() {
    const savedReports = localStorage.getItem('oisReports');
    if (savedReports) {
        // Vider le tableau actuel
        while (oisReports.length > 0) {
            oisReports.pop();
        }
        
        // Charger les rapports sauvegardés
        const parsedReports = JSON.parse(savedReports);
        parsedReports.forEach(report => {
            oisReports.push(report);
        });
        
        console.log("Rapports chargés depuis localStorage:", oisReports.length);
        
        if (oisReports.length > 0) {
            console.log("Premier rapport:", oisReports[0]);
        }
    } else {
        console.log("Aucun rapport trouvé dans localStorage");
    }
}

// Fonctions pour la gestion du personnel
function getPersonnel() {
    return users.map(user => ({
        prenom: user.prenom,
        nom: user.nom,
        grade: user.grade,
        matricule: user.matricule,
        badge: user.badge,
        division: user.division,
        code: user.code
    }));
}

function addPersonnel(newUser) {
    // Vérifier si le matricule ou le badge existe déjà
    const existingUser = users.find(u => 
        u.matricule === newUser.matricule || 
        u.badge === newUser.badge
    );
    
    if (existingUser) {
        return { success: false, message: "Matricule ou badge déjà utilisé." };
    }
    
    users.push(newUser);
    saveUsers(); // Sauvegarder les changements
    return { success: true, message: "Agent ajouté avec succès." };
}

function updatePersonnel(matricule, updatedData) {
    const index = users.findIndex(u => u.matricule === matricule);
    
    if (index === -1) {
        return { success: false, message: "Agent non trouvé." };
    }
    
    // Vérifier si le nouveau matricule existe déjà (sauf s'il s'agit du même agent)
    if (updatedData.matricule !== matricule && 
        users.some(u => u.matricule === updatedData.matricule)) {
        return { success: false, message: "Ce matricule est déjà utilisé par un autre agent." };
    }
    
    // Vérifier si le nouveau badge existe déjà (sauf s'il s'agit du même agent)
    if (updatedData.badge !== users[index].badge && 
        users.some(u => u.badge === updatedData.badge)) {
        return { success: false, message: "Ce numéro de badge est déjà utilisé par un autre agent." };
    }
    
    // Mettre à jour les données sauf si elles sont undefined
    Object.keys(updatedData).forEach(key => {
        if (updatedData[key] !== undefined) {
            users[index][key] = updatedData[key];
        }
    });
    
    saveUsers(); // Sauvegarder les changements
    return { success: true, message: "Informations mises à jour avec succès." };
}

function deletePersonnel(matricule) {
    const index = users.findIndex(u => u.matricule === matricule);
    
    if (index === -1) {
        return { success: false, message: "Agent non trouvé." };
    }
    
    users.splice(index, 1);
    saveUsers(); // Sauvegarder les changements
    return { success: true, message: "Agent supprimé avec succès." };
}

// Fonction pour initialiser la page des officiers
document.addEventListener('DOMContentLoaded', function() {
    // Vérifier si nous sommes sur la page des officiers
    if (window.location.pathname.includes('officiers.html')) {
        initializeOfficersPage();
    }
});

// Fonction principale pour la page des officiers
function initializeOfficersPage() {
    console.log("Initialisation de la page des officiers");
    
    // Récupérer la liste des utilisateurs (agents)
    const users = initializeUsers();
    const officersContainer = document.getElementById('officersContainer');
    const noOfficersMessage = document.getElementById('noOfficersMessage');
    
    // Filtrer les agents et les trier par grade hiérarchique
    function sortByRank(a, b) {
        const rankA = hierarchyRanks.indexOf(a.grade);
        const rankB = hierarchyRanks.indexOf(b.grade);
        return rankB - rankA; // Ordre descendant (plus haut grade en premier)
    }
    
    const sortedUsers = [...users].sort(sortByRank);
    
    // Grouper les agents par corps
    const groupedOfficers = {};
    
    // Initialiser les groupes pour chaque corps
    Object.keys(corpsDivisions).forEach(corps => {
        groupedOfficers[corps] = [];
    });
    
    // Répartir les agents dans leurs corps respectifs
    sortedUsers.forEach(agent => {
        const corps = getCorpsByRank(agent.grade);
        if (corps && groupedOfficers[corps]) {
            groupedOfficers[corps].push(agent);
        }
    });
    
    // Afficher les agents ou un message s'il n'y en a pas
    if (sortedUsers.length === 0) {
        noOfficersMessage.style.display = 'block';
    } else {
        noOfficersMessage.style.display = 'none';
        
        // Parcourir les corps dans l'ordre d'importance
        const corpsOrder = [
            "Corps de direction",
            "Corps de commandement",
            "Corps de supervision",
            "Corps exécutif"
        ];
        
        // Créer une section pour chaque corps, en commençant par les plus importants
        corpsOrder.forEach(corps => {
            const officersInCorps = groupedOfficers[corps];
            
            if (officersInCorps && officersInCorps.length > 0) {
                // Créer une section pour ce corps
                const corpsSection = document.createElement('div');
                corpsSection.className = 'officers-corps-section';
                
                // Ajouter le titre du corps
                const corpsTitle = document.createElement('h2');
                corpsTitle.className = 'corps-title';
                corpsTitle.textContent = corps;
                corpsSection.appendChild(corpsTitle);
                
                // Créer un conteneur pour les cartes de ce corps
                const corpsCardsContainer = document.createElement('div');
                corpsCardsContainer.className = 'officers-cards-container';
                
                // Ajouter les cartes des agents de ce corps
                officersInCorps.forEach(agent => {
                    const officerCard = createOfficerCard(agent, corps);
                    corpsCardsContainer.appendChild(officerCard);
                });
                
                corpsSection.appendChild(corpsCardsContainer);
                officersContainer.appendChild(corpsSection);
            }
        });
    }
}

// Fonction pour créer une carte d'officier
function createOfficerCard(agent, corps) {
    // Créer la carte de l'agent
    const officerCard = document.createElement('div');
    officerCard.className = 'officer-card';
    
    // Déterminer la classe CSS du corps pour la couleur de bordure
    const corpsClass = corps ? corps.toLowerCase().replace(/\s+/g, '-') : '';
    
    // Ajouter la classe du corps à la carte
    if (corpsClass) {
        officerCard.classList.add(`corps-${corpsClass}`);
    }
    
    // Chemin de l'image basé sur le numéro de badge
    const imagePath = `imgs/${agent.badge}.jpg`;
    
    // Contenu HTML de la carte
    officerCard.innerHTML = `
        <div class="officer-photo">
            <img src="${imagePath}" alt="${agent.grade} ${agent.prenom} ${agent.nom}" onerror="this.src='imgs/default.jpg'; this.onerror=null;">
            <div class="officer-info">
                <div class="officer-name">${agent.prenom} ${agent.nom}</div>
                <div class="officer-details">
                    <div class="officer-grade">${agent.grade}</div>
                    <div class="officer-matricule">Matricule: ${agent.matricule}</div>
                </div>
            </div>
        </div>
        <div class="officer-footer">
            <span>${agent.grade}</span>
        </div>
    `;
    
    return officerCard;
}

// Fonctions pour le tableau de bord - à ajouter à la fin de script.js existant

// Initialisation du tableau de bord
document.addEventListener('DOMContentLoaded', function() {
    // Vérifier si nous sommes sur la page dashboard
    if (window.location.pathname.includes('agent-dashboard.html')) {
        initializeDashboard();
    }
});

// Fonction principale d'initialisation du tableau de bord
function initializeDashboard() {
    console.log("Initialisation du tableau de bord");
    
    // Récupérer l'utilisateur connecté
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    if (!currentUser) {
        window.location.href = "login.html";
        return;
    }
    
    // Récupérer les données
    const users = initializeUsers();
    loadOISReports(); // Charge les rapports dans le tableau global oisReports
    
    // Vérifier si l'utilisateur a accès aux statistiques OIS (Lieutenant I et plus)
    const hasOISAccess = hasRankAccess(currentUser.grade, "Lieutenant I");
    toggleOISStats(hasOISAccess);
    
    // Mettre à jour les statistiques
    updateAgentStats(users);
    if (hasOISAccess) {
        updateReportStats();
    }
    updateCorpsDistribution(users);
    
    console.log("Tableau de bord initialisé avec succès");
}

// Vérifier si un grade a accès (est égal ou supérieur à un grade minimum)
function hasRankAccess(userRank, minRank) {
    const userRankIndex = hierarchyRanks.indexOf(userRank);
    const minRankIndex = hierarchyRanks.indexOf(minRank);
    
    // Un indice plus petit signifie un grade plus élevé dans la hiérarchie
    // (car dans hierarchyRanks, les grades sont listés du plus bas au plus haut)
    return userRankIndex >= 0 && minRankIndex >= 0 && userRankIndex >= minRankIndex;
}

// Afficher/masquer les statistiques OIS selon le niveau d'accès
function toggleOISStats(hasAccess) {
    const oisStats = document.querySelectorAll('.ois-stat');
    oisStats.forEach(stat => {
        stat.style.display = hasAccess ? 'flex' : 'none';
    });
}

// Mettre à jour les statistiques des agents
function updateAgentStats(users) {
    const totalAgentsElement = document.getElementById('totalAgents');
    if (totalAgentsElement) {
        totalAgentsElement.textContent = users.length;
    }
}

// Mettre à jour les statistiques des rapports
function updateReportStats() {
    // Nombre d'enquêtes en cours (remplace le nombre total de rapports)
    const investigationReports = oisReports.filter(report => report.status === "Enquête en cours").length;
    const investigationReportsElement = document.getElementById('investigationReports');
    if (investigationReportsElement) {
        investigationReportsElement.textContent = investigationReports;
    }
    
    // Nombre de rapports approuvés
    const approvedReports = oisReports.filter(report => report.status === "Légitime").length;
    const approvedReportsElement = document.getElementById('approvedReports');
    if (approvedReportsElement) {
        approvedReportsElement.textContent = approvedReports;
    }
    
    // Nombre de rapports en attente
    const pendingReports = oisReports.filter(report => 
        report.status === "En attente" || 
        report.status === "En cours"
    ).length;
    const pendingReportsElement = document.getElementById('pendingReports');
    if (pendingReportsElement) {
        pendingReportsElement.textContent = pendingReports;
    }
}

// Mettre à jour la répartition par corps

function updateCorpsDistribution(users) {
    const corpsDistributionElement = document.getElementById('corpsDistribution');
    if (!corpsDistributionElement) return;
    
    // Calculer le nombre d'agents par corps
    const corpsCounts = {
        "Corps de direction": 0,
        "Corps de commandement": 0,
        "Corps de supervision": 0,
        "Corps exécutif": 0
    };
    
    // Compter les agents dans chaque corps
    users.forEach(user => {
        const corps = getCorpsByRank(user.grade);
        if (corps && corpsCounts.hasOwnProperty(corps)) {
            corpsCounts[corps]++;
        }
    });
    
    // Définir l'ordre d'affichage (de la direction aux exécutifs)
    const corpsOrder = [
        "Corps de direction",
        "Corps de commandement", 
        "Corps de supervision", 
        "Corps exécutif"
    ];
    
    // Vider le conteneur
    corpsDistributionElement.innerHTML = '';
    
    // Créer une simple liste pour chaque corps
    corpsOrder.forEach(corps => {
        const count = corpsCounts[corps];
        
        // Déterminer l'icône pour ce corps
        let corpsIcon;
        switch(corps) {
            case "Corps de direction":
                corpsIcon = "fas fa-star";
                break;
            case "Corps de commandement":
                corpsIcon = "fas fa-chess-queen";
                break;
            case "Corps de supervision":
                corpsIcon = "fas fa-user-tie";
                break;
            case "Corps exécutif":
                corpsIcon = "fas fa-user-shield";
                break;
            default:
                corpsIcon = "fas fa-user";
        }
        
        // Créer l'élément simplifié pour ce corps
        const corpsItem = document.createElement('div');
        corpsItem.className = 'corps-item';
        corpsItem.innerHTML = `
            <div class="corps-info">
                <i class="${corpsIcon}"></i>
                <span class="corps-label">${corps}</span>
                <span class="corps-count">${count} agent${count > 1 ? 's' : ''}</span>
            </div>
        `;
        
        corpsDistributionElement.appendChild(corpsItem);
    });
}

// Système de gestion des annonces pour le LSPD

// Fonction pour initialiser les annonces dans le localStorage si nécessaire
function initializeAnnouncements() {
    if (!localStorage.getItem('lspdAnnouncements')) {
        // Créer quelques annonces par défaut
        const defaultAnnouncements = [
            {
                id: Date.now() - 40000,
                date: "2025-05-02",
                author: "Nico Capone",
                authorGrade: "Chief Of Police",
                content: "Réunion de service ce vendredi à 18h00 au central."
            },
            {
                id: Date.now() - 80000,
                date: "2025-04-30",
                author: "Nico Capone",
                authorGrade: "Chief Of Police",
                content: "Nouveaux uniformes disponibles au vestiaire."
            },
            {
                id: Date.now() - 120000,
                date: "2025-04-28",
                author: "Nico Capone",
                authorGrade: "Chief Of Police",
                content: "Mise à jour des procédures d'intervention. Consultez le manuel."
            }
        ];
        
        localStorage.setItem('lspdAnnouncements', JSON.stringify(defaultAnnouncements));
        console.log("Annonces par défaut initialisées");
    }
}

// Fonction pour récupérer toutes les annonces
function getAnnouncements() {
    // Initialiser si nécessaire
    initializeAnnouncements();
    
    // Récupérer et trier les annonces par date (plus récentes en premier)
    const announcements = JSON.parse(localStorage.getItem('lspdAnnouncements'));
    return announcements.sort((a, b) => b.id - a.id);
}

// Fonction pour ajouter une nouvelle annonce
function addAnnouncement(announcement) {
    // Récupérer les annonces existantes
    const announcements = getAnnouncements();
    
    // Ajouter la nouvelle annonce
    announcements.unshift(announcement);
    
    // Sauvegarder les annonces
    localStorage.setItem('lspdAnnouncements', JSON.stringify(announcements));
    
    return announcement;
}

// Fonction pour mettre à jour l'affichage des annonces dans le tableau de bord
function updateAnnouncementsDisplay() {
    const announcementsContainer = document.querySelector('.recent-announcements');
    if (!announcementsContainer) return;
    
    // Récupérer les 3 annonces les plus récentes
    const announcements = getAnnouncements().slice(0, 3);
    
    // Vider le conteneur
    announcementsContainer.innerHTML = '';
    
    // Ajouter chaque annonce
    announcements.forEach(announcement => {
        // Formater la date
        const announcementDate = new Date(announcement.date);
        const formattedDate = announcementDate.toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
        
        // Formater le contenu: remplacer les retours à la ligne par des balises <br>
        const formattedContent = announcement.content.replace(/\n/g, '<br>');
        
        // Créer l'élément d'annonce
        const announcementElement = document.createElement('div');
        announcementElement.className = 'announcement';
        announcementElement.innerHTML = `
            <p class="announcement-date">${formattedDate}</p>
            <p class="announcement-author">${announcement.authorGrade} ${announcement.author}</p>
            <p class="announcement-text">${formattedContent}</p>
        `;
        
        // Ajouter au conteneur
        announcementsContainer.appendChild(announcementElement);
    });
    
    // Si aucune annonce, afficher un message
    if (announcements.length === 0) {
        announcementsContainer.innerHTML = '<div class="no-announcements">Aucune annonce récente disponible.</div>';
    }
}

// Fonction pour ajouter le bouton d'ajout d'annonce (si l'utilisateur a le bon niveau d'accès)
function setupAnnouncementInterface() {
    // Récupérer l'utilisateur actuel
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    if (!currentUser) return;
    
    // Trouver l'élément parent où ajouter le bouton
    const announcementCard = document.querySelector('.dashboard-col .dashboard-card:has(h2 i.fa-bullhorn)');
    if (!announcementCard) return;
    
    // Trouver l'en-tête de la carte
    const cardHeader = announcementCard.querySelector('h2');
    
    // Vérifier si l'utilisateur a le niveau d'accès requis (corps de supervision et plus)
    const hasSupervisorAccess = currentUser.accessLevel >= 2; // Niveau 2 = Corps de supervision
    
    // Si l'utilisateur a accès, ajouter le bouton
    if (hasSupervisorAccess) {
        // Créer le bouton
        const addButton = document.createElement('button');
        addButton.className = 'btn btn-small add-announcement-btn';
        addButton.innerHTML = '<i class="fas fa-plus"></i>';
        addButton.title = "Ajouter une annonce";
        
        // Ajouter le bouton à côté du titre
        cardHeader.appendChild(addButton);
        
        // Ajouter un gestionnaire d'événement au bouton
        addButton.addEventListener('click', openAnnouncementModal);
    }
}

// Fonction pour ouvrir la modal d'ajout d'annonce
function openAnnouncementModal() {
    // Récupérer l'utilisateur actuel
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    
    // Créer la modal
    const modal = document.createElement('div');
    modal.className = 'modal announcement-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close-modal">&times;</span>
            <h2>Nouvelle Annonce</h2>
            
            <form id="announcementForm">
                <div class="form-group">
                    <label for="announcementContent">Contenu de l'annonce:</label>
                    <textarea id="announcementContent" name="announcementContent" rows="4" required></textarea>
                </div>
                
                <div class="form-actions">
                    <button type="submit" class="btn btn-primary">Publier l'annonce</button>
                </div>
            </form>
        </div>
    `;
    
    // Ajouter la modal au body
    document.body.appendChild(modal);
    
    // Afficher la modal
    modal.style.display = "block";
    
    // Récupérer le bouton de fermeture
    const closeBtn = modal.querySelector('.close-modal');
    
    // Gérer la fermeture de la modal
    closeBtn.addEventListener('click', function() {
        modal.style.display = "none";
        // Supprimer la modal après l'animation
        setTimeout(() => {
            document.body.removeChild(modal);
        }, 300);
    });
    
    // Fermer la modal en cliquant à l'extérieur
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = "none";
            // Supprimer la modal après l'animation
            setTimeout(() => {
                document.body.removeChild(modal);
            }, 300);
        }
    });
    
    // Gérer la soumission du formulaire
    const form = modal.querySelector('#announcementForm');
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Récupérer le contenu
        const content = document.getElementById('announcementContent').value;
        
        // Créer l'annonce
        const today = new Date();
        const formattedDate = today.toISOString().split('T')[0]; // Format YYYY-MM-DD
        
        const newAnnouncement = {
            id: Date.now(),
            date: formattedDate,
            author: currentUser.prenom + ' ' + currentUser.nom,
            authorGrade: currentUser.grade,
            content: content
        };
        
        // Ajouter l'annonce
        addAnnouncement(newAnnouncement);
        
        // Mettre à jour l'affichage
        updateAnnouncementsDisplay();
        
        // Fermer la modal
        modal.style.display = "none";
        // Supprimer la modal après l'animation
        setTimeout(() => {
            document.body.removeChild(modal);
        }, 300);
    });
}

// Fonction principale d'initialisation du tableau de bord (modifiée)
function initializeDashboard() {
    console.log("Initialisation du tableau de bord");
    
    // Récupérer l'utilisateur connecté
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    if (!currentUser) {
        window.location.href = "login.html";
        return;
    }
    
    // Récupérer les données
    const users = initializeUsers();
    loadOISReports(); // Charge les rapports dans le tableau global oisReports
    
    // Vérifier si l'utilisateur a accès aux statistiques OIS (Lieutenant I et plus)
    const hasOISAccess = hasRankAccess(currentUser.grade, "Lieutenant I");
    toggleOISStats(hasOISAccess);
    
    // Mettre à jour les statistiques
    updateAgentStats(users);
    if (hasOISAccess) {
        updateReportStats();
    }
    updateCorpsDistribution(users);
    
    // Initialiser et afficher les annonces
    initializeAnnouncements();
    updateAnnouncementsDisplay();
    
    // Configurer l'interface d'ajout d'annonce
    setupAnnouncementInterface();
    
    console.log("Tableau de bord initialisé avec succès");
}

// Fonction pour supprimer une annonce
function deleteAnnouncement(id) {
    // Récupérer les annonces existantes
    let announcements = getAnnouncements();
    
    // Filtrer pour retirer l'annonce avec l'ID spécifié
    announcements = announcements.filter(announcement => announcement.id !== id);
    
    // Sauvegarder les annonces mises à jour
    localStorage.setItem('lspdAnnouncements', JSON.stringify(announcements));
    
    // Mettre à jour l'affichage
    updateAnnouncementsDisplay();
    
    return true;
}

// Mise à jour de la fonction d'affichage pour ajouter le bouton de suppression
function updateAnnouncementsDisplay() {
    const announcementsContainer = document.querySelector('.recent-announcements');
    if (!announcementsContainer) return;
    
    // Récupérer l'utilisateur actuel
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
    
    // Vérifier si l'utilisateur a le niveau d'accès requis (corps de supervision et plus)
    const hasSupervisorAccess = currentUser && currentUser.accessLevel >= 2;
    
    // Récupérer les 3 annonces les plus récentes
    const announcements = getAnnouncements().slice(0, 3);
    
    // Vider le conteneur
    announcementsContainer.innerHTML = '';
    
    // Ajouter chaque annonce
    announcements.forEach(announcement => {
        // Formater la date
        const announcementDate = new Date(announcement.date);
        const formattedDate = announcementDate.toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
        
        // Formater le contenu: remplacer les retours à la ligne par des balises <br>
        const formattedContent = announcement.content.replace(/\n/g, '<br>');
        
        // Créer l'élément d'annonce
        const announcementElement = document.createElement('div');
        announcementElement.className = 'announcement';
        
        // Ajouter le contenu de base
        announcementElement.innerHTML = `
            <div class="announcement-header">
                <p class="announcement-date">${formattedDate}</p>
                ${hasSupervisorAccess ? `<button class="btn-delete-announcement" data-id="${announcement.id}" title="Supprimer cette annonce"><i class="fas fa-times"></i></button>` : ''}
            </div>
            <p class="announcement-author">${announcement.authorGrade} ${announcement.author}</p>
            <p class="announcement-text">${formattedContent}</p>
        `;
        
        // Ajouter au conteneur
        announcementsContainer.appendChild(announcementElement);
        
        // Ajouter l'événement de suppression si l'utilisateur a les droits
        if (hasSupervisorAccess) {
            const deleteBtn = announcementElement.querySelector('.btn-delete-announcement');
            if (deleteBtn) {
                deleteBtn.addEventListener('click', function() {
                    const id = parseInt(this.getAttribute('data-id'));
                    if (confirm('Êtes-vous sûr de vouloir supprimer cette annonce ?')) {
                        deleteAnnouncement(id);
                    }
                });
            }
        }
    });
    
    // Si aucune annonce, afficher un message
    if (announcements.length === 0) {
        announcementsContainer.innerHTML = '<div class="no-announcements">Aucune annonce récente disponible.</div>';
    }
}

// Fonctions pour la page de contact
document.addEventListener('DOMContentLoaded', function() {
    // Vérifier si on est sur la page de contact
    if (window.location.pathname.includes('contact.html')) {
        initializeContactPage();
    }
});

// Fonction principale pour initialiser la page de contact
function initializeContactPage() {
    // Récupérer les éléments
    const selectorOptions = document.querySelectorAll('.selector-option');
    const contactForm = document.getElementById('contactForm');
    const formTypeInput = document.getElementById('formType');
    const formStatus = document.getElementById('formStatus');
    const idCardInput = document.getElementById('idCard');
    const idCardPreview = document.getElementById('idCardPreview');
    const commonFormSection = document.querySelector('.common-form-section');
    
    // Par défaut, cacher le formulaire
    commonFormSection.style.display = 'none';
    
    // URLs des webhooks Discord pour chaque service
    const webhooks = {
        'direction': 'https://discord.com/api/webhooks/1369293397759758467/UtNqr6Fj5U0-0Ma2Trdp0ZBMhBQueC1RTOdRxyPUbysmeSluQZMSnyOCtvO8kVo3E9B6',
        'plaintes': 'https://discord.com/api/webhooks/1368963374444056586/MeFJ4NchGJKfPG6kX4BfkLeI_2Q_CP0Mn72qjTYxexpOJVmZUiYL8Ck4-hX_4tYohcum',
        'ppa': 'https://discord.com/api/webhooks/1368978068873678908/NMXm0JdUY9MleLzhyZGSwuxHMJLjjB5svIHrX-2aW-sJh5ep_FKuuyXIIbkvMgfRAoh1',
        'casier': 'https://discord.com/api/webhooks/1368978100729151580/jBjsQCi8DxzybIODRw3v6LinyszIwjnmUXH8WbEYkKaAGJm-7gHMs3_V7pZD2T7QmlwY'
    };

    // IDs des threads existants pour chaque type de formulaire spécifique
    const threadIds = {
        'plaintes': '1368959888436494526',
        'ppa': '1368960121480155229',
        'casier': '1368960252745220157'
    };
    
    // Ajouter un événement de clic sur les options de service
    selectorOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Supprimer la classe active de toutes les options
            selectorOptions.forEach(opt => opt.classList.remove('active'));
            // Ajouter la classe active à l'option sélectionnée
            this.classList.add('active');
            
            // Récupérer le type de formulaire
            const formType = this.getAttribute('data-target');
            formTypeInput.value = formType;
            
            // Masquer toutes les sections spécifiques
            document.querySelectorAll('.specific-form-section').forEach(section => {
                section.style.display = 'none';
            });
            
            // Afficher la section spécifique correspondante
            const specificSection = document.getElementById(`${formType}-section`);
            if (specificSection) {
                specificSection.style.display = 'block';
            }
            
            // Afficher le formulaire commun
            commonFormSection.style.display = 'block';
            
            // Faire défiler la page vers le formulaire
            commonFormSection.scrollIntoView({ behavior: 'smooth' });
        });
    });
    
    // Gestion de l'aperçu de la carte d'identité
    if (idCardInput) {
        idCardInput.addEventListener('change', function(e) {
            // Vérifier s'il y a un fichier sélectionné
            if (this.files && this.files[0]) {
                const file = this.files[0];
                
                // Vérifier la taille du fichier (max 5 MB)
                if (file.size > 5 * 1024 * 1024) {
                    alert('Le fichier est trop volumineux. Veuillez sélectionner un fichier de moins de 5 MB.');
                    this.value = '';
                    idCardPreview.innerHTML = '';
                    return;
                }
                
                // Vérifier le type de fichier
                const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
                if (!validTypes.includes(file.type)) {
                    alert('Format de fichier non supporté. Veuillez utiliser JPG, PNG ou WEBP.');
                    this.value = '';
                    idCardPreview.innerHTML = '';
                    return;
                }
                
                // Afficher l'aperçu
                const reader = new FileReader();
                reader.onload = function(e) {
                    idCardPreview.innerHTML = `<img src="${e.target.result}" alt="Aperçu de la carte d'identité">`;
                };
                reader.readAsDataURL(file);
            }
        });
    }
    
    // Gérer le toggle des informations sur le suspect
    window.toggleSuspectInfo = function() {
        const knowSuspect = document.querySelector('input[name="knowSuspect"]:checked').value;
        const suspectInfo = document.getElementById('suspectInfo');
        
        if (knowSuspect === 'oui') {
            suspectInfo.style.display = 'block';
        } else {
            suspectInfo.style.display = 'none';
        }
    };
    
    // Gérer la soumission du formulaire
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Vérifier si un type de formulaire est sélectionné
            const formType = formTypeInput.value;
            if (!formType) {
                alert('Veuillez sélectionner un service à contacter.');
                return;
            }
            
            // Vérifier si les champs obligatoires sont remplis selon le type de formulaire
            if (!validateFormFields(formType)) {
                return;
            }
            
            // Récupérer les données du formulaire
            const formData = new FormData(this);
            
            // Afficher un message de chargement
            formStatus.textContent = "Envoi en cours...";
            formStatus.className = "form-status loading";
            formStatus.style.display = "block";
            
            // Récupérer les données de base
            const discord = formData.get('discord');
            const phone = formData.get('phone');
            const idCardFile = idCardInput.files[0];
            
            // Récupérer les données spécifiques selon le type de formulaire
            let specificData = {};
            
            switch (formType) {
                case 'direction':
                    specificData = {
                        reason: formData.get('directionReason')
                    };
                    break;
                    
                case 'plaintes':
                    const knowSuspect = formData.get('knowSuspect');
                    specificData = {
                        resume: formData.get('plainteResume'),
                        knowSuspect: knowSuspect
                    };
                    
                    if (knowSuspect === 'oui') {
                        specificData.suspectNom = formData.get('suspectNom');
                        specificData.suspectPrenom = formData.get('suspectPrenom');
                    }
                    break;
                    
                case 'casier':
                    specificData = {
                        reason: formData.get('casierReason')
                    };
                    break;
            }
            
            // Préparer l'image de la carte d'identité pour l'envoi
            if (idCardFile) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    // Créer le payload Discord avec l'image
                    sendToDiscord(formType, discord, phone, specificData, e.target.result, idCardFile.name);
                };
                reader.readAsDataURL(idCardFile);
            } else {
                // Envoyer sans image (ne devrait jamais arriver car le champ est requis)
                sendToDiscord(formType, discord, phone, specificData, null, null);
            }
        });
    }
    
    
    // Fonction pour envoyer les données à Discord
    function sendToDiscord(formType, discord, phone, specificData, imageDataUrl, imageName) {
        // Sélectionner le webhook approprié
        const webhookUrl = webhooks[formType];

        // Créer les données Discord selon le type de formulaire
        let payload = createDiscordPayload(formType, discord, phone, specificData);
        
        // Déterminer si ce type doit être envoyé dans un thread
        let url = webhookUrl;

        // Si ce type doit utiliser un thread, ajouter le paramètre thread_id
        if (formType !== 'direction' && threadIds[formType]) {
            url = `${webhookUrl}?thread_id=${threadIds[formType]}`;
            console.log(`Envoi vers le thread: ${threadIds[formType]} pour le type: ${formType}`);
        }
        
        // Si on a une image, l'envoyer en tant que fichier joint
        if (imageDataUrl) {
            // Préparer les données pour l'envoi multipart avec fichier
            const formData = new FormData();
            
            // Convertir le dataURL en Blob
            const base64Data = imageDataUrl.split(',')[1];
            const mimeType = imageDataUrl.split(',')[0].split(':')[1].split(';')[0];
            const byteCharacters = atob(base64Data);
            const byteArrays = [];
            
            for (let i = 0; i < byteCharacters.length; i += 1024) {
                const slice = byteCharacters.slice(i, i + 1024);
                const byteNumbers = new Array(slice.length);
                
                for (let j = 0; j < slice.length; j++) {
                    byteNumbers[j] = slice.charCodeAt(j);
                }
                
                const byteArray = new Uint8Array(byteNumbers);
                byteArrays.push(byteArray);
            }
            
            const blob = new Blob(byteArrays, {type: mimeType});
            
            // Ajouter le fichier et le payload à formData
            formData.append('file', blob, imageName || 'carte-identite.jpg');
            formData.append('payload_json', JSON.stringify(payload));
            
            // Envoyer la requête avec le fichier joint
            fetch(url, {
                method: 'POST',
                body: formData
            })
            .then(response => handleResponse(response))
            .catch(error => handleError(error));
        } else {
            // Envoyer sans fichier (juste le payload JSON)
            fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            })
            .then(response => handleResponse(response))
            .catch(error => handleError(error));
        }
    }
    
    // Gérer la réponse de Discord
    function handleResponse(response) {
        const formStatus = document.getElementById('formStatus');
        const contactForm = document.getElementById('contactForm');
        const idCardPreview = document.getElementById('idCardPreview');
        const selectorOptions = document.querySelectorAll('.selector-option');
        const commonFormSection = document.querySelector('.common-form-section');
        
        if (response.ok) {
            // Succès
            formStatus.textContent = "Votre demande a été envoyée avec succès! Un agent vous contactera prochainement.";
            formStatus.className = "form-status success";
            
            // Réinitialiser le formulaire
            contactForm.reset();
            idCardPreview.innerHTML = '';
            
            // Masquer toutes les sections spécifiques
            document.querySelectorAll('.specific-form-section').forEach(section => {
                section.style.display = 'none';
            });
            
            // Supprimer la classe active de toutes les options
            selectorOptions.forEach(opt => opt.classList.remove('active'));
            
            // Cacher le formulaire après 3 secondes
            setTimeout(() => {
                commonFormSection.style.display = 'none';
                formStatus.style.display = 'none';
            }, 3000);
        } else {
            // Erreur
            formStatus.textContent = "Une erreur est survenue. Veuillez réessayer plus tard.";
            formStatus.className = "form-status error";
        }
    }
    
    // Gérer les erreurs d'envoi
    function handleError(error) {
        console.error("Erreur lors de l'envoi:", error);
        const formStatus = document.getElementById('formStatus');
        formStatus.textContent = "Une erreur est survenue. Veuillez réessayer plus tard.";
        formStatus.className = "form-status error";
    }
    
    // Créer le payload Discord selon le type de formulaire
    function createDiscordPayload(formType, discord, phone, specificData) {
        // Adapter le titre et la couleur selon le type de formulaire
        let title, color, description, fields = [];
        
        // Ajouter les champs communs
        fields.push({
            name: "📱 Informations de contact",
            value: `**Discord:** ${discord}\n**Téléphone:** ${phone}`,
            inline: false
        });
        
        switch (formType) {
            case 'direction':
                title = "Demande de contact avec la Direction";
                color = 0x0a3d62; // Bleu foncé
                description = "Un citoyen souhaite contacter la Direction du LSPD.";
                
                // Ajouter les champs spécifiques
                fields.push({
                    name: "📝 Raison de la demande",
                    value: specificData.reason || "Non spécifiée",
                    inline: false
                });
                break;
                
            case 'plaintes':
                title = "Dépôt de Plainte";
                color = 0xe74c3c; // Rouge
                description = "Un citoyen souhaite déposer une plainte.";
                
                // Ajouter les champs spécifiques
                fields.push({
                    name: "📄 Résumé des faits",
                    value: specificData.resume || "Non spécifié",
                    inline: false
                });
                
                if (specificData.knowSuspect === 'oui') {
                    fields.push({
                        name: "👤 Suspect identifié",
                        value: `**Nom:** ${specificData.suspectNom || "Non spécifié"}\n**Prénom:** ${specificData.suspectPrenom || "Non spécifié"}`,
                        inline: false
                    });
                } else {
                    fields.push({
                        name: "👤 Suspect",
                        value: "Non identifié",
                        inline: false
                    });
                }
                break;
                
            case 'ppa':
                title = "Demande de Permis de Port d'Arme (PPA)";
                color = 0xf39c12; // Orange
                description = "Un citoyen souhaite faire une demande de Permis de Port d'Arme.";
                break;
                
            case 'casier':
                title = "Demande d'Extrait de Casier Judiciaire";
                color = 0x2ecc71; // Vert
                description = "Un citoyen souhaite obtenir un extrait de son casier judiciaire.";
                
                // Ajouter les champs spécifiques
                fields.push({
                    name: "📋 Raison de la demande",
                    value: specificData.reason || "Non spécifiée",
                    inline: false
                });
                break;
        }
        
        // Créer le payload
        return {
            username: "Contact LSPD",
            avatar_url: "https://static.wikia.nocookie.net/cityv/images/b/b0/1492419055-logolspd.png/revision/latest?cb=20181101122500&path-prefix=fr", // Optionnel, URL d'un avatar pour le webhook
            content: "**Nouvelle demande reçue**",
            embeds: [{
                title: title,
                description: description,
                color: color,
                fields: fields,
                timestamp: new Date().toISOString(),
                footer: {
                    text: "Formulaire de contact LSPD"
                }
            }]
        };
    }
}

// Fonction pour valider les champs du formulaire
function validateFormFields(formType) {
    // Vérifier les champs communs
    const discord = document.getElementById('discord').value;
    const phone = document.getElementById('phone').value;
    const idCard = document.getElementById('idCard').files[0];
    
    if (!discord || !phone || !idCard) {
        alert('Veuillez remplir tous les champs obligatoires dans la section "Vos informations personnelles".');
        return false;
    }
    
    // Vérifier les champs spécifiques selon le type de formulaire
    switch (formType) {
        case 'direction':
            const directionReason = document.getElementById('directionReason').value;
            if (!directionReason) {
                alert('Veuillez indiquer la raison de votre demande de contact avec la Direction.');
                return false;
            }
            break;
            
        case 'plaintes':
            const plainteResume = document.getElementById('plainteResume').value;
            if (!plainteResume) {
                alert('Veuillez fournir un résumé des faits pour votre plainte.');
                return false;
            }
            
            const knowSuspect = document.querySelector('input[name="knowSuspect"]:checked').value;
            if (knowSuspect === 'oui') {
                const suspectNom = document.getElementById('suspectNom').value;
                const suspectPrenom = document.getElementById('suspectPrenom').value;
                if (!suspectNom || !suspectPrenom) {
                    alert('Veuillez indiquer le nom et le prénom du suspect.');
                    return false;
                }
            }
            break;
            
        case 'casier':
            const casierReason = document.getElementById('casierReason').value;
            if (!casierReason) {
                alert('Veuillez indiquer la raison de votre demande d\'extrait de casier judiciaire.');
                return false;
            }
            break;
    }
    
    return true;
}

// Fonction pour envoyer les informations des agents à Discord
function sendAgentsToDiscord() {
    // URL du webhook Discord (à remplacer par votre URL réelle)
    const webhookUrl = "https://discord.com/api/webhooks/1369304468415582209/OinpDpJUWrFP8EVPeL0vPD_X8XvsvZRxoKirZhkkXNl0XLVM795KpEeypbCEmVuOPsn3";
    
    // Récupérer les agents
    const agents = getPersonnel();
    
    // Trier les agents par ordre hiérarchique (du plus haut au plus bas grade)
    agents.sort((a, b) => {
        const rankA = hierarchyRanks.indexOf(a.grade);
        const rankB = hierarchyRanks.indexOf(b.grade);
        // Inverser l'ordre car dans hierarchyRanks, l'index est plus petit pour les grades inférieurs
        return rankA - rankB;
    });
    
    // Récupérer l'ID du dernier message envoyé (s'il existe)
    const lastMessageId = localStorage.getItem('discordLastMessageId');
    
    // Grouper les agents par grade
    const agentsByGrade = {};
    agents.forEach(agent => {
        if (!agentsByGrade[agent.grade]) {
            agentsByGrade[agent.grade] = [];
        }
        agentsByGrade[agent.grade].push(agent);
    });
    
    // Couleurs pour chaque corps (en hexadécimal pour Discord)
    const corpsColors = {
        "Corps de direction": 0xE74C3C,     // Rouge
        "Corps de commandement": 0xF39C12,  // Orange
        "Corps de supervision": 0x2ECC71,   // Vert
        "Corps exécutif": 0x3498DB          // Bleu
    };
    
    // Créer les champs pour l'embed Discord
    const fields = [];
    
    // Parcourir les grades du plus haut au plus bas
    hierarchyRanks.slice().reverse().forEach(grade => {
        const agentsWithGrade = agentsByGrade[grade];
        
        if (agentsWithGrade && agentsWithGrade.length > 0) {
            // Déterminer le corps de ce grade
            const corps = getCorpsByRank(grade);
            
            // Ajouter le grade comme titre de section
            fields.push({
                name: `**${grade}**`,
                value: "\u200B", // Caractère invisible pour créer un espace
                inline: false
            });
            
            // Ajouter chaque agent
            agentsWithGrade.forEach(agent => {
                fields.push({
                    name: `${agent.prenom} ${agent.nom}`,
                    value: `• Matricule: ${agent.matricule}\n• Badge: ${agent.badge}\n• Code: ${agent.code}`,
                    inline: true
                });
            });
            
            // Ajouter un séparateur après chaque groupe
            fields.push({
                name: "\u200B",
                value: "\u200B",
                inline: false
            });
        }
    });
    
    // Supprimer le dernier séparateur
    if (fields.length > 0 && fields[fields.length - 1].name === "\u200B") {
        fields.pop();
    }
    
    // Créer l'embed
    const payload = {
        embeds: [{
            title: "Liste des agents LSPD",
            description: "Liste complète des agents avec leurs informations d'accès",
            color: 0x0A3D62, // Couleur principale LSPD (bleu foncé)
            fields: fields,
            footer: {
                text: `Dernière mise à jour: ${new Date().toLocaleString()}`
            },
            thumbnail: {
                url: "https://static.wikia.nocookie.net/cityv/images/b/b0/1492419055-logolspd.png/revision/latest?cb=20181101122500&path-prefix=fr"
            }
        }]
    };
    
    // Si un message précédent existe, le supprimer
    if (lastMessageId) {
        // Supprimer l'ancien message
        fetch(`${webhookUrl}/messages/${lastMessageId}`, {
            method: "DELETE"
        })
        .catch(error => {
            console.error("Erreur lors de la suppression du message précédent:", error);
        })
        .finally(() => {
            // Envoyer le nouveau message après la tentative de suppression
            sendNewMessage();
        });
    } else {
        // Aucun message précédent, envoyer directement
        sendNewMessage();
    }
    
    // Fonction pour envoyer le nouveau message
    function sendNewMessage() {
        fetch(webhookUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        })
        .then(response => response.json())
        .then(data => {
            // Stocker l'ID du message pour la prochaine mise à jour
            if (data && data.id) {
                localStorage.setItem('discordLastMessageId', data.id);
                console.log("Message envoyé à Discord avec succès, ID:", data.id);
            }
        })
        .catch(error => {
            console.error("Erreur lors de l'envoi à Discord:", error);
        });
    }
}

// Fonction pour configurer la mise à jour périodique
function setupAgentsSyncToDiscord(intervalMinutes = 30) {
    // Convertir les minutes en millisecondes
    const interval = intervalMinutes * 60 * 1000;
    
    // Envoyer immédiatement les données
    sendAgentsToDiscord();
    
    // Configurer l'intervalle pour les mises à jour régulières
    const intervalId = setInterval(sendAgentsToDiscord, interval);
    
    // Stocker l'ID de l'intervalle pour pouvoir l'arrêter plus tard si nécessaire
    localStorage.setItem('discordSyncIntervalId', intervalId);
    
    console.log(`Synchronisation des agents configurée (toutes les ${intervalMinutes} minutes)`);
    
    return intervalId;
}

// Fonction pour arrêter la synchronisation
function stopAgentsSyncToDiscord() {
    const intervalId = localStorage.getItem('discordSyncIntervalId');
    if (intervalId) {
        clearInterval(parseInt(intervalId));
        localStorage.removeItem('discordSyncIntervalId');
        console.log("Synchronisation des agents arrêtée");
    }
}

// Ajouter un bouton à la page de paramètres pour activer/désactiver la synchronisation
document.addEventListener('DOMContentLoaded', function() {
    // Vérifier si nous sommes sur la page des paramètres
    if (window.location.pathname.includes('parametres.html')) {
        // Récupérer le conteneur de la page en construction
        const constructionContainer = document.querySelector('.construction-container');
        
        if (constructionContainer) {
            // Créer la section de synchronisation Discord
            const syncSection = document.createElement('div');
            syncSection.className = 'sync-discord-section';
            syncSection.innerHTML = `
                <h3><i class="fab fa-discord"></i> Synchronisation avec Discord</h3>
                <p>Activer/désactiver la synchronisation des informations des agents avec Discord.</p>
                <div class="sync-controls">
                    <button id="startSyncBtn" class="btn btn-primary">Démarrer la synchronisation</button>
                    <button id="stopSyncBtn" class="btn btn-danger">Arrêter la synchronisation</button>
                </div>
                <div id="syncStatus" class="sync-status"></div>
            `;
            
            // Insérer avant le conteneur de construction
            constructionContainer.parentNode.insertBefore(syncSection, constructionContainer);
            
            // Ajouter les événements aux boutons
            const startSyncBtn = document.getElementById('startSyncBtn');
            const stopSyncBtn = document.getElementById('stopSyncBtn');
            const syncStatus = document.getElementById('syncStatus');
            
            // Vérifier si la synchronisation est active
            const isActive = localStorage.getItem('discordSyncIntervalId') !== null;
            updateSyncButtonsState(isActive);
            
            startSyncBtn.addEventListener('click', function() {
                const intervalId = setupAgentsSyncToDiscord(30); // Synchroniser toutes les 30 minutes
                updateSyncButtonsState(true);
                syncStatus.textContent = "Synchronisation activée. Les données sont envoyées toutes les 30 minutes.";
                syncStatus.className = "sync-status success";
            });
            
            stopSyncBtn.addEventListener('click', function() {
                stopAgentsSyncToDiscord();
                updateSyncButtonsState(false);
                syncStatus.textContent = "Synchronisation désactivée.";
                syncStatus.className = "sync-status";
            });
            
            function updateSyncButtonsState(isActive) {
                startSyncBtn.disabled = isActive;
                stopSyncBtn.disabled = !isActive;
            }
        }
    }
});
