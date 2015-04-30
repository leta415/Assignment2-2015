var opts = {
    size: 72,           // Width and height of the spinner
    factor: 0.35,       // Factor of thickness, density, etc.
    color: "#4080FF",      // Color #rgb or #rrggbb
    speed: 1.0,         // Number of turns per second
    clockwise: true     // Direction of rotation
};
var ajaxLoader = new AjaxLoader("spinner", opts);
ajaxLoader.show();


var margin = {top: 20, right: 20, bottom: 100, left: 40};
var width = 960 - margin.left - margin.right;
var height = 500 - margin.top - margin.bottom;

//define scale of x to be from 0 to width of SVG, with .1 padding in between
var scaleX = d3.scale.ordinal()
  .rangeRoundBands([0, width], .1);

//define scale of y to be from the height of SVG to 0
var scaleY = d3.scale.linear()
  .range([height, 0]);

//define axes
var xAxis = d3.svg.axis()
  .scale(scaleX)
  .orient("bottom");

var yAxis = d3.svg.axis()
  .scale(scaleY)
  .orient("left");

//create svg
var svg = d3.select("body").append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//create tooltip
var div = d3.select("body").append("div")   
    .attr("class", "tooltip")               
    .style("opacity", 0);

//get json object which contains media counts
d3.json('/igMediaCounts', function(error, data) {
  //set domain of x to be all the usernames contained in the data
  scaleX.domain(data.users.map(function(d) { return d.username; }));
  //set domain of y to be from 0 to the maximum media count returned
  scaleY.domain([0, d3.max(data.users, function(d) { return d.counts.media; })]);

  //set up x axis
  svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")") //move x-axis to the bottom
    .call(xAxis)
    .selectAll("text")  
    .style("text-anchor", "end")
    .attr("dx", "-.8em")
    .attr("dy", ".15em")
    .attr("transform", function(d) {
      return "rotate(-65)" 
    });

  //set up y axis
  svg.append("g")
    .attr("class", "y axis")
    .call(yAxis)
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", ".71em")
    .style("text-anchor", "end")
    .text("Number of Photos");

    ajaxLoader.hide();

  //set up bars in bar graph
  svg.selectAll(".bar")
    .data(data.users)
    .enter().append("rect")
    .attr("class", "bar")
    .attr("x", function(d) { return scaleX(d.username); })
    .attr("width", scaleX.rangeBand())
    .attr("y", function(d) { return scaleY(d.counts.media); })
    .attr("height", function(d) { return height - scaleY(d.counts.media); })
    .on("mouseover", function(d) {
      div.transition()        
          .duration(200)      
          .style("opacity", .9); 
      div .html(d.username)
          .style("left", (d3.event.pageX) + "px")
          .style("top", (d3.event.pageY - 28) + "px");
    })
    .on("mouseout", function(){
      div.transition()
          .duration(500)
          .style("opacity", 0);
    });


    d3.select("input").on("change", change);

    function change() {

      // Copy-on-write since tweens are evaluated after a delay.
      var x0 = scaleX.domain(data.users.sort(this.checked
          ? function(a, b) { return b.counts.media - a.counts.media; }
          : function(d) { return scaleX(d.username); })
          .map(function(d) { return d.username; }))
          .copy();

      svg.selectAll(".bar")
          .sort(function(a, b) { return x0(a.username) - x0(b.username); });

      var transition = svg.transition().duration(750),
          delay = function(d, i) { return i * 50; };

      transition.selectAll(".bar")
          .delay(delay)
          .attr("x", function(d) { return x0(d.username); });

      transition.select(".x.axis")
          .call(xAxis)
          .selectAll("text")  
          .style("text-anchor", "end")
          .selectAll("g")
          .delay(delay);
    }

});

