var opts = {
    size: 72,           // Width and height of the spinner
    factor: 0.35,       // Factor of thickness, density, etc.
    color: "#4080FF",      // Color #rgb or #rrggbb
    speed: 1.0,         // Number of turns per second
    clockwise: true     // Direction of rotation
};
var ajaxLoader = new AjaxLoader("spinner", opts);
ajaxLoader.show();

(function() {
  $.getJSON( '/igMediaCounts')
    .done(function( data ) {
      console.log(data);
      var yCounts = data.users.map(function(item){
        return item.counts.media;
      });
      
      yCounts.unshift('Media Count');

      var chart = c3.generate({
        bindto: '#chart',
        data: {
          columns: [
            yCounts 
          ]
        }
      });

      ajaxLoader.hide();
    });
})();
