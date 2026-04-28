import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";


// Variables containing reference to data
var data;
var dataMentionHarry;
var dataWordsPerEpisode;
var dataTopSpells;
var dataWords;

// D3.js canvases
var textArea;
var lollipopChartArea;
var barchartArea;
var barchartAreaB;
var areachartArea;
var scaledupArea;

// Mentions of Voldemort (known from preprocessing phase)
var VoldemortMentions = 97;

// Variables
var hoveredCircle = null;

// Margins for charts
var lollipopMargin = { top: 30, left: 550 };
var barchartMargin = { top: 62, left: 550 };
var areachartMargin = { top: 123, left: 15 };
var scaledupMargin = { top: 120, left: 40 };
var barchartMarginB = { top: 62, left: 180};

/* Loading data from CSV file and editing the properties, loading numbers with + */
d3.csv("countMentionHarry.csv", function(d) {
  return {
    Name: d["Name"],
    Count: +d["Count"],
  };
})
  .then(function(csvData) {
    
    dataMentionHarry = csvData;
    d3.csv("characterWordsPerEpisode.csv", function(d) {
      return {
        Episode: d["Episode"],
        Name: d["Name"],
        Count: +d["Count"],
      };
    })
      .then(function(csvData) {
        dataWordsPerEpisode = csvData;

        d3.csv("top5spells.csv", function(d) {
          return {
            Spell: d["Spell"],
            Count: +d["Count"],
          };
        })
          .then(function(csvData) {
            dataTopSpells = csvData;
            d3.csv("countWordsEpisodes.csv", function(d) {
              return {
                Episode: d["Episode"],
                parent: d["parent"],
                Count: +d["Count"],
              };
            })
              .then(function(csvData) {
                dataWords = csvData;
                d3.csv("characterSpokeMost.csv", function (d) {
                  return {
                      Name: d["Name"],
                      Count: +d["Count"],
                  };
                })
                  .then(function (csvData) {
                      data = csvData;
                
                      // load map and initialize the views
                      init();
                
                      // data visualization
                      visualization();
                  });

              }); 
          });
      });

  });


/*----------------------
INITIALIZE VISUALIZATION
----------------------*/
/**
 * Initializes all the areas where the headline and visualizations will be drawn.
 * 
 */
function init() {
  
  // text
  textArea = d3.select("#text_div")
      .attr("width", d3.select("#text_div").node().clientWidth)
      .attr("height", d3.select("#text_div").node().clientHeight);
  
  // lollipop chart
  lollipopChartArea = d3.select("#lollipop_div").append("svg")
    .attr("width", d3.select("#lollipop_div").node().clientWidth)
    .attr("height",  d3.select("#lollipop_div").node().clientHeight)
    .append("g")
    .attr("transform", "translate(" + lollipopMargin.left + "," + lollipopMargin.top + ")");
  
  // barchart - mentioning of Harry
  barchartArea = d3.select("#barchart_div")
    .append("svg")
    .attr("width", d3.select("#barchart_div").node().clientWidth)
    .attr("height", d3.select("#barchart_div").node().clientHeight)
    .append("g")
    .attr("transform", "translate(" + barchartMargin.left + "," + barchartMargin.top + ")");
  
  // barchart - top 5 most used spells
  barchartAreaB = d3.select("#barchart_div_spell")
    .append("svg")
    .attr("width", d3.select("#barchart_div_spell").node().clientWidth)
    .attr("height", d3.select("#barchart_div_spell").node().clientHeight)
    .append("g")
    .attr("transform", "translate(" + barchartMarginB.left + "," + barchartMarginB.top + ")");
  
  // proportional areachart
  areachartArea = d3.select("#areachart_div")
    .append("svg")
    .attr("width", d3.select("#areachart_div").node().clientWidth)
    .attr("height", d3.select("#areachart_div").node().clientHeight)
    .append("g")
    .attr("transform", "translate(" + areachartMargin.left + "," + areachartMargin.top + ")");
  
  // scaled up number
  scaledupArea = d3.select("#scaledUp_div")
    .append("svg")
    .attr("width", d3.select("#scaledUp_div").node().clientWidth)
    .attr("height", d3.select("#scaledUp_div").node().clientHeight)
    .append("g")
    .attr("transform", "translate(" + scaledupMargin.left + "," + scaledupMargin.top + ")"); 
}

