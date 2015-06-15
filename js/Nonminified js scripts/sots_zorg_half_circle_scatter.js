///////////////////////////////////////////////////////////////////////////
//////////////// Initiate Half-Circles Scatterplot ////////////////////////
///////////////////////////////////////////////////////////////////////////

//General widths and heights	
var scatterTilburgMargin = {left: 100, top: 70, right: 100, bottom: 90},
	scatterTilburgWidth = $(".dataresource.tilburg.scatter").width() - scatterTilburgMargin.left - scatterTilburgMargin.right,
	scatterTilburgHeight = Math.min(500, scatterTilburgWidth*3/5);

//Create SVG inside the div	
var svgScatterTilburg = d3.select(".dataresource.tilburg.scatter").append("svg")
		.attr("width", (scatterTilburgWidth + scatterTilburgMargin.left + scatterTilburgMargin.right))
		.attr("height", (scatterTilburgHeight + scatterTilburgMargin.top + scatterTilburgMargin.bottom));
		
//Create g elements for each group of chart elements	
var scatterTilburg = svgScatterTilburg.append("g").attr("class", "scatter")
		.attr("transform", "translate(" + scatterTilburgMargin.left + "," + scatterTilburgMargin.top + ")");

//////////////////////////////////////////////////////////////
/////// Draw the Scatter plot with multiple circles //////////
//////////////////////////////////////////////////////////////

