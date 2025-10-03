import { useEffect, useState } from 'react';
import React from 'react';
import ReactDOM from 'react-dom/client';
import axios from 'axios';

function Popup() {
  const [url, setUrl] = useState('');
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs[0];
      if (tab?.url) {
        setUrl(tab.url);
      }
    });
  }, []);

  async function handleCheck() {
    try {
      const response = await axios.post('https://scamshield.my/api/check-url', { url });
      setResult(response.data);
      setError(null);
    } catch (err) {
      setError('Unable to check URL');
    }
  }

  return (
    <div style={{ minWidth: 280, padding: 16 }}>
      <h1 style={{ fontSize: 18, fontWeight: 600 }}>ScamShield</h1>
      <p style={{ fontSize: 12 }}>Check the active tab before you click.</p>
      <textarea
        style={{ width: '100%', minHeight: 80, marginTop: 12 }}
        value={url}
        onChange={(event) => setUrl(event.target.value)}
      />
      <button style={{ marginTop: 12 }} onClick={handleCheck}>
        Check URL
      </button>
      {error && <p style={{ color: '#db4437' }}>{error}</p>}
      {result && (
        <div style={{ marginTop: 12 }}>
          <strong>Verdict:</strong> {result.verdict} ({result.score})
        </div>
      )}
    </div>
  );
}

const root = document.getElementById('root');
if (root) {
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <Popup />
    </React.StrictMode>
  );
}
