const suspiciousWords = ['login', 'verify', 'bonus', 'reset'];

document.querySelectorAll<HTMLAnchorElement>('a[href]').forEach((anchor) => {
  const href = anchor.getAttribute('href') ?? '';
  if (suspiciousWords.some((word) => href.toLowerCase().includes(word))) {
    anchor.style.outline = '2px solid #db4437';
    anchor.title = 'ScamShield: suspicious link detected';
  }
});

chrome.runtime.onMessage.addListener((message) => {
  if (message.type === 'scamshield:result' && message.data) {
    alert(`ScamShield verdict: ${message.data.verdict} (score ${message.data.score})`);
  }
});