function drawTilburgScatter(wrapper, width, height, margin) {

	function filterTilburg(d) {
		if (d.GM_NAAM === "Apeldoorn" | d.GM_NAAM === "Arnhem" | d.GM_NAAM === "Breda" | 
			d.GM_NAAM === "Eindhoven" | d.GM_NAAM === "'s-Hertogenbosch" | d.GM_NAAM === "Maastricht" | d.GM_NAAM === "Oss" | 
			d.GM_NAAM === "Nijmegen" |  d.GM_NAAM === "Roosendaal" | d.GM_NAAM === "Sittard-Geleen" | d.GM_NAAM === "Tilburg" | d.GM_NAAM === "Venlo" |
			d.GM_NAAM === "Heerlen" | d.GM_NAAM === "Ede") {return true;} //"Helmond"
		else {return false;}
	}
	var data = gemeentes.filter(filterTilburg);
							 
	//////////////////////////////////////////////////////
	/////////////////// Initialize Axes //////////////////
	//////////////////////////////////////////////////////

	//Set the new x axis range - Already done in parent function
	//Set the new x axis range
	var xScale = d3.scale.linear()
		.range([0, width - 1/6*width])
		//.domain(d3.extent(data, function(d) {return d.GroeiZwaar_VerdwijningLicht;}))
		.domain([0,1])
		.nice();
		
	//Set new x-axis	
	var xAxis = d3.svg.axis()
		.orient("bottom")
		.ticks(6, ",d")
		.scale(xScale)
		.tickFormat(numFormatPercent);	

	//Append the x-axis
	wrapper.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(" + 0 + "," + (height) + ")")
		.call(xAxis);
			
	//Set the new y axis range
	var yScale = d3.scale.linear()
		.range([height,0])
		.domain([0,0.3])
		//.domain(d3.extent(data, function(d) {return d.Perc_Groei_80plus;}))
		.nice();
		
	var yAxis = d3.svg.axis()
		.orient("left")
		.ticks(4)  //Set rough # of ticks
		.tickFormat(numFormatPercent)
		.scale(yScale);	

	//Append the y-axis
	wrapper.append("g")
			.attr("class", "y axis")
			.attr("transform", "translate(" + 0 + "," + 0 + ")")
			.call(yAxis);

	var rScale = d3.scale.sqrt()
		.range([0, 40])
		.domain([0, d3.max(data, function(d) {return d.ZZP1_4;})]);
		
	////////////////////////////////////////////////////////////	
	/////////////////// Scatterplot Circles ////////////////////
	////////////////////////////////////////////////////////////	

	//Gradient for the light blue half circle
	var gradientZZP1_4 = wrapper.append("defs")
			.append("linearGradient")
			.attr("id", "gradientZZP1_4")
			.attr("x1", "0%")
			.attr("x2", "100%")
			.attr("y1", "0%")
			.attr("y2", "0%");	
	gradientZZP1_4.append("stop").attr("offset", "50%").style("stop-color", "#00a1de").style("stop-opacity", 1);
	gradientZZP1_4.append("stop").attr("offset", "50%").style("stop-color", "white").style("stop-opacity", 0);
	
	//ZZP1 - 4 circle
	wrapper.selectAll(".circle_ZZP1_4")
			.data(data)
			.enter().append("circle")
				.attr("class", "circle_ZZP1_4")
				.style("opacity", function(d) {
					if(d.GM_NAAM === "Tilburg") return 1;
				else return 0.6; })
				.attr("fill", "url(#gradientZZP1_4)")
				.attr("cx", function(d) { 
					if(d.GM_NAAM === "Oss" | d.GM_NAAM === "Venlo") return xScale(1.05);
					else return xScale(d.GroeiZwaar_VerdwijningLicht);			
				})
				.attr("cy", function(d) {return yScale(d.Perc_Groei_80plus);})
				.attr("r", function(d) {return rScale(d.ZZP1_4);})
				.on("mouseover", function (d, i) { showTilburgScatterTooltip.call(this, d); })
				.on("mouseout",  function (d) { removeTilburgScatterTooltip(); });

	//Gradient for the dark blue half circle
	var gradientZZP5_10 = wrapper.append("defs")
			.append("linearGradient")
			.attr("id", "gradientZZP5_10")
			.attr("x1", "0%")
			.attr("x2", "100%")
			.attr("y1", "0%")
			.attr("y2", "0%");	
	gradientZZP5_10.append("stop").attr("offset", "50%").style("stop-color", "white").style("stop-opacity", 0);
	gradientZZP5_10.append("stop").attr("offset", "50%").style("stop-color", "#002776").style("stop-opacity", 1);
	
	//ZZP 5 - 10 in 2020 growth circles
	wrapper.selectAll(".circle_ZZP5_10_growth")
		.data(data)
		.enter().append("circle")
			.attr("class", "circle_ZZP5_10_growth")
			.style("opacity", function(d) {
				if(d.GM_NAAM === "Tilburg") return 1;
				else return 0.6; })
			.style("fill", "url(#gradientZZP5_10)")
			//.style("stroke", "#002776")
			//.style("stroke-width", 1)
			//.style("stroke-dasharray", ("3, 3"))
			.attr("cx", function(d) { 
					if(d.GM_NAAM === "Oss" | d.GM_NAAM === "Venlo") return xScale(1.05);
					else return xScale(d.GroeiZwaar_VerdwijningLicht);			
			})
			.attr("cy", function(d) {return yScale(d.Perc_Groei_80plus);})
			.attr("r", function(d) {return Math.max(0, rScale(d.ZZP5_10_Groei));})
			.on("mouseover", function (d, i) { showTilburgScatterTooltip.call(this, d); })
			.on("mouseout",  function (d) { removeTilburgScatterTooltip(); });
	

	//////////////////////////////////////////////////////
	//////////////////// City labels /////////////////////
	//////////////////////////////////////////////////////
	
	//Labels per city
	wrapper.selectAll(".cityLabel")
			.data(data)
			.enter().append("text")
				.attr("class", "cityLabel")
				.style("pointer-events", "none")
				.style("fill", function(d) {
					if(d.GM_NAAM === "Tilburg") return "#383838";
					else return "#6B6B6B"; 
				})
				.style("font-size", function(d) {
					if(d.GM_NAAM === "Tilburg") return "14px";
					else return "11px"; 
				})
				.style("text-anchor", "middle")
				.attr("x", function(d) { 
					if(d.GM_NAAM === "Oss" | d.GM_NAAM === "Venlo") return xScale(1.05);
					else return xScale(d.GroeiZwaar_VerdwijningLicht);			
				})
				.attr("y", function(d) { 
					if(d.GM_NAAM === "Tilburg") return yScale(d.Perc_Groei_80plus) - rScale(d.ZZP1_4) - 15;
					else if(d.GM_NAAM === "Nijmegen" | d.GM_NAAM === "Roosendaal" | d.GM_NAAM === "Arnhem" | d.GM_NAAM === "Apeldoorn") return yScale(d.Perc_Groei_80plus) + rScale(d.ZZP1_4) + 12;
					else if(d.GM_NAAM === "Venlo") return yScale(d.Perc_Groei_80plus) + rScale(d.ZZP5_10_Groei) + 12;
					else return yScale(d.Perc_Groei_80plus) - rScale(d.ZZP1_4) - 9;					
				})
				.text(function(d) { return d.GM_NAAM; });
	
	//////////////////////////////////////////////////////
	///////////////// Initialize Labels //////////////////
	//////////////////////////////////////////////////////

	//Set up X axis label
	wrapper.append("g")
		.append("text")
		.attr("class", "x axis label")
		.attr("text-anchor", "middle")
		.attr("transform", "translate(" + (width/2) + "," + (height + 40) + ")")
		.style("font-size", "10px")
		.text("Verhouding van de toename van het zware versus de afname van het " + 
			  "lichte intramurale zorgaanbod (donkerblauwe versus lichtblauwe halve cirkel)");

	//Set up y axis label
	wrapper.append("g")
		.append("text")
		.attr("x", 0)
		.attr("y", 0)
		.attr("dy", "0.35em")
		.attr("class", "y axis label")
		.attr("text-anchor", "middle")
		.attr("transform", "translate(" + 0 + "," + (-margin.top*1/3 - 6) + ")")
		.style("font-size", "10px")
		.text("Ontwikkeling van populatie 80+")
		.call(wrap, 100);

	//Set up chart title
	//wrapper.append("g")
	//	.append("text")
	//	.attr("class","chartTitle")
	//	.attr("transform", "translate(" + (width/2) + "," + (-margin.top*3/4) + ")")
	//	.style("text-anchor", "middle")
	//	.style("font-size", "12px")
	//	.text("Gemeentes vergelijken");	
	

	var zeroLine = wrapper.append("g").attr("class", "median")
		.attr("transform", "translate(" + xScale(0) + "," + 0 + ")")
		.style("cursor", "default");
	//The line itself
	zeroLine.append("line")
		.attr("x1", 0)
		.attr("x2", 0)
		.attr("y1", 0)
		.attr("y2", (height + 10))
		.style("stroke", "#B5B5B5")
		.style("stroke-width", 1)
		.style("stroke-dasharray", "2 2")
		.style("shape-rendering", "crispEdges")
		.style("pointer-events", "none");	

	//////////////////////////////////////////////////////
	/////////////////// Create Annotation ////////////////////
	//////////////////////////////////////////////////////
	
	var annotation = wrapper.append("g").attr("class", "annotationWrapper")
					.attr("transform", "translate(" + xScale(1.05) + "," + yScale(0.215) +")");				
	
	//The line and text explaining the > 100% cities
	annotation.append("line")
        .attr('class',"legendLine")
        .attr('x1', 0)
        .attr('y1', 0)
		.attr('x2', 0)
        .attr('y2', 60);	
	annotation.append("text")
        .attr('class',"legendText")
        .attr('x', 8)
        .attr('y', 25)
		.attr('dy', '0.75em')
		.text("Venlo en Oss hebben een toename van het zware intramurale zorgaanbod die 170%, respectievelijk, 160% omvat van " +
			  "de afname van het lichte intramurale zorgaanbod. De locatie langs de verticale as is correct weergegeven.")
		.call(wrap, 130);	
	//////////////////////////////////////////////////////
	/////////////////// Create Legend ////////////////////
	//////////////////////////////////////////////////////
	
	var legend = wrapper.append("g").attr("class", "legendWrapper")
					.attr("transform", "translate(" + (60) + "," + (100) +")");				
	
	//Left ZZP 1 - 4 half
	legend.append("circle")
		.attr("class", "legendScatterCircle")
		.style("opacity", 0.4)
		.attr("fill", "url(#gradientZZP1_4)")
		.attr("cx", 0)
		.attr("cy", 0)
		.attr("r", rScale(500));
		
	//Right ZZP 5 - 10 half
	legend.append("circle")
		.attr("class", "legendScatterCircle")
		.style("opacity", 0.4)
		.attr("fill", "url(#gradientZZP5_10)")
		.attr("cx", 0)
		.attr("cy", 0)
		.attr("r", rScale(70));
	
	//The line and text explaining the left ZZP 1 - 4 half
	legend.append("line")
        .attr('class',"legendLine")
        .attr('x1', -15)
        .attr('y1', -80)
		.attr('x2', -15)
        .attr('y2', -33);	
	legend.append("text")
        .attr('class',"legendText")
        .attr('x', -11)
        .attr('y', -80)
		.attr('dy', '0.75em')
		.text("De afname van het lichte intramurale zorgaanbod")
		.call(wrap, 100);

	//The line and text explaining the right ZZP 5 - 10 half
	legend.append("line")
        .attr('class',"legendLine")
        .attr('x1', 5)
        .attr('y1', -50)
		.attr('x2', 5)
        .attr('y2', -13);	
	legend.append("text")
        .attr('class',"legendText")
        .attr('x', 9)
        .attr('y', -50)
		.attr('dy', '0.75em')
		.text("De toename van het zware intramurale zorgaanbod")
		.call(wrap, 100);
		
	//Lines explaining the differences between the two halves
	/*legend.append("line")
        .attr('class',"legendLine")
        .attr('x1', xScale(xOffset + 15))
        .attr('y1', yScale(0.053))
		.attr('x2', xScale(xOffset + 15))
        .attr('y2', yScale(0.052));	
	legend.append("line")
        .attr('class',"legendLine")
        .attr('x1', xScale(xOffset + 8))
        .attr('y1', yScale(0.053))
		.attr('x2', xScale(xOffset + 22))
        .attr('y2', yScale(0.053));	
	legend.append("line")
        .attr('class',"legendLine")
        .attr('x1', xScale(xOffset + 8))
        .attr('y1', yScale(0.052))
		.attr('x2', xScale(xOffset + 22))
        .attr('y2', yScale(0.052));	
	legend.append("text")
        .attr('class',"legendText")
        .attr('x', xScale(xOffset + 30))
        .attr('y', yScale(0.0525))
		.attr('dy', '0.75em')
		.text("Indicatie voor het aantal plekken bij zorgcentra dat niet gevuld gaat worden in de komende jaren door een groei aan zware intramurale zorg")
		.call(wrap, 100);
	*/
		
}// function drawTilburgScatter

