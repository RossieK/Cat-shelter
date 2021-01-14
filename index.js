const config = require('./config.json');
const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');

const VIEWS_PATH = path.resolve(config.viewsDir);

const routeMap = {
    '/': '/home/index.html'
}

function sendFile(res, relativeFilePath) {
    const fullFilePath = path.join(VIEWS_PATH, relativeFilePath);
    fs.readFile(fullFilePath, function(err, data) {
        if (err) {
            const { message } = err;

            res.writeHead(500, {
                'Content-Length': Buffer.byteLength(message),
                'Content-Type': 'text/plain'
            }).end(message);
            return;
        }

        res.writeHead(200, {
            'Content-Length': Buffer.byteLength(data),
            'Content-Type': 'text/html'
        }).end(data);
    });
}

function httpHandler(req, res) {
    const pathname = url.parse(req.url).pathname;
    const fileRelativePath = routeMap[pathname];

    if (!fileRelativePath) {
        const data = 'Not Found!';
        res.writeHead(404, {
            'Content-Length': Buffer.byteLength(data),
            'Content-Type': 'text/plaing'
        }).end(data);
        return;
    }

    sendFile(res, fileRelativePath);
}

http.createServer(httpHandler).listen(config.port, function() {
    console.log(`Server is listening on ${config.port}`);
});