///////////////////////////////////////////////////////////////////////////
/////////////////////// ZZP 1 - 4 Functions ///////////////////////////////
///////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////
/////////////////////// Scatterplot functions /////////////////////////////
///////////////////////////////////////////////////////////////////////////

//ZZP 1 - 4
function drawTopScatter(width, height, margin) {

	function filterGemeentesInw(d) {
		if (d.ZZP1_4_Perc > 0 & d.AANT_INW > 5000) {return true;} 
		else {return false;}
	}
	var data = gemeentes.filter(filterGemeentesInw);
	
	//Set the new x axis range
	var xScale = d3.scale.log()
		.range([0, width])
		//.domain(d3.extent(data, function(d) {return d.AANT_INW;}))
		.domain([5000, 1e6]);
		
	//Initiate the x axis
	var xAxis = d3.svg.axis()
		.orient("bottom")
		.scale(xScale)
		.ticks(6)
		.tickFormat(d3.format("s"))
		.tickFormat(function (d) {
				return xScale.tickFormat(8,function(d) { 
					var prefix = d3.formatPrefix(d); 
					return prefix.scale(d) + prefix.symbol;
				})(d);
			});	


	//Set the new y axis range
	var yScale = d3.scale.linear()
		.range([height,0])
		.domain(d3.extent(data, function(d) {return d.ZZP1_4_Perc;}))
		.nice();
	
	//Set the scale for the bubble size
	var rScale = d3.scale.sqrt()
		.range([0, 20])
		.domain([0, d3.max(data, function(d) {return d.ZZP1_4;})]);
		
	// Create gemeente scatter plot
	drawScatter(data = data, wrapper = chartTop, 
			width, height, margin, xScale, yScale, rScale, xAxis,
			xVar = "AANT_INW", yVar = "ZZP1_4_Perc", rVar = "ZZP1_4", colorVar = "#00A1DE", 
			chartTitle = "Per Gemeente", 
			xLabel = "Aantal inwoners | [LET OP: Logarithmische schaal]", yLabelTop = "Lage ZZP %", yLabelBottom = "t.o.v. totale Zorgcapaciteit");
	
	//Add average of the Netherlands
	var avgs = d3.nest() //calculate the (unweighted) average
		.rollup(function(d) {
		  return d3.mean(d,function(g) {return g.ZZP1_4_Perc;});
		})
		.entries(data);
	//Create the g group to hold the data
	var medianLine = chartTop.append("g").attr("class", "median")
		.attr("transform", "translate(" + 0 + "," + yScale(avgs) + ")")
		.style("cursor", "default");
	//The line itself
	medianLine.append("line")
		.attr("x1", xScale.range()[0])
		.attr("x2",  xScale.range()[1])
		.attr("y1", 0)
		.attr("y2", 0)
		.style("stroke", "#B5B5B5")
		.style("shape-rendering", "crispEdges")
		.style("pointer-events", "none");	
	//The word above the line
	medianLine.append("text")
		.attr("class","legendText")
		.attr("transform", "translate(" + (5) + "," + (8) + ")")
		.style("text-anchor", "start")
		.text("Gemiddelde");	

	//////////////////////////////////////////////////////
	///////////////// Initialize Legend //////////////////
	//////////////////////////////////////////////////////

	var legend = chartTop.append("g").attr("class", "legendWrapper")
					.attr("transform", "translate(" + (scatterWidth - 10) + "," + 15 +")");
					
	bubbleLegend(legend, rScale, legendSizes = [2000, 500, 50], legendName = "Het aantal LIZC dat verdwijnt");	

	//Create a wrapper for the circle legend				
	var legendCircle = chartTop.append("g").attr("class", "legendWrapper")
					.attr("transform", "translate(" + (scatterWidth - 100) + "," + 15 +")");
	
	legendCircle.append("text")
		.attr("class","legendTitle")
		.attr("transform", "translate(" + 0 + "," + -25 + ")")
		.attr("x", 0 + "px")
		.attr("y", 0 + "px")
		.attr("dy", "1em")
		.text("Elke cirkel is een gemeente")
		.call(wrap, 80);
	legendCircle.append("circle")
        .attr('r', rScale(500))
        .attr('class',"legendCircle")
        .attr('cx', 0)
        .attr('cy', rScale(500) + 7);	
	
}//drawTopScatter

