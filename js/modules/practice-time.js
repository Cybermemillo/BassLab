const STORAGE_KEY = 'basslab_practice_time';

const activeTimers = {};

function todayKey() {
  const d = new Date();
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}

function getData() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  } catch {
    return {};
  }
}

function saveData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function start(source) {
  stop(source); // ensure no double timer
  activeTimers[source] = Date.now();
}

export function stop(source) {
  if (!activeTimers[source]) return 0;
  const elapsed = Math.round((Date.now() - activeTimers[source]) / 1000);
  delete activeTimers[source];
  if (elapsed <= 0) return 0;

  const data = getData();
  const key = todayKey();
  data[key] = (data[key] || 0) + elapsed;
  saveData(data);
  return elapsed;
}

export function getTodayMinutes() {
  const data = getData();
  return Math.round((data[todayKey()] || 0) / 60);
}

export function getDailyMinutes() {
  const data = getData();
  const map = {};
  for (const [date, secs] of Object.entries(data)) {
    map[date] = Math.round(secs / 60);
  }
  return map;
}

export function getStreaks() {
  const daily = getDailyMinutes();
  const dates = Object.keys(daily).sort();

  if (dates.length === 0) return { current: 0, max: 0 };

  // Build set for O(1) lookup
  const practiceDays = new Set(dates);

  // Current streak: walk back from today
  let current = 0;
  const d = new Date();
  while (practiceDays.has(todayKey())) {
    current++;
    d.setDate(d.getDate() - 1);
    // Update todayKey to the day we're checking
    const checkKey = d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
    if (!practiceDays.has(checkKey)) break;
    // We need a different approach... let me redo this
  }

  // Better approach for current streak
  let streak = 0;
  const today = new Date();
  for (let i = 0; i < 365; i++) {
    const check = new Date(today);
    check.setDate(check.getDate() - i);
    const key = check.getFullYear() + '-' + String(check.getMonth() + 1).padStart(2, '0') + '-' + String(check.getDate()).padStart(2, '0');
    if (practiceDays.has(key)) {
      streak++;
    } else {
      break;
    }
  }
  current = streak;

  // Max streak
  let max = 0;
  let run = 0;
  for (let i = 0; i < dates.length; i++) {
    const d1 = new Date(dates[i] + 'T00:00:00');
    if (i === 0) {
      run = 1;
    } else {
      const d0 = new Date(dates[i - 1] + 'T00:00:00');
      const diff = (d1 - d0) / 86400000;
      if (diff === 1) {
        run++;
      } else {
        run = 1;
      }
    }
    if (run > max) max = run;
  }

  return { current, max };
}

export function clearAll() {
  localStorage.removeItem(STORAGE_KEY);
}
