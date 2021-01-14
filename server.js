const config = require('./config.json');
const http = require('http');
const handlers = require('./handlers');

http.createServer((req, res) => {

    for (let handler of handlers) {
        if (!handler(req, res)) {
            break;
        }
    }

}).listen(config.port, function() {
    console.log(`Server is listening on ${config.port}`);
});