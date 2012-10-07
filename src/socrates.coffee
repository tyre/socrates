class Socrates

  constructor: (selectors, options = {}) ->
    @getOrInitSession()
    @defaults['session-id'] = @sessionId
    @config = @mergeHash(@defaults, options)
    @attachHandlers(selectors)
    # @track({'event-name': 'pageView'})

  defaults: {
    'app-name':'default',
    'agent-id':'default',
    'event-name':'default',
    'entity-id':'default',
    'variation-ids':[],
    'server-url': 'http://localhost:7738/t.gif'
  }

  sessionDuration: 86400000 # 1 day in ms

  attachHandlers: (selectors) ->
    for s in selectors
      trackedElements = document.getElementsByClassName(s)
      for elem in trackedElements
        binding = elem.getAttribute('data-soc-binding') || 'click'
        elem.addEventListener binding, (evnt) ->
          data = {}
          data['entity-id'] = this.getAttribute('data-entity-id')
          if v = this.getAttribute('data-variation-ids')
            data['variation-ids'] = v.split(/,\s*/)
          window.socrates.track(data)

  newSessionExpiry: ->
    expDate = new Date()
    expDate.setTime(expDate.getTime()+@sessionDuration)
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
      cookie = cookie.replace(/^\s+/,'')
      if(cookie.indexOf(cName) == 0)
        found = cookie.substr(cookie.indexOf(cName), cookie.length)
    found

  setCookie: (c) ->
    document.cookie = @cookieString(c)

  refreshCookie: (c) ->
    c.expires = @newSessionExpiry()
    document.cookie = @cookieString(c)

  cookieString: (c) ->
    "#{c.name}=#{c.value};expires=#{c.expires};path=#{c.path}"

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
    @sessionId = "#{rand1}#{new Date().getTime()}#{rand2}"
    # 1/10000000000 (1 in ten billion) chance of collision in any given millisecond

  track: (hash) ->
    trackData = @mergeHash(@config,hash)
    trackData.time ||= new Date().getTime()
    @addGIF(trackData)

  addGIF: (h)->
    src = @genGIFSrc(h)
    gif = document.createElement('img')
    gif.src = src
    gif.style.display = 'none'
    s = document.getElementsByTagName('script')[0]
    s.parentNode.insertBefore(gif,s)

  genGIFSrc: (h)->
    src = h['server-url'] + '?'
    for p, v of h
      unless(p is 'server-url')
        src += "#{p}=#{v}&"
    src = src.substr(0, src.length-1) # remove last '&'

  mergeHash: (h1, h2) ->
    h3 = h1
    for p, v of h2
      h3[p] = v
    h3
document.addEventListener 'DOMContentLoaded', ->
  window.socrates = new Socrates(['socrates'])




