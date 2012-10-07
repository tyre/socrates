class Socrates
  constructor: (options = {}) ->
    defaults = {'app-name':'default','agent-id':'default','event-name':'default','entity-id':'default','variation-ids'  : 'default'}
    @getOrInitSession()

  sessionExpiresIn: 86400000 # 1 day in ms

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

  refreshCookie: (c) ->
    cookie = "#{c.name}=#{c.value}"
    expDate = new Date()
    expDate.setTime(expDate.getTime()+sessionExpiresIn)
    cookie += "expires=#{date.toGMTString()}"
    document.cookie = cookie

# function track(eventName) {
#   var now_utc = new Date().getTime();
#   jqxhr = $.ajax('http://localhost:7738/Socrates/trackEvent/' + eventName, {
#     type: 'PUT',
#     data: {time: now_utc}
#   });
# }

# $(function(){
#   track('pageView');
#   $('a').click(function(){
#     track('click-'+ $(this).attr('href'));
#   });

# });