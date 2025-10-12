const http = require('http');
const https = require('https');

const TARGET_API = 'https://algran-api.calitek-junior.workers.dev';

const server = http.createServer((req, res) => {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    // Proxy request to the target API
    const options = {
        hostname: 'algran-api.calitek-junior.workers.dev',
        path: req.url,
        method: req.method,
        headers: {
            ...req.headers,
            host: 'algran-api.calitek-junior.workers.dev'
        }
    };

    const proxyReq = https.request(options, (proxyRes) => {
        res.writeHead(proxyRes.statusCode, proxyRes.headers);
        proxyRes.pipe(res);
    });

    proxyReq.on('error', (error) => {
        console.error('Proxy error:', error);
        res.writeHead(500);
        res.end('Proxy error');
    });

    req.pipe(proxyReq);
});

const PORT = 3001;
server.listen(PORT, () => {
    console.log(`Proxy server running on http://localhost:${PORT}`);
    console.log(`Proxying requests to ${TARGET_API}`);
});