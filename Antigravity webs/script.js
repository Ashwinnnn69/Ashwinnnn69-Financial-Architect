document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const onboardingView = document.getElementById('onboarding-view');
    const dashboardView = document.getElementById('dashboard-view');
    const onboardingForm = document.getElementById('onboarding-form');
    
    // Modals
    const txModal = document.getElementById('tx-modal');
    const addTxBtn = document.getElementById('add-tx-btn');
    const addIncomeBtn = document.getElementById('add-income-btn');
    const closeTxModalBtn = document.getElementById('close-modal');
    const txForm = document.getElementById('tx-form');
    const txTypeSelect = document.getElementById('tx-type');
    const txCategorySelect = document.getElementById('tx-category');
    const txTbody = document.getElementById('tx-tbody');
    const allTxTbody = document.getElementById('all-tx-tbody');
    const modalTitle = document.getElementById('modal-title');
    const txAmountLabel = document.getElementById('tx-amount-label');

    // Goals DOM
    const goalsContainer = document.getElementById('goals-container');
    const goalModal = document.getElementById('goal-modal');
    const closeGoalModalBtn = document.getElementById('close-goal-modal');
    const goalForm = document.getElementById('goal-form');

    // Profile & Toast DOM
    const toastContainer = document.getElementById('toast-container');
    const profileXpBar = document.getElementById('profile-xp-bar');
    const profileXpText = document.getElementById('profile-xp-text');
    const profileLevelBadge = document.getElementById('profile-level-badge');
    const profileLevelTitle = document.getElementById('profile-level-title');
    const displayLevelBadge = document.getElementById('display-level-badge');
    const achievementsContainer = document.getElementById('achievements-container');

    // Navigation
    const navItems = document.querySelectorAll('.nav-item');
    const pageSections = document.querySelectorAll('.page-section');
    const pageTitle = document.getElementById('page-title');
    const viewAllBtn = document.getElementById('view-all-btn');

    // Metrics Elements
    const metricNetworth = document.getElementById('metric-networth');
    const metricIncome = document.getElementById('metric-income');
    const metricExpenses = document.getElementById('metric-expenses');
    const metricGap = document.getElementById('metric-gap');

    // Settings Elements
    const settingsProfileForm = document.getElementById('settings-profile-form');
    const setNameInput = document.getElementById('set-name');
    const setCurrencySelect = document.getElementById('set-currency');
    const logoutBtn = document.getElementById('logout-btn');

    // User Data State
    let userData = {
        name: '',
        income: 0,
        expenses: 0,
        transactions: [],
        goals: [],
        currency: '₹',
        trendData: { labels: [], income: [], expenses: [] },
        xp: 0,
        level: 1,
        unlockedAchievements: []
    };

    // Gamification Constants
    const LEVEL_THRESHOLDS = [0, 100, 250, 500, 1000, 2000, 5000];
    const LEVEL_TITLES = ['Novice Saver', 'Budget Rookie', 'Smart Spender', 'Wealth Builder', 'Financial Guru', 'Master of Coin', 'Tycoon'];
    
    const ACHIEVEMENTS = [
        // Transactions
        { id: 'tx_1', title: 'First Cent', desc: 'Log your first transaction.', icon: '💰', condition: (d) => d.transactions.length >= 1 },
        { id: 'tx_10', title: 'Tracker', desc: 'Log 10 transactions.', icon: '📝', condition: (d) => d.transactions.length >= 10 },
        { id: 'tx_50', title: 'Habitual', desc: 'Log 50 transactions.', icon: '📅', condition: (d) => d.transactions.length >= 50 },
        { id: 'tx_100', title: 'Accountant', desc: 'Log 100 transactions.', icon: '🧮', condition: (d) => d.transactions.length >= 100 },
        { id: 'tx_500', title: 'Data Entry God', desc: 'Log 500 transactions.', icon: '⌨️', condition: (d) => d.transactions.length >= 500 },
        { id: 'tx_1000', title: 'Legendary Logger', desc: 'Log 1000 transactions.', icon: '📜', condition: (d) => d.transactions.length >= 1000 },

        // Surplus / Net Worth
        { id: 'surplus_10k', title: 'Solid Start', desc: 'Reach a Monthly Surplus of 10k.', icon: '🌱', condition: (d) => (d.income - d.expenses) >= 10000 },
        { id: 'surplus_50k', title: 'Growing Wealth', desc: 'Reach a Monthly Surplus of 50k.', icon: '🌿', condition: (d) => (d.income - d.expenses) >= 50000 },
        { id: 'surplus_100k', title: 'Six Figures', desc: 'Reach a Monthly Surplus of 100k.', icon: '🌲', condition: (d) => (d.income - d.expenses) >= 100000 },
        { id: 'surplus_500k', title: 'Half Million', desc: 'Reach a Monthly Surplus of 500k.', icon: '🏡', condition: (d) => (d.income - d.expenses) >= 500000 },
        { id: 'surplus_1m', title: 'Millionaire', desc: 'Reach a Monthly Surplus of 1M.', icon: '💎', condition: (d) => (d.income - d.expenses) >= 1000000 },
        { id: 'surplus_5m', title: 'Multi-Millionaire', desc: 'Reach a Monthly Surplus of 5M.', icon: '👑', condition: (d) => (d.income - d.expenses) >= 5000000 },
        { id: 'surplus_10m', title: 'Deca-Millionaire', desc: 'Reach a Monthly Surplus of 10M.', icon: '🚀', condition: (d) => (d.income - d.expenses) >= 10000000 },
        { id: 'surplus_100m', title: 'Centa-Millionaire', desc: 'Reach a Monthly Surplus of 100M.', icon: '🌌', condition: (d) => (d.income - d.expenses) >= 100000000 },
        { id: 'surplus_1b', title: 'Billionaire', desc: 'Reach a Monthly Surplus of 1B.', icon: '🌍', condition: (d) => (d.income - d.expenses) >= 1000000000 },

        // Incomes
        { id: 'inc_1', title: 'First Check', desc: 'Log 1 income source.', icon: '💵', condition: (d) => d.transactions.filter(t=>t.type==='income').length >= 1 },
        { id: 'inc_5', title: 'Hustler', desc: 'Log 5 income sources.', icon: '🏃', condition: (d) => d.transactions.filter(t=>t.type==='income').length >= 5 },
        { id: 'inc_20', title: 'Rainmaker', desc: 'Log 20 income sources.', icon: '⛈️', condition: (d) => d.transactions.filter(t=>t.type==='income').length >= 20 },
        { id: 'inc_whale', title: 'Whale', desc: 'Single income over 100k.', icon: '🐋', condition: (d) => d.transactions.some(t=>t.type==='income' && t.amount>=100000) },
        { id: 'inc_mega', title: 'Megalodon', desc: 'Single income over 1M.', icon: '🦈', condition: (d) => d.transactions.some(t=>t.type==='income' && t.amount>=1000000) },
        { id: 'inc_side', title: 'Side Hustle', desc: 'Log a Freelance income.', icon: '💻', condition: (d) => d.transactions.some(t=>t.category==='Freelance') },
        { id: 'inc_empire', title: 'Empire Builder', desc: 'Log a Business income.', icon: '🏢', condition: (d) => d.transactions.some(t=>t.category==='Business') },
        { id: 'inc_passive', title: 'Passive Income', desc: 'Log an Investments income.', icon: '📈', condition: (d) => d.transactions.some(t=>t.category==='Investments') },
        { id: 'inc_gift', title: 'Lucky Day', desc: 'Log a Gifts income.', icon: '🎁', condition: (d) => d.transactions.some(t=>t.category==='Gifts') },

        // Expenses
        { id: 'exp_1', title: 'First Purchase', desc: 'Log an expense.', icon: '💳', condition: (d) => d.transactions.filter(t=>t.type==='expense').length >= 1 },
        { id: 'exp_10', title: 'Spender', desc: 'Log 10 expenses.', icon: '🛍️', condition: (d) => d.transactions.filter(t=>t.type==='expense').length >= 10 },
        { id: 'exp_big', title: 'Big Spender', desc: 'Single expense over 50k.', icon: '💸', condition: (d) => d.transactions.some(t=>t.type==='expense' && t.amount>=50000) },
        { id: 'exp_lux', title: 'Luxury Taste', desc: 'Single expense over 200k.', icon: '🛥️', condition: (d) => d.transactions.some(t=>t.type==='expense' && t.amount>=200000) },
        { id: 'exp_food', title: 'Foodie', desc: 'Log 5 Food expenses.', icon: '🍔', condition: (d) => d.transactions.filter(t=>t.category==='Food').length >= 5 },
        { id: 'exp_trans', title: 'Commuter', desc: 'Log 5 Transportation expenses.', icon: '🚗', condition: (d) => d.transactions.filter(t=>t.category==='Transportation').length >= 5 },
        { id: 'exp_ent', title: 'Entertainer', desc: 'Log 5 Entertainment expenses.', icon: '🎟️', condition: (d) => d.transactions.filter(t=>t.category==='Entertainment').length >= 5 },
        { id: 'exp_house', title: 'Homebody', desc: 'Log 5 Housing expenses.', icon: '🏠', condition: (d) => d.transactions.filter(t=>t.category==='Housing').length >= 5 },
        { id: 'exp_util', title: 'Utility Master', desc: 'Log 5 Utilities expenses.', icon: '⚡', condition: (d) => d.transactions.filter(t=>t.category==='Utilities').length >= 5 },

        // Goals
        { id: 'goal_1', title: 'Visionary', desc: 'Create 1 Goal.', icon: '🎯', condition: (d) => d.goals.length >= 1 },
        { id: 'goal_3', title: 'Planner', desc: 'Create 3 Goals.', icon: '🗺️', condition: (d) => d.goals.length >= 3 },
        { id: 'goal_10', title: 'Strategist', desc: 'Create 10 Goals.', icon: '♟️', condition: (d) => d.goals.length >= 10 },
        { id: 'goal_25', title: 'Mastermind', desc: 'Create 25 Goals.', icon: '🧠', condition: (d) => d.goals.length >= 25 },
        { id: 'goal_c1', title: 'Goal Crusher', desc: 'Complete a Goal.', icon: '🏆', condition: (d) => d.goals.some(g=>g.saved >= g.target) },
        { id: 'goal_c5', title: 'Overachiever', desc: 'Complete 5 Goals.', icon: '🏅', condition: (d) => d.goals.filter(g=>g.saved >= g.target).length >= 5 },
        { id: 'goal_c10', title: 'Dream Realizer', desc: 'Complete 10 Goals.', icon: '🌠', condition: (d) => d.goals.filter(g=>g.saved >= g.target).length >= 10 },
        { id: 'goal_big', title: 'Big Dreamer', desc: 'Create a Goal over 1M.', icon: '🏔️', condition: (d) => d.goals.some(g=>g.target >= 1000000) },

        // Levels
        { id: 'lvl_2', title: 'Level Up', desc: 'Reach Level 2.', icon: '⭐', condition: (d) => d.level >= 2 },
        { id: 'lvl_3', title: 'Intermediate', desc: 'Reach Level 3.', icon: '⭐⭐', condition: (d) => d.level >= 3 },
        { id: 'lvl_4', title: 'Advanced', desc: 'Reach Level 4.', icon: '⭐⭐⭐', condition: (d) => d.level >= 4 },
        { id: 'lvl_5', title: 'Expert', desc: 'Reach Level 5.', icon: '✨', condition: (d) => d.level >= 5 },
        { id: 'lvl_6', title: 'Master', desc: 'Reach Level 6.', icon: '🌟', condition: (d) => d.level >= 6 },
        { id: 'lvl_7', title: 'Maximum Potential', desc: 'Reach Max Level.', icon: '👑', condition: (d) => d.level >= 7 },

        // Misc / Easter Eggs
        { id: 'misc_bal', title: 'Perfect Balance', desc: 'Income exactly matches Expenses.', icon: '⚖️', condition: (d) => d.income > 0 && d.income === d.expenses },
        { id: 'misc_save50', title: 'Heavy Saver', desc: 'Save over 50% of Income.', icon: '🛡️', condition: (d) => d.income > 0 && ((d.income - d.expenses) / d.income) >= 0.5 },
        { id: 'misc_save80', title: 'Extreme Saver', desc: 'Save over 80% of Income.', icon: '🏰', condition: (d) => d.income > 0 && ((d.income - d.expenses) / d.income) >= 0.8 },
        { id: 'misc_danger', title: 'Danger Zone', desc: 'Expenses exceed Income.', icon: '🔥', condition: (d) => d.expenses > d.income },
        { id: 'misc_penny', title: 'Penny Pincher', desc: 'Log an exact 1.00 expense.', icon: '🪙', condition: (d) => d.transactions.some(t=>t.type==='expense' && t.amount===1) },
        { id: 'misc_777', title: 'Jackpot', desc: 'Log an exact 777 transaction.', icon: '🎰', condition: (d) => d.transactions.some(t=>t.amount===777) },
        { id: 'misc_1337', title: 'Leet', desc: 'Log an exact 1337 transaction.', icon: '👾', condition: (d) => d.transactions.some(t=>t.amount===1337) },
        { id: 'misc_broke', title: 'Broke', desc: 'Surplus drops to exactly 0.', icon: '🏜️', condition: (d) => d.transactions.length > 0 && (d.income - d.expenses) === 0 }
    ];

    const EXPENSE_CATEGORIES = ['Housing', 'Food', 'Transportation', 'Utilities', 'Entertainment', 'Personal', 'Other'];
    const INCOME_CATEGORIES = ['Salary', 'Business', 'Freelance', 'Investments', 'Gifts', 'Other'];

    // Chart instances
    let cashflowChart;
    let expenseChart;
    let analyticsCashflowChart;
    let analyticsExpenseChart;
    let analyticsIncomeChart;

    // --- Persistence Logic ---
    function loadData() {
        const stored = localStorage.getItem('financeArchitectData');
        if (stored) {
            userData = JSON.parse(stored);
            if (!userData.goals) userData.goals = [];
            if (!userData.xp) userData.xp = 0;
            if (!userData.level) userData.level = 1;
            if (!userData.unlockedAchievements) userData.unlockedAchievements = [];
            if (!userData.trendData) generateTrendData(userData.income, userData.expenses);
            return true;
        }
        return false;
    }

    function saveData() {
        localStorage.setItem('financeArchitectData', JSON.stringify(userData));
    }

    // --- Initialization ---
    if (loadData()) {
        onboardingView.classList.add('hidden');
        onboardingView.style.opacity = '0';
        dashboardView.classList.remove('hidden');
        dashboardView.style.opacity = '1';
        
        initDashboardUI();
    }

    // --- Navigation Logic ---
    function navigateTo(targetId, title) {
        navItems.forEach(item => {
            if(item.getAttribute('data-target') === targetId) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });

        pageSections.forEach(page => {
            if(page.id === targetId) {
                page.classList.add('active');
                page.classList.remove('hidden');
            } else {
                page.classList.remove('active');
                page.classList.add('hidden');
            }
        });

        pageTitle.textContent = title;

        if(targetId === 'page-analytics' && !analyticsCashflowChart) {
            initAnalyticsCharts();
        }
    }

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const target = item.getAttribute('data-target');
            const title = item.textContent;
            navigateTo(target, title);
        });
    });

    if (viewAllBtn) {
        viewAllBtn.addEventListener('click', () => {
            navigateTo('page-transactions', 'Transactions');
        });
    }

    // --- Gamification Engine ---
    function showToast(title, desc, icon) {
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerHTML = `
            <div class="toast-icon">${icon}</div>
            <div class="toast-content">
                <h4>Achievement Unlocked!</h4>
                <p style="color: var(--accent-mint); font-weight: 600; margin-bottom: 2px;">${title}</p>
                <p>${desc}</p>
            </div>
        `;
        toastContainer.appendChild(toast);
        
        // Remove after animation (5s)
        setTimeout(() => {
            if (toastContainer.contains(toast)) {
                toastContainer.removeChild(toast);
            }
        }, 5000);
    }

    function addXp(amount) {
        userData.xp += amount;
        
        // Check for level up
        let newLevel = 1;
        for (let i = 0; i < LEVEL_THRESHOLDS.length; i++) {
            if (userData.xp >= LEVEL_THRESHOLDS[i]) {
                newLevel = i + 1;
            } else {
                break;
            }
        }

        if (newLevel > userData.level) {
            userData.level = newLevel;
            showToast(`Level ${newLevel} Reached!`, `You are now a ${LEVEL_TITLES[Math.min(newLevel-1, LEVEL_TITLES.length-1)]}`, '🌟');
        }
        
        saveData();
        renderProfile();
    }

    function checkAchievements() {
        ACHIEVEMENTS.forEach(ach => {
            if (!userData.unlockedAchievements.includes(ach.id)) {
                if (ach.condition(userData)) {
                    userData.unlockedAchievements.push(ach.id);
                    showToast(ach.title, ach.desc, ach.icon);
                    addXp(50); // Bonus XP for achievement
                }
            }
        });
        saveData();
        renderProfile();
    }

    function renderProfile() {
        const currLevelIndex = Math.min(userData.level - 1, LEVEL_THRESHOLDS.length - 1);
        const nextLevelIndex = Math.min(userData.level, LEVEL_THRESHOLDS.length - 1);
        
        const currThreshold = LEVEL_THRESHOLDS[currLevelIndex];
        const nextThreshold = LEVEL_THRESHOLDS[nextLevelIndex] || (currThreshold + 1000); // Max level fallback
        
        const xpIntoLevel = userData.xp - currThreshold;
        const xpRequired = nextThreshold - currThreshold;
        const progressPct = userData.level >= LEVEL_THRESHOLDS.length ? 100 : Math.min(100, Math.max(0, (xpIntoLevel / xpRequired) * 100));

        profileLevelBadge.textContent = userData.level;
        displayLevelBadge.textContent = `Lvl ${userData.level}`;
        profileLevelTitle.textContent = LEVEL_TITLES[currLevelIndex];
        
        if (userData.level >= LEVEL_THRESHOLDS.length) {
            profileXpText.textContent = `${userData.xp} XP (Max Level)`;
        } else {
            profileXpText.textContent = `${userData.xp} / ${nextThreshold} XP to next level`;
        }
        
        profileXpBar.style.width = `${progressPct}%`;

        achievementsContainer.innerHTML = '';
        ACHIEVEMENTS.forEach(ach => {
            const isUnlocked = userData.unlockedAchievements.includes(ach.id);
            const card = document.createElement('div');
            card.className = `achievement-card ${isUnlocked ? 'unlocked' : ''}`;
            card.innerHTML = `
                <div class="achievement-icon">${ach.icon}</div>
                <h4>${ach.title}</h4>
                <p>${ach.desc}</p>
            `;
            achievementsContainer.appendChild(card);
        });
    }


    // --- Algorithmic Trend ---
    function generateTrendData(baseIncome, baseExpenses) {
        const labels = [];
        const incData = [];
        const expData = [];
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        
        const d = new Date();
        let currentMonthIdx = d.getMonth();

        for (let i = 5; i > 0; i--) {
            let mIdx = currentMonthIdx - i;
            if (mIdx < 0) mIdx += 12;
            labels.push(months[mIdx]);
            
            let randomInc = baseIncome * (0.9 + Math.random() * 0.2);
            let randomExp = baseExpenses * (0.9 + Math.random() * 0.2);
            incData.push(Math.round(randomInc));
            expData.push(Math.round(randomExp));
        }

        labels.push('Current Month');
        incData.push(baseIncome);
        expData.push(baseExpenses);

        userData.trendData = { labels: labels, income: incData, expenses: expData };
    }

    // --- Onboarding Logic ---
    onboardingForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        userData.name = document.getElementById('ob-name').value;
        userData.income = parseFloat(document.getElementById('ob-income').value);
        userData.currency = document.getElementById('ob-currency').value;
        userData.expenses = 0;
        userData.transactions = [];
        userData.xp = 0;
        userData.level = 1;
        userData.unlockedAchievements = [];
        
        generateTrendData(userData.income, userData.income * 0.5); 

        saveData();

        onboardingView.style.opacity = '0';
        setTimeout(() => {
            onboardingView.classList.add('hidden');
            dashboardView.classList.remove('hidden');
            dashboardView.style.opacity = '0';
            
            void dashboardView.offsetWidth; 
            
            dashboardView.style.opacity = '1';
            
            initDashboardUI();
        }, 500);
    });

    // --- Dashboard Core Logic ---
    function initDashboardUI() {
        document.getElementById('display-name').textContent = userData.name;
        document.getElementById('display-initial').textContent = userData.name.charAt(0).toUpperCase();
        
        setNameInput.value = userData.name;
        setCurrencySelect.value = userData.currency;

        updateDashboardMetrics();
        initCharts();
        renderTransactions();
        renderGoals();
        renderProfile();
        checkAchievements();
    }

    function formatCurrency(amount) {
        return `${userData.currency}${amount.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
    }

    function formatCurrencyNoCents(amount) {
        return `${userData.currency}${amount.toLocaleString()}`;
    }

    function updateDashboardMetrics() {
        const gap = userData.income - userData.expenses;
        const mockNetWorth = (userData.income * 12) + gap * 5;

        metricNetworth.textContent = formatCurrencyNoCents(mockNetWorth);
        metricIncome.textContent = formatCurrencyNoCents(userData.income);
        metricExpenses.textContent = formatCurrencyNoCents(userData.expenses);
        metricGap.textContent = formatCurrencyNoCents(gap);

        const healthScoreText = document.getElementById('health-score-text');
        const healthScoreLabel = document.getElementById('health-score-label');
        const healthScorePath = document.getElementById('health-score-path');

        if(healthScoreText && healthScorePath) {
            let score = 0;
            if (userData.income > 0) {
                const savingRate = gap / userData.income;
                if (savingRate > 0.3) score = 100;
                else if (savingRate > 0) score = 50 + (savingRate / 0.3) * 40;
                else score = 20; 
            }

            score = Math.round(score);
            healthScoreText.textContent = score;
            healthScorePath.style.strokeDasharray = `${score}, 100`;

            if (score >= 80) {
                healthScoreLabel.textContent = "Excellent Cash Flow";
                healthScoreLabel.style.color = "var(--accent-mint)";
                healthScorePath.style.stroke = "var(--accent-mint)";
            } else if (score >= 50) {
                healthScoreLabel.textContent = "Good, but could save more";
                healthScoreLabel.style.color = "var(--accent-sky)";
                healthScorePath.style.stroke = "var(--accent-sky)";
            } else {
                healthScoreLabel.textContent = "Critical - High Burn Rate";
                healthScoreLabel.style.color = "var(--accent-coral)";
                healthScorePath.style.stroke = "var(--accent-coral)";
            }
        }
    }

    function initCharts() {
        Chart.defaults.color = '#cbd5e1';
        Chart.defaults.font.family = "'Inter', sans-serif";

        if(cashflowChart) cashflowChart.destroy();
        if(expenseChart) expenseChart.destroy();

        if(userData.trendData.income.length > 0) {
            userData.trendData.income[userData.trendData.income.length - 1] = userData.income;
            userData.trendData.expenses[userData.trendData.expenses.length - 1] = userData.expenses;
        }

        const ctx1 = document.getElementById('cashflowChart').getContext('2d');
        let gradientSky = ctx1.createLinearGradient(0, 0, 0, 400);
        gradientSky.addColorStop(0, 'rgba(56, 189, 248, 0.4)');
        gradientSky.addColorStop(1, 'rgba(56, 189, 248, 0.0)');

        let gradientCoral = ctx1.createLinearGradient(0, 0, 0, 400);
        gradientCoral.addColorStop(0, 'rgba(251, 113, 133, 0.4)');
        gradientCoral.addColorStop(1, 'rgba(251, 113, 133, 0.0)');

        cashflowChart = new Chart(ctx1, {
            type: 'line',
            data: {
                labels: userData.trendData.labels,
                datasets: [
                    {
                        label: 'Income',
                        data: userData.trendData.income,
                        borderColor: '#38bdf8',
                        backgroundColor: gradientSky,
                        fill: true,
                        tension: 0.4,
                        borderWidth: 2
                    },
                    {
                        label: 'Expenses',
                        data: userData.trendData.expenses,
                        borderColor: '#fb7185',
                        backgroundColor: gradientCoral,
                        fill: true,
                        tension: 0.4,
                        borderWidth: 2
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { labels: { color: '#cbd5e1', usePointStyle: true } } },
                scales: {
                    x: { ticks: { color: '#cbd5e1' }, grid: { display: false } },
                    y: { ticks: { color: '#cbd5e1' }, grid: { color: 'rgba(255,255,255,0.05)' }, beginAtZero: true }
                }
            }
        });

        const ctx2 = document.getElementById('expenseChart').getContext('2d');
        expenseChart = new Chart(ctx2, {
            type: 'doughnut',
            data: getChartDataByType('expense'),
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: 'bottom', labels: { color: '#cbd5e1', padding: 20, usePointStyle: true } } },
                cutout: '70%'
            }
        });
    }

    function getChartDataByType(type) {
        const categories = {};
        userData.transactions.filter(t => t.type === type).forEach(t => {
            categories[t.category] = (categories[t.category] || 0) + t.amount;
        });

        const labels = Object.keys(categories).length > 0 ? Object.keys(categories) : ['No Data Yet'];
        const data = Object.keys(categories).length > 0 ? Object.values(categories) : [1];
        
        let bgColors;
        if(type === 'expense') {
            bgColors = Object.keys(categories).length > 0 ? ['#fb7185', '#f59e0b', '#a78bfa', '#c084fc', '#38bdf8', '#34d399', '#94a3b8'] : ['rgba(255,255,255,0.1)'];
        } else {
            bgColors = Object.keys(categories).length > 0 ? ['#34d399', '#10b981', '#38bdf8', '#eab308', '#c084fc', '#94a3b8'] : ['rgba(255,255,255,0.1)'];
        }

        return {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: bgColors,
                borderWidth: 0,
                hoverOffset: 4
            }]
        };
    }

    function initAnalyticsCharts() {
        if(analyticsCashflowChart) analyticsCashflowChart.destroy();
        if(analyticsExpenseChart) analyticsExpenseChart.destroy();
        if(analyticsIncomeChart) analyticsIncomeChart.destroy();

        const ctx1 = document.getElementById('analyticsCashflowChart').getContext('2d');
        analyticsCashflowChart = new Chart(ctx1, {
            type: 'bar',
            data: {
                labels: userData.trendData.labels,
                datasets: [
                    {
                        label: 'Income',
                        data: userData.trendData.income,
                        backgroundColor: '#38bdf8',
                        borderRadius: 6
                    },
                    {
                        label: 'Expenses',
                        data: userData.trendData.expenses,
                        backgroundColor: '#fb7185',
                        borderRadius: 6
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: { beginAtZero: true, grid: { color: 'rgba(255,255,255,0.05)' } },
                    x: { grid: { display: false } }
                }
            }
        });

        const ctx2 = document.getElementById('analyticsExpenseChart').getContext('2d');
        analyticsExpenseChart = new Chart(ctx2, {
            type: 'doughnut',
            data: getChartDataByType('expense'),
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '60%',
                plugins: { legend: { position: 'right', labels: { usePointStyle: true } } }
            }
        });

        const ctx3 = document.getElementById('analyticsIncomeChart').getContext('2d');
        analyticsIncomeChart = new Chart(ctx3, {
            type: 'doughnut',
            data: getChartDataByType('income'),
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '60%',
                plugins: { legend: { position: 'right', labels: { usePointStyle: true } } }
            }
        });
    }

    function updateAllCharts() {
        if(cashflowChart) {
            userData.trendData.income[userData.trendData.income.length - 1] = userData.income;
            userData.trendData.expenses[userData.trendData.expenses.length - 1] = userData.expenses;
            cashflowChart.update();
        }
        if(expenseChart) {
            expenseChart.data = getChartDataByType('expense');
            expenseChart.update();
        }
        if(analyticsCashflowChart) {
            analyticsCashflowChart.update();
        }
        if(analyticsExpenseChart) {
            analyticsExpenseChart.data = getChartDataByType('expense');
            analyticsExpenseChart.update();
        }
        if(analyticsIncomeChart) {
            analyticsIncomeChart.data = getChartDataByType('income');
            analyticsIncomeChart.update();
        }
    }

    function formatDate(dateObj) {
        return dateObj.toISOString().split('T')[0];
    }

    function renderTransactions() {
        txTbody.innerHTML = '';
        allTxTbody.innerHTML = '';
        
        const sortedTxs = [...userData.transactions].sort((a,b) => new Date(b.date) - new Date(a.date));

        if(sortedTxs.length === 0) {
            txTbody.innerHTML = '<tr><td colspan="4" style="text-align:center; color: var(--text-muted);">No transactions yet. Add one!</td></tr>';
            allTxTbody.innerHTML = '<tr><td colspan="5" style="text-align:center; color: var(--text-muted);">No transactions yet. Add one!</td></tr>';
            return;
        }

        sortedTxs.slice(0, 5).forEach(tx => {
            const tr = createTxRow(tx, false);
            txTbody.appendChild(tr);
        });

        sortedTxs.forEach(tx => {
            const tr = createTxRow(tx, true);
            allTxTbody.appendChild(tr);
        });
    }

    function createTxRow(tx, includeType) {
        const tr = document.createElement('tr');
        const amountClass = tx.type === 'income' ? 'text-positive' : '';
        const sign = tx.type === 'income' ? '+' : '-';
        
        let html = `
            <td>${tx.date}</td>
            <td>${tx.desc}</td>
            ${includeType ? `<td><span style="text-transform:capitalize;">${tx.type}</span></td>` : ''}
            <td><span class="badge">${tx.category}</span></td>
            <td class="amount-col ${amountClass}">${sign}${formatCurrency(tx.amount)}</td>
        `;
        tr.innerHTML = html;
        return tr;
    }

    // --- Goals Logic ---
    function renderGoals() {
        goalsContainer.innerHTML = '';

        userData.goals.forEach(goal => {
            const progressPct = Math.min(100, Math.round((goal.saved / goal.target) * 100));
            
            const card = document.createElement('div');
            card.className = 'goal-card glass-card';
            card.innerHTML = `
                <button class="remove-goal-btn" data-id="${goal.id}" title="Remove Goal">&times;</button>
                <div class="goal-header">
                    <div class="goal-icon" style="background: rgba(255,255,255,0.05); color: ${goal.color};">${goal.icon}</div>
                    <div>
                        <h3>${goal.title}</h3>
                        <p class="goal-target">Target: ${formatCurrencyNoCents(goal.target)}</p>
                    </div>
                </div>
                <div class="progress-container">
                    <div class="progress-bar" style="width: ${progressPct}%; background: ${goal.color};"></div>
                </div>
                <div class="goal-footer">
                    <span>${formatCurrencyNoCents(goal.saved)} saved</span>
                    <span>${progressPct}%</span>
                </div>
            `;
            goalsContainer.appendChild(card);
        });

        const newGoalDiv = document.createElement('div');
        newGoalDiv.className = 'goal-card glass-card new-goal';
        newGoalDiv.innerHTML = `
            <button class="add-goal-btn" id="open-goal-modal-btn">
                <div class="add-icon">+</div>
                <span>Create New Goal</span>
            </button>
        `;
        goalsContainer.appendChild(newGoalDiv);

        document.getElementById('open-goal-modal-btn').addEventListener('click', () => {
            document.getElementById('goal-target-label').textContent = `Target Amount (${userData.currency})`;
            document.getElementById('goal-saved-label').textContent = `Already Saved (${userData.currency})`;
            goalModal.classList.remove('hidden');
        });
    }

    goalsContainer.addEventListener('click', (e) => {
        if(e.target.classList.contains('remove-goal-btn')) {
            const idToRemove = parseInt(e.target.getAttribute('data-id'));
            userData.goals = userData.goals.filter(g => g.id !== idToRemove);
            saveData();
            renderGoals();
        }
    });

    closeGoalModalBtn.addEventListener('click', () => {
        goalModal.classList.add('hidden');
    });

    goalModal.addEventListener('click', (e) => {
        if(e.target === goalModal) goalModal.classList.add('hidden');
    });

    goalForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const colors = ['var(--accent-sky)', 'var(--accent-mint)', 'var(--accent-lavender)', '#f59e0b'];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];

        const newGoal = {
            id: Date.now(),
            title: document.getElementById('goal-title').value,
            target: parseFloat(document.getElementById('goal-target-amount').value),
            saved: parseFloat(document.getElementById('goal-saved-amount').value),
            icon: document.getElementById('goal-icon').value,
            color: randomColor
        };

        userData.goals.push(newGoal);
        addXp(20);
        checkAchievements();
        saveData();
        renderGoals();

        goalForm.reset();
        goalModal.classList.add('hidden');
    });

    // --- Smart Categories Logic ---
    function populateCategories(type) {
        txCategorySelect.innerHTML = '';
        const cats = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
        cats.forEach(c => {
            const opt = document.createElement('option');
            opt.value = c;
            opt.textContent = c;
            txCategorySelect.appendChild(opt);
        });
    }

    txTypeSelect.addEventListener('change', (e) => {
        populateCategories(e.target.value);
    });

    // --- Transaction Modal Logic ---
    function openTxModal(type) {
        document.getElementById('tx-date').value = formatDate(new Date());
        txTypeSelect.value = type;
        populateCategories(type);
        modalTitle.textContent = type === 'income' ? 'Add Income' : 'Add Expense';
        txAmountLabel.textContent = `Amount (${userData.currency})`;
        txModal.classList.remove('hidden');
    }

    addTxBtn.addEventListener('click', () => openTxModal('expense'));
    addIncomeBtn.addEventListener('click', () => openTxModal('income'));

    closeTxModalBtn.addEventListener('click', () => {
        txModal.classList.add('hidden');
    });

    txModal.addEventListener('click', (e) => {
        if(e.target === txModal) txModal.classList.add('hidden');
    });

    txForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const newTx = {
            id: Date.now(),
            type: document.getElementById('tx-type').value,
            date: document.getElementById('tx-date').value,
            desc: document.getElementById('tx-desc').value,
            category: document.getElementById('tx-category').value,
            amount: parseFloat(document.getElementById('tx-amount').value)
        };

        userData.transactions.push(newTx);
        
        if (newTx.type === 'income') {
            userData.income += newTx.amount;
        } else {
            userData.expenses += newTx.amount;
        }

        addXp(10);
        checkAchievements();
        saveData(); 

        updateDashboardMetrics();
        renderTransactions();
        updateAllCharts();

        txForm.reset();
        txModal.classList.add('hidden');
    });

    // --- Settings Logic ---
    settingsProfileForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        userData.name = setNameInput.value;
        userData.currency = setCurrencySelect.value;
        
        saveData(); 

        document.getElementById('display-name').textContent = userData.name;
        document.getElementById('display-initial').textContent = userData.name.charAt(0).toUpperCase();
        
        updateDashboardMetrics();
        renderTransactions();
        renderGoals(); 
        
        const btn = settingsProfileForm.querySelector('button');
        const origText = btn.textContent;
        btn.textContent = 'Saved Successfully!';
        btn.style.background = 'var(--accent-mint)';
        setTimeout(() => {
            btn.textContent = origText;
            btn.style.background = 'var(--primary-gradient)';
        }, 2000);
    });

    logoutBtn.addEventListener('click', () => {
        if(confirm('Are you sure you want to log out and erase all local data?')) {
            localStorage.removeItem('financeArchitectData');
            location.reload(); 
        }
    });

});
