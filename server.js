const config = require('./config.json');
const http = require('http');

http.createServer((req, res) => {
    res.writeHead(200, {
        'Content-Type': 'text/plain'
    });

    res.write('Hello World!');
    res.end();

}).listen(config.port, function() {
    console.log(`Server is listening on ${config.port}`);
});