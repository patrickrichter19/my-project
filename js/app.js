/**
 * TaskFlow - Modern Minimalist To-Do & Productivity App
 */

// Sound Synthesizer using Web Audio API
class SoundFX {
  constructor() {
    this.ctx = null;
    this.enabled = true;
  }

  init() {
    if (!this.ctx && (window.AudioContext || window.webkitAudioContext)) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playPop() {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(450, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(800, this.ctx.currentTime + 0.05);
      
      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.06);
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.06);
    } catch (e) {
      // Audio autoplay policy fallback
    }
  }

  playComplete() {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const notes = [523.25, 659.25, 783.99]; // C5, E5, G5 major triad
      
      notes.forEach((freq, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.06);
        
        gain.gain.setValueAtTime(0.15, now + i * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.06 + 0.25);
        
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + i * 0.06);
        osc.stop(now + i * 0.06 + 0.26);
      });
    } catch (e) {
      // Audio autoplay policy fallback
    }
  }

  playDelete() {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(260, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(140, this.ctx.currentTime + 0.08);
      
      gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.09);
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.09);
    } catch (e) {}
  }
}

// Initial Sample Data
const DEFAULT_CATEGORIES = [
  { id: 'work', name: 'Work', color: '#8b5cf6' },
  { id: 'personal', name: 'Personal', color: '#3b82f6' },
  { id: 'shopping', name: 'Shopping', color: '#10b981' },
  { id: 'ideas', name: 'Ideas & Projects', color: '#f59e0b' },
  { id: 'health', name: 'Health & Fitness', color: '#f43f5e' }
];

function getSampleTasks() {
  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
  const nextWeek = new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0];

  return [
    {
      id: 'task-1',
      title: 'Welcome to TaskFlow! Explore features',
      notes: 'Check out subtasks, priority levels, categories, and light/dark theme.',
      completed: false,
      priority: 'urgent',
      category: 'personal',
      dueDate: today,
      createdAt: new Date().toISOString(),
      subtasks: [
        { id: 'st-1', text: 'Check off a subtask', completed: false },
        { id: 'st-2', text: 'Try changing the priority to High or Medium', completed: false },
        { id: 'st-3', text: 'Test keyboard shortcut (Press ? or Ctrl+K)', completed: false }
      ]
    },
    {
      id: 'task-2',
      title: 'Prepare slides for product review meeting',
      notes: 'Highlight key sprint achievements, architecture updates, and next roadmap.',
      completed: false,
      priority: 'high',
      category: 'work',
      dueDate: tomorrow,
      createdAt: new Date().toISOString(),
      subtasks: [
        { id: 'st-4', text: 'Review metrics dashboard', completed: true },
        { id: 'st-5', text: 'Draft slide outline', completed: false }
      ]
    },
    {
      id: 'task-3',
      title: 'Pick up weekly groceries',
      notes: 'Fresh berries, oat milk, avocados, whole-grain bread, and coffee beans.',
      completed: false,
      priority: 'medium',
      category: 'shopping',
      dueDate: today,
      createdAt: new Date().toISOString(),
      subtasks: []
    },
    {
      id: 'task-4',
      title: '30-minute cardio & stretch workout',
      notes: 'Focus on posture and core strength.',
      completed: false,
      priority: 'medium',
      category: 'health',
      dueDate: today,
      createdAt: new Date().toISOString(),
      subtasks: []
    },
    {
      id: 'task-5',
      title: 'Draft proposal for side project idea',
      notes: 'Document architecture, tech stack choice, and MVP user stories.',
      completed: false,
      priority: 'low',
      category: 'ideas',
      dueDate: nextWeek,
      createdAt: new Date().toISOString(),
      subtasks: []
    },
    {
      id: 'task-6',
      title: 'Set up productivity workspace',
      notes: 'Clean desk and organize bookmarks.',
      completed: true,
      priority: 'low',
      category: 'personal',
      dueDate: today,
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      subtasks: []
    }
  ];
}

// App State
const state = {
  tasks: [],
  categories: [],
  currentView: 'all', // 'all', 'today', 'upcoming', 'important', 'completed', or categoryId
  searchQuery: '',
  priorityFilter: 'all',
  sortBy: 'created-desc',
  isDarkMode: false,
  sound: new SoundFX(),
  lastDeletedTask: null,
  activeExpandedSubtasks: new Set(),
  editingModalSubtasks: []
};

// LocalStorage Keys
const STORAGE_TASKS_KEY = 'taskflow_todos_v2';
const STORAGE_CATEGORIES_KEY = 'taskflow_categories_v2';
const STORAGE_THEME_KEY = 'taskflow_theme_v2';
const STORAGE_SOUND_KEY = 'taskflow_sound_v2';

