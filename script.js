//
// --- Sudokuheroes.com - Universal & Game Script ---
// This script is now designed to work on all pages.
// It separates universal logic (modals, theme) from game-specific logic.
//

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. UNIVERSAL LOGIC (RUNS ON EVERY PAGE) ---

    // --- START: Dropdown Language Menu Logic ---
const langBtn = document.querySelector('.lang-btn');
const langDropdown = document.querySelector('.lang-dropdown');

if (langBtn && langDropdown) {
    // عند الضغط على زر اللغة
    langBtn.addEventListener('click', (event) => {
        // منع انتشار الحدث، لكي لا يتم إغلاق القائمة فوراً بواسطة المستمع الموجود على النافذة
        event.stopPropagation();
        // إظهار أو إخفاء القائمة
        langDropdown.classList.toggle('show');
    });

    // عند الضغط في أي مكان آخر في الصفحة
    window.addEventListener('click', () => {
        // إذا كانت القائمة ظاهرة، قم بإخفائها
        if (langDropdown.classList.contains('show')) {
            langDropdown.classList.remove('show');
        }
    });
}
// --- END: Dropdown Language Menu Logic ---

// --- START: ADDED FUNCTION TO UPDATE LANGUAGE DISPLAY ---
function updateLanguageSelectorDisplay() {
    // نبحث عن العناصر التي سنقوم بتحديثها
    const selectedFlag = document.getElementById('selected-lang-flag');
    const selectedText = document.getElementById('selected-lang-text');
    const langDropdown = document.querySelector('.lang-dropdown');

    // نتأكد من وجود كل العناصر المطلوبة لتجنب الأخطاء
    if (!selectedFlag || !selectedText || !langDropdown) {
        return;
    }

    // نحصل على مسار الصفحة الحالية (مثال: "/ar/index.html")
    const currentPagePath = window.location.pathname;
    const langLinks = langDropdown.querySelectorAll('a');
    let activeLangLink = null;

    // نبحث في قائمة اللغات عن الرابط الذي يطابق صفحتنا الحالية
    for (const link of langLinks) {
        if (link.pathname === currentPagePath) {
            activeLangLink = link;
            break; // نتوقف عن البحث بمجرد العثور عليه
        }
    }
    
    // إذا وجدنا الرابط المطابق، نقوم بتحديث الزر الرئيسي
    if (activeLangLink) {
        const flagImg = activeLangLink.querySelector('img');
        const langName = activeLangLink.textContent.trim();

        if (flagImg) {
            selectedFlag.src = flagImg.src; // تحديث صورة العلم
            selectedFlag.alt = flagImg.alt;
        }
        
        selectedText.textContent = langName; // تحديث اسم اللغة
    }
}
// --- END: ADDED FUNCTION ---

    // --- Universal DOM Elements ---
    const notificationBar = document.getElementById('notification-bar');
    const settingsBtn = document.getElementById('settings-btn');
    const statsBtn = document.getElementById('stats-btn');
    const settingsModal = document.getElementById('settings-modal');
    const statsModal = document.getElementById('stats-modal');
    const winModal = document.getElementById('win-modal');
    const confirmModal = document.getElementById('confirm-modal');
    const closeModalBtns = document.querySelectorAll('.close-btn');
    const themeSelect = document.getElementById('theme-select');
    const highlightDuplicatesToggle = document.getElementById('highlight-duplicates-toggle');
    const highlightSameToggle = document.getElementById('highlight-same-toggle');
    const timerToggle = document.getElementById('timer-toggle');
    const autoRemoveNotesToggle = document.getElementById('auto-remove-notes-toggle');
    const soundToggle = document.getElementById('sound-toggle');
    const winNewGameBtn = document.getElementById('win-new-game-btn');
    const statsContainer = document.getElementById('stats-container');
    const resetStatsBtn = document.getElementById('reset-stats-btn');
    const confirmTitle = document.getElementById('confirm-title');
    const confirmText = document.getElementById('confirm-text');
    const confirmOkBtn = document.getElementById('confirm-ok-btn');
    const confirmCancelBtn = document.getElementById('confirm-cancel-btn');
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const closeMenuBtn = document.getElementById('close-menu-btn');
    const mobileStatsBtn = document.getElementById('mobile-stats-btn');
    const mobileSettingsBtn = document.getElementById('mobile-settings-btn');

    // START: ADDED CODE FOR MOBILE THEME TOGGLE
    const mobileThemeSwitcher = document.getElementById('mobile-theme-switcher');
    // END: ADDED CODE FOR MOBILE THEME TOGGLE

    let stats = {};
    let confirmCallback = null;
    let isMenuOpen = false;

    // --- NEW: Click Outside to Close Menu Listener ---
