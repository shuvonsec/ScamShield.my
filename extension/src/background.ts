chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'scamshield-check',
    title: 'Check with ScamShield',
    contexts: ['link']
  });
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId !== 'scamshield-check' || !info.linkUrl) {
    return;
  }

  try {
    const response = await fetch('https://scamshield.my/api/check-url', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: info.linkUrl })
    });

    if (!response.ok) {
      throw new Error(`Request failed: ${response.status}`);
    }

    const data: { reportId?: string } = await response.json();
    if (data.reportId) {
      chrome.tabs.create({ url: `https://scamshield.my/report/${data.reportId}` });
    } else if (tab?.id) {
      chrome.tabs.sendMessage(tab.id, {
        type: 'scamshield:result',
        success: true
      });
    }
  } catch (error) {
    if (tab?.id) {
      chrome.tabs.sendMessage(tab.id, {
        type: 'scamshield:result',
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
});
