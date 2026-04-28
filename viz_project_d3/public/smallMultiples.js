import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

// Define areas for all lollipop charts from small multiples
var FstLollipopArea;
var SndLollipopArea;
var ThirdLollipopArea;
var FourthLollipopArea;
var FifthLollipopArea;
var SixthLollipopArea;
var SeventhLollipopArea;
var EithLollipopArea;
var hoveredCircle = null;

// Define other necessary variables
var dataSpokeMost;
var textArea;
var episodesNames = ["Philosopher's stone", "Chamber of Secrets", "Prisoner of Azkaban", "Goblet of Fire", "Order of the Phoenix", "Half-Blood Prince", "Deathly Hallows 1", "Deathly Hallows 2"];

var lollipopMargin = { top: 25, right: 20, bottom: 30, left: 70}; // margins for lollipop charts
var lollipopProportions = {height: 180, width: 205}; // proportions of lollipop charts

// Load the data
d3.csv("characterSpokeMostEps.csv", function (d) {
    return {
        Episode: d["Episode"],
        Name: d["Name"],
        Count: +d["Count"],
    };
  })
    .then(function (csvData) {
        // store loaded data in the global variable
        dataSpokeMost = csvData;
        init();
        visualization();
    });

/**
 * Initialize areas for text as well as for all of the lollipop charts
 * 
 */
function init() {
      // d3 canvases for svg elements
    textArea = d3.select("#text_div")
        .attr("width", d3.select("#text_div").node().clientWidth)
        .attr("height", d3.select("#text_div").node().clientHeight);
    
    FstLollipopArea = d3.select("#flex-container .flex-item:first-child")
        .append("svg") // Append an SVG element to the selected div
        .attr("width", d3.select("#flex-container .flex-item:first-child").node().clientWidth)
        .attr("height", d3.select("#flex-container .flex-item:first-child").node().clientHeight)
        .append("g")
        .attr("transform", "translate(" + lollipopMargin.left + "," + lollipopMargin.top + ")");
    
    SndLollipopArea = d3.select("#flex-container .flex-item:nth-child(2)")
        .append("svg") // Append an SVG element to the selected div
        .attr("width", d3.select("#flex-container .flex-item:nth-child(2)").node().clientWidth)
        .attr("height", d3.select("#flex-container .flex-item:nth-child(2)").node().clientHeight)
        .append("g")
        .attr("transform", "translate(" + lollipopMargin.left + "," + lollipopMargin.top + ")");
    
    ThirdLollipopArea = d3.select("#flex-container .flex-item:nth-child(3)")
        .append("svg") // Append an SVG element to the selected div
        .attr("width", d3.select("#flex-container .flex-item:nth-child(3)").node().clientWidth)
        .attr("height", d3.select("#flex-container .flex-item:nth-child(3)").node().clientHeight)
        .append("g")
        .attr("transform", "translate(" + lollipopMargin.left + "," + lollipopMargin.top + ")");
    
    FourthLollipopArea = d3.select("#flex-container .flex-item:nth-child(4)")
        .append("svg") // Append an SVG element to the selected div
        .attr("width", d3.select("#flex-container .flex-item:nth-child(4)").node().clientWidth)
        .attr("height", d3.select("#flex-container .flex-item:nth-child(4)").node().clientHeight)
        .append("g")
        .attr("transform", "translate(" + lollipopMargin.left + "," + lollipopMargin.top + ")");
    
    FifthLollipopArea = d3.select("#flex-containerB .flex-item:first-child")
        .append("svg") // Append an SVG element to the selected div
        .attr("width", d3.select("#flex-containerB .flex-item:first-child").node().clientWidth)
        .attr("height", d3.select("#flex-containerB .flex-item:first-child").node().clientHeight)
        .append("g")
        .attr("transform", "translate(" + lollipopMargin.left + "," + (lollipopMargin.top + 2) + ")");
    
    SixthLollipopArea = d3.select("#flex-containerB .flex-item:nth-child(2)")
        .append("svg") // Append an SVG element to the selected div
        .attr("width", d3.select("#flex-containerB .flex-item:nth-child(2)").node().clientWidth)
        .attr("height", d3.select("#flex-containerB .flex-item:nth-child(2)").node().clientHeight)
        .append("g")
        .attr("transform", "translate(" + lollipopMargin.left + "," + (lollipopMargin.top + 2) + ")");
    
    SeventhLollipopArea = d3.select("#flex-containerB .flex-item:nth-child(3)")
        .append("svg") // Append an SVG element to the selected div
        .attr("width", d3.select("#flex-containerB .flex-item:nth-child(3)").node().clientWidth)
        .attr("height", d3.select("#flex-containerB .flex-item:nth-child(3)").node().clientHeight)
        .append("g")
        .attr("transform", "translate(" + lollipopMargin.left + "," + (lollipopMargin.top + 2) + ")");
    
    EithLollipopArea = d3.select("#flex-containerB .flex-item:nth-child(4)")
        .append("svg") // Append an SVG element to the selected div
        .attr("width", d3.select("#flex-containerB .flex-item:nth-child(4)").node().clientWidth)
        .attr("height", d3.select("#flex-containerB .flex-item:nth-child(4)").node().clientHeight)
        .append("g")
        .attr("transform", "translate(" + lollipopMargin.left + "," + (lollipopMargin.top + 2) + ")");
}