//ZZP 1 - 4
function drawBottomScatter(width, height, margin) {

	var data = zorgkantoor;

	//Set the new x axis range
	var xScale = d3.scale.linear()
		.range([0, width])
		.domain([0,d3.max(data, function(d) {return d.AANT_INW;})])
		.nice();
	
	//Initiate the x axis
	var xAxis = d3.svg.axis()
		.orient("bottom")
		.scale(xScale)
		.ticks(6)
		.tickFormat(d3.format("s"));	
			
	//Set the new y axis range
	var yScale = d3.scale.linear()
		.range([height,0])
		//.domain(d3.extent(data, function(d) {return d.ZZP1_4_Perc;}))
		.domain([0.1, 0.4])
		.nice();
	
	//Set the scale for the bubble sizes
	var rScale = d3.scale.sqrt()
		.range([0, 20])
		.domain([0, d3.max(data, function(d) {return d.ZZP1_4;})]);
		
	// Create zorgkantoor scatter plot
	drawScatter(data = data, wrapper = chartBottom,
			width, height, margin, xScale, yScale, rScale, xAxis,
			xVar = "AANT_INW", yVar = "ZZP1_4_Perc", rVar = "ZZP1_4", colorVar = "#00A1DE", 
			chartTitle = "Per Zorgkantoor Regio", 
			xLabel = "Aantal inwoners", yLabelTop = "Lage ZZP %", yLabelBottom = "t.o.v. totale Zorgcapaciteit");


	//////////////////////////////////////////////////////
	///////////////// Initialize Legend //////////////////
	//////////////////////////////////////////////////////

	var legend = chartBottom.append("g").attr("class", "legendWrapper")
					.attr("transform", "translate(" + (scatterWidth - 10) + "," + 15 +")");
					
	bubbleLegend(legend, rScale, legendSizes = [3000, 1000, 200], legendName = "Het aantal LIZC dat verdwijnt");				

	//Create a wrapper for the circle legend				
	var legendCircle = chartBottom.append("g").attr("class", "legendWrapper")
					.attr("transform", "translate(" + (scatterWidth - 100) + "," + 15 +")");
	
	legendCircle.append("text")
		.attr("class","legendTitle")
		.attr("transform", "translate(" + 0 + "," + -25 + ")")
		.attr("x", 0 + "px")
		.attr("y", 0 + "px")
		.attr("dy", "1em")
		.text("Elke cirkel is een zorgkantoor regio")
		.call(wrap, 90);
	legendCircle.append("circle")
        .attr('r', rScale(1000))
        .attr('class',"legendCircle")
        .attr('cx', 0)
        .attr('cy', rScale(1000) + 7);
		
}//drawBottomScatter

///////////////////////////////////////////////////////////////////////////
///////////////// Initiate global functions to Zorg ///////////////////////
///////////////////////////////////////////////////////////////////////////

