// --- Sudoku X: Full generator + integration (single-file) ---
// --- VERSION 2.1: Corrected and complete ---
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

// -----------------------
  // 1) Universal DOM helpers & Settings (Reused from existing project)
  // -----------------------
  const settingsModal = document.getElementById('settings-modal');
  const winModal = document.getElementById('win-modal');
  const confirmModal = document.getElementById('confirm-modal');
  const statsModal = document.getElementById('stats-modal');
  const themeSelect = document.getElementById('theme-select');
  const soundToggle = document.getElementById('sound-toggle');
  const highlightDuplicatesToggle = document.getElementById('highlight-duplicates-toggle');
  const highlightSameToggle = document.getElementById('highlight-same-toggle');
  const notificationBar = document.getElementById('notification-bar');
  // START: ADDED CODE
  const mobileThemeSwitcher = document.getElementById('mobile-theme-switcher');
  // END: ADDED CODE
  let confirmCallback = null;
  let stats = {};

  function playSound(soundId) { if (soundToggle && soundToggle.checked) { const sound = document.getElementById(soundId); if (sound) { sound.currentTime = 0; sound.play().catch(() => {}); } } }
  function showNotification(message, type = 'success') { if (!notificationBar) return; notificationBar.textContent = message; notificationBar.className = type; notificationBar.style.top = '10px'; setTimeout(() => { notificationBar.style.top = '-50px'; }, 3000); }
  function showConfirmation(title, text, callback) { const t = document.getElementById('confirm-title'), x = document.getElementById('confirm-text'); if (t) t.textContent = title; if (x) x.textContent = text; confirmCallback = callback; if (confirmModal) confirmModal.style.display = 'flex'; location.hash = 'modal'; }
  function saveSettings() { localStorage.setItem('sudokuSettings', JSON.stringify({ theme: themeSelect?.value || 'theme-light', sound: !!(soundToggle && soundToggle.checked), highlightDuplicates: !!(highlightDuplicatesToggle && highlightDuplicatesToggle.checked), highlightSame: !!(highlightSameToggle && highlightSameToggle.checked) })); }
  function loadSettings() { const s = JSON.parse(localStorage.getItem('sudokuSettings') || '{}'); document.body.className = s.theme || 'theme-light'; if (themeSelect) themeSelect.value = s.theme || 'theme-light'; if (soundToggle) soundToggle.checked = s.sound !== false; if (highlightDuplicatesToggle) highlightDuplicatesToggle.checked = s.highlightDuplicates !== false; if (highlightSameToggle) highlightSameToggle.checked = s.highlightSame !== false; }
  function loadStats() { stats = JSON.parse(localStorage.getItem('sudokuStats') || '{}'); }
  function saveStats() { localStorage.setItem('sudokuStats', JSON.stringify(stats)); }
  function initStatsIfNeeded() { const keys = ['sudoku-x-easy','sudoku-x-medium','sudoku-x-hard','sudoku-x-expert', 'sudoku-x-master']; keys.forEach(k => { if (!stats[k]) stats[k] = { bestTime: null, gamesWon: 0 }; }); }
  function updateStatsDisplay() { const container = document.getElementById('stats-container'); if (!container) return; container.innerHTML = ''; const statGroups = { "Sudoku X": ['sudoku-x-easy','sudoku-x-medium','sudoku-x-hard','sudoku-x-expert', 'sudoku-x-master'] }; for (const groupName in statGroups) { const h3 = document.createElement('h3'); h3.textContent = groupName; container.appendChild(h3); statGroups[groupName].forEach(diff => { if (stats[diff]) { const time = stats[diff].bestTime ? new Date(stats[diff].bestTime * 1000).toISOString().substr(14,5) : 'N/A'; const el = document.createElement('div'); el.className = 'stat-item'; el.innerHTML = `<span class="stat-diff">${diff.replace('sudoku-x-','')}</span><span class="stat-wins">Wins: ${stats[diff].gamesWon}</span><span class="stat-time">Best: ${time}</span>`; container.appendChild(el); } }); } }
  
  function initUniversalListeners() {
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const closeMenuBtn = document.getElementById('close-menu-btn');
    let isMenuOpen = false;

    function toggleMobileMenu() {
      if (!hamburgerBtn || !mobileMenu) return;
      isMenuOpen = !isMenuOpen;
      hamburgerBtn.classList.toggle('active', isMenuOpen);
      mobileMenu.classList.toggle('active', isMenuOpen);
    }
    
    if (hamburgerBtn) { hamburgerBtn.addEventListener('click', e => { e.stopPropagation(); toggleMobileMenu(); }); }
    if (closeMenuBtn) { closeMenuBtn.addEventListener('click', toggleMobileMenu); }
    if (mobileMenu) { mobileMenu.addEventListener('click', e => e.stopPropagation()); }
    document.addEventListener('click', () => { if (isMenuOpen) { toggleMobileMenu(); } });
    
    const openSettingsAction = () => {
      playSound('click-sound');
      if (settingsModal) settingsModal.style.display = 'flex';
      location.hash = '#modal';
      if (isMenuOpen) toggleMobileMenu();
    };
    const openStatsAction = () => {
      playSound('click-sound');
      updateStatsDisplay();
      if (statsModal) statsModal.style.display = 'flex';
      location.hash = '#modal';
      if (isMenuOpen) toggleMobileMenu();
    };

    document.getElementById('settings-btn')?.addEventListener('click', openSettingsAction);
    document.getElementById('stats-btn')?.addEventListener('click', openStatsAction);
    document.getElementById('mobile-settings-btn')?.addEventListener('click', openSettingsAction);
    document.getElementById('mobile-stats-btn')?.addEventListener('click', openStatsAction);

    // START: ADDED CODE
    if (mobileThemeSwitcher) {
        mobileThemeSwitcher.addEventListener('click', () => {
            playSound('click-sound');
            let newTheme;
            const currentTheme = document.body.className;
            if (currentTheme.includes('theme-light') || currentTheme.includes('theme-paper')) {
                newTheme = 'theme-dark';
            } else {
                newTheme = 'theme-light';
            }
            document.body.className = newTheme;
            if (themeSelect) themeSelect.value = newTheme;
            saveSettings();
        });
    }
    // END: ADDED CODE

    document.querySelectorAll('.close-btn').forEach(e => e.addEventListener('click', () => history.back()));
    window.addEventListener('click', e => { if (e.target?.classList.contains('modal')) history.back(); });
    window.addEventListener('hashchange', () => { if (location.hash !== '#modal') { document.querySelectorAll('.modal').forEach(m => m.style.display = 'none'); if (isMenuOpen) toggleMobileMenu(); } });
    if (themeSelect) themeSelect.addEventListener('change', () => { document.body.className = themeSelect.value; saveSettings(); });
    [soundToggle, highlightDuplicatesToggle, highlightSameToggle].forEach(e => { if (e) e.addEventListener('change', () => { saveSettings(); if(typeof highlightRelevantCells === 'function' && typeof selectedCell !== 'undefined') highlightRelevantCells(selectedCell); }); });
    const confirmOk = document.getElementById('confirm-ok-btn'); if (confirmOk) confirmOk.addEventListener('click', () => { playSound('click-sound'); if(confirmCallback) confirmCallback(); history.back(); });
    const confirmCancel = document.getElementById('confirm-cancel-btn'); if (confirmCancel) confirmCancel.addEventListener('click', () => { playSound('click-sound'); history.back(); });
  }
  
  // -----------------------
  // 2) Sudoku X specific state
  // -----------------------
  const difficultySelector = document.getElementById('difficulty');
  const gridContainer = document.getElementById('sudoku-x-grid-container');
  const pencilBtn = document.getElementById('pencil-btn');
  const timerElement = document.getElementById('timer');
  const mobileTimerDisplay = document.getElementById('mobile-timer-display');

  let board = [], solution = [], userBoard = [], notes = [], historyStack = [], selectedCell = null, isPencilMode = false, timerInterval = null, seconds = 0, isGameFinished = false, currentDifficulty = 'sudoku-x-medium';
  const SIZE = 9;

  // -----------------------
  // 3) Sudoku X Solver & Generator
  // -----------------------
  function deepCopy(grid) { return grid.map(row => row.slice()); }
  function shuffle(array) { for (let i = array.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [array[i], array[j]] = [array[j], array[i]]; } return array; }

  function isSafe(grid, row, col, num) {
      for (let x = 0; x < SIZE; x++) if (grid[row][x] === num || grid[x][col] === num) return false;
      const startRow = row - row % 3, startCol = col - col % 3;
      for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) if (grid[i + startRow][j + startCol] === num) return false;
      if (row === col) for (let i = 0; i < SIZE; i++) if (i !== row && grid[i][i] === num) return false;
      if (row + col === SIZE - 1) for (let i = 0; i < SIZE; i++) if (i !== row && grid[i][SIZE - 1 - i] === num) return false;
      return true;
  }
  
  function solveSudoku(grid) {
      for (let row = 0; row < SIZE; row++) {
          for (let col = 0; col < SIZE; col++) {
              if (grid[row][col] === 0) {
                  const numbers = shuffle([1,2,3,4,5,6,7,8,9]);
                  for (let num of numbers) {
                      if (isSafe(grid, row, col, num)) {
                          grid[row][col] = num;
                          if (solveSudoku(grid)) return true;
                          grid[row][col] = 0;
                      }
                  }
                  return false;
              }
          }
      }
      return true;
  }

  function generateSolution() {
      let grid = Array.from({ length: SIZE }, () => Array(SIZE).fill(0));
      solveSudoku(grid);
      return grid;
  }
  
  // -----------------------
  // 4) Puzzle Creation
  // -----------------------
  const difficultySettings = { 
      'sudoku-x-easy': 36, 
      'sudoku-x-medium': 32, 
      'sudoku-x-hard': 28, 
      'sudoku-x-expert': 24,
      'sudoku-x-master': 22 
  };

  function generatePuzzle(solvedGrid, difficultyKey) {
      const puzzle = deepCopy(solvedGrid);
      let cells = Array.from({length: 81}, (_, i) => i);
      shuffle(cells);

      let cellsToRemove = 81 - (difficultySettings[difficultyKey] || 32);
      
      for(let i = 0; i < cellsToRemove; i++){
          const index = cells[i];
          const r = Math.floor(index / 9);
          const c = index % 9;
          puzzle[r][c] = 0;
      }
      return puzzle;
  }

  // -----------------------
  // 5) UI: Grid Creation & Interactions
  // -----------------------
  function createGridDOM() {
      if (!gridContainer) return;
      gridContainer.innerHTML = '';
      const grid = document.createElement('div');
      grid.className = 'sudoku-grid';

      for (let i = 0; i < 81; i++) {
          const cell = document.createElement('div');
          const r = Math.floor(i/9), c = i % 9;
          cell.className = 'cell';
          cell.dataset.index = i;
          if (r === c || r + c === 8) cell.classList.add('diagonal-cell');
          const val = board[r][c];
          if (val !== 0) { cell.textContent = val; cell.classList.add('fixed'); } 
          else {
              const notesHtml = Array.from({length:9}, (_,t) => `<div class="note-cell" data-note="${t+1}"></div>`).join('');
              cell.innerHTML = `<div class="notes-grid">${notesHtml}</div>`;
          }
          grid.appendChild(cell);
      }
      gridContainer.appendChild(grid);
  }

  function updateCellDOM(index) {
      const cell = document.querySelector(`[data-index='${index}']`);
      if (!cell) return;
      const row = Math.floor(index/9), col = index % 9;
      const fixedValue = board[row][col];
      const userValue = userBoard[row][col];
      const cellNotes = notes[index] || [];
      cell.textContent = '';
      cell.classList.remove('fixed','user-input', 'error');
      if (fixedValue !== 0) { cell.textContent = fixedValue; cell.classList.add('fixed'); } 
      else if (userValue !== 0) { cell.textContent = userValue; cell.classList.add('user-input'); } 
      else {
          if (!cell.querySelector('.notes-grid')) {
              const notesHtml = Array.from({length:9}, (_,t) => `<div class="note-cell" data-note="${t+1}"></div>`).join('');
              cell.innerHTML = `<div class="notes-grid">${notesHtml}</div>`;
          }
          const notesGrid = cell.querySelector('.notes-grid');
          notesGrid.querySelectorAll('.note-cell').forEach(nc => nc.textContent = '');
          if (Array.isArray(cellNotes) && cellNotes.length > 0) cellNotes.forEach(n => { const nEl = notesGrid.querySelector(`[data-note='${n}']`); if (nEl) nEl.textContent = n; });
      }
  }

  function handleInput(num) {
      if (isGameFinished || !selectedCell || selectedCell.classList.contains('fixed')) return;
      const i = parseInt(selectedCell.dataset.index);
      const r = Math.floor(i/9), c = i%9;
      const prevVal = userBoard[r][c];
      const prevNotes = [...(notes[i] || [])];
      historyStack.push({ index: i, value: prevVal, notes: prevNotes, pencilMode: isPencilMode });

      if (isPencilMode) {
          if (userBoard[r][c] !== 0) return;
          playSound('click-sound');
          const currentNotes = notes[i] || [];
          const pos = currentNotes.indexOf(num);
          if (num === 0) currentNotes.length = 0;
          else if (pos > -1) currentNotes.splice(pos,1);
          else { currentNotes.push(num); currentNotes.sort((a,b) => a-b); }
          notes[i] = currentNotes;
          userBoard[r][c] = 0;
      } else {
          playSound(num === 0 ? 'click-sound' : 'place-sound');
          userBoard[r][c] = num;
          notes[i] = [];
      }
      updateCellDOM(i);
      highlightRelevantCells(selectedCell);
      if (!isPencilMode && num !== 0) checkForWin();
  }

  function undoLastMove() {
      if (!historyStack.length) return;
      const last = historyStack.pop();
      isPencilMode = last.pencilMode;
      if (pencilBtn) pencilBtn.classList.toggle('active', isPencilMode);
      const { index, value, notes: newNotes } = last;
      const r = Math.floor(index/9), c = index%9;
      userBoard[r][c] = value;
      notes[index] = newNotes;
      updateCellDOM(index);
      const sel = document.querySelector(`[data-index='${index}']`);
      if (sel) selectCell(sel);
  }

  function selectCell(cell) {
      if (!cell) return;
      if (selectedCell) selectedCell.classList.remove('selected');
      selectedCell = cell;
      selectedCell.classList.add('selected');
      highlightRelevantCells(cell);
  }

  function highlightRelevantCells(cell) {
      document.querySelectorAll('.cell').forEach(c => c.classList.remove('highlighted','highlight-number'));
      if (!cell) return;
      const i = parseInt(cell.dataset.index), r = Math.floor(i/9), c = i%9;
      for (let n = 0; n < SIZE; n++) {
          document.querySelector(`[data-index='${r*9 + n}']`)?.classList.add('highlighted');
          document.querySelector(`[data-index='${n*9 + c}']`)?.classList.add('highlighted');
      }
      const sr = r - r%3, sc = c - c%3;
      for (let n = 0; n < 3; n++) for (let t = 0; t < 3; t++) document.querySelector(`[data-index='${(sr+n)*9 + sc + t}']`)?.classList.add('highlighted');
      if (r === c) for (let n = 0; n < SIZE; n++) document.querySelector(`[data-index='${n*9 + n}']`)?.classList.add('highlighted');
      if (r + c === 8) for (let n = 0; n < SIZE; n++) document.querySelector(`[data-index='${n*9 + (8-n)}']`)?.classList.add('highlighted');
      
      const val = userBoard[r][c] || board[r][c];
      if (val !== 0 && highlightSameToggle && highlightSameToggle.checked) {
          document.querySelectorAll('.cell').forEach(e => {
              const ti = parseInt(e.dataset.index), tr = Math.floor(ti/9), tc = ti%9;
              if ((userBoard[tr][tc] || board[tr][tc]) === val) e.classList.add('highlight-number');
          });
      }
      cell.classList.add('selected');
  }

  // -----------------------
  // 6) Game Actions & Logic
  // -----------------------
  function giveHint() {
      if (isGameFinished) return;
      const empty = [];
      for (let i = 0; i < 81; i++) {
          const r = Math.floor(i/9), c = i%9;
          if (board[r][c] === 0 && userBoard[r][c] === 0) empty.push({i,r,c});
      }
      if (!empty.length) return showNotification('No empty cells for a hint!','error');
      const pick = empty[Math.floor(Math.random()*empty.length)];
      const correct = solution[pick.r][pick.c];
      const el = document.querySelector(`[data-index='${pick.i}']`);
      if (el) selectCell(el);
      if (isPencilMode) { isPencilMode = false; if (pencilBtn) pencilBtn.classList.remove('active'); }
      handleInput(correct);
  }

  function checkMistakes() {
      if (isGameFinished) return;
      let mistakes = false;
      document.querySelectorAll('.cell.error').forEach(e => e.classList.remove('error'));
      for (let r = 0; r < SIZE; r++) {
          for (let c = 0; c < SIZE; c++) {
              if (board[r][c] === 0 && userBoard[r][c] !== 0) {
                  if (userBoard[r][c] !== solution[r][c]) {
                      mistakes = true;
                      document.querySelector(`[data-index='${r*9+c}']`)?.classList.add('error');
                  }
              }
          }
      }
      if (mistakes) { playSound('error-sound'); showNotification('Mistakes highlighted.','error'); setTimeout(()=>document.querySelectorAll('.cell.error').forEach(e=>e.classList.remove('error')),2000); }
      else showNotification('No mistakes found so far!','success');
  }

  function checkForWin() {
      for (let r = 0; r < SIZE; r++) for (let c = 0; c < SIZE; c++) if ((userBoard[r][c] || board[r][c]) !== solution[r][c]) return false;
      isGameFinished = true;
      if (timerInterval) clearInterval(timerInterval);
      playSound('win-sound');
      if (typeof confetti === 'function') confetti({ particleCount: 150, spread: 90, origin: { y: .6 }});
      const e = currentDifficulty;
      if (stats[e]) { stats[e].gamesWon++; if (stats[e].bestTime === null || seconds < stats[e].bestTime) { stats[e].bestTime = seconds; document.getElementById('best-time-msg').textContent = 'New best time!'; } else { document.getElementById('best-time-msg').textContent = ''; } saveStats(); }
      document.getElementById('win-difficulty').textContent = e.replace('sudoku-x-','');
      document.getElementById('win-time').textContent = formatTime(seconds);
      setTimeout(()=>{ if (winModal) winModal.style.display = 'flex'; location.hash = '#modal'; }, 500);
      return true;
  }

  function formatTime(s) { const m = Math.floor(s/60).toString().padStart(2,'0'); const sec = (s%60).toString().padStart(2,'0'); return `${m}:${sec}`; }
  function startTimer(){ if (timerInterval) clearInterval(timerInterval); timerInterval = setInterval(()=>{ if (!isGameFinished) { seconds++; if (timerElement) timerElement.textContent = formatTime(seconds); if (mobileTimerDisplay) mobileTimerDisplay.textContent = formatTime(seconds); } }, 1000); }
  function resetTimer(){ if (timerInterval) clearInterval(timerInterval); seconds = 0; if (timerElement) timerElement.textContent = '00:00'; if (mobileTimerDisplay) mobileTimerDisplay.textContent = '00:00'; }

  // -----------------------
  // 7) Game Start / Integration
  // -----------------------
  function startNewGame(difficulty = 'sudoku-x-medium') {
      currentDifficulty = difficulty;
      if (difficultySelector) difficultySelector.value = difficulty;
      
      solution = generateSolution();
      board = generatePuzzle(solution, difficulty);
      userBoard = deepCopy(board);
      notes = {};
      historyStack = [];
      seconds = 0;
      isGameFinished = false;
      if (selectedCell) selectedCell.classList.remove('selected');
      selectedCell = null;

      createGridDOM();
      resetTimer();
      startTimer();
  }

  // -----------------------
  // 8) Event Listeners
  // -----------------------
  function initGameListeners() {
      const newGameAction = () => { playSound('click-sound'); showConfirmation('Start a new game?', 'Any progress will be lost.', () => startNewGame(difficultySelector?.value || 'sudoku-x-medium')); };
      document.getElementById('new-game-btn')?.addEventListener('click', newGameAction);
      document.getElementById('new-game-btn-bottom')?.addEventListener('click', newGameAction);
      
      if (difficultySelector) difficultySelector.addEventListener('change', () => {
        const selected = difficultySelector.value;
        const selectedDifficulty = selected.replace('sudoku-x-','');
        const targetFile = selectedDifficulty === 'medium' ? 'sudoku-x.html' : `${selectedDifficulty}-sudoku-x.html`;
        if (!window.location.pathname.includes(targetFile)) {
            window.location.href = targetFile;
        }
      });
      
      gridContainer?.addEventListener('click', e => { const cell = e.target.closest('.cell'); if (cell) { playSound('click-sound'); selectCell(cell); } });
      document.querySelector('.number-pad')?.addEventListener('click', e => { if (e.target.classList.contains('num-btn')) handleInput(parseInt(e.target.textContent)); else if (e.target.id === 'erase-btn') handleInput(0); });
      pencilBtn?.addEventListener('click', () => { playSound('click-sound'); isPencilMode = !isPencilMode; pencilBtn.classList.toggle('active', isPencilMode); });
      document.getElementById('undo-btn')?.addEventListener('click', () => { playSound('click-sound'); undoLastMove(); });
      document.getElementById('hint-btn')?.addEventListener('click', () => { playSound('click-sound'); giveHint(); });
      document.getElementById('check-btn')?.addEventListener('click', () => { playSound('click-sound'); checkMistakes(); });
      
      document.getElementById('solve-btn')?.addEventListener('click', () => { 
          playSound('click-sound'); 
          showConfirmation('Reveal the solution?', 'This will end the game.', () => { 
              userBoard = deepCopy(solution); 
              notes = {}; 
              for (let i = 0; i < 81; i++) {
                  updateCellDOM(i);
              }
              highlightRelevantCells(null); 
              checkForWin();
          }); 
      });

      document.getElementById('win-new-game-btn')?.addEventListener('click', () => { playSound('click-sound'); history.back(); startNewGame(difficultySelector?.value || 'sudoku-x-medium'); });
      
      document.addEventListener('keydown', e => {
          if (!selectedCell || isGameFinished) return;
          if (e.key >= '1' && e.key <= '9') handleInput(parseInt(e.key));
          else if (e.key === 'Backspace' || e.key === 'Delete') handleInput(0);
          else if (e.key.toLowerCase() === 'p') { playSound('click-sound'); isPencilMode = !isPencilMode; if (pencilBtn) pencilBtn.classList.toggle('active', isPencilMode); }
          else if (e.key.startsWith('Arrow')) {
              e.preventDefault();
              let i = parseInt(selectedCell.dataset.index);
              if (e.key === 'ArrowUp' && i > 8) i -= 9;
              else if (e.key === 'ArrowDown' && i < 72) i += 9;
              else if (e.key === 'ArrowLeft' && i % 9 !== 0) i -= 1;
              else if (e.key === 'ArrowRight' && i % 9 !== 8) i += 1;
              const cell = document.querySelector(`[data-index='${i}']`);
              if (cell) { playSound('click-sound'); selectCell(cell); }
          }
      });
  }

  // -----------------------
  // 9) Initialize everything
  // -----------------------
  initUniversalListeners();
  loadSettings();
  loadStats();
  updateLanguageSelectorDisplay(); // <--- أضف هذا السطر هنا
  populateMobileLanguageMenu(); // <--- أضف هذا السطر هنا
  initStatsIfNeeded();
  initGameListeners();
  startNewGame(difficultySelector?.value || 'sudoku-x-medium');
});