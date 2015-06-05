//////////////////////////////////////////////////////
/////////////// Draw the Tilburg Map /////////////////
//////////////////////////////////////////////////////

function drawMapTilburg(mapWrapper, colorVar, mapTitle, width, height) {
	
	////////////////////////////////////////////////////////////	
	///////////////////// Initiate Map /////////////////////////
	////////////////////////////////////////////////////////////
	
	// new projection
	var projection = d3.geo.mercator()
						//.center(d3.geo.centroid(wijkenTilburgGeo))
						.center([5.088772,51.569372])
						.scale(90000)
						.translate([(width/2 + 90), (height/2 + 30)]);
	var path = d3.geo.path().projection(projection);

	mapWrapper.selectAll("path")
		.data(wijkenTilburgGeo.features)
		.enter().append("path")
		.attr("d", path)
		.attr("id", function(d) {return d.properties.WK_CODE; })
		//.attr("class", function(d) {return "subunit " + d.properties.GM_CODE; })
		.attr("class", function(d) {return "wijk map"})
		.style("opacity", 1)
		.style("stroke-width", 1)
		.style("stroke", "white")
		.style("fill", function(d) {
			if (WK_CODES[d.properties.WK_CODE] === undefined) {		
				return "#BABABA"; }
			else {return colorTilburgMap(eval("wijkenTilburg[WK_CODES[d.properties.WK_CODE]]." + colorVar));}
		});
		
	//Set up map title
	/*
	mapWrapper.append("g")
		.append("text")
		.attr("class","map title")
		.attr("transform", "translate(" + (width/2) + "," + (-30) + ")")
		.style("text-anchor", "middle")
		.style("fill", "#2B2B2B")
		.style("font-size", 18)
		.attr("x", 0)
		.attr("y", 0)
		.attr("dy", "0.35em")
		.text(mapTitle)
		.call(wrap, 400);*/
	
	//Scale for the zorginstellingen circles on the Tilburg map
	var rScale = d3.scale.linear()
		.range([0,15])
		.domain([0, d3.max(zorginstellingenTilburg, function(d) {return d.ZZP_totaal;})]);
	//Create and plot the zorginstellingen on the tilburg map
	var instellingen = mapWrapper.selectAll(".instellingen")
			.data(zorginstellingenTilburg)
			.enter().append("circle")
				.attr("class", "instellingenCircle")
				.style("fill","#fff")
				.style("opacity", 0.8)
				//.style("stroke","black")
				//.style("stroke-width",2)
				.attr("r", function(d) {return rScale(d.ZZP_totaal);})
				.attr("cx", function(d) {return projection([d.longitude, d.latitude])[0];})
				.attr("cy", function(d) {return projection([d.longitude, d.latitude])[1];})
				.on("mouseover", overTilburgIntstelling)
				.on("mouseout", outTilburgIntstelling);

	//////////////////////////////////////////////////////
	///////////////// Initialize Legend //////////////////
	//////////////////////////////////////////////////////

	//Create a wrapper for the color legend
	var legendcolor = mapWrapper.append("g").attr("class", "legendWrapper")
					.attr("transform", "translate(" + 20 + "," + (height/2 - 130) +")");
					
	createMapTilburgLegend(legendcolor);
					
	//Create a wrapper for the circle legend				
	var legendCircle = mapWrapper.append("g").attr("class", "legendWrapper")
					.attr("transform", "translate(" + 20 + "," + (height/2 + 10) +")");
	
	legendCircle.append("text")
		.attr("class","legendTitle")
		.attr("transform", "translate(" + 0 + "," + -25 + ")")
		.attr("x", 0 + "px")
		.attr("y", 0 + "px")
		.attr("dy", "1em")
		.text("Elke cirkel is een zorginstelling")
		.call(wrap, 80);
	legendCircle.append("circle")
        .attr('r', rScale(300))
        .attr('class',"legendCircle")
        .attr('cx', 0)
        .attr('cy', rScale(300) + 10);
		
	//Create wrapper for the bubble size legend
	var legendBubble = mapWrapper.append("g").attr("class", "legendWrapper")
					.attr("transform", "translate(" + 20 + "," + (height/2 + 100) +")");
	//Initiate and draw the bubble size legend				
	bubbleLegend(legendBubble, rScale, legendSizes = [300, 150, 50], legendName = "Diameter: # zorgplekken per instelling");				
	
}//drawMapTilburg

//Hover over circles representing zorginstellingen
function overTilburgIntstelling(d) {
	var chosen = d;
	
	//Make the hovered over circle brighter and rest lighter
	d3.selectAll(".instellingenCircle")
			.style("opacity", 0.3);
	d3.selectAll(".instellingenCircle")
			.filter(function(d) {return d.ID === chosen.ID;})
			.style("opacity", 1);	

	//Show a popover with the name of the zorg instelling
	$(this).popover({
		placement: 'auto top',
		container: '.dataresource.zzp1_4.tilburg.map',
		trigger: 'manual',
		html : true,
		content: function() { return "<span style='font-size: 11px;'>" + chosen.instellingNaam + "</span>"; }
	});
	$(this).popover('show')
  
}//overIntstelling

//Mouse moves off circle
function outTilburgIntstelling(d) {

	//reset opacity
	d3.selectAll(".instellingenCircle")
			.style("opacity", 0.8);

	$('.popover').each(function() {
		$(this).remove();
	}); 
}//showTilburgNeighbourhood
	
function createMapTilburgLegend(legendWrapper) {
	
	var legendRectSize = 10, //dimensions of the colored square
		legendRectHeight = 15,
		legendMaxWidth = 50; //maximum size that the longest element will be - to center content
						
	//Append title to Legend
	legendWrapper.append('text')                                     
		  .attr('transform', 'translate(' + 0 + ',' + 0 + ')')
		  .attr("x", 0)
		  .attr("y", 0)
		  .attr("dy", "0.35em")
		  .attr("class", "legendTitle")
		  .style("text-anchor", "middle")		  
		  .text("Lage ZZP % t.o.v. de totale zorgcapaciteit")
		  .call(wrap, 100); 
			  
	//Create container per rect/text pair  
	var legend = legendWrapper.selectAll('.scatterLegendSquare')  	
			  .data(colorTilburgMap.range())                              
			  .enter().append('g')   
			  .attr('class', 'scatterLegendSquare') 
			  .attr('width', legendMaxWidth)
			  .attr('height', legendRectHeight)
			  .attr("transform", function(d,i) { return "translate(" + 0 + "," + ((i+2) * legendRectHeight) + ")"; })
			  .style("cursor", "default");
	  
	//Append circles to Legend
	legend.append('rect')                                     
		  .attr('width', legendRectSize) 
		  .attr('height', legendRectSize) 			  
		  .attr('transform', 'translate(' + (-legendMaxWidth/2 - 10) + ',' + 0 + ')') 		  
		  .style('fill', function(d) {return d;});                                 
	//Append text to Legend
	legend.append('text')                                     
		  .attr('transform', 'translate(' + (-legendMaxWidth/2 + 5) + ',' + (legendRectSize/2) + ')')
		  .attr("class", "legendText")
		  .style("text-anchor", "start")
		  .attr("dy", ".30em")
		  //.attr("fill", "#949494")
		  .style("font-size", 10)			  
		  .text(function(d,i) { return colorTilburgNames[i]; });  

}//function createMapTilburgLegend