/*----------------------
BEGINNING OF VISUALIZATION
----------------------*/
/**
 * Conducts visualizing of everything on the page - headline, lollipop chart, both bar charts, 
 * proportional area chart and scaled-up number.
 * 
 */
function visualization() {
  drawTextInfo();
  drawLollipopChart(lollipopChartArea);
  drawBarchart(barchartArea, "#barchart_div", dataMentionHarry);
  drawBarchart(barchartAreaB, "#barchart_div_spell", dataTopSpells);
  drawAreachart(areachartArea);
  drawScaledUpNumber(scaledupArea);
  
}

/*----------------------
HEADLINE
----------------------*/
/**
 * Draws headline of the page "Harry Potter - Movies".
 * 
 */
function drawTextInfo() {
  // Draw headline
  textArea.append("text")
      //.attr("dx", screen.width / 2)
      //.attr("dy", "1.2em")
      .attr("class", "headlineB")
      .attr("text-anchor", "middle")
      .style("font-size", "50px")
      .style("letter-spacing", ".15rem")
      .text("Harry Potter - Movies");
}


/*----------------------
LOLLIPOP CHART
----------------------*/
/**
 * Function that conducts drawing of the lollipop chart that visualize 5 characters that spoke the most throughout whole series.
 * 
 * @param svg SVG element where the chart will be drawn.
 */
function drawLollipopChart(svg) {

  var height = 250
  var width = 250 //window.innerWidth * 0.1628 //vs 
  
  // Append heading text
  appendHeaderText(svg, width);

  // Create X and Y scales
  var x = createXScale(data, width);
  var y = createYScale(height);

  // Add X axis label
  svg.append("text") 
  .attr("text-anchor", "middle")
  .attr("x", width + 30)
  .attr("y", height + 10)
  .style("fill", "white")
  .style("font-family", "Monaco")
  .style("letter-spacing", ".17rem")
  //.style("font-weight", "bold")
  .style("opacity", 0.5)
  .style("font-size", "14px")
  .text("name");

  // Add Y axis label
  svg.append("text")
  .attr("text-anchor", "middle")
  .attr("x", -14)
  .attr("y", -13)
  .style("fill", "white")
  .style("letter-spacing", ".17rem")
  .style("font-family", "Monaco")
  //.style("font-weight", "bold")
  .style("opacity", 0.5)
  .style("font-size", "14px")
  .text("words");

  // Append X and Y axes
  appendXAxis(svg, width, x);
  appendYAxis(svg, y);

  // Append lines and circles
  appendLines(svg, data, x, y);
  appendCircles(svg, data, x, y);
}

// Function to append heading text to the SVG
function appendHeaderText(svg, width) {
  svg.append("text")
      .attr("x", width / 2 + 10)
      .attr("y", 2)
      .attr("text-anchor", "middle")
      .style("font-size", "16px")
      .style("font-family", "Monaco")
      .style("letter-spacing", ".12rem")
      .style("fill", "#CBD0D8")
      .text("Which Character Spoke");

  svg.append("text")
      .attr("x", width / 2 + 10)
      .attr("y", 25)
      .attr("text-anchor", "middle")
      .style("font-size", "16px")
      .style("font-family", "Monaco")
      .style("opacity", 0.85)
      .style("letter-spacing", ".12rem")
      .style("fill", "#CBD0D8")
      .text("The Most?");
}

// Function to create X scale
function createXScale(data, width) {
  return d3.scaleBand()
      .range([0, width])
      .domain(data.map(function (d) { return d.Name; }))
      .padding(1);
}

// Function to create Y scale
function createYScale(height) {
  return d3.scaleLinear()
      .domain([0, d3.max(data, function (d) { return +d.Count; }) + 3000]) //+3k
      .range([height, 0]);
      
}