/**
 * Conducts visualizing of heading as well as of all of the lollipop charts.
 * 
 */
function visualization() {
    drawTextInfo();

    drawLollipopChart('HP 1', FstLollipopArea, "#flex-container .flex-item:first-child");
    drawLollipopChart('HP 2', SndLollipopArea, "#flex-container .flex-item:nth-child(2)");
    drawLollipopChart('HP 3', ThirdLollipopArea, "#flex-container .flex-item:nth-child(3)");
    drawLollipopChart('HP 4', FourthLollipopArea, "#flex-container .flex-item:nth-child(4)");

    drawLollipopChart('HP 5', FifthLollipopArea, "#flex-containerB .flex-item:first-child");
    drawLollipopChart('HP 6', SixthLollipopArea, "#flex-containerB .flex-item:nth-child(2)");
    drawLollipopChart('HP 7', SeventhLollipopArea, "#flex-containerB .flex-item:nth-child(3)");
    drawLollipopChart('HP 8', EithLollipopArea, "#flex-containerB .flex-item:nth-child(4)");
    
}

/**
 * Draws the heading of the page where small multiples are.
 */
function drawTextInfo() {
    textArea.append("text")
        .attr("class", "headlineB")
        .attr("text-anchor", "middle")
        .style("font-size", "35px")
        .style("letter-spacing", ".1rem")
        .text("What Character Spoke The Most?");
  }
  
  
/**
 * Draws a lollipop chart to visualize 5 characters that spoke most in a specific episode.
 *
 * @param episode the episode for which the lollipop chart is drawn.
 * @param svg SVG element where the chart will be drawn.
 * @param currId id of the current lollipop chart div
 */  
