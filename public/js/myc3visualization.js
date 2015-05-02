var opts = {
    size: 72,           // Width and height of the spinner
    factor: 0.35,       // Factor of thickness, density, etc.
    color: "#3B3738",      // Color #rgb or #rrggbb
    speed: 1.0,         // Number of turns per second
    clockwise: true     // Direction of rotation
};
var ajaxLoader = new AjaxLoader("spinner", opts);
ajaxLoader.show();

(function() {
  $.getJSON( '/igActive')
    .done(function( data ) {
        var hourArray = [];
        var arraySize = 24;
        while(arraySize--) hourArray.push(0);

        for (var i = 0; i < data.users.length; i++) {
            // create a new javascript Date object based on the timestamp
            // multiplied by 1000 so that the argument is in milliseconds, not seconds
            // if (data.users[i].caption == null) continue;
            var date = new Date((data.users[i].created_time)*1000);
            // hours part from the timestamp
            var hours = date.getHours() - 8;
            if (hours < 0) {
                hours = 24 + hours;
            }
            hourArray[hours]++;
        }

        // yCounts.unshift('Active');

        // console.log("Number of media returned: " + yCounts.length);

        var chart = c3.generate({
            bindto: '#myChart',
            data: {
                columns: [
                    // ['x', '12am', '1am', '2am', '3am', '4am', '5am', '6am', '7am', '8am', '9am', '10am', '11am', '12pm', '1pm', '2pm', '3pm', '4pm', '5pm', '6pm', '7pm', '8pm', '9pm', '10pm', '11pm'],
                    // Object.keys(hourMap),
                    hourArray
                ],
                colors: {0: '#3E5378'}
            }
            // axis: {
            //     x: {
            //         type: 'timeseries',
            //         tick: {
            //             format: '%Y-%m-%d'
            //         }
            //     }
            // }
        });

        ajaxLoader.hide();
    });

})();
