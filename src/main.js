// server.js
import { createServer } from 'http';
import exec from './verifier.js';

const PORT = 7012;

const server = createServer((req, res) => 
{
  if (req.method === 'POST' && req.url === '/verify') 
  {
    let body = '';
    // Збираємо дані з тіла запиту
    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', async () => {
      try {
        const data = JSON.parse(body);
        const { code, timeout } = data;

        if (typeof code !== 'string' || typeof timeout !== 'number') {
          res.writeHead(400, { 'Content-Type': 'text/plain' });
          res.end('Invalid JSON format');
          return;
        }

        // Надсилаємо відповідь 
        const result = await exec(code, timeout);
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        const s = JSON.stringify(result)
        res.end(s);
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'text/plain' });
        res.end('Invalid JSON');
      }
    });
  } 
  else 
  {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});

server.listen(PORT, () => {
  console.log(`Server is listening on http://localhost:${PORT}`);
});
