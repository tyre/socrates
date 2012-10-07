$(function(){
  var _gaq = _gaq || [];
  var trackedElements = $('.ga-track');
  for (var i = trackedElements.length - 1; i >= 0; i--) {
    var e = $(trackedElements[i]);
    var binding = e.data('ga-binding') || 'click';

    e.bind(binding, function(e){
      var element = $(this);
      var gaEvent = element.data('ga-event') || '_trackEvent';
      var gaData = element.data('ga-data').split(/,\s*/);
      gaData.unshift(gaEvent);
      _gaq.push(gaData)
    })
  };
}