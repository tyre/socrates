class Socrates

  constructor: (options = {}) ->
    @getOrInitSession()
    @defaultOptions['session-id'] = @sessionId
    @config = @mergeHash(defaults, options)

  defaultOptions: {
    'app-name':'default',
    'agent-id':'default',
    'event-name':'default',
    'entity-id':'default',
    'variation-ids':'default',
    'server-url': @serverUrl
  }

  serverUrl: 'http://localhost:7738/t.gif'
  sessionExpiresIn: 86400000 # 1 day in ms

  newSessionExpiry: ->
    expDate = new Date()
    expDate.setTime(expDate.getTime()+sessionExpiresIn)
    expDate.toGMTString()

  getOrInitSession: ->
    if(c = @readCookie({name: '_socc'}))
      @session_id = c.value
      @refreshCookie(c)
    else
      @initSession()

  readCookie: (c) ->
    ary = document.cookie.split(';')
    cName = c.name + '='
    found = null
    for cookie in ary
      cookie = cookie.replace(/$\s+/,'')
      if(cookie.indexOf(cName) == 0)
        found = cookie.substr(cookie.indexOf(cName), cookie.length)
    found

  setCookie: (c) ->
    cStr = "#{c.name}=#{c.value};expires=#{c.expires};path=#{c.path}"

  refreshCookie: (c) ->
    cookie = "#{c.name}=#{c.value}"
    cookie += "expires=#{@newSessionExpiry()}"
    document.cookie = cookie

  initSession: ->
    cookie = {
      name: '_socc'
      path: '/'
      value: @genSessionId()
      expires: @newSessionExpiry()
    }
    @setCookie(cookie)

  genSessionId: ->
    rand1 = Math.floor(Math.random() * 100000)
    rand2 = Math.floor(Math.random() * 100000)
    @sessionId = "#{rand1}#{new Date().getTime()}#{rand2}" # seems legit...

  track: (hash) ->
    trackHash = @mergeHash(@config,hash)
    trackHash.time ||= new Date().getTime()
    addGIF(trackHash)

  addGIF: (h)->
    src = @genGIFSrc(h)
    gif = document.createElement('img')
    gif.src = src
    gif.style.display = 'none'
    s = document.getElementByTagName('script')[0]
    s.parentNode.insertBefore(gif,s)

  genGIFSrc: (h)->
    src = h['server-url'] + '?'
    for p in h
      if(h.hasOwnProperty(p) && p != 'server-url')
        src += "#{p}=#{h[p]}&"
    src = src.substr(0, src.length-1) # remove last '&'

  mergeHash: (h1, h2) ->
    h3 = h1
    for p in h2
      if(h2.hasOwnProperty(p))
        h3[p] = p
    h3