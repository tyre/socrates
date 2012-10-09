SocratesSettings = require("../settings.js").settings
sprintf = require("../lib/sprintf").sprintf
DATE_FORMAT = "%04u-%02u-%02u-%02u-%02u-%02u"
[$,http,url,router,client] = [require('jquery'),require('http'),require('url'),require('router')(),require('redis').createClient()]
server = http.createServer(router)


server.on "listening", ->
  console.info "Pondering the universe on http://localhost:" + SocratesSettings.port

server.on "close", ->
  console.info "And into the abyss"

router.get "/t.gif", (request, response) ->
  params = url.parse(request.url, true).query

server.listen SocratesSettings.port

# REDIS
jsonify = (hash) ->
  JSON.stringify hash

formatDate = (ms) ->
  time = new Date(ms)
  y = time.getFullYear()
  m = time.getMonth()
  d = time.getDate()
  h = time.getHours()
  min = time.getMinutes()
  s = time.getSeconds()
  sprintf DATE_FORMAT, y, m, d, h, min, s

redisURL = (data) ->
  url = SocratesSettings.keyGenUrl
  if (data["start-time"] and data["end-time"]) or data.time
    url += "/event"
  else
    url += "/event/unread"
  url

redisKeyFor = (appName, eventName, data, callback) ->
  $.extend data,
    "app-name": appName
    "event-name": eventName

  url = redisURL(data)
  jqxhr = $.get(url, data)
  jqxhr.done (r) ->
    callback r.key

  jqxhr.fail (r) ->
    console.error "ERROR\n============\n"
    console.error r

pushSetKey = (key, appName, eventName) ->
  redisKeyFor appName, eventName, {}, (setKey) ->
    console.log setKey + "\n" + key
    client.sadd setKey, key