// Function to append X axis to the SVG
function appendXAxis(svg, height, x) {
  svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x))
      
      // append text to the line
      .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-45)")
      .style("text-anchor", "end")
      .style("fill", "#CBD0D8")
      .style("opacity", 0.9)
      .style("font-family", "Sans-serif")
      .style("letter-spacing", ".03rem");
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
      .attr("stroke", "#CBD0D8") // lines to lollipops
}

// Function to append circles to the SVG
function appendCircles(svg, data, x, y) {
  // Tooltip
  var Tooltip = d3.select("#lollipop_div")
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
      var [x, y] = d3.pointer(event, lollipopChartArea.node());
      console.log(document.getElementById('text_div').clientHeight)
  
      Tooltip
          .html("Number of words: " + (d.Count).toLocaleString())
          .style("left", x + 10 + lollipopMargin.left + "px")
          .style("top", y + document.getElementById('text_div').clientHeight + 20 +"px")
          .style("font-size", "14px");
    };

  svg.selectAll("mycircle")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", function (d) { return x(d.Name); })
      .attr("cy", function (d) { return y(d.Count); })
      .attr("r", "12")
      .style("fill", "#333D51")
      .attr("stroke", "#D3AC2B")
      .attr("stroke-width", 1)
      .on("mouseover", function (event, d) {
          // Change appearance on mouseover
          hoveredCircle = hoveredCircle === this ? null : this;
          console.log(hoveredCircle)
          d3.select(this)
              .transition()
              .duration(200)
              .attr("r", hoveredCircle === this ? 15 : 12)
              .attr("cursor", "pointer")
              .attr("stroke-width", hoveredCircle === this ? 2 : 1)

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
              .attr("r", 12)
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
      .on("click", function (event, d) {
          // Update selected circle
          const noWhitespace = (d.Name).replace(/\s/g, '');
          window.location.href = `${noWhitespace}`;       
      }); 
}


/*----------------------
BARCHART
----------------------*/
/**
 * Draws a bar chart to visualize counts of Harry Potter mentions or top 5 most used spells based on currId.
 *
 * @param svg SVG element where the chart will be drawn.
 * @param currId the identifier of the current chart.
 * @param currData the data to be visualized in the bar chart.
 */
function drawBarchart(svg, currId, currData) {
      
      // Add X axis
      var headText = currId === "#barchart_div" ? "Who Mentions Harry The Most?" : "Top Five Most Used Spells";
      var additionalDist = currId === "#barchart_div" ? 10 : 0;
      var height = 150
      var width = 300

      // Append heading text
      svg.append("text")
        .attr("x", width / 2 + additionalDist)
        .attr("y", -15)
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .style("letter-spacing", ".15rem")
        .style("font-family", "Monaco")
        .style("fill", "#CBD0D8")
        .style("opacity", 0.75)
        .text(headText);

        var x = d3.scaleLinear()
            .domain([0, d3.max(currData, function (d) { return +d.Count; })])
            .range([0, width]);

        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x))
            .selectAll("text")
            .attr("transform", "translate(-10,0)rotate(-45)")
            .style("text-anchor", "end")
            .style("fill", "#CBD0D8")
            .style("opacity", 0.9)
            .style("font-family", "Verdana")
            .style("letter-spacing", ".03rem");
  

        // Y axis
        var y = d3.scaleBand()
            .range([0, height])
            .domain(currData.map(function (d) { return currId === "#barchart_div" ? d.Name : d.Spell; }))
            .padding(.1);
        

        svg.append("g")
            .call(d3.axisLeft(y))
            .selectAll("text")
            .style("fill", "#CBD0D8")
            .style("font-family", "Sans-Serif")
            .style("letter-spacing", ".06rem")
            .style("font-size", "10.4px")
            .style("opacity", 0.9);
        
        svg  
            .selectAll("line")
            .style("opacity", 0.9) 
            .style("stroke", "#CBD0D8");
        
        svg.selectAll('.domain')
          .style("opacity", 0.7)
          .style("stroke", "#F4F3EA");

          // Add X axis label 
          svg.append("text")
          .attr("text-anchor", "middle")
          .attr("x", width + 30)
          .attr("y", height + 10)
          .style("fill", "white")
          .style("font-family", "Monaco")
          .style("letter-spacing", ".17rem")
          .style("opacity", 0.5)
          .style("font-size", "14px")
          .text("count");

          // Add Y axis label
          svg.append("text")
          .attr("text-anchor", "middle")
          .attr("x", -14)
          .attr("y", -13)
          .style("fill", "white")
          .style("letter-spacing", ".17rem")
          .style("font-family", "Monaco")
          .style("opacity", 0.5)
          .style("font-size", "14px")
          .text(currId === "#barchart_div" ? "name" : "spell");
        
      // Tooltip
        var Tooltip = d3.select(currId)
            .append("div")
            .attr("class", "tooltip")
            .style("background-color", "white")
            .style("border", "none")
            .style("border-width", "1px")
            .style("border-radius", "5px")
            .style("padding", "0.1px")
            .style("position", "absolute");

        // Function to handle mousemove for the tooltip
        var mousemoveTooltip = function (event, d) {
            
            // Calculate the x-coordinate at the end of the bars
            var xEnd = x(+d.Count) + barchartMargin.left + 1; // + 1 for .attr("x", x(0) + 1)
            var xEndB = x(+d.Count) + document.getElementById('barchart_div').clientWidth + barchartMarginB.left + 1;
            // Calculate the y-coordinate at the center of the bar
            var nameOrSpell = currId === "#barchart_div" ? d.Name : d.Spell;
            var yCenter = y(nameOrSpell) + 6 + (y.bandwidth()) / height + (document.getElementById('text_div').clientHeight + document.getElementById('lollipop_div').clientHeight + barchartMargin.top);

            Tooltip
                .html("Count: " + d.Count)
                .style("font-family", "Times")
                .style("left", (currId === "#barchart_div" ? xEnd : xEndB) + "px")
                .style("top", yCenter + "px");
        };

        // Bars
        svg.selectAll("myRect")
            .data(currData)
            .enter()
            .append("rect")
            .attr("x", x(0) + 1)
            .attr("y", function (d) { return currId === "#barchart_div" ? (y(d.Name) + 5) : (y(d.Spell) + 5); })
            .attr("rx", 2) // Set the x-radius for rounded corners
            .attr("ry", 2) // Set the y-radius for rounded corners
            .attr("width", function (d) { return x(+d.Count); })
            .attr("height", y.bandwidth() - 7)
            .attr("fill", "#6B7A8F")
            .attr("opacity", 1)
            .on("mouseover", function (event, d) {
                
                // Change appearance on mouseover
                svg.selectAll("rect")
                    .transition()
                    .duration(300)
                    .attr("opacity", 0.3); // Reduce opacity for all rectangles

                d3.select(this)
                    .transition()
                    .duration(300)
                    .attr("opacity", 1); // Keep opacity at 1 for the hovered rectangle

                // Show tooltip
                Tooltip
                    .style("opacity", 1);
                mousemoveTooltip.call(this, event, d);
            })
            .on("mouseout", function () {
                // Revert appearance on mouseout
                svg.selectAll("rect")
                    .transition()
                    .duration(300)
                    .attr("opacity", 1); // Restore normal opacity for all rectangles

                // Hide tooltip
                Tooltip
                    //.style("left", "-999px")
                    .style("opacity", 0);
            });
}

