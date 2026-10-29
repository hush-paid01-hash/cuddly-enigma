import { createServer } from 'node:http';
import handler from '../netlify/functions/api.ts';

// Exercise the same Request/Response handler used by Netlify locally.
createServer(async (incoming, outgoing) => {
  try {
    const request = new Request(
      new URL(incoming.url, 'http://localhost:8787'),
      {
        method: incoming.method,
      },
    );
    const response = await handler(request);
    outgoing.writeHead(response.status, Object.fromEntries(response.headers));
    outgoing.end(Buffer.from(await response.arrayBuffer()));
  } catch (error) {
    console.error(error);
    outgoing.writeHead(500, { 'Content-Type': 'application/json' });
    outgoing.end(JSON.stringify({ error: 'Internal server error' }));
  }
}).listen(8787, '127.0.0.1', () =>
  console.log('hush API: http://localhost:8787/api/v1'),
);
