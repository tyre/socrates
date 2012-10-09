SocratesSettings = require("../settings.js").settings

[$, http, url, router, redis] = [require('jquery'),require('http'),require('url'),require('router')(),require('redis')]
redisClient = redis.createClient()
server = http.createServer(router)


server.on "listening", ->
  console.info "Pondering the universe on http://localhost:" + SocratesSettings.port

server.on "close", ->
  console.info "And into the abyss"

router.get "/t.gif", (request, response) ->
  params = url.parse(request.url, true).query
  response.writeHead(200)
  response.end()
  storeInRedis(params)

server.listen SocratesSettings.port

storeInRedis = (data) ->
  redisKeyFor data, (key, setKey) ->
    redisClient.hmset(key, hashToArray(data), redis.print)
    redisClient.sadd(setKey, key, redis.print)

hashToArray = (hash) ->
  a = []
  for k,v of hash
    a.push(k)
    a.push(v)
  a

redisKeyFor = (data, callback) ->
  jqxhr = $.get(SocratesSettings.keyGenUrl, data)
  jqxhr.done (r) ->
    callback r.key, r['set-key']

  jqxhr.fail (r) ->
    console.error "ERROR\n============\n"
    console.error r
