const SocratesSettings = require('../settings.js').settings;
sprintf = require('../lib/sprintf').sprintf;
//1440 minutes in a day
DATE_FORMAT = '%04u-%02u-%02u-%02u-%02u-%02u';
var http = require('http');
var querystring = require('querystring');
var router = require('router');
var routing = router();
var server = http.createServer(routing);
var redis = require('redis');
var client = redis.createClient();

routing.options('*', function(request, response){
  var origin = (request.headers.origin || "*");
  response.writeHead("204", {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Accept",
    "Access-Control-Max-Age": 10,
    "content-length": 0
  });
  response.end();
});

routing.put('/trackEvent/{eventName}', function(request, response){
  request.on('data', function(chunk){
    hash = querystring.parse(chunk.toString());
    var key = redisKeyFor(request.params.eventName, parseInt(hash.time));
    client.incr(key);
    pushSetKey(key,)
    console.info('Incrementing ' + key);
  })
  response.writeHead(200, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Credentials": true,
    "Access-Control-Allow-Origin": "*"
  });
  response.end();
});

routing.get('/trackEvent/{eventName}', function(request, response){
  response.writeHead(200, {"Content-Type": "application/json"});
  redisGet(request.params.eventName, function(err, reply){
    if(err)
      console.error(err);
    var count = jsonify({ "count" : reply });
    response.write(count);
    response.end();
  })
});

routing.get('/trackEvent/{eventName}/{timeStart}/{timeEnd}', function(request, response){
  // timeStart and timeStop should be in ms since Jan 1, 1970
  var start = parseInt(timeStart), stop = parseInt(timeEnd);
  if(start && stop){
    response.writeHead(200,{"Content-Type": "application/json"});
    var startKey = redisKeyFor(request.params.eventName, start);
    var stopKey = redisKeyFor(request.params.eventName, stop);

  } else {
    response.writeHead(422)
    response.end()
  }
});

server.on('listening', function(){
  console.info('Pondering the universe on http://localhost:' + SocratesSettings.port);
});

server.on('close', function(){
  console.info('And into the abyss');
});

server.listen(SocratesSettings.port);

// REDIS

function jsonify (hash) {
  return JSON.stringify(hash);
}

function redisGet (k, callback) {
  var key = redisKeyFor(k);
  client.get(key, callback);
}

function formatDate (ms) {
  var time = new Date(ms);
  var y = time.getFullYear(),
  m = time.getMonth(),
  d = time.getDate(),
  h = time.getHours(),
  min = time.getMinutes(),
  s = time.getSeconds();
  return sprintf(DATE_FORMAT,y,m,d,h,min,s);
}

function redisKeyFor (keyword, time) {
  if(!time)
    time = Date.UTC();
  formattedDate = formatDate(time)
  var key = [SocratesSettings.prefix,keyword,formattedDate].join('-');
  pushSetKey(key, keyword);
  return key;
}

function pushSetKey (key, keyword) {
  var setKey = [SocratesSettings.prefix, keyword, 'KEYS'].join('-');
  client.sadd(setKey, key);
}