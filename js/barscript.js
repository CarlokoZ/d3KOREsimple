
// set the dimensions and margins of the graph
var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// set the ranges
var x = d3.scaleBand()
    .range([0, width])
    .padding(0.1);

var y = d3.scaleLinear()
    .range([height, 0]);

var tooltip = d3.select('body').append('div')
    .style('position','absolute')
    .style('padding','0 10px')
    .style('background','white')
    .style('opacity', 0);

// append the svg object to the body of the page
// append a 'group' element to 'svg'
// moves the 'group' element to the top left margin
var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

// get the data
d3.csv("data/data2.csv", function(error, data) {
    if (error) throw error;

    // format the data
    data.forEach(function(d) {
        d.timesPlayed = +d.timesPlayed;
    });

    // Scale the range of the data in the domains
    x.domain(data.map(function(d) { return d.product; }));
    y.domain([0, d3.max(data, function(d) { return d.timesPlayed; })]);

    // append the rectangles for the bar chart
    svg.selectAll(".bar")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { return x(d.product); })
        .attr("width", x.bandwidth())
        .attr("y", function(d) { return y(d.timesPlayed); })
        .attr("height", function(d) { return height - y(d.timesPlayed); })
        .on('mouseover',function(d){
            tooltip.transition()
                .style('opacity', .9);

            tooltip.html(d.timesPlayed)
                .style('left', (d3.event.pageX - 35) + 'px')
                .style('top', (d3.event.pageY - 30) + 'px');

            tempColour = this.style.fill;
            d3.select(this)
                .style('opacity', .5)
                .style('fill','blue')
        })
        .on('mouseout', function(d){
            d3.select(this).style('opacity', 1).style('fill', tempColour)
        });

    // add the x Axis
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    // add the y Axis
    svg.append("g")
        .call(d3.axisLeft(y));

});
