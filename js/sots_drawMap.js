//////////////////////////////////////////////////////
/////////////////// Draw the Map /////////////////////
//////////////////////////////////////////////////////
		
function drawMap(mapWrapper, chartClass, colorScale, colorVar, mapTitle, width, height) {
	
	////////////////////////////////////////////////////////////	
	///////////////////// Initiate Map /////////////////////////
	////////////////////////////////////////////////////////////

	// new projection
	var projection = d3.geo.mercator()
						.center(d3.geo.centroid(gemeentesGeo))
						.scale(5500)
						.translate([(width/2 + 50), (height/2)]);
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
		.attr("transform", "translate(" + (width/2) + "," + (0) + ")")
		.style("text-anchor", "middle")
		.style("font-size", "16px")
		.attr("x", 0)
		.attr("y", 0)
		.attr("dy", "0.35em")
		.text(mapTitle)
		.call(wrap, 400);
		
}//drawMap