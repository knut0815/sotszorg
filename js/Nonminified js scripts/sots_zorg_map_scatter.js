///////////////////////////////////////////////////////////////////////////
///////// State of the State - Health - 2 Maps & Scatterplots /////////////
///////////////////////////////////////////////////////////////////////////

var mobileScreen = ($(window).width() > 400 ? false : true);
///////////////////////////////////////////////////////////////////////////
////////////////// Initiate Scatter plots ZZP 1 - 4 ///////////////////////
///////////////////////////////////////////////////////////////////////////
//General widths and heights
var scatterMargin = {left: 60, top: (mobileScreen ? 90 : 60), right: 40, bottom: 50},
	scatterWidth = Math.min($(".dataresource.zzp1_4.chartTop").width(),500) - scatterMargin.left - scatterMargin.right,
	scatterHeight = scatterWidth*3/5;

//Create SVG inside the div		
var svgChartTop = d3.select(".dataresource.zzp1_4.chartTop").append("svg")
		.attr("width", (scatterWidth + scatterMargin.left + scatterMargin.right))
		.attr("height", (scatterHeight + scatterMargin.top + scatterMargin.bottom));

var svgChartBottom = d3.select(".dataresource.zzp1_4.chartBottom").append("svg")
		.attr("width", (scatterWidth + scatterMargin.left + scatterMargin.right))
		.attr("height", (scatterHeight + scatterMargin.top + scatterMargin.bottom));

//Create g elements for each group of chart elements		
var chartTop = svgChartTop.append("g").attr("class", "chartZZP1_4")
		.attr("transform", "translate(" + scatterMargin.left + "," + scatterMargin.top + ")");
var chartBottom = svgChartBottom.append("g").attr("class", "chartZZP1_4")
		.attr("transform", "translate(" + scatterMargin.left + "," + scatterMargin.top + ")");

///////////////////////////////////////////////////////////////////////////
/////////////////////// Initiate Map NL ZZP 1 - 4 /////////////////////////
///////////////////////////////////////////////////////////////////////////
//General widths and heights	
var mapWidth = scatterWidth,
	mapHeight = Math.max(670, 2*($(".dataresource.zzp1_4.chartTop").height())) - scatterMargin.top - scatterMargin.bottom - 50;

//Create SVG inside the div	
var svgMap = d3.select(".dataresource.zzp1_4.map").append("svg")
		.attr("width", (mapWidth + scatterMargin.left + scatterMargin.right))
		.attr("height", (mapHeight + scatterMargin.top + scatterMargin.bottom));
		
//Create g elements for each group of chart elements	
var map = svgMap.append("g").attr("class", "map")
		.attr("transform", "translate(" + scatterMargin.left + "," + scatterMargin.top + ")");
var mapCallout = svgMap.append("g").attr("class", "mapCallout")
		.attr("transform", "translate(" + (scatterMargin.left) + "," + (scatterMargin.top * 5/4) + ")")
		.style("visibility", "hidden");
var mapLegendWrapper = svgMap.append("g").attr("class", "legend");
var clusterLegendWrapper = svgMap.append("g").attr("class", "legend");

//////////////////////////////////////////////////////
/////////////////// Draw the Map /////////////////////
//////////////////////////////////////////////////////
		
