// i18n — loads translation JSON, applies to DOM, drives language switcher.

const SUPPORTED = ['en', 'es', 'de', 'fr', 'sv'];
const DEFAULT_LANG = 'en';

let translations = {};
let currentLang = DEFAULT_LANG;

function t(key) {
  function resolve(obj, parts) {
    return parts.reduce((o, k) => (o && o[k] !== undefined ? o[k] : null), obj);
  }
  const parts = key.split('.');
  return resolve(translations[currentLang], parts)
      || resolve(translations[DEFAULT_LANG], parts)
      || null;
}

function applyTranslations() {
  document.documentElement.lang = currentLang;

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const value = t(key);
    if (value) el.textContent = value;
  });

  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    const value = t(key);
    if (value) el.placeholder = value;
  });

  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === currentLang);
  });
}

async function loadAndApply(lang) {
  if (!SUPPORTED.includes(lang)) lang = DEFAULT_LANG;
  if (!translations[lang]) {
    try {
      const res = await fetch(`translations/${lang}.json`);
      translations[lang] = await res.json();
    } catch {
      console.warn(`i18n: failed to load ${lang}.json`);
      if (lang !== DEFAULT_LANG) { await loadAndApply(DEFAULT_LANG); return; }
    }
  }
  currentLang = lang;
  localStorage.setItem('lang', lang);
  applyTranslations();
  syncSelect(lang);
}

function detectLang() {
  const stored = localStorage.getItem('lang');
  if (stored && SUPPORTED.includes(stored)) return stored;
  const browser = (navigator.language || '').slice(0, 2).toLowerCase();
  return SUPPORTED.includes(browser) ? browser : DEFAULT_LANG;
}

function initSwitcher() {
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => loadAndApply(btn.dataset.lang));
  });

  const select = document.querySelector('.lang-select');
  if (select) {
    select.addEventListener('change', () => loadAndApply(select.value));
  }
}

function syncSelect(lang) {
  const select = document.querySelector('.lang-select');
  if (select) select.value = lang;
}

document.addEventListener('DOMContentLoaded', () => {
  initSwitcher();
  loadAndApply(detectLang());
});