document.addEventListener('click', (e) => {
    // Check if the menu is open AND the click was not inside the menu
    // AND the click was not on the hamburger button itself (or its spans)
    if (isMenuOpen && !mobileMenu.contains(e.target) && !hamburgerBtn.contains(e.target)) {
        closeMobileMenu();
    }
});

    // --- Universal Functions ---
    function playSound(soundId) { if (!soundToggle.checked) return; const sound = document.getElementById(soundId); if (sound) { sound.currentTime = 0; sound.play().catch(e => {}); } }
    function showNotification(message, type = 'success') { notificationBar.textContent = message; notificationBar.className = type; notificationBar.style.top = '10px'; setTimeout(() => { notificationBar.style.top = '-50px'; }, 3000); }
    function showConfirmation(title, text, callback) { confirmTitle.textContent = title; confirmText.textContent = text; confirmCallback = callback; confirmModal.style.display = 'flex'; location.hash = "modal"; }
    function saveSettings() { localStorage.setItem('sudokuSettings', JSON.stringify({ theme: themeSelect.value, highlightDuplicates: highlightDuplicatesToggle.checked, highlightSame: highlightSameToggle.checked, showTimer: timerToggle.checked, autoRemoveNotes: autoRemoveNotesToggle.checked, sound: soundToggle.checked })); }
    function loadSettings() {
        const settings = JSON.parse(localStorage.getItem('sudokuSettings') || '{}');
        document.body.className = settings.theme || 'theme-light';
        themeSelect.value = settings.theme || 'theme-light';
        highlightDuplicatesToggle.checked = settings.highlightDuplicates !== false;
        highlightSameToggle.checked = settings.highlightSame !== false;
        timerToggle.checked = settings.showTimer !== false;
        if(document.getElementById('timer')) {
             document.getElementById('timer').style.visibility = timerToggle.checked ? 'visible' : 'hidden';
        }
        autoRemoveNotesToggle.checked = settings.autoRemoveNotes !== false;
        soundToggle.checked = settings.sound !== false;
    }
    function initStats() { stats = { easy: { bestTime: null, gamesWon: 0 }, medium: { bestTime: null, gamesWon: 0 }, hard: { bestTime: null, gamesWon: 0 }, expert: { bestTime: null, gamesWon: 0 }, master: { bestTime: null, gamesWon: 0 }, 'killer-easy': { bestTime: null, gamesWon: 0 }, 'killer-medium': { bestTime: null, gamesWon: 0 }, 'killer-hard': { bestTime: null, gamesWon: 0 }, 'killer-expert': { bestTime: null, gamesWon: 0 }, 'killer-master': { bestTime: null, gamesWon: 0 }, 'daily': { bestTime: null, gamesWon: 0 } }; }
    function loadStats() { stats = JSON.parse(localStorage.getItem('sudokuStats')) || {}; if (!stats['daily']) { initStats(); } }
    function saveStats() { localStorage.setItem('sudokuStats', JSON.stringify(stats)); }
    function updateStatsDisplay() {
        if (!statsContainer) return;
        statsContainer.innerHTML = '';
        const statGroups = { "Classic Sudoku": ['easy', 'medium', 'hard', 'expert', 'master'], "Killer Sudoku": ['killer-easy', 'killer-medium', 'killer-hard', 'killer-expert', 'killer-master'], "Daily Challenge": ['daily'] };
        for (const groupName in statGroups) {
            const groupHeading = document.createElement('h3');
            groupHeading.textContent = groupName;
            statsContainer.appendChild(groupHeading);
            statGroups[groupName].forEach(diff => {
                if (stats[diff]) {
                    const time = stats[diff].bestTime ? new Date(stats[diff].bestTime * 1000).toISOString().substr(14, 5) : 'N/A';
                    const statEl = document.createElement('div');
                    statEl.classList.add('stat-item');
                    statEl.innerHTML = `<span class="stat-diff">${diff.replace('killer-', '')}</span><span class="stat-wins">Wins: ${stats[diff].gamesWon}</span><span class="stat-time">Best: ${time}</span>`;
                    statsContainer.appendChild(statEl);
                }
            });
        }
    }

// ==========================================================
// ===== دالة لنسخ روابط اللغات من قائمة الحاسوب إلى قائمة الهاتف =====
// ==========================================================
function populateMobileLanguageMenu() {
    
    // 1. نجد قائمة اللغات الأصلية (للحاسوب)
    const desktopLangLinks = document.querySelectorAll('.lang-dropdown a');
    
    // 2. نجد المكان الفارغ في قائمة الهاتف (الذي يجب أن تكون قد أضفته في HTML)
    const mobileLangPlaceholder = document.getElementById('mobile-language-placeholder');

    // 3. نتأكد أننا وجدنا كل شيء لتجنب الأخطاء
    if (desktopLangLinks.length > 0 && mobileLangPlaceholder) {
        
        // 4. لكل رابط لغة في قائمة الحاسوب...
        desktopLangLinks.forEach(link => {
            
            // ...نقوم بعمل نسخة طبق الأصل منه
            const newLink = link.cloneNode(true);

            // ...نضيف له تنسيق الهاتف ليتناسب شكله
            newLink.classList.add('mode-btn');

            // ...نضع النسخة في قائمة الهاتف
            mobileLangPlaceholder.appendChild(newLink);
        });
    }
}
// ==========================================================
// ===== نهاية الدالة =====
// ==========================================================