// DOM Element Selectors
const elements = {
  // Navigation & Views
  viewNav: document.getElementById('viewNav'),
  categoryNav: document.getElementById('categoryNav'),
  countAll: document.getElementById('countAll'),
  countToday: document.getElementById('countToday'),
  countUpcoming: document.getElementById('countUpcoming'),
  countImportant: document.getElementById('countImportant'),
  countCompleted: document.getElementById('countCompleted'),
  progressPercent: document.getElementById('progressPercent'),
  progressBar: document.getElementById('progressBar'),
  progressSubtitle: document.getElementById('progressSubtitle'),

  // Header & Search
  currentDateStr: document.getElementById('currentDateStr'),
  currentDateFormatted: document.getElementById('currentDateFormatted'),
  globalSearchInput: document.getElementById('globalSearchInput'),
  clearSearchBtn: document.getElementById('clearSearchBtn'),
  themeToggleBtn: document.getElementById('themeToggleBtn'),
  themeIcon: document.getElementById('themeIcon'),
  soundToggleBtn: document.getElementById('soundToggleBtn'),
  soundIcon: document.getElementById('soundIcon'),
  mobileSidebarToggle: document.getElementById('mobileSidebarToggle'),
  closeSidebarBtn: document.getElementById('closeSidebarBtn'),
  sidebar: document.getElementById('sidebar'),
  mobileBackdrop: document.getElementById('mobileBackdrop'),

  // View Header & Filters
  viewTitle: document.getElementById('viewTitle'),
  viewDescription: document.getElementById('viewDescription'),
  activeFilterBadge: document.getElementById('activeFilterBadge'),
  priorityFilterSelect: document.getElementById('priorityFilterSelect'),
  sortSelect: document.getElementById('sortSelect'),
  bulkActionBtn: document.getElementById('bulkActionBtn'),
  bulkMenuDropdown: document.getElementById('bulkMenuDropdown'),
  markAllCompletedBtn: document.getElementById('markAllCompletedBtn'),
  clearCompletedBtn: document.getElementById('clearCompletedBtn'),
  resetDemoTasksBtn: document.getElementById('resetDemoTasksBtn'),

  // Quick Add Form
  quickAddForm: document.getElementById('quickAddForm'),
  quickTaskTitle: document.getElementById('quickTaskTitle'),
  quickPriority: document.getElementById('quickPriority'),
  quickDueDate: document.getElementById('quickDueDate'),
  quickCategory: document.getElementById('quickCategory'),
  quickExpandNotesBtn: document.getElementById('quickExpandNotesBtn'),
  quickNotesContainer: document.getElementById('quickNotesContainer'),
  quickTaskNotes: document.getElementById('quickTaskNotes'),

  // Task Lists
  activeTasksContainer: document.getElementById('activeTasksContainer'),
  completedTasksSection: document.getElementById('completedTasksSection'),
  completedTasksContainer: document.getElementById('completedTasksContainer'),
  toggleCompletedBtn: document.getElementById('toggleCompletedBtn'),
  completedAccordionIcon: document.getElementById('completedAccordionIcon'),
  completedCountNum: document.getElementById('completedCountNum'),
  clearCompletedInlineBtn: document.getElementById('clearCompletedInlineBtn'),
  emptyState: document.getElementById('emptyState'),
  emptyStateTitle: document.getElementById('emptyStateTitle'),
  emptyStateDesc: document.getElementById('emptyStateDesc'),
  emptyStateAddBtn: document.getElementById('emptyStateAddBtn'),

  // Task Details Modal
  taskModal: document.getElementById('taskModal'),
  modalTitle: document.getElementById('modalTitle'),
  taskModalForm: document.getElementById('taskModalForm'),
  modalTaskId: document.getElementById('modalTaskId'),
  modalTaskTitle: document.getElementById('modalTaskTitle'),
  modalTaskPriority: document.getElementById('modalTaskPriority'),
  modalTaskDueDate: document.getElementById('modalTaskDueDate'),
  modalTaskCategory: document.getElementById('modalTaskCategory'),
  modalTaskNotes: document.getElementById('modalTaskNotes'),
  modalSubtaskCount: document.getElementById('modalSubtaskCount'),
  newSubtaskInput: document.getElementById('newSubtaskInput'),
  addSubtaskBtn: document.getElementById('addSubtaskBtn'),
  modalSubtaskList: document.getElementById('modalSubtaskList'),
  closeTaskModalBtn: document.getElementById('closeTaskModalBtn'),
  cancelTaskModalBtn: document.getElementById('cancelTaskModalBtn'),
  saveTaskModalBtn: document.getElementById('saveTaskModalBtn'),
  deleteTaskFromModalBtn: document.getElementById('deleteTaskFromModalBtn'),
  openNewTaskModalBtn: document.getElementById('openNewTaskModalBtn'),

  // Category Modal
  addCategoryBtn: document.getElementById('addCategoryBtn'),
  categoryModal: document.getElementById('categoryModal'),
  categoryForm: document.getElementById('categoryForm'),
  categoryNameInput: document.getElementById('categoryNameInput'),
  closeCategoryModalBtn: document.getElementById('closeCategoryModalBtn'),
  cancelCategoryBtn: document.getElementById('cancelCategoryBtn'),

  // Shortcuts & Data Modals
  shortcutsBtn: document.getElementById('shortcutsBtn'),
  shortcutsModal: document.getElementById('shortcutsModal'),
  closeShortcutsModalBtn: document.getElementById('closeShortcutsModalBtn'),
  exportImportBtn: document.getElementById('exportImportBtn'),
  dataModal: document.getElementById('dataModal'),
  closeDataModalBtn: document.getElementById('closeDataModalBtn'),
  downloadBackupBtn: document.getElementById('downloadBackupBtn'),
  copyMarkdownBtn: document.getElementById('copyMarkdownBtn'),
  importJsonArea: document.getElementById('importJsonArea'),
  importDataBtn: document.getElementById('importDataBtn'),

  // Toast Container
  toastContainer: document.getElementById('toastContainer')
};

// INITIALIZATION
function initApp() {
  loadThemePreference();
  loadSoundPreference();
  loadData();
  renderDateHeader();
  renderCategoryNav();
  populateCategoryDropdowns();
  renderTasks();
  attachEventListeners();
  updateLucideIcons();
}

// STORAGE
function loadData() {
  try {
    const storedTasks = localStorage.getItem(STORAGE_TASKS_KEY);
    if (storedTasks) {
      state.tasks = JSON.parse(storedTasks);
    } else {
      state.tasks = getSampleTasks();
      saveTasks();
    }

    const storedCategories = localStorage.getItem(STORAGE_CATEGORIES_KEY);
    if (storedCategories) {
      state.categories = JSON.parse(storedCategories);
    } else {
      state.categories = [...DEFAULT_CATEGORIES];
      saveCategories();
    }
  } catch (e) {
    console.error('Error loading data from localStorage', e);
    state.tasks = getSampleTasks();
    state.categories = [...DEFAULT_CATEGORIES];
  }
}

function saveTasks() {
  try {
    localStorage.setItem(STORAGE_TASKS_KEY, JSON.stringify(state.tasks));
  } catch (e) {
    console.error('Error saving tasks to localStorage', e);
  }
}

function saveCategories() {
  try {
    localStorage.setItem(STORAGE_CATEGORIES_KEY, JSON.stringify(state.categories));
  } catch (e) {
    console.error('Error saving categories', e);
  }
}

// THEME & SOUND
function loadThemePreference() {
  const saved = localStorage.getItem(STORAGE_THEME_KEY);
  if (saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    state.isDarkMode = true;
    document.documentElement.classList.add('dark');
  } else {
    state.isDarkMode = false;
    document.documentElement.classList.remove('dark');
  }
  updateThemeIcon();
}

function toggleTheme() {
  state.isDarkMode = !state.isDarkMode;
  if (state.isDarkMode) {
    document.documentElement.classList.add('dark');
    localStorage.setItem(STORAGE_THEME_KEY, 'dark');
  } else {
    document.documentElement.classList.remove('dark');
    localStorage.setItem(STORAGE_THEME_KEY, 'light');
  }
  updateThemeIcon();
  state.sound.playPop();
}

