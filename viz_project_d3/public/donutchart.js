import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

var barchartMargin = { top: 220, left: 220 }; // margins for barchart
var donutchartMargin = {top: 300, left: 400}; // margins for donutchart

/**
 * Main function that is called from corresponding .html files. 
 * It conducts drawing of everything on a page related to specific character 
 * @param name name of the character
 * @param idText id of the text div
 * @param idDonut id of the donut chart div
 * @param idBar id of the bar chart div
 */
export function main(name, idText, idDonut, idBar) {
    drawText(name, idText);
    drawDonutChart(name, idDonut);
    drawBarchartSpot(name, idBar);
}

/**
 * Draws the heading of the page related to the particular character.
 * @param name name of the character 
 * @param strId id of the text div
 */
function drawText(name, strId) {
    var textArea;
    textArea = d3.select(strId)
    .attr("width", d3.select(strId).node().clientWidth)
    .attr("height", d3.select(strId).node().clientHeight)

    textArea.append("text")
    .attr("dx", screen.width / 2)
    .attr("dy", "1.4em")
    .attr("class", "headlineB")
    .attr("text-anchor", "middle")
    .style("font-size", "60px")
    .style("letter-spacing", ".15rem")
    .text(name);

}

/**
 * Initializes a bar chart area within the specified HTML element.
 *
 * @param strId id of the barchart div
 * @returns initialized bar chart area
 */
function initBarchart(strId) {
  var barchartSpotArea
  barchartSpotArea = d3.select(strId)
  .append("svg")
  .attr("width", d3.select(strId).node().clientWidth)
  .attr("height", d3.select(strId).node().clientHeight)
  .append("g")
  .attr("transform", "translate(" + barchartMargin.left + "," + barchartMargin.top + ")");

  return barchartSpotArea;
}

/**
 * Initializes a donut chart area within the specified HTML element.
 *
 * @param strId id of the donut chart div
 * @returns initialized bar chart area
 */
function initDonut(strId) {
  var donutchartArea
  donutchartArea = d3.select(strId)
  .append("svg")
  .attr("width", d3.select(strId).node().clientWidth)
  .attr("height", d3.select(strId).node().clientHeight)
  .append("g")
  .attr("transform", "translate(" + donutchartMargin.left + "," + donutchartMargin.top + ")");

  return donutchartArea;
}

/**
 * Loads the data and subsequently draws donut chart for a specific character based on words spoken per episode.
 * 
 * @param name name of the character for which the donut chart is drawn
 * @param strId id of donut chart div
 */
