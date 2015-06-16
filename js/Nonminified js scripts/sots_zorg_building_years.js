///////////////////////////////////////////////////////////////////////////
///////////// Initiate Tilburg Building Year Line Dot plot ////////////////
///////////////////////////////////////////////////////////////////////////

//General widths and heights	
var lineTilburgMargin = {left: (mobileScreen ? 30 : 200), top: 30, right: (mobileScreen ? 30 : 200), bottom: 30},
	lineTilburgWidth = Math.min($(".dataresource.tilburg.year").width(),900) - lineTilburgMargin.left - lineTilburgMargin.right,
	lineTilburgHeight = 150;

//Create SVG inside the div	
var svgLineTilburg = d3.select(".dataresource.tilburg.year").append("svg")
		.attr("width", (lineTilburgWidth + lineTilburgMargin.left + lineTilburgMargin.right))
		.attr("height", (lineTilburgHeight + lineTilburgMargin.top + lineTilburgMargin.bottom));
		
//Create g elements for each group of chart elements	
var lineTilburg = svgLineTilburg.append("g").attr("class", "scatter")
		.attr("transform", "translate(" + lineTilburgMargin.left + "," + (lineTilburgMargin.top + lineTilburgHeight/2) + ")");

//////////////////////////////////////////////////////////////
/////// Draw the Scatter plot with multiple circles //////////
//////////////////////////////////////////////////////////////

