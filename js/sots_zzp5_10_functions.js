///////////////////////////////////////////////////////////////////////////
/////////////////////// ZZP 5 - 10 Functions ///////////////////////////////
///////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////
/////////////////////// Scatterplot functions /////////////////////////////
///////////////////////////////////////////////////////////////////////////

//ZZP 5 - 10
function drawTopScatter2(width, height, margin) {

	function filterGemeentesInw(d) {
		if (d.ZZP5_10_Perc_Groei > -0.5 & d.AANT_INW_2020 > 5000) {return true;} 
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
		.tickFormat(function (d) {
				return xScale.tickFormat(8,function(d) { 
					var prefix = d3.formatPrefix(d); 
					return prefix.scale(d) + prefix.symbol;
				})(d);
			});	
			
	//Set the new y axis range
	var yScale = d3.scale.linear()
		.range([height,0])
		.domain(d3.extent(data, function(d) {return d.ZZP5_10_Perc_Groei;}))
		//.domain([-0.25, 0.25])
		.nice();
	
	//Set the scale for the bubble sizes
	var rScale = d3.scale.sqrt()
		.range([0, 20])
		.domain([0, d3.max(data, function(d) {return d.ZZP5_10_2020;})]);
		
	// Create gemeente scatter plot
	drawScatter(data = data, wrapper = chartTop2,
			width, height, margin, xScale, yScale, rScale, xAxis,
			xVar = "AANT_INW_2020", yVar = "ZZP5_10_Perc_Groei", rVar = "ZZP5_10_2020", colorVar = "#00A1DE", 
			chartTitle = "Overzicht van gemeentes", 
			xLabel = "Aantal inwoners verwacht in 2020 | [LET OP: Logarithmische schaal]", 
			yLabel = "Ontwikkeling zware intramurale zorg");

	//////////////////////////////////////////////////////
	///////////// Add line for mean value ////////////////
	//////////////////////////////////////////////////////
	
	//The line at zero
	chartTop2.append("line")
		.attr("x1", xScale.range()[0])
		.attr("x2",  xScale.range()[1])
		.attr("y1", yScale(0))
		.attr("y2", yScale(0))
		.style("stroke", "#B5B5B5")
		.style("shape-rendering", "crispEdges")
		.style("stroke-dasharray", "2 2")
		.style("pointer-events", "none");	

	//Add Text along y-axis to explain
	chartTop2.append("text")
		.attr("class","legendText")
		.attr("transform", "translate(" + xScale(6200) + "," + yScale(0.04) + ") rotate(-90)")
		.style("text-anchor", "start")
		.style("font-size", 11)
		.text("Toename");
	chartTop2.append("text")
		.attr("class","legendText")
		.attr("transform", "translate(" + xScale(6200) + "," + yScale(-0.04) + ") rotate(-90)")
		.style("text-anchor", "end")
		.style("font-size", 11)
		.text("Afname");
	
	//////////////////////////////////////////////////////
	///////////////// Initialize Legend //////////////////
	//////////////////////////////////////////////////////

	var legend = chartTop2.append("g").attr("class", "legendWrapper")
					.attr("transform", "translate(" + (scatterWidth - 10) + "," + 15 +")");
					
	bubbleLegend(legend, rScale, legendSizes = [5000, 1000, 100], legendName = "Zware intramurale zorgaanbod");				

	//Create a wrapper for the circle legend				
	var legendCircle = chartTop2.append("g").attr("class", "legendWrapper")
					.attr("transform", "translate(" + (scatterWidth - 110) + "," + 15 +")");
	
	legendCircle.append("text")
		.attr("class","legendTitle")
		.attr("transform", "translate(" + 0 + "," + -25 + ")")
		.attr("x", 0 + "px")
		.attr("y", 0 + "px")
		.attr("dy", "1em")
		.text("Elke cirkel is een gemeente")
		.call(wrap, 80);
	legendCircle.append("circle")
        .attr('r', rScale(2000))
        .attr('class',"legendCircle")
        .attr('cx', 0)
        .attr('cy', rScale(2000) + 7);
		
}//drawTopScatter

//ZZP 1 - 4
function drawBottomScatter2(width, height, margin) {

	var data = zorgkantoor;
	
	//Set the new x axis range
	var xScale = d3.scale.linear()
		.range([0, width])
		//.domain([0,d3.max(data, function(d) {return d.AANT_INW_2020;})])
		.domain([0, 1.5e6]);
	//Initiate the x axis
	var xAxis = d3.svg.axis()
		.orient("bottom")
		.scale(xScale)
		.ticks(6)
		.tickFormat(d3.format("s"));;	
		
	//Set the new y axis range
	var yScale = d3.scale.linear()
		.range([height,0])
		.domain(d3.extent(data, function(d) {return d.ZZP5_10_Perc_Groei;}))
		//.domain([-0.05, 0.15])
		.nice();
	
	//Set the scale for the bubble sizes
	var rScale = d3.scale.sqrt()
		.range([0, 20])
		.domain([0, d3.max(data, function(d) {return d.ZZP5_10_2020;})]);
		
	// Create zorgkantoor scatter plot
	drawScatter(data = data, wrapper = chartBottom2,
			width, height, margin, xScale, yScale, rScale, xAxis,
			xVar = "AANT_INW_2020", yVar = "ZZP5_10_Perc_Groei", rVar = "ZZP5_10_2020", colorVar = "#00A1DE", 
			chartTitle = "Overzicht van zorgkantoorregio's", xLabel = "Aantal inwoners verwacht in 2020", 
			yLabel = "Ontwikkeling zware intramurale zorg");


	//////////////////////////////////////////////////////
	///////////////// Initialize Legend //////////////////
	//////////////////////////////////////////////////////

	var legend = chartBottom2.append("g").attr("class", "legendWrapper")
					.attr("transform", "translate(" + (scatterWidth - 10) + "," + 15 +")");
					
	bubbleLegend(legend, rScale, legendSizes = [10000, 5000, 2000], legendName = "Zware intramurale zorgaanbod");				

	//Create a wrapper for the circle legend				
	var legendCircle = chartBottom2.append("g").attr("class", "legendWrapper")
					.attr("transform", "translate(" + (scatterWidth - 110) + "," + 15 +")");
	
	legendCircle.append("text")
		.attr("class","legendTitle")
		.attr("transform", "translate(" + 0 + "," + -25 + ")")
		.attr("x", 0 + "px")
		.attr("y", 0 + "px")
		.attr("dy", "1em")
		.text("Elke cirkel is een zorgkantoor regio")
		.call(wrap, 90);
	legendCircle.append("circle")
        .attr('r', rScale(3000))
        .attr('class',"legendCircle")
        .attr('cx', 0)
        .attr('cy', rScale(3000) + 7);
		
}//drawBottomScatter

///////////////////////////////////////////////////////////////////////////
///////////////// Initiate global functions to Zorg ///////////////////////
///////////////////////////////////////////////////////////////////////////

//Function on mouseover of gemeente
function fadeIn2(d) {
	
	//Check which chart is being hovered over
	if (this.classList.contains("gemeente")) {
		var chartSVG = chartTop2,
			chosen = d,
			cont = '.dataresource.zzp5_10.chartTop',
			name = d.GM_NAAM,
			chosenCircle = chartTop2.selectAll(".circleScatter.gemeente."+d.GM_CODE),
			chosenGemeente = chosen; //Find the gemeente data properties in the circle data (the geo data only contains GM_CODE)
			
		clusterLegendWrapper2.select(".legendTitle.greenSquare").text("Gekozen gemeente");
		clusterLegendWrapper2.select(".legendTitle.darkblueSquare").text("Bijbehorende zorgkantoor regio - In onderste cirkel plot");
		clusterLegendWrapper2.select(".legendTitle.lightblueSquare").text("Vergelijkbare gemeentes, o.b.v:");
		clusterLegendWrapper2.select(".legendRect.lightblueSquare").style("opacity", 0.4);
		clusterLegendWrapper2.select(".legendTitle.legendSub").style("opacity", 1);
		
	} else if (this.classList.contains("zorgkantoor")) {
		var chartSVG = chartBottom2,
			chosen = d,		
			cont = '.dataresource.zzp5_10.chartBottom',
			name = d.Zorgkantoor,			
			chosenCircle = chartBottom2.selectAll(".circleScatter.zorgkantoor.ZC"+d.Zorgkantoorcode),
			chosenGemeente = undefined;
			
		clusterLegendWrapper2.select(".legendTitle.greenSquare").text("Gekozen zorgkantoor regio");
		clusterLegendWrapper2.select(".legendTitle.darkblueSquare").text("Bijbehorende gemeentes - In bovenste cirkel plot");
		clusterLegendWrapper2.select(".legendTitle.lightblueSquare").text("");
		clusterLegendWrapper2.select(".legendRect.lightblueSquare").style("opacity", 0);
		clusterLegendWrapper2.select(".legendTitle.legendSub").style("opacity", 0);
		
	} else {
		var chartSVG = false,
			chosen = d.properties,
			chosenGemeente = d3.select(".circleScatter.gemeente."+chosen.GM_CODE).data()[0];
			
		clusterLegendWrapper2.select(".legendTitle.greenSquare").text("Gekozen gemeente");
		clusterLegendWrapper2.select(".legendTitle.darkblueSquare").text("Bijbehorende zorgkantoor regio - In onderste cirkel plot");
		clusterLegendWrapper2.select(".legendTitle.lightblueSquare").text("Vergelijkbare gemeentes, o.b.v:");
		clusterLegendWrapper2.select(".legendRect.lightblueSquare").style("opacity", 0.4);
		clusterLegendWrapper2.select(".legendTitle.legendSub").style("opacity", 1);
		
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
			content: function() { return "<p style='font-size: 11px; text-align: center;'>" + name + "</p>"; }});
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
		mapCallout2.selectAll("#callout_title").text(chosen.GM_NAAM);
		mapCallout2.selectAll("#callout_top").text(numFormatThousands(chosen.ZZP5_10_2020));
		mapCallout2.selectAll("#callout_bottom").text(numFormatPercentDec(chosen.ZZP5_10_Perc_Groei));

		//Include clusterin in amp
		map2.selectAll("path")
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
		chartTop2.selectAll(".circleScatter.gemeente")
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
			
		chartBottom2.selectAll(".circleScatter.zorgkantoor")
			.style("opacity", function(d) {
				if (d.Zorgkantoorcode == chosen.Zorgkantoorcode) return 1;
				else return 0.2;
			});	
				
	//Hover over zorgkantoor scatter
	} else if (this.classList.contains("zorgkantoor")) {
		//Update callout text and numbers
		mapCallout2.selectAll("#callout_title").text(chosen.Zorgkantoor);
		mapCallout2.selectAll("#callout_top").text(numFormatThousands(Math.ceil(chosen.ZZP5_10_2020/10)*10));
		mapCallout2.selectAll("#callout_bottom").text(numFormatPercentDec(chosen.ZZP5_10_Perc_Groei));

		//Fade all gemeentes except for the chosen one
		map2.selectAll("path")
			.style("opacity", 0.2)
		map2.selectAll("path")
			.filter(function(d) { return zorgkantoorById[d.properties.GM_CODE] == chosen.Zorgkantoorcode;})
			.style("opacity", 1);
			
		chartTop2.selectAll(".circleScatter.gemeente")
			.style("opacity", function(d) {
				if (d.Zorgkantoorcode == chosen.Zorgkantoorcode) return 1;
				else 
					return 0.04;
			});
			
		chartBottom2.selectAll(".circleScatter.zorgkantoor")
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
		mapCallout2.selectAll("#callout_title").text(chosen.GM_NAAM);
		//Do not show anything for missing data
		if (GM_CODES[d.properties.GM_CODE] === undefined) {
			mapCallout2.selectAll("#callout_top").text("-");
			mapCallout2.selectAll("#callout_bottom").text("-");
		} else {
			mapCallout2.selectAll("#callout_top").text(numFormatThousands(gemeentes[GM_CODES[chosen.GM_CODE]].ZZP5_10_2020));
			mapCallout2.selectAll("#callout_bottom").text(numFormatPercentDec(gemeentes[GM_CODES[chosen.GM_CODE]].ZZP5_10_Perc_Groei));
		}//else

		//Include clustering in amp
		map2.selectAll("path")
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
		chartTop2.selectAll(".circleScatter.gemeente")
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
			
		chartBottom2.selectAll(".circleScatter.zorgkantoor")
			.style("opacity", function(d) {
				if (d.Zorgkantoorcode == zorgkantoorById[chosen.GM_CODE]) return 1;
				else return 0.2
			});
	}//else
	//Show call out in left top portion of the map
	mapCallout2.style("visibility", "visible");
	mapLegendWrapper2.style("visibility", "hidden");
	clusterLegendWrapper2.style("visibility", "visible");
};
//Function on mouseout of gemeente
function fadeOut2(d) {
	//Hide the call out in left top portion of the map and show original legend again
	mapLegendWrapper2.style("visibility", "visible");
	clusterLegendWrapper2.style("visibility", "hidden");
	mapCallout2.style("visibility", "hidden");
	
	//Return map to original colors
	map2.selectAll("path")
		.style("opacity", 1)
		.style("fill", function(d) {
			if (GM_CODES[d.properties.GM_CODE] === undefined) {		
				return "#DCDCDC"; }
			else {return color2(gemeentes[GM_CODES[d.properties.GM_CODE]].ZZP5_10_Perc_Groei);}
		});
		
	//Show all circles again
	chartTop2.selectAll(".circleScatter")
		.style("fill", "#00A1DE")
		.style("opacity", 0.6);	
	chartBottom2.selectAll(".circleScatter")
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