function updateThemeIcon() {
  if (elements.themeIcon) {
    elements.themeIcon.setAttribute('data-lucide', state.isDarkMode ? 'sun' : 'moon');
    updateLucideIcons();
  }
}

function loadSoundPreference() {
  const saved = localStorage.getItem(STORAGE_SOUND_KEY);
  state.sound.enabled = saved !== 'disabled';
  updateSoundIcon();
}

function toggleSound() {
  state.sound.enabled = !state.sound.enabled;
  localStorage.setItem(STORAGE_SOUND_KEY, state.sound.enabled ? 'enabled' : 'disabled');
  updateSoundIcon();
  if (state.sound.enabled) {
    state.sound.playPop();
    showToast('Sound enabled', 'info');
  } else {
    showToast('Sound muted', 'info');
  }
}

function updateSoundIcon() {
  if (elements.soundIcon) {
    elements.soundIcon.setAttribute('data-lucide', state.sound.enabled ? 'volume-2' : 'volume-x');
    elements.soundIcon.className = `w-4 h-4 ${state.sound.enabled ? 'text-emerald-500' : 'text-slate-400'}`;
    updateLucideIcons();
  }
}

// DATE FORMATTING
function renderDateHeader() {
  const now = new Date();
  const dayName = now.toLocaleDateString(undefined, { weekday: 'long' });
  const formatted = now.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  if (elements.currentDateStr) elements.currentDateStr.textContent = dayName;
  if (elements.currentDateFormatted) elements.currentDateFormatted.textContent = formatted;

  // Pre-fill quick date picker with today
  if (elements.quickDueDate) {
    elements.quickDueDate.value = now.toISOString().split('T')[0];
  }
}

function formatDueDate(dueDateStr) {
  if (!dueDateStr) return null;
  const todayStr = new Date().toISOString().split('T')[0];
  const targetDate = new Date(dueDateStr + 'T00:00:00');
  const todayDate = new Date(todayStr + 'T00:00:00');
  
  const diffDays = Math.round((targetDate - todayDate) / 86400000);

  if (diffDays < 0) {
    return {
      text: `${Math.abs(diffDays)}d overdue`,
      type: 'overdue',
      color: 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900/60'
    };
  } else if (diffDays === 0) {
    return {
      text: 'Today',
      type: 'today',
      color: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900/60'
    };
  } else if (diffDays === 1) {
    return {
      text: 'Tomorrow',
      type: 'tomorrow',
      color: 'text-sky-600 dark:text-sky-400 bg-sky-50 dark:bg-sky-950/40 border-sky-200 dark:border-sky-900/60'
    };
  } else {
    const formatted = targetDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    return {
      text: formatted,
      type: 'future',
      color: 'text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700'
    };
  }
}

// CATEGORIES & DROPDOWNS
function renderCategoryNav() {
  if (!elements.categoryNav) return;
  elements.categoryNav.innerHTML = '';

  state.categories.forEach(cat => {
    const count = state.tasks.filter(t => !t.completed && t.category === cat.id).length;
    const isActive = state.currentView === cat.id;

    const btn = document.createElement('button');
    btn.dataset.category = cat.id;
    btn.className = `w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-xl transition-colors ${
      isActive 
        ? 'bg-brand-50 dark:bg-brand-950/40 text-brand-700 dark:text-brand-300' 
        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
    }`;
    btn.innerHTML = `
      <span class="flex items-center gap-2.5 truncate">
        <span class="w-2.5 h-2.5 rounded-full shrink-0" style="background-color: ${cat.color}"></span>
        <span class="truncate">${escapeHtml(cat.name)}</span>
      </span>
      <span class="text-xs font-semibold px-2 py-0.5 rounded-full ${
        isActive 
          ? 'bg-brand-100 dark:bg-brand-900/60 text-brand-700 dark:text-brand-300' 
          : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
      }">${count}</span>
    `;

    btn.addEventListener('click', () => {
      switchView(cat.id);
      closeMobileSidebar();
    });

    elements.categoryNav.appendChild(btn);
  });
}

function populateCategoryDropdowns() {
  const optionsHtml = state.categories.map(c => 
    `<option value="${c.id}">${escapeHtml(c.name)}</option>`
  ).join('');

  if (elements.quickCategory) {
    elements.quickCategory.innerHTML = optionsHtml;
  }
  if (elements.modalTaskCategory) {
    elements.modalTaskCategory.innerHTML = optionsHtml;
  }
}

// VIEW SWITCHING
function switchView(viewKey) {
  state.currentView = viewKey;

  // Update nav item active styles
  const allNavBtns = elements.viewNav.querySelectorAll('button[data-view]');
  allNavBtns.forEach(btn => {
    const isTarget = btn.getAttribute('data-view') === viewKey;
    btn.className = `nav-item w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-xl transition-colors ${
      isTarget 
        ? 'bg-brand-50 dark:bg-brand-950/40 text-brand-700 dark:text-brand-300' 
        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
    }`;
    const badge = btn.querySelector('span:last-child');
    if (badge) {
      badge.className = `text-xs font-semibold px-2 py-0.5 rounded-full ${
        isTarget 
          ? 'bg-brand-100 dark:bg-brand-900/60 text-brand-700 dark:text-brand-300' 
          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
      }`;
    }
  });

  renderCategoryNav();
  updateViewHeader();
  renderTasks();
}

function updateViewHeader() {
  let title = 'All Tasks';
  let desc = 'Keep track of everything on your plate.';

  const categoryMatch = state.categories.find(c => c.id === state.currentView);

  if (categoryMatch) {
    title = categoryMatch.name;
    desc = `Tasks categorized under ${categoryMatch.name}.`;
  } else {
    switch (state.currentView) {
      case 'today':
        title = "Today's Tasks";
        desc = 'Items scheduled for completion today.';
        break;
      case 'upcoming':
        title = 'Upcoming Tasks';
        desc = 'Planned for tomorrow and beyond.';
        break;
      case 'important':
        title = 'High Priority Tasks';
        desc = 'Urgent & high priority items requiring focus.';
        break;
      case 'completed':
        title = 'Completed Tasks';
        desc = 'Celebrate what you have accomplished.';
        break;
      case 'all':
      default:
        title = 'All Tasks';
        desc = 'Keep track of everything on your plate.';
        break;
    }
  }

  if (elements.viewTitle) elements.viewTitle.textContent = title;
  if (elements.viewDescription) elements.viewDescription.textContent = desc;
}