function drawMap(mapWrapper, chartClass, colorScale, colorVar, mapTitle, width, height, margin) {
	
	////////////////////////////////////////////////////////////	
	///////////////////// Initiate Map /////////////////////////
	////////////////////////////////////////////////////////////

	var mapScale = (width+margin.left+margin.right > 450 ? 5000 : 4250);
	var mapMove = (width+margin.left+margin.right > 450 ? 40 : 20);
	
	// new projection
	var projection = d3.geo.mercator()
						.center(d3.geo.centroid(gemeentesGeo))
						.scale(mapScale)
						.translate([(width/2 + mapMove), (height/2+10)]);
	var path = d3.geo.path().projection(projection);

	//Is the map being made for the ZZP 1 - 4 or ZZP 5 - 10 version
	var fadeinFunc = (chartClass === "chartZZP1_4" ? fadeIn : fadeIn2);
	var fadeoutFunc = (chartClass === "chartZZP1_4" ? fadeOut : fadeOut2);
	
	mapWrapper.selectAll("path")
		.data(gemeentesGeo.features)
		.enter().append("path")
		.attr("d", path)
		.attr("id", function(d) {return d.properties.GM_CODE; })
		//.attr("class", function(d) {return "subunit " + d.properties.GM_CODE; })
		.attr("class", function(d) {return "gemeenteMap"})
		.style("opacity", 1)
		.style("stroke-width", 1)
		.style("stroke", "white")
		.style("fill", function(d) {
			if (GM_CODES[d.properties.GM_CODE] === undefined) {		
				return "#DCDCDC"; }
			else {return colorScale(eval("gemeentes[GM_CODES[d.properties.GM_CODE]]." + colorVar));}
		})
		.on("mouseover", fadeinFunc)
		.on("mouseout", fadeoutFunc);
		
	//Set up map title
	mapWrapper.append("g")
		.append("text")
		.attr("class","map title")
		.attr("transform", "translate(" + (width/2) + "," + (-margin.top/2) + ")")
		.style("text-anchor", "middle")
		.style("font-size", "16px")
		.attr("x", 0)
		.attr("y", 0)
		.attr("dy", "0.35em")
		.text(mapTitle)
		.call(wrap, width*0.9);
		
}/*drawMap*/

////////////////////////////////////////////////////////////	
///////////////// Initiate Map Legend //////////////////////
////////////////////////////////////////////////////////////
	
function drawHistoLegend(data, width, height, margin, colorScale, xVar, wrapper, title, yoff) {

	/* The simple gradient bar indicates the colors, and the bar chart displayed above it shows the distribution over those colors.
	The code is taken from the excellent visualization of http://www.speechlike.org/2012/12/mapping-language-diversity/ 
	with adjustments to make it more to my own wishes*/
		
	//Set several variables for the Legend
	var legendWidth = 160,	//Width of the total Legend
		legendHeight = 40,	//Height of the Legend
		steps = 30,			//Number of steps/bars
		xoff = 12,    		// x offset
		xstep = legendWidth / steps,
		Min = d3.min(data, function(d) {return eval("d." + xVar);}),
		Max = d3.max(data, function(d) {return eval("d." + xVar);});
		
	wrapper.attr("transform", "translate(" + margin.left + "," + (margin.top + height - legendHeight - yoff) + ")");
			
	//Take the value from the countries array and sort ascending
	legendArray = data.map(function (d) {return eval("d." + xVar);})
				      .sort(function(a,b){return a-b});

	//x axis scale
	var xLegend = d3.scale.linear()
				.domain([Min, Max])
				.range([0,(steps*xstep)])
				.nice();
	//Make sure the increment follows the x-axis and not the min/max of the data		
	var increment = (xLegend.domain()[1]-xLegend.domain()[0]) / steps;
	
	//There are as many bins as there are "steps" in the bar graph function.
	var bin = d3.scale.quantize()
				.domain(xLegend.domain())
				.range(d3.range(0,steps));

	//The frequency count for each of the bins.
	var binfreq = {};
	//Set default to zero and add one to the correct bin and go down all values
	d3.range(0,steps).forEach(function (d) { binfreq[d] = 0; });
	legendArray.forEach(function (d) { binfreq[bin(d)] += 1; });
	
	//Scale of the bars
	yLegend = d3.scale.linear()
		.range([legendHeight, 0])
		.domain([0, d3.max(d3.range(0,steps), function (d) {return binfreq[d];})]);
				
	//Set new x-axis	
	var legendAxis = d3.svg.axis()
		.orient("bottom")
		.ticks(6)
		.tickFormat(numFormatPercent)
		.scale(xLegend);	
	//Append the x-axis
	wrapper.append("g")
		.attr("class", "x axis small")
		.attr("transform", "translate(" + 0 + "," + (legendHeight + 15) + ")")
		.call(legendAxis);
	
	//Not sure why this has to be done in this manner, but it works	
	eval("var colorDomain = [" + colorScale.domain() + "];");
	var colorStart = colorDomain
	colorStart.unshift(xLegend.domain()[0]);
	eval("var colorDomain = [" + colorScale.domain() + "];");
	var colorWidth = colorDomain;
	colorWidth.push(xLegend.domain()[1]);
	
	//There are two components here: the bar graph and the scale below.
	//Line below
	wrapper.append("g").selectAll(".colorkey")
		.data(colorDomain)
		.enter().append("rect")
			.attr("class", "colorkey")
			.attr("x", function (d,i) {return xLegend(colorStart[i]);})
			.attr("y", legendHeight + 3)
			.attr("width", function(d,i) {return xLegend(colorWidth[i]) - xLegend(colorStart[i]);})
			.attr("height", 9)
			.attr("fill", function (d) {return colorScale(d-0.0001);});
		
	//Bars above
	wrapper.append("g").selectAll(".colorbars")
		.data(d3.range(0,steps))
		.enter().append("rect")
			.attr("class", "colorbars")
			.attr("x", function (d) {return d * xstep;})
			.attr("y", function (d) {return yLegend(binfreq[d]);})
			.attr("width", xstep-1)
			.attr("height", function (d) {return legendHeight - yLegend(binfreq[d]);})
			.attr("fill", function (d) {return colorScale(increment * d + xLegend.domain()[0]);});

	//Add a title below the color scale
	wrapper.append("text")
		.attr("class", "legendTitle")
		.attr("transform", "translate(" + (legendWidth/2) + "," + (legendHeight + 15 + 35) + ")")
		.attr("x", 0)
		.attr("y", 0)
		.attr("dy", "0em")
		.style("text-anchor", "middle")
		.style("font-size", "10px")
		.text(title)
		.call(wrap, legendWidth*1.2)
		;
	
	//Append unknown section
	wrapper.append("rect")
		.attr("x", (legendWidth * 1.1))
		.attr("y", legendHeight + 3)
		.attr("width", 18)
		.attr("height", 9)
		.style("fill", "#DCDCDC");
	wrapper.append("text")
		.attr("class", "legendTitle")
		.attr("x", (legendWidth * 1.1 + 23))
		.attr("y", legendHeight + 3)
		.attr("dy", "0.75em")
		.style("text-anchor", "start")
		.style("font-size", "9px")
		.text("onbekend")
		;
		
}//Legend

