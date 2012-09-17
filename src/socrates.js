
function track(eventName) {
  var now_utc = new Date().getTime();
  jqxhr = $.ajax('http://localhost:7738/Socrates/trackEvent/' + eventName, {
    type: 'PUT',
    data: {time: now_utc}
  });
}

$(function(){
  track('pageView');
  $('a').click(function(){
    track('click-'+ $(this).attr('href'));
  });

});