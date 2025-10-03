chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'scamshield-check',
    title: 'Check with ScamShield',
    contexts: ['link']
  });
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId !== 'scamshield-check' || !info.linkUrl) return;
  try {
    const response = await fetch('https://scamshield.my/api/check-url', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: info.linkUrl })
    });
    const data = await response.json();
    chrome.tabs.sendMessage(tab?.id ?? 0, { type: 'scamshield:result', data });
  } catch (error) {
    console.error('ScamShield context menu error', error);
  }
});