function drawLollipopChart(episode, svg, currId) {


    // Filter out only data for required character
    var currEpData = dataSpokeMost.filter(function (row) {
        return row['Episode'] === episode;
      })
      .map(function (row) {
        return {
          Name: row['Name'],
          Count: +row['Count'], // Convert to a numeric value
        };
      });
    
    // Append heading text
    var whichEpisode = episode.replace(/[^0-9]/g, "");
    var whichEpisodeNum = Number(whichEpisode);
    appendHeaderText(svg, lollipopProportions.width, whichEpisode, episodesNames[whichEpisodeNum - 1]);
  
    // Create X and Y scales
    var x = createXScale(currEpData, lollipopProportions.width);
    var y = createYScale(currEpData, lollipopProportions.height);
    
    // Add X axis label
    svg.append("text")
    .attr("text-anchor", "middle")
    .attr("x", lollipopProportions.width + 30)
    .attr("y", lollipopProportions.width + 10)
    .style("fill", "#D3AC2B")
    .style("font-family", "Monaco")
    .style("letter-spacing", ".17rem")
    //.style("font-weight", "bold")
    .style("opacity", 0.7)
    .style("font-size", "13px")
    .text("name");

    // Add Y axis label
    svg.append("text")
    .attr("text-anchor", "middle")
    .attr("x", -14)
    .attr("y", -12)
    .style("fill", "#D3AC2B")
    .style("letter-spacing", ".17rem")
    .style("font-family", "Monaco")
    //.style("font-weight", "bold")
    .style("opacity", 0.7)
    .style("font-size", "13px")
    .text("words");

    // Append X and Y axes
    appendXAxis(svg, lollipopProportions.width, x);
    appendYAxis(svg, y);
  
    // Append lines and circles
    appendLines(svg, currEpData, x, y);
    appendCircles(svg, currEpData, x, y, currId, whichEpisodeNum - 1); //TADYY
}
  
  // Function to append heading text to the SVG
  function appendHeaderText(svg, width, ep, epName) {
    svg.append("text")
        .attr("x", width / 2 + 10)
        .attr("y", 2)
        .attr("text-anchor", "middle")
        .style("font-size", "15px")
        .style("font-family", "Monaco")
        .style("letter-spacing", ".12rem")
        .style("fill", "#CBD0D8")
        .text("Harry Potter - ep no. " + ep);
  
    svg.append("text")
        .attr("x", width / 2 + 10)
        .attr("y", 20)
        .attr("text-anchor", "middle")
        .style("font-size", "15px")
        .style("font-family", "Monaco")
        .style("opacity", 0.85)
        .style("letter-spacing", ".12rem")
        .style("fill", "#CBD0D8")
        .text(epName);
  }
  
  // Function to create X scale
  function createXScale(data, width) {
    return d3.scaleBand()
        .range([0, width])
        .domain(data.map(function (d) { return d.Name; }))
        .padding(1);
  }
  
  // Function to create Y scale
  function createYScale(data, height) {
    return d3.scaleLinear()
        .domain([0, d3.max(data, function (d) { return +d.Count; }) + 2000]) //+3k
        .range([height + 25, 0]);
  }
  
  // Function to append X axis to the SVG
  function appendXAxis(svg, width, x) {
    svg.append("g")
        .attr("transform", "translate(0," + width + ")")
        .call(d3.axisBottom(x))
        
        // append text to the line
        .selectAll("text")
        .attr("transform", "translate(-10,0)rotate(-45)")
        .style("text-anchor", "end")
        .style("font-family", "Sans-serif")
        .style("fill", "#CBD0D8")
        .style("letter-spacing", ".01rem")
        .style("opacity", 0.9);
  }
  
  // Function to append Y axis to the SVG
  function appendYAxis(svg, y) {
    svg.append("g")
        .call(d3.axisLeft(y))
        .selectAll("text")
        .style("fill", "#CBD0D8")
        .style("letter-spacing", ".03rem")
        .style("opacity", 0.9);
  }
  
  // Function to append lines to the SVG
  function appendLines(svg, data, x, y) {
    svg.selectAll("myline")
        .data(data)
        .enter()
        .append("line")
        .attr("x1", function (d) { return x(d.Name); })
        .attr("x2", function (d) { return x(d.Name); })
        .attr("y1", function (d) { return y(d.Count); })
        .attr("y2", y(0))
        .attr("stroke", "#CBD0D8")
  }
  
  // Function to append circles to the SVG
  function appendCircles(svg, data, x, y, currId, whichEpisodeNum) {
    
    // Tooltip
    var Tooltip = d3.select(currId)
        .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "1px")
        .style("border-radius", "5px")
        .style("padding", "3px")
        .style("position", "absolute");
    
    var mousemoveTooltip = function (event, d) {
        var [x, y] = d3.pointer(event, svg.node());
        var widthOfSingleSmall = document.querySelector('#flex-container .flex-item:nth-child(3)').clientWidth;

        Tooltip
            .html("Number of words: " + (d.Count).toLocaleString())
            .style("left", x + (10 * (whichEpisodeNum % 4)) + lollipopMargin.left + ((widthOfSingleSmall * (whichEpisodeNum % 4))) + "px") // 10 is additional shift on x
            .style("top", y + "px")
            .style("font-size", "14px");
      };
  
    svg.selectAll("mycircle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", function (d) { return x(d.Name); })
        .attr("cy", function (d) { return y(d.Count); })
        .attr("r", "10")
        .style("fill", "#333D51")
        .attr("stroke", "#D3AC2B")
        .attr("stroke-width", 1)
        .on("mouseover", function (event, d) {
            // Change appearance on mouseover
            hoveredCircle = hoveredCircle === this ? null : this;
            d3.select(this)
                .transition()
                .duration(200)
                .attr("r", hoveredCircle === this ? 12 : 10)
                .attr("stroke-width", hoveredCircle == this ? 2 : 1);
  
            // Show tooltip
            Tooltip
                .style("opacity", 1);
            d3.select(this)
                .style("stroke", "#D3AC2B")
        })
        .on("mouseout", function (event, d) {
            // Revert appearance on mouseout
            hoveredCircle = null;
            d3.select(this)
                .transition()
                .duration(200)
                .attr("r", 10)
                .attr("stroke-width", 1)  
            // Hide tooltip
            Tooltip
                .style("left", "-999px")
                .style("opacity", 0);
        })
        .on("mousemove", function (event, d) {
            // Call the mousemoveTooltip function
            mousemoveTooltip.call(this, event, d);
        })
  }