function drawDonutChart(name, strId) {
    var dataWordsPerEpisode;
    d3.csv("characterWordsPerEpisode.csv", function(d) {
        return {
            Episode: d["Episode"],
            Name: d["Name"],
            Count: +d["Count"],
        };
    })
    .then(function(csvData) {
        dataWordsPerEpisode = csvData;

        var svg = initDonut(strId);

        var currCharData = dataWordsPerEpisode.filter(function (row) {
            return row['Name'] === name;
        })
        .map(function (row) {
            return {
                Episode: row['Episode'],
                Count: +row['Count'],
            };
        });

        var width = 350;
        var height = 350;
        var margin = 40;

        var radius = Math.min(width, height) / 2 - margin;

        var normalArc = d3.arc().outerRadius(radius - 15).innerRadius(radius - 40);
        var outerArc = d3.arc().innerRadius(radius * 0.9).outerRadius(radius * 0.9)

        var total = d3.sum(currCharData, function (d) { return +d.Count; });

        var centralText = svg.append("text")
            .attr("font-size", "24px")
            .attr("text-anchor", "middle")
            .style("fill", "#CBD0D8")
            .style("font-family", "Monaco")
            .style("letter-spacing", ".05rem")
            .text(total.toLocaleString());

        var wordText = svg.append("text")
            .attr("font-size", "23px")
            .attr("text-anchor", "middle")
            .attr("dy", "1.5em")
            .style("fill", "#CBD0D8")
            .style("font-family", "Monaco")
            .style("letter-spacing", ".17rem")
            .text('words');

        var color = d3.scaleOrdinal()
            .domain(currCharData.map(function (d) { return d.Episode; }))
            .range(["#C87C79", "#EAC182", "#629EBB", "#F9AF44", "#769561", "#d6783e", "#DFA858", "#C7C1A7"])

        var pie = d3.pie()
            .sort(null)
            .value(function (d) {
                return +d.Count;
            });

        var dataReady = pie(currCharData);
        

        svg
            .selectAll('whatever')
            .data(dataReady)
            .enter()
            .append('path')
            .attr('d', normalArc)
            .attr("stroke", "#333D51")
            .attr("stroke-width", "1px")
            .attr('fill', function (d) {
                return (color((d.data).Episode));
            })
            .style("opacity", 0.65)
            .on("mouseover", function (event, d) {
                centralText.text(d['data'].Count);
                svg.selectAll('path, polyline, text').style("opacity", 0.2);

                d3.select(this).style("opacity", 0.8);
                d3.select(this).attr("d", normalArc).attr("stroke", "#222D36").attr("stroke-width", "2px");  //#293742

                var episode = (d.data).Episode;
                svg.select('polyline[data-episode="' + episode + '"]').style("opacity", 1); //to keep polyline that belongs to the hovered part at op 1
                svg.select('text[data-episode="' + episode + '"]').style("opacity", 1);
                svg.select('text[data-episode="' + episode + '-label"]').style("opacity", 1); // Adjust this line
                centralText.style("opacity", 1);
                wordText.style("opacity", 1);
                var formattedCount = d['data'].Count.toLocaleString();  // Format the number on mouseover
                centralText.text(formattedCount);
            })
            .on("mouseout", function () {
                centralText.text(total.toLocaleString());  // Format the number on mouseout
                svg.selectAll('path, polyline, text').style("opacity", 0.65);
                d3.select(this).attr("d", normalArc).attr("stroke", "#333D51").attr("stroke-width", "1px");
            });

        svg
            .selectAll('allPolylines')
            .data(dataReady)
            .enter()
            .append('polyline')
            .attr("data-episode", function (d) { return (d.data).Episode; })
            .attr("stroke", "#CBD0D8")
            .style("fill", "none")
            .attr("stroke-width", 1)
            .attr('points', function (d) {
                var posA = normalArc.centroid(d);
                var posB = outerArc.centroid(d);
                var posC = outerArc.centroid(d);
                var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2;
                posC[0] = radius * 0.95 * (midangle < Math.PI ? 1 : -1);
                
                if((d.data).Episode === 'Half-Blood Prince' && name === 'Rubeus Hagrid') {
                    posA[1] += 8;
                    posB[1] += 8;  
                    posC[1] += 8;  
                }
                
                return [posA, posB, posC];
            });

        svg 
            .selectAll('allLabels')
            .data(dataReady)
            .enter()
            .append('text')
            .attr("data-episode", function (d) { return (d.data).Episode; })
            .text(function (d) { return (d.data).Episode; })
            .attr('transform', function (d) {
                var pos = outerArc.centroid(d);
                var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2;
                pos[0] = radius * 0.99 * (midangle < Math.PI ? 1 : -1);
                
                if(d3.select(this).text() === 'Half-Blood Prince' && name === 'Rubeus Hagrid') {
                    pos[1] = pos[1] + 8;

                }

                return 'translate(' + pos + ')';
            })
            .style('text-anchor', function (d) {
                var midangle = d.startAngle + (d.endAngle - d.startAngle) / 2;
                return (midangle < Math.PI ? 'start' : 'end');
            })
            .style('fill', '#CBD0D8')
            .style('font-family', 'Monaco')
            .style("font-size", "15px")
            .style("letter-spacing", ".15rem")
            .attr("opacity", 0.8) // Set default opacity for labels
            .attr("data-episode", function (d) { return (d.data).Episode + '-label'; });
    });
}



/**
 * Draws a bar chart to visualize the most visited places for a specific character based on dialogue counts.
 *
 * @param name name of the character for which the bar chart is drawn
 * @param strId id of bar chart div
 */
