
function track(eventName) {
  var now_utc = new Date().getTime();
  jqxhr = $.ajax('http://localhost:7738/trackEvent/' + eventName, {
    type: 'PUT',
    data: {time: now_utc}
  });

  jqxhr.success(function(response){
    console.log('YAY');
    console.log(response);
  });

  jqxhr.error(function(response){
    console.log('BOO');
    console.log(response);
  });
}

$(function(){
  track('pageView');
  $('#herp').click(function(e){
    console.log('herp');
  });

  $('.socrates').click(function(e){
    self = $(this);
    track(self.data('socrates'));
  });

  // $('.socrates').width(function(){
  //   var child = $(this).children()[0]
  //   $(this).width($(child).width()+1);
  // });
});