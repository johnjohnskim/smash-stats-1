
var margin = {top: 20, right: 80, bottom: 30, left: 50};
var width = 960 - margin.left - margin.right;
var height = 500 - margin.top - margin.bottom;

var parseDate = d3.time.format("%Y-%m-%dT%X.000Z").parse;

var x = d3.time.scale()
    .range([0, width]);
var y = d3.scale.linear()
    .range([height, 0]);

var color = d3.scale.category10();

var line = d3.svg.line()
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.stat); });

var svg = d3.select('#graph').append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
  .append('g')
    .attr('transform', "translate(" + margin.left + ',' + margin.top + ')');

var xAxis = d3.svg.axis()
    .scale(x)
    .orient('bottom');
var yAxis = d3.svg.axis()
    .scale(y)
    .orient('left');

svg.append('g')
    .attr('class', 'x axis')
    .attr('transform', "translate(0," + height + ")")
    .call(xAxis)

var yAxisLine = svg.append('g')
    .attr('class', 'y axis')
    .call(yAxis)
  .append('text')
    .attr('transform', 'rotate(-90)')
    .attr('y', 6)
    .attr('dy', '.71em')
    .style('text-anchor', 'end')
    .text('Win %')

var players, playerData, stat;

$.getJSON('/api/playertimeline', function(data) {
  players = _.uniq(_.pluck(data, 'player'));
  color.domain(players);
  data.forEach(function (d) {
    d.date = parseDate(d.date);
    d.winpct = +d.winpct;
    d.wins = +d.wins;
  });
  playerData = _.groupBy(data, 'player');
  playerData = color.domain().map(function(name) {
    return {
      name: name,
      values: playerData[name]
    };
  });
  changeStatType('winpct');
  update();
});

function changeStatType(type) {
  stat = type;
  update();
}

function update() {
  var data = playerData.map(function(d) {
    return {
      name: d.name,
      values: d.values.map(function(v) {
        return {
          date: v.date,
          stat: v[stat]
        };
      })
    };
  });

  x.domain([
    d3.min(data, function(p) { return d3.min(p.values, function(d) { return d.date; }); }),
    d3.max(data, function(p) { return d3.max(p.values, function(d) { return d.date; }); })
  ]);
  y.domain([
    d3.min(data, function(p) { return d3.min(p.values, function(d) { return d.stat; }); }),
    d3.max(data, function(p) { return d3.max(p.values, function(d) { return d.stat; }); })
  ]); 

  var player = svg.selectAll('.player')
      .data(data)
      
  // enter
  var enter = player.enter().append('g')
      .attr('class', 'playerLine');
  enter.append('path')
    .attr('class', 'line')
    .attr("d", function(d) { return line(d.values); })
    .style("stroke", function(d) { return color(d.name); });
  enter.append('text')
    .datum(function(d) { return {name: d.name, value: d.values[d.values.length - 1]}; })
    .attr('transform', function(d) { return "translate(" + x(d.value.date) + "," + y(d.value.stat) + ")"; })
    .attr('x', 3)
    .attr('dy', '.35em')
    .text(function(d) { return d.name; });

  // update
  var duration = 1500;
  var update = player.transition().duration(duration);
  update.select('path')
    .attr('d', function(d) { return line(d.values); });
  update.select('text')
    .attr('transform', function(d) { 
      return "translate(" + x(d.values[d.values.length-1].date) + "," + y(d.values[d.values.length-1].stat)+ ")";
    });

  var svgUpdate = svg.transition().duration(duration);
  svgUpdate .select('.x.axis')
    .call(xAxis);
  svgUpdate .select('.y.axis')
    .call(yAxis);
  yAxisLine.text((stat == 'winpct' ? 'Win %' : 'Wins'));
}
