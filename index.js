const config = require('./config.json');
const url = require('url');
const http = require('http');

function httpHandler(req, res) {
    const path = url.parse(req.url).pathname;
    res.end('Hello!');
}

http.createServer(httpHandler).listen(config.port, function() {
    console.log(`Server is listening on ${config.port}`);
});