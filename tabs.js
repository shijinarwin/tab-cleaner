function getDomain(url) {
  try {
    return new URL(url).hostname;
  } catch {
    return null;
  }
}

function groupByDomain(tabs) {
  const groups = new Map();
  for (const tab of tabs) {
    const domain = getDomain(tab.url);
    if (!domain) continue;
    if (!groups.has(domain)) groups.set(domain, []);
    groups.get(domain).push(tab);
  }
  return groups;
}

async function removeDuplicates(tabs) {
  const groups = groupByDomain(tabs);
  const toClose = [];

  for (const [, domainTabs] of groups) {
    if (domainTabs.length > 1) {
      const dupes = domainTabs.slice(1);
      toClose.push(...dupes.map((t) => t.id));
    }
  }

  if (toClose.length > 0) {
    await chrome.tabs.remove(toClose);
  }

  return toClose.length;
}

async function cleanAndGroup(tabs) {
  const closed = await removeDuplicates(tabs);

  const remaining = await chrome.tabs.query({ currentWindow: true });
  const groups = groupByDomain(remaining);

  for (const [domain, domainTabs] of groups) {
    if (domainTabs.length < 2) continue;

    const tabIds = domainTabs.map((t) => t.id);
    const groupId = await chrome.tabs.group({ tabIds });
    await chrome.tabGroups.update(groupId, { title: domain, collapsed: false });
  }

  return { closed, grouped: groups.size };
}

async function getStats(tabs) {
  const groups = groupByDomain(tabs);
  let dupes = 0;
  for (const [, domainTabs] of groups) {
    if (domainTabs.length > 1) dupes += domainTabs.length - 1;
  }
  return { total: tabs.length, domains: groups.size, dupes };
}

export { getDomain, groupByDomain, removeDuplicates, cleanAndGroup, getStats };
