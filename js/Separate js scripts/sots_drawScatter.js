//////////////////////////////////////////////////////
/////////////// Draw the Scatter plot ////////////////
//////////////////////////////////////////////////////
						 
function drawScatter(data, wrapper, width, height, margin,
					xScale, yScale, rScale, xAxis,
					xVar, yVar, rVar, colorVar, chartTitle, 
					xLabel, yLabel) {
							 
	//////////////////////////////////////////////////////
	/////////////////// Initialize Axes //////////////////
	//////////////////////////////////////////////////////

	//Set the new x axis range - Already done in parent function
	//var xScale = d3.scale.log()
	//	.range([0, width])
	//	.domain(d3.extent(data, function(d) {return eval("d." + xVar);}))
	//	.nice();	

	//Append the x-axis
	wrapper.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(" + 0 + "," + (height + 10) + ")")
		.call(xAxis);
			
	//Set the new y axis range - Already done in parent function
	//var yScale = d3.scale.linear()
	//	.range([height,0])
	//	.domain(d3.extent(data, function(d) {return eval("d." + yVar);}))
	//	.nice();
		
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
			
	////////////////////////////////////////////////////////////	
	/////////////////// Scatterplot Circles ////////////////////
	////////////////////////////////////////////////////////////	
	//var rScale = d3.scale.sqrt()
	//				.range([0, 20])
	//				.domain([0, d3.max(data, function(d) {return eval("d." + rVar);})]);
	
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
				
	////////////////////////////////////////////////////////////// 
	//////////////////////// Voronoi ///////////////////////////// 
	////////////////////////////////////////////////////////////// 

	//Initiate the voronoi function
	var voronoi = d3.geom.voronoi()
		.x(function(d) { return xScale(eval("d." + xVar)); })
		.y(function(d) { return yScale(eval("d." + yVar)); })
		.clipExtent([[0, 0], [width, height]]);

	//Initiate the voronoi group element	
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
		//.style("stroke", "red")
		.on("mouseover", fadeinFunc)
		.on("mouseout", fadeoutFunc);

	//////////////////////////////////////////////////////
	///////////////// Initialize Labels //////////////////
	//////////////////////////////////////////////////////

	//Set up X axis label
	wrapper.append("g")
		.append("text")
		.attr("class", "x axis label")
		.attr("text-anchor", "middle")
		.attr("transform", "translate(" + (width/2) + "," + (height + margin.bottom*2/3 + 10) + ")")
		.style("font-size", "10px")
		.text(xLabel);

	//Set up y axis label
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

	//Set up chart title
	wrapper.append("g")
		.append("text")
		.attr("class","chartTitle")
		.attr("transform", "translate(" + (width/2) + "," + (-margin.top*1/2) + ")")
		.style("text-anchor", "middle")
		.style("font-size", "14px")
		.text(chartTitle);	
		
}// function drawScatter