function updateActiveNavLinks() {
    const currentPage = window.location.pathname.split("/").pop();
    const allNavLinks = document.querySelectorAll('.game-mode-selector a.mode-btn');
    
    // الخطوة 1: مسح الكلاس 'active' من جميع الأزرار أولاً
    allNavLinks.forEach(link => link.classList.remove('active'));

    let activeLinkSelector;

    // الخطوة 2: تحديد الزر الصحيح بناءً على الصفحة الحالية
    if (currentPage.includes('killer')) {
        // إذا كانت الصفحة تحتوي على كلمة 'killer'
        activeLinkSelector = 'a.mode-btn[href="killer-index.html"]';

    } else if (currentPage.includes('samurai-sudoku')) {
        // -- هذا هو الشرط الجديد الذي تمت إضافته --
        activeLinkSelector = 'a.mode-btn[href="samurai-sudoku.html"]';

    } else if (currentPage.includes('sudoku-x')) {
        // -- وهذا الشرط الجديد الثاني الذي تمت إضافته --
        activeLinkSelector = 'a.mode-btn[href="sudoku-x.html"]';
        
    } else if (currentPage.includes('daily-challenge')) {
        // إذا كانت الصفحة هي التحدي اليومي
        activeLinkSelector = 'a.mode-btn[href="daily-challenge.html"]';

    } else {
        // هذا الشرط لجميع صفحات السودوكو الكلاسيكي (بما في ذلك index.html)
        activeLinkSelector = 'a.mode-btn[href="index.html"]';
    }

    // الخطوة 3: تطبيق الكلاس 'active' على الزر المحدد فقط
    if (activeLinkSelector) {
        document.querySelectorAll(activeLinkSelector).forEach(link => link.classList.add('active'));
    }
}
    // --- Mobile Menu Logic ---
    function openMobileMenu() { if (isMenuOpen) return; isMenuOpen = true; hamburgerBtn.classList.add('active'); mobileMenu.classList.add('active'); document.body.classList.add('mobile-menu-open'); if (location.hash !== '#menu') { location.hash = '#menu'; } }
    function closeMobileMenu() { if (!isMenuOpen) return; isMenuOpen = false; hamburgerBtn.classList.remove('active'); mobileMenu.classList.remove('active'); document.body.classList.remove('mobile-menu-open'); if (location.hash === '#menu') { history.back(); } }
    
    // --- Universal Event Listeners ---
    statsBtn.addEventListener('click', () => { playSound('click-sound'); updateStatsDisplay(); statsModal.style.display = 'flex'; location.hash = "#modal"; });
    settingsBtn.addEventListener('click', () => { playSound('click-sound'); settingsModal.style.display = 'flex'; location.hash = "#modal"; });
    closeModalBtns.forEach(btn => btn.addEventListener('click', () => location.hash = ''));
    winNewGameBtn.addEventListener('click', () => { playSound('click-sound'); history.back(); startNewGame(difficultySelector.value); });
    confirmOkBtn.addEventListener('click', () => { playSound('click-sound'); if (confirmCallback) confirmCallback(); history.back(); });
    confirmCancelBtn.addEventListener('click', () => { playSound('click-sound'); history.back(); });
    window.addEventListener('click', (e) => { if (e.target.classList.contains('modal')) { location.hash = ''; } });
    themeSelect.addEventListener('change', (e) => { playSound('click-sound'); document.body.className = e.target.value; saveSettings(); });
    [highlightDuplicatesToggle, highlightSameToggle, timerToggle, autoRemoveNotesToggle, soundToggle].forEach(toggle => { toggle.addEventListener('change', () => { playSound('click-sound'); saveSettings(); }); });
    resetStatsBtn.addEventListener('click', () => { playSound('click-sound'); showConfirmation("Reset all statistics?", "This action is permanent and cannot be undone.", () => { initStats(); saveStats(); updateStatsDisplay(); showNotification("Statistics reset.", "success"); }); });
    hamburgerBtn.addEventListener('click', (e) => { e.stopPropagation(); if (isMenuOpen) { closeMobileMenu(); } else { openMobileMenu(); } });
    closeMenuBtn.addEventListener('click', closeMobileMenu);
    mobileStatsBtn.addEventListener('click', () => { playSound('click-sound'); updateStatsDisplay(); statsModal.style.display = 'flex'; location.hash = "#modal"; });
    mobileSettingsBtn.addEventListener('click', () => { playSound('click-sound'); settingsModal.style.display = 'flex'; location.hash = "#modal"; });

    // START: ADDED CODE FOR MOBILE THEME TOGGLE
    if (mobileThemeSwitcher) {
        mobileThemeSwitcher.addEventListener('click', () => {
            playSound('click-sound');
            let newTheme;
            const currentTheme = document.body.className; // e.g., "theme-light" or "theme-dark" or "theme-paper"

            // إذا كان الثيم الحالي هو Light أو Paper، قم بالتحويل إلى Dark
            // وإلا (إذا كان Dark)، قم بالتحويل إلى Light
            if (currentTheme.includes('theme-light') || currentTheme.includes('theme-paper')) {
                newTheme = 'theme-dark';
            } else {
                newTheme = 'theme-light';
            }

            document.body.className = newTheme; // يغير الكلاس في الـ body، مما يفعّل الـ CSS الجديد
            themeSelect.value = newTheme; // مزامنة مع القائمة المنسدلة في نافذة الإعدادات
            saveSettings(); // حفظ الإعداد الجديد في Local Storage
        });
    }
    // END: ADDED CODE FOR MOBILE THEME TOGGLE

    window.addEventListener('hashchange', function() { if (location.hash !== '#modal' && location.hash !== '#menu') { document.querySelectorAll('.modal').forEach(modal => { modal.style.display = 'none'; }); if (isMenuOpen) { closeMobileMenu(); } } else if (location.hash === '#modal' && isMenuOpen) { closeMobileMenu(); } });


    // --- Initialize Universal Features ---
    loadSettings();
    loadStats();
    updateActiveNavLinks();
    updateLanguageSelectorDisplay(); // <--- أضف هذا السطر هنا
    populateMobileLanguageMenu(); // <--- أضف هذا السطر هنا



    // --- 2. GAME-SPECIFIC LOGIC (ONLY RUNS ON GAME PAGES) ---

    const grid = document.getElementById('sudoku-grid');

    if (grid) {
        // --- Game DOM Elements ---
        const difficultySelector = document.getElementById('difficulty');
        const newGameBtn = document.getElementById('new-game-btn');
        const newGameBtnBottom = document.getElementById('new-game-btn-bottom');
        const timerElement = document.getElementById('timer');
        const numberPad = document.querySelector('.number-pad');
        const pencilBtn = document.getElementById('pencil-btn');
        const undoBtn = document.getElementById('undo-btn');
        const hintBtn = document.getElementById('hint-btn');
        const checkBtn = document.getElementById('check-btn');
        const solveBtn = document.getElementById('solve-btn');
        const eraseBtn = document.getElementById('erase-btn');
        const winDifficultyElement = document.getElementById('win-difficulty');
        const winTimeElement = document.getElementById('win-time');
        const bestTimeMsgElement = document.getElementById('best-time-msg');
        let gridContainer = grid.parentElement.id === 'grid-container' ? grid.parentElement : null;
        if (!gridContainer) {
            gridContainer = document.createElement('div');
            gridContainer.id = 'grid-container';
            grid.parentNode.insertBefore(gridContainer, grid);
            gridContainer.appendChild(grid);
        }
        let cageOverlay = document.getElementById('cage-overlay');
        if (!cageOverlay) {
            cageOverlay = document.createElement('div');
            cageOverlay.id = 'cage-overlay';
            gridContainer.appendChild(cageOverlay);
        }

        // --- Game State ---
        let board = [], solution = [], userBoard = [], notes = {}, historyStack = [], cages = [];
        let selectedCell = null, isPencilMode = false, timerInterval, seconds = 0, currentDifficulty = 'medium', currentGameMode = 'classic';
        let isPaused = false, isGameFinished = false;
        let timerDisplay, mobileTimerDisplay;

        // --- Sudoku Generators (Classic & Killer) ---
        const sudokuGenerator = new function() {
            const shuffle = (array) => { for (let i = array.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1));[array[i], array[j]] = [array[j], array[i]]; } return array; };
            const isValidForClassic = (board, row, col, num) => {
                for (let i = 0; i < 9; i++) {
                    const m = 3 * Math.floor(row / 3) + Math.floor(i / 3);
                    const n = 3 * Math.floor(col / 3) + i % 3;
                    if (board[row][i] === num || board[i][col] === num || board[m][n] === num) { return false; }
                }
                return true;
            };
            const solveClassic = (board) => {
                for (let i = 0; i < 81; i++) {
                    const row = Math.floor(i / 9), col = i % 9;
                    if (board[row][col] === 0) {
                        const numbers = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);
                        for (const num of numbers) {
                            if (isValidForClassic(board, row, col, num)) {
                                board[row][col] = num;
                                if (solveClassic(board)) { return true; }
                                board[row][col] = 0;
                            }
                        }
                        return false;
                    }
                }
                return true;
            };
            this.generate = (difficulty) => {
                const solution = Array(9).fill(0).map(() => Array(9).fill(0));
                solveClassic(solution);
                const puzzle = JSON.parse(JSON.stringify(solution));
                const difficulties = { easy: 35, medium: 45, hard: 53, expert: 58, master: 62 };
                let holes = difficulties[difficulty] || 45;
                while (holes > 0) {
                    const row = Math.floor(Math.random() * 9), col = Math.floor(Math.random() * 9);
                    if (puzzle[row][col] !== 0) { puzzle[row][col] = 0; holes--; }
                }
                return { board: puzzle, solution: solution };
            };
            this.solveClassic = solveClassic;
        };
        const killerSudokuGenerator = new function() {
            // ... (Killer Sudoku generator code remains the same as your original file)
            const shuffle = (array) => { for (let i = array.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1));[array[i], array[j]] = [array[j], array[i]]; } return array; };
            const getNeighbors = (index) => { const n = []; const r = Math.floor(index / 9); const c = index % 9; if (r > 0) n.push(index - 9); if (r < 8) n.push(index + 9); if (c > 0) n.push(index - 1); if (c < 8) n.push(index + 1); return n; };
            this.generate = (difficulty) => {
                const difficultySettings = { easy: { givenNumbers: 10, maxCageSize: 5 }, medium: { givenNumbers: 0,  maxCageSize: 5 }, hard: { givenNumbers: 0,  maxCageSize: 4 }, expert: { givenNumbers: 0,  maxCageSize: 3 }, master: { givenNumbers: 0,  maxCageSize: 3 } };
                const settings = difficultySettings[difficulty] || difficultySettings.medium;
                const solution = Array(9).fill(0).map(() => Array(9).fill(0));
                sudokuGenerator.solveClassic(solution);
                let cages = []; let isPartitioned = false; let partitionAttempts = 0;
                while (!isPartitioned && partitionAttempts < 200) {
                    partitionAttempts++; let cellsToCage = Array.from({length: 81}, (_, i) => i); cages = []; let validPartition = true;
                    while (cellsToCage.length > 0) {
                        const currentCage = []; const cageSize = Math.floor(Math.random() * (settings.maxCageSize - 2 + 1)) + 2; let startCell = cellsToCage[Math.floor(Math.random() * cellsToCage.length)]; currentCage.push(startCell); cellsToCage = cellsToCage.filter(c => c !== startCell);
                        for (let i = 1; i < cageSize && cellsToCage.length > 0; i++) {
                            const neighbors = shuffle(getNeighbors(currentCage[currentCage.length-1])).filter(n => cellsToCage.includes(n));
                            if(neighbors.length > 0) { let nextCell = neighbors[0]; currentCage.push(nextCell); cellsToCage = cellsToCage.filter(c => c !== nextCell); } else { break; }
                        }
                        const cageNumbers = currentCage.map(i => solution[Math.floor(i / 9)][i % 9]);
                        if (new Set(cageNumbers).size !== cageNumbers.length) { validPartition = false; break; }
                        cages.push({ cells: currentCage, sum: cageNumbers.reduce((a, b) => a + b, 0) });
                    }
                    if (validPartition && cellsToCage.length === 0) { isPartitioned = true; }
                }
                if (!isPartitioned) { console.error("Failed to generate Killer Sudoku."); return sudokuGenerator.generate('hard'); }
                let startingBoard;
                if (settings.givenNumbers > 0) {
                    startingBoard = JSON.parse(JSON.stringify(solution)); let holesToMake = 81 - settings.givenNumbers;
                    while (holesToMake > 0) { const row = Math.floor(Math.random() * 9), col = Math.floor(Math.random() * 9); if (startingBoard[row][col] !== 0) { startingBoard[row][col] = 0; holesToMake--; } }
                } else { startingBoard = Array(9).fill(0).map(() => Array(9).fill(0)); }
                return { board: startingBoard, solution, cages };
            };
        };

        // --- Game Functions (Initialization, Grid, Controls, etc.) ---
        function initGame() {
            createPauseElements();
            timerDisplay = document.getElementById('timer-display');
            mobileTimerDisplay = document.getElementById('mobile-timer-display');
            const pageDifficulty = difficultySelector.value;
            currentGameMode = pageDifficulty.startsWith('killer-') ? 'killer' : 'classic';
            
            if (pageDifficulty === 'daily') {
                const today = new Date().toISOString().slice(0, 10);
                if (localStorage.getItem(`dailyCompleted-${today}`) === 'true') { loadGameState(); handleDailyWinAesthetics(); return; }
                const savedState = JSON.parse(localStorage.getItem('sudokuGameState'));
                if (savedState && savedState.currentDifficulty.startsWith('daily-') && savedState.dailyDate === today) { loadGameState(); }
                else { clearGameState(); startNewGame('daily'); }
            } else {
                const savedState = JSON.parse(localStorage.getItem('sudokuGameState'));
                if (savedState && savedState.currentDifficulty === pageDifficulty) { loadGameState(); }
                else { clearGameState(); startNewGame(pageDifficulty); }
            }
            setupGameEventListeners();
        }

        function startNewGame(difficulty) {
            isGameFinished = false; document.body.classList.remove('daily-solved');
            currentDifficulty = difficulty;
            if (difficultySelector.value !== currentDifficulty && !currentDifficulty.startsWith('daily-')) { difficultySelector.value = currentDifficulty; }
            let puzzleData;
            if (difficulty === 'daily') {
                const today = new Date(); const dateString = today.toISOString().slice(0, 10);
                const titleElement = document.getElementById('daily-challenge-title');
                if(titleElement) { titleElement.textContent = `Challenge for: ${dateString}`; }
                let seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
                const seededRandom = () => { let x = Math.sin(seed++) * 10000; return x - Math.floor(x); };
                const difficulties = ['easy', 'medium', 'hard', 'expert'];
                const dailyDiff = difficulties[Math.floor(seededRandom() * difficulties.length)];
                currentGameMode = 'classic'; cages = []; puzzleData = sudokuGenerator.generate(dailyDiff); currentDifficulty = `daily-classic-${dailyDiff}`;
            } else if (currentDifficulty.startsWith('killer-')) {
                currentGameMode = 'killer';
                puzzleData = killerSudokuGenerator.generate(currentDifficulty.replace('killer-', ''));
                cages = puzzleData.cages;
            } else {
                currentGameMode = 'classic'; cages = [];
                puzzleData = sudokuGenerator.generate(difficulty);
            }
            board = puzzleData.board; solution = puzzleData.solution; userBoard = JSON.parse(JSON.stringify(board));
            notes = {}; historyStack = []; seconds = 0;
            if(isPaused) { togglePause(); }
            createGrid(); resetTimer(); startTimer(); saveGameState();
        }

        function createGrid() {
            grid.innerHTML = ''; cageOverlay.innerHTML = '';
            for (let i = 0; i < 81; i++) {
                const cell = document.createElement('div');
                cell.classList.add('cell'); cell.dataset.index = i;
                const row = Math.floor(i / 9), col = i % 9;
                if (board[row][col] !== 0) {
                    cell.textContent = board[row][col]; cell.classList.add('fixed');
                } else {
                    cell.innerHTML = `<div class="notes-grid">${Array.from({length: 9}).map((_, j) => `<div class="note-cell" data-note="${j+1}"></div>`).join('')}</div>`;
                    if (userBoard[row][col] !== 0) { cell.textContent = userBoard[row][col]; cell.classList.add('user-input'); }
                    else if (notes[i] && notes[i].length > 0) { renderNotesForCell(i); }
                }
                grid.appendChild(cell);
                const overlayCell = document.createElement('div');
                overlayCell.classList.add('overlay-cell');
                cageOverlay.appendChild(overlayCell);
            }
            if (selectedCell) {
                const newSelectedCell = grid.querySelector(`[data-index='${selectedCell.dataset.index}']`);
                if (newSelectedCell) selectCell(newSelectedCell);
            }
            if (currentGameMode === 'killer') { drawCages(); }
        }

        // ... (All other game-specific functions like drawCages, setupGameEventListeners, handleInput, checkForWin, etc., go here, exactly as they were in your original file)
        
        function drawCages() { if (!cages) return; const overlayCells = cageOverlay.querySelectorAll('.overlay-cell'); if (overlayCells.length === 0) return; cages.forEach(cage => { const topLeftCellIndex = cage.cells.reduce((a, b) => { const rA = Math.floor(a/9), cA = a%9; const rB = Math.floor(b/9), cB = b%9; return (rA < rB || (rA === rB && cA < cB)) ? a : b; }); cage.cells.forEach(cellIndex => { const cellElement = grid.querySelector(`[data-index='${cellIndex}']`); const overlayCellElement = overlayCells[cellIndex]; if(cellIndex === topLeftCellIndex) { const oldSum = cellElement.querySelector('.cage-sum'); if (oldSum) oldSum.remove(); const sumSpan = document.createElement('span'); sumSpan.classList.add('cage-sum'); sumSpan.textContent = cage.sum; cellElement.appendChild(sumSpan); } const neighbors = { top: cellIndex - 9, bottom: cellIndex + 9, left: cellIndex - 1, right: cellIndex + 1 }; if (!cage.cells.includes(neighbors.top)) overlayCellElement.classList.add('cage-top'); if (!cage.cells.includes(neighbors.bottom)) overlayCellElement.classList.add('cage-bottom'); if (!cage.cells.includes(neighbors.left) || (cellIndex % 9 === 0)) overlayCellElement.classList.add('cage-left'); if (!cage.cells.includes(neighbors.right) || (cellIndex % 9 === 8)) overlayCellElement.classList.add('cage-right'); }); }); }
        function renderNotesForCell(index) { const cell = grid.querySelector(`[data-index='${index}']`); if (!cell) return; const notesGrid = cell.querySelector('.notes-grid'); if (!notesGrid) return; notesGrid.querySelectorAll('.note-cell').forEach(nc => nc.textContent = ''); if (notes[index]) { notes[index].forEach(noteNum => { const noteCell = notesGrid.querySelector(`[data-note='${noteNum}']`); if (noteCell) noteCell.textContent = noteNum; }); } }
        function setupGameEventListeners() { grid.addEventListener('click', onCellClick); numberPad.addEventListener('click', onNumberPadClick); document.addEventListener('keydown', onKeyDown); const newGameAction = () => { playSound('click-sound'); if (difficultySelector.value === 'daily') { showConfirmation("Restart Daily Challenge?", "Your progress will be lost.", () => startNewGame('daily')); } else { showConfirmation("Start a new game?", "Any progress will be lost.", () => startNewGame(difficultySelector.value)); } }; newGameBtn.addEventListener('click', newGameAction); if (newGameBtnBottom) { newGameBtnBottom.addEventListener('click', newGameAction); } pencilBtn.addEventListener('click', () => { playSound('click-sound'); togglePencilMode(); }); undoBtn.addEventListener('click', () => { playSound('click-sound'); undoLastMove(); }); hintBtn.addEventListener('click', () => { playSound('click-sound'); giveHint(); }); checkBtn.addEventListener('click', () => { playSound('click-sound'); checkMistakes(); }); solveBtn.addEventListener('click', () => { playSound('click-sound'); showConfirmation("Reveal the solution?", "This will end the game.", solvePuzzle); }); difficultySelector.addEventListener('change', (e) => { const targetDifficulty = e.target.value; let targetUrl; if (targetDifficulty === 'daily') { targetUrl = 'daily-challenge.html'; } else if (targetDifficulty.startsWith('killer-')) { targetUrl = `${targetDifficulty}.html`; } else { targetUrl = targetDifficulty === 'medium' ? 'index.html' : `${targetDifficulty}.html`; } window.location.href = targetUrl; }); timerToggle.addEventListener('change', () => timerElement.style.visibility = timerToggle.checked ? 'visible' : 'hidden'); }
        function createPauseElements() { let pauseScreen = document.createElement('div'); pauseScreen.id = 'pause-screen'; pauseScreen.innerHTML = `<div id="play-btn"></div><a>www.SudokuHerose.com</a>`; if (gridContainer) { gridContainer.appendChild(pauseScreen); } timerElement.innerHTML = `<span id="timer-display">00:00</span>`; let pauseBtn = document.createElement('span'); pauseBtn.id = 'pause-btn'; pauseBtn.innerHTML = '❚❚'; timerElement.appendChild(pauseBtn); timerElement.addEventListener('click', togglePause); const playBtn = pauseScreen.querySelector('#play-btn'); if(playBtn) { playBtn.addEventListener('click', (e) => { e.stopPropagation(); togglePause(); }); } }
        function onCellClick(e) { if (isPaused || isGameFinished) return; const cell = e.target.closest('.cell'); if (cell) { playSound('click-sound'); selectCell(cell); } }
        function onNumberPadClick(e) { if (isPaused || isGameFinished) return; if (!selectedCell || selectedCell.classList.contains('fixed')) return; if (e.target.classList.contains('num-btn')) { handleInput(parseInt(e.target.textContent)); } else if (e.target.id === 'erase-btn') { playSound('click-sound'); handleInput(0); } }
        function onKeyDown(e) { if (isPaused || isGameFinished) return; if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) { e.preventDefault(); if (!selectedCell) {selectCell(grid.querySelector(".cell[data-index='0']")); return;} let index = parseInt(selectedCell.dataset.index), row = Math.floor(index / 9), col = index % 9; if (e.key === 'ArrowUp' && row > 0) index -= 9; else if (e.key === 'ArrowDown' && row < 8) index += 9; else if (e.key === 'ArrowLeft' && col > 0) index -= 1; else if (e.key === 'ArrowRight' && col < 8) index += 1; const newCell = grid.querySelector(`[data-index='${index}']`); if (newCell) { playSound('click-sound'); selectCell(newCell); } return; } if (!selectedCell || selectedCell.classList.contains('fixed')) return; if (e.key >= '1' && e.key <= '9') handleInput(parseInt(e.key)); else if (e.key === 'Backspace' || e.key === 'Delete') { playSound('click-sound'); handleInput(0); } else if (e.key.toLowerCase() === 'p') { playSound('click-sound'); togglePencilMode(); } }
        function selectCell(cell) { if (selectedCell) selectedCell.classList.remove('selected'); selectedCell = cell; selectedCell.classList.add('selected'); highlightRelevantCells(cell); }
        function saveGameState() { const state = { board, solution, userBoard, notes, seconds, currentDifficulty, cages, history: historyStack }; if (difficultySelector.value === 'daily' || currentDifficulty.startsWith('daily-')) { state.dailyDate = new Date().toISOString().slice(0, 10); } localStorage.setItem('sudokuGameState', JSON.stringify(state)); }
        function loadGameState() { const savedState = localStorage.getItem('sudokuGameState'); if (savedState) { const state = JSON.parse(savedState); board = state.board; solution = state.solution; userBoard = state.userBoard; notes = state.notes || {}; seconds = state.seconds; historyStack = state.history || []; currentDifficulty = state.currentDifficulty; cages = state.cages || []; difficultySelector.value = state.currentDifficulty.startsWith('daily-') ? 'daily' : state.currentDifficulty; currentGameMode = (currentDifficulty.startsWith('killer-') || currentDifficulty.startsWith('daily-killer-')) ? 'killer' : 'classic'; if (currentDifficulty.startsWith('daily-')) { const titleElement = document.getElementById('daily-challenge-title'); if (titleElement) titleElement.textContent = `Challenge for: ${state.dailyDate}`; } createGrid(); resetTimer(); startTimer(); showNotification("Game restored.", "success"); return true; } return false; }
        function clearGameState() { localStorage.removeItem('sudokuGameState'); }
        function formatTime(totalSeconds) { const min = Math.floor(totalSeconds / 60).toString().padStart(2, '0'); const sec = (totalSeconds % 60).toString().padStart(2, '0'); return `${min}:${sec}`; }
        function triggerConfetti() { if (typeof confetti !== 'function') return; const duration = 5 * 1000, animationEnd = Date.now() + duration; const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 1001 }; function randomInRange(min, max) { return Math.random() * (max - min) + min; } const interval = setInterval(function() { const timeLeft = animationEnd - Date.now(); if (timeLeft <= 0) { return clearInterval(interval); } const particleCount = 50 * (timeLeft / duration); confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } })); confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } })); }, 250); }
        function handleInput(num) { if (selectedCell.classList.contains('fixed') || !selectedCell) return; const index = parseInt(selectedCell.dataset.index), row = Math.floor(index / 9), col = index % 9; historyStack.push({ index, prevValue: userBoard[row][col], prevNotes: JSON.parse(JSON.stringify(notes)), isPencilMode }); if (isPencilMode) { playSound('click-sound'); setNote(index, num); } else { playSound(num === 0 ? 'click-sound' : 'place-sound'); setValue(index, num); if (num !== 0 && autoRemoveNotesToggle.checked) autoRemoveNotes(row, col, num); if (checkForWin()) return; } highlightRelevantCells(selectedCell); saveGameState(); }
        function setValue(index, value) { const row = Math.floor(index / 9), col = index % 9, cell = grid.querySelector(`[data-index='${index}']`); userBoard[row][col] = value; delete notes[index]; cell.classList.remove('user-input'); cell.innerHTML = `<div class="notes-grid">${Array.from({length: 9}).map((_, j) => `<div class="note-cell" data-note="${j+1}"></div>`).join('')}</div>`; if (value !== 0) { cell.textContent = value; cell.classList.add('user-input'); } }
        function setNote(index, noteNum) { const row = Math.floor(index / 9), col = index % 9; if (userBoard[row][col] !== 0) return; notes[index] = notes[index] || []; const noteIndex = notes[index].indexOf(noteNum); if (noteNum === 0) { notes[index] = []; } else if (noteIndex > -1) { notes[index].splice(noteIndex, 1); } else { notes[index].push(noteNum); } renderNotesForCell(index); }
        function autoRemoveNotes(row, col, num) { for (let i = 0; i < 9; i++) { removeNoteFromCell(row * 9 + i, num); removeNoteFromCell(i * 9 + col, num); } const startRow = row - row % 3, startCol = col - col % 3; for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) removeNoteFromCell((startRow + i) * 9 + (startCol + j), num); }
        function removeNoteFromCell(index, noteNum) { if (notes[index]) { const noteIndex = notes[index].indexOf(noteNum); if (noteIndex > -1) { notes[index].splice(noteIndex, 1); renderNotesForCell(index); } } }
        function togglePencilMode() { isPencilMode = !isPencilMode; pencilBtn.classList.toggle('active', isPencilMode); }
        function highlightRelevantCells(cell) { document.querySelectorAll('.cell').forEach(c => c.classList.remove('highlighted', 'highlight-number', 'error')); if (!cell) return; const index = parseInt(cell.dataset.index), row = Math.floor(index / 9), col = index % 9; for (let i = 0; i < 9; i++) { document.querySelector(`[data-index='${row * 9 + i}']`)?.classList.add('highlighted'); document.querySelector(`[data-index='${i * 9 + col}']`)?.classList.add('highlighted'); } const startRow = row - row % 3, startCol = col - col % 3; for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) document.querySelector(`[data-index='${(startRow + i) * 9 + (startCol + j)}']`)?.classList.add('highlighted'); const cellValue = userBoard[row][col] || (cell.classList.contains('fixed') ? parseInt(cell.textContent) : 0); if (cellValue !== 0 && highlightSameToggle.checked) { document.querySelectorAll('.cell').forEach(c => { if (parseInt(c.textContent) === cellValue && c.textContent.length === 1) c.classList.add('highlight-number'); }); } if (highlightDuplicatesToggle.checked) highlightDuplicates(); cell.classList.add('selected'); }
        function highlightDuplicates() { const checkUnit = (unit) => { const seen = new Map(), duplicates = new Set(); unit.forEach(({ v, i }) => { if (v === 0) return; if (seen.has(v)) { duplicates.add(i); duplicates.add(seen.get(v)); } else { seen.set(v, i); } }); duplicates.forEach(dupIndex => grid.querySelector(`[data-index='${dupIndex}']`)?.classList.add('error')); }; for (let i = 0; i < 9; i++) { const rowUnit = [], colUnit = [], boxUnit = []; const boxStartRow = Math.floor(i / 3) * 3, boxStartCol = (i % 3) * 3; for (let j = 0; j < 9; j++) { rowUnit.push({ v: userBoard[i][j], i: i * 9 + j }); colUnit.push({ v: userBoard[j][i], i: j * 9 + i }); const r = boxStartRow + Math.floor(j / 3), c = boxStartCol + (j % 3); boxUnit.push({ v: userBoard[r][c], i: r * 9 + c }); } [rowUnit, colUnit, boxUnit].forEach(checkUnit); } }
        function undoLastMove() { if (historyStack.length === 0 || isGameFinished) { showNotification("Nothing to undo.", "error"); return; } const lastMove = historyStack.pop(); isPencilMode = lastMove.isPencilMode; pencilBtn.classList.toggle('active', isPencilMode); userBoard[Math.floor(lastMove.index / 9)][lastMove.index % 9] = lastMove.prevValue; notes = JSON.parse(JSON.stringify(lastMove.prevNotes)); createGrid(); const cellToSelect = grid.querySelector(`[data-index='${lastMove.index}']`); if (cellToSelect) selectCell(cellToSelect); saveGameState(); }
        function giveHint() { if (isPaused || isGameFinished) return; const emptyCells = []; for (let i = 0; i < 81; i++) if (userBoard[Math.floor(i / 9)][i % 9] === 0) emptyCells.push(i); if (emptyCells.length > 0) { const randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)]; const row = Math.floor(randomIndex / 9), col = randomIndex % 9; selectCell(grid.querySelector(`[data-index='${randomIndex}']`)); if (isPencilMode) togglePencilMode(); handleInput(solution[row][col]); } else { showNotification("No empty cells for a hint!", "error"); } }
        function checkMistakes() { if(isGameFinished) return; let mistakesFound = false; document.querySelectorAll('.cell.error').forEach(c => c.classList.remove('error')); for (let i = 0; i < 81; i++) { const cell = grid.querySelector(`[data-index='${i}']`); if (cell.classList.contains('user-input')) { const row = Math.floor(i / 9), col = i % 9; if (userBoard[row][col] !== solution[row][col]) { cell.classList.add('error'); mistakesFound = true; } } } if(currentGameMode === 'killer') { cages.forEach(cage => { const cageValues = cage.cells.map(i => userBoard[Math.floor(i/9)][i%9]); const cageSum = cageValues.reduce((a,b) => a+b, 0); const hasDuplicates = new Set(cageValues.filter(v => v !== 0)).size !== cageValues.filter(v => v !== 0).length; if (hasDuplicates || (cageSum !== cage.sum && !cageValues.includes(0))) { mistakesFound = true; cage.cells.forEach(i => grid.querySelector(`[data-index='${i}']`)?.classList.add('error')); } }); } if (mistakesFound) { playSound('error-sound'); showNotification("Mistakes highlighted.", "error"); setTimeout(() => document.querySelectorAll('.cell.error').forEach(c => c.classList.remove('error')), 2000); } else { showNotification("No mistakes found!", "success"); } }
        function solvePuzzle() { if(isGameFinished) return; userBoard = JSON.parse(JSON.stringify(solution)); notes = {}; historyStack = []; createGrid(); clearInterval(timerInterval); clearGameState(); }
        function checkForWin() { if (currentGameMode === 'killer') { let allCagesCorrect = true; for(const cage of cages) { const cageValues = cage.cells.map(i => userBoard[Math.floor(i/9)][i%9]); if(cageValues.includes(0)) return false; const cageSum = cageValues.reduce((a,b) => a+b, 0); const hasDuplicates = new Set(cageValues).size !== cageValues.length; if(cageSum !== cage.sum || hasDuplicates) { allCagesCorrect = false; break; } } if(!allCagesCorrect) return false; } for (let r = 0; r < 9; r++) for (let c = 0; c < 9; c++) if (userBoard[r][c] !== solution[r][c]) return false; clearInterval(timerInterval); playSound('win-sound'); triggerConfetti(); if (currentDifficulty.startsWith('daily-')) { const today = new Date().toISOString().slice(0, 10); localStorage.setItem(`dailyCompleted-${today}`, 'true'); saveGameState(); handleDailyWinAesthetics(); } else { clearGameState(); } let statKey = currentDifficulty.startsWith('daily-') ? 'daily' : currentDifficulty; const diffStats = stats[statKey]; if(diffStats) { diffStats.gamesWon = (diffStats.gamesWon || 0) + 1; bestTimeMsgElement.textContent = ''; if (diffStats.bestTime === null || seconds < diffStats.bestTime) { diffStats.bestTime = seconds; bestTimeMsgElement.textContent = 'New best time!'; } saveStats(); updateStatsDisplay(); } let displayName = currentDifficulty.replace('killer-', 'Killer ').replace('daily-classic-', 'Daily Classic ').replace('daily-killer-', 'Daily Killer '); winDifficultyElement.textContent = displayName.charAt(0).toUpperCase() + displayName.slice(1); winTimeElement.textContent = formatTime(seconds); const delay = currentDifficulty.startsWith('daily-') ? 2000 : 0; setTimeout(() => { winModal.style.display = 'flex'; location.hash = "modal"; }, delay); return true; }
        function startTimer() { if(timerInterval) clearInterval(timerInterval); timerInterval = setInterval(() => { if (!isPaused) { seconds++; const formattedTime = formatTime(seconds); if (timerDisplay) { timerDisplay.textContent = formattedTime; } if (mobileTimerDisplay) { mobileTimerDisplay.textContent = formattedTime; } } }, 1000); }
        function resetTimer() { clearInterval(timerInterval); seconds = 0; if (timerDisplay) { timerDisplay.textContent = '00:00'; } if (mobileTimerDisplay) { mobileTimerDisplay.textContent = '00:00'; } }
        function togglePause() { isPaused = !isPaused; const currentGridContainer = document.getElementById('grid-container'); const currentPauseScreen = document.getElementById('pause-screen'); const currentPauseBtn = document.getElementById('pause-btn'); if (currentGridContainer && currentPauseScreen && currentPauseBtn) { if (isPaused) { currentGridContainer.classList.add('game-is-paused'); currentPauseScreen.style.display = 'flex'; currentPauseBtn.innerHTML = '▶'; } else { currentGridContainer.classList.remove('game-is-paused'); currentPauseScreen.style.display = 'none'; currentPauseBtn.innerHTML = '❚❚'; } } }
        function handleDailyWinAesthetics() { isGameFinished = true; document.body.classList.add('daily-solved'); document.querySelectorAll('.cell').forEach(cell => { cell.innerHTML = ''; }); const cageOverlay = document.getElementById('cage-overlay'); if (cageOverlay) { cageOverlay.style.display = 'none'; } const winOverlay = document.getElementById('daily-win-overlay'); const winText = document.getElementById('daily-win-text'); const winTime = document.getElementById('daily-win-time'); if(winOverlay && winText && winTime) { winText.textContent = 'Well done! See you tomorrow for a new challenge!'; winTime.textContent = `Your time: ${formatTime(seconds)}`; setTimeout(() => { winOverlay.classList.add('show'); }, 100); } if (newGameBtn) { newGameBtn.textContent = 'Completed!'; newGameBtn.disabled = true; } if (newGameBtnBottom) { newGameBtnBottom.textContent = 'Come back tomorrow!'; newGameBtnBottom.disabled = true; } if (winNewGameBtn) { winNewGameBtn.textContent = 'See you tomorrow!'; winNewGameBtn.style.display = 'block'; winNewGameBtn.onclick = () => { history.back(); }; } }

        // --- Initialize Game ---
        initGame();
    }
});