// FILTERING & SORTING
function getFilteredTasks() {
  const todayStr = new Date().toISOString().split('T')[0];

  return state.tasks.filter(task => {
    // 1. Search Query filter
    if (state.searchQuery.trim()) {
      const q = state.searchQuery.toLowerCase();
      const matchTitle = task.title.toLowerCase().includes(q);
      const matchNotes = (task.notes || '').toLowerCase().includes(q);
      const matchSubtasks = (task.subtasks || []).some(st => st.text.toLowerCase().includes(q));
      if (!matchTitle && !matchNotes && !matchSubtasks) return false;
    }

    // 2. Priority Filter
    if (state.priorityFilter !== 'all') {
      if (task.priority !== state.priorityFilter) return false;
    }

    // 3. View Filter
    if (state.currentView === 'all') {
      return true;
    } else if (state.currentView === 'today') {
      return task.dueDate === todayStr;
    } else if (state.currentView === 'upcoming') {
      return task.dueDate && task.dueDate > todayStr;
    } else if (state.currentView === 'important') {
      return task.priority === 'urgent' || task.priority === 'high';
    } else if (state.currentView === 'completed') {
      return task.completed;
    } else {
      // Must be a category ID
      return task.category === state.currentView;
    }
  });
}

function sortTaskList(list) {
  const priorityWeight = { urgent: 4, high: 3, medium: 2, low: 1 };

  return [...list].sort((a, b) => {
    switch (state.sortBy) {
      case 'created-asc':
        return new Date(a.createdAt) - new Date(b.createdAt);
      case 'created-desc':
        return new Date(b.createdAt) - new Date(a.createdAt);
      case 'due-asc':
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return a.dueDate.localeCompare(b.dueDate);
      case 'due-desc':
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return b.dueDate.localeCompare(a.dueDate);
      case 'priority-desc':
        return (priorityWeight[b.priority] || 0) - (priorityWeight[a.priority] || 0);
      case 'alpha-asc':
        return a.title.localeCompare(b.title);
      default:
        return 0;
    }
  });
}

// RENDERING TASKS & COUNTS
function renderTasks() {
  updateCountsAndProgress();

  const filtered = getFilteredTasks();
  const sorted = sortTaskList(filtered);

  const activeTasks = sorted.filter(t => !t.completed);
  const completedTasks = sorted.filter(t => t.completed);

  // Render Active Tasks
  elements.activeTasksContainer.innerHTML = '';
  if (activeTasks.length === 0) {
    if (state.currentView !== 'completed') {
      elements.emptyState.classList.remove('hidden');
    } else {
      elements.emptyState.classList.add('hidden');
    }
  } else {
    elements.emptyState.classList.add('hidden');
    activeTasks.forEach(task => {
      elements.activeTasksContainer.appendChild(createTaskCardElement(task));
    });
  }

  // Render Completed Tasks
  elements.completedTasksContainer.innerHTML = '';
  if (completedTasks.length > 0 && state.currentView !== 'completed') {
    elements.completedTasksSection.classList.remove('hidden');
    elements.completedCountNum.textContent = completedTasks.length;
    completedTasks.forEach(task => {
      elements.completedTasksContainer.appendChild(createTaskCardElement(task));
    });
  } else if (state.currentView === 'completed') {
    elements.completedTasksSection.classList.add('hidden');
    if (completedTasks.length === 0) {
      elements.emptyState.classList.remove('hidden');
      elements.emptyStateTitle.textContent = 'No completed tasks yet';
      elements.emptyStateDesc.textContent = 'Complete some tasks and celebrate your progress!';
    } else {
      elements.emptyState.classList.add('hidden');
      completedTasks.forEach(task => {
        elements.activeTasksContainer.appendChild(createTaskCardElement(task));
      });
    }
  } else {
    elements.completedTasksSection.classList.add('hidden');
  }

  updateLucideIcons();
}

function updateCountsAndProgress() {
  const todayStr = new Date().toISOString().split('T')[0];
  
  const totalTasks = state.tasks.length;
  const totalCompleted = state.tasks.filter(t => t.completed).length;
  const totalActive = totalTasks - totalCompleted;

  const countToday = state.tasks.filter(t => !t.completed && t.dueDate === todayStr).length;
  const countUpcoming = state.tasks.filter(t => !t.completed && t.dueDate && t.dueDate > todayStr).length;
  const countImportant = state.tasks.filter(t => !t.completed && (t.priority === 'urgent' || t.priority === 'high')).length;

  if (elements.countAll) elements.countAll.textContent = totalActive;
  if (elements.countToday) elements.countToday.textContent = countToday;
  if (elements.countUpcoming) elements.countUpcoming.textContent = countUpcoming;
  if (elements.countImportant) elements.countImportant.textContent = countImportant;
  if (elements.countCompleted) elements.countCompleted.textContent = totalCompleted;

  // Productivity Progress
  const percent = totalTasks === 0 ? 0 : Math.round((totalCompleted / totalTasks) * 100);
  if (elements.progressPercent) elements.progressPercent.textContent = `${percent}%`;
  if (elements.progressBar) elements.progressBar.style.width = `${percent}%`;
  if (elements.progressSubtitle) {
    elements.progressSubtitle.textContent = `${totalCompleted} of ${totalTasks} tasks completed`;
  }
}

