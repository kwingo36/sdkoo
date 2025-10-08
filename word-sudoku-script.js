// --- Word Sudoku - Full Integrated Script (FINAL VERSION) ---
document.addEventListener('DOMContentLoaded', () => {


// ==========================================================
// ===== دالة لنسخ روابط اللغات من قائمة الحاسوب إلى قائمة الهاتف =====
// ==========================================================
function populateMobileLanguageMenu() {
    
    // 1. نجد قائمة اللغات الأصلية (للحاسوب)
    const desktopLangLinks = document.querySelectorAll('.lang-dropdown a');
    
    // 2. نجد المكان الفارغ في قائمة الهاتف (الذي أضفته في HTML)
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

       // --- START: Dropdown Language Menu Logic ---
const langBtn = document.querySelector('.lang-btn');
const langDropdown = document.querySelector('.lang-dropdown');

if (langBtn && langDropdown) {
    langBtn.addEventListener('click', (event) => {
        event.stopPropagation();
        langDropdown.classList.toggle('show');
    });

    window.addEventListener('click', () => {
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

    // --- 1. UNIVERSAL LOGIC ---
    const notificationBar = document.getElementById('notification-bar');
    const settingsBtn = document.getElementById('settings-btn');
    const statsBtn = document.getElementById('stats-btn');
    const settingsModal = document.getElementById('settings-modal');
    const statsModal = document.getElementById('stats-modal');
    const winModal = document.getElementById('win-modal');
    const confirmModal = document.getElementById('confirm-modal');
    const allModals = document.querySelectorAll('.modal');
    const closeModalBtns = document.querySelectorAll('.close-btn');
    const themeSelect = document.getElementById('theme-select');
    const highlightDuplicatesToggle = document.getElementById('highlight-duplicates-toggle');
    const highlightSameToggle = document.getElementById('highlight-same-toggle');
    const timerToggle = document.getElementById('timer-toggle');
    const autoRemoveNotesToggle = document.getElementById('auto-remove-notes-toggle');
    const soundToggle = document.getElementById('sound-toggle');
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const closeMenuBtn = document.getElementById('close-menu-btn');
    const mobileStatsBtn = document.getElementById('mobile-stats-btn');
    const mobileSettingsBtn = document.getElementById('mobile-settings-btn');
    const mobileThemeSwitcher = document.getElementById('mobile-theme-switcher'); // Added theme switcher

    let stats = {};
    let confirmCallback = null;
    let isMenuOpen = false;

    function openModal(modal) { if(modal) modal.style.display = 'flex'; }
    function closeModal(modal) { if(modal) modal.style.display = 'none'; }
    
    function playSound(soundId) { if (!soundToggle.checked) return; const sound = document.getElementById(soundId); if (sound) { sound.currentTime = 0; sound.play().catch(e => {}); } }
    function showNotification(message, type = 'success') { notificationBar.textContent = message; notificationBar.className = type; notificationBar.style.top = '20px'; setTimeout(() => { notificationBar.style.top = '-100px'; }, 3000); }
    function showConfirmation(title, text, callback) { document.getElementById('confirm-title').textContent = title; document.getElementById('confirm-text').textContent = text; confirmCallback = callback; openModal(confirmModal); }
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
    function initStats() { stats = { 'word-easy': { bestTime: null, gamesWon: 0 }, 'word-medium': { bestTime: null, gamesWon: 0 }, 'word-hard': { bestTime: null, gamesWon: 0 }, 'word-expert': { bestTime: null, gamesWon: 0 }, 'word-master': { bestTime: null, gamesWon: 0 } }; }
    function loadStats() { stats = JSON.parse(localStorage.getItem('sudokuStats')) || {}; if (!stats['word-easy']) { initStats(); } }
    function saveStats() { localStorage.setItem('sudokuStats', JSON.stringify(stats)); }
    function updateStatsDisplay() {
        const container = document.getElementById('stats-container');
        if (!container) return;
        container.innerHTML = '<h3>Word Sudoku</h3>';
        ['word-easy', 'word-medium', 'word-hard', 'word-expert', 'word-master'].forEach(diff => {
            if (stats[diff]) {
                const time = stats[diff].bestTime ? new Date(stats[diff].bestTime * 1000).toISOString().substr(14, 5) : 'N/A';
                const statEl = document.createElement('div');
                statEl.classList.add('stat-item');
                statEl.innerHTML = `<span class="stat-diff">${diff.replace('word-', '')}</span><span class="stat-wins">Wins: ${stats[diff].gamesWon}</span><span class="stat-time">Best: ${time}</span>`;
                container.appendChild(statEl);
            }
        });
    }
    function openMobileMenu() { if (isMenuOpen) return; isMenuOpen = true; hamburgerBtn.classList.add('active'); mobileMenu.classList.add('active'); }
    function closeMobileMenu() { if (!isMenuOpen) return; isMenuOpen = false; hamburgerBtn.classList.remove('active'); mobileMenu.classList.remove('active'); }
    
    statsBtn.addEventListener('click', () => { playSound('click-sound'); updateStatsDisplay(); openModal(statsModal); });
    settingsBtn.addEventListener('click', () => { playSound('click-sound'); openModal(settingsModal); });
    closeModalBtns.forEach(btn => btn.addEventListener('click', () => closeModal(btn.closest('.modal'))));
    document.getElementById('win-new-game-btn').addEventListener('click', () => { playSound('click-sound'); closeModal(winModal); startNewGame(difficultySelector.value); });
    document.getElementById('confirm-ok-btn').addEventListener('click', () => { playSound('click-sound'); if (confirmCallback) confirmCallback(); closeModal(confirmModal); });
    document.getElementById('confirm-cancel-btn').addEventListener('click', () => { playSound('click-sound'); closeModal(confirmModal); });
    window.addEventListener('click', (e) => { if (e.target.classList.contains('modal')) closeModal(e.target); });
    
    themeSelect.addEventListener('change', (e) => { playSound('click-sound'); document.body.className = e.target.value; saveSettings(); });
    [highlightDuplicatesToggle, highlightSameToggle, timerToggle, autoRemoveNotesToggle, soundToggle].forEach(toggle => toggle.addEventListener('change', () => { playSound('click-sound'); saveSettings(); }));
    document.getElementById('reset-stats-btn').addEventListener('click', () => { playSound('click-sound'); showConfirmation("Reset statistics?", "This cannot be undone.", () => { initStats(); saveStats(); updateStatsDisplay(); showNotification("Statistics reset.", "success"); }); });
    
    // --- Hamburger Menu & Theme Switcher Logic ---
    hamburgerBtn.addEventListener('click', (e) => { e.stopPropagation(); isMenuOpen ? closeMobileMenu() : openMobileMenu(); });
    closeMenuBtn.addEventListener('click', closeMobileMenu);
    mobileStatsBtn.addEventListener('click', () => { playSound('click-sound'); updateStatsDisplay(); openModal(statsModal); closeMobileMenu(); });
    mobileSettingsBtn.addEventListener('click', () => { playSound('click-sound'); openModal(settingsModal); closeMobileMenu(); });
    mobileMenu.addEventListener('click', (e) => { e.stopPropagation(); });
    document.addEventListener('click', () => { if (isMenuOpen) closeMobileMenu(); });
    if (mobileThemeSwitcher) {
        mobileThemeSwitcher.addEventListener('click', () => {
            playSound('click-sound');
            const newTheme = (document.body.className.includes('light') || document.body.className.includes('paper')) ? 'theme-dark' : 'theme-light';
            document.body.className = newTheme;
            themeSelect.value = newTheme;
            saveSettings();
        });
    }

    loadSettings();
    loadStats();
    updateLanguageSelectorDisplay(); // <--- أضف هذا السطر هنا
    populateMobileLanguageMenu(); // <--- أضف هذا السطر هنا

    // --- 2. WORD SUDOKU - GAME LOGIC ---
    const grid = document.getElementById('sudoku-grid');
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
    
    const CHARS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'];
    const CHAR_TO_NUM = Object.fromEntries(CHARS.map((char, i) => [char, i + 1]));
    const NUM_TO_CHAR = Object.fromEntries(CHARS.map((char, i) => [i + 1, char]));

    let board = [], solution = [], userBoard = [], notes = {};
    let historyStack = [], selectedCell = null, isPencilMode = false;
    let timerInterval, seconds = 0, isGameFinished = false, currentDifficulty = 'word-medium';
    
    function isValid(board, row, col, num) { for (let i = 0; i < 9; i++) { if (board[row][i] === num || board[i][col] === num) return false; const boxRow = 3 * Math.floor(row / 3) + Math.floor(i / 3); const boxCol = 3 * Math.floor(col / 3) + i % 3; if (board[boxRow][boxCol] === num) return false; } return true; }
    function solve(board) { for (let i = 0; i < 81; i++) { const row = Math.floor(i / 9), col = i % 9; if (board[row][col] === 0) { const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9].sort(() => Math.random() - 0.5); for (const num of numbers) { if (isValid(board, row, col, num)) { board[row][col] = num; if (solve(board)) return true; board[row][col] = 0; } } return false; } } return true; }
    function generatePuzzle(difficulty) { const solvedBoard = Array(9).fill(0).map(() => Array(9).fill(0)); solve(solvedBoard); solution = JSON.parse(JSON.stringify(solvedBoard)); const puzzle = JSON.parse(JSON.stringify(solution)); const difficulties = { 'word-easy': 35, 'word-medium': 45, 'word-hard': 53, 'word-expert': 58, 'word-master': 62 }; let holes = difficulties[difficulty] || 45; while (holes > 0) { const row = Math.floor(Math.random() * 9); const col = Math.floor(Math.random() * 9); if (puzzle[row][col] !== 0) { puzzle[row][col] = 0; holes--; } } return puzzle; }

    function startNewGame(difficulty) { isGameFinished = false; currentDifficulty = difficulty; board = generatePuzzle(difficulty); userBoard = JSON.parse(JSON.stringify(board)); notes = {}; historyStack = []; seconds = 0; createGrid(); resetTimer(); startTimer(); }
    
    function createGrid() {
        grid.innerHTML = '';
        for (let i = 0; i < 81; i++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.index = i;
            const row = Math.floor(i / 9), col = i % 9;
            const numValue = board[row][col];
            if (numValue !== 0) {
                cell.textContent = NUM_TO_CHAR[numValue];
                cell.classList.add('fixed');
            } else {
                cell.innerHTML = `<div class="notes-grid"></div>`;
            }
            grid.appendChild(cell);
        }
    }

    function updateNotesDisplayForCell(index) {
        const cell = grid.querySelector(`[data-index='${index}']`);
        if (!cell || cell.classList.contains('fixed')) return;
        const notesGrid = cell.querySelector('.notes-grid');
        if (!notesGrid) return;
        notesGrid.innerHTML = '';
        const cellNotes = notes[index] || [];
        if (cellNotes.length === 0) return;
        for (let i = 1; i <= 9; i++) {
            const noteCell = document.createElement('div');
            noteCell.classList.add('note-cell');
            if (cellNotes.includes(i)) noteCell.textContent = NUM_TO_CHAR[i];
            notesGrid.appendChild(noteCell);
        }
    }

    function handleInput(char) {
        if (!selectedCell || selectedCell.classList.contains('fixed') || isGameFinished) return;
        const index = parseInt(selectedCell.dataset.index);
        const row = Math.floor(index / 9), col = index % 9;
        historyStack.push({ index, prevValue: userBoard[row][col], prevNotes: JSON.parse(JSON.stringify(notes)) });
        const numValue = char ? CHAR_TO_NUM[char] : 0;
        if (isPencilMode) {
            playSound('click-sound');
            if (userBoard[row][col] !== 0) return;
            notes[index] = notes[index] || [];
            const notePos = notes[index].indexOf(numValue);
            if (notePos > -1) notes[index].splice(notePos, 1);
            else notes[index].push(numValue);
            updateNotesDisplayForCell(index);
        } else {
            playSound(numValue === 0 ? 'click-sound' : 'place-sound');
            userBoard[row][col] = numValue;
            delete notes[index];
            const cell = grid.querySelector(`[data-index='${index}']`);
            cell.innerHTML = numValue === 0 ? `<div class="notes-grid"></div>` : '';
            cell.textContent = numValue !== 0 ? NUM_TO_CHAR[numValue] : '';
            cell.classList.toggle('user-input', numValue !== 0);
            if(numValue !== 0) checkForWin();
        }
        highlightRelevantCells(selectedCell);
    }
    
    function selectCell(cell) {
        if (selectedCell) selectedCell.classList.remove('selected');
        selectedCell = cell;
        if (selectedCell) {
            selectedCell.classList.add('selected');
            highlightRelevantCells(cell);
        } else {
             document.querySelectorAll('.cell').forEach(c => c.classList.remove('highlighted', 'highlight-number', 'error'));
        }
    }

    function highlightRelevantCells(cell) {
        document.querySelectorAll('.cell').forEach(c => c.classList.remove('highlighted', 'highlight-number', 'error'));
        if (!cell) return;
        const index = parseInt(cell.dataset.index), row = Math.floor(index / 9), col = index % 9;
        for (let i = 0; i < 9; i++) { grid.querySelector(`[data-index='${row * 9 + i}']`)?.classList.add('highlighted'); grid.querySelector(`[data-index='${i * 9 + col}']`)?.classList.add('highlighted'); }
        const startRow = row - row % 3, startCol = col - col % 3;
        for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) grid.querySelector(`[data-index='${(startRow + i) * 9 + (startCol + j)}']`)?.classList.add('highlighted');
        const cellValue = userBoard[row][col] || CHAR_TO_NUM[cell.textContent];
        if (cellValue !== 0 && highlightSameToggle.checked) { for(let i=0; i<81; i++) { const val = userBoard[Math.floor(i/9)][i%9] || CHAR_TO_NUM[grid.querySelector(`[data-index='${i}']`).textContent]; if(val === cellValue) { grid.querySelector(`[data-index='${i}']`).classList.add('highlight-number'); } } }
        cell.classList.add('selected');
    }

    function checkForWin() {
        for (let r = 0; r < 9; r++) for (let c = 0; c < 9; c++) if (userBoard[r][c] !== solution[r][c]) return false;
        isGameFinished = true; clearInterval(timerInterval); playSound('win-sound');
        if (typeof confetti === 'function') confetti({ particleCount: 150, spread: 90, origin: { y: .6 }});
        const diffStats = stats[currentDifficulty];
        if(diffStats) { diffStats.gamesWon = (diffStats.gamesWon || 0) + 1; document.getElementById('best-time-msg').textContent = ''; if (diffStats.bestTime === null || seconds < diffStats.bestTime) { diffStats.bestTime = seconds; document.getElementById('best-time-msg').textContent = 'New best time!'; } saveStats(); }
        document.getElementById('win-difficulty').textContent = currentDifficulty.replace('word-', ''); document.getElementById('win-time').textContent = formatTime(seconds);
        openModal(winModal);
        return true;
    }

    function formatTime(s) { const m = Math.floor(s/60).toString().padStart(2, '0'); const sec = (s%60).toString().padStart(2, '0'); return `${m}:${sec}`; }
    function startTimer() { if (timerInterval) clearInterval(timerInterval); timerInterval = setInterval(() => { if (!isGameFinished) { seconds++; const timeStr = formatTime(seconds); timerElement.textContent = timeStr; if(document.getElementById('mobile-timer-display')) document.getElementById('mobile-timer-display').textContent = timeStr; } }, 1000); }
    function resetTimer() { clearInterval(timerInterval); seconds = 0; timerElement.textContent = '00:00'; if(document.getElementById('mobile-timer-display')) document.getElementById('mobile-timer-display').textContent = '00:00'; }

    grid.addEventListener('click', (e) => { const cell = e.target.closest('.cell'); if (cell) { playSound('click-sound'); selectCell(cell); } });
    numberPad.addEventListener('click', (e) => { if (e.target.classList.contains('num-btn')) { handleInput(e.target.textContent); } else if (e.target.id === 'erase-btn') { handleInput(null); } });
    pencilBtn.addEventListener('click', () => { playSound('click-sound'); isPencilMode = !isPencilMode; pencilBtn.classList.toggle('active', isPencilMode); });
    
    undoBtn.addEventListener('click', () => {
        playSound('click-sound');
        if (historyStack.length > 0) {
            const last = historyStack.pop();
            const { index, prevValue, prevNotes } = last;
            const row = Math.floor(index / 9), col = index % 9;
            userBoard[row][col] = prevValue;
            notes = prevNotes;
            const cell = grid.querySelector(`[data-index='${index}']`);
            cell.classList.remove('user-input', 'error');
            if (prevValue !== 0) {
                cell.innerHTML = '';
                cell.textContent = NUM_TO_CHAR[prevValue];
                cell.classList.add('user-input');
            } else {
                cell.textContent = '';
                cell.innerHTML = `<div class="notes-grid"></div>`;
                Object.keys(notes).forEach(noteIndex => updateNotesDisplayForCell(noteIndex));
            }
            selectCell(cell);
        }
    });

    hintBtn.addEventListener('click', () => { playSound('click-sound'); if(isGameFinished) return; const emptyCells = []; for(let i=0; i<81; i++) if(userBoard[Math.floor(i/9)][i%9] === 0) emptyCells.push(i); if(emptyCells.length > 0) { const index = emptyCells[Math.floor(Math.random() * emptyCells.length)]; const r = Math.floor(index/9), c = index%9; selectCell(grid.querySelector(`[data-index='${index}']`)); handleInput(NUM_TO_CHAR[solution[r][c]]); } });
    checkBtn.addEventListener('click', () => { playSound('click-sound'); let mistakes = 0; document.querySelectorAll('.cell.user-input').forEach(cell => { const index = parseInt(cell.dataset.index), r = Math.floor(index/9), c = index%9; if(userBoard[r][c] !== solution[r][c]) { cell.classList.add('error'); mistakes++; } }); if(mistakes > 0) { showNotification(`${mistakes} mistakes found!`, 'error'); setTimeout(() => document.querySelectorAll('.cell.error').forEach(c => c.classList.remove('error')), 2000); } else { showNotification('No mistakes found!', 'success'); } });
    
    function animateSolution() {
        const emptyCellsIndices = [];
        for (let i = 0; i < 81; i++) {
            const r = Math.floor(i / 9), c = i % 9;
            if (userBoard[r][c] === 0) emptyCellsIndices.push(i);
        }
        let delay = 0, interval = 25;
        emptyCellsIndices.forEach(index => {
            setTimeout(() => {
                const r = Math.floor(index / 9), c = index % 9;
                const solutionValue = solution[r][c];
                userBoard[r][c] = solutionValue;
                const cell = grid.querySelector(`[data-index='${index}']`);
                if (cell) {
                    cell.innerHTML = '';
                    cell.textContent = NUM_TO_CHAR[solutionValue];
                    cell.classList.remove('user-input', 'error');
                    cell.classList.add('solved-by-ai');
                    playSound('place-sound');
                }
            }, delay);
            delay += interval;
        });
    }

    solveBtn.addEventListener('click', () => { playSound('click-sound'); showConfirmation('Reveal Solution?', 'This will end the game and reveal all correct letters.', () => { isGameFinished = true; clearInterval(timerInterval); animateSolution(); }); });

    const newGameAction = () => { playSound('click-sound'); showConfirmation('New Game?', 'Your current progress will be lost.', () => { startNewGame(difficultySelector.value); }); };
    newGameBtn.addEventListener('click', newGameAction);
    newGameBtnBottom.addEventListener('click', newGameAction);

    difficultySelector.addEventListener('change', () => {
        const selectedValue = difficultySelector.value;
        const difficultyName = selectedValue.replace('word-', '');
        let targetFile = `${difficultyName}-word-sudoku.html`;
        if (difficultyName === 'medium') targetFile = 'word-sudoku.html'; // Special case for medium
        if (!window.location.pathname.endsWith(targetFile)) {
            window.location.href = targetFile;
        }
    });
    
    startNewGame(difficultySelector.value);
});