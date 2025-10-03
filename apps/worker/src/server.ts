import http from 'http';
import { processScan } from './handlers/process-scan';

const server = http.createServer(async (req, res) => {
  if (req.method === 'POST' && req.url === '/process-scan') {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    });
    req.on('end', async () => {
      const data = JSON.parse(body);
      const result = await processScan(data.scanId);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(result));
    });
  } else {
    res.writeHead(404);
    res.end();
  }
});

const port = process.env.PORT || 4000;
server.listen(port, () => {
  console.log(`Worker listening on ${port}`);
});