function drawBarchartSpot(name, strId) {
    var svg = initBarchart(strId);
    var height = 200
    var width = 400

    var dataPlaces;
    d3.csv("mostVisitedPlacesPerChar.csv", function(d) {
        return {
          Name: d["Name"],
          Place: d["Place"],
          Count: +d["Count"],
        };
      })
        .then(function(csvData) {
    dataPlaces = csvData;

    // Filter out only data for required character
    var currCharData = dataPlaces.filter(function (row) {
        return row['Name'] === name;
        })
        .map(function (row) {
        return {
            Place: row['Place'],
            Count: +row['Count'],
        };
        });
        
    // Append heading text
    svg.append("text")
      .attr("x", width / 2 + 20)
      .attr("y", -35)
      .attr("text-anchor", "middle")
      .style("font-size", "18px")
      .style("font-family", "Monaco")
      .style("letter-spacing", ".15rem") //spacing

      .style("fill", "#CBD0D8")
      .style("opacity", 0.75)
      .text("Where did " + name + " spend most time?" );

      var x = d3.scaleLinear()
          .domain([0, d3.max(currCharData, function (d) { return +d.Count; })])
          .range([0, width])

      svg.append("g")
          .attr("transform", "translate(0," + height + ")")
          .call(d3.axisBottom(x))
          .selectAll("text")
          .attr("transform", "translate(-10,0)rotate(-45)")
          .style("text-anchor", "end")
          .style("fill", "#CBD0D8")
          .style("opacity", 0.9)
          .style("font-family", "Verdana")
          .style("letter-spacing", ".03rem")         
        

      // Y axis
      var y = d3.scaleBand()
          .range([0, height])
          .domain(currCharData.map(function (d) { return d.Place; }))
          .padding(.1);

      svg.append("g")
          .call(d3.axisLeft(y))
          .selectAll("text")
          .style("fill", "#CBD0D8")
          .style("font-family", "Sans-Serif")
          .style("letter-spacing", ".07rem")
          .style("font-size", "11.5px")
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
    .attr("x", width + 34) //50
    .attr("y", height - 5) //10
    .style("fill", "white")
    .style("font-family", "Monaco")
    .style("letter-spacing", ".17rem")
    .style("opacity", 0.5)
    .style("font-size", "14px")
    .text("count");

    svg.append("text") 
    .attr("text-anchor", "middle")
    .attr("x", width + 50)
    .attr("y", height + 14)
    .style("fill", "white")
    .style("font-family", "Monaco")
    .style("letter-spacing", ".17rem")
    .style("opacity", 0.5)
    .style("font-size", "14px")
    .text("dialogues");


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
    .text("place")
    
    
     // Tooltip
      var Tooltip = d3.select(strId)
          .append("div")
          .attr("class", "tooltip")
          .style("background-color", "white")
          .style("border", "none")
          .style("border-width", "1px")
          .style("border-radius", "4px")
          .style("padding", "0.3px")
          .style("opacity", 0) //???
          .style("position", "absolute");

      // Function to handle mousemove for the tooltip
      var mousemoveTooltip = function (event, d) {
          
          // Calculate the x-coordinate at the end of the bar
          var xEnd = x(+d.Count) + document.getElementById('donutchart_div').clientWidth + barchartMargin.left + 2;

          // Calculate the y-coordinate at the center of the bar
          var yCenter = document.getElementById('text_div').clientHeight + barchartMargin.top + 10/2 + 4 + y(d.Place) + y.bandwidth() / height;

          Tooltip
              .html("Dialogues: " + d.Count)
              .style("font-family", "Times")
              .style("left", xEnd + "px")
              .style("top", yCenter + "px");
      };
      

      // Bars
      svg.selectAll("myRect")
          .data(currCharData)
          .enter()
          .append("rect")
          .attr("x", x(0) + 1)
          .attr("y", function (d) { return y(d.Place) + 4; })
          .attr("rx", 2) // Set the x-radius for rounded corners
          .attr("ry", 2) // Set the y-radius for rounded corners
          .attr("width", function (d) { return x(+d.Count); })
          .attr("height", y.bandwidth() - 10)
          .attr("fill", "#6B7A8F")
          .attr("opacity", 1)
          .on("mouseover", function (event, d) {
              // Change appearance on mouseover
              d3.selectAll("rect")
                  .transition()
                  .duration(200) 
                  .attr("opacity", 0.3); // Reduce opacity for all rectangles

              d3.select(this)
                  .transition()
                  .duration(200)
                  .attr("opacity", 1); // Keep opacity at 1 for the hovered rectangle

              // Show tooltip
              Tooltip
                  .style("opacity", 1);
              mousemoveTooltip.call(this, event, d);
          })
          .on("mouseout", function () {
              // Revert appearance on mouseout
              d3.selectAll("rect")
                  .transition()
                  .duration(200)
                  .attr("opacity", 1); // Restore normal opacity for all rectangles

              // Hide tooltip
              Tooltip
                  .style("opacity", 0);
          });
    });

}