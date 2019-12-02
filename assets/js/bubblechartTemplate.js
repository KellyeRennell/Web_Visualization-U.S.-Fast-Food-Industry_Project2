// set the dimensions and margins of the graph
//Horizontal Axis => Murders per 100,000 population
// Vertical Axis => Burglaries per 100, 000 population
// Bubble Size => State Population
// Bubble color("Red states, Blue states") => Political classification of each state into Red / Blue / Purple.

var margin = { top: 40, right: 150, bottom: 60, left: 30 },
    width = 500 - margin.left - margin.right,
    height = 420 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3.select("body")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

//Read the data
d3.json("..assets/data/state_categories.json", function(data) {

    // ---------------------------//
    //       AXIS  AND SCALE      //
    // ---------------------------//

    // Add X axis
    var x = d3.scaleLinear()
        .domain([0, 45000])
        .range([0, width]);
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).ticks(3));

    // Add X axis label:
    svg.append("text")
        .attr("text-anchor", "end")
        .attr("x", width)
        .attr("y", height + 50)
        .text("State");

    // Add Y axis
    var y = d3.scaleLinear()
        .domain([35, 90])
        .range([height, 0]);
    svg.append("g")
        .call(d3.axisLeft(y));

    // Add Y axis label:
    svg.append("text")
        .attr("text-anchor", "end")
        .attr("x", 0)
        .attr("y", -20)
        .text("Number of restaurants")
        .attr("text-anchor", "start")

    // Add a scale for bubble size based on number of restaurants 
    var z = d3.scaleSqrt()
        .domain([200000, 1310000000])
        .range([2, 1000]);

    // // Add a scale for bubble color
    // var myColor = d3.scaleOrdinal()
    //     .domain(["Asia", "Europe", "Americas", "Africa", "Oceania"])
    //     .range(d3.schemeSet1);


    // ---------------------------//
    //      TOOLTIP               //
    // ---------------------------//

    // -1- Create a tooltip div that is hidden by default:
    var tooltip = d3.select("#body")
        .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("background-color", "black")
        .style("border-radius", "5px")
        .style("padding", "10px")
        .style("color", "white")

    // -2- Create 3 functions to show / update (when mouse move but stay on same circle) / hide the tooltip
    var showTooltip = function(d) {
        tooltip
            .transition()
            .duration(200)
        tooltip
            .style("opacity", 1)
            .html("state: " + d.state)
            .style("left", (d3.mouse(this)[0] + 30) + "px")
            .style("top", (d3.mouse(this)[1] + 30) + "px")
    }
    var moveTooltip = function(d) {
        tooltip
            .style("left", (d3.mouse(this)[0] + 30) + "px")
            .style("top", (d3.mouse(this)[1] + 30) + "px")
    }
    var hideTooltip = function(d) {
        tooltip
            .transition()
            .duration(200)
            .style("opacity", 0)
    }


    // ---------------------------//
    //       HIGHLIGHT GROUP      //
    // ---------------------------//

    // What to do when one group is hovered
    var highlight = function(data) {
        // reduce opacity of all groups
        d3.selectAll(".bubbles").style("opacity", .05)
            // expect the one that is hovered
        d3.selectAll(".bubbles" ).style("opacity", 1)
    }

    // And when it is not hovered anymore
    var noHighlight = function(d) {
        d3.selectAll(".bubbles").style("opacity", 1)
    }


    // ---------------------------//
    //       CIRCLES              //
    // ---------------------------//

    // Add dots
    svg.append('g')
        .selectAll("dot")
        .data(data)
        .enter()
        .append("circle")
        .attr("class", function(d) { return "bubbles " + d.state })
        .attr("cx", function(d) { return x(d.state); })
        .attr("cy", function(d) { return y(d.number_of_restaurants); })
        .attr("r", function(d) { return z(d.number_of_restaurants); })
        // .style("fill", function(d) { return myColor(d.state); })
        // -3- Trigger the functions for hover
        .on("mouseover", showTooltip)
        .on("mousemove", moveTooltip)
        .on("mouseleave", hideTooltip)



    // ---------------------------//
    //       LEGEND              //
    // ---------------------------//

    // Add legend: circles
    var categories = [1, 2, 3, 4, 5, 6, 7]
    var xCircle = 390
    var xLabel = 440
    svg
        .selectAll("legend")
        .data(categories)
        .enter()
        .append("circle")
        .attr("cx", xCircle)
        .attr("cy", function(d) { return height - 100 - z(d) })
        .attr("r", function(d) { return z(d) })
        .style("fill", "none")
        .attr("stroke", "black")

    // Add legend: segments
    svg
        .selectAll("legend")
        .data(categories)
        .enter()
        .append("line")
        .attr('x1', function(d) { return xCircle + z(d) })
        .attr('x2', xLabel)
        .attr('y1', function(d) { return height - 100 - z(d) })
        .attr('y2', function(d) { return height - 100 - z(d) })
        .attr('stroke', 'black')
        .style('stroke-dasharray', ('2,2'))

    // Add legend: labels
    svg
        .selectAll("legend")
        .data(categories)
        .enter()
        .append("text")
        .attr('x', xLabel)
        .attr('y', function(d) { return height - 100 - z(d) })
        .text(function(d) { return d / 1000000 })
        .style("font-size", 10)
        .attr('alignment-baseline', 'middle')

    // Legend title
    svg.append("text")
        .attr('x', xCircle)
        .attr("y", height - 100 + 30)
        .text("Population (M)")
        .attr("text-anchor", "middle")

    // Add one dot in the legend for each 
    var size = 20
    var allgroups = [""]
    svg.selectAll("myrect")
        .data(allgroups)
        .enter()
        .append("circle")
        .attr("cx", 390)
        .attr("cy", function(d, i) { return 10 + i * (size + 5) }) // 100 is where the first dot appears. 25 is the distance between dots
        .attr("r", 7)
        // .style("fill", function(d) { return myColor(d) })
        .on("mouseover", highlight)
        .on("mouseleave", noHighlight)

    // Add labels beside legend dots
    svg.selectAll("mylabels")
        .data(allgroups)
        .enter()
        .append("text")
        .attr("x", 390 + size * .8)
        .attr("y", function(d, i) { return i * (size + 5) + (size / 2) }) // 100 is where the first dot appears. 25 is the distance between dots
        // .style("fill", function(d) { return myColor(d) })
        .text(function(d) { return d })
        .attr("text-anchor", "left")
        .style("alignment-baseline", "middle")
        .on("mouseover", highlight)
        .on("mouseleave", noHighlight)
}) 