// TASK CARD DOM BUILDER
function createTaskCardElement(task) {
  const card = document.createElement('div');
  card.className = `task-item bg-white dark:bg-slate-900 border ${
    task.completed 
      ? 'border-slate-200/50 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-900/40' 
      : 'border-slate-200 dark:border-slate-800 shadow-sm hover:border-slate-300 dark:hover:border-slate-700'
  } rounded-2xl p-4 transition-all`;
  card.id = `task-card-${task.id}`;

  const category = state.categories.find(c => c.id === task.category) || { name: 'General', color: '#8b5cf6' };
  const dueInfo = formatDueDate(task.dueDate);

  // Priority indicator styles
  const priorityBadges = {
    urgent: { label: 'Urgent', class: 'text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/50 border-rose-200 dark:border-rose-900/60' },
    high: { label: 'High', class: 'text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/50 border-amber-200 dark:border-amber-900/60' },
    medium: { label: 'Medium', class: 'text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/50 border-blue-200 dark:border-blue-900/60' },
    low: { label: 'Low', class: 'text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700' }
  };
  const pBadge = priorityBadges[task.priority] || priorityBadges.medium;

  const totalSubtasks = (task.subtasks || []).length;
  const completedSubtasks = (task.subtasks || []).filter(st => st.completed).length;
  const isSubtasksExpanded = state.activeExpandedSubtasks.has(task.id);

  card.innerHTML = `
    <div class="flex items-start gap-3.5">
      <!-- Custom Checkbox -->
      <button 
        type="button" 
        data-action="toggle-task" 
        data-id="${task.id}" 
        class="checkbox-bounce mt-0.5 w-5 h-5 rounded-lg border-2 ${
          task.completed 
            ? 'bg-emerald-500 border-emerald-500 text-white' 
            : 'border-slate-300 dark:border-slate-600 hover:border-brand-500 bg-transparent text-transparent'
        } flex items-center justify-center shrink-0 transition-colors cursor-pointer"
        title="${task.completed ? 'Mark incomplete' : 'Mark completed'}"
      >
        <i data-lucide="check" class="w-3.5 h-3.5 stroke-[3]"></i>
      </button>

      <!-- Task Content -->
      <div class="flex-1 min-w-0">
        <div class="flex items-start justify-between gap-2">
          <p class="task-title text-sm font-semibold leading-snug break-words ${
            task.completed ? 'completed' : 'text-slate-900 dark:text-slate-100'
          }">
            ${escapeHtml(task.title)}
          </p>

          <!-- Card Actions (Edit, Delete) -->
          <div class="flex items-center gap-1 opacity-60 hover:opacity-100 transition-opacity shrink-0">
            <button 
              type="button" 
              data-action="edit-task" 
              data-id="${task.id}" 
              class="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
              title="Edit Task"
            >
              <i data-lucide="pencil" class="w-3.5 h-3.5"></i>
            </button>
            <button 
              type="button" 
              data-action="delete-task" 
              data-id="${task.id}" 
              class="p-1 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 text-slate-400 hover:text-rose-500 transition-colors"
              title="Delete Task"
            >
              <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
            </button>
          </div>
        </div>

        <!-- Notes Snippet if present -->
        ${task.notes ? `
          <p class="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
            ${escapeHtml(task.notes)}
          </p>
        ` : ''}

        <!-- Badges Row: Category, Due Date, Priority, Subtasks pill -->
        <div class="flex items-center gap-2 mt-2.5 flex-wrap text-xs">
          <!-- Category Pill -->
          <span class="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700 font-medium text-[11px]">
            <span class="w-1.5 h-1.5 rounded-full" style="background-color: ${category.color}"></span>
            <span>${escapeHtml(category.name)}</span>
          </span>

          <!-- Due Date Pill -->
          ${dueInfo ? `
            <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md border font-medium text-[11px] ${dueInfo.color}">
              <i data-lucide="calendar" class="w-3 h-3"></i>
              <span>${dueInfo.text}</span>
            </span>
          ` : ''}

          <!-- Priority Pill -->
          <span class="inline-flex items-center px-2 py-0.5 rounded-md border font-medium text-[11px] ${pBadge.class}">
            ${pBadge.label}
          </span>

          <!-- Subtasks Toggle Pill (if any subtasks) -->
          ${totalSubtasks > 0 ? `
            <button 
              type="button" 
              data-action="toggle-subtasks-accordion" 
              data-id="${task.id}" 
              class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md border text-[11px] font-medium transition-colors ${
                completedSubtasks === totalSubtasks 
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300' 
                  : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-brand-500'
              }"
            >
              <i data-lucide="list-checks" class="w-3 h-3"></i>
              <span>${completedSubtasks}/${totalSubtasks} steps</span>
              <i data-lucide="${isSubtasksExpanded ? 'chevron-up' : 'chevron-down'}" class="w-3 h-3"></i>
            </button>
          ` : ''}
        </div>

        <!-- Inline Subtasks List (Collapsible) -->
        ${totalSubtasks > 0 && isSubtasksExpanded ? `
          <div class="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 space-y-1.5">
            ${task.subtasks.map(st => `
              <div class="flex items-center gap-2 text-xs py-0.5">
                <button 
                  type="button" 
                  data-action="toggle-subtask" 
                  data-taskid="${task.id}" 
                  data-subtaskid="${st.id}" 
                  class="w-3.5 h-3.5 rounded border ${
                    st.completed 
                      ? 'bg-emerald-500 border-emerald-500 text-white' 
                      : 'border-slate-300 dark:border-slate-600 hover:border-brand-500'
                  } flex items-center justify-center shrink-0 cursor-pointer"
                >
                  <i data-lucide="check" class="w-2.5 h-2.5 stroke-[3] ${st.completed ? '' : 'hidden'}"></i>
                </button>
                <span class="${st.completed ? 'line-through text-slate-400 dark:text-slate-500' : 'text-slate-700 dark:text-slate-300'}">
                  ${escapeHtml(st.text)}
                </span>
              </div>
            `).join('')}
          </div>
        ` : ''}

      </div>
    </div>
  `;

  // Attach card delegation events
  card.addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;
    const action = btn.dataset.action;

    if (action === 'toggle-task') {
      e.stopPropagation();
      toggleTaskCompleted(btn.dataset.id);
    } else if (action === 'edit-task') {
      e.stopPropagation();
      openEditModal(btn.dataset.id);
    } else if (action === 'delete-task') {
      e.stopPropagation();
      deleteTask(btn.dataset.id);
    } else if (action === 'toggle-subtasks-accordion') {
      e.stopPropagation();
      toggleSubtasksExpand(btn.dataset.id);
    } else if (action === 'toggle-subtask') {
      e.stopPropagation();
      toggleInlineSubtask(btn.dataset.taskid, btn.dataset.subtaskid);
    }
  });

  return card;
}

// TASK ACTIONS
function toggleTaskCompleted(taskId) {
  const task = state.tasks.find(t => t.id === taskId);
  if (!task) return;

  task.completed = !task.completed;
  saveTasks();

  if (task.completed) {
    state.sound.playComplete();
    // Confetti celebration
    if (typeof confetti === 'function') {
      confetti({
        particleCount: 35,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#8b5cf6', '#10b981', '#3b82f6', '#f59e0b']
      });
    }
    showToast('Task marked complete! 🎉', 'success');
  } else {
    state.sound.playPop();
  }

  renderTasks();
}