///////////////////////////////////////////////////////////////////////////
//////////////////////////// Dynamic Legend ///////////////////////////////
///////////////////////////////////////////////////////////////////////////

function drawClusterLegend(wrapper, width, height, margin) {
	wrapper.attr("transform", "translate(" + margin.left + "," + (margin.top + height - 50) + ")")
		   .style("visibility", "hidden");
	
	//Append rectangle for chosen area (green)
	wrapper.append("rect")
		.attr("class", "legendRect greenSquare")
		.attr("x", 0)
		.attr("y", 0)
		.attr("width", 15)
		.attr("height", 15)
		.style("fill", "#81BC00");
	wrapper.append("text")
		.attr("class", "legendTitle greenSquare")
		.attr("x", 23)
		.attr("y", 0)
		.attr("dy", "1.25em")
		.style("text-anchor", "start")
		.style("font-size", "9px")
		.text("");

	//Append rectangle for (dark blue)
	wrapper.append("rect")
		.attr("class", "legendRect darkblueSquare")
		.attr("x", 0)
		.attr("y", 20)
		.attr("width", 15)
		.attr("height", 15)
		.style("fill", "#00A1DE");
	wrapper.append("text")
		.attr("class", "legendTitle darkblueSquare")
		.attr("x", 23)
		.attr("y", 20)
		.attr("dy", "1.25em")
		.style("text-anchor", "start")
		.style("font-size", "9px")
		.text("");
		
	//Append rectangle for similar gemeentes (light blue)
	wrapper.append("rect")
		.attr("class", "legendRect lightblueSquare")
		.attr("x", 0)
		.attr("y", 40)
		.attr("width", 15)
		.attr("height", 15)
		.style("fill", "#00A1DE");
	wrapper.append("text")
		.attr("class", "legendTitle lightblueSquare")
		.attr("x", 23)
		.attr("y", 40)
		.attr("dy", "1.25em")
		.style("text-anchor", "start")
		.style("font-size", "9px")
		.text("");
	wrapper.append("text")
		.attr("class", "legendTitle legendSub")
		.attr("x", 30)
		.attr("y", 55)
		.attr("dy", "1.25em")
		.style("text-anchor", "start")
		.style("font-size", "9px")
		.text("aantal inwoners, inkomen, leeftijdsverdeling en % huurwoningen");
	
}//drawClusterLegend

