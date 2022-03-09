// Set up SVG definitions
var svgWidth = 960;
var svgHeight = 500;

// set up borders in svg
var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

// calculate chart height and width
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight)
;

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`)
;

// Import Data
d3.csv("assets/data/data.csv").then(function(censusData) {

    // Parse data 
    censusData.forEach(function(data) {
      data.poverty = +data.poverty;
      data.healthcare = +data.healthcare;
    });

    // Create x and y scale functions
    var xLinearScale = d3.scaleLinear()
      .domain([8.5, d3.max(censusData, d => d.poverty)])
      .range([0, width]);

    var yLinearScale = d3.scaleLinear()
      .domain([0, d3.max(censusData, d => d.healthcare)])
      .range([height, 0]);

    // Create axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Append Axes to the chart
    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

      chartGroup.append("g")
      .call(leftAxis);

    // Create circles
    var circlesGroup = chartGroup.selectAll("circle")
      .data(censusData)
      .enter()
      .append("circle")
      .attr("cx", d => xLinearScale(d.poverty))
      .attr("cy", d => yLinearScale(d.healthcare))
      .attr("r", "15")
      .attr("fill", "blue")
      .attr("opacity", ".5");

    // Create circle labels
    var circleLabels = chartGroup.selectAll(null)
      .data(censusData)
      .enter()
      .append("text")
      .text(function(d){return d.abbr;})
      .attr("x", d => xLinearScale(d.poverty))
      .attr("y", d => yLinearScale(d.healthcare))
      .attr("text-anchor", "middle")  
      .style("fill", "white")
      .style("font-size", "10px")
      .style("font-weight", "bold")

    // Create axes labels
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 40)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Lacks Healthcare (%)");

    chartGroup.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
      .attr("class", "axisText")
      .text("In Poverty (%)");
})