function deleteTask(taskId) {
  const index = state.tasks.findIndex(t => t.id === taskId);
  if (index === -1) return;

  const [removedTask] = state.tasks.splice(index, 1);
  state.lastDeletedTask = { task: removedTask, index };
  saveTasks();
  state.sound.playDelete();
  renderTasks();

  showToast(`Deleted "${removedTask.title.slice(0, 20)}..."`, 'undo', () => {
    // Undo callback
    state.tasks.splice(index, 0, removedTask);
    saveTasks();
    renderTasks();
    state.sound.playPop();
    showToast('Task restored!', 'info');
  });
}

function toggleSubtasksExpand(taskId) {
  if (state.activeExpandedSubtasks.has(taskId)) {
    state.activeExpandedSubtasks.delete(taskId);
  } else {
    state.activeExpandedSubtasks.add(taskId);
  }
  renderTasks();
}

function toggleInlineSubtask(taskId, subtaskId) {
  const task = state.tasks.find(t => t.id === taskId);
  if (!task || !task.subtasks) return;

  const st = task.subtasks.find(s => s.id === subtaskId);
  if (!st) return;

  st.completed = !st.completed;
  saveTasks();
  state.sound.playPop();
  renderTasks();
}

// QUICK ADD FORM
function handleQuickAdd(e) {
  e.preventDefault();
  const title = elements.quickTaskTitle.value.trim();
  if (!title) return;

  const newTask = {
    id: 'task-' + Date.now(),
    title: title,
    notes: elements.quickTaskNotes.value.trim(),
    completed: false,
    priority: elements.quickPriority.value || 'medium',
    category: elements.quickCategory.value || (state.categories[0] ? state.categories[0].id : 'general'),
    dueDate: elements.quickDueDate.value || '',
    createdAt: new Date().toISOString(),
    subtasks: []
  };

  state.tasks.unshift(newTask);
  saveTasks();
  state.sound.playPop();

  // Reset inputs
  elements.quickTaskTitle.value = '';
  elements.quickTaskNotes.value = '';
  elements.quickNotesContainer.classList.add('hidden');
  renderTasks();

  showToast('Task added! ✨', 'success');
}

// MODAL HANDLING: EDIT / CREATE
function openEditModal(taskId) {
  const task = state.tasks.find(t => t.id === taskId);
  if (!task) return;

  elements.modalTitle.textContent = 'Edit Task';
  elements.modalTaskId.value = task.id;
  elements.modalTaskTitle.value = task.title;
  elements.modalTaskPriority.value = task.priority;
  elements.modalTaskDueDate.value = task.dueDate || '';
  elements.modalTaskCategory.value = task.category;
  elements.modalTaskNotes.value = task.notes || '';
  elements.deleteTaskFromModalBtn.classList.remove('hidden');

  state.editingModalSubtasks = JSON.parse(JSON.stringify(task.subtasks || []));
  renderModalSubtasks();

  elements.taskModal.classList.remove('hidden');
  elements.modalTaskTitle.focus();
  updateLucideIcons();
}

function openCreateModal() {
  elements.modalTitle.textContent = 'Create Task';
  elements.modalTaskId.value = '';
  elements.modalTaskTitle.value = '';
  elements.modalTaskPriority.value = 'medium';
  elements.modalTaskDueDate.value = new Date().toISOString().split('T')[0];
  elements.modalTaskCategory.value = state.categories[0] ? state.categories[0].id : 'work';
  elements.modalTaskNotes.value = '';
  elements.deleteTaskFromModalBtn.classList.add('hidden');

  state.editingModalSubtasks = [];
  renderModalSubtasks();

  elements.taskModal.classList.remove('hidden');
  elements.modalTaskTitle.focus();
  updateLucideIcons();
}

function closeTaskModal() {
  elements.taskModal.classList.add('hidden');
}

function renderModalSubtasks() {
  elements.modalSubtaskList.innerHTML = '';
  const completedCount = state.editingModalSubtasks.filter(s => s.completed).length;
  elements.modalSubtaskCount.textContent = `${completedCount} of ${state.editingModalSubtasks.length} done`;

  state.editingModalSubtasks.forEach((st, idx) => {
    const item = document.createElement('div');
    item.className = 'flex items-center gap-2 p-1.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60';
    item.innerHTML = `
      <input type="checkbox" ${st.completed ? 'checked' : ''} data-index="${idx}" class="modal-subtask-toggle rounded accent-brand-600 cursor-pointer">
      <input type="text" value="${escapeHtml(st.text)}" data-index="${idx}" class="modal-subtask-text flex-1 text-xs bg-transparent text-slate-800 dark:text-slate-200 outline-none">
      <button type="button" data-index="${idx}" class="modal-subtask-del text-slate-400 hover:text-rose-500 p-1">
        <i data-lucide="x" class="w-3.5 h-3.5"></i>
      </button>
    `;

    item.querySelector('.modal-subtask-toggle').addEventListener('change', (e) => {
      state.editingModalSubtasks[idx].completed = e.target.checked;
      renderModalSubtasks();
    });

    item.querySelector('.modal-subtask-text').addEventListener('input', (e) => {
      state.editingModalSubtasks[idx].text = e.target.value;
    });

    item.querySelector('.modal-subtask-del').addEventListener('click', () => {
      state.editingModalSubtasks.splice(idx, 1);
      renderModalSubtasks();
    });

    elements.modalSubtaskList.appendChild(item);
  });

  updateLucideIcons();
}

function handleAddModalSubtask() {
  const text = elements.newSubtaskInput.value.trim();
  if (!text) return;

  state.editingModalSubtasks.push({
    id: 'st-' + Date.now(),
    text: text,
    completed: false
  });
  elements.newSubtaskInput.value = '';
  renderModalSubtasks();
}

function handleSaveTaskModal() {
  const title = elements.modalTaskTitle.value.trim();
  if (!title) {
    elements.modalTaskTitle.focus();
    return;
  }

  const taskId = elements.modalTaskId.value;
  if (taskId) {
    // Update existing task
    const task = state.tasks.find(t => t.id === taskId);
    if (task) {
      task.title = title;
      task.priority = elements.modalTaskPriority.value;
      task.dueDate = elements.modalTaskDueDate.value;
      task.category = elements.modalTaskCategory.value;
      task.notes = elements.modalTaskNotes.value.trim();
      task.subtasks = state.editingModalSubtasks;
      saveTasks();
      showToast('Task updated!', 'success');
    }
  } else {
    // Create new task
    const newTask = {
      id: 'task-' + Date.now(),
      title: title,
      notes: elements.modalTaskNotes.value.trim(),
      completed: false,
      priority: elements.modalTaskPriority.value,
      category: elements.modalTaskCategory.value,
      dueDate: elements.modalTaskDueDate.value,
      createdAt: new Date().toISOString(),
      subtasks: state.editingModalSubtasks
    };
    state.tasks.unshift(newTask);
    saveTasks();
    showToast('Task created! 🎉', 'success');
  }

  state.sound.playPop();
  closeTaskModal();
  renderTasks();
}

