const http = require('http');
const fs = require('fs');
const path = require('path');
const { Server } = require('socket.io');

const server = http.createServer((req, res) => {
    let filePath = __dirname + (req.url === '/' ? '/index.html' : req.url);
    let extname = path.extname(filePath);
    let contentType = 'text/html';

    switch (extname) {
        case '.css':
            contentType = 'text/css';
            break;
        case '.js':
            contentType = 'text/javascript';
            break;
    }

    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(404);
            res.end('File not found');
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(data);
        }
    });
});

const io = new Server(server);
const port = 5000;

io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('chat message', ({ name, message }) => {
        io.emit('chat message', { name, message });
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
