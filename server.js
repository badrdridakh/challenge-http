const http = require('http');
const url = require('url');
const fs = require('fs');
const { parse } = require('querystring');
const num = Math.floor(Math.random() * 100);

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);

    if (req.url === "/") {
        fs.readFile('index.html', (error, data) => {
            if (error) {
                res.writeHead(404);
                res.write("error : File not Found");
            } else {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.write(data);
            }
            res.end();
        });
    } else if (req.method === 'POST' && parsedUrl.pathname === '/check') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            try {
                const postBody = JSON.parse(body);
                const value = parseFloat(postBody.value);
    
                if (isNaN(value)) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Invalid value' }));
                } else if (value > num) {
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ result: 'Bigger than expected' }));
                } else if (value < num) {
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ result: 'Smaller than expected' }));
                } else {
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ result: 'You win' }));
                }
            } catch (error) {
                console.error('Error parsing JSON:', error);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Internal Server Error' }));
            }
        });
    }
    
     else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Not Found' }));
    }
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
