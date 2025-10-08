// --- Sandwich Sudoku: Generator + UI Integration (VERSION 3.2 - HAMBURGER MENU FIX) ---
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
  
  // ----------------------------------------------------
  // 1) UNIVERSAL HELPERS
  // ----------------------------------------------------
  const settingsModal = document.getElementById('settings-modal'), winModal = document.getElementById('win-modal'), confirmModal = document.getElementById('confirm-modal'), statsModal = document.getElementById('stats-modal');
  const themeSelect = document.getElementById('theme-select'), soundToggle = document.getElementById('sound-toggle'), highlightDuplicatesToggle = document.getElementById('highlight-duplicates-toggle'), highlightSameToggle = document.getElementById('highlight-same-toggle');
  const notificationBar = document.getElementById('notification-bar');
  
  // ** NEW: Hamburger Menu & Theme Switcher Elements **
  const mobileThemeSwitcher = document.getElementById('mobile-theme-switcher');
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const closeMenuBtn = document.getElementById('close-menu-btn');
  const mobileStatsBtn = document.getElementById('mobile-stats-btn');
  const mobileSettingsBtn = document.getElementById('mobile-settings-btn');

  let confirmCallback = null, stats = {}, isMenuOpen = false;
  
  function playSound(id) { if (soundToggle?.checked) { const sound = document.getElementById(id); if (sound) { sound.currentTime = 0; sound.play().catch(()=>{}); } } }
  function showNotification(msg, type = 'success') { if(notificationBar) { notificationBar.textContent = msg; notificationBar.className = type; notificationBar.style.top = '10px'; setTimeout(() => notificationBar.style.top = '-50px', 3000); } }
  function showConfirmation(title, text, cb) { const t = document.getElementById('confirm-title'), x = document.getElementById('confirm-text'); if(t) t.textContent = title; if(x) x.textContent = text; confirmCallback = cb; if(confirmModal) confirmModal.style.display = 'flex'; location.hash = 'modal'; }
  function saveSettings() { localStorage.setItem('sudokuSettings', JSON.stringify({ theme: themeSelect?.value, sound: soundToggle?.checked, highlightDuplicates: highlightDuplicatesToggle?.checked, highlightSame: highlightSameToggle?.checked })); }
  function loadSettings() { const s = JSON.parse(localStorage.getItem('sudokuSettings') || '{}'); document.body.className = s.theme || 'theme-light'; if(themeSelect) themeSelect.value = s.theme || 'theme-light'; if(soundToggle) soundToggle.checked = s.sound !== false; if(highlightDuplicatesToggle) highlightDuplicatesToggle.checked = s.highlightDuplicates !== false; if(highlightSameToggle) highlightSameToggle.checked = s.highlightSame !== false; }
  function loadStats() { stats = JSON.parse(localStorage.getItem('sudokuStats') || '{}'); }
  function saveStats() { localStorage.setItem('sudokuStats', JSON.stringify(stats)); }
  function initStatsIfNeeded() { const keys = ['sandwich-easy','sandwich-medium','sandwich-hard','sandwich-expert', 'sandwich-master']; keys.forEach(k => { if (!stats[k]) stats[k] = { bestTime: null, gamesWon: 0 }; }); }
  function updateStatsDisplay() { const container = document.getElementById('stats-container'); if (!container) return; container.innerHTML = '<h3>Sandwich Sudoku</h3>'; ['sandwich-easy','sandwich-medium','sandwich-hard','sandwich-expert', 'sandwich-master'].forEach(diff => { if (stats[diff]) { const time = stats[diff].bestTime ? new Date(stats[diff].bestTime * 1000).toISOString().substr(14,5) : 'N/A'; const el = document.createElement('div'); el.className = 'stat-item'; el.innerHTML = `<span class="stat-diff">${diff.replace('sandwich-','')}</span><span class="stat-wins">Wins: ${stats[diff].gamesWon}</span><span class="stat-time">Best: ${time}</span>`; container.appendChild(el); } }); }
  
  function initUniversalListeners() {
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

    // START: THEME SWITCHER LOGIC
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
    // END: THEME SWITCHER LOGIC

    document.querySelectorAll('.close-btn').forEach(e => e.addEventListener('click', () => history.back()));
    window.addEventListener('click', e => { if (e.target?.classList.contains('modal')) history.back(); });
    window.addEventListener('hashchange', () => { if (location.hash !== '#modal') { document.querySelectorAll('.modal').forEach(m => m.style.display = 'none'); if (isMenuOpen) toggleMobileMenu(); } });
    if (themeSelect) themeSelect.addEventListener('change', () => { document.body.className = themeSelect.value; saveSettings(); });
    [soundToggle, highlightDuplicatesToggle, highlightSameToggle].forEach(e => { if (e) e.addEventListener('change', () => { saveSettings(); if(typeof highlightRelevantCells === 'function' && typeof selectedCell !== 'undefined') highlightRelevantCells(selectedCell); }); });
    const confirmOk = document.getElementById('confirm-ok-btn'); if (confirmOk) confirmOk.addEventListener('click', () => { playSound('click-sound'); if(confirmCallback) confirmCallback(); history.back(); });
    const confirmCancel = document.getElementById('confirm-cancel-btn'); if (confirmCancel) confirmCancel.addEventListener('click', () => { playSound('click-sound'); history.back(); });
  }

  // ---------------------------------------
  // 2) SANDWICH SUDOKU - STATE & DOM
  // ---------------------------------------
  const difficultySelector = document.getElementById('difficulty');
  const wrapper = document.getElementById('sandwich-grid-wrapper');
  const pencilBtn = document.getElementById('pencil-btn');
  const timerElement = document.getElementById('timer');
  const mobileTimerDisplay = document.getElementById('mobile-timer-display');

  let board = [], solution = [], userBoard = [], notes = {}, historyStack = [], clues = {};
  let selectedCell = null, isPencilMode = false, timerInterval = null, seconds = 0, isGameFinished = false, currentDifficulty = 'sandwich-medium';
  const SIZE = 9;

  // ---------------------------------------
  // 3) SANDWICH SUDOKU - GENERATOR & SOLVER
  // ---------------------------------------
  function deepCopy(grid) { return grid.map(row => row.slice()); }
  function shuffle(array) { for (let i = array.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [array[i], array[j]] = [array[j], array[i]]; } return array; }

  function solveStandardSudoku(grid) {
      for (let r = 0; r < SIZE; r++) {
          for (let c = 0; c < SIZE; c++) {
              if (grid[r][c] === 0) {
                  for (let num of shuffle([...Array(9).keys()].map(i => i + 1))) {
                      if (isStandardSafe(grid, r, c, num)) {
                          grid[r][c] = num;
                          if (solveStandardSudoku(grid)) return true;
                          grid[r][c] = 0;
                      }
                  }
                  return false;
              }
          }
      }
      return true;
  }

  function isStandardSafe(grid, row, col, num) {
      for (let x = 0; x < SIZE; x++) if (grid[row][x] === num || grid[x][col] === num) return false;
      const startRow = row - row % 3, startCol = col - col % 3;
      for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) if (grid[i + startRow][j + startCol] === num) return false;
      return true;
  }

  function calculateAllClues(grid) {
      const clues = { rows: Array(SIZE).fill(null), cols: Array(SIZE).fill(null) };
      const calculateLineSum = (line) => {
          const pos1 = line.indexOf(1);
          const pos9 = line.indexOf(9);
          if (pos1 === -1 || pos9 === -1) return null;
          const start = Math.min(pos1, pos9) + 1;
          const end = Math.max(pos1, pos9);
          let sum = 0;
          for (let i = start; i < end; i++) sum += line[i];
          return sum;
      };
      for (let i = 0; i < SIZE; i++) {
          clues.rows[i] = calculateLineSum(grid[i]);
          clues.cols[i] = calculateLineSum(grid.map(row => row[i]));
      }
      return clues;
  }

  function generatePuzzle(difficulty) {
      const difficultySettings = { 'sandwich-easy': 15, 'sandwich-medium': 8, 'sandwich-hard': 3, 'sandwich-expert': 0, 'sandwich-master': 0 };
      const givens = difficultySettings[difficulty] ?? 0;
      
      const solutionGrid = Array.from({ length: SIZE }, () => Array(SIZE).fill(0));
      solveStandardSudoku(solutionGrid);
      const puzzleClues = calculateAllClues(solutionGrid);
      
      const puzzleBoard = Array.from({ length: SIZE }, () => Array(SIZE).fill(0));
      if (givens > 0) {
          let placed = 0;
          const cells = shuffle([...Array(81).keys()]);
          for(const cell of cells) {
              if (placed >= givens) break;
              const r = Math.floor(cell / 9), c = cell % 9;
              puzzleBoard[r][c] = solutionGrid[r][c];
              placed++;
          }
      }
      return { solution: solutionGrid, board: puzzleBoard, clues: puzzleClues };
  }

  // ---------------------------------------
  // 4) UI & DOM MANIPULATION
  // ---------------------------------------
  function createGridDOM() {
      wrapper.innerHTML = '';
      const topClues = document.createElement('div'); topClues.className = 'clue-holder top';
      const bottomClues = document.createElement('div'); bottomClues.className = 'clue-holder bottom';
      const leftClues = document.createElement('div'); leftClues.className = 'clue-holder left';
      const rightClues = document.createElement('div'); rightClues.className = 'clue-holder right';
      
      for (let i = 0; i < SIZE; i++) {
          topClues.innerHTML += `<div class="clue">${clues.cols[i] ?? ''}</div>`;
          bottomClues.innerHTML += `<div class="clue">${clues.cols[i] ?? ''}</div>`;
          leftClues.innerHTML += `<div class="clue">${clues.rows[i] ?? ''}</div>`;
          rightClues.innerHTML += `<div class="clue">${clues.rows[i] ?? ''}</div>`;
      }

      const grid = document.createElement('div');
      grid.className = 'sudoku-grid';
      for (let i = 0; i < 81; i++) {
          const cell = document.createElement('div');
          cell.className = 'cell';
          cell.dataset.index = i;
          cell.innerHTML = `<span class="cell-value"></span><div class="notes-grid"></div>`;
          grid.appendChild(cell);
      }
      
      wrapper.appendChild(document.createElement('div'));
      wrapper.appendChild(topClues);
      wrapper.appendChild(document.createElement('div'));
      wrapper.appendChild(leftClues);
      wrapper.appendChild(grid);
      wrapper.appendChild(rightClues);
      wrapper.appendChild(document.createElement('div'));
      wrapper.appendChild(bottomClues);
      wrapper.appendChild(document.createElement('div'));
  }

  function updateAllCellsDOM() {
      for (let i = 0; i < 81; i++) {
          updateCellDOM(i);
      }
  }

  function updateCellDOM(index) {
      const cell = wrapper.querySelector(`.cell[data-index='${index}']`);
      if (!cell) return;
      const r = Math.floor(index / 9), c = index % 9;
      
      const valueSpan = cell.querySelector('.cell-value');
      const notesGrid = cell.querySelector('.notes-grid');
      
      cell.classList.remove('user-input', 'error', 'fixed');

      if (board[r][c] !== 0) {
          valueSpan.textContent = board[r][c];
          cell.classList.add('fixed');
          notesGrid.style.display = 'none';
      } else if (userBoard[r][c] !== 0) {
          valueSpan.textContent = userBoard[r][c];
          cell.classList.add('user-input');
          notesGrid.style.display = 'none';
      } else {
          valueSpan.textContent = '';
          notesGrid.style.display = 'grid';
          const notesForCell = notes[index] || [];
          let notesHTML = '';
          for (let i = 1; i <= 9; i++) {
              notesHTML += `<div class="note-cell" data-note="${i}">${notesForCell.includes(i) ? i : ''}</div>`;
          }
          notesGrid.innerHTML = notesHTML;
      }
  }
  
  function highlightRelevantCells(cell) {
      document.querySelectorAll('.cell').forEach(c => c.classList.remove('highlighted', 'highlight-number'));
      if (!cell) return;
      const i = parseInt(cell.dataset.index), r = Math.floor(i/9), c = i%9;
      for (let n = 0; n < SIZE; n++) {
          wrapper.querySelector(`[data-index='${r*9 + n}']`)?.classList.add('highlighted');
          wrapper.querySelector(`[data-index='${n*9 + c}']`)?.classList.add('highlighted');
      }
      const sr = r - r%3, sc = c - c%3;
      for (let n = 0; n < 3; n++) for (let t = 0; t < 3; t++) wrapper.querySelector(`[data-index='${(sr+n)*9 + sc + t}']`)?.classList.add('highlighted');
      
      const val = userBoard[r][c] || board[r][c];
      if (val !== 0 && highlightSameToggle?.checked) {
          wrapper.querySelectorAll('.cell').forEach(e => {
              const ti = parseInt(e.dataset.index), tr = Math.floor(ti/9), tc = ti%9;
              if ((userBoard[tr][tc] || board[tr][tc]) === val) e.classList.add('highlight-number');
          });
      }
      cell.classList.add('selected');
  }

  // ---------------------------------------
  // 5) GAME ACTIONS & LOGIC
  // ---------------------------------------
  function startNewGame(difficulty = 'sandwich-medium') {
      currentDifficulty = difficulty;
      if (difficultySelector) difficultySelector.value = difficulty;
      const puzzleData = generatePuzzle(difficulty);
      board = puzzleData.board;
      solution = puzzleData.solution;
      clues = puzzleData.clues;
      userBoard = deepCopy(board);
      notes = {}; historyStack = []; seconds = 0; isGameFinished = false;
      if (selectedCell) selectedCell.classList.remove('selected'); selectedCell = null;
      
      createGridDOM();
      updateAllCellsDOM();

      resetTimer();
      startTimer();
  }
  
  function handleInput(num) {
      if (isGameFinished || !selectedCell || selectedCell.classList.contains('fixed')) return;
      const index = parseInt(selectedCell.dataset.index);
      const row = Math.floor(index / 9);
      const col = index % 9;

      const prevValue = userBoard[row][col];
      const prevNotes = notes[index] ? [...notes[index]] : [];
      historyStack.push({ index, prevValue, prevNotes, isPencilMode });

      if (isPencilMode) {
          if (userBoard[row][col] !== 0) return;
          playSound('click-sound');
          notes[index] = notes[index] || [];
          const noteIndex = notes[index].indexOf(num);
          if (num === 0) { notes[index] = []; } 
          else if (noteIndex > -1) { notes[index].splice(noteIndex, 1); } 
          else { notes[index].push(num); notes[index].sort((a,b) => a - b); }
      } else {
          playSound(num === 0 ? 'click-sound' : 'place-sound');
          userBoard[row][col] = num;
          notes[index] = [];
      }

      updateCellDOM(index);
      highlightRelevantCells(selectedCell);
      if (!isPencilMode && num !== 0) {
          checkForWin();
      }
  }
  
  function undoLastMove() {
      if (historyStack.length === 0) return;
      const lastMove = historyStack.pop();
      const { index, prevValue, prevNotes, isPencilMode: prevPencilMode } = lastMove;
      const row = Math.floor(index / 9);
      const col = index % 9;

      userBoard[row][col] = prevValue;
      notes[index] = prevNotes;
      
      isPencilMode = prevPencilMode;
      pencilBtn?.classList.toggle('active', isPencilMode);

      updateCellDOM(index);
      const cellToSelect = wrapper.querySelector(`.cell[data-index='${index}']`);
      if (cellToSelect) {
          selectCell(cellToSelect);
      }
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

  function giveHint() {
    if (isGameFinished) return;
    const emptyCells = [];
    for (let i = 0; i < 81; i++) {
        const r = Math.floor(i / 9);
        const c = i % 9;
        if (board[r][c] === 0 && userBoard[r][c] === 0) {
            emptyCells.push(i);
        }
    }
    if (emptyCells.length === 0) {
        showNotification('No empty cells for a hint!', 'error');
        return;
    }
    const randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    const r = Math.floor(randomIndex / 9);
    const c = randomIndex % 9;
    const correctValue = solution[r][c];

    const cellToHint = wrapper.querySelector(`[data-index='${randomIndex}']`);
    if(cellToHint) {
        selectCell(cellToHint);
        if(isPencilMode) {
            isPencilMode = false;
            pencilBtn?.classList.toggle('active', false);
        }
        handleInput(correctValue);
    }
  }

  function checkForWin() {
      for (let r = 0; r < SIZE; r++) for (let c = 0; c < SIZE; c++) if ((userBoard[r][c] || board[r][c]) !== solution[r][c]) return false;
      isGameFinished = true;
      clearInterval(timerInterval);
      playSound('win-sound');
      if (typeof confetti === 'function') confetti({ particleCount: 150, spread: 90, origin: { y: .6 }});
      if (stats[currentDifficulty]) { stats[currentDifficulty].gamesWon++; if (stats[currentDifficulty].bestTime === null || seconds < stats[currentDifficulty].bestTime) { stats[currentDifficulty].bestTime = seconds; document.getElementById('best-time-msg').textContent = 'New best time!'; } else { document.getElementById('best-time-msg').textContent = ''; } saveStats(); }
      document.getElementById('win-difficulty').textContent = currentDifficulty.replace('sandwich-','');
      document.getElementById('win-time').textContent = formatTime(seconds);
      setTimeout(() => { winModal.style.display = 'flex'; location.hash = '#modal'; }, 500);
      return true;
  }
  
  function formatTime(s){ const m = Math.floor(s/60).toString().padStart(2,'0'); const sec = (s%60).toString().padStart(2,'0'); return `${m}:${sec}`; }
  function startTimer(){ if(timerInterval) clearInterval(timerInterval); timerInterval = setInterval(() => { if (!isGameFinished) { seconds++; timerElement.textContent = formatTime(seconds); mobileTimerDisplay.textContent = formatTime(seconds); } }, 1000); }
  function resetTimer(){ if(timerInterval) clearInterval(timerInterval); seconds = 0; timerElement.textContent = '00:00'; mobileTimerDisplay.textContent = '00:00'; }

  function selectCell(cell){
    if (selectedCell) selectedCell.classList.remove('selected');
    selectedCell = cell;
    highlightRelevantCells(cell);
  }

  // ---------------------------------------
  // 6) INITIALIZATION & EVENT LISTENERS
  // ---------------------------------------
  function initGameListeners() {
      const newGameAction = () => { playSound('click-sound'); showConfirmation('Start a new game?', 'Any progress will be lost.', () => startNewGame(difficultySelector?.value)); };
      document.getElementById('new-game-btn')?.addEventListener('click', newGameAction);
      document.getElementById('new-game-btn-bottom')?.addEventListener('click', newGameAction);
      wrapper.addEventListener('click', e => { const cell = e.target.closest('.cell'); if (cell) { playSound('click-sound'); selectCell(cell); } });
      document.querySelector('.number-pad')?.addEventListener('click', e => { if (e.target.classList.contains('num-btn')) handleInput(parseInt(e.target.textContent)); else if (e.target.id === 'erase-btn') handleInput(0); });
      pencilBtn?.addEventListener('click', () => { playSound('click-sound'); isPencilMode = !isPencilMode; pencilBtn.classList.toggle('active', isPencilMode); });
      document.getElementById('undo-btn')?.addEventListener('click', () => { playSound('click-sound'); undoLastMove(); });
      document.getElementById('win-new-game-btn')?.addEventListener('click', () => { playSound('click-sound'); history.back(); startNewGame(difficultySelector?.value); });
      
      difficultySelector?.addEventListener('change', () => {
        const selectedDifficulty = difficultySelector.value;
        let targetFile = '';
        switch (selectedDifficulty) {
            case 'sandwich-easy': targetFile = 'easy-sandwich-sudoku.html'; break;
            case 'sandwich-medium': targetFile = 'sandwich-sudoku.html'; break;
            case 'sandwich-hard': targetFile = 'hard-sandwich-sudoku.html'; break;
            case 'sandwich-expert': targetFile = 'expert-sandwich-sudoku.html'; break;
            case 'sandwich-master': targetFile = 'master-sandwich-sudoku.html'; break;
            default: return;
        }
        if (!window.location.pathname.endsWith('/' + targetFile)) {
            window.location.href = targetFile;
        }
      });

      document.getElementById('hint-btn')?.addEventListener('click', () => { playSound('click-sound'); giveHint(); });
      document.getElementById('check-btn')?.addEventListener('click', () => { playSound('click-sound'); checkMistakes(); });
      document.getElementById('solve-btn')?.addEventListener('click', () => {
          playSound('click-sound');
          showConfirmation('Reveal the solution?', 'This will end the game.', () => {
              userBoard = deepCopy(solution);
              notes = {};
              updateAllCellsDOM();
              highlightRelevantCells(null);
              checkForWin();
          });
      });

      document.addEventListener('keydown', e => {
          if (!selectedCell || isGameFinished) return;
          if (e.key >= '1' && e.key <= '9') handleInput(parseInt(e.key));
          else if (e.key === 'Backspace' || e.key === 'Delete') handleInput(0);
          else if (e.key.toLowerCase() === 'p') {
              isPencilMode = !isPencilMode;
              pencilBtn?.classList.toggle('active', isPencilMode);
          } else if (e.key.startsWith('Arrow')) {
              e.preventDefault();
              let i = parseInt(selectedCell.dataset.index);
              if (e.key === 'ArrowUp' && i > 8) i -= 9;
              else if (e.key === 'ArrowDown' && i < 72) i += 9;
              else if (e.key === 'ArrowLeft' && i % 9 !== 0) i -= 1;
              else if (e.key === 'ArrowRight' && i % 9 !== 8) i += 1;
              const cell = wrapper.querySelector(`[data-index='${i}']`);
              if (cell) selectCell(cell);
          }
      });
  }

  // --- Boot ---
  initUniversalListeners();
  loadSettings();
  loadStats();
  updateLanguageSelectorDisplay(); // <--- أضف هذا السطر هنا
  populateMobileLanguageMenu(); // <--- أضف هذا السطر هنا
  initStatsIfNeeded();
  initGameListeners();
  startNewGame(difficultySelector?.value || 'sandwich-medium');
});