//Hide the tooltip when the mouse moves away
function removeTilburgScatterTooltip () {
  $('.popover').each(function() {
	$(this).remove();
  }); 
}
//Show the tooltip on the hovered over slice
function showTilburgScatterTooltip (d) {
  $(this).popover({
	placement: 'auto top',
	container: '.dataresource.tilburg.scatter',
	trigger: 'manual',
	html : true,
	content: function() { 
	  return "<span style='font-size: 11px;'>In <span style='color: #00A1DE; font-weight: bold;'>" + d.GM_NAAM + 
	  "</span> neemt het lichte intramurale zorgaanbod af met <span style='color: #00A1DE; font-weight: bold;'>" + d.ZZP1_4 + "</span>" + 
	  " plaatsen. Het aanbod zware intramurale zorg neemt toe met <span style='color: #00A1DE; font-weight: bold;'>" + d.ZZP5_10_Groei + 
	  "</span> plaatsen, uitgaand van ongewijzigd beleid.</span>"; }
  });
  $(this).popover('show')
}

///////////////////////////////////////////////////////////////////////////
/////////////////////////// Initiate charts ///////////////////////////////
///////////////////////////////////////////////////////////////////////////

///////////////// Tilburg - Half circle scatterplot //////////////////////

//Draw Tilburg comparison scatter
drawTilburgScatter(scatterTilburg, scatterTilburgWidth, scatterTilburgHeight, scatterTilburgMargin);