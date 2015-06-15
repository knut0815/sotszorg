///////////////////////////////////////////////////////////////////////////
///////////////////////// Tilburg bar charts //////////////////////////////
///////////////////////////////////////////////////////////////////////////

function drawBarsTilburg() {

	///////////////////////////////////////////////////////////////////////////
	///////////////////////// Initiate variables //////////////////////////////
	///////////////////////////////////////////////////////////////////////////

	//General variables
	var barHeight = 35,
		barOffset = 0;
	
	//////////////////////////////// Wrappers ////////////////////////////////////
	
	//Background wrapper that lies behind all bars and text per row	
	var barTilburgWrapper = barTilburg.append("g").attr("class", "barTilburgRight")
			.attr("transform", "translate(" + 0 + "," + barOffset + ")");		
	//Wrapper for the right pointing bars
	var barTilburgRightWrapper = barTilburg.append("g").attr("class", "barTilburgRight")
			.attr("transform", "translate(" + -10 + "," + barOffset + ")");
	//Wrapper for the text per neighbourhood in between the bars
	var barTilburgTextWrapper = barTilburg.append("g").attr("class", "barTilburgText")
			.attr("transform", "translate(" + -60 + "," + barOffset + ")");
	//Wrapper for the left pointing percentage bars
	var barTilburgLeftWrapper = barTilburg.append("g").attr("class", "barTilburgLeft")
			.attr("transform", "translate(" + -110 + "," + barOffset + ")");
	
	/////////////////////////////////// Scales ////////////////////////////////////
	
	//Scale for the right pointing absolute number bars
	var barScale = d3.scale.linear()
			.range([0, barTilburgWidth/2])
			.domain([0,d3.max(wijkenTilburg, function(d) {return d.ZZP_totaal;})]);
	//Scale for the left pointing absolute percentage bars		
	var barScalePerc = d3.scale.linear()
			.range([0, barTilburgWidth/4])
			.domain([0,d3.max(wijkenTilburg, function(d) {return d.ZZP1_4_Perc;})]);

	///////////////////////////////////////////////////////////////////////////
	/////////////////////// Create the bar charts /////////////////////////////
	///////////////////////////////////////////////////////////////////////////			

	//Create background rectangle to improve hover
	var barsTilburgBackground = barTilburgWrapper.selectAll("rect")
		.data(wijkenTilburg)
		.enter().append("rect")
		.attr("transform", function(d, i) { return "translate(" + (-barTilburgWidth/2) + "," + (20 + (i * barHeight)) + ")"; })
		.attr("class", "background")
		.attr("width", barTilburgWidth)
		.attr("height", barHeight)
		.style("fill", "white")
		.on("mouseover", overTilburgNeighbourhood)
		.on("mouseout", outTilburgNeighbourhood);
		
	//Right pointing bar g wrappers		
	var barsTilburgRight = barTilburgRightWrapper.selectAll("g")
		.data(wijkenTilburg)
		.enter().append("g")
		.attr("transform", function(d, i) { return "translate(0," + (20 + (i * barHeight)) + ")"; })
		.attr("class", "barRight")
		.on("mouseover", overTilburgNeighbourhood)
		.on("mouseout", outTilburgNeighbourhood);
	//ZZP 1 - 10 grey bars	
	barsTilburgRight.append("rect")
		.attr("class", "bar")
		.attr("width", function(d) {return barScale(d.ZZP_totaal);})
		.attr("height", barHeight - 10)
		.style("fill", "#D4D4D4");
	//ZZP 1 - 10 text	
	barsTilburgRight.append("text")
		.attr("class", "barText")
		.attr("transform", function(d, i) { return "translate(" + (barScale(d.ZZP_totaal) + 5) + ",16)"; })
		.style("font-size", "10px")
		.style("fill", "#6E6E6E")
		.style("text-anchor", "start")
		.text(function(d) {return Math.round(d.ZZP_totaal/10)*10;});		
	//ZZP 1 - 4 blue bars		
	barsTilburgRight.append("rect")
		.attr("class", "bar")
		.attr("width", function(d) {return barScale(d.ZZP1_4);})
		.attr("height", barHeight - 10)
		.style("fill", "#00A1DE");
	//ZZP 1 - 4 text	
	/*barsTilburgRight.append("text")
		.attr("class", "barText")
		.attr("transform", function(d, i) { return "translate(" + (barScale(d.ZZP1_4) + 3) + ",16)"; })
		.style("font-size", 10)
		.style("fill", "#00A1DE")
		.style("text-anchor", "start")
		.text(function(d) {return d.ZZP1_4;});*/
		
	//Left pointing ZZP 1-4 percentage wrapper
	var barsTilburgLeft = barTilburgLeftWrapper.selectAll("g")
		.data(wijkenTilburg)
		.enter().append("g")
		.attr("transform", function(d, i) { return "translate(0," + (20 + (i * barHeight)) + ")"; })
		.attr("class", "barLeft")
		.on("mouseover", overTilburgNeighbourhood)
		.on("mouseout", outTilburgNeighbourhood);
	//ZZP 1 - 4 percentage bars	
	barsTilburgLeft.append("rect")
		.attr("class", "bar")
		.attr("transform", function(d, i) { return "translate(" + -barScalePerc(d.ZZP1_4_Perc) + ",0)"; })
		.attr("width", function(d) {return barScalePerc(d.ZZP1_4_Perc);})
		.attr("height", barHeight - 10)
		.style("fill", "#BFBFBF");
	//ZZP 1 - 4 percentage text	
	barsTilburgLeft.append("text")
		.attr("class", "barText")
		.attr("transform", function(d, i) { return "translate(" + (-barScalePerc(d.ZZP1_4_Perc) - 3) + ",16)"; })
		.style("font-size", "10px")
		.style("text-anchor", "end")
		.style("fill", "#6E6E6E")
		.text(function(d) {return numFormatPercent(d.ZZP1_4_Perc);});

	///////////////////////////////////////////////////////////////////////////
	////////////////////////////////// Titles /////////////////////////////////
	///////////////////////////////////////////////////////////////////////////	
	
	//The neighbourhood names in between the two bars
	var barsTilburgText = barTilburgTextWrapper.selectAll("text")
		.data(wijkenTilburg)
		.enter().append("text")
		.attr("transform", function(d, i) { return "translate(0," + (37 + (i * barHeight)) + ")"; })
		.attr("class", "barText")
		.style("font-size", "12px")
		.style("fill", "#6E6E6E")
		.style("text-anchor", "middle")
		.style("pointer", "default")
		.text(function(d) {return d.WK_NAAM;})
		.on("mouseover", overTilburgNeighbourhood)
		.on("mouseout", outTilburgNeighbourhood);

	//Title
	/*barTilburg.append("text")
		.attr("class", "title")
		.attr("transform", function(d, i) { return "translate(" + -60 + "," + -30 + ")"; })
		.style("font-size", 18)
		.style("fill", "#2B2B2B")
		.style("text-anchor", "middle")
		.attr("x", 0)
		.attr("y", 0)
		.attr("dy", "0.35em")
		.text("Lichte en Zware ZorgCapaciteit verdeling per wijk in Tilburg")
		.call(wrap, 350);*/	
		
	//Title & Line of left bars
	barTilburg.append("text")
		.attr("class", "title")
		.attr("transform", function(d, i) { return "translate(" + -160 + "," + barOffset + ")"; })
		.style("font-size", "12px")
		.style("fill", "#595959")
		.style("text-anchor", "middle")
		.text("% lichte intramurale zorgaanbod");		
	barTilburg.append("line")
		.attr("class", "line")
		.attr("transform", function(d, i) { return "translate(" + -165 + "," + barOffset + ")"; })
		.attr("x1", -70)
		.attr("y1", 5)
		.attr("x2", 70)
		.attr("y2", 5)
		.style("stroke", "#DCDCDC")
		.style("shape-rendering", "crispEdges");	
		
	//Title of right bars
	barTilburg.append("text")
		.attr("class", "title")
		.attr("transform", function(d, i) { return "translate(" + 105 + "," + barOffset + ")"; })
		.style("font-size", "12px")
		.style("fill", "#595959")
		.style("text-anchor", "middle")
		.text("Verdeling van totale intramurale zorgaanbod");	
	barTilburg.append("line")
		.attr("class", "line")
		.attr("transform", function(d, i) { return "translate(" + 105 + "," + barOffset + ")"; })
		.attr("x1", -(barTilburgWidth/4))
		.attr("y1", 5)
		.attr("x2", (barTilburgWidth/4))
		.attr("y2", 5)
		.style("stroke", "#DCDCDC")
		.style("shape-rendering", "crispEdges");			
	///////////////////////////////////////////////////////////////////////////
	////////////////////////////////// Legend /////////////////////////////////
	///////////////////////////////////////////////////////////////////////////	
	
	//Create a wrapper for the bars to the right
	var legendBars = barTilburg.append("g").attr("class", "legendWrapper")
					.attr("transform", "translate(" + (barTilburgWidth/2 - 150) + "," + (barHeight*9) +")");
					
	var legendRectSize = 10,
		legendRectHeight = 15,
		legendText = ["Lichte intramurale zorgaanbod", "Zware intramurale zorgaanbod"];
			  
	//Create container per rect/text pair  
	var legend = legendBars.selectAll('.scatterLegendSquare')  	
			  .data(["#00A1DE","#D4D4D4"])                              
			  .enter().append('g')   
			  .attr('class', 'scatterLegendSquare') 
			  .attr("transform", function(d,i) { return "translate(" + (0) + "," + ((i+2) * legendRectHeight) + ")"; })
			  .style("cursor", "default");
	  
	//Append rectangles to Legend
	legend.append('rect')                                     
		  .attr('width', legendRectSize) 
		  .attr('height', legendRectSize) 			  
		  .attr('transform', 'translate(' + 0 + ',' + 0 + ')') 		  
		  .style('fill', function(d) {return d;});                                 
	//Append text to Legend
	legend.append('text')                                     
		  .attr('transform', 'translate(' + (legendRectSize + 5) + ',' + (legendRectSize/2) + ')')
		  .attr("class", "legendText")
		  .style("text-anchor", "start")
		  .attr("dy", ".30em")
		  //.attr("fill", "#949494")
		  .style("font-size", 10)			  
		  .text(function(d,i) { return legendText[i]; });  

		  
}//drawBarsTilburg

//Mouseover bars and show only that neighbourhood on the map
function overTilburgNeighbourhood(d) {
	var chosen = d;

	mapTilburg.selectAll("path")
			.style("opacity", 0.2)
	mapTilburg.selectAll("path")
			.filter(function(d) { return d.properties.WK_CODE == chosen.WK_CODE;})
			.style("opacity", 1);		
}//showTilburgNeighbourhood

function outTilburgNeighbourhood(d) {

	mapTilburg.selectAll("path")
			.style("opacity", 1);
	
}//showTilburgNeighbourhood