/*-----------------------
PROPORTIONAL AREA CHART
-------------------------*/
/**
 * Draws a proportional area chart to visualize word counts in different Harry Potter episodes.
 *
 * @param svg SVG element where the chart will be drawn.
 */
function drawAreachart(svg) {
  
  var margin = {top: 20, right: 20, bottom: 10, left: 10},
  width = 420 - margin.left - margin.right,
  height = 440 - margin.top - margin.bottom;

  // stratify the data: reformatting for d3.js
  var root = d3.stratify()
    .id(function(d) { return d.Episode; })   // Name of the entity (column name is name in csv)
    .parentId(function(d) { return d.parent; })   // Name of the parent (column name is parent in csv)
    (dataWords);
  root.sum(function(d) { return +d.Count })   // Compute the numeric value for each entity

  // Then d3.treemap computes the position of each element of the hierarchy
  // The coordinates are added to the root object above
  d3.treemap()
    .size([width, height])
    .padding(4)
    (root);

  // Define a custom color scale based on the names
  var customColorScale = d3.scaleOrdinal()
    .domain(["HP1", "HP2", "HP3", "HP4", "HP5", "HP6", "HP7", "HP8"])
    .range(["#C87C79", "#EAC182", "#629EBB", "#F9AF44", "#769561", "#d6783e", "#DFA858", "#C7C1A7"])

  // use this information to add rectangles:
  svg
    .selectAll("rect")
    .data(root.leaves())
    .enter()
    .append("rect")
      .attr('x', function (d) { return d.x0; })
      .attr('y', function (d) { return d.y0; })
      .attr('width', function (d) { return d.x1 - d.x0; })
      .attr('height', function (d) { return d.y1 - d.y0; })
      .attr('rx', 4) // Set the horizontal radius of the corners
      .attr('ry', 4) // Set the vertical radius of the corners
      .style("stroke", "#333D51")
      .style("fill", function (d) { return customColorScale((d.data).Episode); })
      .attr("fill-opacity", 0.76);

  // and to add the text labels
    svg.selectAll("text")
      .data(root.leaves())
      .enter()
      .append("text")
      .attr("x", function(d) { return d.x0 + 5; })    // +10 to adjust position (more right)
      .attr("y", function(d) { return d.y0 + 20; })    // +20 to adjust position (lower)
      .attr("font-size", "10px")
      .style("font-family", "Monaco")
      .style("letter-spacing", ".047rem")
      .attr("fill", function(d) {
          // Set text color to white for specific episodes
          return (d.data.Episode === "Philosopher's Stone" ) ? "#333D51" : "#333D51"; //9BAEBE //8B9FB0 //#8B92A0
      })
      .style("font-weight", "bold")
      .style("opacity", 1)
      .text(function(d) { return '\u2022 ' + (d.data).Episode; })

      .append("tspan")
        .attr("x", function(d) { return d.x0 + 5; })
        .attr("y", function(d) { return d.y0 + 36; })  // Adjust the y-coordinate for the second line
        .text(function(d) { return `\u2022 Words: `; })
        .append("tspan")
          .attr("font-size", "15px")  // Larger font size for the number
          .attr("y", function(d) { return d.y0 + 37; })
          .text(function(d) { return ((d.data).Count).toLocaleString();})
          .style("font-family", "Monaco")
}

