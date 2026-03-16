import { cleanAndGroup, removeDuplicates, getStats } from './tabs.js';

const statsEl = document.getElementById('stats');
const resultEl = document.getElementById('result');

async function getCurrentTabs() {
  return chrome.tabs.query({ currentWindow: true });
}

function showResult(msg) {
  resultEl.textContent = msg;
}

async function loadStats() {
  const tabs = await getCurrentTabs();
  const { total, domains, dupes } = await getStats(tabs);
  statsEl.innerHTML = `
    <strong>${total}</strong> tabs &nbsp;·&nbsp;
    <strong>${domains}</strong> domains &nbsp;·&nbsp;
    <strong>${dupes}</strong> duplicate${dupes !== 1 ? 's' : ''}
  `;
}

document.getElementById('btn-clean').addEventListener('click', async () => {
  const tabs = await getCurrentTabs();
  const { closed, grouped } = await cleanAndGroup(tabs);
  showResult(`Closed ${closed} duplicate${closed !== 1 ? 's' : ''}, grouped ${grouped} domain${grouped !== 1 ? 's' : ''}.`);
  await loadStats();
});

document.getElementById('btn-dupes').addEventListener('click', async () => {
  const tabs = await getCurrentTabs();
  const closed = await removeDuplicates(tabs);
  showResult(`Closed ${closed} duplicate${closed !== 1 ? 's' : ''}.`);
  await loadStats();
});

loadStats();
