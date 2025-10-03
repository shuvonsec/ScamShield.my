const form = document.querySelector('form');
const input = document.querySelector('input');
const statusEl = document.querySelector('#status');

form?.addEventListener('submit', async (event) => {
  event.preventDefault();
  const url = (input as HTMLInputElement).value;
  statusEl!.textContent = 'Checking...';
  try {
    const response = await fetch('https://scamshield.my/api/check-url', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url })
    });
    const json = await response.json();
    statusEl!.textContent = `Verdict: ${json.verdict} (score ${json.score})`;
  } catch (error) {
    statusEl!.textContent = 'Failed to check URL';
  }
});
