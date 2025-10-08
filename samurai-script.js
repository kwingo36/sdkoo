// --- Samurai Sudoku: Full generator + integration (single-file) ---
// Paste this file into your site replacing the old samurai script.
// Generates 5 distinct but overlapping solved grids, creates puzzles per difficulty,
// and integrates with UI listeners, timer, hints, undo, check, solve, etc.

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
  // 1) Universal DOM helpers
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

  function playSound(soundId) {
    if (soundToggle && soundToggle.checked) {
      const sound = document.getElementById(soundId);
      if (sound) { sound.currentTime = 0; sound.play().catch(() => {}); }
    }
  }
  function showNotification(message, type = 'success') {
    if (!notificationBar) return;
    notificationBar.textContent = message;
    notificationBar.className = type;
    notificationBar.style.top = '10px';
    setTimeout(() => { notificationBar.style.top = '-50px'; }, 3000);
  }
  function showConfirmation(title, text, callback) {
    const t = document.getElementById('confirm-title'), x = document.getElementById('confirm-text');
    if (t) t.textContent = title;
    if (x) x.textContent = text;
    confirmCallback = callback;
    if (confirmModal) confirmModal.style.display = 'flex';
    location.hash = 'modal';
  }
  function saveSettings() { localStorage.setItem('sudokuSettings', JSON.stringify({ theme: themeSelect?.value || 'theme-light', sound: !!(soundToggle && soundToggle.checked), highlightDuplicates: !!(highlightDuplicatesToggle && highlightDuplicatesToggle.checked), highlightSame: !!(highlightSameToggle && highlightSameToggle.checked) })); }
  function loadSettings() {
    const s = JSON.parse(localStorage.getItem('sudokuSettings') || '{}');
    document.body.className = s.theme || 'theme-light';
    if (themeSelect) themeSelect.value = s.theme || 'theme-light';
    if (soundToggle) soundToggle.checked = s.sound !== false;
    if (highlightDuplicatesToggle) highlightDuplicatesToggle.checked = s.highlightDuplicates !== false;
    if (highlightSameToggle) highlightSameToggle.checked = s.highlightSame !== false;
  }
  function loadStats() { stats = JSON.parse(localStorage.getItem('sudokuStats') || '{}'); }
  function saveStats() { localStorage.setItem('sudokuStats', JSON.stringify(stats)); }
  function initStatsIfNeeded() { const samuraiKeys = ['samurai-easy','samurai-medium','samurai-hard','samurai-expert','samurai-master']; samuraiKeys.forEach(k => { if (!stats[k]) stats[k] = { bestTime: null, gamesWon: 0 }; }); }
  function updateStatsDisplay() {
    const container = document.getElementById('stats-container'); if (!container) return;
    container.innerHTML = '';
    const statGroups = { "Samurai Sudoku": ['samurai-easy','samurai-medium','samurai-hard','samurai-expert','samurai-master'] };
    for (const groupName in statGroups) {
      const h3 = document.createElement('h3'); h3.textContent = groupName; container.appendChild(h3);
      statGroups[groupName].forEach(diff => {
        if (stats[diff]) {
          const time = stats[diff].bestTime ? new Date(stats[diff].bestTime * 1000).toISOString().substr(14,5) : 'N/A';
          const el = document.createElement('div'); el.className = 'stat-item';
          el.innerHTML = `<span class="stat-diff">${diff.replace(/(killer|samurai)-/,'')}</span><span class="stat-wins">Wins: ${stats[diff].gamesWon}</span><span class="stat-time">Best: ${time}</span>`;
          container.appendChild(el);
        }
      });
    }
  }

  function initUniversalListeners() {
    const hamburgerBtn = document.getElementById('hamburger-btn'), mobileMenu = document.getElementById('mobile-menu'), closeMenuBtn = document.getElementById('close-menu-btn');
    let isMenuOpen = false;
    function toggleMobileMenu(){ if(!hamburgerBtn || !mobileMenu) return; isMenuOpen = !isMenuOpen; hamburgerBtn.classList.toggle('active', isMenuOpen); mobileMenu.classList.toggle('active', isMenuOpen); }
    if (hamburgerBtn) hamburgerBtn.addEventListener('click', e => { e.stopPropagation(); toggleMobileMenu(); });
    if (closeMenuBtn) closeMenuBtn.addEventListener('click', toggleMobileMenu);
    document.addEventListener('click', (e) => {
    if (isMenuOpen && mobileMenu && hamburgerBtn && !mobileMenu.contains(e.target) && !hamburgerBtn.contains(e.target)) {
        toggleMobileMenu();
    }
});
    const sb = document.getElementById('settings-btn'); if (sb) sb.addEventListener('click', () => { playSound('click-sound'); if (settingsModal) settingsModal.style.display = 'flex'; location.hash = '#modal'; });
    const stb = document.getElementById('stats-btn'); if (stb) stb.addEventListener('click', () => { playSound('click-sound'); updateStatsDisplay(); if (statsModal) statsModal.style.display = 'flex'; location.hash = '#modal'; });
    
const mobileSettingsBtn = document.getElementById('mobile-settings-btn');
if (mobileSettingsBtn) mobileSettingsBtn.addEventListener('click', () => { 
    playSound('click-sound'); 
    if (settingsModal) settingsModal.style.display = 'flex'; 
    location.hash = '#modal'; 
    if (isMenuOpen) toggleMobileMenu();
});

const mobileStatsBtn = document.getElementById('mobile-stats-btn');
if (mobileStatsBtn) mobileStatsBtn.addEventListener('click', () => { 
    playSound('click-sound'); 
    updateStatsDisplay(); 
    if (statsModal) statsModal.style.display = 'flex'; 
    location.hash = '#modal'; 
    if (isMenuOpen) toggleMobileMenu();
});

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
    window.addEventListener('click', e => { if (e.target && e.target.classList && e.target.classList.contains('modal')) history.back(); });
    window.addEventListener('hashchange', () => { if ('#modal' !== location.hash) { document.querySelectorAll('.modal').forEach(m => m.style.display = 'none'); if (isMenuOpen) toggleMobileMenu(); } });
    if (themeSelect) themeSelect.addEventListener('change', () => { document.body.className = themeSelect.value; saveSettings(); });
    [soundToggle, highlightDuplicatesToggle, highlightSameToggle].forEach(e => { if (!e) return; e.addEventListener('change', () => { saveSettings(); selectedCell && highlightRelevantCells(selectedCell); }); });
    const confirmOk = document.getElementById('confirm-ok-btn'); if (confirmOk) confirmOk.addEventListener('click', () => { playSound('click-sound'); confirmCallback && confirmCallback(); history.back(); });
    const confirmCancel = document.getElementById('confirm-cancel-btn'); if (confirmCancel) confirmCancel.addEventListener('click', () => { playSound('click-sound'); history.back(); });
  }

  // -----------------------
  // 2) Samurai-specific state
  // -----------------------
  const difficultySelector = document.getElementById('difficulty');
  const samuraiGridContainer = document.getElementById('samurai-grid-container');
  const pencilBtn = document.getElementById('pencil-btn');
  const timerElement = document.getElementById('timer');
  const mobileTimerDisplay = document.getElementById('mobile-timer-display');

  let boards = [], solutions = [], userBoards = [], notes = [], historyStack = [], selectedCell = null, isPencilMode = false, timerInterval = null, seconds = 0, isGameFinished = false, currentDifficulty = 'samurai-medium';

  // -----------------------
  // 3) Sudoku generator helpers (valid 9x9)
  // -----------------------
  function deepCopy(x) { return Array.isArray(x) ? x.map(e => deepCopy(e)) : x; }

  // base pattern + permutations method (guarantees a valid completed grid)
  function makeBaseGrid() {
    const base = 3, side = base * base;
    const pattern = (r, c) => (base * (r % base) + Math.floor(r / base) + c) % side;
    const grid = [];
    for (let r = 0; r < 9; r++) {
      const row = [];
      for (let c = 0; c < 9; c++) row.push(pattern(r, c) + 1);
      grid.push(row);
    }
    return grid;
  }
  function shuffleArray(a) {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
  function permuteBands(grid) {
    // permute bands (groups of 3 rows)
    const bands = [0,1,2].slice();
    shuffleArray(bands);
    const res = [];
    bands.forEach(b => {
      for (let r = 0; r < 3; r++) res.push(grid[b*3 + r].slice());
    });
    return res;
  }
  function permuteStacks(grid) {
    // permute stacks (groups of 3 columns)
    const stacks = [0,1,2].slice();
    shuffleArray(stacks);
    return grid.map(row => {
      const out = [];
      stacks.forEach(s => {
        for (let c = 0; c < 3; c++) out.push(row[s*3 + c]);
      });
      return out;
    });
  }
  function remapDigits(grid) {
    const digits = [1,2,3,4,5,6,7,8,9].slice();
    shuffleArray(digits);
    const map = [0].concat(digits); // map[old] => new
    return grid.map(row => row.map(v => map[v]));
  }
  function makeRandomSolvedGrid() {
    let g = makeBaseGrid();
    g = permuteBands(g);
    g = permuteStacks(g);
    g = remapDigits(g);
    return g;
  }

  // -----------------------
  // 4) Samurai assembly with correct overlaps
  // -----------------------
  const overlaps = {
    '0-6,6': [4,0,0],
    '1-6,0': [4,0,6],
    '2-0,6': [4,6,0],
    '3-0,0': [4,6,6],
    '4-0,0': [0,6,6],
    '4-0,6': [1,6,0],
    '4-6,0': [2,0,6],
    '4-6,6': [3,0,0]
  };

  function getOverlapInfoForOuterGrid(g) {
    for (const k in overlaps) {
      const parts = k.split('-'); const gid = parseInt(parts[0],10);
      if (gid === g) {
        const starts = parts[1].split(',').map(x => parseInt(x,10));
        const val = overlaps[k];
        if (val[0] === 4) {
          return { outerR: starts[0], outerC: starts[1], centerR: val[1], centerC: val[2] };
        }
      }
    }
    return null;
  }

  function randomBandPermutationWithConstraint(targetBandIndex, sourceBandIndex) {
    const arr = [0,1,2];
    const tryPerm = () => {
      const p = arr.slice(); shuffleArray(p);
      if (p[targetBandIndex] === sourceBandIndex) return p;
      const idxOfSource = p.indexOf(sourceBandIndex);
      [p[idxOfSource], p[targetBandIndex]] = [p[targetBandIndex], p[idxOfSource]];
      return p;
    };
    return tryPerm();
  }
  function randomStackPermutationWithConstraint(targetStackIndex, sourceStackIndex) {
    const arr = [0,1,2];
    const tryPerm = () => {
      const p = arr.slice(); shuffleArray(p);
      if (p[targetStackIndex] === sourceStackIndex) return p;
      const idx = p.indexOf(sourceStackIndex);
      [p[idx], p[targetStackIndex]] = [p[targetStackIndex], p[idx]];
      return p;
    };
    return tryPerm();
  }

  function transformByBandStack(orig, bandPerm, stackPerm) {
    const rowsReordered = [];
    for (let nb = 0; nb < 3; nb++) {
      const ob = bandPerm[nb];
      for (let r = 0; r < 3; r++) {
        rowsReordered.push(orig[ob*3 + r].slice());
      }
    }
    const out = rowsReordered.map(row => {
      const newRow = [];
      for (let ns = 0; ns < 3; ns++) {
        const os = stackPerm[ns];
        for (let c = 0; c < 3; c++) newRow.push(row[os*3 + c]);
      }
      return newRow;
    });
    return out;
  }

  function buildDistinctSamuraiSolution() {
    const center = makeRandomSolvedGrid();
    const grids = [];
    for (let g = 0; g < 5; g++) grids.push(null);
    grids[4] = deepCopy(center);

    const outerBlocks = {
      0: { oR:6, oC:6, cR:0, cC:0 },
      1: { oR:6, oC:0, cR:0, cC:6 },
      2: { oR:0, oC:6, cR:6, cC:0 },
      3: { oR:0, oC:0, cR:6, cC:6 }
    };

    for (let g = 0; g < 4; g++) {
      const info = outerBlocks[g];
      const cb = info.cR / 3; const cs = info.cC / 3;
      const ob = info.oR / 3; const os = info.oC / 3;
      const bandPerm = randomBandPermutationWithConstraint(ob, cb);
      const stackPerm = randomStackPermutationWithConstraint(os, cs);
      let outer = transformByBandStack(center, bandPerm, stackPerm);
      grids[g] = outer;
    }
    return grids;
  }

  // -----------------------
  // 5) Puzzle creation (remove cells) safe for overlaps
  // -----------------------
  const difficultySettings = {
    'samurai-easy': 130,
    'samurai-medium': 115,
    'samurai-hard': 100,
    'samurai-expert': 90,
    'samurai-master': 81
  };

  function isCenterOverlapCell(r,c) {
    return (r < 3 && c < 3) || (r < 3 && c > 5) || (r > 5 && c < 3) || (r > 5 && c > 5);
  }

  function buildUniqueCellList() {
    const list = [];
    for (let g = 0; g < 5; g++) {
      for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
          if (g === 4 && isCenterOverlapCell(r,c)) continue;
          list.push({ g, r, c });
        }
      }
    }
    return list;
  }

  function getOverlap(g, r, c) {
    const key = `${g}-${Math.floor(r/3)*3},${Math.floor(c/3)*3}`;
    if (!overlaps[key]) return null;
    const [tg, sr, sc] = overlaps[key];
    const tr = sr + (r % 3);
    const tc = sc + (c % 3);
    return { gridId: tg, row: tr, col: tc, index: tr*9 + tc };
  }

  function generatePuzzleFromSolution(solvedGrids, difficultyKey) {
    const solution = deepCopy(solvedGrids);
    const puzzle = deepCopy(solution);
    const keep = difficultySettings[difficultyKey] || 100;
    let toRemove = 369 - keep;
    const uniqueCells = buildUniqueCellList();
    shuffleArray(uniqueCells);
    const removed = new Set();
    const key = (g,r,c) => `${g}-${r}-${c}`;

    for (const cell of uniqueCells) {
      if (toRemove <= 0) break;
      const { g, r, c } = cell;
      const k1 = key(g,r,c);
      if (removed.has(k1) || puzzle[g][r][c] === 0) continue;

      puzzle[g][r][c] = 0;
      removed.add(k1);
      toRemove--;

      const ov = getOverlap(g, r, c);
      if (ov) {
        const k2 = key(ov.gridId, ov.row, ov.col);
        if (!removed.has(k2) && puzzle[ov.gridId][ov.row][ov.col] !== 0) {
          puzzle[ov.gridId][ov.row][ov.col] = 0;
          removed.add(k2);
          if (toRemove > 0) toRemove--;
        }
      }

      if (toRemove > 0) {
        const mg = 4 - g, mr = 8 - r, mc = 8 - c;
        const mk = key(mg, mr, mc);
        if (!removed.has(mk) && puzzle[mg][mr][mc] !== 0) {
          puzzle[mg][mr][mc] = 0;
          removed.add(mk);
          const ov2 = getOverlap(mg, mr, mc);
          if (ov2) {
            const k4 = key(ov2.gridId, ov2.row, ov2.col);
            if (!removed.has(k4) && puzzle[ov2.gridId][ov2.row][ov2.col] !== 0) {
              puzzle[ov2.gridId][ov2.row][ov2.col] = 0;
              removed.add(k4);
            }
          }
          toRemove--;
        }
      }
    }
    return { puzzle, solution };
  }

  // -----------------------
  // 6) UI: grid creation & interactions
  // -----------------------
  function createGridsDOM() {
    if (!samuraiGridContainer) return;
    samuraiGridContainer.innerHTML = '';
    for (let g = 0; g < 5; g++) {
      const grid = document.createElement('div');
      grid.id = `grid-${g}`;
      grid.className = 'sudoku-grid';
      for (let i = 0; i < 81; i++) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.dataset.grid = g;
        cell.dataset.index = i;
        const r = Math.floor(i/9), c = i % 9;
        if (getOverlap(g,r,c)) cell.classList.add('overlapping-region');
        const val = boards[g] && boards[g][r] ? boards[g][r][c] : 0;
        if (val !== 0) { cell.textContent = val; cell.classList.add('fixed'); }
        else {
          const notesHtml = Array.from({length:9}, (_,t) => `<div class="note-cell" data-note="${t+1}"></div>`).join('');
          cell.innerHTML = `<div class="notes-grid">${notesHtml}</div>`;
        }
        grid.appendChild(cell);
      }
      samuraiGridContainer.appendChild(grid);
    }
  }

  function updateCellDOM(gridId, index) {
    const cell = document.querySelector(`[data-grid='${gridId}'][data-index='${index}']`);
    if (!cell) return;
    const row = Math.floor(index/9), col = index%9;
    const fixedValue = boards[gridId] && boards[gridId][row] ? boards[gridId][row][col] : 0;
    const userValue = userBoards[gridId] && userBoards[gridId][row] ? userBoards[gridId][row][col] : 0;
    const cellNotes = notes[gridId] && notes[gridId][index] ? notes[gridId][index] : [];
    cell.textContent = '';
    cell.classList.remove('fixed','user-input');
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

  function updateCellAndOverlap(gridId, index, data) {
    const { value, notes: newNotes } = data || {};
    const row = Math.floor(index/9), col = index % 9;
    userBoards[gridId] = userBoards[gridId] || Array.from({length:9}, () => Array(9).fill(0));
    userBoards[gridId][row][col] = value;
    notes[gridId] = notes[gridId] || {};
    notes[gridId][index] = newNotes;
    updateCellDOM(gridId, index);
    const ov = getOverlap(gridId, row, col);
    if (ov) {
      userBoards[ov.gridId] = userBoards[ov.gridId] || Array.from({length:9}, () => Array(9).fill(0));
      userBoards[ov.gridId][ov.row][ov.col] = value;
      notes[ov.gridId] = notes[ov.gridId] || {};
      notes[ov.gridId][ov.index] = newNotes;
      updateCellDOM(ov.gridId, ov.index);
    }
  }

  function handleInput(num) {
    if (isGameFinished || !selectedCell || selectedCell.classList.contains('fixed')) return;
    const g = parseInt(selectedCell.dataset.grid), i = parseInt(selectedCell.dataset.index);
    const r = Math.floor(i/9), c = i%9;
    const prevVal = (userBoards[g] && userBoards[g][r]) ? userBoards[g][r][c] : 0;
    const prevNotes = (notes[g] && notes[g][i]) ? [...notes[g][i]] : [];
    const historyEntry = { cell1: { gridId: g, index: i, value: prevVal, notes: prevNotes }, cell2: null, pencilMode: isPencilMode };
    const ov = getOverlap(g,r,c);
    if (ov) {
      const prevVal2 = (userBoards[ov.gridId] && userBoards[ov.gridId][ov.row]) ? userBoards[ov.gridId][ov.row][ov.col] : 0;
      const prevNotes2 = (notes[ov.gridId] && notes[ov.gridId][ov.index]) ? [...notes[ov.gridId][ov.index]] : [];
      historyEntry.cell2 = { gridId: ov.gridId, index: ov.index, value: prevVal2, notes: prevNotes2 };
    }
    historyStack.push(historyEntry);

    if (isPencilMode) {
      if ((userBoards[g] && userBoards[g][r] && userBoards[g][r][c]) !== 0) return;
      playSound('click-sound');
      const currentNotes = notes[g] && notes[g][i] ? notes[g][i] : [];
      const pos = currentNotes.indexOf(num);
      if (num === 0) currentNotes.length = 0;
      else if (pos > -1) currentNotes.splice(pos,1);
      else { currentNotes.push(num); currentNotes.sort((a,b) => a-b); }
      updateCellAndOverlap(g, i, { value: 0, notes: currentNotes });
    } else {
      playSound(num === 0 ? 'click-sound' : 'place-sound');
      updateCellAndOverlap(g, i, { value: num, notes: [] });
    }

    highlightRelevantCells(selectedCell);
    if (!isPencilMode && num !== 0) checkForWin();
  }

  function undoLastMove() {
    if (!historyStack.length) return;
    const last = historyStack.pop();
    isPencilMode = last.pencilMode;
    if (pencilBtn) pencilBtn.classList.toggle('active', isPencilMode);
    const { cell1, cell2 } = last;
    updateCellAndOverlap(cell1.gridId, cell1.index, { value: cell1.value, notes: cell1.notes });
    if (cell2) updateCellAndOverlap(cell2.gridId, cell2.index, { value: cell2.value, notes: cell2.notes });
    const sel = document.querySelector(`[data-grid='${cell1.gridId}'][data-index='${cell1.index}']`);
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
    const g = parseInt(cell.dataset.grid), i = parseInt(cell.dataset.index), r = Math.floor(i/9), c = i%9;
    const currentGrid = document.getElementById(`grid-${g}`);
    if (currentGrid) {
      for (let n = 0; n < 9; n++) currentGrid.querySelector(`[data-index='${r*9 + n}']`)?.classList.add('highlighted'), currentGrid.querySelector(`[data-index='${n*9 + c}']`)?.classList.add('highlighted');
      const s = r - (r%3), o = c - (c%3);
      for (let n = 0; n < 3; n++) for (let t = 0; t < 3; t++) currentGrid.querySelector(`[data-index='${(s+n)*9 + o + t}']`)?.classList.add('highlighted');
    }
    const val = (userBoards[g] && userBoards[g][r]) ? userBoards[g][r][c] : (boards[g] && boards[g][r] ? boards[g][r][c] : 0);
    if (val !== 0 && highlightSameToggle && highlightSameToggle.checked) {
      document.querySelectorAll('.cell').forEach(e => {
        const ng = parseInt(e.dataset.grid), ti = parseInt(e.dataset.index), tr = Math.floor(ti/9), tc = ti%9;
        const v = (userBoards[ng] && userBoards[ng][tr]) ? userBoards[ng][tr][tc] : (boards[ng] && boards[ng][tr] ? boards[ng][tr][tc] : 0);
        if (v === val) e.classList.add('highlight-number');
      });
    }
    cell.classList.add('selected');
  }

  function giveHint() {
    if (isGameFinished) return;
    const empty = [];
    for (let g = 0; g < 5; g++) for (let i = 0; i < 81; i++) {
      const r = Math.floor(i/9), c = i%9;
      if ((userBoards[g] && userBoards[g][r] && userBoards[g][r][c]) === 0 && (boards[g] && boards[g][r] && boards[g][r][c] === 0)) empty.push({g,i});
    }
    if (!empty.length) return showNotification('No empty cells for a hint!','error');
    const pick = empty[Math.floor(Math.random()*empty.length)];
    const g = pick.g, i = pick.i, r = Math.floor(i/9), c = i%9;
    const correct = solutions[g] && solutions[g][r] ? solutions[g][r][c] : 0;
    const el = document.querySelector(`[data-grid='${g}'][data-index='${i}']`);
    if (el) selectCell(el);
    if (isPencilMode) { isPencilMode = false; if (pencilBtn) pencilBtn.classList.remove('active'); }
    handleInput(correct);
  }

  function checkMistakes() {
    if (isGameFinished) return;
    let mistakes = false;
    document.querySelectorAll('.cell.error').forEach(e => e.classList.remove('error'));
    for (let g = 0; g < 5; g++) for (let i = 0; i < 81; i++) {
      const r = Math.floor(i/9), c = i%9;
      if ((boards[g] && boards[g][r] && boards[g][r][c]) === 0 && (userBoards[g] && userBoards[g][r] && userBoards[g][r][c]) !== 0) {
        const val = userBoards[g][r][c];
        const sol = solutions[g] && solutions[g][r] ? solutions[g][r][c] : null;
        if (val !== sol) { mistakes = true; const el = document.querySelector(`[data-grid='${g}'][data-index='${i}']`); if (el) el.classList.add('error'); }
      }
    }
    if (mistakes) { playSound('error-sound'); showNotification('Mistakes highlighted.','error'); setTimeout(()=>document.querySelectorAll('.cell.error').forEach(e=>e.classList.remove('error')),2000); }
    else showNotification('No mistakes found so far!','success');
  }

  function checkForWin() {
    for (let g = 0; g < 5; g++) for (let r = 0; r < 9; r++) for (let c = 0; c < 9; c++) {
      const v = (userBoards[g] && userBoards[g][r]) ? userBoards[g][r][c] : (boards[g] && boards[g][r] ? boards[g][r][c] : 0);
      const sol = solutions[g] && solutions[g][r] ? solutions[g][r][c] : null;
      if (v !== sol) return false;
    }
    isGameFinished = true;
    if (timerInterval) clearInterval(timerInterval);
    playSound('win-sound');
    if (typeof confetti === 'function') confetti({ particleCount: 150, spread: 90, origin: { y: .6 }});
    const e = currentDifficulty;
    if (stats[e]) { stats[e].gamesWon++; if (stats[e].bestTime === null || seconds < stats[e].bestTime) { stats[e].bestTime = seconds; const bestM = document.getElementById('best-time-msg'); if (bestM) bestM.textContent = 'New best time!'; } else { const bestM = document.getElementById('best-time-msg'); if (bestM) bestM.textContent = ''; } saveStats(); }
    const winDiff = document.getElementById('win-difficulty'); if (winDiff) winDiff.textContent = e.replace('samurai-','');
    const winTime = document.getElementById('win-time'); if (winTime) winTime.textContent = formatTime(seconds);
    setTimeout(()=>{ if (winModal) winModal.style.display = 'flex'; location.hash = '#modal'; }, 500);
    return true;
  }

  function formatTime(s) { const m = Math.floor(s/60).toString().padStart(2,'0'); const sec = (s%60).toString().padStart(2,'0'); return `${m}:${sec}`; }
  function startTimer(){ if (timerInterval) clearInterval(timerInterval); timerInterval = setInterval(()=>{ if (!isGameFinished) { seconds++; if (timerElement) timerElement.textContent = formatTime(seconds); if (mobileTimerDisplay) mobileTimerDisplay.textContent = formatTime(seconds); } }, 1000); }
  function resetTimer(){ if (timerInterval) clearInterval(timerInterval); seconds = 0; if (timerElement) timerElement.textContent = '00:00'; if (mobileTimerDisplay) mobileTimerDisplay.textContent = '00:00'; }

  // -----------------------
  // 7) Game start / generate integration
  // -----------------------
  function startNewGame(difficulty = 'samurai-medium') {
    currentDifficulty = difficulty;
    if (difficultySelector) difficultySelector.value = difficulty;

    const solvedSet = buildDistinctSamuraiSolution();
    const { puzzle, solution } = generatePuzzleFromSolution(solvedSet, difficulty);
    boards = puzzle;
    solutions = solution;
    userBoards = deepCopy(puzzle);
    notes = Array(5).fill(null).map(()=>({}));
    historyStack = [];
    seconds = 0;
    isGameFinished = false;
    if (selectedCell) selectedCell.classList.remove('selected');
    selectedCell = null;

    createGridsDOM();
    resetTimer();
    startTimer();
  }

  // -----------------------
  // 8) Listeners for game controls
  // -----------------------
  function initGameListeners() {
    const newGameAction = () => { playSound('click-sound'); showConfirmation('Start a new game?', 'Any progress will be lost.', () => startNewGame(difficultySelector?.value || 'samurai-medium')); };
    const newGameBtn = document.getElementById('new-game-btn'); if (newGameBtn) newGameBtn.addEventListener('click', newGameAction);
    const newGameBtnBottom = document.getElementById('new-game-btn-bottom'); if (newGameBtnBottom) newGameBtnBottom.addEventListener('click', newGameAction);

    if (difficultySelector) difficultySelector.addEventListener('change', () => {
      const selected = difficultySelector.value;
      const selectedDifficulty = selected.replace('samurai-','');
      const targetFile = selectedDifficulty === 'medium' ? 'samurai-sudoku.html' : `${selectedDifficulty}-samurai.html`;
      if (!window.location.pathname.includes(targetFile)) window.location.href = targetFile;
    });

    if (samuraiGridContainer) samuraiGridContainer.addEventListener('click', e => {
      const cell = e.target.closest('.cell');
      if (cell) { playSound('click-sound'); selectCell(cell); }
    });

    const numberPad = document.querySelector('.number-pad'); if (numberPad) numberPad.addEventListener('click', e => {
      if (e.target.classList.contains('num-btn')) handleInput(parseInt(e.target.textContent));
      else if (e.target.id === 'erase-btn') handleInput(0);
    });

    if (pencilBtn) pencilBtn.addEventListener('click', () => { playSound('click-sound'); isPencilMode = !isPencilMode; pencilBtn.classList.toggle('active', isPencilMode); });

    const undoBtn = document.getElementById('undo-btn'); if (undoBtn) undoBtn.addEventListener('click', () => { playSound('click-sound'); undoLastMove(); });

    const solveBtn = document.getElementById('solve-btn'); if (solveBtn) solveBtn.addEventListener('click', () => {
      playSound('click-sound');
      showConfirmation('Reveal the solution?', 'This will end the game.', () => {
        userBoards = deepCopy(solutions);
        for (let g = 0; g < 5; g++) for (let r = 0; r < 9; r++) for (let c = 0; c < 9; c++) if (boards[g] && boards[g][r] && boards[g][r][c] === 0) boards[g][r][c] = solutions[g][r][c];
        notes = Array(5).fill(null).map(()=>({}));
        createGridsDOM();
        highlightRelevantCells(null);
        checkForWin();
      });
    });

    const hintBtn = document.getElementById('hint-btn'); if (hintBtn) hintBtn.addEventListener('click', () => { playSound('click-sound'); giveHint(); });
    const checkBtn = document.getElementById('check-btn'); if (checkBtn) checkBtn.addEventListener('click', () => { playSound('click-sound'); checkMistakes(); });
    const winNewGameBtn = document.getElementById('win-new-game-btn'); if (winNewGameBtn) winNewGameBtn.addEventListener('click', () => { playSound('click-sound'); history.back(); startNewGame(difficultySelector?.value || 'samurai-medium'); });

    document.addEventListener('keydown', e => {
      if (!selectedCell || isGameFinished) return;
      if (e.key >= '1' && e.key <= '9') handleInput(parseInt(e.key));
      else if (e.key === 'Backspace' || e.key === 'Delete') handleInput(0);
      else if (e.key.toLowerCase() === 'p') { playSound('click-sound'); isPencilMode = !isPencilMode; if (pencilBtn) pencilBtn.classList.toggle('active', isPencilMode); }
      else if (e.key.startsWith('Arrow')) {
        e.preventDefault();
        let g = parseInt(selectedCell.dataset.grid), i = parseInt(selectedCell.dataset.index), r = Math.floor(i/9), c = i%9;
        if (e.key === 'ArrowUp' && r > 0) i -= 9;
        else if (e.key === 'ArrowDown' && r < 8) i += 9;
        else if (e.key === 'ArrowLeft' && c > 0) i -= 1;
        else if (e.key === 'ArrowRight' && c < 8) i += 1;
        const cell = document.querySelector(`[data-grid='${g}'][data-index='${i}']`);
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
  startNewGame(difficultySelector?.value || 'samurai-medium');
});