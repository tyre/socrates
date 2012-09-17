const SocratesSettings = require('../settings.js').settings;
sprintf = require('../lib/sprintf').sprintf;
//1440 minutes in a day
DATE_FORMAT = '%04u-%02u-%02u-%02u-%02u-%02u';
var $ = require('jquery');
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

routing.put('/{appName}/trackEvent/{eventName}', function(request, response){
  eventName = request.params.eventName
  appName = request.params.appName
  request.on('data', function(chunk){
    hash = querystring.parse(chunk.toString());
    data = { time: parseInt(hash.time) }
    redisKeyFor(appName, eventName, data, function(key){
    client.incr(key);
    pushSetKey(key, appName, eventName)
    console.info('Incrementing ' + key);
    });
  })
  response.writeHead(200, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Credentials": true,
    "Access-Control-Allow-Origin": "*"
  });
  response.end();
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

function redisURL (data) {
 var url = SocratesSettings.keyGenUrl
 if((data['start-time'] && data['end-time']) || data.time){
  url += '/event'
 } else {
  url += '/event/unread'
 }
 return url
}

function redisKeyFor (appName, eventName, data, callback) {
  $.extend(data,{'app-name': appName, 'event-name': eventName})
  var url = redisURL(data)
  jqxhr = $.get(url, data);

  jqxhr.done(function(r){
    callback(r.key)
  });

  jqxhr.fail(function(r){
    console.error("ERROR\n============\n");
    console.error(r);
  });
}

function pushSetKey (key, appName, eventName) {
  redisKeyFor(appName, eventName, {}, function(setKey){
    console.log(setKey + "\n" + key);
    client.sadd(setKey, key);
  });
}