const SocratesSettings = require('../settings.js').settings;
sprintf = require('../lib/sprintf').sprintf;
//1440 minutes in a day
DATE_FORMAT = '%04u-%02u-%02u-%02u-%02u'
var http = require('http');
var router = require('router');
var routing = router();
var server = http.createServer(routing);
var redis = require('redis');
var client = redis.createClient();
routing.get('/', function(request, response){

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

routing.post('/trackEvent/{eventName}/{timeStart}/{timeEnd}', function(request, response){
  // timeStart and timeStop should be in ms
  var start = parseInt(timeStart), stop = parseInt(timeEnd);
  if(start && stop){
    var startKey = redisKeyFor(request.params.eventName, start);
    var stopKey = redisKeyFor(request.params.eventName, stop);
    // TODO get keys between these times
  } else {

  }

});

routing.post('/trackEvent/{eventName}', function(request, response){
  var key = redisKeyFor(request.params.eventName);
  client.incr(key);
  response.writeHead(200);
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
    min = time.getMinutes();
  return sprintf(DATE_FORMAT,y,m,d,h,min);
}

function redisKeyFor (string, time=undefined) {
  if(!time)
    time = Date.getTime();
  formattedDate = formatDate(time)
  var key = string + '-' + formattedDate;
  console.info(key);
  return key;
}