//////////////////////////////////////////////////////
/////////////// Create Map callout ///////////////////
//////////////////////////////////////////////////////

function drawCallout(calloutWrapper, topText, bottomText) {
	var calloutMarginLeft = 0,
		callOutNumbers = calloutMarginLeft + 190;
		
	calloutWrapper.append("text")
		.attr("class", "callout")
		.attr("id", "callout_title")
		.attr("transform", "translate(" + (calloutMarginLeft) + "," + (10) + ")")
		.style("font-size", "12px")
		.style("fill", "#0D0D0D")
		.text("Groningen");

	calloutWrapper.append("text")
		.attr("class", "callout")
		.style("fill", "#6E6E6E")
		.attr("transform", "translate(" + (calloutMarginLeft) + "," + (35) + ")")
		.text(topText);
		
	calloutWrapper.append("text")
		.attr("class", "callout")
		.style("fill", "#6E6E6E")
		.attr("transform", "translate(" + (calloutMarginLeft) + "," + (50) + ")")
		.text(bottomText);

	calloutWrapper.append("text")
		.attr("class", "callout")
		.attr("id", "callout_top")
		.attr("transform", "translate(" + (callOutNumbers) + "," + (35) + ")")
		.text("346");
		
	calloutWrapper.append("text")
		.attr("class", "callout")
		.attr("id", "callout_bottom")
		.attr("transform", "translate(" + (callOutNumbers) + "," + (50) + ")")
		.text("3467");
		
	calloutWrapper.append("line")
		.attr("class", "callout line")
		.style("stroke-width",  1)
		.style("stroke", "#D1D1D1")
		.style("shape-rendering", "crispEdges")
		.attr("x1", 0)
		.attr("x2", callOutNumbers*1.1)
		.attr("y1", 17)
		.attr("y2", 17);	
}//function drawCallout

/*////////////////////////////////////////////////////
/////////////// Draw the Scatter plot ////////////////
////////////////////////////////////////////////////*/
						 
