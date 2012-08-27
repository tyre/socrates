var http = require('http');
var redis = require('redis');
var client = redis.createClient();


http.createServer(function (request, response) {
    response.writeHead(200, {'Content-Type': 'text/plain'});
    response.end(request.url);
}).listen(6754);