function handleDeleteFromModal() {
  const taskId = elements.modalTaskId.value;
  if (!taskId) return;
  closeTaskModal();
  deleteTask(taskId);
}

// CATEGORY MODAL
function openCategoryModal() {
  elements.categoryNameInput.value = '';
  elements.categoryModal.classList.remove('hidden');
  elements.categoryNameInput.focus();
}

function closeCategoryModal() {
  elements.categoryModal.classList.add('hidden');
}

function handleCreateCategory(e) {
  e.preventDefault();
  const name = elements.categoryNameInput.value.trim();
  if (!name) return;

  const colorRadio = document.querySelector('input[name="catColor"]:checked');
  const color = colorRadio ? colorRadio.value : '#8b5cf6';
  const id = name.toLowerCase().replace(/[^a-z0-9]/g, '-') + '-' + Math.floor(Math.random() * 1000);

  state.categories.push({ id, name, color });
  saveCategories();
  populateCategoryDropdowns();
  renderCategoryNav();
  closeCategoryModal();
  state.sound.playPop();
  showToast(`Created category "${name}"`, 'success');
}

// DATA EXPORT / IMPORT
function openDataModal() {
  elements.dataModal.classList.remove('hidden');
}
function closeDataModal() {
  elements.dataModal.classList.add('hidden');
}