/*----------------------
SCALEDUP NUMBER
----------------------*/
/**
 * Draws a scaled-up number that tells how many times Voldemort was mentioned.
 *
 * @param svg SVG element where the chart will be drawn.
 */
function drawScaledUpNumber(svg) {
  svg.append("text")
  .attr("dx", 89)
  .attr("dy", "3em")
  .attr("class", "headlineB")
  .attr("text-anchor", "middle")
  .style("font-size", "30px")
  .style("fill", "white" )
  .style("letter-spacing", ".08rem")
  .style("opacity", 0.7)
  .text("Voldemort Was Mentioned");

  svg.append("text")
  .attr("dx", 89)
  .attr("dy", "3.8em")
  .attr("class", "headlineB")
  .attr("text-anchor", "middle")
  .style("font-size", "40px")
  .style("fill", "#D3AC2B" )
  .style("letter-spacing", ".1rem")
  .style("opacity", 0.7)
  .text(VoldemortMentions);

  svg.append("text")
  .attr("dx", 89)
  .attr("dy", "6.8em")
  .attr("class", "headlineB")
  .attr("text-anchor", "middle")
  .style("font-size", "30px")
  .style("fill", "white" )
  .style("letter-spacing", ".2rem")
  .style("opacity", 0.7)
  .text("Times");
}