function drawBuildingYearLine(wrapper, width, height, margin) {
		
	var data = zorginstellingenTilburg.filter(function(d) { return d.bouwjaar > 1950; });
	
	var startYear20 = 1985,
		endYear20 = 1991,
		startYear50 = 1992,
		endYear50 = 1999;
	
	//////////////////////////////////////////////////////
	/////////////////// Initialize Axes //////////////////
	//////////////////////////////////////////////////////

	//Set the new x axis range - Already done in parent function
	//Set the new x axis range
	var xScale = d3.scale.linear()
		.range([0, width])
		.domain(d3.extent(data, function(d) {return d.bouwjaar;}))
		.nice();
		
	//Set new x-axis	
	var xAxis = d3.svg.axis()
		.orient("bottom")
		.ticks(6, ",d")
		.tickFormat(d3.format("d"))
		.scale(xScale);	

	//Append the x-axis
	wrapper.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(" + 0 + "," + (40) + ")")
		.call(xAxis);
	
	var rScale = d3.scale.sqrt()
		.range([0, (mobileScreen ? 10 : 20)])
		.domain([0, d3.max(data, function(d) {return d.ZZP_totaal;})]);

	//////////////////////////////////////////////////////
	//////// Rectangles around transformability //////////
	//////////////////////////////////////////////////////

	//Rectangle for the 2% transformability period
	wrapper.append("rect")
		.attr("width", xScale(startYear20) + 1)
		.attr("height", 100)
		.attr("x", 0)
		.attr("y", -60)
		.style("opacity", 0.05)
		.style("fill", "#81BC00");
		
	//Rectangle for the 20% transformability period
	wrapper.append("rect")
		.attr("width", xScale(startYear50) - xScale(startYear20) + 1)
		.attr("height", 100)
		.attr("x", xScale(startYear20))
		.attr("y", -60)
		.style("opacity", 0.3)
		.style("fill", "#81BC00");
		
	//Rectangle for the 50% transformability period	
	wrapper.append("rect")
		.attr("width", xScale(endYear50) - xScale(startYear50) + 1)
		.attr("height", 100)
		.attr("x", xScale(startYear50))
		.attr("y", -60)
		.style("opacity", 0.5)
		.style("fill", "#81BC00");

	//Rectangle for the 5% transformability period
	wrapper.append("rect")
		.attr("width", width - xScale(endYear50))
		.attr("height", 100)
		.attr("x", xScale(endYear50))
		.attr("y", -60)
		.style("opacity", 0.1)
		.style("fill", "#81BC00");
	
	//Chance above entire chart	
	wrapper.append("text")
		//.attr("x", xScale(startYear20) + (xScale(endYear50) - xScale(startYear20))/2 )
		.attr("x", width/2)
		.attr("y", -70)
		.style("text-anchor", "middle")
		.style("font-size", "13px")
		.style("fill", "#A8A8A8")
		.text("Kans op transformeerbaarheid");

	//2% chance
	wrapper.append("text")
		.attr("x", xScale(startYear20)/2 )
		.attr("y", -40)
		.style("text-anchor", "middle")
		.style("font-size", "11px")
		.style("fill", "#4d7000")
		.text("2%");		
	//20% chance
	wrapper.append("text")
		.attr("x", xScale(startYear20) + (xScale(startYear50) - xScale(startYear20))/2 )
		.attr("y", -40)
		.style("text-anchor", "middle")
		.style("font-size", "11px")
		.style("fill", "#4d7000")
		.text("20%");
	//50% chance
	wrapper.append("text")
		.attr("x", xScale(startYear50) + (xScale(endYear50) - xScale(startYear50))/2 )
		.attr("y", -40)
		.style("text-anchor", "middle")
		.style("font-size", "11px")
		.style("fill", "#4d7000")
		.text("50%");
	//5% chance
	wrapper.append("text")
		.attr("x", xScale(endYear50) + (width - xScale(endYear50))/2 )
		.attr("y", -40)
		.style("text-anchor", "middle")
		.style("font-size", "11px")
		.style("fill", "#4d7000")
		.text("5%");	
		
	////////////////////////////////////////////////////////////	
	/////////////////// Scatterplot Circles ////////////////////
	////////////////////////////////////////////////////////////	
	
	//ZZP 5 - 10 in 2020 growth circles
	wrapper.selectAll(".circle_zorgkantoren")
		.data(data)
		.enter().append("circle")
			.attr("class", "circle_zorgkantoren")
			.style("opacity", 0.8)
			.style("fill", function(d) { 
				if(d.bouwjaar >= startYear20 & d.bouwjaar <= endYear50) return "#81BC00";
				else return "#BEBEBE";
			})
			.attr("cx", function(d) {return xScale(d.bouwjaar); })
			.attr("cy", 0)
			.attr("r", function(d) {return rScale(d.ZZP_totaal); })
			.on("mouseover", function (d, i) { showBuildingNameTooltip.call(this, d); })
			.on("mouseout",  function (d) { removeBuildingNameTooltip(); });

	
	//////////////////////////////////////////////////////
	///////////////// Initialize Labels //////////////////
	//////////////////////////////////////////////////////

	//Set up X axis label
	wrapper.append("g")
		.append("text")
		.attr("class", "x axis label")
		.attr("text-anchor", "middle")
		.attr("transform", "translate(" + (width/2) + "," + (75) + ")")
		.style("font-size", "10px")
		.text("Bouwjaar");

	//////////////////////////////////////////////////////
	///////////////// Initialize Legend //////////////////
	//////////////////////////////////////////////////////

	if (!mobileScreen) {
		var legend = wrapper.append("g").attr("class", "legendWrapper")
						.attr("transform", "translate(" + (width + 150) + "," + -30 +")");
						
		bubbleLegend(legend, rScale, legendSizes = [300, 150, 50], legendName = "Aantal plaatsen per locatie");				

		//Create a wrapper for the circle legend				
		var legendCircle = wrapper.append("g").attr("class", "legendWrapper")
						.attr("transform", "translate(" + (width + 60) + "," + -30 +")");
		
		legendCircle.append("text")
			.attr("class","legendTitle")
			.attr("transform", "translate(" + 0 + "," + -25 + ")")
			.attr("x", 0 + "px")
			.attr("y", 0 + "px")
			.attr("dy", "1em")
			.text("Elke cirkel is een zorglocatie")
			.call(wrap, 90);
		legendCircle.append("circle")
			.attr('r', rScale(300))
			.attr('class',"legendCircle")
			.attr('cx', 0)
			.attr('cy', rScale(300) + 10);
	}//if	
	
}// function drawBuildingYearLine

//Hide the tooltip when the mouse moves away
function removeBuildingNameTooltip () {
  $('.popover').each(function() {
	$(this).remove();
  }); 
}
//Show the tooltip on the hovered over slice
function showBuildingNameTooltip (d) {
  $(this).popover({
	placement: 'auto top',
	container: '.dataresource.tilburg.year',
	trigger: 'manual',
	html : true,
	content: function() { 
	  return "<span style='font-size: 11px;'>" + d.instellingNaam +"</span>"; }
  });
  $(this).popover('show')
}
		
///////////////////////////////////////////////////////////////////////////
/////////////////////////// Initiate charts ///////////////////////////////
///////////////////////////////////////////////////////////////////////////
	
////////////////// Tilburg - Building year line chart /////////////////////
	
//Draw Tilburg health care centers building year chart
drawBuildingYearLine(lineTilburg, lineTilburgWidth, lineTilburgHeight, lineTilburgMargin);	