function downloadBackupJSON() {
  const data = {
    version: 2,
    exportDate: new Date().toISOString(),
    tasks: state.tasks,
    categories: state.categories
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `taskflow-backup-${new Date().toISOString().split('T')[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
  showToast('Backup downloaded!', 'success');
}

function copyTasksMarkdown() {
  let md = `# TaskFlow Tasks (${new Date().toLocaleDateString()})\n\n`;
  state.tasks.forEach(t => {
    const status = t.completed ? '[x]' : '[ ]';
    const due = t.dueDate ? ` (Due: ${t.dueDate})` : '';
    const prio = ` [${t.priority.toUpperCase()}]`;
    md += `- ${status} ${t.title}${prio}${due}\n`;
    if (t.notes) md += `  - Note: ${t.notes}\n`;
    if (t.subtasks && t.subtasks.length) {
      t.subtasks.forEach(st => {
        md += `    - ${st.completed ? '[x]' : '[ ]'} ${st.text}\n`;
      });
    }
  });

  navigator.clipboard.writeText(md).then(() => {
    showToast('Markdown copied to clipboard!', 'success');
  }).catch(() => {
    showToast('Could not copy to clipboard', 'info');
  });
}

function handleImportData() {
  const text = elements.importJsonArea.value.trim();
  if (!text) return;

  try {
    const parsed = JSON.parse(text);
    if (Array.isArray(parsed.tasks)) {
      state.tasks = parsed.tasks;
      if (Array.isArray(parsed.categories)) {
        state.categories = parsed.categories;
        saveCategories();
        populateCategoryDropdowns();
        renderCategoryNav();
      }
      saveTasks();
      renderTasks();
      closeDataModal();
      elements.importJsonArea.value = '';
      showToast('Data successfully imported!', 'success');
      state.sound.playComplete();
    } else {
      alert('Invalid backup format: missing "tasks" array.');
    }
  } catch (err) {
    alert('Invalid JSON: Please check the pasted data.');
  }
}

// BULK ACTIONS
function markAllComplete() {
  const uncompleted = state.tasks.filter(t => !t.completed);
  if (uncompleted.length === 0) {
    showToast('All tasks are already completed!', 'info');
    return;
  }

  uncompleted.forEach(t => t.completed = true);
  saveTasks();
  state.sound.playComplete();
  if (typeof confetti === 'function') {
    confetti({ particleCount: 50, spread: 70 });
  }
  renderTasks();
  showToast('All tasks marked complete! 🎉', 'success');
}

function clearCompletedTasks() {
  const beforeCount = state.tasks.length;
  state.tasks = state.tasks.filter(t => !t.completed);
  saveTasks();
  renderTasks();
  state.sound.playPop();
  showToast('Cleared completed tasks', 'info');
}

function resetDemoTasks() {
  if (confirm('Reset to sample tasks? This will replace current tasks.')) {
    state.tasks = getSampleTasks();
    state.categories = [...DEFAULT_CATEGORIES];
    saveTasks();
    saveCategories();
    populateCategoryDropdowns();
    renderCategoryNav();
    renderTasks();
    state.sound.playPop();
    showToast('Sample tasks restored', 'info');
  }
}

// TOAST SYSTEM
function showToast(message, type = 'info', undoCallback = null) {
  const toast = document.createElement('div');
  toast.className = `pointer-events-auto flex items-center justify-between gap-3 px-4 py-3 rounded-xl shadow-lg border text-xs font-medium animate-fade-in transition-all ${
    type === 'success' 
      ? 'bg-emerald-950 text-emerald-100 border-emerald-800' 
      : type === 'undo'
      ? 'bg-slate-900 text-slate-100 border-slate-700'
      : 'bg-slate-800 text-slate-100 border-slate-700'
  }`;

  toast.innerHTML = `
    <div class="flex items-center gap-2">
      ${type === 'success' ? '<i data-lucide="check" class="w-4 h-4 text-emerald-400"></i>' : '<i data-lucide="info" class="w-4 h-4 text-brand-400"></i>'}
      <span>${escapeHtml(message)}</span>
    </div>
    ${undoCallback ? `
      <button class="undo-btn text-brand-400 hover:text-brand-300 font-bold underline px-1 py-0.5 ml-2 cursor-pointer">
        Undo
      </button>
    ` : ''}
  `;

  if (undoCallback) {
    const undoBtn = toast.querySelector('.undo-btn');
    undoBtn.addEventListener('click', () => {
      undoCallback();
      toast.remove();
    });
  }

  elements.toastContainer.appendChild(toast);
  updateLucideIcons();

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

// MOBILE SIDEBAR
function openMobileSidebar() {
  elements.sidebar.classList.remove('-translate-x-full');
  elements.mobileBackdrop.classList.remove('hidden');
}

function closeMobileSidebar() {
  elements.sidebar.classList.add('-translate-x-full');
  elements.mobileBackdrop.classList.add('hidden');
}

// UTILITIES
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function updateLucideIcons() {
  if (typeof lucide !== 'undefined' && lucide.createIcons) {
    lucide.createIcons();
  }
}

// EVENT LISTENERS
function attachEventListeners() {
  // Theme & Sound
  elements.themeToggleBtn.addEventListener('click', toggleTheme);
  elements.soundToggleBtn.addEventListener('click', toggleSound);

  // Mobile drawer
  elements.mobileSidebarToggle.addEventListener('click', openMobileSidebar);
  elements.closeSidebarBtn.addEventListener('click', closeMobileSidebar);
  elements.mobileBackdrop.addEventListener('click', closeMobileSidebar);

  // View Navigation
  elements.viewNav.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-view]');
    if (btn) {
      switchView(btn.getAttribute('data-view'));
      closeMobileSidebar();
    }
  });

  // Search
  elements.globalSearchInput.addEventListener('input', (e) => {
    state.searchQuery = e.target.value;
    if (elements.clearSearchBtn) {
      if (state.searchQuery) {
        elements.clearSearchBtn.classList.remove('hidden');
      } else {
        elements.clearSearchBtn.classList.add('hidden');
      }
    }
    renderTasks();
  });

  if (elements.clearSearchBtn) {
    elements.clearSearchBtn.addEventListener('click', () => {
      elements.globalSearchInput.value = '';
      state.searchQuery = '';
      elements.clearSearchBtn.classList.add('hidden');
      renderTasks();
      elements.globalSearchInput.focus();
    });
  }

  // Priority Filter & Sort
  elements.priorityFilterSelect.addEventListener('change', (e) => {
    state.priorityFilter = e.target.value;
    renderTasks();
  });

  elements.sortSelect.addEventListener('change', (e) => {
    state.sortBy = e.target.value;
    renderTasks();
  });

  // Bulk Actions Dropdown
  elements.bulkActionBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    elements.bulkMenuDropdown.classList.toggle('hidden');
  });

  document.addEventListener('click', () => {
    if (!elements.bulkMenuDropdown.classList.contains('hidden')) {
      elements.bulkMenuDropdown.classList.add('hidden');
    }
  });

  elements.markAllCompletedBtn.addEventListener('click', () => {
    elements.bulkMenuDropdown.classList.add('hidden');
    markAllComplete();
  });

  elements.clearCompletedBtn.addEventListener('click', () => {
    elements.bulkMenuDropdown.classList.add('hidden');
    clearCompletedTasks();
  });

  elements.clearCompletedInlineBtn.addEventListener('click', clearCompletedTasks);

  elements.resetDemoTasksBtn.addEventListener('click', () => {
    elements.bulkMenuDropdown.classList.add('hidden');
    resetDemoTasks();
  });

  // Quick Add Form
  elements.quickAddForm.addEventListener('submit', handleQuickAdd);
  elements.quickExpandNotesBtn.addEventListener('click', () => {
    elements.quickNotesContainer.classList.toggle('hidden');
    if (!elements.quickNotesContainer.classList.contains('hidden')) {
      elements.quickTaskNotes.focus();
    }
  });

  // Empty state add button
  elements.emptyStateAddBtn.addEventListener('click', () => {
    elements.quickTaskTitle.focus();
  });

  // Completed Accordion Toggle
  elements.toggleCompletedBtn.addEventListener('click', (e) => {
    if (e.target.closest('#clearCompletedInlineBtn')) return;
    elements.completedTasksContainer.classList.toggle('hidden');
    const isHidden = elements.completedTasksContainer.classList.contains('hidden');
    elements.completedAccordionIcon.setAttribute('data-lucide', isHidden ? 'chevron-right' : 'chevron-down');
    updateLucideIcons();
  });

  // Task Modal (Edit/Create)
  elements.openNewTaskModalBtn.addEventListener('click', () => {
    openCreateModal();
    closeMobileSidebar();
  });
  elements.closeTaskModalBtn.addEventListener('click', closeTaskModal);
  elements.cancelTaskModalBtn.addEventListener('click', closeTaskModal);
  elements.saveTaskModalBtn.addEventListener('click', handleSaveTaskModal);
  elements.deleteTaskFromModalBtn.addEventListener('click', handleDeleteFromModal);
  elements.addSubtaskBtn.addEventListener('click', handleAddModalSubtask);
  elements.newSubtaskInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddModalSubtask();
    }
  });

  // Category Modal
  elements.addCategoryBtn.addEventListener('click', openCategoryModal);
  elements.closeCategoryModalBtn.addEventListener('click', closeCategoryModal);
  elements.cancelCategoryBtn.addEventListener('click', closeCategoryModal);
  elements.categoryForm.addEventListener('submit', handleCreateCategory);

  // Shortcuts Modal
  elements.shortcutsBtn.addEventListener('click', () => elements.shortcutsModal.classList.remove('hidden'));
  elements.closeShortcutsModalBtn.addEventListener('click', () => elements.shortcutsModal.classList.add('hidden'));

  // Data Modal
  elements.exportImportBtn.addEventListener('click', openDataModal);
  elements.closeDataModalBtn.addEventListener('click', closeDataModal);
  elements.downloadBackupBtn.addEventListener('click', downloadBackupJSON);
  elements.copyMarkdownBtn.addEventListener('click', copyTasksMarkdown);
  elements.importDataBtn.addEventListener('click', handleImportData);

  // Close modals on Esc & global shortcuts
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      elements.taskModal.classList.add('hidden');
      elements.categoryModal.classList.add('hidden');
      elements.shortcutsModal.classList.add('hidden');
      elements.dataModal.classList.add('hidden');
      closeMobileSidebar();
    } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      elements.globalSearchInput.focus();
    } else if (e.key === '/' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
      e.preventDefault();
      elements.globalSearchInput.focus();
    } else if (e.key.toLowerCase() === 'n' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
      e.preventDefault();
      elements.quickTaskTitle.focus();
    } else if (e.key === '?' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
      e.preventDefault();
      elements.shortcutsModal.classList.remove('hidden');
    }
  });
}

// Start app when DOM is ready
document.addEventListener('DOMContentLoaded', initApp);