function drawScatter(data, wrapper, width, height, margin,
					xScale, yScale, rScale, xAxis,
					xVar, yVar, rVar, colorVar, chartTitle, 
					xLabel, yLabel) {
							 
	/*////////////////////////////////////////////////////
	/////////////////// Initialize Axes //////////////////
	////////////////////////////////////////////////////*/

	/*Append the x-axis*/
	wrapper.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(" + 0 + "," + (height + 10) + ")")
		.call(xAxis);
		
	var yAxis = d3.svg.axis()
		.orient("left")
		.ticks(4)  //Set rough # of ticks
		.tickFormat(numFormatPercent)
		.scale(yScale);	

	/*Append the y-axis*/
	wrapper.append("g")
			.attr("class", "y axis")
			.attr("transform", "translate(" + 0 + "," + 0 + ")")
			.call(yAxis);
			
	/*//////////////////////////////////////////////////////////	
	/////////////////// Scatterplot Circles ////////////////////
	///////////////////////////////////////////////////////////*/
	
	var fadeinFunc = (wrapper.attr("class") === "chartZZP1_4" ? fadeIn : fadeIn2);
	var fadeoutFunc = (wrapper.attr("class") === "chartZZP1_4" ? fadeOut : fadeOut2);
	
	wrapper.selectAll(".circleScatter")
			.data(data)
			.enter().append("circle")
				.attr("class", function(d) { 
					if (d.GM_CODE != undefined ) return "circleScatter gemeente " + d.GM_CODE;
					else return  "circleScatter zorgkantoor ZC" + d.Zorgkantoorcode;
				})
				.style("opacity", 0.6)
				.style("fill", function(d) {
					if (colorVar.charAt(0) == "#") return colorVar;
					else return color(eval("d." + colorVar));
				})
				.attr("cx", function(d) {return xScale(eval("d." + xVar));})
				.attr("cy", function(d) {return yScale(eval("d." + yVar));})
				.attr("r", function(d) {return rScale(eval("d." + rVar));});
				
	/*//////////////////////////////////////////////////////////// 
	//////////////////////// Voronoi ///////////////////////////// 
	////////////////////////////////////////////////////////////*/ 

	/*Initiate the voronoi function*/
	var voronoi = d3.geom.voronoi()
		.x(function(d) { return xScale(eval("d." + xVar)); })
		.y(function(d) { return yScale(eval("d." + yVar)); })
		.clipExtent([[0, 0], [width, height]]);

	/*Initiate the voronoi group element*/
	var voronoiGroup = wrapper.append("g")
		.attr("class", "voronoi");
		
	voronoiGroup.selectAll("path")
		.data(voronoi(data))
		.enter().append("path")
		.attr("d", function(d, i) {if (d != undefined) return "M" + d.join("L") + "Z"; })
		.datum(function(d, i) {if (d != undefined) return d.point; })
		.attr("class", function(d) {
			if (d != undefined) {
				if (d.GM_CODE != undefined ) return "voronoiCells gemeente " + d.GM_CODE;
				else return "voronoiCells zorgkantoor ZC" + d.Zorgkantoorcode;
			}//if
		})
		/*.style("stroke", "red")*/
		.on("mouseover", fadeinFunc)
		.on("mouseout", fadeoutFunc);

	/*////////////////////////////////////////////////////
	///////////////// Initialize Labels //////////////////
	////////////////////////////////////////////////////*/

	/*Set up X axis label*/
	wrapper.append("g")
		.append("text")
		.attr("class", "x axis label")
		.attr("text-anchor", "middle")
		.attr("transform", "translate(" + (width/2) + "," + (height + margin.bottom*2/3 + 10) + ")")
		.style("font-size", "10px")
		.text(xLabel);

	/*Set up y axis label*/
	wrapper.append("g")
		.append("text")
		.attr("x", 0)
		.attr("y", 0)
		.attr("dy", "0.35em")
		.attr("class", "y axis label")
		.attr("text-anchor", "middle")
		.attr("transform", "translate(" + 0 + "," + -30 + ")")
		.style("font-size", "10px")
		.text(yLabel)
		.call(wrap, 100);

	/*Set up chart title*/
	wrapper.append("g")
		.append("text")
		.attr("class","chartTitle")
		.attr("transform", "translate(" + (width/2) + "," + (-margin.top*1/2) + ")")
		.style("text-anchor", "middle")
		.style("font-size", "14px")
		.text(chartTitle);	
		
}/*function drawScatter*/

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
		.tickFormat(function (d) {
				return xScale.tickFormat((mobileScreen ? 3 : 8),function(d) { 
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
		.range([0, (mobileScreen ? 10 : 20)])
		.domain([0, d3.max(data, function(d) {return d.ZZP1_4;})]);
		
	// Create gemeente scatter plot
	drawScatter(data = data, wrapper = chartTop, 
			width, height, margin, xScale, yScale, rScale, xAxis,
			xVar = "AANT_INW", yVar = "ZZP1_4_Perc", rVar = "ZZP1_4", colorVar = "#00A1DE", 
			chartTitle = "Overzicht van gemeentes", 
			xLabel = "Aantal inwoners | [LET OP: Logarithmische schaal]", 
			yLabel = "Lichte t.o.v. totale intramurale zorg");
	
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
		.style("stroke-dasharray", "2 2")
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
					.attr("transform", "translate(" + (scatterWidth - 10) + "," + (mobileScreen ? -20 : 15) +")");
					
	bubbleLegend(legend, rScale, legendSizes = [2000, 500, 50], legendName = "Lichte intramurale zorg die verdwijnt");	

	//Create a wrapper for the circle legend	
	if (!mobileScreen) {	
		var legendCircle = chartTop.append("g").attr("class", "legendWrapper")
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
			.attr('r', rScale(500))
			.attr('class',"legendCircle")
			.attr('cx', 0)
			.attr('cy', rScale(500) + 7);
	}//if		
	
}//drawTopScatter

//ZZP 1 - 4
function drawBottomScatter(width, height, margin) {

	var data = zorgkantoor;

	//Set the new x axis range
	var xScale = d3.scale.linear()
		.range([0, width])
		.domain([0,1.5e6]);
	
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
		.range([0, (mobileScreen ? 10 : 20)])
		.domain([0, d3.max(data, function(d) {return d.ZZP1_4;})]);
		
	// Create zorgkantoor scatter plot
	drawScatter(data = data, wrapper = chartBottom,
			width, height, margin, xScale, yScale, rScale, xAxis,
			xVar = "AANT_INW", yVar = "ZZP1_4_Perc", rVar = "ZZP1_4", colorVar = "#00A1DE", 
			chartTitle = "Overzicht van zorgkantoorregio's", 
			xLabel = "Aantal inwoners", yLabel = "Lichte t.o.v. totale intramurale zorg");


	//////////////////////////////////////////////////////
	///////////////// Initialize Legend //////////////////
	//////////////////////////////////////////////////////

	var legend = chartBottom.append("g").attr("class", "legendWrapper")
					.attr("transform", "translate(" + (scatterWidth - 10) + "," + (mobileScreen ? -20 : 15) +")");
					
	bubbleLegend(legend, rScale, legendSizes = [3000, 1000, 200], legendName = "Lichte intramurale zorg die verdwijnt");				

	//Create a wrapper for the circle legend	
	if (!mobileScreen) {	
		var legendCircle = chartBottom.append("g").attr("class", "legendWrapper")
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
			.attr('r', rScale(1000))
			.attr('class',"legendCircle")
			.attr('cx', 0)
			.attr('cy', rScale(1000) + 7);
	}//if
}//drawBottomScatter

///////////////////////////////////////////////////////////////////////////
//////////////////// Mouseover and Search Functions ///////////////////////
///////////////////////////////////////////////////////////////////////////
function searchEventLowZZP(chosen) {
				
	//If the chosen county is not equal to the default, find that name and highlight it - mouseover function
	if (chosen != "") {
		fadeIn(chosen);
	} else {
		fadeOut();
	}//else
	
}//searchEventLowZZP

//Function on mouseover of gemeente
function fadeIn(d) {
	
	//Check which chart is being hovered over
	if (typeof(d) === "string") {		
		var chartSVG = false,
			chosen = {
				GM_NAAM: d,
				GM_CODE: GM_NAMES[d]
			},
			chosenGemeente = d3.select(".circleScatter.gemeente."+chosen.GM_CODE).data()[0];
			
		clusterLegendWrapper.select(".legendTitle.greenSquare").text("Gekozen gemeente");
		clusterLegendWrapper.select(".legendTitle.darkblueSquare").text("Bijbehorende zorgkantoor regio - In onderste cirkel plot");
		clusterLegendWrapper.select(".legendTitle.lightblueSquare").text("Vergelijkbare gemeentes, o.b.v:");
		clusterLegendWrapper.select(".legendRect.lightblueSquare").style("opacity", 0.4);
		clusterLegendWrapper.select(".legendTitle.legendSub").style("opacity", 1);		
	} else if (hasClass(d3.select(this), "gemeente")) {
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
		
	} else if (hasClass(d3.select(this), "zorgkantoor")) {
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
		
	} else if (hasClass(d3.select(this), "gemeenteMap")) {
		var chartSVG = false,
			chosen = d.properties,
			chosenGemeente = d3.select(".circleScatter.gemeente."+chosen.GM_CODE).data()[0];
			
		clusterLegendWrapper.select(".legendTitle.greenSquare").text("Gekozen gemeente");
		clusterLegendWrapper.select(".legendTitle.darkblueSquare").text("Bijbehorende zorgkantoor regio - In onderste cirkel plot");
		clusterLegendWrapper.select(".legendTitle.lightblueSquare").text("Vergelijkbare gemeentes, o.b.v:");
		clusterLegendWrapper.select(".legendRect.lightblueSquare").style("opacity", 0.4);
		clusterLegendWrapper.select(".legendTitle.legendSub").style("opacity", 1);
		
	} //else if
	
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
				return "<span style='font-size: 11px; text-align: center;'>" + name + "</span>"; }
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
	

	//Search for county
	if (typeof(d) === "string") {
		
		//Update callout text and numbers
		mapCallout.selectAll("#callout_title").text(chosen.GM_NAAM);
		//Do not show anything for missing data
		if (GM_CODES[chosen.GM_CODE] === undefined) {
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
			
	//Hover over gemeente scatter
	} else if (hasClass(d3.select(this), "gemeente")) {
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
	} else if (hasClass(d3.select(this), "zorgkantoor")) {
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
	} else if (hasClass(d3.select(this), "gemeenteMap")) {
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
	}//else if
		
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

/*/////////////////////////////////////////////////////////////////////////
///////////////////// Initiate global variables ///////////////////////////
/////////////////////////////////////////////////////////////////////////*/

//Take out all gemeentes with unknown number of ZZP 1-4
var gemeentes = gemeentes.filter(function(d) { return d.ZZP1_4_Perc >= 0;});

var zorgkantoorById = [],
	GM_CODES = [],
	GM_NAMES = [],
	allGemeentes = [];
gemeentes.forEach(function (d,i) { 
	zorgkantoorById[d.GM_CODE] = d.Zorgkantoorcode; 
	GM_CODES[d.GM_CODE] = i;
	GM_NAMES[d.GM_NAAM] = d.GM_CODE;
	allGemeentes[i] = d.GM_NAAM;
});	

var gemeenteById = {};
zorgkantoor.forEach(function (d) { 
	gemeenteById[d.Zorgkantoorcode] = d.GM_CODE; 
});	

//Blue color palette for NL map ZZP 1 - 4
var color = d3.scale.threshold()
			.range(['#bdd7e7','#59afe1','#0d80c4','#08519c'])
			.domain([0.2,0.4,0.6]);

			
//Green - Blue color palette for NL map ZZP 5 - 10
var color2 = d3.scale.threshold()
			.range(["#7fbc41", "#bdd7e7", "#6baed6", "#3182bd", "#08519c"])
			.domain([0,0.15,0.30,0.50]);		
		
/*/////////////////////////////////////////////////////////////////////////
/////////////////////////// Initiate charts ///////////////////////////////
/////////////////////////////////////////////////////////////////////////*/

////////////////////////// ZZP 1 - 4 ///////////////////////////////
/*Draw the top scatter plot*/
drawTopScatter(scatterWidth, scatterHeight, scatterMargin);
/*Draw the bottom scatter plot*/
drawBottomScatter(scatterWidth, scatterHeight, scatterMargin);
				
/*Draw the NL map*/
drawMap(mapWrapper = map, chartClass = "chartZZP1_4", colorScale = color, colorVar = "ZZP1_4_Perc", 
		mapTitle = "De afname van de lichte t.o.v. de totale intramurale zorg per gemeente", 
		width = mapWidth, height = mapHeight, margin = scatterMargin);
/*Draw the legend below the map*/
drawHistoLegend(data = gemeentes, width = mapWidth, height = mapHeight, margin = scatterMargin,
				colorScale = color, xVar = "ZZP1_4_Perc", wrapper = mapLegendWrapper, 
				title = "% lichte t.o.v. totale intramurale zorgaanbod", yoff = 30);
/*Draw the legend visible on hover over*/
drawClusterLegend(wrapper = clusterLegendWrapper, width = mapWidth, height = mapHeight, margin = scatterMargin)

/*Initiate the call out*/
drawCallout(calloutWrapper = mapCallout, topText = "Lichte zorgaanbod dat zal verdwijnen", 
			bottomText = "% lichte t.o.v. totale intramurale zorg");
	
////////////////////////// Create the search box ///////////////////////////////

//Create new options
var options = allGemeentes;
var select = document.getElementById("searchBoxLowZZP"); 
//Put new options into select box
for(var i = 0; i < options.length; i++) {
	var opt = options[i];
	var el = document.createElement("option");
	el.textContent = opt;
	el.value = opt;
	select.appendChild(el);
}
//Create combo box
//Called in the high ZZP js
//$('.combobox').combobox();

