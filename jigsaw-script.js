// --- Jigsaw Sudoku: Full integrated and enhanced script ---
// --- VERSION 3.3: Integrated professional theme switcher ---
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
  // 1) Universal DOM helpers & Settings
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
  // START: ADDED FOR THEME SWITCHER
  const mobileThemeSwitcher = document.getElementById('mobile-theme-switcher');
  // END: ADDED FOR THEME SWITCHER
  let confirmCallback = null;
  let stats = {};

  async function playSound(soundId) {
    if (soundToggle && soundToggle.checked) {
      const sound = document.getElementById(soundId);
      if (sound) {
        sound.currentTime = 0;
        try { await sound.play(); } catch (err) { /* Silently ignore autoplay errors */ }
      }
    }
  }
  function showNotification(message, type = 'success') { if (!notificationBar) return; notificationBar.textContent = message; notificationBar.className = type; notificationBar.style.top = '10px'; setTimeout(() => { notificationBar.style.top = '-50px'; }, 3000); }
  function showConfirmation(title, text, callback) { const t = document.getElementById('confirm-title'), x = document.getElementById('confirm-text'); if (t) t.textContent = title; if (x) x.textContent = text; confirmCallback = callback; if (confirmModal) confirmModal.style.display = 'flex'; location.hash = 'modal'; }
  function saveSettings() { localStorage.setItem('sudokuSettings', JSON.stringify({ theme: themeSelect?.value || 'theme-light', sound: !!(soundToggle && soundToggle.checked), highlightDuplicates: !!(highlightDuplicatesToggle && highlightDuplicatesToggle.checked), highlightSame: !!(highlightSameToggle && highlightSameToggle.checked) })); }
  function loadSettings() { const s = JSON.parse(localStorage.getItem('sudokuSettings') || '{}'); document.body.className = s.theme || 'theme-light'; if (themeSelect) themeSelect.value = s.theme || 'theme-light'; if (soundToggle) soundToggle.checked = s.sound !== false; if (highlightDuplicatesToggle) highlightDuplicatesToggle.checked = s.highlightDuplicates !== false; if (highlightSameToggle) highlightSameToggle.checked = s.highlightSame !== false; }
  function loadStats() { stats = JSON.parse(localStorage.getItem('sudokuStats') || '{}'); }
  function saveStats() { localStorage.setItem('sudokuStats', JSON.stringify(stats)); }
  function initStatsIfNeeded() { const keys = ['jigsaw-easy', 'jigsaw-medium', 'jigsaw-hard', 'jigsaw-expert', 'jigsaw-master']; keys.forEach(k => { if (!stats[k]) stats[k] = { bestTime: null, gamesWon: 0 }; }); }
  function updateStatsDisplay() { const container = document.getElementById('stats-container'); if (!container) return; container.innerHTML = ''; const statGroups = { "Jigsaw Sudoku": ['jigsaw-easy', 'jigsaw-medium', 'jigsaw-hard', 'jigsaw-expert', 'jigsaw-master'] }; for (const groupName in statGroups) { const h3 = document.createElement('h3'); h3.textContent = groupName; container.appendChild(h3); statGroups[groupName].forEach(diff => { if (stats[diff]) { const time = stats[diff].bestTime ? new Date(stats[diff].bestTime * 1000).toISOString().substr(14, 5) : 'N/A'; const el = document.createElement('div'); el.className = 'stat-item'; el.innerHTML = `<span class="stat-diff">${diff.replace('jigsaw-','')}</span><span class="stat-wins">Wins: ${stats[diff].gamesWon}</span><span class="stat-time">Best: ${time}</span>`; container.appendChild(el); } }); } }
  
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
    document.addEventListener('click', (e) => { if (isMenuOpen && mobileMenu && !mobileMenu.contains(e.target) && hamburgerBtn && !hamburgerBtn.contains(e.target)) { toggleMobileMenu(); } });
    
    const openSettingsAction = () => { playSound('click-sound'); if (settingsModal) settingsModal.style.display = 'flex'; location.hash = '#modal'; if (isMenuOpen) toggleMobileMenu(); };
    const openStatsAction = () => { playSound('click-sound'); updateStatsDisplay(); if (statsModal) statsModal.style.display = 'flex'; location.hash = '#modal'; if (isMenuOpen) toggleMobileMenu(); };

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

        const resetStatsBtn = document.getElementById('reset-stats-btn');
    if (resetStatsBtn) {
        resetStatsBtn.addEventListener('click', () => {
            playSound('click-sound');
            showConfirmation('Reset all statistics?', 'This action is permanent and cannot be undone.', () => {
                stats = {};
                initStatsIfNeeded();
                saveStats();
                updateStatsDisplay();
                showNotification('Statistics have been reset.', 'success');
            });
        });
    }

  }

  // -----------------------
  // 2) Jigsaw Sudoku specific state
  // -----------------------
  const difficultySelector = document.getElementById('difficulty');
  const gridContainer = document.getElementById('jigsaw-grid-container');
  const pencilBtn = document.getElementById('pencil-btn');
  const timerElement = document.getElementById('timer');
  const mobileTimerDisplay = document.getElementById('mobile-timer-display');

  let board = [], solution = [], regions = [], userBoard = [], notes = {}, historyStack = [], selectedCell = null, isPencilMode = false, timerInterval = null, seconds = 0, isGameFinished = false, currentDifficulty = 'jigsaw-medium';
  const SIZE = 9;

  // -----------------------
  // 3) Jigsaw Solver & Generator
  // -----------------------
  function deepCopy(grid) { return grid.map(row => row.slice()); }
  function shuffle(array) { for (let i = array.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [array[i], array[j]] = [array[j], array[i]]; } return array; }

  function generateJigsawRegions() {
      let attempts = 0;
      while (attempts < 100) {
          const temp = Array.from({ length: SIZE }, () => Array(SIZE).fill(-1));
          let regionId = 0;
          let generationSuccess = true;
          function isValid(r, c) { return r >= 0 && r < SIZE && c >= 0 && c < SIZE && temp[r][c] === -1; }
          for (let r = 0; r < SIZE; r++) {
              for (let c = 0; c < SIZE; c++) {
                  if (temp[r][c] === -1) {
                      regionId++;
                      const queue = [{ r, c }]; temp[r][c] = regionId;
                      const cells = [{ r, c }]; let head = 0;
                      while (head < queue.length && cells.length < SIZE) {
                          const { r: curR, c: curC } = queue[head++];
                          const neighbors = shuffle([{ dr: 0, dc: 1 }, { dr: 0, dc: -1 }, { dr: 1, dc: 0 }, { dr: -1, dc: 0 }]);
                          for (const { dr, dc } of neighbors) {
                              const nr = curR + dr, nc = curC + dc;
                              if (isValid(nr, nc)) {
                                  temp[nr][nc] = regionId; cells.push({ r: nr, c: nc }); queue.push({ r: nr, c: nc });
                                  if (cells.length === SIZE) break;
                              }
                          }
                      }
                      if (cells.length < SIZE) { generationSuccess = false; break; }
                  }
              }
              if (!generationSuccess) break;
          }
          if (generationSuccess) {
              const regionCounts = Object.values(temp.flat().reduce((acc, val) => { acc[val] = (acc[val] || 0) + 1; return acc; }, {}));
              if (regionCounts.length === SIZE && regionCounts.every(count => count === SIZE)) return temp;
          }
          attempts++;
      }
      console.error("Jigsaw generation failed. Falling back to standard grid.");
      const fallbackGrid = Array.from({ length: SIZE }, () => Array(SIZE).fill(0));
      for (let r = 0; r < SIZE; r++) for (let c = 0; c < SIZE; c++) fallbackGrid[r][c] = Math.floor(r / 3) * 3 + Math.floor(c / 3) + 1;
      return fallbackGrid;
  }

  function isSafe(grid, row, col, num) {
      if (!regions || !regions[row]) return false;
      const regionId = regions[row][col];
      for (let i = 0; i < SIZE; i++) { if (grid[row][i] === num || grid[i][col] === num) return false; }
      for (let r = 0; r < SIZE; r++) { for (let c = 0; c < SIZE; c++) { if (regions[r][c] === regionId && grid[r][c] === num) return false; } }
      return true;
  }

  function solveJigsaw(grid) {
      for (let r = 0; r < SIZE; r++) {
          for (let c = 0; c < SIZE; c++) {
              if (grid[r][c] === 0) {
                  for (let num of shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9])) {
                      if (isSafe(grid, r, c, num)) {
                          grid[r][c] = num;
                          if (solveJigsaw(grid)) return true;
                          grid[r][c] = 0;
                      }
                  }
                  return false;
              }
          }
      }
      return true;
  }
  
  const difficultySettings = { 'jigsaw-easy': 36, 'jigsaw-medium': 32, 'jigsaw-hard': 28, 'jigsaw-expert': 24, 'jigsaw-master': 22 };

  function generatePuzzle(difficultyKey) {
      regions = generateJigsawRegions();
      const grid = Array.from({ length: SIZE }, () => Array(SIZE).fill(0));
      solveJigsaw(grid);
      solution = deepCopy(grid);

      const puzzle = deepCopy(solution);
      let cells = Array.from({ length: 81 }, (_, i) => i);
      shuffle(cells);

      let cellsToRemove = 81 - (difficultySettings[difficultyKey] || 32);

      for (let i = 0; i < cellsToRemove; i++) {
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
          const r = Math.floor(i / 9), c = i % 9;
          cell.className = 'cell jigsaw-cell';
          cell.dataset.index = i;

          if (r + 1 < SIZE && regions[r + 1][c] !== regions[r][c]) cell.classList.add('border-bottom');
          if (c + 1 < SIZE && regions[r][c + 1] !== regions[r][c]) cell.classList.add('border-right');

          const fixedVal = board[r][c];
          cell.classList.remove('fixed', 'user-input', 'error');

          if (fixedVal !== 0) {
              cell.textContent = fixedVal;
              cell.classList.add('fixed');
          } else {
              const notesHtml = Array.from({ length: 9 }, (_, t) => `<div class="note-cell" data-note="${t + 1}"></div>`).join('');
              cell.innerHTML = `<div class="notes-grid">${notesHtml}</div>`;
          }
          grid.appendChild(cell);
      }
      gridContainer.appendChild(grid);
  }
  
  function updateAllCellsDOM() { for (let i = 0; i < 81; i++) updateCellDOM(i); }

  function updateCellDOM(index) {
      const cell = document.querySelector(`[data-index='${index}']`);
      if (!cell) return;
      const r = Math.floor(index/9), c = index % 9;
      const fixedValue = board[r][c];
      const userValue = userBoard[r][c];
      const cellNotes = notes[index] || [];
      
      cell.textContent = '';
      cell.classList.remove('fixed', 'user-input', 'error');
      
      const notesGrid = cell.querySelector('.notes-grid') || document.createElement('div');
      if (!cell.querySelector('.notes-grid')) {
          notesGrid.className = 'notes-grid';
          cell.appendChild(notesGrid);
      }
      
      if (fixedValue !== 0) { 
          cell.textContent = fixedValue; 
          cell.classList.add('fixed'); 
          notesGrid.style.display = 'none';
      } else if (userValue !== 0) { 
          cell.textContent = userValue; 
          cell.classList.add('user-input'); 
          notesGrid.style.display = 'none';
      } else {
          notesGrid.style.display = 'grid';
          let notesHtml = '';
          for (let i = 1; i <= 9; i++) {
              notesHtml += `<div class="note-cell" data-note="${i}">${cellNotes.includes(i) ? i : ''}</div>`;
          }
          notesGrid.innerHTML = notesHtml;
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
      document.querySelectorAll('.cell').forEach(c => c.classList.remove('highlighted', 'highlight-number'));
      if (!cell) return;
      const i = parseInt(cell.dataset.index), r = Math.floor(i / 9), c = i % 9;
      
      for (let n = 0; n < SIZE; n++) {
          document.querySelector(`[data-index='${r * 9 + n}']`)?.classList.add('highlighted');
          document.querySelector(`[data-index='${n * 9 + c}']`)?.classList.add('highlighted');
      }
      
      const regionId = regions[r][c];
      for (let row = 0; row < SIZE; row++) {
          for (let col = 0; col < SIZE; col++) {
              if (regions[row][col] === regionId) {
                  document.querySelector(`[data-index='${row * 9 + col}']`)?.classList.add('highlighted');
              }
          }
      }

      const val = userBoard[r][c] || board[r][c];
      if (val !== 0 && highlightSameToggle && highlightSameToggle.checked) {
          document.querySelectorAll('.cell').forEach(e => {
              const ti = parseInt(e.dataset.index), tr = Math.floor(ti / 9), tc = ti % 9;
              if ((userBoard[tr][tc] || board[tr][tc]) === val) e.classList.add('highlight-number');
          });
      }
      cell.classList.add('selected');
  }

  // -----------------------
  // 6) Game Actions & Logic
  // -----------------------
  function runFullScreenCelebration() {
      if (typeof confetti !== 'function') return;
      const duration = 5 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 1001 };
      function randomInRange(min, max) { return Math.random() * (max - min) + min; }
      const interval = setInterval(function() {
          const timeLeft = animationEnd - Date.now();
          if (timeLeft <= 0) return clearInterval(interval);
          const particleCount = 50 * (timeLeft / duration);
          confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
          confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
      }, 250);
  }

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
      runFullScreenCelebration();
      
      const e = currentDifficulty;
      if (stats[e]) { stats[e].gamesWon++; if (stats[e].bestTime === null || seconds < stats[e].bestTime) { stats[e].bestTime = seconds; document.getElementById('best-time-msg').textContent = 'New best time!'; } else { document.getElementById('best-time-msg').textContent = ''; } saveStats(); }
      document.getElementById('win-difficulty').textContent = e.replace('jigsaw-','');
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
  function startNewGame(difficulty = 'jigsaw-medium') {
      currentDifficulty = difficulty;
      if (difficultySelector) difficultySelector.value = difficulty;
      
      board = generatePuzzle(difficulty);
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
      const newGameAction = () => { playSound('click-sound'); showConfirmation('Start a new game?', 'Any progress will be lost.', () => startNewGame(difficultySelector?.value || 'jigsaw-medium')); };
      document.getElementById('new-game-btn')?.addEventListener('click', newGameAction);
      document.getElementById('new-game-btn-bottom')?.addEventListener('click', newGameAction);
      
      if (difficultySelector) difficultySelector.addEventListener('change', () => {
        const selected = difficultySelector.value;
        const targetFile = selected === 'jigsaw-medium' ? 'jigsaw-sudoku.html' : `${selected.replace('jigsaw-','')}-jigsaw-sudoku.html`;
        if(!window.location.pathname.endsWith(targetFile)) window.location.href = targetFile;
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
              updateAllCellsDOM();
              highlightRelevantCells(null);
              isGameFinished = true;
              if(timerInterval) clearInterval(timerInterval);
          });
      });

      document.getElementById('win-new-game-btn')?.addEventListener('click', () => { playSound('click-sound'); history.back(); startNewGame(difficultySelector?.value || 'jigsaw-medium'); });
      
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
  startNewGame(difficultySelector?.value || 'jigsaw-medium');
});