//Function on mouseover of gemeente
function fadeIn(d) {
	
	//Check which chart is being hovered over
	if (this.classList.contains("gemeente")) {
		var chartSVG = chartTop,
			chosen = d,
			cont = '.dataresource.zzp1_4.chartTop',
			name = d.GM_NAAM,
			chosenCircle = chartTop.selectAll(".circleScatter.gemeente."+d.GM_CODE),
			chosenGemeente = chosen; //Find the gemeente data properties in the circle data (the geo data only contains GM_CODE)
			
		clusterLegendWrapper.select(".legendTitle.greenSquare").text("Gekozen gemeente");
		clusterLegendWrapper.select(".legendTitle.darkblueSquare").text("Bijbehorende zorgkantoor regio - In onderste cirkel plot");
		clusterLegendWrapper.select(".legendTitle.lightblueSquare").text("Vergelijkbare gemeentes, o.b.v:");
		clusterLegendWrapper.select(".legendRect.lightblueSquare").style("opacity", 0.4);
		clusterLegendWrapper.select(".legendTitle.legendSub").style("opacity", 1);
		
	} else if (this.classList.contains("zorgkantoor")) {
		var chartSVG = chartBottom,
			chosen = d,	
			cont = '.dataresource.zzp1_4.chartBottom',
			name = d.Zorgkantoor,			
			chosenCircle = chartBottom.selectAll(".circleScatter.zorgkantoor.ZC"+d.Zorgkantoorcode),
			chosenGemeente = undefined;
			
		clusterLegendWrapper.select(".legendTitle.greenSquare").text("Gekozen zorgkantoor regio");
		clusterLegendWrapper.select(".legendTitle.darkblueSquare").text("Bijbehorende gemeentes - In bovenste cirkel plot");
		clusterLegendWrapper.select(".legendTitle.lightblueSquare").text("");
		clusterLegendWrapper.select(".legendRect.lightblueSquare").style("opacity", 0);
		clusterLegendWrapper.select(".legendTitle.legendSub").style("opacity", 0);
		
	} else {
		var chartSVG = false,
			chosen = d.properties,
			chosenGemeente = d3.select(".circleScatter.gemeente."+chosen.GM_CODE).data()[0];
			
		clusterLegendWrapper.select(".legendTitle.greenSquare").text("Gekozen gemeente");
		clusterLegendWrapper.select(".legendTitle.darkblueSquare").text("Bijbehorende zorgkantoor regio - In onderste cirkel plot");
		clusterLegendWrapper.select(".legendTitle.lightblueSquare").text("Vergelijkbare gemeentes, o.b.v:");
		clusterLegendWrapper.select(".legendRect.lightblueSquare").style("opacity", 0.4);
		clusterLegendWrapper.select(".legendTitle.legendSub").style("opacity", 1);
		
	}//else
	
	var subset = []; //Save the similar cities in an array
	//Define the similar cities
	if (chosenGemeente != undefined) {
		gemeentes.forEach(function(d,i) {
			if (d.perc_rental === chosenGemeente.perc_rental &
				d.city_level === chosenGemeente.city_level &
				d.common_age === chosenGemeente.common_age &
				d.common_income === chosenGemeente.common_income) {
					if (chosenGemeente.city_level === 3 & (d.AANT_INW < (chosenGemeente.AANT_INW - 10000) | d.AANT_INW > (chosenGemeente.AANT_INW + 10000))) var dummy = 0;
					else subset.push(d.GM_CODE); 
				}//if
			});
	}//if
	
	//Show tooltip on hover of the mouse is on one of the scatters
	if (name != undefined) {
		//Define and show the tooltip
		$(chosenCircle).popover({
			placement: 'auto top',
			container: cont,
			trigger: 'manual',
			html : true,
			content: function() { 
				return "<p style='font-size: 11px; text-align: center;'>" + name + "</p>"; }
		});
		$(chosenCircle).popover('show');
	}//if
	
	if (chartSVG != false) {
		//Append lines to bubbles that will be used to show the precise data points
		//vertical line
		chartSVG.append("g")
			.attr("class", "guide")
			.append("line")
				.attr("x1", chosenCircle.attr("cx"))
				.attr("x2", chosenCircle.attr("cx"))
				.attr("y1", +chosenCircle.attr("cy"))
				.attr("y2", (scatterHeight + 10))
				//.style("stroke", chosenCircle.style("fill"))
				.style("stroke", "#81BC00")
				.style("opacity",  0)
				.style("pointer-events", "none")
				.transition().duration(400)
				.style("opacity", 0.5);
		//horizontal line
		chartSVG.append("g")
			.attr("class", "guide")
			.append("line")
				.attr("x1", +chosenCircle.attr("cx"))
				.attr("x2", 0)
				.attr("y1", chosenCircle.attr("cy"))
				.attr("y2", chosenCircle.attr("cy"))
				//.style("stroke", chosenCircle.style("fill"))
				.style("stroke", "#81BC00")
				.style("opacity",  0)
				.style("pointer-events", "none")
				.transition().duration(400)
				.style("opacity", 0.5);
	}//if
	
	//Hover over gemeente scatter
	if (this.classList.contains("gemeente")) {
		//Update callout text and numbers
		mapCallout.selectAll("#callout_title").text(chosen.GM_NAAM);
		mapCallout.selectAll("#callout_top").text(numFormatThousands(chosen.ZZP1_4));
		mapCallout.selectAll("#callout_bottom").text(numFormatPercent(chosen.ZZP1_4_Perc));

		//Higlight chosen gemeente and those falling into the same cluster
		map.selectAll("path")
			.style("fill", function(d) { 
				if (d.properties.GM_CODE == chosen.GM_CODE) return "#81BC00";
				else if ($.inArray(d.properties.GM_CODE, subset) > -1) return "#00A1DE";
				else return "#A3A3A3";			
			})
			.style("opacity", function(d) {
				$.inArray(d.properties.GM_CODE, subset)
				if (d.properties.GM_CODE == chosen.GM_CODE) return 1;
				else if ($.inArray(d.properties.GM_CODE, subset) > -1) return 0.4;
				else return 0.2;
			});
		
		//Include clustering in chart top		
		chartTop.selectAll(".circleScatter.gemeente")
			.style("fill", function(d) { 
				if (d.GM_CODE == chosen.GM_CODE) return "#81BC00";
				else return "#00A1DE";				
			})
			.style("opacity", function(d) {
				$.inArray(d.GM_CODE, subset)
				if (d.GM_CODE == chosen.GM_CODE) return 1;
				else if ($.inArray(d.GM_CODE, subset) > -1) return 0.4;
				else return 0.02;
			});
			
		chartBottom.selectAll(".circleScatter.zorgkantoor")
			.style("opacity", function(d) {
				if (d.Zorgkantoorcode == chosen.Zorgkantoorcode) return 1;
				else return 0.1;
			});	
				
	//Hover over zorgkantoor scatter
	} else if (this.classList.contains("zorgkantoor")) {
		//Update callout text and numbers
		mapCallout.selectAll("#callout_title").text(chosen.Zorgkantoor);
		mapCallout.selectAll("#callout_top").text(numFormatThousands(Math.ceil(chosen.ZZP1_4/10)*10));
		mapCallout.selectAll("#callout_bottom").text(numFormatPercent(chosen.ZZP1_4_Perc));

		//Fade all gemeentes except for the chosen one
		map.selectAll("path")
			.style("opacity", 0.2)
		map.selectAll("path")
			.filter(function(d) { return zorgkantoorById[d.properties.GM_CODE] == chosen.Zorgkantoorcode;})
			.style("opacity", 1);
			
		chartTop.selectAll(".circleScatter.gemeente")
			.style("opacity", function(d) {
				if (d.Zorgkantoorcode == chosen.Zorgkantoorcode) return 1;
				else return 0.04;
			});
			
		chartBottom.selectAll(".circleScatter.zorgkantoor")
			.style("fill", function(d) { 
				if (d.Zorgkantoorcode == chosen.Zorgkantoorcode) return "#81BC00";
				else return "#00A1DE";				
			})
			.style("opacity", function(d) {
				if (d.Zorgkantoorcode == chosen.Zorgkantoorcode) return 1;
				else return 0.1;
			});	
	//Hover over map
	} else {
		//Update callout text and numbers
		mapCallout.selectAll("#callout_title").text(chosen.GM_NAAM);
		//Do not show anything for missing data
		if (GM_CODES[d.properties.GM_CODE] === undefined) {
			mapCallout.selectAll("#callout_top").text("-");
			mapCallout.selectAll("#callout_bottom").text("-");
		} else {
			mapCallout.selectAll("#callout_top").text(numFormatThousands(gemeentes[GM_CODES[chosen.GM_CODE]].ZZP1_4));
			mapCallout.selectAll("#callout_bottom").text(numFormatPercent(gemeentes[GM_CODES[chosen.GM_CODE]].ZZP1_4_Perc));
		}//else
			
		map.selectAll("path")
			.style("fill", function(d) { 
				if (d.properties.GM_CODE == chosen.GM_CODE) return "#81BC00";
				else if ($.inArray(d.properties.GM_CODE, subset) > -1) return "#00A1DE";
				else return "#A3A3A3";			
			})
			.style("opacity", function(d) {
				$.inArray(d.properties.GM_CODE, subset)
				if (d.properties.GM_CODE == chosen.GM_CODE) return 1;
				else if ($.inArray(d.properties.GM_CODE, subset) > -1) return 0.4;
				else return 0.2;
			});
	
		//Include clustering in chart top		
		chartTop.selectAll(".circleScatter.gemeente")
			.style("fill", function(d) { 
				if (d.GM_CODE == chosen.GM_CODE) return "#81BC00";
				else return "#00A1DE";				
			})
			.style("opacity", function(d) {
				$.inArray(d.GM_CODE, subset)
				if (d.GM_CODE == chosen.GM_CODE) return 1;
				else if ($.inArray(d.GM_CODE, subset) > -1) return 0.4;
				else return 0.02;
			});
			
		chartBottom.selectAll(".circleScatter.zorgkantoor")
			.style("opacity", function(d) {
				if (d.Zorgkantoorcode == zorgkantoorById[chosen.GM_CODE]) return 1;
				else return 0.1;
			});
	}//else
	//Show call out in left top portion of the map
	mapCallout.style("visibility", "visible");
	mapLegendWrapper.style("visibility", "hidden");
	clusterLegendWrapper.style("visibility", "visible");
};
//Function on mouseout of gemeente
function fadeOut(d) {
	//Hide the call out in left top portion of the map and show original legend again
	mapLegendWrapper.style("visibility", "visible");
	clusterLegendWrapper.style("visibility", "hidden");
	mapCallout.style("visibility", "hidden");
	
	//Return map to original colors
	map.selectAll("path")
		.style("opacity", 1)
		.style("fill", function(d) {
			if (GM_CODES[d.properties.GM_CODE] === undefined) {		
				return "#DCDCDC"; }
			else {return color(gemeentes[GM_CODES[d.properties.GM_CODE]].ZZP1_4_Perc);}
		});
		
	//Show all circles again
	chartTop.selectAll(".circleScatter")
		.style("fill", "#00A1DE")
		.style("opacity", 0.6);	
	chartBottom.selectAll(".circleScatter")
		.style("fill", "#00A1DE")
		.style("opacity", 0.6);
		
	//Fade out guide lines, then remove them
	d3.selectAll(".guide")
		.transition().duration(100)
		.style("opacity",  0)
		.remove();
		
	//Hide tooltip
	$('.popover').each(function() {
		$(this).remove();
	}); 
};