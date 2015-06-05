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
		//.call(wrap, legendWidth)
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
		
};//Legend