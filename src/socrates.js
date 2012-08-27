function Socrates () {
  this.track = function(eventName){

  }
}

$(function(){
  $('#herp').click(function(e){
    console.log('herp');
  });

  $('.socrates').click(function(e){
    console.log('derp');
  });

  $('.socrates').width(function(){
    var child = $(this).children()[0]
    $(this).width($(child).width()+1);
  });
});