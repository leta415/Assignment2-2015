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
    });
})();
